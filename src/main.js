// src/main.js — 잼공인연사찰 MVP 프론트엔드 (vanilla JS)

// 챗봇에 전달할 사주 컨텍스트 (renderSajuPage 호출 시 저장)
let _sajuContext = null;
// 사주 페이지 복귀용 인자 저장
let _sajuPageArgs = null;

const PURPOSES = ["재물운", "건강운", "학업운", "인연운", "가정운", "수험합격", "취업운", "출산기도"];

const PURPOSE_EN = { 재물운: "wealth", 건강운: "health", 학업운: "academic", 인연운: "love", 가정운: "family", 수험합격: "exam", 취업운: "career", 출산기도: "birth" };

// 기도목적별 안내 — 실제 불교 전통 방식(소원지, 108배, 발원문 등) 기반. 신비주의적 과장 없이 사실적으로 서술.
const PURPOSE_PRAYER_GUIDE = {
  재물운: "대웅전에서 삼배(三拜)를 올린 뒤, 소원지에 구체적인 목표를 적어 불전함 앞에 놓아보세요. 산신각이 있다면 함께 들러보시는 것도 좋습니다.",
  건강운: "약사전이나 약사여래불이 모셔진 전각이 있다면 그곳에서, 없다면 대웅전에서 108배를 올리며 건강을 발원해보세요.",
  학업운: "문수보살을 모신 전각이 있다면 지혜를 구하는 기도를, 없다면 조용한 곳에 앉아 잠시 마음을 가다듬는 시간을 가져보세요.",
  인연운: "관음전이 있다면 그곳에서, 없다면 대웅전에서 지금까지의 인연에 감사하는 마음으로 절을 올려보세요.",
  가정운: "가족 한 사람 한 사람의 이름을 마음에 새기며 소원지를 적고, 대웅전 앞에서 가족의 평안을 발원해보세요.",
  수험합격: "문수전에서 시험 날짜와 이름을 마음속으로 밝히며 삼배하세요. 소원지에 합격 소원을 적어 걸어두는 것도 좋습니다.",
  취업운: "칠성각에서 원하는 직장을 구체적으로 떠올리며 기도하세요. 대웅전에서 취업이 이뤄졌을 때 다시 방문하겠다는 발원도 올려보세요.",
  출산기도: "삼신각을 먼저 찾아 임신·출산을 기원하세요. 관음전에서 건강한 아기를 발원하는 기도를 함께 올리면 더욱 좋습니다.",
};

// 목적별 아이콘 (선 스타일, 획 일관성 유지) — 재물(동전꾸러미)·건강(약초잎)·학업(붓)·인연(매듭)·가정(집)
const PURPOSE_ICONS = {
  재물운: `<circle cx="8" cy="16" r="5"/><circle cx="16" cy="8" r="5"/><path d="M8 16h.01M16 8h.01"/>`,
  건강운: `<path d="M12 3c-3 3-6 6-6 10a6 6 0 0012 0c0-4-3-7-6-10z"/><path d="M12 8v9"/>`,
  학업운: `<path d="M4 19l6-14 2 0 6 14"/><path d="M7 13h10"/><circle cx="18" cy="6" r="2"/>`,
  인연운: `<path d="M8 8a4 4 0 108 0M8 16a4 4 0 108 0M9 9l6 6M15 9l-6 6"/>`,
  가정운: `<path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/>`,
  수험합격: `<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>`,
  취업운: `<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="12"/>`,
  출산기도: `<path d="M12 2a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4z"/><path d="M6 20v-1a6 6 0 0112 0v1"/><path d="M12 14v6"/>`,
};

const OHAENG_COLOR = { 목: "#4ADE80", 화: "#F97316", 토: "#FACC15", 금: "#D4AF37", 수: "#38BDF8" };

// 오행별 부족 기운 분석 — 방문자가 이 사이트에서만 얻을 수 있는 정보
const OHAENG_DEFICIENCY_INFO = {
  목: {
    title: '목(木) 기운이 부족한 당신',
    personality: '새로운 시작과 성장에 막힘을 느끼거나, 가족 관계에서 소통이 어렵게 느껴질 수 있습니다. 계획은 세우지만 추진력이 부족하다는 느낌이 드는 경우가 많습니다.',
    lifetip: '봄철(3~5월)에 자연 속 산책을 자주 하세요. 초록색 채소·새싹을 많이 드시고, 동쪽 창가에서 아침을 맞이하는 습관이 목 기운을 보충해줍니다.',
    lifeItems: [
      { icon: '🎨', label: '색깔', val: '초록·청색 계열' },
      { icon: '🧭', label: '방향', val: '동쪽 (東)' },
      { icon: '🌿', label: '음식', val: '녹색 채소·새싹·신맛 음식' },
      { icon: '⏰', label: '좋은 시간', val: '오전 3~7시 (인묘시)' },
    ]
  },
  화: {
    title: '화(火) 기운이 부족한 당신',
    personality: '열정과 활력이 떨어지거나 인간관계에서 소통·표현이 어렵게 느껴질 수 있습니다. 감정 표현을 억누르거나 활기를 찾기 어려운 시기일 수 있습니다.',
    lifetip: '여름철(6~8월)에 밝고 따뜻한 공간에 머무르세요. 빨간색·주황색 계열 아이템을 생활에 더하고, 남쪽 창가에서 햇살을 자주 받는 것이 화 기운을 보충해줍니다.',
    lifeItems: [
      { icon: '🎨', label: '색깔', val: '빨강·주황·밝은 색 계열' },
      { icon: '🧭', label: '방향', val: '남쪽 (南)' },
      { icon: '🌶️', label: '음식', val: '쓴맛 음식·붉은 채소·대추' },
      { icon: '⏰', label: '좋은 시간', val: '오전 9~13시 (사오시)' },
    ]
  },
  토: {
    title: '토(土) 기운이 부족한 당신',
    personality: '안정감과 중심 잡기가 어렵거나, 건강·소화·몸의 중심(비장·위장)이 약해질 수 있습니다. 변화에 적응하는 데 에너지가 많이 소비되는 시기입니다.',
    lifetip: '환절기(3·6·9·12월 끝)에 특히 몸 관리에 집중하세요. 황색·베이지 계열 색상을 생활에 더하고, 규칙적인 식사와 중심 운동(요가·명상)이 토 기운을 보충합니다.',
    lifeItems: [
      { icon: '🎨', label: '색깔', val: '황토·베이지·노란색 계열' },
      { icon: '🧭', label: '방향', val: '중앙·사방 균형' },
      { icon: '🍠', label: '음식', val: '단맛 음식·고구마·호박·꿀' },
      { icon: '⏰', label: '좋은 시간', val: '오전 7~11시 (진사시)' },
    ]
  },
  금: {
    title: '금(金) 기운이 부족한 당신',
    personality: '결단력·추진력이 약해지거나 재물 흐름이 막히는 느낌이 들 수 있습니다. 의리와 책임감은 강하지만 결정 내리기가 어렵고, 호흡기·피부가 약해질 수 있습니다.',
    lifetip: '가을철(9~11월)에 정리·청소를 통해 공간을 맑게 하세요. 흰색·은색 계열을 생활에 더하고, 서쪽 방향을 활용하는 것이 금 기운을 보충해줍니다.',
    lifeItems: [
      { icon: '🎨', label: '색깔', val: '흰색·은색·금색 계열' },
      { icon: '🧭', label: '방향', val: '서쪽 (西)' },
      { icon: '🌰', label: '음식', val: '매운맛 음식·배·생강·마늘' },
      { icon: '⏰', label: '좋은 시간', val: '오후 3~7시 (신유시)' },
    ]
  },
  수: {
    title: '수(水) 기운이 부족한 당신',
    personality: '지혜·직관·집중력이 저하되거나 학업·사고력에 어려움이 느껴질 수 있습니다. 신장·방광 등 수분 관련 건강을 주의해야 하고, 두려움이나 불안감이 증가할 수 있습니다.',
    lifetip: '겨울철(11~1월)에 충분한 수면과 휴식을 취하세요. 검정·남색 계열을 생활에 더하고, 물을 자주 마시며 북쪽 공간을 활용하는 것이 수 기운을 보충합니다.',
    lifeItems: [
      { icon: '🎨', label: '색깔', val: '검정·남색·진한 청색 계열' },
      { icon: '🧭', label: '방향', val: '북쪽 (北)' },
      { icon: '🫐', label: '음식', val: '짠맛 음식·검은콩·블루베리·해산물' },
      { icon: '⏰', label: '좋은 시간', val: '오후 5~9시 (유술시)' },
    ]
  },
};

// 오행별 사찰 특징 전각 안내 — 불교 전통 전각 배치 기반
const OHAENG_HALL_GUIDE = {
  목: {
    icon: '🌿',
    desc: '목(木) 기운은 생명·성장·치유를 상징합니다. 이 사찰에서는 약사전(藥師殿)과 산신각(山神閣)에 특히 인연이 닿아 있습니다.',
    halls: [
      { name: '대웅전(大雄殿)', role: '석가모니불을 모신 본전. 합장 삼배로 시작하세요.' },
      { name: '약사전(藥師殿)', role: '약사여래불 — 치유와 건강의 기운. 있다면 꼭 들르세요.' },
      { name: '산신각(山神閣)', role: '자연의 정기를 받는 곳. 동쪽을 향해 기도하면 좋습니다.' },
    ]
  },
  화: {
    icon: '🔥',
    desc: '화(火) 기운은 열정·인연·소통을 상징합니다. 관음전(觀音殿)이 이 사찰의 핵심 인연처입니다.',
    halls: [
      { name: '대웅전(大雄殿)', role: '석가모니불을 모신 본전. 삼배로 마음을 여세요.' },
      { name: '관음전(觀音殿)', role: '관세음보살 — 인연과 자비의 기운. 소원을 발원하기 좋은 곳.' },
      { name: '종루(鐘樓)', role: '범종 소리가 마음의 업장을 씻어준다고 전해집니다.' },
    ]
  },
  토: {
    icon: '⛰️',
    desc: '토(土) 기운은 안정·중심·건강을 상징합니다. 이 사찰의 중심 전각에서 안정을 구하세요.',
    halls: [
      { name: '대웅전(大雄殿)', role: '석가모니불을 모신 본전. 108배로 마음을 가다듬어 보세요.' },
      { name: '약사전(藥師殿)', role: '약사여래불 — 몸과 마음의 치유 발원처.' },
      { name: '지장전(地藏殿)', role: '지장보살 — 안녕과 평안을 기원하는 곳.' },
    ]
  },
  금: {
    icon: '✨',
    desc: '금(金) 기운은 재물·결단·정화를 상징합니다. 대웅전과 산신각에서 서쪽을 향해 기도하면 금 기운이 보강됩니다.',
    halls: [
      { name: '대웅전(大雄殿)', role: '석가모니불 본전. 서쪽을 향해 기도하면 금 기운이 더해집니다.' },
      { name: '산신각(山神閣)', role: '재물운과 산신의 가호를 함께 기원할 수 있는 곳.' },
      { name: '범종각(梵鐘閣)', role: '범종 소리로 탐욕을 내려놓고 맑은 마음을 회복하세요.' },
    ]
  },
  수: {
    icon: '💧',
    desc: '수(水) 기운은 지혜·학문·흐름을 상징합니다. 문수전(文殊殿)이 있다면 반드시 들르세요.',
    halls: [
      { name: '대웅전(大雄殿)', role: '석가모니불 본전. 조용히 앉아 지혜를 발원해보세요.' },
      { name: '문수전(文殊殿)', role: '문수보살 — 지혜와 학문의 보살. 있다면 가장 중요한 곳.' },
      { name: '경내 연못·계곡', role: '수(水) 기운의 상징. 흐르는 물 앞에서 잠시 명상하세요.' },
    ]
  },
};

// 기도목적별 추가 안내 전각
const PURPOSE_HALL_EXTRA = {
  재물운: { name: '칠성각(七星閣)', tip: '칠성신에게 재물과 복록을 기원하는 전각. 있으면 꼭 들르세요.' },
  건강운: { name: '약사전(藥師殿)', tip: '약사여래불을 모신 곳. 108배를 올리며 건강을 발원하세요.' },
  학업운: { name: '문수전(文殊殿)', tip: '지혜의 보살 문수보살을 모신 전각. 학업 기도의 핵심입니다.' },
  인연운: { name: '관음전(觀音殿)', tip: '관세음보살 — 인연과 자비의 기운이 가장 강한 전각.' },
  가정운: { name: '지장전(地藏殿)', tip: '지장보살 — 가족의 안녕과 조상님 천도를 기원하는 곳.' },
  수험합격: { name: '문수전(文殊殿)', tip: '지혜의 보살 문수보살 — 시험 합격과 지혜를 기원하는 핵심 전각.' },
  취업운: { name: '칠성각(七星閣)', tip: '칠성신 — 복록과 직업 운세를 관장하는 전각. 꼭 들르세요.' },
  출산기도: { name: '삼신각(三神閣)', tip: '삼신할머니 — 임신·출산·육아를 관장하는 전각. 가장 먼저 참배하세요.' },
};

const BEARING_DEG = {
  북: 0, 동북: 45, 동: 90, 동남: 135,
  남: 180, 남서: 225, 서: 270, 북서: 315,
};

function buildCompassSVG(deg) {
  const rad = (deg - 90) * Math.PI / 180;
  const cx = 60, cy = 60, r = 48;
  const needleLen = 38;
  const nx = cx + needleLen * Math.cos(rad);
  const ny = cy + needleLen * Math.sin(rad);
  const tx = cx - needleLen * 0.6 * Math.cos(rad);
  const ty = cy - needleLen * 0.6 * Math.sin(rad);
  const label = Object.entries(BEARING_DEG).find(([,v]) => v === deg)?.[0] || "";
  return `<div style="display:flex;flex-direction:column;align-items:center;margin:8px 0 16px;">
    <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(0,210,255,0.25)" stroke-width="2"/>
      <circle cx="${cx}" cy="${cy}" r="4" fill="#00D2FF"/>
      <text x="${cx}" y="10" text-anchor="middle" fill="rgba(0,210,255,0.7)" font-size="11" font-family="sans-serif">북</text>
      <text x="${cx}" y="116" text-anchor="middle" fill="rgba(0,210,255,0.5)" font-size="10" font-family="sans-serif">남</text>
      <text x="8" y="${cy+4}" text-anchor="middle" fill="rgba(0,210,255,0.5)" font-size="10" font-family="sans-serif">서</text>
      <text x="112" y="${cy+4}" text-anchor="middle" fill="rgba(0,210,255,0.5)" font-size="10" font-family="sans-serif">동</text>
      <line x1="${tx}" y1="${ty}" x2="${nx}" y2="${ny}" stroke="#00D2FF" stroke-width="3" stroke-linecap="round"/>
      <circle cx="${nx}" cy="${ny}" r="5" fill="#00D2FF"/>
    </svg>
    ${label ? `<div style="font-size:13px;color:rgba(0,210,255,0.9);margin-top:-4px;">${label}쪽 방향 사찰이 인연</div>` : ""}
  </div>`;
}

const app = document.getElementById("app");

// 멤버십 전용 코드 — 유튜브 채널 멤버십 회원에게 커뮤니티 공지 등으로 배포
// 결제 시스템이 아니라 "회원 확인용 접근 코드"이므로 간단한 문자열 대조 방식
const MEMBER_CODE = "잼공가족2026";
const MEMBER_KEY = "jamgong-inyeonsachal-member";

function isMember() {
  return localStorage.getItem(MEMBER_KEY) === "true";
}

function tryUnlockMembership(code) {
  if (code.trim() === MEMBER_CODE) {
    localStorage.setItem(MEMBER_KEY, "true");
    return true;
  }
  return false;
}

const FALLBACK_LOCATION = { userLat: 37.5665, userLng: 126.9780, locationLabel: "서울특별시청 (기본값)" };

/** 브라우저 Geolocation API로 실제 위치 감지. 미지원/거부/타임아웃 시 서울시청으로 안전하게 폴백 */
function detectUserLocation() {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      resolve(FALLBACK_LOCATION);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          userLat: pos.coords.latitude,
          userLng: pos.coords.longitude,
          locationLabel: "현재 위치 감지됨",
        });
      },
      () => resolve(FALLBACK_LOCATION), // 사용자가 위치 권한 거부 시
      { timeout: 5000, maximumAge: 300000 }
    );
  });
}

