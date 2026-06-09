# PROJE AKIŞI VE HAFTALIK RAPOR

Bu dosya, projemizin haftalık gelişimini ve ekip üyelerinin katkılarını takip etmek amacıyla oluşturulmuştur.

---

## HAFTA 1

### 1. Proje Hedefleri ve Paydaş Analizi

**Sorumlu:** ALAA K M MADI

Projenin Amacı
Bu projenin amacı, öğrenciler ve öğretmenlerin dijital bir eğitim ortamında etkileşim kurmasını sağlayan bir online eğitim platformu oluşturmaktır.  
Platform, canlı dersler yapma, video üzerinden iletişim kurma, ödevleri yönetme ve öğrencilerin performansını kolay ve düzenli bir şekilde değerlendirme imkanı sunacaktır.

---

Projenin Kapsamı
Proje kapsamında aşağıdaki temel özellikler yer alacaktır:

- Kullanıcı kayıt ve giriş sistemi (öğrenciler ve öğretmenler için)  
- Hesap oluşturma ve yönetimi  
- Canlı ders sistemi (Live Classes)  
- WebRTC kullanarak video konferans entegrasyonu  
- Ödev yönetim sistemi  
- Notlandırma ve değerlendirme sistemi  
- Mobil ve masaüstü cihazlarla uyumlu (responsive) kullanıcı arayüzü  

---

 Projenin Hedefleri
- Online ortamda etkileşimli bir eğitim deneyimi sunmak  
- Öğrenciler ve öğretmenler arasındaki iletişimi kolaylaştırmak  
- Öğretmenlerin dersleri ve ödevleri kolayca yönetmesini sağlamak  
- Tüm kullanıcılar için basit ve kullanıcı dostu bir deneyim sunmak  

---

 Paydaşlar (Stakeholders)

Öğrenciler
Platformun temel kullanıcılarıdır. Canlı derslere katılırlar, ders içeriklerini görüntülerler ve ödevlerini sisteme yüklerler.

Öğretmenler
Dersleri oluşturan, canlı dersleri yöneten, ödev veren ve öğrencileri değerlendiren kullanıcılardır.

Geliştirici Ekip
Frontend geliştiriciler (React), Backend geliştiriciler (Node.js ve Express.js) ve veritabanı mühendislerinden (MongoDB) oluşan ekip. Platformun teknik geliştirilmesinden sorumludurlar.

Proje Yöneticisi
Projenin planlanması, görevlerin organize edilmesi ve ekip üyeleri arasındaki çalışma sürecinin takip edilmesinden sorumludur.

Sistem Yöneticileri
Sunucuların, veritabanlarının ve sistem altyapısının yönetilmesinden ve platformun stabil çalışmasından sorumlu kişilerdir.

---

İletişim
Proje ile ilgili iletişim GitHub üzerinden ve ders sorumlusunun resmi web sitesi üzerinden gerçekleştirilecektir.

- GitHub: Proje görevlerinin paylaşılması, kod yönetimi ve ilerlemenin takip edilmesi için kullanılacaktır.  
- Web sitesi: https://www.ozalyildirim.com üzerinden duyurular ve proje ile ilgili akademik bilgilendirmeler takip edilecektir.


### 2. Fonksiyonel ve Fonksiyonel Olmayan Gereksinimler
**Sorumlu:** Hüseyin Enes DEMİR

**Fonksiyonel Gereksinimler (Sistemin Yapması Gerekenler):**
* **Kullanıcı Yönetimi:** Sisteme "Öğrenci" ve "Eğitmen" rolleriyle kayıt olunması, e-posta/şifre ile güvenli giriş (Authentication) yapılması ve kişiselleştirilmiş profil/ders panellerinin sunulması.
* **Canlı Ders ve İletişim:** WebRTC kullanılarak gecikmesiz görüntü ve ses aktarımı, eğitmenler için ekran paylaşımı ve ders içi metin tabanlı sohbet (Chat) imkanı.
* **Eğitim ve Değerlendirme:** Eğitmenlerin sisteme ders materyali (PDF, Video vb.) yükleyebilmesi, öğrencilerin atanmış ödevleri sistem üzerinden teslim edebilmesi ve eğitmenlerin bu ödevleri notlandırabilmesi.

**Fonksiyonel Olmayan Gereksinimler (Sistemin Sahip Olması Gereken Özellikler):**
* **Erişilebilirlik:** Tüm cihazlarda (mobil, tablet, masaüstü) sorunsuz çalışacak esnek (Responsive) tasarım.
* **Güvenlik:** Kullanıcı verilerinin MongoDB üzerinde güvenli tutulması ve oturum yönetiminin şifrelenmiş JWT (JSON Web Token) ile sağlanması.
* **Performans:** Canlı derslerdeki veri akışının, düşük internet hızlarında bile sürekliliği koruyacak şekilde optimize edilmesi.
* **Ölçeklenebilirlik:** Node.js asenkron altyapısı sayesinde sistemin, eşzamanlı kullanıcı artışlarına yanıt verebilecek kapasitede olması.

**Gereksinim Önceliklendirmesi (MoSCoW Analizi):**

