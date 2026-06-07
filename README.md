<div align="center">

# EduVerse

### Yeni Nesil Online Eğitim & Öğrenme Platformu

[![Status](https://img.shields.io/badge/Durum-Aktif-22c55e?style=flat-square&logo=checkmarx)](https://github.com)
[![Version](https://img.shields.io/badge/Versiyon-1.2.0-6366f1?style=flat-square)](https://github.com)
[![Stack](https://img.shields.io/badge/Stack-MERN%20%7C%20Vite%20%7C%20WebRTC-00d4aa?style=flat-square)](https://github.com)
[![License](https://img.shields.io/badge/Lisans-ISC-f59e0b?style=flat-square)](https://github.com)

*WebRTC tabanlı canlı dersler, interaktif kod laboratuvarları, oyunlaştırma ve kurumsal B2B çözümlerini tek çatı altında birleştiren full-stack SaaS eğitim platformu.*

---

[Hızlı Başlangıç](#-hızlı-başlangıç) • [Özellikler](#-özellikler) • [Mimari](#-mimari) • [API Referansı](#-api-referansı) • [Test Hesapları](#-test-hesapları)

</div>

---

## ✨ Özellikler

<table>
<tr>
<td width="50%">

### 🚀 Canlı Ders Altyapısı
- WebRTC + Socket.io ile kesintisiz video/ses
- Anlık sohbet, canlı anketler, el kaldırma
- Çok kullanıcılı eşzamanlı **Beyaz Tahta**
- Gerçek zamanlı **Kod Laboratuvarı** (JS/Python/HTML)
- AI destekli arka plan kaldırma & bulanıklaştırma
- Seminer modu: Host / Guest Speaker / Attendee rolleri

</td>
<td width="50%">

### 🏆 Oyunlaştırma & Topluluk
- XP puanı, seviye sistemi ve rozet koleksiyonu
- CTF güvenlik laboratuvarları ve skor tablosu
- Forum gönderileri, yorumlar ve beğeniler
- **Topluluk Sayfası** — canlı gerçek zamanlı gönderiler

</td>
</tr>
<tr>
<td width="50%">

### 🗺️ Kariyer & Planlama
- Full Stack, Data Science, DevOps, Mobil yol haritaları
- Görev bazlı interaktif Pomodoro sayacı
- Takvim entegrasyonlu kişisel çalışma planı
- Kurs tamamlama sertifikaları (QR doğrulama)

</td>
<td width="50%">

### 🛡️ Güvenlik & Yönetim
- Eğitmen doğrulama sistemi (başvuru → admin onayı)
- JWT + bcrypt + Helmet + rate-limit
- Tam admin paneli (kullanıcı, kurs, başvuru yönetimi)
- Eğitmen paneli (kurs, öğrenci, gelir takibi)

</td>
</tr>
</table>

---

## 🛠 Mimari

```
┌─────────────────────────────────────────────────────────────────┐
│                        EduVerse Platform                        │
├───────────────────────────┬─────────────────────────────────────┤
│     Frontend (React 18)   │       Backend (Node.js)             │
│                           │                                     │
│  ├── Context API          │  ├── Express.js REST API            │
│  │   ├── AuthContext      │  ├── Socket.io (WebRTC sinyalleşme) │
│  │   ├── ThemeContext     │  ├── JWT Authentication             │
│  │   └── CartContext      │  ├── Mongoose ODM                   │
│  │                        │  └── Winston + Morgan logging       │
│  ├── Views (19 sayfa)     │                                     │
│  ├── Components           │  MongoDB Atlas / Local              │
│  ├── Hooks (WebRTC/Socket)│  ├── User, Course, Certificate      │
│  └── Services (api.js)    │  ├── CommunityPost, LiveSession     │
│                           │  └── Assignment, CtfChallenge       │
└───────────────────────────┴─────────────────────────────────────┘
```

### Tech Stack

| Katman | Teknoloji |
|:---|:---|
| **Frontend** | React 18, Vite, Vanilla CSS (özel design system), Lucide React |
| **Backend** | Node.js, Express.js, asyncHandler, Joi validasyon |
| **Veritabanı** | MongoDB, Mongoose |
| **Gerçek Zamanlı** | Socket.io 4.x, Simple-peer (WebRTC), Perfect Negotiation |
| **Güvenlik** | JWT, bcryptjs, Helmet, express-rate-limit, mongo-sanitize |
| **Loglama** | Winston (dosya rotasyonu), Morgan (HTTP) |

---

## 📂 Proje Yapısı

```
online-egitim-platformu/
│
├── backend/
│   ├── config/               # DB bağlantısı, ortam değişkenleri
│   ├── middleware/            # auth, asyncHandler, errorHandler, validate
│   ├── models/                # User, Course, Certificate, CommunityPost,
│   │                          # LiveSession, Assignment, CtfChallenge
│   ├── routes/                # auth, admin, courses, payment, community,
│   │                          # certificates, social, planner, ctf, rss…
│   ├── socket/                # Socket.io modülleri
│   │   ├── handlers/          # webrtcHandler, whiteboardHandler,
│   │   │                      # chatHandler, pollHandler, seminarHandler
│   │   └── roomManager.js     # Bellek-içi oda durumu
│   ├── scripts/               # Seed, backup, restore betikleri
│   ├── services/              # rssFetcher
│   ├── utils/                 # logger, AppError, corsOrigins
│   └── server.js / app.js     # Uygulama girişi
│
└── frontend/
    └── src/
        ├── components/        # GlobalNavbar, CartDrawer, PomodoroTimer,
        │                      # PageBlocks, CodeSandbox, Whiteboard…
        ├── context/           # ThemeContext, AuthContext, CartContext
        ├── hooks/             # useSocket, useWebRTC, useWhiteboardSync
        ├── services/          # api.js (tüm API çağrıları tek dosyada)
        ├── views/
        │   ├── admin/         # AdminDashboardView.jsx
        │   ├── instructor/    # InstructorDashboardView.jsx
        │   └── *.jsx          # 19 sayfa görünümü
        └── design-system/     # CSS token ve yardımcı sınıflar
```

---

## 🚀 Hızlı Başlangıç

### Gereksinimler

| Araç | Versiyon |
|:---|:---|
| Node.js | `v18.0+` |
| MongoDB | `v6.0+` |
| MongoDB Database Tools | Backup/Restore için |

### 1 — Backend

```bash
cd backend

# Ortam değişkenlerini hazırla
cp .env.example .env
# .env içinde MONGO_URI ve JWT_SECRET değerlerini güncelle

npm install

# Örnek verilerle veritabanını doldur (opsiyonel ama önerilen)
npm run db:seed

# Geliştirme sunucusunu başlat
npm run dev
# ✓ http://localhost:5000
```

### 2 — Frontend

```bash
cd frontend

npm install

npm run dev
# ✓ http://localhost:5173
```

> **Not:** Her iki sunucu da aynı anda çalışmalıdır. Backend port `5000`, Frontend port `5173` kullanır.

---

## 🔐 Test Hesapları

`npm run db:seed` çalıştırdıktan sonra:

| Rol | E-posta | Şifre | Erişim |
|:---|:---|:---|:---|
| **Admin** | `admin@demo.com` | `Demo12345!` | Tam yönetim paneli |
| **Eğitmen** | `teacher@demo.com` | `Demo12345!` | Eğitmen paneli, kurs yönetimi |
| **Öğrenci** | `student@demo.com` | `Demo12345!` | Kurslar, canlı dersler, ödevler |

> **Eğitmen Başvurusu:** Kayıt ekranında *"Eğitmen Olarak Başvur"* seçeneğini işaretleyin. Admin hesabıyla giriş yapıp **Eğitmen Başvuruları** bölümünden onaylayabilirsiniz.

> **Canlı Ders Testi:** Aynı anda iki farklı tarayıcı sekmesini (biri Eğitmen, biri Öğrenci) açarak gerçek zamanlı WebRTC & Socket.io özelliklerini test edebilirsiniz.

---

## 📡 API Referansı

### Kimlik Doğrulama
| Method | Endpoint | Açıklama |
|:---|:---|:---|
| `POST` | `/api/auth/register` | Kayıt ol (instructor başvurusu opsiyonel) |
| `POST` | `/api/auth/login` | Giriş yap, JWT al |
| `POST` | `/api/auth/demo-session` | Canlı ders için geçici oturum |

### Kurslar & Kullanıcılar
| Method | Endpoint | Açıklama |
|:---|:---|:---|
| `GET` | `/api/courses` | Kurs listesi (filtreli & sayfalı) |
| `GET` | `/api/users/me` | Aktif kullanıcı profili |
| `PUT` | `/api/users/me` | Profil güncelle |

### Admin
| Method | Endpoint | Açıklama |
|:---|:---|:---|
| `GET` | `/api/admin/stats` | Platform istatistikleri |
| `GET` | `/api/admin/users` | Tüm kullanıcılar |
| `PUT` | `/api/admin/users/:id/role` | Rol değiştir |
| `DELETE` | `/api/admin/users/:id` | Kullanıcı sil |
| `GET` | `/api/admin/applications/instructors` | Bekleyen başvurular |
| `PUT` | `/api/admin/applications/instructors/:id/approve` | Başvuruyu onayla |
| `PUT` | `/api/admin/applications/instructors/:id/reject` | Başvuruyu reddet |

### Topluluk & Sertifikalar
| Method | Endpoint | Açıklama |
|:---|:---|:---|
| `GET` | `/api/community` | Forum gönderileri |
| `POST` | `/api/community` | Yeni gönderi oluştur |
| `POST` | `/api/community/:id/like` | Beğen / Beğeniyi geri al |
| `GET` | `/api/certificates/me` | Sertifikalarım |
| `GET` | `/api/certificates/verify/:certId` | Sertifika doğrula |

---

## 📜 NPM Komutları

| Dizin | Komut | Açıklama |
|:---|:---|:---|
| `backend` | `npm run dev` | Nodemon ile geliştirme sunucusu |
| `backend` | `npm run db:seed` | Veritabanını örnek veriyle doldur |
| `backend` | `npm run db:backup` | MongoDB yedeği al |
| `backend` | `npm run db:restore` | Yedekten geri yükle |
| `frontend` | `npm run dev` | Vite geliştirme sunucusu |
| `frontend` | `npm run build` | Production bundle oluştur |

---

## 🔒 Güvenlik Mimarisi

```
İstek Akışı:
Client → Helmet (güvenlik headerlari)
       → Rate Limiter (global: 100/15dk, auth: 20/15dk)
       → CORS (whitelist kontrolü)
       → mongo-sanitize (NoSQL injection koruması)
       → JWT Authenticate middleware
       → Role Authorize middleware
       → asyncHandler (tüm async hatalar yakalanır)
       → Global errorHandler
```

| Özellik | Detay |
|:---|:---|
| **Token Süresi** | `JWT_EXPIRES_IN` (`.env` ile yapılandırılır) |
| **Şifre Hash** | bcrypt, salt rounds: 12 |
| **Rate Limit** | Auth: 20 istek/15 dk, Global: 100 istek/15 dk |
| **Log Rotasyonu** | `logs/` altında günlük dosya, 14 gün saklama |
| **Eğitmen Rolü** | Yalnızca Admin onayıyla atanır |

---

## 🤝 Katkıda Bulunma

1. `feature/<özellik-adı>` dalı aç
2. Değişikliklerini commit et
3. Pull Request gönder — main dalı koruma altındadır

---

## 📄 Lisans

Bu proje **ISC** lisansı altında sunulmaktadır.

---

<div align="center">

*EduVerse Ekibi tarafından sevgiyle kodlandı* 💻🚀

**[⬆ Yukarı Dön](#eduverse)**

</div>