function render() {
  app.innerHTML = `
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
    <div id="temple-search-wrap" style="margin:0 0 16px 0;">
      <div style="display:flex;gap:8px;margin-bottom:8px;">
        <!-- 커스텀 지역 드롭다운 -->
        <div id="region-dropdown" style="position:relative;flex:0 0 auto;">
          <button id="region-btn" type="button" style="background:#1E293B;border:1.5px solid rgba(255,255,255,0.2);border-radius:12px;color:#fff;font-size:13px;padding:10px 12px;cursor:pointer;outline:none;white-space:nowrap;display:flex;align-items:center;gap:6px;">
            <span id="region-label">📍 전체 지역</span><span style="font-size:10px;opacity:0.6;">▼</span>
          </button>
          <div id="region-list" style="display:none;position:absolute;top:calc(100% + 6px);left:0;min-width:120px;background:#1E293B;border:1.5px solid rgba(255,255,255,0.2);border-radius:12px;overflow:hidden;z-index:200;box-shadow:0 8px 24px rgba(0,0,0,0.6);">
            <div class="rg-item" data-val="" style="padding:10px 14px;font-size:13px;color:#fff;cursor:pointer;transition:background .12s;">📍 전체 지역</div>
            <div class="rg-item" data-val="서울" style="padding:10px 14px;font-size:13px;color:#fff;cursor:pointer;transition:background .12s;">서울</div>
            <div class="rg-item" data-val="경기" style="padding:10px 14px;font-size:13px;color:#fff;cursor:pointer;transition:background .12s;">경기</div>
            <div class="rg-item" data-val="인천" style="padding:10px 14px;font-size:13px;color:#fff;cursor:pointer;transition:background .12s;">인천</div>
            <div class="rg-item" data-val="강원" style="padding:10px 14px;font-size:13px;color:#fff;cursor:pointer;transition:background .12s;">강원</div>
            <div class="rg-item" data-val="충북" style="padding:10px 14px;font-size:13px;color:#fff;cursor:pointer;transition:background .12s;">충북</div>
            <div class="rg-item" data-val="충남" style="padding:10px 14px;font-size:13px;color:#fff;cursor:pointer;transition:background .12s;">충남</div>
            <div class="rg-item" data-val="대전" style="padding:10px 14px;font-size:13px;color:#fff;cursor:pointer;transition:background .12s;">대전</div>
            <div class="rg-item" data-val="세종" style="padding:10px 14px;font-size:13px;color:#fff;cursor:pointer;transition:background .12s;">세종</div>
            <div class="rg-item" data-val="전북" style="padding:10px 14px;font-size:13px;color:#fff;cursor:pointer;transition:background .12s;">전북</div>
            <div class="rg-item" data-val="전남" style="padding:10px 14px;font-size:13px;color:#fff;cursor:pointer;transition:background .12s;">전남</div>
            <div class="rg-item" data-val="광주" style="padding:10px 14px;font-size:13px;color:#fff;cursor:pointer;transition:background .12s;">광주</div>
            <div class="rg-item" data-val="경북" style="padding:10px 14px;font-size:13px;color:#fff;cursor:pointer;transition:background .12s;">경북</div>
            <div class="rg-item" data-val="경남" style="padding:10px 14px;font-size:13px;color:#fff;cursor:pointer;transition:background .12s;">경남</div>
            <div class="rg-item" data-val="대구" style="padding:10px 14px;font-size:13px;color:#fff;cursor:pointer;transition:background .12s;">대구</div>
            <div class="rg-item" data-val="울산" style="padding:10px 14px;font-size:13px;color:#fff;cursor:pointer;transition:background .12s;">울산</div>
            <div class="rg-item" data-val="부산" style="padding:10px 14px;font-size:13px;color:#fff;cursor:pointer;transition:background .12s;">부산</div>
            <div class="rg-item" data-val="제주" style="padding:10px 14px;font-size:13px;color:#fff;cursor:pointer;transition:background .12s;">제주</div>
          </div>
        </div>
        <div style="position:relative;flex:1;">
          <div style="display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,255,255,0.15);border-radius:12px;padding:10px 14px;">
            <span style="font-size:16px;">🔍</span>
            <input id="temple-search-input" type="text" placeholder="사찰 이름 검색 (예: 통도사)" autocomplete="off"
              style="flex:1;background:none;border:none;outline:none;color:#fff;font-size:14px;font-family:inherit;" />
            <button id="temple-search-clear" type="button" style="display:none;background:none;border:none;color:rgba(255,255,255,0.4);font-size:16px;cursor:pointer;padding:0;">✕</button>
          </div>
          <div id="temple-search-results" style="display:none;position:absolute;top:calc(100% + 6px);left:0;right:0;background:#0F172A;border:1.5px solid rgba(255,255,255,0.15);border-radius:14px;overflow:hidden;z-index:100;max-height:280px;overflow-y:auto;box-shadow:0 8px 32px rgba(0,0,0,0.5);"></div>
        </div>
      </div>
    </div>

    <form class="form-card" id="match-form">
      <svg class="corner-cloud tl" viewBox="0 0 40 40"><path d="M4 20 Q4 12 12 12 Q13 6 20 7 Q25 3 30 8 Q36 8 36 15" fill="none" stroke="#B8892B" stroke-width="1.3" stroke-linecap="round"/></svg>
      <svg class="corner-cloud tr" viewBox="0 0 40 40"><path d="M36 20 Q36 12 28 12 Q27 6 20 7 Q15 3 10 8 Q4 8 4 15" fill="none" stroke="#B8892B" stroke-width="1.3" stroke-linecap="round"/></svg>
      <svg class="corner-cloud bl" viewBox="0 0 40 40"><path d="M4 20 Q4 28 12 28 Q13 34 20 33 Q25 37 30 32 Q36 32 36 25" fill="none" stroke="#B8892B" stroke-width="1.3" stroke-linecap="round"/></svg>
      <svg class="corner-cloud br" viewBox="0 0 40 40"><path d="M36 20 Q36 28 28 28 Q27 34 20 33 Q15 37 10 32 Q4 32 4 25" fill="none" stroke="#B8892B" stroke-width="1.3" stroke-linecap="round"/></svg>

      <div class="mode-toggle-wrap">
        <button type="button" class="mode-toggle-btn active" data-mode="solo">🙏 혼자 찾기</button>
        <button type="button" class="mode-toggle-btn" data-mode="couple">💑 둘이 찾기</button>
        <button type="button" class="mode-toggle-btn" data-mode="saju">🔮 사주 보기</button>
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
              ${Array.from({length: 106}, (_, i) => 2025 - i).map(y => `<option value="${y}">${y}년</option>`).join("")}
            </select>
          </div>
          <div class="birth-field">
            <span class="birth-field-label">월</span>
            <select id="birth-month" aria-label="월">
              <option value="">선택</option>
              ${Array.from({length: 12}, (_, i) => i + 1).map(m => `<option value="${m}">${m}월</option>`).join("")}
            </select>
          </div>
          <div class="birth-field">
            <span class="birth-field-label">일</span>
            <select id="birth-day" aria-label="일">
              <option value="">선택</option>
              ${Array.from({length: 31}, (_, i) => i + 1).map(d => `<option value="${d}">${d}일</option>`).join("")}
            </select>
          </div>
          <div class="birth-field">
            <span class="birth-field-label">시간</span>
            <select id="birth-hour" aria-label="시">
              <option value="">모름</option>
              ${Array.from({length: 24}, (_, i) => i).map(h => `<option value="${h}">${String(h).padStart(2,"0")}시</option>`).join("")}
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
        <label>상대방 생년월일시</label>
        <div class="calendar-toggle">
          <button type="button" class="calendar-toggle-btn active" data-calendar-b="solar">양력</button>
          <button type="button" class="calendar-toggle-btn" data-calendar-b="lunar">음력</button>
        </div>
        <div class="birth-fields-row">
          <div class="birth-field">
            <span class="birth-field-label">연도</span>
            <select id="birth-year-b" aria-label="상대방 연도">
              <option value="">선택</option>
              ${Array.from({length: 106}, (_, i) => 2025 - i).map(y => `<option value="${y}">${y}년</option>`).join("")}
            </select>
          </div>
          <div class="birth-field">
            <span class="birth-field-label">월</span>
            <select id="birth-month-b" aria-label="상대방 월">
              <option value="">선택</option>
              ${Array.from({length: 12}, (_, i) => i + 1).map(m => `<option value="${m}">${m}월</option>`).join("")}
            </select>
          </div>
          <div class="birth-field">
            <span class="birth-field-label">일</span>
            <select id="birth-day-b" aria-label="상대방 일">
              <option value="">선택</option>
              ${Array.from({length: 31}, (_, i) => i + 1).map(d => `<option value="${d}">${d}일</option>`).join("")}
            </select>
          </div>
          <div class="birth-field">
            <span class="birth-field-label">시간</span>
            <select id="birth-hour-b" aria-label="상대방 시">
              <option value="">모름</option>
              ${Array.from({length: 24}, (_, i) => i).map(h => `<option value="${h}">${String(h).padStart(2,"0")}시</option>`).join("")}
            </select>
          </div>
        </div>
      </div>

      <div class="field" id="purpose-field">
        <label>기도 목적 <span class="help-tip" tabindex="0">?<span class="help-tip-bubble">지금 가장 채우고 싶은 기운을 골라주세요. 사주상 부족한 오행과 함께 계산에 반영됩니다.</span></span></label>
        <div class="purpose-grid" id="purpose-grid">
          ${PURPOSES.map((p, i) => `
            <div class="purpose-chip${i === 0 ? " active" : ""}" data-purpose="${p}">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${PURPOSE_ICONS[p]}</svg>
              <span>${p}</span>
              <span class="purpose-en">${PURPOSE_EN[p]}</span>
            </div>
          `).join("")}
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
  `;


  let selectedPurpose = PURPOSES[0];
  document.querySelectorAll(".purpose-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".purpose-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      selectedPurpose = chip.dataset.purpose;
    });
  });

  let selectedCalendar = "solar";
  document.querySelectorAll("[data-calendar]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-calendar]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedCalendar = btn.dataset.calendar;
      document.getElementById("leap-month-wrap").classList.toggle("hidden", selectedCalendar !== "lunar");
    });
  });

  // 시간 모름 선택 시 분(分) 비활성화
  document.getElementById("birth-hour")?.addEventListener("change", (e) => {
    const minuteSel = document.getElementById("birth-minute");
    if (minuteSel) minuteSel.disabled = e.target.value === "";
  });

  // 출생지 선택 시 경도 표시
  document.getElementById("birth-city")?.addEventListener("change", (e) => {
    const el = document.getElementById("birth-lng-display");
    if (el) el.textContent = e.target.value ? "경도 " + e.target.value + "°" : "";
  });

  // 성별 선택
  let selectedGender = "male";
  document.querySelectorAll(".gender-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".gender-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedGender = btn.dataset.gender;
    });
  });

  let selectedCalendarB = "solar";
  document.querySelectorAll("[data-calendar-b]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-calendar-b]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedCalendarB = btn.dataset.calendarB;
    });
  });

  let matchMode = "solo";
  document.querySelectorAll(".mode-toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mode-toggle-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      matchMode = btn.dataset.mode;
      const birthBField = document.getElementById("birth-b-field");
      const labelA = document.getElementById("birth-label-a");
      const submitBtn = document.getElementById("submit-btn");
      const purposeField = document.getElementById("purpose-field");
      const locationField = document.getElementById("location-field");
      if (matchMode === "couple") {
        birthBField.classList.remove("hidden");
        birthBField.style.display = "flex";
        labelA.textContent = "내 생년월일시";
        submitBtn.textContent = "함께 인연사찰 찾기";
        if (purposeField) purposeField.style.display = "";
        if (locationField) locationField.style.display = "";
      } else if (matchMode === "saju") {
        birthBField.classList.add("hidden");
        birthBField.style.display = "none";
        labelA.innerHTML = `생년월일시 <span class="help-tip" tabindex="0">?<span class="help-tip-bubble">사주 팔자 계산의 기준이 되는 정보입니다.</span></span>`;
        submitBtn.textContent = "🔮 사주 팔자 확인";
        if (purposeField) purposeField.style.display = "none";
        if (locationField) locationField.style.display = "none";
      } else {
        birthBField.classList.add("hidden");
        birthBField.style.display = "none";
        labelA.innerHTML = `생년월일시 <span class="help-tip" tabindex="0">?<span class="help-tip-bubble">사주 오행 계산의 기준이 되는 정보입니다. 시간을 모르셔도 괜찮습니다 — "시간 모름"을 선택하시면 정오 기준으로 계산됩니다.</span></span>`;
        submitBtn.textContent = "인연사찰 찾기";
        if (purposeField) purposeField.style.display = "";
        if (locationField) locationField.style.display = "";
      }
    });
  });

  // ── 사찰 이름 검색 초기화 (fetch 방식) ──
  (function initTempleSearch() {
    const input = document.getElementById('temple-search-input');
    const resultsBox = document.getElementById('temple-search-results');
    const clearBtn = document.getElementById('temple-search-clear');
    const regionBtn = document.getElementById('region-btn');
    const regionLabel = document.getElementById('region-label');
    const regionList = document.getElementById('region-list');
    if (!input || !resultsBox) return;

    let allTemples = [];
    let selectedRegion = '';
    // API에서 사찰 목록 로드
    fetch('/api/temple-list').then(function(r){ return r.ok ? r.json() : []; })
      .then(function(data){ allTemples = data; })
      .catch(function(){ allTemples = []; });

    // 커스텀 드롭다운 동작
    if (regionBtn && regionList) {
      regionBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        regionList.style.display = regionList.style.display === 'none' ? 'block' : 'none';
      });
      regionList.querySelectorAll('.rg-item').forEach(function(item) {
        item.addEventListener('mouseover', function() { this.style.background = 'rgba(255,255,255,0.1)'; });
        item.addEventListener('mouseout', function() { this.style.background = ''; });
        item.addEventListener('click', function(e) {
          e.stopPropagation();
          selectedRegion = this.dataset.val || '';
          if (regionLabel) regionLabel.textContent = selectedRegion ? ('📍 ' + selectedRegion) : '📍 전체 지역';
          regionList.style.display = 'none';
          showResults(input.value);
        });
      });
      document.addEventListener('click', function() { regionList.style.display = 'none'; });
    }

    function getRegion() { return selectedRegion; }

    function showResults(query) {
      query = (query||'').trim();
      clearBtn.style.display = query ? 'block' : 'none';
      const region = getRegion();
      if (!query && !region) { resultsBox.style.display = 'none'; return; }
      var matches = allTemples.filter(function(t) {
        var nameOk = !query || (t.name && t.name.includes(query));
        var regionOk = !region || (t.address && t.address.includes(region));
        return nameOk && regionOk;
      }).slice(0, query ? 15 : 100);
      if (!matches.length) {
        resultsBox.innerHTML = '<div style="padding:14px 18px;font-size:14px;color:rgba(255,255,255,0.4);">검색 결과가 없습니다</div>';
        resultsBox.style.display = 'block';
        return;
      }
      resultsBox.innerHTML = matches.map(function(t) {
        return '<div class="tsearch-item" data-id="' + (t.id||'') + '" data-name="' + (t.name||'') + '" style="padding:12px 16px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:10px;transition:background .12s;">'
          + '<span style="font-size:16px;">🏯</span>'
          + '<div><div style="font-size:14px;font-weight:700;color:#fff;">' + (t.name||'') + '</div>'
          + '<div style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:2px;">' + (t.address||'').slice(0,30) + '</div></div>'
          + '</div>';
      }).join('');
      resultsBox.style.display = 'block';
    }

    input.addEventListener('input', function() { showResults(this.value); });
    clearBtn.addEventListener('click', function() {
      input.value = ''; clearBtn.style.display = 'none'; resultsBox.style.display = 'none'; input.focus();
    });

    resultsBox.addEventListener('click', function(e) {
      const item = e.target.closest('.tsearch-item');
      if (!item) return;
      const name = item.dataset.name;
      const id = item.dataset.id;
      const temple = allTemples.find(function(t) { return t.id === id || t.name === name; });
      if (!temple) return;
      input.value = ''; resultsBox.style.display = 'none'; clearBtn.style.display = 'none';
      const fakeResult = {
        temple: temple,
        detail: { templeOhaeng: '금', bearing: '—', distanceKm: null },
        score: 0,
        reason: '직접 검색하신 사찰입니다.',
        weather: null
      };
      const resultsEl = document.getElementById('results');
      const formEl = document.getElementById('match-form');
      renderTempleDetailPage(fakeResult, null, false, function() {
        if (resultsEl) { resultsEl.innerHTML = ''; resultsEl.classList.add('hidden'); }
        if (formEl) formEl.style.display = '';
        const sw = document.getElementById('temple-search-wrap');
        if (sw) sw.style.display = '';
      });
    });

    document.addEventListener('click', function(e) {
      const sw = document.getElementById('temple-search-wrap');
      if (sw && !sw.contains(e.target)) resultsBox.style.display = 'none';
    });

    resultsBox.addEventListener('mouseover', function(e) {
      const item = e.target.closest('.tsearch-item');
      if (item) item.style.background = 'rgba(255,255,255,0.08)';
    });
    resultsBox.addEventListener('mouseout', function(e) {
      const item = e.target.closest('.tsearch-item');
      if (item) item.style.background = '';
    });
  })();

  document.getElementById("match-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const year = document.getElementById("birth-year").value;
    const month = document.getElementById("birth-month").value;
    const day = document.getElementById("birth-day").value;
    const hour = document.getElementById("birth-hour").value;
    const minuteRaw = parseInt(document.getElementById("birth-minute")?.value) || 0;
    const minute = Math.min(59, Math.max(0, minuteRaw));
    const birthCity = document.getElementById("birth-city")?.value || "";
    const isLeapMonth = document.getElementById("is-leap-month")?.checked || false;

    if (!year || !month || !day) {
      alert("생년월일(연도·월·일)을 모두 선택해주세요.");
      return;
    }

    const birthInput = {
      calendarType: selectedCalendar,
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: hour !== "" ? parseInt(hour) : 12,
      minute: minute,
      isLeapMonth,
      birthLongitude: birthCity !== "" ? parseFloat(birthCity) : null,
      gender: selectedGender,
    };

    if (matchMode === "couple") {
      const yearB = document.getElementById("birth-year-b").value;
      const monthB = document.getElementById("birth-month-b").value;
      const dayB = document.getElementById("birth-day-b").value;
      if (!yearB || !monthB || !dayB) {
        alert("상대방 생년월일(연도·월·일)을 모두 선택해주세요.");
        return;
      }
    }

    // 사주 보기 모드 — 사주 계산 + 위치 감지 + 인연사찰 매칭 동시 처리
    if (matchMode === "saju") {
      const submitBtn = document.getElementById("submit-btn");
      submitBtn.disabled = true;

      // 폼 숨기고 로딩 화면 표시
      const formEl = document.getElementById("match-form");
      if (formEl) formEl.style.display = "none";
      const resultsEl = document.getElementById("results");
      resultsEl.classList.remove("hidden");
      const sajuLoadingMsgs = [
        { icon: "🔍", text: "위치 감지 중..." },
        { icon: "🌀", text: "사주 오행 분석 중..." },
        { icon: "✨", text: "AI 풀이 생성 중..." },
        { icon: "🏯", text: "인연사찰 탐색 중..." },
        { icon: "🔮", text: "팔자 기운 살피는 중..." },
      ];
      let loadMsgIdx = 0;
      const showLoadingScreen = () => {
        const m = sajuLoadingMsgs[loadMsgIdx % sajuLoadingMsgs.length];
        resultsEl.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:320px;gap:28px;padding:40px 20px;">
            <div style="position:relative;width:90px;height:90px;">
              <div style="position:absolute;inset:0;border-radius:50%;border:2px solid rgba(0,210,255,0.15);"></div>
              <div style="position:absolute;inset:6px;border-radius:50%;border:2px solid transparent;border-top-color:rgba(0,210,255,0.8);border-right-color:rgba(107,130,249,0.4);animation:spin 1.2s linear infinite;"></div>
              <div style="position:absolute;inset:16px;border-radius:50%;border:2px solid transparent;border-bottom-color:rgba(0,210,255,0.5);animation:spin 1.8s linear infinite reverse;"></div>
              <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:28px;">${m.icon}</div>
            </div>
            <div style="text-align:center;">
              <div id="saju-loading-text" style="font-size:16px;font-weight:700;color:rgba(0,210,255,0.9);letter-spacing:.04em;margin-bottom:8px;">${m.text}</div>
              <div style="font-size:12px;color:rgba(255,255,255,0.35);letter-spacing:.06em;">사주 팔자 · AI 풀이 · 인연사찰</div>
            </div>
            <div style="display:flex;gap:6px;">
              ${sajuLoadingMsgs.map((_, i) => `<div class="saju-dot" style="width:6px;height:6px;border-radius:50%;background:${i === loadMsgIdx % sajuLoadingMsgs.length ? 'rgba(0,210,255,0.9)' : 'rgba(255,255,255,0.15)'};transition:background .3s;"></div>`).join('')}
            </div>
          </div>`;
      };
      showLoadingScreen();
      const loadingInterval = setInterval(() => {
        loadMsgIdx++;
        const m = sajuLoadingMsgs[loadMsgIdx % sajuLoadingMsgs.length];
        const textEl = document.getElementById("saju-loading-text");
        if (textEl) textEl.textContent = m.text;
        document.querySelectorAll(".saju-dot").forEach((dot, i) => {
          dot.style.background = i === loadMsgIdx % sajuLoadingMsgs.length ? "rgba(0,210,255,0.9)" : "rgba(255,255,255,0.15)";
        });
        // 아이콘만 교체
        const iconEl = resultsEl.querySelector("[style*='font-size:28px']");
        if (iconEl) iconEl.textContent = m.icon;
      }, 2200);

      try {
        // 사주 API + 위치 감지 병렬 처리
        const [sajuRes, locData] = await Promise.all([
          fetch("/api/saju", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ birthInput }),
          }),
          detectUserLocation(),
        ]);
        const sajuData = await sajuRes.json();
        if (sajuData.error) {
          clearInterval(loadingInterval);
          resultsEl.classList.add("hidden");
          if (formEl) formEl.style.display = "";
          alert(sajuData.error + (sajuData.detail ? "\n\n[" + sajuData.detail + "]" : ""));
          return;
        }

        // 매칭 + AI 풀이 병렬 처리 (최대 40초 대기)
        let matchData = null, explainData = null;
        const matchLat = locData.userLat ?? 37.5665;
        const matchLng = locData.userLng ?? 126.9780;

        const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));

        try {
          const [matchRes, explainRes] = await Promise.all([
            fetch("/api/match", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ birthInput, purpose: selectedPurpose || "인연운", userLat: matchLat, userLng: matchLng }),
            }),
            Promise.race([
              fetch("/api/saju-explain", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  eightChar: sajuData.eightChar,
                  distribution: sajuData.distribution,
                  weak: sajuData.weak,
                  daYun: sajuData.daYun
                    ? { ...sajuData.daYun, list: sajuData.daYun.list?.filter(d => d.isCurrent || (d.startAge >= 30)) }
                    : null,
                  samjae: sajuData.samjae,
                  birthInput,
                }),
              }),
              timeout(38000),
            ]).catch(() => null),
          ]);
          if (matchRes?.ok) matchData = await matchRes.json();
          if (explainRes?.ok) explainData = await explainRes.json();
        } catch (e) {
          console.warn("병렬 오류:", e);
        }

        clearInterval(loadingInterval);
        renderSajuPage(sajuData, birthInput, matchData, explainData?.explanation || null);

        // AI 풀이 백그라운드 재시도 (초기 타임아웃/실패 시)
        if (!explainData?.explanation) {
          (async () => {
            try {
              const r2 = await fetch("/api/saju-explain", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  eightChar: sajuData.eightChar,
                  distribution: sajuData.distribution,
                  weak: sajuData.weak,
                  daYun: sajuData.daYun
                    ? { ...sajuData.daYun, list: sajuData.daYun.list?.filter(d => d.isCurrent || (d.startAge >= 30)) }
                    : null,
                  samjae: sajuData.samjae,
                  birthInput,
                }),
              });
              let d2 = null;
              let errMsg = `HTTP ${r2.status}`;
              if (r2.ok) {
                d2 = await r2.json();
              } else {
                try { const eb = await r2.json(); errMsg = eb?.error || eb?.message || errMsg; } catch(_) {}
              }
              const el = document.getElementById("saju-ai-explanation");
              if (!el) return;
              if (d2?.explanation) {
                el.innerHTML = d2.explanation
                  .replace(/^#{1,3}\s+(.+)$/gm, '<h3 class="saju-explain-h3">$1</h3>')
                  .replace(/^---+$/gm, '<hr style="border:none;border-top:1px solid rgba(0,210,255,0.15);margin:12px 0;">')
                  .replace(/\*\*(.+?)\*\*/g, '<strong class="saju-explain-heading">$1</strong>')
                  .replace(/\n\n/g, '</p><p>')
                  .replace(/\n/g, '<br>')
                  .replace(/^/, '<p>').replace(/$/, '</p>')
                  .replace(/<p>\s*(<h3|<hr)/g, '$1')
                  .replace(/(<\/h3>|<hr[^>]*>)\s*<\/p>/g, '$1');
              } else {
                el.innerHTML = `<div style="font-size:13px;color:rgba(255,255,255,0.45);padding:12px 0;text-align:center;">AI 사주 풀이를 불러오지 못했습니다.<br><span style="font-size:11px;color:rgba(255,100,100,0.6);display:block;margin-top:4px;">[오류: ${errMsg}]</span><button onclick="location.reload()" style="margin-top:8px;background:none;border:1px solid rgba(0,210,255,0.35);color:rgba(0,210,255,0.7);border-radius:8px;padding:5px 14px;cursor:pointer;font-size:12px;">↻ 새로고침해서 다시 시도</button></div>`;
              }
            } catch(fetchErr) {
              const el = document.getElementById("saju-ai-explanation");
              if (el) el.innerHTML = `<div style="font-size:13px;color:rgba(255,255,255,0.45);padding:12px 0;text-align:center;">AI 사주 풀이를 불러오지 못했습니다.<br><span style="font-size:11px;color:rgba(255,100,100,0.6);display:block;margin-top:4px;">[오류: ${fetchErr.message}]</span><button onclick="location.reload()" style="margin-top:8px;background:none;border:1px solid rgba(0,210,255,0.35);color:rgba(0,210,255,0.7);border-radius:8px;padding:5px 14px;cursor:pointer;font-size:12px;">↻ 새로고침해서 다시 시도</button></div>`;
            }
          })();
        }
      } catch (err) {
        clearInterval(loadingInterval);
        resultsEl.classList.add("hidden");
        resultsEl.innerHTML = "";
        if (formEl) formEl.style.display = "";
        console.error("사주 오류:", err);
        alert("사주 계산 중 오류가 발생했습니다.\n\n[" + (err?.message || String(err)) + "]");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "🔮 사주 팔자 확인";
      }
      return;
    }

    const submitBtn = document.getElementById("submit-btn");
    submitBtn.disabled = true;

    let userLat, userLng;

    const loadingMessages = [
      "🔍 위치 확인 중...",
      "🌀 오행 기운 분석 중...",
      "🏯 인연사찰 탐색 중...",
      "✨ 인연을 살피는 중...",
    ];
    let msgIdx = 0;
    submitBtn.textContent = loadingMessages[0];
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length;
      submitBtn.textContent = loadingMessages[msgIdx];
    }, 1200);

    try {
      const detected = await detectUserLocation();
      userLat = detected.userLat;
      userLng = detected.userLng;
    } catch (e) { /* 위치 없이 진행 */ }

    submitBtn.textContent = "✨ 인연을 살피는 중...";

    try {
      if (matchMode === "couple") {
        const yearB = document.getElementById("birth-year-b").value;
        const monthB = document.getElementById("birth-month-b").value;
        const dayB = document.getElementById("birth-day-b").value;
        const hourB = document.getElementById("birth-hour-b").value;
        const birthInputB = {
          calendarType: selectedCalendarB,
          year: parseInt(yearB),
          month: parseInt(monthB),
          day: parseInt(dayB),
          hour: hourB !== "" ? parseInt(hourB) : 12,
          minute: 0,
          isLeapMonth: false,
        };
        const res = await fetch("/api/match-couple", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ birthInputA: birthInput, birthInputB, purpose: selectedPurpose, userLat, userLng, memberUnlocked: isMember(), region: document.getElementById("region-select")?.value || "", maxDistanceKm: parseInt(document.getElementById("distance-select")?.value) || null }),
        });
        const data = await res.json();
        if (data.error) {
          alert(`오류가 발생했습니다: ${data.error}\n생년월일을 다시 확인해주세요.`);
          return;
        }
        data.purpose = selectedPurpose;
        renderCoupleResults(data);
      } else {
        const res = await fetch("/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ birthInput, purpose: selectedPurpose, userLat, userLng, memberUnlocked: isMember(), region: document.getElementById("region-select")?.value || "", maxDistanceKm: parseInt(document.getElementById("distance-select")?.value) || null }),
        });
        const data = await res.json();
        if (data.error) {
          alert(`오류가 발생했습니다: ${data.error}\n생년월일을 다시 확인해주세요.`);
          return;
        }
        data.purpose = selectedPurpose;
        renderResults(data);
      }
    } catch (err) {
      alert("매칭 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      clearInterval(msgInterval);
      submitBtn.disabled = false;
      submitBtn.textContent = matchMode === "couple" ? "함께 인연사찰 찾기" : "인연사찰 찾기";
    }
  });
}

function buildSajuDetailCards(data, birthInput) {
  const ec = data.eightChar;
  if (!ec) return '';

  const G = s => s?.[0] || '';
  const J = s => s?.[1] || '';

  const dayGan = G(ec.day), monthGan = G(ec.month), yearGan = G(ec.year), timeGan = G(ec.time);
  const dayJi  = J(ec.day), monthJi  = J(ec.month), yearJi  = J(ec.year), timeJi  = J(ec.time);
  const allJi  = [timeJi, dayJi, monthJi, yearJi].filter(Boolean);

  /* ── 십신 ── */
  const SS = {
    '甲':{'甲':'비견','乙':'겁재','丙':'식신','丁':'상관','戊':'편재','己':'정재','庚':'편관','辛':'정관','壬':'편인','癸':'정인'},
    '乙':{'甲':'겁재','乙':'비견','丙':'상관','丁':'식신','戊':'정재','己':'편재','庚':'정관','辛':'편관','壬':'정인','癸':'편인'},
    '丙':{'甲':'편인','乙':'정인','丙':'비견','丁':'겁재','戊':'식신','己':'상관','庚':'편재','辛':'정재','壬':'편관','癸':'정관'},
    '丁':{'甲':'정인','乙':'편인','丙':'겁재','丁':'비견','戊':'상관','己':'식신','庚':'정재','辛':'편재','壬':'정관','癸':'편관'},
    '戊':{'甲':'편관','乙':'정관','丙':'편인','丁':'정인','戊':'비견','己':'겁재','庚':'식신','辛':'상관','壬':'편재','癸':'정재'},
    '己':{'甲':'정관','乙':'편관','丙':'정인','丁':'편인','戊':'겁재','己':'비견','庚':'상관','辛':'식신','壬':'정재','癸':'편재'},
    '庚':{'甲':'편재','乙':'정재','丙':'편관','丁':'정관','戊':'편인','己':'정인','庚':'비견','辛':'겁재','壬':'식신','癸':'상관'},
    '辛':{'甲':'정재','乙':'편재','丙':'정관','丁':'편관','戊':'정인','己':'편인','庚':'겁재','辛':'비견','壬':'상관','癸':'식신'},
    '壬':{'甲':'식신','乙':'상관','丙':'편재','丁':'정재','戊':'편관','己':'정관','庚':'편인','辛':'정인','壬':'비견','癸':'겁재'},
    '癸':{'甲':'상관','乙':'식신','丙':'정재','丁':'편재','戊':'정관','己':'편관','庚':'정인','辛':'편인','壬':'겁재','癸':'비견'},
  };
  const SS_COLOR = {'비견':'#00D2FF','겁재':'#6B82F9','식신':'#4CAF50','상관':'#81C784','편재':'#FF9800','정재':'#FFB74D','편관':'#F44336','정관':'#EF9A9A','편인':'#CE93D8','정인':'#BA68C8'};
  const SS_DESC  = {'비견':'독립심·경쟁심','겁재':'추진력·욕망','식신':'표현력·식복','상관':'재능·자유','편재':'사업·활동성','정재':'안정적 재물','편관':'권력·결단','정관':'명예·원칙','편인':'직관·학문','정인':'학습·보호'};
  const getSS = g => (dayGan && SS[dayGan]) ? (SS[dayGan][g] || '') : '';

  const ssCols = [
    { label:'시(時)', gan:timeGan,  ji:timeJi,  ss: getSS(timeGan)  },
    { label:'일(日)', gan:dayGan,   ji:dayJi,   ss: '일원(日元)'    },
    { label:'월(月)', gan:monthGan, ji:monthJi, ss: getSS(monthGan) },
    { label:'년(年)', gan:yearGan,  ji:yearJi,  ss: getSS(yearGan)  },
  ];
  // 지지 정기(正氣) → 십신 집계
  const JI_JEONGGI = {
    子:'癸',丑:'己',寅:'甲',卯:'乙',辰:'戊',巳:'丙',
    午:'丁',未:'己',申:'庚',酉:'辛',戌:'戊',亥:'壬'
  };
  const ssCount = {};
  // 천간 십신 (일원(日元)은 비견으로 카운팅)
  ssCols.forEach(c => {
    const ss = c.ss === '일원(日元)' ? '비견' : c.ss;
    if (ss) ssCount[ss] = (ssCount[ss]||0)+1;
  });
  // 지지 십신 (정기 기준) — 년지·월지·일지·시지 포함
  [yearJi, monthJi, dayJi, timeJi].forEach(ji => {
    const jeonggi = JI_JEONGGI[ji];
    const jiSS = jeonggi ? getSS(jeonggi) : '';
    if (jiSS && jiSS !== '일원(日元)') ssCount[jiSS] = (ssCount[jiSS]||0)+1;
  });

  const sipsinHtml = `
  <div class="saju-card" style="margin-bottom:16px;">
    <div class="saju-card-title">⚖️ 십신(十神) 분석 <span style="font-size:11px;font-weight:400;color:rgba(255,255,255,0.35);margin-left:6px;">일간(${dayGan}) 기준</span></div>
    <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;text-align:center;">
        <tr>${ssCols.map(c=>`<th style="padding:8px 4px;color:rgba(255,255,255,0.4);font-size:11px;font-weight:500;border-bottom:1px solid rgba(255,255,255,0.08);">${c.label}</th>`).join('')}</tr>
        <tr>${ssCols.map(c=>{const col=c.ss==='일원(日元)'?'rgba(255,255,255,0.25)':(SS_COLOR[c.ss]||'#fff');return `<td style="padding:10px 4px;font-size:13px;font-weight:800;color:${col};">${c.ss}</td>`;}).join('')}</tr>
        <tr>${ssCols.map(c=>{const d=c.ss==='일원(日元)'?'나 자신':(SS_DESC[c.ss]||'');return `<td style="padding:4px;font-size:10px;color:rgba(255,255,255,0.35);line-height:1.4;">${d}</td>`;}).join('')}</tr>
      </table>
    </div>
    <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;">
      ${Object.entries(ssCount).sort((a,b)=>b[1]-a[1]).map(([n,cnt])=>`<span style="background:rgba(255,255,255,0.05);border:1px solid ${SS_COLOR[n]||'#888'}44;border-radius:20px;padding:4px 11px;font-size:12px;"><span style="color:${SS_COLOR[n]||'#fff'};font-weight:700;">${n}</span><span style="color:rgba(255,255,255,0.35);"> ×${cnt}</span></span>`).join('')}
    </div>
  </div>`;

  /* ── 신살 ── */
  const SH = {'申':'A','子':'A','辰':'A','寅':'B','午':'B','戌':'B','亥':'C','卯':'C','未':'C','巳':'D','酉':'D','丑':'D'};
  const yg = SH[yearJi] || SH[dayJi];
  const DOHWA  = {'A':'酉','B':'卯','C':'子','D':'午'};
  const YEOKMA = {'A':'寅','B':'申','C':'巳','D':'亥'};
  const HWAGAE = {'A':'辰','B':'戌','C':'未','D':'丑'};
  const CHULGI = {'甲':['丑','未'],'戊':['丑','未'],'庚':['丑','未'],'乙':['子','申'],'己':['子','申'],'丙':['亥','酉'],'丁':['亥','酉'],'壬':['卯','巳'],'癸':['卯','巳'],'辛':['午','寅']};
  const YANGIN = {'甲':'卯','丙':'午','戊':'午','庚':'酉','壬':'子','乙':'辰','丁':'未','己':'未','辛':'戌','癸':'丑'};

  const salList = [
    allJi.includes(DOHWA[yg])  && {name:'도화살(桃花殺)', icon:'🌸', color:'#FF6B9D', desc:'매력·인기운이 강합니다. 이성 관계와 예술·연예 분야에 유리합니다.'},
    allJi.includes(YEOKMA[yg]) && {name:'역마살(驛馬殺)', icon:'🐴', color:'#FF9800', desc:'활동성이 강하고 변화가 많습니다. 해외·출장·이사 등 이동수가 있습니다.'},
    (CHULGI[dayGan]||[]).some(j=>allJi.includes(j)) && {name:'천을귀인(天乙貴人)', icon:'⭐', color:'#FFD700', desc:'귀인의 도움을 받는 길성입니다. 위기 때 구원자가 나타납니다.'},
    allJi.includes(YANGIN[dayGan]) && {name:'양인살(羊刃殺)', icon:'⚔️', color:'#F44336', desc:'강한 승부욕·의지력. 칼날 같은 기운으로 신중함이 필요합니다.'},
    allJi.includes(HWAGAE[yg]) && {name:'화개살(華蓋殺)', icon:'🔮', color:'#9C27B0', desc:'예술·종교·철학적 소질이 있습니다. 고독하지만 깊은 내면을 가집니다.'},
  ].filter(Boolean);

  const hasYeokma   = salList.some(s => s.name.includes('역마살'));
  const hasChulgi   = salList.some(s => s.name.includes('천을귀인'));
  const synergyHtml = (hasYeokma && hasChulgi)
    ? `<div style="margin-top:14px;background:linear-gradient(135deg,rgba(255,215,0,0.08),rgba(255,152,0,0.05));border:1px solid rgba(255,215,0,0.25);border-radius:12px;padding:14px;">
        <div style="font-size:12px;font-weight:800;color:#FFD700;margin-bottom:8px;">✨ 시너지 — 천을귀인이 호위하는 역마살</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.75);line-height:1.9;">
          단순히 이동이 많고 분주한 역마살이 아니라, 위기 속에서 수호신이 돕는 <strong style="color:#FFD700;">천을귀인</strong>이 함께 호위하고 있는 명식입니다.<br>
          낯선 영역으로 이동하거나 대외적으로 큰 도전을 감행할 때, 예상치 못한 귀인의 기적 같은 도움(투자자·파트너 등)을 받아 위기를 기회로 바꾸며 크게 성공하는 역동적인 시너지를 발휘합니다.
        </div>
      </div>`
    : '';

  const sinsalHtml = `
  <div class="saju-card" style="margin-bottom:16px;">
    <div class="saju-card-title">🔯 신살(神殺) 분석</div>
    ${salList.length ? salList.map(s=>`
      <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
        <span style="font-size:20px;flex-shrink:0;">${s.icon}</span>
        <div><div style="font-size:13px;font-weight:700;color:${s.color};margin-bottom:3px;">${s.name}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.6);line-height:1.6;">${s.desc}</div></div>
      </div>`).join('')
    : '<div style="font-size:13px;color:rgba(255,255,255,0.4);padding:12px 0;">해당하는 주요 신살이 없습니다.</div>'}
    ${synergyHtml}
  </div>`;

  /* ── 세운 2026 丙午 ── */
  const SY_GAN = '丙', SY_JI = '午';
  const sySS = getSS(SY_GAN);
  const SY_DESC = {
    '甲':'병(丙)화가 목(木)일간을 생(生)하여 활동 에너지가 높아집니다. 새로운 도전에 유리한 해입니다.',
    '乙':'병(丙)화가 목(木)일간을 생(生)하여 표현력과 창의성이 빛납니다.',
    '丙':'비견(比肩) 해 — 경쟁이 강해지고 독립심이 높아집니다. 자기 주도적 행동이 중요합니다.',
    '丁':'겁재(劫財) 해 — 의지력이 강해지나 주변과 마찰이 생길 수 있습니다.',
    '戊':'편인(偏印) 해 — 학문·직관이 발달하고 새로운 기술 습득에 유리합니다.',
    '己':'정인(正印) 해 — 학습운이 좋고 윗사람의 도움을 받을 수 있는 해입니다.',
    '庚':'편관(偏官) 해 — 긴장감과 도전이 많지만 승진·도약의 기회가 옵니다.',
    '辛':'정관(正官) 해 — 명예로운 기회와 안정된 직업운을 기대할 수 있습니다.',
    '壬':'편재(偏財) 해 — 활동적인 재물운, 사업 확장과 투자 기회가 생깁니다.',
    '癸':'정재(正財) 해 — 안정적인 수입과 실속 있는 재물운의 해입니다.',
  };

  const sesunHtml = `
  <div class="saju-card" style="margin-bottom:16px;">
    <div class="saju-card-title">🗓️ 세운(歲運) — 2026년 丙午</div>
    <div style="display:flex;gap:10px;align-items:stretch;margin-bottom:14px;">
      <div style="text-align:center;background:rgba(255,100,0,0.1);border:1px solid rgba(255,100,0,0.3);border-radius:12px;padding:12px 16px;min-width:60px;">
        <div style="font-size:30px;font-weight:900;color:#FF6B35;">${SY_GAN}</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.4);margin-top:4px;">화(火) 천간</div>
      </div>
      <div style="text-align:center;background:rgba(255,100,0,0.1);border:1px solid rgba(255,100,0,0.3);border-radius:12px;padding:12px 16px;min-width:60px;">
        <div style="font-size:30px;font-weight:900;color:#FF8C42;">${SY_JI}</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.4);margin-top:4px;">화(火) 지지</div>
      </div>
      <div style="flex:1;background:rgba(255,100,0,0.05);border:1px solid rgba(255,100,0,0.15);border-radius:12px;padding:12px;">
        <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">일간(${dayGan}) 기준 세운 십신</div>
        <div style="font-size:16px;font-weight:800;color:${SS_COLOR[sySS]||'#fff'};">${sySS||'—'}</div>
      </div>
    </div>
    <div style="font-size:13px;color:rgba(255,255,255,0.75);line-height:1.9;padding:12px;background:rgba(255,100,0,0.05);border-radius:10px;border:1px solid rgba(255,100,0,0.12);">
      ${SY_DESC[dayGan] || '2026년 병오(丙午)년 화(火) 기운이 사주에 영향을 줍니다.'}
    </div>
  </div>`;

  /* ── 지장간(支藏干) ── */
  const JIJANGGAN = {
    '子':['壬','癸'],             '丑':['癸','辛','己'],
    '寅':['戊','丙','甲'],        '卯':['甲','乙'],
    '辰':['乙','癸','戊'],        '巳':['戊','庚','丙'],
    '午':['丙','己','丁'],        '未':['丁','乙','己'],
    '申':['戊','壬','庚'],        '酉':['庚','辛'],
    '戌':['辛','丁','戊'],        '亥':['戊','甲','壬'],
  };
  const JJG_ROLE = ['여기(餘氣)','중기(中氣)','정기(正氣)'];
  const ohaengOfGan = {'甲':'목','乙':'목','丙':'화','丁':'화','戊':'토','己':'토','庚':'금','辛':'금','壬':'수','癸':'수'};
  const ohColorMap = {목:'#4CAF50',화:'#FF5722',토:'#FF9800',금:'#9E9E9E',수:'#2196F3'};

  const jijangganCols = [
    {label:'시(時)',ji:timeJi},{label:'일(日)',ji:dayJi},{label:'월(月)',ji:monthJi},{label:'년(年)',ji:yearJi}
  ];

  const jijangganHtml = `
  <div class="saju-card" style="margin-bottom:16px;">
    <div class="saju-card-title">🔬 지장간(支藏干) — 지지 속 숨은 천간</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.62);margin-bottom:12px;">지지(땅의 글자) 안에 숨어있는 천간 에너지입니다. 겉으로 보이지 않다가 대운·세운이 건드릴 때 폭발하는 잠재력입니다.</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
      ${jijangganCols.map(col => {
        const jjg = JIJANGGAN[col.ji] || [];
        return `<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:10px 8px;text-align:center;">
          <div style="font-size:12px;color:rgba(255,255,255,0.65);margin-bottom:6px;">${col.label} · ${col.ji||'?'}</div>
          ${jjg.map((g,i) => {
            const oh = ohaengOfGan[g] || '토';
            const col2 = ohColorMap[oh] || '#aaa';
            const ss = getSS(g);
            const roleLabel = (i === jjg.length - 1) ? '정기(正氣)' : JJG_ROLE[i] || '';
            return `<div style="margin-bottom:5px;">
              <span style="font-size:15px;font-weight:800;color:${col2};">${g}</span>
              <span style="font-size:11px;color:rgba(255,255,255,0.6);display:block;line-height:1.3;">${roleLabel}</span>
              ${ss?`<span style="font-size:9px;color:${SS_COLOR[ss]||'#aaa'};font-weight:600;">${ss}</span>`:''}
            </div>`;
          }).join('')}
          ${jjg.length===0?'<div style="color:rgba(255,255,255,0.45);font-size:11px;">—</div>':''}
        </div>`;
      }).join('')}
    </div>
    <div style="margin-top:10px;font-size:12px;color:rgba(255,255,255,0.55);">💡 정기(正氣)가 가장 강한 핵심 에너지, 여기는 전 계절의 잔여 기운입니다.</div>
  </div>`;

  /* ── 공망(空亡) ── */
  const GAN_LIST = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const ZHI_LIST = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const GONGMANG_TABLE = [
    ['戌','亥'],['申','酉'],['午','未'],['辰','巳'],['寅','卯'],['子','丑']
  ];
  const ZHI_KO = {'子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
  const ganIdx = GAN_LIST.indexOf(dayGan);
  const zhiIdx = ZHI_LIST.indexOf(dayJi);
  let jiazi60pos = ganIdx;
  while (jiazi60pos % 12 !== zhiIdx && jiazi60pos < 60) jiazi60pos += 10;
  const gmGroup = Math.floor(jiazi60pos / 10);
  const gongmangZhi = GONGMANG_TABLE[gmGroup] || [];

  const allEightJi = [timeJi, dayJi, monthJi, yearJi].filter(Boolean);
  const gmInChart = gongmangZhi.filter(z => allEightJi.includes(z));

  const GONGMANG_DESC = {
    '戌':'술(戌) 공망 — 토(土)·믿음·종교·부동산 영역에서 허무함을 느낄 수 있습니다.',
    '亥':'해(亥) 공망 — 수(水)·지혜·철학·여행 분야에서 노력 대비 결실이 약할 수 있습니다.',
    '申':'신(申) 공망 — 금(金)·재물·법·조직 영역에서 공허함이 생깁니다.',
    '酉':'유(酉) 공망 — 금(金)·명예·이성 인연·결실 분야가 채워지지 않는 느낌이 있습니다.',
    '午':'오(午) 공망 — 화(火)·명성·열정·중년의 성취가 기대보다 약할 수 있습니다.',
    '未':'미(未) 공망 — 토(土)·가정·전통·안정감에서 결핍을 느낍니다.',
    '辰':'진(辰) 공망 — 토(土)·사업·현실 기반·실속이 흔들릴 수 있습니다.',
    '巳':'사(巳) 공망 — 화(火)·계획·지식·전문성 영역에서 허탕을 치기 쉽습니다.',
    '寅':'인(寅) 공망 — 목(木)·시작·도전·형제 인연이 공허합니다.',
    '卯':'묘(卯) 공망 — 목(木)·창의력·학문·이성 인연이 약해집니다.',
    '子':'자(子) 공망 — 수(水)·지혜·부하·자녀 인연에서 결핍이 생깁니다.',
    '丑':'축(丑) 공망 — 토(土)·재고·비밀·말년 안정이 불안할 수 있습니다.',
  };

  const gongmangHtml = `
  <div class="saju-card" style="margin-bottom:16px;">
    <div class="saju-card-title">⬜ 공망(空亡) — 구멍 난 자리</div>
    <div style="display:flex;gap:10px;align-items:center;margin-bottom:12px;flex-wrap:wrap;">
      <div style="display:flex;gap:8px;">
        ${gongmangZhi.map(z=>`<div style="text-align:center;background:rgba(100,100,100,0.15);border:1.5px dashed rgba(255,255,255,0.2);border-radius:12px;padding:10px 14px;">
          <div style="font-size:26px;font-weight:900;color:rgba(255,255,255,0.65);">${z}</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.55);margin-top:3px;">${ZHI_KO[z]||''}</div>
        </div>`).join('')}
      </div>
      <div style="flex:1;min-width:120px;">
        ${gmInChart.length > 0
          ? `<div style="font-size:12px;font-weight:700;color:#FF8A80;margin-bottom:4px;">⚠️ 원국에 공망 해당 글자 있음</div>
             <div style="font-size:11px;color:rgba(255,255,255,0.55);">${gmInChart.map(z=>ZHI_KO[z]).join('·')} 자리가 구멍납니다. 이 영역에서 노력해도 공허함이 생기는 원인입니다.</div>`
          : `<div>
               <div style="font-size:12px;font-weight:700;color:#80CBC4;margin-bottom:5px;">✅ 원국 내 공망 없음 — 기초 뼈대가 단단합니다</div>
               <div style="font-size:12px;color:rgba(255,255,255,0.72);line-height:1.7;">기본 팔자에 구멍 난 자리가 없어 인생의 기초 뼈대가 알차고 탄탄합니다.</div>
             </div>`}
      </div>
    </div>
    ${gmInChart.length > 0 ? `<div style="display:flex;flex-direction:column;gap:8px;">
      ${gmInChart.map(z=>`<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:10px 12px;font-size:12px;color:rgba(255,255,255,0.65);line-height:1.7;">${GONGMANG_DESC[z]||''}</div>`).join('')}
    </div>` : ''}
    ${gongmangZhi.length > 0 ? `
    <div style="margin-top:12px;background:rgba(255,193,7,0.06);border:1px solid rgba(255,193,7,0.2);border-radius:10px;padding:12px 14px;">
      <div style="font-size:12px;font-weight:700;color:#FFD54F;margin-bottom:6px;">⏰ 세운 공망 경고</div>
      <div style="font-size:12px;color:rgba(255,255,255,0.7);line-height:1.85;">
        세운·대운에서 <strong style="color:#FFD54F;">${gongmangZhi.map(z=>`${z}(${ZHI_KO[z]})`).join(' · ')}</strong> 글자가 들어오는 해에는 해당 영역이 일시적으로 흔들릴 수 있습니다.<br>
        그 시기에는 무리한 확장보다 <strong style="color:#FFD54F;">기존 자산·계약을 안전하게 잠그는 실속형 전략</strong>이 정답입니다.
      </div>
    </div>` : ''}
    <div style="margin-top:10px;font-size:12px;color:rgba(255,255,255,0.55);">💡 공망 글자가 들어오는 해(세운)에는 그 영역에서 과도한 기대를 피하는 것이 현명합니다.</div>
  </div>`;

  /* ── 합(合)·충(沖) 분석 ── */
  const allGansFull = [timeGan, dayGan, monthGan, yearGan].filter(Boolean);
  const allJiFull   = [timeJi,  dayJi,  monthJi,  yearJi ].filter(Boolean);

  // 천간합
  const CHEONGAN_HAM = [
    {a:'甲',b:'己',result:'土합',desc:'갑기합(甲己合) — 리더십(木)과 포용력(土)이 결합, 안정적 추진력을 발휘합니다. 공직·기업 경영에 이상적입니다.'},
    {a:'乙',b:'庚',result:'金합',desc:'을경합(乙庚合) — 유연함(木)과 단호함(金)이 결합, 협상력과 결단력을 동시에 갖춥니다.'},
    {a:'丙',b:'辛',result:'水합',desc:'병신합(丙辛合) — 열정(火)과 예리함(金)이 수(水)로 변환, 전략적 분석력과 깊은 통찰이 생깁니다.'},
    {a:'丁',b:'壬',result:'木합',desc:'정임합(丁壬合) — 감수성(火)과 지혜(水)가 목(木)으로 변환, 창의적 영감과 인문학적 재능이 발달합니다.'},
    {a:'戊',b:'癸',result:'火합',desc:'무계합(戊癸合) — 현실감(土)과 직관(水)이 화(火)로 변환, 열정적 행동력과 카리스마가 형성됩니다.'},
  ];
  const ganHams = CHEONGAN_HAM.filter(h => allGansFull.includes(h.a) && allGansFull.includes(h.b));

  // 지지 삼합
  const SAMHAP = [
    {group:['申','子','辰'],result:'水局',desc:'수(水) 기운이 강하게 형성'},
    {group:['巳','酉','丑'],result:'金局',desc:'금(金) 기운이 강하게 형성'},
    {group:['寅','午','戌'],result:'火局',desc:'화(火) 기운이 강하게 형성'},
    {group:['亥','卯','未'],result:'木局',desc:'목(木) 기운이 강하게 형성'},
  ];
  // 삼합 중 2개 이상 있으면 표시 (반삼합 포함)
  const samHapFound = SAMHAP.map(sh => {
    const cnt = sh.group.filter(z => allJiFull.includes(z)).length;
    return {cnt, ...sh};
  }).filter(sh => sh.cnt >= 2);

  // 지지 육합
  const YUKHAP = [
    {a:'子',b:'丑',result:'土합',desc:'자축합(子丑合) — 수(水)와 토(土)가 결합해 단단한 땅을 형성합니다. 신용·자산 기반이 흔들림 없이 지켜지는 강한 결속력입니다.'},
    {a:'寅',b:'亥',result:'木합',desc:'인해합(寅亥合) — 목(木) 기운이 강화됩니다. 시작과 성장의 에너지가 서로를 북돋아 새로운 도전에 유리합니다.'},
    {a:'卯',b:'戌',result:'火합',desc:'묘술합(卯戌合) — 화(火) 기운으로 변합니다. 따뜻한 정(情)과 열정이 관계를 불태우지만, 집착이 될 수 있어 균형이 필요합니다.'},
    {a:'辰',b:'酉',result:'金합',desc:'진유합(辰酉合) — 금(金) 기운이 강해집니다. 현실적 판단력과 재물 결실이 단단하게 쌓이는 실속형 결합입니다.'},
    {a:'巳',b:'申',result:'水합',desc:'사신합(巳申合) — 수(水) 기운으로 변합니다. 지혜·전략·소통이 강화되나, 화(火)와 금(金)의 긴장이 내재합니다.'},
    {a:'午',b:'未',result:'土합',desc:'오미합(午未合) — 토(土) 기운이 두터워집니다. 중심을 잡아주는 안정 에너지로, 중년 이후 자산 축적에 유리합니다.'},
  ];
  const yukHams = YUKHAP.filter(h => allJiFull.includes(h.a) && allJiFull.includes(h.b));

  // 지지 충(沖)
  const CHUNG = [
    {a:'子',b:'午',desc:'子午충 — 수화(水火) 충돌, 변동·이동수 강함'},
    {a:'丑',b:'未',desc:'丑未충 — 토토(土土) 충돌, 직장·부동산 변동'},
    {a:'寅',b:'申',desc:'寅申충 — 목금(木金) 충돌, 충동적 행동 주의'},
    {a:'卯',b:'酉',desc:'卯酉충 — 목금(木金) 충돌, 이성 관계·인간관계 마찰'},
    {a:'辰',b:'戌',desc:'辰戌충 — 토토(土土) 충돌, 기반·환경의 급변'},
    {a:'巳',b:'亥',desc:'巳亥충 — 화수(火水) 충돌, 사업·건강의 기복'},
  ];
  const chungs = CHUNG.filter(h => allJiFull.includes(h.a) && allJiFull.includes(h.b));

  // 세운(歲運) 지지 vs 원국 지지 충 — 원국 내 충이 있어도 세운이 가세하면 표시(amplified)
  const sesunChungs = CHUNG.filter(h => {
    const syIsA = h.a === SY_JI && allJiFull.includes(h.b);
    const syIsB = h.b === SY_JI && allJiFull.includes(h.a);
    return syIsA || syIsB;
  }).map(h => {
    const alreadyInner = chungs.some(c => c.a === h.a && c.b === h.b);
    return { ...h, amplified: alreadyInner };
  });

  // 자형살(自刑) — 같은 지지끼리 자기 충돌
  const JACHUNG_DESC = {
    午:'오오 자형살(午午 自刑) — 火 기운이 극도로 과열됩니다. 과로·감정 폭발·심장 과부하 주의.',
    酉:'유유 자형살(酉酉 自刑) — 金 기운이 지나치게 예리해집니다. 인간관계 마찰·고집 주의.',
    亥:'해해 자형살(亥亥 自刑) — 水 기운이 넘쳐 판단이 흐려집니다. 과음·의존성 주의.',
    辰:'진진 자형살(辰辰 自刑) — 土 기운이 고착화됩니다. 고집·변화 거부·막힘 주의.',
  };
  // 원국 내 자형살 (같은 지지 2개 이상)
  const innerJachung = Object.keys(JACHUNG_DESC).filter(ji => allJiFull.filter(z=>z===ji).length>=2);
  // 세운 자형살 (세운 지지가 원국에 있어서 자형 형성)
  const sesunJachung = (JACHUNG_DESC[SY_JI] && allJiFull.includes(SY_JI)) ? SY_JI : null;

  // 지지 암합(暗合) — 각 지지의 정기(正氣) 천간끼리 천간합을 이루는 경우
  // 예: 卯(정기 乙) + 申(정기 庚) → 乙庚합(금합) = 卯申 암합
  const AMHAP = [
    {a:'寅',b:'丑',result:'土합',desc:'인축 암합(寅丑暗合) — 寅의 정기 甲(목)과 丑의 정기 己(토)가 甲己합을 이룹니다. 겉으로 드러나지 않는 끈끈한 결속으로, 서로 다른 기운이 깊은 내면에서 화합하는 형태입니다. 사업상 파트너십, 숨겨진 인연에서 강하게 발동합니다.'},
    {a:'卯',b:'申',result:'金합',desc:'묘신 암합(卯申暗合) — 卯의 정기 乙(목)과 申의 정기 庚(금)이 乙庚합을 이룹니다. 이 사주에서 가장 강력한 숨은 결합으로, 유연함과 결단력이 내면에서 하나로 녹아듭니다. 원진·귀문과 함께 걸려 강한 흡인력과 갈등이 공존하는 복잡한 관계 에너지를 형성합니다.'},
    {a:'巳',b:'酉',result:'水합',desc:'사유 암합(巳酉暗合) — 巳의 정기 丙(화)과 酉의 정기 辛(금)이 丙辛합을 이룹니다. 열정과 예리함이 물처럼 흘러 전략적 통찰과 분석력으로 변환됩니다. 학문·기획 분야에서 잠재력이 발현되는 구조입니다.'},
    {a:'午',b:'亥',result:'木합',desc:'오해 암합(午亥暗合) — 午의 정기 丁(화)과 亥의 정기 壬(수)이 丁壬합을 이룹니다. 감수성과 지혜가 창의적 목기(木氣)로 변환되어 예술·인문 분야의 특출한 재능을 숨겨두고 있습니다.'},
    {a:'子',b:'辰',result:'火합',desc:'자진 암합(子辰暗合) — 子의 정기 癸(수)와 辰의 정기 戊(토)가 戊癸합을 이룹니다. 직관과 현실감이 불꽃(화기)으로 변환되어, 결정적 순간에 강한 행동력과 카리스마가 폭발합니다.'},
    {a:'子',b:'戌',result:'火합',desc:'자술 암합(子戌暗合) — 子의 정기 癸(수)와 戌의 정기 戊(토)가 戊癸합을 이룹니다. 깊은 내면의 지혜와 현실 감각이 화기(火氣)로 응축됩니다. 겉은 조용하지만 내면에 강한 열정과 추진력을 감추고 있습니다.'},
  ];
  const amhaps = AMHAP.filter(h => allJiFull.includes(h.a) && allJiFull.includes(h.b));

  const hamChungHtml = `
  <div class="saju-card" style="margin-bottom:16px;">
    <div class="saju-card-title">🔗 합(合)·충(沖) — 글자끼리의 화학반응</div>

    ${ganHams.length > 0 ? `
    <div style="margin-bottom:12px;">
      <div style="font-size:12px;font-weight:700;color:rgba(0,210,255,0.8);margin-bottom:6px;">☯️ 천간합(天干合)</div>
      ${ganHams.map(h=>`<div style="background:rgba(0,210,255,0.05);border:1px solid rgba(0,210,255,0.15);border-radius:10px;padding:12px;margin-bottom:6px;">
        <div style="margin-bottom:5px;"><span style="font-size:14px;font-weight:800;color:#00d2ff;margin-right:8px;">${h.a}+${h.b}</span><span style="font-size:12px;color:rgba(255,255,255,0.6);">→ ${h.result}</span></div>
        <div style="font-size:12px;color:rgba(255,255,255,0.75);line-height:1.7;">${h.desc}</div>
      </div>`).join('')}
    </div>` : ''}

    ${samHapFound.length > 0 ? `
    <div style="margin-bottom:12px;">
      <div style="font-size:12px;font-weight:700;color:rgba(156,204,101,0.9);margin-bottom:6px;">🔺 지지 삼합(三合) / 반삼합</div>
      ${samHapFound.map(sh=>`<div style="background:rgba(76,175,80,0.05);border:1px solid rgba(76,175,80,0.18);border-radius:10px;padding:10px 12px;margin-bottom:6px;font-size:12px;color:rgba(255,255,255,0.75);">
        <span style="font-size:13px;font-weight:800;color:#AED581;margin-right:8px;">${sh.group.filter(z=>allJiFull.includes(z)).join('·')} ${sh.cnt===2?'반삼합':'삼합'}</span>${sh.desc} <span style="color:rgba(255,255,255,0.4);">(→ ${sh.result})</span>
        ${sh.cnt===2?`<span style="font-size:10px;background:rgba(255,165,0,0.15);color:#FFB74D;border-radius:8px;padding:2px 7px;margin-left:6px;">세운에서 완성 가능</span>`:''}
      </div>`).join('')}
    </div>` : ''}

    ${yukHams.length > 0 ? `
    <div style="margin-bottom:12px;">
      <div style="font-size:12px;font-weight:700;color:rgba(206,147,216,0.9);margin-bottom:6px;">🤝 지지 육합(六合)</div>
      ${yukHams.map(h=>`<div style="background:rgba(156,39,176,0.05);border:1px solid rgba(156,39,176,0.18);border-radius:10px;padding:12px;margin-bottom:6px;">
        <div style="margin-bottom:5px;"><span style="font-size:14px;font-weight:800;color:#CE93D8;margin-right:8px;">${h.a}+${h.b}</span><span style="font-size:12px;color:rgba(255,255,255,0.4);">→ ${h.result}</span></div>
        <div style="font-size:12px;color:rgba(255,255,255,0.72);line-height:1.7;">${h.desc}</div>
      </div>`).join('')}
    </div>` : ''}

    ${amhaps.length > 0 ? `
    <div style="margin-bottom:12px;">
      <div style="font-size:12px;font-weight:700;color:rgba(255,183,77,0.9);margin-bottom:6px;">🔐 지지 암합(暗合) — 지장간 정기끼리의 숨은 결합</div>
      ${amhaps.map(h=>`<div style="background:rgba(255,152,0,0.05);border:1px solid rgba(255,152,0,0.2);border-radius:10px;padding:12px;margin-bottom:6px;">
        <div style="margin-bottom:5px;"><span style="font-size:14px;font-weight:800;color:#FFB74D;margin-right:8px;">${h.a}↔${h.b}</span><span style="font-size:12px;color:rgba(255,255,255,0.4);">→ ${h.result}</span></div>
        <div style="font-size:12px;color:rgba(255,255,255,0.72);line-height:1.7;">${h.desc}</div>
      </div>`).join('')}
    </div>` : ''}

    ${chungs.length > 0 ? `
    <div>
      <div style="font-size:12px;font-weight:700;color:rgba(244,67,54,0.9);margin-bottom:6px;">⚡ 지지 충(沖) — 원국 내 충돌</div>
      ${chungs.map(h=>`<div style="background:rgba(244,67,54,0.05);border:1px solid rgba(244,67,54,0.18);border-radius:10px;padding:10px 12px;margin-bottom:6px;font-size:12px;color:rgba(255,255,255,0.75);">
        <span style="font-size:14px;font-weight:800;color:#EF9A9A;margin-right:8px;">${h.a}↔${h.b}</span>${h.desc}
      </div>`).join('')}
    </div>` : ''}

    ${ganHams.length===0 && samHapFound.length===0 && yukHams.length===0 && amhaps.length===0 && chungs.length===0
      ? '<div style="font-size:12px;color:rgba(255,255,255,0.35);padding:8px 0;">원국 내 주요 합·충이 없습니다 — 대운·세운에서 형성될 때 주목하세요.</div>'
      : ''}

    ${sesunChungs.length > 0 ? `
    <div style="margin-top:12px;border-top:1px solid rgba(255,82,82,0.25);padding-top:12px;">
      <div style="font-size:12px;font-weight:700;color:rgba(255,138,101,0.95);margin-bottom:6px;">⚡ 2026년 세운 ${SY_GAN}${SY_JI}와 원국 충(沖)</div>
      ${sesunChungs.map(h => {
        const partnerJi = h.a === SY_JI ? h.b : h.a;
        const cnt = allJiFull.filter(z => z === partnerJi).length;
        const amplifiedNote = h.amplified
          ? `<div style="margin-top:4px;font-size:11px;color:#FF5252;font-weight:700;">🔺 원국에 이미 존재하는 충 — 세운 ${SY_JI}가 가세해 충의 에너지가 극대화됩니다. 건강·이동·계약 변동에 최고 주의.</div>`
          : '';
        return `<div style="background:rgba(255,82,82,0.07);border:1px solid rgba(255,82,82,0.22);border-radius:10px;padding:10px 12px;margin-bottom:6px;font-size:12px;color:rgba(255,255,255,0.8);">
          <span style="font-size:14px;font-weight:800;color:#FF8A65;margin-right:8px;">세운 ${SY_JI} ↔ 원국 ${partnerJi}${cnt >= 2 ? ` ×${cnt}` : ''}</span>${h.desc}
          ${amplifiedNote}
          ${!h.amplified && cnt >= 2 ? `<div style="margin-top:4px;font-size:11px;color:#FF7043;font-weight:600;">⚠️ 원국에 ${partnerJi}가 ${cnt}개 — 충의 영향이 배가됩니다. 이동·변화 시 신중히 판단하세요.</div>` : ''}
        </div>`;
      }).join('')}
    </div>` : `<div style="margin-top:10px;font-size:12px;color:rgba(255,255,255,0.4);">💡 2026년 세운 ${SY_GAN}${SY_JI}: 원국과의 지지 충 없음</div>`}

    ${(innerJachung.length > 0 || sesunJachung) ? `
    <div style="margin-top:12px;border-top:1px solid rgba(255,152,0,0.25);padding-top:12px;">
      <div style="font-size:12px;font-weight:700;color:rgba(255,183,77,0.95);margin-bottom:6px;">🔥 자형살(自刑) — 같은 글자끼리 자기 충돌</div>
      ${innerJachung.map(ji=>`<div style="background:rgba(255,152,0,0.07);border:1px solid rgba(255,152,0,0.25);border-radius:10px;padding:10px 12px;margin-bottom:6px;font-size:12px;color:rgba(255,255,255,0.8);">
        <span style="font-size:14px;font-weight:800;color:#FFB74D;margin-right:8px;">원국 ${ji}+${ji}</span>${JACHUNG_DESC[ji]}
      </div>`).join('')}
      ${sesunJachung && !innerJachung.includes(sesunJachung) ? `<div style="background:rgba(255,82,0,0.08);border:1px solid rgba(255,82,0,0.28);border-radius:10px;padding:10px 12px;margin-bottom:6px;font-size:12px;color:rgba(255,255,255,0.85);">
        <span style="font-size:14px;font-weight:800;color:#FF8A65;margin-right:8px;">⚠️ 세운 ${SY_JI} + 원국 ${sesunJachung}</span>${JACHUNG_DESC[sesunJachung]}
        <div style="margin-top:4px;font-size:11px;color:#FF7043;font-weight:700;">2026년 丙午 세운에서 자형살 발동 — 건강·과로·감정 조절에 특히 주의하세요.</div>
      </div>` : ''}
    </div>` : ''}
  </div>`;

  /* ── 원진살·귀문관살 ── */
  const WONJIN = [
    {a:'子',b:'未',desc:'자(子)–미(未) 원진 — 서로 미워하고 불편한 관계'},
    {a:'丑',b:'午',desc:'축(丑)–오(午) 원진 — 의리 있지만 갈등 반복'},
    {a:'寅',b:'酉',desc:'인(寅)–유(酉) 원진 — 시작은 좋지만 결국 어긋남'},
    {a:'卯',b:'申',desc:'묘(卯)–신(申) 원진 — 예민함과 강함의 충돌'},
    {a:'辰',b:'亥',desc:'진(辰)–해(亥) 원진 — 마음은 맞지만 행동이 어긋남'},
    {a:'巳',b:'戌',desc:'사(巳)–술(戌) 원진 — 가까울수록 상처받기 쉬움'},
  ];
  const GUIMUN = [
    {a:'子',b:'酉',desc:'자–유 귀문 — 강한 집착·예민한 감수성'},
    {a:'丑',b:'午',desc:'축–오 귀문 — 감정 기복·강박적 성향'},
    {a:'寅',b:'亥',desc:'인–해 귀문 — 신비로운 직관, 과몰입 주의'},
    {a:'卯',b:'申',desc:'묘–신 귀문 — 예민함·과한 상상력'},
    {a:'辰',b:'巳',desc:'진–사 귀문 — 의심·불안감'},
    {a:'未',b:'戌',desc:'미–술 귀문 — 우울·집착 경향'},
  ];

  const wonjinFound = WONJIN.filter(w => allJiFull.includes(w.a) && allJiFull.includes(w.b));
  const guimunFound = GUIMUN.filter(g => allJiFull.includes(g.a) && allJiFull.includes(g.b));

  const salDeepHtml = `
  <div class="saju-card" style="margin-bottom:16px;">
    <div class="saju-card-title">🛡️ 원진살(怨嗔殺) · 귀문관살(鬼門關殺)</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.62);margin-bottom:12px;">원진은 인간관계의 심리적 갈등 패턴, 귀문은 정신적 예민함·집착 경향을 나타냅니다.</div>

    ${wonjinFound.length > 0 ? `
    <div style="margin-bottom:12px;">
      <div style="font-size:12px;font-weight:700;color:#FF8A80;margin-bottom:8px;">😤 원진살(怨嗔殺) 발견</div>
      ${wonjinFound.map(w=>`<div style="background:rgba(244,67,54,0.05);border:1px solid rgba(244,67,54,0.2);border-radius:10px;padding:12px;margin-bottom:6px;">
        <div style="font-size:13px;font-weight:800;color:#EF9A9A;margin-bottom:4px;">${w.a} – ${w.b}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.7);line-height:1.7;">${w.desc}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:6px;">💊 처방: 미워하는 감정을 인정하고, 선을 명확히 그어두는 것이 정신 건강에 유리합니다.</div>
      </div>`).join('')}
    </div>` : `<div style="font-size:12px;color:rgba(255,255,255,0.6);padding:6px 0;margin-bottom:8px;">✅ 원진살 없음 — 인간관계에서 심한 갈등 패턴이 없습니다.</div>`}

    ${guimunFound.length > 0 ? `
    <div>
      <div style="font-size:12px;font-weight:700;color:#CE93D8;margin-bottom:8px;">🌀 귀문관살(鬼門關殺) 발견</div>
      ${guimunFound.map(g=>`<div style="background:rgba(156,39,176,0.05);border:1px solid rgba(156,39,176,0.2);border-radius:10px;padding:12px;margin-bottom:6px;">
        <div style="font-size:13px;font-weight:800;color:#CE93D8;margin-bottom:4px;">${g.a} – ${g.b}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.7);line-height:1.7;">${g.desc}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:6px;">💊 처방: 예민한 감수성이 예술·직관력의 강점이 됩니다. 충분한 휴식과 명상이 도움됩니다.</div>
      </div>`).join('')}
    </div>` : `<div style="font-size:12px;color:rgba(255,255,255,0.6);padding:6px 0;">✅ 귀문관살 없음 — 정신적 안정감이 높습니다.</div>`}
  </div>`;

  return sipsinHtml + sinsalHtml + sesunHtml + jijangganHtml + gongmangHtml + hamChungHtml + salDeepHtml;
}

