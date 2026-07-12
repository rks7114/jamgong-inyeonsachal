// src/main.js — 잼공인연사찰 MVP 프론트엔드 (vanilla JS)

const PURPOSES = ["재물운", "건강운", "학업운", "인연운", "가정운"];

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
      <div class="eyebrow">잼공인연사찰</div>
      <h1>나와 인연이 닿는<br/>절을 찾아드립니다</h1>
      <p>생년월일시의 오행 기운을 바탕으로, 지금 이 순간 당신에게 필요한 사찰을 안내합니다.</p>
    </section>

    <form class="form-card" id="match-form">
      <div class="field">
        <label for="birth">생년월일시</label>
        <input type="datetime-local" id="birth" required />
      </div>

      <div class="field">
        <label>기도 목적</label>
        <div class="purpose-grid" id="purpose-grid">
          ${PURPOSES.map((p, i) => `<div class="purpose-chip${i === 0 ? " active" : ""}" data-purpose="${p}">${p}</div>`).join("")}
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
    </div>

    <div class="compass-wrap">
      <div class="compass">
        <div class="dir-label" style="top:8px; left:50%;">북</div>
        <div class="dir-label" style="top:50%; right:8px;">동</div>
        <div class="dir-label" style="bottom:8px; left:50%;">남</div>
        <div class="dir-label" style="top:50%; left:8px;">서</div>
        <div class="needle" style="transform: translate(-50%, -100%) rotate(${deg}deg);"></div>
        <div class="center-dot"></div>
      </div>
    </div>

    ${data.results.map((r, i) => `
      <div class="temple-card">
        <div class="temple-rank">${i + 1}</div>
        <div class="temple-body">
          <h3>${r.temple.name}</h3>
          <div class="meta">${r.detail.bearing}쪽 · ${r.detail.distanceKm}km · 매칭점수 ${r.score}점</div>
          <div class="reason">${r.reason}</div>
        </div>
      </div>
    `).join("")}

    <div class="disclaimer">${data.disclaimer}</div>
  `;

  resultsEl.scrollIntoView({ behavior: "smooth" });
}

render();
