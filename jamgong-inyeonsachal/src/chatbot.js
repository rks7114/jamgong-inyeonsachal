// api/chatbot.js — 인연 길잡이 가이드 API (Vercel Serverless)
const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `당신은 '인연 길잡이'입니다. 잼공인연사찰 앱의 따뜻한 안내 도우미예요.

잼공인연사찰은 사주 오행(목·화·토·금·수)을 기반으로 기도목적(재물운·건강운·학업운·인연운·가정운)에 맞는 사찰을 추천해드리는 서비스입니다.

다음 내용을 친절하게 안내해주세요:
1. 잼공인연사찰 앱 사용법 및 결과 해석
2. 오행(五行) 이론 — 목·화·토·금·수의 의미와 방위 (목=동, 화=남, 토=중앙, 금=서, 수=북)
3. 기도목적별 안내 — 재물운(금기운/서쪽), 건강운(토기운), 학업운(수기운/북쪽), 인연운(화기운/남쪽), 가정운(목기운/동쪽)
4. 사찰 방문 예절 및 기도 방법 (삼배, 발원문, 소원지, 108배 등)
5. 한국 사찰에 관한 일반 정보 (역사, 문화, 특징, 유래)
6. 불교 용어 및 개념 설명
7. 추천 사찰의 특징이나 가는 방법 등 궁금한 점

항상 따뜻하고 다정하게, 쉬운 한국어로 답하세요.
답변은 2~4문장으로 간결하게, 꼭 필요한 경우에만 길게 설명하세요.
인사할 때는 "안녕하세요! 인연 길잡이예요 😊" 처럼 친근하게 해주세요.`;

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages 필드가 필요합니다." });
  }

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: messages.slice(-10), // 최근 10개 메시지만 컨텍스트로 사용
    });

    res.json({ reply: response.content[0].text });
  } catch (e) {
    console.error("인연이 API 오류:", e);
    res.status(500).json({ error: "잠시 연결이 어렵습니다. 다시 시도해주세요." });
  }
};