/* ══════════════════════════════════════════════
   라이프 가이드 카드 — 나는 어떤 사람인가 등
══════════════════════════════════════════════ */
function buildLifeGuideCards(data, birthInput) {
  const ec = data.eightChar;
  if (!ec) return '';

  const G = s => s?.[0] || '';
  const J = s => s?.[1] || '';
  const dayGan = G(ec.day);
  const dist   = data.distribution || {};
  const weak   = data.weak?.부족오행 || '';
  const gender = birthInput?.gender || 'male';

  /* ─ 십신 테이블 ─ */
  const SS = {
    '甲':{'甲':'비견','乙':'겁재','丙':'식신','丁':'상관','戊':'편재','己':'정재','庚':'편관','辛':'정관','壬':'편인','癸':'정인'},
    '乙':{'甲':'겁재','乙':'비견','丙':'상관','丁':'식신','戊':'정재','己':'편재','庚':'정관','辛':'편관','壬':'정인','癸':'편인'},
    '丙':{'甲':'편인','乙':'정인','丙':'비견','丁':'겁재','戊':'식신','己':'상관','庚':'편재','辛':'정재','壬':'편관','癸':'정관'},
    '丁':{'甲':'정인','乙':'편인','丙':'겁재','丁':'비견','戊':'상관','己':'식신','庚':'정재','辛':'편재','壬':'정관','癸':'편관'},
    '戊':{'甲':'편관','乙':'정관','丙':'편인','丁':'정인','戊':'비견','己':'겁재','庚':'식신','辛':'상관','壬':'편재','癸':'정재'},
    '己':{'甲':'정관','乙':'편관','丙':'정인','丁':'편인','戊':'겁재','己':'비견','庚':'상관','辛':'식신','壬':'정재','癸':'편재'},
    '庚':{'甲':'편재','乙':'정재','丙':'편관','丁':'정관','戊':'편인','己':'정인','庚':'비견','辛':'겁재','壬':'식신','癸':'상관'},
    '辛':{'甲':'정재','乙':'편재','丙':'정관','丁':'편관','戊':'정인','己':'편인','庚':'겁재','辛':'비견','壬':'상관','癸':'식신'},
    '壬':{'甲':'식신','乙':'상관','丙':'편재','丁':'정재','戊':'편관','己':'정관','庚':'편인','辛':'정인','壬':'비견','癸':'겁재'},
    '癸':{'甲':'상관','乙':'식신','丙':'정재','丁':'편재','戊':'정관','己':'편관','庚':'정인','辛':'편인','壬':'겁재','癸':'비견'},
  };
  const getSS = g => (dayGan && SS[dayGan]) ? (SS[dayGan][g] || '') : '';

  /* ─ 1. 성격 요약 (전문용어 없이) ─ */
  const PERSONALITY = {
    '甲': ['한번 결심하면 끝까지 밀어붙이는 뚝심이 있습니다.', '남들이 가지 않은 길을 먼저 개척하는 리더 기질이 있습니다.', '의리와 원칙을 중시해서 믿는 사람에게는 끝까지 신뢰를 지킵니다.'],
    '乙': ['상황에 따라 유연하게 적응하는 능력이 탁월합니다.', '사람의 마음을 잘 읽고 분위기를 부드럽게 만드는 재주가 있습니다.', '겉으로는 조용해 보여도 속으로는 하고 싶은 것이 뚜렷합니다.'],
    '丙': ['어딜 가든 분위기를 밝히고 에너지를 나눠주는 타입입니다.', '솔직하고 시원시원해서 처음 만나는 사람도 금방 편해집니다.', '빠르게 결정하고 행동하지만 감정의 파도가 클 수 있습니다.'],
    '丁': ['따뜻하고 세심해서 주변 사람들이 자연스럽게 의지합니다.', '한 가지를 깊이 파고드는 집중력과 분석력이 뛰어납니다.', '말보다 행동으로 보여주는 조용하고 진실된 스타일입니다.'],
    '戊': ['묵직하고 든든한 인상으로 어디서든 기둥 역할을 합니다.', '맡은 일은 끝까지 책임지는 성실함이 최고의 무기입니다.', '급격한 변화보다 안정을 선호하고 오래 쌓아가는 방식을 즐깁니다.'],
    '己': ['실용적이고 꼼꼼해서 뒤처리와 마무리를 잘합니다.', '넓은 포용력으로 다양한 사람들과 어울릴 수 있습니다.', '겉으로 우유부단해 보여도 현실 감각이 매우 뛰어납니다.'],
    '庚': ['옳고 그름이 명확하고 직선적인 성격입니다.', '위기 상황에서도 흔들리지 않는 결단력이 강점입니다.', '한번 목표를 세우면 냉철하게 밀어붙여 결국 이뤄냅니다.'],
    '辛': ['세심하고 완벽주의 성향이 있어 디테일을 놓치지 않습니다.', '미적 감각이 뛰어나고 자신만의 스타일로 주목받습니다.', '예민한 감수성을 지니며 자신의 기준과 원칙에 충실합니다.'],
    '壬': ['자유롭고 넓은 시야로 큰 그림을 그리는 스타일입니다.', '아이디어가 넘치고 새로운 것에 대한 호기심이 끊이지 않습니다.', '어떤 상황에도 유연하게 적응하며 자기 방식대로 나아갑니다.'],
    '癸': ['조용하지만 깊은 내면을 가진 감성형입니다.', '타인의 감정을 잘 읽어 상대방이 원하는 것을 본능적으로 압니다.', '겉은 부드럽고 속은 강한 끈기로 결국 목표를 이룹니다.'],
  };
  const personality = PERSONALITY[dayGan] || ['사주 분석 데이터를 불러올 수 없습니다.'];

  /* ─ 2. 직업 적성 ─ */
  const JOB_MAP = {
    목: { icon:'🌱', title:'사람을 키우고 돌보는 일에 강합니다', jobs:['선생님·강사·교수', '의사·한의사·간호사', '작가·기자·출판 편집자', '인테리어·조경 디자이너', '사회복지사·상담사'], tip:'사람과 자연을 다루는 직종에서 특히 빛을 발합니다.' },
    화: { icon:'🔥', title:'무대 위에서 빛나는 표현형입니다', jobs:['방송인·유튜버·연예인', '마케터·광고 기획자', '요식업·카페 창업', '강연자·MC·이벤트 기획', '에너지·전기·소방 분야'], tip:'사람들 앞에 나서거나 홍보·기획하는 일에 탁월합니다.' },
    토: { icon:'⛰️', title:'믿음직하고 안정적인 조직형입니다', jobs:['공무원·행정직', '부동산·건설·시공', '농업·식품 가공·유통', '종교인·상담가·코치', '문화재·골동품·박물관'], tip:'꾸준히 신뢰를 쌓아가는 분야에서 장기적으로 성공합니다.' },
    금: { icon:'⚙️', title:'원칙과 시스템을 다루는 데 탁월합니다', jobs:['회계사·세무사·금융 전문가', '변호사·검사·법무 담당', '제조업·기계·엔지니어링', '군인·경찰·보안 관련', 'IT 시스템·데이터 분석'], tip:'정확성과 규칙이 중요한 분야에서 실력을 발휘합니다.' },
    수: { icon:'💧', title:'자유롭고 창의적인 탐구형입니다', jobs:['무역·수출입·글로벌 비즈니스', '여행 플래너·가이드·관광업', '철학·심리학·연구직', '예술가·뮤지션·크리에이터', '의약품·바이오·헬스케어'], tip:'틀에 얽매이지 않는 창의적이고 국제적인 분야가 잘 맞습니다.' },
  };
  const sortedOh = Object.entries(dist).sort((a,b)=>b[1]-a[1]);
  const dominant = sortedOh[0]?.[0] || '목';
  const jobInfo = JOB_MAP[dominant] || JOB_MAP['목'];

  /* ─ 3. 재물운 스타일 ─ */
  const allGans = [G(ec.time), G(ec.month), G(ec.year)].filter(Boolean);
  let pyunJae = 0, jeongJae = 0;
  allGans.forEach(g => {
    const ss = getSS(g);
    if (ss === '편재') pyunJae++;
    if (ss === '정재') jeongJae++;
  });

  let moneyLabel, moneyDesc, moneyTip;
  if (pyunJae > jeongJae) {
    moneyLabel = '💸 벌고 쓰는 스타일';
    moneyDesc  = '돈을 크게 벌고 또 크게 쓰는 활발한 재물 흐름을 가졌습니다. 사업·투자·영업처럼 변동성 있는 곳에서 기회를 잘 잡습니다. 단, 들어오는 만큼 나가는 경향이 있어 목돈을 따로 묶어두는 습관이 중요합니다.';
    moneyTip   = '💡 종잣돈은 별도 계좌에 자동이체로 고정 저축하세요.';
  } else if (jeongJae > pyunJae) {
    moneyLabel = '🏦 모아서 쓰는 스타일';
    moneyDesc  = '꾸준히 벌어서 차곡차곡 쌓아가는 안정형 재물운입니다. 월급·임대·이자처럼 정기적인 수입 구조가 잘 맞고, 충동 지출이 적어 장기적으로 부를 쌓습니다. 부동산이나 장기 적금이 유리합니다.';
    moneyTip   = '💡 초반 종잣돈 마련 후 부동산·적금 장기 투자가 가장 맞습니다.';
  } else if (pyunJae === 0 && jeongJae === 0) {
    moneyLabel = '🔮 돈보다 가치 추구형';
    moneyDesc  = '재물보다 하고 싶은 일, 명예, 배움에 에너지를 쏟는 타입입니다. 돈을 직접 좇기보다 전문성을 키우면 자연히 따라오는 구조가 잘 맞습니다. 전문직이나 기술직이 장기적으로 유리합니다.';
    moneyTip   = '💡 자격증·전문 기술에 투자하면 그게 곧 재물이 됩니다.';
  } else {
    moneyLabel = '⚖️ 균형 잡힌 스타일';
    moneyDesc  = '저축도 하면서 필요할 때는 과감하게 투자도 하는 균형형입니다. 무리하지 않는 선에서 다양한 방식으로 재산을 늘릴 수 있는 유연한 재물 감각을 가졌습니다.';
    moneyTip   = '💡 분산 투자 전략이 가장 잘 맞는 타입입니다.';
  }

  /* ─ 4. 연애·결혼운 ─ */
  const targetSS = gender === 'female' ? ['편관','정관'] : ['편재','정재'];
  const allChars = [G(ec.time), G(ec.month), G(ec.year), J(ec.time), J(ec.month), J(ec.year)].filter(Boolean);
  let loveStars = 0;
  allChars.forEach(g => { if (targetSS.includes(getSS(g))) loveStars++; });

  let loveLabel, loveBestMatch, loveCaution, loveMainDesc;
  if (gender === 'female') {
    if (loveStars >= 2) {
      loveLabel    = '💝 인연이 많은 편';
      loveMainDesc = '이성 인연이 많고 매력도 높아서 선택지가 다양합니다. 다만 인연이 너무 많으면 정작 진지한 상대를 놓칠 수 있습니다.';
      loveBestMatch= '책임감 있고 사회적으로 안정된 상대, 말보다 행동으로 보여주는 사람';
      loveCaution  = '감정에 이끌려 너무 빨리 결정하지 말고, 상대의 일관성을 충분히 지켜보세요.';
    } else if (loveStars === 1) {
      loveLabel    = '💑 한 사람에게 깊이 헌신하는 스타일';
      loveMainDesc = '한 번 마음을 주면 깊고 진지하게 사귀는 타입입니다. 가볍게 많이 만나기보다 한 사람과 진하게 교감하는 연애가 잘 맞습니다.';
      loveBestMatch= '신뢰를 중요시하고 꾸준한 상대, 가치관이 비슷한 사람';
      loveCaution  = '상대에게 너무 맞추다 보면 나를 잃을 수 있습니다. 자기 페이스를 유지하세요.';
    } else {
      loveLabel    = '🌸 자기 발전이 먼저인 스타일';
      loveMainDesc = '연애보다 일과 성장에 더 에너지를 쏟는 독립형입니다. 강요받는 연애는 잘 맞지 않고 자연스럽게 이어지는 인연이 오래 갑니다.';
      loveBestMatch= '서로의 독립성을 존중해 주는 상대, 공통 관심사로 만난 인연';
      loveCaution  = '30대 중반 이후 인연운이 열리는 경우가 많습니다. 너무 서두르지 마세요.';
    }
  } else {
    if (loveStars >= 2) {
      loveLabel    = '💝 이성 복이 많은 편';
      loveMainDesc = '여러 이성 인연을 경험하고 선택의 폭이 넓습니다. 하지만 인연이 많은 만큼 진지한 상대를 선별하는 눈이 중요합니다.';
      loveBestMatch= '따뜻하고 현실적인 상대, 가정적이고 정서적으로 안정된 사람';
      loveCaution  = '바람기처럼 보일 수 있는 행동을 조심하고, 마음을 정한 뒤에는 일관되게 행동하세요.';
    } else if (loveStars === 1) {
      loveLabel    = '💑 한 사람에게 헌신하는 스타일';
      loveMainDesc = '만나면 깊이 사랑하고 결혼 후에도 가정에 충실한 타입입니다. 화려한 연애보다 진실된 관계 하나가 더 의미 있습니다.';
      loveBestMatch= '착하고 성실한 상대, 서로 믿고 의지할 수 있는 사람';
      loveCaution  = '상대에게 너무 맞춰주다 지칠 수 있습니다. 자신의 감정도 표현하세요.';
    } else {
      loveLabel    = '🌿 일과 꿈이 먼저인 스타일';
      loveMainDesc = '연애보다 커리어와 꿈에 집중하는 경향이 있습니다. 억지로 찾으려 하기보다 일이나 취미를 통해 자연스럽게 만나는 인연이 더 잘 맞습니다.';
      loveBestMatch= '같은 관심사를 공유하는 상대, 서로의 성장을 응원해 주는 사람';
      loveCaution  = '연애에 소극적인 모습이 상대방에게 무관심으로 보일 수 있습니다. 표현을 연습하세요.';
    }
  }

  /* ─ 5. 건강 체크포인트 ─ */
  const HEALTH_MAP = {
    목: { arrow:'목(木) 부족 → 간·담낭·눈·근육 주의', tip:'눈의 피로가 빨리 쌓이고 과로하면 간에 무리가 올 수 있습니다. 스트레스가 몸에서 목·어깨 근육 통증으로 나타나는 경우가 많습니다. 충분한 숙면과 정기적인 스트레칭이 중요합니다.' },
    화: { arrow:'화(火) 부족 → 심장·혈관·소장 주의', tip:'혈액 순환이 잘 안 되거나 손발이 차가운 증상이 생기기 쉽습니다. 과로와 감정적 흥분이 심장에 부담을 줄 수 있습니다. 규칙적인 유산소 운동과 충분한 수분 섭취가 도움됩니다.' },
    토: { arrow:'토(土) 부족 → 위장·췌장·소화기 주의', tip:'불규칙한 식사나 과식, 과음이 위장에 바로 부담을 줍니다. 스트레스가 소화 불량이나 복통으로 이어지는 경우가 많습니다. 식사 시간을 규칙적으로 지키고 자극적인 음식을 줄이세요.' },
    금: { arrow:'금(金) 부족 → 폐·대장·피부·호흡기 주의', tip:'호흡기가 약해 감기, 기관지염에 걸리기 쉽습니다. 피부 트러블이나 대장 건강도 함께 신경 써야 합니다. 건조한 계절에는 특히 수분 섭취와 환기를 신경 쓰세요.' },
    수: { arrow:'수(水) 부족 → 신장·방광·뼈·귀 주의', tip:'몸이 쉽게 차가워지고 피로감이 오래 가는 경향이 있습니다. 신장과 방광 기능이 약해지면 부기가 생기거나 잦은 소변 증상이 나타납니다. 찬 음식을 줄이고 몸을 따뜻하게 유지하는 게 핵심입니다.' },
  };
  const healthInfo = HEALTH_MAP[weak] || { arrow:'오행 균형 → 전반적 건강 관리', tip:'오행이 비교적 균형 잡혀 있어 특정 부위 약점은 크지 않습니다. 과로와 스트레스를 피하고 규칙적인 운동과 수면 습관을 유지하는 것이 가장 중요합니다.' };

  /* ─ 6. 2026 운세 상반기·하반기 ─ */
  const sySS2 = getSS('丙');
  const HALF_YEAR = {
    '비견': {
      h1:'나와 비슷한 기운이 강해지는 시기입니다. 독립심과 추진력이 높아져 오랫동안 미뤄왔던 일을 직접 시작하기 좋습니다. 경쟁은 있지만 그만큼 내 역량도 강해집니다. 주변의 시선보다 내 판단을 믿고 움직이는 상반기입니다.',
      h2:'하반기에는 나서는 것보다 내실을 다지는 방향이 유리합니다. 혼자 잘하려다 주변과 마찰이 생길 수 있으니, 협력이 필요한 부분은 기꺼이 손을 내밀어 보세요. 체력을 꾸준히 관리하면 연말에 좋은 마무리가 됩니다.'
    },
    '겁재': {
      h1:'경쟁심과 의지력이 강해지는 상반기입니다. 목표가 뚜렷하면 강하게 밀어붙일 수 있고 스포츠, 도전적인 프로젝트에서 두각을 나타냅니다. 다만 남과 비교하거나 무리한 승부에 빠지지 않도록 주의하세요.',
      h2:'하반기에는 속도를 조금 늦추고 쌓아온 것들을 점검하는 시간이 필요합니다. 지나친 경쟁 심리가 인간관계에 균열을 낼 수 있습니다. 신뢰를 지키고 팀워크를 강화하면 연말에 더 큰 성과를 거둡니다.'
    },
    '식신': {
      h1:'창의력과 표현력이 꽃피는 시기입니다. 아이디어가 넘치고 새로운 것을 시작하면 주변의 반응도 좋습니다. 먹고 즐기는 복도 있어 맛있는 것, 여행, 취미 활동에서 만족감이 높습니다. 건강운도 함께 상승합니다.',
      h2:'하반기에는 상반기에 시작한 것들을 꾸준히 이어가는 것이 중요합니다. 너무 많은 것을 벌려놓으면 마무리가 어려워집니다. 한 가지에 집중해서 결실을 맺고, 남은 에너지로 새로운 배움에 투자하세요.'
    },
    '상관': {
      h1:'개성과 재능이 돋보이는 시기입니다. 자신만의 색깔로 표현하는 분야 — 예술, 창작, 강의, 유튜브 등에서 주목받기 좋습니다. 기존의 틀을 깨는 아이디어가 강점이 됩니다. 단, 말이 너무 직설적이 되지 않게 조심하세요.',
      h2:'하반기에는 실력으로 결과를 만들어 보이는 것이 중요합니다. 말보다 행동으로 증명하면 주변의 신뢰를 얻습니다. 윗사람과의 마찰을 피하고, 내 주장은 상황을 보며 적절히 표현하는 지혜가 필요합니다.'
    },
    '편재': {
      h1:'적극적으로 움직이면 돈이 되는 기회가 보이는 상반기입니다. 사업 확장, 투자, 새로운 수익 구조를 시도하기 좋은 시기이며 발 빠르게 행동하는 사람이 선점합니다. 인맥을 활용한 비즈니스 기회도 열립니다.',
      h2:'상반기에 달아오른 기운이 하반기에는 안정세를 찾습니다. 무리한 투기나 갑작스러운 큰 지출은 자제하고, 수익을 관리하고 정리하는 시간으로 삼으세요. 이미 벌어놓은 것을 지키는 것이 더 큰 수익입니다.'
    },
    '정재': {
      h1:'안정적인 수입이 꾸준히 들어오는 시기입니다. 급여 인상, 계약 갱신, 안정적인 거래처 확보 등 착실한 수확이 기대됩니다. 큰 변동 없이 원하는 것을 차근차근 이뤄가는 좋은 흐름입니다.',
      h2:'하반기에는 저축과 재테크 계획을 구체화하기 좋습니다. 부동산, 예·적금, 안전한 장기 투자를 검토할 시기입니다. 무리한 모험보다 확실한 것에 집중하면 연말 결산이 만족스럽습니다.'
    },
    '편관': {
      h1:'도전과 긴장이 높아지는 상반기입니다. 직장 내 변화, 이직, 새로운 책임을 맡게 될 수 있습니다. 스트레스가 크게 느껴질 수 있지만, 이 압박을 잘 견디면 도약의 발판이 됩니다. 건강 관리가 특히 중요합니다.',
      h2:'하반기에는 상반기의 긴장이 풀리며 성과가 드러나는 시기입니다. 포기하지 않고 버텼다면 승진, 승인, 인정을 받을 기회가 옵니다. 위험을 감수한 만큼 보상이 따라오는 하반기입니다.'
    },
    '정관': {
      h1:'명예와 안정이 함께 찾아오는 시기입니다. 직장에서 인정받거나 사회적으로 좋은 평판을 얻게 됩니다. 원칙대로 움직이면 주변이 따라오고, 공식적인 자리나 계약에서 유리한 결과가 나옵니다.',
      h2:'하반기에는 책임감이 커지고 맡는 역할이 늘어납니다. 원칙과 신뢰를 끝까지 지키면 연말에 의미 있는 성과로 돌아옵니다. 무리하지 않고 차근차근 쌓아가는 것이 이 시기의 핵심입니다.'
    },
    '편인': {
      h1:'배움과 연구에 집중하기 좋은 시기입니다. 자격증 취득, 새로운 기술 습득, 공부에 투자하면 하반기부터 결실이 나타납니다. 직관력이 높아져 남들이 놓치는 기회를 먼저 발견합니다.',
      h2:'하반기에는 상반기에 갈고닦은 능력이 빛을 발합니다. 내면의 성장이 외부 성과로 연결되는 시기로, 자기계발에 투자한 것이 실제 기회로 연결됩니다. 독창적인 아이디어나 새로운 관점이 주목받습니다.'
    },
    '정인': {
      h1:'윗사람의 도움과 배움의 기회가 동시에 찾아오는 시기입니다. 멘토를 만나거나 좋은 교육 환경이 주어집니다. 지식과 경험을 쌓기 좋은 시기이며, 이때 배운 것이 오랫동안 자산이 됩니다.',
      h2:'하반기에는 안정된 환경에서 꾸준히 실력을 쌓는 시기입니다. 학위, 자격증, 전문성이 빛을 발하고 신뢰를 기반으로 한 기회가 주어집니다. 조급하지 않고 묵묵히 자기 길을 가면 됩니다.'
    },
  };
  const halfYearInfo = HALF_YEAR[sySS2] || {
    h1:'2026년 병오(丙午)년 화(火) 기운이 강한 상반기입니다. 열정적으로 움직이면 기회가 보이는 시기이며, 새로운 도전을 시작하기 좋습니다.',
    h2:'하반기에는 과열된 에너지를 조절하고 상반기에 벌여놓은 일들을 마무리하는 데 집중하세요. 차분하게 결실을 거두는 시기입니다.'
  };

  /* ─ 7. 해야 할 것 / 하지 말아야 할 것 5가지씩 ─ */
  const GUIDE = {
    목: {
      do_: ['숲길 산책·자연 속 휴식을 자주 취하기', '동쪽 방향으로 새로운 시작·이사 고려하기', '초록색을 생활 소품·의류에 활용하기', '새벽 시간을 활용한 계획·독서 루틴 만들기', '사람을 키우거나 가르치는 역할 적극 맡기'],
      dont: ['무리한 음주와 야근으로 간 건강 해치기', '급한 부동산·주식 결정 서두르지 않기', '감정을 억누르지 말고 적절히 표현하기', '서쪽 방향 큰 이동이나 결정 신중히 하기', '고집을 내세워 팀워크를 망치지 않기']
    },
    화: {
      do_: ['따뜻한 햇빛 아래 야외 활동 늘리기', '남쪽 방향으로 새로운 인연·기회 모색하기', '붉은색·주황색을 활용해 에너지 높이기', '홍보·마케팅·표현 분야에 적극 도전하기', '여름 시즌 대외 활동과 네트워킹 강화하기'],
      dont: ['과도한 냉방 환경에 장시간 머물지 않기', '감정 폭발이나 충동적 결정 자제하기', '한꺼번에 너무 많은 일 벌이지 않기', '밤샘 작업으로 수면 패턴 망치지 않기', '자존심 때문에 도움 요청 거부하지 않기']
    },
    토: {
      do_: ['식사 시간을 규칙적으로 지키고 천천히 먹기', '집·사무실 중심 공간 정리정돈 꾸준히 하기', '노란색·갈색 계열을 활용해 안정감 높이기', '부동산·장기 투자 정보 꾸준히 공부하기', '믿을 수 있는 사람들과 깊은 관계 유지하기'],
      dont: ['과식·과음으로 위장 부담 주지 않기', '무리한 다이어트로 몸에 스트레스 주지 않기', '갑작스러운 큰 변화나 이직 성급히 결정하지 않기', '걱정을 혼자 안고 있지 말고 털어놓기', '변화를 두려워해 기회를 통째로 놓치지 않기']
    },
    금: {
      do_: ['계약·서류·법적 사항 꼼꼼히 점검하기', '서쪽 방향으로 활동 범위 넓히기', '흰색·은색을 활용해 집중력 높이기', '폐·호흡기 강화를 위한 규칙적 유산소 운동하기', '금융·회계·법률 분야 전문 인맥 쌓기'],
      dont: ['감정적으로 충돌하거나 고집으로 관계 망치지 않기', '더운 환경·과도한 열기에 장시간 있지 않기', '급한 결정이나 충동적 지출 자제하기', '수술·시술은 시기를 잘 골라서 하기', '남의 일에 과도하게 관여해 에너지 소모하지 않기']
    },
    수: {
      do_: ['물 가까운 곳(바다·강·호수)에서 자주 충전하기', '북쪽 방향으로 새로운 기회 찾아보기', '검정·파란색으로 집중력과 직관력 높이기', '철학·연구·창작 활동에 꾸준히 시간 투자하기', '여행·무역·글로벌 네트워크 적극 활용하기'],
      dont: ['찬 음식·아이스 음료 과도하게 섭취하지 않기', '야행성 생활로 신장·방광에 부담 주지 않기', '감정 기복을 조절하지 못해 인간관계 흔들지 않기', '고여 있지 말고 새로운 환경에 계속 자신을 노출하기', '혼자 모든 것을 해결하려다 번아웃 오지 않게 하기']
    },
  };
  const guide = GUIDE[weak] || GUIDE['목'];

  /* ─ HTML 조립 ─ */
  const cs = 'margin-bottom:16px;';
  const T = (icon, title) => `<div class="saju-card-title">${icon} ${title}</div>`;
  const chip = (txt, bg, br, tc) =>
    `<span style="display:inline-block;background:${bg};border:1px solid ${br};color:${tc};border-radius:20px;padding:4px 12px;font-size:12px;font-weight:700;margin:3px 4px 3px 0;">${txt}</span>`;

  // 카드 1 — 성격
  const card1 = `
  <div class="saju-card" style="${cs}">
    ${T('🙋', '나는 어떤 사람인가')}
    <div style="display:flex;gap:12px;align-items:flex-start;">
      <div style="background:linear-gradient(135deg,rgba(0,210,255,0.15),rgba(123,94,167,0.2));border:1px solid rgba(0,210,255,0.25);border-radius:16px;padding:12px 16px;min-width:50px;text-align:center;flex-shrink:0;">
        <div style="font-size:28px;font-weight:900;color:#00d2ff;">${dayGan}</div>
        <div style="font-size:9px;color:rgba(255,255,255,0.35);margin-top:3px;">일간</div>
      </div>
      <div style="flex:1;">
        ${personality.map((p,i) => `<div style="display:flex;gap:8px;align-items:flex-start;${i<personality.length-1?'margin-bottom:10px':''}"><span style="color:#00d2ff;font-size:13px;flex-shrink:0;margin-top:2px;">${['①','②','③'][i]||'✦'}</span><span style="font-size:13px;color:rgba(255,255,255,0.82);line-height:1.75;">${p}</span></div>`).join('')}
      </div>
    </div>
  </div>`;

  // 카드 2 — 직업
  const card2 = `
  <div class="saju-card" style="${cs}">
    ${T('💼', '나에게 맞는 직업')}
    <div style="font-size:13px;font-weight:700;color:#81C784;margin-bottom:10px;">${jobInfo.icon} ${jobInfo.title}</div>
    <div style="margin-bottom:12px;">${jobInfo.jobs.map(j=>chip(j,'rgba(76,175,80,0.1)','rgba(76,175,80,0.3)','#81C784')).join('')}</div>
    <div style="background:rgba(76,175,80,0.05);border:1px solid rgba(76,175,80,0.15);border-radius:10px;padding:10px 14px;font-size:12px;color:rgba(255,255,255,0.5);">💡 ${jobInfo.tip}</div>
  </div>`;

  // 카드 3 — 재물운
  const card3 = `
  <div class="saju-card" style="${cs}">
    ${T('💰', '재물운 스타일')}
    <div style="background:rgba(255,152,0,0.08);border:1px solid rgba(255,152,0,0.25);border-radius:12px;padding:14px;margin-bottom:10px;">
      <div style="font-size:16px;font-weight:800;color:#FFB74D;margin-bottom:8px;">${moneyLabel}</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.78);line-height:1.8;">${moneyDesc}</div>
    </div>
    <div style="background:rgba(255,152,0,0.04);border:1px solid rgba(255,152,0,0.12);border-radius:10px;padding:10px 14px;font-size:12px;color:rgba(255,255,255,0.45);">${moneyTip}</div>
  </div>`;

  // 카드 4 — 연애운
  const card4 = `
  <div class="saju-card" style="${cs}">
    ${T('❤️', '연애·결혼운')}
    <div style="font-size:15px;font-weight:800;color:#EF9A9A;margin-bottom:10px;">${loveLabel}</div>
    <div style="font-size:13px;color:rgba(255,255,255,0.78);line-height:1.8;margin-bottom:12px;">${loveMainDesc}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <div style="background:rgba(244,67,54,0.06);border:1px solid rgba(244,67,54,0.18);border-radius:12px;padding:12px;">
        <div style="font-size:11px;font-weight:700;color:#EF9A9A;margin-bottom:6px;">💕 잘 맞는 상대</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.7);line-height:1.7;">${loveBestMatch}</div>
      </div>
      <div style="background:rgba(255,152,0,0.06);border:1px solid rgba(255,152,0,0.18);border-radius:12px;padding:12px;">
        <div style="font-size:11px;font-weight:700;color:#FFB74D;margin-bottom:6px;">⚠️ 주의할 점</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.7);line-height:1.7;">${loveCaution}</div>
      </div>
    </div>
  </div>`;

  // 카드 5 — 건강
  const card5 = `
  <div class="saju-card" style="${cs}">
    ${T('🏥', '건강 체크포인트')}
    <div style="background:rgba(156,204,101,0.08);border:1px solid rgba(156,204,101,0.2);border-radius:12px;padding:14px;">
      <div style="font-size:13px;font-weight:800;color:#AED581;margin-bottom:10px;">📌 ${healthInfo.arrow}</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.78);line-height:1.8;">${healthInfo.tip}</div>
    </div>
  </div>`;

  // 카드 6 — 2026 운세
  const card6 = `
  <div class="saju-card" style="${cs}">
    ${T('🍀', '2026년 나의 운세')}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <div style="background:rgba(255,165,0,0.07);border:1px solid rgba(255,165,0,0.2);border-radius:12px;padding:14px;">
        <div style="font-size:13px;font-weight:800;color:#FFB74D;margin-bottom:10px;">🌸 상반기 (1~6월)</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.78);line-height:1.85;">${halfYearInfo.h1}</div>
      </div>
      <div style="background:rgba(255,100,0,0.07);border:1px solid rgba(255,100,0,0.2);border-radius:12px;padding:14px;">
        <div style="font-size:13px;font-weight:800;color:#FF8C42;margin-bottom:10px;">🍂 하반기 (7~12월)</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.78);line-height:1.85;">${halfYearInfo.h2}</div>
      </div>
    </div>
    <div style="margin-top:10px;font-size:11px;color:rgba(255,255,255,0.3);text-align:center;">2026 병오(丙午)년 기준 · 참고용</div>
  </div>`;

  // 카드 7 — 해야/하지말아야
  const card7 = `
  <div class="saju-card" style="${cs}">
    ${T('🎯', '올해 해야 할 것 · 하지 말아야 할 것')}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <div style="background:rgba(0,200,100,0.05);border:1px solid rgba(0,200,100,0.2);border-radius:12px;padding:14px;">
        <div style="font-size:13px;font-weight:700;color:#69F0AE;margin-bottom:10px;">✅ 해야 할 것</div>
        ${guide.do_.map(t=>`<div style="display:flex;gap:6px;align-items:flex-start;margin-bottom:8px;"><span style="color:#69F0AE;flex-shrink:0;font-size:11px;margin-top:2px;">▸</span><span style="font-size:12px;color:rgba(255,255,255,0.78);line-height:1.65;">${t}</span></div>`).join('')}
      </div>
      <div style="background:rgba(255,80,80,0.05);border:1px solid rgba(255,80,80,0.2);border-radius:12px;padding:14px;">
        <div style="font-size:13px;font-weight:700;color:#FF8A80;margin-bottom:10px;">⛔ 하지 말아야 할 것</div>
        ${guide.dont.map(t=>`<div style="display:flex;gap:6px;align-items:flex-start;margin-bottom:8px;"><span style="color:#FF8A80;flex-shrink:0;font-size:11px;margin-top:2px;">▸</span><span style="font-size:12px;color:rgba(255,255,255,0.78);line-height:1.65;">${t}</span></div>`).join('')}
      </div>
    </div>
    <div style="margin-top:10px;font-size:11px;color:rgba(255,255,255,0.3);text-align:center;">부족 오행 기준 · 참고용</div>
  </div>`;

  /* ── 카드 8: 개운(開運) 라이프스타일 칩 ── */
  const KAEGUNG = {
    목: {
      emoji:'🌿', title:'목(木) 기운 보완 가이드',
      colors:['초록(Green)', '청색(Blue)'],
      colorNote:'식물·잎사귀 색 계열의 소품이나 의상 포인트에 활용하면 성장 에너지가 활성화됩니다.',
      space:'동쪽 방향의 창가나 책상 배치, 실내 화분·화초 기르기',
      spaceNote:'목기운은 자라는 에너지 — 햇살 받는 식물이 있는 공간에서 집중력이 높아집니다.',
      numbers:'3 · 8',
      numberNote:'중요한 날짜·번호 선택 시 활용, 목요일(木曜日)을 중요 약속의 기준일로 삼으면 좋습니다.',
    },
    화: {
      emoji:'🔥', title:'화(火) 기운 보완 가이드',
      colors:['레드(Red)', '오렌지(Orange)'],
      colorNote:'스마트폰 배경화면·소품·포인트 의상에 활용하면 활력이 충전됩니다.',
      space:'채광이 잘 드는 남향 창가 휴식, 햇볕 쬐며 걷는 산책(포행)',
      spaceNote:'화기운은 빛과 온기 — 오전 햇빛을 직접 받는 것이 가장 빠른 기운 보충입니다.',
      numbers:'2 · 7',
      numberNote:'중요한 비밀번호 설정이나 날짜 선택 시 활용, 화요일(火曜日)이 행동 개시에 유리합니다.',
    },
    토: {
      emoji:'⛰️', title:'토(土) 기운 보완 가이드',
      colors:['황색(Yellow)', '베이지(Beige)', '갈색(Brown)'],
      colorNote:'흙빛·모래빛 계열의 인테리어 소품이나 천연 소재 의상이 안정감을 높입니다.',
      space:'자연 흙길 걷기, 황토방·찜질방·온천 방문, 도예·원예 활동',
      spaceNote:'토기운은 중심 잡기 — 맨발로 흙을 밟는 것만으로도 강한 접지(接地) 에너지를 얻습니다.',
      numbers:'5 · 10',
      numberNote:'중심·균형을 상징하는 숫자, 토요일(土曜日)에 중요한 결정을 마무리하면 안정적입니다.',
    },
    금: {
      emoji:'⚙️', title:'금(金) 기운 보완 가이드',
      colors:['흰색(White)', '은색(Silver)', '회색(Gray)'],
      colorNote:'정갈하고 깔끔한 화이트·실버 계열 소품이 판단력과 결단력을 높여줍니다.',
      space:'정돈된 공간 만들기, 서쪽 방향 창가에서의 집중 작업, 금속 악기 연주·청취',
      spaceNote:'금기운은 정리와 수확 — 책상·방을 깔끔하게 정리하는 것만으로도 금기운이 보충됩니다.',
      numbers:'4 · 9',
      numberNote:'정확성과 완성을 상징, 금요일(金曜日)에 계약·서명·결제 등 마무리 행동이 유리합니다.',
    },
    수: {
      emoji:'💧', title:'수(水) 기운 보완 가이드',
      colors:['검은색(Black)', '남색(Navy)', '다크블루(Dark Blue)'],
      colorNote:'깊고 진한 색상 계열이 지혜·집중력·통찰력을 끌어올려줍니다.',
      space:'물 소리가 들리는 공간(분수·계곡·바다), 북쪽 방향 명상 공간, 족욕·반신욕',
      spaceNote:'수기운은 흐름과 지혜 — 물을 충분히 마시고 촉촉한 피부 관리도 수기운 보충에 도움됩니다.',
      numbers:'1 · 6',
      numberNote:'시작과 깊이를 상징, 수요일(水曜日)을 학습·창작·기획의 핵심일로 활용하면 좋습니다.',
    },
  };

  const weakOh = weak ? weak.replace(/[^가-힣]/g,'').trim() : '';
  const kgInfo = KAEGUNG[weakOh];

  const card8 = kgInfo ? `
  <div class="saju-card" style="${cs}">
    ${T(kgInfo.emoji, kgInfo.title)}
    <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:14px;line-height:1.7;">
      사주에서 ${weakOh}(${weakOh==='목'?'木':weakOh==='화'?'火':weakOh==='토'?'土':weakOh==='금'?'金':'水'}) 기운이 부족합니다. 일상 속 아래 방법으로 자연스럽게 보완해보세요.
    </div>
    <div style="display:flex;flex-direction:column;gap:10px;">
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;">
        <div style="font-size:12px;font-weight:700;color:#FFD54F;margin-bottom:6px;">🎨 행운의 색상</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;">
          ${kgInfo.colors.map(c=>`<span style="background:rgba(255,213,79,0.1);border:1px solid rgba(255,213,79,0.3);border-radius:20px;padding:4px 12px;font-size:12px;color:#FFD54F;font-weight:600;">${c}</span>`).join('')}
        </div>
        <div style="font-size:12px;color:rgba(255,255,255,0.65);line-height:1.7;">${kgInfo.colorNote}</div>
      </div>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;">
        <div style="font-size:12px;font-weight:700;color:#80DEEA;margin-bottom:6px;">🌿 공간 에너지</div>
        <div style="font-size:12px;font-weight:600;color:rgba(255,255,255,0.85);margin-bottom:4px;">${kgInfo.space}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.6);line-height:1.7;">${kgInfo.spaceNote}</div>
      </div>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;">
        <div style="font-size:12px;font-weight:700;color:#CE93D8;margin-bottom:6px;">🔢 행운의 숫자</div>
        <div style="font-size:20px;font-weight:900;color:#CE93D8;letter-spacing:4px;margin-bottom:4px;">${kgInfo.numbers}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.6);line-height:1.7;">${kgInfo.numberNote}</div>
      </div>
    </div>
  </div>` : '';

  /* ── 카드 9: 교운기(交運期) 마인드셋 팁 ── */
  const daYunList = data.daYun?.list || [];
  const currentDyIdx = daYunList.findIndex(d => d.isCurrent);
  const currentDy = daYunList[currentDyIdx];
  const nextDy = currentDyIdx >= 0 ? daYunList[currentDyIdx + 1] : null;

  // 현재 대운 종료 나이 = 다음 대운 시작 나이
  const gyoUngiAge = nextDy ? nextDy.startAge : null;
  const gyoUngiStart = gyoUngiAge ? gyoUngiAge - 2 : null;
  const gyoUngiEnd   = gyoUngiAge ? gyoUngiAge + 2 : null;
  const currentYear = new Date().getFullYear();
  const birthYear = birthInput?.year || currentYear;
  // 현재 나이 계산(만 나이 근사)
  const approxAge = currentYear - birthYear;
  // 교운기 해당 여부
  const inGyoUngi = gyoUngiAge !== null && Math.abs(approxAge - gyoUngiAge) <= 3;

  const card9 = gyoUngiAge ? `
  <div class="saju-card" style="${cs}">
    ${T('⏳', '대운 교운기(交運期) 마인드셋 가이드')}
    <div style="background:rgba(255,193,7,0.07);border:1px solid rgba(255,193,7,0.22);border-radius:12px;padding:14px;margin-bottom:12px;">
      <div style="font-size:12px;font-weight:700;color:#FFD54F;margin-bottom:5px;">
        ${inGyoUngi ? '⚡ 현재 교운기 진행 중' : `📅 다음 교운기 예정`}
      </div>
      <div style="font-size:13px;color:rgba(255,255,255,0.85);line-height:1.7;">
        <strong style="color:#FFD54F;">만 ${gyoUngiStart}세~${gyoUngiEnd}세</strong> 구간이 교운기(대운 환절기)입니다.
        ${currentDy ? `현재 <strong style="color:#00D2FF;">${currentDy.ganZhi}</strong> 대운에서 ` : ''}
        ${nextDy ? `<strong style="color:#69F0AE;">${nextDy.ganZhi}</strong> 대운으로 기운이 전환됩니다.` : ''}
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
          <div style="font-size:12px;color:rgba(255,255,255,0.65);line-height:1.7;">${nextDy ? `다음 <strong style="color:#69F0AE;">${nextDy.ganZhi}</strong> 대운은 새로운 기운의 시작입니다. 이 기간에 씨앗을 심으면 대운이 바뀌었을 때 꽃이 핍니다. 서두르지 말고 방향을 잡는 데 집중하세요.` : '새로운 대운을 준비하는 시기입니다. 방향을 잡는 데 집중하세요.'}</div>
        </div>
      </div>
    </div>
  </div>` : '';

  /* ── 카드 10: 베스트 일주 궁합 ── */
  const BEST_JILJU = {
    '甲': {
      guiIn: { jilju:'癸亥(계해)', reason:'맑은 수(水)가 목(木)을 강하게 생(生)해주는 귀인 관계입니다. 지적이고 따뜻하며 나의 성장을 조용히 뒷받침해줍니다.' },
      energy: { element:'水', desc:'임수(壬)·계수(癸) 천간이나 해(亥)·자(子) 지지를 가진 분이 나의 역량을 끌어올려주는 귀인입니다.' },
    },
    '乙': {
      guiIn: { jilju:'壬子(임자)', reason:'깊은 수(水) 기운이 을목(乙)을 촉촉하게 적셔주는 관계입니다. 지혜롭고 유연하며 부드러운 소통으로 나를 편안하게 해줍니다.' },
      energy: { element:'水', desc:'임수(壬)·계수(癸) 천간이나 해(亥)·자(子) 지지를 가진 분이 섬세한 감성을 지지해주는 귀인입니다.' },
    },
    '丙': {
      guiIn: { jilju:'甲寅(갑인)', reason:'강한 목(木)이 화(火)를 생(生)해주어 빛나는 시너지를 냅니다. 도전적이고 리더십 있는 사람이 나의 열정에 에너지를 더해줍니다.' },
      energy: { element:'木', desc:'갑목(甲)·을목(乙) 천간이나 인(寅)·묘(卯) 지지를 가진 분이 나의 표현력을 극대화시켜주는 파트너입니다.' },
    },
    '丁': {
      guiIn: { jilju:'甲午(갑오)', reason:'목(木)이 화(火)를 생하고 오화(午)가 합세하는 강력한 조합입니다. 추진력 있는 사람이 나의 따뜻함과 만날 때 최고의 결과물이 나옵니다.' },
      energy: { element:'木', desc:'갑목(甲)·을목(乙) 천간이나 인(寅)·묘(卯) 지지를 가진 분이 나의 세심한 감성에 불꽃을 일으킵니다.' },
    },
    '戊': {
      guiIn: { jilju:'丙午(병오)', reason:'화(火)가 토(土)를 따뜻하게 생해주는 관계입니다. 열정적이고 표현력 있는 사람이 든든한 나에게 활기를 불어넣습니다.' },
      energy: { element:'火', desc:'병화(丙)·정화(丁) 천간이나 오(午)·사(巳) 지지를 가진 분이 나의 안정감에 생동감을 더해줍니다.' },
    },
    '己': {
      guiIn: { jilju:'丁巳(정사)', reason:'화(火)가 토(土)를 데워주는 귀인 관계입니다. 감수성 풍부하고 헌신적인 사람이 나의 섬세함과 조화를 이룹니다.' },
      energy: { element:'火', desc:'병화(丙)·정화(丁) 천간이나 오(午)·사(巳) 지지를 가진 분이 나의 실용적인 기운에 온기를 더해줍니다.' },
    },
    '庚': {
      guiIn: { jilju:'戊辰(무진)', reason:'토(土)가 금(金)을 생해주는 든든한 지지 관계입니다. 안정적이고 신뢰감 있는 사람이 나의 날카로운 결단력을 지지해줍니다.' },
      energy: { element:'土', desc:'무토(戊)·기토(己) 천간이나 진(辰)·술(戌)·축(丑)·미(未) 지지를 가진 분이 나의 추진력을 뒷받침합니다.' },
    },
    '辛': {
      guiIn: { jilju:'己丑(기축)', reason:'토(土)가 금(金)을 생하고 축토(丑) 지지가 신금을 품어주는 귀인입니다. 성실하고 포용적인 사람이 예민한 나에게 안정을 줍니다.' },
      energy: { element:'土', desc:'무토(戊)·기토(己) 천간이나 토(土) 지지를 가진 분이 나의 완벽주의를 따뜻하게 받쳐줍니다.' },
    },
    '壬': {
      guiIn: { jilju:'庚申(경신)', reason:'금(金)이 수(水)를 생해주는 최강 귀인 조합입니다. 원칙적이고 결단력 있는 사람이 나의 큰 그림을 현실로 만들어주는 조력자입니다.' },
      energy: { element:'金', desc:'경금(庚)·신금(辛) 천간이나 신(申)·유(酉) 지지를 가진 분이 나의 광대한 아이디어에 방향과 힘을 줍니다.' },
    },
    '癸': {
      guiIn: { jilju:'辛酉(신유)', reason:'맑은 금(金)이 수(水)를 생해주는 귀인 관계입니다. 세련되고 감각적인 사람이 나의 깊은 감성에 맑은 에너지를 보충해줍니다.' },
      energy: { element:'金', desc:'경금(庚)·신금(辛) 천간이나 신(申)·유(酉) 지지를 가진 분이 나의 직관을 현실로 연결시켜주는 파트너입니다.' },
    },
  };

  const bjInfo = BEST_JILJU[dayGan];

  const card10 = bjInfo ? `
  <div class="saju-card" style="${cs}">
    ${T('💞', '나를 돕는 최고의 일주(日柱) 궁합')}
    <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:14px;line-height:1.7;">
      일간 <strong style="color:#FFD54F;">${dayGan}</strong>을 기준으로 나의 기운을 보완하거나 시너지를 극대화하는 상대 일주입니다.
    </div>
    <div style="display:flex;flex-direction:column;gap:10px;">
      <div style="background:linear-gradient(135deg,rgba(0,210,255,0.06),rgba(107,130,249,0.04));border:1px solid rgba(0,210,255,0.2);border-radius:12px;padding:14px;">
        <div style="font-size:12px;font-weight:700;color:#00D2FF;margin-bottom:8px;">🤝 서로의 결핍을 채워주는 귀인 일주</div>
        <div style="font-size:18px;font-weight:900;color:#00D2FF;margin-bottom:6px;letter-spacing:1px;">${bjInfo.guiIn.jilju}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.72);line-height:1.8;">${bjInfo.guiIn.reason}</div>
      </div>
      <div style="background:linear-gradient(135deg,rgba(105,240,174,0.06),rgba(0,200,83,0.04));border:1px solid rgba(105,240,174,0.2);border-radius:12px;padding:14px;">
        <div style="font-size:12px;font-weight:700;color:#69F0AE;margin-bottom:8px;">🔥 나의 열정을 깨워주는 파트너 유형</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.72);line-height:1.8;">${bjInfo.energy.desc}</div>
        <div style="margin-top:8px;font-size:11px;background:rgba(105,240,174,0.08);border-radius:8px;padding:8px 10px;color:rgba(255,255,255,0.55);line-height:1.7;">
          💡 상대방의 사주팔자를 함께 분석해보면 실제 궁합의 깊이를 더 정확하게 확인할 수 있습니다.
        </div>
      </div>
    </div>
  </div>` : '';

  return card1 + card2 + card3 + card4 + card5 + card6 + card7 + card8 + card9 + card10;
}

