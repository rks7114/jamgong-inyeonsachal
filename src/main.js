// src/main.js — 잼공인연사찰 MVP 프론트엔드 (vanilla JS)

const PURPOSES = ["재물운", "건강운", "학업운", "인연운", "가정운"];

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
      <div class="hero-moon"></div>
      <div class="hero-content">
        <div class="hero-seal">
          <svg viewBox="0 0 40 40" width="26" height="26">
            <path d="M20 6 C16 10 12 14 12 20 C12 26 16 30 20 34 C24 30 28 26 28 20 C28 14 24 10 20 6 Z
                     M20 12 C22 14 24 17 24 20 C24 23 22 26 20 28 C18 26 16 23 16 20 C16 17 18 14 20 12 Z"
                  fill="none" stroke="#E2BA6C" stroke-width="1.2"/>
          </svg>
        </div>
        <div class="eyebrow">잼공인연사찰</div>
        <h1>나와 인연이 닿는<br/>절을 찾아드립니다</h1>
        <p>생년월일시의 오행 기운을 바탕으로, 지금 이 순간 당신에게 필요한 사찰을 안내합니다.</p>
      </div>
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

    <form class="form-card" id="match-form">
      <div class="corner-bracket tl"></div>
      <div class="corner-bracket br"></div>
      <div class="field">
        <label>생년월일시 <span class="help-tip" tabindex="0">?<span class="help-tip-bubble">사주 오행 계산의 기준이 되는 정보입니다. 시간을 모르셔도 괜찮습니다 — "시간 모름"을 선택하시면 정오 기준으로 계산됩니다.</span></span></label>
        <div class="calendar-toggle">
          <button type="button" class="calendar-toggle-btn active" data-calendar="solar">양력</button>
          <button type="button" class="calendar-toggle-btn" data-calendar="lunar">음력</button>
        </div>
        <div class="birth-select-grid">
          <select id="birth-year" aria-label="연도">
            <option value="">연도</option>
            ${Array.from({length: 106}, (_, i) => 2025 - i).map(y => `<option value="${y}">${y}년</option>`).join("")}
          </select>
          <select id="birth-month" aria-label="월">
            <option value="">월</option>
            ${Array.from({length: 12}, (_, i) => i + 1).map(m => `<option value="${m}">${m}월</option>`).join("")}
          </select>
          <select id="birth-day" aria-label="일">
            <option value="">일</option>
            ${Array.from({length: 31}, (_, i) => i + 1).map(d => `<option value="${d}">${d}일</option>`).join("")}
          </select>
          <select id="birth-hour" aria-label="시">
            <option value="">시간 모름</option>
            ${Array.from({length: 24}, (_, i) => i).map(h => `<option value="${h}">${String(h).padStart(2,"0")}시</option>`).join("")}
          </select>
        </div>
        <label class="leap-month-check hidden" id="leap-month-wrap">
          <input type="checkbox" id="is-leap-month" /> 윤달(閏月) 생일입니다
        </label>
      </div>

      <div class="field">
        <label>기도 목적 <span class="help-tip" tabindex="0">?<span class="help-tip-bubble">지금 가장 채우고 싶은 기운을 골라주세요. 사주상 부족한 오행과 함께 계산에 반영됩니다.</span></span></label>
        <div class="purpose-grid" id="purpose-grid">
          ${PURPOSES.map((p, i) => `
            <div class="purpose-chip${i === 0 ? " active" : ""}" data-purpose="${p}">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${PURPOSE_ICONS[p]}</svg>
              <span>${p}</span>
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

      <button type="submit" class="submit-btn">인연사찰 찾기</button>
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
  document.querySelectorAll(".calendar-toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".calendar-toggle-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedCalendar = btn.dataset.calendar;
      document.getElementById("leap-month-wrap").classList.toggle("hidden", selectedCalendar !== "lunar");
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
      calendarType: selectedCalendar, // "solar" | "lunar"
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: hour !== "" ? parseInt(hour) : 12, // 시간 모름이면 정오로 기본 처리
      minute: 0,
      isLeapMonth,
    };

    const submitBtn = e.target.querySelector(".submit-btn");
    submitBtn.disabled = true;

    // 사용자가 위치를 직접 입력했으면 그 주소를 우선 지오코딩, 비어있으면 자동감지
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
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthInput, purpose: selectedPurpose, userLat, userLng, memberUnlocked: isMember() }),
      });
      const data = await res.json();
      renderResults(data);
    } catch (err) {
      alert("매칭 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "인연사찰 찾기";
    }
  });
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
          <div class="meta">${r.detail.bearing}쪽 · ${r.detail.distanceKm}km · 매칭점수 ${r.score}점${r.temple.foundedYear ? ` · 창건 ${r.temple.foundedYear}` : ""}</div>
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

  resultsEl.scrollIntoView({ behavior: "smooth" });
}

/** 결과 공유 — Web Share API 지원 시 네이티브 공유창(카카오톡 포함), 미지원 시 클립보드 복사 */
async function shareResult(data) {
  const topTemple = data.results[0]?.temple.name || "";
  const shareText = `[잼공인연사찰] 제 부족한 기운은 ${data.targetOhaeng}이고, 인연 닿는 절은 "${topTemple}"이래요. 궁금하면 확인해보세요 🙏`;
  const shareUrl = window.location.origin;

  if (navigator.share) {
    try {
      await navigator.share({ title: "잼공인연사찰 결과", text: shareText, url: shareUrl });
    } catch (e) {
      // 사용자가 공유 취소한 경우 등 — 무시
    }
  } else {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert("결과가 클립보드에 복사되었습니다. 카카오톡 등에 붙여넣기 해주세요.");
    } catch (e) {
      alert("공유하기를 지원하지 않는 환경입니다.");
    }
  }
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
