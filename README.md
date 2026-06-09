<div align="center">

<img src="https://img.shields.io/badge/EduVerse-Platform-6366f1?style=for-the-badge&logoColor=white" alt="EduVerse" height="40"/>

# EduVerse — Yeni Nesil Online Eğitim Platformu

<p>
  <img src="https://img.shields.io/badge/Versiyon-2.0.0-6366f1?style=flat-square" />
  <img src="https://img.shields.io/badge/Durum-Aktif%20Geliştirme-22c55e?style=flat-square" />
  <img src="https://img.shields.io/badge/Stack-MERN%20%2B%20WebRTC-00d4aa?style=flat-square" />
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/MongoDB-7.x-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Lisans-ISC-f59e0b?style=flat-square" />
</p>

> **WebRTC tabanlı canlı dersler · E-posta/SMS kimlik doğrulama · Oyunlaştırma · Kurumsal B2B**  
> *Türkiye'nin eğitim teknolojisi ekosistemi için tasarlanmış, tam donanımlı full-stack SaaS platformu.*

---

[🚀 Hızlı Başlangıç](#-hızlı-başlangıç) · [✨ Özellikler](#-özellikler) · [🏗 Mimari](#-mimari) · [📡 API](#-api-referansı) · [🔐 Güvenlik](#-güvenlik-mimarisi) · [🧪 Test Hesapları](#-test-hesapları)

</div>

---

## ✨ Özellikler

<table>
<tr>
<td width="50%" valign="top">

### 🔐 Kimlik Doğrulama *(v2.0 — Yeni!)*
- **E-posta OTP** doğrulaması — kayıtta 6 haneli kod maile gönderilir
- **Şifremi Unuttum** — SHA-256 hash'li güvenli sıfırlama bağlantısı
- **Telefon ile Kayıt & Giriş** — SMS OTP, şifresiz giriş (Twilio)
- **Google / LinkedIn OAuth** — anında kayıt + hoş geldin maili
- **Şifre Sıfırlama Sayfası** — güçlü şifre göstergesi, eşleşme kontrolü
- SVG ikonlu **E-posta ↔ Telefon** seçici (sliding pill animasyonu)

</td>
<td width="50%" valign="top">

### 🚀 Canlı Ders Altyapısı
- **WebRTC + Socket.io** — düşük gecikmeli video/ses
- Gerçek zamanlı **sohbet**, **anket**, **el kaldırma**
- Çok kullanıcılı eşzamanlı **Beyaz Tahta**
- Canlı **Kod Laboratuvarı** (JS / Python / HTML)
- AI destekli arka plan kaldırma & bulanıklaştırma
- Seminer modu: Host / Guest Speaker / Attendee rolleri

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🏆 Oyunlaştırma & Topluluk
- **XP puanı**, seviye sistemi ve rozet koleksiyonu
- **CTF** güvenlik laboratuvarları + skor tablosu
- Forum gönderileri, yorumlar, beğeniler
- **Topluluk Sayfası** — gerçek zamanlı canlı akış

</td>
<td width="50%" valign="top">

### 🗺 Kariyer & Verimlilik
- Full Stack · Data Science · DevOps · Mobil **yol haritaları**
- Görev bazlı **Pomodoro** sayacı
- **Takvim** entegrasyonlu çalışma planı
- **QR doğrulamalı** kurs tamamlama sertifikaları

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 💼 Kurumsal & Ödeme
- **B2B kurumsal** plan & kurumsal giriş sayfası
- Sanal ödeme akışı (kurs sepeti → checkout)
- **Eğitmen başvuru** sistemi (admin onaylı)
- Gelir & öğrenci takip paneli

</td>
<td width="50%" valign="top">

### 🛡 Güvenlik & Altyapı
- Helmet · CORS whitelist · Rate limit · mongo-sanitize
- **JWT** + bcrypt (salt:12) + SHA-256 token hashing
- Winston + Morgan **loglama** (14 gün dosya rotasyonu)
- Tam **Admin Paneli** — kullanıcı, kurs, başvuru yönetimi

</td>
</tr>
</table>

---

## 🏗 Mimari

```
┌──────────────────────────────────────────────────────────────────────┐
│                         EduVerse  v2.0                               │
├────────────────────────────────┬─────────────────────────────────────┤
│    Frontend · React 18 + Vite  │    Backend · Node.js / Express      │
│                                │                                     │
│  Context API                   │  REST API  (auth, courses, admin…)  │
│  ├── AuthContext               │  Socket.io (WebRTC sinyal + chat)   │
│  ├── ThemeContext              │  Passport.js (Google / LinkedIn)    │
│  ├── CartContext               │  Nodemailer  (OTP / reset maili)    │
│  └── PomodoroContext           │  Twilio SMS  (OTP / telefon giriş) │
│                                │  JWT + bcrypt + Joi validasyon      │
│  Views  (20+ sayfa)           │  Mongoose ODM                       │
│  ├── LoginView    ← yeni akış  │                                     │
│  ├── RegisterView ← yeni akış  │  MongoDB                            │
│  ├── ResetPasswordView ← yeni  │  ├── User  (email sparse + phone)   │
│  ├── LiveSessionView           │  ├── Course, Certificate            │
│  ├── SettingsView              │  ├── CommunityPost, LiveSession     │
│  ├── AdminDashboardView        │  └── Assignment, CtfChallenge       │
│  └── InstructorDashboardView   │                                     │
│                                │  utils/email.js  (HTML şablonlar)  │
│  services/api.js               │  utils/sms.js    (Twilio wrapper)   │
│  hooks/ (WebRTC, Socket…)      │  socket/ (oda, whiteboard, anket)   │
└────────────────────────────────┴─────────────────────────────────────┘
```

### 🧰 Tech Stack

| Katman | Teknoloji | Notlar |
|:---|:---|:---|
| **Frontend** | React 18, Vite, Lucide React | Vanilla CSS design-system, Context API |
| **Backend** | Node.js, Express.js, asyncHandler | Joi validasyon, Passport.js |
| **Veritabanı** | MongoDB 7, Mongoose | Sparse unique index (email & phone) |
| **Gerçek Zamanlı** | Socket.io 4, Simple-peer (WebRTC) | Perfect Negotiation pattern |
| **E-posta** | Nodemailer + Gmail SMTP | HTML branded şablonlar (OTP, reset, hoş geldin) |
| **SMS** | Twilio SDK | Console-log fallback (dev modunda) |
| **OAuth** | Passport Google 2.0, LinkedIn | isVerified:true otomatik |
| **Güvenlik** | JWT, bcryptjs, Helmet, rate-limit, mongo-sanitize | SHA-256 token hash |
| **Loglama** | Winston (dosya rotasyonu), Morgan | 14 gün saklama |

---

## 📂 Proje Yapısı

```
EduVerse/
│
├── backend/
│   ├── config/
│   │   ├── db.js                  # MongoDB bağlantısı (pool + timeout)
│   │   ├── env.js                 # Ortam değişkeni doğrulama
│   │   └── passport.js            # Google & LinkedIn OAuth stratejileri
│   ├── middleware/
│   │   ├── auth.js                # authenticate + authorize
│   │   ├── validate.js            # Joi şema fabrikası (+ phone şemaları)
│   │   ├── asyncHandler.js
│   │   └── errorHandler.js
│   ├── models/
│   │   └── User.js                # phone, isPhoneVerified, passwordReset* alanları
│   ├── routes/
│   │   ├── auth.js                # 10 endpoint: kayıt, giriş, OTP, OAuth, şifre sıfırlama
│   │   ├── admin.js
│   │   ├── courses.js
│   │   ├── payment.js             # CLIENT_URL / BACKEND_URL env-var'a taşındı
│   │   └── upload.js              # BACKEND_URL env-var'a taşındı
│   ├── socket/
│   │   ├── handlers/              # webrtc, whiteboard, chat, poll, seminar
│   │   └── roomManager.js
│   ├── utils/
│   │   ├── email.js               # verifyEmail / welcome / resetPassword şablonları
│   │   ├── sms.js                 # Twilio wrapper + fallback
│   │   └── logger.js
│   ├── .env                       # ← GİT'E EKLENMEDİ (gizli)
│   ├── .env.example               # ← Şablon (taahhüt edildi)
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── context/
│       │   ├── AuthContext.jsx    # registerPhone, loginPhone, forgotPassword…
│       │   ├── ThemeContext.jsx
│       │   ├── CartContext.jsx
│       │   └── ToastContext.jsx
│       ├── views/
│       │   ├── LoginView.jsx      # E-posta/Telefon tab + şifremi unuttum akışı
│       │   ├── RegisterView.jsx   # E-posta/Telefon tab + OTP doğrulama adımı
│       │   ├── ResetPasswordView.jsx  ← YENİ
│       │   ├── SettingsView.jsx
│       │   ├── LiveSessionView.jsx
│       │   ├── admin/AdminDashboardView.jsx
│       │   └── instructor/InstructorDashboardView.jsx
│       ├── services/api.js        # registerPhone, verifyPhone, forgotPassword…
│       └── App.jsx                # reset-password route + ToastProvider
│
├── docs/
│   ├── TAKIM_DOKUMANI.md          # Ekip için detaylı teknik belge
│   ├── SUNUM_REHBERI.md           # Hoca sunumu konuşma metni
│   ├── CHANGELOG.md
│   └── Guvenlik_ve_Test_Raporu.md
│
├── projeakisi.md                  # Haftalık rapor ve ekip katkıları
├── .gitignore
└── README.md
```

---

## 🚀 Hızlı Başlangıç

### Gereksinimler

| Araç | Min. Versiyon |
|:---|:---|
| Node.js | `v18.0+` |
| MongoDB | `v6.0+` (yerel veya Atlas) |
| npm | `v9+` |

### 1 — Backend

```bash
cd backend

# Ortam değişkenlerini hazırla
cp .env.example .env
# .env içinde en az şunları doldur:
#   MONGO_URI, JWT_SECRET, SMTP_USER, SMTP_PASS, CLIENT_URL

npm install
npm run db:seed     # örnek verilerle DB'yi doldur (önerilen)
npm run dev         # → http://localhost:5000
```

### 2 — Frontend

```bash
cd frontend

# Ortam değişkenlerini hazırla
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api

npm install
npm run dev         # → http://localhost:5173
```

> **İki sunucu aynı anda çalışmalıdır.** Backend `5000`, Frontend `5173` portunu kullanır.

### SMS (Opsiyonel — Twilio)

```env
# backend/.env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
```
Twilio yapılandırılmadığında SMS mesajları terminale `[SMS-TEST]` olarak yazdırılır; geliştirme ortamı çalışmaya devam eder.

---

## 📡 API Referansı

### 🔐 Kimlik Doğrulama

| Method | Endpoint | Açıklama |
|:---|:---|:---|
| `POST` | `/api/auth/register` | E-posta ile kayıt + OTP gönderimi |
| `POST` | `/api/auth/verify-email` | E-posta OTP doğrulama |
| `POST` | `/api/auth/login` | E-posta / şifre girişi → JWT |
| `POST` | `/api/auth/register-phone` | Telefon ile kayıt + SMS OTP |
| `POST` | `/api/auth/verify-phone` | Telefon OTP doğrulama |
| `POST` | `/api/auth/send-phone-otp` | OTP yeniden gönder |
| `POST` | `/api/auth/login-phone` | Şifresiz telefon girişi |
| `POST` | `/api/auth/forgot-password` | Şifre sıfırlama maili gönder |
| `POST` | `/api/auth/reset-password/:token` | Yeni şifre belirle |
| `GET`  | `/api/auth/google` | Google OAuth başlat |
| `GET`  | `/api/auth/linkedin` | LinkedIn OAuth başlat |

### 📚 Kurslar & Kullanıcılar

| Method | Endpoint | Açıklama |
|:---|:---|:---|
| `GET` | `/api/courses` | Kurs listesi (filtreli & sayfalı) |
| `GET` | `/api/users/me` | Aktif kullanıcı profili |
| `PUT` | `/api/users/me` | Profil güncelle |
| `POST` | `/api/upload/profile-picture` | Profil fotoğrafı yükle |

### 🛠 Admin

| Method | Endpoint | Açıklama |
|:---|:---|:---|
| `GET` | `/api/admin/stats` | Platform istatistikleri |
| `GET` | `/api/admin/users` | Tüm kullanıcılar |
| `PUT` | `/api/admin/users/:id/role` | Rol değiştir |
| `GET` | `/api/admin/applications/instructors` | Bekleyen eğitmen başvuruları |
| `PUT` | `/api/admin/applications/instructors/:id/approve` | Başvuru onayla |

### 🌐 Topluluk & Sertifikalar

| Method | Endpoint | Açıklama |
|:---|:---|:---|
| `GET` | `/api/community` | Forum gönderileri |
| `POST` | `/api/community` | Yeni gönderi |
| `POST` | `/api/community/:id/like` | Beğen / Beğeniyi geri al |
| `GET` | `/api/certificates/me` | Kendi sertifikalarım |
| `GET` | `/api/certificates/verify/:certId` | QR doğrulama |

---

## 🔒 Güvenlik Mimarisi

```
HTTP İstek
  │
  ▼
Helmet ──────────── 11 güvenlik başlığı (HSTS, CSP, X-Frame-Options…)
  │
  ▼
Rate Limiter ─────── Global: 100 istek/15 dk │ Auth: 20 istek/15 dk
  │
  ▼
CORS ────────────── Yalnızca CORS_ORIGINS whitelist'teki originlere izin
  │
  ▼
mongo-sanitize ───── $ ve . operatörlerini temizle (NoSQL injection)
  │
  ▼
Joi Validasyon ───── Şema dışı alanlar stripUnknown ile çıkarılır
  │
  ▼
JWT Authenticate ─── Bearer token doğrulama
  │
  ▼
Role Authorize ────── student / teacher / admin erişim kontrolü
  │
  ▼
asyncHandler ──────── Tüm async hatalar yakalanır
  │
  ▼
Global errorHandler ─ Standart JSON hata yanıtı
```

| Özellik | Detay |
|:---|:---|
| **Şifre Hashing** | bcrypt salt:12 — düz metin asla saklanmaz |
| **Reset Token** | `crypto.randomBytes(32)` → SHA-256 hash DB'de; ham token hiç saklanmaz |
| **SMS OTP** | 6 haneli rastgele kod, 10 dakika geçerli |
| **E-posta OTP** | 6 haneli rastgele kod, 24 saat geçerli |
| **JWT Secret** | 96 karakterlik kriptografik rastgele değer |
| **Ortam Ayrımı** | `.env` asla commit edilmez; `.env.example` şablon olarak takip edilir |

---

## 🧪 Test Hesapları

`npm run db:seed` çalıştırdıktan sonra:

| Rol | E-posta | Şifre | Erişim |
|:---|:---|:---|:---|
| **Admin** | `admin@demo.com` | `Demo12345!` | Tam yönetim paneli |
| **Eğitmen** | `teacher@demo.com` | `Demo12345!` | Eğitmen paneli + kurs yönetimi |
| **Öğrenci** | `student@demo.com` | `Demo12345!` | Kurslar, canlı dersler, ödevler |

> **Eğitmen Başvurusu:** Kayıtta *"Eğitmen Olarak Başvur"* işaretle → admin hesabıyla onayla.  
> **Canlı Ders Testi:** İki farklı sekme aç (biri Eğitmen, biri Öğrenci) — WebRTC otomatik bağlanır.  
> **Telefon Girişi:** Twilio yoksa OTP terminal çıktısına yazdırılır (`[SMS-TEST]`).

---

## 📜 NPM Komutları

| Dizin | Komut | Açıklama |
|:---|:---|:---|
| `backend` | `npm run dev` | Nodemon ile geliştirme sunucusu |
| `backend` | `npm run db:seed` | Veritabanını örnek veriyle doldur |
| `backend` | `npm run db:backup` | MongoDB yedeği al |
| `backend` | `npm run db:restore` | Yedekten geri yükle |
| `frontend` | `npm run dev` | Vite geliştirme sunucusu |
| `frontend` | `npm run build` | Production bundle (1833 modül, 0 hata) |
| `frontend` | `npm run preview` | Production build önizlemesi |

---

## 🤝 Katkıda Bulunma

```bash
# 1. Yeni dal aç
git checkout -b feature/<ozellik-adi>

# 2. Değişikliklerini commit et
git commit -m "feat: açıklama"

# 3. Push et ve PR aç
git push origin feature/<ozellik-adi>
# → GitHub'da Pull Request oluştur (main korumalıdır)
```

**Commit mesajı formatı:** `feat:` · `fix:` · `refactor:` · `docs:` · `chore:`

---

## 📄 Lisans

Bu proje **ISC** lisansı altında sunulmaktadır.

---

<div align="center">

**EduVerse** — *Öğrenmeyi yeniden tanımlıyoruz.*

[![GitHub](https://img.shields.io/badge/GitHub-enesaladagg%2FEduVerse-181717?style=flat-square&logo=github)](https://github.com/enesaladagg/EduVerse)

*EduVerse Ekibi tarafından sevgiyle inşa edildi* 🚀

**[⬆ Başa Dön](#eduverse--yeni-nesil-online-eğitim-platformu)**

</div>