function renderSajuPage(data, birthInput, matchData, explanation) {
  // 페이지 복귀용 인자 저장
  _sajuPageArgs = { data, birthInput, matchData, explanation };
  // 챗봇에 사주 컨텍스트 저장
  _sajuContext = {
    eightChar: data.eightChar,
    distribution: data.distribution,
    weak: data.weak,
    daYun: data.daYun,
    samjae: data.samjae,
    birthInput,
    temples: matchData?.results?.slice(0,3).map(r => ({ name: r.temple?.name, address: r.temple?.address })) || [],
  };

  const resultsEl = document.getElementById("results");
  resultsEl.classList.remove("hidden");

  // 폼 숨기기
  const formEl = document.getElementById("match-form");
  if (formEl) formEl.style.display = "none";

  const ohaengMap = {'木':'목','火':'화','土':'토','金':'금','水':'수'};
  const colorMap  = {'목':'#4CAF50','화':'#FF5722','토':'#FF9800','금':'#9E9E9E','수':'#2196F3'};
  const ohaengKo  = {'목':'木 목','화':'火 화','토':'土 토','금':'金 금','수':'水 수'};

  const ec = data.eightChar;
  // 만세력 표준 표 형식: 시·일·월·년 순 (오른쪽이 년)
  const pillarsHtml = ec ? (() => {
    const cols = [
      {label:'시(時)', char:ec.time,  wx:ec.timeWx},
      {label:'일(日)', char:ec.day,   wx:ec.dayWx},
      {label:'월(月)', char:ec.month, wx:ec.monthWx},
      {label:'년(年)', char:ec.year,  wx:ec.yearWx},
    ];
    const getGan = c => c ? c[0] : '';
    const getJi  = c => c ? c[1] : '';
    const wxRow  = cols.map(c => {
      const chars = [...(c.wx||'')].map(h=>ohaengMap[h]).filter(Boolean);
      const col   = colorMap[chars[0]] || '#00d2ff';
      return { chars, col };
    });
    return `
    <table class="saju-table">
      <thead><tr>
        ${cols.map(c=>`<th>${c.label}</th>`).join('')}
      </tr></thead>
      <tbody>
        <tr class="saju-table-gan">
          ${cols.map((c,i)=>`<td style="color:${wxRow[i].col}">${getGan(c.char)}</td>`).join('')}
        </tr>
        <tr class="saju-table-ji">
          ${cols.map((c,i)=>`<td style="color:${wxRow[i].col}">${getJi(c.char)}</td>`).join('')}
        </tr>
        <tr class="saju-table-wx">
          ${wxRow.map(w=>`<td style="color:${w.col};font-size:11px;">${w.chars.join('·')}</td>`).join('')}
        </tr>
      </tbody>
    </table>`;
  })() : '<p style="color:rgba(255,255,255,0.5);text-align:center;">사주 계산 결과를 불러올 수 없습니다.</p>';

  const dist = data.distribution || {};
  const distHtml = Object.entries(dist).map(([k,v])=>`
    <div class="saju-dist-item">
      <span class="saju-dist-label" style="color:${colorMap[k]||'#fff'}">${ohaengKo[k]||k}</span>
      <div class="saju-dist-bar-wrap">
        <div class="saju-dist-bar" style="width:${Math.min(v*25,100)}%;background:${colorMap[k]||'#00d2ff'}"></div>
      </div>
      <span class="saju-dist-val">${v}</span>
    </div>
  `).join('');

  const calStr = birthInput.calendarType === 'lunar' ? '음력' : '양력';
  const hourStr = `${birthInput.hour}시 ${birthInput.minute > 0 ? birthInput.minute+'분' : ''}`.trim();
  const cityCorrection = birthInput.birthLongitude
    ? ` · 출생지 진태양시 보정 (경도 ${birthInput.birthLongitude}°)`
    : ' · 출생지 미입력(표준시 기준)';

  // ── 인연사찰 추천 결과 (메인) ──
  const weakOh = data.weak?.부족오행 ?? "";
  const ohColor = {목:'#4CAF50',화:'#FF5722',토:'#FF9800',금:'#9E9E9E',수:'#2196F3'};
  const ohChinese = {목:'木',화:'火',토:'土',금:'金',수:'水'};
  const matchResults = matchData?.results || [];
  const targetOh = matchData?.targetOhaeng || weakOh; // 실제 추천 기준 오행
  const templeHtml = matchResults.length > 0 ? `
    <div class="saju-dist-section" style="border-color:rgba(0,210,255,0.3);">
      <div class="saju-dist-title">🏯 나의 인연사찰 추천
        ${targetOh ? `<span style="font-size:12px;font-weight:400;color:${ohColor[targetOh]||'#00d2ff'};margin-left:8px;">· ${ohChinese[targetOh]||''}(${targetOh}) 기운 ${targetOh === weakOh ? '보완' : '기도 방위'}</span>` : ''}
      </div>
      ${matchResults.slice(0,5).map((r,i)=>{
        const t = r.temple || {};
        const distKm = r.detail?.distanceKm;
        return `
        <div style="display:flex;align-items:center;gap:12px;padding:14px 12px;margin-top:8px;background:rgba(0,210,255,0.04);border:1px solid rgba(0,210,255,0.12);border-radius:12px;cursor:pointer;" class="saju-temple-card" data-temple-index="${i}">
          <div style="font-size:24px;min-width:34px;text-align:center;">${['🥇','🥈','🥉','4️⃣','5️⃣'][i]}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:16px;font-weight:800;color:#fff;">${t.name||''}</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.45);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${t.address||''}</div>
            ${distKm!=null?`<div style="font-size:12px;color:var(--cyan);margin-top:3px;">📍 ${distKm<1?(distKm*1000).toFixed(0)+'m':distKm.toFixed(1)+'km'}</div>`:''}
            ${r.reason?`<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-top:4px;line-height:1.4;">${r.reason}</div>`:''}
          </div>
          <div style="text-align:right;flex-shrink:0;">
            <div style="font-size:20px;font-weight:900;color:var(--cyan);">${r.score||''}</div>
            <div style="font-size:10px;color:rgba(255,255,255,0.3);">점</div>
            <div style="font-size:10px;color:rgba(0,210,255,0.6);margin-top:4px;">상세 ›</div>
          </div>
        </div>`;
      }).join('')}
      <p style="font-size:11px;color:rgba(255,255,255,0.3);text-align:center;margin-top:12px;">※ 오행 궁합 · 거리 · 유래 종합 점수 기준 · 참고용</p>
    </div>` : `<div class="saju-notice-banner" style="text-align:center;">📍 위치를 확인하는 중이었거나 사찰 데이터를 불러오지 못했습니다.<br><button class="submit-btn" style="margin-top:12px;padding:10px 24px;" id="retry-match-btn">🔄 인연사찰 다시 찾기</button></div>`;

  // ── 사주 팔자 요약 카드 ──
  const sajuSummaryHtml = `
    <div class="saju-card" style="margin-bottom:0;">
      <div class="saju-card-title" style="font-size:13px;">🔮 사주 팔자 (四柱八字) · ${calStr} ${birthInput.year}년 ${birthInput.month}월 ${birthInput.day}일 · ${hourStr}</div>
      ${pillarsHtml}
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;justify-content:center;">
        ${distHtml ? `<details style="width:100%;"><summary style="cursor:pointer;font-size:12px;color:rgba(255,255,255,0.4);list-style:none;">▼ 오행 분포 보기</summary><div style="margin-top:8px;">${distHtml}</div></details>` : ''}
      </div>
    </div>`;

  // ── 대운 (접힘 처리) ──
  const daYunHtml = data.daYun ? `
    <details>
      <summary style="cursor:pointer;padding:14px 18px;background:rgba(13,30,60,0.8);border:1.5px solid rgba(255,255,255,0.07);border-radius:14px;font-size:14px;font-weight:700;color:rgba(255,255,255,0.7);list-style:none;display:flex;justify-content:space-between;align-items:center;">
        <span>🌊 대운 (大運) — ${data.daYun.direction} · ${data.daYun.startAge}세부터</span>
        <span style="font-size:11px;color:rgba(255,255,255,0.3);">클릭해서 보기 ▼</span>
      </summary>
      <div class="saju-dist-section" style="margin-top:4px;border-radius:0 0 14px 14px;">
        <div class="dayun-list">
          ${data.daYun.list.map((dy) => `
            <div class="dayun-block ${dy.isCurrent ? 'dayun-current' : ''}">
              <div class="dayun-block-header" onclick="(function(el){var g=el.closest('.dayun-block').querySelector('.liunian-grid');if(g){g.style.display=g.style.display==='none'?'grid':'none';}})(this)" style="cursor:pointer;">
                ${dy.isCurrent ? '<span class="dayun-now-badge">현재 대운</span>' : ''}
                <span class="dayun-block-age">${dy.startAge}세 (${dy.startYear}년~${dy.endAge}세)</span>
                <span class="dayun-block-gz">${dy.ganZhi}</span>
                <span style="font-size:11px;color:rgba(255,255,255,0.3);">${dy.isCurrent?'▲':'▼'}</span>
              </div>
              ${dy.liuNian?.length > 0 ? `
              <div class="liunian-grid" style="display:${dy.isCurrent?'grid':'none'}">
                ${dy.liuNian.map(ln=>`
                  <div class="liunian-item ${ln.isCurrent?'liunian-current':''}">
                    <span class="liunian-year">${ln.year}</span>
                    <span class="liunian-gz">${ln.ganZhi}</span>
                    <span class="liunian-age">${ln.age}세</span>
                  </div>`).join('')}
              </div>` : ''}
            </div>`).join('')}
        </div>
      </div>
    </details>` : '';

  // ── 삼재 (접힘 처리) ──
  const samjaeHtml = data.samjae ? `
    <details>
      <summary style="cursor:pointer;padding:14px 18px;background:rgba(13,30,60,0.8);border:1.5px solid rgba(255,255,255,0.07);border-radius:14px;font-size:14px;font-weight:700;color:rgba(255,255,255,0.7);list-style:none;display:flex;justify-content:space-between;align-items:center;">
        <span>⚡ 삼재(三災) 안내</span>
        <span style="font-size:11px;color:rgba(255,255,255,0.3);">클릭해서 보기 ▼</span>
      </summary>
      <div class="saju-dist-section" style="margin-top:4px;">
        <div class="samjae-info">
          <span class="samjae-birth">${birthInput.gender==='female'?'여':'남'} · 띠: <strong>${data.samjae.birthZhiCn||data.samjae.birthZhi}</strong>(${data.samjae.birthZhiKo})</span>
          <span class="samjae-target">삼재 해: <strong>${data.samjae.samjaeTarget}</strong>년</span>
        </div>
        ${data.samjae.groups.map((grp)=>{
          const now=new Date().getFullYear();
          const isNow=grp.some(y=>y.year===now||y.year===now-1||y.year===now+1);
          return `<div class="samjae-group ${isNow?'samjae-active':''}">
            ${isNow?'<span class="samjae-now-badge">현재 삼재</span>':''}
            ${grp.map((y,i)=>`<span class="samjae-year-item">${y.year}년(${y.zhiKo}·${i===0?'들삼재':i===1?'눌삼재':'날삼재'})</span>`).join(' → ')}
          </div>`;
        }).join('')}
      </div>
    </details>` : '';

  // AI 풀이 텍스트 → HTML 변환 (마크다운 처리)
  const explanationBodyHtml = explanation
    ? explanation
        .replace(/^#{1,3}\s+(.+)$/gm, '<h3 class="saju-explain-h3">$1</h3>')   // # ## ### 제목
        .replace(/^---+$/gm, '<hr style="border:none;border-top:1px solid rgba(0,210,255,0.15);margin:12px 0;">')  // 구분선
        .replace(/\*\*(.+?)\*\*/g, '<strong class="saju-explain-heading">$1</strong>')  // **굵게**
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p>').replace(/$/, '</p>')
        .replace(/<p>\s*(<h3|<hr)/g, '$1')   // h3/hr 앞 빈 p 제거
        .replace(/(<\/h3>|<hr[^>]*>)\s*<\/p>/g, '$1')  // h3/hr 뒤 빈 p 제거
    : '';

  const explanationHtml = `
    <div class="saju-explain-card">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
        <div class="saju-card-title" style="margin-bottom:0;">📖 나의 사주 풀이</div>
        ${explanation ? `<button id="saju-download-btn" style="background:linear-gradient(135deg,#00d2ff,#7b5ea7);border:none;border-radius:10px;padding:9px 18px;color:#fff;font-weight:700;font-size:13px;cursor:pointer;white-space:nowrap;">📥 결과 다운받기</button>` : ''}
      </div>
      <div class="saju-explain-body" id="saju-ai-explanation">${explanation ? explanationBodyHtml : `
        <div style="display:flex;flex-direction:column;gap:10px;padding:8px 0;">
          <div style="display:flex;align-items:center;gap:10px;color:rgba(0,210,255,0.7);font-size:13px;">
            <span style="display:inline-block;width:16px;height:16px;border:2px solid rgba(0,210,255,0.4);border-top-color:rgba(0,210,255,0.9);border-radius:50%;animation:spin 1s linear infinite;flex-shrink:0;"></span>
            AI가 사주를 분석하고 있습니다... (30초~1분 소요)
          </div>
          <div style="height:6px;background:rgba(0,210,255,0.08);border-radius:4px;overflow:hidden;">
            <div style="height:100%;width:40%;background:linear-gradient(90deg,transparent,rgba(0,210,255,0.4),transparent);animation:shimmer 1.5s ease-in-out infinite;border-radius:4px;"></div>
          </div>
        </div>`}</div>
    </div>`;

  // 삼재 해당자에게만 경고 카드 표시
  const currentYear2 = new Date().getFullYear();
  const isSamjaeNow = data.samjae?.groups?.some(g => g.some(y => Math.abs(y.year - currentYear2) <= 1));
  const samjaeAlertHtml = isSamjaeNow ? (() => {
    const nowGrp = data.samjae.groups.find(g => g.some(y => Math.abs(y.year - currentYear2) <= 1)) || [];
    // 그룹 내 현재 연도의 위치(인덱스)로 단계 판정 — Math.abs 방식은 이전 연도를 먼저 반환해 단계가 밀리는 버그 있음
    const nowGrpIdx = nowGrp.findIndex(y => y.year === currentYear2);
    const SAMJAE_STEPS = ["들삼재", "눌삼재(삼재 중반)", "날삼재(마무리 단계)"];
    const step = nowGrpIdx >= 0
      ? SAMJAE_STEPS[nowGrpIdx]
      : nowGrp.findIndex(y => y.year === currentYear2 + 1) === 0
        ? "들삼재 진입 직전"
        : "날삼재 마무리 후";
    return `<div style="background:rgba(220,50,50,0.1);border:1.5px solid rgba(220,80,80,0.4);border-radius:14px;padding:16px 18px;display:flex;gap:12px;align-items:flex-start;">
      <span style="font-size:24px;">⚠️</span>
      <div>
        <div style="font-size:14px;font-weight:800;color:#ff8080;margin-bottom:4px;">현재 삼재(三災) 기간</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.75);line-height:1.6;">
          ${nowGrp.map((y,i)=>`<span>${y.year}년(${['들삼재','눌삼재','날삼재'][i]})</span>`).join(' → ')}<br>
          현재: <strong style="color:#ff8080;">${step}</strong> — 사주 풀이 하단의 삼재 주의사항을 확인하세요.
        </div>
      </div>
    </div>`;
  })() : '';

  resultsEl.innerHTML = `
    <div class="detail-nav-row" style="margin-bottom:16px;">
      <button class="home-btn" id="saju-go-home">🏠 처음으로</button>
    </div>
    <div class="saju-page-wrap">
      <div id="saju-noprint-top">${samjaeAlertHtml}</div>
      ${explanationHtml}
      ${buildSajuDetailCards(data, birthInput)}
      ${daYunHtml}
      ${samjaeHtml}
      ${buildLifeGuideCards(data, birthInput)}
      <div id="saju-noprint-bottom">${templeHtml}${sajuSummaryHtml}</div>
    </div>`;

  resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });

  document.getElementById("saju-go-home")?.addEventListener("click", () => {
    resultsEl.classList.add("hidden");
    resultsEl.innerHTML = "";
    const formEl = document.getElementById("match-form");
    if (formEl) formEl.style.display = "";
    document.getElementById("app")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // 사주 페이지 사찰 카드 클릭 → 상세 페이지
  const _matchResults = matchData?.results || [];
  document.querySelectorAll(".saju-temple-card").forEach(card => {
    card.addEventListener("click", () => {
      const idx = parseInt(card.dataset.templeIndex);
      if (_matchResults[idx]) {
        renderTempleDetailPage(_matchResults[idx], null, isMember(), () => {
          if (_sajuPageArgs) renderSajuPage(_sajuPageArgs.data, _sajuPageArgs.birthInput, _sajuPageArgs.matchData, _sajuPageArgs.explanation);
        });
      }
    });
  });

  // 📥 결과 다운받기 — 인쇄용 새 창 (PDF 저장 가능)
  document.getElementById("saju-download-btn")?.addEventListener("click", () => {
    const calStr  = birthInput.calendarType === 'lunar' ? '음력' : '양력';
    const hourStr = `${birthInput.hour}시${birthInput.minute > 0 ? ' ' + birthInput.minute + '분' : ''}`;
    const title   = `사주 풀이 — ${calStr} ${birthInput.year}년 ${birthInput.month}월 ${birthInput.day}일 ${hourStr}`;

    const pdfResults = matchData?.results || [];
    const templeList = pdfResults.slice(0,5).map((r,i)=>{
      const t = r.temple || {};
      const distKm = r.detail?.distanceKm;
      return `<div class="p-temple"><span class="p-rank">${i+1}위</span> <strong>${t.name||''}</strong><br>
       <span class="p-addr">${t.address||''}</span>${distKm!=null?' · '+(distKm<1?(distKm*1000).toFixed(0)+'m':distKm.toFixed(1)+'km'):''}
       &nbsp;${r.score||''}점</div>`;
    }).join('');

    const pillars = data.eightChar ? [
      {l:'시(時)', c:data.eightChar.time,  w:data.eightChar.timeWx},
      {l:'일(日)', c:data.eightChar.day,   w:data.eightChar.dayWx},
      {l:'월(月)', c:data.eightChar.month, w:data.eightChar.monthWx},
      {l:'년(年)', c:data.eightChar.year,  w:data.eightChar.yearWx},
    ] : [];

    const ohC = {목:'#2e7d32',화:'#c62828',토:'#e65100',금:'#455a64',수:'#1565c0'};
    const ohaengMap = {'木':'목','火':'화','土':'토','金':'금','水':'수'};
    const pillarTable = pillars.length ? `
      <table class="p-table">
        <tr><th>구분</th>${pillars.map(p=>`<th>${p.l}</th>`).join('')}</tr>
        <tr><td>천간</td>${pillars.map(p=>{ const wx=[...p.w].map(h=>ohaengMap[h]).filter(Boolean); const col=ohC[wx[0]]||'#333'; return `<td style="color:${col};font-size:26px;font-weight:900;">${p.c?.[0]||''}</td>`; }).join('')}</tr>
        <tr><td>지지</td>${pillars.map(p=>{ const wx=[...p.w].map(h=>ohaengMap[h]).filter(Boolean); const col=ohC[wx[0]]||'#333'; return `<td style="color:${col};font-size:26px;font-weight:900;">${p.c?.[1]||''}</td>`; }).join('')}</tr>
        <tr><td>오행</td>${pillars.map(p=>{ const wx=[...p.w].map(h=>ohaengMap[h]).filter(Boolean); return `<td style="font-size:12px;">${wx.join('·')}</td>`; }).join('')}</tr>
      </table>` : '';

    const currentDaYun = data.daYun?.list?.find(d => d.isCurrent);

    const htmlContent = `<!DOCTYPE html><html lang="ko"><head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Malgun Gothic','Apple SD Gothic Neo',sans-serif;color:#1a1a2e;background:#fff;padding:0;}
        .page{max-width:740px;margin:0 auto;padding:36px 40px;}
        .header{text-align:center;border-bottom:3px double #4a3f8f;padding-bottom:18px;margin-bottom:24px;}
        .header h1{font-size:22px;color:#2c1f6b;letter-spacing:.1em;}
        .header .sub{font-size:13px;color:#666;margin-top:6px;}
        .section{margin-bottom:28px;}
        .section-title{font-size:15px;font-weight:800;color:#2c1f6b;border-left:4px solid #4a3f8f;padding-left:10px;margin-bottom:12px;}
        .p-table{width:100%;border-collapse:collapse;text-align:center;margin:8px 0;}
        .p-table th{background:#f0eeff;font-size:12px;padding:7px;border:1px solid #c5bfea;}
        .p-table td{border:1px solid #ddd;padding:8px;}
        .explain{font-size:13.5px;line-height:2;color:#222;}
        .explain-heading{display:block;font-size:14px;font-weight:800;color:#2c1f6b;margin:18px 0 6px;padding:4px 0 4px 10px;border-left:3px solid #7b5ea7;background:#f5f3ff;}
        .p-temple{padding:10px 0;border-bottom:1px dashed #ddd;font-size:13px;}
        .p-rank{display:inline-block;background:#4a3f8f;color:#fff;border-radius:4px;padding:1px 7px;margin-right:6px;font-size:12px;}
        .p-addr{color:#777;font-size:12px;}
        .dayun-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;}
        .dayun-chip{border:1px solid #c5bfea;border-radius:6px;padding:5px 10px;font-size:12px;background:#f8f7ff;}
        .dayun-chip.current{background:#4a3f8f;color:#fff;font-weight:700;}
        .footer{margin-top:32px;padding-top:16px;border-top:1px solid #ddd;font-size:11px;color:#999;text-align:center;}
        @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
      </style>
    </head><body><div class="page">
      <div class="header">
        <h1>🔮 나의 사주 풀이 결과</h1>
        <div class="sub">${title} · 잼공인연사찰 (jamgong-inyeonsachal.vercel.app)</div>
        <div class="sub" style="margin-top:4px;">발행일: ${new Date().toLocaleDateString('ko-KR')}</div>
      </div>

      <div class="section">
        <div class="section-title">사주 팔자 (四柱八字)</div>
        ${pillarTable}
        <p style="font-size:12px;color:#888;margin-top:8px;">※ 절기(節氣) 기준 만세력 계산 · 진태양시 보정 포함</p>
      </div>

      ${pdfResults.length ? `<div class="section">
        <div class="section-title">🏯 인연사찰 추천</div>
        ${templeList}
      </div>` : ''}

      <div class="section">
        <div class="section-title">📖 사주 풀이</div>
        <div class="explain">${explanationBodyHtml.replace(/class="saju-explain-heading"/g,'class="explain-heading"')}</div>
      </div>

      ${currentDaYun ? `<div class="section">
        <div class="section-title">🌊 대운 (大運) — ${data.daYun.direction} · ${data.daYun.startAge}세부터</div>
        <div class="dayun-row">${data.daYun.list.map(dy=>`
          <div class="dayun-chip ${dy.isCurrent?'current':''}">
            ${dy.isCurrent?'▶ ':''}${dy.startAge}세 ${dy.ganZhi}
          </div>`).join('')}
        </div>
      </div>` : ''}

      <div class="footer">
        잼공인연사찰 · 절기 기준 만세력 데이터 연동 · 사주 풀이는 AI 분석 기반 참고용입니다
      </div>
    </div>
    <script>window.onload=function(){window.print();}</script>
    </body></html>`;
    // 인쇄 다이얼로그 (PDF 저장 가능)
    window.print();
  });

  // 재시도 버튼 (사찰 결과 없을 때)
  document.getElementById("retry-match-btn")?.addEventListener("click", async () => {
    const btn = document.getElementById("retry-match-btn");
    btn.textContent = "탐색 중..."; btn.disabled = true;
    try {
      const { userLat, userLng } = await detectUserLocation();
      const res = await fetch("/api/match", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthInput, userLat, userLng, purpose: selectedPurpose || "인연운" }),
      });
      const md = await res.json();
      if (!md.error) renderSajuPage(data, birthInput, md, explanation);
    } catch(_) { btn.textContent = "🔄 다시 찾기"; btn.disabled = false; }
  });
}


