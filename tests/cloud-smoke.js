const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const storage={};const requests=[];
const localStorage={getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=String(v),removeItem:k=>delete storage[k]};
const now=Date.now();
async function fetch(url,opts={}){
 const u=new URL(url); requests.push({path:u.pathname,method:opts.method||'GET'});
 const response=(data,status=200)=>({ok:status>=200&&status<300,status,json:async()=>data});
 if(u.pathname==='/auth/v1/token')return response({access_token:'test-access',refresh_token:'test-refresh',expires_in:3600,user:{id:'test-user'}});
 if(u.pathname==='/rest/v1/profiles')return response([{id:'test-user',role:'student',full_name:'Sinov talaba'}]);
 if(u.pathname==='/rest/v1/progress')return response(null,201);
 if(u.pathname==='/rest/v1/teacher_grades')return response([]);
 throw Error('Unexpected endpoint '+u.pathname);
}
const ctx=vm.createContext({localStorage,fetch,URL,AbortController,setTimeout,clearTimeout,Date,JSON,structuredClone,console});
vm.runInContext(fs.readFileSync(path.join(__dirname,'../www/cloud.js'),'utf8')+'\nthis.api=Cloud;',ctx);
(async()=>{
 assert.equal(ctx.api.ready(),false);
 ctx.api.saveConfig('https://example.supabase.co','test-public-anon-key-123456789');
 assert.equal(ctx.api.ready(),true);
 await ctx.api.auth('student@example.com','examplepass',false,'Sinov talaba');
 assert.equal(ctx.api.status().role,'student');
 await ctx.api.push({results:[{score:85}],answers:[],completedLessons:[1],gameHistory:[],games:{}});
 assert(requests.some(r=>r.path==='/rest/v1/progress'&&r.method==='POST'));
 const grades=await ctx.api.ownGrades(); assert.equal(grades.length,0);
 await assert.rejects(()=>ctx.api.dashboard(),/O‘qituvchi ruxsati yo‘q/);
 ctx.api.logout(); assert.equal(ctx.api.status().loggedIn,false);
 console.log('PASS: server maketi bilan login, progress, talaba huquqi, baholar va logout.');
})().catch(e=>{console.error(e);process.exitCode=1});
