import { defineManifest } from "@crxjs/vite-plugin"
import ManifestConfig from "./manifest.config"

// @ts-expect-error ManifestConfig provides all required fields
export default defineManifest((env) => ({
  ...ManifestConfig,
  key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAipK6etecdRABGx9Zk2cN+UxDNwTVZTpLDPK3sVMyXZC76C+kgnGm34W1T34GGOVQJIuH5osLSNwJYJNo9r8Zf0iWh1F2AgVyQ4LPpHNoDTGD1+pK2mEzy25D878QKbPg5LFR9KDR9ZBGzB9rABCNAkRjbhlG//nhjYxl8fJyaJlKdLb7XFS5+TIBuwiv3q0bTwZuTlwXC7FBOksEybF1y4JqpmPNZnJxJtfrje0quumbNDCvl7TkKvgETWNW1xYqjzQ99qQ4rHci15pt0qp/CO3YZYClPOdPRKKH5CDQv+gZ1zviIUa2Wipmyh+u+SYwONbDIE+IgZvTkH2BZ2WxYwIDAQAB",
  // oauth2: {
  //   client_id:
  //     "969503803446-b64k8hqu2hhtofgp0lfbjaf0g1sudkj5.apps.googleusercontent.com",
  //   scopes: ["openid", "profile", "email"],
  // },
}))