function renderResults(data) {
  const resultsEl = document.getElementById("results");
  resultsEl.classList.remove("hidden");

  const top = (data.results || [])[0];
  const deg = BEARING_DEG[top?.detail?.bearing] ?? 0;
  const memberUnlocked = isMember();

  resultsEl.innerHTML = `
    <div class="results-summary">
      <div class="label">나의 기운은</div>
      <div class="ohaeng-value">${data.targetOhaeng || ""} 기운</div>
      <div class="ohaeng-breakdown">
        ${Object.entries(data.distribution || {}).map(([k,v]) => `${k} ${v}`).join(" · ")}
      </div>
    </div>

    ${buildCompassSVG(deg)}

    ${!memberUnlocked ? `
      <div style="text-align:center;margin:-4px 0 14px;">
        <button id="demo-detail-btn" style="display:inline-flex;align-items:center;gap:7px;background:rgba(212,175,55,0.08);border:1.5px solid rgba(212,175,55,0.35);border-radius:20px;padding:9px 22px;color:rgba(212,175,55,0.9);font-size:13px;font-family:var(--sans);font-weight:600;cursor:pointer;">✨ 멤버십 상세페이지 미리보기</button>
      </div>
    ` : ""}

    ${memberUnlocked ? `
      <div class="member-banner unlocked">✓ 잼공스토리 멤버십 — 전체 기능이 열려있습니다</div>
    ` : `
      <div class="member-unlock">
        <input type="text" id="member-code-input" placeholder="멤버십 코드 입력 (선택)" />
        <button id="member-code-btn">확인</button>
      </div>
    `}

    ${data.purposeGuide ? `
      <div class="prayer-guide">
        <div class="prayer-guide-label">🙏 이렇게 기도해보세요</div>
        <div class="prayer-guide-text">
          ${Array.isArray(data.purposeGuide) ? `<ol class="prayer-steps">${data.purposeGuide.map(step => `<li>${step}</li>`).join("")}</ol>` : data.purposeGuide}
        </div>
      </div>
    ` : ""}

    ${(data.results || []).map((r, i) => `
      <div class="temple-card" style="--accent: ${OHAENG_COLOR[r.detail?.templeOhaeng] || 'var(--gold)'}; animation-delay: ${0.15 + i * 0.08}s;">
        <div class="temple-rank">${i + 1}</div>
        <div class="temple-body">
          <h3>
            <a class="temple-name-link" href="https://map.naver.com/v5/search/${encodeURIComponent((r.temple.name || '') + ' ' + (r.temple.address || ''))}" target="_blank" rel="noopener">
              ${r.temple.name} <span class="map-icon">🗺️ 길찾기</span>
            </a>
          </h3>
          <div class="meta">매칭점수 ${r.score}점${r.temple.foundedYear ? ` · 창건 ${r.temple.foundedYear}` : ""}${r.weather ? ` · 🌤️ ${r.weather.condition} ${r.weather.temp}°C` : ""}</div>
          <div class="reason">${r.reason}</div>
          ${r.temple.history ? `
            <div class="temple-detail">
              <div class="temple-detail-label">유래·연혁</div>
              <div class="temple-detail-text">
                ${memberUnlocked ? r.temple.history : (r.temple.history.length > 35 ? r.temple.history.slice(0, 35) + '… <span class="member-lock-tag">🔒 전체보기는 멤버 전용</span>' : r.temple.history)}
              </div>
              ${r.temple.address ? `<div class="temple-detail-address">📍 ${r.temple.address}</div>` : ""}
            </div>
          ` : (r.temple.address ? `<div class="temple-detail-address" style="margin-top:8px;">📍 ${r.temple.address}</div>` : "")}
          <button type="button" class="detail-view-btn" data-temple-index="${i}">상세페이지 보기 →</button>
        </div>
      </div>
    `).join("")}

    ${data.recommendedDates && data.recommendedDates.length ? `
      <div class="calendar-card">
        <div class="calendar-title">📅 좋은 방문 날짜 추천</div>
        <div class="calendar-items">
          ${data.recommendedDates.map(d => `<div class="calendar-item"><span class="cal-date">${d.date}</span>${d.reason ? `<span class="cal-reason">${d.reason}</span>` : ''}</div>`).join('')}
        </div>
      </div>
    ` : ''}

    <button class="share-btn" id="share-btn">📤 결과 공유하기</button>

    <div class="notice-box">
      <div class="notice-item">
        <span class="notice-icon">ℹ️</span>
        <span>${data.disclaimer || "본 결과는 사주 오행 이론을 바탕으로 한 참고 정보입니다."}</span>
      </div>
    </div>
  `;

  const codeInput2 = document.getElementById("member-code-input");
  const codeBtn2   = document.getElementById("member-code-btn");
  if (codeBtn2) {
    codeBtn2.addEventListener("click", () => {
      if (codeInput2 && codeInput2.value.trim() === MEMBER_CODE) {
        tryUnlockMembership(codeInput2.value.trim());
        renderResults(data);
      } else {
        alert("코드가 올바르지 않습니다.");
      }
    });
  }

  document.querySelectorAll(".detail-view-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.templeIndex);
      renderTempleDetailPage(data.results[idx], data, memberUnlocked);
    });
  });

  document.getElementById("share-btn")?.addEventListener("click", () => {
    if (navigator.share) {
      navigator.share({ title: "잼공인연사찰 매칭 결과", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => alert("링크가 복사되었습니다."));
    }
  });

  document.getElementById("demo-detail-btn")?.addEventListener("click", () => {
    const demoResult = {
      score: 94,
      reason: "수(水) 기운이 부족한 사주에 이 사찰의 강한 수 기운이 지혜와 학업 운을 보완해줍니다.",
      temple: { name: "통도사", address: "경상남도 양산시 하북면 통도사로 108", lat: 35.489166, lng: 129.058611, foundedYear: 646, history: "신라 선덕여왕 15년(646) 자장율사가 창건한 한국 3보 사찰" },
      detail: { templeOhaeng: "수", bearing: "북", distanceKm: 12.3 },
      weather: { condition: "맑음", temp: 24 },
    };
    const demoMatchData = { purpose: "학업운", distribution: { 목:1, 화:2, 토:2, 금:2, 수:1 }, targetOhaeng: "수", purposeGuide: [] };
    renderTempleDetailPage(demoResult, demoMatchData, true);
  });

  resultsEl.scrollIntoView({ behavior: "smooth" });
}

