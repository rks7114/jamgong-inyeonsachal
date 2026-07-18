// api/chatbot.js — 인연 길잡이 가이드 API (Vercel Serverless)
const AnthropicSDK = require("@anthropic-ai/sdk");

function getClient() {
  const A = AnthropicSDK.default || AnthropicSDK;
  return new A({ apiKey: process.env.ANTHROPIC_API_KEY });
}

const BASE_SYSTEM = `당신은 '인연 길잡이'입니다. 잼공인연사찰 앱의 따뜻한 안내 도우미예요.

잼공인연사찰은 사주 팔자(四柱八字)와 오행(목·화·토·금·수)을 기반으로 기도목적에 맞는 전국 사찰을 추천해드리는 서비스입니다.

다음 내용을 친절하게 안내해주세요:
1. 사주 팔자(四柱八字) 심층 해석 — 일주·월주·대운·세운 의미, 십신(식신·상관·편재·정재·편관·정관·편인·정인), 격국·용신, 공망, 삼재, 궁합
2. 오행(五行) 이론 — 목·화·토·금·수의 의미와 방위·상생·상극
3. 기도목적별 안내 — 재물운(금기운/서쪽), 건강운(토기운), 학업운(수기운/북쪽), 인연운(화기운/남쪽), 가정운(목기운/동쪽)
4. 사찰 방문 예절 및 기도 방법 (삼배, 발원문, 소원지, 108배 등) — 사찰 종교인은 반드시 '스님'으로 표현하세요.
5. 한국 사찰 정보 (역사, 문화, 특징, 유래, 주요 전각 안내)
6. 불교 용어 및 개념 (공·연기·보살·윤회 등)
7. 대운·삼재·세운 흐름 및 올해 운세 조언
8. 운세·방위·날짜 선택 등 동양철학 실생활 적용

항상 따뜻하고 다정하게, 쉬운 한국어로 답하세요.
답변은 3~5문장으로, 사용자의 사주 정보가 있을 때는 반드시 그 정보를 활용해서 개인화된 답변을 주세요.
인사할 때는 "안녕하세요! 인연 길잡이예요 😊" 처럼 친근하게 해주세요.`;

function buildSystemPrompt(sajuContext) {
  if (!sajuContext) return BASE_SYSTEM;

  const { eightChar: ec, distribution, weak, daYun, samjae, birthInput, temples } = sajuContext;
  const gender = birthInput?.gender === "female" ? "여성" : "남성";
  const ohKor = { 목:"木(목)", 화:"火(화)", 토:"土(토)", 금:"金(금)", 수:"水(수)" };
  const weakOh = weak?.부족오행 ?? "";
  const currentYear = new Date().getFullYear();
  const currentDaYun = daYun?.list?.find(d => d.isCurrent);
  const currentLn = currentDaYun?.liuNian?.find(ln => ln.year === currentYear);
  const isSamjae = samjae?.groups?.some(g => g.some(y => Math.abs(y.year - currentYear) <= 1));

  const sajuSection = `

═══════════════════════════════
【 이 사용자의 사주 정보 — 대화에 적극 활용하세요 】
성별: ${gender}
생년월일: ${birthInput?.calendarType === 'lunar' ? '음력' : '양력'} ${birthInput?.year}년 ${birthInput?.month}월 ${birthInput?.day}일 ${birthInput?.hour}시

사주 팔자(四柱八字):
  년주(年柱): ${ec?.year || "-"}  월주(月柱): ${ec?.month || "-"}  일주(日柱): ${ec?.day || "-"}  시주(時柱): ${ec?.time || "-"}

오행 분포: ${Object.entries(distribution || {}).map(([k,v]) => `${ohKor[k]||k} ${v}개`).join(", ")}
부족한 기운: ${weakOh ? ohKor[weakOh] : "균형"}
현재 대운: ${currentDaYun ? `${currentDaYun.startAge}~${currentDaYun.endAge}세 ${currentDaYun.ganZhi} (${daYun?.direction})` : "정보 없음"}
올해 세운: ${currentLn ? `${currentYear}년 ${currentLn.ganZhi} (${currentLn.age}세)` : currentYear + "년"}
삼재: ${isSamjae ? "현재 삼재 기간 ⚠️" : "해당 없음"}
${temples?.length ? `\n추천 인연사찰 Top3: ${temples.slice(0,3).map((t,i) => `${i+1}위 ${t.name}(${t.address?.split(' ').slice(0,2).join(' ')||''})`).join(', ')}` : ""}
═══════════════════════════════

사용자가 자신의 사주에 대해 질문하면 위 정보를 기반으로 구체적이고 개인화된 답변을 해주세요.
"내 사주는 어때요?", "대운이 뭐예요?", "올해 운세는?" 같은 질문에 바로 위 데이터를 활용하세요.`;

  return BASE_SYSTEM + sajuSection;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const { messages, sajuContext } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages 필드가 필요합니다." });
  }

  try {
    const client = getClient();
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: buildSystemPrompt(sajuContext),
      messages: messages.slice(-12),
    });

    res.json({ reply: response.content[0].text });
  } catch (e) {
    console.error("인연 길잡이 API 오류:", e);
    res.status(500).json({ error: "잠시 후 다시 시도해주세요." });
  }
};
