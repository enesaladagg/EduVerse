import React from 'react';
import { UserCircle, Code2, Atom, Palette, Target, PartyPopper, Flame, MessageCircle } from 'lucide-react';

// ═══════════════════════════════════════════
//  § DESIGN TOKENS FOR MOCK DATA
// ═══════════════════════════════════════════
const T = {
  cyan: "#0ef0b2",
  violet: "#a78bfa",
  rose: "#f43f5e",
};

export const USER = { name: "Elif", level: 24, xp: 12450, xpNext: 15000, streak: 14, avatar: <UserCircle size={32} color="#a78bfa" /> };

export const COURSES = [
  {
    id: 1, title: "Python ile Sıfırdan Uzmanlığa", instructor: "Dr. Ahmet Yılmaz",
    progress: 68, icon: <Code2 size={24} color={T.cyan} />, color: T.cyan, totalLessons: 324, completed: 220,
    currentModule: "Nesne Yönelimli Programlama", currentLesson: "Kalıtım ve Polimorfizm",
    nextLesson: "Soyut Sınıflar ve Interface", timeLeft: "13s 24dk",
    lastAccess: "2 saat önce", weeklyGoal: 5, weeklyDone: 3,
  },
  {
    id: 2, title: "React & Next.js Full Stack", instructor: "Elif Kaya",
    progress: 34, icon: <Atom size={24} color={T.violet} />, color: T.violet, totalLessons: 412, completed: 140,
    currentModule: "React Hooks Derinlemesine", currentLesson: "useEffect Lifecycle",
    nextLesson: "Custom Hooks Yazımı", timeLeft: "36s 48dk",
    lastAccess: "dün", weeklyGoal: 4, weeklyDone: 1,
  },
  {
    id: 3, title: "UI/UX Tasarım Masterclass", instructor: "Zeynep Arslan",
    progress: 12, icon: <Palette size={24} color={T.rose} />, color: T.rose, totalLessons: 186, completed: 22,
    currentModule: "Renk Teorisi ve Tipografi", currentLesson: "Renk Psikolojisi",
    nextLesson: "Tipografi Temelleri", timeLeft: "33s 12dk",
    lastAccess: "3 gün önce", weeklyGoal: 3, weeklyDone: 0,
  },
];

export const DAILY_GOALS = [
  { label: "2 ders tamamla", done: true, xp: 50 },
  { label: "1 quiz çöz", done: true, xp: 30 },
  { label: "Forumda 1 soru yanıtla", done: false, xp: 20 },
  { label: "30 dk odaklanma modu", done: false, xp: 40 },
];

export const SKILL_DATA = [
  { name: "Python", value: 78 }, { name: "Algoritmalar", value: 55 },
  { name: "Web Dev", value: 42 }, { name: "Veritabanı", value: 60 },
  { name: "DevOps", value: 25 }, { name: "UI/UX", value: 18 },
];

export const SCHEDULE = [
  { time: "14:00", title: "Canlı: Python OOP", type: "live", instructor: "Dr. Ahmet Y.", duration: "90dk" },
  { time: "16:30", title: "Mentor Görüşmesi", type: "mentor", instructor: "Zeynep A.", duration: "30dk" },
  { time: "19:00", title: "Topluluk AMA: Kariyer", type: "community", duration: "60dk" },
];

export const WEEKLY_HOURS = [
  { d: "Pzt", h: 2.5 }, { d: "Sal", h: 1.8 }, { d: "Çar", h: 3.2 },
  { d: "Per", h: 0.5 }, { d: "Cum", h: 2.1 }, { d: "Cmt", h: 4.0 }, { d: "Paz", h: 0 },
];

export const SOCIAL_PULSE = [
  { user: "Burak K.", action: "Python OOP quizinde %95 aldı", time: "5dk", emoji: <Target size={16} /> },
  { user: "Merve T.", action: "React kursunu tamamladı!", time: "12dk", emoji: <PartyPopper size={16} /> },
  { user: "Can Ö.", action: "28 günlük seri rekorunu kırdı", time: "20dk", emoji: <Flame size={16} /> },
  { user: "Ayşe D.", action: "UI/UX projesini paylaştı", time: "1s", emoji: <Palette size={16} /> },
  { user: "Emre K.", action: "Forumda 50. cevabını verdi", time: "2s", emoji: <MessageCircle size={16} /> },
];

export const AI_MESSAGES = [
  { type: "reminder", text: "Python OOP modülünde kaldığın yer: Kalıtım konusunu %72 tamamladın. Bugün 1 ders daha bitirirsen haftalık hedefini tutturursun!", priority: "high" },
  { type: "tip", text: "Polimorfizm konusunda zorlandığını fark ettim. Sana özel hazırladığım 3 mini alıştırmayı denemek ister misin?", priority: "medium" },
  { type: "insight", text: "Bu hafta öğrenme hızın %23 arttı! En verimli saatlerin 14:00–16:00 arasında. Bu saat dilimine ders planlamayı düşünür müsün?", priority: "low" },
];
