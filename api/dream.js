// api/dream.js — 전통 꿈해몽 AI 분석

const SYMBOL_MAP = {
  '돼지': { ohaeng: '토', meaning: '재물·풍요·복(福)의 길상. 재물운 상승 예고.' },
  '물':   { ohaeng: '수', meaning: '지혜·흐름·변화·정화. 감정과 무의식의 흐름.' },
  '불':   { ohaeng: '화', meaning: '열정·변혁·정화. 강렬한 에너지의 표출.' },
  '뱀':   { ohaeng: '화', meaning: '지혜·변신·잠재의식. 변화와 경계의 상징.' },
  '이빨': { ohaeng: '금', meaning: '권력·자신감. 빠짐은 상실이나 변화의 전조.' },
  '추락': { ohaeng: '수', meaning: '통제력 상실·큰 변화의 전조·내면의 불안.' },
  '하늘': { ohaeng: '금', meaning: '천명·큰 뜻·자유·운명적 흐름.' },
  '개':   { ohaeng: '토', meaning: '충성·우정·보호·직관력.' },
  '태양': { ohaeng: '화', meaning: '생명력·성공·권위·밝은 미래의 징조.' },
  '돈':   { ohaeng: '토', meaning: '재물·현실적 기회·세속적 욕구의 표현.' },
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
꿈 속 주요 상징 2~3개를 전통 해석으로 풀이 (각 1~2문장)

##길흉판단##
길(吉) 또는 흉(凶) 또는 중립, 그 이유 (2문장)

##조언##
이 꿈 이후 일상에서 실천할 수 있는 조언 2가지 (간결하게)

##오행처방##
부족하거나 보강해야 할 오행 기운과 그에 맞는 색·방향·음식 한 가지씩

문어체가 아닌 부드러운 존댓말로 작성하되, 신비롭고 품격 있는 어조를 유지하세요.`;

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
    const fallback = `##오행분석##\n꿈 속에 흐르는 기운을 살펴보니 수(水)와 토(土)의 기운이 교차하고 있습니다. 무의식의 깊은 흐름 속에서 내면의 변화를 예고하는 신호가 감지됩니다.\n\n##핵심상징##\n꿈에 등장한 요소들은 변화와 전환의 상징으로 읽힙니다. 새로운 시작을 앞두고 내면이 스스로를 정비하는 과정으로 해석됩니다.\n\n##길흉판단##\n중립적 흐름으로, 변화의 시기에 놓여 있음을 알려주는 꿈입니다. 두려움보다는 열린 마음으로 새로운 흐름을 받아들이시길 권합니다.\n\n##조언##\n1. 아침에 물 한 잔을 마시며 오늘의 의도를 설정해보세요.\n2. 가까운 사찰을 방문하여 마음을 고요히 정돈해보세요.\n\n##오행처방##\n수(水) 기운 보강을 권합니다. 색은 검정·진남색, 방향은 북쪽, 음식은 검은콩·미역이 도움이 됩니다.`;
    return res.status(200).json({ result: fallback, symbols: symbolInfo });
  }
};
