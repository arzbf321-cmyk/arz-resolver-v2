import { PROVIDERS, inspectProvider } from "./lib/shared.mjs";

export async function inspectSub2Unlock(url) {
  const result = await inspectProvider(url, PROVIDERS.sub2unlock);
  return {
    provider: "Sub2Unlock",
    ...result,
    note: "Resolver memeriksa halaman dan redirect biasa. Jika masih ada syarat unlock, selesaikan melalui situs resmi; resolver tidak melewati iklan, CAPTCHA, login, atau tugas unlock."
  };
}
