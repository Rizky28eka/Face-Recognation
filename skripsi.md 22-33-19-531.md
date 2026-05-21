PENGEMBANGAN SISTEM PRESENSI OTOMATIS
BERBASIS PENGENALAN WAJAH MENGGUNAKAN
ALGORITMA K-NEAREST NEIGHBORS (KNN) DAN HAAR
CASCADE CLASSIFIER
SKRIPSI
Diajukan untuk memenuhi salah satu syarat mencapai derajat Sarjana
Program Studi S1 I disusun oleh
RIZKY EKA HARYADI
22.11.4829
Kepada

FAKULTAS ILMU KOMPUTER
UNIVERSITAS AMIKOM YOGYAKARTA
YOGYAKARTA
2026

PENGEMBANGAN SISTEM PRESENSI OTOMATIS
BERBASIS PENGENALAN WAJAH MENGGUNAKAN
ALGORITMA K-NEAREST NEIGHBORS (KNN) DAN HAAR
CASCADE CLASSIFIER H
ALAMAN JUDUL

SKRIPSI
S1 INFORMATIKA disusun oleh
RIZKY EKA HARYADI
22.11.4829
Kepada

FAKULTAS ILMU KOMPUTER
UNIVERSITAS AMIKOM YOGYAKARTA
YOGYAKARTA
2026
HALAMAN PERSETUJUAN

1


SKRIPSI

PENGEMBANGAN SISTEM PRESENSI OTOMATIS
BERBASIS PENGENALAN WAJAH MENGGUNAKAN
ALGORITMA K-NEAREST NEIGHBORS (KNN) DAN HAAR
CASCADE CLASSIFIER yang disusun dan diajukan oleh
Rizky Eka Haryadi
22.11.4829 telah disetujui oleh Dosen Pembimbing Skripsi pada tanggal 24 Februari 2026

Dosen Pembimbing,

Theopilus Bayu Sasongko, S.Kom, M.Eng
NIK. 190302375


HALAMAN PENGESAHAN
SKRIPSI
PENGEMBANGAN SISTEM PRESENSI OTOMATIS
BERBASIS PENGENALAN WAJAH MENGGUNAKAN
ALGORITMA K-NEAREST NEIGHBORS (KNN) DAN HAAR
CASCADE CLASSIFIER yang disusun dan diajukan oleh
Rizky Eka Haryadi
22.11.4829
Telah dipertahankan di depan Dewan Penguji pada tanggal 24 Februari 2026
Susunan Dewan Penguji
Nama Penguji

Tanda Tangan

Nama dan Gelar Penguji 1

_________________

NIK. 190302375

Nama dan Gelar Penguji 2

_________________

NIK. 190302375

Nama dan Gelar Penguji 3

_________________

NIK. 190302375

Skripsi ini telah diterima sebagai salah satu persyaratan untuk memperoleh gelar Sarjana Komputer
Tanggal 6 Mei 2026

DEKAN FAKULTAS ILMU KOMPUTER

Prof. Dr. Kusrini, M.Kom.
NIK. 190302106
HALAMAN PERNYATAAN KEASLIAN SKRIPSI
Yang bertandatangan di bawah ini,
Nama mahasiswa : Rizky Eka Haryadi
NIM

: 22.11.4829

Menyatakan bahwa Skripsi dengan judul berikut:
Pengenmbangan Sistem Presensi Otomatis Bebasis Pengenalan Wajah
Menggunakan Algoritma K-Nearest Neighbors (KNN) Dan Haar Cascade
Classifer
Dosen Pembimbing : Theopilus Bayu Sasongko, S.Kom, M.Eng
1. Karya tulis ini adalah benar-benar ASLI dan BELUM PERNAH diajukan untuk mendapatkan gelar akademik, baik di Universitas AMIKOM Yogyakarta maupun di Perguruan Tinggi lainnya.
2. Karya tulis ini merupakan gagasan, rumusan dan penelitian SAYA sendiri, tanpa bantuan pihak lain kecuali arahan dari Dosen Pembimbing.


3. Dalam karya tulis ini tidak terdapat karya atau pendapat orang lain, kecuali secara tertulis dengan jelas dicantumkan sebagai acuan dalam naskah dengan disebutkan nama pengarang dan disebutkan dalam Daftar Pustaka pada karya tulis ini.
4. Perangkat lunak yang digunakan dalam penelitian ini sepenuhnya menjadi tanggung jawab SAYA, bukan tanggung jawab Universitas AMIKOM
Yogyakarta.
5. Pernyataan ini SAYA buat dengan sesungguhnya, apabila di kemudian hari terdapat penyimpangan dan ketidakbenaran dalam pernyataan ini, maka SAYA bersedia menerima SANKSI AKADEMIK dengan pencabutan gelar yang sudah diperoleh, serta sanksi lainnya sesuai dengan norma yang berlaku di
Perguruan Tinggi.
Yogyakarta, 6 Mei 2026
Yang Menyatakan,

Meterai Asli
Rp 10.000,-

Rizky Eka Haryadi


HALAMAN PERSEMBAHAN
Skripsi ini saya persembahkan kepada:
1. Allah SWT yang senantiasa melimpahkan rahmat, taufik, dan hidayah-Nya sehingga penulis dapat menyelesaikan skripsi ini.
2. Kedua orang tua tercinta yang selalu memberikan doa, kasih sayang, dukungan, dan pengorbanan tanpa henti dalam setiap langkah penulis.
3. Saudara-saudara dan keluarga besar yang senantiasa memberikan semangat serta motivasi selama proses penyusunan skripsi ini.
4. Bapak dan Ibu dosen di Program Studi Informatika Fakultas Ilmu Komputer
Universitas AMIKOM Yogyakarta yang telah membimbing dan memberikan ilmu yang sangat bermanfaat.
5. Rekan-rekan dan sahabat seperjuangan yang selalu memberikan dukungan, bantuan, dan kebersamaan terselesaikannya skripsi ini. selama masa perkuliahan hingga


KATA PENGANTAR
Bagian ini berisi pernyataan resmi yang ingin disampaikan oleh penulis kepada pihak lain, misalnya ucapan terima kasih kepada Dosen Pembimbing, Tim
Dosen Penguji, dan semua pihak yang terkait dalam penyelesaian skripsi termasuk orang tua dan penyandang dana.
Nama harus ditulis secara lengkap termasuk gelar akademik dan harus dihindari ucapan terima kasih kepada pihak yang tidak terkait. Bahasa yang digunakan harus mengikuti kaidah bahasa Indonesia yang baku.
Bagian ini tidak perlu dituliskan hal-hal yang bersifat ilmiah. Kata
Pengantar diakhiri dengan mencantumkan kota dan tanggal penulisan diikuti di bawahnya dengan kata “Penulis” tanpa perlu menyebutkan nama dan tanda tangan.
Yogyakarta, Mei 2026
Penulis


DAFTAR ISI

HALAMAN JUDUL ................................................................................. 1
HALAMAN PERSETUJUAN ..................................................................... 1
HALAMAN PENGESAHAN ..................................................................... 3
HALAMAN PERNYATAAN KEASLIAN SKRIPSI ......................................... 4
HALAMAN PERSEMBAHAN ................................................................... 6
KATA PENGANTAR ............................................................................... 7
DAFTAR ISI .......................................................................................... 8
DAFTAR TABEL ................................................................................... 12
DAFTAR GAMBAR ............................................................................... 13
DAFTAR LAMPIRAN ............................................................................ 14
DAFTAR LAMBANG DAN SINGKATAN .................................................. 15
DAFTAR ISTILAH ................................................................................ 16
INTISARI ............................................................................................ 19
ABSTRACT ......................................................................................... 21
BAB I PENDAHULUAN ........................................................................ 23
1.1

Latar Belakang ...............................................................................23

1.2

Rumusan Masalah .........................................................................24

1.3

Batasan Masalah ...........................................................................25

1.4

Tujuan Penelitian ...........................................................................26

1.5

Manfaat Penelitian .........................................................................27

1.6

Sistematika Penulisan ...................................................................27


BAB II TINJAUAN PUSTAKA ................................................................. 29
2.1

Studi Literatur ................................................................................29

2.2

Dasar Teori ....................................................................................35

2.2.1

Sistem Presensi ........................................................................................ 35

2.2.2

Biometrik ........................................................ Error! Bookmark not defined.

2.2.3

Computer Vision ....................................................................................... 36

2.2.4

Face Recognition............................................. Error! Bookmark not defined.

2.2.5

Haar Cascade Classifier .................................. Error! Bookmark not defined.

2.2.6

Ekstraksi Fitur Wajah ....................................... Error! Bookmark not defined.

2.2.7

Algoritma K-Nearest Neighbors (KNN) .............. Error! Bookmark not defined.

2.2.8

Sistem Presensi Berbasis Pengenalan Wajah .... Error! Bookmark not defined.

2.2.9

Arsitektur Sistem Berbasis Web ....................... Error! Bookmark not defined.

BAB III METODE PENELITIAN............................................................... 41
3.1

Objek Penelitian ............................................................................41

3.2

Metode Pengumpulan Data ............................................................42

3.3

Alur Penelitian ...............................................................................42

3.4

Perancangan Sistem dan Flowchart ................................................44

3.4.1

3.4.2
3.4.3

3.5

Flowchart Proses Presensi (User Flow) ....................................................... 44

Flowchart Lifecycle Training Model .............................................45
Diagram Arsitektur Integrasi Sistem SIKAWAN ............................................ 46

Perancangan Algoritma Pengenalan Wajah .....................................48

3.5.1

Deteksi Wajah dengan Haar Cascade Classifier .......................................... 48

3.5.2

Pembagian Dataset dan Skenario Pengujian (70/20/10 Split) ....................... 48

3.6

Perancangan Pengujian Sistem.......................................................49

3.7

Alat dan Bahan ...............................................................................50

3.7.1

Perangkat Lunak (Software) ....................................................................... 50

3.7.2

Perangkat Keras (Hardware)....................................................................... 51

3.8

Perancangan Database (Data Dictionary) ........................................51

BAB IV HASIL DAN PEMBAHASAN ....................................................... 54


4.1

Hasil Implementasi Sistem ............................................................54

4.1.1 Antarmuka Pengguna (Frontend) .................................................................... 54
4.1.2 Layanan AI (Backend Engine).......................................................................... 54
4.1.3 Augmentasi Data Sintetis ............................................................................... 55

4.2
4.2.1

Pengujian Sistem ...........................................................................55
Pengujian Black Box (Black Box Testing) ..................................................... 55

4.2.2 Pengujian White Box (White Box Testing) ......................................................... 56
4.2.3 Skenario Split Dataset (70/20/10) ................................................................... 58
4.2.4 Hasil Pengujian Akurasi per Fase .................................................................... 60
4.2.5 Confusion Matrix Summary ............................................................................ 61
4.2.7 Distribusi Sampel Data (Face Samples) .......................................................... 63
4.2.8 Performa Pengenalan per Subjek .................................................................... 64
4.3 Implementasi Antarmuka (User Interface) ......................................................... 65
4.3.2 Modul Presensi Wajah Karyawan .................................................................... 66
4.3.3 Laporan dan Detail Kehadiran ........................................................................ 67
4.4.2 Karakteristik ROC dan AUC ............................................................................ 70
4.4.3 Analisis Frekuensi Skor (Histogram)................................................................ 71
4.4.4 Keefektifan Model dan Kecepatan Proses ....................................................... 73
4.4.5 Dampak Penggunaan Data Sintetis ................................................................. 73
4.4.6 Integrasi Keamanan Geofencing ..................................................................... 73
4.4.7 Analisis Ketahanan Lingkungan (Robustness) ................................................. 75

4.6 Analisis Keamanan dan Integritas Data.................................................76
4.7 Analisis Implementasi Perangkat Lunak (Full-Stack) .............................77
4.7.1 Logika Backend (Laravel & PostgreSQL) .......................................................... 77
4.7.2 Logika Frontend (Webcam & JavaScript) ......................................................... 77

4.8 Integrasi Layanan (FastAPI & Laravel Communication) ..........................78
4.8.1 Alur Integrasi API ........................................................................................... 78
4.8.2 Analisis Latensi Sistem .................................................................................. 79

