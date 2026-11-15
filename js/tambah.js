// js/tambah.js
// Fitur Tambah Produk.

(() => {
  const form = document.getElementById("form-tambah");
  const inputNama = document.getElementById("tambah-nama");
  const inputHarga = document.getElementById("tambah-harga");

  // Tombol "Tambah Produk" di pojok kanan atas: buka pop-up dengan form kosong
  document.getElementById("btn-tambah").addEventListener("click", () => {
    form.reset();
    resetPesanForm(form);
    bukaModal("modal-tambah");
  });

  // Tombol "Simpan Produk" (atau tekan Enter di dalam form)
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = ambilDataForm(inputNama, inputHarga);
    if (!data) return; // ada input yang salah, pesan error sudah ditampilkan

    daftarProduk.push({ id: idBerikutnya++, nama: data.nama, harga: data.harga });

    renderProduk();
    tutupModal("modal-tambah");
    tampilToast("Produk \"" + data.nama + "\" berhasil ditambahkan.");
  });
})();

  <script src="js/edit.js"></script>