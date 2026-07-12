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
      <div class="hero-moon"></div>
      <div class="hero-content">
        <div class="hero-seal">卍</div>
        <div class="eyebrow">잼공인연사찰</div>
        <h1>나와 인연이 닿는<br/>절을 찾아드립니다</h1>
        <p>생년월일시의 오행 기운을 바탕으로, 지금 이 순간 당신에게 필요한 사찰을 안내합니다.</p>
      </div>
      <svg class="hero-skyline" viewBox="0 0 400 64" preserveAspectRatio="none">
        <path d="M0 64 L0 40 L30 40 L38 20 L46 40 L70 40 L70 30 L80 30 L80 40 L110 40 L120 15 L130 40
                 L160 40 L168 25 L172 25 L172 40 L200 40 L212 8 L224 40
                 L255 40 L263 25 L267 25 L267 40 L300 40 L310 22 L320 40
                 L350 40 L358 32 L366 32 L366 40 L400 40 L400 64 Z"
              fill="#101B2C" opacity="0.9"/>
      </svg>
    </section>
    <div class="dancheong-divider"></div>

    <form class="form-card" id="match-form">
      <div class="corner-bracket tl"></div>
      <div class="corner-bracket br"></div>
      <div class="field">
        <label for="birth">생년월일시</label>
        <input type="datetime-local" id="birth" required />
      </div>

      <div class="field">
        <label>기도 목적</label>
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
        <label for="location">현재 위치 (예: 서울특별시청)</label>
        <input type="text" id="location" placeholder="위치 입력 또는 자동 감지" />
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

  document.getElementById("match-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const birth = document.getElementById("birth").value;
    if (!birth) return;

    const submitBtn = e.target.querySelector(".submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "위치 확인 중...";

    // 사용자 실제 위치 감지 (Geolocation API) — 거부/미지원 시 서울시청 좌표로 안전하게 폴백
    const { userLat, userLng, locationLabel } = await detectUserLocation();
    const locationEl = document.getElementById("location");
    if (locationEl && locationLabel) locationEl.placeholder = locationLabel;

    submitBtn.textContent = "인연을 살피는 중...";

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthDateTime: birth, purpose: selectedPurpose, userLat, userLng }),
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

  resultsEl.innerHTML = `
    <div class="results-summary">
      <div class="label">회장님께 지금 부족한 기운은</div>
      <div class="ohaeng-value">${data.targetOhaeng}(${{목:"동",화:"남",토:"중앙",금:"서",수:"북"}[data.targetOhaeng]}) 기운</div>
      <div class="ohaeng-breakdown">${Object.entries(data.distribution).map(([k,v]) => `<span>${k} ${v}</span>`).join(" · ")}</div>
    </div>

    <a class="oracle-card" href="https://www.jamgong.com" target="_blank" rel="noopener">
      <div class="oracle-card-text">
        <div class="oracle-card-title">이건 간략화된 버전입니다</div>
        <div class="oracle-card-desc">사주 전체를 정밀하게 풀어보고 싶다면 — 잼공 오라클에서 확인하세요</div>
      </div>
      <div class="oracle-card-arrow">→</div>
    </a>

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
          <h3>${r.temple.name}</h3>
          <div class="meta">${r.detail.bearing}쪽 · ${r.detail.distanceKm}km · 매칭점수 ${r.score}점</div>
          <div class="reason">${r.reason}</div>
        </div>
      </div>
    `).join("")}

    ${data.recommendedDates && data.recommendedDates.length ? `
      <div class="calendar-card">
        <div class="calendar-title">방문하면 좋은 날</div>
        <div class="calendar-dates">
          ${data.recommendedDates.map(d => `<span class="date-chip">${formatDate(d.date)}</span>`).join("")}
        </div>
      </div>
    ` : ""}

    <button class="save-btn" id="save-diary-btn">🙏 내 기록에 저장</button>

    <div class="disclaimer">${data.disclaimer}</div>
  `;

  document.getElementById("save-diary-btn").addEventListener("click", () => {
    saveDiaryEntry(data);
    const btn = document.getElementById("save-diary-btn");
    btn.textContent = "✓ 저장되었습니다";
    btn.disabled = true;
  });

  resultsEl.scrollIntoView({ behavior: "smooth" });
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
