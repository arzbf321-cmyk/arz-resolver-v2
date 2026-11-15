import { json, parseAndValidateUrl, providerFor } from "./lib/shared.mjs";
import { inspectSfile } from "./sfile.mjs";
import { inspectSub2Unlock } from "./sub2unlock.mjs";

export default async (request) => {
  if (request.method !== "POST") {
    return json({ status: "error", message: "Gunakan metode POST." }, 405);
  }

  try {
    const body = await request.json();
    const url = parseAndValidateUrl(body?.url);
    const provider = providerFor(url.hostname);

    if (!provider) {
      return json({
        status: "error",
        message: "Domain belum didukung. Saat ini hanya Sfile dan Sub2Unlock."
      }, 400);
    }

    const result = provider === "sfile"
      ? await inspectSfile(url)
      : await inspectSub2Unlock(url);

    return json({ status: "success", result });
  } catch (error) {
    const message = error?.name === "AbortError"
      ? "Permintaan ke situs terlalu lama."
      : (error?.message || "Terjadi kesalahan saat memproses URL.");
    return json({ status: "error", message }, 400);
  }
};

