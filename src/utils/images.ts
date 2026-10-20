const LEGACY_PREFIX = '/src/assets/images/';
const PUBLIC_PREFIX = '/images/';
const FALLBACK = '/images/villa_glass_architecture_1792504953976.jpg';

export function resolveImageUrl(url?: string): string {
  if (!url) return FALLBACK;
  if (url.startsWith(LEGACY_PREFIX)) {
    return PUBLIC_PREFIX + url.slice(LEGACY_PREFIX.length);
  }
  return url;
}

export function resolveImageUrls(urls?: string[]): string[] {
  if (!urls || urls.length === 0) return [FALLBACK];
  return urls.map(resolveImageUrl);
}
