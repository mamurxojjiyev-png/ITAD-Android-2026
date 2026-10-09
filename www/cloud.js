/* ITAD yagona baholash tizimi. Server sozlanmaguncha faqat lokal rejim. */
'use strict';
const Cloud=(()=>{
 let cfg={};try{cfg=JSON.parse(localStorage.getItem('itad_cloud_config')||'{}')}catch{}
 let token='',refreshToken='',expiresAt=0,uid='',role='',fullName='',message='',rows=[];
 let refreshing=null;
 let saved;try{saved=JSON.parse(localStorage.getItem('itad_cloud_session')||'{}')}catch{saved={}}
 token=saved.access_token||'';refreshToken=saved.refresh_token||'';expiresAt=saved.expires_at||0;uid=saved.user_id||'';
 const ready=()=>Boolean(/^https:\/\/[^/]+\.supabase\.co\/?$/.test(cfg.url||'')&&cfg.key);
 const status=()=>({ready:ready(),uid,role,fullName,message,rows,loggedIn:!!token});
 function saveConfig(url,key){if(!/^https:\/\/[^/]+\.supabase\.co\/?$/.test(url))throw Error('Supabase HTTPS loyiha manzilini kiriting');if(!key||key.length<20)throw Error('Supabase publishable/anon kalitini kiriting');if(cfg.url!==url.replace(/\/$/,'')||cfg.key!==key)logout();cfg={url:url.replace(/\/$/,''),key};localStorage.setItem('itad_cloud_config',JSON.stringify(cfg));message='Ulanish sozlamasi saqlandi';}
 async function refresh(){
  if(!refreshToken)throw Error('Sessiya tugagan. Qayta kiring.');
  if(refreshing)return refreshing;
  refreshing=(async()=>{
   let r;try{const ctl=new AbortController();const timer=setTimeout(()=>ctl.abort(),15000);try{r=await fetch(cfg.url+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{'apikey':cfg.key,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:refreshToken}),signal:ctl.signal})}finally{clearTimeout(timer)}}catch{throw Error('Internet mavjud emas yoki server javob bermadi')}
   const v=await r.json().catch(()=>({}));if(!r.ok||!v.access_token){logout();throw Error('Sessiya tugagan. Qayta kiring.')}
   persistSession(v);return token;
  })();try{return await refreshing}finally{refreshing=null}
 }
 async function api(path,opts={}){
  if(!ready())throw Error('Avval serverni sozlang');
  if(token&&expiresAt&&Date.now()>expiresAt-60000&&refreshToken)await refresh();
  const send=async()=>{
   const h={'apikey':cfg.key,'Content-Type':'application/json',...(token?{'Authorization':'Bearer '+token}:{}),...(opts.headers||{})};
   try{const ctl=new AbortController();const timer=setTimeout(()=>ctl.abort(),15000);try{return await fetch(cfg.url+path,{...opts,headers:h,signal:ctl.signal})}finally{clearTimeout(timer)}}catch{throw Error('Internetga yoki serverga ulanishda xato')}
  };
  let response=await send();
  if(response.status===401&&token&&refreshToken){await refresh();response=await send()}
  let data;try{data=await response.json()}catch{data=null}
  if(!response.ok)throw Error(data?.msg||data?.message||data?.error_description||data?.error||('Server xatosi '+response.status));return data
 }
 function persistSession(v){token=v.access_token||'';uid=v.user?.id||uid||'';refreshToken=v.refresh_token||refreshToken||'';expiresAt=Date.now()+(Number(v.expires_in)||3600)*1000;localStorage.setItem('itad_cloud_session',JSON.stringify({access_token:token,user_id:uid,refresh_token:refreshToken,expires_at:expiresAt}));}
 async function auth(email,password,register,name){if(!ready())throw Error('Server sozlanmagan');if(!email||password.length<6)throw Error('Email va kamida 6 belgili parol kiriting');const v=await api('/auth/v1/'+(register?'signup':'token?grant_type=password'),{method:'POST',body:JSON.stringify(register?{email,password,data:{full_name:name||'Talaba'}}:{email,password})});if(register&&!v.access_token){message='Ro‘yxatdan o‘tdingiz. Email tasdiqlash havolasini ochib, so‘ng kiring.';return}persistSession(v);await loadProfile();message='Hisobga muvaffaqiyatli kirildi';}
 async function loadProfile(){if(!uid)return;const d=await api('/rest/v1/profiles?id=eq.'+encodeURIComponent(uid)+'&select=id,full_name,role',{headers:{'Accept':'application/json'}});if(!d.length)throw Error('Profil topilmadi. SQL sozlamasini tekshiring');role=d[0].role;fullName=d[0].full_name;}
 function logout(){token='';refreshToken='';expiresAt=0;uid='';role='';fullName='';rows=[];localStorage.removeItem('itad_cloud_session');message='Hisobdan chiqdingiz'}
 let latest=null, sending=false, pendingResolvers=[];
 async function push(state){
 if(!token||!uid)throw Error('Avval hisobingizga kiring');
 latest={user_id:uid,progress:{results:structuredClone(state.results||[]),answers:structuredClone(state.answers||[]),completedLessons:[...(state.completedLessons||[])],gameHistory:structuredClone(state.gameHistory||[]),games:structuredClone(state.games||{}),missions:(()=>{try{return JSON.parse(localStorage.getItem('itad_games_v3')||'{}')}catch{return {}}})(),updated_at:new Date().toISOString()}};
 if(sending)return new Promise((resolve,reject)=>pendingResolvers.push({resolve,reject}));
 sending=true;
 try{
  while(latest){
   const next=latest;latest=null;
   try{await api('/rest/v1/progress?on_conflict=user_id',{method:'POST',headers:{'Prefer':'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(next)});message='Natijalar serverga saqlandi'}
   catch(e){latest=latest||next;message='Sinxronlash xatosi: '+e.message;throw e}
  }
  pendingResolvers.splice(0).forEach(w=>w.resolve(true));return true;
 }catch(e){pendingResolvers.splice(0).forEach(w=>w.reject(e));throw e}
 finally{sending=false}
}
 async function dashboard(){await loadProfile();if(role!=='teacher')throw Error('O‘qituvchi ruxsati yo‘q');const profiles=await api('/rest/v1/profiles?select=id,full_name,role&order=full_name.asc');const prog=await api('/rest/v1/progress?select=user_id,progress,updated_at');const grades=await api('/rest/v1/teacher_grades?select=id,user_id,score,note,created_at&order=created_at.desc');rows=profiles.filter(x=>x.role==='student').map(x=>({...x,progress:prog.find(p=>p.user_id===x.id)?.progress||{},grades:grades.filter(g=>g.user_id===x.id)}));message=rows.length+' ta talaba natijasi yuklandi';return rows}
 async function grade(student,score,note){if(role!=='teacher')throw Error('Ruxsat yo‘q');if(!Number.isInteger(score)||score<0||score>100)throw Error('Ball 0–100 bo‘lishi kerak');await api('/rest/v1/teacher_grades',{method:'POST',body:JSON.stringify({user_id:student,score,note:note||''})});await dashboard()}
 async function ownGrades(){if(!token)return [];return await api('/rest/v1/teacher_grades?select=score,note,created_at&order=created_at.desc')}
 async function restore(){if(!token)return;try{await loadProfile()}catch(e){message='Profilni yuklab bo‘lmadi: '+e.message; if(/401|403|Sessiya tugagan|JWT/i.test(e.message))logout()}}
 const config=()=>({...cfg});
 return {ready,status,config,saveConfig,auth,loadProfile,logout,push,dashboard,grade,ownGrades,restore};
})();
