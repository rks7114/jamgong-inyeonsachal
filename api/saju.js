// api/saju.js — 사주 팔자 + 대운 + 삼재 조회

const { calculateOhaeng, findWeakOhaeng, getEightChar } = require("../src/matching-engine.js");

// 삼재(三災) 계산 — 띠별 삼재 해(年)
// 삼재는 12지지 중 4그룹, 각 그룹마다 3년 삼재
const SAMJAE_MAP = {
  // 인오술(寅午戌)생 → 申酉戌년
  인: ["신", "유", "술"], 오: ["신", "유", "술"], 술: ["신", "유", "술"],
  // 사유축(巳酉丑)생 → 亥子丑년
  사: ["해", "자", "축"], 유: ["해", "자", "축"], 축: ["해", "자", "축"],
  // 신자진(申子辰)생 → 寅卯辰년
  신: ["인", "묘", "진"], 자: ["인", "묘", "진"], 진: ["인", "묘", "진"],
  // 해묘미(亥卯未)생 → 巳午未년
  해: ["사", "오", "미"], 묘: ["사", "오", "미"], 미: ["사", "오", "미"],
};

// 12지지 한국어 → 중국어 변환 및 역방향
const ZHI_KO = ["자","축","인","묘","진","사","오","미","신","유","술","해"];
const ZHI_CN = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const zhiKoToCn = (ko) => ZHI_CN[ZHI_KO.indexOf(ko)] || ko;
const zhiCnToKo = (cn) => ZHI_KO[ZHI_CN.indexOf(cn)] || cn;

// 현재 년도의 지지(地支) 계산
function getCurrentYearZhi(year) {
  const zhiIdx = (year - 4) % 12;
  return ZHI_KO[((zhiIdx % 12) + 12) % 12];
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST 요청만 허용됩니다." });
  }

  try {
    const { birthInput } = req.body;
    if (!birthInput || !birthInput.year || !birthInput.month || !birthInput.day) {
      return res.status(400).json({ error: "생년월일 정보가 필요합니다." });
    }

    const gender = birthInput.gender || "male"; // "male" | "female"
    const genderNum = gender === "male" ? 1 : 0;

    // 오행 분포
    const distribution = calculateOhaeng(birthInput);
    const weak = findWeakOhaeng(distribution);

    // 사주 팔자 + 대운
    let eightChar = null;
    let daYun = null;

    try {
      const bazi = getEightChar(birthInput);

      eightChar = {
        year:    bazi.getYear(),    month:   bazi.getMonth(),
        day:     bazi.getDay(),     time:    bazi.getTime(),
        yearWx:  bazi.getYearWuXing(),  monthWx: bazi.getMonthWuXing(),
        dayWx:   bazi.getDayWuXing(),   timeWx:  bazi.getTimeWuXing(),
      };

      // 대운 계산 (sect 2 = 三命通会 방식)
      try {
        const yun = bazi.getYun(genderNum, 2);
        const isForward = yun.isForward();
        const dayList = yun.getDaYun(); // index 0 = 소운(유년기), index 1~ = 실제 대운

        const currentYear = new Date().getFullYear();
        const approxAge = currentYear - birthInput.year;

        // index 1이 첫 번째 실제 대운
        const firstDy = dayList[1];
        const startAge = firstDy ? firstDy.getStartAge() : null;

        daYun = {
          startAge,
          direction: isForward ? "순행(順行)" : "역행(逆行)",
          list: dayList.slice(1, 9).map(dy => {
            const dyStartAge  = dy.getStartAge();
            const dyEndAge    = dy.getEndAge();
            const dyStartYear = dy.getStartYear();

            // 세운(流年) 먼저 계산
            let liuNian = [];
            try {
              liuNian = dy.getLiuNian().map(ln => ({
                year:      ln.getYear(),
                age:       ln.getAge(),
                ganZhi:    ln.getGanZhi(),
                isCurrent: ln.getYear() === currentYear,
              }));
            } catch(_) {}

            // 현재 대운 = 이 대운의 세운 중에 올해가 포함되는지
            const isCurrent = liuNian.some(ln => ln.isCurrent);

            return {
              startAge: dyStartAge,
              endAge:   dyEndAge,
              startYear: dyStartYear,
              ganZhi:   dy.getGanZhi(),
              isCurrent,
              liuNian,
            };
          }),
        };
      } catch (e) {
        console.error("대운 계산 오류:", e.message);
      }

    } catch (e) {
      console.error("사주 계산 오류:", e.message);
    }

    // 삼재 계산
    let samjae = null;
    try {
      // 출생 년도의 지지(地支) 추출 — 년주 지지 사용
      const yearZhiCn = eightChar?.year ? eightChar.year[1] : null;
      if (yearZhiCn) {
        const yearZhiKo = zhiCnToKo(yearZhiCn);
        const samjaeZhiList = SAMJAE_MAP[yearZhiKo];
        if (samjaeZhiList) {
          const currentYear = new Date().getFullYear();
          const samjaeYears = [];
          // 현재 및 ±12년 범위에서 삼재 해 찾기
          for (let y = currentYear - 2; y <= currentYear + 14; y++) {
            const yZhi = getCurrentYearZhi(y);
            if (samjaeZhiList.includes(yZhi)) {
              samjaeYears.push({ year: y, zhi: zhiKoToCn(yZhi), zhiKo: yZhi });
            }
          }
          // 연속 3년 묶음으로 그룹화
          const groups = [];
          for (let i = 0; i < samjaeYears.length; i += 3) {
            groups.push(samjaeYears.slice(i, i + 3));
          }
          samjae = {
            birthZhi: yearZhiCn,
            birthZhiKo: yearZhiKo,
            samjaeTarget: samjaeZhiList.map(zhiKoToCn).join("·"),
            groups,
          };
        }
      }
    } catch (e) {
      console.error("삼재 계산 오류:", e.message);
    }

    return res.status(200).json({
      success: true,
      distribution,
      weak,
      eightChar,
      daYun,
      samjae,
      notice: "절기(節氣) 기준 만세력 데이터 연동 · 진태양시 보정 포함",
    });

  } catch (err) {
    console.error("사주 API 오류:", err);
    return res.status(500).json({ error: "사주 계산 중 오류가 발생했습니다." });
  }
};
