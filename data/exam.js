/* 플래시카드 + 모의고사 추가 문제 */
(function () {
  const R = String.raw;
  const H = window.HOTEL = window.HOTEL || {};

  /* 플래시카드: f = 층, tag = 종류, q = 앞면, a = 뒷면 */
  H.cards = [
    // 1F
    { f: 1, tag: 'Definition', q: 'Machine Learning (ML)의 강의 정의', a: 'AI의 한 분야. 데이터로부터 학습해 보지 못한 데이터에 일반화하는 통계 알고리즘의 개발과 연구 → 명시적 지시 없이 일을 수행' },
    { f: 1, tag: 'Definition', q: 'Deep Learning (DL)', a: 'ML의 부분집합. 신경망을 이용해 분류·회귀·표현 학습 수행' },
    { f: 1, tag: 'Concept', q: '최근 AI 붐의 세 가지 동력', a: 'Data · Computing Power · Algorithms 의 수렴(convergence)' },
    { f: 1, tag: 'Concept', q: 'ML이 요구하는 "믿음의 도약(leap of faith)"', a: '일반화(generalization): 과거 데이터에서 배운 패턴이 새 데이터에도 통한다는 믿음' },
    { f: 1, tag: 'Concept', q: '"Move complexity from ___ to ___"', a: 'from "code" to "data"' },
    { f: 1, tag: 'Notation', q: R`$Y = f(X) + \varepsilon$ 에서 $\varepsilon$의 두 가지 가정`, a: R`$X$와 독립, 평균 0 ($\mathbb{E}[\varepsilon] = 0$)` },
    { f: 1, tag: 'Definition', q: '회귀함수(regression function)의 정의', a: R`$f(x) = \mathbb{E}(Y \mid X = x)$. 제곱오차 기준으로 모든 $g$ 중 $\mathbb{E}[(Y-g(X))^2\mid X=x]$를 최소화하는 함수` },
    { f: 1, tag: 'Formula', q: '기대 제곱오차의 reducible / irreducible 분해', a: R`$\mathbb{E}[(Y-\hat f(X))^2 \mid X=x] = [f(x)-\hat f(x)]^2 + \mathrm{Var}(\varepsilon)$` },
    { f: 1, tag: 'Concept', q: '모수적 vs 비모수적 방법의 핵심 차이', a: '모수적: 함수 형태를 먼저 가정(예: 선형), 모수 p+1개 추정. 형태가 틀릴 위험. / 비모수적: 형태 가정 없음, 대신 매우 많은 관측 필요' },
    { f: 1, tag: 'Definition', q: '과적합(overfitting)', a: '훈련 데이터에는 오차가 거의 없지만(잡음까지 따라감) 새 데이터에는 일반화되지 않는 상태. 유연성이 지나칠 때' },
    { f: 1, tag: 'Concept', q: '세 가지 트레이드오프', a: '예측 정확도 vs 해석력 / 좋은 적합 vs 과·과소적합 / 간결함(parsimony) vs 블랙박스' },
    { f: 1, tag: 'Concept', q: '해석력-유연성 지도의 양 끝', a: '왼쪽 위(해석 높음·유연 낮음): Subset Selection, Lasso / 오른쪽 아래: Deep Learning. 중간: Least Squares → GAMs → Trees → Bagging/Boosting → SVM' },
    { f: 1, tag: 'Formula', q: R`$\mathrm{MSE}_{\mathrm{Te}}$ 정의와 훈련 MSE와의 차이`, a: R`$\frac1M\sum_{i\in\mathrm{Te}}(y_i-\hat f(x_i))^2$, 훈련에 안 쓴 새 데이터로 계산. 훈련 MSE는 과적합 모델 쪽으로 편향` },
    { f: 1, tag: 'Formula', q: '편향-분산 분해', a: R`$\mathbb{E}[y_0-\hat f(x_0)]^2 = \mathrm{Var}(\hat f(x_0)) + [\mathrm{Bias}(\hat f(x_0))]^2 + \mathrm{Var}(\varepsilon)$, $\mathrm{Bias} = \mathbb{E}[\hat f(x_0)] - f(x_0)$` },
    { f: 1, tag: 'Concept', q: '편향-분산 분해의 기댓값은 무엇에 대한 것?', a: '테스트 관측 $y_0$의 변동성과 훈련 데이터 Tr의 변동성 모두' },
    { f: 1, tag: 'Concept', q: '유연성이 커질 때 편향과 분산의 경향', a: '분산 ↑, 편향 ↓. 테스트 오차 최소점에서 절충 = 편향-분산 트레이드오프' },
    // 2F
    { f: 2, tag: 'Formula', q: '단순선형회귀 모델과 예측식', a: R`$Y = \beta_0 + \beta_1 X + \varepsilon$, $\hat y = \hat\beta_0 + \hat\beta_1 x$ (hat = 추정값)` },
    { f: 2, tag: 'Definition', q: '잔차 $e_i$와 RSS', a: R`$e_i = y_i - \hat y_i$, $\mathrm{RSS} = \sum e_i^2 = \sum (y_i - \hat\beta_0 - \hat\beta_1 x_i)^2$` },
    { f: 2, tag: 'Formula', q: R`최소제곱 추정량 $\hat\beta_1$, $\hat\beta_0$`, a: R`$\hat\beta_1 = \dfrac{\sum(x_i-\bar x)(y_i-\bar y)}{\sum(x_i-\bar x)^2}$, $\hat\beta_0 = \bar y - \hat\beta_1\bar x$` },
    { f: 2, tag: 'Proof', q: R`유도의 마지막 등호 $\sum x_i(y_i-\bar y) = \sum (x_i-\bar x)(y_i-\bar y)$의 근거`, a: R`편차의 합 $\sum(y_i - \bar y) = 0$ (분모는 $\sum(x_i-\bar x)=0$)` },
    { f: 2, tag: 'Formula', q: R`$\mathrm{SE}(\hat\beta_1)^2$`, a: R`$\dfrac{\sigma^2}{\sum_{i=1}^n (x_i-\bar x)^2}$, $\sigma^2 = \mathrm{Var}(\varepsilon)$` },
    { f: 2, tag: 'Formula', q: R`$\beta_1$의 95% 신뢰구간과 광고 데이터 값`, a: R`$\hat\beta_1 \pm 2\cdot\mathrm{SE}(\hat\beta_1)$; 광고(TV): [0.042, 0.053]` },
    { f: 2, tag: 'Formula', q: 't-통계량과 자유도', a: R`$t = \dfrac{\hat\beta_1 - 0}{\mathrm{SE}(\hat\beta_1)}$, $H_0$ 하에서 자유도 $n-2$의 t분포` },
    { f: 2, tag: 'Definition', q: 'p-값', a: 'H₀가 참일 때 관측된 |t| 이상의 값이 나올 확률. 작으면 H₀ 기각' },
    { f: 2, tag: 'Numbers', q: '광고 데이터 sales ~ TV 결과', a: 'TV 계수 0.0475 (SE 0.0027, t 17.67, p < 0.0001). RSE 3.26, R² 0.612, F 312.1' },
    { f: 2, tag: 'Formula', q: 'RSE', a: R`$\sqrt{\mathrm{RSS}/(n-2)}$: 오차 $\varepsilon$의 표준편차 추정` },
    { f: 2, tag: 'Formula', q: R`$R^2$ 정의`, a: R`$R^2 = \dfrac{\mathrm{TSS}-\mathrm{RSS}}{\mathrm{TSS}} = 1 - \dfrac{\mathrm{RSS}}{\mathrm{TSS}}$, $\mathrm{TSS} = \sum(y_i-\bar y)^2$. 단순선형회귀에서 $R^2 = r^2$` },
    { f: 2, tag: 'Formula', q: 'F-통계량과 그것이 답하는 질문', a: R`$F = \dfrac{(\mathrm{TSS}-\mathrm{RSS})/p}{\mathrm{RSS}/(n-p-1)} \sim F_{p,n-p-1}$. "적어도 하나의 예측변수가 유용한가?"` },
    // 3F
    { f: 3, tag: 'Concept', q: R`다중회귀에서 $\beta_j$의 해석`, a: '다른 모든 예측변수를 고정한 채 X_j 한 단위 증가가 Y에 미치는 평균 효과' },
    { f: 3, tag: 'Concept', q: '예측변수들이 상관되어 있을 때의 두 문제', a: '(1) 모든 계수의 분산이 커짐 (2) 해석이 위험해짐. + 관측 데이터에서 인과 주장 금지' },
    { f: 3, tag: 'Formula', q: '다중회귀 최소제곱 추정량 (행렬)', a: R`$\hat\beta = (X^\top X)^{-1}X^\top y$, from $\partial \mathrm{RSS}/\partial\beta = -2X^\top y + 2X^\top X\beta = 0$` },
    { f: 3, tag: 'Concept', q: R`$X^\top X$가 가역이 아닐 때 X의 상태와, 강한 상관일 때의 문제`, a: '열들이 선형종속(한 특징이 다른 특징의 선형결합, n < p+1). 강한 상관: 역행렬은 있지만 계수 분산 폭발(다중공선성)' },
    { f: 3, tag: 'Numbers', q: '광고 다중회귀(TV+radio+newspaper) 핵심 숫자', a: 'TV 0.046, radio 0.189 유의 / newspaper −0.001 (p 0.86). R² 0.897, RSE 1.69 (단순: 0.612, 3.26). radio–newspaper 상관 0.35' },
    { f: 3, tag: 'Formula', q: '상호작용 모델과 TV의 기울기', a: R`$Y = \beta_0+\beta_1X_1+\beta_2X_2+\beta_3X_1X_2+\varepsilon$; TV 기울기 $= \beta_1 + \beta_3\cdot\text{radio}$` },
    { f: 3, tag: 'Numbers', q: '상호작용 모델의 R²와 69%의 의미', a: '96.8% vs 가법 89.7%. (96.8−89.7)/(100−89.7) = 69%: 가법 모델 후 남은 변동 중 상호작용이 설명한 비율' },
    { f: 3, tag: 'Concept', q: '계층 원칙(hierarchy principle)', a: '상호작용을 넣으면 주효과도 (p-값이 유의하지 않아도) 포함. 이유: 주효과 없이는 상호작용 해석이 어렵고 주효과를 떠안게 됨' },
    { f: 3, tag: 'Concept', q: 'mpg = β₀ + β₁hp + β₂hp² 은 선형 모델인가?', a: '네. X₁ = hp, X₂ = hp²인 다중선형회귀. "선형"은 계수 β에 대해 선형' },
    { f: 3, tag: 'Concept', q: '선형 모델의 세 확장 묶음', a: '분류(로지스틱 회귀, SVM) / 비선형·상호작용(트리, 배깅, 랜덤 포레스트, 부스팅) / 정규화(릿지, 라쏘)' },
    { f: 3, tag: 'Concept', q: '테스트 오차를 추정하는 세 가지 길', a: '별도 큰 테스트셋(최선, 드묾) / 훈련 오차 보정(Cp, AIC, BIC) / 홀드아웃(검증셋, CV)' },
    { f: 3, tag: 'Concept', q: '검증셋 접근법의 두 단점', a: '(1) 분할에 따라 추정값 변동 큼 (2) 절반만으로 훈련하므로 테스트 오차 과대평가' },
    { f: 3, tag: 'Formula', q: 'K-겹 CV 추정값', a: R`$\mathrm{CV}_{(K)} = \sum_{k=1}^K \frac{n_k}{n}\mathrm{MSE}_k$, $\mathrm{MSE}_k = \frac{1}{n_k}\sum_{i\in C_k}(y_i-\hat y_i)^2$. K = n → LOOCV` },
    { f: 3, tag: 'Concept', q: 'LOOCV의 훈련셋·검증셋 크기', a: '훈련 n−1개, 검증 1개, n번 적합 후 평균' },
    { f: 3, tag: 'Concept', q: 'CV 추정이 진짜 테스트 MSE와 비교해 잘하는 것', a: '값은 어긋날 수 있지만 곡선 모양과 최소가 되는 유연성 위치를 잘 맞춤 → 모델 선택에 충분' },
    // 4F
    { f: 4, tag: 'Definition', q: '분류(classification) 과제의 정의', a: '특징 X를 받아 순서 없는 집합 C의 값 Y를 예측하는 f(X) ∈ C. 종종 각 범주의 확률 추정이 더 유용' },
    { f: 4, tag: 'Concept', q: '이진 분류에 선형회귀를 쓸 때의 장단', a: '꽤 작동하며 LDA와 동등, E(Y|X) = P(Y=1|X). 하지만 확률이 0 미만·1 초과 가능 → 로지스틱 회귀' },
    { f: 4, tag: 'Concept', q: '다중 클래스에 1, 2, 3 코딩 선형회귀가 부적절한 이유', a: '코딩이 순서와 등간격을 암시. 다중 클래스 로지스틱 회귀·판별분석 사용' },
    { f: 4, tag: 'Formula', q: '로지스틱 함수', a: R`$p(X;\beta) = \dfrac{e^{\beta_0+\beta_1X}}{1+e^{\beta_0+\beta_1X}}$, 항상 (0, 1)` },
    { f: 4, tag: 'Formula', q: '로짓(로그 오즈) 변환', a: R`$\log\dfrac{p(X;\beta)}{1-p(X;\beta)} = \beta_0+\beta_1X$ (자연로그)` },
    { f: 4, tag: 'Formula', q: '로지스틱 회귀의 우도함수', a: R`$L(\beta) = \prod_{i:y_i=1}p(x_i;\beta)\prod_{j:y_j=0}(1-p(x_j;\beta))$` },
    { f: 4, tag: 'Formula', q: '로그우도 한 줄 정리', a: R`$\sum_{i=1}^N\big[y_i(\beta_0+\beta_1x_i) - \log(1+e^{\beta_0+\beta_1x_i})\big]$` },
    { f: 4, tag: 'Formula', q: '로그우도의 1계 조건', a: R`$\sum x_i(y_i - p(x_i;\beta)) = 0$, $\sum (y_i - p(x_i;\beta)) = 0$. 닫힌 해 없음 → 반복 최적화` },
    { f: 4, tag: 'Concept', q: 'argmax log L = argmax L 인 이유와 주의점', a: '로그가 단조증가라 최대의 위치는 불변. 최댓값 자체는 달라짐' },
    { f: 4, tag: 'Concept', q: R`$\hat\beta_1 = 0.0055$ (balance)의 정확한 해석`, a: 'balance 1 단위 증가 → 연체의 로그 오즈 0.0055 증가 (확률 증가량은 X 위치에 따라 다름)' },
    { f: 4, tag: 'Numbers', q: 'balance 1000, 2000일 때 연체 확률 (β₀ = −10.6513, β₁ = 0.0055)', a: '0.006, 0.586' },
    { f: 4, tag: 'Numbers', q: 'student 단독 모델 (−3.5041 + 0.4049·student)의 확률', a: '학생 0.0431, 비학생 0.0292' },
    { f: 4, tag: 'Concept', q: 'student 계수가 다변량 모델에서 음수가 되는 이유', a: '교란: 학생은 balance가 높아 주변 연체율은 높지만, 같은 balance에서는 덜 연체. 다변량 모델이 분리' },
    { f: 4, tag: 'Formula', q: '다중 클래스 로지스틱 회귀 (소프트맥스)', a: R`$P(Y=k\mid X,\beta) = \dfrac{e^{\beta_{0k}+\cdots+\beta_{pk}X_p}}{\sum_{\ell=1}^K e^{\beta_{0\ell}+\cdots+\beta_{p\ell}X_p}}$. 클래스마다 선형함수. = 다항(multinomial) 회귀` }
  ];

  /* 모의고사 추가 문제 (room: 관련 객실 id) */
  H.examExtra = [
    { room: '1-2', q: 'GoogleNet의 사람에 가까운 물체 분류(2014)를 가능하게 한 데이터셋과 알고리즘의 짝은?', c: ['ImageNet (2010) · CNN (1989)', 'Common Crawl · Transformer (2017)', 'Arcade Learning Environment (2013) · Q-learning (1992)', 'PDB · HMM (1984)'], a: 0, why: 'ImageNet 150만 장(2010)과 1989년에 제안된 합성곱 신경망의 조합입니다.' },
    { room: '1-6', q: 'f(x) = E(Y | X = x)를 "이상적인 예측기"라고 부를 때 그 기준은?', c: ['절대오차', '평균제곱오차(MSE)', '오분류율', '우도'], a: 1, why: 'MSE(제곱오차) 기준으로 모든 g 중 최소가 되는 것이 조건부 기댓값입니다.' },
    { room: '1-7', q: '진짜 f를 정확히 알더라도 남는 오차의 크기는?', c: ['0', 'Var(ε)', '[f(x) − f̂(x)]²', 'Bias²'], a: 1, why: '줄일 수 없는 오차 Var(ε)는 f를 알아도 남습니다.' },
    { room: '1-11', q: '유연성에 따른 테스트 MSE 곡선의 최소값이 결코 내려갈 수 없는 하한은?', c: ['0', '훈련 MSE', 'Var(ε)', 'Bias²'], a: 2, why: '테스트 MSE = Var + Bias² + Var(ε) ≥ Var(ε).' },
    { room: '1-12', q: '훈련 데이터를 여러 번 새로 뽑아 적합했을 때 f̂(x₀)이 흔들리는 정도를 뜻하는 항은?', c: ['Bias(f̂(x₀))', 'Var(f̂(x₀))', 'Var(ε)', 'MSE_Tr'], a: 1, why: '분산은 훈련 데이터 변동에 따른 추정의 변동입니다.' },
    { room: '2-3', q: '최소제곱 직선이 반드시 지나는 점은?', c: ['원점 (0, 0)', '(x̄, ȳ)', '(0, β̂₀)만', '데이터의 첫 점'], a: 1, why: 'β̂₀ = ȳ − β̂₁x̄ 이므로 x = x̄에서 ŷ = ȳ. (0, β̂₀)도 지나지만 "반드시"의 핵심은 평균점입니다.' },
    { room: '2-5', q: '표준오차(SE)가 나타내는 것은?', c: ['잔차의 평균', '반복 표집에서 추정량이 변하는 정도', '데이터의 표준편차', 'R²의 제곱근'], a: 1, why: '"how it varies under repeated sampling".' },
    { room: '2-6', q: 'H₀: β₁ = 0 이 참일 때 모델은?', c: ['Y = ε', 'Y = β₀ + ε', 'Y = β₁X', 'Y = 0'], a: 1, why: 'β₁ = 0이면 X항이 사라져 Y = β₀ + ε. X는 Y와 무관합니다.' },
    { room: '2-8', q: '단순선형회귀에서 R²와 상관계수 r의 관계는?', c: ['R² = r', 'R² = r²', 'R² = 1 − r', 'R² = 1/r'], a: 1, why: '단순선형회귀에서는 R² = r²임을 보일 수 있습니다.' },
    { room: '2-8', q: 'F-통계량 F = [(TSS − RSS)/p] / [RSS/(n − p − 1)]이 따르는 분포는?', c: ['t_{n−2}', 'F_{p, n−p−1}', 'χ²_p', 'N(0, 1)'], a: 1, why: '자유도 (p, n − p − 1)의 F분포입니다.' },
    { room: '3-3', q: 'RSS = (y − Xβ)ᵀ(y − Xβ)를 β로 미분한 결과는?', c: ['−2Xᵀy + 2XᵀXβ', 'Xᵀy − XᵀXβ', '2Xᵀ(y + Xβ)', '−Xβ'], a: 0, why: '∂RSS/∂β = −2Xᵀy + 2XᵀXβ. 0으로 두면 정규방정식.' },
    { room: '3-4', q: '같은 변수를 단위만 바꿔(예: cm와 m) 두 열로 넣으면 최소제곱에서 생기는 일은?', c: ['아무 문제 없음', 'XᵀX가 특이행렬이 되어 (XᵀX)⁻¹을 계산할 수 없음', 'R²가 2배가 됨', '잔차가 0이 됨'], a: 1, why: '한 열이 다른 열의 상수배 → 선형종속 → XᵀX 비가역.' },
    { room: '3-7', q: '상호작용 모델에서 radio 광고 1,000달러 증가의 판매 효과(개)는? (β̂₂ = 0.0289, β̂₃ = 0.0011)', c: ['29 + 1.1·TV', '19 + 1.1·radio', '29', '1.1'], a: 0, why: '(β̂₂ + β̂₃·TV) × 1000 = 28.9 + 1.1·TV ≈ 29 + 1.1·TV.' },
    { room: '3-12', q: '훈련 오차율을 수학적으로 보정해 테스트 오차를 추정하는 방법으로 슬라이드가 든 것은?', c: ['K-겹 CV', 'Cp, AIC, BIC', '검증셋 접근', 'LOOCV'], a: 1, why: '"Some methods make a mathematical adjustment… Cp statistic, AIC and BIC."' },
    { room: '3-14', q: 'n = 200, K = 10일 때 각 조각의 크기 n_k와 CV 추정값의 형태는?', c: ['20개, 10개 MSE_k의 평균', '10개, 20개 MSE_k의 합', '200개, 하나의 MSE', '2개, 100개 MSE의 평균'], a: 0, why: 'n_k = 200/10 = 20이고 가중치 n_k/n = 1/10이므로 단순 평균.' },
    { room: '4-3', q: '이진 결과에 대한 선형회귀 분류기가 동등하다고 슬라이드가 언급한 방법은?', c: ['로지스틱 회귀', '선형판별분석(LDA)', 'K-최근접 이웃', '서포트 벡터 머신'], a: 1, why: '"equivalent to linear discriminant analysis which we discuss later".' },
    { room: '4-4', q: 'p = 0.8일 때 오즈와 로그 오즈는?', c: ['오즈 4, 로그 오즈 ln 4 ≈ 1.39', '오즈 0.8, 로그 오즈 −0.22', '오즈 0.25, 로그 오즈 −1.39', '오즈 1.25, 로그 오즈 0.22'], a: 0, why: '오즈 = p/(1−p) = 0.8/0.2 = 4, 로그 오즈 = ln 4 ≈ 1.386.' },
    { room: '4-6', q: '로지스틱 회귀의 1계 조건 Σ(y_i − p(x_i;β)) = 0 과 모양이 같은 최소제곱의 조건은?', c: ['Σ e_i = 0 (잔차의 합 = 0)', 'Σ x_i² = 0', 'RSS = 0', 'R² = 1'], a: 0, why: 'y_i − p(x_i)가 잔차 역할. 최소제곱의 ∂RSS/∂β₀ = 0도 잔차의 합 = 0입니다.' },
    { room: '4-7', q: '로지스틱 회귀에서 balance 계수 0.0055의 오즈비 e^0.0055가 뜻하는 것은?', c: ['balance 1 증가 시 확률이 0.55% 증가', 'balance 1 증가 시 오즈가 약 1.0055배', 'balance 1 증가 시 로그 오즈가 1.0055 증가', 'balance와 무관'], a: 1, why: '오즈 = e^(β₀+β₁X)이므로 X가 1 늘면 오즈에 e^β₁이 곱해집니다.' },
    { room: '4-9', q: '다변량 로지스틱 회귀 결과에서 balance를 고정했을 때 학생이 비학생보다 연체 확률이 낮다는 근거는?', c: ['income 계수가 양수', 'student[Yes] 계수가 −0.6468로 유의하게 음수', '절편이 음수', 'balance 계수가 0.0057'], a: 1, why: '다른 변수를 고정한 채 학생이면 로그 오즈가 0.6468 감소합니다.' }
  ];
})();
