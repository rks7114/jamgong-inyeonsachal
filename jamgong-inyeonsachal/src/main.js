// src/main.js — 잼공인연사찰 MVP 프론트엔드 (vanilla JS)

const PURPOSES = ["재물운", "건강운", "학업운", "인연운", "가정운"];

const PURPOSE_EN = { 재물운: "wealth", 건강운: "health", 학업운: "academic", 인연운: "love", 가정운: "family" };

// 기도목적별 안내 — 실제 불교 전통 방식(소원지, 108배, 발원문 등) 기반. 신비주의적 과장 없이 사실적으로 서술.
const PURPOSE_PRAYER_GUIDE = {
  재물운: "대웅전에서 삼배(三拜)를 올린 뒤, 소원지에 구체적인 목표를 적어 불전함 앞에 놓아보세요. 산신각이 있다면 함께 들러보시는 것도 좋습니다.",
  건강운: "약사전이나 약사여래불이 모셔진 전각이 있다면 그곳에서, 없다면 대웅전에서 108배를 올리며 건강을 발원해보세요.",
  학업운: "문수보살을 모신 전각이 있다면 지혜를 구하는 기도를, 없다면 조용한 곳에 앉아 잠시 마음을 가다듬는 시간을 가져보세요.",
  인연운: "관음전이 있다면 그곳에서, 없다면 대웅전에서 지금까지의 인연에 감사하는 마음으로 절을 올려보세요.",
  가정운: "가족 한 사람 한 사람의 이름을 마음에 새기며 소원지를 적고, 대웅전 앞에서 가족의 평안을 발원해보세요.",
};

// 목적별 아이콘 (선 스타일, 획 일관성 유지) — 재물(동전꾸러미)·건강(약초잎)·학업(붓)·인연(매듭)·가정(집)
const PURPOSE_ICONS = {
  재물운: `<circle cx="8" cy="16" r="5"/><circle cx="16" cy="8" r="5"/><path d="M8 16h.01M16 8h.01"/>`,
  건강운: `<path d="M12 3c-3 3-6 6-6 10a6 6 0 0012 0c0-4-3-7-6-10z"/><path d="M12 8v9"/>`,
  학업운: `<path d="M4 19l6-14 2 0 6 14"/><path d="M7 13h10"/><circle cx="18" cy="6" r="2"/>`,
  인연운: `<path d="M8 8a4 4 0 108 0M8 16a4 4 0 108 0M9 9l6 6M15 9l-6 6"/>`,
  가정운: `<path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/>`,
};

