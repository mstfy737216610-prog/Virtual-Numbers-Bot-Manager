import FiveSimAdapter from './adapters/fivesim.js';
import TempNumAdapter from './adapters/tempnum.js';
import OnlineSimAdapter from './adapters/onlinesim.js';
import { getPriceFor } from './providerRegistry.js';
import db from '../db/index.js';

const adapterMap = { '5sim': FiveSimAdapter, tempnum: TempNumAdapter, onlinesim: OnlineSimAdapter };
export async function createOrder({ telegramId, providerCode, appCode, countryCode, operator='any' }) {
  const user=db.prepare('SELECT * FROM users WHERE telegram_id=?').get(String(telegramId));
  const provider=db.prepare('SELECT * FROM providers WHERE code=? AND enabled=1').get(providerCode);
  const app=provider&&db.prepare('SELECT * FROM apps WHERE provider_id=? AND code=? AND enabled=1').get(provider.id,appCode);
  if(!user) throw Error('المستخدم غير موجود'); if(!provider) throw Error('المزود غير موجود'); if(!app) throw Error('التطبيق غير موجود');
  const price=getPriceFor(providerCode,appCode,countryCode,operator); if(price===null) throw Error('لا يوجد سعر لهذا الاختيار'); if(Number(user.balance)<price) throw Error('الرصيد غير كافٍ');
  const create=db.transaction(()=>{ const info=db.prepare('INSERT INTO orders(user_id,provider_id,app_id,country_code,operator,status) VALUES(?,?,?,?,?,?)').run(user.id,provider.id,app.id,countryCode,operator,'creating'); db.prepare('UPDATE users SET balance=balance-? WHERE id=?').run(price,user.id); db.prepare("INSERT INTO transactions(user_id,type,amount,status,meta) VALUES(?,?,?,?,?)").run(user.id,'purchase',price,'pending',JSON.stringify({order:info.lastInsertRowid})); return info.lastInsertRowid; });
  const orderId=create();
  try { const Cls=adapterMap[providerCode]; let result; if(Cls){ const server=db.prepare('SELECT * FROM provider_servers WHERE provider_id=? AND enabled=1 ORDER BY id DESC LIMIT 1').get(provider.id); result=await new Cls(server||{}).getNumber({app:appCode,country:countryCode,operator}); } else result={status:200,number:`+${countryCode}-000000000`,idnumber:`demo-${Date.now()}`,time:900};
    if(result.status!==200 || !result.number || !result.idnumber) throw Error(result.message||'فشل المزود');
    db.prepare('UPDATE orders SET phone=?,external_id=?,status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').run(result.number,result.idnumber,'active',orderId); return {orderId,external:result};
  } catch(e){ db.transaction(()=>{db.prepare("UPDATE orders SET status='failed',updated_at=CURRENT_TIMESTAMP WHERE id=?").run(orderId); db.prepare('UPDATE users SET balance=balance+? WHERE id=?').run(price,user.id); db.prepare("INSERT INTO transactions(user_id,type,amount,status,meta) VALUES(?,?,?,?,?)").run(user.id,'refund',price,'success',JSON.stringify({order:orderId}));})(); throw e; }
}
export async function pollOrderStatus(orderId){ const order=db.prepare('SELECT o.*,p.code provider_code FROM orders o JOIN providers p ON p.id=o.provider_id WHERE o.id=?').get(orderId); if(!order) throw Error('الطلب غير موجود'); const Cls=adapterMap[order.provider_code]; if(!Cls)return null; const server=db.prepare('SELECT * FROM provider_servers WHERE provider_id=? AND enabled=1 ORDER BY id DESC LIMIT 1').get(order.provider_id); const result=await new Cls(server||{}).getStatus({idnumber:order.external_id,number:order.phone}); if(result?.status===200&&result.code){db.prepare("UPDATE orders SET status='completed',updated_at=CURRENT_TIMESTAMP WHERE id=?").run(orderId);} return result; }
