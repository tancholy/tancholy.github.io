const KEY = "frostiee-os-alpha-v1";
const seed = {tasks:[],notes:[],bookmarks:[]};
let state = load();
let view = "home";
const content = document.getElementById("content");
const crumb = document.getElementById("crumb");
const toastEl = document.getElementById("toast");
function load(){try{return {...seed,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return {...seed}}}
function save(){localStorage.setItem(KEY,JSON.stringify(state));updateCount()}
function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function toast(msg){toastEl.textContent=msg;toastEl.classList.add("show");setTimeout(()=>toastEl.classList.remove("show"),2100)}
function updateCount(){document.getElementById("task-count").textContent=state.tasks.filter(t=>!t.done).length}
function go(next){view=next;document.querySelectorAll(".nav-item[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===view));crumb.textContent=({home:"Home",tasks:"Tasks",notes:"Second Brain",bookmarks:"Bookmarks",projects:"Projects",settings:"Settings"})[view];render();document.getElementById("sidebar").classList.remove("open")}
function empty(title,copy){return '<div class="empty"><strong>'+title+'</strong>'+copy+'</div>'}
function header(kicker,title,sub,action=""){return '<div class="view-head"><div><div class="eyebrow">'+kicker+'</div><h1 class="page-title">'+title+'</h1><p class="subtitle">'+sub+'</p></div>'+action+'</div>'}
function render(){
  updateCount();
  if(view==="home") renderHome();
  if(view==="tasks") renderTasks();
  if(view==="notes") renderNotes();
  if(view==="bookmarks") renderBookmarks();
  if(view==="projects") renderProjects();
  if(view==="settings") renderSettings();
}
function renderHome(){
 const open=state.tasks.filter(t=>!t.done);
 content.innerHTML='<div class="eyebrow">MONDAY ENERGY, EVERY DAY</div><h1 class="page-title">Welcome to your space, Tymofii<span style="color:#72b1cc">.</span></h1><p class="subtitle" style="margin-bottom:24px">A little command centre for big ideas. Make today count.</p>'+
 '<section class="hero"><div class="eyebrow">YOUR CREATIVE HEADQUARTERS</div><h1>Think it. Capture it. Make it happen.</h1><p>Your ideas, projects and next moves — together in one calm space.</p><div class="hero-actions"><button class="btn" data-go="notes">＋ Capture an idea</button><button class="btn secondary" data-go="tasks">Open task board ↗</button></div></section>'+
 '<div class="stats"><div class="stat"><div class="stat-label">OPEN TASKS</div><div class="stat-value">'+open.length+'</div><div class="stat-note">Things in motion</div></div><div class="stat"><div class="stat-label">BRAIN NOTES</div><div class="stat-value">'+state.notes.length+'</div><div class="stat-note">Ideas worth keeping</div></div><div class="stat"><div class="stat-label">BOOKMARKS</div><div class="stat-value">'+state.bookmarks.length+'</div><div class="stat-note">Good things found online</div></div></div>'+
 '<div class="two-col"><section class="panel"><div class="section-head" style="margin-top:0"><h2>Up next</h2><button class="text-btn" data-go="tasks">View all →</button></div>'+(open.length?'<div class="task-list">'+open.slice(0,4).map(taskHTML).join("")+'</div>':empty("Nothing on the runway yet","Add a task and it will appear here."))+'</section><section class="panel"><h3>Quick capture</h3><div class="quick-grid"><button class="quick" data-go="tasks"><span>✓</span><b>New task</b><small>One thing to do</small></button><button class="quick" data-go="notes"><span>✎</span><b>New note</b><small>Save a thought</small></button><button class="quick" data-go="bookmarks"><span>↗</span><b>Save a link</b><small>Keep it nearby</small></button><button class="quick" data-go="projects"><span>◇</span><b>Projects</b><small>See your spaces</small></button></div></section></div>';
}
function taskHTML(t){return '<label class="task-row '+(t.done?'done':'')+'"><input type="checkbox" data-task="'+t.id+'" '+(t.done?'checked':'')+'><span>'+esc(t.title)+'</span><small class="task-tag">'+esc(t.tag||"General")+'</small></label>'}
function renderTasks(){
 content.innerHTML=header("GET THINGS MOVING","Tasks","Small steps make big projects happen.",'<button class="btn" id="focus-add">＋ Add task</button>')+
 '<section class="panel"><form class="form-row" id="task-form"><input class="field" id="task-title" placeholder="What needs doing?" required maxlength="120"><input class="field" id="task-tag" placeholder="Category (e.g. Creator)" maxlength="24" style="max-width:180px"><button class="btn">Add</button></form><div class="task-list">'+(state.tasks.length?state.tasks.map(taskHTML).join(""):empty("Your task board is clear","Add your first task above."))+'</div></section>';
 document.getElementById("task-form").addEventListener("submit",e=>{e.preventDefault();const title=document.getElementById("task-title").value.trim();if(!title)return;state.tasks.unshift({id:crypto.randomUUID(),title,tag:document.getElementById("task-tag").value.trim()||"General",done:false});save();renderTasks();toast("Task added")});
}
function renderNotes(){
 content.innerHTML=header("SECOND BRAIN","Catch the thought.","Ideas, drafts, reminders and research — save them before they disappear.",'<button class="btn" id="note-focus">＋ New note</button>')+
 '<section class="panel"><form id="note-form"><input class="field" id="note-title" placeholder="Give this note a title..." required maxlength="100"><textarea class="field" id="note-body" rows="4" placeholder="Start writing..." style="margin-top:9px;resize:vertical"></textarea><div style="display:flex;justify-content:flex-end;margin-top:9px"><button class="btn">Save note</button></div></form></section><div class="section-head"><h2>Your notes</h2><span class="stat-label">'+state.notes.length+' SAVED</span></div><div class="note-grid">'+(state.notes.length?state.notes.map(n=>'<article class="item-card"><h3>'+esc(n.title)+'</h3><p>'+esc(n.body)+'</p><div class="item-meta"><span>'+new Date(n.created).toLocaleDateString()+'</span><button class="delete" data-delete-note="'+n.id+'">Delete</button></div></article>').join(""):empty("A fresh page","Your saved notes will show up here."))+'</div>';
 document.getElementById("note-form").addEventListener("submit",e=>{e.preventDefault();const title=document.getElementById("note-title").value.trim();const body=document.getElementById("note-body").value.trim();if(!title)return;state.notes.unshift({id:crypto.randomUUID(),title,body,created:Date.now()});save();renderNotes();toast("Note saved")});
}
function renderBookmarks(){
 content.innerHTML=header("YOUR INTERNET CORNER","Bookmarks","Useful links, inspiration and places to come back to.",'<button class="btn" id="bookmark-focus">＋ Save link</button>')+
 '<section class="panel"><form class="form-row" id="bookmark-form"><input class="field" id="bookmark-title" placeholder="Name this link" required maxlength="90"><input class="field" id="bookmark-url" placeholder="https://..." type="url" required><button class="btn">Save</button></form></section><div class="section-head"><h2>Saved links</h2><span class="stat-label">'+state.bookmarks.length+' SAVED</span></div><div class="bookmark-grid">'+(state.bookmarks.length?state.bookmarks.map(b=>'<article class="item-card"><h3>'+esc(b.title)+'</h3><a class="bookmark-url" href="'+esc(b.url)+'" target="_blank" rel="noopener noreferrer">'+esc(b.url)+'</a><div class="item-meta" style="margin-top:14px"><span>Saved link</span><button class="delete" data-delete-bookmark="'+b.id+'">Delete</button></div></article>').join(""):empty("Nothing bookmarked yet","Save a useful website or inspiration link."))+'</div>';
 document.getElementById("bookmark-form").addEventListener("submit",e=>{e.preventDefault();let url=document.getElementById("bookmark-url").value.trim();if(!/^https?:\/\//i.test(url))url="https://"+url;state.bookmarks.unshift({id:crypto.randomUUID(),title:document.getElementById("bookmark-title").value.trim(),url});save();renderBookmarks();toast("Bookmark saved")});
}
function renderProjects(){
 const projects=[["Creator Studio","Video ideas, scripts, production and your channel workflow.","▶"],["Academy","School notes, subjects and assignments.","✦"],["Tech Lab","Cameras, computers, software and experiments.","⌘"],["Idea Factory","Unfiltered concepts, sketches and what-ifs.","✧"]];
 content.innerHTML=header("YOUR DEPARTMENTS","Projects & spaces","The different worlds inside your creative headquarters.")+'<div class="project-grid">'+projects.map(p=>'<article class="project-card"><div class="project-icon">'+p[2]+'</div><h3>'+p[0]+'</h3><p>'+p[1]+'</p></article>').join("")+'</div><div class="notice"><strong>These are starter spaces.</strong>Next we can turn each one into a proper workspace with its own pages, files, templates and connected projects.</div>';
}
function renderSettings(){
 content.innerHTML=header("PREFERENCES","Settings","A few details about this first preview.")+'<section class="panel settings-card"><h3>Frostiee OS Alpha</h3><p class="subtitle">Version 0.1.0 · Local-first prototype</p><div class="notice"><strong>Important: this is not the secure, synced version yet.</strong>Your notes, tasks and bookmarks are saved in this browser on this device only. They do not sync to your iPad, iPhone or other computers. Do not store passwords or sensitive information here. Login, encrypted server storage and cross-device sync are the next development stage.</div><div style="margin-top:18px"><button class="btn secondary" id="export-data" style="background:#eaf3f7;color:#274b67">Export my data</button> <button class="btn" id="clear-data" style="background:#f7e9e9;color:#9a424b">Clear local data</button></div></section>';
 document.getElementById("export-data").onclick=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:"application/json"}));a.download="frostiee-os-backup.json";a.click();URL.revokeObjectURL(a.href);toast("Backup exported")};
 document.getElementById("clear-data").onclick=()=>{if(confirm("Delete all Frostiee OS data saved in this browser?")){state={...seed};save();renderSettings();toast("Local data cleared")}};
}
document.addEventListener("click",e=>{
 const nav=e.target.closest("[data-view]");if(nav){go(nav.dataset.view);return}
 const jump=e.target.closest("[data-go]");if(jump){go(jump.dataset.go);return}
 const check=e.target.closest("[data-task]");if(check){const t=state.tasks.find(x=>x.id===check.dataset.task);if(t){t.done=check.checked;save();if(view==="tasks")renderTasks();else renderHome()}return}
 const dn=e.target.closest("[data-delete-note]");if(dn){state.notes=state.notes.filter(n=>n.id!==dn.dataset.deleteNote);save();renderNotes();toast("Note deleted");return}
 const db=e.target.closest("[data-delete-bookmark]");if(db){state.bookmarks=state.bookmarks.filter(b=>b.id!==db.dataset.deleteBookmark);save();renderBookmarks();toast("Bookmark deleted");return}
 if(e.target.id==="focus-add")document.getElementById("task-title").focus();
 if(e.target.id==="note-focus")document.getElementById("note-title").focus();
 if(e.target.id==="bookmark-focus")document.getElementById("bookmark-title").focus();
});
document.getElementById("mobile-menu").onclick=()=>document.getElementById("sidebar").classList.toggle("open");
document.getElementById("global-search").addEventListener("input",e=>{
 const q=e.target.value.trim().toLowerCase();if(!q)return;
 const found=[...state.notes.filter(n=>(n.title+" "+n.body).toLowerCase().includes(q)).map(n=>"Note: "+n.title),...state.tasks.filter(t=>t.title.toLowerCase().includes(q)).map(t=>"Task: "+t.title),...state.bookmarks.filter(b=>(b.title+" "+b.url).toLowerCase().includes(q)).map(b=>"Link: "+b.title)];
 toast(found.length?found.slice(0,3).join(" · "):"No matches yet");
});
updateCount();render();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("sw.js").catch(()=>{});
