// api/saju-explain.js — Claude AI로 사주 풀이 결과지 생성

const Anthropic = require("@anthropic-ai/sdk");

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
  목: { name:"木(목)", strong:"창의적이고 성장 지향적이며 새로운 시작을 잘 이끕니다. 인자하고 어진 마음이 넘칩니다.", weak:"시작은 잘 하지만 마무리가 약할 수 있고, 결단력과 추진력이 부족할 수 있습니다.", temple:"산속 깊은 숲 기운의 사찰, 봄철 방문이 특히 좋습니다." },
  화: { name:"火(화)", strong:"열정적이고 표현력이 풍부하며 카리스마가 있습니다. 사람들과의 교류에서 에너지를 얻습니다.", weak:"감정 기복이 있거나 지구력이 부족할 수 있으며, 서두르다 실수하는 경향이 있습니다.", temple:"남향의 따뜻한 햇빛이 드는 사찰, 붉은 단청이 선명한 사찰이 기운을 보완합니다." },
  토: { name:"土(토)", strong:"안정적이고 포용력이 크며 신뢰감을 줍니다. 중심을 잡아주는 역할을 잘 합니다.", weak:"변화에 느리고 고집스럽게 보일 수 있으며, 새로운 환경 적응에 시간이 걸립니다.", temple:"황토 흙의 기운이 있는 고찰, 암벽 옆 사찰이나 넓은 마당이 있는 사찰이 좋습니다." },
  금: { name:"金(금)", strong:"의지가 강하고 결단력이 있으며 정확합니다. 원칙을 중시하고 목표를 향해 꾸준히 나아갑니다.", weak:"융통성이 부족하거나 냉정하게 보일 수 있으며, 인간관계에서 딱딱한 인상을 줄 수 있습니다.", temple:"바위산의 강인한 기운을 가진 사찰, 종소리가 청명한 금속 기운의 사찰이 도움이 됩니다." },
  수: { name:"水(수)", strong:"지혜롭고 유연하며 깊이 생각합니다. 통찰력이 있고 어떤 상황에도 흘러가는 적응력을 가집니다.", weak:"결단력이 부족하거나 우유부단할 수 있으며, 지나친 걱정과 두려움이 앞설 수 있습니다.", temple:"계곡물이 흐르는 사찰, 연못이나 샘이 있는 수기(水氣) 가득한 사찰을 찾으세요." },
};

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  // ANTHROPIC_API_KEY 환경변수 체크
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.");
    return res.status(500).json({ error: "API_KEY_MISSING", message: "ANTHROPIC_API_KEY가 Vercel 환경변수에 없습니다." });
  }

  try {
    const { eightChar: ec, distribution: dist, weak, daYun, samjae, birthInput } = req.body;
    if (!ec) return res.status(400).json({ error: "사주 데이터가 없습니다." });

    const gender = birthInput?.gender === "female" ? "여성" : "남성";
    const weakOh = weak?.부족오행 ?? "";
    const ohKor = { 목:"木(목)", 화:"火(화)", 토:"土(토)", 금:"金(금)", 수:"水(수)" };

    const currentYear = new Date().getFullYear();
    const currentDaYun = daYun?.list?.find(d => d.isCurrent);
    const currentLiuNian = currentDaYun?.liuNian?.find(ln => ln.year === currentYear);
    const prevDaYun = daYun?.list?.filter(d => d.startYear < (currentDaYun?.startYear || 9999)).slice(-1)[0];
    const nextDaYun = daYun?.list?.find(d => d.startYear > (currentDaYun?.startYear || 0));

    const distText = Object.entries(dist || {}).map(([k,v]) => `${ohKor[k]||k} ${v}개`).join(", ");

    const ilgan = ec.day?.[0] ?? "";
    const ilji  = ec.day?.[1] ?? "";
    const ganDesc = GAN_DESC[ilgan] || `${ilgan}의 기운`;
    const jiDesc  = JI_DESC[ilji]  || `${ilji}의 기운`;
    const weakDesc = weakOh ? OH_DESC[weakOh] : null;

    const isSamjae = samjae?.groups?.some(g => g.some(y => Math.abs(y.year - currentYear) <= 1));
    const samjaeInfo = isSamjae ? (() => {
      const nowGrp = samjae.groups.find(g => g.some(y => Math.abs(y.year - currentYear) <= 1)) || [];
      const nowY = nowGrp.find(y => y.year === currentYear || y.year === currentYear - 1 || y.year === currentYear + 1);
      return `현재 삼재(三災) 기간입니다 — ${nowY?.year}년 ${nowY?.zhiKo ? `(${nowY.zhiKo}) ` : ""}${nowY?.year < currentYear ? "들삼재가 지나고" : nowY?.year === currentYear ? "눌삼재(삼재 중반)" : "날삼재(삼재 마무리)"}`;
    })() : null;

    const prompt = `당신은 한국 전통 사주 상담가입니다. 아래 사주를 쉬운 우리말로 풀어주세요.
각 항목 제목은 **제목** 형식으로 쓰고, 각 항목마다 2~3문장으로 간결하게 완성해 주세요. 한자가 나오면 반드시 괄호로 뜻을 붙여주세요.

【사주 정보】
성별: ${gender}
팔자: 년주 ${ec.year} / 월주 ${ec.month} / 일주 ${ec.day} / 시주 ${ec.time}
오행: ${distText} / 부족: ${weakOh ? ohKor[weakOh] : "균형"}
일간: ${ganDesc.split('—')[0].trim()} / 일지: ${jiDesc.split('—')[0].trim()}
현재 대운: ${currentDaYun ? `${currentDaYun.startAge}~${currentDaYun.endAge}세 ${currentDaYun.ganZhi}` : "정보 없음"}
올해(${currentYear}) 세운: ${currentLiuNian ? `${currentLiuNian.ganZhi} (${currentLiuNian.age}세)` : "정보 없음"}
${isSamjae ? `⚠️ 삼재: ${samjaeInfo}` : ""}

【대운 (30세 이후)】
${(daYun?.list || []).filter(dy => dy.startAge >= 30).map(dy => {
  const label = dy.isCurrent ? '▶현재' : dy.startYear < currentYear ? '과거' : '미래';
  return `${label}: ${dy.startAge}~${dy.endAge}세 ${dy.ganZhi}`;
}).join(' | ')}

**타고난 기질과 성격**
일주 ${ec.day}의 타고난 성품, 강점, 주의점을 2~3문장으로 설명해 주세요.

**오행 에너지와 삶의 패턴**
오행 분포와 부족한 ${weakOh ? ohKor[weakOh] : "기운"}이 삶에 미치는 영향을 2~3문장으로 설명해 주세요.

**대운 흐름**
지나간 대운은 한 줄씩, 현재 대운(${currentDaYun?.ganZhi || ""})은 3문장, 다음 대운은 한 줄로 써주세요.

**올해 ${currentYear}년 운세**
현재 대운과 세운 ${currentLiuNian?.ganZhi || ""}을 건강·재물·관계로 나눠 2~3문장으로 써주세요.

${isSamjae ? `**삼재 주의사항**
삼재 기간 중 주의점과 대처법을 2문장으로 써주세요.

` : ""}**인연사찰과 기운 보완**
부족한 ${weakOh ? ohKor[weakOh] : "오행"} 기운 보완을 위한 사찰 유형과 기도 방법을 2문장으로 안내해 주세요.${weakDesc ? ` ${weakDesc.temple}` : ""}

**마음에 새길 한마디**
이 분의 사주를 종합해 따뜻한 말로 1~2문장으로 마무리해 주세요.`;

    const client = new Anthropic();
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const explanation = message.content[0]?.text || "";
    return res.status(200).json({ success: true, explanation });

  } catch (err) {
    console.error("사주 풀이 생성 오류:", err);
    return res.status(500).json({ error: "사주 풀이 생성 중 오류가 발생했습니다." });
  }
};
