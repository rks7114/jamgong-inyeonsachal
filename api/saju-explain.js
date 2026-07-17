// api/saju-explain.js — 사주 풀이 (AI 우선, 템플릿 fallback)

const GAN_DESC = {
  甲:"갑목(甲木) — 곧게 뻗은 나무처럼 강직하고 진취적인 기상을 지닙니다. 리더십이 강하고 새로운 일을 시작하는 데 탁월하지만, 고집이 세고 타협이 어려울 수 있습니다.",
  乙:"을목(乙木) — 유연한 풀과 덩굴처럼 환경에 잘 적응합니다. 섬세하고 인내심이 강하며 예술적 감수성이 뛰어나지만, 때로 우유부단해 보이기도 합니다.",
  丙:"병화(丙火) — 태양처럼 밝고 따뜻한 기운입니다. 외향적이고 활동적이며 주변을 밝게 하는 능력이 있지만, 감정 기복이 있을 수 있습니다.",
  丁:"정화(丁火) — 등불처럼 은은하고 세심한 빛입니다. 총명하고 집중력이 강하며 예리한 직관을 가지지만, 내면의 불안을 감추는 경향이 있습니다.",
  戊:"무토(戊土) — 높은 산처럼 묵직하고 안정적입니다. 신뢰감이 있고 포용력이 넓으며 어떤 상황에서도 흔들리지 않지만, 변화를 받아들이는 데 느릴 수 있습니다.",
  己:"기토(己土) — 옥토처럼 만물을 품는 기운입니다. 실용적이고 성실하며 다른 사람을 잘 돌보지만, 지나친 걱정으로 에너지를 소모하기 쉽습니다.",
  庚:"경금(庚金) — 단단한 쇠처럼 의지가 강하고 결단력이 있습니다. 정의감이 강하고 목표 지향적이지만, 융통성이 부족하게 보일 때가 있습니다.",
  辛:"신금(辛金) — 보석처럼 빛나고 섬세합니다. 완벽을 추구하고 미적 감각이 뛰어나며 예민한 감수성을 지니지만, 상처를 받으면 오래 기억하는 편입니다.",
  壬:"임수(壬水) — 큰 강처럼 깊고 넓게 흐릅니다. 지적 호기심이 강하고 창의적이며 포용력이 크지만, 한 곳에 오래 머물지 못하는 경향이 있습니다.",
  癸:"계수(癸水) — 빗물처럼 은밀하고 깊이 스며듭니다. 직관력과 통찰력이 뛰어나고 감수성이 풍부하지만, 감정을 내면에 담아두는 경향이 강합니다.",
};

const JI_DESC = {
  子:"자수(子水) — 지혜롭고 총명하며 비밀을 잘 지킵니다. 겨울밤의 물처럼 깊은 내면세계를 가집니다.",
  丑:"축토(丑土) — 인내심이 강하고 묵묵히 노력합니다. 느리지만 확실하게 결실을 맺는 기운입니다.",
  寅:"인목(寅木) — 호랑이처럼 용감하고 추진력이 있습니다. 도전을 즐기고 리더 기질이 강합니다.",
  卯:"묘목(卯木) — 봄의 새싹처럼 생명력이 넘칩니다. 온화하고 친절하며 예술적 재능을 타고납니다.",
  辰:"진토(辰土) — 용처럼 신비롭고 카리스마가 있습니다. 능력이 다양하고 변화를 주도하는 기운입니다.",
  巳:"사화(巳火) — 뱀처럼 지혜롭고 예리합니다. 직관이 뛰어나고 깊이 생각하는 성향을 가집니다.",
  午:"오화(午火) — 정오의 태양처럼 강렬하고 열정적입니다. 활동적이고 개방적이며 표현력이 뛰어납니다.",
  未:"미토(未土) — 여름의 대지처럼 따뜻하고 포용적입니다. 예술적 감성과 인정 많은 성품을 가집니다.",
  申:"신금(申金) — 민첩하고 두뇌회전이 빠릅니다. 행동력이 있고 순발력이 뛰어나지만 변덕스러울 수 있습니다.",
  酉:"유금(酉金) — 서쪽의 가을 기운처럼 정밀하고 완벽합니다. 미적 감각과 세심한 눈썰미를 가집니다.",
  戌:"술토(戌土) — 충성스럽고 의리가 강합니다. 한번 믿으면 끝까지 지키는 신뢰의 기운입니다.",
  亥:"해수(亥水) — 겨울의 깊은 물처럼 지혜와 은밀함을 지닙니다. 자유를 사랑하고 이상이 높습니다.",
};

