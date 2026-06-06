/**
 * AI Arka Plan İşleyici — Canvas + MediaStreamTrack manipülasyonu.
 *
 * WebRTC video akışı yayınlanmadan ÖNCE araya girer:
 *   ham video track  →  <video>  →  canvas (frame işleme)  →  captureStream()  →  yeni track
 *
 * Modlar:
 *   - 'none'     : İşlem yok (orijinal akış)
 *   - 'blur'     : Arka planı bulanıklaştırır (segmentasyon maskesi ile)
 *   - 'remove'   : Arka planı kaldırıp düz renk/görsel ile değiştirir
 *
 * Segmentasyon:
 *   Gerçek AI segmentasyonu için dışarıdan bir `segmenter` enjekte edilebilir
 *   (ör. MediaPipe SelfieSegmentation / TensorFlow BodyPix). `segmenter`
 *   verilmezse, merkez-odaklı eliptik maske ile yaklaşık (heuristic) bir
 *   ayrım uygulanır — ML modeli yüklenemezse zarif şekilde geri düşer.
 *
 * Tüm kaynaklar `stop()` ile serbest bırakılır (bellek sızıntısı önleme).
 */

export class BackgroundProcessor {
  /**
   * @param {object} opts
   * @param {'none'|'blur'|'remove'} [opts.mode='none']
   * @param {string} [opts.backgroundColor='#0f1117']
   * @param {HTMLImageElement|null} [opts.backgroundImage=null]
   * @param {number} [opts.blurAmount=12]
   * @param {Function|null} [opts.segmenter] - async (videoEl) => ImageData|mask (alpha)
   */
  constructor(opts = {}) {
    this.mode = opts.mode || 'none';
    this.backgroundColor = opts.backgroundColor || '#0f1117';
    this.backgroundImage = opts.backgroundImage || null;
    this.blurAmount = opts.blurAmount ?? 12;
    this.segmenter = opts.segmenter || null;

    this.video = null;
    this.canvas = null;
    this.ctx = null;
    this.maskCanvas = null;
    this.maskCtx = null;
    this.rafId = null;
    this.running = false;
    this.outputStream = null;
    this.sourceStream = null;
  }

  /**
   * Ham akışı işleyerek yeni bir MediaStream döndürür.
   * @param {MediaStream} sourceStream
   * @returns {Promise<MediaStream>}
   */
  async start(sourceStream) {
    this.sourceStream = sourceStream;
    const [videoTrack] = sourceStream.getVideoTracks();
    if (!videoTrack) return sourceStream; // video yoksa olduğu gibi döndür

    const settings = videoTrack.getSettings();
    const width = settings.width || 640;
    const height = settings.height || 480;

    // Gizli video elemanı — kaynak frame'leri buradan okunur
    this.video = document.createElement('video');
    this.video.autoplay = true;
    this.video.muted = true;
    this.video.playsInline = true;
    this.video.srcObject = new MediaStream([videoTrack]);
    await this.video.play().catch(() => {});

    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');

    this.maskCanvas = document.createElement('canvas');
    this.maskCanvas.width = width;
    this.maskCanvas.height = height;
    this.maskCtx = this.maskCanvas.getContext('2d');

    this.running = true;
    this._renderLoop();

    // Canvas'tan 30fps çıktı akışı üret
    const canvasStream = this.canvas.captureStream(30);

    // Ses track'lerini orijinalden taşı (ses işlenmez)
    sourceStream.getAudioTracks().forEach((t) => canvasStream.addTrack(t));

    this.outputStream = canvasStream;
    return canvasStream;
  }

  /** İşleme modunu çalışma anında değiştirir. */
  setMode(mode) {
    this.mode = mode;
  }

  setBackgroundColor(color) {
    this.backgroundColor = color;
  }

  setBackgroundImage(img) {
    this.backgroundImage = img;
  }

