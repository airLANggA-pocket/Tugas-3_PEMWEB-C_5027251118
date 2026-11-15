// js/data.js
// Data produk disimpan di dalam array (di memori browser).
// Kalau halaman di-refresh, data kembali ke data awal ini.

const daftarProduk = [
  { id: 1, nama: "Pulpen", harga: 5000 },
  { id: 2, nama: "Buku Tulis", harga: 12000 },
  { id: 3, nama: "Spidol", harga: 8000 },
  { id: 4, nama: "Penggaris", harga: 6000 },
  { id: 5, nama: "Penghapus", harga: 3000 },
];

// ID untuk produk baru. Tidak dipakai ulang walau ada produk yang dihapus.
let idBerikutnya = 6;

// Mencari satu produk berdasarkan id-nya (undefined jika tidak ada)
function cariProduk(id) {
  return daftarProduk.find((p) => p.id === Number(id));
}