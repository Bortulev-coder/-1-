"use strict";
const byId = id => document.getElementById(id);
const projectSections = new Set(["project", "reader", "visuals"]);
function route(){
  const id = location.hash.slice(1) || "personal";
  const project = projectSections.has(id);
  byId("personal").hidden = project;
  byId("project").hidden = !project;
  byId("nav-personal").removeAttribute("aria-current");
  byId("nav-project").removeAttribute("aria-current");
  byId(project ? "nav-project" : "nav-personal").setAttribute("aria-current","page");
  if(project) pauseTimer();
  if(location.hash) requestAnimationFrame(()=>byId(id)?.scrollIntoView({block:"start"}));
}
const operations=[
 ["E","Тождество","1 2 3 4","(1)(2)(3)(4)"],
 ["C₃","Поворот на 120°","1 3 4 2","(1)(2 3 4)"],
 ["C₃²","Поворот на 240°","1 4 2 3","(1)(2 4 3)"],
 ["σ₁","Плоскость через N₁ и F₂","1 2 4 3","(1)(2)(3 4)"],
 ["σ₂","Плоскость через N₁ и F₃","1 4 3 2","(1)(3)(2 4)"],
 ["σ₃","Плоскость через N₁ и F₄","1 3 2 4","(1)(4)(2 3)"]
];
for(const [name,meaning,mapping,cycles] of operations){
  const row = byId("perm").insertRow();
  row.insertCell().innerHTML = name+"<small>"+meaning+"</small>";
  row.insertCell().innerHTML = '<span class="matrix">1 2 3 4\n'+mapping+'</span>';
  row.insertCell().textContent = cycles;
}
const cues=[
 [0,"Команда и цель","Наш титульный лист с именами участников."],
 [20,"Геометрия и нумерация","На рисунке 1 (стр. 4) я показываю ось z и атомы 1–4."],
 [50,"Симметрии и циклы","На своём рукописном листе я показываю два поворота и три отражения."],
 [100,"Свойства молекулы","На стр. 12–13 я показываю направление диполя, зеркальную плоскость и разложение 2A₁ + 2E."]
];
const formatTime=s=>String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
let elapsed=0, origin=0, ticking=null;
function renderCue(){
  const s=Math.min(130,Math.floor(elapsed));
  const i=cues.reduce((n,c,j)=>s>=c[0]?j:n,0);
  byId("clock").textContent=formatTime(s)+" / 02:10";
  const buttons=Array.from(byId("segments").children);
  if(buttons[i].getAttribute("aria-pressed")!=="true"){
    buttons.forEach((b,j)=>b.setAttribute("aria-pressed",String(j===i)));
    byId("cue-title").textContent=cues[i][1];
    byId("cue-screen").textContent=cues[i][2];
    byId("cue-text").textContent=speech[i];
  }
  byId("play").textContent=ticking!==null?"Пауза":s>=130?"Повторить":elapsed>0?"Продолжить":"Начать репетицию";
}
function pauseTimer(){if(ticking!==null){elapsed=Math.min(130,(performance.now()-origin)/1000);clearInterval(ticking);ticking=null;renderCue();}}
for(const [i,[s,title]] of cues.entries()){
  const b=document.createElement("button");
  b.innerHTML="<small>Видео · "+formatTime(s)+"–"+formatTime(cues[i+1]?.[0]??130)+"</small>"+title;
  b.onclick=()=>{pauseTimer();elapsed=s;renderCue();};byId("segments").append(b);
}
byId("play").onclick=()=>{
  if(ticking!==null){pauseTimer();return;}
  if(elapsed>=130)elapsed=0;
  origin=performance.now()-elapsed*1000;
  ticking=setInterval(()=>{elapsed=Math.min(130,(performance.now()-origin)/1000);if(elapsed>=130)pauseTimer();else renderCue();},180);
  renderCue();
};
byId("reset").onclick=()=>{pauseTimer();elapsed=0;renderCue();};
const titles=["Титульный лист","Содержание","Введение и геометрия","Точечная группа","Операции и перестановки","Таблица Кэли","Аксиомы группы","Подгруппы","Классы сопряжённости","Изоморфизм","Визуализация","Свойства молекулы","Колебания и спектры","Заключение и литература","Вклад участников","Использование ИИ","Приложение А · таблица Кэли","Приложение Б · перестановки","Приложение В · материалы"];
const select=byId("pages");
titles.forEach((t,i)=>select.add(new Option((i+1)+". "+t,i+1)));
function showPage(n){
  if(n<1||n>titles.length)return;
  byId("reader-model").hidden = n !== 11;
  select.value=n;byId("pdfpage").src="assets/pages/"+n+".webp";
  byId("pdfpage").alt="Страница "+n+". "+titles[n-1];
  byId("accessible-page").textContent=pageText[n-1];
  byId("prev").disabled=n===1;byId("next").disabled=n===titles.length;
}
select.onchange=()=>showPage(Number(select.value));
byId("prev").onclick=()=>showPage(Number(select.value)-1);
byId("next").onclick=()=>showPage(Number(select.value)+1);
showPage(1);renderCue();window.addEventListener("hashchange",route);route();
