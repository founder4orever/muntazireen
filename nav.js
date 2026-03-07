// ═══════════════════════════════════════════════════════════
//  MUNTAZIREEN — SHARED NAV
//  Include this script on every page. It injects the nav,
//  handles auth state, and manages dropdowns.
// ═══════════════════════════════════════════════════════════

(function(){

const SUPABASE_URL='https://ulsbuqsjsssqflydwylm.supabase.co';
const SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsc2J1cXNqc3NzcWZseWR3eWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2OTAxNTYsImV4cCI6MjA4ODI2NjE1Nn0.EIJVQBN9bkufyroUDE1Va8zExBKbEH9CegBOIGauRfs';

// Inject styles
const style=document.createElement('style');
style.textContent=`
/* ── NAV RESET ── */
#mt-nav *{box-sizing:border-box;margin:0;padding:0;}
#mt-nav{
  position:fixed;top:0;left:0;right:0;z-index:1000;
  background:rgba(8,8,7,0.97);backdrop-filter:blur(12px);
  border-bottom:1px solid #272521;
  font-family:'Courier Prime','Courier New',monospace;
  height:60px;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 40px;
  user-select:none;
}
#mt-nav .n-logo{
  font-size:13px;letter-spacing:0.3em;text-transform:uppercase;
  color:#b8963c;text-decoration:none;flex-shrink:0;
  display:flex;flex-direction:column;
}
#mt-nav .n-logo span{
  font-size:9px;color:#6b6558;letter-spacing:0.15em;margin-top:1px;
}
#mt-nav .n-links{
  display:flex;align-items:center;gap:4px;list-style:none;
}
/* Top-level nav item */
#mt-nav .n-item{position:relative;}
#mt-nav .n-link{
  display:flex;align-items:center;gap:5px;
  font-size:10px;letter-spacing:0.18em;text-transform:uppercase;
  color:#6b6558;text-decoration:none;
  padding:8px 14px;
  transition:color 0.25s;
  cursor:pointer;
  background:none;border:none;
  white-space:nowrap;
}
#mt-nav .n-link:hover,
#mt-nav .n-link.open{color:#e8dfc8;}
#mt-nav .n-link.active{color:#b8963c;}
#mt-nav .n-caret{
  font-size:8px;opacity:0.5;
  transition:transform 0.2s;
  display:inline-block;
}
#mt-nav .n-link.open .n-caret{transform:rotate(180deg);}

/* Dropdown */
#mt-nav .n-drop{
  display:none;
  position:absolute;top:calc(100% + 1px);left:0;
  background:#0e0d0b;
  border:1px solid #272521;
  border-top:2px solid #b8963c;
  min-width:180px;
  z-index:1001;
}
#mt-nav .n-item.open .n-drop{display:block;}
#mt-nav .n-drop-link{
  display:block;
  font-size:9px;letter-spacing:0.2em;text-transform:uppercase;
  color:#6b6558;text-decoration:none;
  padding:13px 18px;
  border-bottom:1px solid #1a1916;
  transition:all 0.2s;
  white-space:nowrap;
}
#mt-nav .n-drop-link:last-child{border-bottom:none;}
#mt-nav .n-drop-link:hover{color:#e8dfc8;background:#141310;padding-left:22px;}
#mt-nav .n-drop-link.danger{color:#8b3030;}
#mt-nav .n-drop-link.danger:hover{color:#c04040;background:#141310;}
#mt-nav .n-drop-divider{
  height:1px;background:#1a1916;margin:0;
}

/* Account button — right side */
#mt-nav .n-account-wrap{flex-shrink:0;}
#mt-nav .n-account-btn{
  font-size:9px;letter-spacing:0.2em;text-transform:uppercase;
  color:#b8963c;background:none;
  border:1px solid #6b5520;
  padding:7px 16px;cursor:pointer;
  transition:all 0.3s;
  display:flex;align-items:center;gap:6px;
}
#mt-nav .n-account-btn:hover{background:rgba(184,150,60,0.08);border-color:#b8963c;}

/* Mobile */
#mt-nav .n-hamburger{
  display:none;flex-direction:column;gap:5px;cursor:pointer;
  background:none;border:none;padding:4px;
}
#mt-nav .n-hamburger span{
  display:block;width:22px;height:1px;background:#6b6558;transition:all 0.3s;
}
#mt-nav .n-mobile-menu{
  display:none;position:fixed;top:60px;left:0;right:0;
  height:calc(100vh - 60px);min-height:300px;
  background:rgba(8,8,7,0.98);z-index:1002;
  flex-direction:column;overflow-y:auto;
  border-top:1px solid #272521;
}
#mt-nav .n-mobile-menu.open{display:flex;}
#mt-nav .n-mobile-section{border-bottom:1px solid #1a1916;}
#mt-nav .n-mobile-head{
  font-size:9px;letter-spacing:0.25em;text-transform:uppercase;
  color:#4a463e;padding:14px 24px 8px;
}
#mt-nav .n-mobile-link{
  display:block;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;
  color:#9a9184;text-decoration:none;padding:13px 24px;
  border-bottom:1px solid #141310;transition:color 0.2s;
}
#mt-nav .n-mobile-link:hover{color:#e8dfc8;}
#mt-nav .n-mobile-link.danger{color:#8b3030;}

@media(max-width:800px){
  #mt-nav{padding:0 20px;}
  #mt-nav .n-links,#mt-nav .n-account-wrap{display:none;}
  #mt-nav .n-hamburger{display:flex;}
}
`;
document.head.appendChild(style);

// Inject nav HTML
const nav=document.createElement('nav');
nav.id='mt-nav';
nav.innerHTML=`
  <a href="index.html" class="n-logo">MUNTAZIREEN<span>منتظرين — Those who wait, watch, and prepare.</span></a>

  <ul class="n-links">
    <li class="n-item" id="nav-news">
      <button class="n-link" onclick="mtNavToggle('nav-news')">News <span class="n-caret">▾</span></button>
      <div class="n-drop">
        <a class="n-drop-link" href="developments.html">Stay Updated</a>
        <a class="n-drop-link" href="signs.html">Signs</a>
      </div>
    </li>
    <li class="n-item" id="nav-protocol">
      <a class="n-link" href="tracker.html">Tracker</a>
    </li>
    <li class="n-item">
      <a class="n-link" href="mission.html">Mission</a>
    </li>
  </ul>

  <div class="n-account-wrap">
    <div class="n-item" id="nav-account" style="position:relative;">
      <button class="n-account-btn" onclick="mtNavToggle('nav-account')" id="nav-acct-btn">
        <span id="nav-acct-label">Account</span> <span class="n-caret">▾</span>
      </button>
      <div class="n-drop" style="right:0;left:auto;" id="nav-account-drop">
        <!-- populated by auth state -->
      </div>
    </div>
  </div>

  <!-- Mobile hamburger -->
  <button class="n-hamburger" id="nav-hamburger" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
  <div class="n-mobile-menu" id="nav-mobile-menu"></div>
`;
document.body.insertBefore(nav, document.body.firstChild);

// Ensure body has top padding for fixed nav
document.body.style.paddingTop = document.body.style.paddingTop || '60px';

// Close dropdowns on outside click
document.addEventListener('click', function(e){
  if(!e.target.closest('#mt-nav')) mtNavCloseAll();
});

window.mtNavCloseAll = function(){
  document.querySelectorAll('#mt-nav .n-item.open').forEach(el=>{
    el.classList.remove('open');
    const btn=el.querySelector('.n-link,.n-account-btn');
    if(btn)btn.classList.remove('open');
  });
};

window.mtNavToggle = function(id){
  const item=document.getElementById(id);
  if(!item)return;
  const wasOpen=item.classList.contains('open');
  mtNavCloseAll();
  if(!wasOpen){
    item.classList.add('open');
    const btn=item.querySelector('.n-link,.n-account-btn');
    if(btn)btn.classList.add('open');
  }
};

window.mtNavMobile = function(){
  const menu=document.getElementById('nav-mobile-menu');
  if(!menu.innerHTML.trim()) buildMobileMenu(null);
  menu.classList.toggle('open');
};

// Attach hamburger listener after DOM injection
document.addEventListener('DOMContentLoaded', function(){
  const btn = document.getElementById('nav-hamburger');
  if(btn) btn.addEventListener('click', window.mtNavMobile);
});

// Mark active page
function markActive(){
  const page=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('#mt-nav .n-drop-link, #mt-nav .n-link').forEach(a=>{
    if(a.getAttribute('href')===page) a.classList.add('active');
  });
}
markActive();

// Auth-aware nav population
function buildAccountDrop(user){
  const drop=document.getElementById('nav-account-drop');
  if(user){
    drop.innerHTML=`
      <a class="n-drop-link" href="settings.html">Settings</a>
      <a class="n-drop-link" href="tracker.html#account">Change Username</a>
      <a class="n-drop-link" href="tracker.html#account">Weaponry Preferences</a>
      <div class="n-drop-divider"></div>
      <a class="n-drop-link danger" href="#" onclick="mtNavSignOut();return false;">Sign Out</a>
    `;
  } else {
    drop.innerHTML=`
      <a class="n-drop-link" href="tracker.html">Sign In</a>
      <a class="n-drop-link" href="tracker.html">Join Muntazireen</a>
    `;
  }
}

function buildMobileMenu(user){
  const menu=document.getElementById('nav-mobile-menu');
  const authedProtocol = `<a class="n-mobile-link" href="tracker.html">Tracker</a>`;

  const accountLinks = user ? `
    <a class="n-mobile-link" href="settings.html">Settings</a>
    <a class="n-mobile-link danger" href="#" onclick="mtNavSignOut();return false;">Sign Out</a>
  ` : `
    <a class="n-mobile-link" href="tracker.html">Sign In</a>
    <a class="n-mobile-link" href="tracker.html">Join</a>
  `;

  menu.innerHTML=`
    <div class="n-mobile-section">
      <div class="n-mobile-head">News</div>
      <a class="n-mobile-link" href="developments.html">Stay Updated</a>
      <a class="n-mobile-link" href="signs.html">Signs</a>
    </div>
    <div class="n-mobile-section">
      <div class="n-mobile-head">Protocol</div>
      ${authedProtocol}
    </div>
    <div class="n-mobile-section">
      <a class="n-mobile-link" href="mission.html">Mission</a>
    </div>
    <div class="n-mobile-section">
      <div class="n-mobile-head">Account</div>
      ${accountLinks}
    </div>
  `;
}

window.mtNavSignOut = async function(){
  if(window._mtSb){
    await window._mtSb.auth.signOut();
    location.href='index.html';
  } else {
    location.href='index.html';
  }
};

// Init Supabase for nav only if not already initialized by page
function initNavAuth(){
  if(!window.supabase) return; // supabase SDK not loaded yet — will retry
  if(!window._mtSb){
    // Reuse tracker's client if it exists to avoid lock conflicts
    if(window._sbInstance) {
      window._mtSb = window._sbInstance;
    } else {
      window._mtSb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      window._sbInstance = window._mtSb;
    }
  }
  const sb=window._mtSb;

  sb.auth.getSession().then(({data:{session}})=>{
    const user=session&&session.user?session.user:null;
    buildAccountDrop(user);
    buildMobileMenu(user);
    // Protocol drop visible for all — no gate on nav level
    // Signs visible for all
  });

  sb.auth.onAuthStateChange((event,session)=>{
    const user=session&&session.user?session.user:null;
    buildAccountDrop(user);
    buildMobileMenu(user);
  });
}

// Wait for supabase SDK if needed
if(window.supabase){
  initNavAuth();
} else {
  window.addEventListener('load', initNavAuth);
}

})();