const OHAENG_COLOR = { 목: "#3C6E5E", 화: "#A23B2E", 토: "#B8892B", 금: "#8A8F98", 수: "#2E4A6B" };

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
          <svg viewBox="0 0 40 40" width="30" height="30">
            <path d="M20 8 C15 12 11 17 11 22 C11 28 15 32 20 32 C25 32 29 28 29 22 C29 17 25 12 20 8 Z
                     M20 14 C22.5 17 25 20 25 22 C25 25.5 22.8 28 20 28 C17.2 28 15 25.5 15 22 C15 20 17.5 17 20 14 Z"
                  fill="#E2BA6C"/>
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
    </div>

    <form class="form-card" id="match-form">
      <svg class="corner-cloud tl" viewBox="0 0 40 40"><path d="M4 20 Q4 12 12 12 Q13 6 20 7 Q25 3 30 8 Q36 8 36 15" fill="none" stroke="#B8892B" stroke-width="1.3" stroke-linecap="round"/></svg>
      <svg class="corner-cloud tr" viewBox="0 0 40 40"><path d="M36 20 Q36 12 28 12 Q27 6 20 7 Q15 3 10 8 Q4 8 4 15" fill="none" stroke="#B8892B" stroke-width="1.3" stroke-linecap="round"/></svg>
      <svg class="corner-cloud bl" viewBox="0 0 40 40"><path d="M4 20 Q4 28 12 28 Q13 34 20 33 Q25 37 30 32 Q36 32 36 25" fill="none" stroke="#B8892B" stroke-width="1.3" stroke-linecap="round"/></svg>
      <svg class="corner-cloud br" viewBox="0 0 40 40"><path d="M36 20 Q36 28 28 28 Q27 34 20 33 Q15 37 10 32 Q4 32 4 25" fill="none" stroke="#B8892B" stroke-width="1.3" stroke-linecap="round"/></svg>

      <div class="mode-toggle-wrap">
        <button type="button" class="mode-toggle-btn active" data-mode="solo">🙏 혼자 찾기</button>
        <button type="button" class="mode-toggle-btn" data-mode="couple">💑 둘이 찾기</button>
      </div>

      <div class="field">
        <label id="birth-label-a">생년월일시 <span class="help-tip" tabindex="0">?<span class="help-tip-bubble">사주 오행 계산의 기준이 되는 정보입니다. 시간을 모르셔도 괜찮습니다 — "시간 모름"을 선택하시면 정오 기준으로 계산됩니다.</span></span></label>
        <div class="calendar-toggle">
          <button type="button" class="calendar-toggle-btn active" data-calendar="solar">양력</button>
          <button type="button" class="calendar-toggle-btn" data-calendar="lunar">음력</button>
        </div>
        <div class="birth-select-grid segmented">
          <div class="segment">
            <select id="birth-year" aria-label="연도">
              <option value="">연도</option>
              ${Array.from({length: 106}, (_, i) => 2025 - i).map(y => `<option value="${y}">${y}년</option>`).join("")}
            </select>
          </div>
          <div class="segment">
            <select id="birth-month" aria-label="월">
              <option value="">월</option>
              ${Array.from({length: 12}, (_, i) => i + 1).map(m => `<option value="${m}">${m}월</option>`).join("")}
            </select>
          </div>
          <div class="segment">
            <select id="birth-day" aria-label="일">
              <option value="">일</option>
              ${Array.from({length: 31}, (_, i) => i + 1).map(d => `<option value="${d}">${d}일</option>`).join("")}
            </select>
          </div>
          <div class="segment">
            <select id="birth-hour" aria-label="시">
              <option value="">시간 모름</option>
              ${Array.from({length: 24}, (_, i) => i).map(h => `<option value="${h}">${String(h).padStart(2,"0")}시</option>`).join("")}
            </select>
          </div>
        </div>
        <label class="leap-month-check hidden" id="leap-month-wrap">
          <input type="checkbox" id="is-leap-month" /> 윤달(閏月) 생일입니다
        </label>
      </div>

      <div class="field hidden" id="birth-b-field">
        <label>상대방 생년월일시</label>
        <div class="calendar-toggle">
          <button type="button" class="calendar-toggle-btn active" data-calendar-b="solar">양력</button>
          <button type="button" class="calendar-toggle-btn" data-calendar-b="lunar">음력</button>
        </div>
        <div class="birth-select-grid segmented">
          <div class="segment">
            <select id="birth-year-b" aria-label="상대방 연도">
              <option value="">연도</option>
              ${Array.from({length: 106}, (_, i) => 2025 - i).map(y => `<option value="${y}">${y}년</option>`).join("")}
            </select>
          </div>
          <div class="segment">
            <select id="birth-month-b" aria-label="상대방 월">
              <option value="">월</option>
              ${Array.from({length: 12}, (_, i) => i + 1).map(m => `<option value="${m}">${m}월</option>`).join("")}
            </select>
          </div>
          <div class="segment">
            <select id="birth-day-b" aria-label="상대방 일">
              <option value="">일</option>
              ${Array.from({length: 31}, (_, i) => i + 1).map(d => `<option value="${d}">${d}일</option>`).join("")}
            </select>
          </div>
          <div class="segment">
            <select id="birth-hour-b" aria-label="상대방 시">
              <option value="">시간 모름</option>
              ${Array.from({length: 24}, (_, i) => i).map(h => `<option value="${h}">${String(h).padStart(2,"0")}시</option>`).join("")}
            </select>
          </div>
        </div>
      </div>

      <div class="field">
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

      <div class="field">
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
      // 결과가 이미 표시 중이면 목적 변경 시 자동 재검색
      const resultsEl = document.getElementById("results");
      if (resultsEl && !resultsEl.classList.contains("hidden")) {
        document.getElementById("submit-btn")?.click();
      }
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
      if (matchMode === "couple") {
        birthBField.classList.remove("hidden");
        labelA.textContent = "내 생년월일시";
        submitBtn.textContent = "함께 인연사찰 찾기";
      } else {
        birthBField.classList.add("hidden");
        labelA.innerHTML = `생년월일시 <span class="help-tip" tabindex="0">?<span class="help-tip-bubble">사주 오행 계산의 기준이 되는 정보입니다. 시간을 모르셔도 괜찮습니다 — "시간 모름"을 선택하시면 정오 기준으로 계산됩니다.</span></span>`;
        submitBtn.textContent = "인연사찰 찾기";
      }
    });
  });

  document.getElementById("match-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const year = document.getElementById("birth-year").value;
    const month = document.getElementById("birth-month").value;
    const day = document.getElementById("birth-day").value;
    const hour = document.getElementById("birth-hour").value;
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
      minute: 0,
      isLeapMonth,
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
            <a class="temple-name-link" href="https://www.google.com/maps/search/?api=1&query=${r.temple.lat},${r.temple.lng}" target="_blank" rel="noopener">
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
  `;

  const codeInput = document.getElementById("member-code-input");
  const codeBtn = document.getElementById("member-code-btn");
  if (codeBtn) {
    codeBtn.addEventListener("click", () => {
      if (tryUnlockMembership(codeInput.value)) {
        renderCoupleResults(data);
      } else {
        alert("코드가 올바르지 않습니다. 잼공스토리 채널 멤버십 공지를 확인해주세요.");
      }
    });
  }

  document.getElementById("share-btn").addEventListener("click", () => shareResult(data));

  document.querySelectorAll(".couple-detail-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.templeIndex);
      renderTempleDetailPage(data.results[idx], data, memberUnlocked);
    });
  });

  resultsEl.scrollIntoView({ behavior: "smooth" });
}

function renderResults(data) {
  const resultsEl = document.getElementById("results");
  resultsEl.classList.remove("hidden");

  const top = data.results[0];
  const deg = BEARING_DEG[top?.detail?.bearing] ?? 0;
  const memberUnlocked = isMember();

  resultsEl.innerHTML = `
    <div class="results-summary">
      <div class="label">지금 부족한 기운은</div>
      <div class="ohaeng-value">${data.targetOhaeng}(${{목:"동",화:"남",토:"중앙",금:"서",수:"북"}[data.targetOhaeng]}) 기운</div>
      <div class="ohaeng-breakdown">${Object.entries(data.distribution).map(([k,v]) => `<span>${k} ${v}</span>`).join(" · ")}</div>
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
        <div class="prayer-guide-label">🙏 이렇게 기도해보세요</div>
        <div class="prayer-guide-text">
          ${Array.isArray(data.purposeGuide) ? `<ol class="prayer-steps">${data.purposeGuide.map(step => `<li>${step}</li>`).join("")}</ol>` : data.purposeGuide}
        </div>
      </div>
    ` : ""}

    <div class="oracle-card oracle-card-soon">
      <div class="oracle-card-text">
        <div class="oracle-card-title">이건 간략화된 버전입니다</div>
        <div class="oracle-card-desc">사주 전체를 정밀하게 풀어보는 잼공 오라클, 곧 만나보실 수 있습니다</div>
      </div>
      <div class="oracle-card-badge">준비중</div>
    </div>

    <div class="compass-wrap">
      <div class="compass">
        <div class="dir-label" style="top:8px; left:50%;">북</div>
        <div class="dir-label" style="top:50%; right:8px;">동</div>
        <div class="dir-label" style="bottom:8px; left:50%;">남</div>
        <div class="dir-label" style="top:50%; left:8px;">서</div>
        ${[0,45,90,135,180,225,270,315].map(d => {
          const rad = (d - 90) * Math.PI / 180;
          const r = 82;
          const x = 90 + r * Math.cos(rad);
          const y = 90 + r * Math.sin(rad);
          return `<div class="tick" style="transform: translate(${x - 90}px, ${y - 90}px);"></div>`;
        }).join("")}
        <div class="needle" style="transform: translate(-50%, -100%) rotate(${deg}deg);"></div>
        <div class="center-dot"></div>
      </div>
    </div>

    ${data.results.map((r, i) => `
      <div class="temple-card" style="--accent: ${OHAENG_COLOR[r.detail.templeOhaeng] || 'var(--gold)'}; animation-delay: ${0.15 + i * 0.08}s;">
        <div class="temple-rank">${i + 1}</div>
        <div class="temple-body">
          <h3>
            <a class="temple-name-link" href="https://www.google.com/maps/search/?api=1&query=${r.temple.lat},${r.temple.lng}" target="_blank" rel="noopener">
              ${r.temple.name} <span class="map-icon">🗺️ 길찾기</span>
            </a>
          </h3>
          <div class="meta">${r.detail.bearing}쪽 · ${r.detail.distanceKm}km · 매칭점수 ${r.score}점${r.temple.foundedYear ? ` · 창건 ${r.temple.foundedYear}` : ""}${r.weather ? ` · 🌤️ 현지 날씨 ${r.weather.condition} ${r.weather.temp}°C` : ""}</div>
          ${r.detail.synergyBonus > 2.5 ? `
            <div class="synergy-badge">
              ⚡ 인연 시너지 감지 (+${r.detail.synergyBonus}점)
              ${memberUnlocked
                ? ` — 방위점수 ${r.detail.bangwiScore} · 목적점수 ${r.detail.purposeScore} · 거리점수 ${Math.round(r.detail.distanceScore*10)/10}`
                : ` <span class="member-lock-tag">🔒 상세분석은 멤버 전용</span>`}
              <div class="patent-note">특허출원기술(10-2026-0093797 계열) 적용 · 비가산 시너지 알고리즘</div>
            </div>
          ` : ""}
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

    <button class="save-btn" id="save-diary-btn">🙏 내 기록에 저장</button>
    <button class="share-btn" id="share-btn">📤 결과 공유하기</button>
    <button class="diary-link-btn" id="view-diary-btn">📖 내 기록 보기</button>

    <div class="notice-box">
      <div class="notice-item">
        <span class="notice-icon">ℹ️</span>
        <span>${data.disclaimer}</span>
      </div>
      <div class="notice-item notice-patent">
        <span class="notice-icon">⚖️</span>
        <span>본 서비스의 인연 시너지 산출 로직은 특허출원기술(비가산 시너지 기반 지수 산출 방식)과 동일한 수학적 구조를 적용했습니다. <span class="patent-status-tag">특허출원 중</span></span>
      </div>
    </div>
  `;

  const codeInput = document.getElementById("member-code-input");
  const codeBtn = document.getElementById("member-code-btn");
  if (codeBtn) {
    codeBtn.addEventListener("click", () => {
      if (tryUnlockMembership(codeInput.value)) {
        renderResults(data); // 잠금 해제 성공 시 같은 결과를 멤버 버전으로 재렌더링
      } else {
        alert("코드가 올바르지 않습니다. 잼공스토리 채널 멤버십 공지를 확인해주세요.");
      }
    });
  }

  document.getElementById("save-diary-btn").addEventListener("click", () => {
    saveDiaryEntry(data);
    const btn = document.getElementById("save-diary-btn");
    btn.textContent = "✓ 저장되었습니다";
    btn.disabled = true;
  });

  document.getElementById("share-btn").addEventListener("click", () => shareResult(data));
  document.getElementById("view-diary-btn").addEventListener("click", () => renderDiaryView());

  document.querySelectorAll(".detail-view-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.templeIndex);
      renderTempleDetailPage(data.results[idx], data, memberUnlocked);
    });
  });

  resultsEl.scrollIntoView({ behavior: "smooth" });
}

/** 공유 모달 표시 */
function showShareModal(text, url) {
  const existing = document.getElementById("share-modal-overlay");
  if (existing) existing.remove();

  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  const fullText = `${text}\n${url}`;

  const overlay = document.createElement("div");
  overlay.id = "share-modal-overlay";
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;";
  overlay.innerHTML = `
    <div style="background:#fff;border-radius:16px;padding:24px;width:min(340px,90vw);box-shadow:0 8px 32px rgba(0,0,0,0.2);">
      <div style="font-size:17px;font-weight:700;margin-bottom:16px;color:#222;">공유하기</div>
      <div style="background:#f5f5f5;border-radius:10px;padding:12px;font-size:13px;color:#222;margin-bottom:16px;word-break:break-all;">${text}<br/><span style="color:#555;">${url}</span></div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <button id="share-copy-btn" style="padding:12px;border:none;border-radius:10px;background:#B8892B;color:#fff;font-size:15px;font-weight:600;cursor:pointer;">📋 링크 복사</button>
        ${isMobile ? `<button id="share-native-btn" style="padding:12px;border:none;border-radius:10px;background:#3C1E1E;color:#fff;font-size:15px;font-weight:600;cursor:pointer;">📤 카카오톡·기타 앱으로 공유</button>` : ""}
        <button id="share-close-btn" style="padding:10px;border:1px solid #ddd;border-radius:10px;background:#fff;color:#666;font-size:14px;cursor:pointer;">닫기</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("share-copy-btn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      document.getElementById("share-copy-btn").textContent = "✅ 복사 완료!";
      setTimeout(() => overlay.remove(), 1200);
    } catch {
      prompt("아래 텍스트를 복사하세요 (Ctrl+C):", fullText);
    }
  });

  if (isMobile) {
    document.getElementById("share-native-btn")?.addEventListener("click", async () => {
      try {
        await navigator.share({ text: fullText });
      } catch {}
      overlay.remove();
    });
  }

  document.getElementById("share-close-btn").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
}

