/* 4F — Lecture 4: Classification: Logistic Regression (17 slides) */
(function () {
  const R = String.raw;
  const H = window.HOTEL = window.HOTEL || {}; H.floors = H.floors || [];
  H.floors.push({
    n: 4, title: '분류: 로지스틱 회귀', en: 'class probability', lecture: 'Lecture 4', sub: 'Classification: Logistic Regression', pages: 17,
    welcome: R`4층은 회귀에서 <b>분류</b>로 넘어가요. "왜 선형회귀로는 안 되나" → "로지스틱 함수" → "최대우도로 어떻게 맞추나" → "계수는 어떻게 읽나" → "학생 계수의 부호가 바뀐 이유(교란)" 순서. 계산 문제(확률 구하기)와 유도 문제(로그우도 미분)가 모두 나올 수 있는 층이에요.`,
    rooms: [
      {
        id: '4-1', title: '분류 문제란', en: 'Classification', slides: '2', mins: 3,
        guide: R`분류의 정의와, "분류 라벨보다 <b>확률</b>이 더 값지다"는 문장. 이 문장이 로지스틱 회귀가 확률을 모델링하는 이유예요.`,
        body: R`
<p><b>질적 변수(qualitative variables)</b>는 순서 없는 집합 $\mathcal{C}$의 값을 가집니다.</p>
<div class="formula" data-t="예">$$\text{eye color} \in \{\text{brown}, \text{blue}, \text{green}\}, \qquad \text{email} \in \{\text{spam}, \text{ham}\}$$</div>
<p>특징 벡터 $X$와 $\mathcal{C}$의 값을 갖는 질적 반응 $Y$가 주어질 때, <b>분류(classification)</b>는 $X$를 입력받아 $Y$의 값을 예측하는 함수 $f(X)$를 만드는 일입니다. 즉 $f(X) \in \mathcal{C}$.</p>
<p>그런데 종종 우리는 <mark>$X$가 각 범주에 속할 확률</mark>을 추정하는 데 더 관심이 있습니다. 예: 보험 청구가 사기인지 아닌지의 분류보다, <b>사기일 확률</b>의 추정이 더 값집니다. (확률이 있으면 문턱값을 상황에 맞게 바꿀 수 있고, 얼마나 확신하는지도 알 수 있으니까요.)</p>
<div class="tip"><b>회귀 vs 분류.</b> 반응 $Y$가 양적(숫자)이면 회귀, 질적(범주)이면 분류. 1F~3F는 회귀, 4F는 분류.</div>`,
        points: [
          '질적 변수 = 순서 없는 집합 C의 값. 분류 = X → Y ∈ C를 예측하는 f(X) 만들기',
          '분류 라벨보다 각 범주에 속할 확률 추정이 더 유용한 경우가 많음 (예: 사기 청구 확률)'
        ],
        terms: [['qualitative variable', '질적 변수 (범주형)'], ['classification', '분류'], ['unordered set', '순서 없는 집합']],
        quiz: [
          { q: '슬라이드가 "분류 라벨보다 더 가치 있다"고 한 것은?', c: ['특징의 개수', '각 범주에 속할 확률의 추정', '잔차제곱합', '표본 크기'], a: 1, why: '"it is more valuable to have an estimate of the probability that an insurance claim is fraudulent, than a classification fraudulent or not."' }
        ]
      },
      {
        id: '4-2', title: '신용카드 연체 데이터', en: 'Example: Credit Card Default', slides: '3', mins: 3,
        guide: R`4층 내내 쓰는 데이터 소개. 변수 네 개(balance, income, student, default)와 그림의 인상 하나만: <b>연체자는 balance가 높다, income은 별 차이 없다.</b>`,
        body: R`
<p><b>Default</b> 데이터: 10,000명의 신용카드 고객.</p>
<div class="tbl-wrap wide"><table class="tbl">
<tr><th>변수</th><th>의미</th><th>종류</th></tr>
<tr><td>default</td><td>연체 여부 (No / Yes) — <b>반응변수</b></td><td>질적 (이진)</td></tr>
<tr><td>balance</td><td>월평균 카드 잔액(달러)</td><td>양적</td></tr>
<tr><td>income</td><td>연소득(달러)</td><td>양적</td></tr>
<tr><td>student</td><td>학생 여부 (No / Yes)</td><td>질적</td></tr>
</table></div>
<p>슬라이드의 그림: 왼쪽 산점도(balance vs income, 주황 = 연체 Yes)에서 <mark>연체자는 balance가 높은 쪽</mark>에 몰려 있습니다. 오른쪽 상자그림에서 balance는 연체 Yes 그룹이 확연히 높지만, income은 두 그룹이 비슷합니다.</p>
<div class="tip"><b>미리 감 잡기.</b> 그래서 4-7 이후에 balance 계수는 크고 유의하고, income 계수는 유의하지 않게 나와요(p = 0.71).</div>`,
        points: [
          'Default 데이터: 반응 default(Yes/No), 예측변수 balance, income, student',
          '그림의 인상: 연체자는 balance가 높음, income은 연체 여부와 큰 차이 없음'
        ],
        terms: [['default', '연체 (채무불이행)'], ['balance', '카드 잔액']],
        quiz: [
          { q: 'Default 데이터의 그림에서 연체 여부와 가장 뚜렷하게 연관된 변수는?', c: ['income', 'balance', 'student', '없다'], a: 1, why: '연체자(Yes)의 balance 분포가 확연히 높습니다. income은 두 그룹이 비슷합니다.' }
        ]
      },
      {
        id: '4-3', title: '선형회귀로 분류할 수 있을까?', en: 'Can we use Linear Regression? · Multiclass', slides: '4–6', mins: 6,
        guide: R`이진 분류에서 선형회귀는 "될 것도 같은데 문제가 있고", 다중 클래스에서는 "아예 안 됨". 두 경우의 <b>이유</b>가 다르니 구분해서 외우세요.`,
        body: R`
<h3>이진 반응: Y = 0 (No), 1 (Yes)</h3>
<p>$Y$를 $X$에 선형회귀하고 $\hat Y > 0.5$이면 Yes로 분류하면 어떨까?</p>
<ul>
<li>이진 결과에서는 선형회귀도 분류기로 <b>꽤 잘 작동</b>할 수 있으며, 이는 나중에 다룰 <b>선형판별분석(LDA)</b>과 동등합니다.</li>
<li>모집단에서 $\mathbb{E}(Y\mid X = x) = P(Y = 1\mid X = x)$이므로 회귀가 딱 맞는 도구처럼 보이기도 합니다.</li>
<li>하지만 선형회귀는 <mark>0보다 작거나 1보다 큰 "확률"</mark>을 내놓을 수 있습니다. 그래서 <b>로지스틱 회귀</b>가 더 적절합니다.</li>
</ul>
<div class="viz" data-viz="linvslog"></div>
<h3>다중 클래스: 응급실 환자 분류</h3>
<div class="formula" data-t="세 값을 갖는 반응의 코딩">$$Y = \begin{cases}1 & \text{if stroke}\\ 2 & \text{if drug overdose}\\ 3 & \text{if epileptic seizure}\end{cases}$$</div>
<p>이 코딩은 <mark>순서</mark>를 암시하고, 실제로 뇌졸중과 약물 과다복용의 차이가 약물 과다복용과 발작의 차이와 <b>같다</b>고 말하는 셈입니다. 코딩 순서를 바꾸면 완전히 다른 모델이 됩니다. 선형회귀는 부적절하며, <b>다중 클래스 로지스틱 회귀</b>나 <b>판별분석</b>이 적합합니다.</p>`,
        points: [
          '이진: 선형회귀도 분류기로 꽤 작동(LDA와 동등), E(Y|X) = P(Y=1|X)이지만 확률이 [0, 1]을 벗어날 수 있음 → 로지스틱 회귀',
          '다중 클래스(3개 이상): 1, 2, 3 코딩이 순서와 간격을 암시 → 선형회귀 부적절 → 다중 클래스 로지스틱 회귀 또는 판별분석'
        ],
        terms: [['binary outcome', '이진 결과'], ['linear discriminant analysis (LDA)', '선형판별분석'], ['multiclass', '다중 클래스']],
        quiz: [
          { q: '이진 반응에 선형회귀를 쓸 때의 문제로 슬라이드가 지적한 것은?', c: ['항상 오분류율이 50%다', '추정 확률이 0보다 작거나 1보다 클 수 있다', '계수를 추정할 수 없다', 'X와 Y가 독립이 된다'], a: 1, why: '직선은 유계가 아니므로 확률 범위를 벗어납니다.' },
          { q: '3개 이상의 클래스를 1, 2, 3으로 코딩해 선형회귀를 하면 안 되는 이유는?', c: ['계산량이 너무 많아서', '코딩이 클래스 사이의 순서와 등간격을 암시하기 때문', '잔차가 정규분포가 아니어서', '표본이 부족해서'], a: 1, why: '뇌졸중-약물 과다의 차이와 약물 과다-발작의 차이가 같다고 가정하는 셈입니다.' }
        ]
      },
      {
        id: '4-4', title: '로지스틱 함수와 로짓', en: 'Logistic Regression', slides: '7–8', mins: 6,
        guide: R`4층의 핵심 공식 두 개. S자 곡선 식과 그것을 뒤집은 <b>로그 오즈 = 직선</b>. 슬라이더로 $\beta_0, \beta_1$을 바꾸며 S자가 어떻게 움직이는지 봐 두면 4-7의 해석이 쉬워져요.`,
        body: R`
<p>$p(X) = P(Y = 1\mid X)$라 쓰고, balance로 default를 예측합니다. 로지스틱 회귀는 다음 형태를 씁니다.</p>
<div class="formula" data-t="로지스틱 함수">$$p(X;\beta) = \frac{e^{\beta_0 + \beta_1 X}}{1 + e^{\beta_0 + \beta_1 X}}, \qquad \beta = [\beta_0, \beta_1]$$<p>$e \approx 2.71828$은 오일러 수. $\beta_0, \beta_1, X$가 어떤 값이든 $p(X;\beta)$는 <mark>항상 0과 1 사이</mark>입니다.</p></div>
<div class="viz" data-viz="sigmoid"></div>
<div class="formula" data-t="로그 오즈 (로짓) 변환">$$\log\frac{p(X;\beta)}{1 - p(X;\beta)} = \beta_0 + \beta_1 X$$<p>식을 정리하면 이렇게 됩니다. 이 단조 변환을 $p$의 <b>로그 오즈(log odds)</b> 또는 <b>로짓(logit)</b>이라 합니다. ("log"는 자연로그 $\ln$.)</p></div>
<details class="deep"><summary>더 깊이: 두 식이 같은 것임을 확인</summary><div class="body">
<p>$\eta = \beta_0 + \beta_1 X$라 두면 $p = e^\eta/(1+e^\eta)$, $1 - p = 1/(1+e^\eta)$. 나누면 $p/(1-p) = e^\eta$ (오즈). 로그를 취하면 $\log\frac{p}{1-p} = \eta = \beta_0 + \beta_1 X$. ∎</p>
<p>오즈(odds) $p/(1-p)$는 "일어날 확률 ÷ 안 일어날 확률". $p = 0.5$면 오즈 1, 로그 오즈 0.</p></div></details>
<div class="tip"><b>그림으로 외우기.</b> 확률 축에서는 S자, 로그 오즈 축에서는 직선. 로지스틱 회귀는 "로그 오즈에 대한 선형회귀"예요.</div>`,
        points: [
          'p(X;β) = e^(β₀+β₁X) / (1 + e^(β₀+β₁X)). 항상 (0, 1) 사이',
          '로짓 변환: log[p/(1−p)] = β₀ + β₁X. 로그 오즈가 X의 선형함수. log = 자연로그',
          '오즈 = p/(1−p). p = 0.5 ⇔ 오즈 1 ⇔ 로그 오즈 0 ⇔ β₀ + β₁X = 0'
        ],
        terms: [['logistic function', '로지스틱 함수 (S자)'], ['odds', '오즈 (승산)'], ['log odds / logit', '로그 오즈 / 로짓'], ['monotone transformation', '단조 변환']],
        formulas: [R`p(X;\beta) = \frac{e^{\beta_0+\beta_1 X}}{1+e^{\beta_0+\beta_1 X}}`, R`\log\frac{p(X;\beta)}{1-p(X;\beta)} = \beta_0 + \beta_1 X`],
        quiz: [
          { q: '로지스틱 회귀에서 X의 선형함수 β₀ + β₁X와 같은 것은?', c: ['p(X)', 'p(X)/(1 − p(X))', 'log[p(X)/(1 − p(X))]', '1 − p(X)'], a: 2, why: '로그 오즈(로짓)가 선형입니다. 오즈 자체는 e^(β₀+β₁X).' },
          { q: 'β₀ + β₁X = 0 일 때 p(X)는?', c: ['0', '0.5', '1', 'e'], a: 1, why: 'e⁰/(1 + e⁰) = 1/2.' }
        ]
      },
      {
        id: '4-5', title: '최대우도추정', en: 'Maximum Likelihood Estimation', slides: '9', mins: 5,
        guide: R`"어떤 $\beta$가 가장 그럴듯한가"를 곱셈으로 재는 방법. 그림의 막대(각 관측의 기여)를 보면서 슬라이더로 <b>곱이 최대가 되는 $\beta_1$</b>을 찾아보세요.`,
        body: R`
<p>모수는 <b>최대우도(maximum likelihood)</b>로 추정합니다.</p>
<div class="formula" data-t="우도함수">$$L(\beta) = L(\beta_0, \beta_1) = \prod_{i:\,y_i = 1} p(x_i;\beta)\prod_{j:\,y_j = 0}\big(1 - p(x_j;\beta)\big), \qquad p(x;\beta) = \frac{e^{\beta_0+\beta_1 x}}{1+e^{\beta_0+\beta_1 x}}$$<p>이 우도는 <mark>데이터에서 관측된 0과 1들이 나올 확률</mark>입니다. $y_i = 1$인 관측은 $p(x_i)$를, $y_j = 0$인 관측은 $1 - p(x_j)$를 곱합니다. 관측 데이터의 우도를 최대로 하는 $\beta = [\beta_0, \beta_1]$을 고릅니다.</p></div>
<div class="viz" data-viz="likelihood"></div>
<p>대부분의 통계 패키지가 로지스틱 회귀를 MLE로 적합해 줍니다. 그런데 $\beta$는 MLE로 <b>어떻게</b> 계산될까요? → 다음 객실.</p>
<div class="tip"><b>왜 곱인가.</b> 관측들이 서로 독립이라고 보면 "전부 이렇게 나올 확률" = 각 확률의 곱. 그래서 데이터를 가장 잘 설명하는 $\beta$ = 곱을 최대로 하는 $\beta$.</div>`,
        points: [
          'L(β) = Π_{i: y_i=1} p(x_i;β) · Π_{j: y_j=0} (1 − p(x_j;β)) = 관측된 0/1들이 나올 확률',
          'MLE = 관측 데이터의 우도를 최대로 하는 β 선택',
          'y = 1인 관측은 p, y = 0인 관측은 1 − p를 기여'
        ],
        terms: [['likelihood', '우도 (가능도)'], ['maximum likelihood estimation (MLE)', '최대우도추정']],
        formulas: [R`L(\beta) = \prod_{i:y_i=1} p(x_i;\beta)\prod_{j:y_j=0}\big(1-p(x_j;\beta)\big)`],
        quiz: [
          { q: '로지스틱 회귀의 우도함수 L(β)에서 y_j = 0인 관측이 곱하는 항은?', c: ['p(x_j; β)', '1 − p(x_j; β)', 'log p(x_j; β)', 'β₀ + β₁x_j'], a: 1, why: 'y = 0이 관측될 확률은 1 − p(x_j)입니다.' },
          { ox: true, q: '우도 L(β)는 주어진 β 아래에서 관측된 데이터(0과 1들)가 나올 확률이다.', a: true, why: '"This likelihood gives the probability of the observed zeros and ones in the data."' }
        ]
      },
      {
        id: '4-6', title: '로그우도 최대화', en: 'Log-likelihood · Maximizing Log-likelihood', slides: '10–11', mins: 8,
        guide: R`유도 문제 1순위. 흐름: <b>로그로 곱을 합으로</b> → 한 줄 식으로 정리 → 미분 = 0 → <b>닫힌 해 없음, 반복 최적화</b>. "argmax는 안 변하고 max 값은 변한다"도 꼭.`,
        body: R`
<h3>로그는 곱을 합으로 바꾼다</h3>
<div class="formula" data-t="로그우도">$$\log L(\beta) = \sum_{i:\,y_i = 1}\log p(x_i;\beta) + \sum_{j:\,y_j = 0}\log\big(1 - p(x_j;\beta)\big)$$</div>
<p>로그를 취해도 최대·최소의 <b>위치는 바뀌지 않습니다</b> (로그는 단조증가).</p>
<div class="formula" data-t="argmax는 그대로, max 값은 달라짐">$$\arg\max_\beta \log L(\beta) = \arg\max_\beta L(\beta) \qquad\text{(위치 불변)}$$ $$\max_\beta \log L(\beta) \ne \max_\beta L(\beta) \qquad\text{(최댓값은 달라짐)}$$</div>
<h3>한 줄로 정리하기</h3>
<div class="formula" data-t="로그우도 다시 쓰기">$$\log L(\beta) = \sum_{i=1}^N \Big[y_i \log p(x_i;\beta) + (1 - y_i)\log\big(1 - p(x_i;\beta)\big)\Big] = \sum_{i=1}^N \Big[y_i(\beta_0 + \beta_1 x_i) - \log\big(1 + e^{\beta_0+\beta_1 x_i}\big)\Big]$$</div>
<details class="deep"><summary>더 깊이: 두 번째 등호 유도</summary><div class="body">
<p>$\eta_i = \beta_0 + \beta_1 x_i$라 두면 $\log p = \eta_i - \log(1 + e^{\eta_i})$, $\log(1 - p) = -\log(1 + e^{\eta_i})$. 대입하면</p>
$$y_i[\eta_i - \log(1+e^{\eta_i})] + (1-y_i)[-\log(1+e^{\eta_i})] = y_i\eta_i - \log(1+e^{\eta_i}).$$
<p>$y_i$가 0이면 첫 합, 1이면 둘째 합이 살아남으므로 첫 등호도 성립합니다.</p></div></details>
<h3>미분 = 0</h3>
<div class="formula" data-t="1계 조건">$$\frac{\partial \log L(\beta)}{\partial \beta_1} = \sum_{i=1}^N x_i\big(y_i - p(x_i;\beta)\big) = 0, \qquad \frac{\partial \log L(\beta)}{\partial \beta_0} = \sum_{i=1}^N \big(y_i - p(x_i;\beta)\big) = 0$$</div>
<details class="deep"><summary>더 깊이: 미분 계산</summary><div class="body">
<p>$\frac{\partial}{\partial\eta}\log(1 + e^\eta) = \frac{e^\eta}{1+e^\eta} = p$. 따라서 항 하나를 $\beta_1$로 미분하면 $y_i x_i - p(x_i) x_i = x_i(y_i - p(x_i))$, $\beta_0$으로 미분하면 $y_i - p(x_i)$. 최소제곱의 1계 조건($\sum(y_i - \hat y_i) = 0$, $\sum x_i(y_i - \hat y_i) = 0$)과 모양이 똑같다는 점에 주목!</p></div></details>
<p>$p(x_i;\beta)$가 $\beta$에 비선형이라 <mark>닫힌 형태의 해가 없습니다</mark>. 그래도 <b>반복 최적화</b>(예: 뉴턴-랩슨, 경사상승법)로 $\beta$를 찾을 수 있습니다.</p>
<div class="warn"><b>비교 포인트.</b> 최소제곱(2F)은 정규방정식을 풀면 한 방에 $\hat\beta$가 나오지만, 로지스틱 회귀는 반복 계산이 필요해요. 서술형에서 "왜 닫힌 해가 없나"를 물으면 "$p$가 $\beta$의 비선형 함수(시그모이드)라 1계 조건이 $\beta$에 대한 선형방정식이 아니기 때문"이라고 답하세요.</div>`,
        points: [
          'log L(β) = Σ_{y=1} log p + Σ_{y=0} log(1−p). 로그는 곱→합. argmax 불변, max 값은 변함',
          '한 줄 정리: log L(β) = Σ [y_i(β₀+β₁x_i) − log(1 + e^(β₀+β₁x_i))]',
          '1계 조건: Σ x_i(y_i − p(x_i;β)) = 0, Σ (y_i − p(x_i;β)) = 0',
          '닫힌 해 없음(p가 β에 비선형) → 반복 최적화(뉴턴-랩슨 등)로 계산'
        ],
        terms: [['log-likelihood', '로그우도'], ['closed-form solution', '닫힌 형태의 해'], ['iterative optimization', '반복 최적화']],
        formulas: [R`\log L(\beta) = \sum_{i=1}^N \Big[y_i(\beta_0+\beta_1 x_i) - \log\big(1+e^{\beta_0+\beta_1 x_i}\big)\Big]`, R`\frac{\partial \log L}{\partial \beta_1} = \sum_{i=1}^N x_i\,(y_i - p(x_i;\beta)) = 0,\quad \frac{\partial \log L}{\partial \beta_0} = \sum_{i=1}^N (y_i - p(x_i;\beta)) = 0`],
        quiz: [
          { q: '우도 대신 로그우도를 최대화해도 되는 이유는?', c: ['로그를 취하면 최댓값이 같아지기 때문', '로그가 단조증가라 최대가 되는 β의 위치가 같기 때문', '로그우도는 항상 양수이기 때문', '로그를 취하면 닫힌 해가 생기기 때문'], a: 1, why: 'argmax는 불변, max 값은 변합니다. 닫힌 해는 여전히 없습니다.' },
          { q: '∂ log L/∂β₁ = 0 의 형태로 옳은 것은?', c: ['Σ x_i(y_i − p(x_i;β)) = 0', 'Σ (y_i − x_i) = 0', 'Σ p(x_i;β) = 0', 'Σ x_i y_i = 0'], a: 0, why: 'log(1+e^η)의 미분이 p이므로 항마다 x_i(y_i − p(x_i))가 나옵니다.' },
          { q: '로지스틱 회귀의 MLE에 대한 설명으로 옳은 것은?', c: ['정규방정식을 풀어 한 번에 구한다', '닫힌 형태의 해가 없어 반복 최적화로 구한다', '최소제곱과 같은 해를 준다', '해가 존재하지 않는다'], a: 1, why: '"No closed form solution but still can find β using iterative optimization techniques."' }
        ]
      },
      {
        id: '4-7', title: '계수 해석과 가설검정', en: 'Interpretation', slides: '12', mins: 6,
        guide: R`"$\hat\beta_1 = 0.0055$"를 정확히 말하는 법: <b>확률</b>이 아니라 <b>로그 오즈</b>가 0.0055 늘어요. 그리고 $H_0$가 참이면 $p$가 어떤 상수가 되는지 식으로 쓸 수 있어야 해요.`,
        body: R`
<div class="tbl-wrap wide"><table class="tbl">
<tr><th></th><th class="num">Coefficient</th><th class="num">Std. error</th><th class="num">Z-statistic</th><th class="num">p-value</th></tr>
<tr><td>Intercept</td><td class="num">−10.6513</td><td class="num">0.3612</td><td class="num">−29.5</td><td class="num">&lt; 0.0001</td></tr>
<tr class="hl"><td>balance</td><td class="num">0.0055</td><td class="num">0.0002</td><td class="num">24.9</td><td class="num">&lt; 0.0001</td></tr>
</table></div>
<p class="small muted">(ISLR Table 4.1. 로지스틱 회귀에서는 t 대신 z-통계량이지만 읽는 법은 같음: 계수 ÷ SE. 왜 z인지는 아래 교수님 강의 노트.)</p>
<ul>
<li>$\hat\beta_1 = 0.0055$: balance가 증가하면 연체 <b>확률이 증가</b>하는 방향.</li>
<li>정확히는, balance 한 단위 증가가 <mark>연체의 로그 오즈를 0.0055 단위 증가</mark>시키는 것과 연관됩니다. $\log\frac{p}{1-p} = \beta_0 + \beta_1 X$이니까요. (확률의 증가량은 현재 $X$ 값에 따라 다릅니다. S자 곡선의 기울기가 위치마다 다르므로.)</li>
</ul>
<h3>가설검정</h3>
<div class="formula" data-t="H₀: β₁ = 0 vs H_a: β₁ ≠ 0">$$H_0 \text{ 가 참이면 } p(X;\beta) = \frac{e^{\beta_0}}{1 + e^{\beta_0}}$$<p>즉 연체 확률이 balance에 <b>의존하지 않는</b> 상수가 됩니다. 결과(z = 24.9, p < 0.0001)에 따라 $H_0$를 기각: balance와 연체 확률 사이에 실제로 연관이 있습니다.</p></div>
<div class="tip"><b>오즈로 말하면.</b> balance가 1 늘면 오즈가 $e^{0.0055} \approx 1.0055$배, 100달러 늘면 $e^{0.55} \approx 1.73$배. 시험에서 "오즈비"를 물으면 $e^{\beta_1}$.</div>`,
        points: [
          'β̂₁ = 0.0055 > 0: balance ↑ → 연체 확률 ↑. 정확한 해석: balance 1 단위 증가 → 연체 로그 오즈 0.0055 증가',
          'H₀: β₁ = 0이면 p(X;β) = e^β₀/(1+e^β₀) = balance와 무관한 상수. z = 24.9, p < 0.0001 → 기각',
          '로지스틱 회귀 결과표의 z-statistic = 계수/SE. 오즈비 = e^β₁'
        ],
        terms: [['z-statistic', 'z-통계량'], ['odds ratio', '오즈비 (e^β)']],
        quiz: [
          { q: '로지스틱 회귀에서 β̂₁ = 0.0055의 가장 정확한 해석은?', c: ['balance 1 증가 시 연체 확률이 0.0055 증가', 'balance 1 증가 시 연체의 로그 오즈가 0.0055 증가', 'balance 1 증가 시 연체 확률이 0.55% 증가', 'balance와 연체는 무관'], a: 1, why: 'log[p/(1−p)] = β₀ + β₁X 이므로 β₁은 로그 오즈의 변화량입니다.' },
          { q: 'H₀: β₁ = 0이 참이라면 p(X;β)는?', c: ['0', '0.5', 'e^β₀/(1+e^β₀), balance와 무관한 상수', 'balance에 비례'], a: 2, why: 'β₁ = 0이면 X항이 사라져 확률이 상수가 됩니다.' }
        ]
      },
      {
        id: '4-8', title: '예측 계산하기', en: 'Predictions', slides: '13–14', mins: 5,
        guide: R`계산 문제 그 자체. 계산기에 숫자를 넣어 보면서 <b>지수 → 나누기</b> 두 단계에 익숙해지세요. 학생 변수(0/1)도 같은 방식이에요.`,
        body: R`
<h3>balance = 1,000달러인 사람의 연체 확률은?</h3>
<div class="formula" data-t="balance = 1000">$$p(X;\hat\beta) = \frac{e^{\hat\beta_0 + \hat\beta_1 X}}{1 + e^{\hat\beta_0+\hat\beta_1 X}} = \frac{e^{-10.6513 + 0.0055\times 1000}}{1 + e^{-10.6513 + 0.0055\times 1000}} = 0.006$$</div>
<div class="formula" data-t="balance = 2000">$$p(X;\hat\beta) = \frac{e^{-10.6513 + 0.0055\times 2000}}{1 + e^{-10.6513 + 0.0055\times 2000}} = 0.586$$<p>지수가 $-5.15 \to -0.35$로 변하면서 확률이 0.6%에서 58.6%로 뜁니다. S자의 가파른 구간이기 때문.</p></div>
<div class="viz" data-viz="defaultcalc"></div>
<h3>student를 예측변수로</h3>
<div class="formula" data-t="student (Yes = 1)">$$\hat P(\text{default} = \text{Yes}\mid\text{student} = \text{Yes}) = \frac{e^{-3.5041 + 0.4049\times 1}}{1 + e^{-3.5041 + 0.4049\times 1}} = 0.0431$$ $$\hat P(\text{default} = \text{Yes}\mid\text{student} = \text{No}) = \frac{e^{-3.5041 + 0.4049\times 0}}{1 + e^{-3.5041 + 0.4049\times 0}} = 0.0292$$<p>student만 보면 계수가 <b>양수(0.4049)</b>: 학생이 비학생보다 연체율이 높다(4.31% vs 2.92%).</p></div>
<div class="tip"><b>계산 순서.</b> ① $\eta = \hat\beta_0 + \hat\beta_1 x$ ② $e^\eta$ ③ $e^\eta/(1+e^\eta)$. 셋째 단계 대신 $1/(1+e^{-\eta})$로 계산해도 같아요.</div>`,
        points: [
          'balance 1000: η = −10.6513 + 5.5 = −5.15 → p = 0.006. balance 2000: η = −0.35 → p = 0.586',
          'student 단독 모델: 절편 −3.5041, student 0.4049 → 학생 0.0431, 비학생 0.0292 (학생이 더 높음)',
          '계산 순서: η → e^η → e^η/(1+e^η)'
        ],
        terms: [['dummy variable', '더미 변수 (Yes = 1, No = 0)']],
        formulas: [R`\hat p = \frac{e^{\hat\beta_0+\hat\beta_1 x}}{1+e^{\hat\beta_0+\hat\beta_1 x}}`],
        quiz: [
          { q: 'β̂₀ = −10.6513, β̂₁ = 0.0055일 때 balance = 2000의 연체 확률은 약?', c: ['0.006', '0.35', '0.586', '0.95'], a: 2, why: 'η = −10.6513 + 11 = 0.3487, e^η ≈ 1.417, p = 1.417/2.417 ≈ 0.586.' },
          { q: 'student만 넣은 모델(절편 −3.5041, student 0.4049)에서 학생과 비학생의 연체 확률은?', c: ['학생 0.0431, 비학생 0.0292', '학생 0.0292, 비학생 0.0431', '둘 다 0.0431', '학생 0.586, 비학생 0.006'], a: 0, why: '학생: e^(−3.0992)/(1+e^(−3.0992)) = 0.0431, 비학생: e^(−3.5041)/(1+e^(−3.5041)) = 0.0292.' }
        ]
      },
      {
        id: '4-9', title: '다변량 로지스틱 회귀와 교란', en: 'Logistic regression with several variables · Confounding', slides: '15–16', mins: 7,
        guide: R`4층에서 제일 재미있는 반전. student 계수가 혼자일 땐 <b>+</b>, balance와 같이 넣으면 <b>−</b>. 그림 두 장을 같이 보면 이유가 보여요. 서술형 1순위!`,
        body: R`
<div class="formula" data-t="여러 변수">$$\log\frac{p(X;\beta)}{1 - p(X;\beta)} = \beta_0 + \beta_1 X_1 + \cdots + \beta_p X_p, \qquad p(X;\beta) = \frac{e^{\beta_0+\beta_1X_1+\cdots+\beta_pX_p}}{1 + e^{\beta_0+\beta_1X_1+\cdots+\beta_pX_p}}$$</div>
<div class="tbl-wrap wide"><table class="tbl">
<tr><th></th><th class="num">Coefficient</th><th class="num">Std. error</th><th class="num">Z-statistic</th><th class="num">p-value</th></tr>
<tr><td>Intercept</td><td class="num">−10.8690</td><td class="num">0.4923</td><td class="num">−22.08</td><td class="num">&lt; 0.0001</td></tr>
<tr><td>balance</td><td class="num">0.0057</td><td class="num">0.0002</td><td class="num">24.74</td><td class="num">&lt; 0.0001</td></tr>
<tr><td>income</td><td class="num">0.0030</td><td class="num">0.0082</td><td class="num">0.37</td><td class="num">0.7115</td></tr>
<tr class="hl"><td>student[Yes]</td><td class="num">−0.6468</td><td class="num">0.2362</td><td class="num">−2.74</td><td class="num">0.0062</td></tr>
</table></div>
<p class="small muted">(ISLR Table 4.3, income은 천 달러 단위)</p>
<p><b>왜 student 계수가 전에는 양수였다가 지금은 음수인가?</b></p>
<div class="viz" data-viz="confound"></div>
<ul>
<li>학생은 비학생보다 <mark>balance가 높은 경향</mark>이 있어서, 학생의 <b>주변(marginal) 연체율</b>이 비학생보다 높습니다. (student만 넣으면 +)</li>
<li>하지만 <mark>balance가 같은 수준에서 비교하면</mark> 학생이 비학생보다 <b>덜</b> 연체합니다. (balance를 함께 넣으면 −)</li>
<li>다변량 로지스틱 회귀는 이것을 분리해 낼 수 있습니다.</li>
</ul>
<div class="warn"><b>이 현상의 이름은 교란(confounding).</b> student가 default에 미치는 겉보기 효과가 사실은 balance(교란 변수)를 통해 생긴 것. 3-2의 "상관된 예측변수" 이야기가 분류에서 다시 나온 것이에요. 참고로 income은 p = 0.71로 유의하지 않아요.</div>`,
        points: [
          '다변량: log[p/(1−p)] = β₀ + β₁X₁ + ⋯ + βₚXₚ',
          '결과: balance 0.0057(유의), income 0.0030(p = 0.71, 무의미), student[Yes] −0.6468(유의, 음수!)',
          'student 부호 반전의 이유: 학생은 balance가 높음 → 주변 연체율은 높지만, balance를 고정하면 학생이 덜 연체 = 교란(confounding)',
          '다변량 로지스틱 회귀는 교란을 분리해 냄'
        ],
        terms: [['confounding', '교란'], ['marginal default rate', '주변 연체율 (다른 변수 무시한 전체 비율)']],
        quiz: [
          { q: 'student 계수가 단독 모델에서는 양수, balance를 포함한 모델에서는 음수가 된 이유는?', c: ['데이터 오류', '학생은 balance가 높아 주변 연체율은 높지만, 같은 balance에서는 덜 연체하기 때문(교란)', 'income이 유의해서', '표본 크기가 달라서'], a: 1, why: 'balance가 교란 변수로 작용합니다. 다변량 모델이 이를 분리합니다.' },
          { q: '다변량 로지스틱 회귀 결과에서 유의하지 않은 변수는?', c: ['balance', 'income', 'student', '모두 유의'], a: 1, why: 'income의 p-값은 0.7115입니다.' }
        ]
      },
      {
        id: '4-10', title: '다중 클래스 로지스틱 회귀', en: 'Logistic regression with more than two classes', slides: '17', mins: 5,
        guide: R`마지막 객실. 클래스가 $K$개면 <b>클래스마다 선형함수 하나씩</b>, 그리고 $e^{\eta_k}$를 전체 합으로 나눠 확률로. 슬라이더로 세 막대의 합이 항상 1인 걸 확인해 보세요. 이름은 <b>다항(multinomial) 회귀</b>.`,
        body: R`
<p>지금까지는 두 클래스였습니다. 클래스 $k \in \{1, \dots, K\}$가 여럿이어도 쉽게 일반화됩니다.</p>
<div class="formula" data-t="다중 클래스 로지스틱 회귀 (소프트맥스)">$$P(Y = k\mid X, \beta) = \frac{e^{\beta_{0k} + \beta_{1k}X_1 + \cdots + \beta_{pk}X_p}}{\sum_{\ell=1}^K e^{\beta_{0\ell} + \beta_{1\ell}X_1 + \cdots + \beta_{p\ell}X_p}}$$<p>클래스마다 <mark>선형함수가 하나씩</mark> 있습니다 (계수에 클래스 첨자 $k$). 분모가 모든 클래스의 합이므로 $K$개 확률의 합은 1.</p></div>
<div class="viz" data-viz="softmax"></div>
<ul>
<li>다중 클래스 로지스틱 회귀는 <b>다항 회귀(multinomial regression)</b>라고도 부릅니다.</li>
<li>모수 $\beta$는 역시 <b>MLE</b>로 계산합니다.</li>
</ul>
<details class="deep"><summary>더 깊이: K = 2이면 앞의 로지스틱 함수와 같은가?</summary><div class="body"><p>네. 분자와 분모를 $e^{\eta_2}$로 나누면 $P(Y=1) = e^{\eta_1 - \eta_2}/(1 + e^{\eta_1-\eta_2})$. 두 선형함수의 차이가 하나의 선형함수이므로 4-4의 식과 같습니다. 그래서 실제로는 한 클래스를 기준(계수 0)으로 두고 $K - 1$개의 선형함수만 추정해도 됩니다.</p></div></details>
<div class="tip"><b>4-3과 이어서.</b> 응급실 환자(뇌졸중/약물/발작)를 1, 2, 3으로 코딩해 선형회귀하면 안 되는 이유가 순서 때문이었죠. 소프트맥스는 순서 없이 클래스마다 점수를 매기니 그 문제가 없어요.</div>`,
        points: [
          'P(Y = k | X, β) = e^(β₀ₖ + β₁ₖX₁ + ⋯ + βₚₖXₚ) / Σ_ℓ e^(β₀ℓ + ⋯ + βₚℓXₚ). 클래스마다 선형함수 하나',
          '이름: multiclass logistic regression = multinomial regression. 모수는 MLE',
          'K개 확률의 합 = 1. K = 2이면 이진 로지스틱과 동일'
        ],
        terms: [['multinomial regression', '다항 회귀'], ['softmax', '소프트맥스 (지수를 합으로 정규화)']],
        formulas: [R`P(Y=k\mid X,\beta) = \frac{e^{\beta_{0k}+\beta_{1k}X_1+\cdots+\beta_{pk}X_p}}{\sum_{\ell=1}^K e^{\beta_{0\ell}+\beta_{1\ell}X_1+\cdots+\beta_{p\ell}X_p}}`],
        quiz: [
          { q: '다중 클래스 로지스틱 회귀의 다른 이름은?', c: ['다항 회귀(multinomial regression)', '릿지 회귀', '판별분석', '다항식 회귀(polynomial regression)'], a: 0, why: '"Multiclass logistic regression is also referred to as multinomial regression." 다항식 회귀(3-9)와 헷갈리지 마세요.' },
          { q: '다중 클래스 로지스틱 회귀에서 클래스가 K개일 때 모델의 구조는?', c: ['하나의 선형함수를 K개 구간으로 나눔', '클래스마다 선형함수가 하나씩 있고 지수를 합으로 나눠 확률을 만듦', 'K개의 독립적인 선형회귀', '트리 구조'], a: 1, why: '"Here there is a linear function for each class." 분모는 모든 클래스의 지수 합입니다.' }
        ]
      }
    ]
  });
})();