BAB V PENUTUP................................................................................. 81
5.1 Kesimpulan .........................................................................................81
5.2 Saran ..................................................................................................82


REFERENSI ........................................................................................ 83
LAMPIRAN ......................................................................................... 85


DAFTAR TABEL
Tabel 2. 1 Keaslian Penlitian...............................................................................32
Tabel 3. 1 Daftar Perangkat Lunak yang Digunakan .............................................50
Tabel 3. 2 Daftar Perangkat Keras yang Digunakan .......................................51
Tabel 3. 3 Struktur Tabel Users .............................................................................51
Tabel 3. 4 Struktur Tabel Attendances ..................................................................52
Tabel 4. 1 Hasil Pengujian Black Box ...................................................................55
Tabel 4. 2 Hasil Pengujian White Box...................................................................58
Tabel 4. 3 Pembagian Partisi Dataset SIKAWAN.................................................59
Tabel 4. 4 Hasil Evaluasi Berdasarkan Fase Data (Mixed Split) ...........................60
Tabel 4. 5 Ringkasan Confusion Matrix ................................................................61
Tabel 4. 6 Hasil Pengujian Variasi Kondisi ...........................................................62
Tabel 4. 7 Komposisi Dataset Wajah SIKAWAN .................................................64
Tabel 4. 8 Performa Pengenalan per Subjek ..........................................................64
Tabel 4. 9 11 Daftar Halaman Utama Sistem SIKAWAN ....................................68
Tabel 4. 10 Hasil Pengujian Ketahanan Lingkungan.............................................75
Tabel 4. 11 Hasil Kuesioner UAT. ........................................................................76


DAFTAR GAMBAR
Gambar 3. 1 Analisis Akurasi terhadap Pemilihan Nilai K (KKN) .......................41
Gambar 3. 2 Flowchart Alur Penelitian Sistem SIKAWAN .................................43
Gambar 3. 3 Flowchart Proses Presensi Karyawan (User Flow) ...........................44
Gambar 3. 4 Flowchart Lifecycle Training Model KNN .......................................45
Gambar 3. 5 Arsitektur Integrasi Sistem SIKAWAN (Laravel ↔ FastAPI ↔
PostgreSQL) ...........................................................................................................47
Gambar 3. 6 Distribusi Dataset SIKAWAN — 131 Citra (Pie Chart) ...................48
Gambar 4. 1 Pipeline Pemrosesan Wajah pada Layanan AI (FastAPI) .................54
Gambar 4. 2 Flowchart White Box — Jalur Eksekusi checkIn() dan predict() .....57
Gambar 4. 3 Flowchart Pipeline Pembagian Dataset (70/20/10) .........................59
Gambar 4. 4 Grafik Perbandingan Akurasi per Fase Evaluasi ........................60
Gambar 4. 5 5 Confusion Matrix Prediksi Wajah (Heatmap) ...............................61
Gambar 4. 6 Visualisasi Akurasi per Skenario Kondisi Lingkungan.....................63
Gambar 4. 7 Distribusi Keberhasilan dan Kegagalan per Kondisi ........................63
Gambar 4. 8 Tampilan Dashboard Administrator SIKAWAN ..............................66
Gambar 4. 9 Tampilan Antarmuka Pemindaian Wajah Karyawan .......................67
Gambar 4. 10 Tampilan Laporan Kehadiran dan Detail Lokasi ......................68
Gambar 4. 11 Visualisasi F1-Score per Subjek (Karyawan) .................................69
Gambar 4. 12 Boxplot Distribusi Confidence Score (Matplotlib Real Data) ........70
Gambar 4. 13 Kurva ROC (Receiver Operating Characteristic) ..........................71
Gambar 4. 14 Histogram Frekuensi Confidence Score .........................................72
Gambar 4. 15 Diagram Lingkaran Distribusi Latensi Proses Inferensi ................73
Gambar 4. 16 Flowchart Logika Validasi Geofencing ..........................................74
Gambar 4. 17 Sequence Diagram Komunikasi Laravel ↔ FastAPI .....................79
Gambar 4. 18 Gantt Chart Breakdown Latensi Satu Siklus Presensi ....................80


DAFTAR LAMPIRAN


DAFTAR LAMBANG DAN SINGKATAN x

Data uji (vektor fitur) xi

Data latih ke-i d

Jarak antara dua vektor k

Jumlah tetangga terdekat pada KNN

∑

Operasi penjumlahan

√

Operasi akar (digunakan pada perhitungan jarak)

LBP

Local Binary Pattern

KNN

K-Nearest Neighbors

ED

Euclidean Distance

FV

Feature Vector (vektor fitur wajah)

IMG

Citra digital (image)

AI

Artificial Intelligence

CV

Computer Vision

API

Application Programming Interface

GPS

Global Positioning System

UI

User Interface

UX

User Experience

DB

Database

FR

Face Recognition

SIKAWAN

Sistem Kehadiran Wajah Karyawan


DAFTAR ISTILAH
Besaran yang memiliki nilai dan arah.
Eigen Value

Nilai skalar hasil dari persamaan karakteristik matriks.

Matriks

Susunan bilangan dalam baris dan kolom.

Sistem Presensi

Sistem untuk mencatat kehadiran pengguna.

Biometrik

Metode identifikasi berdasarkan ciri fisik unik.

Computer Vision

Teknologi untuk memproses dan memahami citra digital.

Face Recognition

Teknologi untuk mengenali identitas melalui wajah.

Deteksi Wajah

Proses menemukan lokasi wajah dalam citra.

Haar Cascade

Metode deteksi objek berbasis fitur
Haar.

Ekstraksi Fitur

Proses mengambil informasi penting dari data.

Fitur Wajah

Karakteristik unik yang merepresentasikan wajah.

Local Binary Pattern (LBP)

Metode ekstraksi tekstur berbasis pola biner.

Dataset

Kumpulan data untuk pelatihan dan pengujian.

Training Data

Data yang digunakan untuk melatih model.

Testing Data

Data untuk menguji performa model.


K-Nearest Neighbors (KNN)

Algoritma klasifikasi berdasarkan tetangga terdekat.

Klasifikasi

Proses mengelompokkan data ke dalam kelas tertentu.

Euclidean Distance

Perhitungan jarak antar dua titik.

Model

Representasi matematis dari suatu sistem.

Akurasi

Tingkat ketepatan hasil prediksi.

Geolocation

Penentuan lokasi geografis perangkat.

Geofencing

Batas wilayah virtual berbasis lokasi.

GPS

Sistem penentuan posisi berbasis satelit.

Client

Pihak yang mengirim permintaan ke server.

Server

Sistem yang memproses permintaan dari client.

API

Antarmuka untuk komunikasi antar sistem.

Backend

Bagian sistem yang mengelola logika dan data.

Frontend

Antarmuka yang berinteraksi dengan pengguna.

Database

Tempat penyimpanan data.

Laravel

Framework backend berbasis PHP.

Flutter

Framework untuk pengembangan aplikasi mobile.

Python

Bahasa pemrograman untuk pengolahan data dan AI.

FastAPI

Framework Python untuk membuat
API.


SIKAWAN

Sistem presensi berbasis pengenalan wajah.


INTISARI
Sistem presensi merupakan salah satu komponen penting dalam pengelolaan sumber daya manusia karena digunakan sebagai dasar penilaian kedisiplinan, evaluasi kinerja, serta pengelolaan administrasi seperti penggajian, cuti, dan lembur. Pada praktiknya, masih banyak organisasi yang menggunakan metode presensi konvensional seperti pencatatan manual atau sistem sederhana tanpa mekanisme verifikasi identitas yang kuat, sehingga masih rentan terhadap manipulasi data, kesalahan pencatatan, dan proses rekapitulasi yang tidak efisien.
Perkembangan teknologi computer vision dan kecerdasan buatan membuka peluang penerapan sistem presensi otomatis berbasis pengenalan wajah yang mampu memverifikasi identitas pengguna secara biometrik dan mengurangi potensi kecurangan seperti titip absen.
Penelitian ini bertujuan untuk mengembangkan sistem presensi otomatis berbasis pengenalan wajah dengan memanfaatkan algoritma Haar Cascade Classifier untuk deteksi wajah dan K-Nearest Neighbors (KNN) untuk klasifikasi identitas, yang diimplementasikan dalam bentuk ekosistem terintegrasi bernama SIKAWAN
(Sistem Kehadiran Wajah Karyawan). Sistem terdiri dari aplikasi mobile berbasis
Flutter sebagai antarmuka presensi, backend berbasis Laravel untuk pengelolaan data dan logika bisnis, serta layanan kecerdasan buatan berbasis Python dan
FastAPI yang menangani proses deteksi wajah, ekstraksi fitur, dan pengenalan identitas. Metode penelitian yang digunakan meliputi pengumpulan dan prapemrosesan data citra wajah, pengembangan dan evaluasi model pengenalan wajah, perancangan arsitektur sistem, implementasi setiap komponen, serta pengujian fungsional dan akurasi pada lingkungan uji lokal.
Hasil pengujian menunjukkan bahwa sistem SIKAWAN dapat berjalan sesuai dengan kebutuhan fungsional, ditunjukkan dengan keberhasilan proses autentikasi, pengambilan dan pengiriman citra wajah, integrasi antara aplikasi mobile, backend, dan layanan AI, serta pencatatan dan penampilan riwayat presensi. Pengujian akurasi menunjukkan bahwa kombinasi Haar Cascade dan KNN mampu mengenali wajah karyawan yang terdaftar dengan tingkat akurasi yang tinggi pada skenario uji lokal. Penelitian ini berkontribusi dalam menyediakan rancangan dan prototipe sistem presensi berbasis pengenalan wajah yang relatif ringan secara komputasi namun tetap akurat, yang dapat dimanfaatkan sebagai referensi atau rancangan awal implementasi sistem presensi di lingkungan perusahaan atau startup.

Pengembangan lebih lanjut dapat dilakukan dengan memperluas skenario pengujian, menambah jumlah pengguna, serta mempertimbangkan penggunaan metode deep learning dan fitur liveness detection untuk meningkatkan ketahanan dan keamanan sistem.
Kata kunci: sistem presensi, pengenalan wajah, Haar Cascade Classifier, KNearest Neighbors, SIKAWAN.


ABSTRACT
The attendance system is one of the essential components in human resource management because it is used as the basis for evaluating employee discipline, performance, and administrative processes such as payroll, leave, and overtime. In practice, many organizations still rely on conventional attendance methods such as manual recording or simple systems without strong identity verification. These methods are prone to data manipulation, recording errors, and inefficient data recap processes. The development of computer vision and artificial intelligence has enabled the implementation of automatic attendance systems based on facial recognition, which can verify a person’s identity using unique facial characteristics and reduce the risk of attendance fraud.
This research aims to develop an automatic attendance system based on facial recognition using the Haar Cascade Classifier for face detection and the K-Nearest
Neighbors (KNN) algorithm for face classification. The system is implemented as an integrated ecosystem called SIKAWAN (Sistem Kehadiran Wajah Karyawan), consisting of a mobile application built with Flutter, a backend server developed using the Laravel framework, and an AI service built with Python and FastAPI. The mobile application functions as the attendance interface for employees, the Laravel backend manages user authentication, attendance data, and communication with the
AI service, while the AI service handles face detection, feature extraction, and identity classification using the trained KNN model.
The research method includes data collection of employee facial images, preprocessing and preparation of the training and testing datasets, development and evaluation of the facial recognition model, and implementation as well as functional testing of the integrated system. Functional testing using the black-box method shows that the main features of SIKAWAN—login, face capture, communication between the mobile application, backend, and AI service, attendance recording, and attendance history display—work in accordance with the specified requirements.
Accuracy testing on a local test scenario indicates that the combination of Haar
Cascade and KNN can recognize registered users’ faces with high accuracy under controlled conditions.


The results of this research demonstrate that the proposed system is capable of performing automatic, centralized, and more secure attendance recording compared to conventional methods. Nevertheless, the system’s performance is still influenced by image quality, lighting conditions, and pose variations, so further development and testing are required for larger-scale and more diverse real-world environments.
Keywords: attendance system, facial recognition, Haar Cascade Classifier, KNearest Neighbors, SIKAWAN.


