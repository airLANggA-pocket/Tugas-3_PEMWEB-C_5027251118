// js/hapus.js
// Fitur Hapus Produk (dengan pop-up konfirmasi).

(() => {
  const labelId = document.getElementById("hapus-id");
  const labelNama = document.getElementById("hapus-nama");
  const labelHarga = document.getElementById("hapus-harga");

  // ID produk yang akan dihapus
  let idDihapus = null;

  // Tombol "Hapus" di kartu: tampilkan pop-up konfirmasi, belum menghapus apa pun
  document.getElementById("daftar-produk").addEventListener("click", (e) => {
    const tombol = e.target.closest('[data-aksi="hapus"]');
    if (!tombol) return;

    const produk = cariProduk(tombol.dataset.id);
    if (!produk) return;

    idDihapus = produk.id;
    labelId.textContent = "ID: " + produk.id;
    labelNama.textContent = produk.nama;
    labelHarga.textContent = formatRupiah(produk.harga);
    bukaModal("modal-hapus");
  });

  // Tombol "Hapus Produk" di pop-up: baru di sini data benar-benar dihapus
  document.getElementById("btn-konfirmasi-hapus").addEventListener("click", () => {
    const posisi = daftarProduk.findIndex((p) => p.id === idDihapus);
    if (posisi === -1) {
      tutupModal("modal-hapus");
      return;
    }

    const [dihapus] = daftarProduk.splice(posisi, 1);

    renderProduk();
    tutupModal("modal-hapus");
    tampilToast("Produk \"" + dihapus.nama + "\" berhasil dihapus.");
  });
})();
