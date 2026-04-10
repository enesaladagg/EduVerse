# 🕵️‍♀️ Proje Güvenlik ve Test Raporu (Online Eğitim Platformu)

 
## 🔒 1. Güvenlik Denetimleri (Security Checks)
 

### 🚨 A. Şifrelerin Düz Metin (Plaintext) Olarak Saklanması
- **Sorun:** `backend/routes/users.js` dosyasında `User.create(req.body)` kullanılırken, kullanıcının girdiği şifre (password) modelde herhangi bir hashleme işleminden geçmeden veritabanına doğrudan kaydediliyor.
- **Tehlike:** Veritabanına sızılması halinde tüm kullanıcı parolaları doğrudan açığa çıkar.
- **Çözüm (Tatlı Reçete):** Parolaları kaydetmeden önce **bcryptjs** veya **argon2** kullanarak hashlemelisin. `User.js` Mongoose modeline bir `pre('save')` middleware ekleyerek her yeni kayıt veya şifre güncellemesinde bu işlemin otomatik yapılmasını sağlayabilirsin.

### 🚨 B. Toplu Atama (Mass Assignment) Zafiyeti
- **Sorun:** Kullanıcı oluşturulurken `req.body` doğrudan veritabanına aktarılıyor (`await User.create(req.body);`).
- **Tehlike:** Zararını bilmeyen bir kullanıcı, isteğini modifiye ederek `{"role": "teacher"}` verisini gönderip sistemde yetkisiz şekilde öğretmen (veya ileride admin) yetkisine sahip olabilir.
- **Çözüm (Tatlı Reçete):** Gelen isteklerdeki alanları net bir şekilde filtrelemelisin. Destructuring kullanarak `const { name, email, password } = req.body;` şeklinde sadece istediğin verileri veritabanına yazmalısın. Gelişmiş doğrulama için **Zod** veya **Joi** kütüphaneleri harika iş çıkarır!

### 🚨 C. Kimlik Doğrulama (Authentication & Authorization) Eksikliği
- **Sorun:** Kullanıcılar için herhangi bir giriş mekanizması, oturum yönetimi veya `JWT` (JSON Web Token) koruması bulunmuyor.
- **Tehlike:** Rotalara (routes) erişim açık, herkes istediği veriyi okuyabilir veya müdahale edebilir.
- **Çözüm (Tatlı Reçete):** Kullanıcı giriş yaptıktan sonra asimetrik imzalanmış bir `JWT` dönen bir `auth` middleware'i yazmalısın. Özel rotaları (örneğin kurs oluşturma) `requireAuth` gibi bir middleware ile koruma altına almalısın.

### 🚨 D. Güvenlik Başlıkları (Security Headers) ve Hız Sınırı (Rate Limiting)
- **Sorun:** Express ayarlarında ( `app.js` ) XSS, Clickjacking gibi oltalama tekniklerine karşı koruma sağlayan `Helmet` kullanılmamış. Ayrıca API saniyede binlerce isteğe maruz kalabilir (DDoS tehlikesi).
- **Çözüm (Tatlı Reçete):** Express arasına `app.use(helmet())` eklemelisin ve brute-force saldırılarını engellemek için `express-rate-limit` kütüphanesini dahil etmelisin.

### 🚨 E. Bağımlılık (Dependency) Zafiyetleri (Frontend)
- **Sorun:** Frontend tarafında yaptığım `npm audit` taramasında Vite v8.0.0 üzerinde **Yüksek (High) seviyeli** `Path Traversal` ve `Arbitrary File Read` zafiyetleri tespit ettim.
- **Çözüm (Tatlı Reçete):** Frontend klasöründe `npm audit fix` komutunu çalıştırıp Vite sürümünü güvenli bir sürüme (örneğin v8.0.4+) güncellemen yeterli olacaktır.

---

## 🧪 2. Yazılım Mühendisliği ve Test Prensipleri

Kaliteli yazılım, test edilebilir yazılımdır. Projenin test edilebilirlik durumu ve prensip analizlerim şu şekilde:

### 🛠️ A. Test Süitlerinin (Test Suites) Bulunmaması
- **Durum:** Ne Frontend (React) tarafında ne de Backend (Node.js/Express) tarafında yazılmış bir "Birim Testi (Unit Test)" veya "Entegrasyon Testi" bulunmuyor.
- **Prensip İhlali:** Test Driven Development (TDD) veya Behavior Driven Development (BDD) eksikliği, projenin büyümesiyle "bir yeri yaparken başka bir yeri kırma" (Regression) ihtimalini %100'lere çıkartır.
- **Çözüm (Tatlı Reçete):** 
  - **Backend için:** `Jest` ve `Supertest` kurarak API endpointlerini otomatiğe bağlayabilirsin.
  - **Frontend için:** `Vitest` ve `React Testing Library` kurarak bileşenlerin (component) doğru render edilip edilmediğini kontrol edebilirsin.

### 🛠️ B. Katmanlı Mimari (N-Tier Architecture - Controller/Service/Repository)
- **Durum:** Şu anki yapıda route dosyası olan `users.js` içinde Route tanımlaması, İş mantığı (Business Logic) ve Veritabanı sorguları (`User.find()`, `User.create()`) iç içe geçmiş durumda.
- **Gelişim Fırsatı:** "Separation of Concerns (Kavramların Ayrılığı)" prensibine göre bu çok iyi bir pratik değil ve birim test yazmayı zorlaştırıyor.
- **Çözüm (Tatlı Reçete):** 
  - `routes` klasörü *sadece* HTTP İstek-Cevap akışını yönlendirmeli.
  - `controllers` klasörü açarak iş kurallarını (validasyon vb.) orada tutmalısın.
  - Veritabanı işlemleri için `services` veya `repositories` adında yeni bir katman oluşturarak mantığı birbirinden tamamen soyutlamalısın.

---

