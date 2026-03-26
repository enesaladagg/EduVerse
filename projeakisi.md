# Proje Akışı ve Haftalık İlerlemeler

Bu dosya, projemizin haftalık gelişimini ve ekip üyelerinin katkılarını takip etmek amacıyla oluşturulmuştur.

---

## Hafta 1: Analiz, Gereksinim ve Mimari Araştırmaları

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
*Hüseyin, gereksinim listeni ve önceliklendirmelerini bu başlığın altına yazabilirsin.*

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
*Zübeyir, modüller arası ilişkiler ve veri akışı tasarımlarını bu başlığın altına yazabilirsin.*

---

### 5. Geliştirme Ortamı Kurulumu
**Sorumlu:** Enes ALADAĞ
Yapılan Çalışmalar:

Projenin kaynak kodlarının yönetimi için GitHub üzerinde merkezi bir depo (repository) oluşturuldu.

Takım çalışmasında kod çakışmalarını önlemek amacıyla main (ana) dal korumaya (Branch Protection) alındı ve "Pull Request (PR)" zorunluluğu getirildi.

Frontend (Ön yüz) geliştirme ortamı için Vite & React, Backend (Arka plan) ortamı için temel Node.js iskeleti kuruldu ve sisteme entegre edildi.

Tüm ekibin haftalık ilerlemelerini tek bir merkezden raporlayabilmesi için projeakisi.md altyapısı hazırlandı.

---
*(Not: İlerleyen haftalarda Hafta 2, Hafta 3 başlıkları bu dosyanın en altına eklenecektir.)*
