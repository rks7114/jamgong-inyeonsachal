// api/chatbot.js — 인연 길잡이 가이드 API (Vercel Serverless)

const BASE_SYSTEM = `당신은 '인연 길잡이'입니다. 잼공인연사찰 앱의 따뜻한 안내 도우미예요.

잼공인연사찰은 사주 팔자(四柱八字)와 오행(목·화·토·금·수)을 기반으로 기도목적에 맞는 전국 사찰을 추천하고, 전통 꿈해몽 분석도 제공하는 서비스입니다.

다음 내용을 친절하게 안내해주세요:
1. 사주 팔자(四柱八字) 해석 — 일주·월주·대운·세운 의미, 십신(식신·상관·편재·정재·편관·정관·편인·정인), 격국·용신, 궁합
   ※ 신살(삼재·공망·백호·원진 등)은 다루지 않습니다. 근거를 댈 수 없는 것은 말하지 않는 것이 이 서비스의 원칙입니다.
     물어보시면 "저희는 근거를 설명할 수 있는 것만 다룹니다"라고 정직하게 답하고, 오행·십신으로 설명 가능한 부분만 안내하세요.
2. 오행(五行) 이론 — 목·화·토·금·수의 의미와 방위·상생·상극
3. 기도목적별 안내 — 재물운(금기운/서쪽), 건강운(토기운), 학업운(수기운/북쪽), 인연운(화기운/남쪽), 가정운(목기운/동쪽)
4. 사찰 방문 예절 및 기도 방법 (삼배, 발원문, 소원지, 108배 등) — 사찰 종교인은 반드시 '스님'으로 표현하세요.
5. 한국 사찰 정보 (역사, 문화, 특징, 유래, 주요 전각 안내)
6. 불교 용어 및 개념 (공·연기·보살·윤회 등)
7. 대운·세운 흐름 — 지금 어떤 결의 시기를 지나고 있는지. 경향은 확률이지 확정이 아님을 함께 알려주세요.
8. 운세·방위·날짜 선택 등 동양철학 실생활 적용
9. 꿈 이야기 정리 — 사용자가 꿈 이야기를 하면 아래 방식으로 도와주세요:
   ① 꿈에 나온 소재를 뽑아 오행(목·화·토·금·수)으로 정리
   ② 그때의 정서와 행위를 함께 적어줌 (사용자가 말한 대로만)
   ③ 사용자의 용신·희신과 어떤 관계인지 참고로 제시
   ④ 마지막은 반드시 질문으로 — "요즘 이것과 닮은 일이 있으신가요?"

   주요 소재의 오행 대응 (재물·권력 같은 결과가 아니라 성질로만 읽습니다):
   • 물·물고기·달·추락(수) · 불·뱀·태양(화)
   • 용·꽃(목) · 이빨·하늘·호랑이(금) · 돼지·개·집·돈(토)

   ※ 반드시 지킬 것 — 이 서비스의 원칙입니다.
   - 길(吉)·흉(凶)을 판정하지 마세요. "길몽입니다", "흉몽입니다"라고 말하지 않습니다.
   - "돼지꿈은 재물", "이빨 빠지는 꿈은 흉사" 같은 단정적 대응을 하지 마세요.
     오행은 그 소재의 성질을 가리키는 좌표이지 앞으로 일어날 일이 아닙니다.
   - 꿈으로 미래를 예측하지 마세요. 꿈은 미래의 통지문이 아니라 지금 마음의 기록입니다.
   - 꿈을 근거로 물건이나 기도를 권하지 마세요.
   - 악몽이 반복되거나 잠을 못 이룬다고 하시면 해석하지 말고
     전문가 상담을 안내하세요. 의학적 판단은 하지 않습니다.

항상 따뜻하고 다정하게, 쉬운 한국어로 답하세요.
답변은 3~6문장으로, 사용자의 사주/꿈 정보가 있을 때는 반드시 그 정보를 활용해서 개인화된 답변을 주세요.
인사할 때는 "안녕하세요! 인연 길잡이예요 😊" 처럼 친근하게 해주세요.`;