function renderCoupleResults(data) {
  const resultsEl = document.getElementById("results");
  resultsEl.classList.remove("hidden");
  const memberUnlocked = isMember();

  resultsEl.innerHTML = `
    <div class="results-summary">
      <div class="label">두 분의 함께 기운은</div>
      <div class="ohaeng-value">💑 커플 인연사찰 매칭</div>
      <div class="ohaeng-breakdown">
        나: ${Object.entries(data.distributionA || {}).map(([k,v]) => `${k} ${v}`).join(" · ")} (${data.targetA || ""})
        &nbsp;|&nbsp;
        상대: ${Object.entries(data.distributionB || {}).map(([k,v]) => `${k} ${v}`).join(" · ")} (${data.targetB || ""})
      </div>
    </div>

    ${memberUnlocked ? `
      <div class="member-banner unlocked">✓ 잼공스토리 멤버십 — 전체 기능이 열려있습니다</div>
    ` : `
      <div class="member-unlock">
        <input type="text" id="member-code-input" placeholder="멤버십 코드 입력 (선택)" />
        <button id="member-code-btn">확인</button>
      </div>
    `}

    ${data.purposeGuide ? `
      <div class="prayer-guide">
        <div class="prayer-guide-label">🙏 함께 이렇게 기도해보세요</div>
        <div class="prayer-guide-text">
          ${Array.isArray(data.purposeGuide) ? `<ol class="prayer-steps">${data.purposeGuide.map(step => `<li>${step}</li>`).join("")}</ol>` : data.purposeGuide}
        </div>
      </div>
    ` : ""}

    ${(data.results || []).map((r, i) => `
      <div class="temple-card" style="--accent: ${OHAENG_COLOR[r.detail?.templeOhaeng] || 'var(--gold)'}; animation-delay: ${0.15 + i * 0.08}s;">
        <div class="temple-rank">${i + 1}</div>
        <div class="temple-body">
          <h3>
            <a class="temple-name-link" href="https://map.naver.com/v5/search/${encodeURIComponent(r.temple.name + (r.temple.address ? ' ' + r.temple.address : ''))}" target="_blank" rel="noopener">
              ${r.temple.name} <span class="map-icon">🗺️ 길찾기</span>
            </a>
          </h3>
          <div class="meta">매칭점수 ${r.score}점${r.temple.foundedYear ? ` · 창건 ${r.temple.foundedYear}` : ""}${r.weather ? ` · 🌤️ ${r.weather.condition} ${r.weather.temp}°C` : ""}</div>
          ${r.synergyCouple > 0 ? `<div class="synergy-badge">💑 커플 시너지 +${r.synergyCouple}점</div>` : ""}
          <div class="reason">${r.reason}</div>
          ${r.temple.history ? `
            <div class="temple-detail">
              <div class="temple-detail-label">유래·연혁</div>
              <div class="temple-detail-text">
                ${memberUnlocked
                  ? r.temple.history
                  : (r.temple.history.length > 35
                      ? `${r.temple.history.slice(0, 35)}… <span class="member-lock-tag">🔒 전체보기는 멤버 전용</span>`
                      : r.temple.history)}
              </div>
              ${r.temple.address ? `<div class="temple-detail-address">📍 ${r.temple.address}</div>` : ""}
            </div>
          ` : (r.temple.address ? `<div class="temple-detail-address" style="margin-top:8px;">📍 ${r.temple.address}</div>` : "")}
          <button type="button" class="detail-view-btn couple-detail-btn" data-temple-index="${i}">상세페이지 보기 →</button>
        </div>
      </div>
    `).join("")}

    ${data.recommendedDates && data.recommendedDates.length ? `
      <div class="calendar-card">
        <div class="calendar-title">함께 방문하면 좋은 날${memberUnlocked ? " (멤버 확장 · 45일 이내)" : ""}</div>
        <div class="calendar-dates">
          ${data.recommendedDates.map(d => `<span class="date-chip">${formatDate(d.date)}</span>`).join("")}
        </div>
        ${!memberUnlocked ? `<div class="calendar-more-hint">🔒 멤버는 더 많은 추천일을 볼 수 있습니다</div>` : ""}
      </div>
    ` : ""}

    <button class="share-btn" id="share-btn">📤 결과 공유하기</button>

    <div class="notice-box">
      <div class="notice-item">
        <span class="notice-icon">ℹ️</span>
        <span>${data.disclaimer || "본 결과는 사주 오행 이론을 바탕으로 한 참고 정보입니다."}</span>
      </div>
    </div>

    <div class="patent-notice-banner">
      <div class="patent-notice-icon">⚖️</div>
      <div class="patent-notice-body">
        <div class="patent-notice-title">지식재산권 안내</div>
        <div class="patent-notice-text">본 서비스의 <strong>인연 시너지 산출 로직</strong>은 비가산 시너지 기반 지수 산출 방식을 적용한 독자 기술입니다.</div>
        <span class="patent-num">특허출원 중</span>
      </div>
    </div>
  `;

  const codeInput = document.getElementById("member-code-input");
  const codeBtn   = document.getElementById("member-code-btn");
  if (codeBtn) {
    codeBtn.addEventListener("click", () => {
      if (codeInput && codeInput.value.trim() === MEMBER_CODE) {
        tryUnlockMembership(codeInput.value.trim());
        renderCoupleResults(data);
      } else {
        alert("코드가 올바르지 않습니다.");
      }
    });
  }

  document.querySelectorAll(".couple-detail-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.templeIndex);
      renderTempleDetailPage(data.results[idx], data, memberUnlocked);
    });
  });

  document.getElementById("share-btn")?.addEventListener("click", () => {
    if (navigator.share) {
      navigator.share({ title: "잼공인연사찰 커플 매칭 결과", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => alert("링크가 복사되었습니다."));
    }
  });

  resultsEl.scrollIntoView({ behavior: "smooth" });
}