| Öncelik Seviyesi | Özellik / Modül | Açıklama |
| :--- | :--- | :--- |
| **KRİTİK (Must)** | Kullanıcı Kayıt ve Yetkilendirme | Sistemin temel giriş kapısı. |
| **KRİTİK (Must)** | WebRTC Canlı Ders Altyapısı | Projenin ana fonksiyonu. |
| **YÜKSEK (Should)** | Ödev ve Notlandırma Sistemi | Eğitim sürecinin takibi için gerekli. |
| **ORTA (Could)** | Profil Özelleştirme ve Resim Yükleme | Kullanıcı deneyimini artırır. |
| **DÜŞÜK (Won't)** | Forum ve Tartışma Bölümü | İlk aşamada kapsam dışı bırakılacaktır. |

---

### 3. Teknoloji Araştırması ve Seçimi
**Sorumlu:** Muhammed Eren YAPRAKCI

**Kullanılacaklar:**
- Javascript
- React
- Node.js & Express.js
- MongoDB
- WebRTC

Frontend için **React**: React bileşen tabanlı bir dil olduğundan dolayı ödev listesi, sohbet penceresi, video oynatıcı gibi bileşenleri tek seferde yazıp bir çok yerde hızlı bir şekilde kullanılabilir ama uygulama büyüdükçe karmaşıklık artabilir fakat yapısından dolayı kullanılacak.

Backend için **Node.js & Express.js**: JavaScript tabanlı olduğundan ötürü frontend ve backendde aynı dili kullanılmış olacak. Asenkron ve event-driven yapılı olduğu için aynı anda yüzlerce kişi bile rahatlıkla yönetilebilecek.

Veritabanı için **MongoDB**: MongoDB hem şemasız olduğu için hem de kullanımı basit olduğu için bu projede kullanılacak. Karmaşık işlemleri yönetmek biraz zor olsa da yeterli olacaktır.

Canlı yayın için **WebRTC**: Gecikmesiz, ücretsiz ve açık kaynak bir proje olduğundan ötürü entegrasyonu ve kullanımı rahat. Sadece sıfırdan bir sistem yazmak bizi zorlayacağından ötürü belli başlı kütüphaneler kullanılabilir.

---

### 4. Genel Mimari Yapı ve Tasarım Desenleri
**Sorumlu:** ZÜBEYİR ASLAN

Projenin mimarisi, esnek bir öğrenme yönetim sistemi (LMS) kurmak amacıyla "Hibrit Kullanıcı Modeli" ve "Katmanlı Mimari" üzerine inşa edilmiştir. 

**Katmanlı Mimari (Layered Architecture):**
Sistem üç ana katmandan oluşmaktadır:
* **Sunum Katmanı:** Kullanıcının etkileşime girdiği mobil/web arayüzü (React ile geliştirilen Sidebar, Keşfet, Takvim bileşenleri).
* **İş Mantığı Katmanı:** Express.js/Node.js üzerinde çalışan, yetkilendirme, kurs ilerlemesi, ödev atama ve içerik yönetimi operasyonları.
* **Veri Katmanı:** Kullanıcı, kurs ve içerik verilerinin saklandığı veritabanı yapısı (Proje geneline uygun olarak MongoDB tabanlı).

**Kullanıcı Mimarisi (Hibrit Model):**
Öğretmen ve Öğrenci rolleri katı sınıflarla ayrılmaz; aynı `User` modelinin farklı yetkilere sahip görünümleridir. Kullanıcı aynı arayüz içinde "Öğrenci Paneli" ve "Eğitmen Paneli" arasında sorunsuzca geçiş yapabilir. Ortak veriler (ad-soyad, takvim, sertifikalar) tek bir merkezden yönetilir.

**Kullanılan Tasarım Desenleri (Design Patterns):**
* **Strategy Pattern:** Kullanıcının aktif moduna (Eğitmen/Öğrenci) göre sistem davranışının ve arayüz yetkilerinin dinamik olarak değişmesi.
* **Observer Pattern:** Sisteme yeni bir ödev veya içerik yüklendiğinde, ilgili öğrencilerin takvimlerinin otomatik olarak güncellenmesi.
* **Factory Pattern:** Sisteme eklenecek içerik tipine (Video, Sınav, PDF, Canlı Yayın) göre dinamik nesne üretimi sağlanması.

---

### 5. Geliştirme Ortamı Kurulumu
**Sorumlu:** Enes ALADAĞ
Yapılan Çalışmalar:

Projenin kaynak kodlarının yönetimi için GitHub üzerinde merkezi bir depo (repository) oluşturuldu.

Takım çalışmasında kod çakışmalarını önlemek amacıyla main (ana) dal korumaya (Branch Protection) alındı ve "Pull Request (PR)" zorunluluğu getirildi.

Frontend (Ön yüz) geliştirme ortamı için Vite & React, Backend (Arka plan) ortamı için temel Node.js iskeleti kuruldu ve sisteme entegre edildi.

Tüm ekibin haftalık ilerlemelerini tek bir merkezden raporlayabilmesi için projeakisi.md altyapısı hazırlandı.

---

## HAFTA 2 

### Proje Planlaması, Görev Dağılımı ve Risk Analizi
**Sorumlu:** Enes ALADAĞ
Birinci haftada tamamlanan analiz, mimari kararlar ve altyapı kurulumlarının ardından, projenin geliştirme sürecinin sorunsuz ilerleyebilmesi için 8 haftalık yol haritası belirlenmiş, alt görevler ekibe dağıtılmış ve olası riskler analiz edilerek çözüm stratejileri oluşturulmuştur.

---
### 1. Proje Riskleri ve Çözüm Önerileri
Projenin zamanında ve eksiksiz teslim edilebilmesi için öngörülen riskler ve bu risklere karşı alınacak önlemler şunlardır:

* **Risk 1: WebRTC Entegrasyonunun Karmaşıklığı**
  *Neden:* Video konferans sistemleri, NAT geçişleri ve eşler arası bağlantılar (P2P) nedeniyle karmaşık hatalar üretebilir.
  *Çözüm Önerisi:* WebRTC'yi sıfırdan yazmak yerine ilk aşamada **PeerJS** veya **Socket.io** gibi entegrasyonu hızlandıracak kütüphaneler kullanılarak prototip hızlıca ayağa kaldırılmalıdır.

* **Risk 2: GitHub Üzerinde "Merge Conflict" (Kod Çakışması) Krizleri**
  *Neden:* Ekip üyelerinin aynı anda çalışırken aynı dosyaları düzenlemesi.
  *Çözüm Önerisi:* PR kuralları tavizsiz uygulanacaktır. Ekip üyeleri modül bazlı (`feature/auth` vb.) dallar açmalı, küçük PR'lar göndermeli ve kodlarını sık sık `main` dalından güncellemelidir.

* **Risk 3: Veritabanı Yapısında Sonradan Çıkan Değişiklik İhtiyaçları**
  *Neden:* Yeni özellikler eklendikçe mevcut modellerin yetersiz kalması.
  *Çözüm Önerisi:* Veritabanı şemaları NoSQL esnekliğine uygun tasarlanmalı ve kodlamaya başlanmadan önce tüm ekip tarafından onaylanmalıdır.

* **Risk 4: Ekip İçi İletişimsizlik ve Görev Gecikmeleri**
  *Neden:* Takım üyelerinin akademik yoğunlukları nedeniyle görevlerin aksaması.
  *Çözüm Önerisi:* Süreç şeffaf bir şekilde GitHub üzerinden takip edilecek ve her ekip üyesi tıkandığı noktayı zaman kaybetmeden proje yöneticisine bildirecektir.

---

### 2. 8 Haftalık Proje Planı ve Görev Dağılımı

**Hafta 3: Veritabanı Şeması ve API Tasarımı**
* **Muhammed Eren YAPRAKCI:** API endpoint'lerinin belirlenmesi, veri akışının planlanması ve belgelenmesi.
* **ALAA K M MADI:** MongoDB veritabanı şemasının (Kullanıcı, Kurs, Ödev modelleri) oluşturulması ve ilişkilerin belirlenmesi.
* **Enes, Hüseyin, Zübeyir:** Önceki haftanın eksiklerinin kapatılması ve mimari inceleme.

**Hafta 4: Temel Backend ve Frontend Geliştirmeleri (Kodlamaya Geçiş)**
* **ZÜBEYİR ASLAN:** Temel CRUD API'lerinin ve JWT ile Auth (Giriş/Kayıt) sisteminin Node.js üzerinde kodlanması.
* **Hüseyin Enes DEMİR:** React ile uygulamanın ana iskeletinin, sayfa yönlendirmelerinin ve Auth sayfalarının tasarlanması.
* **Enes ALADAĞ:** Açılan ilk kod PR'larının incelenmesi, Code Review yapılması ve main branch'ine aktarılması.

**Hafta 5: Canlı Ders (WebRTC) Altyapısı ve Ödev Modülleri**
* **Muhammed Eren YAPRAKCI:** WebRTC ve Socket.io altyapısının kurularak gerçek zamanlı video/ses aktarım temellerinin atılması.
* **ALAA K M MADI:** Ödev Yönetim arayüzlerinin React ile geliştirilmesi.
* **ZÜBEYİR ASLAN:** Ödev ve Notlandırma sisteminin Backend API'lerinin yazılması.
* **Hüseyin Enes DEMİR:** Canlı ders odası arayüzünün (kamera/mikrofon butonları, katılımcı listesi) tasarlanması.
* **Enes ALADAĞ:** Modüllerin bağımsız testlerinin yapılması ve GitHub üzerinden süreç takibi.

**Hafta 6: Modül Entegrasyonları ve Gelişmiş Özellikler**
* **Hüseyin Enes DEMİR & ALAA K M MADI:** Yazılan tüm Backend API'lerinin Frontend'e (React) entegre edilmesi.
* **Muhammed Eren YAPRAKCI:** WebRTC bağlantılarındaki olası gecikme/kopma sorunlarının çözülmesi.
* **ZÜBEYİR ASLAN:** Canlı ders yetkilendirme kontrolleri ve güvenlik önlemlerinin Backend'e eklenmesi.
* **Enes ALADAĞ:** Frontend ve Backend birleştirilirken çıkacak kod çakışmalarının (Merge Conflict) çözülmesi ve ekibin koordine edilmesi.

**Hafta 7: Test, Hata Giderme (Bug Fix) ve Optimizasyon**
* **Tüm Ekip:** Uçtan uca testlerin yapılması, ortaya çıkan hataların çözülmesi ve mobil uyumluluk kontrolleri.
* **Enes ALADAĞ:** Projenin genel kalite kontrolü (QA) ve eksik dokümantasyonların toparlanması.

**Hafta 8: Canlıya Alma (Deployment) ve Proje Teslimi**
* **Enes ALADAĞ:** Projenin Frontend (Vercel) ve Backend platformlarına yüklenerek internete açılması.
* **Tüm Ekip:** Canlı ortamdaki uygulamanın test edilmesi, proje belgelerinin ve sunum dosyalarının son haline getirilerek teslim edilmesi.

---

## HAFTA 3

Bu hafta, projenin arka plan (backend) iskeletinin tasarımsal temelleri atılmış, veritabanı koleksiyonları kurgulanmış ve istemci (frontend) ile haberleşecek API uç noktaları (endpoints) belirlenmiştir.

### 1. Veritabanı Şemasının Oluşturulması ve İlişkiler (MongoDB)
**Sorumlu:** ALAA K M MADI

Projenin gereksinimlerine ve mimari kararlara uygun olarak MongoDB üzerinde aşağıdaki NoSQL veri şemaları (Schema) tasarlanmıştır:
* **Hibrit Kullanıcı (User) Modeli:** Eğitmen ve Öğrenci için ayrı tablolar oluşturmak yerine, esnekliği artırmak adına tek bir `User` koleksiyonu tasarlanmıştır. Kullanıcı yetkileri `role: 'student' | 'teacher'` alanı üzerinden yönetilecektir.
* **Kurs (Course) Modeli:** Eğitmenlerin oluşturduğu derslerin, ders içeriklerinin (video linkleri, PDF dokümanları) ve müfredatın tutulduğu şema tasarlanmıştır. Kursu oluşturan eğitmen, `User` koleksiyonundaki ID'si ile referans olarak bağlanmıştır.
* **Ödev (Assignment) Modeli:** Verilen ödevlerin açıklamaları, son teslim tarihleri ve puan durumlarının tutulduğu şema oluşturulmuştur.
* **Kayıt ve İlerleme (Enrollment/Submission):** Hangi öğrencinin hangi kursa kayıtlı olduğunu ve ödevlere yükledikleri dosyaları/aldıkları notları takip eden ilişki şemaları kurgulanmıştır.

---

### 2. API Endpoint'lerinin Belirlenmesi ve Belgelenmesi
**Sorumlu:** Muhammed Eren YAPRAKCI

Frontend (React) katmanının Backend (Node.js/Express) ile sağlıklı haberleşebilmesi için RESTful mimariye uygun API uç noktaları tasarlanmış ve veri akışı belgelenmiştir:
* **Kimlik Doğrulama (Auth) Rotaları:** Kullanıcı kaydı (`POST /api/auth/register`) ve JWT tabanlı güvenli giriş (`POST /api/auth/login`) uç noktaları tasarlanmıştır.
* **Kullanıcı (User) Rotaları:** Profil verilerini getirme ve güncelleme (`GET/PUT /api/users/:id`) işlemleri planlanmıştır.
* **Kurs (Course) Rotaları:** Eğitmenlerin yeni kurs oluşturması (`POST /api/courses`), öğrencilerin kursları listelemesi (`GET /api/courses`) ve kurs detaylarını görüntülemesi için gerekli JSON yapıları belirlenmiştir.
* **Ödev (Assignment) Rotaları:** Ödev oluşturma ve sisteme dosya teslim etme rotaları kurgulanmıştır.
* **Dokümantasyon:** Belirlenen tüm API istekleri, gönderilecek parametreler (req.body) ve dönecek yanıtlar (res.json) ekip içi iletişimi kolaylaştırmak adına belgelenmiştir (Postman/Swagger).

---

### 3. Mimari İnceleme 
**Sorumlular:** Enes ALADAĞ, Hüseyin Enes DEMİR, ZÜBEYİR ASLAN

* Muhammed ve Alaa'nın oluşturduğu veritabanı şemaları ve API tasarımları incelenmiş, sistem gereksinimlerini karşılayıp karşılamadığı kontrol edilmiştir.
* 4. haftada başlayacak olan temel Backend/Frontend kodlamasına geçiş için GitHub branch (dal) yapıları hazır hale getirilmiş ve geliştirme sürecine onay verilmiştir.


## HAFTA 4

### 1. İzleme ve Loglama Altyapısı 
**Sorumlu:** Enes ALADAĞ

Projenin hata takip ve izleme sistemi, endüstri standartlarına uygun olarak yapılandırılmış ve başarıyla test edilmiştir.

* **Gelişmiş Log Yönetimi (Winston & Morgan):** Loglar sadece terminalde kalmayacak şekilde revize edildi; `backend/logs` dizini altında günlük dosyalara (`application.log`, `error.log`) yazılması sağlandı. Sistemde disk şişmesini önlemek amacıyla 14 günlük log rotasyonu (otomatik temizleme) kuruldu. Morgan üzerinden tüm HTTP istekleri mevcut kod yapısını bozmadan Winston altyapısına entegre edildi.
* **Canlı Performans İzleme (Monitoring):** Sisteme `express-status-monitor` dahil edilerek canlı bir izleme paneli oluşturuldu. Artık `/status` endpoint'i üzerinden CPU, RAM harcaması, ortalama API gecikmeleri ve HTTP istek frekansı anlık grafiklerle takip edilebiliyor.
* **Test ve Konfigürasyon:** Geliştirme ortamının (development) sorunsuz ayağa kalkması için `.env.example` dosyasının otomatik kopyalanması sağlandı. Tüm bağlantı ve başlatma loglarının belirlenen formatta doğru şekilde yazıldığı arka plan testleriyle teyit edildi.


---

### 2. API Test Otomasyonu ve Doğrulama
**Sorumlu:** Muhammed Eren Yaprakcı


---

### 3. Statik Kod Analizi ve Güvenlik Güçlendirme
**Sorumlu:** ZÜBEYİR ASLAN


---

### 4. Kullanıcı Arayüzü (UI) Performans Optimizasyonu
**Sorumlu:** Hüseyin Enes Demir


---

### 5. Veritabanı Bağlantı ve Hata Yönetimi
**Sorumlu:** ALAA K M MADI

**Yapılan Değişiklikler**
1. **Merkezi Bağlantı ve Optimizasyon:** MongoDB bağlantısı tek bir merkezden yönetilecek şekilde yeniden yapılandırıldı. Bağlantı havuzu (connection pool) ve zaman aşımı (timeout) ayarları optimize edilerek `.env` üzerinden dinamik yönetilebilir hale getirildi.
2. **Gelişmiş Hata Sınıflandırması:** Bağlantı sorunları (timeout, erişilemez DB, yetkilendirme hatası vb.) kategorize edildi. Hata mesajları; loglarda teknik detayı, API tarafında ise standartlaştırılmış kodları içerecek şekilde çok daha açıklayıcı hale getirildi.
3. **Sistem Kararlılığı ve İzlenebilirlik:** Uygulama kapanışlarında veritabanı bağlantılarının güvenli bir şekilde sonlandırılması (graceful shutdown) sağlandı. Ayrıca sistemin anlık veritabanı durumunu dışarıya raporlaması için `/api/health` sağlık kontrolü endpoint'i eklendi.
4. **Gerçek Akış Testleri ve Hata Kodları:** Yeni hata yönetimi mimarisi `POST /api/users` ve `GET /api/users` endpoint'leriyle canlı akışta doğrulandı. Mükerrer kayıt (duplicate email) gibi spesifik senaryolarda sistemin net bir şekilde `409 Conflict` (DUPLICATE_RESOURCE) kodu dönmesi sağlandı.
5. **Dokümantasyon ve PR Süreci:** Geliştirilen tüm hata senaryoları için bir checklist ve backend dokümantasyonu oluşturuldu. Projenin `main` dalı koruma kuralları (branch protection) gereği, yapılan tüm değişiklikler standartlara uygun bir Pull Request (PR) akışına dahil edildi.

---

## Frontend & UI Sprinti

**Tarih:** 2 Haziran 2026
**Sorumlu:** Enes ALADAĞ
**Kapsam:** Yeni UI modülleri, React performans optimizasyonları, mobil uyumluluk ve cross-browser düzeltmeleri

---

### 1. Yeni UI Modülleri

#### 1.1 İnteraktif Kod Editörü — `CodeSandbox.jsx`

**Dosya:** `frontend/src/components/CodeSandbox.jsx`

Öğrencilerin ders sırasında tarayıcı üzerinden kod yazıp çalıştırabildiği gömülü bir kod editörü bileşeni oluşturuldu.

**Özellikler:**
- **Dil desteği:** JavaScript, Python, HTML (dil seçici butonlarla)
- **Satır numaraları:** Senkronize kaydırma destekli ayrı `LineNumbers` alt bileşeni (`React.memo` ile optimize edildi)
- **Çalıştırma motoru:**
  - JavaScript için `new Function()` sandbox'ı — `console.log` çıktıları gerçek zamanlı yakalanır
  - Python için `print()` ifadelerini simüle eden regex tabanlı ayrıştırıcı
  - HTML için güvenli `<iframe sandbox>` önizlemesi
- **Tab girişi:** Textarea içinde `Tab` tuşu ile 2 boşluk girintileme
- **Split panel:** Editör (sol) + Çıktı (sağ) yan yana görünüm; mobilde dikey düzene geçer
- **`React.memo` ile sarıldı** — parent re-render'lardan etkilenmez
- **Code splitting:** `lazy()` ile `App.jsx` içine yüklendi

**Öğrenilen sorun:** `Button.jsx`'te `shadows` token'ı `designTokens` destructuring'den eksikti; `CodeSandbox` yazımı sırasında tespit edilerek düzeltildi.

---

#### 1.2 Oyunlaştırma Sistemi — `GamificationBadges.jsx`

**Dosya:** `frontend/src/components/GamificationBadges.jsx`

Kullanıcı profil sayfasına ve platform header'ına entegre edilen XP / rozet / seviye sistemi.

**Özellikler:**
- **`XPBar` bileşeni (ayrı export):** Header'da kompakt, profil sayfasında geniş görünüm. Gradient progress bar, seviye rozeti, sonraki seviye XP bilgisi.
- **`ACHIEVEMENT_CATALOG`:** 8 adet başarı rozeti; `common`, `uncommon`, `rare`, `epic` nadir seviyeleriyle. Her seviye farklı renk ve glow efektine sahip.
- **`AchievementBadge` alt bileşeni:** Kazanılmamış rozetler gri + filtreli gösterilir; kazanılanlar rarity'ye göre parlar.
- **Seviye hesabı (`calcLevel`):** 10 kademeli eşik değeri (0 → 12 000 XP). Yüzde ilerlemesi anlık hesaplanır.
- **`compact` modu:** Header'da XPBar + son 5 rozet ikonu olarak gösterilir, detay için profil sekmesine yönlendirilir.
- Tüm alt bileşenler `React.memo` ile sarıldı. `earnedIds` değişmediğinde badge grid yeniden render edilmez.

---

#### 1.3 İşbirlikçi Beyaz Tahta — `CollaborativeWhiteboard.jsx`

**Dosya:** `frontend/src/components/CollaborativeWhiteboard.jsx`

HTML5 Canvas API ile oluşturulmuş, canlı ders ekranına entegre ortak çizim tahtası.

**Özellikler:**
- **Araçlar:** Kalem, düz çizgi, dikdörtgen, daire, metin, silgi
- **Renk paleti:** 9 renk + dinamik renk seçici
- **Fırça boyutu:** 4 boyut seçeneği; aktif renk ile önizleme
- **Şekil önizlemesi:** Ayrı overlay canvas'ı üzerinde gerçek zamanlı önizleme; `onPointerUp`'ta ana canvas'a işlenir
- **Metin ekleme:** Canvas üzerine tıklayınca açılan modal input
- **Geri al / Yinele:** 30 snapshot'a kadar history stack (`useState` ile yönetilir)
- **Arkaplan rengi:** `<input type="color">` ile dinamik değiştirme
- **Dokunmatik destek:** `onTouchStart/Move/End` eventi, `touch-action: none` CSS ile çakışma önlendi
- **Katılımcı göstergesi:** Simüle edilmiş "3 katılımcı" bilgisi header'da gösterilir
- Bileşen `React.memo` ile sarıldı. `useCallback` ile tüm event handler'lar memoize edildi.

---

#### 1.4 WebRTC Canlı Ders Kontrolü — `WebRTCControls.jsx`

**Dosya:** `frontend/src/components/WebRTCControls.jsx`

Canlı ders ekranı için WebRTC medya kontrolleri ve yapay zeka destekli görüntü/ses işleme paneli.

**Özellikler:**
- **Medya kontrolleri:** Mikrofon açma/kapama, kamera, ekran paylaşımı, el kaldırma — `CircleBtn` bileşeni, aktif/pasif için farklı görsel ve diyagonal kesme çizgisi efekti
- **Katılımcı grid:** 4 katılımcı tile'ı; her tile'da isim, kamera/mikrofon/el durumu göstergesi ve "Sen" etiketi
- **AI Kontrolleri paneli** (açılıp kapanabilir):
  - Arka plan kaldırma (AI)
  - Arka plan bulanıklaştırma
  - Sanal arka plan seçici (6 seçenek: Yok, Hafif Bulanık, Güçlü Bulanık, Sınıf, Ofis, Uzay)
  - AI gürültü engelleme toggle
  - Ders kaydetme butonu (kırmızı kayıt göstergesi)
- **Kayıt göstergesi:** `recording` state'inde header'daki yeşil/kırmızı indicator + başlık değişimi
- `ToggleSwitch`, `CircleBtn`, `ParticipantTile`, `AIBadge` alt bileşenlerinin tümü `React.memo` ile optimize edildi.

---

### 2. Performans Optimizasyonları

#### 2.1 Code Splitting (Lazy Loading)

`App.jsx` içindeki tüm ağır modüller `React.lazy()` + `Suspense` ile lazy load edildi:

```
CodeSandbox          → lazy(() => import('./components/CodeSandbox'))
GamificationBadges   → lazy(() => import('./components/GamificationBadges'))
CollaborativeWhiteboard → lazy(() => import('./components/CollaborativeWhiteboard'))
WebRTCControls       → lazy(() => import('./components/WebRTCControls'))
```

Sekme değiştirildiğinde yalnızca ilgili modül yüklenir. Dashboard sekmesi açıkken diğer modüller hiç indirilmez.

#### 2.2 React.memo Uygulaması

| Bileşen | Memo? | Gerekçe |
|---|---|---|
| `PlatformHeader` | ✅ | Her tab geçişinde parent render'da yeniden mount olmasın |
| `DashboardTab` | ✅ | `user` değişmediğinde sabit |
| `CodeLabTab`, `LiveTab`, `WhiteboardTab`, `ProfileTab` | ✅ | Prop almıyor / seyrek değişiyor |
| `LineNumbers` | ✅ | Kod değişmediğinde satır numaraları yeniden render olmasın |
| `AchievementBadge` | ✅ | Rozet listesi nadiren değişir |
| `XPBar` | ✅ | XP değeri nadiren değişir |
| `ToggleSwitch`, `CircleBtn`, `ParticipantTile`, `AIBadge` | ✅ | WebRTC alt bileşenleri |
| `ToolBtn`, `ColorPaletteCard` | ✅ | Whiteboard araç satırı |

#### 2.3 useMemo Kullanımı

- `DashboardTab` → `cards` dizisi prop'lar değişmediğinde yeniden oluşturulmaz
- `PlatformHeader` → yok (statik nav, memoize gerekmez)
- `GamificationBadges` → `earned` / `locked` filtreleri `earnedIds` değişmediğinde korunur
- `CollaborativeWhiteboard` → `toolbarStyle` objesi; `isDrawing` her frame'de değiştiğinde stil nesnesi oluşturulmaz
- `CodeSandbox` → `langMeta`, `lineCount` (satır sayısı)
- `App.jsx` → `tabContent` `useMemo` ile aktif sekmeye göre hesaplanır; sekme değişmediğinde sabit kalır

#### 2.4 useCallback Kullanımı

- `App.jsx` → `handleTabChange`
- `CodeSandbox` → `handleRun`, `handleClear`, `handleLangChange`, `handleKeyDown`, `syncScroll`
- `CollaborativeWhiteboard` → `onPointerDown/Move/Up`, `undo`, `redo`, `clearBoard`, `commitText`, `saveSnapshot`, `restoreSnapshot`
- `WebRTCControls` → `toggleMic`, `toggleCam`, `toggleScreen`, `toggleHand`, `toggleRecord`, `togglePanel`

---

### 3. Mobil Uyumluluk Düzeltmeleri (`index.css`)

**Kural:** Masaüstü (≥640px) stili ve tüm inline `designTokens` yapısı değiştirilmedi. Yalnızca CSS `@media` ile ekleme yapıldı.

| Breakpoint | Değişiklik |
|---|---|
| `< 640px` | Ana içerik padding'i daraltıldı (`1rem 0.75rem`) |
| `< 640px` | Header padding'i daraltıldı |
| `< 640px` | Tab label metinleri gizlendi (`.tab-label { display: none }`) — yalnızca ikon görünür |
| `< 640px` | Dashboard kart grid tek sütuna indi |
| `< 640px` | CodeSandbox split layout dikey (editor üstte, çıktı altta) |
| `< 640px` | WebRTC video grid tek sütun |
| `640–767px` | Ana padding `1.5rem 1rem`, sandbox min-height daraltıldı |
| Tüm | Nav scroll çubuğu gizlendi (`scrollbar-width: none`) |
| WebKit | `input`, `textarea`, `button` için `-webkit-appearance: none` (Safari uyumu) |
| Firefox | `textarea` için `scrollbar-width: thin` |

---

### 4. Cross-Browser Uyumluluk

- **Safari (WebKit):** `-webkit-appearance: none` ile özelleştirilmiş input/button görünümü korundu. `-webkit-overflow-scrolling: touch` whiteboard canvas kaydırmasında eklendi.
- **Firefox:** `scrollbar-width` ve `-moz-appearance` düzeltmeleri.
- **Tüm motorlar:** `touch-action: none` canvas'a eklendi; hem mouse hem touch olayları aynı handler'ı kullanır (`onTouchStart/Move/End` + `onMouseDown/Move/Up`).
- **iOS Safari iframe:** `<iframe sandbox>` HTML önizlemesi `display: block; width: 100%` ile mobilde taşmaz.

---

### 5. Dosya ve Klasör Yapısı Değişiklikleri

**Eklenen dosyalar:**
```
frontend/src/components/CodeSandbox.jsx           — İnteraktif kod editörü
frontend/src/components/GamificationBadges.jsx    — XP / rozet sistemi
frontend/src/components/CollaborativeWhiteboard.jsx — HTML5 Canvas tahta
frontend/src/components/WebRTCControls.jsx        — Canlı ders kontrolü
```

**Güncellenen dosyalar:**
```
frontend/src/App.jsx          — Tam platform demo (sekme tabanlı navigasyon)
frontend/src/components/index.js — Yeni 4 modül export edildi
frontend/src/index.css        — Mobil breakpoint ve cross-browser düzeltmeleri
```

**Gereksiz veya dikkat çeken klasörler:**
> `docs/` klasörü yalnızca `Guvenlik_ve_Test_Raporu.md` ve bir PDF içeriyor. Bu sprint'te bu klasöre hiçbir şey eklenmedi. Ekip, tüm belgelemeyi `projeakisi.md`'de tutmaya karar verdi; `docs/` klasörü ileride kaldırılabilir veya yalnızca statik varlıklar (PDF, sözleşme vb.) için korunabilir.

---

## WebRTC & Soket Sprinti

**Tarih:** 2 Haziran 2026
**Sorumlu:** Enes ALADAĞ
**Kapsam:** Socket.io tabanlı gerçek zamanlı etkileşim, seminer (Guest Speaker) modülü, dayanıklı WebRTC sinyalleşme ve AI arka plan kaldırma

---

### 1. Socket.io Altyapısı

Socket.io, `backend/socket/` altında modüler bir yapıda kuruldu ve HTTP sunucusuna (`server.js`) bağlandı.

**Eklenen dosyalar:**
```
backend/socket/index.js                    — io başlatma, oda yaşam döngüsü, handler kaydı
backend/socket/auth.js                     — JWT handshake kimlik doğrulama
backend/socket/events.js                   — Merkezi olay adı sabitleri
backend/socket/roomManager.js              — Bellek-içi oda/katılımcı durum yöneticisi
backend/socket/handlers/whiteboardHandler.js — Beyaz tahta senkronizasyonu
backend/socket/handlers/codeSandboxHandler.js — Kod düşürme (öğrenci→eğitmen)
backend/socket/handlers/webrtcHandler.js   — WebRTC sinyalleşme yönlendirme
backend/socket/handlers/seminarHandler.js  — Guest Speaker / seminer rol yönetimi
```

**Kimlik doğrulama:** Socket handshake'inde JWT token üç kaynaktan kabul edilir (`auth.token`, `Authorization` header, `query.token`). Token doğrulanınca `socket.user = { id, role }` set edilir; geçersiz/expired token bağlantıyı reddeder.

**Olay sözleşmesi:** Backend `events.js` ile frontend `services/socketEvents.js` birebir aynı sabitleri paylaşır → yazım hatası kaynaklı kopukluk önlenir.

---

### 2. Gelişmiş Beyaz Tahta Senkronizasyonu

**Backend (`whiteboardHandler.js`):**
- `whiteboard:draw` / `whiteboard:draw-batch` — kalem/silgi çizgi parçalarını odaya yayar (`socket.to(roomId)` ile echo önlenir).
- `whiteboard:shape` — çizgi, dikdörtgen, daire, metin şekilleri.
- `whiteboard:clear` — tahtayı temizler (yalnızca yayın yetkisi olanlar).
- `whiteboard:snapshot-sync` / `snapshot-request` — geç katılan kullanıcı, odanın güncel tuval görüntüsünü (dataURL) anında alır.
- Seminer modunda yalnızca `host`/`guest_speaker` çizebilir; yetkisiz çizim `seminar:permission-denied` ile reddedilir.
- Bellek koruması: op geçmişi 500 ile, snapshot 8MB ile sınırlandı.

**Frontend (`hooks/useWhiteboardSync.js` + `CollaborativeWhiteboard.jsx`):**
- Bileşene opsiyonel `roomId` prop'u eklendi. **`roomId` verilmezse bileşen tamamen offline/yerel çalışır — mevcut davranış korunur.**
- Kalem hareketinde normalize edilmiş `{from, to, color, size, tool}` segmentleri yayınlanır; gelen segmentler uzak tuvale çizilir.
- `onPointerUp`'ta tam tuval snapshot'ı (`image/webp`, 0.6 kalite) yayınlanarak geç katılanlar senkronlanır.
- Dokunmatik cihaz güvenliği: şekil yayını `lastPt` ref'i ile yapılır (touchend'de `touches` boş olduğundan NaN koordinat önlenir).

