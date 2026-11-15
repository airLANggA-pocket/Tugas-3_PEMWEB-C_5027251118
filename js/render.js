// js/render.js
// Menampilkan daftar produk sebagai kartu di halaman.

// "5000" -> "Rp5.000"
function formatRupiah(angka) {
  return "Rp" + angka.toLocaleString("id-ID");
}

// Membuat elemen HTML dengan teks aman (textContent, bukan innerHTML)
function buatElemen(tag, kelas, teks) {
  const elemen = document.createElement(tag);
  if (kelas) elemen.className = kelas;
  if (teks !== undefined) elemen.textContent = teks;
  return elemen;
}

// Membuat tombol di dalam kartu. data-aksi dan data-id dipakai oleh
// edit.js dan hapus.js untuk mengetahui tombol mana yang diklik.
function buatTombolAksi(teks, kelas, aksi, id) {
  const tombol = buatElemen("button", "tombol tombol-kecil " + kelas, teks);
  tombol.type = "button";
  tombol.dataset.aksi = aksi;
  tombol.dataset.id = id;
  return tombol;
}

function buatKartu(produk) {
  const kartu = buatElemen("article", "kartu");
  kartu.append(
    buatElemen("span", "id-produk", "ID: " + produk.id),
    buatElemen("h3", "nama-produk", produk.nama),
    buatElemen("p", "harga-produk", formatRupiah(produk.harga)),
  );

  const aksi = buatElemen("div", "aksi-kartu");
  aksi.append(
    buatTombolAksi("Edit", "tombol-garis", "edit", produk.id),
    buatTombolAksi("Hapus", "tombol-garis-bahaya", "hapus", produk.id),
  );
  kartu.append(aksi);

  return kartu;
}

// Menggambar ulang seluruh daftar. Dipanggil setiap data atau kata kunci berubah.
function renderProduk() {
  const kataKunci = document.getElementById("cari").value.trim();
  const hasil = daftarProduk.filter((p) =>
    p.nama.toLowerCase().includes(kataKunci.toLowerCase()),
  );

  const grid = document.getElementById("daftar-produk");
  grid.replaceChildren();

  if (hasil.length === 0) {
    const pesan =
      daftarProduk.length === 0
        ? "Belum ada produk. Klik \"Tambah Produk\" untuk menambahkan."
        : "Tidak ada produk yang cocok dengan \"" + kataKunci + "\".";
    grid.append(buatElemen("p", "kosong", pesan));
  } else {
    hasil.forEach((produk) => grid.append(buatKartu(produk)));
  }

  document.getElementById("jumlah-produk").textContent = daftarProduk.length + " produk";
  document.getElementById("info-tampil").textContent =
    "Menampilkan " + hasil.length + " dari " + daftarProduk.length + " produk";
}

renderProduk();

  <script src="js/search.js"></script>