// ═══════════════════════════════════════════════════════════════════
// ── 사찰 상세페이지 ── (절대 삭제 금지: 여기서 관리)
// ═══════════════════════════════════════════════════════════════════
function renderTempleDetailPage(result, parentData, memberUnlocked, onBack) {
  const resultsEl = document.getElementById('results');
  resultsEl.classList.remove('hidden');
  const formEl = document.getElementById('match-form');
  if (formEl) formEl.style.display = 'none';

  const t = result.temple || {};
  const d = result.detail || {};
  const score = result.score || 0;

  // 오행 팔레트
  const OHAENG_PAL = {
    '목': { c:'#4ADE80', r:'74,222,128'  },
    '화': { c:'#FB923C', r:'251,146,60'  },
    '토': { c:'#FACC15', r:'250,204,21'  },
    '금': { c:'#F0C060', r:'240,192,96'  },
    '수': { c:'#38BDF8', r:'56,189,248'  }
  };
  const op = OHAENG_PAL[d.templeOhaeng] || OHAENG_PAL['금'];
  const oc = op.c;
  const or_ = op.r;

  // 섹션별 고정 색상 팔레트
  const COL = {
    info:    { c:'#60A5FA', r:'96,165,250'   },  // 기본정보 - 파랑
    loc:     { c:'#F87171', r:'248,113,113'  },  // 위치 - 빨강
    ohaeng:  { c:oc,        r:or_            },  // 오행 - 오행색
    reason:  { c:'#C084FC', r:'192,132,252'  },  // 인연이유 - 보라
    purpose: { c:oc,        r:or_            },  // 기도목적 - 오행색
    guide:   { c:'#34D399', r:'52,211,153'   },  // 기도가이드 - 민트
    gido:    { c:'#FCD34D', r:'252,211,77'   },  // 기도문 - 앰버
    history: { c:'#D97706', r:'217,119,6'    },  // 유래 - 갈색
    date:    { c:'#818CF8', r:'129,140,248'  },  // 날짜 - 인디고
    dist:    { c:oc,        r:or_            }   // 오행분포 - 오행색
  };

  // 섹션 헬퍼 — 색상 파라미터 받음
  function sec(col, titleHtml, bodyHtml) {
    return '<div class="ds-card" style="background:rgba(' + col.r + ',0.06);border:1px solid rgba(' + col.r + ',0.22);border-left:4px solid ' + col.c + ';border-radius:16px;padding:20px 20px 20px 22px;margin-bottom:12px;">'
      + '<div style="font-size:14px;font-weight:800;color:' + col.c + ';margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba(' + col.r + ',0.2);letter-spacing:.05em;">' + titleHtml + '</div>'
      + '<div style="font-size:14px;color:#E2E8F0;line-height:1.9;">' + bodyHtml + '</div>'
      + '</div>';
  }

  const OHAENG_EMOJI = { '목':'🌿','화':'🔥','토':'🌍','금':'✨','수':'💧' };
  const OHAENG_MEANING = { '목':'성장·창의·도전','화':'열정·명예·활력','토':'안정·신뢰·중심','금':'결실·의지·재물','수':'지혜·학업·직관' };
  const OHAENG_DESC = {
    '목':'새로운 일을 시작하거나 창의적인 활동에 힘을 불어넣어 줍니다.',
    '화':'이름을 알리고 사람들 사이에서 빛나게 해주는 기운입니다.',
    '토':'흔들리는 마음을 안정시키고 근본을 다지게 해줍니다.',
    '금':'결실을 맺고 재물과 의지력을 강화시켜 줍니다.',
    '수':'지혜와 직관을 높여주고 학업·시험에 도움이 됩니다.'
  };
  const ohaengEmoji = OHAENG_EMOJI[d.templeOhaeng] || '✦';
  const dist = parentData ? (parentData.distribution || {}) : {};
  const purposeLabel = parentData ? (parentData.purpose || '') : '';
  const purposeGuide = parentData ? (parentData.purposeGuide || []) : [];
  const recDates = parentData ? (parentData.recommendedDates || []) : [];
  const dateCount = memberUnlocked ? recDates.length : Math.min(3, recDates.length);
  const historyFull = t.history || '';
  const historyHtml = memberUnlocked
    ? historyFull
    : (historyFull.length > 120
        ? historyFull.slice(0, 120) + '… <span style="color:rgba(255,255,255,0.35);font-size:12px;">🔒 전체보기는 멤버 전용</span>'
        : historyFull || '정보 없음');
  const mapUrl = 'https://map.naver.com/v5/search/' + encodeURIComponent((t.name || '') + ' ' + (t.address || ''));
  const distText = d.distanceKm != null
    ? (d.distanceKm < 1 ? Math.round(d.distanceKm * 1000) + 'm' : d.distanceKm.toFixed(1) + 'km')
    : '정보 없음';

  // 날씨
  const weatherHtml = result.weather
    ? '<div style="display:inline-flex;align-items:center;gap:7px;background:rgba(56,189,248,0.15);border:1px solid rgba(56,189,248,0.4);border-radius:20px;padding:5px 14px;font-size:13px;color:#7DD3FA;margin-top:10px;">🌤 <b>' + result.weather.condition + '</b>&nbsp;' + result.weather.temp + '°C</div>'
    : '';

  let html = '<div class="temple-detail-page">';
  html += '<style>'
    + '.ds-card{transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease;cursor:default;}'
    + '.ds-card:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(0,0,0,.35);border-color:rgba(255,255,255,0.28) !important;}'
    + '.ds-card:hover .ds-title{letter-spacing:.07em;}'
    + '#detail-back-btn:hover{background:rgba(255,255,255,0.16);}'
    + '.detail-date-card{transition:transform .15s,box-shadow .15s;}'
    + '.detail-date-card:hover{transform:translateY(-4px) scale(1.06);box-shadow:0 8px 24px rgba(0,0,0,.4);}'
    + '</style>';

  // 뒤로가기
  html += '<button id="detail-back-btn" style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.8);border-radius:20px;padding:8px 18px;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:18px;transition:background .15s;">← 목록으로</button>';

  // ── HERO ──
  html += '<div id="detail-hero" style="position:relative;overflow:hidden;background:linear-gradient(160deg,rgba(' + or_ + ',0.18) 0%,rgba(0,0,0,0) 70%);border:1px solid rgba(' + or_ + ',0.35);border-top:3px solid ' + oc + ';border-radius:22px;padding:28px 22px 22px;margin-bottom:16px;text-align:center;">';
  // 이미지 레이어 (JS로 채움)
  html += '<div id="detail-hero-img" style="position:absolute;inset:0;background-size:cover;background-position:center top;border-radius:22px;opacity:0;transition:opacity .6s ease;"></div>';
  // 다크 오버레이 (이미지 위에 텍스트 가독성)
  html += '<div id="detail-hero-overlay" style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,10,25,0.55) 0%,rgba(5,10,25,0.82) 100%);border-radius:22px;opacity:0;transition:opacity .6s ease;"></div>';
  html += '<div style="position:relative;z-index:1;">';
  html += '<div style="font-size:11px;letter-spacing:.2em;color:' + oc + ';text-transform:uppercase;margin-bottom:8px;font-weight:700;opacity:.9;">' + ohaengEmoji + '  ' + (d.templeOhaeng || '') + '(오행) · ' + (OHAENG_MEANING[d.templeOhaeng] || '') + '</div>';
  html += '<div style="font-size:clamp(28px,5vw,40px);font-weight:900;color:#fff;margin-bottom:6px;letter-spacing:-.5px;text-shadow:0 0 30px rgba(' + or_ + ',.4);">' + (t.name || '사찰') + '</div>';
  if (t.foundedYear) html += '<div style="font-size:12px;color:rgba(255,255,255,0.35);margin-bottom:4px;">창건 ' + t.foundedYear + '년</div>';
  html += weatherHtml;
  // 점수바
  html += '<div style="margin-top:18px;">';
  html += '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;"><span style="color:rgba(255,255,255,0.45);">인연 매칭 점수</span><span style="color:' + oc + ';font-weight:800;font-size:15px;">' + score + '점</span></div>';
  html += '<div style="height:10px;background:rgba(0,0,0,0.4);border-radius:5px;overflow:hidden;">';
  html += '<div style="height:100%;width:' + Math.min(score, 100) + '%;background:linear-gradient(90deg,' + oc + ' 0%,#fff 120%);border-radius:5px;box-shadow:0 0 12px rgba(' + or_ + ',.7);"></div>';
  html += '</div></div></div></div>';  // z-index div + score + hero

  // ── 기본정보 ──
  const c_info = COL.info;
  html += '<div class="ds-card" style="background:rgba(' + c_info.r + ',0.06);border:1px solid rgba(' + c_info.r + ',0.22);border-left:4px solid ' + c_info.c + ';border-radius:16px;padding:20px 20px 20px 22px;margin-bottom:12px;">';
  html += '<div style="font-size:14px;font-weight:800;color:' + c_info.c + ';margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid rgba(' + c_info.r + ',0.2);letter-spacing:.05em;">🏯 사찰 기본 정보</div>';
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">';
  // 카드 - 방위
  html += '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;">';
  html += '<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:6px;letter-spacing:.1em;">🧭 방위</div>';
  html += '<div style="font-size:16px;font-weight:800;color:#E2E8F0;">' + (d.bearing || '—') + '</div></div>';
  // 카드 - 거리
  html += '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;">';
  html += '<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:6px;letter-spacing:.1em;">📏 거리</div>';
  html += '<div style="font-size:16px;font-weight:800;color:#E2E8F0;">' + distText + '</div></div>';
  // 카드 - 오행 (highlight)
  html += '<div style="background:rgba(' + or_ + ',0.1);border:1px solid rgba(' + or_ + ',0.35);border-radius:12px;padding:14px;">';
  html += '<div style="font-size:11px;color:rgba(' + or_ + ',.6);margin-bottom:6px;letter-spacing:.1em;">' + ohaengEmoji + ' 오행 기운</div>';
  html += '<div style="font-size:15px;font-weight:800;color:' + oc + ';">' + (d.templeOhaeng || '—') + ' · ' + (OHAENG_MEANING[d.templeOhaeng] || '—') + '</div></div>';
  // 카드 - 점수 (highlight)
  html += '<div style="background:rgba(' + or_ + ',0.1);border:1px solid rgba(' + or_ + ',0.35);border-radius:12px;padding:14px;">';
  html += '<div style="font-size:11px;color:rgba(' + or_ + ',.6);margin-bottom:6px;letter-spacing:.1em;">⭐ 매칭 점수</div>';
  html += '<div style="font-size:16px;font-weight:800;color:' + oc + ';">' + score + '점</div></div>';
  html += '</div></div>';

  // ── 위치 ──
  const c_loc = COL.loc;
  html += '<div class="ds-card" style="background:rgba(' + c_loc.r + ',0.06);border:1px solid rgba(' + c_loc.r + ',0.22);border-left:4px solid ' + c_loc.c + ';border-radius:16px;padding:20px 20px 20px 22px;margin-bottom:12px;">';
  html += '<div style="font-size:14px;font-weight:800;color:' + c_loc.c + ';margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba(' + c_loc.r + ',0.2);">📍 위치 &amp; 방문 안내</div>';
  if (t.address) html += '<div style="font-size:14px;color:#CBD5E1;margin-bottom:14px;line-height:1.7;">' + t.address + '</div>';
  html += '<a href="' + mapUrl + '" target="_blank" rel="noopener" style="display:block;text-align:center;background:rgba(' + c_loc.r + ',0.12);border:1px solid rgba(' + c_loc.r + ',0.35);color:' + c_loc.c + ';border-radius:12px;padding:12px;font-weight:700;font-size:14px;text-decoration:none;">🗺️ 네이버 지도에서 길찾기</a>';
  html += '</div>';

  // ── 오행기운 ──
  if (d.templeOhaeng && OHAENG_DESC[d.templeOhaeng]) {
    html += sec(COL.ohaeng, ohaengEmoji + ' ' + d.templeOhaeng + '(오행) 기운이란?',
      '<p style="margin:0;">' + OHAENG_DESC[d.templeOhaeng] + '</p>');
  }

  // ── 인연이유 ──
  if (result.reason) {
    html += sec(COL.reason, '✨ 나와의 인연 이유',
      '<p style="margin:0;">' + result.reason + '</p>');
  }

  // ── 기도목적 ──
  if (purposeLabel) {
    const c_p = COL.purpose;
    html += '<div class="ds-card" style="background:rgba(' + c_p.r + ',0.06);border:1px solid rgba(' + c_p.r + ',0.22);border-left:4px solid ' + c_p.c + ';border-radius:16px;padding:20px 20px 20px 22px;margin-bottom:12px;">';
    html += '<div style="font-size:14px;font-weight:800;color:' + c_p.c + ';margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba(' + c_p.r + ',0.2);">🎯 기도 목적</div>';
    html += '<span style="display:inline-block;background:rgba(' + c_p.r + ',0.18);border:1.5px solid rgba(' + c_p.r + ',0.5);color:' + c_p.c + ';border-radius:24px;padding:9px 26px;font-weight:800;font-size:16px;">' + purposeLabel + '</span>';
    html += '</div>';
  }

  // ── 기도가이드 ──
  if (Array.isArray(purposeGuide) && purposeGuide.length) {
    const stepsHtml = '<ol style="margin:0;padding-left:20px;">'
      + purposeGuide.map(function(s, i) {
          return '<li style="margin-bottom:10px;padding-left:4px;">'
            + '<span style="color:' + COL.guide.c + ';font-weight:700;">' + (i+1) + '.</span> ' + s + '</li>';
        }).join('')
      + '</ol>';
    html += sec(COL.guide, '🙏 이렇게 기도해보세요', stepsHtml);
  }

  // ── 기도문 ──
  const GIDO = {
    '재물운': function(nm) { return nm + ' 삼보님께 귀의합니다.\n\n자비하신 부처님, 오늘 저는 ' + nm + '의 금(金) 기운이 가득한 이 도량에서 간절히 발원하오니,\n저의 부족한 재물운이 열려 정직하고 성실한 노력에 합당한 결실을 맺게 하여 주시옵소서.\n헛된 탐욕이 아닌, 가족과 이웃이 함께 나눌 수 있는 올바른 재물이 넘쳐흘러\n삶이 안온하게 하여 주시옵소서.\n제가 얻은 것으로 보시하고 덕을 쌓아 더 큰 복으로 돌아오게 하여 주시옵소서.\n\n나무아미타불 관세음보살.'; },
    '건강운': function(nm) { return nm + ' 삼보님께 귀의합니다.\n\n자비하신 약사여래 부처님, 오늘 저는 ' + nm + '의 토(土) 기운이 깃든 이 청정 도량에서 발원하오니,\n몸과 마음의 모든 병이 사라지고 건강한 기운이 충만하게 하여 주시옵소서.\n바른 음식, 바른 생각, 바른 쉼으로 이 몸을 아끼고 사랑하여\n오래도록 가족 곁에 있게 하여 주시옵소서.\n\n나무약사유리광여래.'; },
    '학업운': function(nm) { return nm + ' 삼보님께 귀의합니다.\n\n지혜의 문수보살님, 오늘 저는 ' + nm + '의 수(水) 기운이 흐르는 이 도량에서 간절히 발원하오니,\n배움에 대한 집중력과 기억력이 밝아지고 깊은 지혜가 열리게 하여 주시옵소서.\n목표한 결과를 이루게 하여 주시옵소서.\n\n나무대지문수사리보살.'; },
    '인연운': function(nm) { return nm + ' 삼보님께 귀의합니다.\n\n자비로우신 관세음보살님, 오늘 저는 ' + nm + '의 화(火) 기운이 충만한 이 도량에서 발원하오니,\n저와 진정으로 인연이 맞는 소중한 사람과의 만남이 이루어지게 하여 주시옵소서.\n서로 존중하고 아끼며 함께 성장하고 행복할 수 있는 깊은 인연을 맺게 하여 주시옵소서.\n\n나무대자대비관세음보살.'; },
    '가정운': function(nm) { return nm + ' 삼보님께 귀의합니다.\n\n자비하신 부처님, 오늘 저는 ' + nm + '의 목(木) 기운이 가득한 이 도량에서 온 가족을 위해 발원하오니,\n저희 가정에 화목과 평안이 넘치게 하여 주시옵소서.\n서로 배려하고 사랑하는 마음이 깊어지게 하여 주시옵소서.\n\n나무아미타불.'; },
    '수험합격': function(nm) { return nm + ' 삼보님께 귀의합니다.\n\n문수보살님, 오늘 저는 ' + nm + '의 화(火) 기운이 빛나는 이 도량에서 간절히 발원하오니,\n다가오는 시험에서 저의 능력을 온전히 발휘하여 합격의 기쁨을 얻게 하여 주시옵소서.\n침착하고 자신 있게 문제를 풀어낼 수 있도록 이끌어 주시옵소서.\n\n나무석가모니불.'; },
    '취업운': function(nm) { return nm + ' 삼보님께 귀의합니다.\n\n자비하신 부처님, 오늘 저는 ' + nm + '의 금(金) 기운이 빛나는 이 도량에서 발원하오니,\n저의 능력과 열정을 알아봐 주는 좋은 직장과의 인연이 이루어지게 하여 주시옵소서.\n취업 후에는 성실하게 일하며 성장하는 사람이 되겠습니다.\n\n나무아미타불.'; },
    '출산기도': function(nm) { return nm + ' 삼보님께 귀의합니다.\n\n자비하신 부처님과 칠성님께, 오늘 저는 ' + nm + '의 목(木) 기운이 가득한 이 도량에서 간절히 발원하오니,\n건강하고 복된 새 생명이 저희 품에 안기게 하여 주시옵소서.\n산모와 아기 모두 건강하게 하여 주시옵소서.\n\n나무관세음보살.'; }
  };
  const gidoFn = purposeLabel ? GIDO[purposeLabel] : null;
  if (gidoFn) {
    const gidoText = gidoFn(t.name || '이 사찰');
    const c_g = COL.gido;
    if (memberUnlocked) {
      html += '<div class="ds-card" style="background:rgba(' + c_g.r + ',0.07);border:1px solid rgba(' + c_g.r + ',0.25);border-left:4px solid ' + c_g.c + ';border-radius:16px;padding:20px 20px 20px 22px;margin-bottom:12px;">';
      html += '<div style="font-size:14px;font-weight:800;color:' + c_g.c + ';margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba(' + c_g.r + ',0.2);">🕯️ 맞춤 기도문</div>';
      html += '<div style="font-size:14px;color:#E2E8F0;line-height:2.1;white-space:pre-line;background:rgba(0,0,0,0.2);border-radius:12px;padding:16px;">' + gidoText + '</div>';
      html += '<button id="gido-copy-btn" style="margin-top:14px;display:inline-flex;align-items:center;gap:6px;background:rgba(' + c_g.r + ',0.15);border:1px solid rgba(' + c_g.r + ',0.4);color:' + c_g.c + ';border-radius:14px;padding:9px 20px;font-size:13px;font-weight:700;cursor:pointer;">📋 기도문 복사</button>';
      html += '<textarea id="gido-raw" style="position:absolute;left:-9999px;opacity:0;" readonly>' + gidoText + '</textarea>';
      html += '</div>';
    } else {
      html += '<div class="ds-card" style="background:rgba(' + c_g.r + ',0.07);border:1px solid rgba(' + c_g.r + ',0.25);border-left:4px solid ' + c_g.c + ';border-radius:16px;padding:20px 20px 20px 22px;margin-bottom:12px;">';
      html += '<div style="font-size:14px;font-weight:800;color:' + c_g.c + ';margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba(' + c_g.r + ',0.2);">🕯️ 맞춤 기도문</div>';
      html += '<div style="font-size:14px;color:#94A3B8;line-height:2;background:rgba(0,0,0,0.2);border-radius:12px;padding:16px;filter:blur(2px);pointer-events:none;">' + gidoText.slice(0, 80) + '…</div>';
      html += '<div style="margin-top:14px;text-align:center;font-size:15px;font-weight:800;color:#1A1200;background:#FCD34D;border-radius:10px;padding:12px 16px;letter-spacing:.03em;">🔒 전체 기도문은 멤버십 전용입니다</div>';
      html += '</div>';
    }
  }

  // ── 유래연혁 ──
  if (historyFull) {
    html += sec(COL.history, '📜 유래 · 연혁', '<p style="margin:0;">' + historyHtml + '</p>');
  }

  // ── 추천 날짜 ──
  if (recDates.length > 0) {
    const c_d = COL.date;
    const YOIL = ['일','월','화','수','목','금','토'];
    const datesHtml = recDates.slice(0, dateCount).map(function(d2) {
      const parts = d2.date.split('-');
      const mo = parseInt(parts[1]);
      const dy = parseInt(parts[2]);
      const dow = new Date(parseInt(parts[0]), mo - 1, dy).getDay();
      const yoil = YOIL[dow];
      const isWkend = dow === 0 || dow === 6;
      const fe = d2.dayOhaeng ? (OHAENG_EMOJI[d2.dayOhaeng[0]] || '✶') : '✶';
      const fc = d2.dayOhaeng ? (OHAENG_PAL[d2.dayOhaeng[0]] || OHAENG_PAL['금']) : OHAENG_PAL['금'];
      return '<div class="detail-date-card" style="display:inline-flex;flex-direction:column;align-items:center;gap:5px;'
        + 'background:rgba(' + fc.r + ',0.1);border:1px solid rgba(' + fc.r + ',0.35);'
        + 'border-radius:16px;padding:14px 18px;margin:4px;min-width:74px;">'
        + '<span style="font-size:20px;">' + fe + '</span>'
        + '<span style="font-size:17px;font-weight:900;color:' + fc.c + ';">' + mo + '/' + dy + '</span>'
        + '<span style="font-size:12px;color:' + (isWkend ? '#F87171' : 'rgba(255,255,255,0.6)') + ';font-weight:600;">(' + yoil + ')</span>'
        + (d2.dayOhaeng ? '<span style="font-size:10px;color:' + fc.c + ';font-weight:700;">' + Array.from(d2.dayOhaeng).join('·') + '일</span>' : '')
        + '</div>';
    }).join('');
    html += '<div class="ds-card" style="background:rgba(' + c_d.r + ',0.06);border:1px solid rgba(' + c_d.r + ',0.22);border-left:4px solid ' + c_d.c + ';border-radius:16px;padding:20px 20px 20px 22px;margin-bottom:12px;">';
    html += '<div style="font-size:14px;font-weight:800;color:' + c_d.c + ';margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba(' + c_d.r + ',0.2);">📅 추천 방문 날짜'
      + (!memberUnlocked ? '<span style="font-size:11px;font-weight:400;opacity:.45;margin-left:8px;">상위 3일 · 전체는 멤버 전용</span>' : '') + '</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:2px;">' + datesHtml + '</div>';
    if (!memberUnlocked && recDates.length >= 3) {
      html += '<div style="margin-top:12px;font-size:12px;color:rgba(255,255,255,0.35);text-align:center;">🔒 멤버십 회원은 최대 15일 추천 날짜 제공</div>';
    }
    html += '</div>';
  }

  // ── 오행분포 ──
  if (Object.keys(dist).length > 0) {
    const c_dist = COL.dist;
    const distHtml = Object.entries(dist).map(function([k, v]) {
      const isT = k === d.templeOhaeng;
      const kp = OHAENG_PAL[k] || OHAENG_PAL['금'];
      return '<div style="display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:24px;margin:4px;font-weight:800;font-size:14px;'
        + 'background:rgba(' + kp.r + ',' + (isT ? '0.18' : '0.07') + ');'
        + 'border:1.5px solid rgba(' + kp.r + ',' + (isT ? '0.55' : '0.2') + ');'
        + 'color:' + (isT ? kp.c : 'rgba(255,255,255,0.55)') + ';'
        + (isT ? 'box-shadow:0 0 14px rgba(' + kp.r + ',0.25);' : '') + '">'
        + (OHAENG_EMOJI[k] || '') + ' ' + k + ' ' + v + (isT ? ' ✦' : '')
        + '</div>';
    }).join('');
    html += '<div class="ds-card" style="background:rgba(' + c_dist.r + ',0.06);border:1px solid rgba(' + c_dist.r + ',0.22);border-left:4px solid ' + c_dist.c + ';border-radius:16px;padding:20px 20px 20px 22px;margin-bottom:12px;">';
    html += '<div style="font-size:14px;font-weight:800;color:' + c_dist.c + ';margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba(' + c_dist.r + ',0.2);">🔥 나의 사주 오행 분포</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:2px;margin-bottom:10px;">' + distHtml + '</div>';
    html += '<div style="font-size:12px;color:rgba(255,255,255,0.4);line-height:1.7;margin-top:6px;">✦ 강조된 <b style="color:' + oc + ';">' + (d.templeOhaeng || '') + '</b> 기운이 이 사찰의 에너지 — 나의 부족한 기운을 채워줍니다.</div>';
    html += '</div>';
  }

  // ── 멤버십 배너 ──
  if (!memberUnlocked) {
    html += '<div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.3);border-radius:16px;padding:28px 20px;margin-bottom:12px;text-align:center;">';
    html += '<div style="font-size:30px;margin-bottom:10px;">🔒</div>';
    html += '<div style="font-size:16px;font-weight:800;color:#D4AF37;margin-bottom:8px;">멤버십 전용 콘텐츠</div>';
    html += '<div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:18px;">유래 전문 · 추천 날짜 전체 · 기도문 전체 &amp; 복사</div>';
    html += '<div class="member-unlock"><input type="text" id="detail-member-code-input" placeholder="멤버십 코드 입력" /><button id="detail-member-code-btn">확인</button></div>';
    html += '</div>';
  }

  html += '<div class="patent-notice-banner" style="margin-bottom:12px;">'
    + '<div class="patent-notice-icon">⚖️</div>'
    + '<div class="patent-notice-body">'
    + '<div class="patent-notice-title">지식재산권 안내</div>'
    + '<div class="patent-notice-text">본 서비스의 <strong>인연 시너지 산출 로직</strong>은 비가산 시너지 기반 지수 산출 방식을 적용한 독자 기술입니다.</div>'
    + '<span class="patent-num">특허출원 중</span>'
    + '</div></div>';
  html += '</div>';
  resultsEl.innerHTML = html;

  // ── Wikipedia 사찰 이미지 비동기 로드 ──
  (function loadTempleImage() {
    const templeName = t.name;
    if (!templeName) return;
    const heroImg = document.getElementById('detail-hero-img');
    const heroOverlay = document.getElementById('detail-hero-overlay');
    const heroBg = document.getElementById('detail-hero');
    if (!heroImg || !heroOverlay) return;

    // Wikipedia REST API — CORS 지원
    const wikiUrl = 'https://ko.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(templeName);
    fetch(wikiUrl, { headers: { 'Accept': 'application/json' } })
      .then(function(r) { return r.ok ? r.json() : null; })
      .then(function(data) {
        const src = data && (data.thumbnail ? data.thumbnail.source : null);
        if (src) {
          // 고화질로 교체 (썸네일 너비 800px)
          const hqSrc = src.replace(/\/\d+px-/, '/800px-');
          const img = new Image();
          img.onload = function() {
            heroImg.style.backgroundImage = 'url(' + hqSrc + ')';
            heroImg.style.opacity = '1';
            heroOverlay.style.opacity = '1';
            // 배경 그라데이션 제거
            if (heroBg) heroBg.style.background = 'none';
          };
          img.onerror = function() {
            // 원본 썸네일로 폴백
            heroImg.style.backgroundImage = 'url(' + src + ')';
            heroImg.style.opacity = '1';
            heroOverlay.style.opacity = '1';
            if (heroBg) heroBg.style.background = 'none';
          };
          img.src = hqSrc;
        }
      })
      .catch(function() { /* 이미지 없으면 그라데이션 유지 */ });
  })();

  // 기도문 복사
  const gidoCopyBtn = document.getElementById('gido-copy-btn');
  const gidoRaw = document.getElementById('gido-raw');
  if (gidoCopyBtn && gidoRaw) {
    gidoCopyBtn.addEventListener('click', function() {
      navigator.clipboard.writeText(gidoRaw.value).then(function() {
        gidoCopyBtn.textContent = '✓ 복사됨!';
        setTimeout(function() { gidoCopyBtn.innerHTML = '📋 기도문 복사'; }, 2000);
      }).catch(function() { gidoRaw.select(); document.execCommand('copy'); });
    });
  }

  document.getElementById('detail-back-btn')?.addEventListener('click', () => {
    if (typeof onBack === 'function') {
      onBack();
    } else {
      resultsEl.innerHTML = '';
      resultsEl.classList.add('hidden');
      if (formEl) formEl.style.display = '';
      document.getElementById('app')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  const detailCodeBtn = document.getElementById('detail-member-code-btn');
  const detailCodeInput = document.getElementById('detail-member-code-input');
  if (detailCodeBtn) {
    detailCodeBtn.addEventListener('click', () => {
      if (detailCodeInput && detailCodeInput.value.trim() === MEMBER_CODE) {
        tryUnlockMembership(detailCodeInput.value.trim());
        renderTempleDetailPage(result, parentData, true, onBack);
      } else {
        alert('코드가 올바르지 않습니다.');
      }
    });
  }
}

// ── "핵심" 등 중요 키워드 강조 헬퍼 ──────────────────────────────
const HIGHLIGHT_BADGE = (word) =>
  `<span style="color:#FFB347;font-size:11px;font-weight:800;background:rgba(255,179,71,0.12);border-radius:8px;padding:2px 7px;margin:0 2px;">${word}</span>`;
// ── 앱 진입점 ──
render();
