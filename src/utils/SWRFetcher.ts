// reusable fetcher
// also https://swr.vercel.app/docs/arguments#multiple-arguments
export const fetcher = (url: string, token: string | null) =>
  fetch(
    url,
    // add Authorization header if token is present
    token
      ? {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      : {
          headers: {
            'Content-Type': 'application/json'
          }
        }
  ).then((res) => res.json());
