// js/edit.js
// Fitur Edit Produk.

(() => {
  const form = document.getElementById("form-edit");
  const labelId = document.getElementById("edit-id");
  const inputNama = document.getElementById("edit-nama");
  const inputHarga = document.getElementById("edit-harga");

  // ID produk yang sedang diedit
  let idDiedit = null;

  // Tombol "Edit" di kartu. Satu listener di daftar menangani semua kartu,
  // termasuk kartu yang baru ditambahkan (event delegation).
  document.getElementById("daftar-produk").addEventListener("click", (e) => {
    const tombol = e.target.closest('[data-aksi="edit"]');
    if (!tombol) return;

    const produk = cariProduk(tombol.dataset.id);
    if (!produk) return;

    idDiedit = produk.id;
    resetPesanForm(form);
    labelId.textContent = "ID: " + produk.id;
    inputNama.value = produk.nama;
    inputHarga.value = produk.harga;
    bukaModal("modal-edit");
  });

  // Tombol "Simpan Perubahan"
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = ambilDataForm(inputNama, inputHarga);
    if (!data) return;

    const produk = cariProduk(idDiedit);
    if (!produk) {
      tutupModal("modal-edit");
      return;
    }

    produk.nama = data.nama;
    produk.harga = data.harga;

    renderProduk();
    tutupModal("modal-edit");
    tampilToast("Produk \"" + data.nama + "\" berhasil diperbarui.");
  });
})();

  <script src="js/hapus.js"></script>