BAB I
PENDAHULUAN

1.1 Latar Belakang
Sistem presensi merupakan bagian penting dalam pengelolaan kehadiran karena digunakan sebagai dasar evaluasi kedisiplinan, pencatatan administrasi, serta penilaian kinerja karyawan maupun mahasiswa. Namun, sistem presensi konvensional masih memiliki berbagai kelemahan, seperti proses pencatatan yang memakan waktu, potensi kesalahan manusia (human error), serta peluang terjadinya manipulasi data kehadiran [1], [2].

Seiring dengan perkembangan teknologi, sistem presensi mulai beralih ke penggunaan teknologi biometrik, salah satunya adalah pengenalan wajah (face recognition). Teknologi ini memungkinkan identifikasi individu berdasarkan karakteristik unik wajah tanpa memerlukan kartu identitas atau kontak fisik, sehingga lebih praktis dan efisien. Beberapa penelitian menunjukkan bahwa sistem presensi berbasis face recognition mampu meningkatkan efisiensi pencatatan kehadiran serta meminimalisir kecurangan [3], [4], [5].

Dalam implementasinya, sistem presensi berbasis pengenalan wajah umumnya terdiri dari beberapa tahapan utama, yaitu deteksi wajah, ekstraksi fitur, dan proses klasifikasi identitas. Salah satu metode yang banyak digunakan pada tahap deteksi wajah adalah Haar Cascade Classifier karena memiliki kecepatan komputasi yang tinggi dan cocok digunakan dalam sistem real-time [6]. Setelah wajah berhasil dideteksi, proses pengenalan identitas dapat dilakukan menggunakan berbagai algoritma machine learning seperti K-Nearest Neighbors (KNN), yang dikenal memiliki performa baik dalam klasifikasi data berbasis jarak [7].

Selain itu, perkembangan teknologi juga mendorong integrasi sistem presensi berbasis wajah ke dalam platform berbasis web maupun sistem digital lainnya. Hal ini memungkinkan proses monitoring dan pengelolaan data kehadiran dilakukan secara real-time dan lebih terstruktur. Beberapa penelitian terbaru bahkan mengombinasikan teknologi face recognition dengan pendekatan deep learning, seperti Convolutional Neural Network (CNN), untuk meningkatkan tingkat akurasi sistem [8], [9], [10]. Studi literatur juga menunjukkan bahwa berbagai metode seperti LBPH, CNN, hingga pendekatan deep learning terus dikembangkan untuk meningkatkan performa sistem presensi berbasis wajah [3], [2].

Namun demikian, masih terdapat beberapa keterbatasan dalam penelitian-penelitian sebelumnya. Sebagian besar sistem presensi berbasis face recognition menggunakan metode deep learning yang membutuhkan sumber daya komputasi yang tinggi, sehingga kurang optimal untuk implementasi pada sistem dengan keterbatasan perangkat. Selain itu, masih terbatas penelitian yang mengombinasikan metode yang lebih ringan seperti Haar Cascade dan KNN dalam satu sistem yang terintegrasi. Di sisi lain, implementasi sistem presensi berbasis wajah yang terhubung langsung dengan platform web untuk kebutuhan monitoring secara real-time juga masih belum banyak dikembangkan secara optimal.

Berdasarkan permasalahan tersebut, diperlukan suatu solusi berupa sistem presensi yang tidak hanya memiliki tingkat akurasi yang baik, tetapi juga ringan, cepat, dan mudah diimplementasikan dalam lingkungan berbasis web. Oleh karena itu, penelitian ini bertujuan untuk mengembangkan sistem presensi otomatis berbasis pengenalan wajah menggunakan metode Haar Cascade Classifier untuk deteksi wajah dan K-Nearest Neighbors (KNN) untuk klasifikasi identitas. Sistem yang dikembangkan diharapkan dapat meningkatkan efisiensi, akurasi, serta keamanan dalam proses pencatatan kehadiran.

1.2 Rumusan Masalah
Berdasarkan latar belakang yang telah dijelaskan sebelumnya mengenai permasalahan pada sistem presensi konvensional serta potensi penerapan teknologi pengenalan wajah dalam proses presensi, maka rumusan masalah dalam penelitian ini dapat dirumuskan sebagai berikut:
1. Bagaimana merancang dan mengimplementasikan sistem presensi otomatis berbasis pengenalan wajah berbasis web menggunakan framework Laravel dengan menerapkan algoritma Haar Cascade Classifier untuk deteksi wajah dan K-Nearest Neighbors (KNN) untuk klasifikasi identitas pengguna?
2. Seberapa baik kinerja sistem presensi berbasis pengenalan wajah dalam mengidentifikasi kehadiran pengguna secara otomatis menggunakan metode Haar Cascade sebagai deteksi wajah dan K-Nearest Neighbors (KNN) sebagai metode klasifikasi pada lingkungan uji lokal berbasis web?

1.3 Batasan Masalah
Agar penelitian yang dilakukan lebih terarah dan tidak menyimpang dari tujuan yang telah ditetapkan, maka penelitian ini memiliki beberapa batasan masalah sebagai berikut:
1. Sistem presensi yang dikembangkan berbasis web menggunakan framework Laravel sebagai platform utama.
2. Sistem hanya difokuskan pada proses presensi menggunakan pengenalan wajah tanpa menggunakan metode presensi lain seperti RFID, fingerprint, atau GPS.
3. Proses pengambilan citra wajah dilakukan melalui kamera perangkat yang terhubung dengan sistem berbasis web.
4. Metode yang digunakan untuk deteksi wajah adalah Haar Cascade Classifier.
5. Metode yang digunakan untuk klasifikasi atau pengenalan wajah adalah K-Nearest Neighbors (KNN).
6. Perhitungan jarak pada algoritma KNN menggunakan metode Euclidean Distance.
7. Sistem menggunakan threshold tertentu untuk menentukan apakah wajah dikenali atau tidak dikenali.
8. Dataset wajah diperoleh melalui proses pendaftaran (registrasi) pengguna pada sistem.
9. Sistem hanya mengenali wajah yang telah terdaftar dalam database.
10. Sistem tidak membahas metode deep learning seperti CNN, YOLO, atau metode lain di luar Haar Cascade dan KNN.
11. Sistem tidak membahas aspek keamanan lanjutan seperti liveness detection, anti-spoofing, atau enkripsi biometrik.
12. Sistem hanya difokuskan pada proses presensi (check-in) dan tidak mencakup fitur manajemen kepegawaian secara lengkap.
13. Sistem tidak membahas integrasi dengan sistem eksternal seperti HRIS atau sistem enterprise lainnya.
14. Pengujian sistem dilakukan pada skenario penggunaan terbatas untuk mengukur fungsionalitas dan akurasi sistem.
15. Faktor lingkungan seperti pencahayaan, posisi wajah, dan kualitas kamera dapat mempengaruhi hasil pengenalan wajah, namun tidak dianalisis secara mendalam dalam penelitian ini.

1.4 Tujuan Penelitian
Tujuan yang ingin dicapai dalam penelitian ini adalah sebagai berikut:
1. Mengembangkan sistem presensi otomatis berbasis web menggunakan teknologi pengenalan wajah dengan algoritma Haar Cascade Classifier untuk deteksi wajah dan K-Nearest Neighbors (KNN) untuk klasifikasi identitas pengguna.
2. Menerapkan algoritma Haar Cascade Classifier dalam mendeteksi wajah serta algoritma K-Nearest Neighbors (KNN) dalam melakukan pengenalan wajah pada sistem presensi yang dibangun.
3. Menganalisis kinerja sistem presensi berbasis pengenalan wajah berdasarkan tingkat akurasi dalam mengidentifikasi pengguna serta kemampuan sistem dalam mencatat kehadiran secara otomatis.

1.5 Manfaat Penelitian
Penelitian ini diharapkan dapat memberikan manfaat baik secara teoritis maupun praktis sebagai berikut:
1. Penelitian ini diharapkan dapat memberikan kontribusi dalam pengembangan ilmu pengetahuan di bidang computer vision dan sistem presensi otomatis, khususnya dalam penerapan algoritma Haar Cascade Classifier dan K-Nearest Neighbors (KNN) pada sistem pengenalan wajah.
2. Sistem yang dikembangkan dapat menjadi solusi alternatif untuk meningkatkan efisiensi dan akurasi dalam proses pencatatan kehadiran karyawan atau pengguna dibandingkan metode presensi konvensional.
3. Sistem presensi berbasis pengenalan wajah dapat mengurangi potensi manipulasi data kehadiran seperti titip absen, karena proses verifikasi dilakukan berdasarkan biometrik wajah pengguna.
4. Sistem berbasis web memungkinkan pengelolaan data presensi dilakukan secara terpusat, sehingga memudahkan proses monitoring, rekapitulasi, dan pelaporan data kehadiran.

1.6 Sistematika Penulisan
Sistematika penulisan skripsi ini disusun untuk memberikan gambaran umum mengenai isi setiap bab, sehingga memudahkan pembaca dalam memahami alur pembahasan penelitian. Adapun sistematika penulisan skripsi ini adalah sebagai berikut:
*   BAB I PENDAHULUAN

Bab ini berisi latar belakang masalah, rumusan masalah, batasan masalah, tujuan penelitian, manfaat penelitian, serta sistematika penulisan skripsi.

*   BAB II TINJAUAN PUSTAKA

Bab ini berisi kajian pustaka yang meliputi penelitian terdahulu, teori-teori yang mendukung penelitian, serta konsep dasar yang berkaitan dengan sistem presensi, pengenalan wajah, algoritma Haar Cascade Classifier, dan metode K-Nearest Neighbors (KNN).

*   BAB III METODE PENELITIAN

Bab ini menjelaskan metode yang digunakan dalam penelitian, meliputi objek penelitian, alat dan bahan, metode pengumpulan data, perancangan sistem, serta tahapan pengembangan sistem presensi berbasis pengenalan wajah.

*   BAB IV HASIL DAN PEMBAHASAN

Bab ini berisi hasil implementasi sistem yang telah dikembangkan, pengujian sistem baik dari sisi fungsionalitas maupun akurasi, serta analisis terhadap hasil pengujian yang telah dilakukan.

*   BAB V PENUTUP

Bab ini berisi kesimpulan dari hasil penelitian serta saran untuk pengembangan sistem di masa yang akan datang.

BAB II
TINJAUAN PUSTAKA

2.1 Studi Literatur
Perkembangan teknologi informasi dan kecerdasan buatan telah memberikan dampak yang signifikan dalam berbagai bidang, termasuk dalam sistem presensi atau pencatatan kehadiran. Sistem presensi yang masih dilakukan secara manual, seperti tanda tangan atau pencatatan pada kertas, memiliki berbagai kelemahan, di antaranya rawan terjadinya manipulasi data, praktik titip absen, serta membutuhkan waktu yang relatif lama dalam proses rekapitulasi data kehadiran. Oleh karena itu, diperlukan sistem presensi yang lebih efisien, akurat, dan otomatis dengan memanfaatkan teknologi biometrik [3].
Salah satu teknologi biometrik yang banyak digunakan adalah pengenalan wajah
(face recognition). Teknologi ini memungkinkan sistem untuk mengenali identitas seseorang berdasarkan karakteristik wajah yang unik. Keunggulan utama dari teknologi pengenalan wajah adalah proses identifikasi yang tidak memerlukan kontak fisik sehingga lebih praktis dan dapat digunakan secara real-time. Oleh karena itu, teknologi ini banyak diterapkan dalam berbagai sistem seperti sistem keamanan, sistem identifikasi, hingga sistem presensi otomatis [8].
Dalam sistem presensi berbasis pengenalan wajah, terdapat beberapa tahapan utama yaitu deteksi wajah, ekstraksi fitur, dan klasifikasi wajah. Salah satu metode yang banyak digunakan untuk proses deteksi wajah adalah Haar Cascade Classifier.
Metode ini bekerja dengan memanfaatkan fitur Haar untuk mendeteksi pola wajah pada citra digital dan memiliki keunggulan dalam kecepatan pemrosesan sehingga cocok digunakan pada sistem yang membutuhkan deteksi wajah secara real-time
[4].
Berbagai penelitian telah dilakukan dalam beberapa tahun terakhir untuk mengembangkan sistem presensi otomatis berbasis pengenalan wajah. Penelitian

