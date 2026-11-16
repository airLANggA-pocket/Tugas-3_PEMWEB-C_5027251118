import React, { useCallback, useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:4000/api/products";

const dariApi = (produk) => ({ id: produk.id, nama: produk.name, harga: produk.price });

async function permintaanApi(url = API_URL, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const hasil = await response.json();
  if (!response.ok) throw new Error(hasil.message || "Permintaan ke server gagal.");
  return hasil;
}

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
  const [produk, setProduk] = useState([]);
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [errorServer, setErrorServer] = useState("");
  const [kataKunci, setKataKunci] = useState("");
  const [formProduk, setFormProduk] = useState(undefined);
  const [produkDihapus, setProdukDihapus] = useState(null);
  const [toast, setToast] = useState("");

  const muatProduk = useCallback(async () => {
    setSedangMemuat(true);
    try {
      const hasil = await permintaanApi();
      setProduk((hasil.data || []).map(dariApi));
      setErrorServer("");
    } catch (error) {
      setErrorServer(error.message);
    } finally {
      setSedangMemuat(false);
    }
  }, []);

  useEffect(() => {
    muatProduk();
  }, [muatProduk]);

  const hasilPencarian = useMemo(
    () => produk.filter((item) => item.nama.toLowerCase().includes(kataKunci.trim().toLowerCase())),
    [produk, kataKunci],
  );

  function beriNotifikasi(pesan) {
    setToast(pesan);
    window.clearTimeout(beriNotifikasi.timer);
    beriNotifikasi.timer = window.setTimeout(() => setToast(""), 2500);
  }

  async function simpanProduk(data) {
    try {
      const mengedit = Boolean(formProduk);
      const hasil = await permintaanApi(
        mengedit ? `${API_URL}/${formProduk.id}` : API_URL,
        {
          method: mengedit ? "PUT" : "POST",
          body: JSON.stringify({ name: data.nama, price: data.harga }),
        },
      );
      if (mengedit) {
        setProduk((daftar) => daftar.map((item) => item.id === formProduk.id ? dariApi(hasil.data) : item));
      } else {
        setProduk((daftar) => [...daftar, dariApi(hasil.data)]);
      }
      setErrorServer("");
      beriNotifikasi(hasil.message);
      setFormProduk(undefined);
    } catch (error) {
      beriNotifikasi(error.message);
    }
  }

  async function hapusProduk() {
    try {
      const hasil = await permintaanApi(`${API_URL}/${produkDihapus.id}`, { method: "DELETE" });
      setProduk((daftar) => daftar.filter((item) => item.id !== produkDihapus.id));
      setErrorServer("");
      beriNotifikasi(hasil.message);
      setProdukDihapus(null);
    } catch (error) {
      beriNotifikasi(error.message);
    }
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
          {errorServer ? <div className="kosong">Gagal memuat produk dari server. {errorServer} Pastikan backend berjalan pada port 4000.<br /><button type="button" className="tombol tombol-garis" onClick={muatProduk}>Coba lagi</button></div>
            : sedangMemuat ? <p className="kosong">Memuat produk...</p>
            : hasilPencarian.length ? hasilPencarian.map((item) => (
            <ProductCard key={item.id} produk={item} onEdit={setFormProduk} onDelete={setProdukDihapus} />
          )) : (
            <p className="kosong">
              {produk.length === 0 ? 'Belum ada produk. Klik "Tambah Produk" untuk menambahkan.' : `Tidak ada produk yang cocok dengan "${kataKunci}".`}
            </p>
          )}
        </section>
        <p className="info-tampil">Menampilkan {sedangMemuat || errorServer ? 0 : hasilPencarian.length} dari {produk.length} produk</p>
      </main>
      {formProduk !== undefined && <ProductFormModal produk={formProduk} onClose={() => setFormProduk(undefined)} onSave={simpanProduk} />}
      {produkDihapus && <DeleteModal produk={produkDihapus} onClose={() => setProdukDihapus(null)} onConfirm={hapusProduk} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}



