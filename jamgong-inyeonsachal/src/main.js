
// src/main.js — 잼공인연사찰 MVP 프론트엔드 (vanilla JS)

// 챗봇에 전달할 사주 컨텍스트 (renderSajuPage 호출 시 저장)
let _sajuContext = null;

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

const OHAENG_COLOR = { 목: "#3C6E5E", 화: "#A23B2E", 토: "#B8892B", 금: "#8A8F98", 수: "#2E4A6B" };

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
        <span class="star" style="top:15%; left:12%;"></span>
        <span class="star" style="top:28%; left:78%;"></span>
        <span class="star" style="top:8%; left:55%;"></span>
        <span class="star" style="top:38%; left:35%;"></span>
        <span class="star" style="top:20%; left:88%;"></span>
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
          <svg class="logo-orrery" viewBox="0 0 100 100" width="140" height="140">
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
        <div class="eyebrow-en">Premium Saju Temple Fortune Service</div>
        <h1>나와 인연이 닿는<br/>절을 찾아드립니다</h1>
        <p>생년월일시의 오행 기운을 바탕으로, 지금 이 순간 당신에게 필요한 사찰을 안내합니다.</p>
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
        <label for="location">현재 위치 <span class="help-tip" tabindex="0">?<span class="help-tip-bubble">사찰까지의 방위·거리 계산 기준입니다. 비워두시면 브라우저 위치를 자동 감지하고, 직접 입력하시면 그 주소를 기준으로 계산합니다.</span></span></label>
        <div class="location-input-wrap">
          <input type="text" id="location" placeholder="위치 입력 또는 자동 감지" />
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
      submitBtn.textContent = "사주 · 위치 분석 중...";
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
        if (sajuData.error) { alert(sajuData.error); return; }

        submitBtn.textContent = "인연사찰 · 풀이 생성 중...";

        // 인연사찰 매칭 + AI 풀이 병렬 처리
        let matchData = null, explainData = null;
        // 위치 미감지 시 서울 기본 좌표 사용
        const matchLat = locData.userLat ?? 37.5665;
        const matchLng = locData.userLng ?? 126.9780;
        try {
          const [matchRes, explainRes] = await Promise.all([
            fetch("/api/match", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                birthInput,
                userLat: matchLat,
                userLng: matchLng,
                purpose: "인연운",
              }),
            }),
            fetch("/api/saju-explain", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                eightChar: sajuData.eightChar,
                distribution: sajuData.distribution,
                weak: sajuData.weak,
                daYun: sajuData.daYun,
                samjae: sajuData.samjae,
                birthInput,
              }),
            }),
          ]);
          if (matchRes.ok) matchData = await matchRes.json();
          if (explainRes.ok) explainData = await explainRes.json();
        } catch (e) {
          console.warn("매칭/풀이 병렬 오류:", e);
        }

        renderSajuPage(sajuData, birthInput, matchData, explainData?.explanation || null);
      } catch (err) {
        alert("사주 계산 중 오류가 발생했습니다.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "🔮 사주 팔자 확인";
      }
      return;
    }

    const submitBtn = document.getElementById("submit-btn");
    submitBtn.disabled = true;

    const manualLocation = document.getElementById("location").value.trim();
    let userLat, userLng;

    if (manualLocation) {
      submitBtn.textContent = "위치 확인 중...";
      try {
        const geoRes = await fetch("/api/geocode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: manualLocation }),
        });
        const geoData = await geoRes.json();
        if (geoData.success) {
          userLat = geoData.lat;
          userLng = geoData.lng;
        } else {
          alert(`"${manualLocation}" 주소를 찾지 못했습니다. 위치를 비워두시면 자동으로 감지합니다.`);
          const fallback = await detectUserLocation();
          userLat = fallback.userLat;
          userLng = fallback.userLng;
        }
      } catch (err) {
        const fallback = await detectUserLocation();
        userLat = fallback.userLat;
        userLng = fallback.userLng;
      }
    } else {
      submitBtn.textContent = "위치 확인 중...";
      const detected = await detectUserLocation();
      userLat = detected.userLat;
      userLng = detected.userLng;
      const locationEl = document.getElementById("location");
      if (locationEl && detected.locationLabel) locationEl.placeholder = detected.locationLabel;
    }

    submitBtn.textContent = "인연을 살피는 중...";

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
          body: JSON.stringify({ birthInputA: birthInput, birthInputB, purpose: selectedPurpose, userLat, userLng, memberUnlocked: isMember() }),
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
          body: JSON.stringify({ birthInput, purpose: selectedPurpose, userLat, userLng, memberUnlocked: isMember() }),
        });
        const data = await res.json();
        data.purpose = selectedPurpose;
        renderResults(data);
      }
    } catch (err) {
      alert("매칭 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = matchMode === "couple" ? "함께 인연사찰 찾기" : "인연사찰 찾기";
    }
  });
}

