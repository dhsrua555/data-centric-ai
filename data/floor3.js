/* 3F — Lecture 3: Linear Regression Part 2, Cross-Validation (33 slides) */
(function () {
  const R = String.raw;
  const H = window.HOTEL = window.HOTEL || {}; H.floors = H.floors || [];
  H.floors.push({
    n: 3, title: '선형회귀 II와 교차검증', en: 'beyond additive & cross-validation', lecture: 'Lecture 3', sub: 'Linear Regression Part 2, Cross-Validation', pages: 33,
    welcome: R`3층은 가장 넓은 층이에요(33장). 앞 절반은 <b>다중선형회귀</b>: 행렬로 푸는 최소제곱, 해가 없을 때, 상호작용, 다항회귀. 뒤 절반은 <b>테스트 오차를 어떻게 추정하나</b>: 검증셋, K-겹 교차검증, LOOCV. 객실이 15개지만 하나하나는 짧으니 두 번에 나눠 보셔도 좋아요.`,
    rooms: [
      {
        id: '3-1', title: '다중선형회귀', en: 'Multiple Linear Regression', slides: '2', mins: 3,
        guide: R`예측변수가 여러 개가 되면 계수의 해석에 <b>"다른 변수를 고정하고(holding all other predictors fixed)"</b>라는 꼬리표가 붙어요. 이 꼬리표가 3층 전체의 주인공이에요.`,
        body: R`
<div class="formula" data-t="모델">$$Y = \beta_0 + \beta_1 X_1 + \beta_2 X_2 + \cdots + \beta_p X_p + \varepsilon$$</div>
<p>$\beta_j$의 해석: <mark>다른 모든 예측변수를 고정한 채</mark> $X_j$가 한 단위 증가할 때 $Y$에 미치는 <b>평균 효과</b>.</p>
<div class="formula" data-t="광고 예">$$\text{sales} = \beta_0 + \beta_1 \cdot \text{TV} + \beta_2 \cdot \text{radio} + \beta_3 \cdot \text{newspaper} + \varepsilon$$</div>
<div class="tip"><b>왜 "고정한 채"가 중요한가.</b> 실제 데이터에서는 TV를 늘릴 때 radio도 같이 늘어나는 경우가 많아요. 그러면 "TV만 늘렸을 때의 효과"를 관측한 적이 없는 셈이라 해석이 어려워져요. 다음 객실에서 자세히.</div>`,
        points: [
          'Y = β₀ + β₁X₁ + ⋯ + βₚXₚ + ε',
          'β_j = 다른 모든 예측변수를 고정(holding all other predictors fixed)한 채 X_j 한 단위 증가의 Y에 대한 평균 효과'
        ],
        terms: [['multiple linear regression', '다중선형회귀'], ['holding all other predictors fixed', '다른 예측변수를 모두 고정한 채']],
        formulas: [R`Y = \beta_0 + \beta_1 X_1 + \cdots + \beta_p X_p + \varepsilon`],
        quiz: [
          { q: '다중선형회귀에서 β_j의 올바른 해석은?', c: ['X_j가 1 증가할 때 Y의 총 변화', '다른 예측변수를 고정한 채 X_j가 1 증가할 때 Y의 평균 변화', 'X_j와 Y의 상관계수', 'X_j의 분산'], a: 1, why: '"the average effect on Y of a one unit increase in X_j, holding all other predictors fixed".' }
        ]
      },
      {
        id: '3-2', title: '계수 해석의 함정: 상관된 예측변수', en: 'Interpreting regression coefficients', slides: '3', mins: 4,
        guide: R`서술형 단골. "예측변수들이 상관되어 있으면 어떤 문제가 생기나?" 두 가지(분산 증가, 해석 위험)와 마지막 경고 문장 <b>"관측 데이터에서는 인과 주장을 피하라"</b>를 챙기세요.`,
        body: R`
<h3>이상적인 시나리오: 예측변수들이 무상관 (balanced design)</h3>
<ul>
<li>각 계수를 <b>따로따로</b> 추정하고 검정할 수 있음.</li>
<li>"다른 변수가 고정된 채 $X_j$의 한 단위 변화가 $Y$의 $\beta_j$ 변화와 연관된다" 같은 해석이 가능.</li>
</ul>
<h3>예측변수 사이의 상관이 일으키는 문제</h3>
<ul>
<li>모든 계수의 <mark>분산이 커지는</mark> 경향, 때로는 극적으로.</li>
<li>해석이 <mark>위험해짐</mark>: $X_j$가 변하면 다른 것도 함께 변하므로 "다른 것을 고정"이 현실에 없음.</li>
</ul>
<div class="warn"><b>관측 데이터(observational data)에서는 인과관계 주장을 피해야 합니다!</b> 회귀계수는 "연관(association)"을 말할 뿐, "TV를 늘리면 판매가 늘어난다"는 인과를 증명하지 않아요.</div>
<div class="tip"><b>연결.</b> 분산이 커지는 이유는 3-4 객실(다중공선성)의 그림으로 보면 명확해져요. 상관 $r$이 1에 가까워질수록 계수 분산이 $1/(1-r^2)$배로 부풀어요.</div>`,
        points: [
          '균형 설계(예측변수 무상관): 계수를 따로 추정·검정, "다른 변수 고정" 해석 가능',
          '예측변수 상관 시: (1) 모든 계수의 분산이 커짐 (2) 해석이 위험해짐 (X_j 변하면 다른 것도 변함)',
          '관측 데이터에서는 인과 주장 금지 (association ≠ causation)'
        ],
        terms: [['balanced design', '균형 설계 (예측변수 무상관)'], ['observational data', '관측 데이터 (실험이 아닌)'], ['causality', '인과성']],
        quiz: [
          { q: '예측변수들 사이에 상관이 있을 때 생기는 문제로 슬라이드가 든 것은?', c: ['R²가 항상 0이 된다', '계수의 분산이 커지고 해석이 위험해진다', '최소제곱해가 항상 존재하지 않는다', '잔차가 커진다'], a: 1, why: '"The variance of all coefficients tends to increase… Interpretations become hazardous."' },
          { ox: true, q: '관측 데이터로 얻은 회귀계수가 유의하면 인과관계가 있다고 주장할 수 있다.', a: false, why: '"Claims of causality should be avoided for observational data!"' }
        ]
      },
      {
        id: '3-3', title: '행렬로 쓰는 최소제곱', en: 'Least square estimator for multiple regression', slides: '4–6', mins: 7,
        guide: R`3층의 핵심 공식 $\hat\beta = (X^\top X)^{-1}X^\top y$. 유도는 짧아요: RSS를 전개하고 $\beta$로 미분해서 0. 시험에 "유도하라"로 나오면 이 객실 그대로 쓰면 돼요.`,
        body: R`
<p>추정값 $\hat\beta_0, \dots, \hat\beta_p$가 있으면 예측은 $\hat y_i = \hat\beta_0 + \hat\beta_1 x_{i1} + \cdots + \hat\beta_p x_{ip}$. 계수는 잔차제곱합을 최소화하는 값으로 추정합니다:</p>
<div class="formula" data-t="RSS">$$\mathrm{RSS} = \sum_{i=1}^n (y_i - \hat y_i)^2 = \sum_{i=1}^n \big(y_i - \hat\beta_0 - \hat\beta_1 x_{i1} - \cdots - \hat\beta_p x_{ip}\big)^2$$</div>
<p>$n$개의 회귀식을 행렬로 한 번에 씁니다.</p>
<div class="viz" data-viz="matrix"></div>
<div class="formula" data-t="행렬 표기">$$y = X\beta + \varepsilon, \qquad y \in \mathbb{R}^n,\ X \in \mathbb{R}^{n\times(p+1)},\ \beta \in \mathbb{R}^{p+1}$$</div>
<div class="formula" data-t="RSS 전개">$$\mathrm{RSS} = (y - X\beta)^\top (y - X\beta) = y^\top y - \beta^\top X^\top y - y^\top X\beta + \beta^\top X^\top X \beta$$</div>
<div class="formula" data-t="미분 = 0">$$\frac{\partial}{\partial \beta}\mathrm{RSS} = -2X^\top y + 2X^\top X\beta = 0 \quad\Longrightarrow\quad \hat\beta = (X^\top X)^{-1} X^\top y$$</div>
<details class="deep"><summary>더 깊이: 미분 규칙 두 개</summary><div class="body">
<p>가운데 두 항은 같은 스칼라이므로 $-2\beta^\top X^\top y$로 합칩니다. $\frac{\partial}{\partial\beta}(a^\top\beta) = a$, $\frac{\partial}{\partial\beta}(\beta^\top A\beta) = 2A\beta$ ($A$ 대칭). $a = X^\top y$, $A = X^\top X$를 넣으면 위 식. 그리고 $X^\top X$가 양의 정부호이면 이 정류점이 최소입니다.</p>
<p>$\hat\beta = (X^\top X)^{-1}X^\top y$에 $p = 1$을 넣으면 2F의 $\hat\beta_1, \hat\beta_0$ 공식이 그대로 나옵니다.</p></div></details>`,
        points: [
          '행렬 표기 y = Xβ + ε. X는 n×(p+1), 첫 열은 절편을 위한 1',
          'RSS = (y − Xβ)ᵀ(y − Xβ) = yᵀy − βᵀXᵀy − yᵀXβ + βᵀXᵀXβ',
          '∂RSS/∂β = −2Xᵀy + 2XᵀXβ = 0 → β̂ = (XᵀX)⁻¹Xᵀy'
        ],
        terms: [['design matrix X', '설계 행렬'], ['normal equations', '정규방정식 (XᵀXβ = Xᵀy)']],
        formulas: [R`\mathrm{RSS} = (y-X\beta)^\top(y-X\beta)`, R`\hat\beta = (X^\top X)^{-1}X^\top y`],
        quiz: [
          { q: '다중선형회귀의 최소제곱 추정량은?', c: ['(XᵀX)Xᵀy', '(XᵀX)⁻¹Xᵀy', 'Xᵀ(XXᵀ)⁻¹y', 'X⁻¹y'], a: 1, why: '∂RSS/∂β = −2Xᵀy + 2XᵀXβ = 0을 풀면 β̂ = (XᵀX)⁻¹Xᵀy.' },
          { q: '설계 행렬 X의 첫 번째 열이 모두 1인 이유는?', c: ['정규화를 위해', '절편 β₀를 행렬 곱 안에 포함시키기 위해', '잔차의 합을 0으로 만들기 위해', 'X가 정방행렬이 되게 하기 위해'], a: 1, why: 'β₀·1 항이 각 행에 들어가도록 첫 열을 1로 채웁니다.' }
        ]
      },
      {
        id: '3-4', title: '최소제곱해가 항상 존재할까?', en: 'Does the least square solution always exist?', slides: '7', mins: 6,
        guide: R`슬라이드는 질문 세 개를 던지고 답을 열어 두었어요. 시험에는 그 답이 나와요: <b>$X^\top X$가 역행렬이 없을 때</b>, 그건 <b>$X$의 열이 선형종속</b>이라는 뜻, 그리고 "완전히는 아니지만 강하게 상관"이면 <b>분산 폭발</b>.`,
        body: R`
<p>$\hat\beta = (X^\top X)^{-1}X^\top y$. 이 추정량은 언제 문제가 생길까요? <mark>$X^\top X$가 가역이 아닐 때</mark>, 즉 $(X^\top X)^{-1}$을 계산할 수 없을 때.</p>
<h3>그때 특징 행렬 X는 어떤 상태인가?</h3>
<p>$X^\top X$가 특이(singular)라는 것은 $X$의 <b>열들이 선형종속</b>이라는 뜻입니다. 예를 들어</p>
<ul>
<li>어떤 특징이 다른 특징들의 선형결합(예: $X_3 = 2X_1 - X_2$, 같은 변수를 단위만 바꿔 두 번 넣음) → <b>완전 공선성</b></li>
<li>관측 수보다 모수가 많음: $n < p + 1$ (열이 행보다 많으면 열들이 독립일 수 없음)</li>
</ul>
<div class="viz" data-viz="collinear"></div>
<h3>완전히는 아니지만 강하게 상관되어 있다면?</h3>
<p>역행렬은 존재하지만 $X^\top X$가 <b>거의 특이</b>하여 $(X^\top X)^{-1}$의 원소가 매우 커집니다. 그러면 $\hat\beta$의 분산이 크게 부풀어(<b>다중공선성, multicollinearity</b>) 계수 추정이 불안정해지고, 3-2에서 본 "계수 분산 증가"가 바로 이것입니다. 3-10 객실의 정규화(릿지)가 이 문제의 처방입니다.</p>
<div class="warn"><b>구분.</b> 완전 공선성 = 해가 유일하게 존재하지 않음(계산 불가). 강한 상관 = 해는 있지만 믿을 수 없음(분산 큼). 둘을 나눠 쓰세요.</div>`,
        points: [
          '문제 상황: XᵀX가 가역이 아님 → (XᵀX)⁻¹ 계산 불가',
          '원인: X의 열들이 선형종속 (한 특징이 다른 특징의 선형결합, 또는 n < p + 1)',
          '강한(불완전) 상관: 역행렬은 존재하지만 거의 특이 → β̂의 분산 폭발 = 다중공선성'
        ],
        terms: [['invertible / singular', '가역 / 특이 (역행렬 없음)'], ['linearly dependent', '선형종속'], ['multicollinearity', '다중공선성']],
        quiz: [
          { q: '최소제곱 추정량 (XᵀX)⁻¹Xᵀy를 계산할 수 없는 경우는?', c: ['잔차가 클 때', 'XᵀX가 가역이 아닐 때', 'n이 클 때', 'y의 분산이 클 때'], a: 1, why: '역행렬이 존재하지 않으면 식 자체를 계산할 수 없습니다.' },
          { q: 'XᵀX가 가역이 아니라는 것은 특징 행렬 X에 대해 무엇을 말해 주는가?', c: ['X의 행이 모두 같다', 'X의 열들이 선형종속이다', 'X의 원소가 모두 양수다', 'X가 정방행렬이다'], a: 1, why: '열이 선형종속이면(예: 한 특징이 다른 특징의 선형결합) XᵀX가 특이행렬이 됩니다.' },
          { q: '특징들이 완전히는 아니지만 강하게 상관되어 있을 때 생기는 일은?', c: ['해가 존재하지 않는다', '해는 존재하지만 계수 분산이 크게 커진다', 'R²가 0이 된다', '아무 문제 없다'], a: 1, why: 'XᵀX가 거의 특이하여 역행렬 원소가 커지고 계수 추정이 불안정해집니다(다중공선성).' }
        ]
      },
      {
        id: '3-5', title: '네 가지 질문과 광고 데이터 다중회귀 결과', en: 'Some important questions · Results for advertising data', slides: '8–9', mins: 6,
        guide: R`다중회귀 결과표를 읽는 객실. 흥미로운 대목은 <b>newspaper</b>예요. 혼자 넣으면 유의한데 셋을 같이 넣으면 무의미해져요. 상관 행렬에서 그 이유를 찾아보세요.`,
        body: R`
<h3>다중회귀에서 던지는 네 가지 질문</h3>
<ol>
<li>예측변수 $X_1, \dots, X_p$ 중 <b>적어도 하나</b>가 $Y$ 예측에 유용한가? (→ F-통계량)</li>
<li><b>모든</b> 예측변수가 $Y$를 설명하는가, 아니면 일부만 유용한가? (→ 변수 선택)</li>
<li>모델이 데이터에 <b>얼마나 잘</b> 맞는가? (→ RSE, R²)</li>
<li>주어진 예측변수 값에서 <b>어떤 값을 예측</b>하고, 얼마나 정확한가?</li>
</ol>
<h3>sales ~ TV + radio + newspaper</h3>
<div class="tbl-wrap wide"><table class="tbl">
<tr><th></th><th class="num">Coefficient</th><th class="num">Std. error</th><th class="num">t-statistic</th><th class="num">p-value</th></tr>
<tr><td>Intercept</td><td class="num">2.939</td><td class="num">0.3119</td><td class="num">9.42</td><td class="num">&lt; 0.0001</td></tr>
<tr><td>TV</td><td class="num">0.046</td><td class="num">0.0014</td><td class="num">32.81</td><td class="num">&lt; 0.0001</td></tr>
<tr><td>radio</td><td class="num">0.189</td><td class="num">0.0086</td><td class="num">21.89</td><td class="num">&lt; 0.0001</td></tr>
<tr class="hl"><td>newspaper</td><td class="num">−0.001</td><td class="num">0.0059</td><td class="num">−0.18</td><td class="num">0.8599</td></tr>
</table></div>
<p class="small muted">(ISLR Table 3.4)</p>
<div class="viz" data-viz="corrgrid"></div>
<p>newspaper만으로 단순회귀를 하면 계수가 유의하지만, 다중회귀에서는 p = 0.86으로 무의미합니다. 상관 행렬을 보면 <mark>radio와 newspaper의 상관이 0.35</mark>: newspaper 광고를 많이 하는 시장은 radio 광고도 많이 하는 경향이 있어, newspaper 혼자 있을 때 radio의 공을 대신 인정받은 것입니다.</p>`,
        points: [
          '네 질문: 적어도 하나 유용한가(F) / 전부인가 일부인가(선택) / 얼마나 잘 맞나(RSE, R²) / 예측값과 정확도',
          '다중회귀 결과: TV 0.046, radio 0.189 유의, newspaper −0.001 (p = 0.86) 무의미',
          'newspaper가 단순회귀에서는 유의했던 이유: radio와 상관 0.35 → 대리 변수(surrogate) 역할',
          '상관: TV–sales 0.78, radio–sales 0.58, newspaper–sales 0.23'
        ],
        terms: [['correlation matrix', '상관 행렬'], ['surrogate', '대리 변수']],
        quiz: [
          { q: '다중회귀에서 newspaper 계수가 무의미(p = 0.86)해진 이유로 알맞은 것은?', c: ['newspaper 데이터에 결측이 많아서', 'newspaper가 radio와 상관되어 단순회귀에서 radio 효과를 대신 반영했기 때문', 'TV 계수가 너무 커서', '표본 크기가 작아서'], a: 1, why: 'radio–newspaper 상관 0.35. radio를 넣으면 newspaper의 겉보기 효과가 사라집니다.' },
          { q: '"예측변수 중 적어도 하나가 유용한가?"에 답하는 통계량은?', c: ['t-통계량', 'F-통계량', 'R²', 'RSE'], a: 1, why: 'F-통계량이 모든 계수가 0이라는 H₀를 한꺼번에 검정합니다.' }
        ]
      },
      {
        id: '3-6', title: '모델 전체의 적합도 비교', en: 'How good is the whole model?', slides: '10', mins: 3,
        guide: R`짧은 숫자 비교 객실. 단순회귀(TV만) → 다중회귀(셋 다)로 가면 $R^2$과 RSE가 어떻게 바뀌는지만 외워요.`,
        body: R`
<p>개별 계수의 p-값과 별개로, 모델 전체의 적합은 $R^2$과 RSE로 봅니다.</p>
<div class="tbl-wrap wide"><table class="tbl">
<tr><th>모델</th><th class="num">R²</th><th class="num">RSE</th><th class="num">F</th></tr>
<tr><td>sales ~ TV (단순, 2F)</td><td class="num">0.612</td><td class="num">3.26</td><td class="num">312.1</td></tr>
<tr class="hl"><td>sales ~ TV + radio + newspaper</td><td class="num">0.897</td><td class="num">1.69</td><td class="num">570</td></tr>
</table></div>
<ul>
<li>$R^2$: 0.612 → <b>0.897</b>. 세 매체가 판매 변동의 약 90%를 설명.</li>
<li>RSE: 3.26 → <b>1.69</b>. 평균 빗나감이 절반 가까이 줄어듦.</li>
</ul>
<div class="tip"><b>주의할 점.</b> 훈련 데이터의 $R^2$은 변수를 추가하면 절대 줄지 않아요(newspaper처럼 무의미한 변수라도). 그래서 "변수를 더 넣었더니 $R^2$이 올랐다"만으로 좋은 모델이라 말할 수 없고, 3-11 이후의 테스트 오차 추정이 필요해요.</div>`,
        points: [
          '단순(TV): R² 0.612, RSE 3.26 / 다중(TV+radio+newspaper): R² 0.897, RSE 1.69',
          '훈련 R²은 변수를 추가하면 감소하지 않음 → 변수 추가의 정당화에는 테스트 오차 필요'
        ],
        terms: [['goodness of fit', '적합도']],
        quiz: [
          { q: 'TV만 쓴 단순회귀에서 세 매체를 모두 쓴 다중회귀로 가면 R²과 RSE는?', c: ['R² 0.612 → 0.897, RSE 3.26 → 1.69', 'R² 0.897 → 0.612, RSE 1.69 → 3.26', '둘 다 변하지 않음', 'R²만 감소'], a: 0, why: '설명력이 커지고(R² ↑) 잔차 표준오차는 줄어듭니다(RSE ↓).' }
        ]
      },
      {
        id: '3-7', title: '가법성을 넘어서: 상호작용(시너지)', en: 'Going beyond additive assumption · Interactions', slides: '11–15', mins: 7,
        guide: R`"라디오 광고가 TV 광고의 효과를 키운다"를 모델에 넣는 법. 탭을 눌러 <b>평행한 직선(가법)</b>과 <b>부채꼴(상호작용)</b>을 비교해 보세요. 69% 계산도 시험에 나오기 좋아요.`,
        body: R`
<p>지금까지의 광고 모델 $\text{sales} \approx \beta_0 + \beta_1\cdot\text{TV} + \beta_2\cdot\text{radio} + \beta_3\cdot\text{newspaper}$는 한 매체를 늘렸을 때의 효과가 <mark>다른 매체에 쓴 금액과 무관</mark>하다고 가정합니다(<b>가법 가정, additive assumption</b>). TV 한 단위 증가의 효과는 radio가 얼마든 항상 $\beta_1$.</p>
<p>그런데 radio 광고가 TV 광고의 효과를 키운다면? TV의 기울기가 radio와 함께 커져야 합니다. 예산 10만 달러를 반반 나눠 쓰는 것이 한 매체에 몰아 쓰는 것보다 판매를 더 늘릴 수 있습니다. 마케팅에서는 <b>시너지 효과</b>, 통계에서는 <b>상호작용 효과(interaction effect)</b>.</p>
<div class="formula" data-t="상호작용 모델">$$Y = \beta_0 + \beta_1 X_1 + \beta_2 X_2 + \beta_3 X_1 X_2 + \varepsilon$$ $$\text{sales} = \beta_0 + \beta_1\cdot\text{TV} + \beta_2\cdot\text{radio} + \beta_3\cdot(\text{TV}\times\text{radio}) + \varepsilon = \beta_0 + (\beta_1 + \beta_3\cdot\text{radio})\cdot\text{TV} + \beta_2\cdot\text{radio} + \varepsilon$$<p>TV의 "기울기"가 $\beta_1 + \beta_3\cdot\text{radio}$로 radio에 따라 변합니다.</p></div>
<div class="viz" data-viz="interaction"></div>
<h3>결과</h3>
<div class="tbl-wrap wide"><table class="tbl">
<tr><th></th><th class="num">Coefficient</th><th class="num">Std. error</th><th class="num">t-statistic</th><th class="num">p-value</th></tr>
<tr><td>Intercept</td><td class="num">6.7502</td><td class="num">0.248</td><td class="num">27.23</td><td class="num">&lt; 0.0001</td></tr>
<tr><td>TV</td><td class="num">0.0191</td><td class="num">0.002</td><td class="num">12.70</td><td class="num">&lt; 0.0001</td></tr>
<tr><td>radio</td><td class="num">0.0289</td><td class="num">0.009</td><td class="num">3.24</td><td class="num">0.0014</td></tr>
<tr class="hl"><td>TV × radio</td><td class="num">0.0011</td><td class="num">0.000</td><td class="num">20.73</td><td class="num">&lt; 0.0001</td></tr>
</table></div>
<ul>
<li>상호작용항 TV×radio의 p-값이 극히 작음 → $H_A: \beta_3 \ne 0$에 대한 강한 증거. 상호작용이 중요합니다.</li>
<li>$R^2$: 상호작용 모델 <b>96.8%</b> vs TV·radio만 쓴 가법 모델 <b>89.7%</b>.</li>
<li>$(96.8 - 89.7)/(100 - 89.7) = 69\%$: 가법 모델 후 <mark>남아 있던 변동의 69%</mark>를 상호작용항이 설명.</li>
<li>TV 광고 $1{,}000$달러 증가 → 판매 $(\hat\beta_1 + \hat\beta_3\cdot\text{radio})\times 1000 = 19 + 1.1\cdot\text{radio}$개 증가.</li>
<li>radio 광고 $1{,}000$달러 증가 → 판매 $(\hat\beta_2 + \hat\beta_3\cdot\text{TV})\times 1000 = 29 + 1.1\cdot\text{TV}$개 증가.</li>
</ul>`,
        points: [
          '가법 가정 = 한 변수의 효과가 다른 변수 값과 무관 (직선들이 평행). 시너지 = 상호작용 = 가법 가정 위반',
          '모델 Y = β₀ + β₁X₁ + β₂X₂ + β₃X₁X₂ + ε. TV의 기울기 = β₁ + β₃·radio',
          'TV×radio 계수 0.0011, p < 0.0001. R² 96.8% vs 89.7%. (96.8−89.7)/(100−89.7) = 69% = 남은 변동 중 상호작용이 설명한 비율',
          '효과 계산: TV +1000달러 → 19 + 1.1·radio개, radio +1000달러 → 29 + 1.1·TV개'
        ],
        terms: [['additive assumption', '가법 가정'], ['interaction effect', '상호작용 효과'], ['synergy effect', '시너지 효과']],
        formulas: [R`Y = \beta_0 + \beta_1 X_1 + \beta_2 X_2 + \beta_3 X_1 X_2 + \varepsilon = \beta_0 + (\beta_1 + \beta_3 X_2)X_1 + \beta_2 X_2 + \varepsilon`],
        quiz: [
          { q: '상호작용 모델 sales = β₀ + β₁TV + β₂radio + β₃(TV×radio)에서 TV의 효과(기울기)는?', c: ['β₁', 'β₁ + β₃·radio', 'β₁ + β₂', 'β₃'], a: 1, why: '식을 TV로 묶으면 (β₁ + β₃·radio)·TV가 되어 기울기가 radio에 의존합니다.' },
          { q: '가법 모델 R² = 89.7%, 상호작용 모델 R² = 96.8%일 때 "(96.8 − 89.7)/(100 − 89.7) ≈ 69%"의 의미는?', c: ['상호작용항이 전체 변동의 69%를 설명', '가법 모델을 적합한 뒤 남은 변동 중 69%를 상호작용항이 설명', 'TV가 69%의 판매를 만든다', 'radio의 효과가 69% 증가'], a: 1, why: '분모 100 − 89.7이 "가법 모델 후 남은 변동"입니다.' }
        ]
      },
      {
        id: '3-8', title: '계층 원칙', en: 'Hierarchy for Interactions', slides: '16', mins: 3,
        guide: R`한 문장짜리 규칙이지만 서술형으로 "이유"까지 물어요. 규칙 + 이유 두 줄 세트로 외우세요.`,
        body: R`
<p>상호작용항의 p-값은 매우 작은데, 관련된 <b>주효과(main effects)</b>(여기서는 TV와 radio)의 p-값은 유의하지 않은 경우가 있습니다.</p>
<div class="formula" data-t="계층 원칙 (hierarchy principle)"><p style="margin:0;font-size:1.02rem;color:var(--plum)">모델에 상호작용을 포함하면, 주효과의 p-값이 유의하지 않더라도 <mark>주효과도 함께 포함</mark>해야 한다. 예: TV×radio를 넣으면 TV와 radio도 넣는다.</p></div>
<h3>이유</h3>
<ul>
<li>주효과가 없는 모델에서 상호작용은 <b>해석하기 어렵습니다</b>. 의미가 달라져 버립니다.</li>
<li>주효과 항이 없으면 상호작용항이 <b>주효과까지 떠안게</b> 됩니다(상호작용항 안에 주효과가 섞여 들어감).</li>
</ul>
<div class="tip"><b>직관.</b> $Y = \beta_3 X_1 X_2$만 있으면 $X_2 = 0$일 때 $X_1$의 효과가 강제로 0이 돼요. 주효과 $\beta_1 X_1$이 있어야 "radio가 0이어도 TV는 효과가 있다"를 표현할 수 있어요.</div>`,
        points: [
          '계층 원칙: 상호작용 X₁X₂를 넣으면 주효과 X₁, X₂도 (p-값이 유의하지 않아도) 포함',
          '이유: 주효과 없이는 상호작용의 의미가 바뀌어 해석이 어렵고, 상호작용항이 주효과를 떠안게 됨'
        ],
        terms: [['main effect', '주효과'], ['hierarchy principle', '계층 원칙']],
        quiz: [
          { q: '계층 원칙에 따라 TV×radio 상호작용을 모델에 넣을 때 옳은 행동은?', c: ['TV와 radio 주효과가 유의하지 않으면 뺀다', 'TV와 radio 주효과를 유의성과 무관하게 함께 넣는다', 'newspaper도 반드시 넣는다', '상호작용만 남긴다'], a: 1, why: '"If we include an interaction in a model, we should also include the main effects, even if the p-values… are not significant."' }
        ]
      },
      {
        id: '3-9', title: '비선형 관계: 다항회귀', en: 'Non-linear Relationships', slides: '17–19', mins: 6,
        guide: R`"horsepower²을 넣어도 선형 모델인가?" → <b>네!</b> 이 한 문답이 이 객실의 전부예요. 탭으로 차수를 바꿔 보고, 마지막 질문 "왜 더 높은 차수는 안 쓰나"에 스스로 답해 보세요.`,
        body: R`
<p>Auto 데이터: 여러 자동차의 연비(mpg)와 마력(horsepower). 관계가 확실히 휘어 있습니다.</p>
<div class="viz" data-viz="poly"></div>
<p>선형 모델에 비선형 관계를 넣는 간단한 방법: <mark>예측변수를 변환한 항을 추가</mark>합니다.</p>
<div class="formula" data-t="2차 다항회귀">$$\text{mpg} = \beta_0 + \beta_1\cdot\text{horsepower} + \beta_2\cdot\text{horsepower}^2 + \varepsilon$$<p>horsepower의 비선형 함수로 mpg를 예측합니다. 그런데 이것이 선형 모델인가요? <b>네!</b> $X_1 = \text{horsepower}$, $X_2 = \text{horsepower}^2$로 둔 <em>다중선형회귀</em>일 뿐입니다. "선형"은 <b>계수 $\beta$에 대해 선형</b>이라는 뜻입니다.</p></div>
<div class="tbl-wrap wide"><table class="tbl">
<tr><th></th><th class="num">Coefficient</th><th class="num">Std. error</th><th class="num">t-statistic</th><th class="num">p-value</th></tr>
<tr><td>Intercept</td><td class="num">56.9001</td><td class="num">1.8004</td><td class="num">31.6</td><td class="num">&lt; 0.0001</td></tr>
<tr><td>horsepower</td><td class="num">−0.4662</td><td class="num">0.0311</td><td class="num">−15.0</td><td class="num">&lt; 0.0001</td></tr>
<tr class="hl"><td>horsepower²</td><td class="num">0.0012</td><td class="num">0.0001</td><td class="num">10.1</td><td class="num">&lt; 0.0001</td></tr>
</table></div>
<p>$\text{horsepower}^2$을 넣으니 모델이 크게 좋아졌습니다. 그렇다면 $\text{horsepower}^3, ^4, ^5$까지 넣으면 어떨까요? 그림의 5차·12차 곡선처럼 <b>불필요하게 구불구불</b>해지고 과적합의 위험이 커집니다. "어디까지 넣을까"를 정하는 도구가 이 층 뒤쪽의 <b>교차검증</b>입니다.</p>`,
        points: [
          '비선형 관계 = 예측변수의 변환(제곱 등)을 항으로 추가. mpg = β₀ + β₁hp + β₂hp² + ε',
          '이것도 선형 모델: X₁ = hp, X₂ = hp²인 다중선형회귀. "선형"은 계수 β에 대해 선형',
          'hp² 항 계수 0.0012, t = 10.1 유의 → 큰 개선. 더 높은 차수는 과적합 위험 → 교차검증으로 차수 선택'
        ],
        terms: [['polynomial regression', '다항회귀'], ['transformed predictors', '변환된 예측변수']],
        formulas: [R`\text{mpg} = \beta_0 + \beta_1\,\text{hp} + \beta_2\,\text{hp}^2 + \varepsilon`],
        quiz: [
          { q: 'mpg = β₀ + β₁·hp + β₂·hp² + ε 는 선형 모델인가?', c: ['아니다, hp²이 있으므로 비선형 모델이다', '그렇다, X₁ = hp, X₂ = hp²인 다중선형회귀다', '아니다, 계수가 3개라서', '경우에 따라 다르다'], a: 1, why: '"선형"은 모수 β에 대해 선형이라는 뜻입니다. 변환된 예측변수를 쓰는 다중선형회귀입니다.' },
          { q: '슬라이드가 "왜 hp³, hp⁴, hp⁵까지 넣지 않는가?"라고 묻는 이유로 가장 알맞은 것은?', c: ['계산이 불가능해서', '차수를 높이면 과적합되어 테스트 오차가 나빠질 수 있어서', 'R²이 감소해서', '계수가 음수가 되어서'], a: 1, why: '높은 차수는 훈련 데이터의 잡음까지 따라가 요동칩니다. 적절한 차수는 교차검증으로 고릅니다.' }
        ]
      },
      {
        id: '3-10', title: '선형 모델의 확장 지도', en: 'Generalizations of the Linear Model', slides: '20', mins: 2,
        guide: R`앞으로 배울 것들의 목차 객실. 세 묶음만 기억하면 돼요: <b>분류, 비선형·상호작용, 정규화</b>.`,
        body: R`
<p>이 수업의 나머지 대부분은 선형 모델의 범위를 넓히고 적합하는 방법입니다.</p>
<div class="cols">
<div class="mini"><b class="t">분류 문제</b>로지스틱 회귀(4F), 서포트 벡터 머신</div>
<div class="mini"><b class="t">비선형성 · 상호작용</b>트리 기반 방법, 배깅, 랜덤 포레스트, 부스팅</div>
<div class="mini"><b class="t">정규화된 적합</b>릿지 회귀와 라쏘 (다중공선성·과적합의 처방)</div>
</div>
<div class="tip"><b>1F 지도와 연결.</b> 1-10의 해석력-유연성 지도에서 Lasso(왼쪽 위)부터 Bagging/Boosting, SVM(오른쪽 아래)까지가 전부 이 확장 목록에 들어 있어요.</div>`,
        points: [
          '선형 모델의 확장 세 묶음: 분류(로지스틱 회귀, SVM) / 비선형·상호작용(트리, 배깅, 랜덤 포레스트, 부스팅) / 정규화(릿지, 라쏘)'
        ],
        terms: [['regularized fitting', '정규화된 적합'], ['ridge / lasso', '릿지 / 라쏘']],
        quiz: [
          { q: '슬라이드가 "정규화된 적합(regularized fitting)"으로 분류한 방법은?', c: ['로지스틱 회귀', '랜덤 포레스트', '릿지 회귀와 라쏘', '서포트 벡터 머신'], a: 2, why: 'Regularized fitting: Ridge regression and lasso.' }
        ]
      },
      {
        id: '3-11', title: '훈련 오차 vs 테스트 오차', en: 'Training Error versus Test error', slides: '21–22', mins: 4,
        guide: R`1F의 U자 곡선이 다시 나와요. 이번엔 <b>과소적합/과적합 구역</b>과 "편향 큼·분산 작음 ↔ 편향 작음·분산 큼" 꼬리표를 같이 외워요.`,
        body: R`
<ul>
<li><b>테스트 오차</b>: 훈련에 쓰지 않은 <mark>새 관측</mark>에 대해 방법을 적용했을 때의 평균 오차.</li>
<li><b>훈련 오차</b>: 훈련에 쓴 관측에 방법을 적용해 계산하며, 쉽게 구할 수 있음.</li>
<li>둘은 종종 꽤 다르고, 특히 훈련 오차율은 테스트 오차율을 <mark>극적으로 과소평가</mark>할 수 있습니다.</li>
</ul>
<div class="viz" data-viz="traintest"></div>
<div class="warn"><b>시험 문장.</b> "훈련 오차는 테스트 오차의 좋은 추정치가 아니다. 모델 복잡도가 커질수록 훈련 오차는 계속 줄지만 테스트 오차는 어느 시점 이후 다시 커진다(과적합)."</div>`,
        points: [
          '테스트 오차 = 새 관측에서의 평균 오차, 훈련 오차 = 훈련 관측에서의 오차(쉽게 계산)',
          '훈련 오차는 테스트 오차를 극적으로 과소평가할 수 있음',
          '복잡도 축: 왼쪽 과소적합(편향 큼, 분산 작음) ↔ 오른쪽 과적합(편향 작음, 분산 큼)'
        ],
        terms: [['test error', '테스트 오차'], ['training error', '훈련 오차'], ['underfitting', '과소적합']],
        quiz: [
          { q: '훈련 오차율과 테스트 오차율의 관계로 슬라이드가 강조한 것은?', c: ['거의 항상 같다', '훈련 오차율이 테스트 오차율을 극적으로 과소평가할 수 있다', '훈련 오차율이 항상 더 크다', '둘은 무관하다'], a: 1, why: '"the training error rate can dramatically underestimate the test error rate".' }
        ]
      },
      {
        id: '3-12', title: '테스트 오차 추정법과 검증셋 접근', en: 'Prediction-error estimates · Validation-set approach', slides: '23–26', mins: 6,
        guide: R`"테스트 데이터가 없으면 어떻게 하나"의 첫 답: <b>가진 데이터를 둘로 쪼갠다.</b> 버튼을 여러 번 눌러 보면, 쪼갤 때마다 결과 곡선이 달라지는 게 보여요. 그게 다음 객실의 "단점"이에요.`,
        body: R`
<h3>테스트 오차를 추정하는 세 가지 길</h3>
<ul>
<li><b>최선</b>: 크고 별도로 지정된 테스트셋. 하지만 없는 경우가 많음.</li>
<li>훈련 오차율에 <b>수학적 보정</b>을 가해 테스트 오차를 추정: $C_p$ 통계량, AIC, BIC.</li>
<li>훈련 관측의 일부를 적합에서 <mark>빼 두었다가(holding out)</mark> 그 관측에 방법을 적용해 테스트 오차를 추정 ← 이 수업에서 다루는 방법.</li>
</ul>
<h3>검증셋 접근법 (validation-set approach)</h3>
<ul>
<li>가진 표본을 <b>훈련셋</b>과 <b>검증셋(hold-out set)</b> 둘로 <b>무작위</b>로 나눕니다.</li>
<li>훈련셋으로 모델을 맞추고, 그 모델로 검증셋의 반응을 예측합니다.</li>
<li>얻어진 <b>검증셋 오차</b>가 테스트 오차의 추정값. 양적 반응이면 MSE, 질적(이산) 반응이면 오분류율로 잽니다.</li>
</ul>
<div class="viz" data-viz="splitviz"></div>
<h3>예: Auto 데이터</h3>
<p>선형 vs 고차항을 비교하고 싶습니다. 392개 관측을 무작위로 훈련 196, 검증 196으로 나눕니다.</p>
<div class="viz" data-viz="cvvar"></div>
<p>왼쪽은 한 번 나눈 결과, 오른쪽은 여러 번 나눈 결과. 무엇을 보여 주나요? <mark>이 방법으로 추정한 테스트 MSE의 변동성</mark>입니다.</p>`,
        points: [
          '테스트 오차 추정 세 가지: 별도 테스트셋(최선, 드묾) / 훈련 오차 보정(Cp, AIC, BIC) / 홀드아웃 방법(이 수업)',
          '검증셋 접근: 무작위로 훈련셋·검증셋 분할 → 훈련셋 적합 → 검증셋 오차 = 테스트 오차 추정. MSE(양적) 또는 오분류율(질적)',
          'Auto 예: 392 → 196/196. 여러 번 나누면 곡선이 크게 달라짐 = 추정의 변동성'
        ],
        terms: [['validation set / hold-out set', '검증셋 / 홀드아웃셋'], ['misclassification rate', '오분류율'], ['Cp, AIC, BIC', '훈련 오차를 보정하는 모델 선택 기준']],
        quiz: [
          { q: '검증셋 접근법에서 질적(이산) 반응일 때 검증셋 오차를 재는 척도는?', c: ['MSE', '오분류율', 'R²', 'RSE'], a: 1, why: '양적 반응은 MSE, 질적 반응은 misclassification rate.' },
          { q: 'Auto 데이터를 여러 번 다르게 나눠 그린 검증 MSE 곡선들이 보여 주는 것은?', c: ['모든 분할이 같은 결과를 준다', '검증셋 접근으로 추정한 테스트 MSE의 변동성', '선형 모델이 항상 최선', '차수가 높을수록 항상 좋다'], a: 1, why: '"This illustrates the variability in the estimated test MSE that results from this approach."' }
        ]
      },
      {
        id: '3-13', title: '검증셋 접근법의 두 가지 단점', en: 'Drawbacks of validation set approach', slides: '27', mins: 4,
        guide: R`딱 두 가지 단점과, 두 번째 단점의 <b>"왜?"</b>. 슬라이드가 "Why?"라고 묻고 답까지 줬으니 답을 그대로 외우세요.`,
        body: R`
<h3>단점 1 · 변동성이 큼</h3>
<p>검증 추정값은 <mark>정확히 어떤 관측이 훈련셋에, 어떤 관측이 검증셋에 들어갔는지</mark>에 따라 크게 달라질 수 있습니다. (앞 객실의 여러 색 곡선)</p>
<h3>단점 2 · 테스트 오차를 과대평가</h3>
<p>검증 접근에서는 관측의 <b>일부만</b>(검증셋이 아닌 훈련셋에 들어간 것만) 모델 적합에 쓰입니다. 그래서 검증셋 오차는 <mark>전체 데이터로 맞춘 모델의 테스트 오차를 과대평가</mark>하는 경향이 있습니다.</p>
<div class="formula" data-t="왜?"><p style="margin:0;color:var(--plum)">방법을 훈련하는 데 <b>전체 데이터셋의 절반 크기</b>밖에 쓰지 못하기 때문입니다. 통계적 방법은 대개 관측이 적을수록 성능이 나쁘므로, 절반으로 훈련한 모델의 오차는 전체로 훈련했을 때보다 큽니다.</p></div>
<div class="tip"><b>다음 객실 예고.</b> 두 단점을 모두 줄이는 방법이 K-겹 교차검증이에요. 모든 관측을 검증에도 쓰고(변동성 ↓), 매번 $(K-1)/K$만큼의 데이터로 훈련해요(과대평가 ↓).</div>`,
        points: [
          '단점 1: 검증 추정값이 분할 방식에 따라 크게 변함(highly variable)',
          '단점 2: 훈련에 관측의 일부만 쓰므로 전체 데이터 모델의 테스트 오차를 과대평가(overestimate)',
          '과대평가의 이유: 훈련에 전체의 절반 크기만 사용 → 적은 데이터로 훈련한 모델은 더 나쁨'
        ],
        terms: [['overestimate', '과대평가']],
        quiz: [
          { q: '검증셋 접근이 테스트 오차를 과대평가하는 경향이 있는 이유는?', c: ['검증셋이 훈련셋보다 커서', '모델을 전체 데이터의 절반만으로 훈련하기 때문', '무작위 분할이 편향되어서', 'MSE 대신 오분류율을 써서'], a: 1, why: '"Because you only have half the size of the entire dataset to train your method."' },
          { ox: true, q: '검증셋 접근법의 추정값은 어떤 관측이 검증셋에 들어가느냐에 거의 영향을 받지 않는다.', a: false, why: '첫 번째 단점이 바로 분할에 따른 높은 변동성입니다.' }
        ]
      },
      {
        id: '3-14', title: 'K-겹 교차검증', en: 'K-fold Cross-validation', slides: '28–30', mins: 7,
        guide: R`3층의 대표 선수. "▶ 한 번에 하나씩" 버튼으로 <b>fold가 돌아가며 검증셋이 되는</b> 모습을 보세요. 공식의 $n_k/n$ 가중치와 "K = n이면 LOOCV"를 꼭 기억!`,
        body: R`
<ul>
<li>테스트 오차 추정에 <b>널리 쓰이는</b> 방법.</li>
<li>추정값으로 <b>최고의 모델을 고르고</b>, 최종 모델의 테스트 오차가 어느 정도인지 감을 잡음.</li>
<li>아이디어: 데이터를 <mark>같은 크기의 K개 조각</mark>으로 무작위 분할. $k$번째 조각을 빼 두고 나머지 $K-1$개(합쳐서)로 적합한 뒤, 빼 둔 $k$번째 조각을 예측.</li>
<li>이것을 $k = 1, 2, \dots, K$에 대해 차례로 하고 결과를 합칩니다.</li>
</ul>
<div class="viz" data-viz="kfold"></div>
<h3>자세히</h3>
<p>$K$개 조각을 $C_1, \dots, C_K$라 하고 $C_k$는 조각 $k$에 든 관측의 인덱스 집합. 조각 $k$에는 $n_k$개의 관측이 있고, $n$이 $K$의 배수이면 $n_k = n/K$.</p>
<div class="formula" data-t="CV 추정값">$$\mathrm{CV}_{(K)} = \sum_{k=1}^K \frac{n_k}{n}\,\mathrm{MSE}_k, \qquad \mathrm{MSE}_k = \frac{1}{n_k}\sum_{i \in C_k}(y_i - \hat y_i)^2$$<p>$\hat y_i$는 조각 $k$를 <b>뺀</b> 데이터로 얻은 관측 $i$의 예측값. 조각 크기가 같으면 그냥 $K$개 MSE의 평균.</p></div>
<p><b>$K = n$</b>으로 두면 $n$-겹, 즉 <b>단일 관측 제외 교차검증(LOOCV)</b>. 질문: LOOCV에서 각 검증셋의 관측 수는? → <mark>1개</mark>.</p>`,
        points: [
          'K-겹 CV: 데이터를 같은 크기 K조각으로 무작위 분할, 조각 k를 빼고 나머지로 적합, 빼 둔 조각으로 MSE_k. k = 1…K 반복 후 합침',
          'CV_(K) = Σ (n_k/n)·MSE_k, MSE_k = Σ_{i∈C_k}(y_i − ŷ_i)²/n_k',
          'K = n → LOOCV. LOOCV의 검증셋 크기 = 1',
          '용도: 최고 모델(유연성) 선택 + 최종 모델의 테스트 오차 감 잡기'
        ],
        terms: [['K-fold cross-validation', 'K-겹 교차검증'], ['fold', '조각 (겹)'], ['leave-one-out cross-validation (LOOCV)', '단일 관측 제외 교차검증']],
        formulas: [R`\mathrm{CV}_{(K)} = \sum_{k=1}^K \frac{n_k}{n}\,\mathrm{MSE}_k,\qquad \mathrm{MSE}_k = \frac{1}{n_k}\sum_{i\in C_k}(y_i-\hat y_i)^2`],
        quiz: [
          { q: 'n = 100, K = 5인 K-겹 교차검증에서 모델을 적합하는 횟수와 각 검증 조각의 크기는?', c: ['5번, 20개', '20번, 5개', '100번, 1개', '1번, 50개'], a: 0, why: 'K = 5이므로 5번 적합, 각 조각은 n/K = 20개.' },
          { q: 'LOOCV에서 각 검증셋에 들어 있는 관측의 수는?', c: ['n/2', 'K', '1', 'n − 1'], a: 2, why: 'K = n이므로 매번 관측 하나만 빼 둡니다. 훈련셋은 n − 1개.' },
          { q: 'CV_(K) 공식에서 MSE_k 앞의 가중치 n_k/n은 언제 1/K가 되는가?', c: ['항상', 'n이 K의 배수여서 조각 크기가 같을 때', 'K = n일 때만', 'MSE_k가 모두 같을 때'], a: 1, why: 'n_k = n/K이면 n_k/n = 1/K로 단순 평균이 됩니다.' }
        ]
      },
      {
        id: '3-15', title: 'LOOCV와 비교: Auto와 모사 데이터', en: 'LOOCV · Auto data revisited · True vs estimated test MSE', slides: '31–33', mins: 6,
        guide: R`마지막 객실. 그림 두 장의 메시지는 같아요: <b>CV는 오차의 정확한 값보다 "어느 유연성이 최선인지"를 잘 맞힌다.</b> 교재 보충(LOOCV vs K-겹의 편향·분산)은 접어 두었으니 여유 있을 때 읽어요.`,
        body: R`
<h3>LOOCV</h3>
<ul>
<li>훈련셋(파랑)은 <b>한 관측만 빼고 전부</b>.</li>
<li>검증셋(크림)은 <b>관측 하나</b>.</li>
<li>$n$개의 MSE를 평균해 테스트 오차를 추정.</li>
</ul>
<h3>Auto 데이터 다시 보기</h3>
<p>LOOCV(왼쪽)와 10-겹 CV(오른쪽)로 다항식 차수별 테스트 MSE를 추정하면 두 곡선이 매우 비슷합니다. 둘 다 "2차에서 크게 좋아지고 그 뒤로는 이득이 거의 없다"를 보여 줍니다. 10-겹은 곡선이 여러 개(분할을 여러 번 반복)여도 서로 가깝습니다. 검증셋 접근(3-12)보다 훨씬 안정적입니다.</p>
<h3>모사 데이터: 진짜 테스트 MSE vs 추정</h3>
<div class="viz" data-viz="cvcompare"></div>
<p>1F의 세 예(예 1·2·3)에 대해 진짜 테스트 MSE(파랑), LOOCV 추정(검정 점선), 10-겹 CV 추정(주황). 추정값이 진짜 값을 <b>과소·과대평가</b>하기도 하지만, 곡선의 <mark>모양과 최소점의 위치</mark>는 잘 맞습니다. 모델 선택이 목적이라면 충분합니다.</p>
<details class="deep"><summary>교재 보충: LOOCV vs K-겹 CV의 편향·분산과 계산 비용</summary><div class="body">
<ul>
<li><b>편향</b>: LOOCV는 $n-1$개로 훈련하므로 테스트 오차를 거의 편향 없이 추정. K-겹은 $(K-1)n/K$개로 훈련하므로 약간 과대평가(하지만 검증셋 접근보다 훨씬 덜).</li>
<li><b>분산</b>: LOOCV의 $n$개 적합은 거의 같은 데이터로 훈련되어 서로 상관이 높음 → 평균의 분산이 큼. K-겹(K = 5, 10)은 훈련셋이 덜 겹쳐 분산이 작음.</li>
<li><b>계산</b>: LOOCV는 모델을 $n$번 적합해야 함(최소제곱에는 한 번 적합으로 계산하는 지름길 공식이 있음). 그래서 실무에서는 <b>K = 5 또는 10</b>이 편향-분산의 좋은 절충.</li>
</ul></div></details>`,
        points: [
          'LOOCV: 훈련셋 = 한 관측 빼고 전부, 검증셋 = 관측 하나, n개 MSE 평균',
          'Auto: LOOCV와 10-겹 CV 곡선이 거의 같음. 2차에서 큰 개선 후 이득 없음. 10-겹 반복 곡선들이 서로 가까움(검증셋 접근보다 안정)',
          '모사 데이터: CV 추정은 진짜 테스트 MSE의 값은 어긋날 수 있어도 모양과 최소 위치를 잘 맞춤 → 모델 선택에 충분',
          '(교재 보충) LOOCV: 편향 작음·분산 큼·n번 적합. K = 5, 10이 실무 절충'
        ],
        terms: [['LOOCV', '단일 관측 제외 교차검증'], ['10-fold CV', '10-겹 교차검증']],
        quiz: [
          { q: '모사 데이터에서 CV 추정(LOOCV, 10-겹)과 진짜 테스트 MSE를 비교한 결론으로 알맞은 것은?', c: ['CV 추정값은 진짜 값과 항상 정확히 일치한다', '값은 어긋날 수 있지만 곡선 모양과 최소가 되는 유연성은 잘 맞춘다', 'CV는 유연성 선택에 쓸 수 없다', 'LOOCV만 정확하다'], a: 1, why: 'CV의 목적은 최고의 유연성을 고르는 것이고, 그 위치를 잘 찾아냅니다.' },
          { q: 'LOOCV의 훈련셋 크기는?', c: ['n/2', 'n − 1', 'n/K', '1'], a: 1, why: '관측 하나만 빼므로 훈련셋은 n − 1개입니다.' }
        ]
      }
    ]
  });
})();
