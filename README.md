# Tugas 3 – Manajemen Produk Koperasi

Aplikasi frontend React untuk mengelola produk ATK koperasi. Tampilan mengikuti mockup tugas: daftar produk, pencarian, serta pop-up tambah, edit, dan hapus. Data dibaca dan disimpan melalui REST API pada repository backend Tugas-3-BE.

## Menjalankan aplikasi

Jalankan backend terlebih dahulu pada terminal pertama:

```bash
cd Tugas-3-BE_PEMWEB-C_5027251118
npm install
npm run dev
```

Backend berjalan pada `http://localhost:4000` dengan pemeriksaan status di `/health` dan API produk di `/api/products`.

Jalankan frontend pada terminal kedua:

```bash
cd Tugas-3_PEMWEB-C_5027251118
npm install
npm run dev
```

Buka alamat Vite yang tercetak di terminal (umumnya `http://localhost:5173`). Jangan membuka port backend sebagai halaman website; backend hanya menyediakan JSON.

## Fitur

- Menampilkan lima produk awal.
- Mencari produk berdasarkan nama.
- Menambah produk dengan validasi nama dan harga.
- Mengedit produk yang dipilih.
- Menghapus produk dengan konfirmasi.
- Menampilkan jumlah produk dan notifikasi hasil aksi.

Frontend mengirim `GET`, `POST`, `PUT`, dan `DELETE` ke `http://localhost:4000/api/products`. Backend menyimpan data pada berkas JSON di folder `data`.

## Bukti pengujian

Jalankan kedua server, lalu uji daftar, pencarian, tambah, validasi input, edit, dan hapus dari browser. Lampirkan screenshot hasil aktual pada Pull Request.
