# 🎓 EduVerse — Yeni Nesil Online Eğitim & Öğrenme Platformu

![Status](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.2.0-blue)
![Stack](https://img.shields.io/badge/Stack-MERN_|_Vite_|_WebRTC-00d4aa)
![License](https://img.shields.io/badge/License-ISC-purple)

**EduVerse**, interaktif, gerçek zamanlı ve oyunlaştırılmış bir modern online eğitim platformudur. Öğrencilere ve eğitmenlere "dünya standartlarında" bir SaaS deneyimi sunmayı hedefler.

---

## ✨ Öne Çıkan Özellikler

🚀 **Gerçek Zamanlı Canlı Dersler (EduFlow Live)**
- WebRTC & Socket.io ile sesli/görüntülü yayın, anlık sohbet, el kaldırma modülü.
- Eşzamanlı çizim destekli **Canlı Beyaz Tahta** ve **Canlı Kod Laboratuvarı**.

🏆 **Oyunlaştırma (Gamification) & Topluluk**
- XP, seviyeler, rozetler ve dinamik liderlik tablosu.
- Forum tartışmaları (Topluluk Sayfası) ile canlı gönderi, yorum ve beğeni sistemi.

🗺️ **Kariyer Yol Haritaları & Planlama**
- Etkileşimli kariyer yol haritaları (Full Stack, Data Science, DevOps, Mobil).
- Pomodoro sayacı ve kişisel çalışma takvimi.

🛡️ **Eğitmen Doğrulama Sistemi**
- Kullanıcılar kayıt sırasında eğitmenlik başvurusu yapabilir.
- Yöneticiler (Admin), başvuruları inceleyerek **onaylar veya reddeder**.
- Rol ataması tamamen güvende; kimse kendini doğrudan eğitmen yapamaz.

🏢 **Kurumsal Çözümler (B2B)**
- Şirketlere özel raporlama, SSO entegrasyonları ve fiyatlandırma planları.

🎨 **Modern Dark/Light Mode Tasarım**
- Sıfırdan Vanilla CSS Design System, glassmorphism, mikro-animasyonlar.

---

## 🛠 Teknoloji Yığını

| Katman | Teknoloji |
|:---|:---|
| **Frontend** | React 18 + Vite, Vanilla CSS, Lucide React, Socket.io-client |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose) |
| **Gerçek Zamanlı** | Socket.io, Simple-peer (WebRTC) |
| **Güvenlik** | JWT, bcryptjs, Helmet, express-rate-limit, mongo-sanitize |
| **Validasyon** | Joi (request validation middleware) |

---

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js `v18+`
- MongoDB `v6+`

### 1. Backend Kurulumu

```bash
cd backend

# Ortam değişkenlerini kopyala
cp .env.example .env
# .env dosyasını düzenleyip MONGO_URI ve JWT_SECRET değerlerini gir

npm install

# (Opsiyonel) Test verilerini yükle
npm run db:seed

# Geliştirme sunucusunu başlat
npm run dev
# → http://localhost:5000
```

### 2. Frontend Kurulumu

```bash
cd frontend

npm install

npm run dev
# → http://localhost:5173
```

---

## 🔐 Test Hesapları

`npm run db:seed` çalıştırdıktan sonra aşağıdaki hesaplarla giriş yapabilirsiniz:

| Rol | E-posta | Şifre |
|:---|:---|:---|
| **Admin** | `admin@demo.com` | `Demo12345!` |
| **Eğitmen** | `teacher@demo.com` | `Demo12345!` |
| **Öğrenci** | `student@demo.com` | `Demo12345!` |

> **Eğitmen Olmak İsteyenler:** Kayıt ekranında "Eğitmen Ol (Başvuru)" seçeneğini seçerek başvuru yapabilirsiniz. Admin hesabından giriş yapıp **Eğitmen Başvuruları** bölümünden onaylayabilirsiniz.

---

## 📂 Proje Yapısı

```text
online-egitim-platformu/
├── backend/
│   ├── config/         # DB ve ortam değişkeni yapılandırması
│   ├── middleware/      # auth, asyncHandler, errorHandler, validate
│   ├── models/          # Mongoose şemaları (User, Course, Certificate, CommunityPost…)
│   ├── routes/          # Express rotaları (auth, admin, courses, payment, community…)
│   ├── socket/          # Socket.io yöneticileri (chat, whiteboard, webrtc)
│   ├── utils/           # Logger, AppError, corsOrigins
│   └── scripts/         # Seed, backup ve restore betikleri
│
└── frontend/
    └── src/
        ├── components/      # GlobalNavbar, CartDrawer, PomodoroTimer, PageBlocks…
        ├── context/         # ThemeContext, AuthContext, CartContext
        ├── hooks/           # useSocket, useWebRTC
        ├── services/        # api.js — tüm backend çağrıları tek dosyada
        ├── views/           # Sayfa bileşenleri
        │   ├── admin/       # AdminDashboardView
        │   └── instructor/  # InstructorDashboardView
        └── design-system/   # CSS token ve yardımcı sınıflar
```

---

## 📜 NPM Komutları

| Dizin | Komut | Açıklama |
|:---|:---|:---|
| `backend` | `npm run dev` | Nodemon ile geliştirme sunucusu |
| `backend` | `npm run db:seed` | Örnek verilerle veritabanını doldur |
| `backend` | `npm run db:backup` | Veritabanı yedeği al |
| `frontend` | `npm run dev` | Vite geliştirme sunucusu |
| `frontend` | `npm run build` | Production build |

---

## 🔒 Güvenlik Notları

- JWT tokenlar `15 dakika` veya yapılandırılmış süre sonra sona erer.
- Tüm auth uç noktalarına `rate-limit` (15 dk'da 20 istek) uygulanmıştır.
- `express-mongo-sanitize` ile NoSQL injection koruması aktif.
- `helmet` ile güvenlik HTTP başlıkları otomatik eklenir.
- `purchasedCourses` alanı yalnızca backend callback üzerinden güncellenir.

---

## 📄 Lisans

**ISC** Lisansı. Katkıda bulunmak için `Pull Request` gönderin ya da `Issue` açın.

---
*EduVerse Team tarafından sevgiyle kodlandı.* 💻🚀
