import { useMemo, useState } from "react";

const produkAwal = [
  { id: 1, nama: "Pulpen", harga: 5000 },
  { id: 2, nama: "Buku Tulis", harga: 12000 },
  { id: 3, nama: "Spidol", harga: 8000 },
  { id: 4, nama: "Penggaris", harga: 6000 },
  { id: 5, nama: "Penghapus", harga: 3000 },
];

const rupiah = (angka) => `Rp${angka.toLocaleString("id-ID")}`;

function ProductCard({ produk, onEdit, onDelete }) {
  return (
    <article className="kartu">
      <span className="id-produk">ID: {produk.id}</span>
      <h3 className="nama-produk">{produk.nama}</h3>
      <p className="harga-produk">{rupiah(produk.harga)}</p>
      <div className="aksi-kartu">
        <button className="tombol tombol-kecil tombol-garis" onClick={() => onEdit(produk)}>Edit</button>
        <button className="tombol tombol-kecil tombol-garis-bahaya" onClick={() => onDelete(produk)}>Hapus</button>
      </div>
    </article>
  );
}

function ProductFormModal({ produk, onClose, onSave }) {
  const [nama, setNama] = useState(produk?.nama ?? "");
  const [harga, setHarga] = useState(produk?.harga?.toString() ?? "");
  const [errorNama, setErrorNama] = useState("");
  const [errorHarga, setErrorHarga] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const namaBersih = nama.trim();
    const nilaiHarga = Number(harga);
    const namaError = namaBersih ? "" : "Nama produk wajib diisi.";
    let hargaError = "";

    if (!harga.trim() || !Number.isFinite(nilaiHarga) || nilaiHarga <= 0) {
      hargaError = "Harga harus lebih dari 0.";
    } else if (!Number.isSafeInteger(nilaiHarga)) {
      hargaError = "Harga harus berupa bilangan bulat.";
    }

    setErrorNama(namaError);
    setErrorHarga(hargaError);
    if (!namaError && !hargaError) onSave({ nama: namaBersih, harga: nilaiHarga });
  }

  return (
    <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="judul-form">
        <button type="button" className="tutup" onClick={onClose} aria-label="Tutup">×</button>
        <h2 id="judul-form">{produk ? "Edit Produk" : "Tambah Produk"}</h2>
        <p className="deskripsi">{produk ? "Perbarui informasi produk yang dipilih." : "Masukkan informasi produk baru."}</p>
        {produk && <p className="id-produk">ID: {produk.id}</p>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="nama-produk">Nama Produk</label>
            <input id="nama-produk" value={nama} onChange={(event) => setNama(event.target.value)} placeholder="Contoh: Pulpen" maxLength="60" autoFocus />
            <small className={errorNama ? "pesan salah" : "pesan"}>{errorNama}</small>
          </div>
          <div className="field">
            <label htmlFor="harga-produk">Harga (Rp)</label>
            <input id="harga-produk" type="number" min="1" step="1" inputMode="numeric" value={harga} onChange={(event) => setHarga(event.target.value)} placeholder="Contoh: 5000" />
            <small className={errorHarga ? "pesan salah" : "pesan"}>{errorHarga || "Harga harus lebih dari 0."}</small>
          </div>
          <div className="aksi">
            <button type="button" className="tombol tombol-garis" onClick={onClose}>Batal</button>
            <button type="submit" className="tombol tombol-utama">{produk ? "Simpan Perubahan" : "Simpan Produk"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function DeleteModal({ produk, onClose, onConfirm }) {
  return (
    <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal modal-tengah" role="alertdialog" aria-modal="true" aria-labelledby="judul-hapus">
        <button type="button" className="tutup" onClick={onClose} aria-label="Tutup">×</button>
        <div className="ikon-bahaya" aria-hidden="true">⌫</div>
        <h2 id="judul-hapus">Hapus Produk?</h2>
        <p className="deskripsi">Produk yang dihapus tidak dapat dikembalikan.</p>
        <div className="ringkasan">
          <span className="id-produk">ID: {produk.id}</span>
          <strong className="nama-produk">{produk.nama}</strong>
          <span className="harga-produk">{rupiah(produk.harga)}</span>
        </div>
        <div className="aksi">
          <button type="button" className="tombol tombol-garis" onClick={onClose}>Batal</button>
          <button type="button" className="tombol tombol-bahaya" onClick={onConfirm}>Hapus Produk</button>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [produk, setProduk] = useState(produkAwal);
  const [kataKunci, setKataKunci] = useState("");
  const [formProduk, setFormProduk] = useState(undefined);
  const [produkDihapus, setProdukDihapus] = useState(null);
  const [toast, setToast] = useState("");

  const hasilPencarian = useMemo(
    () => produk.filter((item) => item.nama.toLowerCase().includes(kataKunci.trim().toLowerCase())),
    [produk, kataKunci],
  );

  function beriNotifikasi(pesan) {
    setToast(pesan);
    window.clearTimeout(beriNotifikasi.timer);
    beriNotifikasi.timer = window.setTimeout(() => setToast(""), 2500);
  }

  function simpanProduk(data) {
    if (formProduk) {
      setProduk((daftar) => daftar.map((item) => item.id === formProduk.id ? { ...item, ...data } : item));
      beriNotifikasi(`Produk "${data.nama}" berhasil diperbarui.`);
    } else {
      const idBaru = Math.max(0, ...produk.map((item) => item.id)) + 1;
      setProduk((daftar) => [...daftar, { id: idBaru, ...data }]);
      beriNotifikasi(`Produk "${data.nama}" berhasil ditambahkan.`);
    }
    setFormProduk(undefined);
  }

  function hapusProduk() {
    setProduk((daftar) => daftar.filter((item) => item.id !== produkDihapus.id));
    beriNotifikasi(`Produk "${produkDihapus.nama}" berhasil dihapus.`);
    setProdukDihapus(null);
  }

  return (
    <>
      <main className="wadah">
        <header className="kepala">
          <div>
            <h1>Manajemen Produk</h1>
            <p className="subjudul">Kelola daftar produk dan harga dalam satu tempat.</p>
          </div>
          <button type="button" className="tombol tombol-utama" onClick={() => setFormProduk(null)}><span aria-hidden="true">＋</span> Tambah Produk</button>
        </header>
        <section className="bar-cari">
          <label className="kolom-cari">
            <span aria-hidden="true">⌕</span>
            <input type="search" placeholder="Cari nama produk..." value={kataKunci} onChange={(event) => setKataKunci(event.target.value)} aria-label="Cari nama produk" />
          </label>
          <span className="jumlah">{produk.length} produk</span>
        </section>
        <section className="grid" aria-live="polite">
          {hasilPencarian.length ? hasilPencarian.map((item) => (
            <ProductCard key={item.id} produk={item} onEdit={setFormProduk} onDelete={setProdukDihapus} />
          )) : (
            <p className="kosong">
              {produk.length === 0 ? 'Belum ada produk. Klik "Tambah Produk" untuk menambahkan.' : `Tidak ada produk yang cocok dengan "${kataKunci}".`}
            </p>
          )}
        </section>
        <p className="info-tampil">Menampilkan {hasilPencarian.length} dari {produk.length} produk</p>
      </main>
      {formProduk !== undefined && <ProductFormModal produk={formProduk} onClose={() => setFormProduk(undefined)} onSave={simpanProduk} />}
      {produkDihapus && <DeleteModal produk={produkDihapus} onClose={() => setProdukDihapus(null)} onConfirm={hapusProduk} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