---

### 3. Code Sandbox — Kod Düşürme

**Backend (`codeSandboxHandler.js`):**
- `code:update` — öğrencinin canlı yazımı yalnızca **host'un** socket'ine stream edilir (tüm odaya yayılmaz → gizlilik + gürültü önleme).
- `code:submit` — öğrenci kodu teslim eder; host'a "yeni teslim" düşer, öğrenciye `code:received` onayı döner.
- `code:feedback` — yalnızca host öğrenciye not/geri bildirim gönderebilir.
- Kod boyutu 100 KB ile sınırlandı (DoS koruması).

**Frontend (`CodeSandbox.jsx`):**
- Opsiyonel `roomId` ve `streamToHost` prop'ları eklendi. `roomId` yoksa eski davranış aynen korunur.
- 600 ms debounce ile canlı yazım host'a stream edilir.
- "📤 Eğitmene Gönder" butonu yalnızca canlı oturumda görünür; teslim sonrası "✓ Gönderildi" geri bildirimi.
- Eğitmen geri bildirimi (`code:feedback`) çıktı panelinde gösterilir.

---

### 4. Seminer Modülü ve Guest Speaker Rolü

**`backend/models/LiveSession.js` genişletildi:**
- `sessionType: 'lecture' | 'seminar'` alanı eklendi.
- `hostId`, `guestSpeakerIds[]`, `activeSpeakerId` ve katılımcı alt şeması (`ParticipantSchema`) — yayın izinleri (`canPublishAudio/Video/ShareScreen`) ile.
- `role` enum'una `host`, `guest_speaker`, `attendee` eklendi.
- Yardımcı metotlar: `canPublish(userId)`, `resolveRole(userId)`.

