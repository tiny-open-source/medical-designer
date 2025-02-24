// clean url ending if it with /
export function cleanUrl(url: string) {
  if (url.endsWith('/')) {
    return url.slice(0, -1);
  }
  return url;
}
