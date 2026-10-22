import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
document.addEventListener("DOMContentLoaded",async()=>{
 const container=document.getElementById("home-services"); if(!container)return;
 let services=null;
 if(window.SAHAJ_FIREBASE_READY){
  try{
   const app=getApps().length?getApps()[0]:initializeApp(window.SAHAJ_CONFIG.firebase);
   const db=getFirestore(app);
   const snap=await getDocs(query(collection(db,"services"),where("published","==",true)));
   services=snap.docs.map(d=>({id:d.id,...d.data()}));
  }catch(e){console.warn("Firebase services unavailable; using page defaults.",e);}
 }
 if(!Array.isArray(services)){
  try{const saved=JSON.parse(localStorage.getItem("sahajServices")||"null");if(Array.isArray(saved))services=saved;}catch(e){}
 }
 if(!Array.isArray(services))return;
 const visible=services.filter(s=>s.published!==false).slice(0,4);
 const esc=v=>String(v||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 container.innerHTML=visible.map((s,i)=>`<article class="service-card"><div class="service-icon ${["blue","violet","green","orange"][i%4]}">${esc(s.icon||"📄")}</div><h3>${esc(s.name)}</h3><p>${esc(s.description)}</p><div class="service-card-bottom"><span class="price">${esc(s.price||"Ask for fee")}</span><a data-service-whatsapp="${esc(s.name)}" href="#">Enquire ↗</a></div></article>`).join("");
 const digits=(window.SAHAJ_CONFIG.whatsappNumber||"").replace(/\D/g,"");
 container.querySelectorAll("[data-service-whatsapp]").forEach(a=>{a.href=`https://wa.me/${digits}?text=${encodeURIComponent(`Namaste, mujhe ${a.dataset.serviceWhatsapp} ke baare mein details aur fees chahiye.`)}`;a.target="_blank";a.rel="noopener";});
});