**Seminer mantığı (`seminarHandler.js` + `roomManager.js`):**
- **Seminer modunda yalnızca `host` ve `guest_speaker` ses/video/ekran yayını yapabilir.** `attendee`'ler yalnızca izler.
- `seminar:promote` — host bir katılımcıyı sahneye çıkarır (guest_speaker); rol değişikliği tüm odaya yayılır.
- `seminar:demote` — konuşmacıyı izleyiciye indirir.
- `seminar:request-stage` — attendee sahneye çıkmak için el kaldırır; talep yalnızca host'a düşer.
- Oda konfigürasyonu DB'den `hydrateRoomConfig` ile yüklenir; DB erişilemezse güvenli şekilde `lecture` moduna düşer.

---

### 5. Dayanıklı WebRTC Sinyalleşme

**Backend (`webrtcHandler.js`):**
- `rtc:offer` / `rtc:answer` / `rtc:ice-candidate` mesajları `targetSocketId`/`targetUserId` ile **yalnızca hedef peer'a** yönlendirilir (gereksiz yayın yok).
- Seminer modunda yalnızca yayın yetkisi olanlar `offer` başlatabilir.
- Hedef peer çevrimdışıysa gönderene `rtc:peer-disconnected` döner → istemci yeniden müzakere deneyebilir.
- `rtc:renegotiate` — ICE restart / yeniden bağlanma sonrası bağlantı tazeleme.

