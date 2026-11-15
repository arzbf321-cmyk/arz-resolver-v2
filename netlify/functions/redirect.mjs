/*
 * This helper only classifies a URL. It deliberately does not fetch arbitrary
 * destination hosts, which avoids turning the function into an open proxy.
 */
export function describeRedirect(destination) {
  try {
    const url = new URL(destination);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    return { destination: url.href, external: true };
  } catch {
    return null;
  }
}
