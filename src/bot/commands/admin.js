import db from '../../db/index.js';
import { ensureAdmin, addBalance, deductBalance, listProviders, listApps, listServers, listChannels, listCountries, listPrices, getRecentOrders } from './start.js';
import { adminKeyboard } from '../keyboards.js';

const help = {
  help_provider: 'addprovider <الاسم> <الكود>', help_server: 'addserver <كود_المزود> <الاسم> <base_url> <api_key>',
  help_app: 'addapp <كود_المزود> <الكود> <الاسم>', help_country: 'addcountry <الكود> <الاسم>',
  help_price: 'addprice <كود_المزود> <كود_التطبيق> <كود_الدولة> <المشغل> <السعر>',
  help_channel: 'addchannel <الاسم> <النوع>', help_addcoin: 'addcoin <telegram_id> <المبلغ>', help_delcoin: 'delcoin <telegram_id> <المبلغ>'
};

function lines(rows, fn, empty) { return rows.length ? rows.map(fn).join('\n') : empty; }
export async function handleAdminAction(ctx, action) {
  if (!ensureAdmin(ctx)) return ctx.reply('⛔️ لا تملك صلاحية الإدارة.');
  await ctx.answerCbQuery().catch(() => {});
  if (help[action]) return ctx.reply(`📝 الصيغة:\n\`${help[action]}\``, { parse_mode: 'Markdown' });
  let text = '';
  if (action === 'list_providers') text = lines(listProviders(), r => `• ${r.name} (${r.code}) ${r.enabled ? '✅' : '❌'}`, 'لا توجد مزودات.');
  else if (action === 'list_servers') text = lines(listServers(), r => `• ${r.provider_code} / ${r.name} / ${r.base_url || '-'} ${r.enabled ? '✅' : '❌'}`, 'لا توجد سيرفرات.');
  else if (action === 'list_apps') text = lines(listApps(), r => `• ${r.provider_code} / ${r.name} (${r.code})`, 'لا توجد تطبيقات.');
  else if (action === 'list_countries') text = lines(listCountries(), r => `• ${r.code} - ${r.name}`, 'لا توجد دول.');
  else if (action === 'list_channels') text = lines(listChannels(), r => `• ${r.name} (${r.type}) ${r.enabled ? '✅' : '❌'}`, 'لا توجد قنوات.');
  else if (action === 'list_prices') text = lines(listPrices(), r => `• ${r.provider_code}/${r.app_code}/${r.country_code}/${r.operator || 'any'} = ${r.price}`, 'لا توجد أسعار.');
  else if (action === 'stats') { const u=db.prepare('SELECT COUNT(*) c FROM users').get().c, o=db.prepare('SELECT COUNT(*) c FROM orders').get().c, b=db.prepare('SELECT COALESCE(SUM(balance),0) t FROM users').get().t; text=`📈 المستخدمون: ${u}\n🧾 الطلبات: ${o}\n💰 الأرصدة: ${b}\n\n${getRecentOrders(5).map(r=>`#${r.id} ${r.status}`).join('\n')}`; }
  else return ctx.reply('استخدم لوحة الإدارة أو الأوامر النصية.');
  return ctx.reply(text, { reply_markup: adminKeyboard() });
}

function num(value) { const n=Number(value); return Number.isFinite(n) ? n : null; }
export async function executeAdminCommand(ctx, input) {
  if (!ensureAdmin(ctx)) return ctx.reply('⛔️ لا تملك صلاحية الإدارة.');
  const [command, ...args] = input.trim().split(/\s+/);
  try {
    if (command === 'addprovider') { const [name, code]=args; if(!name||!code) throw Error(help.help_provider); db.prepare('INSERT INTO providers(name,code,enabled) VALUES(?,?,1)').run(name,code); return ctx.reply('✅ تمت إضافة المزود.'); }
    if (command === 'addserver') { const [providerCode,name,baseUrl='',apiKey='']=args; const p=db.prepare('SELECT id FROM providers WHERE code=?').get(providerCode); if(!p||!name) throw Error(help.help_server); db.prepare('INSERT INTO provider_servers(provider_id,name,base_url,api_key,enabled) VALUES(?,?,?,?,1)').run(p.id,name,baseUrl,apiKey); return ctx.reply('✅ تمت إضافة السيرفر.'); }
    if (command === 'addapp') { const [providerCode,code,name]=args; const p=db.prepare('SELECT id FROM providers WHERE code=?').get(providerCode); if(!p||!code||!name) throw Error(help.help_app); db.prepare('INSERT INTO apps(provider_id,code,name,enabled) VALUES(?,?,?,1)').run(p.id,code,name); return ctx.reply('✅ تمت إضافة التطبيق.'); }
    if (command === 'addcountry') { const [code,name]=args; if(!code||!name) throw Error(help.help_country); db.prepare('INSERT INTO countries(code,name) VALUES(?,?)').run(code,name); return ctx.reply('✅ تمت إضافة الدولة.'); }
    if (command === 'addchannel') { const [name,type='telegram']=args; if(!name) throw Error(help.help_channel); db.prepare('INSERT INTO channels(name,type,enabled) VALUES(?,?,1)').run(name,type); return ctx.reply('✅ تمت إضافة القناة.'); }
    if (command === 'addprice') { const [pc,ac,cc,operator='any',priceRaw]=args; const p=db.prepare('SELECT id FROM providers WHERE code=?').get(pc), a=p&&db.prepare('SELECT id FROM apps WHERE provider_id=? AND code=?').get(p.id,ac), price=num(priceRaw); if(!p||!a||!cc||price===null) throw Error(help.help_price); db.prepare('INSERT INTO prices(provider_id,app_id,country_code,operator,price,enabled) VALUES(?,?,?,?,?,1)').run(p.id,a.id,cc,operator,price); return ctx.reply('✅ تمت إضافة السعر.'); }
    if (command === 'addcoin' || command === 'delcoin') { const [id,amountRaw]=args, amount=num(amountRaw); if(!id||amount===null) throw Error(help[command==='addcoin'?'help_addcoin':'help_delcoin']); const balance=command==='addcoin'?addBalance(id,amount,{source:'admin'}):deductBalance(id,amount,{source:'admin'}); if(balance===null) return ctx.reply('المستخدم غير موجود.'); return ctx.reply(`✅ الرصيد الجديد: ${balance}`); }
    return ctx.reply('الأمر غير معروف.');
  } catch (e) { return ctx.reply(`❌ ${e.message}`); }
}
