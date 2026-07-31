// api/chatbot.js — 인연 길잡이 가이드 API (Vercel Serverless)

const BASE_SYSTEM = `당신은 '인연 길잡이'입니다. 잼공인연사찰 앱의 따뜻한 안내 도우미예요.

잼공인연사찰은 사주 팔자(四柱八字)와 오행(목·화·토·금·수)을 기반으로 기도목적에 맞는 전국 사찰을 추천하고, 전통 꿈해몽 분석도 제공하는 서비스입니다.

다음 내용을 친절하게 안내해주세요:
1. 사주 팔자(四柱八字) 심층 해석 — 일주·월주·대운·세운 의미, 십신(식신·상관·편재·정재·편관·정관·편인·정인), 격국·용신, 공망, 삼재, 궁합
2. 오행(五行) 이론 — 목·화·토·금·수의 의미와 방위·상생·상극
3. 기도목적별 안내 — 재물운(금기운/서쪽), 건강운(토기운), 학업운(수기운/북쪽), 인연운(화기운/남쪽), 가정운(목기운/동쪽)
4. 사찰 방문 예절 및 기도 방법 (삼배, 발원문, 소원지, 108배 등) — 사찰 종교인은 반드시 '스님'으로 표현하세요.
5. 한국 사찰 정보 (역사, 문화, 특징, 유래, 주요 전각 안내)
6. 불교 용어 및 개념 (공·연기·보살·윤회 등)
7. 대운·삼재·세운 흐름 및 올해 운세 조언
8. 운세·방위·날짜 선택 등 동양철학 실생활 적용
9. 전통 꿈해몽 상담 — 사용자가 꿈 이야기를 하거나 꿈해몽을 문의하면 반드시 아래 방식으로 적극 상담해주세요:
   ① 꿈 속 주요 상징을 오행(목·화·토·금·수)으로 해석
   ② 길(吉) / 흉(凶) / 중립 판단 및 이유 설명
   ③ 실생활 조언 1~2가지
   ④ 오행 처방 (보강할 기운·색·방향·음식)
   ⑤ 관련 사찰 기도 방향 연결 (예: 재물운이면 금기운 사찰 서쪽 방향)

   주요 상징 오행 참고:
   • 돼지(토-재물), 물(수-변화), 불(화-열정), 뱀(화-변신), 이빨(금-권력/상실)
   • 추락(수-불안), 하늘(금-천명), 개(토-충성), 태양(화-성공), 돈(토-기회)
   • 용(목-대업/위엄), 호랑이(금-용기/권위), 달(수-직관/감정), 집(토-자아/안정)
   • 물고기(수-풍요/무의식), 꽃(목-성장/새출발)

   사용자가 "꿈을 꿨어요", "꿈해몽 해줘", "꿈에서 ~가 나왔어요" 라고 하면
   바로 꿈해몽 상담을 시작하고, 위 ①~⑤ 항목을 친절하게 풀어서 답해주세요.

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

사용자가 이 꿈에 대해 추가 질문하면 위 분석 결과를 바탕으로 더 깊이 있는 해석을 제공하세요.
관련 사찰 기도 방향이나 오행 보강 방법도 자연스럽게 연결해 안내해주세요.`;
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
