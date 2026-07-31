(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const E of document.querySelectorAll('link[rel="modulepreload"]'))A(E);new MutationObserver(E=>{for(const p of E)if(p.type==="childList")for(const m of p.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&A(m)}).observe(document,{childList:!0,subtree:!0});function f(E){const p={};return E.integrity&&(p.integrity=E.integrity),E.referrerPolicy&&(p.referrerPolicy=E.referrerPolicy),E.crossOrigin==="use-credentials"?p.credentials="include":E.crossOrigin==="anonymous"?p.credentials="omit":p.credentials="same-origin",p}function A(E){if(E.ep)return;E.ep=!0;const p=f(E);fetch(E.href,p)}})();const Ke=["재물운","건강운","학업운","인연운","가정운","수험합격","취업운","출산기도"],Ze={재물운:"wealth",건강운:"health",학업운:"academic",인연운:"love",가정운:"family",수험합격:"exam",취업운:"career",출산기도:"birth"},Ve={재물운:"geum",건강운:"mok",학업운:"su",인연운:"hwa",가정운:"to",수험합격:"su",취업운:"geum",출산기도:"mok"},Xe={geum:"金",mok:"木",su:"水",hwa:"火",to:"土"},et={재물운:'<circle cx="8" cy="16" r="5"/><circle cx="16" cy="8" r="5"/><path d="M8 16h.01M16 8h.01"/>',건강운:'<path d="M12 3c-3 3-6 6-6 10a6 6 0 0012 0c0-4-3-7-6-10z"/><path d="M12 8v9"/>',학업운:'<path d="M4 19l6-14 2 0 6 14"/><path d="M7 13h10"/><circle cx="18" cy="6" r="2"/>',인연운:'<path d="M8 8a4 4 0 108 0M8 16a4 4 0 108 0M9 9l6 6M15 9l-6 6"/>',가정운:'<path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/>',수험합격:'<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>',취업운:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="12"/>',출산기도:'<path d="M12 2a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4z"/><path d="M6 20v-1a6 6 0 0112 0v1"/><path d="M12 14v6"/>'},tt={목:"#3C6E5E",화:"#A23B2E",토:"#B8892B",금:"#8A8F98",수:"#2E4A6B"},it={북:0,동북:45,동:90,동남:135,남:180,남서:225,서:270,북서:315},ot=document.getElementById("app"),Ge="잼공가족2026",Je="jamgong-inyeonsachal-member";function _e(){return localStorage.getItem(Je)==="true"}function Re(e){return e.trim()===Ge?(localStorage.setItem(Je,"true"),!0):!1}const Qe={userLat:37.5665,userLng:126.978,locationLabel:"서울특별시청 (기본값)"};function Ne(){return new Promise(e=>{if(!("geolocation"in navigator)){e(Qe);return}navigator.geolocation.getCurrentPosition(a=>{e({userLat:a.coords.latitude,userLng:a.coords.longitude,locationLabel:"현재 위치 감지됨"})},()=>e(Qe),{timeout:5e3,maximumAge:3e5})})}function nt(){var m,$;ot.innerHTML=`
    <section class="hero">
      <div class="hero-stars">
        <span class="star" style="top:14%; left:9%;"></span>
        <span class="star" style="top:22%; left:80%;"></span>
        <span class="star" style="top:7%;  left:54%;"></span>
        <span class="star" style="top:38%; left:18%;"></span>
        <span class="star" style="top:18%; left:91%;"></span>
      </div>
      <svg class="hero-moon" viewBox="0 0 120 120" width="52" height="52">
        <defs>
          <filter id="moonHalo" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <radialGradient id="moonBody" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#FBF0D2"/>
            <stop offset="60%" stop-color="#E2BA6C"/>
            <stop offset="100%" stop-color="#B8892B"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="30" fill="#E2BA6C" filter="url(#moonHalo)" opacity="0.55"/>
        <circle cx="60" cy="60" r="24" fill="url(#moonBody)"/>
      </svg>
      <div class="hero-content">
        <div class="hero-seal">
          <svg class="logo-orrery" viewBox="0 0 100 100" width="180" height="180">
            <defs>
              <radialGradient id="starCore" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#FFFFFF"/>
                <stop offset="40%" stop-color="#00D2FF"/>
                <stop offset="100%" stop-color="rgba(0,210,255,0)"/>
              </radialGradient>
              <filter id="coreGlow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="orbitGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5"/>
              </filter>
            </defs>

            <!-- 최외각 점선 가이드링 -->
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(0,210,255,0.1)" stroke-width="0.5" stroke-dasharray="2 4"/>

            <!-- 궤도 1: 기울어진 타원 (가장 바깥) -->
            <g class="orbit-1">
              <ellipse cx="50" cy="50" rx="42" ry="14" fill="none" stroke="rgba(0,210,255,0.35)" stroke-width="0.8" transform="rotate(-30 50 50)"/>
              <circle class="planet-1" cx="92" cy="50" r="3" fill="#00D2FF" filter="url(#coreGlow)" opacity="0.9" transform="rotate(-30 50 50)"/>
            </g>

            <!-- 궤도 2: 반대 방향 타원 -->
            <g class="orbit-2">
              <ellipse cx="50" cy="50" rx="34" ry="11" fill="none" stroke="rgba(107,130,249,0.4)" stroke-width="0.8" transform="rotate(40 50 50)"/>
              <circle class="planet-2" cx="84" cy="50" r="2.5" fill="#6B82F9" filter="url(#coreGlow)" opacity="0.9" transform="rotate(40 50 50)"/>
            </g>

            <!-- 궤도 3: 수직에 가까운 타원 -->
            <g class="orbit-3">
              <ellipse cx="50" cy="50" rx="24" ry="8" fill="none" stroke="rgba(0,242,254,0.3)" stroke-width="0.7" transform="rotate(80 50 50)"/>
              <circle class="planet-3" cx="74" cy="50" r="2" fill="#00F2FE" filter="url(#coreGlow)" opacity="0.85" transform="rotate(80 50 50)"/>
            </g>

            <!-- 중앙 별 코어 -->
            <circle cx="50" cy="50" r="10" fill="url(#starCore)" opacity="0.3"/>
            <circle cx="50" cy="50" r="5" fill="rgba(0,210,255,0.9)" filter="url(#coreGlow)"/>
            <circle cx="50" cy="50" r="3" fill="#FFFFFF" opacity="0.95"/>

            <!-- 십자 광선 -->
            <line x1="50" y1="43" x2="50" y2="57" stroke="rgba(255,255,255,0.6)" stroke-width="0.8"/>
            <line x1="43" y1="50" x2="57" y2="50" stroke="rgba(255,255,255,0.6)" stroke-width="0.8"/>
            <line x1="45" y1="45" x2="55" y2="55" stroke="rgba(255,255,255,0.3)" stroke-width="0.6"/>
            <line x1="55" y1="45" x2="45" y2="55" stroke="rgba(255,255,255,0.3)" stroke-width="0.6"/>
          </svg>
        </div>
        <div class="eyebrow">잼공인연사찰</div>
        <div class="hero-divider"><span></span><span class="hero-divider-dot"></span><span></span></div>
        <div class="eyebrow-en">Premium Saju Temple Fortune Service</div>
        <h1>나와 <em class="hero-accent">인연</em>이 닿는<br/>절을 찾아드립니다</h1>
        <p>생년월일시의 오행 기운을 바탕으로,<br>지금 이 순간 당신에게 필요한 사찰을 안내합니다.</p>
      </div>
      <!-- 안개 낀 다층 산 능선 (원경→근경 순서로 겹쳐 깊이감 연출, 블러로 대기감 표현) -->
      <svg class="hero-mountains" viewBox="0 0 400 130" preserveAspectRatio="none">
        <defs>
          <filter id="fogBlurFar" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4.5" />
          </filter>
          <filter id="fogBlurMid" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          <filter id="fogBlurNear" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" />
          </filter>
          <linearGradient id="mtFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#4A6284"/>
            <stop offset="100%" stop-color="#2E4162"/>
          </linearGradient>
          <linearGradient id="mtMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#324867"/>
            <stop offset="100%" stop-color="#1B2A41"/>
          </linearGradient>
          <linearGradient id="mtNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#182538"/>
            <stop offset="100%" stop-color="#0C1522"/>
          </linearGradient>
        </defs>
        <path filter="url(#fogBlurFar)" d="M0 130 L0 68 Q50 52 100 66 Q150 46 200 63 Q250 44 300 60 Q350 50 400 58 L400 130 Z" fill="url(#mtFar)" opacity="0.5"/>
        <path filter="url(#fogBlurMid)" d="M0 130 L0 86 Q60 70 120 84 Q170 65 230 81 Q290 63 340 79 Q370 72 400 76 L400 130 Z" fill="url(#mtMid)" opacity="0.7"/>
        <path filter="url(#fogBlurNear)" d="M0 130 L0 104 Q70 90 140 101 Q200 86 260 99 Q320 88 400 95 L400 130 Z" fill="url(#mtNear)" opacity="0.92"/>
      </svg>
      <!-- 사찰 전각 실루엣: 처마 곡선이 있는 2층 대웅전 + 좌우 탑 -->
      <svg class="hero-skyline" viewBox="0 0 400 90" preserveAspectRatio="none">
        <!-- 원경 산 능선 (은은하게) -->
        <path d="M0 90 L0 55 Q40 42 80 52 Q130 38 180 50 Q230 36 280 48 Q330 40 400 50 L400 90 Z"
              fill="#0C1522" opacity="0.55"/>
        <!-- 좌측 작은 탑 -->
        <path d="M55 90 L55 60 L58 60 L58 55 L61 55 L61 50 L64 50 L64 45 L67 50 L70 50 L70 55 L73 55 L73 60 L76 60 L76 90 Z"
              fill="#0C1522"/>
        <!-- 우측 작은 탑 -->
        <path d="M324 90 L324 60 L327 60 L327 55 L330 55 L330 50 L333 50 L333 45 L336 50 L339 50 L339 55 L342 55 L342 60 L345 60 L345 90 Z"
              fill="#0C1522"/>
        <!-- 중앙 대웅전: 처마가 양끝으로 솟은 2층 지붕 -->
        <path d="M120 90 L120 68
                 Q120 66 122 66 L138 66 L138 58
                 Q100 56 95 44 Q98 52 138 50 L138 44 L262 44 L262 50
                 Q302 52 305 44 Q300 56 262 58 L262 66 L278 66
                 Q280 66 280 68 L280 90 Z"
              fill="#101B2C"/>
        <!-- 처마 끝 살짝 들린 디테일 -->
        <path d="M95 44 Q92 40 88 42 Q90 44 95 44 Z M305 44 Q308 40 312 42 Q310 44 305 44 Z"
              fill="#101B2C"/>
        <!-- 문 -->
        <rect x="192" y="72" width="16" height="18" fill="#0C1522"/>
      </svg>
    </section>
    <div class="dancheong-divider">
      <svg viewBox="0 0 60 16" class="lotus-mini">
        <path d="M30 14 C24 14 20 10 20 6 C24 6 28 9 30 13 C32 9 36 6 40 6 C40 10 36 14 30 14 Z"
              fill="none" stroke="#B8892B" stroke-width="1"/>
      </svg>
    </div>

    <div class="trust-bar">
      <div class="trust-item">
        <div class="trust-icon">🏯</div>
        <div class="trust-number">1,905<span>곳</span></div>
        <div class="trust-label">전국 사찰 데이터</div>
      </div>
      <div class="trust-divider"></div>
      <div class="trust-item">
        <div class="trust-icon">📜</div>
        <div class="trust-number">1,500<span>건</span></div>
        <div class="trust-label">유래·연혁 검증완료</div>
      </div>
      <div class="trust-divider"></div>
      <div class="trust-item">
        <div class="trust-icon">🔮</div>
        <div class="trust-number">200<span>년</span></div>
        <div class="trust-label">만세력 사주 데이터</div>
      </div>
    </div>

    <!-- ── 사찰 이름 검색 ── -->
    <div id="temple-search-wrap" style="margin:0 0 18px 0;background:rgba(255,255,255,0.03);border:1.5px solid rgba(255,255,255,0.08);border-radius:18px;padding:14px 16px;">
      <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);letter-spacing:.1em;margin-bottom:10px;">🔍 지역 선택 후 사찰 검색</div>
      <div style="display:flex;gap:8px;">
        <div id="region-dropdown" style="position:relative;flex:0 0 auto;">
          <button id="region-btn" type="button" style="background:linear-gradient(135deg,rgba(0,95,163,0.5),rgba(0,60,100,0.6));border:1.5px solid rgba(0,180,216,0.5);border-radius:12px;color:#7DD3FC;font-size:13px;font-weight:700;padding:11px 13px;cursor:pointer;outline:none;white-space:nowrap;display:flex;align-items:center;gap:6px;box-shadow:0 0 10px rgba(0,180,216,0.15);">
            <span id="region-label">📍 전체 지역</span><span style="font-size:10px;opacity:0.7;">▼</span>
          </button>
          <div id="region-list" style="display:none;position:absolute;top:calc(100% + 6px);left:0;min-width:130px;background:#0d1f35;border:1.5px solid rgba(0,180,216,0.4);border-radius:14px;overflow:hidden;z-index:200;box-shadow:0 8px 32px rgba(0,0,0,0.7);">
            <div class="rg-item" data-val="" style="padding:10px 16px;font-size:13px;color:#7DD3FC;cursor:pointer;transition:background .12s;border-bottom:1px solid rgba(255,255,255,0.05);">📍 전체 지역</div>
            <div class="rg-item" data-val="서울" style="padding:10px 16px;font-size:13px;color:#e2e8f0;cursor:pointer;transition:background .12s;">서울</div>
            <div class="rg-item" data-val="경기" style="padding:10px 16px;font-size:13px;color:#e2e8f0;cursor:pointer;transition:background .12s;">경기</div>
            <div class="rg-item" data-val="인천" style="padding:10px 16px;font-size:13px;color:#e2e8f0;cursor:pointer;transition:background .12s;">인천</div>
            <div class="rg-item" data-val="강원" style="padding:10px 16px;font-size:13px;color:#e2e8f0;cursor:pointer;transition:background .12s;">강원</div>
            <div class="rg-item" data-val="충북" style="padding:10px 16px;font-size:13px;color:#e2e8f0;cursor:pointer;transition:background .12s;">충북</div>
            <div class="rg-item" data-val="충남" style="padding:10px 16px;font-size:13px;color:#e2e8f0;cursor:pointer;transition:background .12s;">충남</div>
            <div class="rg-item" data-val="대전" style="padding:10px 16px;font-size:13px;color:#e2e8f0;cursor:pointer;transition:background .12s;">대전</div>
            <div class="rg-item" data-val="세종" style="padding:10px 16px;font-size:13px;color:#e2e8f0;cursor:pointer;transition:background .12s;">세종</div>
            <div class="rg-item" data-val="전북" style="padding:10px 16px;font-size:13px;color:#e2e8f0;cursor:pointer;transition:background .12s;">전북</div>
            <div class="rg-item" data-val="전남" style="padding:10px 16px;font-size:13px;color:#e2e8f0;cursor:pointer;transition:background .12s;">전남</div>
            <div class="rg-item" data-val="광주" style="padding:10px 16px;font-size:13px;color:#e2e8f0;cursor:pointer;transition:background .12s;">광주</div>
            <div class="rg-item" data-val="경북" style="padding:10px 16px;font-size:13px;color:#e2e8f0;cursor:pointer;transition:background .12s;">경북</div>
            <div class="rg-item" data-val="경남" style="padding:10px 16px;font-size:13px;color:#e2e8f0;cursor:pointer;transition:background .12s;">경남</div>
            <div class="rg-item" data-val="대구" style="padding:10px 16px;font-size:13px;color:#e2e8f0;cursor:pointer;transition:background .12s;">대구</div>
            <div class="rg-item" data-val="울산" style="padding:10px 16px;font-size:13px;color:#e2e8f0;cursor:pointer;transition:background .12s;">울산</div>
            <div class="rg-item" data-val="부산" style="padding:10px 16px;font-size:13px;color:#e2e8f0;cursor:pointer;transition:background .12s;">부산</div>
            <div class="rg-item" data-val="제주" style="padding:10px 16px;font-size:13px;color:#e2e8f0;cursor:pointer;transition:background .12s;">제주</div>
          </div>
        </div>
        <div style="position:relative;flex:1;">
          <div style="display:flex;align-items:center;gap:10px;background:rgba(0,0,0,0.3);border:1.5px solid rgba(0,180,216,0.4);border-radius:12px;padding:11px 14px;box-shadow:inset 0 1px 4px rgba(0,0,0,0.3);">
            <span style="font-size:15px;color:rgba(0,210,255,0.7);">🔍</span>
            <input id="temple-search-input" type="text" placeholder="사찰 이름 검색..." autocomplete="off"
              style="flex:1;background:none;border:none;outline:none;color:#fff;font-size:14px;font-family:inherit;" />
            <button id="temple-search-clear" type="button" style="display:none;background:none;border:none;color:rgba(255,255,255,0.4);font-size:16px;cursor:pointer;padding:0;">✕</button>
          </div>
          <div id="temple-search-results" style="display:none;position:absolute;top:calc(100% + 6px);left:0;right:0;background:#0d1f35;border:1.5px solid rgba(0,180,216,0.35);border-radius:14px;overflow:hidden;z-index:100;max-height:360px;overflow-y:auto;box-shadow:0 8px 32px rgba(0,0,0,0.7);"></div>
        </div>
      </div>
    </div>

    <form class="form-card" id="match-form">
      <svg class="corner-cloud tl" viewBox="0 0 40 40"><path d="M4 20 Q4 12 12 12 Q13 6 20 7 Q25 3 30 8 Q36 8 36 15" fill="none" stroke="#B8892B" stroke-width="1.3" stroke-linecap="round"/></svg>
      <svg class="corner-cloud tr" viewBox="0 0 40 40"><path d="M36 20 Q36 12 28 12 Q27 6 20 7 Q15 3 10 8 Q4 8 4 15" fill="none" stroke="#B8892B" stroke-width="1.3" stroke-linecap="round"/></svg>
      <svg class="corner-cloud bl" viewBox="0 0 40 40"><path d="M4 20 Q4 28 12 28 Q13 34 20 33 Q25 37 30 32 Q36 32 36 25" fill="none" stroke="#B8892B" stroke-width="1.3" stroke-linecap="round"/></svg>
      <svg class="corner-cloud br" viewBox="0 0 40 40"><path d="M36 20 Q36 28 28 28 Q27 34 20 33 Q15 37 10 32 Q4 32 4 25" fill="none" stroke="#B8892B" stroke-width="1.3" stroke-linecap="round"/></svg>

      <div class="mode-toggle-wrap">
        <button type="button" class="mode-toggle-btn active" data-mode="solo">🙏 인연사찰 찾기</button>
        <button type="button" class="mode-toggle-btn" data-mode="couple">💑 궁합</button>
        <button type="button" class="mode-toggle-btn" data-mode="saju">🔮 사주 보기</button>
        <button type="button" class="mode-toggle-btn" data-mode="dream">🌙 꿈해몽</button>
      </div>

      <div class="field">
        <label id="birth-label-a">생년월일시 <span class="help-tip" tabindex="0">?<span class="help-tip-bubble">사주 오행 계산의 기준이 되는 정보입니다. 시간을 모르셔도 괜찮습니다 — "시간 모름"을 선택하시면 정오 기준으로 계산됩니다.</span></span></label>
        <div class="birth-top-row">
          <div class="calendar-toggle">
            <button type="button" class="calendar-toggle-btn active" data-calendar="solar">양력</button>
            <button type="button" class="calendar-toggle-btn" data-calendar="lunar">음력</button>
          </div>
          <div class="gender-toggle">
            <button type="button" class="gender-btn active" data-gender="male">👨 남(男)</button>
            <button type="button" class="gender-btn" data-gender="female">👩 여(女)</button>
          </div>
        </div>
        <div class="birth-fields-row">
          <div class="birth-field">
            <span class="birth-field-label">연도</span>
            <select id="birth-year" aria-label="연도">
              <option value="">선택</option>
              ${Array.from({length:106},(n,t)=>2025-t).map(n=>`<option value="${n}">${n}년</option>`).join("")}
            </select>
          </div>
          <div class="birth-field">
            <span class="birth-field-label">월</span>
            <select id="birth-month" aria-label="월">
              <option value="">선택</option>
              ${Array.from({length:12},(n,t)=>t+1).map(n=>`<option value="${n}">${n}월</option>`).join("")}
            </select>
          </div>
          <div class="birth-field">
            <span class="birth-field-label">일</span>
            <select id="birth-day" aria-label="일">
              <option value="">선택</option>
              ${Array.from({length:31},(n,t)=>t+1).map(n=>`<option value="${n}">${n}일</option>`).join("")}
            </select>
          </div>
          <div class="birth-field">
            <span class="birth-field-label">시간</span>
            <select id="birth-hour" aria-label="시">
              <option value="">모름</option>
              ${Array.from({length:24},(n,t)=>t).map(n=>`<option value="${n}">${String(n).padStart(2,"0")}시</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="birth-fields-row birth-extra-row">
          <div class="birth-field">
            <span class="birth-field-label">분(分)</span>
            <input type="number" id="birth-minute" aria-label="분"
              min="0" max="59" value="0" placeholder="0"
              class="birth-minute-input" />
          </div>
          <div class="birth-field birth-field-city">
            <span class="birth-field-label">출생지</span>
            <select id="birth-city" aria-label="출생지">
              <option value="">선택 안함</option>
              <option value="126.978">서울</option>
              <option value="126.706">인천</option>
              <option value="127.009">수원·경기남부</option>
              <option value="126.852">고양·경기북부</option>
              <option value="127.135">성남·용인</option>
              <option value="127.034">의정부·동두천</option>
              <option value="127.385">대전</option>
              <option value="127.489">청주</option>
              <option value="127.143">전주</option>
              <option value="126.852">광주</option>
              <option value="126.529">제주</option>
              <option value="126.389">목포</option>
              <option value="127.662">여수</option>
              <option value="127.487">순천</option>
              <option value="128.601">대구</option>
              <option value="128.682">창원</option>
              <option value="129.075">부산</option>
              <option value="129.312">울산</option>
              <option value="129.343">포항</option>
              <option value="128.876">강릉</option>
              <option value="127.729">춘천</option>
              <option value="127.943">원주</option>
            </select>
            <span id="birth-lng-display" style="font-size:11px;color:rgba(0,210,255,0.6);margin-top:3px;display:block;text-align:center;letter-spacing:.04em;"></span>
          </div>
        </div>
        <label class="leap-month-check hidden" id="leap-month-wrap">
          <input type="checkbox" id="is-leap-month" /> 윤달(閏月) 생일입니다
        </label>
      </div>

      <div class="field hidden" id="birth-b-field" style="display:none">
        <label class="label-partner"><span class="label-badge-b">상대방</span> 생년월일시</label>
        <div class="birth-top-row">
          <div class="calendar-toggle calendar-toggle-b">
            <button type="button" class="calendar-toggle-btn active" data-calendar-b="solar">양력</button>
            <button type="button" class="calendar-toggle-btn" data-calendar-b="lunar">음력</button>
          </div>
          <div class="gender-toggle gender-toggle-b">
            <button type="button" class="gender-btn-b" data-gender-b="male">👨 남(男)</button>
            <button type="button" class="gender-btn-b active" data-gender-b="female">👩 여(女)</button>
          </div>
        </div>
        <div class="birth-fields-row">
          <div class="birth-field">
            <span class="birth-field-label">연도</span>
            <select id="birth-year-b" aria-label="상대방 연도">
              <option value="">선택</option>
              ${Array.from({length:106},(n,t)=>2025-t).map(n=>`<option value="${n}">${n}년</option>`).join("")}
            </select>
          </div>
          <div class="birth-field">
            <span class="birth-field-label">월</span>
            <select id="birth-month-b" aria-label="상대방 월">
              <option value="">선택</option>
              ${Array.from({length:12},(n,t)=>t+1).map(n=>`<option value="${n}">${n}월</option>`).join("")}
            </select>
          </div>
          <div class="birth-field">
            <span class="birth-field-label">일</span>
            <select id="birth-day-b" aria-label="상대방 일">
              <option value="">선택</option>
              ${Array.from({length:31},(n,t)=>t+1).map(n=>`<option value="${n}">${n}일</option>`).join("")}
            </select>
          </div>
          <div class="birth-field">
            <span class="birth-field-label">시간</span>
            <select id="birth-hour-b" aria-label="상대방 시">
              <option value="">모름</option>
              ${Array.from({length:24},(n,t)=>t).map(n=>`<option value="${n}">${String(n).padStart(2,"0")}시</option>`).join("")}
            </select>
          </div>
        </div>
      </div>

      <div class="field" id="purpose-field">
        <label>기도 목적 <span class="help-tip" tabindex="0">?<span class="help-tip-bubble">지금 가장 채우고 싶은 기운을 골라주세요. 사주상 부족한 오행과 함께 계산에 반영됩니다.</span></span></label>
        <div class="purpose-grid" id="purpose-grid">
          ${Ke.map((n,t)=>{const z=Ve[n]||"",w=Xe[z]||"";return`
            <div class="purpose-chip${t===0?" active":""}" data-purpose="${n}" data-ohaeng="${z}">
              <span class="purpose-ohaeng-mark">${w}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${et[n]}</svg>
              <span class="purpose-name">${n}</span>
              <span class="purpose-en">${Ze[n]}</span>
            </div>`}).join("")}
        </div>
      </div>

      <div class="field" id="location-field">
        <label>지역 · 거리 설정 <span class="help-tip" tabindex="0">?<span class="help-tip-bubble">시/도를 선택하면 해당 지역 사찰만 추천됩니다. 거리 제한을 설정하면 너무 먼 사찰은 제외됩니다.</span></span></label>
        <div class="region-filter-row">
          <select id="region-select" class="region-select">
            <option value="">🗺️ 전국 (지역 무관)</option>
            <option value="서울">서울</option>
            <option value="경기">경기</option>
            <option value="인천">인천</option>
            <option value="강원">강원</option>
            <option value="충북">충북</option>
            <option value="충남">충남</option>
            <option value="대전">대전</option>
            <option value="세종">세종</option>
            <option value="전북">전북</option>
            <option value="전남">전남</option>
            <option value="광주">광주</option>
            <option value="경북">경북</option>
            <option value="경남">경남</option>
            <option value="대구">대구</option>
            <option value="부산">부산</option>
            <option value="울산">울산</option>
            <option value="제주">제주</option>
          </select>
          <select id="distance-select" class="region-select distance-select">
            <option value="">📍 거리 무관</option>
            <option value="30">30km 이내</option>
            <option value="50">50km 이내</option>
            <option value="100">100km 이내</option>
            <option value="200">200km 이내</option>
          </select>
        </div>
      </div>

      <button type="submit" class="submit-btn" id="submit-btn">인연사찰 찾기</button>
    </form>

    <section class="results hidden" id="results"></section>
  `;let e=Ke[0];document.querySelectorAll(".purpose-chip").forEach(n=>{n.addEventListener("click",()=>{document.querySelectorAll(".purpose-chip").forEach(t=>t.classList.remove("active")),n.classList.add("active"),e=n.dataset.purpose})});let a="solar";document.querySelectorAll("[data-calendar]").forEach(n=>{n.addEventListener("click",()=>{document.querySelectorAll("[data-calendar]").forEach(t=>t.classList.remove("active")),n.classList.add("active"),a=n.dataset.calendar,document.getElementById("leap-month-wrap").classList.toggle("hidden",a!=="lunar")})}),(m=document.getElementById("birth-hour"))==null||m.addEventListener("change",n=>{const t=document.getElementById("birth-minute");t&&(t.disabled=n.target.value==="")}),($=document.getElementById("birth-city"))==null||$.addEventListener("change",n=>{const t=document.getElementById("birth-lng-display");t&&(t.textContent=n.target.value?"경도 "+n.target.value+"°":"")});let f="male";document.querySelectorAll(".gender-btn").forEach(n=>{n.addEventListener("click",()=>{document.querySelectorAll(".gender-btn").forEach(t=>t.classList.remove("active")),n.classList.add("active"),f=n.dataset.gender})});let A="solar";document.querySelectorAll("[data-calendar-b]").forEach(n=>{n.addEventListener("click",()=>{document.querySelectorAll("[data-calendar-b]").forEach(t=>t.classList.remove("active")),n.classList.add("active"),A=n.dataset.calendarB})});let E="female";document.querySelectorAll(".gender-btn-b").forEach(n=>{n.addEventListener("click",()=>{document.querySelectorAll(".gender-btn-b").forEach(t=>t.classList.remove("active")),n.classList.add("active"),E=n.dataset.genderB})});let p="solo";document.querySelectorAll(".mode-toggle-btn").forEach(n=>{n.addEventListener("click",()=>{document.querySelectorAll(".mode-toggle-btn").forEach(S=>S.classList.remove("active")),n.classList.add("active"),p=n.dataset.mode;const t=document.getElementById("birth-b-field"),z=document.getElementById("birth-label-a"),w=document.getElementById("submit-btn"),l=document.getElementById("purpose-field"),j=document.getElementById("location-field");if(p==="couple")t.classList.remove("hidden"),t.style.display="flex",z.innerHTML='<span class="label-badge-a">나</span> 생년월일시',w.textContent="함께 인연사찰 찾기",l&&(l.style.display=""),j&&(j.style.display="");else if(p==="saju"){t.classList.add("hidden"),t.style.display="none",z.innerHTML='생년월일시 <span class="help-tip" tabindex="0">?<span class="help-tip-bubble">사주 팔자 계산의 기준이 되는 정보입니다.</span></span>',w.textContent="🔮 사주 팔자 확인",l&&(l.style.display="none"),j&&(j.style.display="none"),document.getElementById("match-form").style.display="",document.getElementById("temple-search-wrap").style.display="";const S=document.getElementById("dream-page");S&&(S.style.display="none")}else if(p==="dream"){document.getElementById("match-form").style.display="none",document.getElementById("temple-search-wrap").style.display="none";let S=document.getElementById("dream-page");S||(dt(),S=document.getElementById("dream-page")),S&&(S.style.display="")}else{t.classList.add("hidden"),t.style.display="none",z.innerHTML='생년월일시 <span class="help-tip" tabindex="0">?<span class="help-tip-bubble">사주 오행 계산의 기준이 되는 정보입니다. 시간을 모르셔도 괜찮습니다 — "시간 모름"을 선택하시면 정오 기준으로 계산됩니다.</span></span>',w.textContent="인연사찰 찾기",l&&(l.style.display=""),j&&(j.style.display=""),document.getElementById("match-form").style.display="",document.getElementById("temple-search-wrap").style.display="";const S=document.getElementById("dream-page");S&&(S.style.display="none")}})}),document.getElementById("match-form").addEventListener("submit",async n=>{var N,L,C,u,V,T,te,W;n.preventDefault();const t=document.getElementById("birth-year").value,z=document.getElementById("birth-month").value,w=document.getElementById("birth-day").value,l=document.getElementById("birth-hour").value,j=parseInt((N=document.getElementById("birth-minute"))==null?void 0:N.value)||0,S=Math.min(59,Math.max(0,j)),J=((L=document.getElementById("birth-city"))==null?void 0:L.value)||"",ne=((C=document.getElementById("is-leap-month"))==null?void 0:C.checked)||!1;if(!t||!z||!w){alert("생년월일(연도·월·일)을 모두 선택해주세요.");return}const b={calendarType:a,year:parseInt(t),month:parseInt(z),day:parseInt(w),hour:l!==""?parseInt(l):12,minute:S,isLeapMonth:ne,birthLongitude:J!==""?parseFloat(J):null,gender:f};if(p==="couple"){const D=document.getElementById("birth-year-b").value,I=document.getElementById("birth-month-b").value,i=document.getElementById("birth-day-b").value;if(!D||!I||!i){alert("상대방 생년월일(연도·월·일)을 모두 선택해주세요.");return}}if(p==="saju"){const D=document.getElementById("submit-btn");D.disabled=!0;const I=document.getElementById("match-form");I&&(I.style.display="none");const i=document.getElementById("results");i.classList.remove("hidden");const ee=[{icon:"🔍",text:"위치 감지 중..."},{icon:"🌀",text:"사주 오행 분석 중..."},{icon:"✨",text:"AI 풀이 생성 중..."},{icon:"🏯",text:"인연사찰 탐색 중..."},{icon:"🔮",text:"팔자 기운 살피는 중..."}];let se=0;(()=>{const c=ee[se%ee.length];i.innerHTML=`
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:320px;gap:28px;padding:40px 20px;">
            <div style="position:relative;width:90px;height:90px;">
              <div style="position:absolute;inset:0;border-radius:50%;border:2px solid rgba(0,210,255,0.15);"></div>
              <div style="position:absolute;inset:6px;border-radius:50%;border:2px solid transparent;border-top-color:rgba(0,210,255,0.8);border-right-color:rgba(107,130,249,0.4);animation:spin 1.2s linear infinite;"></div>
              <div style="position:absolute;inset:16px;border-radius:50%;border:2px solid transparent;border-bottom-color:rgba(0,210,255,0.5);animation:spin 1.8s linear infinite reverse;"></div>
              <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:28px;">${c.icon}</div>
            </div>
            <div style="text-align:center;">
              <div id="saju-loading-text" style="font-size:16px;font-weight:700;color:rgba(0,210,255,0.9);letter-spacing:.04em;margin-bottom:8px;">${c.text}</div>
              <div style="font-size:12px;color:rgba(255,255,255,0.35);letter-spacing:.06em;">사주 팔자 · AI 풀이 · 인연사찰</div>
            </div>
            <div style="display:flex;gap:6px;">
              ${ee.map((h,F)=>`<div class="saju-dot" style="width:6px;height:6px;border-radius:50%;background:${F===se%ee.length?"rgba(0,210,255,0.9)":"rgba(255,255,255,0.15)"};transition:background .3s;"></div>`).join("")}
            </div>
          </div>`})();const _=setInterval(()=>{se++;const c=ee[se%ee.length],h=document.getElementById("saju-loading-text");h&&(h.textContent=c.text),document.querySelectorAll(".saju-dot").forEach((B,y)=>{B.style.background=y===se%ee.length?"rgba(0,210,255,0.9)":"rgba(255,255,255,0.15)"});const F=i.querySelector("[style*='font-size:28px']");F&&(F.textContent=c.icon)},2200);try{const[c,h]=await Promise.all([fetch("/api/saju",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({birthInput:b})}),Ne()]),F=await c.json();if(F.error){clearInterval(_),i.classList.add("hidden"),I&&(I.style.display=""),alert(F.error);return}let B=null,y=null;const re=h.userLat??37.5665,pe=h.userLng??126.978,ge=ue=>new Promise((ae,me)=>setTimeout(()=>me(new Error("timeout")),ue));try{const[ue,ae]=await Promise.all([fetch("/api/match",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({birthInput:b,userLat:re,userLng:pe,purpose:"인연운"})}),Promise.race([fetch("/api/saju-explain",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({eightChar:F.eightChar,distribution:F.distribution,weak:F.weak,daYun:F.daYun?{...F.daYun,list:(u=F.daYun.list)==null?void 0:u.filter(me=>me.isCurrent||me.startAge>=30)}:null,samjae:F.samjae,birthInput:b})}),ge(38e3)]).catch(()=>null)]);ue!=null&&ue.ok&&(B=await ue.json()),ae!=null&&ae.ok&&(y=await ae.json())}catch(ue){console.warn("병렬 오류:",ue)}clearInterval(_),We(F,b,B,(y==null?void 0:y.explanation)||null)}catch{clearInterval(_),i.classList.add("hidden"),i.innerHTML="",I&&(I.style.display=""),alert("사주 계산 중 오류가 발생했습니다.")}finally{D.disabled=!1,D.textContent="🔮 사주 팔자 확인"}return}const k=document.getElementById("submit-btn");if(k.disabled=!0,p==="couple"){const D=document.getElementById("match-form"),I=document.getElementById("results");D&&(D.style.display="none"),I.classList.remove("hidden");const i=[{icon:"💑",text:"두 분의 기운을 살피는 중..."},{icon:"🔮",text:"팔자 여덟 글자 분석 중..."},{icon:"⚡",text:"합충(合沖) 관계 탐색 중..."},{icon:"🌊",text:"오행 시너지 계산 중..."},{icon:"🏯",text:"두 분의 인연 기운 정리 중..."},{icon:"✨",text:"궁합 결과 생성 완료 중..."}];let ee=0;(()=>{const _=i[ee%i.length];I.innerHTML=`
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:340px;gap:24px;padding:40px 20px;">
            <div style="position:relative;width:88px;height:88px;">
              <svg viewBox="0 0 88 88" style="width:88px;height:88px;animation:spin 2s linear infinite;">
                <circle cx="44" cy="44" r="38" fill="none" stroke="rgba(245,100,200,0.15)" stroke-width="6"/>
                <circle cx="44" cy="44" r="38" fill="none" stroke="rgba(245,100,200,0.85)" stroke-width="6"
                  stroke-dasharray="60 180" stroke-linecap="round" transform="rotate(-90 44 44)"
                  style="filter:drop-shadow(0 0 8px rgba(245,100,200,0.7))"/>
              </svg>
              <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:30px;">${_.icon}</div>
            </div>
            <div style="text-align:center;">
              <div id="couple-loading-text" style="font-size:16px;font-weight:700;color:rgba(245,100,200,0.95);letter-spacing:.04em;margin-bottom:8px;">${_.text}</div>
              <div style="font-size:12px;color:rgba(255,255,255,0.35);letter-spacing:.06em;">두 분의 사주 · 합충 분석 · 오행 궁합</div>
            </div>
            <div style="display:flex;gap:6px;">
              ${i.map((c,h)=>`<div class="couple-dot" style="width:7px;height:7px;border-radius:50%;background:${h===0?"rgba(245,100,200,0.9)":"rgba(255,255,255,0.15)"};transition:background .3s;"></div>`).join("")}
            </div>
          </div>`})();const xe=setInterval(()=>{ee++;const _=i[ee%i.length],c=document.getElementById("couple-loading-text");c&&(c.textContent=_.text);const h=I.querySelector("[style*='font-size:30px']");h&&(h.textContent=_.icon),I.querySelectorAll(".couple-dot").forEach((F,B)=>{F.style.background=B===ee%i.length?"rgba(245,100,200,0.9)":"rgba(255,255,255,0.15)"})},5e3);try{const _=document.getElementById("birth-year-b").value,c=document.getElementById("birth-month-b").value,h=document.getElementById("birth-day-b").value,F=document.getElementById("birth-hour-b").value,B={calendarType:A,year:parseInt(_),month:parseInt(c),day:parseInt(h),hour:F!==""?parseInt(F):12,minute:0,isLeapMonth:!1,gender:E},y=await Ne().catch(()=>({})),re=y.userLat??37.5665,pe=y.userLng??126.978,ge=new Promise(me=>setTimeout(me,5e3)),[ue]=await Promise.all([fetch("/api/match-couple",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({birthInputA:b,birthInputB:B,purpose:e,userLat:re,userLng:pe,memberUnlocked:_e(),region:((V=document.getElementById("region-select"))==null?void 0:V.value)||"",maxDistanceKm:parseInt((T=document.getElementById("distance-select"))==null?void 0:T.value)||null})}),ge]),ae=await ue.json();if(clearInterval(xe),ae.error){I.classList.add("hidden"),I.innerHTML="",D&&(D.style.display=""),alert(`오류: ${ae.error}
생년월일을 다시 확인해주세요.`);return}ae.purpose=e,lt(ae)}catch{clearInterval(xe),I.classList.add("hidden"),I.innerHTML="",D&&(D.style.display=""),alert("궁합 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.")}finally{k.disabled=!1,k.textContent="💑 궁합"}return}{const D=document.getElementById("match-form"),I=document.getElementById("results");D&&(D.style.display="none"),I.classList.remove("hidden");const i=[{icon:"🔍",text:"위치 감지 중..."},{icon:"🌀",text:"오행 기운 분석 중..."},{icon:"🏯",text:"인연사찰 탐색 중..."},{icon:"✨",text:"나의 인연을 살피는 중..."},{icon:"🔮",text:"사주 기운 정렬 중..."},{icon:"🌸",text:"결과 생성 완료 중..."}];let ee=0;(()=>{const _=i[ee%i.length];I.innerHTML=`
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:340px;gap:24px;padding:40px 20px;">
            <div style="position:relative;width:88px;height:88px;">
              <svg viewBox="0 0 88 88" style="width:88px;height:88px;animation:spin 2s linear infinite;">
                <circle cx="44" cy="44" r="38" fill="none" stroke="rgba(0,210,255,0.15)" stroke-width="6"/>
                <circle cx="44" cy="44" r="38" fill="none" stroke="rgba(0,210,255,0.85)" stroke-width="6"
                  stroke-dasharray="60 180" stroke-linecap="round" transform="rotate(-90 44 44)"
                  style="filter:drop-shadow(0 0 8px rgba(0,210,255,0.7))"/>
              </svg>
              <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:30px;">${_.icon}</div>
            </div>
            <div style="text-align:center;">
              <div id="solo-loading-text" style="font-size:16px;font-weight:700;color:rgba(0,210,255,0.95);letter-spacing:.04em;margin-bottom:8px;">${_.text}</div>
              <div style="font-size:12px;color:rgba(255,255,255,0.35);letter-spacing:.06em;">오행 분석 · 인연사찰 매칭</div>
            </div>
            <div style="display:flex;gap:6px;">
              ${i.map((c,h)=>`<div class="solo-dot" style="width:7px;height:7px;border-radius:50%;background:${h===0?"rgba(0,210,255,0.9)":"rgba(255,255,255,0.15)"};transition:background .3s;"></div>`).join("")}
            </div>
          </div>`})();const xe=setInterval(()=>{ee++;const _=i[ee%i.length],c=document.getElementById("solo-loading-text");c&&(c.textContent=_.text);const h=I.querySelector("[style*='font-size:30px']");h&&(h.textContent=_.icon),I.querySelectorAll(".solo-dot").forEach((F,B)=>{F.style.background=B===ee%i.length?"rgba(0,210,255,0.9)":"rgba(255,255,255,0.15)"})},5e3);try{const _=new Promise(re=>setTimeout(re,5e3)),c=await Ne().catch(()=>({})),h=c.userLat??37.5665,F=c.userLng??126.978,[B]=await Promise.all([fetch("/api/match",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({birthInput:b,purpose:e,userLat:h,userLng:F,memberUnlocked:_e(),region:((te=document.getElementById("region-select"))==null?void 0:te.value)||"",maxDistanceKm:parseInt((W=document.getElementById("distance-select"))==null?void 0:W.value)||null})}),_]);if(!B.ok){const re=await B.text().catch(()=>"");throw new Error(`HTTP ${B.status}: ${re.slice(0,300)}`)}const y=await B.json();if(clearInterval(xe),y.error){I.classList.add("hidden"),I.innerHTML="",D&&(D.style.display=""),alert(`오류: ${y.error}
생년월일을 다시 확인해주세요.`);return}y.purpose=e,Pe(y)}catch(_){clearInterval(xe),I.classList.add("hidden"),I.innerHTML="",D&&(D.style.display=""),alert(`매칭 오류: ${_.message}`)}finally{k.disabled=!1,k.textContent="인연사찰 찾기"}}})}function rt(e,a){const f=e.eightChar;if(!f)return"";const A=o=>(o==null?void 0:o[0])||"",E=o=>(o==null?void 0:o[1])||"",p=A(f.day),m=A(f.month),$=A(f.year),n=A(f.time),t=E(f.day),z=E(f.month),w=E(f.year),l=E(f.time),j=[l,t,z,w].filter(Boolean),S={甲:{甲:"비견",乙:"겁재",丙:"식신",丁:"상관",戊:"편재",己:"정재",庚:"편관",辛:"정관",壬:"편인",癸:"정인"},乙:{甲:"겁재",乙:"비견",丙:"상관",丁:"식신",戊:"정재",己:"편재",庚:"정관",辛:"편관",壬:"정인",癸:"편인"},丙:{甲:"편인",乙:"정인",丙:"비견",丁:"겁재",戊:"식신",己:"상관",庚:"편재",辛:"정재",壬:"편관",癸:"정관"},丁:{甲:"정인",乙:"편인",丙:"겁재",丁:"비견",戊:"상관",己:"식신",庚:"정재",辛:"편재",壬:"정관",癸:"편관"},戊:{甲:"편관",乙:"정관",丙:"편인",丁:"정인",戊:"비견",己:"겁재",庚:"식신",辛:"상관",壬:"편재",癸:"정재"},己:{甲:"정관",乙:"편관",丙:"정인",丁:"편인",戊:"겁재",己:"비견",庚:"상관",辛:"식신",壬:"정재",癸:"편재"},庚:{甲:"편재",乙:"정재",丙:"편관",丁:"정관",戊:"편인",己:"정인",庚:"비견",辛:"겁재",壬:"식신",癸:"상관"},辛:{甲:"정재",乙:"편재",丙:"정관",丁:"편관",戊:"정인",己:"편인",庚:"겁재",辛:"비견",壬:"상관",癸:"식신"},壬:{甲:"식신",乙:"상관",丙:"편재",丁:"정재",戊:"편관",己:"정관",庚:"편인",辛:"정인",壬:"비견",癸:"겁재"},癸:{甲:"상관",乙:"식신",丙:"정재",丁:"편재",戊:"정관",己:"편관",庚:"정인",辛:"편인",壬:"겁재",癸:"비견"}},J={비견:"#00D2FF",겁재:"#6B82F9",식신:"#4CAF50",상관:"#81C784",편재:"#FF9800",정재:"#FFB74D",편관:"#F44336",정관:"#EF9A9A",편인:"#CE93D8",정인:"#BA68C8"},ne={비견:"독립심·경쟁심",겁재:"추진력·욕망",식신:"표현력·식복",상관:"재능·자유",편재:"사업·활동성",정재:"안정적 재물",편관:"권력·결단",정관:"명예·원칙",편인:"직관·학문",정인:"학습·보호"},b=o=>p&&S[p]&&S[p][o]||"",k=[{label:"시(時)",gan:n,ji:l,ss:b(n)},{label:"일(日)",gan:p,ji:t,ss:"일원(日元)"},{label:"월(月)",gan:m,ji:z,ss:b(m)},{label:"년(年)",gan:$,ji:w,ss:b($)}],N={};k.forEach(o=>{o.ss&&o.ss!=="일원(日元)"&&(N[o.ss]=(N[o.ss]||0)+1)});const L=`
  <div class="saju-card" style="margin-bottom:16px;">
    <div class="saju-card-title">⚖️ 십신(十神) 분석 <span style="font-size:11px;font-weight:400;color:rgba(255,255,255,0.35);margin-left:6px;">일간(${p}) 기준</span></div>
    <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;text-align:center;">
        <tr>${k.map(o=>`<th style="padding:8px 4px;color:rgba(255,255,255,0.4);font-size:11px;font-weight:500;border-bottom:1px solid rgba(255,255,255,0.08);">${o.label}</th>`).join("")}</tr>
        <tr>${k.map(o=>`<td style="padding:10px 4px;font-size:13px;font-weight:800;color:${o.ss==="일원(日元)"?"rgba(255,255,255,0.25)":J[o.ss]||"#fff"};">${o.ss}</td>`).join("")}</tr>
        <tr>${k.map(o=>`<td style="padding:4px;font-size:10px;color:rgba(255,255,255,0.35);line-height:1.4;">${o.ss==="일원(日元)"?"나 자신":ne[o.ss]||""}</td>`).join("")}</tr>
      </table>
    </div>
    <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;">
      ${Object.entries(N).sort((o,ye)=>ye[1]-o[1]).map(([o,ye])=>`<span style="background:rgba(255,255,255,0.05);border:1px solid ${J[o]||"#888"}44;border-radius:20px;padding:4px 11px;font-size:12px;"><span style="color:${J[o]||"#fff"};font-weight:700;">${o}</span><span style="color:rgba(255,255,255,0.35);"> ×${ye}</span></span>`).join("")}
    </div>
  </div>`,C={申:"A",子:"A",辰:"A",寅:"B",午:"B",戌:"B",亥:"C",卯:"C",未:"C",巳:"D",酉:"D",丑:"D"},u=C[w]||C[t],V={A:"酉",B:"卯",C:"子",D:"午"},T={A:"寅",B:"申",C:"巳",D:"亥"},te={A:"辰",B:"戌",C:"未",D:"丑"},W={甲:["丑","未"],戊:["丑","未"],庚:["丑","未"],乙:["子","申"],己:["子","申"],丙:["亥","酉"],丁:["亥","酉"],壬:["卯","巳"],癸:["卯","巳"],辛:["午","寅"]},D={甲:"卯",丙:"午",戊:"午",庚:"酉",壬:"子",乙:"辰",丁:"未",己:"未",辛:"戌",癸:"丑"},I=[j.includes(V[u])&&{name:"도화살(桃花殺)",icon:"🌸",color:"#FF6B9D",desc:"매력·인기운이 강합니다. 이성 관계와 예술·연예 분야에 유리합니다."},j.includes(T[u])&&{name:"역마살(驛馬殺)",icon:"🐴",color:"#FF9800",desc:"활동성이 강하고 변화가 많습니다. 해외·출장·이사 등 이동수가 있습니다."},(W[p]||[]).some(o=>j.includes(o))&&{name:"천을귀인(天乙貴人)",icon:"⭐",color:"#FFD700",desc:"귀인의 도움을 받는 길성입니다. 위기 때 구원자가 나타납니다."},j.includes(D[p])&&{name:"양인살(羊刃殺)",icon:"⚔️",color:"#F44336",desc:"강한 승부욕·의지력. 칼날 같은 기운으로 신중함이 필요합니다."},j.includes(te[u])&&{name:"화개살(華蓋殺)",icon:"🔮",color:"#9C27B0",desc:"예술·종교·철학적 소질이 있습니다. 고독하지만 깊은 내면을 가집니다."}].filter(Boolean),i=I.some(o=>o.name.includes("역마살")),ee=I.some(o=>o.name.includes("천을귀인")),se=i&&ee?`<div style="margin-top:14px;background:linear-gradient(135deg,rgba(255,215,0,0.08),rgba(255,152,0,0.05));border:1px solid rgba(255,215,0,0.25);border-radius:12px;padding:14px;">
        <div style="font-size:12px;font-weight:800;color:#FFD700;margin-bottom:8px;">✨ 시너지 — 천을귀인이 호위하는 역마살</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.75);line-height:1.9;">
          단순히 이동이 많고 분주한 역마살이 아니라, 위기 속에서 수호신이 돕는 <strong style="color:#FFD700;">천을귀인</strong>이 함께 호위하고 있는 명식입니다.<br>
          낯선 영역으로 이동하거나 대외적으로 큰 도전을 감행할 때, 예상치 못한 귀인의 기적 같은 도움(투자자·파트너 등)을 받아 위기를 기회로 바꾸며 크게 성공하는 역동적인 시너지를 발휘합니다.
        </div>
      </div>`:"",xe=`
  <div class="saju-card" style="margin-bottom:16px;">
    <div class="saju-card-title">🔯 신살(神殺) 분석</div>
    ${I.length?I.map(o=>`
      <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
        <span style="font-size:20px;flex-shrink:0;">${o.icon}</span>
        <div><div style="font-size:13px;font-weight:700;color:${o.color};margin-bottom:3px;">${o.name}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.6);line-height:1.6;">${o.desc}</div></div>
      </div>`).join(""):'<div style="font-size:13px;color:rgba(255,255,255,0.4);padding:12px 0;">해당하는 주요 신살이 없습니다.</div>'}
    ${se}
  </div>`,_="丙",c="午",h=b(_),F={甲:"병(丙)화가 목(木)일간을 생(生)하여 활동 에너지가 높아집니다. 새로운 도전에 유리한 해입니다.",乙:"병(丙)화가 목(木)일간을 생(生)하여 표현력과 창의성이 빛납니다.",丙:"비견(比肩) 해 — 경쟁이 강해지고 독립심이 높아집니다. 자기 주도적 행동이 중요합니다.",丁:"겁재(劫財) 해 — 의지력이 강해지나 주변과 마찰이 생길 수 있습니다.",戊:"편인(偏印) 해 — 학문·직관이 발달하고 새로운 기술 습득에 유리합니다.",己:"정인(正印) 해 — 학습운이 좋고 윗사람의 도움을 받을 수 있는 해입니다.",庚:"편관(偏官) 해 — 긴장감과 도전이 많지만 승진·도약의 기회가 옵니다.",辛:"정관(正官) 해 — 명예로운 기회와 안정된 직업운을 기대할 수 있습니다.",壬:"편재(偏財) 해 — 활동적인 재물운, 사업 확장과 투자 기회가 생깁니다.",癸:"정재(正財) 해 — 안정적인 수입과 실속 있는 재물운의 해입니다."},B=`
  <div class="saju-card" style="margin-bottom:16px;">
    <div class="saju-card-title">🗓️ 세운(歲運) — 2026년 丙午</div>
    <div style="display:flex;gap:10px;align-items:stretch;margin-bottom:14px;">
      <div style="text-align:center;background:rgba(255,100,0,0.1);border:1px solid rgba(255,100,0,0.3);border-radius:12px;padding:12px 16px;min-width:60px;">
        <div style="font-size:30px;font-weight:900;color:#FF6B35;">${_}</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.4);margin-top:4px;">화(火) 천간</div>
      </div>
      <div style="text-align:center;background:rgba(255,100,0,0.1);border:1px solid rgba(255,100,0,0.3);border-radius:12px;padding:12px 16px;min-width:60px;">
        <div style="font-size:30px;font-weight:900;color:#FF8C42;">${c}</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.4);margin-top:4px;">화(火) 지지</div>
      </div>
      <div style="flex:1;background:rgba(255,100,0,0.05);border:1px solid rgba(255,100,0,0.15);border-radius:12px;padding:12px;">
        <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">일간(${p}) 기준 세운 십신</div>
        <div style="font-size:16px;font-weight:800;color:${J[h]||"#fff"};">${h||"—"}</div>
      </div>
    </div>
    <div style="font-size:13px;color:rgba(255,255,255,0.75);line-height:1.9;padding:12px;background:rgba(255,100,0,0.05);border-radius:10px;border:1px solid rgba(255,100,0,0.12);">
      ${F[p]||"2026년 병오(丙午)년 화(火) 기운이 사주에 영향을 줍니다."}
    </div>
  </div>`,y={子:["壬","癸"],丑:["癸","辛","己"],寅:["戊","丙","甲"],卯:["甲","乙"],辰:["乙","癸","戊"],巳:["戊","庚","丙"],午:["丙","己","丁"],未:["丁","乙","己"],申:["戊","壬","庚"],酉:["庚","辛"],戌:["辛","丁","戊"],亥:["戊","甲","壬"]},re=["여기(餘氣)","중기(中氣)","정기(正氣)"],pe={甲:"목",乙:"목",丙:"화",丁:"화",戊:"토",己:"토",庚:"금",辛:"금",壬:"수",癸:"수"},ge={목:"#4CAF50",화:"#FF5722",토:"#FF9800",금:"#9E9E9E",수:"#2196F3"},ae=`
  <div class="saju-card" style="margin-bottom:16px;">
    <div class="saju-card-title">🔬 지장간(支藏干) — 지지 속 숨은 천간</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.62);margin-bottom:12px;">지지(땅의 글자) 안에 숨어있는 천간 에너지입니다. 겉으로 보이지 않다가 대운·세운이 건드릴 때 폭발하는 잠재력입니다.</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
      ${[{label:"시(時)",ji:l},{label:"일(日)",ji:t},{label:"월(月)",ji:z},{label:"년(年)",ji:w}].map(o=>{const ye=y[o.ji]||[];return`<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:10px 8px;text-align:center;">
          <div style="font-size:12px;color:rgba(255,255,255,0.65);margin-bottom:6px;">${o.label} · ${o.ji||"?"}</div>
          ${ye.map((ze,Se)=>{const Me=pe[ze]||"토",Oe=ge[Me]||"#aaa",Ie=b(ze),De=Se===ye.length-1?"정기(正氣)":re[Se]||"";return`<div style="margin-bottom:5px;">
              <span style="font-size:15px;font-weight:800;color:${Oe};">${ze}</span>
              <span style="font-size:11px;color:rgba(255,255,255,0.6);display:block;line-height:1.3;">${De}</span>
              ${Ie?`<span style="font-size:9px;color:${J[Ie]||"#aaa"};font-weight:600;">${Ie}</span>`:""}
            </div>`}).join("")}
          ${ye.length===0?'<div style="color:rgba(255,255,255,0.45);font-size:11px;">—</div>':""}
        </div>`}).join("")}
    </div>
    <div style="margin-top:10px;font-size:12px;color:rgba(255,255,255,0.55);">💡 정기(正氣)가 가장 강한 핵심 에너지, 여기는 전 계절의 잔여 기운입니다.</div>
  </div>`,me=["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"],s=["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"],d=[["戌","亥"],["申","酉"],["午","未"],["辰","巳"],["寅","卯"],["子","丑"]],x={子:"자",丑:"축",寅:"인",卯:"묘",辰:"진",巳:"사",午:"오",未:"미",申:"신",酉:"유",戌:"술",亥:"해"},M=me.indexOf(p),v=s.indexOf(t);let g=M;for(;g%12!==v&&g<60;)g+=10;const Y=Math.floor(g/10),X=d[Y]||[],q=[l,t,z,w].filter(Boolean),U=X.filter(o=>q.includes(o)),H={戌:"술(戌) 공망 — 토(土)·믿음·종교·부동산 영역에서 허무함을 느낄 수 있습니다.",亥:"해(亥) 공망 — 수(水)·지혜·철학·여행 분야에서 노력 대비 결실이 약할 수 있습니다.",申:"신(申) 공망 — 금(金)·재물·법·조직 영역에서 공허함이 생깁니다.",酉:"유(酉) 공망 — 금(金)·명예·이성 인연·결실 분야가 채워지지 않는 느낌이 있습니다.",午:"오(午) 공망 — 화(火)·명성·열정·중년의 성취가 기대보다 약할 수 있습니다.",未:"미(未) 공망 — 토(土)·가정·전통·안정감에서 결핍을 느낍니다.",辰:"진(辰) 공망 — 토(土)·사업·현실 기반·실속이 흔들릴 수 있습니다.",巳:"사(巳) 공망 — 화(火)·계획·지식·전문성 영역에서 허탕을 치기 쉽습니다.",寅:"인(寅) 공망 — 목(木)·시작·도전·형제 인연이 공허합니다.",卯:"묘(卯) 공망 — 목(木)·창의력·학문·이성 인연이 약해집니다.",子:"자(子) 공망 — 수(水)·지혜·부하·자녀 인연에서 결핍이 생깁니다.",丑:"축(丑) 공망 — 토(土)·재고·비밀·말년 안정이 불안할 수 있습니다."},de=`
  <div class="saju-card" style="margin-bottom:16px;">
    <div class="saju-card-title">⬜ 공망(空亡) — 구멍 난 자리</div>
    <div style="display:flex;gap:10px;align-items:center;margin-bottom:12px;flex-wrap:wrap;">
      <div style="display:flex;gap:8px;">
        ${X.map(o=>`<div style="text-align:center;background:rgba(100,100,100,0.15);border:1.5px dashed rgba(255,255,255,0.2);border-radius:12px;padding:10px 14px;">
          <div style="font-size:26px;font-weight:900;color:rgba(255,255,255,0.65);">${o}</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.55);margin-top:3px;">${x[o]||""}</div>
        </div>`).join("")}
      </div>
      <div style="flex:1;min-width:120px;">
        ${U.length>0?`<div style="font-size:12px;font-weight:700;color:#FF8A80;margin-bottom:4px;">⚠️ 원국에 공망 해당 글자 있음</div>
             <div style="font-size:11px;color:rgba(255,255,255,0.55);">${U.map(o=>x[o]).join("·")} 자리가 구멍납니다. 이 영역에서 노력해도 공허함이 생기는 원인입니다.</div>`:`<div>
               <div style="font-size:12px;font-weight:700;color:#80CBC4;margin-bottom:5px;">✅ 원국 내 공망 없음 — 기초 뼈대가 단단합니다</div>
               <div style="font-size:12px;color:rgba(255,255,255,0.72);line-height:1.7;">기본 팔자에 구멍 난 자리가 없어 인생의 기초 뼈대가 알차고 탄탄합니다.</div>
             </div>`}
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;">
      ${X.map(o=>`<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:10px 12px;font-size:12px;color:rgba(255,255,255,0.65);line-height:1.7;">${H[o]||""}</div>`).join("")}
    </div>
    ${U.length===0&&X.length>0?`
    <div style="margin-top:12px;background:rgba(255,193,7,0.06);border:1px solid rgba(255,193,7,0.2);border-radius:10px;padding:12px 14px;">
      <div style="font-size:12px;font-weight:700;color:#FFD54F;margin-bottom:6px;">⏰ 세운 공망 경고</div>
      <div style="font-size:12px;color:rgba(255,255,255,0.7);line-height:1.85;">
        세운·대운에서 <strong style="color:#FFD54F;">${X.map(o=>`${o}(${x[o]})`).join(" · ")}</strong> 글자가 들어오는 해에는 해당 영역이 일시적으로 흔들릴 수 있습니다.<br>
        그 시기에는 무리한 확장보다 <strong style="color:#FFD54F;">기존 자산·계약을 안전하게 잠그는 실속형 전략</strong>이 정답입니다.
      </div>
    </div>`:""}
    <div style="margin-top:10px;font-size:12px;color:rgba(255,255,255,0.55);">💡 공망 글자가 들어오는 해(세운)에는 그 영역에서 과도한 기대를 피하는 것이 현명합니다.</div>
  </div>`,P=[n,p,m,$].filter(Boolean),G=[l,t,z,w].filter(Boolean),ce=[{a:"甲",b:"己",result:"土합",desc:"갑기합(甲己合) — 리더십(木)과 포용력(土)이 결합, 안정적 추진력을 발휘합니다. 공직·기업 경영에 이상적입니다."},{a:"乙",b:"庚",result:"金합",desc:"을경합(乙庚合) — 유연함(木)과 단호함(金)이 결합, 협상력과 결단력을 동시에 갖춥니다."},{a:"丙",b:"辛",result:"水합",desc:"병신합(丙辛合) — 열정(火)과 예리함(金)이 수(水)로 변환, 전략적 분석력과 깊은 통찰이 생깁니다."},{a:"丁",b:"壬",result:"木합",desc:"정임합(丁壬合) — 감수성(火)과 지혜(水)가 목(木)으로 변환, 창의적 영감과 인문학적 재능이 발달합니다."},{a:"戊",b:"癸",result:"火합",desc:"무계합(戊癸合) — 현실감(土)과 직관(水)이 화(火)로 변환, 열정적 행동력과 카리스마가 형성됩니다."}].filter(o=>P.includes(o.a)&&P.includes(o.b)),he=[{group:["申","子","辰"],result:"水局",desc:"수(水) 기운이 강하게 형성"},{group:["巳","酉","丑"],result:"金局",desc:"금(金) 기운이 강하게 형성"},{group:["寅","午","戌"],result:"火局",desc:"화(火) 기운이 강하게 형성"},{group:["亥","卯","未"],result:"木局",desc:"목(木) 기운이 강하게 형성"}].map(o=>({cnt:o.group.filter(ze=>G.includes(ze)).length,...o})).filter(o=>o.cnt>=2),ve=[{a:"子",b:"丑",result:"土합",desc:"자축합(子丑合) — 수(水)와 토(土)가 결합해 단단한 땅을 형성합니다. 신용·자산 기반이 흔들림 없이 지켜지는 강한 결속력입니다."},{a:"寅",b:"亥",result:"木합",desc:"인해합(寅亥合) — 목(木) 기운이 강화됩니다. 시작과 성장의 에너지가 서로를 북돋아 새로운 도전에 유리합니다."},{a:"卯",b:"戌",result:"火합",desc:"묘술합(卯戌合) — 화(火) 기운으로 변합니다. 따뜻한 정(情)과 열정이 관계를 불태우지만, 집착이 될 수 있어 균형이 필요합니다."},{a:"辰",b:"酉",result:"金합",desc:"진유합(辰酉合) — 금(金) 기운이 강해집니다. 현실적 판단력과 재물 결실이 단단하게 쌓이는 실속형 결합입니다."},{a:"巳",b:"申",result:"水합",desc:"사신합(巳申合) — 수(水) 기운으로 변합니다. 지혜·전략·소통이 강화되나, 화(火)와 금(金)의 긴장이 내재합니다."},{a:"午",b:"未",result:"土합",desc:"오미합(午未合) — 토(土) 기운이 두터워집니다. 중심을 잡아주는 안정 에너지로, 중년 이후 자산 축적에 유리합니다."}].filter(o=>G.includes(o.a)&&G.includes(o.b)),$e=[{a:"子",b:"午",desc:"子午충 — 수화(水火) 충돌, 변동·이동수 강함"},{a:"丑",b:"未",desc:"丑未충 — 토토(土土) 충돌, 직장·부동산 변동"},{a:"寅",b:"申",desc:"寅申충 — 목금(木金) 충돌, 충동적 행동 주의"},{a:"卯",b:"酉",desc:"卯酉충 — 목금(木金) 충돌, 이성 관계·인간관계 마찰"},{a:"辰",b:"戌",desc:"辰戌충 — 토토(土土) 충돌, 기반·환경의 급변"},{a:"巳",b:"亥",desc:"巳亥충 — 화수(火水) 충돌, 사업·건강의 기복"}].filter(o=>G.includes(o.a)&&G.includes(o.b)),ke=`
  <div class="saju-card" style="margin-bottom:16px;">
    <div class="saju-card-title">🔗 합(合)·충(沖) — 글자끼리의 화학반응</div>

    ${ce.length>0?`
    <div style="margin-bottom:12px;">
      <div style="font-size:12px;font-weight:700;color:rgba(0,210,255,0.8);margin-bottom:6px;">☯️ 천간합(天干合)</div>
      ${ce.map(o=>`<div style="background:rgba(0,210,255,0.05);border:1px solid rgba(0,210,255,0.15);border-radius:10px;padding:12px;margin-bottom:6px;">
        <div style="margin-bottom:5px;"><span style="font-size:14px;font-weight:800;color:#00d2ff;margin-right:8px;">${o.a}+${o.b}</span><span style="font-size:12px;color:rgba(255,255,255,0.6);">→ ${o.result}</span></div>
        <div style="font-size:12px;color:rgba(255,255,255,0.75);line-height:1.7;">${o.desc}</div>
      </div>`).join("")}
    </div>`:""}

    ${he.length>0?`
    <div style="margin-bottom:12px;">
      <div style="font-size:12px;font-weight:700;color:rgba(156,204,101,0.9);margin-bottom:6px;">🔺 지지 삼합(三合) / 반삼합</div>
      ${he.map(o=>`<div style="background:rgba(76,175,80,0.05);border:1px solid rgba(76,175,80,0.18);border-radius:10px;padding:10px 12px;margin-bottom:6px;font-size:12px;color:rgba(255,255,255,0.75);">
        <span style="font-size:13px;font-weight:800;color:#AED581;margin-right:8px;">${o.group.filter(ye=>G.includes(ye)).join("·")} ${o.cnt===2?"반삼합":"삼합"}</span>${o.desc} <span style="color:rgba(255,255,255,0.4);">(→ ${o.result})</span>
        ${o.cnt===2?'<span style="font-size:10px;background:rgba(255,165,0,0.15);color:#FFB74D;border-radius:8px;padding:2px 7px;margin-left:6px;">세운에서 완성 가능</span>':""}
      </div>`).join("")}
    </div>`:""}

    ${ve.length>0?`
    <div style="margin-bottom:12px;">
      <div style="font-size:12px;font-weight:700;color:rgba(206,147,216,0.9);margin-bottom:6px;">🤝 지지 육합(六合)</div>
      ${ve.map(o=>`<div style="background:rgba(156,39,176,0.05);border:1px solid rgba(156,39,176,0.18);border-radius:10px;padding:12px;margin-bottom:6px;">
        <div style="margin-bottom:5px;"><span style="font-size:14px;font-weight:800;color:#CE93D8;margin-right:8px;">${o.a}+${o.b}</span><span style="font-size:12px;color:rgba(255,255,255,0.4);">→ ${o.result}</span></div>
        <div style="font-size:12px;color:rgba(255,255,255,0.72);line-height:1.7;">${o.desc}</div>
      </div>`).join("")}
    </div>`:""}

    ${$e.length>0?`
    <div>
      <div style="font-size:12px;font-weight:700;color:rgba(244,67,54,0.9);margin-bottom:6px;">⚡ 지지 충(沖) — 원국 내 충돌</div>
      ${$e.map(o=>`<div style="background:rgba(244,67,54,0.05);border:1px solid rgba(244,67,54,0.18);border-radius:10px;padding:10px 12px;margin-bottom:6px;font-size:12px;color:rgba(255,255,255,0.75);">
        <span style="font-size:14px;font-weight:800;color:#EF9A9A;margin-right:8px;">${o.a}↔${o.b}</span>${o.desc}
      </div>`).join("")}
    </div>`:""}

    ${ce.length===0&&he.length===0&&ve.length===0&&$e.length===0?'<div style="font-size:12px;color:rgba(255,255,255,0.35);padding:8px 0;">원국 내 주요 합·충이 없습니다 — 대운·세운에서 형성될 때 주목하세요.</div>':""}
    <div style="margin-top:10px;font-size:12px;color:rgba(255,255,255,0.55);">💡 2026 丙午년: 午를 포함한 寅午戌 화국(火局) 가능성 체크</div>
  </div>`,je=[{a:"子",b:"未",desc:"자(子)–미(未) 원진 — 서로 미워하고 불편한 관계"},{a:"丑",b:"午",desc:"축(丑)–오(午) 원진 — 의리 있지만 갈등 반복"},{a:"寅",b:"酉",desc:"인(寅)–유(酉) 원진 — 시작은 좋지만 결국 어긋남"},{a:"卯",b:"申",desc:"묘(卯)–신(申) 원진 — 예민함과 강함의 충돌"},{a:"辰",b:"亥",desc:"진(辰)–해(亥) 원진 — 마음은 맞지만 행동이 어긋남"},{a:"巳",b:"戌",desc:"사(巳)–술(戌) 원진 — 가까울수록 상처받기 쉬움"}],Z=[{a:"子",b:"酉",desc:"자–유 귀문 — 강한 집착·예민한 감수성"},{a:"丑",b:"午",desc:"축–오 귀문 — 감정 기복·강박적 성향"},{a:"寅",b:"亥",desc:"인–해 귀문 — 신비로운 직관, 과몰입 주의"},{a:"卯",b:"申",desc:"묘–신 귀문 — 예민함·과한 상상력"},{a:"辰",b:"巳",desc:"진–사 귀문 — 의심·불안감"},{a:"未",b:"戌",desc:"미–술 귀문 — 우울·집착 경향"}],fe=je.filter(o=>G.includes(o.a)&&G.includes(o.b)),Fe=Z.filter(o=>G.includes(o.a)&&G.includes(o.b)),Ce=`
  <div class="saju-card" style="margin-bottom:16px;">
    <div class="saju-card-title">🛡️ 원진살(怨嗔殺) · 귀문관살(鬼門關殺)</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.62);margin-bottom:12px;">원진은 인간관계의 심리적 갈등 패턴, 귀문은 정신적 예민함·집착 경향을 나타냅니다.</div>

    ${fe.length>0?`
    <div style="margin-bottom:12px;">
      <div style="font-size:12px;font-weight:700;color:#FF8A80;margin-bottom:8px;">😤 원진살(怨嗔殺) 발견</div>
      ${fe.map(o=>`<div style="background:rgba(244,67,54,0.05);border:1px solid rgba(244,67,54,0.2);border-radius:10px;padding:12px;margin-bottom:6px;">
        <div style="font-size:13px;font-weight:800;color:#EF9A9A;margin-bottom:4px;">${o.a} – ${o.b}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.7);line-height:1.7;">${o.desc}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:6px;">💊 처방: 미워하는 감정을 인정하고, 선을 명확히 그어두는 것이 정신 건강에 유리합니다.</div>
      </div>`).join("")}
    </div>`:'<div style="font-size:12px;color:rgba(255,255,255,0.6);padding:6px 0;margin-bottom:8px;">✅ 원진살 없음 — 인간관계에서 심한 갈등 패턴이 없습니다.</div>'}

    ${Fe.length>0?`
    <div>
      <div style="font-size:12px;font-weight:700;color:#CE93D8;margin-bottom:8px;">🌀 귀문관살(鬼門關殺) 발견</div>
      ${Fe.map(o=>`<div style="background:rgba(156,39,176,0.05);border:1px solid rgba(156,39,176,0.2);border-radius:10px;padding:12px;margin-bottom:6px;">
        <div style="font-size:13px;font-weight:800;color:#CE93D8;margin-bottom:4px;">${o.a} – ${o.b}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.7);line-height:1.7;">${o.desc}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:6px;">💊 처방: 예민한 감수성이 예술·직관력의 강점이 됩니다. 충분한 휴식과 명상이 도움됩니다.</div>
      </div>`).join("")}
    </div>`:'<div style="font-size:12px;color:rgba(255,255,255,0.6);padding:6px 0;">✅ 귀문관살 없음 — 정신적 안정감이 높습니다.</div>'}
  </div>`;return L+xe+B+ae+de+ke+Ce}function st(e,a){var $e,ke,je;const f=e.eightChar;if(!f)return"";const A=Z=>(Z==null?void 0:Z[0])||"",E=Z=>(Z==null?void 0:Z[1])||"",p=A(f.day),m=e.distribution||{},$=(($e=e.weak)==null?void 0:$e.부족오행)||"",n=(a==null?void 0:a.gender)||"male",t={甲:{甲:"비견",乙:"겁재",丙:"식신",丁:"상관",戊:"편재",己:"정재",庚:"편관",辛:"정관",壬:"편인",癸:"정인"},乙:{甲:"겁재",乙:"비견",丙:"상관",丁:"식신",戊:"정재",己:"편재",庚:"정관",辛:"편관",壬:"정인",癸:"편인"},丙:{甲:"편인",乙:"정인",丙:"비견",丁:"겁재",戊:"식신",己:"상관",庚:"편재",辛:"정재",壬:"편관",癸:"정관"},丁:{甲:"정인",乙:"편인",丙:"겁재",丁:"비견",戊:"상관",己:"식신",庚:"정재",辛:"편재",壬:"정관",癸:"편관"},戊:{甲:"편관",乙:"정관",丙:"편인",丁:"정인",戊:"비견",己:"겁재",庚:"식신",辛:"상관",壬:"편재",癸:"정재"},己:{甲:"정관",乙:"편관",丙:"정인",丁:"편인",戊:"겁재",己:"비견",庚:"상관",辛:"식신",壬:"정재",癸:"편재"},庚:{甲:"편재",乙:"정재",丙:"편관",丁:"정관",戊:"편인",己:"정인",庚:"비견",辛:"겁재",壬:"식신",癸:"상관"},辛:{甲:"정재",乙:"편재",丙:"정관",丁:"편관",戊:"정인",己:"편인",庚:"겁재",辛:"비견",壬:"상관",癸:"식신"},壬:{甲:"식신",乙:"상관",丙:"편재",丁:"정재",戊:"편관",己:"정관",庚:"편인",辛:"정인",壬:"비견",癸:"겁재"},癸:{甲:"상관",乙:"식신",丙:"정재",丁:"편재",戊:"정관",己:"편관",庚:"정인",辛:"편인",壬:"겁재",癸:"비견"}},z=Z=>p&&t[p]&&t[p][Z]||"",l={甲:["한번 결심하면 끝까지 밀어붙이는 뚝심이 있습니다.","남들이 가지 않은 길을 먼저 개척하는 리더 기질이 있습니다.","의리와 원칙을 중시해서 믿는 사람에게는 끝까지 신뢰를 지킵니다."],乙:["상황에 따라 유연하게 적응하는 능력이 탁월합니다.","사람의 마음을 잘 읽고 분위기를 부드럽게 만드는 재주가 있습니다.","겉으로는 조용해 보여도 속으로는 하고 싶은 것이 뚜렷합니다."],丙:["어딜 가든 분위기를 밝히고 에너지를 나눠주는 타입입니다.","솔직하고 시원시원해서 처음 만나는 사람도 금방 편해집니다.","빠르게 결정하고 행동하지만 감정의 파도가 클 수 있습니다."],丁:["따뜻하고 세심해서 주변 사람들이 자연스럽게 의지합니다.","한 가지를 깊이 파고드는 집중력과 분석력이 뛰어납니다.","말보다 행동으로 보여주는 조용하고 진실된 스타일입니다."],戊:["묵직하고 든든한 인상으로 어디서든 기둥 역할을 합니다.","맡은 일은 끝까지 책임지는 성실함이 최고의 무기입니다.","급격한 변화보다 안정을 선호하고 오래 쌓아가는 방식을 즐깁니다."],己:["실용적이고 꼼꼼해서 뒤처리와 마무리를 잘합니다.","넓은 포용력으로 다양한 사람들과 어울릴 수 있습니다.","겉으로 우유부단해 보여도 현실 감각이 매우 뛰어납니다."],庚:["옳고 그름이 명확하고 직선적인 성격입니다.","위기 상황에서도 흔들리지 않는 결단력이 강점입니다.","한번 목표를 세우면 냉철하게 밀어붙여 결국 이뤄냅니다."],辛:["세심하고 완벽주의 성향이 있어 디테일을 놓치지 않습니다.","미적 감각이 뛰어나고 자신만의 스타일로 주목받습니다.","예민한 감수성을 지니며 자신의 기준과 원칙에 충실합니다."],壬:["자유롭고 넓은 시야로 큰 그림을 그리는 스타일입니다.","아이디어가 넘치고 새로운 것에 대한 호기심이 끊이지 않습니다.","어떤 상황에도 유연하게 적응하며 자기 방식대로 나아갑니다."],癸:["조용하지만 깊은 내면을 가진 감성형입니다.","타인의 감정을 잘 읽어 상대방이 원하는 것을 본능적으로 압니다.","겉은 부드럽고 속은 강한 끈기로 결국 목표를 이룹니다."]}[p]||["사주 분석 데이터를 불러올 수 없습니다."],j={목:{icon:"🌱",title:"사람을 키우고 돌보는 일에 강합니다",jobs:["선생님·강사·교수","의사·한의사·간호사","작가·기자·출판 편집자","인테리어·조경 디자이너","사회복지사·상담사"],tip:"사람과 자연을 다루는 직종에서 특히 빛을 발합니다."},화:{icon:"🔥",title:"무대 위에서 빛나는 표현형입니다",jobs:["방송인·유튜버·연예인","마케터·광고 기획자","요식업·카페 창업","강연자·MC·이벤트 기획","에너지·전기·소방 분야"],tip:"사람들 앞에 나서거나 홍보·기획하는 일에 탁월합니다."},토:{icon:"⛰️",title:"믿음직하고 안정적인 조직형입니다",jobs:["공무원·행정직","부동산·건설·시공","농업·식품 가공·유통","종교인·상담가·코치","문화재·골동품·박물관"],tip:"꾸준히 신뢰를 쌓아가는 분야에서 장기적으로 성공합니다."},금:{icon:"⚙️",title:"원칙과 시스템을 다루는 데 탁월합니다",jobs:["회계사·세무사·금융 전문가","변호사·검사·법무 담당","제조업·기계·엔지니어링","군인·경찰·보안 관련","IT 시스템·데이터 분석"],tip:"정확성과 규칙이 중요한 분야에서 실력을 발휘합니다."},수:{icon:"💧",title:"자유롭고 창의적인 탐구형입니다",jobs:["무역·수출입·글로벌 비즈니스","여행 플래너·가이드·관광업","철학·심리학·연구직","예술가·뮤지션·크리에이터","의약품·바이오·헬스케어"],tip:"틀에 얽매이지 않는 창의적이고 국제적인 분야가 잘 맞습니다."}},J=((ke=Object.entries(m).sort((Z,fe)=>fe[1]-Z[1])[0])==null?void 0:ke[0])||"목",ne=j[J]||j.목,b=[A(f.time),A(f.month),A(f.year)].filter(Boolean);let k=0,N=0;b.forEach(Z=>{const fe=z(Z);fe==="편재"&&k++,fe==="정재"&&N++});let L,C,u;k>N?(L="💸 벌고 쓰는 스타일",C="돈을 크게 벌고 또 크게 쓰는 활발한 재물 흐름을 가졌습니다. 사업·투자·영업처럼 변동성 있는 곳에서 기회를 잘 잡습니다. 단, 들어오는 만큼 나가는 경향이 있어 목돈을 따로 묶어두는 습관이 중요합니다.",u="💡 종잣돈은 별도 계좌에 자동이체로 고정 저축하세요."):N>k?(L="🏦 모아서 쓰는 스타일",C="꾸준히 벌어서 차곡차곡 쌓아가는 안정형 재물운입니다. 월급·임대·이자처럼 정기적인 수입 구조가 잘 맞고, 충동 지출이 적어 장기적으로 부를 쌓습니다. 부동산이나 장기 적금이 유리합니다.",u="💡 초반 종잣돈 마련 후 부동산·적금 장기 투자가 가장 맞습니다."):k===0&&N===0?(L="🔮 돈보다 가치 추구형",C="재물보다 하고 싶은 일, 명예, 배움에 에너지를 쏟는 타입입니다. 돈을 직접 좇기보다 전문성을 키우면 자연히 따라오는 구조가 잘 맞습니다. 전문직이나 기술직이 장기적으로 유리합니다.",u="💡 자격증·전문 기술에 투자하면 그게 곧 재물이 됩니다."):(L="⚖️ 균형 잡힌 스타일",C="저축도 하면서 필요할 때는 과감하게 투자도 하는 균형형입니다. 무리하지 않는 선에서 다양한 방식으로 재산을 늘릴 수 있는 유연한 재물 감각을 가졌습니다.",u="💡 분산 투자 전략이 가장 잘 맞는 타입입니다.");const V=n==="female"?["편관","정관"]:["편재","정재"],T=[A(f.time),A(f.month),A(f.year),E(f.time),E(f.month),E(f.year)].filter(Boolean);let te=0;T.forEach(Z=>{V.includes(z(Z))&&te++});let W,D,I,i;n==="female"?te>=2?(W="💝 인연이 많은 편",i="이성 인연이 많고 매력도 높아서 선택지가 다양합니다. 다만 인연이 너무 많으면 정작 진지한 상대를 놓칠 수 있습니다.",D="책임감 있고 사회적으로 안정된 상대, 말보다 행동으로 보여주는 사람",I="감정에 이끌려 너무 빨리 결정하지 말고, 상대의 일관성을 충분히 지켜보세요."):te===1?(W="💑 한 사람에게 깊이 헌신하는 스타일",i="한 번 마음을 주면 깊고 진지하게 사귀는 타입입니다. 가볍게 많이 만나기보다 한 사람과 진하게 교감하는 연애가 잘 맞습니다.",D="신뢰를 중요시하고 꾸준한 상대, 가치관이 비슷한 사람",I="상대에게 너무 맞추다 보면 나를 잃을 수 있습니다. 자기 페이스를 유지하세요."):(W="🌸 자기 발전이 먼저인 스타일",i="연애보다 일과 성장에 더 에너지를 쏟는 독립형입니다. 강요받는 연애는 잘 맞지 않고 자연스럽게 이어지는 인연이 오래 갑니다.",D="서로의 독립성을 존중해 주는 상대, 공통 관심사로 만난 인연",I="30대 중반 이후 인연운이 열리는 경우가 많습니다. 너무 서두르지 마세요."):te>=2?(W="💝 이성 복이 많은 편",i="여러 이성 인연을 경험하고 선택의 폭이 넓습니다. 하지만 인연이 많은 만큼 진지한 상대를 선별하는 눈이 중요합니다.",D="따뜻하고 현실적인 상대, 가정적이고 정서적으로 안정된 사람",I="바람기처럼 보일 수 있는 행동을 조심하고, 마음을 정한 뒤에는 일관되게 행동하세요."):te===1?(W="💑 한 사람에게 헌신하는 스타일",i="만나면 깊이 사랑하고 결혼 후에도 가정에 충실한 타입입니다. 화려한 연애보다 진실된 관계 하나가 더 의미 있습니다.",D="착하고 성실한 상대, 서로 믿고 의지할 수 있는 사람",I="상대에게 너무 맞춰주다 지칠 수 있습니다. 자신의 감정도 표현하세요."):(W="🌿 일과 꿈이 먼저인 스타일",i="연애보다 커리어와 꿈에 집중하는 경향이 있습니다. 억지로 찾으려 하기보다 일이나 취미를 통해 자연스럽게 만나는 인연이 더 잘 맞습니다.",D="같은 관심사를 공유하는 상대, 서로의 성장을 응원해 주는 사람",I="연애에 소극적인 모습이 상대방에게 무관심으로 보일 수 있습니다. 표현을 연습하세요.");const se={목:{arrow:"목(木) 부족 → 간·담낭·눈·근육 주의",tip:"눈의 피로가 빨리 쌓이고 과로하면 간에 무리가 올 수 있습니다. 스트레스가 몸에서 목·어깨 근육 통증으로 나타나는 경우가 많습니다. 충분한 숙면과 정기적인 스트레칭이 중요합니다."},화:{arrow:"화(火) 부족 → 심장·혈관·소장 주의",tip:"혈액 순환이 잘 안 되거나 손발이 차가운 증상이 생기기 쉽습니다. 과로와 감정적 흥분이 심장에 부담을 줄 수 있습니다. 규칙적인 유산소 운동과 충분한 수분 섭취가 도움됩니다."},토:{arrow:"토(土) 부족 → 위장·췌장·소화기 주의",tip:"불규칙한 식사나 과식, 과음이 위장에 바로 부담을 줍니다. 스트레스가 소화 불량이나 복통으로 이어지는 경우가 많습니다. 식사 시간을 규칙적으로 지키고 자극적인 음식을 줄이세요."},금:{arrow:"금(金) 부족 → 폐·대장·피부·호흡기 주의",tip:"호흡기가 약해 감기, 기관지염에 걸리기 쉽습니다. 피부 트러블이나 대장 건강도 함께 신경 써야 합니다. 건조한 계절에는 특히 수분 섭취와 환기를 신경 쓰세요."},수:{arrow:"수(水) 부족 → 신장·방광·뼈·귀 주의",tip:"몸이 쉽게 차가워지고 피로감이 오래 가는 경향이 있습니다. 신장과 방광 기능이 약해지면 부기가 생기거나 잦은 소변 증상이 나타납니다. 찬 음식을 줄이고 몸을 따뜻하게 유지하는 게 핵심입니다."}}[$]||{arrow:"오행 균형 → 전반적 건강 관리",tip:"오행이 비교적 균형 잡혀 있어 특정 부위 약점은 크지 않습니다. 과로와 스트레스를 피하고 규칙적인 운동과 수면 습관을 유지하는 것이 가장 중요합니다."},xe=z("丙"),c={비견:{h1:"나와 비슷한 기운이 강해지는 시기입니다. 독립심과 추진력이 높아져 오랫동안 미뤄왔던 일을 직접 시작하기 좋습니다. 경쟁은 있지만 그만큼 내 역량도 강해집니다. 주변의 시선보다 내 판단을 믿고 움직이는 상반기입니다.",h2:"하반기에는 나서는 것보다 내실을 다지는 방향이 유리합니다. 혼자 잘하려다 주변과 마찰이 생길 수 있으니, 협력이 필요한 부분은 기꺼이 손을 내밀어 보세요. 체력을 꾸준히 관리하면 연말에 좋은 마무리가 됩니다."},겁재:{h1:"경쟁심과 의지력이 강해지는 상반기입니다. 목표가 뚜렷하면 강하게 밀어붙일 수 있고 스포츠, 도전적인 프로젝트에서 두각을 나타냅니다. 다만 남과 비교하거나 무리한 승부에 빠지지 않도록 주의하세요.",h2:"하반기에는 속도를 조금 늦추고 쌓아온 것들을 점검하는 시간이 필요합니다. 지나친 경쟁 심리가 인간관계에 균열을 낼 수 있습니다. 신뢰를 지키고 팀워크를 강화하면 연말에 더 큰 성과를 거둡니다."},식신:{h1:"창의력과 표현력이 꽃피는 시기입니다. 아이디어가 넘치고 새로운 것을 시작하면 주변의 반응도 좋습니다. 먹고 즐기는 복도 있어 맛있는 것, 여행, 취미 활동에서 만족감이 높습니다. 건강운도 함께 상승합니다.",h2:"하반기에는 상반기에 시작한 것들을 꾸준히 이어가는 것이 중요합니다. 너무 많은 것을 벌려놓으면 마무리가 어려워집니다. 한 가지에 집중해서 결실을 맺고, 남은 에너지로 새로운 배움에 투자하세요."},상관:{h1:"개성과 재능이 돋보이는 시기입니다. 자신만의 색깔로 표현하는 분야 — 예술, 창작, 강의, 유튜브 등에서 주목받기 좋습니다. 기존의 틀을 깨는 아이디어가 강점이 됩니다. 단, 말이 너무 직설적이 되지 않게 조심하세요.",h2:"하반기에는 실력으로 결과를 만들어 보이는 것이 중요합니다. 말보다 행동으로 증명하면 주변의 신뢰를 얻습니다. 윗사람과의 마찰을 피하고, 내 주장은 상황을 보며 적절히 표현하는 지혜가 필요합니다."},편재:{h1:"적극적으로 움직이면 돈이 되는 기회가 보이는 상반기입니다. 사업 확장, 투자, 새로운 수익 구조를 시도하기 좋은 시기이며 발 빠르게 행동하는 사람이 선점합니다. 인맥을 활용한 비즈니스 기회도 열립니다.",h2:"상반기에 달아오른 기운이 하반기에는 안정세를 찾습니다. 무리한 투기나 갑작스러운 큰 지출은 자제하고, 수익을 관리하고 정리하는 시간으로 삼으세요. 이미 벌어놓은 것을 지키는 것이 더 큰 수익입니다."},정재:{h1:"안정적인 수입이 꾸준히 들어오는 시기입니다. 급여 인상, 계약 갱신, 안정적인 거래처 확보 등 착실한 수확이 기대됩니다. 큰 변동 없이 원하는 것을 차근차근 이뤄가는 좋은 흐름입니다.",h2:"하반기에는 저축과 재테크 계획을 구체화하기 좋습니다. 부동산, 예·적금, 안전한 장기 투자를 검토할 시기입니다. 무리한 모험보다 확실한 것에 집중하면 연말 결산이 만족스럽습니다."},편관:{h1:"도전과 긴장이 높아지는 상반기입니다. 직장 내 변화, 이직, 새로운 책임을 맡게 될 수 있습니다. 스트레스가 크게 느껴질 수 있지만, 이 압박을 잘 견디면 도약의 발판이 됩니다. 건강 관리가 특히 중요합니다.",h2:"하반기에는 상반기의 긴장이 풀리며 성과가 드러나는 시기입니다. 포기하지 않고 버텼다면 승진, 승인, 인정을 받을 기회가 옵니다. 위험을 감수한 만큼 보상이 따라오는 하반기입니다."},정관:{h1:"명예와 안정이 함께 찾아오는 시기입니다. 직장에서 인정받거나 사회적으로 좋은 평판을 얻게 됩니다. 원칙대로 움직이면 주변이 따라오고, 공식적인 자리나 계약에서 유리한 결과가 나옵니다.",h2:"하반기에는 책임감이 커지고 맡는 역할이 늘어납니다. 원칙과 신뢰를 끝까지 지키면 연말에 의미 있는 성과로 돌아옵니다. 무리하지 않고 차근차근 쌓아가는 것이 이 시기의 핵심입니다."},편인:{h1:"배움과 연구에 집중하기 좋은 시기입니다. 자격증 취득, 새로운 기술 습득, 공부에 투자하면 하반기부터 결실이 나타납니다. 직관력이 높아져 남들이 놓치는 기회를 먼저 발견합니다.",h2:"하반기에는 상반기에 갈고닦은 능력이 빛을 발합니다. 내면의 성장이 외부 성과로 연결되는 시기로, 자기계발에 투자한 것이 실제 기회로 연결됩니다. 독창적인 아이디어나 새로운 관점이 주목받습니다."},정인:{h1:"윗사람의 도움과 배움의 기회가 동시에 찾아오는 시기입니다. 멘토를 만나거나 좋은 교육 환경이 주어집니다. 지식과 경험을 쌓기 좋은 시기이며, 이때 배운 것이 오랫동안 자산이 됩니다.",h2:"하반기에는 안정된 환경에서 꾸준히 실력을 쌓는 시기입니다. 학위, 자격증, 전문성이 빛을 발하고 신뢰를 기반으로 한 기회가 주어집니다. 조급하지 않고 묵묵히 자기 길을 가면 됩니다."}}[xe]||{h1:"2026년 병오(丙午)년 화(火) 기운이 강한 상반기입니다. 열정적으로 움직이면 기회가 보이는 시기이며, 새로운 도전을 시작하기 좋습니다.",h2:"하반기에는 과열된 에너지를 조절하고 상반기에 벌여놓은 일들을 마무리하는 데 집중하세요. 차분하게 결실을 거두는 시기입니다."},h={목:{do_:["숲길 산책·자연 속 휴식을 자주 취하기","동쪽 방향으로 새로운 시작·이사 고려하기","초록색을 생활 소품·의류에 활용하기","새벽 시간을 활용한 계획·독서 루틴 만들기","사람을 키우거나 가르치는 역할 적극 맡기"],dont:["무리한 음주와 야근으로 간 건강 해치기","급한 부동산·주식 결정 서두르지 않기","감정을 억누르지 말고 적절히 표현하기","서쪽 방향 큰 이동이나 결정 신중히 하기","고집을 내세워 팀워크를 망치지 않기"]},화:{do_:["따뜻한 햇빛 아래 야외 활동 늘리기","남쪽 방향으로 새로운 인연·기회 모색하기","붉은색·주황색을 활용해 에너지 높이기","홍보·마케팅·표현 분야에 적극 도전하기","여름 시즌 대외 활동과 네트워킹 강화하기"],dont:["과도한 냉방 환경에 장시간 머물지 않기","감정 폭발이나 충동적 결정 자제하기","한꺼번에 너무 많은 일 벌이지 않기","밤샘 작업으로 수면 패턴 망치지 않기","자존심 때문에 도움 요청 거부하지 않기"]},토:{do_:["식사 시간을 규칙적으로 지키고 천천히 먹기","집·사무실 중심 공간 정리정돈 꾸준히 하기","노란색·갈색 계열을 활용해 안정감 높이기","부동산·장기 투자 정보 꾸준히 공부하기","믿을 수 있는 사람들과 깊은 관계 유지하기"],dont:["과식·과음으로 위장 부담 주지 않기","무리한 다이어트로 몸에 스트레스 주지 않기","갑작스러운 큰 변화나 이직 성급히 결정하지 않기","걱정을 혼자 안고 있지 말고 털어놓기","변화를 두려워해 기회를 통째로 놓치지 않기"]},금:{do_:["계약·서류·법적 사항 꼼꼼히 점검하기","서쪽 방향으로 활동 범위 넓히기","흰색·은색을 활용해 집중력 높이기","폐·호흡기 강화를 위한 규칙적 유산소 운동하기","금융·회계·법률 분야 전문 인맥 쌓기"],dont:["감정적으로 충돌하거나 고집으로 관계 망치지 않기","더운 환경·과도한 열기에 장시간 있지 않기","급한 결정이나 충동적 지출 자제하기","수술·시술은 시기를 잘 골라서 하기","남의 일에 과도하게 관여해 에너지 소모하지 않기"]},수:{do_:["물 가까운 곳(바다·강·호수)에서 자주 충전하기","북쪽 방향으로 새로운 기회 찾아보기","검정·파란색으로 집중력과 직관력 높이기","철학·연구·창작 활동에 꾸준히 시간 투자하기","여행·무역·글로벌 네트워크 적극 활용하기"],dont:["찬 음식·아이스 음료 과도하게 섭취하지 않기","야행성 생활로 신장·방광에 부담 주지 않기","감정 기복을 조절하지 못해 인간관계 흔들지 않기","고여 있지 말고 새로운 환경에 계속 자신을 노출하기","혼자 모든 것을 해결하려다 번아웃 오지 않게 하기"]}},F=h[$]||h.목,B="margin-bottom:16px;",y=(Z,fe)=>`<div class="saju-card-title">${Z} ${fe}</div>`,re=(Z,fe,Fe,Ce)=>`<span style="display:inline-block;background:${fe};border:1px solid ${Fe};color:${Ce};border-radius:20px;padding:4px 12px;font-size:12px;font-weight:700;margin:3px 4px 3px 0;">${Z}</span>`,pe=`
  <div class="saju-card" style="${B}">
    ${y("🙋","나는 어떤 사람인가")}
    <div style="display:flex;gap:12px;align-items:flex-start;">
      <div style="background:linear-gradient(135deg,rgba(0,210,255,0.15),rgba(123,94,167,0.2));border:1px solid rgba(0,210,255,0.25);border-radius:16px;padding:12px 16px;min-width:50px;text-align:center;flex-shrink:0;">
        <div style="font-size:28px;font-weight:900;color:#00d2ff;">${p}</div>
        <div style="font-size:9px;color:rgba(255,255,255,0.35);margin-top:3px;">일간</div>
      </div>
      <div style="flex:1;">
        ${l.map((Z,fe)=>`<div style="display:flex;gap:8px;align-items:flex-start;${fe<l.length-1?"margin-bottom:10px":""}"><span style="color:#00d2ff;font-size:13px;flex-shrink:0;margin-top:2px;">${["①","②","③"][fe]||"✦"}</span><span style="font-size:13px;color:rgba(255,255,255,0.82);line-height:1.75;">${Z}</span></div>`).join("")}
      </div>
    </div>
  </div>`,ge=`
  <div class="saju-card" style="${B}">
    ${y("💼","나에게 맞는 직업")}
    <div style="font-size:13px;font-weight:700;color:#81C784;margin-bottom:10px;">${ne.icon} ${ne.title}</div>
    <div style="margin-bottom:12px;">${ne.jobs.map(Z=>re(Z,"rgba(76,175,80,0.1)","rgba(76,175,80,0.3)","#81C784")).join("")}</div>
    <div style="background:rgba(76,175,80,0.05);border:1px solid rgba(76,175,80,0.15);border-radius:10px;padding:10px 14px;font-size:12px;color:rgba(255,255,255,0.5);">💡 ${ne.tip}</div>
  </div>`,ue=`
  <div class="saju-card" style="${B}">
    ${y("💰","재물운 스타일")}
    <div style="background:rgba(255,152,0,0.08);border:1px solid rgba(255,152,0,0.25);border-radius:12px;padding:14px;margin-bottom:10px;">
      <div style="font-size:16px;font-weight:800;color:#FFB74D;margin-bottom:8px;">${L}</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.78);line-height:1.8;">${C}</div>
    </div>
    <div style="background:rgba(255,152,0,0.04);border:1px solid rgba(255,152,0,0.12);border-radius:10px;padding:10px 14px;font-size:12px;color:rgba(255,255,255,0.45);">${u}</div>
  </div>`,ae=`
  <div class="saju-card" style="${B}">
    ${y("❤️","연애·결혼운")}
    <div style="font-size:15px;font-weight:800;color:#EF9A9A;margin-bottom:10px;">${W}</div>
    <div style="font-size:13px;color:rgba(255,255,255,0.78);line-height:1.8;margin-bottom:12px;">${i}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <div style="background:rgba(244,67,54,0.06);border:1px solid rgba(244,67,54,0.18);border-radius:12px;padding:12px;">
        <div style="font-size:11px;font-weight:700;color:#EF9A9A;margin-bottom:6px;">💕 잘 맞는 상대</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.7);line-height:1.7;">${D}</div>
      </div>
      <div style="background:rgba(255,152,0,0.06);border:1px solid rgba(255,152,0,0.18);border-radius:12px;padding:12px;">
        <div style="font-size:11px;font-weight:700;color:#FFB74D;margin-bottom:6px;">⚠️ 주의할 점</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.7);line-height:1.7;">${I}</div>
      </div>
    </div>
  </div>`,me=`
  <div class="saju-card" style="${B}">
    ${y("🏥","건강 체크포인트")}
    <div style="background:rgba(156,204,101,0.08);border:1px solid rgba(156,204,101,0.2);border-radius:12px;padding:14px;">
      <div style="font-size:13px;font-weight:800;color:#AED581;margin-bottom:10px;">📌 ${se.arrow}</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.78);line-height:1.8;">${se.tip}</div>
    </div>
  </div>`,s=`
  <div class="saju-card" style="${B}">
    ${y("🍀","2026년 나의 운세")}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <div style="background:rgba(255,165,0,0.07);border:1px solid rgba(255,165,0,0.2);border-radius:12px;padding:14px;">
        <div style="font-size:13px;font-weight:800;color:#FFB74D;margin-bottom:10px;">🌸 상반기 (1~6월)</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.78);line-height:1.85;">${c.h1}</div>
      </div>
      <div style="background:rgba(255,100,0,0.07);border:1px solid rgba(255,100,0,0.2);border-radius:12px;padding:14px;">
        <div style="font-size:13px;font-weight:800;color:#FF8C42;margin-bottom:10px;">🍂 하반기 (7~12월)</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.78);line-height:1.85;">${c.h2}</div>
      </div>
    </div>
    <div style="margin-top:10px;font-size:11px;color:rgba(255,255,255,0.3);text-align:center;">2026 병오(丙午)년 기준 · 참고용</div>
  </div>`,d=`
  <div class="saju-card" style="${B}">
    ${y("🎯","올해 해야 할 것 · 하지 말아야 할 것")}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <div style="background:rgba(0,200,100,0.05);border:1px solid rgba(0,200,100,0.2);border-radius:12px;padding:14px;">
        <div style="font-size:13px;font-weight:700;color:#69F0AE;margin-bottom:10px;">✅ 해야 할 것</div>
        ${F.do_.map(Z=>`<div style="display:flex;gap:6px;align-items:flex-start;margin-bottom:8px;"><span style="color:#69F0AE;flex-shrink:0;font-size:11px;margin-top:2px;">▸</span><span style="font-size:12px;color:rgba(255,255,255,0.78);line-height:1.65;">${Z}</span></div>`).join("")}
      </div>
      <div style="background:rgba(255,80,80,0.05);border:1px solid rgba(255,80,80,0.2);border-radius:12px;padding:14px;">
        <div style="font-size:13px;font-weight:700;color:#FF8A80;margin-bottom:10px;">⛔ 하지 말아야 할 것</div>
        ${F.dont.map(Z=>`<div style="display:flex;gap:6px;align-items:flex-start;margin-bottom:8px;"><span style="color:#FF8A80;flex-shrink:0;font-size:11px;margin-top:2px;">▸</span><span style="font-size:12px;color:rgba(255,255,255,0.78);line-height:1.65;">${Z}</span></div>`).join("")}
      </div>
    </div>
    <div style="margin-top:10px;font-size:11px;color:rgba(255,255,255,0.3);text-align:center;">부족 오행 기준 · 참고용</div>
  </div>`,x={목:{emoji:"🌿",title:"목(木) 기운 보완 가이드",colors:["초록(Green)","청색(Blue)"],colorNote:"식물·잎사귀 색 계열의 소품이나 의상 포인트에 활용하면 성장 에너지가 활성화됩니다.",space:"동쪽 방향의 창가나 책상 배치, 실내 화분·화초 기르기",spaceNote:"목기운은 자라는 에너지 — 햇살 받는 식물이 있는 공간에서 집중력이 높아집니다.",numbers:"3 · 8",numberNote:"중요한 날짜·번호 선택 시 활용, 목요일(木曜日)을 중요 약속의 기준일로 삼으면 좋습니다."},화:{emoji:"🔥",title:"화(火) 기운 보완 가이드",colors:["레드(Red)","오렌지(Orange)"],colorNote:"스마트폰 배경화면·소품·포인트 의상에 활용하면 활력이 충전됩니다.",space:"채광이 잘 드는 남향 창가 휴식, 햇볕 쬐며 걷는 산책(포행)",spaceNote:"화기운은 빛과 온기 — 오전 햇빛을 직접 받는 것이 가장 빠른 기운 보충입니다.",numbers:"2 · 7",numberNote:"중요한 비밀번호 설정이나 날짜 선택 시 활용, 화요일(火曜日)이 행동 개시에 유리합니다."},토:{emoji:"⛰️",title:"토(土) 기운 보완 가이드",colors:["황색(Yellow)","베이지(Beige)","갈색(Brown)"],colorNote:"흙빛·모래빛 계열의 인테리어 소품이나 천연 소재 의상이 안정감을 높입니다.",space:"자연 흙길 걷기, 황토방·찜질방·온천 방문, 도예·원예 활동",spaceNote:"토기운은 중심 잡기 — 맨발로 흙을 밟는 것만으로도 강한 접지(接地) 에너지를 얻습니다.",numbers:"5 · 10",numberNote:"중심·균형을 상징하는 숫자, 토요일(土曜日)에 중요한 결정을 마무리하면 안정적입니다."},금:{emoji:"⚙️",title:"금(金) 기운 보완 가이드",colors:["흰색(White)","은색(Silver)","회색(Gray)"],colorNote:"정갈하고 깔끔한 화이트·실버 계열 소품이 판단력과 결단력을 높여줍니다.",space:"정돈된 공간 만들기, 서쪽 방향 창가에서의 집중 작업, 금속 악기 연주·청취",spaceNote:"금기운은 정리와 수확 — 책상·방을 깔끔하게 정리하는 것만으로도 금기운이 보충됩니다.",numbers:"4 · 9",numberNote:"정확성과 완성을 상징, 금요일(金曜日)에 계약·서명·결제 등 마무리 행동이 유리합니다."},수:{emoji:"💧",title:"수(水) 기운 보완 가이드",colors:["검은색(Black)","남색(Navy)","다크블루(Dark Blue)"],colorNote:"깊고 진한 색상 계열이 지혜·집중력·통찰력을 끌어올려줍니다.",space:"물 소리가 들리는 공간(분수·계곡·바다), 북쪽 방향 명상 공간, 족욕·반신욕",spaceNote:"수기운은 흐름과 지혜 — 물을 충분히 마시고 촉촉한 피부 관리도 수기운 보충에 도움됩니다.",numbers:"1 · 6",numberNote:"시작과 깊이를 상징, 수요일(水曜日)을 학습·창작·기획의 핵심일로 활용하면 좋습니다."}},M=$?$.replace(/[^가-힣]/g,"").trim():"",v=x[M],g=v?`
  <div class="saju-card" style="${B}">
    ${y(v.emoji,v.title)}
    <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:14px;line-height:1.7;">
      사주에서 ${M}(${M==="목"?"木":M==="화"?"火":M==="토"?"土":M==="금"?"金":"水"}) 기운이 부족합니다. 일상 속 아래 방법으로 자연스럽게 보완해보세요.
    </div>
    <div style="display:flex;flex-direction:column;gap:10px;">
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;">
        <div style="font-size:12px;font-weight:700;color:#FFD54F;margin-bottom:6px;">🎨 행운의 색상</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;">
          ${v.colors.map(Z=>`<span style="background:rgba(255,213,79,0.1);border:1px solid rgba(255,213,79,0.3);border-radius:20px;padding:4px 12px;font-size:12px;color:#FFD54F;font-weight:600;">${Z}</span>`).join("")}
        </div>
        <div style="font-size:12px;color:rgba(255,255,255,0.65);line-height:1.7;">${v.colorNote}</div>
      </div>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;">
        <div style="font-size:12px;font-weight:700;color:#80DEEA;margin-bottom:6px;">🌿 공간 에너지</div>
        <div style="font-size:12px;font-weight:600;color:rgba(255,255,255,0.85);margin-bottom:4px;">${v.space}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.6);line-height:1.7;">${v.spaceNote}</div>
      </div>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;">
        <div style="font-size:12px;font-weight:700;color:#CE93D8;margin-bottom:6px;">🔢 행운의 숫자</div>
        <div style="font-size:20px;font-weight:900;color:#CE93D8;letter-spacing:4px;margin-bottom:4px;">${v.numbers}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.6);line-height:1.7;">${v.numberNote}</div>
      </div>
    </div>
  </div>`:"",Y=((je=e.daYun)==null?void 0:je.list)||[],X=Y.findIndex(Z=>Z.isCurrent),q=Y[X],U=X>=0?Y[X+1]:null,H=U?U.startAge:null,de=H?H-2:null,P=H?H+2:null,G=new Date().getFullYear(),oe=(a==null?void 0:a.year)||G,ce=G-oe,be=H!==null&&Math.abs(ce-H)<=3,he=H?`
  <div class="saju-card" style="${B}">
    ${y("⏳","대운 교운기(交運期) 마인드셋 가이드")}
    <div style="background:rgba(255,193,7,0.07);border:1px solid rgba(255,193,7,0.22);border-radius:12px;padding:14px;margin-bottom:12px;">
      <div style="font-size:12px;font-weight:700;color:#FFD54F;margin-bottom:5px;">
        ${be?"⚡ 현재 교운기 진행 중":"📅 다음 교운기 예정"}
      </div>
      <div style="font-size:13px;color:rgba(255,255,255,0.85);line-height:1.7;">
        <strong style="color:#FFD54F;">만 ${de}세~${P}세</strong> 구간이 교운기(대운 환절기)입니다.
        ${q?`현재 <strong style="color:#00D2FF;">${q.ganZhi}</strong> 대운에서 `:""}
        ${U?`<strong style="color:#69F0AE;">${U.ganZhi}</strong> 대운으로 기운이 전환됩니다.`:""}
      </div>
    </div>
    <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.7);margin-bottom:10px;">🧘 교운기를 지혜롭게 맞이하는 방법</div>
    <div style="display:flex;flex-direction:column;gap:8px;">
      <div style="display:flex;gap:10px;align-items:flex-start;padding:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;">
        <span style="font-size:18px;flex-shrink:0;">🛌</span>
        <div>
          <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.85);margin-bottom:3px;">몸의 신호 경청</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.65);line-height:1.7;">무리한 활동보다 규칙적인 수면과 가벼운 스트레칭으로 기혈 순환을 돕는 것이 가장 좋습니다. 교운기에는 체력이 평소보다 예민해지는 시기임을 인지하세요.</div>
        </div>
      </div>
      <div style="display:flex;gap:10px;align-items:flex-start;padding:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;">
        <span style="font-size:18px;flex-shrink:0;">🧹</span>
        <div>
          <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.85);margin-bottom:3px;">일상 정리하기</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.65);line-height:1.7;">새로운 대운의 활기찬 기운을 맞이하기 전, 안 쓰는 물건을 정리하듯 불필요한 고민과 미련을 가볍게 비워내면 운의 흐름이 한층 맑아집니다.</div>
        </div>
      </div>
      <div style="display:flex;gap:10px;align-items:flex-start;padding:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;">
        <span style="font-size:18px;flex-shrink:0;">🌱</span>
        <div>
          <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.85);margin-bottom:3px;">새 대운 준비</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.65);line-height:1.7;">${U?`다음 <strong style="color:#69F0AE;">${U.ganZhi}</strong> 대운은 새로운 기운의 시작입니다. 이 기간에 씨앗을 심으면 대운이 바뀌었을 때 꽃이 핍니다. 서두르지 말고 방향을 잡는 데 집중하세요.`:"새로운 대운을 준비하는 시기입니다. 방향을 잡는 데 집중하세요."}</div>
        </div>
      </div>
    </div>
  </div>`:"",ve={甲:{guiIn:{jilju:"癸亥(계해)",reason:"맑은 수(水)가 목(木)을 강하게 생(生)해주는 귀인 관계입니다. 지적이고 따뜻하며 나의 성장을 조용히 뒷받침해줍니다."},energy:{element:"水",desc:"임수(壬)·계수(癸) 천간이나 해(亥)·자(子) 지지를 가진 분이 나의 역량을 끌어올려주는 귀인입니다."}},乙:{guiIn:{jilju:"壬子(임자)",reason:"깊은 수(水) 기운이 을목(乙)을 촉촉하게 적셔주는 관계입니다. 지혜롭고 유연하며 부드러운 소통으로 나를 편안하게 해줍니다."},energy:{element:"水",desc:"임수(壬)·계수(癸) 천간이나 해(亥)·자(子) 지지를 가진 분이 섬세한 감성을 지지해주는 귀인입니다."}},丙:{guiIn:{jilju:"甲寅(갑인)",reason:"강한 목(木)이 화(火)를 생(生)해주어 빛나는 시너지를 냅니다. 도전적이고 리더십 있는 사람이 나의 열정에 에너지를 더해줍니다."},energy:{element:"木",desc:"갑목(甲)·을목(乙) 천간이나 인(寅)·묘(卯) 지지를 가진 분이 나의 표현력을 극대화시켜주는 파트너입니다."}},丁:{guiIn:{jilju:"甲午(갑오)",reason:"목(木)이 화(火)를 생하고 오화(午)가 합세하는 강력한 조합입니다. 추진력 있는 사람이 나의 따뜻함과 만날 때 최고의 결과물이 나옵니다."},energy:{element:"木",desc:"갑목(甲)·을목(乙) 천간이나 인(寅)·묘(卯) 지지를 가진 분이 나의 세심한 감성에 불꽃을 일으킵니다."}},戊:{guiIn:{jilju:"丙午(병오)",reason:"화(火)가 토(土)를 따뜻하게 생해주는 관계입니다. 열정적이고 표현력 있는 사람이 든든한 나에게 활기를 불어넣습니다."},energy:{element:"火",desc:"병화(丙)·정화(丁) 천간이나 오(午)·사(巳) 지지를 가진 분이 나의 안정감에 생동감을 더해줍니다."}},己:{guiIn:{jilju:"丁巳(정사)",reason:"화(火)가 토(土)를 데워주는 귀인 관계입니다. 감수성 풍부하고 헌신적인 사람이 나의 섬세함과 조화를 이룹니다."},energy:{element:"火",desc:"병화(丙)·정화(丁) 천간이나 오(午)·사(巳) 지지를 가진 분이 나의 실용적인 기운에 온기를 더해줍니다."}},庚:{guiIn:{jilju:"戊辰(무진)",reason:"토(土)가 금(金)을 생해주는 든든한 지지 관계입니다. 안정적이고 신뢰감 있는 사람이 나의 날카로운 결단력을 지지해줍니다."},energy:{element:"土",desc:"무토(戊)·기토(己) 천간이나 진(辰)·술(戌)·축(丑)·미(未) 지지를 가진 분이 나의 추진력을 뒷받침합니다."}},辛:{guiIn:{jilju:"己丑(기축)",reason:"토(土)가 금(金)을 생하고 축토(丑) 지지가 신금을 품어주는 귀인입니다. 성실하고 포용적인 사람이 예민한 나에게 안정을 줍니다."},energy:{element:"土",desc:"무토(戊)·기토(己) 천간이나 토(土) 지지를 가진 분이 나의 완벽주의를 따뜻하게 받쳐줍니다."}},壬:{guiIn:{jilju:"庚申(경신)",reason:"금(金)이 수(水)를 생해주는 최강 귀인 조합입니다. 원칙적이고 결단력 있는 사람이 나의 큰 그림을 현실로 만들어주는 조력자입니다."},energy:{element:"金",desc:"경금(庚)·신금(辛) 천간이나 신(申)·유(酉) 지지를 가진 분이 나의 광대한 아이디어에 방향과 힘을 줍니다."}},癸:{guiIn:{jilju:"辛酉(신유)",reason:"맑은 금(金)이 수(水)를 생해주는 귀인 관계입니다. 세련되고 감각적인 사람이 나의 깊은 감성에 맑은 에너지를 보충해줍니다."},energy:{element:"金",desc:"경금(庚)·신금(辛) 천간이나 신(申)·유(酉) 지지를 가진 분이 나의 직관을 현실로 연결시켜주는 파트너입니다."}}}[p],Ee=ve?`
  <div class="saju-card" style="${B}">
    ${y("💞","나를 돕는 최고의 일주(日柱) 궁합")}
    <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:14px;line-height:1.7;">
      일간 <strong style="color:#FFD54F;">${p}</strong>을 기준으로 나의 기운을 보완하거나 시너지를 극대화하는 상대 일주입니다.
    </div>
    <div style="display:flex;flex-direction:column;gap:10px;">
      <div style="background:linear-gradient(135deg,rgba(0,210,255,0.06),rgba(107,130,249,0.04));border:1px solid rgba(0,210,255,0.2);border-radius:12px;padding:14px;">
        <div style="font-size:12px;font-weight:700;color:#00D2FF;margin-bottom:8px;">🤝 서로의 결핍을 채워주는 귀인 일주</div>
        <div style="font-size:18px;font-weight:900;color:#00D2FF;margin-bottom:6px;letter-spacing:1px;">${ve.guiIn.jilju}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.72);line-height:1.8;">${ve.guiIn.reason}</div>
      </div>
      <div style="background:linear-gradient(135deg,rgba(105,240,174,0.06),rgba(0,200,83,0.04));border:1px solid rgba(105,240,174,0.2);border-radius:12px;padding:14px;">
        <div style="font-size:12px;font-weight:700;color:#69F0AE;margin-bottom:8px;">🔥 나의 열정을 깨워주는 파트너 유형</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.72);line-height:1.8;">${ve.energy.desc}</div>
        <div style="margin-top:8px;font-size:11px;background:rgba(105,240,174,0.08);border-radius:8px;padding:8px 10px;color:rgba(255,255,255,0.55);line-height:1.7;">
          💡 상대방의 사주팔자를 함께 분석해보면 실제 궁합의 깊이를 더 정확하게 확인할 수 있습니다.
        </div>
      </div>
    </div>
  </div>`:"";return pe+ge+ue+ae+me+s+d+g+he+Ee}function We(e,a,f,A){var W,D,I,i,ee,se,xe,_;window._gunghamContext=null,window._sajuContext={eightChar:e.eightChar,distribution:e.distribution,weak:e.weak,daYun:e.daYun,samjae:e.samjae,birthInput:a,temples:((W=f==null?void 0:f.results)==null?void 0:W.slice(0,3).map(c=>{var h,F;return{name:(h=c.temple)==null?void 0:h.name,address:(F=c.temple)==null?void 0:F.address}}))||[]};const E=document.getElementById("results");E.classList.remove("hidden");const p=document.getElementById("match-form");p&&(p.style.display="none");const m={木:"목",火:"화",土:"토",金:"금",水:"수"},$={목:"#4CAF50",화:"#FF5722",토:"#FF9800",금:"#9E9E9E",수:"#2196F3"},n={목:"木 목",화:"火 화",토:"土 토",금:"金 금",수:"水 수"},t=e.eightChar,z=t?(()=>{const c=[{label:"시(時)",char:t.time,wx:t.timeWx},{label:"일(日)",char:t.day,wx:t.dayWx},{label:"월(月)",char:t.month,wx:t.monthWx},{label:"년(年)",char:t.year,wx:t.yearWx}],h=y=>y?y[0]:"",F=y=>y?y[1]:"",B=c.map(y=>{const re=[...y.wx||""].map(ge=>m[ge]).filter(Boolean),pe=$[re[0]]||"#00d2ff";return{chars:re,col:pe}});return`
    <table class="saju-table">
      <thead><tr>
        ${c.map(y=>`<th>${y.label}</th>`).join("")}
      </tr></thead>
      <tbody>
        <tr class="saju-table-gan">
          ${c.map((y,re)=>`<td style="color:${B[re].col}">${h(y.char)}</td>`).join("")}
        </tr>
        <tr class="saju-table-ji">
          ${c.map((y,re)=>`<td style="color:${B[re].col}">${F(y.char)}</td>`).join("")}
        </tr>
        <tr class="saju-table-wx">
          ${B.map(y=>`<td style="color:${y.col};font-size:11px;">${y.chars.join("·")}</td>`).join("")}
        </tr>
      </tbody>
    </table>`})():'<p style="color:rgba(255,255,255,0.5);text-align:center;">사주 계산 결과를 불러올 수 없습니다.</p>',w=e.distribution||{},l=Object.entries(w).map(([c,h])=>`
    <div class="saju-dist-item">
      <span class="saju-dist-label" style="color:${$[c]||"#fff"}">${n[c]||c}</span>
      <div class="saju-dist-bar-wrap">
        <div class="saju-dist-bar" style="width:${Math.min(h*25,100)}%;background:${$[c]||"#00d2ff"}"></div>
      </div>
      <span class="saju-dist-val">${h}</span>
    </div>
  `).join(""),j=a.calendarType==="lunar"?"음력":"양력",S=`${a.hour}시 ${a.minute>0?a.minute+"분":""}`.trim();a.birthLongitude&&`${a.birthLongitude}`;const J=((D=e.weak)==null?void 0:D.부족오행)??"",ne={목:"#4CAF50",화:"#FF5722",토:"#FF9800",금:"#9E9E9E",수:"#2196F3"},b={목:"木",화:"火",토:"土",금:"金",수:"水"},k=(f==null?void 0:f.results)||[],N=k.length>0?`
    <div class="saju-dist-section" style="border-color:rgba(0,210,255,0.3);">
      <div class="saju-dist-title">🏯 나의 인연사찰 추천
        ${J?`<span style="font-size:12px;font-weight:400;color:${ne[J]||"#00d2ff"};margin-left:8px;">· ${J}(${b[J]||""}) 기운 보완</span>`:""}
      </div>
      ${k.slice(0,5).map((c,h)=>{var y;const F=c.temple||{},B=(y=c.detail)==null?void 0:y.distanceKm;return`
        <div style="display:flex;align-items:center;gap:12px;padding:14px 12px;margin-top:8px;background:rgba(0,210,255,0.04);border:1px solid rgba(0,210,255,0.12);border-radius:12px;">
          <div style="font-size:24px;min-width:34px;text-align:center;">${["🥇","🥈","🥉","4️⃣","5️⃣"][h]}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:16px;font-weight:800;color:#fff;">${F.name||""}</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.45);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${F.address||""}</div>
            ${B!=null?`<div style="font-size:12px;color:var(--cyan);margin-top:3px;">📍 ${B<1?(B*1e3).toFixed(0)+"m":B.toFixed(1)+"km"}</div>`:""}
            ${c.reason?`<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-top:4px;line-height:1.4;">${c.reason}</div>`:""}
          </div>
          <div style="text-align:right;flex-shrink:0;">
            <div style="font-size:20px;font-weight:900;color:var(--cyan);">${c.score||""}</div>
            <div style="font-size:10px;color:rgba(255,255,255,0.3);">점</div>
          </div>
        </div>`}).join("")}
      <p style="font-size:11px;color:rgba(255,255,255,0.3);text-align:center;margin-top:12px;">※ 오행 궁합 · 거리 · 유래 종합 점수 기준 · 참고용</p>
    </div>`:'<div class="saju-notice-banner" style="text-align:center;">📍 위치를 확인하는 중이었거나 사찰 데이터를 불러오지 못했습니다.<br><button class="submit-btn" style="margin-top:12px;padding:10px 24px;" id="retry-match-btn">🔄 인연사찰 다시 찾기</button></div>',L=`
    <div class="saju-card" style="margin-bottom:0;">
      <div class="saju-card-title" style="font-size:13px;">🔮 사주 팔자 (四柱八字) · ${j} ${a.year}년 ${a.month}월 ${a.day}일 · ${S}</div>
      ${z}
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;justify-content:center;">
        ${l?`<details style="width:100%;"><summary style="cursor:pointer;font-size:12px;color:rgba(255,255,255,0.4);list-style:none;">▼ 오행 분포 보기</summary><div style="margin-top:8px;">${l}</div></details>`:""}
      </div>
    </div>`;e.daYun&&`${e.daYun.direction}${e.daYun.startAge}${e.daYun.list.map(c=>{var h;return`
            <div class="dayun-block ${c.isCurrent?"dayun-current":""}">
              <div class="dayun-block-header" onclick="(function(el){var g=el.closest('.dayun-block').querySelector('.liunian-grid');if(g){g.style.display=g.style.display==='none'?'grid':'none';}})(this)" style="cursor:pointer;">
                ${c.isCurrent?'<span class="dayun-now-badge">현재 대운</span>':""}
                <span class="dayun-block-age">${c.startAge}세 (${c.startYear}년~${c.endAge}세)</span>
                <span class="dayun-block-gz">${c.ganZhi}</span>
                <span style="font-size:11px;color:rgba(255,255,255,0.3);">${c.isCurrent?"▲":"▼"}</span>
              </div>
              ${((h=c.liuNian)==null?void 0:h.length)>0?`
              <div class="liunian-grid" style="display:${c.isCurrent?"grid":"none"}">
                ${c.liuNian.map(F=>`
                  <div class="liunian-item ${F.isCurrent?"liunian-current":""}">
                    <span class="liunian-year">${F.year}</span>
                    <span class="liunian-gz">${F.ganZhi}</span>
                    <span class="liunian-age">${F.age}세</span>
                  </div>`).join("")}
              </div>`:""}
            </div>`}).join("")}`,e.samjae&&`${((I=e.samjae)==null?void 0:I.animalsKo)||""}${e.samjae.samjaeTarget}${e.samjae.groups.map(c=>{const h=new Date().getFullYear(),F=c.some(B=>B.year===h||B.year===h-1||B.year===h+1);return`<div class="samjae-group ${F?"samjae-active":""}">
            ${F?'<span class="samjae-now-badge">현재 삼재</span>':""}
            ${c.map((B,y)=>`<span class="samjae-year-item">${B.year}년(${B.zhiKo}·${y===0?"들삼재":y===1?"눌삼재":"날삼재"})</span>`).join(" → ")}
          </div>`}).join("")}`;const C=A?A.replace(/^#{1,3}\s+(.+)$/gm,'<h3 class="saju-explain-h3">$1</h3>').replace(/^---+$/gm,'<hr style="border:none;border-top:1px solid rgba(0,210,255,0.15);margin:12px 0;">').replace(/\*\*(.+?)\*\*/g,'<strong class="saju-explain-heading">$1</strong>').replace(/\n\n/g,"</p><p>").replace(/\n/g,"<br>").replace(/^/,"<p>").replace(/$/,"</p>").replace(/<p>\s*(<h3|<hr)/g,"$1").replace(/(<\/h3>|<hr[^>]*>)\s*<\/p>/g,"$1"):"",u=`
    <div class="saju-explain-card">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
        <div class="saju-card-title" style="margin-bottom:0;">📖 나의 사주 풀이</div>
        ${A?'<button id="saju-download-btn" style="background:linear-gradient(135deg,#00d2ff,#7b5ea7);border:none;border-radius:10px;padding:9px 18px;color:#fff;font-weight:700;font-size:13px;cursor:pointer;white-space:nowrap;">📥 결과 다운받기</button>':""}
      </div>
      <div class="saju-explain-body" id="saju-ai-explanation">${A?C:`
        <div style="display:flex;flex-direction:column;gap:10px;padding:8px 0;">
          <div style="display:flex;align-items:center;gap:10px;color:rgba(0,210,255,0.7);font-size:13px;">
            <span style="display:inline-block;width:16px;height:16px;border:2px solid rgba(0,210,255,0.4);border-top-color:rgba(0,210,255,0.9);border-radius:50%;animation:spin 1s linear infinite;flex-shrink:0;"></span>
            AI가 사주를 분석하고 있습니다... (약 5초 소요)
          </div>
          <div style="height:6px;background:rgba(0,210,255,0.08);border-radius:4px;overflow:hidden;">
            <div style="height:100%;width:40%;background:linear-gradient(90deg,transparent,rgba(0,210,255,0.4),transparent);animation:shimmer 1.5s ease-in-out infinite;border-radius:4px;"></div>
          </div>
        </div>`}</div>
    </div>`,V=new Date().getFullYear(),te=((ee=(i=e.samjae)==null?void 0:i.groups)==null?void 0:ee.some(c=>c.some(h=>Math.abs(h.year-V)<=1)))?(()=>{const c=e.samjae.groups.find(B=>B.some(y=>Math.abs(y.year-V)<=1))||[],h=c.find(B=>Math.abs(B.year-V)<=1),F=(h==null?void 0:h.year)<V?"들삼재 마무리 단계":(h==null?void 0:h.year)===V?"눌삼재(삼재 중반)":"날삼재(삼재 마무리)";return`<div style="background:rgba(220,50,50,0.1);border:1.5px solid rgba(220,80,80,0.4);border-radius:14px;padding:16px 18px;display:flex;gap:12px;align-items:flex-start;">
      <span style="font-size:24px;">⚠️</span>
      <div>
        <div style="font-size:14px;font-weight:800;color:#ff8080;margin-bottom:4px;">현재 삼재(三災) 기간</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.75);line-height:1.6;">
          ${c.map((B,y)=>`<span>${B.year}년(${["들삼재","눌삼재","날삼재"][y]})</span>`).join(" → ")}<br>
          현재: <strong style="color:#ff8080;">${F}</strong> — 사주 풀이 하단의 삼재 주의사항을 확인하세요.
        </div>
      </div>
    </div>`})():"";E.innerHTML=`
    <div class="detail-nav-row" style="margin-bottom:16px;">
      <button class="home-btn" id="saju-go-home">🏠 처음으로</button>
    </div>
    <div class="saju-page-wrap">
      <div id="saju-noprint-top">${te}</div>
      ${u}
      ${rt(e)}
      ${st(e,a)}
      <div id="saju-noprint-bottom">${N}${L}</div>
    </div>`,E.scrollIntoView({behavior:"smooth",block:"start"}),(se=document.getElementById("saju-go-home"))==null||se.addEventListener("click",()=>{var h;E.classList.add("hidden"),E.innerHTML="";const c=document.getElementById("match-form");c&&(c.style.display=""),(h=document.getElementById("app"))==null||h.scrollIntoView({behavior:"smooth",block:"start"})}),(xe=document.getElementById("saju-download-btn"))==null||xe.addEventListener("click",()=>{var me,s;const c=a.calendarType==="lunar"?"음력":"양력",h=`${a.hour}시${a.minute>0?" "+a.minute+"분":""}`,F=`사주 풀이 — ${c} ${a.year}년 ${a.month}월 ${a.day}일 ${h}`,B=(f==null?void 0:f.results)||[],y=B.slice(0,5).map((d,x)=>{var g;const M=d.temple||{},v=(g=d.detail)==null?void 0:g.distanceKm;return`<div class="p-temple"><span class="p-rank">${x+1}위</span> <strong>${M.name||""}</strong><br>
       <span class="p-addr">${M.address||""}</span>${v!=null?" · "+(v<1?(v*1e3).toFixed(0)+"m":v.toFixed(1)+"km"):""}
       &nbsp;${d.score||""}점</div>`}).join(""),re=e.eightChar?[{l:"시(時)",c:e.eightChar.time,w:e.eightChar.timeWx},{l:"일(日)",c:e.eightChar.day,w:e.eightChar.dayWx},{l:"월(月)",c:e.eightChar.month,w:e.eightChar.monthWx},{l:"년(年)",c:e.eightChar.year,w:e.eightChar.yearWx}]:[],pe={목:"#2e7d32",화:"#c62828",토:"#e65100",금:"#455a64",수:"#1565c0"},ge={木:"목",火:"화",土:"토",金:"금",水:"수"},ue=re.length?`
      <table class="p-table">
        <tr><th>구분</th>${re.map(d=>`<th>${d.l}</th>`).join("")}</tr>
        <tr><td>천간</td>${re.map(d=>{var v;const x=[...d.w].map(g=>ge[g]).filter(Boolean);return`<td style="color:${pe[x[0]]||"#333"};font-size:26px;font-weight:900;">${((v=d.c)==null?void 0:v[0])||""}</td>`}).join("")}</tr>
        <tr><td>지지</td>${re.map(d=>{var v;const x=[...d.w].map(g=>ge[g]).filter(Boolean);return`<td style="color:${pe[x[0]]||"#333"};font-size:26px;font-weight:900;">${((v=d.c)==null?void 0:v[1])||""}</td>`}).join("")}</tr>
        <tr><td>오행</td>${re.map(d=>`<td style="font-size:12px;">${[...d.w].map(M=>ge[M]).filter(Boolean).join("·")}</td>`).join("")}</tr>
      </table>`:"",ae=(s=(me=e.daYun)==null?void 0:me.list)==null?void 0:s.find(d=>d.isCurrent);`${F}${F}${new Date().toLocaleDateString("ko-KR")}${ue}`,B.length&&`${y}`,`${C.replace(/class="saju-explain-heading"/g,'class="explain-heading"')}`,ae&&`${e.daYun.direction}${e.daYun.startAge}${e.daYun.list.map(d=>`
          <div class="dayun-chip ${d.isCurrent?"current":""}">
            ${d.isCurrent?"▶ ":""}${d.startAge}세 ${d.ganZhi}
          </div>`).join("")}`,window.print()}),(_=document.getElementById("retry-match-btn"))==null||_.addEventListener("click",async()=>{const c=document.getElementById("retry-match-btn");c.textContent="탐색 중...",c.disabled=!0;try{const{userLat:h,userLng:F}=await Ne(),y=await(await fetch("/api/match",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({birthInput:a,userLat:h,userLng:F,purpose:"healing"})})).json();y.error||We(e,a,y,A)}catch{c.textContent="🔄 다시 찾기",c.disabled=!1}})}function Le(e,a,f,A){var me;const E=document.getElementById("results");E.classList.remove("hidden");const p=document.getElementById("match-form");p&&(p.style.display="none");const m=e.temple||{},$=e.detail||{},n=e.score||0,t={목:{c:"#4ADE80",r:"74,222,128"},화:{c:"#FB923C",r:"251,146,60"},토:{c:"#FACC15",r:"250,204,21"},금:{c:"#F0C060",r:"240,192,96"},수:{c:"#38BDF8",r:"56,189,248"}},z=t[$.templeOhaeng]||t.금,w=z.c,l=z.r,j={info:{c:"#60A5FA",r:"96,165,250"},loc:{c:"#F87171",r:"248,113,113"},ohaeng:{c:w,r:l},reason:{c:"#C084FC",r:"192,132,252"},purpose:{c:w,r:l},guide:{c:"#34D399",r:"52,211,153"},gido:{c:"#FCD34D",r:"252,211,77"},date:{c:"#818CF8",r:"129,140,248"},dist:{c:w,r:l}};function S(s,d,x){return'<div class="ds-card" style="background:rgba('+s.r+",0.06);border:1px solid rgba("+s.r+",0.22);border-left:4px solid "+s.c+';border-radius:16px;padding:20px 20px 20px 22px;margin-bottom:12px;"><div style="font-size:14px;font-weight:800;color:'+s.c+";margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba("+s.r+',0.2);letter-spacing:.05em;">'+d+'</div><div style="font-size:14px;color:#E2E8F0;line-height:1.9;">'+x+"</div></div>"}const J={목:"🌿",화:"🔥",토:"🌍",금:"✨",수:"💧"},ne={목:"성장·창의·도전",화:"열정·명예·활력",토:"안정·신뢰·중심",금:"결실·의지·재물",수:"지혜·학업·직관"},b={목:"새로운 일을 시작하거나 창의적인 활동에 힘을 불어넣어 줍니다.",화:"이름을 알리고 사람들 사이에서 빛나게 해주는 기운입니다.",토:"흔들리는 마음을 안정시키고 근본을 다지게 해줍니다.",금:"결실을 맺고 재물과 의지력을 강화시켜 줍니다.",수:"지혜와 직관을 높여주고 학업·시험에 도움이 됩니다."},k=J[$.templeOhaeng]||"✦",N=a?a.distribution||{}:{},L=a&&a.purpose||"",C=a?a.purposeGuide||[]:[],u=a?a.recommendedDates||[]:[],V=f?u.length:Math.min(3,u.length),T=m.history||"",te=f?T:T.length>120?T.slice(0,120)+'… <span style="color:rgba(255,255,255,0.35);font-size:12px;">🔒 전체보기는 멤버 전용</span>':T||"정보 없음",W="https://map.naver.com/v5/search/"+encodeURIComponent((m.name||"")+" "+(m.address||"")),D=$.distanceKm!=null?$.distanceKm<1?Math.round($.distanceKm*1e3)+"m":$.distanceKm.toFixed(1)+"km":"정보 없음",I=e.weather?'<div style="display:inline-flex;align-items:center;gap:7px;background:rgba(56,189,248,0.15);border:1px solid rgba(56,189,248,0.4);border-radius:20px;padding:5px 14px;font-size:13px;color:#7DD3FA;margin-top:10px;">🌤 <b>'+e.weather.condition+"</b>&nbsp;"+e.weather.temp+"°C</div>":"";let i='<div class="temple-detail-page">';i+="<style>.ds-card{transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease;cursor:default;}.ds-card:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(0,0,0,.35);border-color:rgba(255,255,255,0.28) !important;}.ds-card:hover .ds-title{letter-spacing:.07em;}#detail-back-btn:hover{background:rgba(255,255,255,0.16);}.detail-date-card{transition:transform .15s,box-shadow .15s;}.detail-date-card:hover{transform:translateY(-4px) scale(1.06);box-shadow:0 8px 24px rgba(0,0,0,.4);}</style>",i+='<button id="detail-back-btn" style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.8);border-radius:20px;padding:8px 18px;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:18px;transition:background .15s;">← 목록으로</button>',i+='<div id="detail-hero" style="position:relative;overflow:hidden;background:linear-gradient(160deg,rgba('+l+",0.18) 0%,rgba(0,0,0,0) 70%);border:1px solid rgba("+l+",0.35);border-top:3px solid "+w+';border-radius:22px;padding:28px 22px 22px;margin-bottom:16px;text-align:center;">',i+='<div id="detail-hero-img" style="position:absolute;inset:0;background-size:cover;background-position:center top;border-radius:22px;opacity:0;transition:opacity .6s ease;"></div>',i+='<div id="detail-hero-overlay" style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,10,25,0.55) 0%,rgba(5,10,25,0.82) 100%);border-radius:22px;opacity:0;transition:opacity .6s ease;"></div>',i+='<div style="position:relative;z-index:1;">',i+='<div style="font-size:11px;letter-spacing:.2em;color:'+w+';text-transform:uppercase;margin-bottom:8px;font-weight:700;opacity:.9;">'+k+"  "+($.templeOhaeng||"")+"(오행) · "+(ne[$.templeOhaeng]||"")+"</div>",i+='<div style="font-size:clamp(28px,5vw,40px);font-weight:900;color:#fff;margin-bottom:6px;letter-spacing:-.5px;text-shadow:0 0 30px rgba('+l+',.4);">'+(m.name||"사찰")+"</div>",m.foundedYear&&(i+='<div style="font-size:12px;color:rgba(255,255,255,0.35);margin-bottom:4px;">창건 '+m.foundedYear+"년</div>"),i+=I,i+='<div style="margin-top:18px;">',i+='<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;"><span style="color:rgba(255,255,255,0.45);">인연 매칭 점수</span><span style="color:'+w+';font-weight:800;font-size:15px;">'+n+"점</span></div>",i+='<div style="height:10px;background:rgba(0,0,0,0.4);border-radius:5px;overflow:hidden;">',i+='<div style="height:100%;width:'+Math.min(n,100)+"%;background:linear-gradient(90deg,"+w+" 0%,#fff 120%);border-radius:5px;box-shadow:0 0 12px rgba("+l+',.7);"></div>',i+="</div></div></div></div>",i+='<div id="temple-gallery" style="display:none;margin-bottom:14px;"><div style="font-size:13px;font-weight:800;color:rgba(255,255,255,0.5);margin-bottom:8px;letter-spacing:.08em;">📷 사찰 사진</div><div id="gallery-scroll" style="display:flex;gap:10px;overflow-x:auto;padding-bottom:8px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.15) transparent;"></div></div>';const ee=j.info;i+='<div class="ds-card" style="background:rgba('+ee.r+",0.06);border:1px solid rgba("+ee.r+",0.22);border-left:4px solid "+ee.c+';border-radius:16px;padding:20px 20px 20px 22px;margin-bottom:12px;">',i+='<div style="font-size:14px;font-weight:800;color:'+ee.c+";margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid rgba("+ee.r+',0.2);letter-spacing:.05em;">🏯 사찰 기본 정보</div>',i+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">',i+='<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;">',i+='<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:6px;letter-spacing:.1em;">🧭 방위</div>',i+='<div style="font-size:16px;font-weight:800;color:#E2E8F0;">'+($.bearing||"—")+"</div></div>",i+='<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;">',i+='<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:6px;letter-spacing:.1em;">📏 거리</div>',i+='<div style="font-size:16px;font-weight:800;color:#E2E8F0;">'+D+"</div></div>",i+='<div style="background:rgba('+l+",0.1);border:1px solid rgba("+l+',0.35);border-radius:12px;padding:14px;">',i+='<div style="font-size:11px;color:rgba('+l+',.6);margin-bottom:6px;letter-spacing:.1em;">'+k+" 오행 기운</div>",i+='<div style="font-size:15px;font-weight:800;color:'+w+';">'+($.templeOhaeng||"—")+" · "+(ne[$.templeOhaeng]||"—")+"</div></div>",i+='<div style="background:rgba('+l+",0.1);border:1px solid rgba("+l+',0.35);border-radius:12px;padding:14px;">',i+='<div style="font-size:11px;color:rgba('+l+',.6);margin-bottom:6px;letter-spacing:.1em;">⭐ 매칭 점수</div>',i+='<div style="font-size:16px;font-weight:800;color:'+w+';">'+n+"점</div></div>",i+="</div></div>",function(){var s=(m.history||"")+" "+(m.name||""),d=[];/조계종/.test(s)?d.push({icon:"⛩️",label:"대한불교 조계종",color:"#34D399",r:"52,211,153"}):/태고종/.test(s)?d.push({icon:"⛩️",label:"한국불교 태고종",color:"#818CF8",r:"129,140,248"}):/천태종/.test(s)?d.push({icon:"⛩️",label:"천태종",color:"#38BDF8",r:"56,189,248"}):/진각종/.test(s)&&d.push({icon:"⛩️",label:"진각종",color:"#FB923C",r:"251,146,60"});var x=null;if(m.foundedYear){var M=parseInt(m.foundedYear);M<668?x={icon:"🏺",label:"삼국시대 고찰",color:"#F472B6",r:"244,114,182"}:M<935?x={icon:"🏛️",label:"통일신라 고찰",color:"#FBBF24",r:"251,191,36"}:M<1392?x={icon:"🏯",label:"고려시대 고찰",color:"#FBBF24",r:"251,191,36"}:M<1897?x={icon:"🏯",label:"조선시대 사찰",color:"#94A3B8",r:"148,163,184"}:x={icon:"🕌",label:"근현대 사찰",color:"#94A3B8",r:"148,163,184"}}else/신라 (문무왕|진흥왕|경덕왕|흥덕왕|선덕왕|태종무열)/.test(s)?x={icon:"🏛️",label:"통일신라 고찰",color:"#FBBF24",r:"251,191,36"}:/고려/.test(s)&&!/조선/.test(s)?x={icon:"🏯",label:"고려시대 고찰",color:"#FBBF24",r:"251,191,36"}:/신라/.test(s)&&!/고려|조선/.test(s)?x={icon:"🏛️",label:"신라 고찰",color:"#FBBF24",r:"251,191,36"}:/조선/.test(s)&&(x={icon:"🏯",label:"조선시대 사찰",color:"#94A3B8",r:"148,163,184"});if(x&&d.push(x),/국보 제?\d+호|국보[가-힣 ]*제?\d+/.test(s)?d.push({icon:"🏆",label:"국보 보유",color:"#FBBF24",r:"251,191,36"}):/보물 제?\d+호|보물[가-힣 ]*제?\d+/.test(s)&&d.push({icon:"💎",label:"보물 보유",color:"#D4AF37",r:"212,175,55"}),/사적 제?\d+호|사적지/.test(s)&&d.push({icon:"📜",label:"사적지",color:"#94A3B8",r:"148,163,184"}),/원효대사|원효/.test(s)?d.push({icon:"🧘",label:"원효대사 창건",color:"#818CF8",r:"129,140,248"}):/의상대사|의상/.test(s)&&d.push({icon:"🧘",label:"의상대사 창건",color:"#818CF8",r:"129,140,248"}),/임진왜란|병자호란|의병/.test(s)&&d.push({icon:"🛡️",label:"호국불교",color:"#FB923C",r:"251,146,60"}),/본사/.test(s)&&d.push({icon:"🏯",label:"교구 본사",color:"#F472B6",r:"244,114,182"}),/템플스테이/.test(s)&&d.push({icon:"🌙",label:"템플스테이",color:"#38BDF8",r:"56,189,248"}),!!d.length){var v='<div style="display:flex;flex-wrap:wrap;gap:8px;">'+d.map(function(g){return'<span style="display:inline-flex;align-items:center;gap:5px;background:rgba('+g.r+",0.12);border:1px solid rgba("+g.r+",0.35);color:"+g.color+';border-radius:20px;padding:6px 14px;font-size:12px;font-weight:700;">'+g.icon+" "+g.label+"</span>"}).join("")+"</div>";i+=S({r:"148,163,184",c:"#94A3B8"},"🏷️ 사찰 특징",v)}}();const se=j.loc;if(i+='<div class="ds-card" style="background:rgba('+se.r+",0.06);border:1px solid rgba("+se.r+",0.22);border-left:4px solid "+se.c+';border-radius:16px;padding:20px 20px 20px 22px;margin-bottom:12px;">',i+='<div style="font-size:14px;font-weight:800;color:'+se.c+";margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba("+se.r+',0.2);">📍 위치 &amp; 방문 안내</div>',m.address&&(i+='<div style="font-size:14px;color:#CBD5E1;margin-bottom:14px;line-height:1.7;">'+m.address+"</div>"),i+='<a href="'+W+'" target="_blank" rel="noopener" style="display:block;text-align:center;background:rgba('+se.r+",0.12);border:1px solid rgba("+se.r+",0.35);color:"+se.c+';border-radius:12px;padding:12px;font-weight:700;font-size:14px;text-decoration:none;">🗺️ 네이버 지도에서 길찾기</a>',i+="</div>",$.templeOhaeng&&b[$.templeOhaeng]){var xe={목:{env:"🌿 동쪽 · 숲·계곡",season:"봄(3~5월) 방문 최적",color:"#4ADE80",r:"74,222,128",detail:"생명력과 성장의 기운이 충만한 도량입니다. 울창한 수목과 맑은 물소리가 어우러져 마음을 새롭게 열어주며, 새로운 시작·가정화목·창의적 도전에 특히 좋습니다."},화:{env:"☀️ 남쪽 · 양지·온기",season:"여름(6~8월) 방문 최적",color:"#F97316",r:"249,115,22",detail:"밝고 따뜻한 불꽃 기운이 살아 숨쉬는 도량입니다. 햇살이 가득한 남향 터에 자리잡아 좋은 인연·명예·활력을 끌어당기는 강한 화(火) 에너지가 흐릅니다."},토:{env:"🏔️ 중앙 · 산중·평지",season:"환절기(3·9월) 방문 최적",color:"#FACC15",r:"250,204,21",detail:"대지의 안정된 기운이 깊게 뿌리내린 도량입니다. 든든하고 포근한 토(土) 에너지가 흔들리는 심신을 안정시키고, 건강·치유·신뢰 회복에 알맞습니다."},금:{env:"🍂 서쪽 · 산자락·바위",season:"가을(9~11월) 방문 최적",color:"#D4AF37",r:"212,175,55",detail:"결실과 의지의 금(金) 기운이 가득한 도량입니다. 가을 수확처럼 노력에 합당한 결실을 맺게 해주며, 재물운·결단력·성취를 기원하기에 최적의 터입니다."},수:{env:"💧 북쪽 · 계곡·고지",season:"겨울(12~2월) 방문 최적",color:"#38BDF8",r:"56,189,248",detail:"깊고 고요한 수(水) 기운이 흐르는 도량입니다. 북쪽 음기 속에서 집중력과 통찰력이 한층 깊어지며, 학업·시험·지혜·직관을 기원하는 기도에 가장 강한 터입니다."}},_=xe[$.templeOhaeng],c=_?'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;"><div style="background:rgba('+_.r+",0.10);border:1px solid rgba("+_.r+',0.3);border-radius:10px;padding:10px 12px;"><div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">자연 환경</div><div style="font-size:13px;font-weight:800;color:'+_.color+';">'+_.env+'</div></div><div style="background:rgba('+_.r+",0.10);border:1px solid rgba("+_.r+',0.3);border-radius:10px;padding:10px 12px;"><div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">최적 방문 시기</div><div style="font-size:13px;font-weight:800;color:'+_.color+';">'+_.season+'</div></div></div><div style="font-size:13px;color:#CBD5E1;line-height:1.8;">'+_.detail+"</div>":'<p style="margin:0;">'+b[$.templeOhaeng]+"</p>";i+=S(j.ohaeng,k+" "+$.templeOhaeng+"(오행) 기운 · 환경",c)}if(e.reason&&(i+=S(j.reason,"✨ 나와의 인연 이유",'<p style="margin:0;">'+e.reason+"</p>")),L){const s=j.purpose;i+='<div class="ds-card" style="background:rgba('+s.r+",0.06);border:1px solid rgba("+s.r+",0.22);border-left:4px solid "+s.c+';border-radius:16px;padding:20px 20px 20px 22px;margin-bottom:12px;">',i+='<div style="font-size:14px;font-weight:800;color:'+s.c+";margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba("+s.r+',0.2);">🎯 기도 목적</div>',i+='<span style="display:inline-block;background:rgba('+s.r+",0.18);border:1.5px solid rgba("+s.r+",0.5);color:"+s.c+';border-radius:24px;padding:9px 26px;font-weight:800;font-size:16px;">'+L+"</span>",i+="</div>"}if(Array.isArray(C)&&C.length){var h='<div style="display:flex;flex-direction:column;gap:12px;">'+C.map(function(s,d){var x=s.split(":"),M=x.length>1?x[0]+":":"",v=x.length>1?x.slice(1).join(":").trim():s;return'<div style="display:flex;gap:10px;align-items:flex-start;"><span style="flex:0 0 auto;width:24px;height:24px;border-radius:50%;background:rgba(52,211,153,0.18);border:1.5px solid rgba(52,211,153,0.4);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;color:#34D399;margin-top:1px;">'+(d+1)+'</span><div style="flex:1;">'+(M?'<span style="color:#34D399;font-weight:800;">'+M+"</span> ":"")+'<span style="color:#E2E8F0;">'+v+"</span></div></div>"}).join("")+"</div>";i+=S(j.guide,"🙏 이렇게 기도해보세요",h)}(function(){var s=$.templeOhaeng||"금",d=a&&a.targetOhaeng||a&&a.weak&&a.weak.부족오행||s,x=$.name||"",M=$.history||"",v=x+" "+M,g={대웅전:!0};/관음/.test(x)&&(g.관음전=!0),/약사/.test(x)&&(g.약사전=!0),/지장/.test(x)&&(g.지장전=!0),/나한/.test(x)&&(g.나한전=!0),/미타|극락/.test(x)&&(g.극락전=!0),/문수/.test(x)&&(g.문수전=!0),/비로|화엄/.test(x)&&(g.비로전=!0),/관음도량|관음전/.test(v)&&(g.관음전=!0),/약사전|약사여래/.test(v)&&(g.약사전=!0),/지장전|지장보살/.test(v)&&(g.지장전=!0),/나한전|오백나한/.test(v)&&(g.나한전=!0),/극락전|미타전|아미타/.test(v)&&(g.극락전=!0),/문수전|문수보살/.test(v)&&(g.문수전=!0),/총림|본사|대가람|대사찰|대본사/.test(v)&&(g.관음전=!0,g.약사전=!0,g.나한전=!0,g.지장전=!0);var Y={대웅전:{icon:"🏛️",color:"#FBBF24"},관음전:{icon:"🌸",color:"#F472B6"},약사전:{icon:"💊",color:"#34D399"},나한전:{icon:"🙏",color:"#FB923C"},지장전:{icon:"🕯️",color:"#94A3B8"},극락전:{icon:"🌅",color:"#818CF8"},문수전:{icon:"📚",color:"#38BDF8"},비로전:{icon:"☀️",color:"#FCD34D"}},X={재물운:{must:["대웅전"],want:["나한전","관음전","지장전"]},건강운:{must:["대웅전"],want:["약사전","관음전","나한전"]},학업운:{must:["대웅전"],want:["문수전","나한전","관음전"]},인연운:{must:["대웅전"],want:["관음전","나한전","지장전"]},가정운:{must:["대웅전"],want:["관음전","지장전","나한전"]},수험합격:{must:["대웅전"],want:["나한전","문수전","관음전"]},취업운:{must:["대웅전"],want:["나한전","관음전","지장전"]},출산기도:{must:["대웅전"],want:["관음전","약사전","지장전"]}},q={수:"관음전",목:"약사전",화:"대웅전",토:"지장전",금:"나한전"},U=X[L];if(!U)return;var H=[q[d],q[s]].concat(U.want).filter(function(ie,ve,Ee){return ie&&Ee.indexOf(ie)===ve}),de=[],P=[];H.forEach(function(ie){g[ie]?de.push(ie):P.push(ie)});var G=U.must.concat(de.filter(function(ie){return U.must.indexOf(ie)<0})),oe=P.slice(0,2),ce={대웅전:{재물운:'석가모니 부처님께 <strong style="color:#FBBF24;">삼배</strong>를 올리며 사업·재물의 번창을 발원합니다.',건강운:'나와 가족의 건강을 위해 <strong style="color:#FBBF24;">삼배</strong>와 함께 간절히 발원합니다.',학업운:'집중력·기억력이 높아지기를 <strong style="color:#FBBF24;">삼배</strong>로 발원합니다.',인연운:'좋은 인연이 이루어지도록 <strong style="color:#FBBF24;">삼배</strong>와 함께 진솔하게 발원합니다.',가정운:'가족 이름을 마음에 품고 <strong style="color:#FBBF24;">삼배</strong>로 가정의 평안을 발원합니다.',수험합격:'시험 날짜와 이름을 소원지에 적어 <strong style="color:#FBBF24;">삼배</strong>와 함께 올립니다.',취업운:'원하는 직장을 구체적으로 떠올리며 <strong style="color:#FBBF24;">삼배</strong>를 올립니다.',출산기도:'새 생명의 건강한 탄생을 위해 <strong style="color:#FBBF24;">삼배</strong>와 함께 발원합니다.'},관음전:{재물운:"관세음보살님께 자비로운 풍요와 기회를 열어달라고 발원합니다.",건강운:"관세음보살님의 치유 자비력으로 몸과 마음의 회복을 빕니다.",학업운:"관세음보살님께 지혜의 문이 열리기를 간청합니다.",인연운:"관음보살님은 인연의 보살. 좋은 만남이 이루어지도록 발원하세요.",가정운:"가족 모두의 건강과 화목을 관세음보살님께 빕니다.",수험합격:"시험장에서 침착하고 자신 있게 실력을 발휘할 수 있도록 빕니다.",취업운:"좋은 직장과의 인연이 열리도록 관세음보살님께 발원합니다.",출산기도:"관음보살님은 산모와 아기를 보살펴 주시는 분. 정성껏 발원하세요."},약사전:{재물운:"약사여래님의 지혜 기운으로 재물이 바르게 쌓이기를 발원합니다.",건강운:'약사여래 부처님께 <strong style="color:#34D399;">질병 치유와 건강 회복</strong>을 간절히 발원합니다.',학업운:"약사여래님의 맑은 기운으로 머리가 밝아지기를 빕니다.",인연운:"몸과 마음이 건강해야 좋은 인연도 옵니다. 건강 발원 후 인연을 비세요.",가정운:"가족 모두의 건강을 약사여래 부처님께 발원합니다.",수험합격:"시험 당일 컨디션이 최상이 되기를 약사여래님께 빕니다.",취업운:"건강한 몸과 마음으로 취업 준비에 임할 수 있도록 발원합니다.",출산기도:"산모와 아기의 건강을 약사여래 부처님께 특별히 발원하세요."},나한전:{재물운:"오백 나한님 중 내 소원을 들어줄 나한을 찾아 재물운을 빕니다.",건강운:"나한님께 나와 가족의 회복을 소원합니다. 내 이름을 불러주세요.",학업운:"오백 나한님 중 학업을 이뤄준 나한을 찾아 합격을 발원합니다.",인연운:"나한님께 좋은 인연을 맺어달라는 소원을 올립니다.",가정운:"가정의 평화를 이루어줄 나한님께 소원을 올립니다.",수험합격:"오백 나한님 중 합격을 도운 나한을 찾아 간절히 소원을 올립니다.",취업운:"취업의 기회를 열어줄 나한님께 소원을 올립니다.",출산기도:"새 생명을 맞이할 수 있도록 나한님께 소원을 올립니다."},지장전:{재물운:"지장보살님께 사업의 기반을 튼튼히 해달라고 발원합니다.",건강운:"조상과 가족의 업장을 소멸하여 건강이 회복되기를 빕니다.",학업운:"조상님의 가호로 학업이 이루어지기를 지장보살님께 발원합니다.",인연운:"인연의 장애를 풀어달라고 지장보살님께 발원합니다.",가정운:"조상과 가족 모두가 평안하도록 지장보살님께 발원합니다.",수험합격:"합격을 가로막는 업장이 소멸되기를 지장보살님께 빕니다.",취업운:"취업을 막는 장애가 사라지도록 지장보살님께 발원합니다.",출산기도:"순산과 아이의 안녕을 지장보살님께 발원합니다."},극락전:{재물운:"아미타 부처님의 자비 원력으로 풍요로운 삶을 발원합니다.",건강운:"아미타 부처님께 건강과 장수를 발원합니다.",학업운:"아미타 부처님의 지혜 광명이 학업에 비추기를 발원합니다.",인연운:"아미타 부처님의 원력으로 좋은 인연이 이루어지기를 빕니다.",가정운:"아미타 부처님께 가정의 평화와 행복을 발원합니다.",수험합격:"아미타 부처님의 원력으로 시험에서 실력 발휘를 발원합니다.",취업운:"아미타 부처님의 자비 원력으로 취업의 기회가 열리기를 빕니다.",출산기도:"아미타 부처님께 새 생명의 탄생을 발원합니다."},문수전:{학업운:"지혜의 문수보살님께 학업 성취와 총명함을 간절히 발원합니다.",수험합격:"문수보살님은 지혜의 상징. 시험 합격을 간절히 발원하세요.",취업운:"문수보살님의 지혜로 취업의 방향이 열리기를 발원합니다.",재물운:"문수보살님의 지혜로 바른 재물운이 열리기를 발원합니다.",건강운:"문수보살님의 지혜 기운으로 건강이 회복되기를 빕니다.",인연운:"지혜로운 문수보살님께 좋은 인연이 이루어지기를 발원합니다.",가정운:"문수보살님의 지혜로 가정이 화목해지기를 발원합니다.",출산기도:"문수보살님의 지혜 기운으로 건강한 아이가 태어나기를 빕니다."}};function be(ie,ve){var Ee=Y[ie]||{icon:"🏯",color:"#94A3B8"},$e=ce[ie]||{},ke=$e[L]||ie+"에서 정성껏 기도를 올립니다.",je=ve?'<span style="font-size:10px;background:rgba(148,163,184,0.2);color:#94A3B8;border-radius:4px;padding:2px 6px;margin-left:6px;vertical-align:middle;">있는 경우</span>':"";return'<div style="display:flex;gap:12px;align-items:flex-start;background:rgba(255,255,255,0.04);border-radius:12px;padding:12px 14px;border:1px solid '+(ve?"rgba(255,255,255,0.05)":"rgba(255,255,255,0.1)")+";opacity:"+(ve?"0.7":"1")+';"><div style="flex:0 0 auto;width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:center;font-size:20px;">'+Ee.icon+'</div><div style="flex:1;"><div style="font-size:14px;font-weight:800;color:'+Ee.color+';margin-bottom:4px;">'+ie+je+'</div><div style="font-size:13px;color:#CBD5E1;line-height:1.6;">'+ke+"</div></div></div>"}var he='<div style="display:flex;flex-direction:column;gap:10px;">';G.forEach(function(ie){he+=be(ie,!1)}),oe.forEach(function(ie){he+=be(ie,!0)}),he+="</div>",i+=S({r:"251,191,36",c:"#FBBF24"},"🏯 방문할 전각 안내",he)})(),function(){var s=[{icon:"🙏",label:"삼배 방법",color:"#34D399",desc:'<strong style="color:#34D399;">합장(두 손 모음)</strong> 후 무릎을 꿇고 이마를 바닥에 댑니다. 총 세 번 반복 — 불(佛)·법(法)·승(僧) 삼보에 귀의하는 예입니다.'},{icon:"👘",label:"복장",color:"#818CF8",desc:'<strong style="color:#818CF8;">단정한 복장</strong>을 권장합니다. 민소매·짧은 반바지는 피하고, 실내 전각 입장 시 모자를 벗으세요.'},{icon:"🤫",label:"경내 예절",color:"#38BDF8",desc:'<strong style="color:#38BDF8;">사진 촬영</strong>은 스님이나 안내판을 확인 후 허용된 곳에서만. 목소리를 낮추고 뛰지 않습니다.'},{icon:"🧎",label:"스님 만남",color:"#F472B6",desc:'스님께는 <strong style="color:#F472B6;">합장 반배(고개를 30° 숙임)</strong>로 인사드립니다. 악수보다 합장이 예의입니다.'},{icon:"🕯️",label:"소원지·불전",color:"#FBBF24",desc:'<strong style="color:#FBBF24;">소원지</strong>는 이름·생년월일·소원을 적어 담당 스님 혹은 지정함에 제출합니다. 불전함(헌금)은 자유입니다.'}],d=[{icon:"🌅",label:"새벽 예불",color:"#FB923C",desc:'보통 <strong style="color:#FB923C;">새벽 4~5시</strong>에 진행됩니다. 일반인도 조용히 참관 가능하며, 하루 중 가장 청정한 기운을 받을 수 있습니다.'},{icon:"🍚",label:"사찰 공양",color:"#34D399",desc:'일부 사찰에서 <strong style="color:#34D399;">점심 공양(무료 또는 소액)</strong>을 제공합니다. 방문 전 전화로 확인하고 감사한 마음으로 참여하세요.'},{icon:"📿",label:"108배",color:"#818CF8",desc:'<strong style="color:#818CF8;">108번의 절</strong>은 108가지 번뇌를 끊는 수행입니다. 법당 한편에서 매트를 빌려 할 수 있는 사찰도 있습니다.'},{icon:"🌿",label:"템플스테이",color:"#38BDF8",desc:'1박 이상 머물며 스님과 함께 생활하는 <strong style="color:#38BDF8;">템플스테이</strong>를 운영하는 사찰이 많습니다. 한국불교문화사업단 앱에서 예약 가능합니다.'}],x='<div style="display:flex;flex-direction:column;gap:10px;">'+s.map(function(v){return'<div style="display:flex;gap:10px;align-items:flex-start;"><div style="flex:0 0 auto;width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;font-size:16px;margin-top:1px;">'+v.icon+'</div><div style="flex:1;"><div style="font-size:13px;font-weight:800;color:'+v.color+';margin-bottom:3px;">'+v.label+'</div><div style="font-size:13px;color:#CBD5E1;line-height:1.6;">'+v.desc+"</div></div></div>"}).join("")+"</div>",M='<div style="display:flex;flex-direction:column;gap:10px;">'+d.map(function(v){return'<div style="display:flex;gap:10px;align-items:flex-start;"><div style="flex:0 0 auto;width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;font-size:16px;margin-top:1px;">'+v.icon+'</div><div style="flex:1;"><div style="font-size:13px;font-weight:800;color:'+v.color+';margin-bottom:3px;">'+v.label+'</div><div style="font-size:13px;color:#CBD5E1;line-height:1.6;">'+v.desc+"</div></div></div>"}).join("")+"</div>";i+=S({r:"52,211,153",c:"#34D399"},"🙏 기도 예절",x),i+=S({r:"251,191,36",c:"#FBBF24"},"💡 방문 팁",M)}();const B=L?{재물운:function(s){return s+` 삼보님께 귀의합니다.

자비하신 부처님, 오늘 저는 `+s+`의 금(金) 기운이 가득한 이 도량에서 간절히 발원하오니,
저의 부족한 재물운이 열려 정직하고 성실한 노력에 합당한 결실을 맺게 하여 주시옵소서.
헛된 탐욕이 아닌, 가족과 이웃이 함께 나눌 수 있는 올바른 재물이 넘쳐흘러
삶이 안온하게 하여 주시옵소서.
제가 얻은 것으로 보시하고 덕을 쌓아 더 큰 복으로 돌아오게 하여 주시옵소서.

나무아미타불 관세음보살.`},건강운:function(s){return s+` 삼보님께 귀의합니다.

자비하신 약사여래 부처님, 오늘 저는 `+s+`의 토(土) 기운이 깃든 이 청정 도량에서 발원하오니,
몸과 마음의 모든 병이 사라지고 건강한 기운이 충만하게 하여 주시옵소서.
바른 음식, 바른 생각, 바른 쉼으로 이 몸을 아끼고 사랑하여
오래도록 가족 곁에 있게 하여 주시옵소서.

나무약사유리광여래.`},학업운:function(s){return s+` 삼보님께 귀의합니다.

지혜의 문수보살님, 오늘 저는 `+s+`의 수(水) 기운이 흐르는 이 도량에서 간절히 발원하오니,
배움에 대한 집중력과 기억력이 밝아지고 깊은 지혜가 열리게 하여 주시옵소서.
목표한 결과를 이루게 하여 주시옵소서.

나무대지문수사리보살.`},인연운:function(s){return s+` 삼보님께 귀의합니다.

자비로우신 관세음보살님, 오늘 저는 `+s+`의 화(火) 기운이 충만한 이 도량에서 발원하오니,
저와 진정으로 인연이 맞는 소중한 사람과의 만남이 이루어지게 하여 주시옵소서.
서로 존중하고 아끼며 함께 성장하고 행복할 수 있는 깊은 인연을 맺게 하여 주시옵소서.

나무대자대비관세음보살.`},가정운:function(s){return s+` 삼보님께 귀의합니다.

자비하신 부처님, 오늘 저는 `+s+`의 목(木) 기운이 가득한 이 도량에서 온 가족을 위해 발원하오니,
저희 가정에 화목과 평안이 넘치게 하여 주시옵소서.
서로 배려하고 사랑하는 마음이 깊어지게 하여 주시옵소서.

나무아미타불.`},수험합격:function(s){return s+` 삼보님께 귀의합니다.

문수보살님, 오늘 저는 `+s+`의 화(火) 기운이 빛나는 이 도량에서 간절히 발원하오니,
다가오는 시험에서 저의 능력을 온전히 발휘하여 합격의 기쁨을 얻게 하여 주시옵소서.
침착하고 자신 있게 문제를 풀어낼 수 있도록 이끌어 주시옵소서.

나무석가모니불.`},취업운:function(s){return s+` 삼보님께 귀의합니다.

자비하신 부처님, 오늘 저는 `+s+`의 금(金) 기운이 빛나는 이 도량에서 발원하오니,
저의 능력과 열정을 알아봐 주는 좋은 직장과의 인연이 이루어지게 하여 주시옵소서.
취업 후에는 성실하게 일하며 성장하는 사람이 되겠습니다.

나무아미타불.`},출산기도:function(s){return s+` 삼보님께 귀의합니다.

자비하신 부처님과 칠성님께, 오늘 저는 `+s+`의 목(木) 기운이 가득한 이 도량에서 간절히 발원하오니,
건강하고 복된 새 생명이 저희 품에 안기게 하여 주시옵소서.
산모와 아기 모두 건강하게 하여 주시옵소서.

나무관세음보살.`}}[L]:null;if(B){const s=B(m.name||"이 사찰"),d=j.gido;f?(i+='<div class="ds-card" style="background:rgba('+d.r+",0.07);border:1px solid rgba("+d.r+",0.25);border-left:4px solid "+d.c+';border-radius:16px;padding:20px 20px 20px 22px;margin-bottom:12px;">',i+='<div style="font-size:14px;font-weight:800;color:'+d.c+";margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba("+d.r+',0.2);">🕯️ 맞춤 기도문</div>',i+='<div style="font-size:14px;color:#E2E8F0;line-height:2.1;white-space:pre-line;background:rgba(0,0,0,0.2);border-radius:12px;padding:16px;">'+s+"</div>",i+='<button id="gido-copy-btn" style="margin-top:14px;display:inline-flex;align-items:center;gap:6px;background:rgba('+d.r+",0.15);border:1px solid rgba("+d.r+",0.4);color:"+d.c+';border-radius:14px;padding:9px 20px;font-size:13px;font-weight:700;cursor:pointer;">📋 기도문 복사</button>',i+='<textarea id="gido-raw" style="position:absolute;left:-9999px;opacity:0;" readonly>'+s+"</textarea>",i+="</div>"):(i+='<div class="ds-card" style="background:rgba('+d.r+",0.07);border:1px solid rgba("+d.r+",0.25);border-left:4px solid "+d.c+';border-radius:16px;padding:20px 20px 20px 22px;margin-bottom:12px;">',i+='<div style="font-size:14px;font-weight:800;color:'+d.c+";margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba("+d.r+',0.2);">🕯️ 맞춤 기도문</div>',i+='<div style="font-size:14px;color:#94A3B8;line-height:2;background:rgba(0,0,0,0.2);border-radius:12px;padding:16px;filter:blur(2px);pointer-events:none;">'+s.slice(0,80)+"…</div>",i+='<div style="margin-top:14px;text-align:center;font-size:15px;font-weight:800;color:#1A1200;background:#FCD34D;border-radius:10px;padding:12px 16px;letter-spacing:.03em;">🔒 전체 기도문은 멤버십 전용입니다</div>',i+="</div>")}if(i+='<div id="history-section">'+(T?'<div class="ds-card" style="background:rgba(217,119,6,0.06);border:1px solid rgba(217,119,6,0.22);border-left:4px solid #D97706;border-radius:16px;padding:20px 20px 20px 22px;margin-bottom:12px;"><div style="font-size:14px;font-weight:800;color:#D97706;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba(217,119,6,0.2);">📜 유래 · 연혁</div><div id="history-body" style="font-size:14px;color:#E2E8F0;line-height:1.9;"><p style="margin:0;">'+te+"</p></div></div>":"")+"</div>",u.length>0){const s=j.date,d=["일","월","화","수","목","금","토"],x=u.slice(0,V).map(function(M){const v=M.date.split("-"),g=parseInt(v[1]),Y=parseInt(v[2]),X=new Date(parseInt(v[0]),g-1,Y).getDay(),q=d[X],U=X===0||X===6,H=M.dayOhaeng&&J[M.dayOhaeng[0]]||"✶",de=M.dayOhaeng&&t[M.dayOhaeng[0]]||t.금;return'<div class="detail-date-card" style="display:inline-flex;flex-direction:column;align-items:center;gap:5px;background:rgba('+de.r+",0.1);border:1px solid rgba("+de.r+',0.35);border-radius:16px;padding:14px 18px;margin:4px;min-width:74px;"><span style="font-size:20px;">'+H+'</span><span style="font-size:17px;font-weight:900;color:'+de.c+';">'+g+"/"+Y+'</span><span style="font-size:12px;color:'+(U?"#F87171":"rgba(255,255,255,0.6)")+';font-weight:600;">('+q+")</span>"+(M.dayOhaeng?'<span style="font-size:10px;color:'+de.c+';font-weight:700;">'+Array.from(M.dayOhaeng).join("·")+"일</span>":"")+"</div>"}).join("");i+='<div class="ds-card" style="background:rgba('+s.r+",0.06);border:1px solid rgba("+s.r+",0.22);border-left:4px solid "+s.c+';border-radius:16px;padding:20px 20px 20px 22px;margin-bottom:12px;">',i+='<div style="font-size:14px;font-weight:800;color:'+s.c+";margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba("+s.r+',0.2);">📅 추천 방문 날짜'+(f?"":'<span style="font-size:11px;font-weight:400;opacity:.45;margin-left:8px;">상위 3일 · 전체는 멤버 전용</span>')+"</div>",i+='<div style="display:flex;flex-wrap:wrap;gap:2px;">'+x+"</div>",!f&&u.length>=3&&(i+='<div style="margin-top:12px;font-size:12px;color:rgba(255,255,255,0.35);text-align:center;">🔒 멤버십 회원은 최대 15일 추천 날짜 제공</div>'),i+="</div>"}if(Object.keys(N).length>0){const s=j.dist,d=Object.entries(N).map(function([x,M]){const v=x===$.templeOhaeng,g=t[x]||t.금;return'<div style="display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:24px;margin:4px;font-weight:800;font-size:14px;background:rgba('+g.r+","+(v?"0.18":"0.07")+");border:1.5px solid rgba("+g.r+","+(v?"0.55":"0.2")+");color:"+(v?g.c:"rgba(255,255,255,0.55)")+";"+(v?"box-shadow:0 0 14px rgba("+g.r+",0.25);":"")+'">'+(J[x]||"")+" "+x+" "+M+(v?" ✦":"")+"</div>"}).join("");i+='<div class="ds-card" style="background:rgba('+s.r+",0.06);border:1px solid rgba("+s.r+",0.22);border-left:4px solid "+s.c+';border-radius:16px;padding:20px 20px 20px 22px;margin-bottom:12px;">',i+='<div style="font-size:14px;font-weight:800;color:'+s.c+";margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba("+s.r+',0.2);">🔥 나의 사주 오행 분포</div>',i+='<div style="display:flex;flex-wrap:wrap;gap:2px;margin-bottom:10px;">'+d+"</div>";var y=a?a.weak&&a.weak.부족오행:null,re=y&&y===$.templeOhaeng?'✦ 내 사주에서 가장 부족한 <b style="color:'+w+';">'+$.templeOhaeng+"</b> 기운을 이 사찰이 채워줍니다.":'✦ 이 사찰의 기운은 <b style="color:'+w+';">'+($.templeOhaeng||"")+"</b>으로, 선택하신 기도목적("+(L||"—")+")에 최적화된 도량입니다.";i+='<div style="font-size:12px;color:rgba(255,255,255,0.4);line-height:1.7;margin-top:6px;">'+re+"</div>",i+="</div>"}f||(i+='<div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.3);border-radius:16px;padding:28px 20px;margin-bottom:12px;text-align:center;">',i+='<div style="font-size:30px;margin-bottom:10px;">🔒</div>',i+='<div style="font-size:16px;font-weight:800;color:#D4AF37;margin-bottom:8px;">멤버십 전용 콘텐츠</div>',i+='<div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:18px;">유래 전문 · 추천 날짜 전체 · 기도문 전체 &amp; 복사</div>',i+='<div class="member-unlock"><input type="text" id="detail-member-code-input" placeholder="멤버십 코드 입력" /><button id="detail-member-code-btn">확인</button></div>',i+="</div>"),i+='<div class="patent-notice-banner" style="margin-bottom:12px;"><div class="patent-notice-icon">⚖️</div><div class="patent-notice-body"><div class="patent-notice-title">지식재산권 안내</div><div class="patent-notice-text">본 서비스의 <strong>인연 시너지 산출 로직</strong>은 비가산 시너지 기반 지수 산출 방식을 적용한 독자 기술입니다.</div><span class="patent-num">특허 출원 중 (출원번호: 40-2026-00*****)</span></div></div>',i+="</div>",E.innerHTML=i,function(){const d=m.name;if(!d)return;const x=document.getElementById("detail-hero-img"),M=document.getElementById("detail-hero-overlay"),v=document.getElementById("detail-hero");if(!x||!M)return;function g(P){if(!P)return!1;var G=P.toLowerCase();if(!/\.(jpe?g)/i.test(G))return!1;var oe=["flag","taegeuk","taeguk","portrait","map","document","signature","seal","coin","stamp","symbol","logo","icon","graph","chart","diagram","hangeul","hangul","korean_language","korea_map","location","emblem","crest","arms","건물","도로","지도","교통","버스","지하철","아파트"];return!oe.some(function(ce){return G.indexOf(ce)!==-1})}function Y(P){var G=new Image;G.onload=function(){G.naturalWidth<300||G.naturalHeight<200||(x.style.backgroundImage="url("+P+")",x.style.opacity="1",M.style.opacity="1",v&&(v.style.background="none"),x.style.cursor="zoom-in",x.onclick=function(){var oe=document.createElement("div");oe.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:99999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;";var ce=new Image;ce.src=P,ce.style.cssText="max-width:92vw;max-height:88vh;border-radius:12px;box-shadow:0 8px 48px #000;",oe.appendChild(ce),oe.onclick=function(){document.body.removeChild(oe)},document.body.appendChild(oe)})},G.src=P}var X={목:"linear-gradient(160deg,rgba(34,85,34,0.85) 0%,rgba(20,60,20,0.95) 100%)",화:"linear-gradient(160deg,rgba(120,40,10,0.85) 0%,rgba(80,20,5,0.95) 100%)",토:"linear-gradient(160deg,rgba(90,70,20,0.85) 0%,rgba(60,45,10,0.95) 100%)",금:"linear-gradient(160deg,rgba(90,70,10,0.85) 0%,rgba(60,45,5,0.95) 100%)",수:"linear-gradient(160deg,rgba(10,40,80,0.85) 0%,rgba(5,20,60,0.95) 100%)"};function q(){var P=$.templeOhaeng||"금",G=X[P]||X.금;v&&(v.style.background=G)}function U(P){return fetch("https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch="+encodeURIComponent(P)+"&srnamespace=6&srlimit=10&srprop=&format=json&origin=*").then(function(G){return G.ok?G.json():null}).then(function(G){if(!G||!G.query||!G.query.search)return[];var oe=G.query.search.map(function(be){return be.title}).filter(function(be){return/\.jpe?g$/i.test(be)}).slice(0,8);if(!oe.length)return[];var ce=oe.map(encodeURIComponent).join("%7C");return fetch("https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url%7Csize&iiurlwidth=900&titles="+ce+"&format=json&origin=*").then(function(be){return be.ok?be.json():null}).then(function(be){if(!be)return[];var he=be.query&&be.query.pages?be.query.pages:{};return Object.values(he).map(function(ie){return ie.imageinfo&&ie.imageinfo[0]}).filter(function(ie){return ie&&ie.thumburl&&g(ie.thumburl)&&(ie.width||0)>=400&&(ie.height||0)>=300})})}).catch(function(){return[]})}var H=!1;function de(P){return H||!P||!P.length?!1:(H=!0,Y(P[0].thumburl),!0)}fetch("https://ko.wikipedia.org/w/api.php?action=query&prop=pageimages|info&pithumbsize=900&titles="+encodeURIComponent(d)+"&format=json&origin=*").then(function(P){return P.ok?P.json():null}).then(function(P){if(!H&&P){var G=P.query&&P.query.pages?P.query.pages:{},oe=Object.values(G)[0];if(!(!oe||oe.missing!==void 0)){var ce=oe.thumbnail?oe.thumbnail.source:null;ce&&g(ce)&&(H=!0,Y(ce))}}}).catch(function(){}),setTimeout(function(){H||Promise.all([U(d+" 사찰"),U(d+" temple Korea")]).then(function(P){if(!H){var G=[].concat(P[0],P[1]);if(!de(G)){var oe=(m.address||"").split(" ").slice(0,2).join(" ");return oe?U(oe+" 불교 사찰"):Promise.resolve([])}}}).then(function(P){H||!P||de(P)||q()}).catch(function(){H||q()})},800)}(),function(){var d=document.getElementById("temple-gallery"),x=document.getElementById("gallery-scroll");if(!d||!x||!m.name)return;function M(g){if(!(!g||g.length===0)){var Y=g.map(function(X){var q=X.thumburl,U=q.replace(/\/\d+px-/,"/1200px-");return`<div style="flex:0 0 auto;width:160px;height:110px;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.12);cursor:pointer;transition:transform .2s,box-shadow .2s;" onmouseover="this.style.transform='scale(1.04)';this.style.boxShadow='0 6px 20px rgba(0,0,0,.5)'" onmouseout="this.style.transform='';this.style.boxShadow=''" data-src="`+U+`" onclick="(function(u){var ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:99999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';var im=new Image();im.src=u;im.style.cssText='max-width:92vw;max-height:88vh;border-radius:10px;box-shadow:0 8px 40px #000;';ov.appendChild(im);ov.onclick=function(){document.body.removeChild(ov);};document.body.appendChild(ov);})(this.dataset.src)"><img src="`+q+`" style="width:100%;height:100%;object-fit:cover;" loading="lazy" onerror="this.parentElement.style.display='none'"></div>`}).join("");x.innerHTML=Y,d.style.display="block"}}function v(g,Y){var X=Y.map(function(q){return encodeURIComponent(q)}).join("%7C");return fetch(g+"?action=query&prop=imageinfo&iiprop=url%7Csize&iiurlwidth=500&titles="+X+"&format=json&origin=*").then(function(q){return q.ok?q.json():null}).then(function(q){if(!q)return[];var U=q.query&&q.query.pages?q.query.pages:{};return Object.values(U).map(function(H){return H.imageinfo&&H.imageinfo[0]}).filter(function(H){if(!H||!H.thumburl||!/\.(jpe?g)/i.test(H.thumburl)||(H.width||0)<400||(H.height||0)<300)return!1;var de=H.thumburl.toLowerCase(),P=["taegeuk","taeguk","flag","portrait","map","document","signature","seal","coin","stamp","symbol","logo","icon","graph","chart","diagram","hangeul","hangul","emblem","crest","location","korea_map","korean_language","태극","지도","문서","초상","건물","도로","교통"];if(P.some(function(oe){return de.indexOf(oe)!==-1}))return!1;var G=(H.width||1)/(H.height||1);return!(G<.5||G>3.5)})})}fetch("https://ko.wikipedia.org/w/api.php?action=query&prop=pageprops&titles="+encodeURIComponent(m.name)+"&format=json&origin=*").then(function(g){return g.ok?g.json():null}).then(function(g){var Y=g&&g.query&&g.query.pages?g.query.pages:{},X=Object.values(Y)[0],q=X&&X.pageprops&&X.pageprops.commonsCategory;return q?fetch("https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle="+encodeURIComponent("Category:"+q)+"&cmtype=file&cmlimit=20&format=json&origin=*").then(function(U){return U.ok?U.json():null}).then(function(U){if(!U||!U.query)return null;var H=(U.query.categorymembers||[]).map(function(de){return de.title}).filter(function(de){return/\.jpe?g$/i.test(de)}).slice(0,10);return H.length?v("https://commons.wikimedia.org/w/api.php",H):null}):null}).then(function(g){return g&&g.length>=1?(M(g),Promise.resolve(!0)):fetch("https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch="+encodeURIComponent(m.name+" temple")+"&srnamespace=6&srlimit=16&srprop=&format=json&origin=*").then(function(Y){return Y.ok?Y.json():null}).then(function(Y){if(!Y||!Y.query||!Y.query.search)return null;var X=Y.query.search.map(function(q){return q.title}).filter(function(q){return/\.jpe?g$/i.test(q)}).slice(0,10);return X.length?v("https://commons.wikimedia.org/w/api.php",X):null})}).then(function(g){if(g===!0||g&&g.length>=1){g!==!0&&M(g);return}return fetch("https://ko.wikipedia.org/w/api.php?action=query&prop=images&titles="+encodeURIComponent(m.name)+"&imlimit=20&format=json&origin=*").then(function(Y){return Y.ok?Y.json():null}).then(function(Y){if(Y){var X=Y.query&&Y.query.pages?Y.query.pages:{},q=Object.values(X)[0];if(!(!q||!q.images)){var U=q.images.map(function(H){return H.title}).filter(function(H){return/\.jpe?g$/i.test(H)}).slice(0,10);if(U.length)return v("https://ko.wikipedia.org/w/api.php",U).then(function(H){H&&H.length>=1&&M(H)})}}})}).catch(function(){})}(),function(){if(m.name){var d=document.getElementById("history-section");document.getElementById("history-body"),!(T.length>=150)&&fetch("https://ko.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&exsentences=6&titles="+encodeURIComponent(m.name)+"&format=json&origin=*").then(function(x){return x.ok?x.json():null}).then(function(x){if(x){var M=x.query&&x.query.pages?x.query.pages:{},v=Object.values(M)[0],g=v&&v.extract?v.extract.trim():"";if(!(!g||g.length<30)&&d){var Y=(T?T+`

`:"")+g,X=f?Y:Y.slice(0,200)+(Y.length>200?'… <span style="color:rgba(255,255,255,0.35);font-size:12px;">🔒 전체보기는 멤버 전용</span>':"");d.innerHTML='<div class="ds-card" style="background:rgba(217,119,6,0.06);border:1px solid rgba(217,119,6,0.22);border-left:4px solid #D97706;border-radius:16px;padding:20px 20px 20px 22px;margin-bottom:12px;"><div style="font-size:14px;font-weight:800;color:#D97706;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba(217,119,6,0.2);">📜 유래 · 연혁 <span style="font-size:11px;font-weight:400;opacity:.45;margin-left:6px;">위키백과 참조</span></div><div style="font-size:14px;color:#E2E8F0;line-height:1.9;white-space:pre-line;">'+X+"</div></div>"}}}).catch(function(){})}}();const pe=document.getElementById("gido-copy-btn"),ge=document.getElementById("gido-raw");pe&&ge&&pe.addEventListener("click",function(){navigator.clipboard.writeText(ge.value).then(function(){pe.textContent="✓ 복사됨!",setTimeout(function(){pe.innerHTML="📋 기도문 복사"},2e3)}).catch(function(){ge.select(),document.execCommand("copy")})}),(me=document.getElementById("detail-back-btn"))==null||me.addEventListener("click",()=>{var s;typeof A=="function"?A():(E.innerHTML="",E.classList.add("hidden"),p&&(p.style.display=""),(s=document.getElementById("app"))==null||s.scrollIntoView({behavior:"smooth",block:"start"}))});const ue=document.getElementById("detail-member-code-btn"),ae=document.getElementById("detail-member-code-input");ue&&ue.addEventListener("click",()=>{ae&&ae.value.trim()===Ge?(Re(ae.value.trim()),Le(e,a,!0,A)):alert("코드가 올바르지 않습니다.")})}function Pe(e){var $,n;const a=document.getElementById("results");a.classList.remove("hidden");const f=(e.results||[])[0],A=it[($=f==null?void 0:f.detail)==null?void 0:$.bearing]??0,E=_e();a.innerHTML=`
    <div class="results-summary">
      <div class="label">나의 기운은</div>
      <div class="ohaeng-value">${e.targetOhaeng||""} 기운</div>
      <div class="ohaeng-breakdown">
        ${Object.entries(e.distribution||{}).map(([t,z])=>`${t} ${z}`).join(" · ")}
      </div>
    </div>

    <div style="display:flex;justify-content:center;margin:8px 0 16px;">
      <svg viewBox="0 0 120 120" width="100" height="100">
        <circle cx="60" cy="60" r="56" fill="none" stroke="rgba(0,210,255,0.2)" stroke-width="2"/>
        <circle cx="60" cy="60" r="48" fill="rgba(0,20,40,0.6)" stroke="rgba(0,210,255,0.25)" stroke-width="1"/>
        <text x="60" y="20" text-anchor="middle" fill="#FF6B6B" font-size="13" font-weight="700">N</text>
        <text x="100" y="64" text-anchor="middle" fill="rgba(0,210,255,0.7)" font-size="10" font-weight="700">E</text>
        <text x="60" y="108" text-anchor="middle" fill="rgba(0,210,255,0.7)" font-size="10" font-weight="700">S</text>
        <text x="20" y="64" text-anchor="middle" fill="rgba(0,210,255,0.7)" font-size="10" font-weight="700">W</text>
        <g transform="rotate(${A} 60 60)">
          <polygon points="60,18 64,58 60,62 56,58" fill="#FF6B6B"/>
          <polygon points="60,102 64,62 60,58 56,62" fill="rgba(255,255,255,0.3)"/>
        </g>
        <circle cx="60" cy="60" r="5" fill="rgba(0,210,255,0.8)"/>
      </svg>
    </div>

    <button id="home-btn" onclick="location.reload();" style="display:flex;align-items:center;gap:6px;background:rgba(0,210,255,0.07);border:1px solid rgba(0,210,255,0.3);border-radius:10px;padding:8px 16px;cursor:pointer;font-size:13px;font-weight:700;color:#00d2ff;margin:0 0 14px;">
      🏠 처음으로
    </button>

    ${E?"":`
      <div style="text-align:center;margin:-4px 0 14px;">
        <button id="demo-detail-btn" style="display:inline-flex;align-items:center;gap:7px;background:rgba(212,175,55,0.08);border:1.5px solid rgba(212,175,55,0.35);border-radius:20px;padding:9px 22px;color:rgba(212,175,55,0.9);font-size:13px;font-family:var(--sans);font-weight:600;cursor:pointer;">✨ 멤버십 상세페이지 미리보기</button>
      </div>
    `}

    ${E?`
      <div class="member-banner unlocked">✓ 잼공스토리 멤버십 — 전체 기능이 열려있습니다</div>
    `:`
      <div class="member-unlock">
        <input type="text" id="member-code-input" placeholder="멤버십 코드 입력 (선택)" />
        <button id="member-code-btn">확인</button>
      </div>
    `}

    ${e.purposeGuide?`
      <div class="prayer-guide">
        <div class="prayer-guide-label">🙏 이렇게 기도해보세요</div>
        <div class="prayer-guide-text">
          ${Array.isArray(e.purposeGuide)?`<ol class="prayer-steps">${e.purposeGuide.map(t=>`<li>${t}</li>`).join("")}</ol>`:e.purposeGuide}
        </div>
      </div>
    `:""}

    ${(e.results||[]).map((t,z)=>{var w;return`
      <div class="temple-card" style="--accent: ${tt[(w=t.detail)==null?void 0:w.templeOhaeng]||"var(--gold)"}; animation-delay: ${.15+z*.08}s;">
        <div class="temple-rank">${z+1}</div>
        <div class="temple-body">
          <h3>
            <a class="temple-name-link" href="${t.temple.lat&&t.temple.lng?`https://map.naver.com/v5/entry/coordinates/${t.temple.lng},${t.temple.lat}?placeName=${encodeURIComponent(t.temple.name)}&entry=plt`:`https://map.naver.com/v5/search/${encodeURIComponent(t.temple.name+" "+t.temple.address)}`}" target="_blank" rel="noopener">
              ${t.temple.name} <span class="map-icon">🗺️ 길찾기</span>
            </a>
          </h3>
          <div class="meta">매칭점수 ${t.score}점${t.temple.foundedYear?` · 창건 ${t.temple.foundedYear}`:""}${t.weather?` · 🌤️ ${t.weather.condition} ${t.weather.temp}°C`:""}</div>
          <div class="reason">${t.reason}</div>
          ${t.temple.history?`
            <div class="temple-detail">
              <div class="temple-detail-label">유래·연혁</div>
              <div class="temple-detail-text">
                ${E?t.temple.history:t.temple.history.length>35?`${t.temple.history.slice(0,35)}… <span class="member-lock-tag">🔒 전체보기는 멤버 전용</span>`:t.temple.history}
              </div>
              ${t.temple.address?`<div class="temple-detail-address">📍 ${t.temple.address}</div>`:""}
            </div>
          `:t.temple.address?`<div class="temple-detail-address" style="margin-top:8px;">📍 ${t.temple.address}</div>`:""}
          <button type="button" class="detail-view-btn" data-temple-index="${z}">상세페이지 보기 →</button>
        </div>
      </div>
    `}).join("")}

    ${e.recommendedDates&&e.recommendedDates.length?`
      <div class="calendar-card">
        <div class="calendar-title">🗓️ 좋은 방문 날짜 추천</div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${e.recommendedDates.map((t,z)=>`
            <div style="display:flex;align-items:center;gap:12px;background:rgba(0,210,255,0.07);border:1px solid rgba(0,210,255,0.2);border-radius:12px;padding:12px 16px;">
              <div style="min-width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#00b4d8,#0077b6);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;">${z+1}</div>
              <div>
                <div style="font-size:15px;font-weight:800;color:#00d2ff;letter-spacing:0.5px;">${t.date}</div>
                ${t.reason?`<div style="font-size:12px;color:rgba(200,230,255,0.7);margin-top:2px;">${t.reason}</div>`:""}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `:""}

    <div style="display:flex;gap:10px;margin:16px 0;">
      <button id="share-kakao-btn" style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;background:#FEE500;border:none;border-radius:14px;padding:14px;cursor:pointer;font-size:14px;font-weight:800;color:#3C1E1E;box-shadow:0 4px 16px rgba(254,229,0,0.35);transition:all .2s;">
        💬 카카오톡 공유
      </button>
      <button id="share-copy-btn" style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;background:rgba(0,210,255,0.1);border:1px solid rgba(0,210,255,0.3);border-radius:14px;padding:14px;cursor:pointer;font-size:14px;font-weight:700;color:#00d2ff;transition:all .2s;">
        🔗 링크 복사
      </button>
    </div>

    <div class="notice-box">
      <div class="notice-item">
        <span class="notice-icon">ℹ️</span>
        <span>${e.disclaimer||"본 결과는 사주 오행 이론을 바탕으로 한 참고 정보입니다."}</span>
      </div>
    </div>
  `;const p=document.getElementById("member-code-input"),m=document.getElementById("member-code-btn");m&&m.addEventListener("click",()=>{p&&p.value.trim()===Ge?(Re(p.value.trim()),Pe(e)):alert("코드가 올바르지 않습니다.")}),document.querySelectorAll(".detail-view-btn").forEach(t=>{t.addEventListener("click",()=>{const z=parseInt(t.dataset.templeIndex);Le(e.results[z],e,E)})}),function(){var b,k,N,L;var z=(b=e.results)==null?void 0:b[0],w=((k=z==null?void 0:z.temple)==null?void 0:k.name)||"인연사찰",l=(z==null?void 0:z.score)||"",j=e.purpose||"",S="https://jamgong-inyeonsachal.vercel.app",J='🏯 나의 인연사찰은 "'+w+`"!
오행 궁합 `+l+"점 매칭 ("+j+`)

내 사주에 맞는 사찰을 찾아보세요 👇
`+S,ne="내 인연사찰은 "+w+"! — 잼공인연사찰";(N=document.getElementById("share-kakao-btn"))==null||N.addEventListener("click",function(){var C;window.Kakao&&window.Kakao.isInitialized()?window.Kakao.Share.sendDefault({objectType:"feed",content:{title:ne,description:"오행 궁합 "+l+"점 매칭 ("+j+`)
내 사주에 맞는 사찰을 찾아보세요!`,imageUrl:"https://jamgong-inyeonsachal.vercel.app/og-image.png",link:{mobileWebUrl:S,webUrl:S}},buttons:[{title:"내 인연사찰 찾기",link:{mobileWebUrl:S,webUrl:S}}]}):navigator.share?navigator.share({title:ne,text:J,url:S}).catch(function(){}):(C=navigator.clipboard)==null||C.writeText(J).then(function(){alert(`카카오톡에 붙여넣기 하세요!

`+J)})}),(L=document.getElementById("share-copy-btn"))==null||L.addEventListener("click",function(){var u;var C=document.getElementById("share-copy-btn");(u=navigator.clipboard)==null||u.writeText(S).then(function(){C&&(C.textContent="✅ 복사됨!",setTimeout(function(){C.innerHTML="🔗 링크 복사"},2e3))}).catch(function(){alert("주소: "+S)})})}(),(n=document.getElementById("demo-detail-btn"))==null||n.addEventListener("click",()=>{Le({score:94,reason:"수(水) 기운이 부족한 사주에 이 사찰의 강한 수 기운이 보완해줍니다.",temple:{name:"통도사",address:"경상남도 양산시 하북면 통도사로 108",lat:35.489166,lng:129.058611,foundedYear:646},detail:{templeOhaeng:"수",bearing:"북",distanceKm:12.3},weather:{condition:"맑음",temp:24}},{purpose:"학업운",distribution:{목:1,화:2,토:2,금:2,수:1},targetOhaeng:"수",purposeGuide:[]},!0)}),a.scrollIntoView({behavior:"smooth"})}function at(e,a){const f={목:"화",화:"토",토:"금",금:"수",수:"목"},A={목:"토",토:"수",수:"화",화:"금",금:"목"},E={목:"木",화:"火",토:"土",금:"金",수:"水"},p={목:"#64DCA0",화:"#FF6B9D",토:"#FB923C",금:"#FFB347",수:"#00D2FF"};let m,$,n,t,z,w;const l=f[e]===a,j=f[a]===e,S=A[e]===a,J=A[a]===e;return l||j?(m=88,$="상생(相生)",n="천생연분(天生緣分)",t="#00D2FF",z="0,210,255",w="오행이 서로를 생(生)해주는 가장 이상적인 조합입니다. 단, 한쪽이 지나치게 의존하면 소진될 수 있습니다."):e===a?(m=68,$="비화(比和)",n="동질형(同質型)",t="#9FE5C4",z="159,229,196",w="같은 오행으로 서로를 잘 이해하지만, 동일한 약점을 함께 지닙니다. 외부 자극 없이는 정체될 수 있습니다."):S||J?(m=42,$="상극(相剋)",n="갈등형(葛藤型)",t="#F5A623",z="245,166,35",w="오행이 서로를 극(克)합니다. 긴장과 갈등이 잦을 수 있으며, 의식적인 노력 없이는 관계가 소모적이 될 수 있습니다."):(m=62,$="중화(中和)",n="평범형(平凡型)",t="#FF6B9D",z="255,107,157",w="특별히 맞거나 부딪히는 기운이 없는 평이한 조합입니다. 큰 시너지보다는 무난한 관계가 됩니다."),{score:m,relation:$,grade:n,color:t,rgb:z,comment:w,symA:E[e]||e,symB:E[a]||a,colA:p[e]||"#fff",colB:p[a]||"#fff"}}function lt(e){var Z,fe,Fe,Ce,o,ye,ze,Se,Me,Oe,Ie,De;const a=document.getElementById("results");a.classList.remove("hidden");const f=_e(),A=((Fe=(fe=(Z=e.pillarsA)==null?void 0:Z[2])==null?void 0:fe.wx)==null?void 0:Fe[0])||e.targetA,E=((ye=(o=(Ce=e.pillarsB)==null?void 0:Ce[2])==null?void 0:o.wx)==null?void 0:ye[0])||e.targetB,p=at(A,E),m=(e.hapChung||[]).filter(r=>r.positive).length,$=(e.hapChung||[]).filter(r=>!r.positive).length,n=m*4-$*7,t=Math.max(10,Math.min(99,p.score+n)),z=Math.round(t);window._sajuContext=null,window._gunghamContext={pillarsA:e.pillarsA,pillarsB:e.pillarsB,hapChung:e.hapChung,distributionA:e.distributionA,distributionB:e.distributionB,genderA:e.genderA,genderB:e.genderB,targetA:A,targetB:E,finalScore:t,relation:p.relation,grade:p.grade};const w={목:"#64DCA0",화:"#FF6B9D",토:"#FB923C",금:"#FFB347",수:"#00D2FF"},l={목:"木",화:"火",토:"土",금:"金",수:"水"};function j(r,O,R){return!r||r.length===0?"":`
    <div class="gh-pillar-col">
      <div class="gh-pillar-label" style="color:${R}">${O}</div>
      <table class="gh-saju-table">
        <thead><tr>${["년","월","일","시"].map(K=>`<th>${K}</th>`).join("")}</tr></thead>
        <tbody>
          <tr class="gh-row-stem">${r.map(K=>{var we;return`<td style="color:${w[(we=K.wx)==null?void 0:we[0]]||"#fff"}">${K.stem||""}</td>`}).join("")}</tr>
          <tr class="gh-row-branch">${r.map(K=>{var we,Be;return`<td style="color:${w[((we=K.wx)==null?void 0:we[1])||((Be=K.wx)==null?void 0:Be[0])]||"rgba(255,255,255,0.6)"}">${K.branch||""}</td>`}).join("")}</tr>
          <tr class="gh-row-wx">${r.map(K=>`<td>${(K.wx||[]).map(le=>`<span style="color:${w[le]||"#fff"}">${l[le]||le}</span>`).join("")}</td>`).join("")}</tr>
        </tbody>
      </table>
    </div>`}const S={甲己:{name:"중정합(中正合)",wx:"土",desc:"안정적이고 현실적인 결합입니다. 서로를 믿고 의지하는 관계로 장기적인 신뢰가 형성됩니다."},乙庚:{name:"인의합(仁義合)",wx:"金",desc:"원칙과 의리로 맺어진 관계입니다. 한 번 인연이 맺어지면 쉽게 끊어지지 않습니다."},丙辛:{name:"위제합(威制合)",wx:"水",desc:"강렬한 끌림의 결합입니다. 서로에게 매력을 느끼고 지략과 감각이 맞닿는 관계입니다."},丁壬:{name:"인수합(仁壽合)",wx:"木",desc:"인정 넘치고 창의적인 결합입니다. 감성이 잘 맞아 함께 성장하는 인연입니다."},戊癸:{name:"무정합(無情合)",wx:"火",desc:"열정적이고 활기찬 결합입니다. 역동적인 에너지를 서로에게서 끌어냅니다."}},J={子丑:{desc:"자축합(子丑合)으로 土의 기운이 생깁니다. 안정적이고 묵묵하게 함께하는 관계입니다."},寅亥:{desc:"인해합(寅亥合)으로 木의 기운이 생깁니다. 서로 성장을 돕는 따뜻한 인연입니다."},卯戌:{desc:"묘술합(卯戌合)으로 火의 기운이 생깁니다. 열정적인 감정의 교류가 있는 관계입니다."},辰酉:{desc:"진유합(辰酉合)으로 金의 기운이 생깁니다. 단단하고 현실적인 결합입니다."},巳申:{desc:"사신합(巳申合)으로 水의 기운이 생깁니다. 지략과 변화 속에서 교류하는 인연입니다."},午未:{desc:"오미합(午未合)으로 태양의 조화입니다. 가장 자연스럽고 따뜻한 결합 중 하나입니다."}},ne={甲庚:"갑경충(甲庚沖)입니다. 추진 방향이 정반대여서 충돌이 발생합니다. 한쪽이 밀면 다른 쪽이 버티는 구조입니다.",乙辛:"을신충(乙辛沖)입니다. 섬세한 감성과 날카로운 이성이 부딪힙니다. 표현 방식의 차이에서 갈등이 생깁니다.",丙壬:"병임충(丙壬沖)입니다. 화(火)와 수(水)의 충돌로 열정과 냉정이 부딪힙니다. 감정 기복이 심해질 수 있습니다.",丁癸:"정계충(丁癸沖)입니다. 감성과 직관이 서로를 견제합니다. 마음 속을 잘 드러내지 않아 오해가 생길 수 있습니다.",子午:"자오충(子午沖)입니다. 수(水)와 화(火)의 강렬한 충돌입니다. 감정적으로 과격해지기 쉽고 회복이 오래 걸립니다.",丑未:"축미충(丑未沖)입니다. 두 토(土)의 충돌로 고집이 부딪히는 구조입니다. 서로 자기 방식을 고수하려 합니다.",寅申:"인신충(寅申沖)입니다. 목(木)과 금(金)의 충돌입니다. 자유와 통제 사이에서 갈등이 자주 발생합니다.",卯酉:"묘유충(卯酉沖)입니다. 감성과 이성의 충돌입니다. 서로의 접근 방식이 달라 이해하는 데 시간이 필요합니다.",辰戌:"진술충(辰戌沖)입니다. 토(土) 간의 강한 충돌입니다. 양쪽 모두 쉽게 물러서지 않아 합의가 어렵습니다.",巳亥:"사해충(巳亥沖)입니다. 금(金)과 수(水) 사이의 충돌입니다. 방향과 가치관이 달라 이견이 자주 나타납니다."},b={甲:"목",乙:"목",丙:"화",丁:"화",戊:"토",己:"토",庚:"금",辛:"금",壬:"수",癸:"수"},k={甲:"양",丙:"양",戊:"양",庚:"양",壬:"양",乙:"음",丁:"음",己:"음",辛:"음",癸:"음"},N={목:"화",화:"토",토:"금",금:"수",수:"목"},L={목:"토",화:"금",토:"수",금:"목",수:"화"},C={비견:{name:"비견(比肩)",desc:"같은 오행·같은 음양의 동지입니다. 서로를 너무 잘 알아 숨길 수 없지만, 경쟁심 없이 함께 걸어갈 수 있습니다."},겁재:{name:"겁재(劫財)",desc:"같은 오행이지만 음양이 달라 미묘하게 다릅니다. 서로 자극을 주고 경쟁심도 있지만, 그만큼 활기차고 역동적인 관계입니다."},식신:{name:"식신(食神)",desc:"나의 에너지가 자연스럽게 상대방으로 흘러갑니다. 내가 더 주는 역할을 맡는 편이지만, 편안하고 풍요로운 관계입니다."},상관:{name:"상관(傷官)",desc:"창의적이고 자유로운 에너지의 교류입니다. 틀에 얽매이지 않고 서로를 변화시키는 자극적인 관계입니다."},편인:{name:"편인(偏印)",desc:"상대방의 에너지가 일방적으로 나에게 흘러옵니다. 상대방이 더 지원해주지만, 의존이 깊어지면 주도성을 잃을 수 있습니다."},정인:{name:"정인(正印)",desc:"상대방이 안정적으로 나를 성장시켜줍니다. 스승과 같은 든든하고 신뢰감 있는 관계입니다."},편재:{name:"편재(偏財)",desc:"내가 상대방을 이끌고 활용하는 관계입니다. 능동적이고 주도적으로 관계를 이끌어갑니다."},정재:{name:"정재(正財)",desc:"안정적이고 현실적인 관계입니다. 서로에게 실질적으로 이로운 신뢰의 인연입니다."},편관:{name:"편관(偏官)",desc:"상대방이 나를 압박하는 구조입니다. 긴장감이 있지만 그것이 성장의 동력이 되기도 합니다."},정관:{name:"정관(正官)",desc:"상대방이 나를 올바르게 이끌어줍니다. 격식 있고 안정적인, 사회적으로도 인정받는 관계입니다."}},u=(Se=(ze=e.pillarsA)==null?void 0:ze[2])==null?void 0:Se.stem,V=(Oe=(Me=e.pillarsB)==null?void 0:Me[2])==null?void 0:Oe.stem,T=(r,O)=>{const R=b[r],Q=b[O];if(!R||!Q)return null;const K=k[r]===k[O];return R===Q?C[K?"비견":"겁재"]:N[R]===Q?C[K?"식신":"상관"]:N[Q]===R?C[K?"편인":"정인"]:L[R]===Q?C[K?"편재":"정재"]:L[Q]===R?C[K?"편관":"정관"]:null},te=T(u,V),W=T(V,u),D=r=>{const O={};return r.forEach(R=>{const Q=(R.type||"").split("(")[0].split("（")[0].trim(),K=[String(R.a||""),String(R.b||"")].sort().join(""),le=`${Q}|${K}`;O[le]||(O[le]={...R,pillars:[]});const we=(R.pillarA||"").slice(0,2),Be=(R.pillarB||"").slice(0,2);(we||Be)&&O[le].pillars.push(`${we}·${Be}`)}),Object.values(O)},I=D((e.hapChung||[]).filter(r=>r.positive)),i=D((e.hapChung||[]).filter(r=>!r.positive));I.length,i.length;const ee=r=>{var Q;const O=[r.a,r.b].sort().join("");let R="";if(r.type.includes("천간합")){const K=S[O]||S[[r.b,r.a].join("")];K&&(R=`<div class="gh-hap-desc">${K.name} · ${K.wx}의 기운 — ${K.desc}</div>`)}else if(r.type.includes("지지육합")){const K=[r.a,r.b].sort().join("");Object.values(J).find((we,Be,He)=>Object.keys(He).find(Te=>Te.split("").sort().join("")===K.split("").sort().join("")));const le=Object.entries(J).find(([we])=>we.split("").sort().join("")===K.split("").sort().join(""));le&&(R=`<div class="gh-hap-desc">${le[1].desc}</div>`)}else r.type.includes("삼합")&&(R='<div class="gh-hap-desc">삼합(三合)은 세 지지가 모여 강한 오행의 국(局)을 이루는 특수한 인연입니다. 두 분 사이에 운명적 연결고리가 있습니다.</div>');return`<div class="gh-hap-item positive">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
        <span class="gh-hap-type">${r.type}</span>
        <span class="gh-hap-chars">${r.a} ↔ ${r.b}</span>
        ${(Q=r.pillars)!=null&&Q.length?`<span class="gh-hap-pill">${r.pillars.join(" / ")}</span>`:""}
      </div>
      ${R}
    </div>`},se=r=>{var Q;const O=[r.a,r.b].sort().join(""),R=ne[O]||ne[[r.b,r.a].join("")]||"";return`<div class="gh-hap-item negative">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
        <span class="gh-hap-type">${r.type}</span>
        <span class="gh-hap-chars">${r.a} ↔ ${r.b}</span>
        ${(Q=r.pillars)!=null&&Q.length?`<span class="gh-hap-pill">${r.pillars.join(" / ")}</span>`:""}
      </div>
      ${R?`<div class="gh-hap-desc chung">${R}</div>`:""}
    </div>`},xe=e.hapChung&&e.hapChung.length>0?`
    <div class="gh-section">
      <div class="gh-section-title">⚡ 합충(合沖) 분석</div>
      ${I.length>0?`
        <div class="gh-hap-group">
          <div class="gh-hap-label positive">합(合) — 서로 끌어당기는 인연 · ${I.length}건</div>
          ${I.map(ee).join("")}
        </div>`:""}
      ${i.length>0?`
        <div class="gh-hap-group" style="margin-top:12px">
          <div class="gh-hap-label negative">충(沖) — 긴장감을 주는 관계 · ${i.length}건</div>
          ${i.map(se).join("")}
        </div>`:""}
      ${I.length===0&&i.length===0?'<div style="font-size:13px;color:rgba(255,255,255,0.4);text-align:center;padding:10px 0;">특별한 합충 관계 없음</div>':""}
    </div>`:"",_=e.distributionA||{},c=e.distributionB||{},h=["목","화","토","금","수"],F={목:"木(목)",화:"火(화)",토:"土(토)",금:"金(금)",수:"水(수)"},B={목:"창의·성장·인자함",화:"열정·표현·감수성",토:"안정·신뢰·중재력",금:"결단·원칙·날카로움",수:"지혜·직관·유연성"},y={};I.forEach(r=>{const O=[r.a,r.b].sort().join("");if((r.type||"").includes("천간합")){const R=S[O]||S[[r.b,r.a].join("")];R!=null&&R.wx&&(y[R.wx]=(y[R.wx]||0)+1)}});const re={목:"창의·성장",화:"정(情)·열정·인연",토:"안정·신뢰",금:"의리·결속",수:"지혜·유연성"},pe=Object.entries(y).sort((r,O)=>O[1]-r[1]),ge=pe.length>0?"✨ 합화오행: "+pe.map(([r,O])=>`<strong style="color:${w[r]||"#fff"}">${F[r]||r}(${re[r]})</strong>${O>1?` ×${O}`:""}`).join(" · ")+" 기운이 두 분 사이에서 생성됩니다.":"",ue=te?`
    <div class="gh-card">
      <div class="gh-section">
        <div class="gh-section-title">🔗 일간(日干) 십신(十神) 관계</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;">
          <div style="flex:1;min-width:130px;padding:12px 14px;border-radius:10px;background:rgba(0,210,255,0.06);border:1px solid rgba(0,210,255,0.14);">
            <div style="font-size:11px;color:#00D2FF;font-weight:700;margin-bottom:5px;">나(${u||""}·${A})가 본 상대방</div>
            <div style="font-size:15px;font-weight:800;color:#fff;margin-bottom:5px;">${te.name}</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.65);line-height:1.6;">${te.desc}</div>
          </div>
          <div style="flex:1;min-width:130px;padding:12px 14px;border-radius:10px;background:rgba(245,166,35,0.06);border:1px solid rgba(245,166,35,0.14);">
            <div style="font-size:11px;color:#F5A623;font-weight:700;margin-bottom:5px;">상대방(${V||""}·${E})이 본 나</div>
            <div style="font-size:15px;font-weight:800;color:#fff;margin-bottom:5px;">${W.name}</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.65);line-height:1.6;">${W.desc}</div>
          </div>
        </div>
        ${ge?`<div class="gh-dist-interp good" style="margin-top:10px;">${ge}</div>`:""}
      </div>
    </div>`:"",ae={};h.forEach(r=>{ae[r]=(_[r]||0)+(c[r]||0)});const me=[...h].sort((r,O)=>(ae[r]||0)-(ae[O]||0)),s=me[0],d=me[me.length-1],x=h.filter(r=>Math.abs((_[r]||0)-(c[r]||0))>=2);let M="";if(s&&ae[s]<=1&&(M+=`<div class="gh-dist-interp">⚠ 두 분 모두 <strong style="color:${w[s]}">${F[s]}</strong>(${B[s]})이 부족합니다. 이 기운이 약한 영역에서 함께 어려움을 겪을 수 있습니다.</div>`),x.length>0){const r=x[0],O=(_[r]||0)>(c[r]||0);M+=`<div class="gh-dist-interp good">✓ <strong style="color:${w[r]}">${F[r]}</strong>에서 한 분이 강하고 다른 분이 약합니다. ${O?"나":"상대방"}의 ${F[r]} 기운이 ${O?"상대방":"나"}를 채워주는 긍정적인 보완 관계입니다.</div>`}ae[d]>=6&&(M+=`<div class="gh-dist-interp warn">△ 두 분 합산 <strong style="color:${w[d]}">${F[d]}</strong>이 과도합니다. 이 오행의 특성(${B[d]})이 지나치게 강해 균형을 잃을 수 있습니다.</div>`);const v=new Set(["甲","丙","戊","庚","壬"]),g=new Set(["乙","丁","己","辛","癸"]),Y=new Set(["子","寅","辰","午","申","戌"]),X=new Set(["丑","卯","巳","未","酉","亥"]),q=r=>{let O=0,R=0,Q=0,K=0;return r.forEach(le=>{v.has(le.stem)?O++:g.has(le.stem)&&R++,Y.has(le.branch)?Q++:X.has(le.branch)&&K++}),{yangStem:O,yinStem:R,yangBranch:Q,yinBranch:K}},U=q(e.pillarsA||[]),H=q(e.pillarsB||[]),de=U.yangStem+U.yangBranch,P=U.yinStem+U.yinBranch,G=H.yangStem+H.yangBranch,oe=H.yinStem+H.yinBranch,ce=(()=>{const r=de>P?"양(陽)형":de<P?"음(陰)형":"균형형",O=G>oe?"양(陽)형":G<oe?"음(陰)형":"균형형",R={"양(陽)형":"활동적이고 외향적입니다. 먼저 나서고 에너지를 발산하는 편입니다.","음(陰)형":"내성적이고 수용적입니다. 관찰하고 흡수하며 내면이 깊습니다.",균형형:"음양이 고르게 분포되어 상황에 따라 유연하게 대처합니다."};let Q="";return r!==O?Q="서로 다른 음양 기질이 만나 자연스러운 끌림이 생깁니다. 보완 관계가 형성됩니다.":r==="양(陽)형"?Q="두 분 모두 적극적이라 활기차지만 주도권 갈등이 생길 수 있습니다.":r==="음(陰)형"?Q="두 분 모두 내성적이라 서로를 깊이 이해하지만 먼저 나서는 것을 꺼릴 수 있습니다.":Q="두 분 모두 균형 잡힌 기질로 상황 적응력이 좋습니다.",{typeA:r,typeB:O,descA:R[r],descB:R[O],chem:Q}})(),be=`
    <div class="gh-section">
      <div class="gh-section-title">🌊 오행 분포 비교</div>
      <div class="gh-dist-grid">
        ${h.map(r=>{const O=_[r]||0,R=c[r]||0,Q=w[r]||"#fff";return`
          <div class="gh-dist-row">
            <span class="gh-dist-name" style="color:${Q}">${l[r]||r}(${r})</span>
            <div class="gh-dist-bars">
              <div class="gh-bar-wrap">
                <div class="gh-bar gh-bar-a" style="width:${O/8*100}%;background:${Q}"></div>
              </div>
              <span class="gh-bar-val">${O}</span>
              <span class="gh-bar-sep">vs</span>
              <span class="gh-bar-val">${R}</span>
              <div class="gh-bar-wrap">
                <div class="gh-bar gh-bar-b" style="width:${R/8*100}%;background:${Q};opacity:0.5"></div>
              </div>
            </div>
          </div>`}).join("")}
        <div class="gh-dist-legend">
          <span style="color:rgba(255,255,255,0.7)">나</span>
          <span style="color:rgba(255,255,255,0.35)">상대방</span>
        </div>
      </div>
      ${M?`<div style="margin-top:12px;display:flex;flex-direction:column;gap:6px;">${M}</div>`:""}
    </div>

    <div class="gh-section" style="margin-top:14px">
      <div class="gh-section-title">☯ 음양(陰陽) 분석</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;">
        <div class="gh-yy-box" style="border-color:#00D2FF22;flex:1;min-width:130px;">
          <div class="gh-yy-label" style="color:#00D2FF;">나 — ${ce.typeA}</div>
          <div class="gh-yy-bar">
            <div style="width:${de/8*100}%;background:#f0a030;height:6px;border-radius:3px;"></div>
          </div>
          <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px;">양 ${de} · 음 ${P}</div>
          <div class="gh-yy-desc">${ce.descA}</div>
        </div>
        <div class="gh-yy-box" style="border-color:#F5A62322;flex:1;min-width:130px;">
          <div class="gh-yy-label" style="color:#F5A623;">상대방 — ${ce.typeB}</div>
          <div class="gh-yy-bar">
            <div style="width:${G/8*100}%;background:#f0a030;height:6px;border-radius:3px;"></div>
          </div>
          <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px;">양 ${G} · 음 ${oe}</div>
          <div class="gh-yy-desc">${ce.descB}</div>
        </div>
      </div>
      <div class="gh-dist-interp good" style="margin-top:10px;">💬 ${ce.chem}</div>
    </div>`,he={"상생(相生)":{strength:["오행이 서로를 살려주는 구조라 에너지 흐름이 자연스럽습니다. 함께 있을수록 활력이 생깁니다.","위기 상황에서도 한 쪽이 힘이 빠지면 다른 쪽이 자연스럽게 채워주는 패턴이 나옵니다.","서로 다른 기운이 맞물려 있어 장기적으로 성장하기에 유리한 구조입니다."],caution:["생해주는 쪽이 지속적으로 에너지를 쏟아야 하는 구조라, 한쪽이 일방적으로 소진될 수 있습니다. 의존이 심해지면 균형이 무너집니다.","좋은 궁합이라 해도 합충 결과에서 충(沖)이 많으면 실제 관계에서 충돌이 잦을 수 있습니다. 합충 결과를 반드시 함께 참고하세요."]},"동질형(同質型)":{strength:["같은 오행이라 상대방의 감정과 사고방식을 직관적으로 잘 이해합니다.","취향과 생활패턴이 비슷해 일상에서 충돌이 적은 편입니다."],caution:["같은 오행은 같은 약점도 공유합니다. 두 사람 모두 특정 상황에서 함께 무너질 가능성이 있습니다. 외부 조언자가 반드시 필요합니다.","자극이 없어 관계가 정체될 수 있습니다. 편안함이 무관심으로 이어지지 않도록 의도적인 노력이 필요합니다.","경쟁 심리가 생기면 회복이 어렵습니다. 역할을 명확히 구분하는 것이 중요합니다."]},"갈등형(葛藤型)":{strength:["서로 다른 강점을 지니고 있어, 역할을 명확히 나누면 강력한 팀이 될 수 있습니다.","자극이 강한 만큼 서로에게서 배울 점도 많습니다."],caution:["오행이 서로를 극(克)하는 구조입니다. 기본적으로 기운이 충돌하며 상대방을 억제하거나 억제당하는 패턴이 반복됩니다.","갈등 상황에서 한쪽이 지속적으로 참거나 양보해야 하는 구조가 만들어질 수 있습니다. 장기적으로 피로도가 높습니다.","감정적으로 격해지면 회복에 시간이 오래 걸립니다. 싸움의 패턴이 반복되지 않도록 사전에 규칙을 정해두는 것이 현실적입니다.","이 조합에서 좋은 관계를 유지하려면 일반적인 커플보다 훨씬 더 많은 의식적인 노력이 필요합니다."]},"평범형(平凡型)":{strength:["특별히 맞부딪히는 기운이 없어 갈등이 극단으로 치닫지는 않습니다.","안정적이고 예측 가능한 관계가 됩니다."],caution:['큰 시너지가 없어 함께 있어도 에너지가 높아지지 않을 수 있습니다. 관계에서 "설레는 느낌"을 찾기가 어렵습니다.',"권태기가 비교적 일찍 찾아올 수 있습니다. 의도적으로 새로운 경험을 만들어야 관계가 유지됩니다."]}},ie=p.relation==="비화(比和)"?"동질형(同質型)":p.relation==="상극(相剋)"?"갈등형(葛藤型)":p.relation==="중화(中和)"?"평범형(平凡型)":p.relation,ve=he[ie]||he["평범형(平凡型)"],$e=`
    <div class="gh-section">
      <div class="gh-section-title">💡 궁합 풀이</div>
      ${m>0||$>0?`
    <div style="margin-bottom:10px;padding:10px 13px;background:rgba(255,255,255,0.04);border-radius:10px;border:1px solid rgba(255,255,255,0.08);font-size:12.5px;line-height:1.7;color:rgba(255,255,255,0.7);">
      합(合) <strong style="color:#64DCA0">${m}건</strong> · 충(沖) <strong style="color:#F5A623">${$}건</strong> 반영 →
      최종 점수 <strong style="color:#fff">${t}점</strong>
      ${$>=3?' · <span style="color:#F5A623">⚠ 충(沖)이 많아 실제 갈등 가능성이 높습니다</span>':""}
      ${m>=3?' · <span style="color:#64DCA0">✨ 합(合)이 많아 인연의 끌림이 강합니다</span>':""}
    </div>`:""}
      <div class="gh-advice-group">
        <div class="gh-advice-label positive">긍정 요소</div>
        ${ve.strength.map(r=>`<div class="gh-advice-item positive">✓ ${r}</div>`).join("")}
      </div>
      <div class="gh-advice-group" style="margin-top:10px">
        <div class="gh-advice-label caution">주의 요소</div>
        ${ve.caution.map(r=>`<div class="gh-advice-item caution">⚠ ${r}</div>`).join("")}
      </div>
    </div>`;a.innerHTML=`
    <!-- 홈 버튼 -->
    <div class="detail-nav-row" style="margin-bottom:16px;">
      <button class="home-btn" id="couple-go-home">🏠 처음으로</button>
    </div>

    <!-- ① 궁합 점수 카드 -->
    <div class="gungham-card" style="--gc:${p.rgb||"0,210,255"}">
      <div class="gungham-top">
        <div class="gungham-elem" style="color:${p.colA}">${p.symA}<span class="gungham-elem-ko">(${A||""})</span></div>
        <div class="gungham-score-wrap">
          <svg class="gungham-ring" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="7"/>
            <circle cx="40" cy="40" r="34" fill="none" stroke="${p.color}" stroke-width="7"
              stroke-dasharray="${2*Math.PI*34}" stroke-dashoffset="${2*Math.PI*34*(1-z/100)}"
              stroke-linecap="round" transform="rotate(-90 40 40)"
              style="filter:drop-shadow(0 0 6px ${p.color})"/>
          </svg>
          <div class="gungham-score-inner">
            <span class="gungham-num">${t}</span>
            <span class="gungham-unit">점</span>
          </div>
        </div>
        <div class="gungham-elem" style="color:${p.colB}">${p.symB}<span class="gungham-elem-ko">(${E||""})</span></div>
      </div>
      <div class="gungham-relation" style="color:${p.color}">${p.relation}</div>
      <div class="gungham-grade">${p.grade}</div>
      <div class="gungham-comment">${p.comment}</div>
    </div>

    <!-- ② 사주 팔자 비교표 -->
    ${e.pillarsA&&e.pillarsA.length>0?`
    <div class="gh-card">
      <div class="gh-card-title">📋 사주 팔자 (四柱八字) 비교</div>
      <div class="gh-pillar-wrap">
        ${j(e.pillarsA,e.genderA==="female"?"👩 나 (여)":"👨 나 (남)","#00D2FF")}
        <div class="gh-pillar-divider"></div>
        ${j(e.pillarsB,e.genderB==="female"?"👩 상대방 (여)":"👨 상대방 (남)","#F5A623")}
      </div>
    </div>`:""}

    <!-- ③ 일주론 분석 -->
    ${e.pillarsA&&e.pillarsA.length>=3&&e.pillarsB&&e.pillarsB.length>=3?(()=>{const r={甲子:{char:"갑자(甲子)",desc:"이상이 높고 지적이며 리더십이 강합니다. 다소 고집스럽지만 원칙을 중시합니다."},甲寅:{char:"갑인(甲寅)",desc:"추진력과 자신감이 넘칩니다. 도전을 즐기고 열정적입니다."},甲辰:{char:"갑진(甲辰)",desc:"현실적이면서도 창의적입니다. 끈기와 집중력이 뛰어납니다."},甲午:{char:"갑오(甲午)",desc:"열정적이고 직선적입니다. 감수성이 풍부하고 표현력이 강합니다."},甲申:{char:"갑신(甲申)",desc:"지성과 행동력을 겸비했습니다. 결단력이 있고 빠르게 움직입니다."},甲戌:{char:"갑술(甲戌)",desc:"의리 있고 책임감이 강합니다. 진실을 중요하게 여깁니다."},乙丑:{char:"을축(乙丑)",desc:"성실하고 끈기가 있습니다. 현실적이며 신중하게 행동합니다."},乙卯:{char:"을묘(乙卯)",desc:"감수성이 풍부하고 섬세합니다. 예술적 감각이 뛰어납니다."},乙巳:{char:"을사(乙巳)",desc:"지략이 뛰어나고 상황 파악이 빠릅니다. 내면이 강합니다."},乙未:{char:"을미(乙未)",desc:"따뜻하고 배려심이 많습니다. 인간관계에서 신뢰를 쌓습니다."},乙酉:{char:"을유(乙酉)",desc:"완벽주의 성향이 있고 꼼꼼합니다. 심미안이 뛰어납니다."},乙亥:{char:"을해(乙亥)",desc:"직관이 강하고 자유를 사랑합니다. 독립적이고 개성이 뚜렷합니다."},丙子:{char:"병자(丙子)",desc:"지적 호기심이 강하고 논리적입니다. 겉과 속이 다를 수 있습니다."},丙寅:{char:"병인(丙寅)",desc:"카리스마가 넘치고 영향력이 큽니다. 주변을 이끄는 힘이 있습니다."},丙辰:{char:"병진(丙辰)",desc:"자신감 있고 강한 추진력을 가집니다. 큰 그림을 보는 능력이 있습니다."},丙午:{char:"병오(丙午)",desc:"열정적이고 직관적입니다. 에너지가 넘치며 화려한 면이 있습니다."},丙申:{char:"병신(丙申)",desc:"실리적이고 결단력이 있습니다. 이해관계를 빠르게 파악합니다."},丙戌:{char:"병술(丙戌)",desc:"의리와 원칙을 중시합니다. 주변을 따뜻하게 보살핍니다."},丁丑:{char:"정축(丁丑)",desc:"내성적이지만 내면이 강합니다. 신중하고 지속적입니다."},丁卯:{char:"정묘(丁卯)",desc:"감성적이고 예민합니다. 창의적이며 아이디어가 풍부합니다."},丁巳:{char:"정사(丁巳)",desc:"지략이 뛰어나고 분석력이 강합니다. 깊이 있게 생각합니다."},丁未:{char:"정미(丁未)",desc:"온화하고 배려심이 넘칩니다. 타인의 감정을 잘 읽습니다."},丁酉:{char:"정유(丁酉)",desc:"섬세하고 완벽을 추구합니다. 심미적 감각이 높습니다."},丁亥:{char:"정해(丁亥)",desc:"직관적이고 자유로운 영혼입니다. 깊은 내면의 세계를 가집니다."},戊子:{char:"무자(戊子)",desc:"침착하고 지적입니다. 상반된 기운이 내면의 갈등을 만들기도 합니다."},戊寅:{char:"무인(戊寅)",desc:"강하고 진취적입니다. 리더십이 뛰어나고 목표지향적입니다."},戊辰:{char:"무진(戊辰)",desc:"현실적이고 강인합니다. 토의 기운이 두 겹이라 고집이 셀 수 있습니다."},戊午:{char:"무오(戊午)",desc:"열정적이고 당당합니다. 기운이 강해 주변에 강한 인상을 남깁니다."},戊申:{char:"무신(戊申)",desc:"실용적이고 결단력이 있습니다. 상황에 따라 유연하게 대처합니다."},戊戌:{char:"무술(戊戌)",desc:"원칙과 의리를 중시합니다. 토의 기운이 두 겹이라 매우 안정적입니다."},己丑:{char:"기축(己丑)",desc:"성실하고 신중합니다. 토의 기운이 두 겹이라 보수적인 면이 있습니다."},己卯:{char:"기묘(己卯)",desc:"창의적이고 섬세합니다. 현실과 이상 사이에서 조화를 추구합니다."},己巳:{char:"기사(己巳)",desc:"지략이 풍부하고 사려 깊습니다. 외유내강의 성격입니다."},己未:{char:"기미(己未)",desc:"온화하고 인자합니다. 토의 기운이 두 겹이라 배려심이 깊습니다."},己酉:{char:"기유(己酉)",desc:"꼼꼼하고 현실적입니다. 실속을 챙기는 능력이 뛰어납니다."},己亥:{char:"기해(己亥)",desc:"자유롭고 직관적입니다. 겉으론 유연하지만 내면이 단단합니다."},庚子:{char:"경자(庚子)",desc:"명석하고 냉철합니다. 원칙적이며 뛰어난 판단력을 가집니다."},庚寅:{char:"경인(庚寅)",desc:"강하고 활동적입니다. 도전을 두려워하지 않는 개척자입니다."},庚辰:{char:"경진(庚辰)",desc:"강인하고 현실적입니다. 뚝심 있게 목표를 향해 나아갑니다."},庚午:{char:"경오(庚午)",desc:"열정과 결단력을 겸비합니다. 화려하고 강렬한 인상을 줍니다."},庚申:{char:"경신(庚申)",desc:"금의 기운이 두 겹이라 매우 강하고 날카롭습니다. 카리스마가 강합니다."},庚戌:{char:"경술(庚戌)",desc:"의리 있고 강직합니다. 한 번 맺은 인연을 소중히 지킵니다."},辛丑:{char:"신축(辛丑)",desc:"꼼꼼하고 인내심이 강합니다. 완성도를 중시하는 성향입니다."},辛卯:{char:"신묘(辛卯)",desc:"감성과 이성을 함께 갖춥니다. 예술적 감각이 뛰어납니다."},辛巳:{char:"신사(辛巳)",desc:"지략과 날카로운 판단력을 지닙니다. 결정적인 순간에 강합니다."},辛未:{char:"신미(辛未)",desc:"온화하면서도 끈기가 있습니다. 균형감각이 뛰어납니다."},辛酉:{char:"신유(辛酉)",desc:"금의 기운이 두 겹이라 완벽주의 성향이 강합니다. 심미안이 높습니다."},辛亥:{char:"신해(辛亥)",desc:"자유롭고 직관적입니다. 독창적인 발상을 즐깁니다."},壬子:{char:"임자(壬子)",desc:"수의 기운이 두 겹이라 지혜롭고 깊이가 있습니다. 탁월한 직관력을 가집니다."},壬寅:{char:"임인(壬寅)",desc:"넓은 포용력과 추진력을 함께 지닙니다. 대인관계가 좋습니다."},壬辰:{char:"임진(壬辰)",desc:"지략이 깊고 현실적입니다. 큰 파도를 일으키는 잠재력이 있습니다."},壬午:{char:"임오(壬午)",desc:"내면에 상반된 기운이 공존합니다. 강한 매력과 다층적인 성격을 가집니다."},壬申:{char:"임신(壬申)",desc:"지적이고 결단력이 강합니다. 전략적 사고를 잘 합니다."},壬戌:{char:"임술(壬戌)",desc:"포용적이며 원칙을 중시합니다. 깊은 신뢰를 쌓는 사람입니다."},癸丑:{char:"계축(癸丑)",desc:"신중하고 끈기 있습니다. 내면에 강한 의지를 지닙니다."},癸卯:{char:"계묘(癸卯)",desc:"감수성이 풍부하고 섬세합니다. 따뜻한 마음씨로 주변을 감동시킵니다."},癸巳:{char:"계사(癸巳)",desc:"직관적이고 깊은 통찰력을 지닙니다. 신비로운 매력이 있습니다."},癸未:{char:"계미(癸未)",desc:"온화하고 배려심이 깊습니다. 중재 능력이 뛰어납니다."},癸酉:{char:"계유(癸酉)",desc:"섬세하고 완벽주의 성향입니다. 내면의 기준이 높습니다."},癸亥:{char:"계해(癸亥)",desc:"수의 기운이 두 겹이라 직관이 매우 강합니다. 자유롭고 심오한 면이 있습니다."}},O=(e.pillarsA[2].stem||"")+(e.pillarsA[2].branch||""),R=(e.pillarsB[2].stem||"")+(e.pillarsB[2].branch||""),Q=r[O],K=r[R];return!Q&&!K?"":`
    <div class="gh-card">
      <div class="gh-section">
        <div class="gh-section-title">🔑 일주(日柱) 분석 — 두 사람의 성격 기반</div>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:8px;">
          ${Q?`<div class="gh-ilju-item" style="border-left:3px solid #00D2FF;">
            <div class="gh-ilju-char" style="color:#00D2FF;">${Q.char} <span style="font-size:11px;opacity:.6">(나 · 일주)</span></div>
            <div class="gh-ilju-desc">${Q.desc}</div>
          </div>`:""}
          ${K?`<div class="gh-ilju-item" style="border-left:3px solid #F5A623;">
            <div class="gh-ilju-char" style="color:#F5A623;">${K.char} <span style="font-size:11px;opacity:.6">(상대방 · 일주)</span></div>
            <div class="gh-ilju-desc">${K.desc}</div>
          </div>`:""}
          ${Q&&K&&O===R?'<div style="margin-top:4px;padding:8px 12px;background:rgba(255,215,0,0.07);border-radius:8px;font-size:12px;color:rgba(255,215,0,0.8);">✨ 두 분이 같은 일주(同日柱)입니다. 매우 드문 인연으로, 서로를 거울처럼 반추하는 관계입니다.</div>':""}
        </div>
      </div>
    </div>`})():""}

    <!-- ③-a 일간 십신 관계 -->
    ${ue}

    <!-- ③ 합충 분석 -->
    ${xe?`<div class="gh-card">${xe}</div>`:""}

    <!-- ④ 오행 분포 비교 -->
    <div class="gh-card">${be}</div>

    <!-- ⑤ 궁합 조언 -->
    <div class="gh-card">${$e}</div>

    ${f?`
      <div class="member-banner unlocked">✓ 잼공스토리 멤버십 — 전체 기능이 열려있습니다</div>
    `:`
      <div class="member-unlock">
        <input type="text" id="member-code-input" placeholder="멤버십 코드 입력 (선택)" />
        <button id="member-code-btn">확인</button>
      </div>
    `}

    <div style="display:flex;gap:10px;margin:16px 0;">
      <button id="share-kakao-btn" style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;background:#FEE500;border:none;border-radius:14px;padding:14px;cursor:pointer;font-size:14px;font-weight:800;color:#3C1E1E;box-shadow:0 4px 16px rgba(254,229,0,0.35);transition:all .2s;">
        💬 카카오톡 공유
      </button>
      <button id="share-copy-btn" style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;background:rgba(0,210,255,0.1);border:1px solid rgba(0,210,255,0.3);border-radius:14px;padding:14px;cursor:pointer;font-size:14px;font-weight:700;color:#00d2ff;transition:all .2s;">
        🔗 링크 복사
      </button>
    </div>

    <div class="notice-box">
      <div class="notice-item">
        <span class="notice-icon">ℹ️</span>
        <span>${e.disclaimer||"본 결과는 사주 오행 이론을 바탕으로 한 참고 정보입니다."}</span>
      </div>
    </div>

    <div class="patent-notice-banner">
      <div class="patent-notice-icon">⚖️</div>
      <div class="patent-notice-body">
        <div class="patent-notice-title">지식재산권 안내</div>
        <div class="patent-notice-text">본 서비스의 <strong>인연 시너지 산출 로직</strong>은 비가산 시너지 기반 지수 산출 방식을 적용한 독자 기술입니다.</div>
        <span class="patent-num">특허 출원 중 (출원번호: 40-2026-00*****)</span>
      </div>
    </div>
  `;const ke=document.getElementById("member-code-input"),je=document.getElementById("member-code-btn");je&&je.addEventListener("click",()=>{ke&&ke.value.trim()===Ge?(Re(ke.value.trim()),Pe(e)):alert("코드가 올바르지 않습니다.")}),document.querySelectorAll(".detail-view-btn").forEach(r=>{r.addEventListener("click",()=>{const O=parseInt(r.dataset.templeIndex);Le(e.results[O],e,f)})}),(Ie=document.getElementById("couple-go-home"))==null||Ie.addEventListener("click",()=>{var O;a.classList.add("hidden"),a.innerHTML="",window._gunghamContext=null;const r=document.getElementById("match-form");r&&(r.style.display=""),(O=document.getElementById("app"))==null||O.scrollIntoView({behavior:"smooth",block:"start"})}),function(){var He,Te,Ye,Ue;var O=(He=matchData==null?void 0:matchData.results)==null?void 0:He[0],R=((Te=O==null?void 0:O.temple)==null?void 0:Te.name)||"인연사찰",Q=(O==null?void 0:O.score)||"",K=(matchData==null?void 0:matchData.purpose)||"",le="https://jamgong-inyeonsachal.vercel.app",we='🏯 나의 인연사찰은 "'+R+`"!
오행 궁합 `+Q+"점 매칭 ("+K+`)

내 사주에 맞는 사찰을 찾아보세요 👇
`+le,Be="내 인연사찰은 "+R+"! — 잼공인연사찰";(Ye=document.getElementById("share-kakao-btn"))==null||Ye.addEventListener("click",function(){var Ae;window.Kakao&&window.Kakao.isInitialized()?window.Kakao.Share.sendDefault({objectType:"feed",content:{title:Be,description:"오행 궁합 "+Q+"점 매칭 ("+K+`)
내 사주에 맞는 사찰을 찾아보세요!`,imageUrl:"https://jamgong-inyeonsachal.vercel.app/og-image.png",link:{mobileWebUrl:le,webUrl:le}},buttons:[{title:"내 인연사찰 찾기",link:{mobileWebUrl:le,webUrl:le}}]}):navigator.share?navigator.share({title:Be,text:we,url:le}).catch(function(){}):(Ae=navigator.clipboard)==null||Ae.writeText(we).then(function(){alert(`카카오톡에 붙여넣기 하세요!

`+we)})}),(Ue=document.getElementById("share-copy-btn"))==null||Ue.addEventListener("click",function(){var qe;var Ae=document.getElementById("share-copy-btn");(qe=navigator.clipboard)==null||qe.writeText(le).then(function(){Ae&&(Ae.textContent="✅ 복사됨!",setTimeout(function(){Ae.innerHTML="🔗 링크 복사"},2e3))}).catch(function(){alert("주소: "+le)})})}(),(De=document.getElementById("demo-detail-btn"))==null||De.addEventListener("click",()=>{Le({score:94,reason:"수(水) 기운이 부족한 사주에 이 사찰의 강한 수 기운이 지혜와 학업 운을 보완해줍니다. 북쪽 방위의 청정한 기운이 집중력을 높여줍니다.",temple:{name:"통도사",address:"경상남도 양산시 하북면 통도사로 108",lat:35.489166,lng:129.058611,foundedYear:646,history:"신라 선덕여왕 15년(646) 자장율사가 창건한 한국 3보 사찰"},detail:{templeOhaeng:"수",bearing:"북",distanceKm:12.3},weather:{condition:"맑음",temp:24}},{purpose:"학업운",distribution:{목:1,화:2,토:2,금:2,수:1},targetOhaeng:"수",purposeGuide:[]},!0)}),a.scrollIntoView({behavior:"smooth"})}function dt(){var e=document.getElementById("app");if(!e)return;var a=document.getElementById("dream-page");if(a){a.style.display="";return}var f=[{emoji:"🐖",label:"돼지"},{emoji:"💧",label:"물"},{emoji:"🔥",label:"불"},{emoji:"🐍",label:"뱀"},{emoji:"🦷",label:"이빨"},{emoji:"📉",label:"추락"},{emoji:"☁️",label:"하늘"},{emoji:"🐕",label:"개"},{emoji:"☀️",label:"태양"},{emoji:"💵",label:"돈"},{emoji:"🐉",label:"용"},{emoji:"🐯",label:"호랑이"},{emoji:"🌙",label:"달"},{emoji:"🏠",label:"집"},{emoji:"🐟",label:"물고기"},{emoji:"🌸",label:"꽃"}],A=document.createElement("div");A.id="dream-page",A.style.cssText="width:100%;max-width:640px;margin:0 auto;padding:0 0 40px;",A.innerHTML=['<div style="margin-bottom:14px;">','  <button id="dream-back-btn" style="background:rgba(0,210,255,0.07);border:1px solid rgba(0,210,255,0.35);border-radius:10px;color:rgba(0,210,255,0.85);font-size:13px;font-weight:700;padding:8px 18px;cursor:pointer;box-shadow:0 0 12px rgba(0,210,255,0.2),inset 0 0 8px rgba(0,210,255,0.05);letter-spacing:0.3px;transition:all .2s;">← 홈으로</button>',"</div>",'<div style="text-align:center;padding:8px 0 14px;">','  <div style="display:inline-block;font-size:10px;font-weight:800;letter-spacing:2.5px;color:#c9a8ff;background:rgba(130,80,255,0.15);border:1px solid rgba(150,100,255,0.4);border-radius:20px;padding:5px 16px;margin-bottom:16px;box-shadow:0 0 14px rgba(130,80,255,0.2);">✦ TRADITIONAL DREAM INTERPRETER ✦</div>','  <div style="font-size:22px;font-weight:800;background:linear-gradient(135deg,#e8d5ff,#c9a8ff,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.4;margin-bottom:10px;">무의식의 징검다리<br>전통 꿈해몽 연산실</div>','  <div style="font-size:13px;color:rgba(200,180,255,0.5);line-height:1.8;max-width:340px;margin:0 auto;">꿈 속 상징을 오행(목·화·토·금·수)과<br>불교·도교 전통으로 해석합니다</div>',"</div>",'<div style="background:rgba(20,10,40,0.6);border:1px solid rgba(150,100,255,0.2);border-radius:20px;padding:22px;margin-top:4px;box-shadow:0 4px 24px rgba(100,60,200,0.1);">','  <div style="font-size:11px;font-weight:800;color:rgba(200,170,255,0.6);margin-bottom:10px;letter-spacing:1.5px;">✍️ 꿈 이야기</div>','  <div style="position:relative;">','    <textarea id="dream-input" rows="5" maxlength="600" placeholder="꿈에서 일어난 일을 자유롭게 적어주세요..." style="width:100%;box-sizing:border-box;background:rgba(0,0,0,0.3);border:1px solid rgba(130,80,255,0.25);border-radius:14px;color:#e8d5ff;font-size:14px;line-height:1.8;padding:14px 50px 14px 16px;outline:none;resize:none;font-family:inherit;transition:border-color .2s;"></textarea>','    <button id="dream-voice-btn" title="음성 입력" style="position:absolute;right:10px;top:10px;background:rgba(130,80,255,0.25);border:1px solid rgba(150,100,255,0.5);border-radius:10px;color:#c9a8ff;font-size:18px;width:36px;height:36px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 0 8px rgba(130,80,255,0.2);">🎙️</button>',"  </div>",'  <div id="dream-char-count" style="text-align:right;font-size:11px;color:rgba(200,170,255,0.3);margin-top:5px;">0 / 600</div>','  <div style="margin-top:16px;">','    <div style="font-size:11px;font-weight:800;color:rgba(200,170,255,0.5);margin-bottom:10px;letter-spacing:1.5px;">🔮 꿈 속 상징 선택 <span style="font-weight:400;opacity:.6;">(선택 사항)</span></div>','    <div id="dream-symbol-chips" style="display:flex;flex-wrap:wrap;gap:8px;">',f.map(function(b){return'<button class="dream-chip" data-label="'+b.label+'" style="background:rgba(100,60,200,0.1);border:1px solid rgba(150,100,255,0.2);border-radius:20px;color:rgba(210,185,255,0.7);font-size:12px;padding:6px 13px;cursor:pointer;transition:all .15s;">'+b.emoji+" "+b.label+"</button>"}).join(""),"    </div>","  </div>",'  <button id="dream-analyze-btn" style="width:100%;margin-top:20px;background:linear-gradient(135deg,#5b21b6,#7c3aed,#9333ea);border:none;border-radius:14px;color:#fff;font-size:15px;font-weight:800;padding:16px;cursor:pointer;letter-spacing:0.5px;box-shadow:0 4px 20px rgba(124,58,237,0.4);transition:all .2s;">',"    🔮 꿈 이야기 분석 &amp; 상징 조합 해설 구동","  </button>","</div>",'<div id="dream-result-section" style="display:none;margin-top:20px;background:linear-gradient(145deg,rgba(30,10,60,0.85),rgba(10,15,50,0.85));border:1px solid rgba(150,100,255,0.35);border-radius:20px;padding:24px;box-shadow:0 4px 30px rgba(100,60,200,0.15);"></div>','<div style="margin-top:24px;background:rgba(15,8,35,0.5);border:1px solid rgba(130,80,255,0.15);border-radius:18px;padding:20px;">','  <div style="font-size:12px;font-weight:800;color:rgba(200,170,255,0.6);margin-bottom:14px;letter-spacing:1px;">📖 꿈 일기</div>','  <div id="dream-diary-list" style="display:flex;flex-direction:column;gap:10px;"></div>','  <div id="dream-diary-empty" style="font-size:13px;color:rgba(200,170,255,0.25);text-align:center;padding:16px 0;">기록된 꿈이 없습니다</div>',"</div>",'<div style="margin-top:18px;padding:14px 18px;background:rgba(255,200,0,0.04);border:1px solid rgba(255,200,0,0.12);border-radius:12px;font-size:11px;color:rgba(255,230,150,0.4);line-height:1.8;">',"  ⚠️ 본 서비스는 전통 상징 해석 기반 문화 콘텐츠입니다. 의학적·법적 조언을 대신하지 않으며 결과는 참고용으로만 활용하시기 바랍니다.","</div>",'<div style="text-align:center;margin-top:18px;font-size:11px;color:rgba(200,170,255,0.2);line-height:2.2;">',"  특허 출원 중 (출원번호: 40-2026-00*****)<br>",'  <span style="letter-spacing:1px;">Jamgong Metaphysics Core Engine v1.8</span>',"</div>"].join("");var E=document.getElementById("match-form");E&&E.parentNode?E.parentNode.insertBefore(A,E.nextSibling):e.appendChild(A),A.style.display="";var p=document.getElementById("dream-back-btn");p&&p.addEventListener("click",function(){A.style.display="none",document.getElementById("match-form").style.display="",document.getElementById("temple-search-wrap").style.display="",document.querySelectorAll(".mode-toggle-btn").forEach(function(k){k.classList.remove("active")});var b=document.querySelector('.mode-toggle-btn[data-mode="solo"]');b&&b.classList.add("active")});var m=document.getElementById("dream-input"),$=document.getElementById("dream-char-count");m.addEventListener("input",function(){$.textContent=m.value.length+" / 600"});var n=[];A.querySelectorAll(".dream-chip").forEach(function(b){b.addEventListener("click",function(){var k=b.dataset.label,N=n.indexOf(k);N===-1?(n.push(k),b.style.background="rgba(130,80,255,0.3)",b.style.borderColor="rgba(130,80,255,0.7)",b.style.color="#d8b4ff",m.value&&!m.value.endsWith(" ")&&(m.value+=" "),m.value+=k+" ",$.textContent=m.value.length+" / 600"):(n.splice(N,1),b.style.background="rgba(255,255,255,0.05)",b.style.borderColor="rgba(255,255,255,0.12)",b.style.color="rgba(255,255,255,0.65)")})});var t=document.getElementById("dream-voice-btn"),z=!1,w=null;t.addEventListener("click",function(){var b=window.SpeechRecognition||window.webkitSpeechRecognition;if(!b){alert("이 브라우저는 음성 입력을 지원하지 않습니다.");return}if(z){w&&w.stop(),z=!1,t.style.background="rgba(130,80,255,0.2)",t.textContent="🎙️";return}w=new b,w.lang="ko-KR",w.interimResults=!1,w.onstart=function(){z=!0,t.style.background="rgba(255,60,60,0.3)",t.textContent="⏹️"},w.onresult=function(k){var N=k.results[0][0].transcript;m.value+=(m.value?" ":"")+N,$.textContent=m.value.length+" / 600"},w.onend=function(){z=!1,t.style.background="rgba(130,80,255,0.2)",t.textContent="🎙️"},w.start()});var l=document.getElementById("dream-analyze-btn"),j=document.getElementById("dream-result-section");l.addEventListener("click",function(){var b=m.value.trim();if(!b&&n.length===0){alert("꿈 내용을 입력하거나 상징을 선택해주세요.");return}l.disabled=!0,l.textContent="⏳ 분석 중...",j.style.display="block",j.innerHTML='<div style="text-align:center;padding:30px;color:rgba(255,255,255,0.4);font-size:14px;">🔮 꿈을 해석하고 있습니다...<br><span style="font-size:12px;opacity:.6;">잠시만 기다려주세요</span></div>',fetch("/api/dream",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({dreamText:b,symbols:n})}).then(function(k){return k.json()}).then(function(k){var N=k.result||"",L=S(N);L+='<div style="text-align:center;margin-top:18px;"><button id="dream-tts-btn" style="background:rgba(0,210,255,0.08);border:1px solid rgba(0,210,255,0.3);border-radius:12px;color:rgba(0,210,255,0.85);font-size:13px;font-weight:700;padding:10px 22px;cursor:pointer;box-shadow:0 0 12px rgba(0,210,255,0.15);transition:all .2s;">🔊 결과 읽어주기</button></div>',j.innerHTML=L;var C=document.getElementById("dream-tts-btn"),u=!1;C&&window.speechSynthesis?C.addEventListener("click",function(){if(u){window.speechSynthesis.cancel(),u=!1,C.textContent="🔊 결과 읽어주기";return}var V=N.replace(/##[^#]*##/g,"").replace(/\*\*/g,"").replace(/\*/g,"").replace(/#+/g,"").replace(/[·•▪▸►◆■□▶]/g,",").replace(/[-—–]{2,}/g,"").replace(/[✦✧★☆◇]/g,"").replace(/\[([^\]]+)\]/g,"$1").replace(/\n{2,}/g,". ").replace(/\n/g," ").replace(/\s{2,}/g," ").trim(),T=new window.SpeechSynthesisUtterance(V);T.lang="ko-KR",T.rate=.92,T.pitch=1;var te=window.speechSynthesis.getVoices(),W=te.find(function(D){return D.lang.startsWith("ko")});W&&(T.voice=W),T.onstart=function(){u=!0,C.textContent="⏹ 중지"},T.onend=function(){u=!1,C.textContent="🔊 결과 읽어주기"},T.onerror=function(){u=!1,C.textContent="🔊 결과 읽어주기"},window.speechSynthesis.speak(T)}):C&&(C.style.display="none"),window._dreamContext={dreamText:b,symbols:n,result:N},window._sajuContext=null,window._gunghamContext=null,J(b,n,N),ne()}).catch(function(k){j.innerHTML='<div style="color:#ff8080;padding:20px;font-size:14px;">오류가 발생했습니다: '+k.message+"</div>"}).finally(function(){l.disabled=!1,l.innerHTML="🔮 꿈 이야기 분석 &amp; 상징 조합 해설 구동",j.scrollIntoView({behavior:"smooth",block:"start"})})}),ne();function S(b){var k=[{key:"##오행분석##",icon:"☯️",title:"오행 분석"},{key:"##핵심상징##",icon:"🔑",title:"핵심 상징"},{key:"##길흉판단##",icon:"⚖️",title:"길흉 판단"},{key:"##조언##",icon:"💡",title:"조언"},{key:"##오행처방##",icon:"🌿",title:"오행 처방"}],N={};k.forEach(function(C,u){var V=b.indexOf(C.key);if(V!==-1){for(var T=V+C.key.length,te=b.length,W=u+1;W<k.length;W++){var D=b.indexOf(k[W].key);D!==-1&&D<te&&(te=D)}N[C.key]=b.slice(T,te).trim()}});var L='<div style="font-size:11px;font-weight:800;letter-spacing:2.5px;color:#c9a8ff;margin-bottom:20px;text-align:center;opacity:.9;">✦ 꿈해몽 결과 ✦</div>';return k.forEach(function(C){var u=N[C.key];u&&(L+='<div style="margin-bottom:14px;padding:16px 18px;background:rgba(100,60,200,0.08);border-radius:14px;border-left:3px solid rgba(167,139,250,0.6);">',L+='<div style="font-size:12px;font-weight:800;color:#a78bfa;margin-bottom:8px;letter-spacing:0.5px;">'+C.icon+" "+C.title+"</div>",L+='<div style="font-size:13px;color:rgba(230,215,255,0.8);line-height:1.9;white-space:pre-wrap;">'+u+"</div>",L+="</div>")}),L.includes("background:rgba")||(L+='<div style="font-size:13px;color:rgba(255,255,255,0.7);line-height:1.8;white-space:pre-wrap;">'+b+"</div>"),L}function J(b,k,N){try{var L=JSON.parse(localStorage.getItem("dreamDiary")||"[]");L.unshift({date:new Date().toLocaleDateString("ko-KR"),time:new Date().toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"}),text:b.slice(0,80),symbols:k,result:N.slice(0,200)}),L.length>20&&(L=L.slice(0,20)),localStorage.setItem("dreamDiary",JSON.stringify(L))}catch{}}function ne(){var b=document.getElementById("dream-diary-list"),k=document.getElementById("dream-diary-empty");if(b)try{var N=JSON.parse(localStorage.getItem("dreamDiary")||"[]");if(!N.length){k.style.display="",b.innerHTML="";return}k.style.display="none",b.innerHTML=N.map(function(L,C){return'<div style="padding:12px 14px;background:rgba(255,255,255,0.04);border-radius:10px;border:1px solid rgba(255,255,255,0.07);"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;"><span style="font-size:11px;color:rgba(255,255,255,0.3);">'+L.date+" "+L.time+"</span>"+(L.symbols&&L.symbols.length?'<span style="font-size:11px;color:rgba(130,80,255,0.7);">'+L.symbols.join(", ")+"</span>":"")+'</div><div style="font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;">'+(L.text||"").replace(/</g,"&lt;")+(L.text&&L.text.length>=80?"…":"")+"</div></div>"}).join("")}catch{k.style.display=""}}}nt();(function(){var e=document.querySelector("#cm .cmsg.bot");e&&(e.innerHTML="안녕하세요! 인연 길잡이예요 😊<br>사찰 방문, 사주팔자, 오행, 꿈해몽 등 무엇이든 물어보세요.")})();(function(){const a=document.getElementById("temple-search-input"),f=document.getElementById("temple-search-results"),A=document.getElementById("temple-search-clear"),E=document.getElementById("region-btn"),p=document.getElementById("region-label"),m=document.getElementById("region-list");if(!a||!f)return;let $=[],n={},t="",z=!1;fetch("/api/temple-list").then(function(l){return l.ok?l.json():[]}).then(function(l){$=l,n={},l.forEach(function(j){j.id&&(n[j.id]=j)}),z=!0,(t||a.value.trim())&&w(a.value)}).catch(function(){$=[],z=!0}),E&&m&&(E.addEventListener("click",function(l){l.stopPropagation(),m.style.display=m.style.display==="none"?"block":"none"}),m.querySelectorAll(".rg-item").forEach(function(l){l.addEventListener("mouseover",function(){this.style.background="rgba(255,255,255,0.1)"}),l.addEventListener("mouseout",function(){this.style.background=""}),l.addEventListener("click",function(j){j.stopPropagation(),t=this.dataset.val||"",p&&(p.textContent=t?"📍 "+t:"📍 전체 지역"),m.style.display="none",w(a.value)})}),document.addEventListener("click",function(){m.style.display="none"}));function w(l){if(l=(l||"").trim(),A.style.display=l?"block":"none",!l&&!t){f.style.display="none";return}if(!z){f.innerHTML='<div style="padding:14px 18px;font-size:13px;color:rgba(255,255,255,0.5);">⏳ 사찰 목록 로딩 중...</div>',f.style.display="block";return}var j={},S=[],J=[],ne=[];$.forEach(function(u){if(!j[u.id]){var V=!t||u.address&&u.address.includes(t);if(V){var T=!l||u.name&&u.name.includes(l),te=l&&u.address&&u.address.includes(l),W=l&&u.history&&u.history.includes(l);T?(j[u.id]=!0,S.push(u)):te?(j[u.id]=!0,J.push(u)):W&&(j[u.id]=!0,ne.push(u))}}});var b=S.concat(J).concat(ne).sort(function(u,V){return(u.name||"").localeCompare(V.name||"","ko")});window._lastSearchMatches=b;var k="";if(b.length){var N='<div style="padding:8px 16px 6px;font-size:11px;color:rgba(255,255,255,0.35);border-bottom:1px solid rgba(255,255,255,0.06);">🏯 데이터베이스 '+b.length+"개</div>";k=N+b.map(function(u,V){var T=(u.address||"").slice(0,28);return l&&u.history&&u.history.includes(l)&&!(u.name||"").includes(l)&&!(u.address||"").includes(l)&&(T="연혁: "+u.history.slice(0,28)+"…"),'<div class="tsearch-item" data-idx="'+V+'" style="padding:12px 16px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:10px;transition:background .12s;"><span style="font-size:16px;">🏯</span><div><div style="font-size:14px;font-weight:700;color:#fff;">'+(u.name||"")+'</div><div style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:2px;">'+T+"</div></div></div>"}).join("")}else k='<div style="padding:10px 18px 4px;font-size:12px;color:rgba(255,255,255,0.3);">데이터베이스 결과 없음</div>';if(f.innerHTML=k+'<div id="kakao-extra-results"><div style="padding:10px 16px;font-size:11px;color:rgba(255,200,0,0.4);">⏳ 카카오 추가 검색 중...</div></div>',f.style.display="block",l){var L="/api/temple-search?q="+encodeURIComponent(l)+(t?"&region="+encodeURIComponent(t):"");fetch(L).then(function(u){return u.json()}).then(function(u){var V=document.getElementById("kakao-extra-results");if(V){var T=(u.places||[]).filter(function(W){return!b.some(function(D){return D.name===W.name})});if(!T.length){V.innerHTML="";return}window._kakaoPlaces=T;var te='<div style="padding:8px 16px 6px;font-size:11px;color:rgba(255,200,0,0.5);border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);">🗺️ 카카오 추가 검색 '+T.length+"개</div>";V.innerHTML=te+T.map(function(W,D){var I=(W.address||"").slice(0,28);return'<div class="kakao-item" data-kidx="'+D+'" style="padding:12px 16px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.04);display:flex;align-items:center;gap:10px;transition:background .12s;"><span style="font-size:16px;">🗺️</span><div><div style="font-size:14px;font-weight:700;color:#ffe89a;">'+(W.name||"")+'</div><div style="font-size:12px;color:rgba(255,255,255,0.35);margin-top:2px;">'+I+"</div></div></div>"}).join("")}}).catch(function(){var u=document.getElementById("kakao-extra-results");u&&(u.innerHTML="")})}else{var C=document.getElementById("kakao-extra-results");C&&(C.innerHTML="")}}a.addEventListener("input",function(){w(this.value)}),A.addEventListener("click",function(){a.value="",A.style.display="none",f.style.display="none",a.focus()}),f.addEventListener("click",function(l){var j=l.target.closest(".tsearch-item");if(j){var S=parseInt(j.dataset.idx),J=window._lastSearchMatches||[],ne=S>=0&&J[S]?J[S]:null;if(!ne)return;a.value="",f.style.display="none",A.style.display="none";var b={temple:ne,detail:{templeOhaeng:"금",bearing:"—",distanceKm:null},score:0,reason:"직접 검색하신 사찰입니다.",weather:null},k=document.getElementById("results"),N=document.getElementById("match-form"),L=document.getElementById("temple-search-wrap");Le(b,null,!1,function(){k&&(k.innerHTML="",k.classList.add("hidden")),N&&(N.style.display=""),L&&(L.style.display="")});return}var C=l.target.closest(".kakao-item");if(C){var u=parseInt(C.dataset.kidx),V=window._kakaoPlaces||[],T=V[u];if(!T)return;a.value="",f.style.display="none",A.style.display="none";var te={id:T.id,name:T.name,address:T.address,lat:T.lat,lng:T.lng,history:"",foundedYear:null},W={temple:te,detail:{templeOhaeng:"금",bearing:"—",distanceKm:null},score:0,reason:"카카오 검색 결과입니다.",weather:null},D=document.getElementById("results"),I=document.getElementById("match-form"),i=document.getElementById("temple-search-wrap");Le(W,null,!1,function(){D&&(D.innerHTML="",D.classList.add("hidden")),I&&(I.style.display=""),i&&(i.style.display="")})}}),document.addEventListener("click",function(l){var j=document.getElementById("temple-search-wrap");j&&!j.contains(l.target)&&(f.style.display="none")})})();
