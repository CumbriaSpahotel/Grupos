const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('js/services/capaSuiteCalendarSync.js','utf8');
const turn = () => new Promise(resolve => setImmediate(resolve));
function fixture(options={}) {
  const handlers={}, store=new Map(), callbacks=[], timers=[];
  let auth, connection, reads=0;
  const sdk={createSession:()=>({
    observeConnection:fn=>{connection=fn;},
    observeAuth:fn=>{auth=fn;fn({uid:'first'});},
    listen:(uid,next,error)=>{callbacks.push({uid,next,error});return ()=>{};},
    read:async()=>{reads++;return {val:()=>payload(125)};},
    signIn:async()=>{}
  })};
  const context={window:{addEventListener:(key,fn)=>handlers[key]=fn,dispatchEvent:()=>{}},
    localStorage:{setItem:(key,value)=>{if(options.storageBlocked)throw Error('quota');store.set(key,value);}},
    CustomEvent:function(){},setTimeout:(fn,ms)=>timers.push({fn,ms}),sdk};
  vm.createContext(context);
  vm.runInContext(source.replace("import('./capaSuiteSession.mjs?v=1')",'Promise.resolve(sdk)'),context);
  return {service:context.window.CapaSuiteCalendarSync,handlers,callbacks,store,timers,auth:user=>auth(user),connection:value=>connection(value),get reads(){return reads;}};
}
function payload(price) {return {compData:JSON.stringify({data:[{dateISO:'2027-09-04',hotels:{Cumbria:{price}}}]}),hotelData:'{}',customEvents:'[]'};}
test('opens actual CapaSuite account, receives price changes automatically and distinguishes offline',async()=>{
  const f=fixture();await f.service.start();
  assert.equal(f.callbacks[0].uid,'first');
  assert.equal(f.service.state.data,null);
  f.connection(true);f.callbacks[0].next({val:()=>payload(71)});
  assert.equal(f.service.state.data.revenue_data_v2.data[0].hotels.Cumbria.price,71);
  f.callbacks[0].next({val:()=>payload(99)});
  assert.equal(f.service.state.data.revenue_data_v2.data[0].hotels.Cumbria.price,99);
  assert.equal(f.service.state.status,'CapaSuite actualizado');
  f.connection(false);assert.match(f.service.state.status,/sin conexión/);
  f.connection(true);await f.handlers.online();await turn();
  assert.equal(f.reads,1);
  assert.equal(f.service.state.data.revenue_data_v2.data[0].hotels.Cumbria.price,125);
});
test('ignores late snapshots from previous account, reports failures and missing sessions',async()=>{
  const f=fixture();await f.service.start();
  f.auth({uid:'second'});f.callbacks[0].next({val:()=>payload(100)});
  assert.equal(f.service.state.data,null);
  f.callbacks[1].next({val:()=>payload(80)});
  f.callbacks[1].next({val:()=>({compData:'broken'})});
  assert.match(f.service.state.status,/no se pudo leer/);
  assert.equal(f.service.state.data.revenue_data_v2.data[0].hotels.Cumbria.price,80);
  f.auth(null);assert.equal(f.service.state.data,null);
  assert.match(f.service.state.status,/inicia sesión/);
});
test('storage quota does not prevent calendar updates',async()=>{
  const f=fixture({storageBlocked:true});await f.service.start();
  f.callbacks[0].next({val:()=>payload(110)});
  assert.equal(f.service.state.data.revenue_data_v2.data[0].hotels.Cumbria.price,110);
});
test('retries when loading the SDK fails',async()=>{
  const f=fixture();
  f.service=null;
  const timers=[];
  const context={window:{addEventListener(){},dispatchEvent(){}},CustomEvent:function(){},setTimeout:(fn,ms)=>timers.push({fn,ms})};
  vm.runInNewContext(source.replace("import('./capaSuiteSession.mjs?v=1')","Promise.reject(new Error('offline'))"),context);
  await assert.rejects(context.window.CapaSuiteCalendarSync.start());
  assert.equal(timers[0].ms,5000);
  assert.match(context.window.CapaSuiteCalendarSync.state.status,/No se pudo conectar/);
});
test('calendar uses direct memory data, preserves filters, and never claims a cache read is synchronized',()=>{
  const html=fs.readFileSync('Calendario.html','utf8');
  assert.ok(html.includes('js/services/capaSuiteCalendarSync.js?v=1-direct-source'));
  assert.ok(fs.existsSync('js/services/capaSuiteSession.mjs'));
  assert.ok(!html.includes('id="btn-refresh"'));
  const engine=html.slice(html.indexOf('(function () {',html.indexOf('MOTOR Y')),html.lastIndexOf('</script>'));
  new vm.Script(engine);
  const start=engine.indexOf('            function getStorageItem(');
  const end=engine.indexOf('            function setStorageItem(',start);
  const context={window:{CapaSuiteCalendarSync:{state:{authenticated:true,data:{revenue_data_v2:{real:1}}}}},localStorage:{getItem:()=>'{"old":1}'}};
  vm.runInNewContext(engine.slice(start,end)+'this.read = getStorageItem;',context);
  assert.equal(context.read('revenue_data_v2'),'{"real":1}');
  assert.equal(context.read('hotel_manager_db_v2'),null);
  assert.ok(engine.includes("if (window.CapaSuiteCalendarSync) return;"),'no old Firestore listener');
  assert.ok(!engine.includes('syncBadge.textContent = "Sincronizado"'));
});