const OH_DESC = {
  목: { name:"木(목)", strong:"창의적이고 성장 지향적이며 새로운 시작을 잘 이끕니다.", weak:"목 기운이 부족하면 추진력과 결단력이 흔들릴 수 있습니다. 시작보다 마무리에 더 신경 쓰세요.", temple:"산속 깊은 숲 기운의 사찰, 봄철 방문이 특히 좋습니다." },
  화: { name:"火(화)", strong:"열정적이고 표현력이 풍부하며 카리스마가 있습니다.", weak:"화 기운이 부족하면 열정이 식거나 사람들과의 교류에서 에너지가 부족해집니다. 밝은 환경과 적극적인 소통이 보완책입니다.", temple:"남향의 따뜻한 햇빛이 드는 사찰, 붉은 단청이 선명한 사찰이 기운을 보완합니다." },
  토: { name:"土(토)", strong:"안정적이고 포용력이 크며 신뢰감을 줍니다.", weak:"토 기운이 부족하면 중심이 흔들리거나 결정을 자꾸 미루게 됩니다. 규칙적인 생활과 루틴이 중심을 잡아줍니다.", temple:"황토 흙의 기운이 있는 고찰, 암벽 옆 사찰이나 넓은 마당이 있는 사찰이 좋습니다." },
  금: { name:"金(금)", strong:"의지가 강하고 결단력이 있으며 정확합니다.", weak:"금 기운이 부족하면 추진력과 판단력이 약해질 수 있습니다. 원칙을 세우고 지키는 훈련이 도움됩니다.", temple:"바위산의 강인한 기운을 가진 사찰, 종소리가 청명한 금속 기운의 사찰이 도움이 됩니다." },
  수: { name:"水(수)", strong:"지혜롭고 유연하며 깊이 생각합니다.", weak:"수 기운이 부족하면 지혜와 유연성이 떨어져 고집스럽게 보일 수 있습니다. 물과 가까운 환경에서 사색하는 시간이 필요합니다.", temple:"계곡물이 흐르는 사찰, 연못이나 샘이 있는 수기(水氣) 가득한 사찰을 찾으세요." },
};