/** 결과 공유 */
function shareResult(data) {
  const topTemple = data.results[0]?.temple.name || "";
  const shareText = `[잼공인연사찰] 제 부족한 기운은 ${data.targetOhaeng}이고, 인연 닿는 절은 "${topTemple}"이래요. 궁금하면 확인해보세요 🙏`;
  showShareModal(shareText, window.location.origin);
}

/** 특정 사찰 상세페이지 단독 공유 */
function shareTemple(temple) {
  const shareText = `[잼공인연사찰] "${temple.name}" — 나와 인연이 닿는 절이래요. 🙏`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${temple.lat},${temple.lng}`;
  showShareModal(shareText, mapUrl);
}

/** 사찰 상세페이지 — 지도 미리보기, 전체 정보를 한 화면에 모아 보여줌 */
function renderTempleDetailPage(result, matchData, memberUnlocked) {
  const resultsEl = document.getElementById("results");
  const { temple, detail, score, reason } = result;

  resultsEl.innerHTML = `
    <div class="temple-detail-page">
      <button type="button" class="back-btn" id="detail-back-btn">← 결과로 돌아가기</button>

      <h2 class="detail-page-title">${temple.name}</h2>
      <div class="detail-page-meta">
        ${temple.foundedYear ? `창건 ${temple.foundedYear} · ` : ""}${detail.bearing}쪽 · ${detail.distanceKm}km · 매칭점수 ${score}점
      </div>

      <div class="detail-map-embed">
        <iframe
          src="https://www.google.com/maps?q=${temple.lat},${temple.lng}&output=embed"
          width="100%" height="220" style="border:0;" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </div>

      <a class="temple-name-link detail-page-directions" href="https://www.google.com/maps/search/?api=1&query=${temple.lat},${temple.lng}" target="_blank" rel="noopener">
        🗺️ 길찾기로 바로가기
      </a>

      <div class="info-group group-gold">
        <div class="info-group-title">🙏 인연 이야기</div>

        <div class="info-row">
          <div class="info-row-icon">💫</div>
          <div class="info-row-body">
            <div class="info-row-label">인연 근거</div>
            <div class="info-row-text">${reason}</div>
          </div>
        </div>

        ${temple.history ? `
          <div class="info-row">
            <div class="info-row-icon">📜</div>
            <div class="info-row-body">
              <div class="info-row-label">유래·연혁</div>
              <div class="info-row-text">
                ${memberUnlocked ? temple.history : `${temple.history.slice(0, 60)}… <span class="member-lock-tag">🔒 전체보기는 멤버 전용</span>`}
              </div>
            </div>
          </div>
        ` : ""}

        <div class="info-row">
          <div class="info-row-icon">⚡</div>
          <div class="info-row-body">
            <div class="info-row-label">인연 시너지 분석</div>
            <div class="info-row-text">
              ${memberUnlocked
                ? `방위 ${detail.bangwiScore} · 목적 ${detail.purposeScore} · 거리 ${Math.round(detail.distanceScore*10)/10} · 신뢰도 ${detail.trustScore}점${detail.synergyBonus > 0 ? ` · 시너지 +${detail.synergyBonus}` : ""}`
                : `종합 매칭점수 ${score}점 <span class="member-lock-tag">🔒 세부분석은 멤버 전용</span>`}
            </div>
          </div>
        </div>

        ${matchData.purposeGuide ? `
          <div class="info-row">
            <div class="info-row-icon">🕯️</div>
            <div class="info-row-body">
              <div class="info-row-label">이 사찰에서 이렇게 해보세요</div>
              <div class="info-row-text">
                ${Array.isArray(matchData.purposeGuide) ? `<ol class="prayer-steps">${matchData.purposeGuide.map(step => `<li>${step}</li>`).join("")}</ol>` : matchData.purposeGuide}
              </div>
            </div>
          </div>
        ` : ""}
      </div>

      <div class="info-group group-jade">
        <div class="info-group-title">🧭 방문 정보</div>

        ${temple.address ? `
          <div class="info-row">
            <div class="info-row-icon">📍</div>
            <div class="info-row-body">
              <div class="info-row-label">주소</div>
              <div class="info-row-text">${temple.address}</div>
            </div>
          </div>
        ` : ""}

        <div class="info-row">
          <div class="info-row-icon">🌤️</div>
          <div class="info-row-body">
            <div class="info-row-label">현지 날씨</div>
            <div class="info-row-text" id="detail-weather-text">날씨 확인 중...</div>
          </div>
        </div>

        <div class="info-row">
          <div class="info-row-icon">🚗</div>
          <div class="info-row-body">
            <div class="info-row-label">예상 이동시간</div>
            <div class="info-row-text">자동차 약 ${estimateDriveMinutes(detail.distanceKm)}분 · 도보 약 ${estimateWalkMinutes(detail.distanceKm)}분 (직선거리 추정치)</div>
          </div>
        </div>

        ${matchData.recommendedDates && matchData.recommendedDates.length ? `
          <div class="info-row">
            <div class="info-row-icon">📅</div>
            <div class="info-row-body">
              <div class="info-row-label">방문하면 좋은 날</div>
              <div class="calendar-dates" style="margin-top:6px;">
                ${matchData.recommendedDates.map(d => `<span class="date-chip">${formatDate(d.date)}</span>`).join("")}
              </div>
            </div>
          </div>
        ` : ""}
      </div>

      <button type="button" class="share-btn" id="detail-share-btn">📤 이 사찰 공유하기</button>

      ${matchData.results.length > 1 ? `
        <div class="detail-other-temples">
          <div class="detail-section-label">다른 매칭 사찰</div>
          <div class="detail-other-list">
            ${matchData.results.map((r, i) => `
              <button type="button" class="detail-other-item${r.temple.name === temple.name ? " current" : ""}" data-switch-index="${i}">
                ${i + 1}위 ${r.temple.name}
              </button>
            `).join("")}
          </div>
        </div>
      ` : ""}

      <button type="button" class="save-btn" id="detail-back-btn-2">← 결과로 돌아가기</button>
    </div>
  `;

  const goBack = () => renderResults(matchData);
  document.getElementById("detail-back-btn").addEventListener("click", goBack);
  document.getElementById("detail-back-btn-2").addEventListener("click", goBack);
  document.getElementById("detail-share-btn").addEventListener("click", () => shareTemple(temple));

  document.querySelectorAll(".detail-other-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.switchIndex);
      renderTempleDetailPage(matchData.results[idx], matchData, memberUnlocked);
    });
  });

  // 순위와 상관없이 이 사찰의 날씨를 온디맨드로 조회
  fetch(`/api/weather?lat=${temple.lat}&lng=${temple.lng}`)
    .then((r) => r.json())
    .then((w) => {
      const el = document.getElementById("detail-weather-text");
      if (!el) return;
      el.textContent = w.success ? `🌤️ ${w.condition}, ${w.temp}°C` : "날씨 정보를 불러오지 못했습니다.";
    })
    .catch(() => {
      const el = document.getElementById("detail-weather-text");
      if (el) el.textContent = "날씨 정보를 불러오지 못했습니다.";
    });

  resultsEl.scrollIntoView({ behavior: "smooth" });
}

/** 내 기록 보기 — localStorage에 저장된 다이어리 목록을 결과 영역에 표시 */
function renderDiaryView() {
  const resultsEl = document.getElementById("results");
  let entries = [];
  try {
    entries = JSON.parse(localStorage.getItem("jamgong-inyeonsachal-diary") || "[]");
  } catch (e) {}

  resultsEl.innerHTML = `
    <div class="diary-view">
      <div class="diary-view-title">내 인연사찰 기록</div>
      ${entries.length === 0
        ? `<div class="diary-empty">아직 저장된 기록이 없습니다.</div>`
        : entries.map(en => `
          <div class="diary-entry">
            <div class="diary-entry-date">${new Date(en.savedAt).toLocaleDateString("ko-KR")}</div>
            <div class="diary-entry-ohaeng">${en.targetOhaeng} 기운 보완</div>
            <div class="diary-entry-temples">${en.temples.join(" · ")}</div>
          </div>
        `).join("")
      }
      <button class="save-btn" id="back-to-form-btn">← 새로 찾아보기</button>
    </div>
  `;
  document.getElementById("back-to-form-btn").addEventListener("click", () => {
    resultsEl.classList.add("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/** 직선거리 기준 자동차/도보 이동시간 대략 추정 (실제 도로 경로 아님 — 참고용) */
function estimateDriveMinutes(distanceKm) {
  const avgSpeedKmh = 30; // 시내 평균 주행속도 가정
  return Math.max(1, Math.round((distanceKm / avgSpeedKmh) * 60));
}

function estimateWalkMinutes(distanceKm) {
  const avgWalkKmh = 4.5;
  return Math.max(1, Math.round((distanceKm / avgWalkKmh) * 60));
}

function formatDate(dateStr) {
  const [, m, d] = dateStr.split("-");
  return `${parseInt(m)}월 ${parseInt(d)}일`;
}

/** 매칭 결과를 브라우저 localStorage에 다이어리로 저장 (로그인 없는 MVP 버전) */
function saveDiaryEntry(data) {
  try {
    const key = "jamgong-inyeonsachal-diary";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.unshift({
      savedAt: new Date().toISOString(),
      targetOhaeng: data.targetOhaeng,
      temples: data.results.map((r) => r.temple.name),
    });
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 50))); // 최근 50건만 보관
  } catch (e) {
    console.error("다이어리 저장 실패:", e);
  }
}

render();