function renderSajuPage(data, birthInput, matchData, explanation) {
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
    ? ` · 출생지 진태양시 보정(경도 ${birthInput.birthLongitude}°)`
    : ' · 출생지 미입력(표준시 기준)';

  // ── 인연사찰 추천 결과 (메인) ──
  const weakOh = data.weak?.부족오행 ?? "";
  const ohColor = {목:'#4CAF50',화:'#FF5722',토:'#FF9800',금:'#9E9E9E',수:'#2196F3'};
  const ohChinese = {목:'木',화:'火',토:'土',금:'金',수:'水'};
  const matchResults = matchData?.results || [];
  const templeHtml = matchResults.length > 0 ? `
    <div class="saju-dist-section" style="border-color:rgba(0,210,255,0.3);">
      <div class="saju-dist-title">🏯 나의 인연사찰 추천
        ${weakOh ? `<span style="font-size:12px;font-weight:400;color:${ohColor[weakOh]||'#00d2ff'};margin-left:8px;">· ${weakOh}(${ohChinese[weakOh]||''}) 기운 보완</span>` : ''}
      </div>
      ${matchResults.slice(0,5).map((r,i)=>{
        const t = r.temple || {};
        const distKm = r.detail?.distanceKm;
        return `
        <div style="display:flex;align-items:center;gap:12px;padding:14px 12px;margin-top:8px;background:rgba(0,210,255,0.04);border:1px solid rgba(0,210,255,0.12);border-radius:12px;">
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

  const explanationHtml = explanation ? `
    <div class="saju-explain-card">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
        <div class="saju-card-title" style="margin-bottom:0;">📖 나의 사주 풀이</div>
        <button id="saju-download-btn" style="background:linear-gradient(135deg,#00d2ff,#7b5ea7);border:none;border-radius:10px;padding:9px 18px;color:#fff;font-weight:700;font-size:13px;cursor:pointer;white-space:nowrap;">
          📥 결과 다운받기
        </button>
      </div>
      <div class="saju-explain-body" id="saju-explain-text">${explanationBodyHtml}</div>
    </div>` : '';

  // 삼재 해당자에게만 경고 카드 표시
  const currentYear2 = new Date().getFullYear();
  const isSamjaeNow = data.samjae?.groups?.some(g => g.some(y => Math.abs(y.year - currentYear2) <= 1));
  const samjaeAlertHtml = isSamjaeNow ? (() => {
    const nowGrp = data.samjae.groups.find(g => g.some(y => Math.abs(y.year - currentYear2) <= 1)) || [];
    const nowY = nowGrp.find(y => Math.abs(y.year - currentYear2) <= 1);
    const step = nowY?.year < currentYear2 ? "들삼재 마무리 단계" : nowY?.year === currentYear2 ? "눌삼재(삼재 중반)" : "날삼재(삼재 마무리)";
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
    <div class="saju-page-wrap">
      ${samjaeAlertHtml}
      ${explanationHtml}
      ${templeHtml}
      ${sajuSummaryHtml}
    </div>`;

  resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });

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

      ${temples.length ? `<div class="section">
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
    const blob = new Blob([htmlContent], { type: 'text/html; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  });

  // 재시도 버튼 (사찰 결과 없을 때)
  document.getElementById("retry-match-btn")?.addEventListener("click", async () => {
    const btn = document.getElementById("retry-match-btn");
    btn.textContent = "탐색 중..."; btn.disabled = true;
    try {
      const { userLat, userLng } = await detectUserLocation();
      const res = await fetch("/api/match", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthInput, userLat, userLng, purpose: "healing" }),
      });
      const md = await res.json();
      if (!md.error) renderSajuPage(data, birthInput, md, explanation);
    } catch(_) { btn.textContent = "🔄 다시 찾기"; btn.disabled = false; }
  });
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
            <a class="temple-name-link" href="https://map.naver.com/v5/search/${encodeURIComponent(r.temple.name + ' ' + r.temple.address)}" target="_blank" rel="noopener">
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

// ── 단독 인연사찰 결과 렌더링 ──────────────────────────────────────
function renderResults(data) {
  const resultsEl = document.getElementById("results");
  resultsEl.classList.remove("hidden");

  const top = data.results[0];
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
            <a class="temple-name-link" href="https://map.naver.com/v5/search/${encodeURIComponent(r.temple.name + ' ' + r.temple.address)}" target="_blank" rel="noopener">
              ${r.temple.name} <span class="map-icon">🗺️ 길찾기</span>
            </a>
          </h3>
          <div class="meta">매칭점수 ${r.score}점${r.temple.foundedYear ? ` · 창건 ${r.temple.foundedYear}` : ""}${r.weather ? ` · 🌤️ ${r.weather.condition} ${r.weather.temp}°C` : ""}</div>
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
          <button type="button" class="detail-view-btn" data-temple-index="${i}">상세페이지 보기 →</button>
        </div>
      </div>
    `).join("")}

    ${data.recommendedDates && data.recommendedDates.length ? `
      <div class="calendar-card">
        <div class="calendar-title">방문하면 좋은 날${memberUnlocked ? " (멤버 확장 · 45일 이내)" : ""}</div>
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

  resultsEl.scrollIntoView({ behavior: "smooth" });
}

// ── 사찰 상세 페이지 ──────────────────────────────────────────────
function renderTempleDetailPage(result, matchData, memberUnlocked) {
  const resultsEl = document.getElementById("results");
  const r = result;
  const deg = BEARING_DEG[r.detail?.bearing] ?? 0;

  resultsEl.innerHTML = `
    <button class="back-btn" id="back-to-results">← 목록으로</button>
    <div class="temple-detail-page">
      <div class="temple-detail-hero" style="--accent:${OHAENG_COLOR[r.detail?.templeOhaeng]||'var(--gold)'}">
        <div class="temple-detail-name">${r.temple.name}</div>
        <div class="temple-detail-score">매칭점수 ${r.score}점</div>
        ${r.temple.address ? `<div class="temple-detail-addr">📍 ${r.temple.address}</div>` : ""}
        ${r.weather ? `<div class="temple-detail-weather">🌤️ ${r.weather.condition} ${r.weather.temp}°C</div>` : ""}
      </div>

      ${buildCompassSVG(deg)}

      <div class="temple-detail-section">
        <div class="temple-detail-section-title">인연 이유</div>
        <div class="temple-detail-section-body">${r.reason}</div>
      </div>

      ${r.temple.history ? `
        <div class="temple-detail-section">
          <div class="temple-detail-section-title">유래·연혁</div>
          <div class="temple-detail-section-body">
            ${memberUnlocked ? r.temple.history : `${r.temple.history.slice(0,80)}… <span class="member-lock-tag">🔒 전체보기는 멤버 전용</span>`}
          </div>
        </div>
      ` : ""}

      <a href="https://map.naver.com/v5/search/${encodeURIComponent(r.temple.name + ' ' + r.temple.address)}"
        target="_blank" rel="noopener" class="map-link-btn">🗺️ 지도에서 보기</a>
    </div>
  `;

  document.getElementById("back-to-results")?.addEventListener("click", () => {
    if (matchData.distributionA) renderCoupleResults(matchData);
    else renderResults(matchData);
  });

  resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── 나침반 SVG ────────────────────────────────────────────────────
function buildCompassSVG(deg) {
  const dirs = [[0,'북'],[45,'동북'],[90,'동'],[135,'동남'],[180,'남'],[225,'남서'],[270,'서'],[315,'북서']];
  const diag = [[22.5,'↗',155,55],[67.5,'↘',165,155],[112.5,'↙',55,165],[157.5,'↖',45,55]];
  const labels = dirs.map(([d,l]) => {
    const r=88, cx=110, cy=110;
    const rad=d*Math.PI/180;
    const x=(cx+r*Math.sin(rad)).toFixed(1);
    const y=(cy-r*Math.cos(rad)).toFixed(1);
    const isActive = d===deg;
    return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle"
      font-family="'Noto Sans KR',sans-serif" font-size="${isActive?'18':'13'}" font-weight="${isActive?'900':'500'}"
      fill="${isActive?'#00D2FF':'rgba(148,163,184,0.6)'}"
      filter="${isActive?'url(#cGlow)':''}">
      ${l}</text>`;
  }).join('');
  const bx=(110+95*Math.sin(deg*Math.PI/180)).toFixed(1);
  const by=(110-95*Math.cos(deg*Math.PI/180)).toFixed(1);
  return `<div style="display:flex;justify-content:center;margin:16px 0;">
  <svg viewBox="0 0 220 220" width="200" height="200" style="display:block;">
    <defs>
      <radialGradient id="cBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#0D1E3A"/><stop offset="100%" stop-color="#040914"/>
      </radialGradient>
      <filter id="cGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <circle cx="110" cy="110" r="108" fill="url(#cBg)" stroke="rgba(0,210,255,0.15)" stroke-width="1"/>
    <circle cx="110" cy="110" r="75" fill="none" stroke="rgba(0,210,255,0.08)" stroke-width="1"/>
    <circle cx="110" cy="110" r="45" fill="none" stroke="rgba(0,210,255,0.05)" stroke-width="1"/>
    ${labels}
    <circle cx="${bx}" cy="${by}" r="8" fill="#00D2FF" filter="url(#cGlow)" opacity="0.9"/>
    <line x1="110" y1="110" x2="${bx}" y2="${by}" stroke="#00D2FF" stroke-width="2" stroke-dasharray="4,3" opacity="0.6"/>
  </svg>
  </div>`;
}

// ── 날짜 포맷 헬퍼 ───────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return `${d.getMonth()+1}/${d.getDate()}(${['일','월','화','수','목','금','토'][d.getDay()]})`;
}

// ── 인연 길잡이 챗봇 위젯 ────────────────────────────────────────
(function initChatbot() {
  let chatMessages = [];
  let isOpen = false;

  // 위젯 HTML 삽입
  const widget = document.createElement('div');
  widget.id = 'chatbot-widget';
  widget.innerHTML = `
    <button id="chatbot-toggle" aria-label="인연 길잡이 열기" title="인연 길잡이 챗봇">
      <span id="chatbot-toggle-icon">💬</span>
    </button>
    <div id="chatbot-panel" style="display:none;">
      <div id="chatbot-header">
        <span>🏯 인연 길잡이</span>
        <button id="chatbot-close" aria-label="닫기">✕</button>
      </div>
      <div id="chatbot-messages"></div>
      <div id="chatbot-input-row">
        <input id="chatbot-input" type="text" placeholder="사주, 사찰, 오행에 대해 물어보세요…" autocomplete="off" />
        <button id="chatbot-send">전송</button>
      </div>
      <div id="chatbot-footer">사주 결과가 있으면 개인화 답변을 드려요 ✨</div>
    </div>
  `;
  document.body.appendChild(widget);

  // 스타일
  const style = document.createElement('style');
  style.textContent = `
    #chatbot-widget { position:fixed; bottom:24px; right:20px; z-index:9999; font-family:'Noto Sans KR',sans-serif; }
    #chatbot-toggle { width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,#00d2ff,#7b5ea7);
      border:none;cursor:pointer;font-size:22px;box-shadow:0 4px 18px rgba(0,210,255,0.4);
      display:flex;align-items:center;justify-content:center;transition:transform .2s; }
    #chatbot-toggle:hover { transform:scale(1.1); }
    #chatbot-panel { position:absolute;bottom:66px;right:0;width:320px;max-height:480px;
      background:#0d1e3a;border:1.5px solid rgba(0,210,255,0.25);border-radius:16px;
      box-shadow:0 8px 32px rgba(0,0,0,0.5);display:flex;flex-direction:column;overflow:hidden; }
    #chatbot-header { background:linear-gradient(135deg,rgba(0,210,255,0.15),rgba(123,94,167,0.15));
      padding:12px 16px;display:flex;justify-content:space-between;align-items:center;
      font-size:14px;font-weight:700;color:#00d2ff;border-bottom:1px solid rgba(0,210,255,0.1); }
    #chatbot-close { background:none;border:none;color:rgba(255,255,255,0.5);cursor:pointer;font-size:16px;padding:0; }
    #chatbot-close:hover { color:#fff; }
    #chatbot-messages { flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;min-height:120px;max-height:300px; }
    .chat-bubble { max-width:85%;padding:10px 14px;border-radius:12px;font-size:13px;line-height:1.55;word-break:break-word; }
    .chat-bubble.user { background:rgba(0,210,255,0.18);color:#e0f7ff;align-self:flex-end;border-bottom-right-radius:3px; }
    .chat-bubble.bot  { background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.9);align-self:flex-start;border-bottom-left-radius:3px; }
    .chat-bubble.typing { color:rgba(255,255,255,0.4);font-style:italic; }
    #chatbot-input-row { display:flex;gap:6px;padding:10px 12px;border-top:1px solid rgba(0,210,255,0.1); }
    #chatbot-input { flex:1;background:rgba(255,255,255,0.07);border:1px solid rgba(0,210,255,0.2);
      border-radius:8px;padding:8px 12px;color:#fff;font-size:13px;outline:none; }
    #chatbot-input:focus { border-color:rgba(0,210,255,0.5); }
    #chatbot-send { background:linear-gradient(135deg,#00d2ff,#7b5ea7);border:none;border-radius:8px;
      color:#fff;font-weight:700;font-size:13px;padding:8px 14px;cursor:pointer;white-space:nowrap; }
    #chatbot-send:hover { opacity:.85; }
    #chatbot-footer { font-size:10px;color:rgba(255,255,255,0.25);text-align:center;padding:6px 0 8px;border-top:1px solid rgba(255,255,255,0.04); }
    @media(max-width:380px){ #chatbot-panel{width:calc(100vw - 24px);right:-4px;} }
  `;
  document.head.appendChild(style);

  const panel  = document.getElementById('chatbot-panel');
  const toggle = document.getElementById('chatbot-toggle');
  const closeBtn = document.getElementById('chatbot-close');
  const input  = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send');
  const msgs   = document.getElementById('chatbot-messages');

  function addBubble(text, role) {
    const div = document.createElement('div');
    div.className = `chat-bubble ${role}`;
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  async function sendMessage(text) {
    if (!text.trim()) return;
    addBubble(text, 'user');
    chatMessages.push({ role:'user', content: text });
    input.value = '';
    sendBtn.disabled = true;

    const typing = addBubble('생각 중…', 'bot typing');
    try {
      const body = { messages: chatMessages };
      if (_sajuContext) body.sajuContext = _sajuContext;

      const res = await fetch('/api/chatbot', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(body),
      });
      const data = await res.json();
      const reply = data.reply || '잠시 후 다시 시도해주세요.';
      typing.textContent = reply;
      typing.classList.remove('typing');
      chatMessages.push({ role:'assistant', content: reply });
    } catch(e) {
      typing.textContent = '연결이 끊어졌어요. 잠시 후 다시 시도해주세요.';
      typing.classList.remove('typing');
    }
    sendBtn.disabled = false;
  }

  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    panel.style.display = isOpen ? 'flex' : 'none';
    if (isOpen && chatMessages.length === 0) {
      addBubble(_sajuContext
        ? '안녕하세요! 인연 길잡이예요 😊 사주 결과를 확인했어요. 오행, 대운, 사찰 추천에 대해 무엇이든 물어보세요!'
        : '안녕하세요! 인연 길잡이예요 😊 사주 팔자, 오행, 사찰에 대해 궁금한 것을 물어보세요!',
        'bot');
    }
    if (isOpen) setTimeout(() => input.focus(), 50);
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    panel.style.display = 'none';
  });

  sendBtn.addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(input.value); });
})();

// ── 앱 시작 ──────────────────────────────────────────────────────
render();
