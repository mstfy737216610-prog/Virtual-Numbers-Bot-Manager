/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
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
  ChevronRight,
  Save,
  Plus,
  Trash2,
  MessageSquare,
  User as UserIcon,
  LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for Tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Auth (LocalStorage based) ---
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
      displayName: "المطور",
      email: "mstfy737216610@gmail.com",
      photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
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

// --- Components ---

const Sidebar = ({ isOpen, onClose, user, logout }: { isOpen: boolean; onClose: () => void; user: any; logout: () => void }) => {
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
        "fixed inset-y-0 right-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-2xl",
        !isOpen && "translate-x-full"
      )}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-600 rounded-lg">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">إدارة البوت</h1>
          <button onClick={onClose} className="lg:hidden mr-auto text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-2 flex-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => onClose()}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors group"
            >
              <link.icon size={20} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
              <span className="font-medium text-slate-300 group-hover:text-white">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl mb-4 overflow-hidden">
            <img src={user?.photoURL || ''} alt="avatar" className="w-10 h-10 rounded-full border border-slate-700" />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user?.displayName}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-all border border-red-600/20"
          >
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

// --- Pages ---

const DashboardHome = () => {
  const [stats, setStats] = useState({ providers: 0 });

  useEffect(() => {
    const providers = JSON.parse(localStorage.getItem('bot_providers') || '[]');
    setStats({ providers: providers.length });
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-l from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20">
        <h2 className="text-3xl font-bold mb-2">أهلاً بك في نظام الإدارة الذكي</h2>
        <p className="text-blue-100 max-w-2xl opacity-90 leading-relaxed">
          هنا يمكنك إدارة بوت الأرقام الوهمية الخاص بك، تعديل الأسعار، ربط المواقع، وتحويل الأكواد لمنصة Bot Business بكل سهولة وإبداع.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <Globe size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">المواقع المرتبطة</p>
              <p className="text-2xl font-bold text-slate-900">{stats.providers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <Settings size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">حالة البوت</p>
              <p className="text-2xl font-bold text-emerald-600">نشط (تجريبي)</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">نظام التخزين</p>
              <p className="text-2xl font-bold text-slate-900">محلي</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfigPage = () => {
  const [config, setConfig] = useState({ botToken: '', adminId: '', channelId: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem('bot_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem('bot_config', JSON.stringify(config));
      alert('تم حفظ الإعدادات في المتصفح بنجاح');
      setSaving(false);
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Settings className="text-blue-600" />
        <h2 className="text-2xl font-bold">إعدادات البوت الأساسية</h2>
      </div>

      <form onSubmit={handleSave} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">توكن البوت (Bot Token)</label>
          <input
            type="text"
            value={config.botToken}
            onChange={(e) => setConfig({ ...config, botToken: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-mono text-sm"
            placeholder="مثال: 123456789:ABCDEF..."
            dir="ltr"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">معرف الأدمن (Admin ID)</label>
          <input
            type="text"
            value={config.adminId}
            onChange={(e) => setConfig({ ...config, adminId: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-mono text-sm"
            placeholder="مثال: 8338869162"
            dir="ltr"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">معرف القناة (Channel ID)</label>
          <input
            type="text"
            value={config.channelId}
            onChange={(e) => setConfig({ ...config, channelId: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-mono text-sm"
            placeholder="مثال: @mychannel"
            dir="ltr"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? 'جاري الحفظ...' : (
            <>
              <Save size={20} />
              <span>حفظ التعديلات</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

const ProvidersPage = () => {
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('bot_providers');
    if (saved) {
      setProviders(JSON.parse(saved));
    } else {
      // Default to 5sim with provided key
      const defaults = [
        { 
          id: '5sim', 
          name: '5sim.net', 
          apiKey: 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4MTkxMzcxMTQsImlhdCI6MTc4NzYwMTExNCwicmF5IjoiNTZlYmFlNjg0NGQyMTAzZjAyZjUyMzJlYjVhODViNTEiLCJzdWIiOjQ0MzcwMDF9.qEpXfNoatnjn3MLJhQErUVmgfIJ-cP_laTBFdz8RkeMietQrjYqZnRHTd23NjPxVPwn0HpoAz4lAmOwTiuPjaUQkU2u9QCnh2i89MAedpfm2kosspiug1Ux6o7pJ-2fVqPGW27cQtGmOz-vZne997NCbdCc7eDxoX3ZknvorIu1ZmaCEnVlk2-t-YdHAi90GzVqjrvE0dZqZM4Mp-IgX8z71Bv1neikePV2RsE68hGMM8Z2bONHMeAqxhtezVcW0ykW1pCk_NLjcSnTWFXo_L_dgVvZLQnPB1n-ROqFan55gB-uEkuU0KN0gkvnozT9_N4wTWjAYiLTy1S3-vaooDA', 
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

  const saveAll = (newProviders: any[]) => {
    setProviders(newProviders);
    localStorage.setItem('bot_providers', JSON.stringify(newProviders));
  };

  const addProvider = () => {
    const name = prompt('أدخل اسم الموقع الجديد (مثلاً: 5sim.biz)');
    if (!name) return;
    const id = Date.now().toString();
    saveAll([...providers, { id, name, apiKey: '', profitMargin: 1, isActive: true }]);
  };

  const updateProvider = (id: string, data: any) => {
    saveAll(providers.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deleteProvider = (id: string) => {
    if (confirm('حذف هذا الموقع؟')) {
      saveAll(providers.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="text-blue-600" />
          <h2 className="text-2xl font-bold">إدارة مزودي الأرقام</h2>
        </div>
        <button
          onClick={addProvider}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
        >
          <Plus size={20} />
          <span>إضافة موقع</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providers.map((p) => (
          <div key={p.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">{p.name}</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateProvider(p.id, { isActive: !p.isActive })}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    p.isActive ? "bg-emerald-500" : "bg-slate-300"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    p.isActive ? "right-7" : "right-1"
                  )} />
                </button>
                <button onClick={() => deleteProvider(p.id)} className="text-slate-400 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">مفتاح الـ API</label>
                <input
                  type="text"
                  value={p.apiKey}
                  onChange={(e) => updateProvider(p.id, { apiKey: e.target.value })}
                  placeholder="أدخل مفتاح الـ API هنا"
                  className="w-full px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">نسبة الربح (روبل)</label>
                <input
                  type="number"
                  value={p.profitMargin}
                  onChange={(e) => updateProvider(p.id, { profitMargin: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        ))}
        {providers.length === 0 && (
          <div className="md:col-span-2 text-center py-12 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">لا يوجد مواقع مضافة حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ChannelsPage = () => {
  const [channels, setChannels] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('bot_channels');
    if (saved) setChannels(JSON.parse(saved));
  }, []);

  const saveAll = (newChannels: any[]) => {
    setChannels(newChannels);
    localStorage.setItem('bot_channels', JSON.stringify(newChannels));
  };

  const addChannel = () => {
    const username = prompt('أدخل معرف القناة (مثلاً: @mychannel)');
    if (!username) return;
    const id = Date.now().toString();
    saveAll([...channels, { id, username, isActive: true, createdAt: new Date().toISOString() }]);
  };

  const deleteChannel = (id: string) => {
    if (confirm('حذف القناة؟')) {
      saveAll(channels.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="text-blue-600" />
          <h2 className="text-2xl font-bold">إدارة قنوات الإشتراك الإجباري</h2>
        </div>
        <button
          onClick={addChannel}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
        >
          <Plus size={20} />
          <span>إضافة قناة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map((c) => (
          <div key={c.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold">
                {c.username[1]?.toUpperCase() || '@'}
              </div>
              <div>
                <p className="font-bold text-slate-900">{c.username}</p>
                <p className="text-xs text-slate-400">نشطة منذ {new Date(c.createdAt).toLocaleDateString('ar-YE')}</p>
              </div>
            </div>
            <button 
              onClick={() => deleteChannel(c.id)}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {channels.length === 0 && (
          <div className="lg:col-span-3 text-center py-12 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">لم يتم إضافة قنوات اشتراك إجباري بعد</p>
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
    'SMSProvider.js': `// SMS Provider logic
function getProviderRequest(site, action, params) {
  // logic...
}`,
    'README.md': `# دليل تشغيل بوت الأرقام الوهمية على Bot Business

## هيكلة الملفات:
- bot.json (في الجذر الرئيسي)
- commands/ (مجلد الأوامر)
- libs/ (مجلد المكتبات)
`
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileCode className="text-blue-600" />
        <h2 className="text-2xl font-bold">أكواد Bot Business</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-2">
          {files.map((file) => (
            <button
              key={file.name}
              onClick={() => setActiveFile(file.name)}
              className={cn(
                "flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all font-medium text-right",
                activeFile === file.name 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm"
              )}
            >
              <file.icon size={18} />
              <span>{file.name}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            <div className="px-6 py-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <span className="text-sm font-mono text-slate-400">{activeFile}</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(codes[activeFile]);
                  alert('تم نسخ الكود!');
                }}
                className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-lg transition-colors"
              >
                نسخ الكود
              </button>
            </div>
            <pre className="p-6 overflow-x-auto text-blue-300 font-mono text-sm leading-relaxed" dir="ltr">
              <code>{codes[activeFile]}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

const DocsPage = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-10 rounded-[2rem] shadow-sm border border-slate-200">
      <div className="prose prose-slate prose-blue max-w-none text-right" dir="rtl">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 border-b pb-4">دليل الاستخدام والتشغيل الكامل</h1>
        
        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
              <ChevronRight className="rotate-180" /> مقدمة عن النظام
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              هذا النظام هو النسخة المطورة والمحولة من بوت الأرقام الوهمية الشهير المبني بـ PHP. تم إعادة بناء المنطق ليتوافق مع منصة **Bot Business** لضمان سرعة أكبر وسهولة في الإدارة عبر الـ JavaScript.
            </p>
          </section>

          <section className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">طريقة إضافة موقع (مورد) جديد:</h2>
            <p className="text-slate-600 mb-4">لإضافة موقع جديد لجلب الأرقام، اتبع الخطوات التالية:</p>
            <ul className="list-disc mr-6 space-y-2 text-slate-700">
              <li>افتح ملف <code className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">libs/SMSProvider.js</code>.</li>
              <li>أضف شرطاً جديداً يحتوي على رابط الـ API الخاص بالموقع الجديد.</li>
              <li>استخدم المتغيرات <code className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">params.api_key</code> و <code className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">params.app</code> لتكوين الرابط.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">تغيير الأدمن والتوكن:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 border border-slate-200 rounded-2xl">
                <h3 className="font-bold text-blue-600 mb-2">تغيير التوكن</h3>
                <p className="text-sm text-slate-500">من ملف <code className="font-mono">bot.json</code> قم بتعديل قيمة الحقل <code className="font-mono">"token"</code>.</p>
              </div>
              <div className="p-6 border border-slate-200 rounded-2xl">
                <h3 className="font-bold text-blue-600 mb-2">تغيير الأدمن</h3>
                <p className="text-sm text-slate-500">من ملف <code className="font-mono">bot.json</code> قم بتعديل قيمة الحقل <code className="font-mono">"admin_id"</code>.</p>
              </div>
            </div>
          </section>

          <section className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-500/20">
            <h2 className="text-xl font-bold mb-4">الدقة والحسابات:</h2>
            <p className="opacity-90 leading-relaxed">
              تم ضبط نظام الحسابات ليعتمد على الروبل الروسي كعملة أساسية. يمكنك تعديل "نسبة الربح" لكل موقع بشكل منفصل عبر لوحة التحكم في قسم "مزودي الأرقام". النظام يقوم بإضافة هذه النسبة تلقائياً إلى السعر الأصلي المستلم من الموقع.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 italic">إخلاء مسؤولية:</h2>
            <p className="text-slate-500 text-sm italic">
              استخدامك لهذا البوت هو مسؤوليتك الشخصية. تأكد دائماً من تحديث مفاتيح الـ API الخاصة بك وعدم مشاركتها مع أي طرف ثالث لضمان أمان أرصدتك.
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-right" dir="rtl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-500/10 p-10 text-center border border-slate-100"
        >
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-600/30">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">نظام إدارة البوت</h1>
          <p className="text-slate-500 mb-8 font-medium">الرجاء تسجيل الدخول للوصول إلى لوحة التحكم وإدارة المواقع والأكواد.</p>
          <button
            onClick={login}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all group"
          >
            <LogIn size={20} />
            <span>الدخول إلى النظام</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-row-reverse overflow-x-hidden font-sans" dir="rtl">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} logout={logout} />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-20 bg-white border-b border-slate-200 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-40">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-4">
               <h2 className="text-lg font-bold text-slate-800 hidden md:block">لوحة التحكم المركزية</h2>
               <div className="h-6 w-[1px] bg-slate-200 hidden md:block" />
               <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">نسخة 2.0</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-700 md:block hidden">{user.displayName}</span>
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                <img src={user.photoURL || ''} alt="user" />
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-10">
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
    </Router>
  );
}