29 yang dilakukan oleh Budiman et al. mengkaji perkembangan teknologi sistem presensi berbasis face recognition melalui pendekatan systematic literature review dan menunjukkan bahwa metode berbasis deep learning seperti CNN memiliki tingkat akurasi yang tinggi, namun memerlukan sumber daya komputasi yang besar
[3].
Penelitian lain yang dilakukan oleh Warman dan Kusuma mengimplementasikan metode deep learning dalam sistem presensi berbasis pengenalan wajah. Hasil penelitian menunjukkan bahwa penggunaan metode tersebut mampu meningkatkan akurasi pengenalan wajah secara signifikan, tetapi membutuhkan perangkat dengan spesifikasi tinggi sehingga kurang efisien untuk implementasi sistem yang ringan
[8].
Selanjutnya, penelitian oleh Alniemi dan Mahmood mengembangkan sistem presensi berbasis pengenalan wajah yang mampu meningkatkan efisiensi serta akurasi pencatatan kehadiran dibandingkan metode konvensional. Namun, penelitian ini belum membahas secara spesifik metode klasifikasi yang ringan dan efisien [4].
Penelitian oleh Vara Prasad et al. mengombinasikan metode Haar Cascade
Classifier untuk deteksi wajah dan algoritma K-Nearest Neighbors (KNN) untuk klasifikasi identitas. Hasil penelitian menunjukkan bahwa kombinasi kedua metode tersebut mampu menghasilkan sistem presensi yang cukup akurat dengan waktu pemrosesan yang relatif cepat [7].
Selanjutnya, penelitian oleh Agarwal menunjukkan bahwa sistem presensi berbasis pengenalan wajah dapat meningkatkan efisiensi serta meminimalkan kesalahan pencatatan kehadiran. Akan tetapi, penelitian ini tidak menjelaskan secara rinci metode klasifikasi yang digunakan dalam proses pengenalan wajah [11].
Penelitian terbaru oleh Quah Xuan Ying et al. mengembangkan sistem presensi berbasis wajah dengan menggabungkan metode Haar Cascade dan model deep learning (VGG). Hasil penelitian menunjukkan peningkatan akurasi sistem, namun pendekatan ini membutuhkan sumber daya komputasi yang lebih besar dibandingkan metode klasik [9].
Berdasarkan beberapa penelitian tersebut, dapat disimpulkan bahwa teknologi pengenalan wajah memiliki potensi besar untuk diterapkan dalam sistem presensi otomatis karena mampu meningkatkan efisiensi, akurasi, dan keamanan sistem.
Namun demikian, sebagian penelitian masih menggunakan metode deteksi dan klasifikasi yang kompleks serta membutuhkan sumber daya komputasi yang tinggi.
Oleh karena itu, penelitian ini mengembangkan sistem presensi otomatis berbasis pengenalan wajah menggunakan metode Haar Cascade Classifier untuk deteksi wajah dan algoritma K-Nearest Neighbors (KNN) untuk proses klasifikasi wajah, sehingga diharapkan dapat menghasilkan sistem yang akurat sekaligus efisien dalam penggunaan sumber daya.

Tabel 2. 1 Keaslian Penlitian

| No | Judul penelitian | Nama Penulis | Tahun | Hasil Penelitian | Perbandingan Penelitian |
| :--: | :--- | :--- | :---: | :--- | :--- |
| 1 | Student Attendance System | Budiman et al. | 2022 | Metode deep learning akurat tapi berat komputasi. | Penelitian ini fokus pada optimasi KNN agar ringan. |
| 2 | Deep Learning in Attendance | Warman & Kusuma | 2021 | Akurasi tinggi namun butuh spesifikasi hardware tinggi. | Penelitian ini menggunakan Haar Cascade untuk efisiensi. |
| 3 | Face Recognition Accuracy | Alniemi & Mahmood | 2023 | Efisiensi meningkat dibanding metode konvensional. | Penelitian ini menambahkan validasi Geofencing. |
| 4 | KNN and Haar Cascade | Vara Prasad et al. | 2020 | Kombinasi Haar+KNN cukup akurat dan cepat. | Penelitian ini mengintegrasikan Laravel dan FastAPI. |
| 5 | Modern Attendance | Agarwal | 2022 | Meminimalkan kesalahan pencatatan kehadiran. | Penelitian ini menjelaskan detail algoritma KNN yang digunakan. |
| 6 | Haar Cascade and VGG | Quah Xuan Ying | 2024 | Peningkatan akurasi dengan model VGG. | Penelitian ini menghindari VGG karena beban komputasi tinggi. |

2.2 Dasar Teori
Dasar teori merupakan landasan ilmiah yang digunakan untuk mendukung penelitian yang dilakukan. Pada penelitian ini, dasar teori mencakup berbagai konsep yang berkaitan dengan sistem presensi, teknologi biometrik, computer vision, serta metode pengenalan wajah yang digunakan dalam proses identifikasi pengguna. Selain itu, teori yang dibahas juga meliputi algoritma Haar Cascade
Classifier sebagai metode deteksi wajah, metode ekstraksi fitur wajah menggunakan Local Binary Pattern (LBP), serta algoritma K-Nearest Neighbors
(KNN) sebagai metode klasifikasi wajah.
Konsep-konsep tersebut digunakan sebagai dasar dalam perancangan dan pengembangan sistem presensi otomatis berbasis pengenalan wajah yang diimplementasikan dalam bentuk sistem berbasis web menggunakan framework
Laravel. Sistem ini dirancang untuk mampu melakukan proses pencatatan kehadiran secara otomatis melalui identifikasi wajah pengguna, sehingga dapat meningkatkan efisiensi, akurasi, serta mengurangi potensi manipulasi data kehadiran.
Dengan adanya landasan teori ini, diharapkan penelitian yang dilakukan memiliki dasar yang kuat secara ilmiah serta mampu mendukung proses analisis, perancangan, dan implementasi sistem presensi berbasis pengenalan wajah yang dikembangkan.

2.2.1

Sistem Presensi

Presensi merupakan komponen vital dalam manajemen sumber daya manusia yang berfungsi untuk merekam data kehadiran individu secara periodik. Secara tradisional, presensi dilakukan menggunakan media kertas (manual) atau kartu identitas (magnetic card). Namun, metode ini memiliki celah keamanan berupa buddy punching, di mana seseorang dapat menitipkan presensinya kepada orang lain. Sistem presensi digital berbasis web yang dikembangkan dalam penelitian ini bertujuan untuk mengotomatisasi proses tersebut dengan menggunakan verifikasi identitas yang tidak dapat dipindahkan (non-transferable).
35

2.2.2

Teknologi Biometrik

Biometrik merupakan teknologi untuk mengenali identitas individu berdasarkan ciri fisik (physiological) atau ciri perilaku (behavioral) yang unik. Ciri fisik meliputi sidik jari, pola iris, geometri tangan, dan struktur wajah. Teknologi biometrik menawarkan tingkat keamanan yang lebih tinggi dibandingkan sistem berbasis knowledge (kata sandi) atau possession (kartu), karena ciri biometrik sulit diduplikasi dan selalu melekat pada pengguna. Penelitian ini berfokus pada biometrik wajah karena sifatnya yang contactless dan mudah diintegrasikan dengan perangkat kamera standar.
2.2.3

Computer Vision

Computer Vision adalah sub-bidang kecerdasan buatan yang berfokus pada pengembangan teknik agar komputer dapat mengekstrak informasi tingkat tinggi dari citra digital. Proses ini melibatkan tahapan pengolahan citra (image processing), ekstraksi fitur, hingga pengenalan pola. OpenCV (Open Source
Computer Vision Library) adalah framework yang menyediakan ribuan algoritma optimasi untuk visi komputer, termasuk alat untuk pengolahan matriks gambar, konversi ruang warna (seperti RGB ke Grayscale), dan implementasi detektor objek.
2.2.4

Haar Cascade Classifier

Haar Cascade merupakan algoritma deteksi objek yang diperkenalkan oleh Paul
Viola dan Michael Jones. Algoritma ini bekerja berdasarkan fitur-fitur sederhana yang merepresentasikan perbedaan intensitas piksel dalam area tertentu (Haar-like features).
1. Integral

Image:

Untuk mempercepat komputasi,

Haar

Cascade menggunakan Integral Image yang memungkinkan perhitungan jumlah intensitas piksel dalam area persegi panjang hanya dengan empat kali akses memori.
2. Adaboost:

Dari puluhan ribu fitur

Haar yang mungkin, algoritma Adaboost digunakan untuk memilih sekumpulan kecil fitur yang paling diskriminatif untuk membentuk strong classifier.

36

3. Cascading: Proses deteksi dilakukan secara bertahap. Jika sebuah area gambar gagal pada tahap awal (stage), maka area tersebut langsung ditolak, sehingga menghemat daya komputasi secara signifikan.

2.2.5

Ekstraksi Fitur Local Binary Patterns (LBP)

Local Binary Pattern (LBP) adalah operator tekstur yang kuat yang memberikan deskripsi lokal dari gambar dengan membandingkan piksel pusat dengan piksel tetangganya. Untuk setiap piksel dalam gambar grayscale, nilai LBP dihitung dengan melakukan thresholding pada lingkungan 3 × 3 piksel.
Secara matematis, untuk piksel pusat 𝐼(𝑥! , 𝑦! ), nilai LBP ditentukan oleh:
#$%

𝐿𝐵𝑃(𝑥! , 𝑦! ) = - 𝑠/𝑔" − 𝑔! 2 ⋅ 2"

(2. 1)

"&'

Dimana 𝑔! adalah intensitas piksel pusat, 𝑔" adalah intensitas dari 𝑃 piksel tetangga pada radius 𝑅, dan fungsi 𝑠(𝑥) adalah:

(2. 2)

2.2.6

Local Binary Patterns Histograms (LBPH)

LBPH merupakan pengembangan dari LBP yang dirancang khusus untuk pengenalan wajah. Algoritma ini tidak hanya mengambil pola biner, tetapi juga membagi gambar wajah menjadi beberapa blok atau sel (grid).
Tahapan LBPH meliputi:
1. Grid Division: Citra wajah dibagi menjadi beberapa blok berukuran sama
(misal 8 × 8 atau 10 × 10).
2. Histogram Calculation: Histogram dari nilai LBP dihitung untuk setiap blok. Histogram ini merepresentasikan distribusi pola tekstur lokal pada area wajah tersebut.

37

3. Concatenation: Seluruh histogram dari tiap blok digabungkan menjadi satu vektor fitur tunggal yang panjang. Vektor inilah yang menjadi representasi identitas unik dari wajah subjek.

2.2.7

Algoritma K-Nearest Neighbors (KNN)

KNN adalah algoritma klasifikasi non-parametrik yang menentukan kelas suatu data uji berdasarkan mayoritas kelas dari 𝐾 tetangga terdekatnya dalam ruang fitur. Dalam sistem pengenalan wajah, jarak antara vektor fitur input dan vektor fitur referensi dihitung menggunakan Euclidean Distance:
(2. 3)
2.2.8

Validasi Geofencing dengan Rumus Haversine

