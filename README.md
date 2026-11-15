# Arz Resolver — Netlify starter

## Isi proyek
- `public/index.html`: antarmuka web.
- `netlify/functions/resolve.mjs`: API utama `/api/resolve`.
- `netlify/functions/sfile.mjs`: pemeriksaan halaman Sfile.
- `netlify/functions/sub2unlock.mjs`: pemeriksaan halaman Sub2Unlock.
- `netlify/functions/redirect.mjs`: helper untuk mengklasifikasikan redirect.
- `netlify/functions/lib/shared.mjs`: validasi URL dan pemeriksaan redirect provider.

## Deploy dari Android
1. Ekstrak ZIP.
2. Upload seluruh isi folder ke repository GitHub (jangan upload ZIP sebagai satu file).
3. Di Netlify pilih **Add new project → Import an existing project**.
4. Hubungkan repository tadi.
5. Build command: kosongkan.
6. Publish directory: `public`.
7. Deploy.

Konfigurasi `netlify.toml` sudah menetapkan direktori Functions dan rewrite `/api/resolve`.

## Batas fungsi
Starter ini hanya memeriksa halaman provider dan redirect HTTP biasa. Ia tidak mengambil tautan tersembunyi di balik syarat akses, dan tidak melewati iklan, CAPTCHA, login, pembayaran, atau tugas unlock. Jika halaman meminta verifikasi, pengguna harus menyelesaikannya pada situs resmi.