  _renderLoop() {
    if (!this.running) return;

    const { ctx, video, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;

    if (video.readyState >= 2) {
      if (this.mode === 'none') {
        ctx.filter = 'none';
        ctx.drawImage(video, 0, 0, w, h);
      } else {
        this._renderWithSegmentation(w, h);
      }
    }

    // requestVideoFrameCallback varsa onu kullan (daha verimli), yoksa rAF
    if (this.video.requestVideoFrameCallback) {
      this.rafId = this.video.requestVideoFrameCallback(() => this._renderLoop());
    } else {
      this.rafId = requestAnimationFrame(() => this._renderLoop());
    }
  }

  _renderWithSegmentation(w, h) {
    const { ctx, video, maskCtx } = this;

    // 1) Ön plan maskesi oluştur
    maskCtx.clearRect(0, 0, w, h);
    if (this.segmenter) {
      // Dışarıdan enjekte edilen ML segmenter (alpha maskesi döndürür)
      try {
        const mask = this.segmenter(video, w, h);
        if (mask instanceof ImageData) maskCtx.putImageData(mask, 0, 0);
        else this._heuristicMask(maskCtx, w, h);
      } catch {
        this._heuristicMask(maskCtx, w, h);
      }
    } else {
      // ML yoksa: merkez-eliptik yaklaşık maske (zarif geri düşüş)
      this._heuristicMask(maskCtx, w, h);
    }

    // 2) Arka planı çiz
    ctx.save();
    ctx.filter = 'none';
    if (this.mode === 'blur') {
      ctx.filter = `blur(${this.blurAmount}px)`;
      ctx.drawImage(video, 0, 0, w, h);
      ctx.filter = 'none';
    } else if (this.mode === 'remove') {
      if (this.backgroundImage) {
        ctx.drawImage(this.backgroundImage, 0, 0, w, h);
      } else {
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }
    }
    ctx.restore();

    // 3) Ön planı (kişi) maske ile arka planın üstüne bindir
    const fg = document.createElement('canvas');
    fg.width = w; fg.height = h;
    const fgCtx = fg.getContext('2d');
    fgCtx.drawImage(video, 0, 0, w, h);
    fgCtx.globalCompositeOperation = 'destination-in';
    fgCtx.drawImage(this.maskCanvas, 0, 0, w, h);

    ctx.drawImage(fg, 0, 0, w, h);
  }

  /**
   * ML modeli olmadan kullanılan basit ön plan maskesi:
   * Merkeze yerleşmiş dikey elips (tipik kafa-omuz konumu).
   * Gerçek segmentasyon enjekte edilince devre dışı kalır.
   */
  _heuristicMask(maskCtx, w, h) {
    const grd = maskCtx.createRadialGradient(
      w / 2, h * 0.55, Math.min(w, h) * 0.15,
      w / 2, h * 0.55, Math.min(w, h) * 0.55
    );
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.7, 'rgba(255,255,255,1)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    maskCtx.fillStyle = grd;
    maskCtx.beginPath();
    maskCtx.ellipse(w / 2, h * 0.58, w * 0.32, h * 0.46, 0, 0, Math.PI * 2);
    maskCtx.fill();
  }

  /** Tüm kaynakları serbest bırakır. */
  stop() {
    this.running = false;
    if (this.rafId) {
      if (this.video?.cancelVideoFrameCallback) {
        this.video.cancelVideoFrameCallback(this.rafId);
      } else {
        cancelAnimationFrame(this.rafId);
      }
      this.rafId = null;
    }
    if (this.outputStream) {
      this.outputStream.getTracks().forEach((t) => {
        // Orijinal ses track'lerini durdurma — onları çağıran yönetir
        if (t.kind === 'video') t.stop();
      });
    }
    if (this.video) {
      this.video.srcObject = null;
      this.video = null;
    }
    this.canvas = null;
    this.ctx = null;
    this.maskCanvas = null;
    this.maskCtx = null;
    this.outputStream = null;
  }
}

/**
 * Kolaylık fonksiyonu: bir kez işlenmiş akış üretir.
 * @returns {Promise<{ stream: MediaStream, processor: BackgroundProcessor }>}
 */
export async function processStream(sourceStream, options) {
  const processor = new BackgroundProcessor(options);
  const stream = await processor.start(sourceStream);
  return { stream, processor };
}

export default BackgroundProcessor;
