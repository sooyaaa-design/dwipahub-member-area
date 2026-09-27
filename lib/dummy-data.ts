// TODO: ganti dengan data asli — seluruh isi file ini adalah data dummy
// untuk melengkapi tampilan sebelum backend (progress, marketplace, AI,
// billing) dibangun.

export type Lesson = {
  id: string;
  judul: string;
  durasi: string | null;
  selesai: boolean;
};

// TODO: ganti dengan data asli (tabel classes + progress belajar member)
export const DUMMY_LESSONS: Lesson[] = [
  { id: "dummy-1", judul: "Pengenalan Materi & Tujuan Kelas", durasi: "08:45", selesai: true },
  { id: "dummy-2", judul: "Regulasi dan Perizinan PPIU", durasi: "18:05", selesai: true },
  { id: "dummy-3", judul: "Menyusun Paket dan Struktur Harga", durasi: "21:40", selesai: true },
  { id: "dummy-4", judul: "Kerja Sama dengan Provider & Maskapai", durasi: "15:10", selesai: false },
  { id: "dummy-5", judul: "Manajemen Keberangkatan Jamaah", durasi: "19:55", selesai: false },
  { id: "dummy-6", judul: "Evaluasi dan Layanan Purna Umroh", durasi: "10:20", selesai: false },
];

// TODO: ganti dengan data asli (ringkasan materi per pelajaran)
export const DUMMY_MATERI = {
  ringkasan:
    "Pada pelajaran ini kamu akan mempelajari langkah praktis yang bisa langsung diterapkan di bisnis travel umroh-mu.",
  poin: [
    "Konsep utama dan istilah yang wajib dipahami",
    "Contoh kasus dari travel yang sudah berjalan",
    "Checklist yang bisa langsung dipakai tim",
  ],
};

// TODO: ganti dengan data asli (tabel diskusi per kelas)
export const DUMMY_DISKUSI = [
  { id: "d1", nama: "Ustadz Hanif", waktu: "2 hari lalu", isi: "Untuk perizinan PPIU, apakah bisa diurus paralel dengan akta perusahaan?" },
  { id: "d2", nama: "Mentor DwipaHub", waktu: "1 hari lalu", isi: "Bisa, tapi pastikan NIB sudah terbit dulu sebelum mengajukan izin ke Kemenag." },
  { id: "d3", nama: "Bu Laila", waktu: "5 jam lalu", isi: "Terima kasih, checklist di materi ini sangat membantu tim saya." },
];

// TODO: ganti dengan data asli (file lampiran per kelas di storage)
export const DUMMY_UNDUHAN = [
  { id: "u1", nama: "Slide Materi.pdf", ukuran: "2,4 MB" },
  { id: "u2", nama: "Checklist Operasional.xlsx", ukuran: "180 KB" },
  { id: "u3", nama: "Template Kontrak Provider.docx", ukuran: "95 KB" },
];

export type Paket = {
  id: string;
  nama: string;
  provider: string;
  harga: number;
  durasi: string;
  keberangkatan: string;
  deskripsi: string;
  itinerary: { hari: string; kegiatan: string }[];
};

