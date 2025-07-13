export const YT_PLAYLIST_LINK =
  "https://youtube.com/playlist?list=PL8YcSv7Sv1j6VktLuqks4YMkbO0fK2Eow&si=2FPQnkpb5ujAtIEg"

export function isDevelopmentEnv() {
  return import.meta.env.MODE === "development"
}

export function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;

  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}