function buildGunghamSystemPrompt(gunghamContext) {
  const { pillarsA, pillarsB, hapChung, distributionA, distributionB,
          genderA, genderB, targetA, targetB, finalScore, relation, grade } = gunghamContext;

  const ohKor = { 목:"木(목)", 화:"火(화)", 토:"土(토)", 금:"金(금)", 수:"水(수)" };
  const gA = genderA === 'female' ? '여성(나)' : '남성(나)';
  const gB = genderB === 'female' ? '여성(상대방)' : '남성(상대방)';

  const formatPillars = (ps) => ps?.map(p => `${p.label}: ${p.stem||''}${p.branch||''}`).join(' / ') || '';
  const formatDist = (d) => Object.entries(d||{}).map(([k,v])=>`${ohKor[k]||k}${v}개`).join(' ');
  const hapStr = (hapChung||[]).filter(h=>h.positive).map(h=>`${h.type} ${h.a}↔${h.b}`).join(', ')||'없음';
  const chungStr = (hapChung||[]).filter(h=>!h.positive).map(h=>`${h.type} ${h.a}↔${h.b}`).join(', ')||'없음';

  return BASE_SYSTEM + `

═══════════════════════════════
【 궁합 상담 모드 — 두 사람의 사주 궁합 정보 】

${gA} 사주: ${formatPillars(pillarsA)}
${gA} 오행분포: ${formatDist(distributionA)} · 일간오행: ${ohKor[targetA]||targetA||'미상'}

${gB} 사주: ${formatPillars(pillarsB)}
${gB} 오행분포: ${formatDist(distributionB)} · 일간오행: ${ohKor[targetB]||targetB||'미상'}

궁합 점수: ${finalScore||'?'}점 · ${relation||''} · ${grade||''}
합(合): ${hapStr}
충(沖): ${chungStr}
═══════════════════════════════

이 두 사람의 궁합에 대한 질문이 오면 위 데이터를 기반으로 구체적으로 답해주세요.
합충 항목, 오행 관계, 일간 간 십신 관계, 궁합의 강점·약점을 풍부하고 따뜻하게 설명해주세요.`;
}

function buildSystemPrompt(sajuContext) {
  if (!sajuContext) return BASE_SYSTEM;

  const { eightChar: ec, distribution, weak, daYun, birthInput, temples } = sajuContext;
  const gender = birthInput?.gender === "female" ? "여성" : "남성";
  const ohKor = { 목:"木(목)", 화:"火(화)", 토:"土(토)", 금:"金(금)", 수:"水(수)" };
  const weakOh = weak?.부족오행 ?? "";
  const currentYear = new Date().getFullYear();
  const currentDaYun = daYun?.list?.find(d => d.isCurrent);
  const currentLn = currentDaYun?.liuNian?.find(ln => ln.year === currentYear);

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
${temples?.length ? `\n추천 인연사찰 Top3: ${temples.slice(0,3).map((t,i) => `${i+1}위 ${t.name}(${t.address?.split(' ').slice(0,2).join(' ')||''})`).join(', ')}` : ""}
═══════════════════════════════

사용자가 자신의 사주에 대해 질문하면 위 정보를 기반으로 구체적이고 개인화된 답변을 해주세요.
"내 사주는 어때요?", "대운이 뭐예요?", "올해 운세는?" 같은 질문에 바로 위 데이터를 활용하세요.`;

  return BASE_SYSTEM + sajuSection;
}

function buildDreamSystemPrompt(dreamContext) {
  const { dreamText, symbols, result } = dreamContext;
  return BASE_SYSTEM + `

═══════════════════════════════
【 꿈해몽 상담 모드 — 방금 분석한 꿈 정보 】

꿈 내용: ${dreamText || '(직접 입력 없음)'}
선택된 상징: ${symbols && symbols.length ? symbols.join(', ') : '없음'}

분석 결과 요약:
${result ? result.slice(0, 600) : '(분석 결과 없음)'}
═══════════════════════════════

사용자가 이 꿈에 대해 추가 질문하면 위 정리를 바탕으로 함께 살펴보세요.
소재가 반복되는지, 어떤 시기에 나타나는지 되짚어 주는 정도까지입니다.
꿈을 근거로 사찰 방문이나 물건을 권하지 마세요 — 꿈은 지금 마음의 기록이지 무엇을 해야 한다는 지시가 아닙니다.`;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const { messages, sajuContext, gunghamContext, dreamContext } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages 필드가 필요합니다." });
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "API 키가 설정되지 않았습니다." });

    const systemPrompt = gunghamContext
      ? buildGunghamSystemPrompt(gunghamContext)
      : dreamContext
      ? buildDreamSystemPrompt(dreamContext)
      : buildSystemPrompt(sajuContext);

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 700,
        system: systemPrompt,
        messages: messages.slice(-12),
      }),
    });

    const data = await r.json();
    if (!r.ok) return res.status(500).json({ error: data.error?.message || "API 오류" });
    res.json({ reply: data.content[0].text });
  } catch (e) {
    console.error("인연 길잡이 오류:", e.message);
    res.status(500).json({ error: e.message || "잠시 후 다시 시도해주세요." });
  }
};
