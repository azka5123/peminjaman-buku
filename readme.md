# Peminajaman-Buku

Peminajaman-Buku adalah aplikasi web sederhana untuk mengelola peminjaman buku.

## Instalasi

1. Clone repositori ini
2. Buka terminal atau command prompt di direktori proyek
3. Jalankan perintah `npm install` untuk menginstal dependensi
4. Salin file `.env.example` menjadi `.env.dev` atau `.env.prod`
5. Jalankan perintah `npx sequelize db:migrate` untuk migrasi database
6. Jalankan perintah `npx sequelize-cli db:seed:all` untuk mengisi data awal ke database
7. Untuk menjalankan aplikasi, gunakan perintah `npm run dev` untuk menjalankan mode development atau `npm run start` untuk menjalankan mode production

## Testing

1. Jalankan perintah `npm test` untuk menjalankan test
