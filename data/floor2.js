/* 2F — Lecture 2: Linear Regression, Part I (14 slides) */
(function () {
  const R = String.raw;
  const H = window.HOTEL = window.HOTEL || {}; H.floors = H.floors || [];
  H.floors.push({
    n: 2, title: '선형회귀 I: 최소제곱과 추론', en: 'least squares & inference', lecture: 'Lecture 2', sub: 'Linear Regression, Part I', pages: 14,
    welcome: R`2층은 "가장 단순한 모델"인 단순선형회귀예요. $Y = \beta_0 + \beta_1 X + \varepsilon$ 하나로 <b>추정(최소제곱)</b> → <b>불확실성(표준오차·신뢰구간)</b> → <b>검정(t, p-값)</b> → <b>전체 적합도(RSE, R², F)</b>까지 한 바퀴 돌아요. 계산 문제가 나오기 좋은 층이니 공식은 손으로 한 번씩 써 보세요.`,
    rooms: [
      {
        id: '2-1', title: '선형회귀, 단순하지만 강력한', en: 'Linear Regression', slides: '2–3', mins: 3,
        guide: R`가벼운 도입 객실. "진짜 회귀함수는 절대 선형이 아니다!"라는 문장과, 광고 데이터에 던질 수 있는 <b>여섯 가지 질문</b>만 챙겨요.`,
        body: R`
<p><b>선형회귀</b>는 지도학습의 단순한 접근법으로, $Y$가 $X_1, X_2, \dots, X_p$에 <b>선형으로</b> 의존한다고 가정합니다.</p>
<ul>
<li><mark>진짜 회귀함수는 절대 선형이 아닙니다!</mark></li>
<li>지나치게 단순해 보이지만, 선형회귀는 개념적으로도 실무적으로도 <b>매우 유용</b>합니다. (뒤에 나오는 많은 방법이 선형 모델의 확장)</li>
</ul>
<h3>광고 데이터에 던지는 질문</h3>
<ol>
<li>광고 예산과 판매량 사이에 관계가 <b>있는가</b>?</li>
<li>관계가 있다면 <b>얼마나 강한가</b>?</li>
<li><b>어떤 매체</b>가 판매에 기여하는가?</li>
<li>미래 판매를 <b>얼마나 정확히</b> 예측할 수 있는가?</li>
<li>관계가 <b>선형</b>인가?</li>
<li>매체들 사이에 <b>시너지</b>(상호작용)가 있는가?</li>
</ol>
<div class="tip"><b>미리보기.</b> 1·2번은 이 층의 가설검정과 R²로, 3번은 3F 다중회귀로, 5·6번은 3F의 다항회귀와 상호작용으로 답하게 돼요. 질문 여섯 개가 곧 강의 목차예요.</div>`,
        points: [
          '선형회귀 = 지도학습, Y가 X들에 선형 의존한다고 가정. "True regression functions are never linear!" 그래도 개념·실무 모두 매우 유용',
          '광고 데이터의 여섯 질문: 관계 존재? 강도? 어떤 매체? 예측 정확도? 선형인가? 시너지?'
        ],
        terms: [['supervised learning', '지도학습 (정답 Y가 있는 학습)'], ['synergy', '시너지 (매체 간 상호작용)']],
        quiz: [
          { ox: true, q: '슬라이드에 따르면 진짜 회귀함수는 대체로 선형이므로 선형회귀가 유용하다.', a: false, why: '"True regression functions are never linear!" 그럼에도 선형회귀가 유용한 것은 좋은 근사이자 개념적 토대이기 때문입니다.' }
        ]
      },
      {
        id: '2-2', title: '단순선형회귀 모델과 hat 표기', en: 'Simple linear regression using a single predictor', slides: '4', mins: 3,
        guide: R`모델 식과 "모자(hat)"의 뜻. 모자가 붙으면 <b>추정값</b>이에요. $\beta_1$은 진짜(모르는) 값, $\hat\beta_1$은 데이터로 계산한 값.`,
        body: R`
<div class="formula" data-t="모델">$$Y = \beta_0 + \beta_1 X + \varepsilon$$<p>$\beta_0$(절편)과 $\beta_1$(기울기)은 알 수 없는 두 상수. <b>계수(coefficients)</b> 또는 <b>모수(parameters)</b>라고 부릅니다. $\varepsilon$은 오차항.</p></div>
<div class="viz" data-viz="linemodel"></div>
<div class="formula" data-t="예측">$$\hat y = \hat\beta_0 + \hat\beta_1 x$$<p>계수의 추정값 $\hat\beta_0, \hat\beta_1$이 있으면 $X = x$일 때 $\hat y$로 미래 판매를 예측합니다. <mark>모자(hat)는 추정된 값</mark>을 뜻합니다.</p></div>
<div class="tip"><b>기호 정리.</b> $\beta$ = 모집단의 진짜 값(모름), $\hat\beta$ = 표본에서 계산한 추정값, $\hat y$ = 예측값, $y$ = 실제 관측값. 시험 답안에서 모자를 빠뜨리면 감점 포인트!</div>`,
        points: [
          'Y = β₀ + β₁X + ε. β₀ 절편(intercept), β₁ 기울기(slope), 둘 다 coefficients/parameters',
          'ŷ = β̂₀ + β̂₁x. hat = 추정값. β(모수) vs β̂(추정량) vs ŷ(예측값) 구분'
        ],
        terms: [['intercept', '절편'], ['slope', '기울기'], ['coefficients / parameters', '계수 / 모수'], ['hat (ˆ)', '추정값 표시']],
        formulas: [R`Y = \beta_0 + \beta_1 X + \varepsilon,\qquad \hat y = \hat\beta_0 + \hat\beta_1 x`],
        quiz: [
          { q: '기호 위의 모자(hat), 예를 들어 β̂₁이 뜻하는 것은?', c: ['모집단의 진짜 값', '데이터로 계산한 추정값', '오차항', '표준화된 값'], a: 1, why: 'The hat symbol denotes an estimated value.' }
        ]
      },
      {
        id: '2-3', title: '최소제곱법: 잔차와 RSS', en: 'Estimation of the parameters by least squares', slides: '5', mins: 6,
        guide: R`"최소제곱"이라는 이름이 왜 붙었는지 손으로 느끼는 객실. 슬라이더로 직선을 움직여 <b>정사각형 넓이의 합(RSS)</b>을 가장 작게 만들어 보세요. 그 다음에 공식을 보면 훨씬 편해요.`,
        body: R`
<p>$\hat y_i = \hat\beta_0 + \hat\beta_1 x_i$를 $X$의 $i$번째 값에 대한 예측이라 하면, $e_i = y_i - \hat y_i$가 $i$번째 <b>잔차(residual)</b>입니다.</p>
<div class="formula" data-t="잔차제곱합 (RSS)">$$\mathrm{RSS} = e_1^2 + e_2^2 + \cdots + e_n^2 = \sum_{i=1}^n \big(y_i - \hat\beta_0 - \hat\beta_1 x_i\big)^2$$</div>
<div class="viz" data-viz="lsq"></div>
<p><b>최소제곱법(least squares)</b>은 RSS를 최소로 만드는 $\hat\beta_0, \hat\beta_1$을 고릅니다:</p>
<div class="formula" data-t="최소제곱 추정량">$$\hat\beta_1 = \frac{\sum_{i=1}^n (x_i - \bar x)(y_i - \bar y)}{\sum_{i=1}^n (x_i - \bar x)^2}, \qquad \hat\beta_0 = \bar y - \hat\beta_1 \bar x$$<p>$\bar y = \frac1n\sum y_i$, $\bar x = \frac1n \sum x_i$는 표본 평균.</p></div>
<div class="tip"><b>외우는 요령.</b> $\hat\beta_1$ = "$x$와 $y$의 공분산 ÷ $x$의 분산" (둘 다 $n$으로 나누면 약분). $\hat\beta_0$은 "직선이 $(\bar x, \bar y)$를 지난다"는 뜻. 최소제곱 직선은 항상 평균점을 지나요.</div>`,
        points: [
          '잔차 e_i = y_i − ŷ_i, RSS = Σ e_i². 최소제곱법 = RSS를 최소화하는 β̂₀, β̂₁ 선택',
          'β̂₁ = Σ(x_i − x̄)(y_i − ȳ) / Σ(x_i − x̄)², β̂₀ = ȳ − β̂₁x̄',
          '최소제곱 직선은 (x̄, ȳ)를 지난다 (β̂₀ 식이 바로 그 뜻)'
        ],
        terms: [['residual', '잔차'], ['residual sum of squares (RSS)', '잔차제곱합'], ['least squares', '최소제곱법'], ['sample mean', '표본평균']],
        formulas: [R`\mathrm{RSS} = \sum_{i=1}^n (y_i - \hat\beta_0 - \hat\beta_1 x_i)^2`, R`\hat\beta_1 = \frac{\sum (x_i-\bar x)(y_i-\bar y)}{\sum (x_i-\bar x)^2},\quad \hat\beta_0 = \bar y - \hat\beta_1 \bar x`],
        quiz: [
          { q: '최소제곱법이 최소화하는 양은?', c: ['잔차의 합 Σe_i', '잔차의 절댓값 합 Σ|e_i|', '잔차제곱합 Σe_i²', '예측값의 분산'], a: 2, why: 'RSS = Σ e_i²를 최소화합니다. (잔차의 합은 최소제곱 직선에서 항상 0이 됩니다.)' },
          { q: 'x̄ = 4, ȳ = 10, β̂₁ = 2일 때 β̂₀은?', c: ['2', '4', '10', '18'], a: 0, why: 'β̂₀ = ȳ − β̂₁x̄ = 10 − 2·4 = 2.' }
        ]
      },
      {
        id: '2-4', title: '최소제곱해 유도하기 (advanced)', en: 'Derivation of the least square solutions', slides: '6', mins: 6,
        guide: R`슬라이드에 "advanced"라고 붙어 있지만, 시험에 "유도하라"로 나오기 딱 좋은 분량이에요. 편미분 두 개 = 0에서 출발해서 $\hat\beta_0$ 먼저, $\hat\beta_1$ 나중. 마지막 "Exercise"까지 풀어 두었어요.`,
        body: R`
<p>$\mathrm{RSS} = \sum_{i=1}^n \big(y_i - (\hat\beta_0 + \hat\beta_1 x_i)\big)^2$을 최소화하려면 두 편미분이 0이어야 합니다.</p>
<div class="formula" data-t="1계 조건">$$\frac{\partial}{\partial \hat\beta_0}\mathrm{RSS} = -2\sum_{i=1}^n \big(y_i - (\hat\beta_0 + \hat\beta_1 x_i)\big) = 0 \qquad (1)$$ $$\frac{\partial}{\partial \hat\beta_1}\mathrm{RSS} = -2\sum_{i=1}^n x_i\big(y_i - (\hat\beta_0 + \hat\beta_1 x_i)\big) = 0 \qquad (2)$$</div>
<h3>(1)에서 β̂₀</h3>
<p>$\sum_i y_i - n\hat\beta_0 - \hat\beta_1 \sum_i x_i = 0 \;\Rightarrow\; \hat\beta_0 = \bar y - \hat\beta_1 \bar x$.</p>
<h3>(2)에서 β̂₁</h3>
<p>$\hat\beta_0$을 대입하면</p>
$$\sum_{i=1}^n x_i\big(y_i - (\bar y - \hat\beta_1\bar x + \hat\beta_1 x_i)\big) = 0 \;\Rightarrow\; \sum_{i=1}^n x_i(y_i - \bar y) - \hat\beta_1 \sum_{i=1}^n x_i(x_i - \bar x) = 0$$
<div class="formula" data-t="결과">$$\hat\beta_1 = \frac{\sum_{i=1}^n x_i(y_i - \bar y)}{\sum_{i=1}^n x_i(x_i - \bar x)} = \frac{\sum_{i=1}^n (x_i - \bar x)(y_i - \bar y)}{\sum_{i=1}^n (x_i - \bar x)^2}$$</div>
<details class="deep"><summary>Exercise: 마지막 등호를 보이기</summary><div class="body">
<p>핵심은 $\sum_{i=1}^n (y_i - \bar y) = 0$ 과 $\sum_{i=1}^n (x_i - \bar x) = 0$ (편차의 합은 0).</p>
<p>분자: $\sum (x_i - \bar x)(y_i - \bar y) = \sum x_i (y_i - \bar y) - \bar x \underbrace{\sum (y_i - \bar y)}_{=0} = \sum x_i(y_i - \bar y)$.</p>
<p>분모: $\sum (x_i - \bar x)^2 = \sum x_i(x_i - \bar x) - \bar x\underbrace{\sum (x_i - \bar x)}_{=0} = \sum x_i (x_i - \bar x)$.</p>
<p>따라서 두 분수는 같습니다. ∎</p></div></details>
<div class="warn"><b>주의.</b> (1)은 "잔차의 합이 0", (2)는 "잔차와 $x$의 내적이 0"이라는 뜻. 최소제곱 잔차의 두 성질로도 시험에 나와요.</div>`,
        points: [
          '∂RSS/∂β̂₀ = −2Σ(y_i − β̂₀ − β̂₁x_i) = 0 → β̂₀ = ȳ − β̂₁x̄',
          '∂RSS/∂β̂₁ = −2Σx_i(y_i − β̂₀ − β̂₁x_i) = 0 → β̂₁ = Σx_i(y_i − ȳ)/Σx_i(x_i − x̄) = Σ(x_i−x̄)(y_i−ȳ)/Σ(x_i−x̄)²',
          '마지막 등호의 근거: 편차의 합 Σ(y_i − ȳ) = 0, Σ(x_i − x̄) = 0',
          '1계 조건의 의미: 잔차의 합 = 0, 잔차와 x의 곱의 합 = 0'
        ],
        terms: [['first-order condition', '1계 조건 (미분 = 0)'], ['partial derivative', '편미분']],
        quiz: [
          { q: '유도에서 Σ x_i(y_i − ȳ) = Σ (x_i − x̄)(y_i − ȳ)가 성립하는 이유는?', c: ['x_i가 모두 양수여서', 'Σ(y_i − ȳ) = 0 이어서', 'β̂₀ = 0 이어서', 'n이 충분히 커서'], a: 1, why: 'Σ(x_i − x̄)(y_i − ȳ) = Σx_i(y_i − ȳ) − x̄·Σ(y_i − ȳ)이고 마지막 합이 0입니다.' },
          { q: '1계 조건 (1) ∂RSS/∂β̂₀ = 0 이 뜻하는 최소제곱 잔차의 성질은?', c: ['잔차의 합이 0', '잔차의 분산이 최소', '잔차가 모두 양수', '잔차가 x에 비례'], a: 0, why: '−2Σ(y_i − ŷ_i) = −2Σe_i = 0 이므로 잔차의 합이 0입니다.' }
        ]
      },
      {
        id: '2-5', title: '계수의 정확도: 표준오차와 신뢰구간', en: 'Assessing the accuracy of the coefficient estimates', slides: '8–9', mins: 6,
        guide: R`"β̂₁이 얼마나 믿을 만한가"를 재는 객실. <b>표본 하나 뽑기</b>를 여러 번 눌러 보세요. 뽑을 때마다 $\hat\beta_1$이 달라지죠? 그 흔들림의 크기가 표준오차예요.`,
        body: R`
<p>추정량의 <b>표준오차(standard error, SE)</b>는 <mark>반복 표집(repeated sampling) 아래에서 추정량이 얼마나 변하는지</mark>를 나타냅니다.</p>
<div class="formula" data-t="기울기의 표준오차">$$\mathrm{SE}(\hat\beta_1)^2 = \frac{\sigma^2}{\sum_{i=1}^n (x_i - \bar x)^2}, \qquad \sigma^2 = \mathrm{Var}(\varepsilon)$$</div>
<div class="viz" data-viz="sampling"></div>
<h3>신뢰구간</h3>
<p>표준오차로 <b>신뢰구간</b>을 만듭니다. 슬라이드 표현은 "95%의 확률로 모수의 진짜 값을 포함하게 되는 범위"인데, 여기서 95%는 <b>구간을 만드는 절차</b>에 대한 확률이에요. 교수님 설명: 데이터를 100번 새로 얻어 구간을 100개 만들면 약 95개가 진짜 값을 포함한다. (이미 만든 한 구간에 β₁이 들어 있을 확률이 95%라는 뜻이 아님)</p>
<div class="formula" data-t="기울기의 95% 신뢰구간">$$\hat\beta_1 \pm 2\cdot \mathrm{SE}(\hat\beta_1) \quad\Longrightarrow\quad \big[\hat\beta_1 - 2\,\mathrm{SE}(\hat\beta_1),\ \hat\beta_1 + 2\,\mathrm{SE}(\hat\beta_1)\big]$$<p>"지금과 같은 표본을 반복해서 얻는 시나리오"에서, 이 구간이 진짜 $\beta_1$을 포함할 확률이 약 95%. 광고 데이터에서 $\beta_1$의 95% 신뢰구간은 <b>[0.042, 0.053]</b>.</p></div>
<div class="tip"><b>SE를 작게 만드는 것.</b> 분모 $\sum(x_i - \bar x)^2$이 클수록(= $x$가 넓게 퍼져 있고, $n$이 클수록), 분자 $\sigma^2$이 작을수록 SE가 작아져요. "예측변수가 넓게 퍼져 있으면 기울기를 더 정확히 안다"는 직관.</div>
<details class="deep"><summary>교재 보충: 절편의 표준오차</summary><div class="body"><p>슬라이드엔 없지만 교재(ISLR)에는 $\mathrm{SE}(\hat\beta_0)^2 = \sigma^2\big[\frac1n + \frac{\bar x^2}{\sum(x_i - \bar x)^2}\big]$도 있습니다. 실제로는 $\sigma$를 모르니 잔차로 추정한 RSE(2-8 객실)를 대신 씁니다.</p></div></details>`,
        points: [
          'SE = 반복 표집에서 추정량이 변하는 정도. SE(β̂₁)² = σ² / Σ(x_i − x̄)², σ² = Var(ε)',
          '95% CI: β̂₁ ± 2·SE(β̂₁). 해석은 "반복 표집 시 구간이 진짜 값을 포함할 확률 95%"',
          '광고 데이터 β₁의 95% CI = [0.042, 0.053] (TV 천 달러당 판매 42~53개)',
          'SE가 작아지는 조건: x의 퍼짐(Σ(x_i−x̄)²) 큼, 잡음 σ² 작음'
        ],
        terms: [['standard error (SE)', '표준오차'], ['confidence interval', '신뢰구간'], ['repeated sampling', '반복 표집']],
        formulas: [R`\mathrm{SE}(\hat\beta_1)^2 = \frac{\sigma^2}{\sum_{i=1}^n (x_i-\bar x)^2}`, R`\hat\beta_1 \pm 2\cdot \mathrm{SE}(\hat\beta_1)`],
        quiz: [
          { q: 'SE(β̂₁)를 작게 만드는 상황은?', c: ['x_i들이 모두 비슷한 값일 때', 'Σ(x_i − x̄)²이 클 때', 'σ²이 클 때', 'n이 작을 때'], a: 1, why: 'SE(β̂₁)² = σ²/Σ(x_i − x̄)²이므로 분모(x의 퍼짐)가 클수록 작아집니다.' },
          { q: '95% 신뢰구간 [0.042, 0.053]의 올바른 해석은?', c: ['β̂₁이 이 구간에 있을 확률이 95%', '반복 표집으로 만든 구간들 중 약 95%가 진짜 β₁을 포함한다', '데이터의 95%가 이 구간에 있다', 'β₁이 0.042와 0.053 사이의 균등분포를 따른다'], a: 1, why: '신뢰구간의 확률은 구간(추정 절차)에 대한 것이지 고정된 모수에 대한 것이 아닙니다.' }
        ]
      },
      {
        id: '2-6', title: '가설검정: t-통계량과 p-값', en: 'Hypothesis testing', slides: '10–11', mins: 6,
        guide: R`"관계가 있는가?"를 통계적으로 답하는 방법. 슬라이더로 $|t|$를 키워 보면 색칠된 꼬리(p-값)가 줄어들어요. <b>자유도 n − 2</b>가 왜인지도 기억!`,
        body: R`
<p>표준오차로 계수에 대한 <b>가설검정</b>도 합니다. 가장 흔한 검정:</p>
<ul>
<li>$H_0$: $X$와 $Y$ 사이에 <b>관계가 없다</b> (귀무가설)</li>
<li>$H_A$: $X$와 $Y$ 사이에 <b>어떤 관계가 있다</b> (대립가설)</li>
</ul>
<div class="formula" data-t="수학적으로">$$H_0: \beta_1 = 0 \quad\text{versus}\quad H_A: \beta_1 \ne 0$$<p>$\beta_1 = 0$이면 모델이 $Y = \beta_0 + \varepsilon$으로 줄어들어 $X$는 $Y$와 무관해집니다.</p></div>
<div class="formula" data-t="t-통계량">$$t = \frac{\hat\beta_1 - 0}{\mathrm{SE}(\hat\beta_1)}$$<p>$\beta_1 = 0$이라 가정하면 이 값은 자유도 $n - 2$의 <b>t분포</b>를 따릅니다. "$\hat\beta_1$이 0에서 표준오차 몇 개만큼 떨어져 있는가".</p></div>
<div class="viz" data-viz="tdist"></div>
<p>통계 소프트웨어로 $|t|$ 이상의 값이 관측될 확률을 쉽게 계산할 수 있습니다. 이 확률이 <b>p-값</b>입니다. p-값이 작으면 "$H_0$가 참이라면 이렇게 극단적인 $t$가 나오기 어렵다" → $H_0$ 기각.</p>
<div class="tip"><b>왜 자유도가 n − 2?</b> 모수를 두 개($\beta_0, \beta_1$) 추정했으니 자유도를 2 잃어요. 3F 다중회귀에서는 $n - p - 1$이 돼요.</div>`,
        points: [
          'H₀: β₁ = 0 (관계 없음) vs H_A: β₁ ≠ 0. β₁ = 0이면 Y = β₀ + ε',
          't = (β̂₁ − 0)/SE(β̂₁), H₀ 하에서 자유도 n − 2의 t분포',
          'p-값 = |t| 이상의 값이 관측될 확률. 작으면 H₀ 기각 → 관계가 있다고 선언'
        ],
        terms: [['null hypothesis H₀', '귀무가설'], ['alternative hypothesis H_A', '대립가설'], ['t-statistic', 't-통계량'], ['p-value', 'p-값'], ['degrees of freedom', '자유도']],
        formulas: [R`t = \frac{\hat\beta_1 - 0}{\mathrm{SE}(\hat\beta_1)} \sim t_{n-2}\ \text{under } H_0`],
        quiz: [
          { q: '단순선형회귀에서 H₀: β₁ = 0 검정에 쓰는 t-통계량의 자유도는?', c: ['n', 'n − 1', 'n − 2', 'n − p'], a: 2, why: '모수 두 개(β₀, β₁)를 추정하므로 자유도는 n − 2입니다.' },
          { q: 'p-값의 정의로 옳은 것은?', c: ['H₀가 참일 확률', 'H₀가 참일 때 관측된 |t| 이상의 값이 나올 확률', 'β₁이 0일 확률', '모델이 옳을 확률'], a: 1, why: 'p-값은 귀무가설 하에서 관측치만큼 또는 그보다 극단적인 통계량이 나올 확률입니다.' }
        ]
      },
      {
        id: '2-7', title: '광고 데이터 결과 읽기', en: 'Results for the advertising data', slides: '12', mins: 5,
        guide: R`회귀 결과표를 읽는 연습. 표에서 <b>Coefficient, SE, t, p-value</b> 네 칸의 관계($t$ = Coef ÷ SE)를 눈으로 확인해 두면 어떤 표가 나와도 읽을 수 있어요.`,
        body: R`
<p>Advertising 데이터에서 판매량(units sold, 천 개)을 TV 광고비(천 달러)에 회귀한 최소제곱 결과:</p>
<div class="tbl-wrap wide"><table class="tbl">
<tr><th></th><th class="num">Coefficient</th><th class="num">Std. error</th><th class="num">t-statistic</th><th class="num">p-value</th></tr>
<tr><td>Intercept</td><td class="num">7.0325</td><td class="num">0.4578</td><td class="num">15.36</td><td class="num">&lt; 0.0001</td></tr>
<tr class="hl"><td>TV</td><td class="num">0.0475</td><td class="num">0.0027</td><td class="num">17.67</td><td class="num">&lt; 0.0001</td></tr>
</table></div>
<p class="small muted">(슬라이드 표 = ISLR Table 3.1)</p>
<ul>
<li>$t = 0.0475 / 0.0027 \approx 17.67$. 0에서 표준오차 17개 이상 떨어져 있습니다.</li>
<li>p-값이 매우 작으므로 <mark>귀무가설을 기각</mark>합니다. 즉 TV와 sales 사이에 관계가 존재한다고 선언합니다.</li>
<li>해석: TV 광고비 $1{,}000$달러 추가 → 판매 약 $0.0475 \times 1000 = 47.5$개 증가.</li>
<li>2-5 객실의 95% CI [0.042, 0.053] = $0.0475 \pm 2 \times 0.0027$. 구간이 0을 포함하지 않는 것과 p-값이 작은 것은 같은 이야기.</li>
</ul>
<div class="tip"><b>표 읽기 3초 룰.</b> ① 계수 부호와 크기 ② $|t| > 2$인지 ③ p-값 < 0.05인지. ②와 ③은 거의 같은 판단이에요.</div>`,
        points: [
          'TV 계수 0.0475, SE 0.0027, t = 17.67, p < 0.0001 → H₀ 기각, TV와 sales에 관계 있음',
          '해석: TV 광고 1,000달러 증가 시 판매 약 47.5개(천 단위 0.0475) 증가',
          't = Coefficient / SE, |t| > 2 ⇔ 대략 p < 0.05 ⇔ 95% CI가 0을 안 포함'
        ],
        terms: [['reject the null hypothesis', '귀무가설 기각'], ['units sold', '판매 개수']],
        quiz: [
          { q: '표에서 TV 계수 0.0475, SE 0.0027일 때 t-통계량은 약?', c: ['0.06', '2.0', '17.6', '47.5'], a: 2, why: 't = 0.0475/0.0027 ≈ 17.6.' },
          { q: '이 결과에서 내리는 결론은?', c: ['TV와 sales의 관계를 확인할 수 없다', 'H₀를 기각하고 TV와 sales 사이에 관계가 있다고 선언한다', 'sales가 TV를 유발한다고 증명됐다', 'newspaper가 더 중요하다'], a: 1, why: 'p-값이 매우 작으므로 H₀: β₁ = 0을 기각합니다. (인과관계 증명은 아닙니다.)' }
        ]
      },
      {
        id: '2-8', title: '모델 전체의 정확도: RSE, R², F', en: 'Assessing the overall accuracy of the model', slides: '13–14', mins: 7,
        guide: R`"모델이 전체적으로 얼마나 잘 맞나"의 세 지표. 그림에서 <b>TSS(평균에서의 편차)</b>와 <b>RSS(직선에서의 잔차)</b>를 비교하면 R²가 뭔지 바로 보여요.`,
        body: R`
<div class="formula" data-t="잔차 표준오차 (RSE)">$$\mathrm{RSE} = \sqrt{\frac{\mathrm{RSS}}{n-2}} = \sqrt{\frac{1}{n-2}\sum_{i=1}^n (y_i - \hat y_i)^2}$$<p>RSE는 오차 $\varepsilon$의 <mark>표준편차 $\sigma$의 추정값</mark>. $Y$와 같은 단위로 "평균적으로 얼마나 빗나가는가".</p></div>
<div class="viz" data-viz="tssrss"></div>
<div class="formula" data-t="R² = 설명된 분산의 비율">$$R^2 = \frac{\mathrm{TSS} - \mathrm{RSS}}{\mathrm{TSS}} = 1 - \frac{\mathrm{RSS}}{\mathrm{TSS}}, \qquad \mathrm{TSS} = \sum_{i=1}^n (y_i - \bar y)^2$$<p>TSS는 <b>총제곱합(total sum of squares)</b>: $X$를 전혀 쓰지 않고 평균으로 예측할 때의 변동. RSS는 직선을 쓰고도 남은 변동. 최소제곱 선형회귀(절편 포함)의 훈련 ^2�� 0과 1 사이이고 클수록 좋음. (일반 모델은 평균 예측보다 못하면 음수도 가능: 교수님이 짚은 함정)</p></div>
<p>단순선형회귀에서는 $R^2 = r^2$임을 보일 수 있습니다. $r$은 $X$와 $Y$의 상관계수:</p>
<div class="formula" data-t="상관계수">$$r = \frac{\sum_{i=1}^n (x_i - \bar x)(y_i - \bar y)}{\sqrt{\sum_{i=1}^n (x_i - \bar x)^2}\sqrt{\sum_{i=1}^n (y_i - \bar y)^2}}$$</div>
<h3>광고 데이터 (sales ≈ β₀ + β₁·TV)</h3>
<div class="tbl-wrap wide"><table class="tbl"><tr><th>Quantity</th><th class="num">Value</th></tr><tr><td>Residual standard error</td><td class="num">3.26</td></tr><tr><td>R²</td><td class="num">0.612</td></tr><tr><td>F-statistic</td><td class="num">312.1</td></tr></table></div>
<p>RSE 3.26 = 판매량이 실제로 평균 약 3,260개 빗나감. $R^2 = 0.612$ = TV가 sales 변동의 약 61%를 설명.</p>
<div class="formula" data-t="F-통계량: 예측변수 중 하나라도 유용한가?">$$F = \frac{(\mathrm{TSS} - \mathrm{RSS})/p}{\mathrm{RSS}/(n-p-1)} \sim F_{p,\, n-p-1}$$<p>"적어도 하나의 예측변수가 유용한가?"에 답합니다. 예측변수가 하나면($p=1$) $F = t^2$: $17.67^2 \approx 312$.</p></div>`,
        points: [
          'RSE = √(RSS/(n−2)): 오차 표준편차 σ의 추정. Y의 단위',
          'R² = (TSS − RSS)/TSS = 1 − RSS/TSS, TSS = Σ(y_i − ȳ)². "설명된 분산의 비율"',
          '단순선형회귀에서 R² = r² (r = X, Y 상관계수)',
          '광고(TV): RSE 3.26, R² 0.612, F 312.1. F = [(TSS−RSS)/p]/[RSS/(n−p−1)] ~ F_{p, n−p−1}, "적어도 하나의 예측변수가 유용한가?"'
        ],
        terms: [['residual standard error (RSE)', '잔차 표준오차'], ['total sum of squares (TSS)', '총제곱합'], ['R-squared', '결정계수 (설명된 분산 비율)'], ['correlation', '상관계수'], ['F-statistic', 'F-통계량']],
        formulas: [R`\mathrm{RSE} = \sqrt{\mathrm{RSS}/(n-2)}`, R`R^2 = 1 - \frac{\mathrm{RSS}}{\mathrm{TSS}},\quad \mathrm{TSS} = \sum (y_i-\bar y)^2`, R`F = \frac{(\mathrm{TSS}-\mathrm{RSS})/p}{\mathrm{RSS}/(n-p-1)}`],
        quiz: [
          { q: 'TSS = 100, RSS = 40일 때 R²는?', c: ['0.4', '0.6', '2.5', '60'], a: 1, why: 'R² = 1 − RSS/TSS = 1 − 0.4 = 0.6.' },
          { q: 'RSE가 추정하는 것은?', c: ['β₁의 표준오차', '오차항 ε의 표준편차', 'Y의 평균', 'X와 Y의 상관계수'], a: 1, why: 'RSE is an estimate of the standard deviation of error ε.' },
          { q: 'F-통계량이 답하는 질문은?', c: ['모델이 선형인가?', '적어도 하나의 예측변수가 유용한가?', '잔차가 정규분포인가?', '예측변수들이 서로 독립인가?'], a: 1, why: 'F는 "Is at least one predictor useful?"에 답합니다.' }
        ]
      }
    ]
  });
})();