// TODO: ganti dengan data asli (tabel paket marketplace per modul)
export const DUMMY_PAKET: Paket[] = [
  {
    id: "p1",
    nama: "Umroh Reguler 9 Hari",
    provider: "Al-Amin Travel",
    harga: 28_500_000,
    durasi: "9 hari",
    keberangkatan: "Setiap Sabtu, Jakarta (CGK)",
    deskripsi:
      "Paket umroh reguler dengan hotel bintang 4 dekat Masjidil Haram, cocok untuk jamaah pertama kali.",
    itinerary: [
      { hari: "Hari 1", kegiatan: "Berangkat dari Jakarta, tiba di Madinah" },
      { hari: "Hari 2–4", kegiatan: "Ibadah di Masjid Nabawi dan ziarah kota Madinah" },
      { hari: "Hari 5–8", kegiatan: "Umroh dan ibadah di Masjidil Haram, Makkah" },
      { hari: "Hari 9", kegiatan: "Kembali ke Jakarta" },
    ],
  },
  {
    id: "p2",
    nama: "Umroh Plus Turki 12 Hari",
    provider: "Barokah Wisata",
    harga: 36_900_000,
    durasi: "12 hari",
    keberangkatan: "Keberangkatan bulanan, Surabaya (SUB)",
    deskripsi:
      "Umroh dilanjutkan wisata sejarah Islam di Istanbul dan Bursa dengan tour leader berpengalaman.",
    itinerary: [
      { hari: "Hari 1–3", kegiatan: "Istanbul: Hagia Sophia, Masjid Biru, Topkapi" },
      { hari: "Hari 4–6", kegiatan: "Madinah dan ziarah" },
      { hari: "Hari 7–11", kegiatan: "Umroh dan ibadah di Makkah" },
      { hari: "Hari 12", kegiatan: "Kembali ke tanah air" },
    ],
  },
  {
    id: "p3",
    nama: "Umroh Ramadhan 15 Hari",
    provider: "Nur Hikmah Tour",
    harga: 42_000_000,
    durasi: "15 hari",
    keberangkatan: "10 hari terakhir Ramadhan, Jakarta (CGK)",
    deskripsi:
      "Beribadah di 10 hari terakhir Ramadhan dengan hotel pelataran Masjidil Haram. Kuota terbatas.",
    itinerary: [
      { hari: "Hari 1–4", kegiatan: "Madinah, ibadah di Masjid Nabawi" },
      { hari: "Hari 5–14", kegiatan: "I'tikaf dan umroh di Makkah" },
      { hari: "Hari 15", kegiatan: "Kembali ke Jakarta" },
    ],
  },
];

// TODO: ganti dengan data asli (riwayat generate AI milik member)
export const DUMMY_AI_RESULTS = [
  { id: "a1", prompt: "Poster promo umroh Ramadhan, nuansa hijau emas" },
  { id: "a2", prompt: "Banner Instagram paket umroh keluarga" },
  { id: "a3", prompt: "Flyer umroh plus Turki dengan Masjid Biru" },
  { id: "a4", prompt: "Story WhatsApp jadwal keberangkatan bulan depan" },
];

export type Pembayaran = {
  id: string;
  tanggal: string;
  deskripsi: string;
  jumlah: number;
  status: "Lunas" | "Menunggu" | "Gagal";
};

// TODO: ganti dengan data asli (tabel transaksi / webhook payment gateway)
export const DUMMY_PEMBAYARAN: Pembayaran[] = [
  { id: "INV-2026-0914", tanggal: "14 Sep 2026", deskripsi: "Kelas Manajemen Visa & Dokumen Jamaah", jumlah: 1_250_000, status: "Menunggu" },
  { id: "INV-2026-0822", tanggal: "22 Agu 2026", deskripsi: "Upgrade Tier Sertifikasi", jumlah: 2_500_000, status: "Gagal" },
  { id: "INV-2026-0805", tanggal: "5 Agu 2026", deskripsi: "Kelas Dasar Bisnis Travel Umroh", jumlah: 750_000, status: "Lunas" },
  { id: "INV-2026-0710", tanggal: "10 Jul 2026", deskripsi: "Pendaftaran Member Pengantar", jumlah: 250_000, status: "Lunas" },
];

export type Notifikasi = {
  id: string;
  judul: string;
  waktu: string;
  belumDibaca: boolean;
};

// TODO: ganti dengan data asli setelah payment webhook jalan
export const DUMMY_NOTIFIKASI: Notifikasi[] = [
  { id: "notif-1", judul: "Pembelian berhasil - Kelas Sertifikasi Umroh", waktu: "Baru saja", belumDibaca: true },
  { id: "notif-2", judul: "Trial 'Digital Marketing' akan berakhir 2 hari lagi", waktu: "Kemarin", belumDibaca: true },
  { id: "notif-3", judul: "Modul baru tersedia: Manajemen Keuangan Travel", waktu: "3 hari lalu", belumDibaca: true },
];

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
