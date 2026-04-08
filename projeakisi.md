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

