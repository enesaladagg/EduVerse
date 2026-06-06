const mongoose = require('mongoose');

/**
 * Oturum içi katılımcı alt şeması.
 * role:
 *   - host         : Eğitmen / oturum sahibi (tam yetki)
 *   - guest_speaker: Davetli konuşmacı (ekran + ses yayını yetkisi var)
 *   - attendee     : İzleyici / öğrenci (yalnızca izler, seminer modunda yayın yapamaz)
 */
const ParticipantSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    socketId: { type: String },
    role: {
      type: String,
      enum: ['host', 'guest_speaker', 'attendee'],
      default: 'attendee',
    },
    // Seminer modunda yayın izinleri (mikrofon / kamera / ekran paylaşımı)
    canPublishAudio: { type: Boolean, default: false },
    canPublishVideo: { type: Boolean, default: false },
    canShareScreen: { type: Boolean, default: false },
    joinedAt: { type: Date, default: Date.now },
    leftAt: { type: Date },
  },
  { _id: false }
);

const LiveSessionSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, note: 'in minutes' },
    roomId: { type: String },
    status: {
      type: String,
      enum: ['scheduled', 'ongoing', 'ended'],
      default: 'scheduled',
    },

    // --- Seminer / yayın modülü alanları ---
    /**
     * sessionType:
     *   - lecture : Klasik canlı ders (host + öğrenciler etkileşimli)
     *   - seminar : Seminer modu — yalnızca host ve guest_speaker yayın yapabilir,
     *               diğer tüm katılımcılar yalnızca dinleyici/izleyicidir.
     */
    sessionType: {
      type: String,
      enum: ['lecture', 'seminar'],
      default: 'lecture',
    },
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // Davet edilmiş konuşmacılar (seminer modu için önceden tanımlanabilir)
    guestSpeakerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    participants: { type: [ParticipantSchema], default: [] },
    // Sahnede aktif konuşmacı (seminer modunda tek yayıncı kısıtı için)
    activeSpeakerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

LiveSessionSchema.index({ courseId: 1, status: 1 });
LiveSessionSchema.index({ roomId: 1 });

/**
 * Seminer modunda bir katılımcının yayın yapıp yapamayacağını belirler.
 * Yalnızca host ve guest_speaker rolleri yayın yapabilir.
 */
LiveSessionSchema.methods.canPublish = function canPublish(userId) {
  if (this.sessionType !== 'seminar') return true; // lecture modunda herkes etkileşebilir
  const uid = String(userId);
  if (this.hostId && String(this.hostId) === uid) return true;
  return this.guestSpeakerIds.some((id) => String(id) === uid);
};

/**
 * Bir kullanıcının seminer içindeki etkin rolünü döndürür.
 */
LiveSessionSchema.methods.resolveRole = function resolveRole(userId) {
  const uid = String(userId);
  if (this.hostId && String(this.hostId) === uid) return 'host';
  if (this.guestSpeakerIds.some((id) => String(id) === uid)) return 'guest_speaker';
  return 'attendee';
};

module.exports = mongoose.model('LiveSession', LiveSessionSchema);
