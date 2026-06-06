# 🎓 EduVerse — Yeni Nesil Online Eğitim & Öğrenme Platformu

![EduVerse Platform](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Tech Stack](https://img.shields.io/badge/Stack-MERN_|_Vite_|_WebRTC-00d4aa)
![License](https://img.shields.io/badge/License-ISC-purple)

**EduVerse**, interaktif, gerçek zamanlı ve oyunlaştırılmış bir modern online eğitim platformudur. Standart LMS (Öğrenim Yönetim Sistemi) kalıplarını kırarak, öğrencilere ve eğitmenlere "dünya standartlarında" bir SaaS deneyimi sunmayı hedefler.

Kapsamlı canlı ders altyapısı (WebRTC & Socket.io), interaktif kod laboratuvarı, çok oyunculu beyaz tahta, detaylı kariyer yol haritaları ve kurumsal B2B çözümleri ile tam donanımlı bir ekosistemdir.

---

## ✨ Öne Çıkan Özellikler

🚀 **Gerçek Zamanlı Canlı Dersler (EduFlow Live)**
- WebRTC ve Socket.io destekli kesintisiz sesli/görüntülü yayın.
- Öğretmen ve öğrenciler için anlık sohbet, canlı anketler ve el kaldırma modülü.
- **Canlı Beyaz Tahta:** Eğitmenlerin ve yetki verilen öğrencilerin eşzamanlı çizim yapabileceği interaktif tahta.
- **Canlı Kod Laboratuvarı:** Gerçek zamanlı kod yazma ve paylaşma ortamı (Code Sandbox).

🏆 **Oyunlaştırma (Gamification) & Topluluk**
- Başarı sistemi: Puan (XP), seviyeler ve açılabilir rozetler (Badges).
- Dinamik liderlik tablosu ve DiceBear destekli vektörel profiller.
- Forum tartışmaları ve çalışma grupları ile aktif öğrenci topluluğu.

🗺️ **Kariyer Yol Haritaları & Planlama**
- Öğrenciler için hedef odaklı, etkileşimli kariyer yol haritaları (Roadmaps).
- Yapay zeka destekli Pomodoro sayacı ve kişisel çalışma takvimi (Planner).

🏢 **Kurumsal Çözümler (B2B)**
- Şirketlere özel raporlama, SSO entegrasyonları, dedike eğitmen ve gelişmiş analitik modülü.
- Tamamen özelleştirilebilir kurumsal arayüz.

🎨 **Dünya Standartlarında Modern Arayüz**
- **Sıfırdan Tasarlanmış Vanilla CSS Design System** (Tailwind veya dış kütüphane kısıtlamaları olmadan, tamamen esnek).
- Aydınlık ve Karanlık (Dark/Light) Mod desteği.
- Pürüzsüz mikro-animasyonlar, Glassmorphism detayları ve `lucide-react` destekli premium ikonografi.

---

## 🛠 Teknoloji Yığını (Tech Stack)

### 💻 Frontend (İstemci)
- **Framework:** React 18 + Vite
- **Styling:** Vanilla CSS (Özel Design System, CSS Variables)
- **İkonografi:** Lucide React
- **Durum Yönetimi (State):** React Context API (Theme, Auth, Cart)
- **Gerçek Zamanlı İletişim:** Socket.io-client, Simple-peer (WebRTC)

### ⚙️ Backend (Sunucu)
- **Çekirdek:** Node.js, Express.js
- **Veritabanı:** MongoDB (Mongoose)
- **Gerçek Zamanlı İletişim:** Socket.io (Oda yönetimi, anketler, mesajlaşma)
- **Güvenlik & Yetkilendirme:** JWT (JSON Web Token), bcrypt

---

## 🚀 Hızlı Başlangıç

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin.

### Gereksinimler
- Node.js (v18.0 veya üzeri)
- MongoDB (v6.0 veya üzeri)
- MongoDB Database Tools (Yedekleme scriptleri için `mongodump` / `mongorestore`)

### 1. Backend Kurulumu

Terminalinizi açın ve backend dizinine gidin:

```bash
cd backend

# Ortam değişkenleri dosyasını kopyalayın
cp .env.example .env

# Bağımlılıkları yükleyin
npm install

# (Opsiyonel) Test verilerini veritabanına yükleyin
npm run db:seed

# Geliştirme sunucusunu başlatın
npm run dev
```

### 2. Frontend Kurulumu

Yeni bir terminal penceresi açın ve frontend dizinine gidin:

```bash
cd frontend

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Tebrikler! Platform artık **`http://localhost:5173`** adresinde çalışıyor.

---

## 🔐 Test ve Demo Hesapları

Uygulamayı test etmek için veritabanını seedlediyseniz (`npm run db:seed`), aşağıdaki örnek hesaplarla giriş yapabilirsiniz:

| Rol | E-posta | Şifre |
| :--- | :--- | :--- |
| **Eğitmen** | `teacher@demo.com` | `Demo12345!` |
| **Öğrenci** | `student@demo.com` | `Demo12345!` |

> **Canlı Ders Testi İçin:** Sisteme eğitmen veya öğrenci olarak giriş yaptıktan sonra, sol menüden "Canlı Dersler" paneline giderek test odasına katılabilir ve WebRTC/Socket özelliklerini canlı deneyebilirsiniz.

---

## 📂 Proje Yapısı

```text
online-egitim-platformu/
├── backend/                  # REST API & Socket Sunucusu
│   ├── config/               # Veritabanı ve çevre yapılandırmaları
│   ├── models/               # MongoDB şemaları (User, Course, LiveSession vb.)
│   ├── routes/               # Express endpoint rotaları
│   ├── socket/               # WebRTC, Chat, Whiteboard için Socket.io yöneticileri
│   └── scripts/              # Seed (Örnek veri), Backup ve Restore betikleri
│
├── frontend/                 # React UI
│   ├── src/components/       # Yeniden kullanılabilir global bileşenler
│   ├── src/components/eduflow/ # Canlı ders arayüzüne özel bileşenler
│   ├── src/context/          # Global State (Auth, Theme, Cart)
│   ├── src/design-system/    # CSS tokenları ve tasarım rehberi
│   ├── src/hooks/            # Özel Hooklar (useSocket, useWebRTC)
│   └── src/views/            # Sayfa görünümleri (Home, Dashboard vb.)
│
└── docs/                     # Sistem mimarisi ve analiz raporları
```

---

## 📜 NPM Script Komutları

| Dizin | Komut | Açıklama |
| :--- | :--- | :--- |
| `backend` | `npm run dev` | Sunucuyu nodemon ile geliştirme modunda başlatır. |
| `backend` | `npm run db:seed` | Veritabanını örnek verilerle doldurur (Kullanıcı, kurs vb.). |
| `backend` | `npm run db:backup` | Veritabanının tam yedeğini alır. |
| `frontend` | `npm run dev` | Vite geliştirme sunucusunu başlatır. |
| `frontend` | `npm run build` | Üretime (Production) hazır optimize edilmiş bundle oluşturur. |

---

## 📄 Lisans & Katkıda Bulunma

Bu proje **ISC** lisansı ile lisanslanmıştır. Geliştirmeler ve öneriler için `Pull Request` gönderebilir veya `Issue` açabilirsiniz. Sistem analizi detayları için `docs/` klasöründeki belgeleri ve `projeakisi.md` dosyasını inceleyebilirsiniz.

---
*EduVerse Team tarafından sevgiyle kodlandı.* 💻🚀