**Kopmalara karşı dayanıklılık:**
- `connectionStateRecovery` (2 dk pencere) ile kısa kopmalarda oturum state'i kurtarılır.
- `pingInterval/pingTimeout` ile ölü bağlantı tespiti.
- Disconnect anında katılımcı hemen silinmez, `disconnected` işaretlenir; reconnect penceresi dolarsa kalıcı çıkış uygulanır → kısa ağ kesintilerinde state korunur.

**Frontend (`hooks/useWebRTC.js`):**
- Her uzak peer için `RTCPeerConnection` yöneten mesh yöneticisi.
- **Perfect Negotiation** deseni: "polite/impolite" peer ayrımı ile offer çakışması (glare) güvenli çözülür.
- ICE `failed`/`disconnected` durumunda `restartIce()` + `rtc:renegotiate` ile otomatik kurtarma.
- Unmount'ta tüm peer bağlantıları kapatılır (bellek sızıntısı önleme).

---

### 6. AI Arka Plan Kaldırma (Canvas / MediaStreamTrack)

**`frontend/src/utils/backgroundProcessor.js` — `BackgroundProcessor` sınıfı:**

Akış manipülasyon hattı:
```
ham video track → <video> → canvas (frame işleme) → captureStream() → yeni MediaStream track
```

- **Modlar:** `none`, `blur` (arka plan bulanıklaştırma), `remove` (düz renk/görsel ile değiştirme).
- **Segmentasyon:** Dışarıdan ML `segmenter` (MediaPipe SelfieSegmentation / TensorFlow BodyPix) enjekte edilebilir. Model yoksa merkez-eliptik **heuristic maske** ile zarif geri düşüş yapılır.
- `requestVideoFrameCallback` varsa onu kullanır (daha verimli), yoksa `requestAnimationFrame`.
- Ses track'leri işlenmeden yeni akışa taşınır.
- `stop()` tüm kaynakları (canvas, video, track) serbest bırakır.

**Frontend entegrasyonu (`WebRTCControls.jsx`):**
- Opsiyonel `localStream` ve `onProcessedStream` prop'ları eklendi.
- AI panelindeki "Arka Plan Kaldırma" / "Bulanıklaştırma" toggle'ları, gerçek `localStream` verildiğinde `BackgroundProcessor`'ı başlatır/günceller; işlenmiş akış `onProcessedStream` ile dışarı verilir.
- `localStream` verilmezse toggle'lar yalnızca UI olarak kalır (demo davranışı korunur).

---

### 7. Frontend Socket Servisi

```
frontend/src/services/socket.js        — Singleton socket.io-client (otomatik reconnect, exp. backoff)
frontend/src/services/socketEvents.js  — Backend ile eşleşen olay sabitleri
frontend/src/hooks/useSocket.js        — Oda katılımı + katılımcı/rol state yönetimi
frontend/src/hooks/useWebRTC.js        — Dayanıklı WebRTC mesh + perfect negotiation
frontend/src/hooks/useWhiteboardSync.js— Beyaz tahta gerçek zamanlı senkronizasyon
```

- `socket.io-client`: sınırsız yeniden bağlanma denemesi, 1s→5s exponential backoff, WebSocket + polling fallback.
- JWT token `handshake.auth` ile gönderilir; `VITE_SOCKET_URL` env değişkeni ile sunucu adresi yapılandırılabilir (varsayılan `http://localhost:5000`).
- Tüm hook'lar unmount'ta dinleyicileri temizler (bellek sızıntısı önleme).

---

### 8. Bağımlılıklar ve Kurulum

**Eklenen paketler:**
- Backend: `socket.io@^4.8.1`
- Frontend: `socket.io-client@^4.8.1`

Kurulum için `backend/` ve `frontend/` dizinlerinde `npm install` çalıştırılmalıdır.

**Ölçekleme notu:** `roomManager` bellek-içi (tek sunucu) çalışır. Yatay ölçeklemede (çok örnekli) `@socket.io/redis-adapter` ile değiştirilmesi önerilir.

**Geriye dönük uyumluluk:** Tüm yeni socket entegrasyonları **opsiyonel prop'larla** (`roomId`, `localStream`) eklendi. Bu prop'lar verilmediğinde bileşenler eskisi gibi offline/yerel çalışır; mevcut masaüstü arayüzü ve düzeni değişmez.

---

## DB, Güvenlik & CTF Sprinti

**Tarih:** 2 Haziran 2026  
**Kapsam:** Backend güvenlik sertleştirme, üretim loglama, MongoDB şema/indeks optimizasyonu, CTF laboratuvar API'leri, RSS teknik kaynak akışı ve backup/restore prosedürü

---

### 1. Güvenlik ve Loglama

**Logger güncellemesi (`backend/utils/logger.js`):**
- `winston` dosya transportları production uyumlu hale getirildi.
- Hatalar `backend/logs/error.log` dosyasına yazılır.
- Genel uygulama ve HTTP erişim logları `backend/logs/combined.log` dosyasına yazılır.
- Log dosyaları için boyut ve dosya sayısı sınırı eklendi.
- `logs` klasörü yoksa otomatik oluşturulur.
- Morgan entegrasyonu korunarak `logger.stream` üzerinden `combined.log` içine HTTP log akışı devam eder.

**Güvenlik middleware'leri (`backend/app.js`):**
- `helmet` aktif bırakıldı; temel HTTP güvenlik header'ları korunur.
- `express-rate-limit` global limit olarak tüm API'ye uygulanır.
- Auth rotaları için ayrıca daha düşük eşikli rate-limit (`authLimiter`) korunur.
- `express-mongo-sanitize` ile NoSQL injection riskleri azaltılır.

