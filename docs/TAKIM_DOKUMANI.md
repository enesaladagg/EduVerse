# EduVerse — Ekip Teknik Belgesi

> **Bu belge ekip arkadaşları için hazırlanmıştır.**  
> Projenin ne olduğunu, nasıl çalıştığını, hangi teknolojilerin neden seçildiğini ve son sürümde neler değiştiğini adım adım açıklamaktadır.

---

## 1. Projeye Hızlı Bakış

**EduVerse**, öğrenci ve eğitmenlerin buluştuğu, WebRTC tabanlı canlı ders, SMS/e-posta kimlik doğrulama, oyunlaştırma ve kurumsal B2B özellikleri olan full-stack bir eğitim platformudur.

| Özellik | Detay |
|:---|:---|
| **Tür** | Full-stack SaaS Web Uygulaması |
| **Backend** | Node.js + Express.js |
| **Frontend** | React 18 + Vite |
| **Veritabanı** | MongoDB (Mongoose ODM) |
| **Gerçek Zamanlı** | Socket.io + WebRTC (Simple-peer) |
| **Auth** | JWT + bcrypt + Google/LinkedIn OAuth + SMS OTP |
| **E-posta** | Nodemailer + Gmail SMTP |
| **SMS** | Twilio (dev'de console-log fallback) |
| **Repo** | https://github.com/enesaladagg/EduVerse |

---

## 2. Mimari — Büyük Resim

```
Tarayıcı (React SPA)
       │
       │  HTTPS (REST API)          WebSocket (Socket.io)
       ▼                                    ▼
┌─────────────────────────────────────────────────┐
│              Express.js Sunucusu                │
│                                                 │
│  Middleware Zinciri:                            │
│  Helmet → RateLimit → CORS → mongo-sanitize     │
│         → Joi Validate → JWT Auth → Handler     │
│                                                 │
│  Routes:  /api/auth  /api/courses  /api/admin  │
│           /api/community  /api/certificates     │
│           /api/payment  /api/upload             │
│                                                 │
│  Socket Handlers:                               │
│  webrtc · whiteboard · chat · poll · seminar   │
│                                                 │
│  Harici Servisler:                              │
│  Nodemailer (Gmail SMTP) · Twilio SMS           │
│  Passport.js (Google / LinkedIn OAuth)          │
└────────────────────────┬────────────────────────┘
                         │
                         ▼
                    MongoDB
        ┌────────────────────────────┐
        │  User · Course             │
        │  Certificate · LiveSession │
        │  CommunityPost · Assignment│
        │  CtfChallenge              │
        └────────────────────────────┘
```

---

## 3. Klasör Yapısı (Önemli Dosyalar)

```
EduVerse/
├── backend/
│   ├── config/
│   │   ├── db.js          → MongoDB bağlantısı (connection pool ayarları)
│   │   ├── env.js         → Ortam değişkenlerini doğrular, uygulamaya aktarır
│   │   └── passport.js    → Google + LinkedIn OAuth stratejileri
│   │
│   ├── middleware/
│   │   ├── auth.js        → authenticate() ve authorize(...roles) fonksiyonları
│   │   ├── validate.js    → Joi şema doğrulama fabrikası
│   │   ├── asyncHandler.js→ try/catch sarmalayıcı (route'larda async hata yönetimi)
│   │   └── errorHandler.js→ Uygulama geneli JSON hata yanıtı
│   │
│   ├── models/
│   │   └── User.js        → Kullanıcı şeması (email, phone, OTP, reset token alanları)
│   │
│   ├── routes/
│   │   └── auth.js        → Tüm kimlik doğrulama endpoint'leri (10 adet)
│   │
│   ├── utils/
│   │   ├── email.js       → HTML e-posta şablonları + Nodemailer gönderici
│   │   └── sms.js         → Twilio SMS gönderici (+ dev fallback)
│   │
│   └── socket/
│       ├── handlers/      → WebRTC, tahta, sohbet, anket, seminer
│       └── roomManager.js → Bellek-içi oda durumu (Map)
│
├── frontend/src/
│   ├── context/
│   │   └── AuthContext.jsx→ Tüm auth fonksiyonları burada toplanır
│   ├── services/
│   │   └── api.js         → Tüm API çağrıları tek dosyada (axios)
│   ├── views/
│   │   ├── LoginView.jsx  → E-posta/Telefon tab seçici + şifremi unuttum
│   │   ├── RegisterView.jsx→ E-posta/Telefon tab seçici + OTP adımı
│   │   └── ResetPasswordView.jsx → Şifre sıfırlama sayfası
│   └── App.jsx            → Sayfa yönlendirme + reset-password URL algılama
│
└── docs/
    ├── TAKIM_DOKUMANI.md  ← bu dosya
    ├── SUNUM_REHBERI.md   ← hoca sunumu
    └── CHANGELOG.md
```

---

## 4. Kimlik Doğrulama Sistemi (Auth) — v2.0

Bu, projenin en büyük güncellemesidir. Şimdi **4 farklı kayıt/giriş yöntemi** desteklenmektedir.

### 4.1 E-posta ile Kayıt + OTP Doğrulama

```
Kullanıcı form doldurur
        │
        ▼
POST /api/auth/register
        │
        ├─ Joi şema doğrulama
        ├─ Şifre bcrypt ile hash'lenir (salt:12)
        ├─ Kullanıcı DB'ye kaydedilir (isVerified: false)
        └─ 6 haneli OTP oluşturulur → maile gönderilir
                │
                ▼
POST /api/auth/verify-email  (kullanıcı kodu girer)
        │
        ├─ OTP eşleşmesi + süre kontrolü (24 saat)
        └─ isVerified: true → JWT döndürülür
```

### 4.2 Telefon ile Kayıt + SMS OTP

```
POST /api/auth/register-phone  (+90 5xx xxx xx xx formatı)
        │
        ├─ 6 haneli SMS OTP oluşturulur → Twilio ile gönderilir
        └─ Kullanıcı kaydedilir (isPhoneVerified: false)
                │
                ▼
POST /api/auth/verify-phone
        │
        ├─ OTP kontrolü (10 dakika geçerli)
        └─ isPhoneVerified: true → JWT döndürülür
```

### 4.3 Telefon ile Şifresiz Giriş

```
POST /api/auth/send-phone-otp  (kayıtlı telefon numarası)
        │
        └─ SMS OTP gönderilir (10 dk geçerli)
                │
                ▼
POST /api/auth/login-phone
        │
        └─ OTP doğrulanır → JWT döndürülür
```

### 4.4 Şifremi Unuttum / Sıfırla

```
POST /api/auth/forgot-password  (e-posta adresi)
        │
        ├─ crypto.randomBytes(32) → ham token
        ├─ SHA-256(ham token) → DB'ye kaydedilir
        └─ Ham token link içinde maile gönderilir
           (http://localhost:5173?action=reset-password&token=xxx)
                │
                ▼
Kullanıcı linke tıklar → ResetPasswordView açılır
                │
                ▼
POST /api/auth/reset-password/:token
        │
        ├─ Gelen token SHA-256 ile hash'lenir
        ├─ DB'deki hash ile karşılaştırılır
        ├─ Süre kontrolü (1 saat)
        └─ Yeni şifre bcrypt ile kaydedilir
```

> **Neden SHA-256?** Ham token asla DB'de saklanmaz. Birisi DB'ye sızsaydı bile token'ı kullanamazdı — sadece hash görür.

### 4.5 Google / LinkedIn OAuth

```
GET /api/auth/google → Passport.js → Google consent ekranı
        │
        ▼
Google callback → Kullanıcı DB'de yoksa oluşturulur
        │          (isVerified: true otomatik)
        ├─ Yeni kullanıcıya "Hoş Geldin" maili gönderilir
        └─ JWT ile frontend'e yönlendirilir
```

---

## 5. E-posta Servisi (`backend/utils/email.js`)

Üç farklı HTML şablon mevcuttur:

| Şablon | Ne Zaman Gönderilir |
|:---|:---|
| `verifyEmail` | E-posta ile kayıt olunduğunda (OTP içerir) |
| `welcome` | Google/LinkedIn OAuth ile ilk kez kayıt olunduğunda |
| `resetPassword` | Şifremi unuttum isteğinde (sıfırlama linki içerir) |

**Konfigürasyon** (`backend/.env`):
```env
SMTP_USER=gmail-adresiniz@gmail.com
SMTP_PASS=gmail-uygulama-sifresi   # Gmail > Hesap > Güvenlik > Uygulama Şifreleri
```

> SMTP ayarlanmadıysa e-posta gönderimler sessizce atlanır (hata vermez).

---

## 6. SMS Servisi (`backend/utils/sms.js`)

```javascript
// Twilio varsa: gerçek SMS gönderir
// Twilio yoksa: console.log('[SMS-TEST] To: +90... | Message: ...')
```

**Konfigürasyon** (`backend/.env`):
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxx
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
```

Ücretsiz deneme hesabı: https://twilio.com/try-twilio  
(Türkiye numaralarına +90 ile SMS gönderebilir)

---

## 7. Kullanıcı Modeli (`backend/models/User.js`)

Önemli alanlar:

```javascript
email:               { sparse: true, unique: true }  // telefon-only kullanıcılar için opsiyonel
phone:               { sparse: true, unique: true }  // uluslararası format (+905...)
isPhoneVerified:     Boolean
phoneOtp:            String  (select: false — sorgu yanıtında görünmez)
phoneOtpExpires:     Date
passwordResetToken:  String  (select: false — SHA-256 hash)
passwordResetExpires:Date
isVerified:          Boolean  (e-posta için)
googleId / linkedinId: String
role:                'student' | 'teacher' | 'admin'
```

---

## 8. Frontend — Yeni Sayfalar ve Değişiklikler

### LoginView.jsx
- **Sliding pill tab**: E-posta SVG ikonu / Telefon SVG ikonu
- E-posta sekmesi: normal giriş + "Şifremi Unuttum" akışı (3 adım)
- Telefon sekmesi: numara gir → OTP → giriş

### RegisterView.jsx
- **Sliding pill tab**: aynı şekilde
- E-posta sekmesi: kayıt + OTP doğrulama adımı
- Telefon sekmesi: isim + numara + şifre → OTP → kayıt tamamlandı
- Numara otomatik formatlanır: `05xx...` → `+905xx...`

### ResetPasswordView.jsx *(Yeni Sayfa)*
- URL'den `?action=reset-password&token=xxx` algılanır
- Şifre güç göstergesi (Zayıf / Orta / Güçlü)
- Şifre eşleşme kontrolü
- Başarı animasyonu → 2.5 saniye sonra ana sayfaya yönlendirme

### App.jsx
- `ToastProvider` eklendi (uygulama geneli bildirimler)
- `reset-password` route eklendi
- URL parametreleri algılanır, sayfa yüklenmeden önce URL temizlenir

---

## 9. Güvenlik Sertleştirme Özeti (v2.0)

| Değişiklik | Neden |
|:---|:---|
| `JWT_SECRET` 96 karakter rastgele | Kısa/tahmin edilebilir secret → brute-force riski |
| `CLIENT_URL` / `BACKEND_URL` env var | Hardcoded `localhost` → production'da çalışmaz |
| `VITE_API_URL` frontend env var | Frontend kodu backend URL'ini hardcode etmemeli |
| `frontend/.env` → .gitignore | Gizli değerlerin repoya girmesini engeller |
| `frontend/.env.example` → commit | Yeni geliştiriciler ne koyacağını bilir |
| Reset token SHA-256 hash | DB sızıntısında token kullanılamaz |
| OTP `select: false` | Sorgularda OTP alanları otomatik gizlenir |

---

## 10. Yerel Ortamda Çalıştırma (Adım Adım)

### Ön Koşullar
- Node.js v18+ kurulu olmalı
- MongoDB yerel kurulu ya da Atlas bağlantı string'i hazır olmalı
- Git kurulu olmalı

### Adımlar

```bash
# 1. Repoyu klonla
git clone https://github.com/enesaladagg/EduVerse.git
cd EduVerse

# 2. Backend kurulumu
cd backend
cp .env.example .env
# .env dosyasını metin editörüyle aç ve doldur:
# MONGO_URI, JWT_SECRET, SMTP_USER, SMTP_PASS, CLIENT_URL
npm install
npm run db:seed       # Test verileri yükle (admin/teacher/student hesapları)
npm run dev           # Sunucu başlar: http://localhost:5000

# 3. Yeni terminal aç — Frontend kurulumu
cd frontend
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api  (zaten doğru)
npm install
npm run dev           # Uygulama açılır: http://localhost:5173
```

### Test Hesapları

| Rol | E-posta | Şifre |
|:---|:---|:---|
| Admin | admin@demo.com | Demo12345! |
| Eğitmen | teacher@demo.com | Demo12345! |
| Öğrenci | student@demo.com | Demo12345! |

---

## 11. Sık Karşılaşılan Sorunlar

| Sorun | Çözüm |
|:---|:---|
| `MongoDB bağlantı hatası` | `MONGO_URI` değerini kontrol et; MongoDB servisi çalışıyor mu? |
| `JWT_SECRET too short` | `.env`'deki secret en az 32 karakter olmalı |
| `E-posta gitmiyor` | `SMTP_USER` ve `SMTP_PASS` ayarlı mı? Gmail'de uygulama şifresi oluşturuldu mu? |
| `SMS gitmiyor` | Normal — Twilio yoksa `[SMS-TEST]` terminal çıktısında görünür |
| `CORS hatası` | `CORS_ORIGINS=http://localhost:5173` backend `.env`'de ayarlı mı? |
| `Port kullanımda` | `PORT=5000` başka bir uygulama tarafından kullanılıyor olabilir |

---

## 12. Git Dallanma Stratejisi

```
main ──────────────────────────────── (stabil, koruma altında)
  │
  └── feature/phase1-settings ──────── (bu oturum: auth v2.0)
  └── feature/<yeni-ozellik> ───────── (gelecek geliştirmeler için)
```

Her özellik ayrı bir `feature/` dalında geliştirilir, PR ile `main`'e alınır.

---

*Son güncelleme: Haziran 2026 — EduVerse v2.0*
