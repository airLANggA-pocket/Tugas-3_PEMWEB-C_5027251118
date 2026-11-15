// js/search.js
// Pencarian produk berdasarkan nama (huruf besar/kecil tidak berpengaruh).
// Penyaringan sebenarnya dilakukan di renderProduk() pada render.js,
// file ini hanya memanggilnya setiap kali isi kolom pencarian berubah.

(() => {
  document.getElementById("cari").addEventListener("input", renderProduk);
})();

  <script src="js/modal.js"></script>
  <script src="js/tambah.js"></script>