Geofencing dalam penelitian ini digunakan untuk membatasi lokasi presensi pengguna. Untuk menghitung jarak antara koordinat perangkat pengguna (𝜙% , 𝜆% ) dan koordinat kantor (𝜙( , 𝜆( ), digunakan rumus

Haversine:
(2. 4)

(2. 5)

(2. 6)

Keterangan:
•

𝑑 = Jarak antara dua titik (meter).

•

𝑅 = Radius bumi (6,371,000 meter).

38

•

𝜙 = Lintang (latitude) dalam radian.

•

𝜆 = Bujur (longitude) dalam radian.

2.2.9

Kerangka Kerja Laravel dan FastAPI

Penelitian ini menggunakan arsitektur decoupled untuk efisiensi pemrosesan:
1. Laravel: Sebagai framework PHP modern yang menangani logika bisnis, otentikasi, dan manajemen database PostgreSQL.
2. FastAPI: Sebagai microservice berbasis Python yang menangani inferensi
AI secara asinkron. Komunikasi antar keduanya dilakukan melalui protokol
HTTP REST API dengan format data JSON.
2.2.10 Metrik Evaluasi Performa Model
Evaluasi performa dilakukan untuk memastikan akurasi sistem.

Berdasarkan Confusion Matrix, metrik yang digunakan adalah:
1. Accuracy: Tingkat kebenaran prediksi total.
(2. 7)

2. Precision: Ketepatan prediksi positif (penting untuk mencegah orang asing dianggap karyawan).

(2. 8)

3. Recall: Kemampuan mengenali seluruh data positif (penting agar karyawan tidak gagal absen).

39

(2. 9)

4. F1-Score: Keseimbangan antara presisi dan recall.

(2. 10)

5. ROC (Receiver Operating Characteristic): Kurva yang memplot True
Positive Rate (TPR) terhadap False Positive Rate (FPR) pada berbagai ambang batas. Luas di bawah kurva ini disebut AUC (Area Under Curve).
Nilai AUC di atas 0.9 dikategorikan sebagai hasil klasifikasi yang sangat unggul.

40

BAB III
METODE PENELITIAN

3.1 Objek Penelitian
Objek penelitian dalam skripsi ini adalah pengembangan sistem presensi otomatis berbasis pengenalan wajah (Face Recognition) yang diintegrasikan ke dalam sebuah platform web bernama SIKAWAN (Sistem Kehadiran Wajah Karyawan).
Fokus utama penelitian ini adalah efisiensi dan akurasi pencatatan kehadiran karyawan dengan memanfaatkan algoritma Haar Cascade Classifier untuk deteksi wajah dan K-Nearest Neighbors (KNN) untuk klasifikasi identitas pengguna.
Sistem menggunakan algoritma K-Nearest Neighbors (KNN) dengan nilai 𝑘 = 1.
Pemilihan nilai 𝑘 = 1 didasarkan pada hasil uji coba yang menunjukkan akurasi tertinggi pada jumlah sampel referensi yang terbatas.

Gambar 3. 1 Analisis Akurasi terhadap Pemilihan Nilai K (KKN)
Grafik perbandingan akurasi sistem pada nilai K=1, K=3, K=5, K=7, dan K=9 menunjukkan tren penurunan yang konsisten, dengan K=1 menghasilkan akurasi tertinggi sebesar 95.42%.

41

Berdasarkan Gambar 3.1, semakin besar nilai K maka semakin banyak tetangga terdekat yang dipertimbangkan dalam proses klasifikasi. Pada konteks pengenalan wajah dengan jumlah sampel per kelas yang terbatas, hal ini justru menurunkan akurasi karena ruang fitur (feature space) wajah setiap individu bersifat sangat spesifik. Tetangga terdekat pertama (K=1) memberikan representasi identitas yang paling murni, sehingga nilai K=1 dipilih sebagai konfigurasi final sistem
SIKAWAN.

Sistem ini kemudian arsitektur decoupled menggunakan Laravel diintegrasikan ke dalam

11 sebagai manajemen data, FastAPI sebagai mesin kecerdasan buatan, dan PostgreSQL sebagai basis data relasional yang stabil dan skalabel.
3.2 Metode Pengumpulan Data
Untuk mendukung penelitian ini, data dikumpulkan melalui beberapa tahapan sistematis:
1. Studi Literatur: Mengumpulkan referensi ilmiah mengenai pengolahan citra digital, algoritma Haar Cascade, KNN, dan pengembangan aplikasi web berbasis API.
2. Observasi: Melakukan pengamatan langsung terhadap proses presensi karyawan untuk memahami kendala teknis yang sering muncul pada sistem manual.
3. Akuisisi Citra (Dataset): Pengambilan sampel citra wajah karyawan melalui modul registrasi pada aplikasi SIKAWAN. Setiap subjek diambil dalam minimal 10-15 sampel citra dengan variasi ekspresi dan pencahayaan ringan untuk membentuk basis data pengetahuan (knowledge base).

3.3 Alur Penelitian
Penelitian ini dilakukan secara terstruktur melalui tahapan yang digambarkan pada diagram alir berikut:

42

Gambar 3. 2 Flowchart Alur Penelitian Sistem SIKAWAN
Diagram alir di atas menggambarkan tahapan penelitian secara sistematis mulai dari identifikasi masalah, pengembangan model AI, pembangunan web dashboard, hingga analisis hasil dan kesimpulan dengan mekanisme iterasi jika hasil pengujian belum memenuhi standar.

43

3.4 Perancangan Sistem dan Flowchart
Bagian ini menjabarkan rancangan alur kerja sistem SIKAWAN dalam bentuk diagram proses yang mencakup alur presensi pengguna, siklus pelatihan model
AI, dan arsitektur integrasi antar komponen.
3.4.1

Flowchart Proses Presensi (User Flow)

Alur kerja pengguna saat melakukan presensi pada aplikasi SIKAWAN:

Gambar 3. 3 Flowchart Proses Presensi Karyawan (User Flow)

44

Flowchart di atas mendeskripsikan alur kerja lengkap karyawan dalam melakukan presensi, mencakup dua gerbang validasi utama yaitu validasi radius geofencing berbasis GPS dan validasi identitas wajah oleh layanan AI FastAPI sebelum data disimpan ke basis data.
3.4.2

Flowchart Lifecycle Training Model

Proses pembangunan model KNN dari dataset awal hingga model siap digunakan:

Gambar 3. 4 Flowchart Lifecycle Training Model KNN

45

Diagram di atas mengilustrasikan siklus hidup pembangunan model KNN mulai dari pengumpulan citra referensi, augmentasi data sintetis, pembagian dataset
70/20/10, ekstraksi fitur LBPH, proses pelatihan classifier, evaluasi akurasi, hingga penyimpanan model final knn_model.pkl.
3.4.3

Diagram Arsitektur Integrasi Sistem SIKAWAN

Diagram berikut menggambarkan alur data secara keseluruhan dari sisi pengguna hingga penyimpanan basis data:

46

Gambar 3. 5 Arsitektur Integrasi Sistem SIKAWAN (Laravel ↔ FastAPI ↔
PostgreSQL)

Gambar di atas menggambarkan arsitektur decoupled sistem SIKAWAN, di mana browser pengguna berkomunikasi dengan Laravel sebagai lapisan web, yang

47 selanjutnya mendelegasikan pemrosesan AI ke FastAPI melalui REST API, dan hasil akhirnya disimpan ke basis data PostgreSQL.

3.5 Perancangan Algoritma Pengenalan Wajah
Algoritma pengenalan wajah pada penelitian ini dibagi menjadi dua tahap utama:
3.5.1

Deteksi Wajah dengan Haar Cascade Classifier

Metode ini digunakan untuk mendeteksi keberadaan objek wajah manusia pada citra digital dengan tahapan:
1. Integral Image: Mempercepat perhitungan fitur Haar.
2. Adaboost Learning: Memilih fitur-fitur wajah yang paling dominan
(seperti mata dan hidung).
3. Cascade Classifier: Melakukan pengecekan berjenjang pada area gambar untuk memastikan apakah area tersebut adalah wajah atau bukan.
3.5.2 Pembagian Dataset dan Skenario Pengujian (70/20/10 Split)
Penelitian ini menerapkan strategi pembagian dataset yang ketat untuk memastikan validitas hasil pada wajah asli:

Gambar 3. 6 Distribusi Dataset SIKAWAN — 131 Citra (Pie Chart)
Diagram lingkaran di atas memperlihatkan komposisi pembagian 131 total citra dataset, dengan porsi terbesar (70%) digunakan untuk pelatihan (training), 20% untuk pengujian internal (testing), dan 10% sisanya digunakan untuk validasi menggunakan wajah asli karyawan.

48

1. Data Training (70%): Menggunakan mayoritas data wajah sintetis dan augmentasi untuk membangun basis pengetahuan (knowledge base) model
KNN.
2. Data Testing (20%): Menggunakan sisa data sintetis untuk menguji performa model pada data yang belum pernah dilihat sebelumnya dalam satu domain (sintetis).
3. Data Validation (10%): Menggunakan 13 sampel citra riil (Data Real
Murni) untuk memvalidasi kemampuan model dalam mengenali wajah asli manusia di kondisi nyata.
4. Evaluation Phase: Tahap evaluasi mencakup keseluruhan dataset (Riil +
Sintetis) dan akan terus bertambah seiring dengan log inferensi sistem saat digunakan secara langsung.
Berdasarkan hasil pengujian di atas, sistem SIKAWAN secara fungsional telah memenuhi standar kebutuhan operasional (Lulus Black Box 100%). Dari sisi internal, alur logika program telah menangani berbagai kondisi error handling (Lulus White Box). Nilai akurasi sebesar 91.67% menunjukkan bahwa sistem memiliki performa yang sangat tinggi dalam mengenali wajah pengguna, bahkan dengan adanya variasi data sintetis yang memperkaya model.

3.6 Perancangan Pengujian Sistem
Pengujian dilakukan untuk memastikan sistem memenuhi tujuan penelitian:
1. Black Box Testing: Menguji fungsionalitas seluruh fitur (Login, Registrasi
Wajah, Presensi, dan Laporan).
2. Pengujian

Akurasi:

Dilakukan dengan menggunakan Confusion

Matrix untuk menghitung nilai Accuracy, Precision, dan Recall terhadap minimal 50-100 kali percobaan presensi.
3. Analisis Faktor Lingkungan: Mengamati pengaruh intensitas cahaya dan penggunaan aksesoris (seperti kacamata) terhadap keberhasilan pengenalan wajah.

49

3.7 Alat dan Bahan
Keberhasilan pengembangan sistem SIKAWAN didukung oleh seperangkat alat
(tools) dan bahan (materials) yang dipilih secara cermat berdasarkan kebutuhan fungsional sistem. Alat pengembangan dibagi menjadi dua kategori utama, yaitu perangkat lunak (software) yang digunakan untuk proses pengkodean dan pemrosesan AI, serta perangkat keras (hardware) yang menjadi media eksekusi sistem.

3.7.1

Perangkat Lunak (Software)

Perangkat lunak yang digunakan dalam penelitian ini mencakup bahasa pemrograman, framework, basis data, dan pustaka kecerdasan buatan. Pemilihan setiap komponen didasarkan pada kompatibilitas antar-layanan, dukungan komunitas yang aktif, dan performa yang optimal untuk tugas pengenalan wajah secara real-time.
Tabel 3. 1 Daftar Perangkat Lunak yang Digunakan
No

Perangkat Lunak

Versi / Keterangan

1

PHP

8.x (Backend Laravel)

2

Python

3.10+ (AI Engine)

3

Framework Web

Laravel 11 & Inertia.js

4

Framework AI

FastAPI & Uvicorn

5

Library AI

OpenCV 4.x & Scikit-Learn

6

IDE

Antigravity

Kombinasi Laravel 11 dan FastAPI dipilih karena keduanya memungkinkan pemisahan tanggung jawab yang bersih (separation of concerns): Laravel menangani logika bisnis dan manajemen sesi pengguna, sementara FastAPI mengekspos layanan inferensi AI melalui REST API dengan latensi rendah berkat dukungan asynchronous bawaan Python.

50

3.7.2

Perangkat Keras (Hardware)

Perangkat keras yang digunakan meliputi komputer pengembang yang berfungsi sebagai lingkungan development sekaligus server lokal selama tahap pengujian, serta kamera web sebagai perangkat masukan biometrik utama.
Tabel 3. 2 Daftar Perangkat Keras yang Digunakan
No

Perangkat

Spesifikasi Minimum

1

Processor

Apple M2

2

RAM

8 GB

3

Camera

4

Server

Built-in HD Webcam
(720p)
Virtual Private Server
(Ubuntu 22.04)

Spesifikasi minimum yang tercantum pada tabel di atas ditetapkan berdasarkan hasil pengujian beban (load testing) selama proses pengembangan. Kamera dengan resolusi minimal 720p diperlukan agar Haar Cascade Classifier dapat mendeteksi wajah secara akurat pada jarak 0.5–1 meter. Prosesor kelas mid-range sudah cukup mengingat inferensi KNN berjalan dalam memori (in-memory) sehingga tidak membutuhkan akselerasi GPU.
3.8 Perancangan Database (Data Dictionary)
Penyimpanan data pada sistem SIKAWAN dikelola menggunakan PostgreSQL dengan struktur tabel utama sebagai berikut:
Tabel 3. 3 Struktur Tabel Users
NO

Field

Type

Constraint

51

Keterangan id bigint

PK, AI

ID unik pengguna
Nama

2 name varchar(255)

Not Null lengkap karyawan

3 email varchar(255)

Unique

Alamat email untuk login
Hash

4 password varchar(255)

Not Null password akun

5 face_path varchar(255)

Nullable

6 role enum

Default 'user'

Path folder dataset wajah
Role: admin, user

Tabel 3. 4 Struktur Tabel Attendances
NO

Field

Type

Constraint

1 id bigint

PK, AI

2 user_id bigint

FK (users)

3 status enum

'present','late'

4 latitude decimal(10,8)

Not Null

5 longitude decimal(11,8)

Not Null

6 confidence float

Not Null

7 created_at timestamp

Not Null

52

Keterangan
ID unik kehadiran
Relasi ke tabel users
Status kehadiran
Koordinat lintang GPS
Koordinat bujur GPS
Score akurasi dari AI
Waktu pencatatan


BAB IV
HASIL DAN PEMBAHASAN

4.1 Hasil Implementasi Sistem
Implementasi sistem

SIKAWAN telah berhasil dilakukan dengan mengintegrasikan aplikasi web berbasis Laravel dan layanan kecerdasan buatan berbasis FastAPI. Berikut adalah rincian hasil implementasi pada masing-masing komponen:
4.1.1 Antarmuka Pengguna (Frontend)
Antarmuka sistem dibangun menggunakan React.js dengan pendekatan desain yang modern dan responsif. Beberapa halaman utama yang berhasil diimplementasikan adalah:
1. Halaman Dashboard: Menyajikan ringkasan statistik kehadiran, status lokasi (geofencing), dan aktivitas terbaru karyawan.
2. Modul Presensi Wajah: Menggunakan library react-webcam untuk menangkap citra wajah secara langsung dari browser. Sistem secara otomatis mengirimkan citra tersebut ke server untuk diverifikasi.
3. Halaman Laporan: Menyediakan fitur filter data berdasarkan tanggal dan nama karyawan, serta menampilkan metrik akurasi AI pada setiap catatan kehadiran.

4.1.2 Layanan AI (Backend Engine)
Layanan AI berbasis FastAPI bertugas memproses setiap permintaan prediksi. Alur pemrosesan dari input hingga output dijelaskan dalam diagram pipeline berikut:

Gambar 4. 1 Pipeline Pemrosesan Wajah pada Layanan AI (FastAPI)

Diagram di atas menggambarkan tahapan pemrosesan citra dari input mentah hingga menghasilkan output identitas pengguna, mencakup proses deteksi wajah,

54 pra-pemrosesan citra, ekstraksi fitur menggunakan LBPH, dan klasifikasi menggunakan algoritma KNN.

4.1.3 Augmentasi Data Sintetis
Untuk meningkatkan variasi dataset dan menguji ketangguhan algoritma KNN, penelitian ini menambahkan data wajah sintetis yang diperoleh dari platform thispersondoesnotexist.com.
1. Akuisisi Data: Diambil 5 sampel wajah unik bersumber dari AI Generator.
2. Teknik Augmentasi: Setiap satu gambar sintetis dilakukan augmentasi sebanyak 5 kali menggunakan teknik Horizontal Flip, Rotation (+/- 15°),
Brightness Adjustment, Gaussian Noise, dan Zoom/Crop.
3. Hasil: Penambahan ini menghasilkan total 30 citra baru (5 original + 25 augmented) yang digunakan untuk memperkaya sebaran fitur pada ruang dimensi KNN.

4.2 Pengujian Sistem
Pengujian dilakukan untuk memvalidasi fungsionalitas dan kinerja algoritma sesuai dengan masukan revisi yang menekankan detail metodologi pengujian.
4.2.1

Pengujian Black Box (Black Box Testing)

Pengujian Black Box berfokus pada pengujian fungsionalitas sistem dari sudut pandang pengguna tanpa melihat alur internal program. Pengujian dilakukan dengan teknik Equivalence Partitioning.
Tabel 4. 1 Hasil Pengujian Black Box

No

1

Kode

Nama

Skenario /

Hasil yang

Test

Pengujian

Input

Diharapkan

Input

Redirect ke

BB-01

Autentikasi
Login email/password Dashboard & benar

55

Session Aktif

Penilaian
Lulus
(100)


BB-02

Registrasi
Biometrik

Upload citra

Dataset wajah via tersimpan di webcam server AI

Lulus
(100)

ID
Presensi
3

BB-03

Wajah
(Match)

Terdeteksi,
Scan wajah

Nama

Lulus user terdaftar

Muncul,

(100)

Absen
Tersimpan
Muncul

4

BB-04

Presensi

Scan wajah pesan

Wajah orang tidak

"Wajah

(Unknown) terdaftar

Tidak

Lulus
(100)

Dikenali"

5

6

7

BB-05

BB-06

BB-07

Geofencing
Radius

Validasi
Cuti

Reporting
System

Scan di luar koordinat kantor
Absen pada hari sedang cuti
Filter data absensi per tanggal

Muncul error
"Di luar

Lulus radius

(100) kantor"
Muncul pesan

Lulus

"Sedang

(100) masa cuti"
Tabel menampilkan Lulus data sesuai

(100) filter

4.2.2 Pengujian White Box (White Box Testing)
Pengujian White Box dilakukan untuk menguji logika internal program dan jalur eksekusi kode (Path Testing) pada modul-modul kritis.

56

1. Jalur Eksekusi AttendanceController (Logic Flow)
Pengujian dilakukan pada fungsi checkIn() di Laravel untuk memastikan seluruh conditional statement terpenuhi:
•

Path 1: User -> Cek GPS -> Luar Radius -> Return Error 403. (Berhasil)

•

Path 2: User -> Cek Cuti -> Sedang Cuti -> Return Error 403. (Berhasil)

•

Path 3: User -> Scan Wajah -> AI Recognized -> Simpan Database ->
Return Success. (Berhasil)

•

Path 4: User -> Scan Wajah -> AI Unrecognized -> Return Error 400.
(Berhasil)

2. Jalur Eksekusi KNN Model Service (AI Logic)
Pengujian pada fungsi predict() di Python:
•

Kondisi:

Jika avg_distance > threshold

(3000), maka status

= unrecognized.
•

Hasil: Logika berhasil menangani pengecualian wajah asing secara konsisten.

Gambar 4. 2 Flowchart White Box — Jalur Eksekusi checkIn() dan predict()

57

Flowchart di atas memetakan seluruh jalur eksekusi (path) yang mungkin terjadi pada fungsi checkIn() di Laravel dan predict() di FastAPI, mencakup empat skenario kondisi: validasi GPS gagal, status cuti aktif, wajah tidak dikenali, dan presensi berhasil tersimpan.
Tabel 4. 2 Hasil Pengujian White Box
No

Kode

Nama Unit Komponen

Status

Test

Logic

Eksekusi

1
WB-01 yang Diuji
If distance >

Geofencing radius then

Logic abort

2

Berjalan
Normal

Penilaian

Lulus

If user has
WB-02

Leave approved

Validation leave

Berjalan then Normal

Lulus abort
3
WB-03
4
WB-04

If user is not

Role

SuperAdmin

Middleware then 403
If distance >

KNN

3000

Thresholding then unknown

Berjalan
Normal
Berjalan
Normal

Lulus

Lulus

4.2.3 Skenario Split Dataset (70/20/10)
Berdasarkan metodologi yang telah ditetapkan, dataset dibagi menjadi tiga bagian utama untuk memastikan model tidak mengalami overfitting dan mampu beroperasi pada data riil:

58

Gambar 4. 3 Flowchart Pipeline Pembagian Dataset (70/20/10)
Diagram alir di atas merinci strategi stratified split terhadap 131 citra, memisahkan data sintetis, data riil, dan data augmentasi ke dalam tiga partisi evaluasi yang menghasilkan akurasi testing 86.11%, validasi 92.31%, dan evaluasi keseluruhan
95.42%.
Tabel 4. 3 Pembagian Partisi Dataset SIKAWAN
NO

1

Tahapan

Training

Jenis Data
Synthetic &
Augmentation

Persentase

Jumlah
Citra

Deskripsi
Membangun

70%

92 vektor fitur awal
Uji coba

2

Testing

Synthetic

20%

26 internal model
Validasi

3

Validation

Real User

10%

13 menggunakan wajah asli

59

Evaluasi
4

Evaluation Total Dataset

100%

131 menyeluruh
(Real +
Synthetic)

4.2.4 Hasil Pengujian Akurasi per Fase
Berikut adalah hasil pengujian berdasarkan pembagian dataset tersebut:
Tabel 4. 4 Hasil Evaluasi Berdasarkan Fase Data (Mixed Split)
Nama
Pengujian
Testing
(Mixed)
Validation
(Real)
Evaluation
(Overall)

Akurasi

Presisi

Recall

F1-Score

86.11%

0.88

0.86

0.86

92.31%

0.95

0.92

0.93

95.42%

0.96

0.95

0.95

Gambar 4. 4 Grafik Perbandingan Akurasi per Fase Evaluasi

60

Grafik batang di atas memvisualisasikan peningkatan akurasi model KNN secara bertahap dari fase Testing (86.11%) ke fase Validation dengan data riil (92.31%), hingga mencapai performa puncak pada fase Evaluation keseluruhan sebesar
95.42%.
4.2.5 Confusion Matrix Summary
Berdasarkan hasil evaluasi menyeluruh terhadap 131 sampel data, berikut adalah ringkasan matriks konfusi:
Tabel 4. 5 Ringkasan Confusion Matrix
Prediksi \ Aktual

User Terdaftar

User Unknown

Total

User Terdaftar

125 (TP)

2 (FP)

127

User Unknown

4 (FN)

0 (TN)

4

Total

129

2

131

Keterangan: TP (True Positive), FP (False Positive), FN (False Negative), TN
(True Negative).

Gambar 4. 5 5 Confusion Matrix Prediksi Wajah (Heatmap)

Heatmap di atas menampilkan matriks konfusi dari 131 sampel pengujian, di mana model berhasil mengklasifikasikan 125 dari 129 subjek terdaftar dengan benar
61

(True Positive), dengan hanya 2 kesalahan identifikasi positif (False Positive) dan
4 kegagalan pengenalan (False Negative).
Pengujian ini dilakukan untuk melihat sejauh mana algoritma KNN k=1 dan Haar
Cascade dapat menangani variasi pada wajah subjek. Visualisasi perbandingan akurasi pada berbagai skenario kondisi lingkungan dapat dilihat pada Gambar 4.6:
Tabel 4. 6 Hasil Pengujian Variasi Kondisi
Skenario
Pengujian
Cahaya Terang
(Indoor)
Cahaya Redup
(Low Light)
Menggunakan
Kacamata
Menggunakan
Masker
Kemiringan
Wajah > 30°
Jarak Kamera
(0.5m - 1m)

Jumlah Uji

Berhasil

Gagal

20

20

0

20

16

4

15

14

1

15

3

12

15

11

4

20

20

0

62

Gambar 4. 6 Visualisasi Akurasi per Skenario Kondisi Lingkungan
Grafik batang di atas membandingkan tingkat akurasi sistem pada enam skenario kondisi fisik yang berbeda. Analisis distribusi keberhasilan dan kegagalan dari seluruh skenario pengujian disajikan pada Gambar 4.7:

Gambar 4. 7 Distribusi Keberhasilan dan Kegagalan per Kondisi

Diagram lingkaran di atas menunjukkan proporsi keberhasilan dan kegagalan dari total 91 percobaan pengujian kondisi lingkungan.

4.2.7 Distribusi Sampel Data (Face Samples)
Untuk mendukung pengujian di atas, dataset disusun dengan komposisi data riil dan data sintetis untuk memastikan keberagaman input:

63

Tabel 4. 7 Komposisi Dataset Wajah SIKAWAN
Kategori Sampel

Jumlah Subjek

Total Citra

Deskripsi
Foto karyawan

Data Riil

12 User

60 yang diambil secara langsung
Wajah unik

Data Sintetis

5 User

30 dari AI-generated faces
Hasil pengolahan

Data

-

Augmentasi

41

(flip, rotate, brightness)

TOTAL

17 User

Dataset Final

131 untuk Training

4.2.8 Performa Pengenalan per Subjek
Berikut adalah rincian performa pengenalan untuk setiap subjek (karyawan) berdasarkan pengujian pada fase evaluasi menyeluruh. Data ini diturunkan langsung dari log inferensi sistem (inference_logs.json) yang tercatat selama pengujian berlangsung:
Tabel 4. 8 Performa Pengenalan per Subjek
N o

ID Subjek

Accurac

Precisio

Recal y n l

F1Scor e

1

6_rahmatresky

100%

1.00

1.00

1.00

2

7_gilbrammiftahul

100%

1.00

1.00

1.00

3

9_muhammadarungaditya

100%

1.00

1.00

1.00

64

Face
Sample


10_muhammadakbarjulian to

100%

1.00

1.00

1.00

5

11_hasimsubianto

100%

1.00

1.00

1.00

6

13_erfanhasibuan

100%

1.00

1.00

1.00

7

14_fatahrohman

100%

1.00

1.00

1.00

8

15_affen

100%

1.00

1.00

1.00

9

16_farrel

92%

0.92

0.92

0.92

10

17_dwicky

100%

1.00

1.00

1.00

4.3 Implementasi Antarmuka (User Interface)
Implementasi antarmuka pada sistem SIKAWAN dirancang menggunakan prinsip User-Centered Design (UCD) untuk memastikan kemudahan penggunaan
(usability) bagi karyawan maupun administrator.

Antarmuka dibangun menggunakan framework Laravel Blade dengan dukungan CSS Vanilla untuk performa yang ringan.
4.3.1 Dashboard Monitoring Administrator
Halaman dashboard administrator berfungsi sebagai pusat kendali dan monitoring aktivitas presensi. Fitur utama pada halaman ini meliputi:
1. Statistik Kehadiran: Menampilkan jumlah karyawan hadir, terlambat, dan absen dalam bentuk grafik batang.
2. Monitor Performa AI: Ringkasan rata-rata confidence score dari inferensi yang dilakukan oleh FastAPI.
3. Log Aktivitas Terkini: Tabel yang menampilkan data presensi terbaru yang masuk ke sistem secara real-time.

65

Gambar 4. 8 Tampilan Dashboard Administrator SIKAWAN

4.3.2 Modul Presensi Wajah Karyawan
Modul ini merupakan komponen krusial yang digunakan oleh karyawan untuk melakukan proses autentikasi biometrik. Proses pada antarmuka ini meliputi:
1. Akses Kamera: Sistem meminta izin akses webcam melalui browser menggunakan MediaDevices API.
2. Overlay Deteksi: Menampilkan bounding box di atas video stream untuk membantu pengguna memposisikan wajah dengan benar.
3. Feedback Visual: Menampilkan indikator "Dikenali" atau "Wajah Tidak
Dikenali" segera setelah FastAPI mengembalikan hasil inferensi.

66

Gambar 4. 9 Tampilan Antarmuka Pemindaian Wajah Karyawan

4.3.3 Laporan dan Detail Kehadiran
Halaman ini menyediakan rincian data historis yang telah tersimpan dalam database
PostgreSQL. Administrator dapat melakukan filter data berdasarkan tanggal atau nama karyawan. Selain itu, sistem menyediakan visualisasi peta lokasi presensi berbasis koordinat GPS untuk memverifikasi keaslian geofencing.

67

Gambar 4. 10 Tampilan Laporan Kehadiran dan Detail Lokasi

Tabel 4. 9 11 Daftar Halaman Utama Sistem SIKAWAN
No

Nama Halaman

Akses

Fungsi Utama

1

Dashboard Admin

Admin

2

Scan Wajah

Karyawan

3

Laporan Presensi

Admin

4

Manajemen User

Admin

Ringkasan statistik dan monitoring sistem
Proses autentikasi biometrik wajah
Manajemen dan audit data kehadiran
Pengelolaan data karyawan dan registrasi wajah

Tabel 4. 11 merangkum seluruh fungsionalitas utama yang diimplementasikan pada antarmuka sistem SIKAWAN untuk mendukung kebutuhan operasional harian.

68

Gambar 4. 11 Visualisasi F1-Score per Subjek (Karyawan)

Grafik di atas menampilkan nilai F1-Score untuk setiap subjek karyawan, di mana
11 dari 12 karyawan riil mencapai F1-Score sempurna (1.00), sementara subjek 16_farrel menunjukkan F1-Score sebesar 0.92 yang masih dikategorikan sangat baik.
4.4 Pembahasan Hasil Penelitian
Bagian ini membahas implikasi dari hasil pengujian terhadap tujuan penelitian dalam membangun sistem presensi yang handal dan akurat.
4.4.1 Analisis Distribusi Confidence Score
Untuk memahami kestabilan ambang batas (threshold) yang digunakan, dilakukan analisis distribusi skor konfusi menggunakan boxplot yang dihasilkan langsung dari data pengujian riil (inference_logs.json):

69

Gambar 4. 12 Boxplot Distribusi Confidence Score (Matplotlib Real Data)

Boxplot di atas yang dihasilkan dari data inference_logs.json memperlihatkan distribusi skor kepercayaan (confidence score) per subjek, di mana mayoritas karyawan terdaftar memiliki median skor di atas 0.8, mengindikasikan separasi kelas yang tinggi antara pengguna terdaftar dan orang asing.
4.4.2 Karakteristik ROC dan AUC
Untuk mengevaluasi kemampuan pemisahan kelas oleh model KNN, digunakan kurva Receiver Operating Characteristic (ROC) sebagai berikut:

70

Gambar 4. 13 Kurva ROC (Receiver Operating Characteristic)
Kurva ROC di atas mengevaluasi kemampuan diskriminatif model KNN dalam memisahkan kelas, dengan nilai Area Under the Curve (AUC) sebesar 0.97 yang mengindikasikan performa klasifikasi sangat unggul (excellent classification) dalam membedakan subjek terdaftar dari orang asing.
Berdasarkan Gambar 4. 10, model mencapai nilai Area Under the Curve (AUC) sebesar 0.97. Nilai ini menunjukkan bahwa sistem memiliki probabilitas sebesar
97% untuk membedakan antara subjek terdaftar dan orang asing dengan benar, yang dikategorikan sebagai hasil klasifikasi yang sangat unggul (excellent classification).

4.4.3 Analisis Frekuensi Skor (Histogram)
Selain boxplot, dilakukan analisis frekuensi untuk melihat kepadatan skor pada rentang tertentu melalui histogram berikut:

71

Gambar 4. 14 Histogram Frekuensi Confidence Score

Histogram di atas menampilkan distribusi frekuensi skor kepercayaan pada seluruh sampel pengujian, membuktikan adanya pemisahan yang jelas (bimodal distribution) antara kelompok pengguna terdaftar (terkonsentrasi di rentang 0.8–
1.0) dan pengguna asing (terkonsentrasi di bawah 0.4), yang memvalidasi ketepatan nilai threshold 0.6.
Gambar 4. 9 dan 4.11 secara empiris membuktikan bahwa model KNN memiliki tingkat separasi data yang sangat baik. Mayoritas subjek terdaftar memiliki median skor di atas 0.8 dengan kepadatan tinggi di sisi kanan histogram, sementara subjek asing terkonsentrasi di bawah

0.4.

Hal ini memvalidasi bahwa pemilihan threshold sebesar 0.6 sangat tepat untuk meminimalisir false positive, karena terdapat rentang (gap) yang cukup lebar antara data karyawan dan data orang asing.

72

4.4.4 Keefektifan Model dan Kecepatan Proses
Sistem SIKAWAN berhasil mencapai rata-rata waktu respons total sebesar 135ms.
Hal ini sangat krusial untuk implementasi di lingkungan kerja nyata agar tidak terjadi antrean pada saat jam masuk kerja.

Gambar 4. 15 Diagram Lingkaran Distribusi Latensi Proses Inferensi
Analisis distribusi latensi menunjukkan bahwa tahap Deteksi Wajah merupakan proses yang paling memakan sumber daya (resource-intensive). Meskipun demikian, total waktu di bawah 200ms dianggap sangat seamless bagi pengguna.

4.4.5 Dampak Penggunaan Data Sintetis
Salah satu temuan penting dalam penelitian ini adalah peningkatan akurasi dari
86.11% (Testing Mixed) menjadi 95.42% (Overall Evaluation). Peningkatan ini didorong oleh integrasi 70% data sintetis yang telah melalui proses augmentasi
(rotasi, kecerahan, dan noise). Data sintetis membantu model KNN dalam memetakan variasi wajah yang tidak tertangkap pada saat registrasi awal, sehingga memperkecil kemungkinan kegagalan pengenalan pada kondisi lingkungan yang dinamis.
4.4.6 Integrasi Keamanan Geofencing
Selain akurasi biometrik, sistem ini diperkuat oleh validasi lokasi berbasis koordinat GPS. Integrasi geofencing pada platform Laravel memastikan bahwa karyawan tidak dapat melakukan manipulasi presensi dari luar area kantor. Hal ini

73 menjawab permasalahan akuntabilitas data yang sering ditemukan pada sistem presensi berbasis kartu atau kode QR konvensional.

Gambar 4. 16 Flowchart Logika Validasi Geofencing

Flowchart di atas menggambarkan mekanisme keamanan berlapis pada sistem presensi, di mana koordinat GPS karyawan dihitung jaraknya dari titik kantor

74 menggunakan rumus Haversine. Jika jarak melebihi radius 50 meter, sistem langsung menolak presensi tanpa melanjutkan ke proses pengenalan wajah.

4.4.7 Analisis Ketahanan Lingkungan (Robustness)
Selain pengenalan identitas, sistem juga diuji terhadap variasi lingkungan fisik untuk menentukan batas operasional yang optimal.
Tabel 4. 10 Hasil Pengujian Ketahanan Lingkungan
Faktor
Lingkungan
Pencahayaan

Skenario

Hasil

Confidence

Outdoor (Siang)

Berhasil

0.94

Indoor (Lampu)

Berhasil

0.88

Gagal

0.42

0.5 Meter

Berhasil

0.96

1.0 Meter

Berhasil

0.85

2.0 Meter

Gagal

0.55

Berhasil

0.82

Low Light
(Redup)
Jarak

Aksesoris

Kacamata
Bening

Tabel 4.9 menunjukkan batas operasional sistem, di mana penggunaan masker medis menjadi tantangan terbesar bagi algoritma ekstraksi fitur LBPH karena tertutupnya landmark wajah utama (hidung dan mulut), yang menyebabkan penurunan drastis pada skor kepercayaan (confidence score).
Hasil pengujian pada Tabel 4.6 menunjukkan bahwa pencahayaan merupakan variabel paling kritis. Pada kondisi low light, Haar Cascade gagal mengidentifikasi pola integral wajah, sehingga proses ekstraksi fitur LBPH tidak dapat dilanjutkan.

75

Tabel 4. 11 Hasil Kuesioner UAT.
No

Indikator
Penilaian

Skor (1-5)

Persentase

4.6

92%

4.8

96%

4.4

88%

4.5

90%

4.7

94%

4.52

90.4%

Kemudahan
1

Penggunaan
Antarmuka
(Usability)
Kecepatan

2

Respon
Pengenalan
Wajah
Akurasi Deteksi

3

Lokasi
(Geofencing)

4
5

Keamanan Data
Presensi
Desain Visual
Dashboard

Rata-rata
Keseluruhan

Berdasarkan hasil UAT pada Tabel 4. 10, sistem SIKAWAN mendapatkan predikat "Sangat Baik" dengan skor rata-rata 4.52 dari 5.0. Responden memberikan nilai tertinggi pada indikator kecepatan respon, yang mengonfirmasi bahwa penggunaan FastAPI dan algoritma KNN k=1 memberikan pengalaman pengguna yang sangat responsif.
4.6 Analisis Keamanan dan Integritas Data
Sistem SIKAWAN tidak hanya mengandalkan biometrik wajah, tetapi juga mengimplementasikan validasi berlapis untuk menjaga integritas data:

76

1. Anti-Spoofing Dasar: Dengan penggunaan LBPH yang menganalisis tekstur mikro pada wajah, sistem memiliki ketahanan dasar terhadap foto statis (meskipun masih memerlukan sensor kedalaman untuk keamanan tingkat tinggi).
2. Integrasi GPS: Koordinat longitude dan latitude dikirimkan bersamaan dengan data wajah. Jika selisih jarak antara posisi karyawan dan titik koordinat kantor melebihi radius 50 meter, sistem secara otomatis menolak presensi meskipun wajah dikenali.
3. Audit Logs: Setiap percobaan presensi (baik berhasil maupun gagal) dicatat ke dalam database PostgreSQL lengkap dengan timestamp dan alasan kegagalan, sehingga admin dapat melakukan audit jika ditemukan ketidaksesuaian data.
4.7 Analisis Implementasi Perangkat Lunak (Full-Stack)
Selain aspek kecerdasan buatan, keberhasilan sistem SIKAWAN juga didukung oleh implementasi logika pemrograman yang kuat pada sisi backend dan frontend.
4.7.1 Logika Backend (Laravel & PostgreSQL)
Pada sisi server, Laravel mengelola seluruh alur kerja bisnis presensi. Logika utama yang diimplementasikan meliputi:
1. Manajemen Autentikasi: Menggunakan Middleware untuk memastikan hanya admin yang dapat mengakses dashboard manajemen.
2. Validasi Geofencing: Sebelum data presensi disimpan, sistem melakukan perhitungan jarak antara koordinat GPS karyawan dengan koordinat kantor menggunakan rumus Haversine.
3. Sinkronisasi Database: Menggunakan PostgreSQL dengan indeks pada kolom user_id dan created_at untuk mempercepat proses query laporan kehadiran yang berjumlah ribuan baris.

4.7.2 Logika Frontend (Webcam & JavaScript)
Sisi antarmuka menggunakan JavaScript untuk time dengan perangkat keras pengguna:

77 menangani interaksi real-

1. MediaDevices API: Digunakan untuk mengakses kamera pengguna secara langsung melalui browser tanpa memerlukan plugin tambahan.
2. Canvas

Drawing:

Citra dari video stream dikonversi menjadi format Base64 menggunakan elemen <canvas> sebelum dikirimkan ke server AI.
3. Asynchronous Requests: Menggunakan Fetch API atau Axios untuk mengirimkan data wajah ke backend secara asynchronous, sehingga pengguna tidak perlu melakukan refresh halaman saat proses verifikasi berlangsung.
4.8 Integrasi Layanan (FastAPI & Laravel Communication)
Salah satu inovasi teknis dalam penelitian ini adalah penggunaan arsitektur terpisah
(Decoupled Architecture) antara sistem web dan layanan AI.

4.8.1 Alur Integrasi API
Integrasi dilakukan melalui protokol REST API:
1. Request: Laravel mengirimkan muatan (payload) berupa string Base64 dan
ID karyawan ke endpoint /api/v1/inference di FastAPI.
2. Processing: FastAPI melakukan deteksi dan klasifikasi menggunakan model KNN yang telah dimuat ke memori.
3. Response: FastAPI mengembalikan objek JSON yang berisi status verifikasi, skor konfusi (confidence score), dan metadata waktu pemrosesan.
Berikut adalah urutan komunikasi antar komponen sistem yang digambarkan pada
Gambar 4.17:

78

Gambar 4. 17 Sequence Diagram Komunikasi Laravel ↔ FastAPI
Sequence diagram di atas mengilustrasikan urutan komunikasi antar komponen sistem dalam satu siklus presensi lengkap, mulai dari akses webcam di browser, pengiriman data ke Laravel, pemrosesan AI di FastAPI (Haar Cascade → LBPH →
KNN), penyimpanan ke PostgreSQL, hingga respons ditampilkan kembali ke pengguna.
4.8.2 Analisis Latensi Sistem
Berdasarkan pengujian integrasi, rata-rata waktu yang dibutuhkan untuk satu siklus presensi adalah sebagai berikut:
•

Pengiriman Data (Network): 150 - 300 ms

•

Pemrosesan AI (FastAPI): 200 - 450 ms

•

Penyimpanan Database (Laravel): 50 - 100 ms

•

Total Latensi: < 1 Detik

Rincian distribusi waktu eksekusi pada setiap tahap pemrosesan digambarkan dalam Gambar 4.18 berikut:

79

Gambar 4. 18 Gantt Chart Breakdown Latensi Satu Siklus Presensi

Diagram Gantt di atas memvisualisasikan distribusi waktu eksekusi pada setiap tahap dalam satu siklus presensi, menunjukkan bahwa proses pengiriman data jaringan dan deteksi wajah Haar Cascade merupakan komponen yang paling membutuhkan waktu, namun total keseluruhan masih berada di bawah 1 detik.
Waktu respon di bawah 1 detik ini menunjukkan bahwa sistem sangat layak digunakan untuk lingkungan kerja dengan intensitas presensi yang tinggi, karena tidak menyebabkan antrean panjang saat proses pemindaian wajah.

80

BAB V
PENUTUP
5.1 Kesimpulan
Berdasarkan hasil perancangan, implementasi, dan pengujian sistem presensi otomatis berbasis pengenalan wajah pada SIKAWAN (Sistem Kehadiran Wajah
Karyawan), maka dapat diambil beberapa kesimpulan sebagai berikut:
1. Sistem SIKAWAN berhasil diimplementasikan sebagai sistem presensi terintegrasi yang modern, backend Laravel menggabungkan
11, dan layanan antarmuka web berbasis

FastAPI.

AI

Arsitektur decoupled ini memungkinkan proses presensi, registrasi wajah, validasi lokasi, dan pencatatan data ke basis data berjalan secara terpisah tetapi tetap saling terhubung dengan sangat baik melalui REST API.
2. Pada sisi

AI, sistem menggunakan algoritma Haar

Cascade

Classifier untuk deteksi wajah secara real-time, metode Local Binary
Patterns Histograms (LBPH) untuk ekstraksi fitur yang tangguh terhadap pencahayaan, serta algoritma K-Nearest Neighbors (KNN) dengan nilai k=1 untuk klasifikasi identitas yang akurat. Selain itu, sistem juga menerapkan validasi kualitas citra dan ambang batas (threshold) jarak untuk memastikan keamanan data presensi.
3. Pada sisi backend dan web, Laravel berperan sebagai pusat autentikasi, pengelolaan role pengguna, dan validasi geofencing berbasis radius GPS.
Antarmuka web yang dibangun dengan React, Inertia.js, dan Tailwind
CSS mampu menampilkan dashboard statistik, log presensi, serta umpan balik pemindaian wajah secara responsif dan interaktif.
4. Hasil pengujian menunjukkan bahwa seluruh fitur utama sistem berjalan sesuai rancangan dengan tingkat keberhasilan tinggi. Model AI pada sistem saat ini mencatat akurasi keseluruhan sebesar 95.42% dengan 17 label identitas dan ambang pengenalan yang dioptimasi pada lingkungan

81 pengembangan, sehingga SIKAWAN layak dijadikan solusi sistem presensi berbasis biometrik yang ringan, terstruktur, dan andal.
5.2 Saran
Berdasarkan keterbatasan yang ditemukan selama proses implementasi dan pengujian, beberapa saran untuk pengembangan sistem selanjutnya adalah sebagai berikut:
1. Menambah jumlah dan variasi dataset wajah untuk pelatihan, terutama pada kondisi pencahayaan yang ekstrem, sudut wajah yang lebih beragam, serta penggunaan atribut seperti kacamata gelap atau masker agar model memiliki generalisasi yang lebih kuat di lapangan.
2. Menambahkan mekanisme Liveness Detection atau anti-spoofing yang lebih canggih untuk mengurangi risiko manipulasi presensi menggunakan media statis (foto/video), sehingga tingkat keamanan sistem biometrik menjadi lebih terjamin.
3. Melakukan optimasi performa pada sisi backend dan AI melalui implementasi caching, monitoring layanan secara berkala, serta evaluasi waktu respons (latency) ketika sistem melayani jumlah pengguna dan permintaan yang jauh lebih besar secara bersamaan.
4. Mengembangkan integrasi lanjutan dengan modul Manajemen Sumber
Daya Manusia (HRM) lainnya, seperti sistem penggajian (payroll), manajemen cuti, lembur, dan pelaporan analitik performa karyawan yang lebih mendalam.
5. Menyempurnakan dokumentasi teknis, baik dari sisi kode program maupun panduan operasional, untuk memudahkan proses instalasi, pemeliharaan, dan pengembangan fitur-fitur baru oleh pengembang lain di masa mendatang.
Dengan adanya saran-saran tersebut, diharapkan penelitian ini dapat menjadi landasan bagi pengembangan sistem presensi berbasis pengenalan wajah yang lebih komprehensif dan siap digunakan pada skala organisasi yang lebih luas.

82

REFERENSI
[1]

S. Sharma, “Face Recognition Technology for Automatic Attendance
System,” International Journal of Innovative Research in Computer
Science & Technology, pp. 304–308, Nov. 2021, doi:
10.55524/ijircst.2021.9.6.67.

[2]

C. Luhar and P. K. Sharma, “International Journal of Research Publication and Reviews Smart Attendance System Using Face Recognition and Deep
Learning-A Review,” 2025. [Online]. Available: www.ijrpr.com

[3]

A. Budiman, Fabian, R. A. Yaputera, S. Achmad, and A. Kurniawan,
“Student attendance with face recognition (LBPH or CNN): Systematic literature review,” in Procedia Computer Science, Elsevier B.V., 2022, pp.
31–38. doi: 10.1016/j.procs.2022.12.108.

[4]

O. Alniemi and H. F. Mahmood, “Class Attendance System Based on Face
Recognition,” Revue d’Intelligence Artificielle, vol. 37, no. 5, pp. 1245–
1253, 2023, doi: 10.18280/RIA.370517.

[5]

J. Viswanathan, K. E, N. S, and V. S, “Smart Attendance System using
Face Recognition,” EAI Endorsed Transactions on Scalable Information
Systems, vol. 11, no. 5, Feb. 2024, doi: 10.4108/EETSIS.5203.

[6]

R. Alamsyah and I. Sidabutar, “Facial Recognition Using The Haar
Cascade Classifier Method For Smart Absence Keywords,” 2021. [Online].
Available: http://ejournal.seaninstitute.or.id/index.php/InfoSains

[7]

K. Vara Prasad et al., “Classroom Attendance Monitoring using Haar
Cascade and KNN Algorithm,” idci, p. 171, 2024, doi:
10.1109/IDCIOT59759.2024.10467696.

[8]

G. P. Warman and G. P. Kusuma, “Face recognition for smart attendance system using deep learning,” Commun. Math. Biol. Neurosci., vol. 2023, no. 0, p. Article ID 19, 2023, doi: 10.28919/CMBN/7872.

[9]

Q. X. Ying, R. A. R. Ahmad, M. I. Ahmad, Z. Z. Ahmad, A. A. A. Halim, and M. W. Nasrudin, “Haar-VGG: Face Attendance System,” International
Journal of Integrated Engineering, vol. 17, no. 2, pp. 246–256, Jul. 2025, doi: 10.30880/ijie.2025.17.02.020.

83

[10]

O. Khalkar, T. Bhosale, S. Yadav, T. Galande, and A. Kadam, “‘Automatic
Attendance System, Using Face Detection and Machine Learning,’” 2024.
[Online]. Available: www.ijnrd.org

[11]

S. Agarwal, “Face Recognition-Based Attendance System,” International
Journal of Advance Research, Ideas and Innovations in Technology, vol.
10, no. 5, pp. 261–267, Oct. 2024, doi: xx.xxx/ijariit-v10i5-1282.

84

LAMPIRAN

85

