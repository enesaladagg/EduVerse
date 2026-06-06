import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';

export default function MessagingPage() {
  const { palette: p, tokens: t } = useTheme();
  
  // States
  const [messages, setMessages] = useState([
    { id: 1, text: 'Merhaba, React ödevini bitirdin mi?', sender: 'friend' },
    { id: 2, text: 'Henüz bitirmedim, beraber çalışalım mı?', sender: 'me' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [friendName, setFriendName] = useState('');
  const [groupName, setGroupName] = useState('');
  
  const EMOJIS = ['😀', '😂', '😍', '👍', '🔥', '🎉', '🚀', '💡', '✅', '❤️'];

  const sendMessage = (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), text: newMessage, sender: 'me' }]);
    setNewMessage('');
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage((prev) => prev + emoji);
  };

  return (
    <div style={{ padding: t.spacing[6], maxWidth: '1000px', margin: '0 auto', height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: t.spacing[4] }}>
        <h1 style={{ color: p.text, margin: 0 }}>💬 Sosyal Ağ & Mesajlar</h1>
      </div>
      
      <div style={{ flex: 1, display: 'flex', gap: t.spacing[4], minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{ width: '280px', background: p.panel, borderRadius: t.borderRadius.lg, border: `1px solid ${p.border}`, display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ padding: t.spacing[4], borderBottom: `1px solid ${p.border}`, display: 'flex', flexDirection: 'column', gap: t.spacing[2] }}>
            <Button variant="primary" onClick={() => setShowCreateGroupModal(true)}>+ Grup Kur</Button>
            <Button variant="outline" onClick={() => setShowAddFriendModal(true)}>+ Arkadaş Ekle</Button>
          </div>

          <div style={{ padding: t.spacing[4], overflowY: 'auto', flex: 1 }}>
            <h3 style={{ color: p.textMuted, marginBottom: t.spacing[3], fontSize: t.typography.fontSize.sm }}>Aktif Sohbetler</h3>
            
            <div style={{ padding: t.spacing[3], background: p.accent + '20', border: `1px solid ${p.accent}`, borderRadius: t.borderRadius.md, color: p.text, cursor: 'pointer', marginBottom: t.spacing[2], fontWeight: 'bold' }}>
              👥 React Çalışma Grubu
            </div>
            
            <div style={{ padding: t.spacing[3], background: p.panelElevated, borderRadius: t.borderRadius.md, color: p.text, cursor: 'pointer' }}>
              👤 Ahmet Yılmaz
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: p.panel, borderRadius: t.borderRadius.lg, border: `1px solid ${p.border}` }}>
          
          <div style={{ padding: t.spacing[4], borderBottom: `1px solid ${p.border}`, fontWeight: 'bold', color: p.text }}>
            👥 React Çalışma Grubu
          </div>

          <div style={{ flex: 1, padding: t.spacing[4], overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: t.spacing[3] }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                background: msg.sender === 'me' ? p.chatBubbleSelf : p.chatBubble,
                color: p.text,
                padding: `${t.spacing[2]} ${t.spacing[4]}`,
                borderRadius: t.borderRadius.xl,
                maxWidth: '70%',
                boxShadow: t.shadows.sm,
              }}>
                {msg.text}
              </div>
            ))}
          </div>
          
          <div style={{ padding: t.spacing[4], borderTop: `1px solid ${p.border}`, position: 'relative' }}>
            {/* Emoji Picker Popup */}
            {showEmojiPicker && (
              <div style={{
                position: 'absolute',
                bottom: '100%',
                left: t.spacing[4],
                marginBottom: t.spacing[2],
                background: p.panelElevated,
                border: `1px solid ${p.border}`,
                borderRadius: t.borderRadius.lg,
                padding: t.spacing[2],
                display: 'flex',
                flexWrap: 'wrap',
                gap: t.spacing[1],
                width: '220px',
                boxShadow: t.shadows.lg,
                zIndex: 10,
              }}>
                {EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleEmojiClick(emoji)}
                    style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={sendMessage} style={{ display: 'flex', gap: t.spacing[2], alignItems: 'center' }}>
              <button 
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer' }}
              >
                😀
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Mesaj yazın..."
                style={{
                  flex: 1, padding: t.spacing[3], borderRadius: t.borderRadius.full, border: `1px solid ${p.border}`, background: p.panelElevated, color: p.text, outline: 'none'
                }}
              />
              <Button type="submit" variant="primary">Gönder</Button>
            </form>
          </div>
        </div>
      </div>

      {/* Arkadaş Ekle Modal */}
      {showAddFriendModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: p.panel, padding: t.spacing[6], borderRadius: t.borderRadius.lg, width: '400px', border: `1px solid ${p.border}` }}>
            <h2 style={{ color: p.text, marginTop: 0 }}>Arkadaş Ekle</h2>
            <p style={{ color: p.textMuted, fontSize: t.typography.fontSize.sm }}>Eklemek istediğiniz kullanıcının adını yazın.</p>
            <input 
              type="text" 
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              placeholder="Örn: Enes Aladağ"
              style={{ width: '100%', padding: t.spacing[3], marginBottom: t.spacing[4], borderRadius: t.borderRadius.md, border: `1px solid ${p.border}`, background: p.panelElevated, color: p.text }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: t.spacing[2] }}>
              <Button variant="ghost" onClick={() => setShowAddFriendModal(false)}>İptal</Button>
              <Button variant="primary" onClick={() => { alert('İstek gönderildi!'); setShowAddFriendModal(false); }}>İstek Gönder</Button>
            </div>
          </div>
        </div>
      )}

      {/* Grup Kur Modal */}
      {showCreateGroupModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: p.panel, padding: t.spacing[6], borderRadius: t.borderRadius.lg, width: '400px', border: `1px solid ${p.border}` }}>
            <h2 style={{ color: p.text, marginTop: 0 }}>Yeni Grup Kur</h2>
            <p style={{ color: p.textMuted, fontSize: t.typography.fontSize.sm }}>Ortak çalışma veya sınıf grubu oluşturun.</p>
            <input 
              type="text" 
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Grup Adı"
              style={{ width: '100%', padding: t.spacing[3], marginBottom: t.spacing[4], borderRadius: t.borderRadius.md, border: `1px solid ${p.border}`, background: p.panelElevated, color: p.text }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: t.spacing[2] }}>
              <Button variant="ghost" onClick={() => setShowCreateGroupModal(false)}>İptal</Button>
              <Button variant="primary" onClick={() => { alert('Grup oluşturuldu!'); setShowCreateGroupModal(false); }}>Oluştur</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
