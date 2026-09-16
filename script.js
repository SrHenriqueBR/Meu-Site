const root=document.documentElement;
const themeButton=document.querySelector(".theme-button");
const savedTheme=localStorage.getItem("theme");
if(savedTheme)root.dataset.theme=savedTheme;
else if(matchMedia("(prefers-color-scheme: light)").matches)root.dataset.theme="light";

themeButton.addEventListener("click",()=>{
  const next=root.dataset.theme==="light"?"dark":"light";
  root.dataset.theme=next;
  localStorage.setItem("theme",next);
});

const menuButton=document.querySelector(".menu-button");
const navLinks=document.querySelector(".nav-links");
menuButton.addEventListener("click",()=>{
  const open=navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded",open);
  menuButton.setAttribute("aria-label",open?"Fechar menu":"Abrir menu");
});
document.querySelectorAll(".nav-links a").forEach(link=>link.addEventListener("click",()=>{
  navLinks.classList.remove("open");
  menuButton.setAttribute("aria-expanded","false");
}));

addEventListener("scroll",()=>document.querySelector(".header").classList.toggle("scrolled",scrollY>20));

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}});
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(item=>observer.observe(item));

const roles=["Analista de Suporte e Infraestrutura","Desenvolvedor Web","Especialista em Power BI","Apaixonado por Tecnologia"];
const typing=document.querySelector("#typing-text");
let role=0,char=roles[0].length,deleting=true;
function typeRole(){
  const word=roles[role];
  if(deleting){char--;typing.textContent=word.slice(0,char)}
  else{char++;typing.textContent=word.slice(0,char)}
  let delay=deleting?35:65;
  if(!deleting&&char===word.length){delay=1700;deleting=true}
  if(deleting&&char===0){deleting=false;role=(role+1)%roles.length;delay=350}
  setTimeout(typeRole,delay);
}
setTimeout(typeRole,1800);
document.querySelector("#year").textContent=new Date().getFullYear();
addEventListener("DOMContentLoaded",()=>lucide.createIcons());
