// js/modal.js
// Fungsi bersama untuk semua pop-up: buka/tutup, validasi form, dan notifikasi.
// Dipakai oleh tambah.js, edit.js, dan hapus.js.

// ---------- Buka dan tutup pop-up ----------

function bukaModal(idModal) {
  const modal = document.getElementById(idModal);
  modal.hidden = false;
  document.body.classList.add("modal-terbuka");

  // Fokus otomatis ke elemen yang ditandai data-fokus
  const sasaran = modal.querySelector("[data-fokus]");
  if (sasaran) sasaran.focus();
}

function tutupModal(idModal) {
  document.getElementById(idModal).hidden = true;

  // Kunci scroll halaman dibuka lagi kalau tidak ada pop-up lain yang terbuka
  if (!document.querySelector(".overlay:not([hidden])")) {
    document.body.classList.remove("modal-terbuka");
  }
}

// Klik tombol dengan atribut data-tutup (tombol X dan Batal) menutup pop-up
document.addEventListener("click", (e) => {
  const tombolTutup = e.target.closest("[data-tutup]");
  const overlay = e.target.closest(".overlay");
  if (tombolTutup && overlay) tutupModal(overlay.id);
});

// Klik pada area gelap di luar kotak pop-up juga menutup pop-up.
// Memakai mousedown agar tidak tertutup saat menyeleksi teks lalu melepas mouse di luar.
document.addEventListener("mousedown", (e) => {
  if (e.target.classList.contains("overlay")) tutupModal(e.target.id);
});

// Tombol Escape menutup semua pop-up yang terbuka
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  document.querySelectorAll(".overlay:not([hidden])").forEach((o) => tutupModal(o.id));
});

// ---------- Validasi form ----------

// Menampilkan atau menghapus pesan error di bawah sebuah input.
// Jika teksError kosong, pesan dikembalikan ke teks bawaan (data-default).
function tampilkanPesan(input, teksError) {
  const pesan = input.closest(".field").querySelector(".pesan");
  const salah = teksError !== "";

  input.classList.toggle("salah", salah);
  pesan.classList.toggle("salah", salah);
  pesan.textContent = salah ? teksError : pesan.dataset.default || "";

  if (salah) {
    input.setAttribute("aria-invalid", "true");
  } else {
    input.removeAttribute("aria-invalid");
  }
}

// Menghapus semua tanda error pada sebuah form (dipanggil saat pop-up dibuka)
function resetPesanForm(form) {
  form.querySelectorAll("input").forEach((input) => tampilkanPesan(input, ""));
}

// Membaca isi form, memvalidasi, dan menampilkan pesan error bila perlu.
// Mengembalikan { nama, harga } jika valid, atau null jika ada yang salah.
function ambilDataForm(inputNama, inputHarga) {
  const nama = inputNama.value.trim();
  const teksHarga = inputHarga.value.trim();
  const harga = Number(teksHarga);

  let errorNama = "";
  let errorHarga = "";

  if (nama === "") {
    errorNama = "Nama produk wajib diisi.";
  }

  if (teksHarga === "" || !Number.isFinite(harga) || harga <= 0) {
    errorHarga = "Harga harus lebih dari 0.";
  } else if (!Number.isSafeInteger(harga)) {
    errorHarga = "Harga harus berupa bilangan bulat.";
  }

  tampilkanPesan(inputNama, errorNama);
  tampilkanPesan(inputHarga, errorHarga);

  if (errorNama) {
    inputNama.focus();
    return null;
  }
  if (errorHarga) {
    inputHarga.focus();
    return null;
  }

  return { nama, harga };
}

// ---------- Notifikasi singkat ----------

let waktuToast;

function tampilToast(teks) {
  const toast = document.getElementById("toast");
  toast.textContent = teks;
  toast.hidden = false;

  clearTimeout(waktuToast);
  waktuToast = setTimeout(() => {
    toast.hidden = true;
  }, 2500);
}