**Global async hata yakalama:**
- `backend/middleware/asyncHandler.js` eklendi.
- Async route'larda `try/catch` tekrarını azaltır ve tüm rejected promise'leri global `errorHandler`'a gönderir.
- `errorHandler.js` içine malformed JSON ve genel sunucu hataları için daha doğru hata eşlemesi eklendi; her genel hata artık yanlışlıkla `DB_UNEXPECTED` olarak sınıflandırılmaz.

---

### 2. MongoDB Şema ve Performans Güncellemeleri

**User modeli (`backend/models/User.js`):**
- Oyunlaştırma alanları eklendi:
  - `gamification.points`
  - `gamification.level`
  - `gamification.badges[]`
  - `gamification.completedChallenges[]`
- `toSafeObject()` artık güvenli profil ve oyunlaştırma özetini döndürür.
- İndeksler:
  - `{ role: 1, createdAt: -1 }`
  - `{ 'gamification.points': -1 }`
  - `{ 'gamification.badges.key': 1 }`

**Course modeli (`backend/models/Course.js`):**
- `category` alanı eklendi: `programming`, `cybersecurity`, `design`, `data-science`, `business`, `language`, `general`
- `level` alanı eklendi: `beginner`, `intermediate`, `advanced`
- İndeksler:
  - `{ teacherId: 1, isActive: 1, createdAt: -1 }`
  - `{ category: 1, level: 1, isActive: 1 }`
  - `{ title: 'text', description: 'text' }`

**Lean sorgular:**
- `GET /api/users` ve `GET /api/admin/users` sorguları `.lean()` ile optimize edildi.
- `GET /api/courses` eklendi; kategori, seviye, öğretmen ve metin araması filtreleri `.lean()` + sayfalama ile çalışır.

---

### 3. Siber Güvenlik CTF Laboratuvarları

**Yeni rota:** `backend/routes/ctf.js`

Kontrollü ve izole CTF API uç noktaları eklendi. Bu uç noktalar gerçek dosya sistemine erişmez; tüm testler in-memory evaluator mantığıyla yapılır.

**Endpoint'ler:**
- `GET /api/ctf/challenges` — mevcut CTF görevlerini listeler.
- `POST /api/ctf/challenges/:key/run` — öğrencinin payload'ını güvenli sandbox içinde değerlendirir.
- `POST /api/ctf/challenges/:key/complete` — görevi başarıyla gösterirse kullanıcıya puan/rozet verir.

**İlk görevler:**
- `directory-traversal-101`: `../`, URL encoded traversal, mutlak path, `/etc/passwd` gibi denemeleri tespit eder ve engeller.
- `jwt-tamper-detection`: izinsiz rol yükseltme denemelerini simüle eder.

**Güvenlik notu:**
- CTF API gerçek zafiyet açmaz; yalnızca saldırı payload'larını analiz eder.
- Payload boyutu ve tamamlanan görevler kontrollü tutulur.
- Başarılı CTF tamamlamaları `User.gamification` alanına işlenir.

---

### 4. Teknik RSS Akış Modülü

**Yeni servis:** `backend/services/rssFetcher.js`  
**Yeni rota:** `backend/routes/rss.js`

Global teknik dokümantasyon ve güvenlik kaynakları için asenkron RSS fetch modülü eklendi.

**Varsayılan kaynaklar:**
- OWASP News
- Mozilla Security Blog
- Node.js Blog

**Endpoint'ler:**
- `GET /api/rss/feeds` — takip edilen RSS kaynaklarını listeler.
- `GET /api/rss/latest?limit=10` — kaynakları paralel çeker ve son içerikleri döndürür.

**Üretim güvenliği:**
- Her feed için timeout uygulanır.
- XML boyutu 2 MB ile sınırlandı.
- Bir feed hata verirse tüm istek çökmez; ilgili feed hata alanıyla döner.
- `fetch` Node yerleşik API'siyle kullanıldı, yeni XML bağımlılığı eklenmedi.

---

### 5. MongoDB Backup / Restore Prosedürü

**Yeni scriptler:**
```
backend/scripts/mongo-backup.js
backend/scripts/mongo-restore.js
```

**NPM komutları:**
```
npm run db:backup
npm run db:restore -- --dir=./backups/mongo-backup-...
```

**Backup:**
- `mongodump` kullanır.
- Varsayılan çıktı: `backend/backups/mongo-backup-<timestamp>`
- `--gzip` aktif.
- `backup-meta.json` üretir.

**Restore:**
- `mongorestore` kullanır.
- `--drop` ile mevcut koleksiyonları restore öncesi değiştirir.
- Kullanım öncesi doğru backup klasörü `--dir` ile verilmelidir.

**Güvenlik:**
- `backend/backups/` `.gitignore` içine alındı.
- `.env` içindeki `MONGO_URI` kullanılır; URI repoya yazılmaz.
- MongoDB Database Tools kurulu olmalıdır.

---

### 6. Takım Görev Özeti

- **Alaa:** MongoDB şema alanları, indeksler, backup/restore prosedürü ve üretim DB kontrol listesi.
- **Zübeyir:** CTF laboratuvar senaryoları, Directory Traversal/JWT tamper test payload'ları ve güvenlik doğrulaması.
- **Hüseyin Enes:** API tüketimi, RSS teknik kaynak akışının frontend'e taşınması ve oyunlaştırma alanlarının UI'da gösterimi.
- **Muhammed Eren:** QA test senaryoları, rate-limit/errorHandler davranış doğrulaması, `GET /api/courses`, `GET /api/rss/latest` ve CTF endpoint entegrasyon testleri.

**Test notu:** Shell ortamı bu sprint sırasında komutlara çıkış durumu döndürmediği için `npm test` doğrulaması araç üzerinden kesinleştirilemedi. Lokal doğrulama için `backend/` içinde `npm install` ve ardından `npm test` çalıştırılmalıdır.

---

## EduFlow UI Entegrasyon Sprinti

**Referans:** `_eduflow_ref/` (EduFlow Canlı Ders mockup ekran görüntüleri)  
**Hedef:** Udemy / BTK Akademi tarzı platform; mevcut design system korunarak EduFlow görsel dili uygulandı.

### 1. Tema ve Kabuk

| Dosya | Açıklama |
|-------|----------|
| `frontend/src/context/ThemeContext.jsx` | Koyu/açık EduFlow paleti; `localStorage` kalıcılığı |
| `frontend/src/layouts/EduFlowShell.jsx` | Keşfet, Canlı Ders, CTF Labs, Kurslar, Profil navigasyonu |
| `frontend/src/views/HomeView.jsx` | Landing hero + özellik kartları |
| `frontend/src/index.css` | Yalnızca mobil EduFlow canlı ders düzenlemeleri |

### 2. Canlı Ders Modülü

| Dosya | Açıklama |
|-------|----------|
| `frontend/src/views/LiveSessionView.jsx` | Tam ekran canlı sınıf: slayt, tahta, video+kod split |
| `frontend/src/components/eduflow/*` | TopBar, Sidebar, ParticipantStrip, ControlDock |

**Socket entegrasyonu:** `roomId: react-101-live` — `CODE_UPDATE`, `CODE_SUBMIT`, whiteboard sync, `useSocket` unmount temizliği.

### 3. CTF Labs Dashboard

| Dosya | Açıklama |
|-------|----------|
| `frontend/src/views/CTFLabsView.jsx` | Grid layout CTF kartları + payload workspace |
| `backend/models/CtfChallenge.js` | Lab ObjectId referans şeması |
| `backend/routes/ctf.js` | `points`, `badges[]`, `completedLabs[]` güncellemesi |

### 4. Gamification

- Header (`EduFlowShell`) ve `ProfileView` içinde `XPBar` + rozet grid
- `User` model: `points`, `badges: [String]`, `completedLabs: [ObjectId]`

### 5. Yedekleme

- `backend/scripts/backup.js` — `mongo-backup.js` sarmalayıcısı
- `npm run db:backup`

### 6. Takım Görev Özeti

- **Alaa:** User şema, CtfChallenge, backup script
- **Zübeyir:** CTF dashboard, payload test akışı
- **Hüseyin Enes:** EduFlow shell, canlı ders layout, gamification UI
- **Muhammed Eren:** Mod geçişleri, mobil QA, socket testleri

**Lokal doğrulama:** `backend/npm run dev` + `frontend/npm run dev` → **Canlı Ders** → kontrol dock **Kod** / **Tahta**.

### 7. Canlı Ders Tam Entegrasyon (Çalışır Durum)

| Bileşen | Durum |
|---------|--------|
| `POST /api/auth/demo-session` | JWT üretir — socket auth için zorunlu |
| `useLiveSession` hook | Medya, WebRTC, sohbet, anket, kod aynası, kontrol dock |
| `chatHandler` / `pollHandler` / `presenceHandler` | Gerçek zamanlı sohbet, anket oylama, mic/cam/el durumu |
| `LiveSidebar` | Socket ile senkron sohbet + katılımcılar + anket |
| `ControlDock` | Mikrofon, kamera, ekran paylaşımı, mod geçişleri, AI panel |
| `LiveVideoPanel` | WebRTC yerel/uzak video karo grid |
| Kod sandbox | Öğrenci → host'a `CODE_UPDATE`; eğitmen `InstructorCodePanel` |

**Test:** İki tarayıcı sekmesi — biri Eğitmen, biri Öğrenci → Kod modunda öğrenci yazınca eğitmen panelinde canlı görünür.

---

## Proje Tamamlama (Final)

### Eklenen API'ler

