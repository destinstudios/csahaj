import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const $=id=>document.getElementById(id);
const allowedEmail=(window.SAHAJ_CONFIG.adminEmail||"").toLowerCase();
const defaults=[
{id:"online-form",name:"Online Form Filling",description:"Online form bharne mein sahayata.",price:"₹100",category:"forms",icon:"📄",published:true},
{id:"scholarship",name:"Scholarship Forms",description:"Scholarship applications mein assistance.",price:"Ask for fee",category:"forms",icon:"🎓",published:true},
{id:"pan-card",name:"PAN Card Assistance",description:"PAN application process ke liye guidance.",price:"Ask for fee",category:"documents",icon:"🪪",published:true},
{id:"certificates",name:"Income / Caste / Residence Certificate",description:"Certificate applications ke liye guidance.",price:"Ask for fee",category:"documents",icon:"📑",published:true},
{id:"bill-payment",name:"Bill Payment Assistance",description:"Available bill payment services ke liye enquiry.",price:"Ask for fee",category:"payments",icon:"💡",published:true},
{id:"printout",name:"Printout & Photocopy",description:"Documents ke printout aur photocopy.",price:"Ask for fee",category:"documents",icon:"🖨️",published:true},
{id:"schemes",name:"Government Scheme Assistance",description:"Available schemes ki information aur application guidance.",price:"Ask for fee",category:"forms",icon:"🏛️",published:true},
{id:"banking",name:"Banking / AEPS (if authorized)",description:"Only if centre has required authorization.",price:"Ask for fee",category:"payments",icon:"🏦",published:true}
];
let app=null,auth=null,db=null,currentUser=null,services=[],mode="firebase";
const categoryNames={forms:"Forms & Applications",documents:"Documents & Certificates",payments:"Payments & Other"};
function escapeHTML(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function setMessage(id,msg){$(id).textContent=msg;}
function configReady(){return Boolean(window.SAHAJ_FIREBASE_READY);}
function setStatus(text){$("connection-status").textContent=text;}
function showDashboard(show){$("dashboard").hidden=!show;$("login-panel").hidden=show;}
function showSetup(){
 mode="demo";setStatus("Demo mode");$("setup-notice").hidden=false;
 $("setup-notice").innerHTML="<strong>Firebase setup required:</strong> Add your Firebase web config in <code>js/config.js</code>, enable Email/Password Authentication, create Firestore, create the authorized owner user, and apply <code>firestore.rules</code>. Until then, sign-in and cloud syncing are disabled.";
 $("login-form").querySelector("button").disabled=true;
 $("login-form").querySelector("button").textContent="Configure Firebase to enable login";
 setMessage("login-message","This is a frontend template. It does not use a fake login.");
}
function initFirebase(){
 if(!configReady()){showSetup();return;}
 try{
  app=initializeApp(window.SAHAJ_CONFIG.firebase);auth=getAuth(app);db=getFirestore(app);mode="firebase";
  $("setup-notice").hidden=true;setStatus("Firebase configured");
  onAuthStateChanged(auth,async user=>{
   if(!user){currentUser=null;showDashboard(false);return;}
   if((user.email||"").toLowerCase()!==allowedEmail){await signOut(auth);setMessage("login-message","This email is not authorized for the owner panel.");return;}
   currentUser=user;showDashboard(true);$("admin-welcome").textContent=`Signed in as ${user.email}`;
   await loadServices();
  });
 }catch(err){setStatus("Setup error");setMessage("login-message","Firebase setup error. Check js/config.js and console.");console.error(err);}
}
async function loadServices(){
 try{
  const snap=await getDocs(query(collection(db,"services"),orderBy("name")));
  services=snap.docs.map(d=>({id:d.id,...d.data()}));
  if(!services.length){services=defaults.map(s=>({...s}));$("data-notice").textContent="No cloud services found yet. Starter services shown here are local examples; save them to add records to Firestore.";}
  renderTable();
 }catch(err){console.error(err);setMessage("editor-message","Could not load services. Check Firestore rules.");}
}
function renderTable(){
 $("total-count").textContent=services.length;
 $("published-count").textContent=services.filter(s=>s.published!==false).length;
 $("hidden-count").textContent=services.filter(s=>s.published===false).length;
 $("admin-services").innerHTML=services.map(s=>`<tr><td><strong>${escapeHTML(s.icon||"📄")} ${escapeHTML(s.name)}</strong><small>${escapeHTML(s.description||"")}</small></td><td>${escapeHTML(categoryNames[s.category]||s.category||"Other")}</td><td>${escapeHTML(s.price||"Ask for fee")}</td><td><span class="badge-status ${s.published===false?"hidden-status":""}">${s.published===false?"Hidden":"Published"}</span></td><td><div class="table-actions"><button class="small-btn" data-edit="${escapeHTML(s.id)}">Edit</button><button class="small-btn" data-toggle="${escapeHTML(s.id)}">${s.published===false?"Publish":"Hide"}</button><button class="small-btn danger" data-delete="${escapeHTML(s.id)}">Delete</button></div></td></tr>`).join("");
 $("admin-services").querySelectorAll("[data-edit]").forEach(b=>b.addEventListener("click",()=>openEditor(services.find(s=>s.id===b.dataset.edit))));
 $("admin-services").querySelectorAll("[data-toggle]").forEach(b=>b.addEventListener("click",()=>togglePublished(b.dataset.toggle)));
 $("admin-services").querySelectorAll("[data-delete]").forEach(b=>b.addEventListener("click",()=>removeService(b.dataset.delete)));
}
function openEditor(s=null){
 $("service-editor").hidden=false;$("editor-title").textContent=s?"Edit service":"Add a service";$("service-id").value=s?.id||"";
 $("service-name").value=s?.name||"";$("service-price").value=s?.price||"";$("service-category-input").value=s?.category||"forms";
 $("service-icon").value=s?.icon||"📄";$("service-description").value=s?.description||"";$("service-published").checked=s?.published!==false;
 setMessage("editor-message","");$("service-editor").scrollIntoView({behavior:"smooth",block:"start"});
}
function closeEditor(){$("service-editor").hidden=true;}
async function saveService(event){
 event.preventDefault();if(!currentUser||!db){setMessage("editor-message","Please sign in after Firebase setup.");return;}
 const id=$("service-id").value;
 const data={name:$("service-name").value.trim(),price:$("service-price").value.trim()||"Ask for fee",category:$("service-category-input").value,icon:$("service-icon").value.trim()||"📄",description:$("service-description").value.trim(),published:$("service-published").checked,updatedAt:serverTimestamp()};
 if(!data.name||!data.description){setMessage("editor-message","Name and description are required.");return;}
 
await currentUser.reload();
await currentUser.getIdToken(true);

console.log("Admin email:", currentUser.email);
console.log("Email verified:", currentUser.emailVerified);
console.log("Firebase project:", window.SAHAJ_CONFIG.firebase.projectId);
 
 try{
  if(id){await updateDoc(doc(db,"services",id),data);}else{data.createdAt=serverTimestamp();await addDoc(collection(db,"services"),data);}
  await loadServices();closeEditor();setMessage("editor-message","Saved to Firebase.");
 }catch(err){console.error(err);setMessage("editor-message","Save failed. Check Firestore rules and admin permissions.");}
}
async function togglePublished(id){
 if(!currentUser||!db)return;const s=services.find(x=>x.id===id);if(!s)return;
 try{await updateDoc(doc(db,"services",id),{published:s.published===false,updatedAt:serverTimestamp()});await loadServices();}
 catch(e){console.error(e);alert("Could not update service. Check Firestore rules.");}
}
async function removeService(id){
 if(!currentUser||!db)return;if(!confirm("Delete this service? This cannot be undone."))return;
 try{await deleteDoc(doc(db,"services",id));await loadServices();}catch(e){console.error(e);alert("Could not delete service. Check Firestore rules.");}
}
document.addEventListener("DOMContentLoaded",()=>{
 $("service-editor").addEventListener("submit",saveService);
 $("add-service-btn").addEventListener("click",()=>openEditor());
 $("close-editor").addEventListener("click",closeEditor);$("cancel-editor").addEventListener("click",closeEditor);
 $("logout-btn").addEventListener("click",()=>auth&&signOut(auth));
$("login-form").addEventListener("submit", async e => {
  e.preventDefault();

  if (!auth) {
    setMessage("login-message", "Firebase is not configured.");
    return;
  }

  const email = $("admin-email").value.trim().toLowerCase();

  if (email !== allowedEmail) {
    setMessage("login-message", "Please use the authorized owner email.");
    return;
  }

  try {
    const actionCodeSettings = {
      url: "https://destinstudios.github.io/csahaj/admin.html",
      handleCodeInApp: true
    };

    await sendSignInLinkToEmail(auth, email, actionCodeSettings);

    localStorage.setItem("emailForSignIn", email);
    setMessage(
      "login-message",
      "Login link email kar diya gaya hai. Inbox aur Spam check karo."
    );
  } catch (err) {
    console.error("Email link error:", err);
    setMessage(
      "login-message",
      "Link send nahi hua: " + err.message
    );
  }
});
  
if (configReady()) {
  initFirebase();

  if (isSignInWithEmailLink(auth, window.location.href)) {
    (async () => {
      let email = localStorage.getItem("emailForSignIn");

      // Agar link kisi doosre device/browser par khola hai
      if (!email) {
        email = window.prompt(
          "Login link jis email par aaya tha, woh email enter karo:"
        );
      }

      if (!email) {
        setMessage("login-message", "Email required hai.");
        return;
      }

      email = email.trim().toLowerCase();

      // Sirf owner account ko allow karo
      if (email !== allowedEmail) {
        setMessage("login-message", "Owner email match nahi karta.");
        return;
      }

      try {
        await signInWithEmailLink(auth, email, window.location.href);

        localStorage.removeItem("emailForSignIn");

        // URL se one-time sign-in code hata do
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        setMessage("login-message", "Login successful.");
      } catch (err) {
        console.error("Email link sign-in error:", err);
        setMessage(
          "login-message",
          "Login link invalid ya expire ho sakta hai. Naya link mangao."
        );
      }
    })();
  }
} else {
  showSetup();
}
