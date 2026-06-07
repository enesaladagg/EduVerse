const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const Course = require('../models/Course');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

// Iyzico (Simülasyon) Checkout Form Başlatma
router.post('/checkout', authenticate, asyncHandler(async (req, res, next) => {
  const { items } = req.body;
  if (!items || items.length === 0) {
    return next(new AppError('Sepet boş.', 400));
  }

  // Kursların toplam fiyatını hesapla
  let totalPrice = 0;
  const courseIds = [];
  for (const item of items) {
    const course = await Course.findById(item.id);
    if (course) {
      totalPrice += course.price || 0;
      courseIds.push(course._id.toString());
    }
  }

  // Kullanıcının daha önceden satın aldığı kursları filtrele
  const user = await User.findById(req.user.id);
  const newCourseIds = courseIds.filter(id => !user.purchasedCourses?.includes(id));

  if (newCourseIds.length === 0) {
    return next(new AppError('Bu kursları zaten satın aldınız.', 400));
  }

  // GERÇEK IYZICO ENTEGRASYONU:
  // Burada normalde `iyzipay.checkoutFormInitialize.create({...})` çağrılır.
  // Ancak demo amaçlı bir sahte Iyzico formu (token) döndürüyoruz.
  
  const mockToken = `IYZICO_TOKEN_${Date.now()}`;
  const paymentPageUrl = `http://localhost:5000/api/payment/mock-iyzico-page?token=${mockToken}&userId=${req.user.id}&courses=${newCourseIds.join(',')}&price=${totalPrice}`;

  // Frontend'e Iyzico Checkout Form snippet'i veya URL'si döner
  res.json({
    success: true,
    data: {
      token: mockToken,
      checkoutFormContent: `
        <div id="iyzipay-checkout-form" class="responsive"></div>
        <script>
          // Bu script normalde Iyzico'dan gelir. Biz demo amaçlı iframe açıyoruz.
          const container = document.getElementById('iyzipay-checkout-form');
          container.innerHTML = '<iframe src="${paymentPageUrl}" width="100%" height="600" frameBorder="0" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1)"></iframe>';
        </script>
      `,
      paymentPageUrl
    }
  });
}));

// Demo Iyzico Form Sayfası (Frontend Iframe içinde açılır)
router.get('/mock-iyzico-page', (req, res) => {
  const { token, userId, courses, price } = req.query;
  
  res.send(`
    <html>
      <head>
        <title>Iyzico Güvenli Ödeme Paneli</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
          .card { background: #fff; padding: 32px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); width: 100%; max-width: 400px; text-align: center; }
          .logo { color: #1e3a8a; font-size: 24px; font-weight: 800; margin-bottom: 24px; }
          .logo span { color: #2563eb; }
          .price { font-size: 32px; font-weight: 700; color: #0f172a; margin-bottom: 24px; }
          .input-group { margin-bottom: 16px; text-align: left; }
          .input-group label { display: block; font-size: 12px; color: #64748b; margin-bottom: 8px; font-weight: 600; text-transform: uppercase; }
          .input-group input { width: 100%; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 16px; box-sizing: border-box; outline: none; }
          .input-group input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
          .btn { background: #10b981; color: white; border: none; padding: 14px; width: 100%; border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.2s; margin-top: 16px; }
          .btn:hover { background: #059669; }
          .secure { font-size: 12px; color: #10b981; margin-top: 16px; display: flex; alignItems: center; justify-content: center; gap: 4px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">iyzi<span>co</span></div>
          <div class="price">₺${price}</div>
          
          <form action="/api/payment/callback" method="POST">
            <input type="hidden" name="token" value="${token}" />
            <input type="hidden" name="userId" value="${userId}" />
            <input type="hidden" name="courses" value="${courses}" />
            
            <div class="input-group">
              <label>Kart Üzerindeki İsim</label>
              <input type="text" placeholder="Ad Soyad" required />
            </div>
            <div class="input-group">
              <label>Kart Numarası</label>
              <input type="text" placeholder="0000 0000 0000 0000" required />
            </div>
            <div style="display: flex; gap: 16px;">
              <div class="input-group" style="flex: 1;">
                <label>SKT</label>
                <input type="text" placeholder="AA/YY" required />
              </div>
              <div class="input-group" style="flex: 1;">
                <label>CVC</label>
                <input type="text" placeholder="000" required />
              </div>
            </div>
            
            <button type="submit" class="btn">Ödemeyi Tamamla</button>
            <div class="secure">🔒 256-bit SSL Secure Payment</div>
          </form>
        </div>
      </body>
    </html>
  `);
});

// Iyzico Callback (Ödeme Sonucu)
    }

    for (const cid of courseArray) {
      if (!user.purchasedCourses.includes(cid)) {
        user.purchasedCourses.push(cid);
      }
    }

    await user.save();

    // Satın alma başarılı ekranına yönlendir
    // Frontend portu 5173
    res.redirect('http://localhost:5173/?payment=success');

  } catch (err) {
    console.error(err);
    res.redirect('http://localhost:5173/?page=checkout&payment=failed');
  }
});

module.exports = router;
