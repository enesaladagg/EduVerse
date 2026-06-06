# EduFlow Pro — Online Eğitim Platformu

Udemy / BTK Akademi tarzında MERN Stack tabanlı interaktif eğitim platformu. Canlı ders (WebRTC + Socket.io), kod laboratuvarı, gamification ve ödev modülü içerir.

## Özellikler

- **Kimlik doğrulama** — Kayıt, giriş, JWT, profil
- **Canlı ders** — EduFlow arayüzü, sohbet, anket, beyaz tahta, kod sandbox, WebRTC
- **Kurs kataloğu** — `GET /api/courses`
- **Ödevler** — Listeleme ve teslim
- **Gamification** — XP ve rozetler
- **Yedekleme** — MongoDB backup/restore scriptleri

## Hızlı Başlangıç

### Gereksinimler

- Node.js 18+
- MongoDB 6+
- MongoDB Database Tools (`mongodump` / `mongorestore` — yedekleme için)

### 1. Backend

```bash
cd backend
cp .env.example .env
# .env içinde JWT_SECRET ve MONGO_URI ayarlayın
npm install
npm run db:seed
npm run dev
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Tarayıcı: **http://localhost:5173**

### Demo Hesaplar (seed sonrası)

| Rol | E-posta | Şifre |
|-----|---------|-------|
| Eğitmen | teacher@demo.com | Demo12345! |
| Öğrenci | student@demo.com | Demo12345! |

Canlı ders odası: `react-101-live`

## NPM Scriptleri

**Backend:** `dev`, `start`, `test`, `db:seed`, `db:backup`, `db:restore`

**Frontend:** `dev`, `build`, `lint`, `preview`

## Proje Yapısı

```
backend/
  routes/       REST API (auth, courses, ctf, rss, sessions, assignments)
  socket/       Socket.io (chat, poll, whiteboard, webrtc, code sandbox)
  scripts/      seed, backup, restore
frontend/
  src/views/    Sayfa bileşenleri (Live, CTF, RSS, Login, …)
  src/components/eduflow/   Canlı ders UI
  src/hooks/    useLiveSession, useSocket, useWebRTC
projeakisi.md   Mimari dokümantasyon (tek kaynak)
```

## Dokümantasyon

Tüm mimari değişiklikler, API rotaları ve socket olayları **`projeakisi.md`** dosyasında belgelenir.

## Lisans

ISC
