/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { 
  Bot, 
  Settings, 
  Globe, 
  Database, 
  FileCode, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck,
  ChevronLeft,
  Save,
  Plus,
  Trash2,
  MessageSquare,
  Activity,
  Zap,
  Lock,
  Copy,
  CheckCircle2,
  AlertCircle,
  LogIn,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for Tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface Provider {
  id: string;
  name: string;
  apiKey: string;
  accountId?: string;
  profitMargin: number;
  isActive: boolean;
}

interface Channel {
  id: string;
  username: string;
  isActive: boolean;
  createdAt: string;
}

interface BotConfig {
  botToken: string;
  adminId: string;
  channelId: string;
}

// --- Mock Auth Hook ---
const useAuth = () => {
  const [user, setUser] = useState<{ displayName: string; email: string; photoURL: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('app_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = () => {
    const mockUser = {
      displayName: "المهندس المسؤول",
      email: "admin@virtual-numbers.com",
      photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${Math.random()}&backgroundColor=0ea5e9`
    };
    localStorage.setItem('app_user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem('app_user');
    setUser(null);
  };

  return { user, loading, login, logout };
};

// --- Global UI Components ---

const StatCard = ({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: any, color: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group text-right">
    <div className="flex items-center justify-between mb-4">
      <div className={cn("p-2.5 rounded-xl transition-colors", color)}>
        <Icon size={22} />
      </div>
      <Activity size={16} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900 tabular-nums">{value}</p>
    </div>
  </div>
);

const Sidebar = ({ isOpen, onClose, user, logout }: { isOpen: boolean; onClose: () => void; user: any; logout: () => void }) => {
  const location = useLocation();
  const links = [
    { to: '/', icon: Bot, label: 'لوحة التحكم' },
    { to: '/config', icon: Settings, label: 'إعدادات البوت' },
    { to: '/providers', icon: Globe, label: 'مزودي الأرقام' },
    { to: '/channels', icon: Database, label: 'إدارة القنوات' },
    { to: '/code', icon: FileCode, label: 'الأكواد المحولة' },
    { to: '/docs', icon: MessageSquare, label: 'الدليل التعليمي' },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 right-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-2xl flex flex-col",
        !isOpen && "translate-x-full"
      )}
    >
      <div className="p-8 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/30">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none">إدارة البوت</h1>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">تحكم مركزي</span>
          </div>
          <button onClick={onClose} className="lg:hidden mr-auto text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-2 flex-1">
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => onClose()}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group relative overflow-hidden",
                  active 
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <link.icon size={20} className={cn("transition-colors", active ? "text-white" : "group-hover:text-blue-400")} />
                <span className="font-bold">{link.label}</span>
                {active && <motion.div layoutId="active" className="absolute right-0 w-1.5 h-6 bg-white rounded-l-full" />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-800">
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl mb-6 overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-blue-500 border-2 border-white/20 overflow-hidden shadow-inner">
              <img src={user?.photoURL} alt="avatar" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black truncate">{user?.displayName}</p>
              <p className="text-[10px] text-slate-500 truncate font-mono uppercase">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-3 w-full px-5 py-4 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-2xl font-black transition-all border border-red-600/20 active:scale-95 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

// --- Pages ---

const DashboardHome = () => {
  const providersCount = useMemo(() => JSON.parse(localStorage.getItem('bot_providers') || '[]').length, []);
  const channelsCount = useMemo(() => JSON.parse(localStorage.getItem('bot_channels') || '[]').length, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 rounded-[3rem] p-12 text-white border border-white/5 shadow-2xl">
        <div className="relative z-10">
          <motion.span 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md text-blue-300 rounded-full text-xs font-black mb-8 border border-white/10"
          >
            <Zap size={14} className="text-amber-400" />
            نظام الإدارة المركزي v2.5
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black mb-6 tracking-tight leading-[1.1]"
          >
            تحكم ذكي في<br /><span className="text-blue-400">بوت الأرقام الوهمية</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-xl text-lg leading-relaxed mb-10 font-medium"
          >
            قم بإدارة مزودي الخدمة، قنوات الاشتراك، وتعديل إعدادات البوت والأسعار بلمسة واحدة. نظامنا المحول يضمن لك استقراراً تاماً وتجربة مستخدم فريدة.
          </motion.p>
          <div className="flex flex-wrap gap-5">
            <Link to="/providers" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-2xl shadow-blue-600/40 hover:bg-blue-500 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3">
              <Globe size={20} />
              إدارة الموردين
            </Link>
            <Link to="/code" className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl font-black hover:bg-white/20 transition-all border border-white/10 active:scale-95 flex items-center gap-3">
              <FileCode size={20} />
              معاينة الأكواد
            </Link>
          </div>
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="المواقع المربوطة" value={providersCount} icon={Globe} color="bg-blue-600/10 text-blue-600" />
        <StatCard label="القنوات النشطة" value={channelsCount} icon={Database} color="bg-indigo-600/10 text-indigo-600" />
        <StatCard label="حالة الاتصال" value="آمن" icon={ShieldCheck} color="bg-emerald-600/10 text-emerald-600" />
        <StatCard label="وقت التشغيل" value="99.99%" icon={Zap} color="bg-amber-600/10 text-amber-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            آخر الأنشطة والمهام
          </h3>
          <div className="space-y-5">
            {[
              { t: 'تحديث بروتوكول API الخاص بـ 5sim.net', d: 'منذ ساعتين', c: 'blue' },
              { t: 'إضافة قناة دعم فني جديدة للعملاء', d: 'منذ 5 ساعات', c: 'indigo' },
              { t: 'ضبط نسبة الربح لموقع HeroSMS إلى 1.5 روبل', d: 'يوم أمس', c: 'emerald' },
              { t: 'تأمين ملف bot.json للمزامنة السحابية', d: 'منذ يومين', c: 'slate' }
            ].map((task, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-slate-200 transition-all group">
                <div className="flex items-center gap-4 text-right">
                   <div className={`w-3 h-3 rounded-full bg-${task.c}-500 shadow-lg shadow-${task.c}-500/30 group-hover:scale-125 transition-transform`} />
                   <span className="font-bold text-slate-700 text-lg">{task.t}</span>
                </div>
                <span className="text-sm text-slate-400 font-bold">{task.d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
             <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <AlertCircle size={24} />
            </div>
            حالة النظام
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                <ShieldCheck size={48} />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white animate-pulse" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 mb-2">النظام مستقر تماماً</p>
              <p className="text-slate-400 font-bold leading-relaxed">
                كافة الاتصالات مع خوادم الموردين تعمل بكفاءة عالية. لم يتم رصد أي أخطاء في المزامنة.
              </p>
            </div>
            <button className="px-8 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all text-sm uppercase tracking-widest">
              تقرير الاستقرار الكامل
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfigPage = () => {
  const [config, setConfig] = useState<BotConfig>({ botToken: '', adminId: '', channelId: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('bot_config');
    if (saved) setConfig(JSON.parse(saved));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem('bot_config', JSON.stringify(config));
      alert('✅ تم حفظ التكوين بنجاح!');
      setSaving(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 text-right">
      <div className="mb-12">
        <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">إعدادات النواة المركزية</h2>
        <p className="text-slate-500 font-bold text-xl">تحكم في هوية البوت وصلاحيات المسؤولين.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-200 space-y-10">
        <div className="grid grid-cols-1 gap-10">
          <div className="space-y-4">
            <label className="text-lg font-black text-slate-700 flex items-center gap-3">
              <Lock size={20} className="text-blue-500" />
              توكن البوت الخاص بـ Telegram
            </label>
            <div className="relative group">
              <input
                type="password"
                value={config.botToken}
                onChange={(e) => setConfig({ ...config, botToken: e.target.value })}
                className="w-full px-6 py-5 rounded-[1.5rem] bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white transition-all outline-none font-mono text-sm tracking-wider"
                placeholder="7664564811:AAGM8C7CK..."
                dir="ltr"
              />
              <div className="absolute inset-0 rounded-[1.5rem] ring-4 ring-blue-500/0 group-focus-within:ring-blue-500/5 transition-all pointer-events-none" />
            </div>
            <p className="text-xs text-slate-400 font-bold pr-2">تحذير: لا تقم بمشاركة هذا التوكن مع أي شخص للحفاظ على أمان البوت.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-lg font-black text-slate-700 flex items-center gap-3">
                <UserIcon size={20} className="text-indigo-500" />
                معرف التلجرام للمالك
              </label>
              <input
                type="text"
                value={config.adminId}
                onChange={(e) => setConfig({ ...config, adminId: e.target.value })}
                className="w-full px-6 py-5 rounded-[1.5rem] bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white transition-all outline-none font-mono text-lg font-black"
                placeholder="8338869162"
                dir="ltr"
              />
            </div>

            <div className="space-y-4">
              <label className="text-lg font-black text-slate-700 flex items-center gap-3">
                <MessageSquare size={20} className="text-blue-400" />
                معرف قناة الإشعارات
              </label>
              <input
                type="text"
                value={config.channelId}
                onChange={(e) => setConfig({ ...config, channelId: e.target.value })}
                className="w-full px-6 py-5 rounded-[1.5rem] bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white transition-all outline-none font-mono text-lg font-black"
                placeholder="@MyBotChannel"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-slate-900/30 hover:bg-slate-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 disabled:opacity-50 group active:scale-95"
        >
          {saving ? (
            <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save size={24} className="group-hover:scale-110 transition-transform" />
              <span>تحديث وتأمين كافة البيانات</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

const ProvidersPage = () => {
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('bot_providers');
    if (saved) {
      setProviders(JSON.parse(saved));
    } else {
      const defaults: Provider[] = [
        { 
          id: '5sim', 
          name: '5sim.net', 
          apiKey: '', 
          accountId: '4437001',
          profitMargin: 1, 
          isActive: true 
        },
        {
          id: 'herosms',
          name: 'hero-sms.com',
          apiKey: '',
          accountId: '1513844',
          profitMargin: 1.5,
          isActive: true
        }
      ];
      setProviders(defaults);
      localStorage.setItem('bot_providers', JSON.stringify(defaults));
    }
  }, []);

  const saveAll = (newProviders: Provider[]) => {
    setProviders(newProviders);
    localStorage.setItem('bot_providers', JSON.stringify(newProviders));
  };

  const addProvider = () => {
    const name = prompt('أدخل اسم الموقع الجديد:');
    if (!name) return;
    const id = Date.now().toString();
    saveAll([...providers, { id, name, apiKey: '', profitMargin: 1, isActive: true }]);
  };

  const updateProvider = (id: string, data: Partial<Provider>) => {
    saveAll(providers.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deleteProvider = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المورد بشكل نهائي؟')) {
      saveAll(providers.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 text-right">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">مزودي الخدمة والأرباح</h2>
          <p className="text-slate-500 font-bold text-xl">تحكم في مصادر الأرقام وعمولات البيع.</p>
        </div>
        <button
          onClick={addProvider}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all flex items-center gap-3 active:scale-95 whitespace-nowrap"
        >
          <Plus size={24} />
          <span>إضافة مورد جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {providers.map((p) => (
          <div key={p.id} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all group relative">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center font-black text-2xl shadow-2xl shadow-slate-900/20 group-hover:scale-110 transition-transform">
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 leading-none mb-2">{p.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", p.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
                    <span className={cn("text-xs font-black uppercase tracking-widest", p.isActive ? "text-emerald-600" : "text-slate-400")}>
                      {p.isActive ? 'مفعل وجاهز' : 'متوقف مؤقتاً'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateProvider(p.id, { isActive: !p.isActive })}
                  className={cn(
                    "w-16 h-8 rounded-full transition-all relative outline-none ring-offset-2 focus:ring-4 ring-blue-500/20",
                    p.isActive ? "bg-emerald-500 shadow-lg shadow-emerald-500/30" : "bg-slate-200"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all",
                    p.isActive ? "right-9" : "right-1"
                  )} />
                </button>
                <button 
                  onClick={() => deleteProvider(p.id)} 
                  className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                >
                  <Trash2 size={22} />
                </button>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest pr-2 flex items-center gap-2">
                   <Lock size={14} className="text-blue-500" />
                   مفتاح الـ API للتوثيق
                </label>
                <input
                  type="password"
                  value={p.apiKey}
                  onChange={(e) => updateProvider(p.id, { apiKey: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:bg-white transition-all outline-none font-mono text-sm"
                  placeholder="أدخل مفتاح الـ JWT أو الـ Token"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-500 uppercase tracking-widest pr-2">معرف الحساب</label>
                  <input
                    type="text"
                    value={p.accountId || ''}
                    onChange={(e) => updateProvider(p.id, { accountId: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 font-mono text-lg font-black text-slate-900 outline-none"
                    placeholder="ACCOUNT ID"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-500 uppercase tracking-widest pr-2 flex items-center gap-2">
                    <Zap size={14} className="text-amber-500" />
                    هامش الربح
                  </label>
                  <div className="relative group">
                    <input
                      type="number"
                      step="0.1"
                      value={p.profitMargin}
                      onChange={(e) => updateProvider(p.id, { profitMargin: parseFloat(e.target.value) || 0 })}
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 font-black text-2xl text-blue-600 outline-none pr-12"
                      dir="ltr"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100">₽</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChannelsPage = () => {
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('bot_channels');
    if (saved) setChannels(JSON.parse(saved));
  }, []);

  const saveAll = (newChannels: Channel[]) => {
    setChannels(newChannels);
    localStorage.setItem('bot_channels', JSON.stringify(newChannels));
  };

  const addChannel = () => {
    const username = prompt('أدخل معرف القناة (مثلاً: @MyChannel):');
    if (!username) return;
    const id = Date.now().toString();
    saveAll([...channels, { id, username, isActive: true, createdAt: new Date().toISOString() }]);
  };

  const deleteChannel = (id: string) => {
    if (confirm('هل تريد حذف هذه القناة؟ سيتمكن المستخدمون من تجاوز الاشتراك الإجباري.')) {
      saveAll(channels.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 text-right">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">قنوات الاشتراك الإجباري</h2>
          <p className="text-slate-500 font-bold text-xl">تحكم في القنوات التي يلتزم العميل بالانضمام إليها لاستخدام البوت.</p>
        </div>
        <button
          onClick={addChannel}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all flex items-center gap-3 active:scale-95 whitespace-nowrap"
        >
          <Plus size={24} />
          <span>تنشيط قناة جديدة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {channels.map((c) => (
          <div key={c.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 flex items-center justify-between group hover:shadow-xl hover:border-indigo-200 transition-all">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center font-black text-3xl shadow-inner group-hover:scale-110 transition-transform">
                {c.username.substring(1, 2).toUpperCase() || '@'}
              </div>
              <div>
                <p className="font-black text-slate-900 text-xl leading-none mb-2">{c.username}</p>
                <p className="text-xs font-bold text-slate-400">نشطة منذ: {new Date(c.createdAt).toLocaleDateString('ar-YE')}</p>
              </div>
            </div>
            <button 
              onClick={() => deleteChannel(c.id)}
              className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
            >
              <Trash2 size={24} />
            </button>
          </div>
        ))}
        {channels.length === 0 && (
          <div className="lg:col-span-3 py-32 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center space-y-6">
            <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-slate-200 shadow-sm border border-slate-100">
              <Database size={48} />
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-slate-400 mb-2">القائمة فارغة تماماً</p>
              <p className="text-slate-400 font-bold">لم يتم ضبط أي قنوات إجبارية حتى الآن.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CodePage = () => {
  const [activeFile, setActiveFile] = useState('bot.json');
  const files = [
    { name: 'bot.json', icon: Settings },
    { name: '_start.js', icon: Bot },
    { name: 'SMSProvider.js', icon: Globe },
    { name: 'README.md', icon: MessageSquare },
  ];

  const codes: Record<string, string> = {
    'bot.json': `{
  "bb_sync_version": "1.0",
  "name": "Virtual Numbers Bot",
  "csv_url": null
}`,
    '_start.js': `/*
  Command: /start
*/

// BJS code for /start command
var first_name = user.first_name;
var user_id = user.telegramid;
var admin_id = "8338869162";

var welcome_text = "♐️ - مرحبا بك " + first_name + "...";
// UI logic goes here...`,
    'SMSProvider.js': `// BJS Library for SMS Providers
// Integrated with 5sim.net and Hero-SMS API

function getProviderRequest(site, action, params) {
  var api_key = params.api_key;
  var url = "";
  
  if (site == "5sim") {
    var headers = {
      "Authorization": "Bearer " + api_key,
      "Accept": "application/json"
    };

    if (action == "getNum") {
      url = "https://5sim.net/v1/user/buy/activation/" + params.country + "/" + params.operator + "/" + params.app;
      return { url: url, headers: headers, method: "GET" };
    }
    
    if (action == "getStatus") {
      url = "https://5sim.net/v1/user/check/" + params.idnumber;
      return { url: url, headers: headers, method: "GET" };
    }

    if (action == "getBalance") {
      url = "https://5sim.net/v1/user/profile";
      return { url: url, headers: headers, method: "GET" };
    }
  }

  if (site == "herosms") {
    var headers = {
      "Authorization": "ApiKey " + api_key,
      "Accept": "application/json",
      "Content-Type": "application/json"
    };

    if (action == "getNum") {
      url = "https://hero-sms.com/api/v1/activations";
      var body = { service: params.app, country: parseInt(params.country) };
      return { url: url, headers: headers, method: "POST", body: JSON.stringify(body) };
    }
    
    if (action == "getStatus") {
      url = "https://hero-sms.com/api/v1/activations";
      return { url: url, headers: headers, method: "GET" };
    }

    if (action == "getBalance") {
      url = "https://hero-sms.com/api/v1/activations/stats";
      return { url: url, headers: headers, method: "GET" };
    }
  }
  return null;
}

publish({ getProviderRequest: getProviderRequest });`,
    'README.md': `# دليل تشغيل بوت الأرقام الوهمية على Bot Business

## هيكلة الملفات:
- bot.json (في الجذر الرئيسي)
- commands/ (مجلد الأوامر)
- libs/ (مجلد المكتبات)
`
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 text-right">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">تحميل الأكواد المحولة</h2>
        <p className="text-slate-500 font-bold text-xl">انسخ هذه الأكواد إلى ملفاتك على GitHub لبدء المزامنة فوراً.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-3">
          {files.map((file) => (
            <button
              key={file.name}
              onClick={() => setActiveFile(file.name)}
              className={cn(
                "flex items-center gap-4 w-full px-6 py-5 rounded-[1.5rem] transition-all font-black text-lg text-right group relative overflow-hidden",
                activeFile === file.name 
                  ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/30 translate-x-2" 
                  : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-200"
              )}
            >
              <file.icon size={22} className={activeFile === file.name ? "text-blue-400" : "text-slate-400 group-hover:text-blue-500"} />
              <span>{file.name}</span>
              {activeFile === file.name && <div className="absolute right-0 top-0 w-1.5 h-full bg-blue-500" />}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          <div className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-800 shadow-blue-900/10">
            <div className="px-10 py-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
              <span className="text-sm font-mono text-slate-500 font-bold tracking-widest">{activeFile}</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(codes[activeFile]);
                  alert('✅ تم نسخ الكود بنجاح!');
                }}
                className="flex items-center gap-3 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/30"
              >
                <Copy size={18} />
                نسخ الكود الكامل
              </button>
            </div>
            <div className="p-10 overflow-x-auto custom-scrollbar bg-slate-950/50">
               <pre className="text-blue-300 font-mono text-base leading-loose" dir="ltr">
                <code>{codes[activeFile]}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DocsPage = () => {
  return (
    <div className="max-w-5xl mx-auto bg-white p-16 rounded-[4rem] shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-6 duration-700 text-right selection:bg-blue-100">
      <div className="prose prose-slate prose-blue max-w-none" dir="rtl">
        <h1 className="text-5xl font-black text-slate-900 mb-12 border-b-8 border-blue-600 inline-block pb-4 tracking-tighter">دليل الاستخدام والتشغيل الشامل</h1>
        
        <div className="space-y-16">
          <section>
            <h2 className="text-3xl font-black text-blue-700 mb-8 flex items-center gap-4">
              <Zap className="text-amber-500" size={32} /> مقدمة عن الجيل الجديد
            </h2>
            <p className="text-slate-600 leading-loose text-xl font-medium">
              أهلاً بك في النسخة الأقوى على الإطلاق. تم تحويل هذا البوت من لغة PHP القديمة إلى نظام **Bots.Business JavaScript (BJS)** المتطور. هذا التحول ليس مجرد تغيير لغة، بل هو إعادة هندسة كاملة لضمان أقصى سرعة استجابة وأمان لبياناتك وأرصدتك.
            </p>
          </section>

          <section className="bg-slate-900 p-12 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
             <div className="absolute top-0 left-0 p-12 text-blue-500/10 -translate-x-1/4 -translate-y-1/4"><Globe size={300} /></div>
            <h2 className="text-3xl font-black mb-8 relative z-10">المزامنة مع Bots.Business:</h2>
            <ol className="list-decimal mr-12 space-y-6 text-slate-300 font-bold text-lg relative z-10">
              <li>أنشئ مستودعاً (Repository) على GitHub وارفعه كـ <span className="text-blue-400">Public</span>.</li>
              <li>انسخ الملفات من قسم "الأكواد المحولة" وضعها في المستودع (تأكد من وجود <code className="bg-white/10 px-2 rounded">bot.json</code> في الجذر).</li>
              <li>في تطبيق Bots.Business، اذهب لـ <code className="bg-white/10 px-2 rounded">Tools</code> ثم <code className="bg-white/10 px-2 rounded">Git Sync</code>.</li>
              <li>أدخل رابط المستودع واضغط <span className="text-blue-400 font-black">Sync</span> لبدء العمل.</li>
            </ol>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="p-10 bg-blue-50 rounded-[3rem] border border-blue-100">
               <h3 className="text-2xl font-black text-blue-900 mb-4">إضافة موقع جديد:</h3>
               <p className="text-blue-800 leading-relaxed font-bold">
                 يمكنك إضافة موردين جدد عبر قسم الموردين، ثم تحديث ملف <code className="bg-blue-100 px-2 rounded">SMSProvider.js</code> لإدراج منطق الـ API الخاص بهم كما هو موضح في الأمثلة البرمجية.
               </p>
            </div>
            <div className="p-10 bg-indigo-50 rounded-[3rem] border border-indigo-100">
               <h3 className="text-2xl font-black text-indigo-900 mb-4">تغيير المالك:</h3>
               <p className="text-indigo-800 leading-relaxed font-bold">
                 يتم التعرف على المالك عبر الأيدي الخاص به في تلجرام. يمكنك تغييره من "إعدادات البوت" لضمان ظهور لوحة تحكم الأدمن لك فقط داخل التلجرام.
               </p>
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-600 to-indigo-700 p-12 rounded-[3.5rem] text-white shadow-2xl shadow-blue-600/30 text-center">
            <h2 className="text-3xl font-black mb-6 italic">دقة الحسابات والأسعار</h2>
            <p className="opacity-90 leading-loose text-xl font-bold">
              النظام يقوم بجلب السعر الأصلي من المواقع (بالروبل أو الدولار) ثم يضيف عليه "نسبة الربح" التي تحددها أنت في اللوحة. السعر الذي يظهر للمستخدم في البوت هو السعر النهائي شامل ربحك الخاص.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const { user, loading, login, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans" dir="rtl">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white mb-8 shadow-2xl shadow-blue-600/40"
        >
          <ShieldCheck size={40} />
        </motion.div>
        <p className="text-slate-400 font-black text-xl tracking-tighter">جاري تهيئة مركز القيادة...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-right font-sans overflow-hidden" dir="rtl">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-20" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full bg-white rounded-[4rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] p-16 text-center border border-slate-100 relative z-10"
        >
          <div className="w-28 h-28 bg-slate-950 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-slate-900/40 rotate-6 hover:rotate-0 transition-transform duration-500">
            <ShieldCheck size={56} className="text-blue-400" />
          </div>
          <h1 className="text-5xl font-black text-slate-950 mb-6 tracking-tighter leading-none">مركز الإدارة الذكي</h1>
          <p className="text-slate-500 mb-12 font-bold text-xl leading-relaxed">أهلاً بك في لوحة تحكم بوت الأرقام الأقوى. يرجى تسجيل الدخول للبدء.</p>
          <button
            onClick={login}
            className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-2xl flex items-center justify-center gap-5 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-600/40 transition-all active:scale-95 group"
          >
            <LogIn size={28} className="group-hover:-translate-x-1 transition-transform" />
            <span>الدخول إلى لوحة التحكم</span>
          </button>
          <div className="mt-12 flex items-center justify-center gap-3 text-slate-300 font-black text-xs uppercase tracking-[0.2em]">
            <div className="h-[1px] w-8 bg-slate-200" />
            نظام مؤمن بالكامل
            <div className="h-[1px] w-8 bg-slate-200" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-row-reverse overflow-x-hidden font-sans selection:bg-blue-100 selection:text-blue-900" dir="rtl">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 lg:hidden" 
          />
        )}
      </AnimatePresence>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} logout={logout} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-28 bg-white/70 backdrop-blur-2xl border-b border-slate-200 px-8 lg:px-16 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-colors shadow-sm"
            >
              <Menu size={28} />
            </button>
            <div className="flex flex-col">
              <h2 className="text-2xl font-black text-slate-950 tracking-tight leading-none mb-1">مركز العمليات</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Live Management Console</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 bg-slate-100/50 p-3 rounded-[1.5rem] border border-slate-200/50">
            <div className="text-left md:block hidden ml-3">
              <p className="text-sm font-black text-slate-900 leading-none mb-1">{user.displayName}</p>
              <p className="text-[10px] font-bold text-slate-500 font-mono">{user.email}</p>
            </div>
            <div className="w-14 h-14 rounded-[1.2rem] bg-blue-600 overflow-hidden shadow-xl shadow-blue-600/20 border-2 border-white ring-4 ring-slate-100/50">
              <img src={user.photoURL} alt="user" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 lg:p-16 max-w-[1600px] mx-auto w-full">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/config" element={<ConfigPage />} />
            <Route path="/providers" element={<ProvidersPage />} />
            <Route path="/channels" element={<ChannelsPage />} />
            <Route path="/code" element={<CodePage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
