// api/dream.js — 전통 꿈해몽 AI 분석

// 소재의 '성질'만 적는다. 앞으로 일어날 일(예고·징조·운 상승)은 쓰지 않는다.
// 돼지=재물처럼 결과를 단정하는 대응이 이 분야를 오염시켜 왔고,
// 사전이 그렇게 적혀 있으면 프롬프트를 아무리 고쳐도 그 말이 다시 나온다.
const SYMBOL_MAP = {
  '돼지':   { ohaeng: '토', meaning: '품고 불리는 성질. 쌓임과 넉넉함의 결.' },
  '물':     { ohaeng: '수', meaning: '흐르고 스며드는 성질. 가라앉음과 건너감.' },
  '불':     { ohaeng: '화', meaning: '타올라 흩어지는 성질. 드러냄과 열기.' },
  '뱀':     { ohaeng: '화', meaning: '허물을 벗는 성질. 경계와 탈바꿈.' },
  '이빨':   { ohaeng: '금', meaning: '끊고 다듬는 성질. 무는 힘과 빠짐.' },
  '추락':   { ohaeng: '수', meaning: '아래로 향하는 움직임. 놓침과 가라앉음.' },
  '하늘':   { ohaeng: '금', meaning: '위에서 덮는 성질. 트임과 아득함.' },
  '개':     { ohaeng: '토', meaning: '곁을 지키는 성질. 가까움과 지킴.' },
  '태양':   { ohaeng: '화', meaning: '사방을 밝히는 성질. 드러남과 뜨거움.' },
  '돈':     { ohaeng: '토', meaning: '손에 쥐고 헤아리는 성질. 오감과 셈.' },
  '용':     { ohaeng: '목', meaning: '솟구쳐 뻗는 성질. 커짐과 오름.' },
  '호랑이': { ohaeng: '금', meaning: '몰아붙이는 성질. 날카로움과 두려움.' },
  '달':     { ohaeng: '수', meaning: '차고 기우는 성질. 어스름과 되비침.' },
  '집':     { ohaeng: '토', meaning: '머무는 자리의 성질. 안쪽과 기반.' },
  '물고기': { ohaeng: '수', meaning: '물속을 오가는 성질. 잠김과 무리.' },
  '꽃':     { ohaeng: '목', meaning: '피어나는 성질. 벌어짐과 한때.' },
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { dreamText = '', symbols = [] } = req.body || {};
  if (!dreamText.trim() && symbols.length === 0)
    return res.status(400).json({ error: '꿈 내용을 입력해주세요.' });

  const symbolInfo = symbols.map(s => SYMBOL_MAP[s] || { ohaeng: '?', meaning: s }).map((v, i) => `- ${symbols[i]}: ${v.meaning}`).join('\n');

  const prompt = `당신은 동양 전통 꿈해몽 전문가입니다. 오행(목·화·토·금·수) 이론과 불교·도교 상징 체계를 바탕으로 꿈을 해석합니다.

[꿈 내용]
${dreamText || '(텍스트 없음)'}

[선택된 상징]
${symbolInfo || '(없음)'}

아래 형식으로 한국어로 분석해주세요. 각 섹션은 반드시 포함하세요.

##오행분석##
이 꿈에서 감지되는 주된 오행 기운 1~2가지와 그 의미 (2~3문장)

##핵심상징##
꿈 속 주요 소재 2~3개를 소재·정서·행위로 나누어 정리 (각 1~2문장)

##되묻기##
이 꿈과 닮은 일이 요즘 있었는지 사용자에게 묻는 질문 1~2개

##조언##
이 꿈 이후 일상에서 실천할 수 있는 조언 2가지 (간결하게)

##오행처방##
지금 보강하면 좋을 오행 기운과 그에 맞는 색·방향·음식 한 가지씩

작성 원칙 — 반드시 지키세요.
- 길(吉)·흉(凶)을 판정하지 마세요. "길몽/흉몽"이라는 말을 쓰지 않습니다.
- 앞으로 일어날 일을 예고하지 마세요. "~할 징조", "~를 예고합니다" 금지.
  꿈은 미래의 통지문이 아니라 지금 마음의 기록입니다.
- "돼지꿈은 재물" 같은 단정적 대응을 하지 마세요. 오행은 소재의 성질이지 결과가 아닙니다.
- 꿈을 근거로 물건 구매를 권하지 마세요.
- 반복되는 악몽이나 불면을 말씀하시면 해석하지 말고 전문가 상담을 안내하세요.

부드러운 존댓말로, 차분하고 담백하게 작성하세요.`;

  try {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error('no key');
    const Anthropic = require('@anthropic-ai/sdk');
    const client = new Anthropic.default ? new Anthropic.default() : new Anthropic();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    }, { signal: controller.signal });
    clearTimeout(timer);
    const text = msg.content?.[0]?.text || '';
    return res.status(200).json({ result: text, symbols: symbolInfo });
  } catch (e) {
    // fallback
    const fallback = `##오행분석##\n꿈에 나온 소재들을 오행으로 정리해 보면 수(水)와 토(土)의 결이 함께 보입니다. 물은 흐르고 스며드는 성질, 흙은 품고 고르는 성질입니다.\n\n##핵심상징##\n소재로는 변화와 자리 잡음이 함께 나왔고, 행위로는 옮겨 가는 움직임이 보입니다. 정서는 적어주신 대로 읽었습니다.\n\n##되묻기##\n요즘 무언가를 건너가는 중이라고 느끼시나요? 자리를 옮기거나 정리하는 일이 있으셨는지요.\n\n##조언##\n1. 기억나는 대로 꿈을 적어두고 한 주 뒤에 다시 읽어보세요.\n2. 반복되는 소재가 있는지 살펴보시면 도움이 됩니다.\n\n##오행처방##\n수(水) 기운을 보강하신다면 색은 검정·진남색, 방향은 북쪽, 음식은 검은콩·미역이 맞습니다.`;
    return res.status(200).json({ result: fallback, symbols: symbolInfo });
  }
};
