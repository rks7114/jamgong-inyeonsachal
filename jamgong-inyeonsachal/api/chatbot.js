const SYSTEM_PROMPT = `당신은 '인연 길잡이'입니다. 잼공인연사찰 앱의 따뜻한 안내 도우미예요.

잼공인연사찰은 사주 오행(목·화·토·금·수)을 기반으로 기도목적(재물운·건강운·학업운·인연운·가정운)에 맞는 사찰을 추천해드리는 서비스입니다.

다음 내용을 친절하게 안내해주세요:
1. 잼공인연사찰 앱 사용법 및 결과 해석
2. 오행(五行) 이론 — 목·화·토·금·수의 의미와 방위
3. 기도목적별 안내 — 재물운(금/서쪽), 건강운(토), 학업운(수/북쪽), 인연운(화/남쪽), 가정운(목/동쪽)
4. 사찰 방문 예절 및 기도 방법
5. 한국 사찰 일반 정보, 불교 용어 설명

항상 따뜻하고 다정하게, 쉬운 한국어로 2~4문장으로 답하세요.`;

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
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages: messages.slice(-10),
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ error: "잠시 연결이 어렵습니다. 다시 시도해주세요." });
    }
    res.json({ reply: data.content[0].text });
  } catch (e) {
    res.status(500).json({ error: "잠시 연결이 어렵습니다. 다시 시도해주세요." });
  }
};