| Rota | Açıklama |
|------|----------|
| `GET /api/users/me` | Oturum açmış kullanıcı profili |
| `PUT /api/users/me` | Profil güncelleme |
| `GET /api/sessions` | Canlı oturum listesi |
| `GET /api/sessions/room/:roomId` | Oda detayı |
| `GET /api/assignments` | Ödev listesi |
| `POST /api/assignments/:id/submit` | Ödev teslimi |
| `POST /api/auth/demo-session` | Canlı ders geçici oturum (DB kullanıcı) |

### Seed & Demo

```bash
cd backend && npm run db:seed
```

Demo hesaplar, 4 kurs, canlı oturum (`react-101-live`), 2 ödev oluşturulur.

### Frontend Sayfaları

| Sayfa | Dosya |
|-------|-------|
| Giriş / Kayıt | `LoginView.jsx`, `RegisterView.jsx` |
| Kurs kataloğu (API) | `CoursesPage.jsx` |
| Ödevler | `AssignmentsView.jsx` |
| Canlı ders | `LiveSessionView.jsx` + `useLiveSession.js` |
| Profil | `ProfileView.jsx` |

### UI Sadeleştirme (Haziran 2026)

CTF Labs ve RSS modülleri arayüzden kaldırıldı (navigasyon, routing, view dosyaları). Backend `/api/ctf` ve `/api/rss` rotaları kodda kalır; frontend artık tüketmiyor.

### Çalıştırma Kontrol Listesi

1. MongoDB ayakta
2. `backend/.env` + `npm run db:seed` + `npm run dev`
3. `frontend/.env` + `npm run dev`
4. `student@demo.com` ile giriş → Ödevler, Canlı Ders test

**Proje durumu:** MVP — auth, canlı ders, gamification, ödev teslimi, kurs kataloğu.

---

## SON HAFTA — Platform Olgunlaştırma, Güvenlik ve Profesyonelleştirme Sprinti

**Tarih:** 7 Haziran 2026  
**Sorumlu:** Enes ALADAĞ  
**Kapsam:** Tüm bu çalışmalar **Enes ALADAĞ** tarafından gerçekleştirilmiştir.

---

### 1. Admin Paneli — Tam Fonksiyonellik

Admin hesabıyla giriş yapıldığında her şeyin çalışması hedeflenmiş ve aşağıdaki eksiklikler giderilmiştir:

**Eklenen / Düzeltilen Özellikler:**
- Admin panelinde **gerçek zamanlı istatistik çekimi** (`GET /api/admin/stats`) — toplam kullanıcı, öğrenci sayısı, eğitmen sayısı, kurs sayısı.
- **Tüm kullanıcılar** listesi: arama/filtreleme, rol değiştirme, kullanıcı silme işlevleri API'ye bağlandı.
- **Tüm kurslar** listesi: kurs aktif/pasif yapma ve silme işlevleri düzeltildi.
- **Eğitmen Başvuruları** sekmesi eklendi: `pending` durumundaki başvurular listelenir, onaylama/reddetme butonları çalışır hale getirildi.
- Panelde varsayılan veri yerine her bölüm gerçek API'den besleniyor.
- `admin@demo.com` / `Demo12345!` ile seed hesabı eklendi.

---

### 2. Eğitmen Doğrulama Sistemi — Güvenlik Açığı Kapatıldı

**Önceki Durum (Güvenlik Açığı):**  
Kullanıcılar kayıt formunda `role: 'teacher'` seçerek anında eğitmen yetkisi alabiliyordu. Bu, yetki yükseltme (privilege escalation) açığıydı.

**Yeni Sistem:**

| Adım | Açıklama |
|:---|:---|
| **Başvuru** | Kullanıcı kayıt formunda "Eğitmen Olarak Başvur" seçeneğini işaretler |
| **Kayıt** | Sistem kullanıcıyı `role: 'student'`, `instructorStatus: 'pending'` olarak kaydeder |
| **Bildirim** | Kullanıcıya "Başvurunuz inceleniyor" mesajı gösterilir |
| **Admin İncelemesi** | Admin panelinde "Eğitmen Başvuruları" sekmesinden inceleme yapılır |
| **Onay** | Onay sonrası `role: 'teacher'`, `instructorStatus: 'approved'` set edilir |
| **Red** | Reddedilirse `instructorStatus: 'rejected'` set edilir |

**Backend değişiklikleri:**
- `backend/models/User.js`: `instructorStatus: enum['none', 'pending', 'approved', 'rejected']` alanı eklendi.
- `backend/routes/auth.js`: Kayıt sırasında `applyInstructor` bayrağı alınır, `role` her zaman `'student'` olarak set edilir.
- `backend/routes/admin.js`:
  - `GET /api/admin/applications/instructors` — pending başvuruları listeler.
  - `PUT /api/admin/applications/instructors/:id/approve` — rolü teacher'a yükseltir.
  - `PUT /api/admin/applications/instructors/:id/reject` — başvuruyu reddeder.

**Frontend değişiklikleri:**
- `RegisterView.jsx`: "Eğitmen Olarak Başvur" toggle ve başvuru sonrası bilgi mesajı.
- `AdminDashboardView.jsx`: Eğitmen Başvuruları sekmesi ve onay/red butonları.

---

### 3. Kritik Backend Hata Düzeltmeleri (Senior Code Review)

Projenin tüm dosyaları senior geliştirici gözüyle incelendi ve aşağıdaki kritik sorunlar tespit edilerek giderildi:

#### 3.1 Kayıt Olmayan Rotalar
`community` ve `certificates` rotaları `backend/routes/` altında tam olarak yazılmış olmasına rağmen `backend/app.js` içinde hiç mount edilmemişti. Bu durum tüm `/api/community` ve `/api/certificates` isteklerinin `404 Not Found` döndürmesine yol açıyordu.

**Düzeltme:** `app.js`'e eklendi:
```js
app.use('/api/certificates', certificatesRoutes);
app.use('/api/community', communityRoutes);
```

#### 3.2 `purchasedCourses` Alanı Şemada Tanımsız
`backend/routes/payment.js` içinde `user.purchasedCourses` kullanılıyordu ama bu alan `User.js` şemasında tanımlı değildi. MongoDB bu alanı sparse array olarak kabul etse de şemada bulunması zorunludur.

**Düzeltme:** `User.js` şemasına `purchasedCourses: { type: [String], default: [] }` eklendi.

#### 3.3 Güvenlik Açığı — Kişisel Bilgi Kaynak Kodda
`backend/routes/payment.js` içindeki mock ödeme formunda `value="Enes Aladağ"` ve `value="4321 0000 0000 0000"` gibi kişisel bilgi ve sahte kart numarası hardcoded bırakılmıştı. Bu hem güvenlik riski hem de GDPR ihlali anlamına gelirdi.

**Düzeltme:** Tüm hardcoded değerler kaldırıldı, yerine `placeholder` attribute'ları konuldu.

#### 3.4 `asyncHandler` Tutarsızlığı
`payment.js` içindeki rotalar diğer dosyalardan farklı olarak `asyncHandler` yerine manuel `try/catch` kullanıyordu. Bu hata yönetiminin tutarsız davranmasına yol açıyordu.

**Düzeltme:** Tüm payment rotaları `asyncHandler` ile sarıldı.

#### 3.5 `Course` Modeli Satır İçi `require`
`admin.js` içindeki birden fazla handler, dosya başında import etmek yerine fonksiyon içinde `const Course = require('../models/Course')` çağırıyordu. Node.js bunu cache'lediğinden performans kaybı yoktur ama okunabilirlik açısından kötü pratiktir.

**Düzeltme:** Tek bir dosya-seviyesi import'a taşındı.

---

### 4. Frontend Temizliği ve Routing Düzeltmeleri

**`App.jsx` Düzeltmeleri:**

| Sorun | Düzeltme |
|:---|:---|
| `InstructorView.jsx` import edilmiş ama hiç kullanılmıyordu | Import kaldırıldı |
| `AssignmentsView`, `PlannerPage`, `MessagingPage` `onNavigate` prop'u almıyordu | Tüm sayfalara `onNavigate={navigate}` geçildi |
| Switch case girintileri okunaksızdı | Kolonlarla hizalandı |

