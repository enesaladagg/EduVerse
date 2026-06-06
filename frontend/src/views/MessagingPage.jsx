import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Send, Bot, Hash, User, Code2, Plus, Paperclip, MoreVertical, Smile, Image, FileText, Users, UserPlus, MicOff, LogOut, X, Trash2 } from 'lucide-react';
import Button from '../components/Button';

export default function MessagingPage() {
  const { palette: p, tokens: t, isDark } = useTheme();
  const messagesEndRef = useRef(null);
  
  const [activeChannel, setActiveChannel] = useState('edubot');
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showNewChatMenu, setShowNewChatMenu] = useState(false);
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  
  const emojiRef = useRef(null);
  const attachRef = useRef(null);
  const newChatRef = useRef(null);
  const chatOptionsRef = useRef(null);

  const EMOJIS = ['😀', '😂', '😍', '😎', '😭', '😡', '👍', '🙏', '🎉', '🔥', '❤️', '💯', '🤔', '🙌', '✨', '🚀', '💡', '✅', '⭐', '🎈'];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) setShowEmojiPicker(false);
      if (attachRef.current && !attachRef.current.contains(e.target)) setShowAttachmentMenu(false);
      if (newChatRef.current && !newChatRef.current.contains(e.target)) setShowNewChatMenu(false);
      if (chatOptionsRef.current && !chatOptionsRef.current.contains(e.target)) setShowChatOptions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Channels and Users
  const channels = [
    { id: 'edubot', type: 'bot', name: 'EduBot AI', status: 'online' },
    { id: 'react-101', type: 'group', name: 'React 101 Sınıfı', status: 'online' },
    { id: 'python-basics', type: 'group', name: 'Python Temelleri', status: 'offline' },
    { id: 'user-1', type: 'dm', name: 'Ahmet Yılmaz', status: 'online' },
    { id: 'user-2', type: 'dm', name: 'Zeynep Kaya', status: 'offline' }
  ];

  const [messages, setMessages] = useState({
    'edubot': [
      { id: 1, sender: 'edubot', text: 'Merhaba! Ben EduBot. Bugün hangi konuda öğrenmeye devam etmek istersin? İstersen yazdığın kodlardaki hataları da inceleyebilirim.', time: '09:00' },
    ],
    'react-101': [
      { id: 1, sender: 'user-2', name: 'Zeynep Kaya', text: 'Arkadaşlar modül 4 teki useEffect ödevini yapan var mı?', time: '14:20' },
      { id: 2, sender: 'user-1', name: 'Ahmet Yılmaz', text: 'Evet ben bitirdim. Bağımlılık dizisine dikkat etmen gerekiyor.', time: '14:25' },
      { id: 3, sender: 'user-1', name: 'Ahmet Yılmaz', text: '```jsx\nuseEffect(() => {\n  console.log("Component yüklendi");\n  return () => console.log("Temizlendi");\n}, []);\n```\nÖrnek bir yapı bu şekilde.', time: '14:26', isCode: true }
    ],
    'user-1': [
      { id: 1, sender: 'user-1', name: 'Ahmet Yılmaz', text: 'Selam, projede beraber çalışalım mı?', time: 'Dün' }
    ]
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChannel]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() && !attachedFile) return;

    let textToSend = input;
    if (attachedFile && !input.trim()) {
      textToSend = `📎 ${attachedFile.name}`;
    } else if (attachedFile) {
      textToSend = `📎 ${attachedFile.name}\n${input}`;
    }

    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: textToSend,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      isCode: input.startsWith('```')
    };

    setMessages(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMessage]
    }));

    setInput('');
    setAttachedFile(null);

    // Simulate Bot Response
    if (activeChannel === 'edubot') {
      setTimeout(() => {
        setMessages(prev => ({
          ...prev,
          edubot: [...(prev.edubot || []), {
            id: Date.now() + 1,
            sender: 'edubot',
            text: 'Bu konuda sana yardımcı olabilirim. Daha fazla detay verebilir misin?',
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          }]
        }));
      }, 1000);
    }
  };

  const handleDeleteMessage = (msgId) => {
    setMessages(prev => ({
      ...prev,
      [activeChannel]: prev[activeChannel].filter(m => m.id !== msgId)
    }));
  };

  const currentChannel = channels.find(c => c.id === activeChannel);
  const currentMessages = messages[activeChannel] || [];

  const renderMessageContent = (msg) => {
    if (msg.isCode || msg.text.includes('```')) {
      // Çok temel bir markdown kod bloğu ayrıştırıcısı (Sadece demo amaçlı basit görünüm)
      const parts = msg.text.split('```');
      return parts.map((part, index) => {
        if (index % 2 === 1) { // Kod kısmı
          const lines = part.split('\n');
          const code = lines.slice(1).join('\n').trim() || lines.join('\n');
          return (
            <div key={index} style={{ 
              background: '#1e293b', color: '#e2e8f0', padding: '16px', borderRadius: '12px',
              fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', marginTop: '8px', marginBottom: '8px',
              border: '1px solid #334155', overflowX: 'auto', whiteSpace: 'pre-wrap'
            }}>
              <code>{code}</code>
            </div>
          );
        }
        return <span key={index}>{part}</span>;
      });
    }
    return msg.text;
  };

  return (
    <div style={{ 
      marginTop: '80px',
      padding: '24px 5%', 
      height: 'calc(100vh - 80px)', 
      display: 'flex', 
      gap: t.spacing[6],
      background: p.background,
      color: p.text,
      fontFamily: "'Outfit', sans-serif",
      boxSizing: 'border-box'
    }}>
      
      {/* Sidebar Channels */}
      <div style={{ 
        width: '320px', 
        background: isDark ? 'rgba(255,255,255,0.02)' : '#fff',
        borderRadius: '24px', 
        border: `1px solid ${p.border}`,
        display: 'flex', 
        flexDirection: 'column',
        backdropFilter: 'blur(10px)',
        boxShadow: t.shadows.md,
        overflow: 'hidden'
      }}>
        <div style={{ padding: '24px', borderBottom: `1px solid ${p.border}` }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Mesajlar
            <div style={{ position: 'relative' }} ref={newChatRef}>
              <button onClick={() => setShowNewChatMenu(!showNewChatMenu)} style={{ background: p.accent, color: '#fff', border: 'none', width: 36, height: 36, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: `0 4px 12px ${p.accent}40` }}>
                <Plus size={20} />
              </button>
              {showNewChatMenu && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 8, width: 220, background: isDark ? '#0f172a' : '#fff', borderRadius: 16, padding: 8, boxShadow: t.shadows.md, border: `1px solid ${p.border}`, zIndex: 10 }}>
                  <button onClick={() => setShowNewChatMenu(false)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'transparent', border: 'none', color: p.text, borderRadius: 12, cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <Users size={16} color={p.accent} /> <span style={{ fontWeight: 600 }}>Yeni Grup Oluştur</span>
                  </button>
                  <button onClick={() => setShowNewChatMenu(false)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'transparent', border: 'none', color: p.text, borderRadius: 12, cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <UserPlus size={16} color={p.accent} /> <span style={{ fontWeight: 600 }}>Yeni Arkadaş Ekle</span>
                  </button>
                </div>
              )}
            </div>
          </h2>
          <input 
            type="text" 
            placeholder="Kişi veya kanal ara..." 
            style={{ 
              width: '100%', padding: '12px 16px', marginTop: '20px', borderRadius: '14px', 
              border: `1px solid ${p.border}`, background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', 
              color: p.text, outline: 'none' 
            }}
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          
          <div style={{ fontSize: 12, fontWeight: 700, color: p.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, paddingLeft: 8 }}>Yapay Zeka</div>
          {channels.filter(c => c.type === 'bot').map(channel => (
            <button 
              key={channel.id} 
              onClick={() => setActiveChannel(channel.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', 
                borderRadius: '16px', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                background: activeChannel === channel.id ? (isDark ? 'rgba(0,212,170,0.15)' : '#e6fcf7') : 'transparent',
                color: p.text, marginBottom: 8, textAlign: 'left'
              }}
            >
              <div style={{ position: 'relative' }}>
                <div style={{ width: 44, height: 44, borderRadius: '14px', background: 'linear-gradient(135deg, #00d4aa, #00b894)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Bot size={24} />
                </div>
                <div style={{ position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, background: '#10b981', border: `3px solid ${activeChannel === channel.id ? (isDark?'#132e29':'#e6fcf7') : p.panel}`, borderRadius: '50%' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{channel.name}</div>
                <div style={{ fontSize: 13, color: p.accent, fontWeight: 600 }}>Senin için burada</div>
              </div>
            </button>
          ))}

          <div style={{ fontSize: 12, fontWeight: 700, color: p.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginTop: 24, marginBottom: 12, paddingLeft: 8 }}>Gruplar & Sınıflar</div>
          {channels.filter(c => c.type === 'group').map(channel => (
            <button 
              key={channel.id} 
              onClick={() => setActiveChannel(channel.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', 
                borderRadius: '16px', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                background: activeChannel === channel.id ? (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9') : 'transparent',
                color: p.text, marginBottom: 8, textAlign: 'left'
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: '14px', background: isDark ? '#1e293b' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.textMuted }}>
                <Hash size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{channel.name}</div>
                <div style={{ fontSize: 13, color: p.textMuted }}>14 Çevrimiçi</div>
              </div>
            </button>
          ))}

          <div style={{ fontSize: 12, fontWeight: 700, color: p.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginTop: 24, marginBottom: 12, paddingLeft: 8 }}>Direkt Mesajlar</div>
          {channels.filter(c => c.type === 'dm').map(channel => (
            <button 
              key={channel.id} 
              onClick={() => setActiveChannel(channel.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', 
                borderRadius: '16px', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                background: activeChannel === channel.id ? (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9') : 'transparent',
                color: p.text, marginBottom: 8, textAlign: 'left'
              }}
            >
              <div style={{ position: 'relative' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: isDark ? '#334155' : '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
                  {channel.name.charAt(0)}
                </div>
                {channel.status === 'online' && (
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, background: '#10b981', border: `2px solid ${p.panel}`, borderRadius: '50%' }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{channel.name}</div>
              </div>
            </button>
          ))}

        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ 
        flex: 1, 
        background: isDark ? 'rgba(255,255,255,0.02)' : '#fff',
        borderRadius: '24px', 
        border: `1px solid ${p.border}`,
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: t.shadows.md,
        overflow: 'hidden'
      }}>
        
        {/* Chat Header */}
        <div style={{ 
          padding: '20px 32px', 
          borderBottom: `1px solid ${p.border}`, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          background: isDark ? 'rgba(255,255,255,0.01)' : '#fafafa'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
             <div style={{ 
                width: 48, height: 48, borderRadius: currentChannel?.type === 'dm' ? '50%' : '14px', 
                background: currentChannel?.type === 'bot' ? 'linear-gradient(135deg, #00d4aa, #00b894)' : (isDark ? '#1e293b' : '#e2e8f0'), 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: currentChannel?.type === 'bot' ? '#fff' : p.textMuted,
                fontWeight: 800, fontSize: 18
              }}>
                {currentChannel?.type === 'bot' ? <Bot size={24} /> : (currentChannel?.type === 'group' ? <Hash size={24} /> : currentChannel?.name.charAt(0))}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{currentChannel?.name}</h3>
                <span style={{ fontSize: 13, color: currentChannel?.type === 'bot' ? p.accent : p.textMuted, fontWeight: 600 }}>
                  {currentChannel?.type === 'bot' ? 'Her zaman aktif' : (currentChannel?.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı')}
                </span>
              </div>
          </div>
          <div style={{ display: 'flex', gap: 16, position: 'relative' }} ref={chatOptionsRef}>
            <button onClick={() => setShowChatOptions(!showChatOptions)} style={{ background: 'transparent', border: 'none', color: p.textMuted, cursor: 'pointer' }}>
              <MoreVertical size={24} />
            </button>
            {showChatOptions && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, width: 200, background: isDark ? '#0f172a' : '#fff', borderRadius: 16, padding: 8, boxShadow: t.shadows.md, border: `1px solid ${p.border}`, zIndex: 10 }}>
                <button onClick={() => setShowChatOptions(false)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'transparent', border: 'none', color: p.text, borderRadius: 12, cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <User size={16} /> <span style={{ fontWeight: 600 }}>Profili Gör</span>
                </button>
                <button onClick={() => setShowChatOptions(false)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'transparent', border: 'none', color: p.text, borderRadius: 12, cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <UserPlus size={16} /> <span style={{ fontWeight: 600 }}>Arkadaşlıktan Çıkar</span>
                </button>
                <button onClick={() => setShowChatOptions(false)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'transparent', border: 'none', color: p.text, borderRadius: 12, cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <MicOff size={16} /> <span style={{ fontWeight: 600 }}>Sessize Al</span>
                </button>
                <button onClick={() => setShowChatOptions(false)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'transparent', border: 'none', color: '#ef4444', borderRadius: 12, cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <LogOut size={16} /> <span style={{ fontWeight: 600 }}>Ayrıl</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Messages List */}
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <style>{`
            .msg-row:hover .delete-btn { opacity: 1 !important; visibility: visible !important; }
          `}</style>
          {currentMessages.map((msg, i) => {
            const isMe = msg.sender === 'me';
            return (
              <div key={msg.id || i} className="msg-row" style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '100%'
              }}>
                {!isMe && currentChannel.type === 'group' && (
                  <span style={{ fontSize: 13, fontWeight: 600, color: p.textMuted, marginBottom: 4, marginLeft: 16 }}>{msg.name}</span>
                )}
                
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexDirection: isMe ? 'row-reverse' : 'row' }}>
                  
                  {!isMe && currentChannel.type !== 'dm' && (
                    <div style={{ 
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: msg.sender === 'edubot' ? 'linear-gradient(135deg, #00d4aa, #00b894)' : (isDark ? '#334155' : '#cbd5e1'),
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 800
                    }}>
                      {msg.sender === 'edubot' ? <Bot size={16} /> : msg.name?.charAt(0)}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexDirection: isMe ? 'row-reverse' : 'row' }}>
                    <div style={{ 
                      padding: '16px 20px', 
                      background: isMe ? 'linear-gradient(135deg, #00d4aa, #00b894)' : (isDark ? '#1e293b' : '#f1f5f9'),
                      color: isMe ? '#fff' : p.text,
                      borderRadius: '20px',
                      borderBottomRightRadius: isMe ? '4px' : '20px',
                      borderBottomLeftRadius: !isMe ? '4px' : '20px',
                      fontSize: 15,
                      lineHeight: 1.5,
                      maxWidth: '600px',
                      boxShadow: isMe ? '0 8px 20px rgba(0,212,170,0.2)' : 'none',
                      border: isMe ? 'none' : `1px solid ${p.border}`
                    }}>
                      {renderMessageContent(msg)}
                    </div>

                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteMessage(msg.id)}
                      title="Mesajı Sil"
                      style={{ 
                        background: 'transparent', border: 'none', color: p.textMuted, cursor: 'pointer', 
                        padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: 0, visibility: 'hidden', transition: 'all 0.2s', borderRadius: '50%'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = isDark ? 'rgba(239,68,68,0.1)' : '#fee2e2'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = p.textMuted; e.currentTarget.style.background = 'transparent'; }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <span style={{ 
                  fontSize: 11, color: p.textMuted, marginTop: 6, 
                  marginRight: isMe ? 4 : 0, 
                  marginLeft: !isMe ? (currentChannel.type !== 'dm' ? 44 : 4) : 0 
                }}>
                  {msg.time}
                </span>

              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div style={{ padding: '24px 32px', background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', borderTop: `1px solid ${p.border}` }}>
          
          {attachedFile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: isDark ? 'rgba(255,255,255,0.05)' : '#fff', borderRadius: 12, border: `1px solid ${p.border}`, marginBottom: 12, width: 'fit-content', boxShadow: t.shadows.sm }}>
              {attachedFile.type === 'image' ? <Image size={16} color={p.accent} /> : <FileText size={16} color={p.accent} />}
              <span style={{ fontSize: 13, fontWeight: 600, color: p.text }}>{attachedFile.name}</span>
              <button type="button" onClick={() => setAttachedFile(null)} style={{ background: 'transparent', border: 'none', color: p.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: 8 }}><X size={14} /></button>
            </div>
          )}

          <form onSubmit={handleSend} style={{ 
            display: 'flex', alignItems: 'center', gap: 16, 
            background: isDark ? '#1e293b' : '#fff', padding: '8px 16px', borderRadius: '24px',
            border: `1px solid ${p.border}`, boxShadow: t.shadows.sm
          }}>
            <div style={{ position: 'relative' }} ref={attachRef}>
              <button type="button" onClick={() => setShowAttachmentMenu(!showAttachmentMenu)} style={{ background: 'transparent', border: 'none', color: p.textMuted, cursor: 'pointer', padding: 8, borderRadius: '50%' }}>
                <Paperclip size={20} />
              </button>
              {showAttachmentMenu && (
                <div style={{ position: 'absolute', bottom: '100%', left: 0, marginBottom: 8, width: 200, background: isDark ? '#0f172a' : '#fff', borderRadius: 16, padding: 8, boxShadow: t.shadows.md, border: `1px solid ${p.border}`, zIndex: 10 }}>
                  <button type="button" onClick={() => { setAttachedFile({ type: 'image', name: 'ekran_goruntusu.png' }); setShowAttachmentMenu(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'transparent', border: 'none', color: p.text, borderRadius: 12, cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <Image size={16} color="#3b82f6" /> <span style={{ fontWeight: 600 }}>Fotoğraf / Video</span>
                  </button>
                  <button type="button" onClick={() => { setAttachedFile({ type: 'doc', name: 'proje_raporu.pdf' }); setShowAttachmentMenu(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'transparent', border: 'none', color: p.text, borderRadius: 12, cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <FileText size={16} color="#10b981" /> <span style={{ fontWeight: 600 }}>Belge Ekle</span>
                  </button>
                </div>
              )}
            </div>

            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={activeChannel === 'edubot' ? "EduBot'a bir şey sor veya kod paylaş..." : "Mesajınızı yazın..."}
              style={{ flex: 1, background: 'transparent', border: 'none', color: p.text, outline: 'none', fontSize: 16, padding: '12px 0' }}
            />
            
            <div style={{ position: 'relative' }} ref={emojiRef}>
              <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ background: 'transparent', border: 'none', color: p.textMuted, cursor: 'pointer', padding: 8, borderRadius: '50%' }}>
                <Smile size={20} />
              </button>
              {showEmojiPicker && (
                <div style={{
                  position: 'absolute', bottom: '100%', right: 0, marginBottom: 8,
                  background: isDark ? '#0f172a' : '#fff', border: `1px solid ${p.border}`, borderRadius: '16px',
                  padding: 8, display: 'flex', flexWrap: 'wrap', gap: '4px', width: '260px',
                  boxShadow: t.shadows.md, zIndex: 10
                }}>
                  {EMOJIS.map(emoji => (
                    <button type="button" key={emoji} onClick={() => { setInput(prev => prev + emoji); setShowEmojiPicker(false); }} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '6px', borderRadius: '8px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>{emoji}</button>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={!input.trim() && !attachedFile} style={{ 
              background: (input.trim() || attachedFile) ? p.accent : p.border, color: '#fff', border: 'none', 
              width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: (input.trim() || attachedFile) ? 'pointer' : 'default', transition: 'all 0.2s',
              boxShadow: (input.trim() || attachedFile) ? `0 4px 12px ${p.accent}60` : 'none', flexShrink: 0
            }}>
              <Send size={18} style={{ marginLeft: 2 }} />
            </button>
          </form>
          {activeChannel === 'edubot' && (
            <div style={{ fontSize: 12, color: p.textMuted, textAlign: 'center', marginTop: 12 }}>
              ✨ EduBot mesajları yapay zeka tarafından oluşturulur, doğruluklarını her zaman kontrol edin.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
