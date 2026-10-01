# FCM Account Valuator

Web estimator akun FC Mobile, siap di-deploy ke GitHub Pages/Vercel.

## Fitur
- Upload & preview screenshot
- Form data OVR, level, rank, coins, gems, Ikonik/Legend, pemain event
- Penilaian kondisi GK/DEF/MID/ATT
- Estimasi kisaran harga
- Kelebihan, kekurangan, rekomendasi upgrade
- Responsive untuk HP
- Dark/light mode
- Tanpa backend

## Penting
Versi ini **belum membaca isi screenshot secara otomatis**. Upload foto dipakai untuk preview; angka dianalisis dari data yang kamu masukkan. Ini sengaja dibuat agar bisa langsung jalan tanpa API key.

Jika ingin versi berikutnya benar-benar membaca OVR/pemain dari screenshot, tambahkan OCR/vision backend/API dan model harga yang mengambil data pasar terbaru.

## Deploy ke Vercel
1. Upload folder ini ke GitHub.
2. Di Vercel pilih **Add New → Project**.
3. Import repository.
4. Framework: Other / static.
5. Build command kosong.
6. Output directory: `.`.
7. Deploy.

## Local
Bisa dibuka langsung dengan `index.html`, atau pakai server statis sederhana.
