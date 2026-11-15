export const PROVIDERS = {
  sfile: new Set(["sfile.co", "www.sfile.co", "sfile.mobi", "www.sfile.mobi"]),
  sub2unlock: new Set(["sub2unlock.com", "www.sub2unlock.com", "sub2unlock.io", "www.sub2unlock.io"])
};

export function json(data, statusCode = 200) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    },
    body: JSON.stringify(data)
  };
}

export function parseAndValidateUrl(raw) {
  if (typeof raw !== "string" || raw.length > 2048) {
    throw new Error("URL tidak valid atau terlalu panjang.");
  }
  let url;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new Error("Masukkan URL lengkap, termasuk https://");
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Hanya URL HTTP/HTTPS yang didukung.");
  }
  if (url.username || url.password) {
    throw new Error("URL dengan username/password tidak diizinkan.");
  }
  if (url.port && !["80", "443"].includes(url.port)) {
    throw new Error("Port khusus tidak didukung.");
  }
  return url;
}

export function providerFor(hostname) {
  if (PROVIDERS.sfile.has(hostname)) return "sfile";
  if (PROVIDERS.sub2unlock.has(hostname)) return "sub2unlock";
  return null;
}

export function getTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 180) : "";
}

/*
 * Fetch only the known provider page. Redirects are inspected manually:
 * an external Location is returned to the browser, never fetched by the function.
 */
export async function inspectProvider(url, providerHosts) {
  let current = new URL(url);
  for (let hop = 0; hop < 6; hop++) {
    if (!providerHosts.has(current.hostname)) {
      return { externalRedirect: current.href };
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);
    let response;
    try {
      response = await fetch(current.href, {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: { "user-agent": "ArzResolver/2.0 (link inspection)" }
      });
    } finally {
      clearTimeout(timeout);
    }

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) return { status: response.status, pageUrl: current.href };
      const next = new URL(location, current);
      if (!providerHosts.has(next.hostname)) {
        return { externalRedirect: next.href, status: response.status };
      }
      current = next;
      continue;
    }

    const contentType = response.headers.get("content-type") || "";
    let title = "";
    if (contentType.includes("text/html")) {
      const html = await response.text();
      title = getTitle(html);
    }
    return {
      status: response.status,
      pageUrl: current.href,
      title,
      contentType,
      accessStatus: response.status === 200
        ? "Halaman dapat dibuka. Selesaikan persyaratan situs jika masih diminta."
        : "Situs mengembalikan status selain 200."
    };
  }
  throw new Error("Terlalu banyak pengalihan URL.");
}