**Temizlenen Dosya:**
- `temp.jsx` (36KB'lık test/geçici dosya) kök dizinden kalıcı olarak silindi.

**Eklenen:**
- `frontend/src/views/admin/components/.gitkeep` — boş dizin Git'te düzgünce işaretlendi.

---

### 5. UI/UX Optimizasyonları

#### 5.1 Navbar Taşma Düzeltmesi
Topluluk, Yol Haritaları ve Kurumsal Çözümler sayfalarında `GlobalNavbar` sabit (fixed) konumda olmasına rağmen sayfa içeriğinin `padding-top: 40px` olması içeriğin navbar arkasına girmesine yol açıyordu.

**Düzeltme:** Üç sayfada da `padding: '120px 5% 60px'` olarak güncellendi.

#### 5.2 Kurumsal Fiyatlandırma Kartları
- Farklı sayıda özelliğe sahip kartlar farklı yükseklikte görünüyordu.
- "Planı Seç" butonu içerik azsa ortada asılı kalıyordu.
- "İletişim" yazısı ₺149 ile aynı büyük fontu kullandığından taşıyordu.

**Düzeltme:** `flexDirection: column`, `flexGrow: 1`, `marginTop: 'auto'` ile buton her zaman kart altına sabitlendi; font scaling eklendi.

#### 5.3 İşlevsiz Butonların Canlandırılması
Görünürde bulunan ama hiçbir yere bağlı olmayan butonlar tek tek işlevlendirildi:

| Buton | Bağlandığı İşlev |
|:---|:---|
| Topluluk: `+ Yeni Konu Aç` | `api.createCommunityPost()` API çağrısı |
| Yol Haritaları: `▶ Derse Devam Et` | `onNavigate('courses')` yönlendirmesi |
| Kurumsal: `Fiyatları Gör ↓` | `#pricing` ID'sine smooth scroll |
| Kurumsal: `Planı Seç` | `onNavigate('register')` yönlendirmesi |
| Kurumsal: `İletişime Geç` | Sayfanın altındaki forma smooth scroll |

---

### 6. `User.js` Model Güncellemesi

`toSafeObject()` metoduna eksik alanlar eklendi:

```js
// Önceden eksik olanlar:
instructorStatus: this.instructorStatus,  // Eğitmen başvuru durumu
streak: this.streak || 0,                  // Günlük çalışma serisi
purchasedCourses: this.purchasedCourses || [], // Satın alınan kurslar
```

---

### 7. README Profesyonelleştirmesi

`README.md` sıfırdan yeniden yazıldı:

- Centered badge başlıkları ve navigasyon linkleri
- ASCII mimarisi (Frontend ↔ Backend ↔ MongoDB şeması)
- Tech Stack tablosu
- Detaylı proje klasör yapısı
- Tam API referans tabloları (auth, admin, community, certificates)
- Güvenlik mimarisi (istek akış diyagramı)
- Eğitmen başvuru sistemi açıklaması
- Katkıda bulunma yönergeleri

---

### 8. Git & Versiyon Kontrolü

Bu sprint boyunca yapılan tüm değişiklikler `feature/phase1-settings` dalına commit edilip GitHub'a push edildi:

```
commit: fix: register community & certificates routes, add purchasedCourses
        to User schema, remove hardcoded credentials, clean App.jsx routing,
        delete temp.jsx, update README
```

---

### Sprint Özeti

| Alan | Yapılan |
|:---|:---|
| 🔴 Kritik backend hataları | 5 adet tespit ve düzeltildi |
| 🛡️ Güvenlik açığı | Eğitmen rol yükseltme açığı kapatıldı |
| 🔒 Kişisel veri temizliği | Kaynak koddan kişisel bilgi kaldırıldı |
| 🧭 API rotaları | 2 kayıt olmayan rota aktif edildi |
| 🎨 UI/UX | 3 sayfada taşma, 1 fiyatlandırma, 5+ ölü buton düzeltildi |
| 📄 Dokümantasyon | README sıfırdan yeniden yazıldı |
| 🗑️ Teknik borç | temp.jsx silindi, import tutarsızlıkları giderildi |

---

---

## SON SPRINT — Auth v2.0 & Pre-Production Sertleştirme

**Tarih:** Haziran 2026  
**Dal:** `feature/phase1-settings`  
**Commit:** `035d3f0` — *feat: email/SMS auth, phone registration, password reset & pre-production hardening*

---

### 1. E-posta OTP Doğrulama Sistemi

**Yapılan:** Kayıt sırasında kullanıcıya 6 haneli OTP kodu içeren HTML e-posta gönderilir. Kullanıcı kodu girmeden hesabı aktif olmaz.

**Etkilenen dosyalar:**
- `backend/utils/email.js` → `verifyEmail`, `welcome`, `resetPassword` HTML şablonları
- `backend/routes/auth.js` → OTP oluşturma ve doğrulama endpoint'leri
- `backend/models/User.js` → `isVerified`, e-posta OTP alanları
- `frontend/src/views/RegisterView.jsx` → OTP giriş adımı eklendi

---

### 2. Şifremi Unuttum & Şifre Sıfırlama

**Yapılan:** Kullanıcı e-posta adresini girer → SHA-256 hash'li güvenli token üretilir → sıfırlama linki maile gönderilir → yeni şifre belirlenir.

**Güvenlik notu:** Ham token asla veritabanında saklanmaz. Yalnızca SHA-256 özeti saklanır — bu endüstri standardı yaklaşımdır.

**Yeni dosya:**
- `frontend/src/views/ResetPasswordView.jsx` → şifre güç göstergesi, eşleşme kontrolü, başarı animasyonu

**Etkilenen dosyalar:**
- `backend/routes/auth.js` → `POST /forgot-password`, `POST /reset-password/:token`
- `backend/models/User.js` → `passwordResetToken`, `passwordResetExpires` alanları
- `frontend/src/App.jsx` → URL'den `?action=reset-password&token=xxx` algılanır

---

### 3. Telefon Numarasıyla Kayıt & Giriş (SMS OTP)

**Yapılan:** Kullanıcılar artık e-posta olmadan telefon numarasıyla kayıt olabilir ve şifresiz SMS OTP ile giriş yapabilir.

**Yeni endpoint'ler:**
| Endpoint | İşlev |
|:---|:---|
| `POST /api/auth/register-phone` | Telefon ile kayıt + SMS OTP gönder |
| `POST /api/auth/verify-phone` | SMS OTP doğrula → hesap aktif |
| `POST /api/auth/send-phone-otp` | OTP yeniden gönder |
| `POST /api/auth/login-phone` | Şifresiz telefon girişi |

**Yeni dosya:** `backend/utils/sms.js` — Twilio wrapper, Twilio yoksa `[SMS-TEST]` console çıktısı

**Etkilenen dosyalar:**
- `backend/models/User.js` → `phone` (sparse unique), `isPhoneVerified`, `phoneOtp`, `phoneOtpExpires`
- `backend/middleware/validate.js` → `registerPhone`, `sendPhoneOtp` Joi şemaları
- `frontend/src/views/RegisterView.jsx` → telefon kayıt akışı (2 adım)
- `frontend/src/views/LoginView.jsx` → telefon giriş akışı (2 adım)

---

### 4. Google/LinkedIn OAuth — Hoş Geldin Maili

**Yapılan:** OAuth ile ilk kez giriş yapan kullanıcılara `welcome` şablonuyla hoş geldin e-postası gönderilir. Hesap `isVerified: true` olarak oluşturulur.

**Etkilenen dosyalar:**
- `backend/config/passport.js` → `sendEmail` import, yeni kullanıcıda welcome maili

---

### 5. SVG İkon Tab Seçici

**Yapılan:** Giriş ve Kayıt sayfalarındaki e-posta/telefon seçimi için emoji yerine SVG ikonlu sliding-pill animasyonlu tab seçici eklendi.

- **Kayıt sayfası:** Mor (`#7c6cf0`) aktif renk
- **Giriş sayfası:** Yeşil (`#00d4aa`) aktif renk
- Zarf SVG (e-posta) + akıllı telefon SVG (telefon)

---

### 6. Pre-Production URL Sertleştirme

**Yapılan:** Tüm hardcoded `localhost` URL'leri ortam değişkenlerine taşındı.

| Dosya | Değişiklik |
|:---|:---|
| `backend/routes/auth.js` | `CLIENT_URL` env var |
| `backend/routes/payment.js` | `CLIENT_URL` + `BACKEND_URL` env var |
| `backend/routes/upload.js` | `BACKEND_URL` env var |
| `frontend/src/views/LoginView.jsx` | `VITE_API_URL` env var |
| `frontend/src/views/RegisterView.jsx` | `VITE_API_URL` env var |
| `frontend/src/views/SettingsView.jsx` | `VITE_API_URL` env var |

**Yeni dosya:** `frontend/.env.example` → yeni geliştiriciler için şablon

---

### 7. JWT_SECRET Güçlendirme

**Yapılan:** `.env` dosyasındaki `JWT_SECRET` 96 karakterlik kriptografik rastgele değerle güncellendi. Kısa/tahmin edilebilir secret brute-force saldırısına karşı savunmasızdır.

---

### 8. Proje Dokümantasyonu Güncelleme

**Yapılan:** Bu sprint kapsamında tüm belgeler güncellendi:

| Dosya | Değişiklik |
|:---|:---|
| `README.md` | v2.0 — yeni özellikler, güncel API tablosu, mimari diyagram |
| `docs/TAKIM_DOKUMANI.md` | **YENİ** — ekip için detaylı teknik rehber |
| `docs/SUNUM_REHBERI.md` | **YENİ** — hoca sunumu konuşma metni (teknik + pazarlama) |
| `projeakisi.md` | Bu sprint eklendi |

---

### 9. Pull Request

**PR #62:** `feature/phase1-settings` → `main`  
**URL:** https://github.com/enesaladagg/EduVerse/pull/62  
**Değişiklikler:** 18 dosya · +1329 satır · -137 satır

---

### Sprint Özeti

| Alan | Yapılan |
|:---|:---|
| 🔐 Kimlik doğrulama | 4 farklı yöntem (e-posta OTP, telefon OTP, şifresiz telefon, OAuth) |
| 📱 SMS entegrasyonu | Twilio wrapper + geliştirme fallback |
| 📧 E-posta servisi | 3 HTML şablon (OTP, hoş geldin, sıfırlama) |
| 🔑 Şifre sıfırlama | SHA-256 hash'li güvenli token akışı |
| 🎨 UI/UX | SVG tab seçici, ResetPasswordView (yeni sayfa) |
| 🛡️ Güvenlik | 7+ sertleştirme adımı, URL'ler env var'a taşındı |
| 📄 Dokümantasyon | README v2.0, ekip belgesi, sunum rehberi |
| 🔀 Git | PR #62 açıldı — merge için hazır |

