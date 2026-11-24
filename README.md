# Absensi Pegawai — Perumda Air Minum Amerta Dayan Gunung

Aplikasi absensi pegawai (foto + GPS) yang dibuka di **https://absen.adayangunung.workers.dev**.

## Gambaran singkat (analogi rumah makan)

| Bagian | Analogi | Tempatnya | Cara mengubah |
|---|---|---|---|
| `public/` di repo ini | **Etalase / pintu depan** | Cloudflare | Ubah file di GitHub → Cloudflare otomatis memasang ulang (±1 menit) |
| Tampilan & logika aplikasi (`Index.html`, `*.gs`) | **Dapur** | Google Apps Script | Edit di editor Apps Script → **Deploy → Manage deployments → Edit → New version** |
| Data (pegawai, absensi, lokasi, libur) | **Gudang** | Google Sheet "DB Absensi" | Lewat menu admin aplikasi |

Etalase (repo ini) jarang berubah. Hampir semua perubahan tampilan dan aturan absen dilakukan di **Apps Script**, bukan di sini.

## Isi folder `public/`

- `index.html` — etalase: mengambil tampilan dari Apps Script lalu meneruskan semua panggilan server ke `API_URL`.
- `sw.js` — service worker (syarat PWA). **Naikkan nomor `CACHE`** (mis. `v2` → `v3`) setiap kali file di `public/` diubah.
- `manifest.webmanifest` — nama + ikon aplikasi untuk "Tambahkan ke layar utama".
- `_headers` — aturan cache Cloudflare.
- `icon-*.png`, `apple-touch-icon.png` — ikon.

## Aturan penting

1. **Satu pintu masuk.** Pegawai hanya memakai `https://absen.adayangunung.workers.dev`. Link lama `/exec` sudah ditutup (menampilkan halaman "Aplikasi sudah pindah"). Darurat: `/exec?hal=darurat`.
2. **`API_URL` di `public/index.html`** = alamat `/exec` Apps Script. Hanya diganti bila membuat *deployment baru* (bukan "New version").
3. **Fungsi server baru** yang dipanggil dari `Index.html` wajib ditambahkan ke daftar `API_FN` di `Api.gs`, kalau tidak aplikasi menolak.
4. **Deploy Apps Script** dilakukan dari akun `adayangunung@gmail.com` (pemilik folder foto).
5. **Jangan dua orang mengedit Apps Script bersamaan** — simpanan yang satu bisa menimpa yang lain.

## Alur kerja untuk tim

```
ubah file di GitHub (langsung di web, atau lewat branch + Pull Request)
        ↓ otomatis
Cloudflare build & deploy (wrangler.jsonc)
        ↓
https://absen.adayangunung.workers.dev ter-update
```
