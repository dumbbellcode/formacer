export function getAuthToken(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: false }, function (token) {
      if (!token) {
        // Try again with interactive mode
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
          if (!token) {
            resolve(null)
          } else {
            resolve(token as string)
          }
        })
      } else {
        resolve(token as string)
      }
    })
  })
}

export function getAuthTokenQuick(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: false }, function (token) {
      if (!token) {
        resolve(null)
      } else {
        resolve(token as string)
      }
    })
  })
}

interface UserInfoApiResp {
  sub: string
  name: string
  given_name: string
  family_name: string
  email: string
}

interface ServerLoginResp {
  token: string,
  user: UserInfoApiResp
}

export async function fetchUserInfo(
  token: string,
): Promise<UserInfoApiResp | null> {
  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      },
    )

    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText)
    }

    return (await response.json()) as UserInfoApiResp
    // userInfo will contain name and email
  } catch (error) {
    console.error("Error fetching user info:", error)
    return null
  }
}

export async function serverLogin(googleAuthToken: string): Promise<ServerLoginResp | null> {
  try {
    const API_URL = import.meta.env.VITE_API_URL
    const ROUTE = `${API_URL}/api/login`
    const response = await fetch(
      ROUTE,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          googleAccessToken: googleAuthToken,
        }),
      },
    )
    return await response.json() as ServerLoginResp
  } catch (error) {
    return null
  } 
}

// Define a type for HTTP status codes
type HttpStatusCode = 
  | 200 // OK
  | 201 // Created
  | 204 // No Content
  | 400 // Bad Request
  | 401 // Unauthorized
  | 403 // Forbidden
  | 404 // Not Found
  | 500 // Internal Server Error
  | 502 // Bad Gateway
  | 503 // Service Unavailable;
  | 429 // Rate limit

// Define the mapping of status codes to messages
export const StatusCodeMessageMap: Record<number, string> = {
  401: 'Please log in again',
  429: 'Too many requests, please try after few seconds',
  503: 'Server down, please try after sometime'
};

export function getMessageForStatusCode(code: number) {
  return StatusCodeMessageMap[code] ?? 'Something went wrong, please try after sometime'
}
