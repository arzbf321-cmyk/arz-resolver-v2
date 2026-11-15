import { PROVIDERS, inspectProvider } from "./lib/shared.mjs";

export async function inspectSfile(url) {
  const result = await inspectProvider(url, PROVIDERS.sfile);
  return {
    provider: "Sfile",
    ...result,
    note: "Resolver memeriksa halaman dan redirect biasa. Jika Sfile meminta verifikasi atau langkah unduhan, selesaikan melalui halaman resmi."
  };
}
