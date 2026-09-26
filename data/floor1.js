/* 1F — Lecture 1: Course Overview, Introduction (28 slides) */
(function () {
  const R = String.raw;
  const H = window.HOTEL = window.HOTEL || {}; H.floors = H.floors || [];
  H.floors.push({
    n: 1, title: '서론: 데이터가 모델을 만든다', en: 'learning f from data', lecture: 'Lecture 1', sub: 'Course Overview, Introduction', pages: 28,
    welcome: R`1층은 이 수업 전체의 뼈대예요. "AI·ML·DL이 뭔지"에서 시작해서 "모델이란 $Y=f(X)+\varepsilon$의 $f$를 데이터로 추정하는 것"이라는 큰 그림, 그리고 마지막에 <b>편향-분산 트레이드오프</b>까지 가요. 시험에서 가장 자주 나오는 층이니 천천히, 그림을 꼭 만져 보면서 가요.`,
    rooms: [
      {
        id: '1-1', title: 'AI · ML · DL, 세 개의 원', en: 'What is AI, ML & DL?', slides: '3–4', mins: 3,
        guide: R`첫 객실은 가볍게 정의 세 개만 챙겨요. 포인트는 <b>포함 관계</b>와 ML 정의 속의 문구 "명시적 지시 없이(without explicit instructions)"예요.`,
        body: R`
<p><b>인공지능(AI)</b>은 학습, 추론, 문제 해결, 지각, 의사결정처럼 <mark>사람의 지능과 연관된 일을 컴퓨팅 시스템이 수행하는 능력</mark>입니다.</p>
<p><b>머신러닝(ML)</b>은 AI의 한 분야로, <mark>데이터로부터 학습해서 보지 못한 데이터에 일반화</mark>할 수 있는 통계 알고리즘을 개발하고 연구합니다. 그래서 <em>명시적 지시 없이</em> 일을 수행합니다.</p>
<p><b>딥러닝(DL)</b>은 ML의 부분집합으로, <mark>신경망(neural networks)</mark>을 이용해 분류, 회귀, 표현 학습(representation learning) 같은 일을 합니다.</p>
<div class="viz" data-viz="nested"></div>
<div class="tip"><b>기억법.</b> 큰 원부터 "AI ⊃ ML ⊃ DL". AI는 목표(사람처럼), ML은 방법(데이터로 학습), DL은 도구(신경망)라고 외우면 정의 세 줄이 저절로 나와요.</div>`,
        points: [
          '세 정의를 한 줄씩 영어 키워드로: AI = tasks associated with human intelligence, ML = learn from data & generalize to unseen data without explicit instructions, DL = neural networks',
          '포함 관계 DL ⊂ ML ⊂ AI. "DL은 ML의 부분집합(subset)"이라는 표현 그대로',
          'ML의 핵심어는 일반화(generalization): 훈련에 쓰지 않은 데이터에서도 잘 작동해야 함'
        ],
        terms: [['generalize / generalization', '일반화 (보지 못한 데이터에 적용)'], ['representation learning', '표현 학습'], ['explicit instructions', '명시적 지시(규칙)']],
        quiz: [
          { q: '다음 중 강의의 정의에 따라 옳은 포함 관계는?', c: ['AI ⊂ ML ⊂ DL', 'DL ⊂ ML ⊂ AI', 'ML ⊂ DL ⊂ AI', 'AI, ML, DL은 서로 겹치지 않는다'], a: 1, why: '딥러닝은 머신러닝의 부분집합이고, 머신러닝은 인공지능의 한 분야입니다.' },
          { q: '강의의 ML 정의에서 "…and thus perform tasks without ______"의 빈칸은?', c: ['human supervision', 'explicit instructions', 'large datasets', 'neural networks'], a: 1, why: 'ML은 데이터에서 배운 것으로 일을 하므로 명시적 지시(규칙을 일일이 코딩하는 것) 없이 작동합니다.' }
        ]
      },
      {
        id: '1-2', title: '왜 지금 AI인가: 데이터 · 컴퓨팅 · 알고리즘', en: 'AI. Why so hot now?', slides: '5–6', mins: 5,
        guide: R`이 객실이 수업 제목 "Data-Centric AI"의 이유예요. 표의 메시지는 딱 하나: <b>알고리즘은 이미 오래전에 있었고, 데이터가 생기자 돌파구가 왔다.</b>`,
        body: R`
<p>지난 10년의 AI 붐은 세 가지가 한 시점에 모였기 때문입니다. <b>데이터(Data)</b>, <b>컴퓨팅 파워(Computing Power)</b>, <b>알고리즘(Algorithms)</b>. 슬라이드의 표현으로는 "고성능 컴퓨팅, (대규모) 데이터, 알고리즘의 <mark>수렴(convergence)</mark>이 광범위한 AI 발전을 가능하게 했다".</p>
<h3>데이터가 돌파구를 만든다</h3>
<div class="viz" data-viz="timeline"></div>
<div class="tbl-wrap wide"><table class="tbl">
<tr><th>돌파구 (연도)</th><th>데이터셋 (처음 공개)</th><th>알고리즘 (처음 제안)</th></tr>
<tr><td>사람 수준의 낭독 음성 인식 (1994)</td><td>Wall Street Journal 낭독 음성 등 (1991)</td><td>은닉 마르코프 모델 HMM (1984)</td></tr>
<tr><td>IBM Deep Blue, 카스파로프 격파 (1997)</td><td>그랜드마스터 체스 70만 국 "The Extended Book" (1991)</td><td>Negascout 탐색 알고리즘 (1983)</td></tr>
<tr><td>구글 아랍어·중국어→영어 번역 (2005)</td><td>구글 웹·뉴스 1.8조 토큰 (2005 수집)</td><td>통계적 기계번역 SMT (1988)</td></tr>
<tr><td>IBM Watson, Jeopardy! 챔피언 (2011)</td><td>위키피디아·위키낱말사전·구텐베르크 등 860만 문서 (2010)</td><td>Mixture-of-Experts (1991)</td></tr>
<tr><td>구글 GoogleNet, 사람에 가까운 물체 분류 (2014)</td><td>ImageNet 150만 장·1000 범주 (2010)</td><td>합성곱 신경망 CNN (1989)</td></tr>
<tr><td>DeepMind, Atari 29개 게임 사람 수준 (2015)</td><td>Arcade Learning Environment 50+ 게임 (2013)</td><td>Q-learning (1992)</td></tr>
<tr><td>AlphaFold, 단백질 구조 예측 혁신 (2020)</td><td>Protein Data Bank (PDB)</td><td>Transformer (2017)</td></tr>
<tr><td>ChatGPT, 최신 대화 에이전트 (2022)</td><td>대규모 텍스트 말뭉치 (Common Crawl, WebText 등)</td><td>Transformer (2017)</td></tr>
</table></div>
<div class="tip"><b>읽는 법.</b> 세 번째 열의 연도가 두 번째 열보다 대부분 훨씬 앞서 있죠? CNN은 1989년에 있었지만 ImageNet(2010)이 나오고서야 2014년의 돌파구가 왔어요. 데이터 → (몇 년) → 돌파구. 그래서 "데이터 중심(Data-Centric)" AI입니다.</div>`,
        points: [
          'AI 붐의 세 축: Data, Computing Power, Algorithms의 convergence',
          '표에서 짝 맞추기가 나올 수 있음: ImageNet(2010) ↔ GoogleNet(2014) ↔ CNN(1989), Atari/ALE(2013) ↔ DeepMind(2015) ↔ Q-learning(1992), Transformer(2017) ↔ AlphaFold(2020)·ChatGPT(2022)',
          '메시지: 알고리즘은 대개 수십 년 전에 제안됐고, 데이터셋이 확보된 뒤 몇 년 안에 돌파구가 옴 → 데이터가 병목이자 촉매'
        ],
        terms: [['convergence', '수렴 (세 요소가 한 시점에 모임)'], ['breakthrough', '돌파구']],
        quiz: [
          { q: '슬라이드가 말하는 최근 AI 발전의 세 가지 동력이 아닌 것은?', c: ['데이터', '컴퓨팅 파워', '알고리즘', '오픈소스 문화'], a: 3, why: '슬라이드는 Data, Computing Power, Algorithms의 수렴을 꼽습니다.' },
          { q: '"데이터가 AI 돌파구에 결정적"이라는 표의 논지로 가장 알맞은 것은?', c: ['알고리즘이 나오자마자 돌파구가 왔다', '알고리즘은 오래전에 있었고, 데이터셋이 생긴 뒤 돌파구가 왔다', '컴퓨팅 파워만 있으면 데이터는 필요 없다', '돌파구가 먼저 오고 데이터셋이 나중에 만들어졌다'], a: 1, why: '예: CNN(1989) → ImageNet(2010) → GoogleNet(2014). 알고리즘 제안 → 데이터 공개 → 돌파구 순서입니다.' }
        ]
      },
      {
        id: '1-3', title: '머신러닝: 복잡함이 코드에서 데이터로', en: 'Machine Learning & What is a Model?', slides: '7–8', mins: 4,
        guide: R`ML의 두 번째 정의와 "모델"의 정의를 다뤄요. 시험용 문장 세 개: <b>main driver</b>, <b>code → data</b>, <b>leap of faith: generalization</b>.`,
        body: R`
<p><b>머신러닝</b>은 <mark>데이터로부터 직접 배우는 모델</mark>을 만드는 AI의 한 갈래입니다. 명시적으로 프로그래밍된 지시 대신, 과거 데이터를 분석해 패턴과 관계를 찾아냅니다.</p>
<div class="viz" data-viz="codevsdata"></div>
<ul>
<li>최근 AI 성공의 <em>주된 동력(main driver)</em>입니다.</li>
<li>복잡함을 <em>"코드"에서 "데이터"로 옮깁니다</em>. 규칙을 사람이 다 쓰지 않고, 데이터가 규칙을 드러내게 합니다.</li>
<li><em>믿음의 도약(leap of faith)</em>이 필요합니다: <b>일반화</b>. 과거 데이터에서 배운 패턴이 새 데이터에도 통할 것이라는 믿음입니다.</li>
</ul>
<h3>모델이란?</h3>
<ul>
<li>현실 세계 과정의 <b>수학적·계산적 추상화</b></li>
<li>입력(데이터)과 출력(예측·결정) 사이의 <b>관계를 표현</b></li>
<li>훈련 중 과거 데이터에서 <b>패턴을 학습</b></li>
<li>학습한 패턴을 <b>일반화</b>해 보지 못한 데이터에 예측</li>
<li>명시적 프로그래밍 대신 데이터 기반 통찰로 문제 해결을 옮겨 <b>복잡함을 단순화</b></li>
</ul>
<div class="tip"><b>한 줄 요약.</b> 모델 = 데이터 → 패턴 → (새 데이터에) 예측. 그리고 그 중간 단계를 믿는 것이 "일반화"라는 도약이에요.</div>`,
        points: [
          'ML 두 번째 정의: "models which learn directly from data… analyze historical data to uncover patterns and relationships"',
          '세 줄 요약: (1) main driver of recent successes (2) move complexity from code to data (3) leap of faith: generalization',
          '모델의 5가지 성격: abstraction / relationship input→output / learns patterns / generalizes / simplifies complexity'
        ],
        terms: [['model', '모델 (현실 과정의 수학적 추상화)'], ['leap of faith', '믿음의 도약 (일반화에 대한)'], ['historical data', '과거(이력) 데이터']],
        quiz: [
          { q: '"머신러닝은 복잡함을 ____에서 ____로 옮긴다"의 빈칸 순서는?', c: ['데이터 → 코드', '코드 → 데이터', '모델 → 알고리즘', '하드웨어 → 소프트웨어'], a: 1, why: '규칙을 코드로 쓰는 대신 데이터가 규칙을 드러내게 하므로 복잡함이 코드에서 데이터로 이동합니다.' },
          { ox: true, q: '슬라이드에서 ML이 요구하는 "믿음의 도약(leap of faith)"은 일반화(generalization)를 가리킨다.', a: true, why: '과거 데이터에서 배운 패턴이 보지 못한 데이터에도 통할 것이라는 믿음이 일반화입니다.' }
        ]
      },
      {
        id: '1-4', title: '광고 데이터와 표기법: Y = f(X) + ε', en: 'Example & Notations', slides: '9–10', mins: 5,
        guide: R`이제 수식이 처음 나와요. 겁먹지 마세요. 하나의 식 $Y=f(X)+\varepsilon$과 용어 짝(반응변수 = $Y$, 특징 = $X$)만 익히면 돼요. 이 식이 4개 층 전체를 관통합니다.`,
        body: R`
<p>Advertising 데이터: 200개 시장에서 TV, Radio, Newspaper 광고비와 판매량(Sales)을 기록했습니다. 각 매체별로 산점도를 그리고 선형회귀선을 따로 맞춘 것이 아래 그림입니다.</p>
<div class="viz" data-viz="adscatter"></div>
<p>질문: 세 변수로 Sales를 예측할 수 있을까? 세 매체를 함께 쓰는 <b>하나의 모델</b>이 더 낫지 않을까?</p>
<div class="formula" data-t="모델링의 출발">$$\text{Sales} \approx f(\text{TV}, \text{Radio}, \text{Newspaper})$$</div>
<h3>표기법</h3>
<ul>
<li>Sales는 우리가 예측하고 싶은 <b>반응(response)</b> 또는 <b>목표(target)</b>. 일반적으로 <b>$Y$</b>라고 씁니다.</li>
<li>TV는 <b>특징(feature)</b>, <b>입력(input)</b>, <b>예측변수(predictor)</b>. $X_1$이라 부르고, Radio는 $X_2$, Newspaper는 $X_3$.</li>
<li>입력 벡터를 한데 모아 $X = (X_1, X_2, X_3)^\top$.</li>
</ul>
<div class="formula" data-t="핵심 모델">$$Y = f(X) + \varepsilon$$<p>$\varepsilon$은 측정 오차와 그 밖의 불일치를 담는 항. <mark>$X$와 독립이고 평균이 0</mark>이라고 가정합니다.</p></div>
<div class="warn"><b>자주 틀리는 것.</b> $\varepsilon$의 두 가지 가정(독립, 평균 0)을 꼭 같이 적으세요. 이 가정이 뒤 객실의 "줄일 수 없는 오차" 유도에서 교차항을 없애 줍니다.</div>`,
        points: [
          '용어 동의어 묶음: response = target = Y / feature = input = predictor = X',
          'Y = f(X) + ε에서 ε의 가정: X와 독립(independent of X), 평균 0(mean zero), 측정 오차·기타 불일치를 포착',
          'Advertising: 200개 시장, 입력 3개(TV, Radio, Newspaper), 출력 Sales'
        ],
        terms: [['response / target', '반응변수 / 목표변수 (Y)'], ['feature / input / predictor', '특징 / 입력 / 예측변수 (X)'], ['error term ε', '오차항']],
        formulas: [R`Y = f(X) + \varepsilon,\quad \mathbb{E}[\varepsilon]=0,\ \varepsilon \perp X`],
        quiz: [
          { q: 'Y = f(X) + ε 에서 ε에 대한 강의의 가정으로 옳은 것은?', c: ['X에 비례한다', 'X와 독립이고 평균이 0이다', '항상 양수다', 'f(X)와 같은 크기다'], a: 1, why: 'ε는 측정 오차와 기타 불일치를 담으며 X와 독립, 평균 0으로 가정합니다.' },
          { q: '다음 중 같은 것을 가리키는 용어 묶음이 아닌 것은?', c: ['response, target', 'feature, input, predictor', 'model, error term', 'Y, response'], a: 2, why: '모델(f)과 오차항(ε)은 서로 다른 것입니다. 나머지는 모두 동의어 묶음입니다.' }
        ]
      },
      {
        id: '1-5', title: '왜 f를 배우는가: 예측과 추론', en: 'Why learn f(X)?', slides: '11', mins: 3,
        guide: R`짧은 객실이에요. $f$를 알면 뭐가 좋은지 세 가지. 시험엔 "예측"과 "어떤 변수가 중요한지(추론)"를 구분해 쓰는 문제가 나올 수 있어요.`,
        body: R`
<p>좋은 $f$가 있으면:</p>
<div class="cols">
<div class="mini"><b class="t">1 · 예측 (prediction)</b>새로운 점 $X = x$에서 $Y$를 예측할 수 있습니다. 광고비를 정하기 전에 판매량을 미리 가늠하는 것.</div>
<div class="mini"><b class="t">2 · 추론 (inference)</b>$X = (X_1, \dots, X_p)$ 중 어떤 성분이 $Y$를 설명하는 데 <mark>중요하고 어떤 것이 무관한지</mark> 알 수 있습니다. 예: Seniority(연차)와 Years of Education(교육 연수)은 Income에 큰 영향을 주지만 Marital Status(혼인 여부)는 아닐 수 있음.</div>
</div>
<p>3. $f$의 복잡도에 따라서는 각 성분 $X_j$가 $Y$에 <b>어떻게</b> 영향을 주는지도 이해할 수 있습니다. (선형이면 "1 증가할 때 $\beta_j$만큼", 복잡하면 알기 어려움)</p>
<div class="tip"><b>연결.</b> 세 번째 항목이 1-10 객실의 "해석력 vs 유연성" 트레이드오프로 이어져요. 유연한 $f$는 예측은 잘하지만 "어떻게"를 설명하기 어렵습니다.</div>`,
        points: [
          'f를 배우는 세 가지 이유: 예측(prediction), 중요한 변수 파악(inference), 각 X_j가 Y에 미치는 영향 방식 이해',
          '슬라이드의 예: Income에 Seniority·Years of Education은 중요, Marital Status는 아닐 수 있음'
        ],
        terms: [['prediction', '예측'], ['inference', '추론 (변수의 중요성·효과 파악)']],
        quiz: [
          { q: '"어떤 특징이 Y를 설명하는 데 중요하고 어떤 것이 무관한지 파악한다"는 f를 배우는 이유 중 무엇에 해당하는가?', c: ['예측', '추론', '일반화', '정규화'], a: 1, why: '변수의 중요성과 효과를 이해하는 것은 추론(inference)입니다.' }
        ]
      },
      {
        id: '1-6', title: '이상적인 f: 회귀함수 E(Y | X = x)', en: 'Is there an ideal f(X)? The regression function', slides: '12–13', mins: 5,
        guide: R`제일 중요한 정의 하나. "이상적인 $f$"는 <b>조건부 기댓값</b>이에요. 슬라이더를 움직여 보면 "같은 $x$에서도 $Y$는 여러 개이고, 그 평균이 $f(x)$"라는 감이 잡혀요.`,
        body: R`
<p>$X = 4$에서 $f(X)$의 좋은 값은 무엇일까요? $X = 4$인 관측이 여럿 있고 그때의 $Y$ 값은 제각각입니다. 그중 좋은 값은 <mark>그 $Y$들의 평균</mark>입니다.</p>
<div class="formula" data-t="회귀함수의 정의">$$f(4) = \mathbb{E}(Y \mid X = 4), \qquad f(x) = \mathbb{E}(Y \mid X = x)$$<p>$\mathbb{E}(Y \mid X = 4)$는 "$X = 4$가 주어졌을 때 $Y$의 기댓값(평균)". 이렇게 정한 $f(x) = \mathbb{E}(Y\mid X = x)$를 <b>회귀함수(regression function)</b>라고 부릅니다.</p></div>
<div class="viz" data-viz="condmean"></div>
<ul>
<li>벡터 $x$에 대해서도 같습니다: $f(x_1, x_2, x_3) = \mathbb{E}(Y \mid X_1 = x_1, X_2 = x_2, X_3 = x_3)$.</li>
<li><b>평균제곱오차(MSE) 기준의 최적 예측기</b>: $f(x) = \mathbb{E}(Y\mid X = x)$는 모든 함수 $g$ 중에서, 모든 점 $X = x$에서 $\mathbb{E}[(Y - g(X))^2 \mid X = x]$를 <mark>최소로 만드는 함수</mark>입니다.</li>
</ul>
<details class="deep"><summary>더 깊이: 왜 조건부 평균이 제곱오차를 최소화하나</summary><div class="body">
<p>$X = x$를 고정하고 상수 $c$로 $Y$를 예측한다고 합시다. $\mathbb{E}[(Y-c)^2 \mid X=x] = \mathrm{Var}(Y\mid X=x) + (\mathbb{E}[Y\mid X=x]-c)^2$ 이므로 $c = \mathbb{E}[Y\mid X = x]$일 때 최소입니다. 이것을 모든 $x$에서 하면 $g = f$가 됩니다.</p></div></details>`,
        points: [
          '정의: 회귀함수 f(x) = E(Y | X = x), "conditional expectation"',
          'f는 제곱오차(MSE) 기준의 이상적(optimal) 예측기: E[(Y − g(X))² | X = x]를 모든 g 중 최소화',
          '같은 x에서도 Y는 분포를 가짐 → 그 평균이 f(x)'
        ],
        terms: [['regression function', '회귀함수 (조건부 기댓값)'], ['conditional expectation', '조건부 기댓값'], ['mean-squared error (MSE)', '평균제곱오차']],
        formulas: [R`f(x) = \mathbb{E}(Y \mid X = x) = \arg\min_{g}\ \mathbb{E}\big[(Y-g(X))^2 \mid X = x\big]`],
        quiz: [
          { q: '평균제곱오차 기준으로 이상적인 f(x)는?', c: ['P(Y | X = x)', 'E(Y | X = x)', 'Var(Y | X = x)', 'max Y'], a: 1, why: '조건부 기댓값 E(Y|X=x)가 모든 g 중 E[(Y−g(X))²|X=x]를 최소화합니다. 이것이 회귀함수입니다.' },
          { ox: true, q: '회귀함수 f(x) = E(Y | X = x)를 정확히 알면 예측 오차는 0이 된다.', a: false, why: '같은 x에서도 Y는 흩어져 있으므로(ε), f를 알아도 Var(ε)만큼의 오차는 남습니다. 다음 객실의 "줄일 수 없는 오차"입니다.' }
        ]
      },
      {
        id: '1-7', title: '줄일 수 있는 오차 vs 줄일 수 없는 오차', en: 'Reducible and irreducible error', slides: '13', mins: 5,
        guide: R`시험 단골 유도예요. 결론 식은 짧아요: <b>기대 제곱오차 = [f − f̂]² + Var(ε)</b>. 어느 쪽이 줄일 수 있는 것인지, 왜 교차항이 사라지는지를 말할 수 있으면 완벽.`,
        body: R`
<p>$\varepsilon = Y - f(x)$는 <b>줄일 수 없는 오차(irreducible error)</b>입니다. 진짜 $f(x)$를 안다 해도 각 $X = x$에서 $Y$는 분포를 가지므로 예측은 여전히 틀립니다.</p>
<p>$f(x)$의 임의의 추정 $\hat f(x)$에 대해:</p>
<div class="formula" data-t="오차 분해">$$\mathbb{E}\big[(Y-\hat f(X))^2 \mid X = x\big] = \mathbb{E}\big[(f(X)+\varepsilon-\hat f(X))^2 \mid X = x\big] = \underbrace{[f(x)-\hat f(x)]^2}_{\text{Reducible}} + \underbrace{\mathrm{Var}(\varepsilon)}_{\text{Irreducible}}$$</div>
<div class="viz" data-viz="errsplit"></div>
<p>이 수업의 초점: <mark>줄일 수 있는 오차(reducible error)를 최소화</mark>하도록 $f$를 추정하는 기법들.</p>
<details class="deep"><summary>더 깊이: 유도 (교차항이 왜 0인가)</summary><div class="body">
<p>$Y - \hat f(x) = [f(x) - \hat f(x)] + \varepsilon$ 이므로 제곱하면</p>
$$[f(x)-\hat f(x)]^2 + 2[f(x)-\hat f(x)]\,\varepsilon + \varepsilon^2 .$$
<p>$X = x$가 주어지면 $f(x) - \hat f(x)$는 상수이고, $\varepsilon$은 $X$와 독립이며 평균이 0이므로 가운데 교차항의 기댓값은 $2[f(x)-\hat f(x)]\cdot\mathbb{E}[\varepsilon] = 0$. 마지막 항은 $\mathbb{E}[\varepsilon^2] = \mathrm{Var}(\varepsilon)$ (평균이 0이므로). 그래서 두 항만 남습니다.</p>
<p>($\hat f$는 훈련 데이터로 만든 고정된 함수로 보고, 기댓값은 새 관측의 $\varepsilon$에 대한 것입니다.)</p></div></details>`,
        points: [
          '분해: E[(Y − f̂(X))² | X = x] = [f(x) − f̂(x)]² (reducible) + Var(ε) (irreducible)',
          '교차항이 0인 이유: ε의 평균이 0이고 X와 독립. Var(ε) = E[ε²]도 평균 0 때문',
          '수업의 목표 = reducible error 최소화. irreducible error는 어떤 모델로도 못 줄임 (테스트 MSE의 하한)'
        ],
        terms: [['reducible error', '줄일 수 있는 오차'], ['irreducible error', '줄일 수 없는 오차']],
        formulas: [R`\mathbb{E}[(Y-\hat f(X))^2\mid X=x] = [f(x)-\hat f(x)]^2 + \mathrm{Var}(\varepsilon)`],
        quiz: [
          { q: '기대 제곱오차 분해에서 "줄일 수 없는 오차"에 해당하는 항은?', c: ['[f(x) − f̂(x)]²', 'Var(ε)', 'Bias(f̂)²', 'Var(f̂)'], a: 1, why: 'Var(ε)는 진짜 f를 알아도 남는 오차입니다.' },
          { q: '분해 과정에서 교차항 2[f(x) − f̂(x)]·ε의 기댓값이 0이 되는 근거는?', c: ['f̂이 불편추정량이어서', 'ε의 평균이 0이고 X와 독립이어서', 'f가 선형이어서', '표본 크기가 커서'], a: 1, why: 'X=x가 주어지면 [f − f̂]는 상수이고 E[ε]=0이므로 교차항의 기댓값이 사라집니다.' }
        ]
      },
      {
        id: '1-8', title: 'f 추정하기: 모수적 vs 비모수적', en: 'How to estimate f: parametric & non-parametric', slides: '14–16', mins: 5,
        guide: R`"어떻게 $f$를 찾을까"의 두 갈래예요. 시험엔 <b>두 방식의 장단점 비교</b>가 서술형으로 나오기 좋아요. 아래 표를 자기 말로 다시 써 보세요.`,
        body: R`
<p>보통 $n$개의 서로 다른 데이터 점을 관측했다고 가정합니다. 이 관측들을 <b>훈련 데이터(training data)</b>라고 부르고, 이것으로 $f$를 추정하는 방법을 "훈련"합니다. 목표: 임의의 관측 $(X, Y)$에 대해 $Y \approx \hat f(X)$가 되는 $\hat f$ 찾기. 대부분의 방법은 <b>모수적(parametric)</b> 아니면 <b>비모수적(non-parametric)</b>입니다.</p>
<div class="viz" data-viz="paramnonparam"></div>
<h3>모수적 · 구조화된 모델</h3>
<div class="formula" data-t="선형 모델 (모수적 모델의 대표)">$$f_L(X) = \beta_0 + \beta_1 X_1 + \beta_2 X_2 + \cdots + \beta_p X_p$$<p>$p+1$개의 모수 $\beta_0, \dots, \beta_p$로 지정되고, 훈련 데이터에 맞춰 모수를 추정합니다. 선형 가정은 <mark>거의 절대 정확히 맞지 않지만</mark>, 진짜 $f$에 대한 좋고 <b>해석 가능한</b> 근사가 되는 경우가 많습니다.</p></div>
<h3>비모수적 모델</h3>
<ul>
<li>$f$의 함수 형태에 대해 <b>명시적 가정을 하지 않음</b>.</li>
<li>너무 거칠거나 구불구불(wiggly)하지 않으면서 데이터 점에 <b>최대한 가까운</b> $f$를 찾음.</li>
</ul>
<div class="tbl-wrap wide"><table class="tbl">
<tr><th></th><th>모수적</th><th>비모수적</th></tr>
<tr><td>가정</td><td>함수 형태를 먼저 정함 (예: 선형)</td><td>형태 가정 없음</td></tr>
<tr><td>위험</td><td>정한 형태가 진짜 $f$와 <b>많이 다를 수 있음</b></td><td>그 위험을 완전히 피함</td></tr>
<tr><td>데이터</td><td>비교적 적어도 됨</td><td>정확한 추정에 <b>매우 많은 관측</b>이 필요</td></tr>
<tr><td>해석</td><td>쉬움</td><td>어려움</td></tr>
</table></div>`,
        points: [
          '훈련 데이터 = f 추정에 쓰는 n개 관측. 목표: Y ≈ f̂(X)',
          '모수적: 형태(선형)를 가정하고 p+1개 모수를 추정. 가정이 정확히 맞는 일은 거의 없지만 해석 가능한 좋은 근사',
          '비모수적: 형태 가정 없음 → 형태를 잘못 고를 위험 없음, 대신 매우 많은 관측 필요'
        ],
        terms: [['training data', '훈련 데이터'], ['parametric model', '모수적 모델'], ['non-parametric model', '비모수적 모델'], ['wiggly / rough', '구불구불한 / 거친']],
        formulas: [R`f_L(X) = \beta_0 + \beta_1 X_1 + \cdots + \beta_p X_p`],
        quiz: [
          { q: '비모수적 방법의 단점으로 슬라이드가 지적한 것은?', c: ['함수 형태를 잘못 고를 위험', '해석이 너무 쉬움', '정확한 추정에 매우 많은 관측이 필요', '모수가 너무 적음'], a: 2, why: '형태 가정을 안 하는 대신 데이터가 많이 필요합니다. 형태를 잘못 고를 위험은 모수적 방법의 단점입니다.' },
          { q: '선형 모델 f_L(X) = β₀ + β₁X₁ + ⋯ + βₚXₚ의 모수 개수는?', c: ['p', 'p + 1', '2p', 'n'], a: 1, why: '기울기 p개에 절편 β₀ 하나를 더해 p + 1개입니다.' }
        ]
      },
      {
        id: '1-9', title: '유연성의 함정: 과적합', en: 'Flexibility & overfitting (Income example)', slides: '17–20', mins: 6,
        guide: R`이 객실의 슬라이더가 이 층에서 제일 중요한 장난감이에요. 차수를 끝까지 올려 보세요. 훈련 점은 다 지나가는데 테스트 오차는 치솟죠? 그게 <b>과적합</b>이에요.`,
        body: R`
<p>슬라이드의 모사 예: $\text{income} = f(\text{education}, \text{seniority}) + \varepsilon$. 빨간 점은 시뮬레이션한 income, 파란 곡면이 진짜 $f$.</p>
<ol>
<li><b>선형회귀 적합</b>: $\hat f(\text{education}, \text{seniority}) = \hat\beta_0 + \hat\beta_1 \cdot \text{education} + \hat\beta_2 \cdot \text{seniority}$. 평평한 평면. 진짜 곡면을 대충만 따라감.</li>
<li><b>더 유연한 회귀</b>: 박판 스플라인(thin-plate spline)으로 유연한 곡면을 맞춤. 적합의 거칠기(roughness)를 우리가 조절.</li>
<li><b>훨씬 더 유연한 스플라인</b>: 훈련 데이터에서 <mark>오차가 하나도 없음</mark>! 이것을 <b>과적합(overfitting)</b>이라고 합니다.</li>
</ol>
<div class="viz" data-viz="flex"></div>
<div class="warn"><b>정의 그대로.</b> 과적합 = 훈련 데이터의 잡음까지 따라가서 훈련 오차는 0에 가깝지만, 새 데이터에서는 나쁜 상태. "훈련 데이터에서 오차가 없다"는 말이 나오면 무조건 과적합을 의심하세요.</div>`,
        points: [
          'Income 예의 3단계: 선형 평면 → 박판 스플라인(거칠기 조절) → 훈련 오차 0인 스플라인 = overfitting',
          '과적합: 훈련 데이터에 오차 없이 맞지만 새 데이터에 일반화가 안 됨',
          '유연성(flexibility)이 커질수록 훈련 오차는 단조 감소, 테스트 오차는 U자'
        ],
        terms: [['overfitting', '과적합'], ['thin-plate spline', '박판 스플라인 (유연한 곡면 적합)'], ['roughness', '거칠기 (적합이 얼마나 구불구불한가)'], ['flexibility', '유연성']],
        quiz: [
          { q: '슬라이드에서 "훈련 데이터에 오류를 하나도 내지 않는" 적합을 부르는 이름은?', c: ['완벽 적합', '과적합(overfitting)', '과소적합(underfitting)', '정규화'], a: 1, why: '훈련 데이터의 잡음까지 따라간 상태를 과적합이라 합니다.' },
          { ox: true, q: '모델의 유연성을 높이면 훈련 데이터의 MSE는 일반적으로 계속 감소한다.', a: true, why: '유연할수록 훈련 점을 더 잘 따라가므로 훈련 MSE는 단조 감소합니다. 문제는 테스트 MSE입니다.' }
        ]
      },
      {
        id: '1-10', title: '트레이드오프와 해석력-유연성 지도', en: 'Some trade-offs · Interpretability vs. flexibility', slides: '21–22', mins: 4,
        guide: R`세 가지 트레이드오프 문장과, 방법들이 지도 위 어디에 있는지를 외우는 객실이에요. 지도의 <b>양 끝</b>(Lasso·부분집합 선택 vs 딥러닝)만 확실히 해도 절반은 먹고 들어가요.`,
        body: R`
<h3>세 가지 트레이드오프</h3>
<ul>
<li><b>예측 정확도 vs 해석력.</b> 선형 모델은 해석하기 쉽고, 박판 스플라인은 그렇지 않습니다.</li>
<li><b>좋은 적합 vs 과적합/과소적합.</b> 적합이 "딱 좋은" 때를 어떻게 알까요? (→ 1-11, 3F 교차검증)</li>
<li><b>간결함(parsimony) vs 블랙박스.</b> 변수 몇 개만 쓰는 단순한 모델을, 전부 쓰는 블랙박스 예측기보다 선호하는 경우가 많습니다.</li>
</ul>
<div class="viz" data-viz="interpmap"></div>
<div class="tip"><b>지도 외우기.</b> 왼쪽 위(해석 쉬움·덜 유연): Subset Selection, Lasso → Least Squares → GAM → Trees → Bagging/Boosting → SVM → 오른쪽 아래 Deep Learning. 대각선을 따라 내려가요.</div>`,
        points: [
          '세 트레이드오프: prediction accuracy vs interpretability / good fit vs over-, under-fit / parsimony vs black-box',
          '지도의 순서(해석력 높음→낮음, 유연성 낮음→높음): Subset Selection, Lasso → Least Squares → GAMs → Trees → Bagging·Boosting → SVM → Deep Learning',
          '왜 간결한 모델을 선호하나: 해석 가능, 변수 적음, 블랙박스 회피'
        ],
        terms: [['interpretability', '해석력'], ['parsimony', '간결함 (변수 적은 단순 모델)'], ['black-box', '블랙박스 (내부를 설명하기 어려운 예측기)']],
        quiz: [
          { q: '해석력-유연성 지도에서 해석력이 가장 높고 유연성이 가장 낮은 쪽에 놓인 방법은?', c: ['Deep Learning', 'Support Vector Machines', 'Subset Selection, Lasso', 'Bagging, Boosting'], a: 2, why: '부분집합 선택과 Lasso가 왼쪽 위(High interpretability, Low flexibility)에 있습니다.' },
          { q: '"우리는 종종 모든 변수를 쓰는 블랙박스보다 변수 몇 개만 쓰는 단순한 모델을 선호한다"는 어떤 트레이드오프의 설명인가?', c: ['정확도 vs 해석력', '좋은 적합 vs 과적합', '간결함 vs 블랙박스', '편향 vs 분산'], a: 2, why: 'parsimony(간결함) versus black-box입니다.' }
        ]
      },
      {
        id: '1-11', title: '모델 정확도 평가: 훈련 MSE vs 테스트 MSE', en: 'Assessing model accuracy', slides: '23–26', mins: 6,
        guide: R`"훈련 오차로 모델을 고르면 안 된다"를 식과 그림으로 못 박는 객실. 예 1·2·3 탭을 눌러 보며 <b>어떤 진짜 $f$일 때 어떤 유연성이 이기는지</b> 감을 잡으세요.`,
        body: R`
<p>훈련 데이터 $\mathrm{Tr} = \{x_i, y_i\}_{i=1}^N$에 모델 $\hat f(x)$를 맞추고 성능을 보고 싶습니다.</p>
<div class="formula" data-t="훈련 MSE">$$\mathrm{MSE}_{\mathrm{Tr}} = \mathrm{Ave}_{i \in \mathrm{Tr}}\big[y_i - \hat f(x_i)\big]^2 = \frac{1}{N}\sum_{i \in \mathrm{Tr}}\big[y_i - \hat f(x_i)\big]^2$$<p>문제: 이 값은 <mark>더 과적합된 모델 쪽으로 편향</mark>될 수 있습니다!</p></div>
<div class="formula" data-t="테스트 MSE (가능하면 이것으로)">$$\mathrm{MSE}_{\mathrm{Te}} = \mathrm{Ave}_{i \in \mathrm{Te}}\big[y_i - \hat f(x_i)\big]^2 = \frac{1}{M}\sum_{i \in \mathrm{Te}}\big[y_i - \hat f(x_i)\big]^2$$<p>훈련 데이터와 다른 <b>새 테스트 데이터</b> $\mathrm{Te} = \{x_i, y_i\}_{i=1}^M$로 계산합니다.</p></div>
<div class="viz" data-viz="ucurve"></div>
<h3>슬라이드의 세 예</h3>
<ul>
<li><b>예 1</b>: 왼쪽은 (알 수 없는) 진짜 $f$(검정)와 세 적합: 선형 모델(주황), 스무딩 스플라인 둘(파랑, 초록). 오른쪽에서 빨간 곡선이 $\mathrm{MSE}_{\mathrm{Te}}$, 회색이 $\mathrm{MSE}_{\mathrm{Tr}}$.</li>
<li><b>예 2</b>: 진짜 $f$가 더 매끈해서 <mark>매끈한 적합과 선형 모델이 잘 함</mark>.</li>
<li><b>예 3</b>: 진짜 $f$가 구불구불하고 잡음이 작아서 <mark>더 유연한 적합이 더 잘 함</mark>.</li>
</ul>
<div class="tip"><b>공통 패턴.</b> 회색(훈련)은 항상 오른쪽으로 내려가고, 빨강(테스트)은 U자. 그리고 빨강의 바닥은 점선 $\mathrm{Var}(\varepsilon)$ 아래로 못 내려가요.</div>`,
        points: [
          'MSE_Tr = (1/N) Σ (y_i − f̂(x_i))², MSE_Te = (1/M) Σ over fresh test data. 훈련 MSE는 과적합 모델 쪽으로 편향',
          '유연성 ↑: 훈련 MSE 단조 감소, 테스트 MSE U자. 테스트 MSE 최소값 ≥ Var(ε)',
          '진짜 f가 매끈하면 선형·매끈한 적합이 유리, 구불구불하고 잡음 작으면 유연한 적합이 유리'
        ],
        terms: [['training MSE / test MSE', '훈련 / 테스트 평균제곱오차'], ['smoothing spline', '스무딩 스플라인']],
        formulas: [R`\mathrm{MSE}_{\mathrm{Te}} = \frac{1}{M}\sum_{i\in \mathrm{Te}}\big[y_i-\hat f(x_i)\big]^2`],
        quiz: [
          { q: '훈련 MSE로 모델의 유연성을 고르면 안 되는 이유로 슬라이드가 든 것은?', c: ['계산이 너무 오래 걸려서', '더 과적합된 모델 쪽으로 편향되기 때문', '테스트 데이터보다 크기가 작아서', '분산을 반영하지 못해서'], a: 1, why: '"This may be biased toward more overfit models!" 훈련 MSE는 유연할수록 계속 줄어듭니다.' },
          { q: '진짜 f가 구불구불하고 잡음이 작을 때, 유연성에 따른 테스트 MSE의 최소는 어디에 있나?', c: ['가장 유연하지 않은 쪽', '유연성이 큰 쪽', '유연성과 무관', '항상 선형 모델'], a: 1, why: '예 3처럼 진짜 f가 복잡하고 잡음이 작으면 유연한 적합이 편향을 크게 줄이므로 유리합니다.' }
        ]
      },
      {
        id: '1-12', title: '편향-분산 트레이드오프', en: 'Bias-Variance Trade-off', slides: '27–28', mins: 7,
        guide: R`1층의 보스 객실이에요. 식 하나, 질문 하나("기댓값은 무엇에 대한 것인가?"), 경향 하나("유연 ↑ → 분산 ↑, 편향 ↓"). 아래 "다시 뽑기" 버튼으로 <b>분산이 무엇인지 눈으로</b> 확인하세요.`,
        body: R`
<p>훈련 데이터 $\mathrm{Tr}$로 $\hat f(x)$를 맞추고, 모집단에서 뽑은 테스트 관측 $(x_0, y_0)$를 생각합니다. 진짜 모델이 $Y = f(X) + \varepsilon$ ($f(x) = \mathbb{E}[Y\mid X = x]$)이면:</p>
<div class="formula" data-t="편향-분산 분해">$$\mathbb{E}\big[y_0 - \hat f(x_0)\big]^2 = \mathrm{Var}\big(\hat f(x_0)\big) + \big[\mathrm{Bias}\big(\hat f(x_0)\big)\big]^2 + \mathrm{Var}(\varepsilon)$$<p>여기서 $\mathrm{Bias}(\hat f(x_0)) = \mathbb{E}[\hat f(x_0)] - f(x_0)$.</p></div>
<h3>기댓값은 무엇에 대한 것인가?</h3>
<p>$y_0$의 변동성 <b>과</b> 훈련 데이터 $\mathrm{Tr}$의 변동성 모두에 대해 평균합니다. 즉 "훈련 데이터를 여러 번 새로 뽑아 $\hat f$를 여러 번 만들었을 때"의 평균입니다. 그래서 $\hat f(x_0)$ 자체가 확률변수이고, $\mathrm{Var}(\hat f(x_0))$이 의미를 가집니다.</p>
<div class="viz" data-viz="resample"></div>
<p>보통 $\hat f$의 유연성이 커질수록 <mark>분산은 커지고 편향은 줄어듭니다</mark>. 따라서 평균 테스트 오차로 유연성을 고르는 일은 곧 <b>편향-분산 트레이드오프</b>입니다.</p>
<div class="viz" data-viz="biasvar"></div>
<div class="warn"><b>세 항 모두 0 이상.</b> 분산, 편향², Var(ε) 모두 음수가 될 수 없으므로 테스트 MSE는 Var(ε)보다 작아질 수 없습니다. 그리고 편향은 "제곱"으로 들어간다는 것도 자주 빠뜨리는 포인트.</div>`,
        points: [
          '분해: E[(y₀ − f̂(x₀))²] = Var(f̂(x₀)) + [Bias(f̂(x₀))]² + Var(ε), Bias = E[f̂(x₀)] − f(x₀)',
          '기댓값은 y₀의 변동성과 훈련 데이터 Tr의 변동성 모두에 대한 것 (f̂이 확률변수)',
          '유연성 ↑ → Var ↑, Bias ↓. 세 항 모두 ≥ 0이므로 테스트 MSE ≥ Var(ε)',
          '분산 = 훈련 데이터가 바뀔 때 f̂이 흔들리는 정도, 편향 = 평균적인 f̂이 진짜 f와 어긋난 정도'
        ],
        terms: [['bias', '편향'], ['variance', '분산'], ['bias-variance trade-off', '편향-분산 트레이드오프']],
        formulas: [R`\mathbb{E}[y_0-\hat f(x_0)]^2 = \mathrm{Var}(\hat f(x_0)) + [\mathrm{Bias}(\hat f(x_0))]^2 + \mathrm{Var}(\varepsilon)`, R`\mathrm{Bias}(\hat f(x_0)) = \mathbb{E}[\hat f(x_0)] - f(x_0)`],
        quiz: [
          { q: '편향-분산 분해에서 기댓값 E[(y₀ − f̂(x₀))²]은 무엇에 대한 평균인가?', c: ['y₀의 변동성에 대해서만', '훈련 데이터 Tr의 변동성에 대해서만', 'y₀의 변동성과 Tr의 변동성 모두', 'x₀의 변동성'], a: 2, why: '슬라이드: "The expectation averages over the variability of y₀ as well as the variability in Tr."' },
          { q: '모델의 유연성이 커질 때 일반적인 경향은?', c: ['편향 ↑, 분산 ↑', '편향 ↓, 분산 ↑', '편향 ↓, 분산 ↓', '편향 ↑, 분산 ↓'], a: 1, why: '유연할수록 진짜 f를 잘 따라가 편향은 줄지만 훈련 데이터에 민감해져 분산은 커집니다.' },
          { q: 'Bias(f̂(x₀))의 정의는?', c: ['f̂(x₀) − y₀', 'E[f̂(x₀)] − f(x₀)', 'Var(f̂(x₀))', 'E[y₀] − f̂(x₀)'], a: 1, why: '여러 훈련 데이터에 대한 f̂(x₀)의 평균이 진짜 f(x₀)에서 얼마나 벗어나는지가 편향입니다.' }
        ]
      }
    ]
  });
})();
