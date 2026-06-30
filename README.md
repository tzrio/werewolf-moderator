# Werewolf Moderator

Website **asisten Moderator** untuk permainan Werewolf/Mafia offline maupun via voice call. Ini **bukan** game otomatis — moderator tetap memimpin narasi dan keputusan. Website membantu: pembagian role acak, fase malam/siang, voting, log, dan riwayat permainan.

## Stack
Next.js 14 (App Router) · TypeScript · TailwindCSS · Zustand · Framer Motion · Lucide React · React Hot Toast. Semua state tersimpan di `localStorage` browser — tidak ada backend/database/login.

## Fitur yang sudah jalan
- Landing page, Setup (input pemain + konfigurasi role dengan validasi balancing), generate role acak (Fisher-Yates, role unik dicegah dobel).
- 20 role didefinisikan (Werewolf, Alpha Wolf, Wolf Cub, Minion, Villager, Doctor, Seer, Hunter, Cupid, Witch, Bodyguard, Mayor, Little Girl, Tanner, Serial Killer, Guardian Angel, Medium, Diseases, Prince, Fool) lengkap deskripsi, cara menang, aksi malam.
- Reveal-one-by-one role via modal, role panel tersembunyi setelah ditutup, bisa dibuka ulang lewat dashboard moderator.
- Panel Moderator: jumlah hidup/mati, kill/revive manual, set Mayor (suara x2), catatan moderator, role list.
- Fase: Night → Day → Voting → Execution → Game Over, dengan narasi otomatis acak (100+ variasi di `lib/narration.ts`).
- Aksi malam interaktif: Werewolf, Doctor, Seer, Bodyguard, Witch (heal/poison sekali pakai), Cupid (pairing + efek mati bersama), Serial Killer, Guardian Angel.
- Voting manual (drag voter → target), bobot suara Mayor x2, deteksi seri + opsi vote ulang/eksekusi manual.
- Timer fase (15/30/45/60/90s + custom) dengan progress bar.
- Log permainan kronologis + export JSON per game, dan halaman **Riwayat** (`/history`) lintas-game dengan export semua riwayat.
- Mode Projector (tampilan besar status pemain untuk TV).
- Undo (snapshot-based, hingga 20 langkah ke belakang), Reset dengan konfirmasi, Auto-save ke localStorage setiap perubahan state.
- Win-condition checker otomatis (village/werewolf/neutral) sebagai *indikator*, keputusan akhir tetap di tangan moderator.

## Yang sengaja belum lengkap (scope nyata untuk versi 1 ini)
Karena daftar permintaan sangat luas (20+ role dengan aksi unik penuh, sound ambience nyata, mode streamer terpisah, export PDF, import/export config role sebagai file, preset per jumlah pemain di UI), repo ini berisi **arsitektur lengkap + fitur inti yang sudah berfungsi dan teruji build**, bukan seluruhnya. Yang paling mudah ditambahkan selanjutnya (sudah ada fondasinya di kode):
- Role tanpa aksi malam interaktif (Mayor, Prince, Tanner, dll.) sudah punya deskripsi lengkap tapi efek pasifnya (mis. Prince tak bisa dieksekusi, Tanner menang jika dieksekusi) belum dihitung otomatis di `checkWinCondition` — saat ini moderator menentukan ini secara manual berdasar deskripsi role yang ditampilkan.
- File sound (`public/sounds/`) belum diisi — tombol ON/OFF sudah ada di `/game`, tinggal taruh file `.mp3` dan hubungkan ke `<audio>`.
- Preset jumlah pemain (8/10/.../20) sudah ada secara logic (`PLAYER_PRESETS` di `lib/roles.ts`), tinggal ditambahkan tombol pilihannya di halaman Setup.
- Export PDF & import/export config JSON role: pola sama seperti export log JSON yang sudah ada, tinggal diperluas.

## Struktur Folder
```
werewolf-moderator/
├── app/
│   ├── page.tsx              # Landing
│   ├── setup/page.tsx        # Input pemain + konfigurasi role
│   ├── game/page.tsx         # Panel utama moderator + reveal + projector mode
│   ├── history/page.tsx      # Riwayat semua game
│   ├── layout.tsx
│   └── globals.css           # Tema hutan/kabut/bulan
├── components/
│   ├── PlayerCard.tsx
│   ├── RoleModal.tsx
│   ├── Timer.tsx
│   ├── PhaseControls.tsx
│   ├── NightActionsPanel.tsx
│   ├── VotingPanel.tsx
│   ├── LogPanel.tsx
│   └── ModeratorDashboard.tsx
├── lib/
│   ├── types.ts               # Semua TypeScript types
│   ├── roles.ts                # Definisi 20 role + balancing & presets
│   ├── narration.ts            # 100+ variasi narasi moderator
│   ├── store.ts                 # Zustand store (state machine utama)
│   └── utils.ts
└── package.json
```

## Instalasi
```bash
npm install
```

## Menjalankan (development)
```bash
npm run dev
```
Buka `http://localhost:3000`.

## Build production
```bash
npm run build
npm run start
```

## Deploy — perbandingan platform
| Platform | Kelebihan | Kekurangan |
|---|---|---|
| **Vercel** | Dibuat oleh tim Next.js, deploy otomatis dari Git, support App Router penuh tanpa konfigurasi tambahan, preview deployment per PR, gratis untuk hobby project | Limit fair-use di tier gratis untuk traffic besar |
| Netlify | Mudah dipakai, plugin Next.js cukup matang | Kadang butuh adapter tambahan untuk fitur Next.js terbaru |
| Cloudflare Pages | Edge network cepat, gratis generous | Dukungan Next.js App Router masih butuh adapter (`@cloudflare/next-on-pages`), beberapa fitur server bisa terbatas |
| GitHub Pages | Gratis, simpel | Hanya untuk static export — App Router dengan fitur dinamis (meski di sini semuanya client-side) jadi sedikit ribet dikonfigurasi |
| Firebase Hosting | Terintegrasi dengan layanan Google lain | Setup untuk Next.js App Router butuh Cloud Functions, lebih kompleks dari kebutuhan project ini |
| Hugging Face Spaces | Cocok untuk demo ML/Streamlit | Tidak ideal untuk Next.js, lebih cocok untuk app Python |

**Rekomendasi: Vercel.** Karena project ini Next.js App Router murni tanpa backend custom, Vercel memberi deployment paling mulus (zero-config), gratis untuk pemakaian kelompok kecil (12–20 pemain sesekali main), dan dibuat oleh tim yang sama dengan framework-nya sehingga kompatibilitas selalu terjamin.

Langkah deploy ke Vercel:
1. Push folder ini ke repo GitHub.
2. Buka [vercel.com](https://vercel.com), import repo.
3. Vercel otomatis mendeteksi Next.js — klik Deploy.
4. Selesai, dapat URL publik untuk dibagikan ke pemain.

## Catatan penggunaan saat bermain
- Semua data tersimpan di `localStorage` **browser perangkat moderator**. Jika ingin pemain melihat role sendiri di HP masing-masing, mode termudah saat ini adalah **moderator menyerahkan satu HP/laptop secara bergilir** di fase Reveal (sesuai desain "pengganti kartu fisik"), bukan multi-device real-time (karena tidak ada backend/database sesuai requirement).
- Pastikan klik "Simpan Daftar Pemain" sebelum mengatur role, dan jangan reset browser/clear site data di tengah permainan kecuali sengaja ingin mulai ulang.