/** 템플릿 기반 사주 풀이 생성 (API 불필요) */
function generateTemplateExplanation({ ec, dist, weakOh, daYun, samjae, birthInput }) {
  const currentYear = new Date().getFullYear();
  const gender = birthInput?.gender === "female" ? "여성" : "남성";
  const ilgan = ec.day?.[0] ?? "";
  const ilji  = ec.day?.[1] ?? "";
  const ganDesc = GAN_DESC[ilgan] || "";
  const jiDesc  = JI_DESC[ilji]  || "";
  const weakInfo = weakOh ? OH_DESC[weakOh] : null;
  const ohKor = { 목:"木(목)", 화:"火(화)", 토:"土(토)", 금:"金(금)", 수:"水(수)" };

  const currentDaYun = daYun?.list?.find(d => d.isCurrent);
  const nextDaYun    = daYun?.list?.find(d => d.startYear > (currentDaYun?.startYear || 0));
  const currentLiuNian = currentDaYun?.liuNian?.find(ln => ln.year === currentYear);

  const isSamjae = samjae?.groups?.some(g => g.some(y => Math.abs(y.year - currentYear) <= 1));
  const nowGrp   = isSamjae ? (samjae.groups.find(g => g.some(y => Math.abs(y.year - currentYear) <= 1)) || []) : [];
  const nowY     = nowGrp.find(y => y.year === currentYear || y.year === currentYear - 1 || y.year === currentYear + 1);
  const samjaeStep = nowY ? (nowY.year < currentYear ? "날삼재(마무리)" : nowY.year === currentYear ? "눌삼재(중반)" : "들삼재(시작)") : "";

  const pastDayuns = (daYun?.list || []).filter(dy => !dy.isCurrent && dy.startYear < currentYear && dy.startAge >= 20);

  let text = "";

  // 1. 타고난 기질과 성격
  text += `**타고난 기질과 성격**\n`;
  text += `일주 ${ec.day}는 ${ganDesc.split("—")[1]?.trim() || "강한 기운을 지닌 일주입니다."} ${jiDesc.split("—")[1]?.trim() || ""} ${gender === "여성" ? "특히 내면의 섬세함과 배려심이 돋보이며, 주변 사람들에게 신뢰를 줍니다." : "남성적 추진력과 원칙에 대한 강한 신념이 삶의 주요 원동력이 됩니다."}\n\n`;

  // 2. 오행 에너지
  text += `**오행 에너지와 삶의 패턴**\n`;
  const distArr = Object.entries(dist || {}).sort((a,b) => b[1]-a[1]);
  const strongOh = distArr[0]?.[0];
  const strongInfo = strongOh ? OH_DESC[strongOh] : null;
  if (strongInfo) {
    text += `이 사주는 ${ohKor[strongOh] || strongOh} 기운이 중심을 이룹니다. ${strongInfo.strong} `;
  }
  if (weakInfo) {
    text += `반면 ${ohKor[weakOh]} 기운이 상대적으로 부족합니다. ${weakInfo.weak}\n\n`;
  } else {
    text += `전반적으로 오행이 고르게 분포되어 안정된 삶의 토대를 갖추고 있습니다.\n\n`;
  }

  // 3. 대운 흐름
  text += `**대운 흐름**\n`;
  if (pastDayuns.length > 0) {
    text += pastDayuns.map(dy => `과거 ${dy.startAge}~${dy.endAge}세(${dy.ganZhi}) 대운을 지나왔습니다.`).join(" ");
    text += " ";
  }
  if (currentDaYun) {
    text += `현재는 ${currentDaYun.startAge}~${currentDaYun.endAge}세 ${currentDaYun.ganZhi} 대운입니다. 이 시기는 지금까지 쌓아온 경험이 열매를 맺는 구간으로, 과거의 노력이 결실로 이어지는 흐름을 보입니다. 안정을 기반으로 한 도전이 가장 좋은 성과를 냅니다. `;
    if (nextDaYun) {
      text += `다음 ${nextDaYun.startAge}세부터 시작하는 ${nextDaYun.ganZhi} 대운에서 새로운 전환이 기대됩니다.\n\n`;
    } else {
      text += "\n\n";
    }
  } else {
    text += `대운 정보가 확인되지 않아 자세한 흐름은 생략합니다.\n\n`;
  }

  // 4. 올해 운세
  text += `**올해 ${currentYear}년 운세**\n`;
  if (currentLiuNian) {
    text += `${currentYear}년 ${currentLiuNian.ganZhi} 세운은 현재 ${currentDaYun?.ganZhi || ""} 대운과 맞물려 `;
    text += `건강 면에서는 과로와 무리한 일정을 피하고 꾸준한 관리가 중요합니다. `;
    text += `재물 면에서는 충동적인 투자보다 안정적인 수입 구조 유지에 집중하는 것이 유리합니다. `;
    text += `관계 면에서는 진실된 소통이 오해를 줄이고 인연을 깊게 합니다.\n\n`;
  } else {
    text += `올해의 세운 정보가 확인되지 않습니다. 현재 대운의 흐름에 맞춰 안정을 중시하고, 새로운 도전보다는 기존 관계와 사업을 내실 있게 다지는 해로 삼으세요.\n\n`;
  }

  // 5. 삼재 (해당 시)
  if (isSamjae && nowY) {
    text += `**삼재(三災) 주의사항**\n`;
    text += `현재 ${samjaeStep} 기간입니다. 삼재 기간에는 무리한 확장, 큰 이동, 새로운 사업 시작을 자제하고 기존의 것을 안전하게 지키는 전략이 최선입니다. `;
    text += `사찰 참배와 기도를 통해 삼재의 기운을 다스리고 마음의 평정을 유지하세요.\n\n`;
  }

  // 6. 인연사찰 안내
  text += `**인연사찰과 기운 보완**\n`;
  if (weakInfo) {
    text += `${ohKor[weakOh] || weakOh} 기운을 보완하려면 ${OH_DESC[weakOh]?.temple || "해당 오행의 기운이 강한"} 사찰, 정기적인 사찰 방문과 함께 마음을 고요히 하는 기도가 부족한 오행의 기운을 채워줍니다.\n\n`;
  }

  // 7. 마음에 새길 한마디
  const heavenly = ec?.year?.charAt(0) || "";
  const closing = {
    甲:"리더십과 도전 정신을 타고난 당신은 이미 삶의 방향을 알고 있습니다.",
    乙:"유연함과 인내심이 당신의 가장 큰 자산입니다. 때를 기다리면 반드시 꽃을 피웁니다.",
    丙:"태양처럼 밝은 당신의 기운이 주변을 따뜻하게 합니다. 흔들려도 다시 빛납니다.",
    丁:"섬세하고 깊은 불꽃처럼, 당신의 진심은 반드시 상대에게 닿습니다.",
    戊:"대지처럼 묵직한 당신은 흔들리지 않는 중심이 됩니다. 꾸준함이 모든 것을 이깁니다.",
    己:"부드러운 토양처럼 모든 것을 품어내는 당신은 귀한 인연을 끌어당깁니다.",
    庚:"강철같은 의지와 결단력이 당신의 무기입니다. 한 번 정한 길을 흔들리지 말고 가세요.",
    辛:"날카롭고 순수한 금의 기운처럼, 당신의 직관과 감각은 남다릅니다.",
    壬:"깊은 바다처럼 지혜롭고 포용력이 큰 당신은 어떤 상황도 헤쳐나갑니다.",
    癸:"조용히 스며드는 빗물처럼, 당신의 섬세한 배려와 통찰이 세상을 촉촉하게 합니다.",
  };
  text += `**마음에 새길 한마디**\n`;
  text += closing[heavenly] || `${heavenly || ""}의 기운을 타고난 당신은 이미 삶의 중심을 갖추고 있습니다. 흔들리는 날도 결국 당신만의 방식으로 길을 찾을 것입니다.`;
  text += "\n";

  return text;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  try {
    const body = req.body || {};
    const ec     = body.ec     || body.eightChar   || {};
    const dist   = body.dist   || body.distribution || {};
    const weakOh = body.weakOh || body.weak?.부족오행  || body.weak?.weakest || "";
    const { daYun, samjae, birthInput } = body;
    let explanation = "";
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const Anthropic = require("@anthropic-ai/sdk");
        const client = new Anthropic.default ? new Anthropic.default() : new Anthropic();
        const message = await client.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 2000,
          messages: [{ role: "user", content: JSON.stringify(body) }]
        });
        explanation = message.content?.[0]?.text || "";
        if (explanation) return res.status(200).json({ success: true, explanation, source: "ai" });
      } catch(aiErr) {
        console.error("AI 풀이 실패, 템플릿으로 대체:", aiErr.message);
      }
    }
    explanation = generateTemplateExplanation({ ec, dist, weakOh, daYun, samjae, birthInput });
    return res.status(200).json({ success: true, explanation, source: "template" });
  } catch(err) {
    console.error("saju-explain 오류:", err);
    return res.status(500).json({ error: "사주 풀이 생성 중 오류가 발생했습니다." });
  }
};
