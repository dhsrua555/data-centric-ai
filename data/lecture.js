/* 교수님 강의 녹음(9/4 · 9/11 · 9/18)에서 뽑은 노트와, 실제 시험 형식(영어 T/F · 모두 고르시오 · 서술)에 맞춘 연습 문제
   HOTEL.lecture[roomId] = [{ at, tag, html }]   tag: exam(시험 언급) · key(강조) · trap(함정) · story(예시)
   HOTEL.drill[roomId]   = [{ t: 'tf'|'multi'|'short', q, ko, ... }]
   HOTEL.written         = { scenarios: [...], long: [...] }  실전형 모의고사의 short/long answer 문제 은행 */
(function () {
  const R = String.raw;
  const H = window.HOTEL = window.HOTEL || {};

  H.lecture = {
    /* ---------------- 1F · 9/4 강의 ---------------- */
    '1-1': [
      { at: '9/4 04:49', tag: 'key', html: R`<b>AI</b>는 출처마다 정의가 모호하지만, 이 수업에서는 "계산 시스템이 사람의 지능과 연관된 테스크(학습, 패턴 인식, 추론, 지각, 좋은 의사결정 판단)를 수행하는 능력"으로 봅니다.` },
      { at: '9/4 06:12', tag: 'key', html: R`<b>머신러닝</b>의 핵심 두 가지: ① 데이터에서 학습하고 ② <mark>아직 관측하지 못한 데이터에도 일반화</mark>한다. 그리고 이걸 <b>명시적인 지시(explicit instruction) 없이</b>, 즉 사람이 "이 상황에선 이렇게"를 코딩하지 않고 해낸다.` },
      { at: '9/4 07:12', tag: 'key', html: R`<b>딥러닝</b> = 머신러닝 중에서 특정 함수(deep neural network)로 학습하는 것. 그래서 "이 수업이 머신러닝을 다룬다"는 말은 딥러닝도 포함한다는 뜻이에요. 둘이 따로 있는 게 아니라 포함 관계(AI ⊃ ML ⊃ DL). 데이터 없이 하는 룰 기반 AI도 AI에는 속하지만, 이 수업은 데이터 중심입니다.` }
    ],
    '1-2': [
      { at: '9/4 08:56', tag: 'story', html: R`2016년 서울의 알파고 이후 약 10년, AI는 "거품론"에도 불구하고 새 모델이 나올 때마다 기대치를 계속 넘어 왔어요.` },
      { at: '9/4 11:05', tag: 'key', html: R`발전을 이끈 <b>세 가지</b>: <mark>데이터 · 컴퓨팅 파워 · 알고리즘(모델)</mark>. 데이터가 먼저예요. 머신러닝 기반 AI는 데이터가 있어야 시작할 수 있으니까요. 예: AlphaFold는 축적된 단백질 구조 데이터로 구조 예측 모델을 만들어 2024년 노벨 화학상으로 이어졌어요.` },
      { at: '9/4 13:39', tag: 'story', html: R`컴퓨팅: 1997년엔 IBM 슈퍼컴퓨터 Deep Blue가 체스 챔피언 카스파로프를 겨우 이겼지만, 지금은 휴대폰 체스 앱을 세계 챔피언도 못 이겨요. 모델: ChatGPT, Claude 같은 서비스의 바탕은 <b>transformer</b>. 데이터·모델·학습 알고리즘·컴퓨터 "삼박자"가 맞은 결과이고, 더 좋은 모델과 알고리즘은 "여러분의 몫".` }
    ],
    '1-3': [
      { at: '9/4 16:20', tag: 'key', html: R`<b>모델 = 함수.</b> 입력(데이터)을 받아 출력(예측 prediction / 생성 generation / 의사결정 decision)을 냅니다. 개·고양이 분류기는 이미지 → 레이블, ChatGPT도 입력 텍스트(컨텍스트) → 출력 텍스트. "여러분이 쓰는 모든 AI 모델은 입력과 출력의 관계로 나타낼 수 있어요."` },
      { at: '9/4 17:41', tag: 'key', html: R`잘 학습한다는 건 데이터를 <b>외우는 게 아니라</b>, 데이터 속 패턴을 뽑아서 학습에 쓰지 않은 새 데이터에서도 테스크를 잘 하는 것(일반화). 개 사진을 외운 게 아니라 "개는 이런 형상"이라는 패턴을 익힌 것.` },
      { at: '9/4 20:12', tag: 'story', html: R`룰 기반으로 개·고양이 분류 코드를 손으로 짠다고 상상해 보세요. 귀 위치 찾기, 눈 모양 판별…. 끝없이 복잡해져요. 패턴을 데이터에서 찾게 하면 훨씬 단순해집니다.` }
    ],
    '1-4': [
      { at: '9/4 21:35', tag: 'story', html: R`광고 데이터의 점 하나 = 한 회사(시장)의 광고비(천 달러 단위)와 매출. TV는 양의 관계가 눈에 보이고, newspaper는 파란 선을 지우면 관계가 잘 안 보여요. "같은 선형 모델이라도 어떤 변수는 예측력이 유의미하고 어떤 건 아닐 수 있다" → 2F·3F에서 확인.` },
      { at: '9/4 28:31', tag: 'key', html: R`용어: 출력 $Y$ = response = target, 입력 $X$ = feature = predictor = input variable = independent variable…. "이름은 여러 개지만 결국 다 똑같은 거예요. 함수의 입력." 입력이 3개면 $X$는 3차원 벡터.` },
      { at: '9/4 30:55', tag: 'key', html: R`$\varepsilon$(measurement error, noise) = 진짜 관계가 <b>평균적인</b> 관계를 나타내더라도, 각 데이터 점이 거기서 조금씩 떨어져 있는 정도. 가정은 <mark>평균 0, $X$와 독립</mark>. "일단 받아들이세요. 이번 학기에 배울 거의 모든 유도가 이 두 가정을 깔고 들어갑니다."` },
      { at: '9/4 46:47', tag: 'exam', html: R`<b>관측 가능한 것 vs 아닌 것</b>: 데이터로 <mark>$X$와 $Y$는 관측 가능</mark>. $f$는 모름 → <b>학습 대상</b>. $\varepsilon$도 관측 불가능하고, 게다가 <b>학습 대상도 아님</b>. 그냥 자연(nature)에 노이즈가 있다는 것이고, 학습을 <b>방해</b>하는 존재예요. ("$\varepsilon$이 0이면 한 번에 끝날 텐데요.")` }
    ],
    '1-5': [
      { at: '9/4 33:16', tag: 'key', html: R`$f$를 알면: ① 새로운 $x$에서 $y$를 <b>예측</b> ② 입력 중 무엇이 $Y$에 영향을 주고 무엇이 아닌지 파악(<b>추론</b>) ③ $x$가 이만큼 변할 때 $y$가 얼마나 변하는지까지 알 수 있어요.` },
      { at: '9/4 34:28', tag: 'story', html: R`소득(income) 예: 경력·학력은 소득에 영향을 주겠지만, 결혼 여부는 지출엔 영향이 있어도 소득엔 없을 수 있어요. <mark>입력에 들어가 있다고 무조건 $Y$에 영향을 주는 건 아니다.</mark>` },
      { at: '9/4 35:44', tag: 'story', html: R`"$f$를 안다 = 자연(nature)을 아는 것." 기상청 슈퍼컴퓨터도 내일 비가 올지 정확히 모르죠. 광고에서 진짜 $f$를 알면 어느 매체에 얼마를 써야 할지 정확히 알 수 있어요.` }
    ],
    '1-6': [
      { at: '9/4 38:25', tag: 'key', html: R`$x = 4$에서 좋은 예측값은? 그 세로줄(slice)에 있는 $y$들의 <b>평균</b>. 이것이 이상적인 $f$ = 조건부 기댓값 $\mathbb{E}(Y \mid X = x)$. 이게 성립하려면 $\varepsilon$의 두 가정(평균 0, $X$와 독립)이 필요해요.` },
      { at: '9/4 43:19', tag: 'key', html: R`<b>회귀(regression)</b> = 출력이 실수인 함수를 찾는 문제. 회귀에서 학습한다 = 각 점의 조건부 기댓값 함수를 찾는다. 표기: 대문자 $X$ = 확률변수, 소문자 $x$ = 특정한 숫자.` },
      { at: '9/4 49:00', tag: 'exam', html: R`왜 차이 $Y - g(X)$를 그대로 쓰지 않고 <b>제곱</b>할까? ① 차이가 음의 무한대여도 "작은" 값이 되지만 그건 나쁜 예측이에요. 양쪽 모두 벌점을 줘야 함. ② 제곱하면 차이가 클수록 벌점이 더 커짐(10 → 100). ③ 2차식이라 미분으로 최솟값을 찾기 편함. 그리고 $\mathbb{E}[(Y-g(X))^2]$를 최소화하는 $g$가 바로 조건부 기댓값. "신기하죠."` }
    ],
    '1-7': [
      { at: '9/4 55:51', tag: 'exam', html: R`오차 분해 유도는 "<b>꼭 직접 해 보세요, 얼마 안 걸려요.</b>" 중학교 수준 전개 + $\varepsilon$의 두 성질(평균 0, $X$와 독립)만 쓰면 교차항이 사라지고 두 항만 남아요.` },
      { at: '9/4 53:21', tag: 'key', html: R`<b>irreducible error</b>: 오라클이 진짜 $f$를 줘도 줄일 수 없는 오차. 실험의 미세한 측정 변동, 내일 날씨의 변동 같은 것. "아무리 학습을 잘해도, 심지어 진짜 $f$라도 줄일 수 없고, 학습 대상이 아니에요."` },
      { at: '9/4 58:09', tag: 'key', html: R`<b>reducible error</b> $[f(x) - \hat f(x)]^2$는 데이터로 학습을 잘하면 줄일 수 있고, 우리가 줄이려는 부분. 노이즈가 크면 전체 오차도 커지지만(방해), 우리의 포커스는 reducible 쪽이에요.` }
    ],
    '1-8': [
      { at: '9/4 1:02:21', tag: 'key', html: R`<b>모수적(parametric)</b>: 사람이 구조를 <b>명시적으로 가정</b>(예: 선형). 선형 모델은 $\beta$(기울기·절편)만 알면 함수를 정확히 알 수 있으니 학습 = $\beta$ 학습. 로지스틱 회귀 등도 모수적 모델이에요.` },
      { at: '9/4 1:05:30', tag: 'exam', html: R`모수적 모델의 위험: 진짜 $f$가 선형이 아닌데 선형으로 가정하면, <mark>아무리 학습을 잘해도 $\hat f$가 $f$에 가까워질 수 없다</mark>. 시작부터 잘못된 것.` },
      { at: '9/4 1:06:48', tag: 'key', html: R`<b>비모수적</b>: 형태 가정이 없으니 그 위험은 없지만, 비슷한 정확도를 얻으려면 <b>훨씬 많은 데이터</b>가 필요. 대표 예는 <b>트리 모형</b>(이번 학기에 배움). 비모수 모델에도 함수가 얼마나 구불구불할지(복잡도)를 조절하는 장치가 있어요.` }
    ],
    '1-9': [
      { at: '9/4 1:07:59', tag: 'story', html: R`Income 예: 입력 2개(학력, 경력) + 출력 → 3차원. 파란 곡면 = 진짜 $f$, 빨간 점 = 데이터. "선형회귀인데 왜 선이 아니라 면이죠?" → 입력이 2개면 3차원 공간의 <b>평면(초평면)</b>이 됩니다.` },
      { at: '9/4 1:12:24', tag: 'trap', html: R`<b>적합된 곡면에서 점까지 떨어진 거리 ≠ $\varepsilon$.</b> $\varepsilon$은 <b>진짜</b> $f$(파란 곡면)에서 떨어진 정도이고, 적합된 곡면(노란색)에서 떨어진 건 <b>잔차(residual)</b>예요(2F).` },
      { at: '9/4 1:12:24', tag: 'key', html: R`어느 적합이 더 좋은지 판단할 때 파란 진짜 곡면을 머릿속에서 <b>지우세요</b>. 현실에서는 절대 볼 수 없어요. 데이터만 보고 판단해야 합니다.` },
      { at: '9/4 1:19:09', tag: 'exam', html: R`<b>과적합의 정의 (교수님이 특히 강조).</b> "훈련 오차가 0이 되면 과적합"이라고 가르치는 사람이 실제로 있는데 <mark>틀렸다</mark>. 과적합 = 훈련 데이터에 있는 <b>노이즈($\varepsilon$)까지 학습</b>해 버려서 새 데이터에 <b>일반화가 안 되는</b> 것. 훈련 오차 0은 정의가 아니고, 훈련 오차가 0이라고 무조건 과적합인 것도 아니에요. "적어도 제 수업 들은 사람은 이 원리를 정확히."` },
      { at: '9/4 1:21:43', tag: 'key', html: R`<b>과소적합(underfitting)</b>: 함수 복잡도가 너무 낮아 훈련 데이터조차 충분히 학습 못 한 상태 → 훈련·테스트 오차 둘 다 높음. 둘 다 나쁘고, 그 사이의 "적절함"이 어렵다.` },
      { at: '9/4 1:14:38', tag: 'story', html: R`비유: 기출 문제를 통째로 외우면 기출은 100점이지만, 조금만 변형돼도 못 풀어요. 원리를 이해해서 <b>새 문제를 잘 푸는 것</b>이 일반화.` }
    ],
    '1-10': [
      { at: '9/4 1:17:59', tag: 'story', html: R`예측 정확도 vs 해석력. 의료(암 예측)에서는 정확도를 0.001 올리는 것보다 해석이 없으면 의사가 아예 안 써요. 신용점수는 "왜 850점인지" 설명해야 해서 단순한 모델을 씁니다. 반대로 증권사 투자 모델은 0.1%라도 더 맞히려고 복잡한 블랙박스를 쓸 수 있어요.` },
      { at: '9/4 1:21:43', tag: 'key', html: R`<b>절약(parsimony)</b>: 정확도가 비슷하면 파라미터가 적은(작은) 모델을 선호. 파라미터 1000개 모델과 10개 모델의 성능이 비슷하면 10개. <mark>정해진 규칙은 없고, 무엇을 중요하게 여기고 어떤 문제를 푸느냐에 따라 달라진다.</mark>` }
    ],
    '1-11': [
      { at: '9/4 1:24:58', tag: 'key', html: R`훈련 MSE만 최소화하면 과적합될 수 있어요. 목표는 <b>학습에 쓰지 않은</b> 테스트 데이터에서 오차를 줄이는 것 = 일반화.` },
      { at: '9/4 1:26:07', tag: 'exam', html: R`그림 읽는 법: 검정 실선 = 진짜 $f$(현실에선 모름). 노랑 = 선형, 파랑·초록 = 더 유연한 비모수 적합. 오른쪽 패널의 <b>회색 = 훈련 MSE</b>(복잡도가 커질수록 계속 감소), <b>빨강 = 테스트 MSE</b>(U자). 훈련 오차로 고르면 무조건 가장 구불구불한 초록을 고르게 되는데 테스트 오차는 오히려 커요. 적절한 복잡도(파랑)가 최선이고, "데이터마다 적절한 복잡도가 다르다" → <mark>테스트 오차를 봐야 한다</mark>.` }
    ],
    '1-12': [
      { at: '9/4 1:30:05', tag: 'exam', html: R`기대 테스트 MSE 분해의 기댓값은 무엇에 대한 것? <b>훈련 데이터</b>에 대한 것. 훈련 데이터는 어떤 분포에서 뽑힌 표본이라, 다른 훈련셋이면 $\hat f$가 조금씩 달라져요. 그래서 <mark>$\hat f(x_0)$ 자체가 확률변수이고 분산이 있다</mark>. (작년 기출: "Briefly explain why we have randomness in $\hat f(x_0)$.")` },
      { at: '9/4 1:31:07', tag: 'key', html: R`$\text{Bias} = \mathbb{E}[\hat f(x_0)] - f(x_0)$, 0이면 불편(unbiased). 유도에는 역시 $\varepsilon$의 두 성질을 써요. "꼭 해 보세요."` },
      { at: '9/4 1:32:02', tag: 'key', html: R`매우 구불구불한(유연한) 함수는 데이터가 조금만 바뀌어도 크게 바뀌어 <b>분산↑ 편향↓</b>. 선형처럼 단순한 함수는 <b>분산↓</b>이지만 편향이 클 수 있어요. 학습 = 둘을 적절히 균형 잡아 기대 테스트 MSE를 가장 작게 만드는 함수를 찾는 것.` }
    ],

    /* ---------------- 2F · 9/11 강의 ---------------- */
    '2-1': [
      { at: '9/11 00:08', tag: 'key', html: R`선형회귀로 답할 수 있는 질문: 관계가 있는가(유의성), 얼마나 강한가, 어느 매체가 영향을 주나, 새 예산이면 매출이 얼마일까, 선형인가, 여러 매체 사이에 시너지가 있나(여러 개를 같이 하면 오히려 해가 될 수도). "이게 다 선형회귀로 알 수 있어요."` },
      { at: '9/11 02:33', tag: 'key', html: R`단순선형회귀(simple / univariate) = 예측변수가 딱 하나. TV와 매출, 또는 radio와 매출처럼 하나씩.` }
    ],
    '2-2': [
      { at: '9/11 04:44', tag: 'key', html: R`$\beta_0, \beta_1$ = coefficients = parameters("다 똑같은 말"). 진짜 값은 "<b>영원히 몰라요</b>." 관측 가능한 건 $x, y$. $\varepsilon$은 모르고, 학습 대상도 아니에요.` },
      { at: '9/11 05:20', tag: 'key', html: R`데이터로 구한 $\hat\beta_0, \hat\beta_1$이 진짜에 가까웠으면 좋겠지만, <mark>진짜 값과 비교해서 확인하는 건 절대 불가능</mark>. hat은 항상 "데이터로 추정한 값". 예측값 $\hat y$도 그래서 hat이 붙어요.` }
    ],
    '2-3': [
      { at: '9/11 10:07', tag: 'trap', html: R`<b>잔차 $e_i = y_i - \hat y_i$는 $\varepsilon$과 다른 개념</b>입니다. "이거 헷갈리는 사람 꽤 있어요." $\varepsilon$ = 내가 예측을 했든 안 했든 진짜 모델에 있는 노이즈. 잔차 = 내 예측이 실제 데이터와 얼마나 차이 나는가.` },
      { at: '9/11 11:21', tag: 'key', html: R`잔차를 그냥 더하지 않고 <b>제곱</b>해서 더하는 이유: 음수로 큰 것도 나쁜 예측이니까. 그 합이 RSS. RSS를 $\hat\beta_0$ 기준으로 보면 <b>2차식</b> → 최솟값이 존재 → 미분해서 0인 점을 찾으면 됨($\hat\beta_1$도 마찬가지).` },
      { at: '9/11 21:29', tag: 'exam', html: R`그림에서 회색 실선 = 각 점의 <b>잔차</b>. 모든 $\hat y_i$는 직선 위에 있어요. 파란 회귀선 = 회색 선 길이를 제곱해서 다 더한 값이 <mark>가장 작은</mark> 선.` }
    ],
    '2-4': [
      { at: '9/11 15:50', tag: 'key', html: R`해를 수식으로 딱 쓸 수 있으면 <b>closed-form(닫힌 해)</b>. 편미분 = 나머지는 상수로 보고 한 변수로만 미분. 식 2개, 미지수 2개($\hat\beta_0, \hat\beta_1$)인 연립방정식이고, $x, y$는 데이터라 다 아는 값.` },
      { at: '9/11 19:15', tag: 'exam', html: R`"고등학교 수학으로 다 풀 수 있어요. <b>최대 3분</b>이면 푸니까 꼭 손으로 해 보세요." 코드로는 두 줄. 절편 $\hat\beta_0 = \bar y - \hat\beta_1 \bar x$는 기울기의 함수라서, 기울기가 정해지면 절편이 정해져요.` }
    ],
    '2-5': [
      { at: '9/11 22:38', tag: 'exam', html: R`<b>"$\hat\beta_0, \hat\beta_1$은 확률변수(random variable)일까요?" → 예.</b> 교수님: "<mark>시험에 나올 수 있습니다.</mark> 머신러닝 해 봤다는 사람도 여기서부터 차이가 나요."` },
      { at: '9/11 23:56', tag: 'key', html: R`이유: 데이터는 모집단(population)에서 뽑은 <b>표본(sample)</b>. 서울대생 전체의 평균 키(모집단)는 못 재니 일부 학생으로 추정하면, 다른 학생들을 뽑았을 땐 값이 달라지죠. 데이터가 조금만 바뀌어도 기울기가 미세하게 바뀌어요 → $\hat\beta$에는 분산이 있고, 그 크기가 <b>표준오차</b>. "이걸 이해 못 하면 '추정했는데 왜 에러가 있어요?'라고 묻게 돼요."` },
      { at: '9/11 27:56', tag: 'key', html: R`$\mathrm{SE}(\hat\beta_1)^2 = \sigma^2/\sum(x_i-\bar x)^2$의 직관 ① 분자 $\sigma^2 = \mathrm{Var}(\varepsilon)$: 노이즈가 크면 기울기가 흔들림 → SE↑. ② 분모: $x_i$들이 $\bar x$ 근처에 <b>몰려 있으면</b> 분모가 작아 SE↑. 몰린 점들 사이에 점 하나만 멀리 찍혀도 기울기가 확 바뀌거든요. 넓게 퍼져 있으면 점 하나로는 거의 안 바뀜. "이거 이해하면 기본이 잘 됐다고 할 수 있어요."` },
      { at: '9/11 33:36', tag: 'trap', html: R`95% 신뢰구간 $\hat\beta_1 \pm 2\,\mathrm{SE}$ (정확히는 1.96). 해석은 "<b>95% 확률로 $\beta_1$이 이 구간 안에 있다</b>"가 <mark>아님</mark>. 데이터셋을 100번 새로 얻어 구간 100개를 만들면 약 95개가 진짜 $\beta_1$을 포함한다는 뜻. 선거 여론조사의 신뢰구간도 같은 이야기.` }
    ],
    '2-6': [
      { at: '9/11 35:40', tag: 'key', html: R`TV 광고가 매출에 전혀 영향이 없다면 진짜 $\beta_1 = 0$ → $Y = \beta_0 + \varepsilon$. 이게 $H_0$.` },
      { at: '9/11 37:43', tag: 'trap', html: R`가설은 <b>진짜 값 $\beta_1$</b>에 대한 것이지 <b>$\hat\beta_1$에 대한 게 아니에요</b>. "꼭 헷갈리시는 분들 계세요."` },
      { at: '9/11 39:02', tag: 'key', html: R`$t = (\hat\beta_1 - 0)/\mathrm{SE}$에서 0을 빼는 건 비교 기준이 0이라서. t분포는 정규분포와 비슷한데 꼬리가 조금 더 두꺼워요. $|t|$가 클수록 "$H_0$가 참이라면 이만큼 극단적인 데이터를 볼 확률"(p-값)이 작아져요. 보통 p < 0.05면 유의(때로는 0.01). TV는 t = 17.67, p < 0.0001 → $H_0$ 기각.` }
    ],
    '2-7': [
      { at: '9/11 45:15', tag: 'exam', html: R`<b>교수님 질문:</b> "TV 기울기가 0.0475밖에 안 되니 TV와 매출의 선형 관계가 약하다"고 누가 리포트를 썼다면? → <mark>틀렸다.</mark> 작년 기출(radio vs TV 해석 문제)과 같은 원리예요.` },
      { at: '9/11 47:36', tag: 'exam', html: R`이유: 계수의 절댓값은 <b>단위(scale)에 좌우</b>돼요. 같은 데이터를 단위만 바꿔 쓰면(예: 매출을 천 개 단위가 아니라 개 단위로) 계수가 47.5가 됩니다. 데이터는 하나도 안 바뀌었는데 숫자만 1000배. "계수 절댓값 가지고 선형성이 뚜렷하다/약하다 <b>절대</b> 말할 수 없어요."` },
      { at: '9/11 48:33', tag: 'key', html: R`판단 기준은 <b>t-통계량 = 계수 ÷ 표준오차</b>(또는 p-값). 계수가 47.5여도 SE가 400이면 유의하지 않고, 0.0475여도 SE가 0.0027이면 매우 유의해요. 시험에서 t와 p를 가려도, 계수와 SE만 있으면 t를 계산하거나 $\hat\beta \pm 2\,\mathrm{SE}$가 0을 포함하는지로 판단할 수 있어요.` }
    ],
    '2-8': [
      { at: '9/11 51:25', tag: 'key', html: R`RSE는 모델 비교에는 잘 안 써요(RSE 최소화 = RSS 최소화). 진짜 쓸모는 <b>$\varepsilon$의 표준편차 $\sigma$를 추정</b>하는 것 → SE 공식의 $\sigma$ 자리에 넣어요.` },
      { at: '9/11 53:24', tag: 'key', html: R`$R^2 = 1 - \mathrm{RSS}/\mathrm{TSS}$. TSS는 $y$ 자체의 변동이라 <b>모델링을 잘하든 못하든 그대로</b>. RSS는 잘 맞출수록 작아지니 $R^2$는 1에 가까워져요. RSS ≥ 0이라 $R^2$는 1보다 클 수 없어요.` },
      { at: '9/11 55:48', tag: 'trap', html: R`<b>$R^2$가 음수일 수 있나?</b> <mark>일반적으로는 가능</mark>: RSS > TSS, 즉 모델이 "그냥 $\bar y$로 찍기"보다 못할 때. 예전 수강생이 뉴럴넷을 열심히 돌렸는데 $R^2$가 음수가 나와 "계산이 틀린 것 같다"고 했는데, 사실은 평균도 못 맞추는 모델이었던 것. 단, <b>최소제곱 선형회귀(절편 포함)</b>는 직선이 항상 $(\bar x, \bar y)$를 지나므로 평균보다 나빠질 수 없어 음수가 안 돼요. "함정 문제로 낸다면, 원칙적으로 $R^2$는 음수가 될 수 있다."` },
      { at: '9/11 1:00:34', tag: 'key', html: R`단순선형회귀에서는 $R^2$ = ($X$, $Y$ 상관계수)². 손으로 한번 확인해 보세요. 0.61이면 $y$ 변동의 61%를 설명. 분야마다 달라서 경제·의료에서는 0.1~0.2도 꽤 설명한다고 봐요. F-통계량은 "예측변수 중 적어도 하나라도 유의미한가", 클수록 $H_0$를 기각할 증거가 충분.` }
    ],

    /* ---------------- 3F · 9/18 강의 ---------------- */
    '3-1': [
      { at: '9/18 00:28', tag: 'key', html: R`예측변수가 2개면 데이터는 3차원 공간에 있고, 최소제곱은 점에서 평면까지의 <b>세로(y 방향) 거리</b> 제곱합이 최소인 평면을 찾아요. $\hat y$는 모두 평면 위. RSS를 각 $\beta$로 편미분하면 식 $p+1$개, 미지수 $p+1$개.` }
    ],
    '3-2': [
      { at: '9/18 53:18', tag: 'key', html: R`(질의응답) 회귀 분석은 기본적으로 <b>인과관계를 말하지 않아요</b>. 인과를 확실히 알려면 임상시험처럼 <b>개입(intervention)</b> 실험을 해야 하는데, 우리가 가진 건 대부분 <b>관측 데이터</b>(누가 실험을 했든 안 했든 이미 벌어진 일을 받은 것).` },
      { at: '9/18 55:02', tag: 'story', html: R`숨은 교란변수(hidden confounder): 아이스크림 판매량과 상어 공격. "여름"이라는 개념 자체를 모르면 데이터만으로는 절대 설명 못 해요. 단, 공부 시간 → 시험 점수처럼 자연스럽게 인과가 분명한 도메인도 있어요. "주어진 데이터가 어떤 생성 과정에서 왔느냐에 달렸다."` }
    ],
    '3-3': [
      { at: '9/18 05:56', tag: 'exam', html: R`<b>$\hat\beta = (X^\top X)^{-1}X^\top y$</b>. "자다가 누가 '선형회귀 해가 뭐야?' 물어도 바로 나와야 기본이 된 거예요." 아름다운 점: 데이터가 얼마나 많든 $X, y$만 있으면 한 줄로 계산.` },
      { at: '9/18 02:33', tag: 'key', html: R`$X$의 첫 열을 모두 1로 두는 이유 = 절편 $\beta_0$ 자리를 만들기 위해. RSS는 $\beta$에 대한 2차식 → 미분해서 0으로 두고 정리하면 끝. $X^\top X$는 $X$가 어떤 모양이든 항상 정방행렬.` }
    ],
    '3-4': [
      { at: '9/18 07:02', tag: 'exam', html: R`"언제 $(X^\top X)^{-1}$이 존재하지 않을까?" → $X$의 열(특징)들이 <b>선형종속</b>일 때. 예: 한 열이 다른 열의 정확히 2배 → 두 특징의 상관이 완벽(perfect correlation) → <mark>유일한 해가 없다</mark>.` },
      { at: '9/18 13:50', tag: 'key', html: R`상관이 1은 아니고 0.95처럼 아주 높으면? 역행렬은 계산되지만 <b>불안정(unstable)</b>해요. "불안정하다 = 분산이 크다 = 표준오차가 크다, <b>다 똑같은 말</b>."` },
      { at: '9/18 15:12', tag: 'story', html: R`<b>모빌·판자 비유.</b> 선형회귀는 데이터 공간에서 평면(판자)을 찾는 것이고, 데이터 점들이 판자를 받쳐(support) 줘요. $x_1, x_2$가 강하게 상관되면 점들이 한 직선 위에 모여 있어서, 판자를 한 기울기로 고정하지 못하고 살짝만 건드려도 빙글 돌아가요. 점들이 공간에 넓게 퍼져 있으면 판자가 딱 고정되죠. "선형회귀 배운 사람, 심지어 대학원생도 이 직관을 잘 모르는 경우가 많아요."` },
      { at: '9/18 21:02', tag: 'key', html: R`결과가 어디에 나타나나? <b>표준오차</b>. SE가 크면 $|t|$가 작아지고, "$\beta = 0$"을 부정할 수 없게 돼요(유의하지 않음).` }
    ],
    '3-5': [
      { at: '9/18 23:09', tag: 'exam', html: R`p-값은 <b>계수 하나하나</b>에 대한 검정이에요. "모델 전체가 유의하다/아니다"가 아니에요. 셋을 다 넣어도 newspaper처럼 유의하지 않은 변수가 있을 수 있어요. t와 p를 가려도 계수와 SE로 판단 가능($\pm 2\,\mathrm{SE}$가 0을 포함하나?).` },
      { at: '9/18 25:43', tag: 'key', html: R`상관행렬: TV–radio는 0.05로 낮지만 radio–newspaper는 꽤 높아요. newspaper는 산점도에서도 관계가 흩어져 있었죠.` }
    ],
    '3-6': [
      { at: '9/18 27:43', tag: 'key', html: R`$R^2$ 0.897 (TV만 쓸 땐 0.61). 0.8~0.9는 실무에서 잘 안 나오는 값이고 논문에서도 0.1~0.2면 설명한다고 봐요. RSE도 거의 절반. F가 크면 <b>아무 예측변수도 없는 null 모델</b>보다 확실히 낫다는 뜻.` }
    ],
    '3-7': [
      { at: '9/18 29:20', tag: 'key', html: R`TV와 radio를 <b>함께</b> 하면 시너지가 날 수도, 반대로 역효과가 날 수도 있어요. 방법은 별거 아니에요: 교차항 $x_1 x_2$를 새 특징으로 만들어 넣고 평소처럼 선형회귀.` },
      { at: '9/18 34:29', tag: 'exam', html: R`$R^2$ 89.7% → 96.8%: "<b>7% 늘었다</b>"가 아니라 <mark>남아 있던 10.3% 중 69%</mark>를 더 설명한 것. 항 하나로 엄청 큰 개선이에요.` },
      { at: '9/18 37:31', tag: 'key', html: R`해석이 달라져요. TV 1단위 증가의 효과를 말하려면 <b>radio 예산이 얼마인지</b> 알아야 해요($\beta_1 + \beta_3\cdot\text{radio}$). 반대로 radio의 효과는 TV 예산에 달렸고, TV가 클수록 radio 1단위의 효과가 커져요.` }
    ],
    '3-8': [
      { at: '9/18 39:40', tag: 'exam', html: R`교차항은 유의한데 radio 주효과의 p-값이 0.5였다고 하자. "그럼 radio를 빼 버릴까?" → <mark>안 돼요.</mark> 교차항을 넣으면 주효과(base term)는 유의하든 아니든 <b>무조건</b> 포함. 없으면 해석이 불가능하거나 왜곡돼요.` }
    ],
    '3-9': [
      { at: '9/18 43:50', tag: 'exam', html: R`<b>수업 중 투표:</b> "mpg = $\beta_0 + \beta_1$hp $+ \beta_2$hp² 는 선형 모델인가?" 반이 갈렸는데 답은 <mark>선형 모델</mark>. "오늘 이후로 선형이냐 아니냐는 <b>입력이 아니라 파라미터 기준</b>이에요." hp 기준으로는 2차식이지만 $\beta$에 대해서는 1차식. hp²은 그냥 변형된 특징 하나가 더 늘어난 것이라 $(X^\top X)^{-1}X^\top y$로 그대로 풀려요.` },
      { at: '9/18 47:09', tag: 'key', html: R`그래서 선형회귀로도 $x$와 $y$의 <b>비선형 관계</b>를 표현할 수 있어요.` },
      { at: '9/18 48:17', tag: 'key', html: R`왜 3차·4차·5차…를 다 넣지 않나? 복잡도↑ → 노이즈까지 맞추는 과적합(분산이 큰 함수). 적절한 차수는? 변수가 3개 이상이면 시각화도 못 하니 <b>교차검증</b>으로 여러 차수를 평가해서 고른다(모델 선택). 차수를 정하기 싫으면 어떤 함수든 근사하는 뉴럴넷(universal approximator)을 쓰기도 해요.` }
    ],
    '3-10': [
      { at: '9/18 48:58', tag: 'key', html: R`로지스틱 회귀 = 선형회귀 + <b>링크 함수</b>로 분류까지. 릿지·라쏘 = 선형회귀에서 더 희소한(sparse) 모델을 찾는 방법, 영향 없는 계수를 0 쪽으로 밀어내요. "뉴럴넷까지 가도 가장 기본은 선형회귀."` }
    ],
    '3-11': [
      { at: '9/18 58:17', tag: 'key', html: R`RSS도, $R^2$도 <b>훈련 데이터</b>에서 계산한 값이에요. 궁극적 목표는 훈련 오차 0이 아니라 일반화.` },
      { at: '9/18 1:00:45', tag: 'exam', html: R`<b>"무조건 머릿속에 기억하세요."</b> 테스트 데이터는 훈련 데이터와 <mark>같은 분포</mark>에서 온, 아직 보지 못한 새 데이터 포인트. 다른 분포에서도 잘하길 바라는 건 "마법". 수학 공부 열심히 하고 국어 시험 잘 보길 바라는 것과 같아요. 이걸 잘못 이해하면 과적합도 잘못 이해하게 돼요.` },
      { at: '9/18 1:03:21', tag: 'trap', html: R`"훈련 오차가 매우 낮으니 테스트 오차도 낮겠다"라고 말하면 <b>안 돼요</b>. 기출을 다 외워 기출 오답률이 0이어도 새 시험 오답률이 0은 아니죠. 과적합 정의도 다시: 훈련 오차가 0이 된 게 아니라, 훈련 데이터의 노이즈까지 학습해서 테스트 오차가 큰 상태.` }
    ],
    '3-12': [
      { at: '9/18 1:06:52', tag: 'story', html: R`이상적인 건 큰 테스트셋이 따로 있는 "골든 케이스". 현실은 훈련할 데이터도 부족하죠. 프런티어 AI 회사들이 큰돈을 들여 만드는 것 중 하나가 평가용 데이터셋이에요.` },
      { at: '9/18 1:08:34', tag: 'key', html: R`AIC, BIC, $C_p$: 훈련 오차를 보정해 테스트 오차를 가늠하는 지표. "<b>시험에는 안 나오고</b>, 요즘은 잘 안 써요. 참고만."` },
      { at: '9/18 1:11:50', tag: 'exam', html: R`검증셋 방법: 먼저 <b>셔플</b>(왜? 항상 앞쪽 데이터만 쓰지 않고 무작위로 나누려고) → 나누기(반반일 필요 없음, 70/30, 80/20, 60/40 다 가능) → 한쪽으로만 훈련, 나머지는 평가에만.` },
      { at: '9/18 1:13:21', tag: 'key', html: R`Auto 392개 → 196/196, 1~10차 다항식, 10번 반복. "2차 모델의 테스트 MSE는 얼마일까?" → 분할에 따라 16일 수도 25일 수도. 신뢰할 만한 방법이 아니에요. "variability가 높다 = 안 좋은 소식."` }
    ],
    '3-13': [
      { at: '9/18 1:15:02', tag: 'exam', html: R`단점 2: 테스트 오차를 <b>과대추정(overestimate)</b> = 성능을 실제보다 나쁘게 말함. 이유: 데이터를 절반만 써서 훈련하니 더 나쁜 모델이 나오기 때문.` }
    ],
    '3-14': [
      { at: '9/18 1:16:10', tag: 'key', html: R`K-fold 순서: 셔플 → K개로 나눔(거의 같은 크기면 됨) → 폴드끼리 <b>겹치지 않음</b>(교집합 없음, 분할) → 각 폴드가 한 번씩 검증셋 → 나머지 K−1개로 훈련 → 오차 기록 → K번 반복 → 평균. 모델 적합 횟수 = <b>K번</b>.` },
      { at: '9/18 1:19:02', tag: 'key', html: R`데이터 1001개를 5-fold로 나누면 200, 200, 200, 200, 201처럼 딱 안 나눠져도 괜찮아요. 평균 낼 때 폴드 크기로 가중평균($n_k/n$)하면 돼요.` }
    ],
    '3-15': [
      { at: '9/18 1:21:24', tag: 'exam', html: R`LOOCV(K = n)는 <b>셔플이 필요 없는 유일한 경우</b>(어차피 하나씩 다 빠지니까). 그 외 교차검증은 무조건 셔플.` },
      { at: '9/18 1:22:33', tag: 'key', html: R`LOOCV 적합 횟수 = n번. 장점: 매번 최대한 많은 데이터로 학습. 치명적 단점: 계산. 데이터가 100만 개면 100만 번.` },
      { at: '9/18 1:23:36', tag: 'exam', html: R`교수님 결론: "<mark>LOOCV는 실제로 거의 사용하지 않아요.</mark>" 대부분 10-fold나 5-fold를 쓰고 결과는 거의 차이 없어요. 10-fold를 반복해도 곡선이 서로 비슷(검증셋 방법처럼 흔들리지 않음).` },
      { at: '9/18 1:24:32', tag: 'key', html: R`그림: 파랑 = 진짜 테스트 MSE(실제로는 절대 접근 불가), 검정 점선 = LOOCV, 주황 = 10-fold. 핵심은 <b>최솟값 위치</b>를 잘 찾는다는 것. 앞으로 선형·로지스틱·뉴럴넷 무엇을 하든 테스트 성능 추정과 하이퍼파라미터 선택엔 교차검증, 5나 10-fold면 충분.` }
    ]
  };

  /* ---------------- 실전 연습 (영어 · 실제 시험 형식) ---------------- */
  const tf = (q, a, why, ko) => ({ t: 'tf', q, a, why, ko });
  const multi = (q, c, a, why, ko) => ({ t: 'multi', q, c, a, why, ko });
  const short = (q, model, rubric, ko) => ({ t: 'short', q, model, rubric, ko });

  H.drill = {
    '1-1': [
      tf(R`Deep learning is a subset of machine learning, which is in turn a subset of artificial intelligence.`, true, R`AI ⊃ ML ⊃ DL. 딥러닝은 deep neural network로 하는 머신러닝이에요.`, '딥러닝은 머신러닝의 부분집합이고, 머신러닝은 인공지능의 부분집합이다.'),
      multi(R`Which of the following are part of the definition of machine learning given in lecture? (Select all that apply.)`, [R`It learns from data.`, R`It generalizes to data that were not observed during training.`, R`It requires hand-coded rules for each situation.`, R`It must use a deep neural network.`], [0, 1], R`핵심은 "데이터에서 학습 + 보지 못한 데이터로 일반화 + 명시적 지시 없이". 규칙을 손으로 짜는 건 룰 기반, 신경망은 딥러닝의 조건이에요.`, '강의에서 준 머신러닝의 정의에 해당하는 것을 모두 고르시오.')
    ],
    '1-2': [
      multi(R`Which of the following were named in lecture as the main drivers of recent progress in AI? (Select all that apply.)`, [R`Data`, R`Computing power`, R`Algorithms and models (e.g., transformers)`, R`Replacing learned models with hand-written rules`], [0, 1, 2], R`데이터 · 컴퓨팅 파워 · 알고리즘(모델)의 "삼박자".`, 'AI 발전의 주요 동력으로 강의에서 든 것을 모두 고르시오.')
    ],
    '1-3': [
      tf(R`A model can be viewed as a function that maps an input (data) to an output such as a prediction, a generation, or a decision.`, true, R`개·고양이 분류기도, ChatGPT도 입력 → 출력의 함수예요.`, '모델은 입력을 예측·생성·결정 같은 출력으로 보내는 함수로 볼 수 있다.'),
      tf(R`A good machine learning model memorizes its training examples, and that is why it performs well on new data.`, false, R`외우는 게 아니라 패턴을 학습해서 새 데이터에 일반화하는 것. 외우기만 하면 과적합이에요.`, '좋은 모델은 훈련 예시를 외우기 때문에 새 데이터에서 잘한다.')
    ],
    '1-4': [
      tf(R`In $Y = f(X) + \varepsilon$, the error term $\varepsilon$ is assumed to have mean zero and to be independent of $X$.`, true, R`두 가정을 세트로 기억. 뒤의 거의 모든 유도가 이 둘을 써요.`, 'ε는 평균이 0이고 X와 독립이라고 가정한다.'),
      multi(R`In the model $Y = f(X) + \varepsilon$, which of the following can be directly observed from the data? (Select all that apply.)`, [R`$X$`, R`$Y$`, R`$f$`, R`$\varepsilon$`], [0, 1], R`관측 가능: $X, Y$. $f$는 모르는 학습 대상, $\varepsilon$은 관측도 안 되고 학습 대상도 아님.`, '데이터에서 직접 관측할 수 있는 것을 모두 고르시오.'),
      tf(R`The error term $\varepsilon$ is one of the quantities we try to learn from the data.`, false, R`교수님: "$\varepsilon$은 학습 대상이 아니에요." 학습을 방해하는 노이즈일 뿐, 우리가 학습하는 건 $f$.`, 'ε는 데이터로부터 학습하려는 대상 중 하나다.')
    ],
    '1-5': [
      tf(R`Determining which predictors are associated with the response is an example of inference rather than prediction.`, true, R`어떤 변수가 중요한지 = 추론(inference).`, '어떤 예측변수가 반응과 연관되는지 알아내는 것은 예측이 아니라 추론의 예다.'),
      tf(R`If a variable is included as an input, it must have an effect on the response.`, false, R`결혼 여부는 입력에 있어도 소득엔 영향이 없을 수 있어요. 그걸 가려내는 게 추론.`, '입력에 포함된 변수는 반드시 반응에 영향을 준다.')
    ],
    '1-6': [
      tf(R`Under squared-error loss, the ideal predictor is $f(x) = E(Y \mid X = x)$.`, true, R`조건부 기댓값이 $\mathbb{E}[(Y-g(X))^2 \mid X=x]$를 최소화하는 회귀함수.`, '제곱오차 기준으로 이상적인 예측기는 조건부 기댓값이다.'),
      short(R`Why do we minimize the squared difference $(Y - g(X))^2$ rather than the raw difference $Y - g(X)$? Briefly explain.`, R`<p>차이를 그대로 최소화하면 $Y - g(X)$를 음의 무한대로 보내는 "나쁜" 예측이 가장 좋은 것처럼 보여요. 제곱하면 <b>양쪽 방향의 벗어남을 모두 벌점</b>으로 처리하고, <b>큰 오차일수록 더 크게</b>(10 → 100) 벌점을 줍니다. 또 2차식이라 <b>미분으로 최솟값을 찾기 쉽고</b>, 그 최소화 해가 조건부 기댓값 $\mathbb{E}(Y\mid X=x)$가 됩니다.</p><p class="en-model">Minimizing the raw difference would reward predictions that are far too large (a hugely negative difference looks "small"). Squaring penalizes deviations in both directions, penalizes large errors more heavily, and gives a smooth quadratic objective whose minimizer is the conditional mean.</p>`, ['양·음 두 방향의 오차를 모두 벌점으로 만든다', '큰 오차를 더 크게 벌한다', '2차식이라 미분·최소화가 쉽고 해가 조건부 평균이 된다'], '왜 차이 대신 차이의 제곱을 최소화하는지 간단히 설명하시오.')
    ],
    '1-7': [
      tf(R`If we knew the true $f$ exactly, the expected squared prediction error would be zero.`, false, R`$\mathrm{Var}(\varepsilon)$(irreducible error)가 남아요. 오라클이 $f$를 줘도 못 줄입니다.`, '진짜 f를 정확히 알면 기대 제곱 예측오차는 0이다.'),
      tf(R`The irreducible error $\mathrm{Var}(\varepsilon)$ provides a lower bound on the expected test MSE.`, true, R`기대 테스트 MSE = 분산 + 편향² + $\mathrm{Var}(\varepsilon)$, 앞 두 항이 0 이상이라 $\mathrm{Var}(\varepsilon)$ 밑으로는 못 내려가요.`, 'Var(ε)는 기대 테스트 MSE의 하한이다.'),
      multi(R`Which assumptions are used to show $E[(Y-\hat f(X))^2 \mid X = x] = [f(x) - \hat f(x)]^2 + \mathrm{Var}(\varepsilon)$? (Select all that apply.)`, [R`$E[\varepsilon] = 0$`, R`$\varepsilon$ is independent of $X$`, R`$f$ is linear`, R`$\varepsilon$ is normally distributed`], [0, 1], R`교차항을 없애는 데 평균 0과 독립만 필요. 선형성·정규성은 필요 없어요.`, '이 분해를 보이는 데 쓰는 가정을 모두 고르시오.')
    ],
    '1-8': [
      multi(R`Which statements about parametric and non-parametric methods are correct? (Select all that apply.)`, [R`Parametric methods reduce the problem of estimating $f$ to estimating a set of parameters.`, R`If the assumed functional form is far from the true $f$, a parametric estimate can be poor no matter how well it is fit.`, R`Non-parametric methods typically need many more observations to estimate $f$ accurately.`, R`Non-parametric methods make strong assumptions about the functional form of $f$.`], [0, 1, 2], R`D가 반대: 비모수적은 형태 가정이 없어요. B는 교수님 강조 포인트("시작부터 잘못").`, '모수적·비모수적 방법에 대한 옳은 설명을 모두 고르시오.'),
      tf(R`Logistic regression is a non-parametric method.`, false, R`교수님: 로지스틱 회귀도 모수적. 비모수의 대표 예는 트리.`, '로지스틱 회귀는 비모수적 방법이다.')
    ],
    '1-9': [
      tf(R`A model is overfitting if and only if its training error is zero.`, false, R`교수님이 가장 강조한 함정. 과적합 = 훈련 데이터의 노이즈까지 학습해 일반화가 안 되는 것. 훈련 오차 0은 정의가 아니에요.`, '훈련 오차가 0이면, 그리고 그때만 과적합이다.'),
      tf(R`The vertical distance between an observation and the fitted surface $\hat f$ is the error term $\varepsilon$.`, false, R`적합 곡면과의 거리 = 잔차. $\varepsilon$은 <b>진짜</b> $f$와의 거리이고 관측할 수 없어요.`, '관측값과 적합된 곡면 사이의 세로 거리는 오차항 ε이다.'),
      short(R`Define overfitting in your own words.`, R`<p>과적합은 모델이 훈련 데이터의 <b>노이즈(ε)까지 학습</b>해 버려서, 같은 분포에서 오는 <b>새 데이터(테스트)에서는 성능이 나빠지는</b>(일반화가 안 되는) 현상입니다. 보통 훈련 오차는 매우 작고 테스트 오차는 커지지만, "훈련 오차가 0"이라는 것 자체가 정의는 아닙니다.</p><p class="en-model">Overfitting occurs when a method follows the noise (the errors ε) in the training data too closely, so it fails to generalize: training error is small but test error on new data from the same distribution is large.</p>`, ['노이즈(ε)까지 학습한다', '새 데이터(테스트)에서 성능이 나쁘다 = 일반화 실패', '훈련 오차 0 자체를 정의로 쓰지 않았다'], '과적합을 자신의 말로 정의하시오.')
    ],
    '1-10': [
      tf(R`When two models have similar test accuracy, we often prefer the one with fewer parameters.`, true, R`절약(parsimony). 1000개 vs 10개가 비슷하면 10개.`, '테스트 정확도가 비슷하면 파라미터가 적은 모델을 선호하는 경우가 많다.'),
      multi(R`In which situations would a more interpretable (less flexible) model often be preferred? (Select all that apply.)`, [R`A doctor needs to understand why a cancer prediction was made.`, R`A credit scoring model must explain why a customer received a given score.`, R`A trading firm only cares about squeezing out the highest predictive accuracy.`, R`The goal is inference about which predictors matter.`], [0, 1, 3], R`의료·신용점수·추론은 해석력이 중요. 정확도만 중요한 투자 모델은 블랙박스도 OK.`, '해석력이 높은(덜 유연한) 모델이 선호되는 상황을 모두 고르시오.')
    ],
    '1-11': [
      tf(R`Choosing the model flexibility that minimizes the training MSE usually also minimizes the test MSE.`, false, R`훈련 MSE로 고르면 가장 구불구불한 모델을 고르게 되고, 테스트 MSE는 오히려 커져요.`, '훈련 MSE를 최소화하는 유연성을 고르면 대개 테스트 MSE도 최소가 된다.'),
      tf(R`As flexibility increases, the training MSE generally decreases monotonically, while the test MSE typically shows a U-shape.`, true, R`회색(훈련)은 계속 내려가고 빨강(테스트)은 U자.`, '유연성이 커지면 훈련 MSE는 단조 감소하고 테스트 MSE는 U자 모양이다.'),
      multi(R`Which of the following is (or are) what you ultimately aim to minimize when fitting a model on data? (Select all that apply.)`, [R`The expected test error on new observations from the same distribution`, R`The reducible error $[f(x) - \hat f(x)]^2$`, R`The irreducible error $\mathrm{Var}(\varepsilon)$`, R`The training error, even if the test error goes up`], [0, 1], R`목표는 일반화(테스트 오차), 그리고 우리가 줄일 수 있는 건 reducible error뿐. irreducible은 못 줄이고, 테스트 오차를 희생한 훈련 오차 최소화는 과적합. (최소제곱은 계산상 훈련 RSS를 최소화하지만, 그건 목표가 아니라 수단이에요.)`, '모델을 적합할 때 궁극적으로 최소화하려는 것을 모두 고르시오. (작년 기출 유형)')
    ],
    '1-12': [
      short(R`Suppose $\hat f$ is trained on a dataset of $n$ observations $\{(x_i, y_i)\}_{i=1}^n$. In the bias-variance decomposition of the expected test MSE at $(x_0, y_0)$, briefly explain why we have randomness in $\hat f(x_0)$.`, R`<p>훈련 데이터 $\{(x_i, y_i)\}$는 어떤 분포(모집단)에서 뽑힌 <b>확률 표본</b>입니다. 다른 훈련셋을 뽑았다면 $y_i$ 속의 노이즈도, 뽑힌 점도 달라져서 추정된 $\hat f$가 달라지고, 따라서 $\hat f(x_0)$도 달라집니다. 즉 $\hat f(x_0)$는 <b>훈련셋에 대한 확률변수</b>이고, 기대 테스트 MSE의 기댓값도 훈련셋의 반복 추출에 대한 것입니다. 그 흔들림의 크기가 분산 항 $\mathrm{Var}(\hat f(x_0))$입니다. (새 관측 $y_0$ 속의 $\varepsilon_0$에서 오는 무작위성과는 별개.)</p><p class="en-model">Because $\hat f$ is estimated from a training set that is a random sample from the population. A different training set (different noise in the $y_i$) would give a different fit, so $\hat f(x_0)$ varies across training sets; this variability is $\mathrm{Var}(\hat f(x_0))$ in the decomposition.</p>`, ['훈련 데이터가 분포(모집단)에서 뽑힌 확률 표본이다', '훈련셋이 바뀌면 f̂, 따라서 f̂(x₀)가 바뀐다', '그 흔들림이 분산 항 Var(f̂(x₀))이다'], '(작년 기출) f̂(x₀)에 무작위성이 있는 이유를 간단히 설명하시오.'),
      multi(R`As a statistical learning method becomes more flexible, which of the following typically happen? (Select all that apply.)`, [R`The variance of $\hat f(x_0)$ increases.`, R`The squared bias decreases.`, R`The irreducible error decreases.`, R`The training MSE increases.`], [0, 1], R`분산↑, 편향²↓. irreducible은 모델과 무관하고, 훈련 MSE는 감소해요.`, '방법이 더 유연해지면 보통 일어나는 일을 모두 고르시오.'),
      tf(R`The expected test MSE at $x_0$ can never be smaller than $\mathrm{Var}(\varepsilon)$.`, true, R`분산과 편향²이 모두 0 이상이므로.`, '기대 테스트 MSE는 Var(ε)보다 작아질 수 없다.')
    ],

    '2-1': [
      multi(R`Which questions about the Advertising data can a linear regression analysis help answer? (Select all that apply.)`, [R`Is there a relationship between advertising budget and sales?`, R`Which media are associated with sales?`, R`Is there synergy (interaction) among the media?`, R`Does TV advertising cause sales, as a randomized experiment would show?`], [0, 1, 2], R`관계 유무·어느 매체·시너지는 회귀로 답할 수 있지만, 관측 데이터의 회귀로 인과를 증명할 수는 없어요.`, '선형회귀로 답할 수 있는 질문을 모두 고르시오.')
    ],
    '2-2': [
      tf(R`$\hat\beta_1$ denotes the true, unknown slope of the population regression line.`, false, R`hat = 데이터로 추정한 값. 진짜 기울기는 $\beta_1$이고 "영원히 몰라요".`, 'β̂₁은 모집단 회귀선의 진짜 기울기를 뜻한다.')
    ],
    '2-3': [
      tf(R`The residual $e_i = y_i - \hat y_i$ is the same quantity as the error term $\varepsilon_i$.`, false, R`교수님: "헷갈리는 사람 꽤 있어요." $\varepsilon_i$ = 진짜 모델의 노이즈, $e_i$ = 내 예측과 데이터의 차이.`, '잔차 e_i는 오차항 ε_i와 같은 양이다.'),
      tf(R`The least squares line minimizes the sum of squared vertical distances between the observations and the line.`, true, R`그림의 회색 선(잔차) 길이의 제곱합이 최소인 선.`, '최소제곱 직선은 관측값과 직선 사이 세로 거리의 제곱합을 최소화한다.')
    ],
    '2-4': [
      tf(R`The least squares estimates in simple linear regression have a closed-form solution.`, true, R`편미분 = 0인 연립방정식 두 개를 풀면 식으로 딱 나와요.`, '단순선형회귀의 최소제곱 추정값은 닫힌 해가 있다.'),
      short(R`Derive the least squares estimates $\hat\beta_0$ and $\hat\beta_1$ in simple linear regression.`, R`<p>$\mathrm{RSS} = \sum_i (y_i - \beta_0 - \beta_1 x_i)^2$를 각 계수로 편미분해 0으로 둡니다.</p>$$\frac{\partial}{\partial \beta_0}: -2\sum_i (y_i - \beta_0 - \beta_1 x_i) = 0 \Rightarrow \hat\beta_0 = \bar y - \hat\beta_1 \bar x$$ $$\frac{\partial}{\partial \beta_1}: -2\sum_i x_i(y_i - \beta_0 - \beta_1 x_i) = 0$$<p>첫 식을 둘째 식에 넣어 정리하면</p>$$\hat\beta_1 = \frac{\sum_i (x_i - \bar x)(y_i - \bar y)}{\sum_i (x_i - \bar x)^2}.$$<p>RSS는 각 계수에 대한 2차식(아래로 볼록)이므로 이 점이 최솟값입니다.</p>`, ['RSS를 정의했다', '두 계수로 편미분해 0으로 두었다', 'β̂₀ = ȳ − β̂₁x̄', 'β̂₁ = Σ(x−x̄)(y−ȳ)/Σ(x−x̄)²'], '단순선형회귀의 최소제곱 추정값을 유도하시오.')
    ],
    '2-5': [
      tf(R`The least squares coefficient estimates $\hat\beta_0$ and $\hat\beta_1$ are random variables.`, true, R`교수님: "시험에 나올 수 있습니다." 데이터가 모집단에서 뽑힌 표본이라, 표본이 바뀌면 추정값도 바뀌어요. 그래서 표준오차가 있어요.`, '최소제곱 추정값 β̂₀, β̂₁은 확률변수다.'),
      tf(R`A 95% confidence interval of $[0.042, 0.053]$ for $\beta_1$ means there is a 95% probability that $\beta_1$ lies in this particular interval.`, false, R`반복해서 데이터를 얻어 구간을 만들면 약 95%가 진짜 $\beta_1$을 포함한다는 뜻. 이미 만든 한 구간에 대한 확률이 아니에요.`, 'β₁의 95% 신뢰구간 [0.042, 0.053]은 β₁이 이 구간에 있을 확률이 95%라는 뜻이다.'),
      multi(R`Which of the following would make $\mathrm{SE}(\hat\beta_1)$ smaller? (Select all that apply.)`, [R`A larger error variance $\mathrm{Var}(\varepsilon)$`, R`Predictor values $x_i$ more spread out around $\bar x$`, R`More observations, other things being similar`, R`Predictor values $x_i$ tightly clustered around $\bar x$`], [1, 2], R`$\mathrm{SE}^2 = \sigma^2/\sum(x_i-\bar x)^2$. 분모(퍼짐, 관측 수)가 크고 분자(노이즈)가 작을수록 작아져요. 몰려 있으면 점 하나에 기울기가 확 흔들려요.`, 'SE(β̂₁)를 작게 만드는 것을 모두 고르시오.')
    ],
    '2-6': [
      tf(R`The null hypothesis $H_0: \beta_1 = 0$ is a statement about the estimate $\hat\beta_1$.`, false, R`가설은 진짜 값 $\beta_1$에 대한 것. 교수님: "꼭 헷갈리는 분들 계세요."`, '귀무가설 H₀: β₁ = 0은 추정값 β̂₁에 대한 진술이다.'),
      tf(R`A small p-value means that a $t$-statistic as extreme as the one observed would be unlikely if $H_0$ were true.`, true, R`p-값 = $H_0$ 하에서 이만큼 극단적인 값을 볼 확률.`, 'p-값이 작다는 것은 H₀가 참이라면 관측된 만큼 극단적인 t가 나오기 어렵다는 뜻이다.')
    ],
    '2-7': [
      tf(R`If the predictor is rescaled (for example, measured in dollars instead of thousands of dollars), the magnitude of its coefficient changes but its $t$-statistic does not.`, true, R`$X$를 $c$배 하면 $\hat\beta$와 SE가 모두 $1/c$배라 $t$는 그대로. 그래서 강도는 계수가 아니라 $t$로 판단해요.`, '예측변수의 단위를 바꾸면 계수 크기는 바뀌지만 t-통계량은 바뀌지 않는다.'),
      short(R`In the regression of sales on TV, $\hat\beta_1 = 0.0475$ with standard error 0.0027. An analyst concludes that because the coefficient is so small, the linear relationship between TV and sales is weak. Is this correct? Justify your answer.`, R`<p><b>틀렸습니다.</b> 계수의 절댓값은 변수의 <b>단위(scale)</b>에 따라 얼마든지 바뀝니다. 예를 들어 판매량을 천 개 단위가 아닌 개 단위로 쓰면 같은 데이터에서 계수는 47.5가 됩니다. 관계가 뚜렷한지는 추정의 불확실성에 비해 계수가 얼마나 큰지, 즉 $t = \hat\beta_1/\mathrm{SE}(\hat\beta_1) = 0.0475/0.0027 \approx 17.6$으로 판단해야 합니다. $t$가 매우 크고 p-값이 0.0001보다 작으며 95% 신뢰구간 $0.0475 \pm 2(0.0027) = [0.042, 0.053]$이 0을 포함하지 않으므로, TV와 sales 사이에는 매우 유의한 선형 관계가 있습니다.</p><p class="en-model">No. The size of a coefficient depends on the units of measurement, so it cannot measure the strength of the relationship. What matters is the coefficient relative to its standard error: $t \approx 17.6$, $p < 0.0001$, and the 95% CI excludes 0, so there is strong evidence of a linear relationship.</p>`, ['틀렸다고 분명히 답했다', '계수 크기는 단위(스케일)에 좌우된다고 설명했다', 't = 계수/SE 또는 p-값으로 판단해야 한다고 썼다', 't ≈ 17.6 (또는 CI가 0 불포함) → 유의하다고 결론'], '"계수가 작으니 선형 관계가 약하다"는 해석이 옳은지 근거와 함께 답하시오.')
    ],
    '2-8': [
      tf(R`In linear regression, $R^2$ shows the proportion of total variability in $Y$ that can be explained by the fitted model.`, true, R`작년 기출 그대로. $R^2 = 1 - \mathrm{RSS}/\mathrm{TSS}$ = 설명된 분산의 비율.`, '(작년 기출) 선형회귀에서 R²는 전체 변동 중 적합된 모델이 설명하는 비율을 나타낸다.'),
      tf(R`$R^2$ can never be negative for any model.`, false, R`일반적으로는 모델이 $\bar y$ 예측보다 못하면(RSS > TSS) 음수가 돼요. 교수님이 "함정 문제"로 짚은 부분.`, '어떤 모델이든 R²는 절대 음수가 될 수 없다.'),
      tf(R`For least squares linear regression with an intercept, $R^2$ computed on the training data cannot be negative.`, true, R`최소제곱 직선은 $(\bar x, \bar y)$를 지나므로 평균 예측보다 나빠질 수 없어요.`, '절편이 있는 최소제곱 선형회귀에서 훈련 데이터의 R²는 음수가 될 수 없다.'),
      multi(R`Which statements about RSE, $R^2$, and the $F$-statistic are correct? (Select all that apply.)`, [R`The RSE estimates the standard deviation of $\varepsilon$.`, R`The TSS depends on how well the model fits.`, R`In simple linear regression, $R^2$ equals the squared correlation between $X$ and $Y$.`, R`A large $F$-statistic is evidence that at least one predictor is useful.`], [0, 2, 3], R`TSS는 $y$ 자체의 변동이라 모델과 무관해요.`, 'RSE, R², F에 대한 옳은 설명을 모두 고르시오.')
    ],

    '3-1': [
      tf(R`With two predictors, the least squares fit is a plane chosen to minimize the sum of squared vertical distances to the observations.`, true, R`3차원 공간의 평면, 거리는 y 방향.`, '예측변수가 2개면 최소제곱 적합은 관측값까지의 세로 거리 제곱합을 최소화하는 평면이다.')
    ],
    '3-2': [
      tf(R`When predictors are correlated, the interpretation "a unit change in $X_j$ with all other predictors held fixed" can be hazardous.`, true, R`$X_j$가 바뀌면 다른 변수도 같이 바뀌니까요.`, '예측변수가 상관되어 있으면 "다른 변수를 고정한 채 X_j를 1 바꾸면"이라는 해석이 위험해진다.'),
      tf(R`A statistically significant coefficient in a regression on observational data establishes a causal effect.`, false, R`관측 데이터 + 숨은 교란변수(아이스크림과 상어). 인과는 개입 실험으로.`, '관측 데이터 회귀에서 유의한 계수는 인과 효과를 입증한다.')
    ],
    '3-3': [
      tf(R`The least squares solution in multiple linear regression is $\hat\beta = (X^\top X)^{-1}X^\top y$.`, true, R`"자다가 물어도" 나와야 하는 식.`, '다중선형회귀의 최소제곱 해는 (XᵀX)⁻¹Xᵀy이다.'),
      tf(R`The first column of ones in the design matrix $X$ is included so that the model has an intercept.`, true, R`$\beta_0$ 자리를 만들기 위해서.`, '설계행렬 X의 첫 열을 1로 채우는 것은 절편을 넣기 위해서다.')
    ],
    '3-4': [
      multi(R`When does the least squares estimate $(X^\top X)^{-1}X^\top y$ fail to exist uniquely? (Select all that apply.)`, [R`One predictor is an exact multiple of another predictor.`, R`The columns of $X$ are linearly dependent.`, R`There are more parameters than observations ($p + 1 > n$).`, R`Two predictors have correlation 0.95.`], [0, 1, 2], R`상관 0.95는 역행렬은 존재하지만 불안정(분산 큼). 해가 없는 건 완전한 선형종속일 때.`, '최소제곱 해가 유일하게 존재하지 않는 경우를 모두 고르시오.'),
      tf(R`If two predictors are highly (but not perfectly) correlated, $(X^\top X)^{-1}$ exists, but the coefficient estimates have large standard errors.`, true, R`불안정 = 분산 큼 = SE 큼, "다 같은 말".`, '두 예측변수가 매우(완벽하진 않게) 상관되면 역행렬은 존재하지만 계수의 표준오차가 크다.'),
      short(R`Explain intuitively why strongly correlated predictors make the coefficient estimates unstable.`, R`<p>선형회귀는 데이터 공간에서 평면(초평면)을 찾는 문제이고, 데이터 점들이 그 평면을 <b>받쳐 주는</b> 역할을 합니다. 두 예측변수가 강하게 상관되면 점들이 $(x_1, x_2)$ 평면에서 거의 <b>한 직선 위</b>에 모여 있어서, 그 직선을 축으로 평면이 빙글 돌아도 적합도가 거의 같습니다. 그래서 데이터가 조금만 바뀌어도 계수(평면의 기울기)가 크게 바뀌고, 이것이 큰 분산 = 큰 표준오차 = 작은 $|t|$로 나타납니다.</p><p class="en-model">The data points "support" the fitted plane. With highly correlated predictors the points lie close to a line in predictor space, so the plane can rotate around that line with almost no change in fit; small changes in the data then produce large changes in the coefficients (high variance, large SE).</p>`, ['점들이 평면을 받쳐 준다(support)는 관점', '상관이 크면 점들이 한 직선 근처에 모여 평면이 고정되지 않는다', '결과: 분산·표준오차 증가(또는 |t| 감소)'], '강하게 상관된 예측변수가 왜 계수 추정을 불안정하게 만드는지 직관적으로 설명하시오.')
    ],
    '3-5': [
      tf(R`In multiple regression, each coefficient's p-value tests whether that particular predictor is useful given the other predictors; it does not test the whole model.`, true, R`p-값은 계수 하나하나에 대한 것. 전체는 F.`, '다중회귀에서 각 계수의 p-값은 다른 변수가 있을 때 그 변수가 유용한지를 검정하며, 모델 전체를 검정하지 않는다.'),
      multi(R`In the regression of sales on TV, radio, and newspaper (TV: 0.046, SE 0.0014; radio: 0.189, SE 0.0086; newspaper: −0.001, SE 0.0059), which statements are correct? (Select all that apply.)`, [R`TV and radio are statistically significant.`, R`Newspaper is not significant once TV and radio are in the model.`, R`The approximate 95% confidence interval for the newspaper coefficient contains 0.`, R`Radio has a stronger linear relationship with sales than TV because 0.189 > 0.046.`], [0, 1, 2], R`t: TV 32.8, radio 21.9, newspaper −0.18. newspaper 구간 −0.001 ± 0.0118은 0 포함. D는 계수 크기로 강도를 판단한 오류 — 오히려 TV의 t가 더 커요.`, '광고 다중회귀 결과에 대한 옳은 설명을 모두 고르시오.')
    ],
    '3-6': [
      tf(R`A large $F$-statistic indicates that the model is much better than a null model that uses no predictors.`, true, R`F = "적어도 하나라도 유의미한가", null 모델과 비교.`, 'F가 크면 예측변수를 하나도 쓰지 않는 null 모델보다 훨씬 낫다는 뜻이다.')
    ],
    '3-7': [
      tf(R`In $\text{sales} = \beta_0 + \beta_1\text{TV} + \beta_2\text{radio} + \beta_3(\text{TV}\times\text{radio}) + \varepsilon$, the effect on sales of a one-unit increase in TV is $\beta_1$, regardless of the radio budget.`, false, R`TV의 효과 = $\beta_1 + \beta_3\cdot\text{radio}$. radio 예산을 알아야 해요.`, '상호작용 모델에서 TV 1단위 증가의 효과는 radio와 무관하게 β₁이다.'),
      short(R`After adding the TV$\times$radio interaction, $R^2$ rose from 89.7% to 96.8%. Explain why this is described as explaining 69% of the remaining variability rather than a 7% improvement.`, R`<p>가법 모델이 이미 89.7%를 설명했으므로 설명되지 않고 <b>남아 있던 변동은 100 − 89.7 = 10.3%</b>입니다. 상호작용항이 추가로 설명한 몫은 96.8 − 89.7 = 7.1%p이고, 이것은 남아 있던 변동의 $7.1/10.3 \approx 69\%$입니다. 즉 "설명 못 하던 부분의 약 70%를 항 하나로 해결"한 매우 큰 개선입니다.</p>`, ['남은 변동 = 100 − 89.7 = 10.3%', '(96.8 − 89.7)/(100 − 89.7) ≈ 69% 계산', '남은 것 대비 비율이라 큰 개선이라고 해석'], 'R²가 89.7%→96.8%로 오른 것을 왜 "남은 변동의 69%"라고 하는지 설명하시오.')
    ],
    '3-8': [
      tf(R`If the TV$\times$radio interaction is significant but the radio main effect has a p-value of 0.5, radio should be removed from the model.`, false, R`계층 원칙: 교차항이 있으면 주효과는 유의성과 상관없이 무조건 포함.`, '상호작용은 유의한데 radio 주효과 p-값이 0.5라면 radio를 빼야 한다.')
    ],
    '3-9': [
      tf(R`$\text{mpg} = \beta_0 + \beta_1\cdot\text{hp} + \beta_2\cdot\text{hp}^2 + \varepsilon$ is a linear model.`, true, R`수업 중 투표 문제. 선형 여부는 파라미터 기준.`, 'mpg = β₀ + β₁hp + β₂hp² + ε는 선형 모델이다.'),
      tf(R`Whether a regression model is called "linear" is determined by whether it is linear in the input variables.`, false, R`입력이 아니라 <b>파라미터</b>에 대해 선형인지가 기준.`, '회귀 모델이 "선형"인지는 입력 변수에 대해 선형인지로 결정된다.'),
      multi(R`Which of the following are linear models in the sense used in linear regression? (Select all that apply.)`, [R`$Y = \beta_0 + \beta_1 X + \beta_2 X^2 + \varepsilon$`, R`$Y = \beta_0 + \beta_1 X_1 + \beta_2 X_1 X_2 + \varepsilon$`, R`$Y = \beta_0 + \beta_1 \log X + \varepsilon$`, R`$Y = \beta_0 + e^{\beta_1 X} + \varepsilon$`], [0, 1, 2], R`앞의 셋은 변형된 특징($X^2$, $X_1X_2$, $\log X$)에 계수가 곱해진 합. 마지막은 $\beta_1$이 지수 안에 있어 파라미터에 대해 비선형.`, '선형회귀의 의미에서 선형 모델인 것을 모두 고르시오.')
    ],
    '3-10': [
      tf(R`Logistic regression can be viewed as a linear model combined with a link function so that it can be used for classification.`, true, R`교수님: "선형회귀 + 링크 함수".`, '로지스틱 회귀는 선형 모델에 링크 함수를 결합해 분류에 쓰는 것으로 볼 수 있다.')
    ],
    '3-11': [
      tf(R`Test data are assumed to come from the same distribution as the training data; they are simply observations that were not used for training.`, true, R`"무조건 머릿속에 기억하세요." 다른 분포에서 잘하길 바라는 건 마법.`, '테스트 데이터는 훈련 데이터와 같은 분포에서 오며, 단지 훈련에 쓰이지 않은 관측이다.'),
      tf(R`A model with very low training error is guaranteed to have low test error on new data from the same distribution.`, false, R`기출을 다 외워도 새 시험 오답률이 0은 아니죠.`, '훈련 오차가 매우 낮은 모델은 같은 분포의 새 데이터에서도 테스트 오차가 낮음이 보장된다.'),
      tf(R`Good generalization means performing well on data drawn from a different distribution than the training data.`, false, R`일반화 = 같은 분포의 보지 못한 데이터에서 잘하기.`, '좋은 일반화란 훈련 데이터와 다른 분포에서 온 데이터에서 잘하는 것이다.')
    ],
    '3-12': [
      multi(R`Regarding the validation set approach, which statements are correct? (Select all that apply.)`, [R`The data should be randomly shuffled before splitting.`, R`The split must be exactly 50/50.`, R`Observations in the validation set are not used to fit the model.`, R`For a qualitative response, the validation error can be measured by the misclassification rate.`], [0, 2, 3], R`비율은 70/30, 80/20 등 자유.`, '검증셋 접근에 대한 옳은 설명을 모두 고르시오.')
    ],
    '3-13': [
      multi(R`What are the drawbacks of the validation set approach? (Select all that apply.)`, [R`The estimate can vary a lot depending on which observations end up in the validation set.`, R`It tends to overestimate the test error of the model fit on the full data set.`, R`It requires fitting the model $n$ times.`, R`It always underestimates the test error.`], [0, 1], R`변동성이 크고, 절반만으로 훈련해 테스트 오차를 과대추정. n번 적합은 LOOCV.`, '검증셋 접근의 단점을 모두 고르시오.'),
      tf(R`The validation set approach tends to overestimate the test error because the model is trained on fewer observations.`, true, R`적은 데이터 → 더 나쁜 모델 → 오차가 크게 나와요.`, '검증셋 접근은 더 적은 관측으로 훈련하므로 테스트 오차를 과대추정하는 경향이 있다.')
    ],
    '3-14': [
      tf(R`In $K$-fold cross-validation, the folds overlap so that each observation appears in several validation sets.`, false, R`폴드는 겹치지 않는 분할. 각 관측은 정확히 한 번 검증셋에 들어가요.`, 'K-겹 교차검증에서 폴드들은 서로 겹쳐서 한 관측이 여러 검증셋에 들어간다.'),
      tf(R`$K$-fold cross-validation fits the model $K$ times.`, true, R`폴드마다 한 번씩.`, 'K-겹 교차검증은 모델을 K번 적합한다.'),
      short(R`Explain how $K$-fold cross-validation is implemented.`, R`<p>① 데이터를 무작위로 <b>섞은(shuffle)</b> 뒤, 겹치지 않는 거의 같은 크기의 <b>K개 폴드</b>로 나눈다. ② $k = 1, \dots, K$에 대해 $k$번째 폴드를 검증셋으로 빼 두고 나머지 $K-1$개 폴드로 모델을 적합한 다음, 빼 둔 폴드에서 오차($\mathrm{MSE}_k$ 또는 오분류율)를 계산한다. ③ $K$개의 오차를 (폴드 크기로 가중) 평균한 $\mathrm{CV}_{(K)} = \sum_k \frac{n_k}{n}\mathrm{MSE}_k$를 테스트 오차의 추정값으로 쓴다. 모델은 $K$번 적합한다.</p>`, ['셔플 후 겹치지 않는 K개 폴드로 분할', '각 폴드를 한 번씩 검증셋, 나머지 K−1개로 훈련', 'K개 오차의 (가중)평균을 테스트 오차 추정으로 사용'], 'K-겹 교차검증을 어떻게 수행하는지 설명하시오.')
    ],
    '3-15': [
      tf(R`LOOCV requires fitting the model $n$ times.`, true, R`K = n.`, 'LOOCV는 모델을 n번 적합해야 한다.'),
      multi(R`Compared with 5- or 10-fold cross-validation, LOOCV ... (Select all that apply.)`, [R`uses $n - 1$ observations for each fit.`, R`is computationally more expensive when $n$ is large.`, R`requires the data to be shuffled first.`, R`usually points to a very different best flexibility in practice.`], [0, 1], R`LOOCV는 셔플이 필요 없는 유일한 경우. 교수님: 실무에선 5·10-fold와 거의 차이가 없어서 LOOCV를 거의 안 써요.`, '5·10-겹 교차검증과 비교한 LOOCV에 대한 설명을 모두 고르시오.'),
      tf(R`Even when cross-validation misestimates the actual value of the test MSE, it can still identify the flexibility level with the minimum test MSE well.`, true, R`핵심은 최소점의 위치.`, 'CV가 테스트 MSE의 값을 잘못 추정하더라도 최소가 되는 유연성은 잘 찾을 수 있다.')
    ],

    '4-1': [
      tf(R`In a classification problem, the response variable is qualitative (categorical).`, true, R`질적 반응 → 분류.`, '분류 문제에서 반응변수는 질적(범주형)이다.')
    ],
    '4-3': [
      tf(R`Fitting linear regression to a 0/1 response can produce "probability" estimates below 0 or above 1.`, true, R`그래서 로지스틱 함수로 (0, 1)에 가둬요.`, '0/1 반응에 선형회귀를 적합하면 0보다 작거나 1보다 큰 확률 추정이 나올 수 있다.'),
      tf(R`Coding three unordered classes as 1, 2, 3 and using linear regression is appropriate because the coding is arbitrary.`, false, R`1, 2, 3 코딩은 순서와 같은 간격을 암시해 결과가 코딩에 따라 달라져요.`, '순서 없는 세 클래스를 1, 2, 3으로 코딩해 선형회귀하는 것은 적절하다.')
    ],
    '4-4': [
      multi(R`Which statements about $p(X) = \dfrac{e^{\beta_0 + \beta_1 X}}{1 + e^{\beta_0 + \beta_1 X}}$ are correct? (Select all that apply.)`, [R`Its values always lie between 0 and 1.`, R`$\log\!\big(p(X)/(1-p(X))\big) = \beta_0 + \beta_1 X$.`, R`Increasing $X$ by one unit changes $p(X)$ by exactly $\beta_1$.`, R`Its graph is an S-shaped curve.`], [0, 1, 3], R`1단위 증가 시 바뀌는 건 로그 오즈($\beta_1$만큼). 확률 변화량은 $X$ 위치에 따라 달라요.`, '로지스틱 함수에 대한 옳은 설명을 모두 고르시오.')
    ],
    '4-5': [
      tf(R`Logistic regression coefficients are usually estimated by maximum likelihood rather than least squares.`, true, R`관측된 0/1이 나올 확률(우도)을 최대화.`, '로지스틱 회귀 계수는 보통 최소제곱이 아니라 최대우도로 추정한다.')
    ],
    '4-6': [
      tf(R`Unlike least squares linear regression, the logistic regression likelihood has no closed-form maximizer, so it is maximized numerically.`, true, R`$p$가 $\beta$에 비선형이라 반복 최적화.`, '로지스틱 회귀의 우도는 닫힌 해가 없어 수치적으로 최대화한다.'),
      multi(R`Which of the following can achieve zero training (classification) error on any linearly separable dataset? (Select all that apply.)`, [R`Logistic regression fit by maximum likelihood`, R`A linear classifier that predicts by the sign of a separating hyperplane`, R`Predicting the majority class for every observation`, R`Least squares regression on a 0/1 response, thresholded at 0.5`], [0, 1], R`선형 분리 가능하면 로지스틱 회귀의 MLE는 계수를 끝없이 키워 분리 초평면으로 모든 점을 맞혀요(대신 계수가 불안정). 0/1 최소제곱은 분리가 보장되지 않아요. (작년 기출 유형, 작년엔 다른 분류기 선택지도 있었음)`, '(작년 기출 유형) 선형 분리 가능한 어떤 데이터에서도 훈련 오차 0을 달성할 수 있는 방법을 모두 고르시오.')
    ],
    '4-7': [
      tf(R`In simple logistic regression, $\beta_1$ is the change in the log-odds of $Y = 1$ associated with a one-unit increase in $X$.`, true, R`확률이 아니라 로그 오즈의 변화. 오즈비는 $e^{\beta_1}$.`, 'β₁은 X가 1 증가할 때 Y = 1의 로그 오즈 변화량이다.')
    ],
    '4-8': [
      tf(R`To predict $p(x)$ for a new $x$, we plug the estimated coefficients into the logistic function.`, true, R`$\eta = \hat\beta_0 + \hat\beta_1 x \to e^\eta/(1+e^\eta)$.`, '새 x의 p(x)를 예측하려면 추정 계수를 로지스틱 함수에 넣는다.')
    ],
    '4-9': [
      tf(R`In the Default data, the coefficient for student is positive when used alone but negative when balance is also included; this is an example of confounding.`, true, R`학생은 balance가 높아서 단독으로는 연체율이 높아 보이지만, balance를 고정하면 오히려 덜 연체.`, 'student 계수가 단독일 땐 양수, balance를 넣으면 음수가 되는 것은 교란의 예다.')
    ],
    '4-10': [
      tf(R`In multiclass logistic regression, the predicted probabilities of the $K$ classes sum to one.`, true, R`softmax 형태.`, '다중 클래스 로지스틱 회귀에서 K개 클래스의 예측 확률 합은 1이다.')
    ]
  };

  /* ---------------- 실전형 모의고사: short · long answer 문제 은행 ---------------- */
  H.written = {
    // Short answer: flexible vs inflexible (작년 20점 파트). b = 유연한 방법이 더 나은가(true)/나쁜가(false)
    scenarios: [
      { q: R`The sample size $n$ is extremely large, and the number of predictors $p$ is small.`, b: true, why: R`데이터가 많으면 유연한 방법도 분산이 크게 늘지 않고, 편향을 줄여 진짜 $f$에 더 가까이 갈 수 있어요.` },
      { q: R`The number of predictors $p$ is extremely large, and the number of observations $n$ is small.`, b: false, why: R`관측이 적은데 유연하면 노이즈까지 맞춰 과적합(분산 폭발). 덜 유연한 방법이 나아요.` },
      { q: R`The relationship between the predictors and the response is highly non-linear.`, b: true, why: R`선형 같은 경직된 방법은 편향이 크게 남아요. 유연한 방법이 편향을 줄여요.` },
      { q: R`The variance of the error terms, $\sigma^2 = \mathrm{Var}(\varepsilon)$, is extremely high.`, b: false, why: R`노이즈가 크면 유연한 방법이 노이즈를 따라가 분산이 커져요. 덜 유연한 방법이 나아요.` },
      { q: R`The true relationship between $X$ and $Y$ is exactly linear.`, b: false, why: R`줄일 편향이 없으니 유연성은 분산만 늘려요. 선형 방법이 나아요.` },
      { q: R`The main goal is inference: understanding how each predictor is associated with the response.`, b: false, why: R`해석력은 덜 유연한 모델이 높아요.` },
      { q: R`There is plenty of data, very little noise, and the true $f$ is complicated.`, b: true, why: R`편향을 줄이는 이득이 크고, 데이터가 많고 노이즈가 적어 분산 부담은 작아요.` },
      { q: R`The training set is small and noisy, and the goal is accurate prediction on new data.`, b: false, why: R`작은·시끄러운 데이터에서 유연한 방법은 과적합하기 쉬워요.` }
    ],
    // Long answer: 선형회귀와 가설검정 (작년 10점 파트). rubric = [설명, 배점]
    long: [
      {
        q: R`<p>The table shows the least squares fit for the regression of <b>sales</b> (in thousands of units) onto the advertising budgets for <b>TV</b>, <b>radio</b>, and <b>newspaper</b> (each in thousands of dollars).</p>
<div class="tbl-wrap"><table class="tbl"><tr><th></th><th class="num">Coefficient</th><th class="num">Std. error</th><th class="num">t-statistic</th><th class="num">p-value</th></tr><tr><td>Intercept</td><td class="num">2.939</td><td class="num">0.3119</td><td class="num">9.42</td><td class="num">&lt; 0.0001</td></tr><tr><td>TV</td><td class="num">0.046</td><td class="num">0.0014</td><td class="num">32.81</td><td class="num">&lt; 0.0001</td></tr><tr><td>radio</td><td class="num">0.189</td><td class="num">0.0086</td><td class="num">21.89</td><td class="num">&lt; 0.0001</td></tr><tr><td>newspaper</td><td class="num">−0.001</td><td class="num">0.0059</td><td class="num">−0.18</td><td class="num">0.8599</td></tr></table></div>
<p>A data scientist interpreted that radio advertising has a <b>stronger linear relationship</b> with sales than TV advertising, because its coefficient is larger. Is the interpretation correct? Justify your answer. Also state what the result for newspaper means.</p>`,
        model: R`<p><b>옳지 않습니다.</b> radio 계수(0.189)가 TV(0.046)보다 크다는 것은 "천 달러를 더 썼을 때 판매가 몇 천 개 늘어나느냐"는 <b>효과의 크기</b>를 말할 뿐, 관계가 얼마나 뚜렷한지(강도)를 말하지 않습니다. 계수의 크기는 단위에 따라 바뀌므로, 관계의 강도·증거는 추정의 불확실성에 대한 상대적 크기인 $t = \hat\beta/\mathrm{SE}$(또는 p-값)로 판단해야 합니다. TV의 $t = 32.81$이 radio의 $21.89$보다 크므로, 오히려 TV의 선형 관계에 대한 증거가 더 강합니다(둘 다 p < 0.0001로 매우 유의).</p>
<p>newspaper는 $t = -0.18$, p = 0.86으로, <b>TV와 radio를 고정했을 때</b> $H_0: \beta_{\text{newspaper}} = 0$을 기각할 수 없습니다. 95% 신뢰구간 $-0.001 \pm 2(0.0059)$도 0을 포함합니다. 단순회귀에서는 유의했던 newspaper가 여기서 무의미한 것은 radio와의 상관(0.35) 때문에 radio의 효과를 대신 반영했기 때문입니다.</p>
<p class="en-model">No. A larger coefficient only means a larger change in sales per unit of spending; coefficient size depends on units and does not measure the strength of the relationship. Strength of evidence is judged by $t = \hat\beta/\mathrm{SE}$ or the p-value: TV has $t = 32.81 > 21.89$ for radio. Newspaper ($p = 0.86$) is not significant given TV and radio; its apparent effect in simple regression came from its correlation with radio.</p>`,
        rubric: [['해석이 옳지 않다고 명시', 2], ['계수 크기는 단위에 따른 효과 크기일 뿐, 강도의 척도가 아니다', 2], ['t = 계수/SE 또는 p-값으로 판단해야 한다', 2], ['TV의 t(32.81)가 radio(21.89)보다 커서 오히려 TV의 증거가 강함', 2], ['newspaper: 다른 변수를 고정했을 때 유의하지 않음(H₀ 기각 못 함, radio와 상관)', 2]]
      },
      {
        q: R`<p>For the simple linear regression of <b>sales</b> on <b>TV</b> ($n = 200$), the least squares output is:</p>
<div class="tbl-wrap"><table class="tbl"><tr><th></th><th class="num">Coefficient</th><th class="num">Std. error</th></tr><tr><td>Intercept</td><td class="num">7.0325</td><td class="num">0.4578</td></tr><tr><td>TV</td><td class="num">0.0475</td><td class="num">0.0027</td></tr></table></div>
<p>(a) State the null and alternative hypotheses for testing whether there is a relationship between TV and sales. (b) Compute the $t$-statistic and state your conclusion. (c) Give an approximate 95% confidence interval for $\beta_1$ and interpret it correctly. (d) Interpret $\hat\beta_1$ in context.</p>`,
        model: R`<p>(a) $H_0: \beta_1 = 0$ (TV와 sales 사이에 관계 없음, 모델이 $Y = \beta_0 + \varepsilon$) vs $H_A: \beta_1 \ne 0$. 가설은 추정값이 아니라 <b>진짜</b> $\beta_1$에 대한 것.</p>
<p>(b) $t = (0.0475 - 0)/0.0027 \approx 17.6$. 자유도 $n-2 = 198$인 t분포에서 이 값은 극단적이어서 p-값 < 0.0001 → $H_0$ 기각, TV와 sales 사이에 관계가 있다고 결론.</p>
<p>(c) $0.0475 \pm 2(0.0027) \approx [0.042, 0.053]$. 해석: 데이터를 반복해서 얻어 이렇게 구간을 만들면 약 95%가 진짜 $\beta_1$을 포함한다. ("β₁이 이 구간에 있을 확률이 95%"가 아님.) 0을 포함하지 않아 (b)와 같은 결론.</p>
<p>(d) TV 광고비가 1,000달러 늘면 판매가 평균적으로 약 47.5개(0.0475천 개) 증가하는 것과 연관된다. (관측 데이터이므로 인과라고 단정하지 않음.)</p>`,
        rubric: [['H₀: β₁ = 0 vs Hₐ: β₁ ≠ 0 (진짜 β₁에 대한 가설)', 2], ['t ≈ 17.6 계산', 2], ['p-값 매우 작음 → H₀ 기각, 관계 있음', 2], ['CI ≈ [0.042, 0.053], "반복 표집 시 95%가 β₁ 포함"으로 해석', 2], ['기울기 해석: 1,000달러 → 약 47.5개 증가(연관)', 2]]
      },
      {
        q: R`<p>A model with an interaction term gives:</p>
<div class="tbl-wrap"><table class="tbl"><tr><th></th><th class="num">Coefficient</th><th class="num">Std. error</th><th class="num">t-statistic</th><th class="num">p-value</th></tr><tr><td>Intercept</td><td class="num">6.7502</td><td class="num">0.248</td><td class="num">27.23</td><td class="num">&lt; 0.0001</td></tr><tr><td>TV</td><td class="num">0.0191</td><td class="num">0.002</td><td class="num">12.70</td><td class="num">&lt; 0.0001</td></tr><tr><td>radio</td><td class="num">0.0289</td><td class="num">0.009</td><td class="num">3.24</td><td class="num">0.0014</td></tr><tr><td>TV × radio</td><td class="num">0.0011</td><td class="num">0.000</td><td class="num">20.73</td><td class="num">&lt; 0.0001</td></tr></table></div>
<p>$R^2$ is 96.8% for this model and 89.7% for the model with TV and radio only. (a) Is there evidence of an interaction (synergy)? (b) Describe the effect of increasing TV by one unit. (c) Explain what "(96.8 − 89.7)/(100 − 89.7) ≈ 69%" means. (d) Suppose the radio main effect had a p-value of 0.5. Should radio be dropped? Why?</p>`,
        model: R`<p>(a) 예. 상호작용항의 $t = 20.73$, p < 0.0001 → $H_0: \beta_3 = 0$ 기각. radio 광고가 TV 광고의 효과를 키우는 시너지가 있다.</p>
<p>(b) TV 1단위(1,000달러) 증가의 효과는 $\hat\beta_1 + \hat\beta_3\cdot\text{radio} = 0.0191 + 0.0011\cdot\text{radio}$(천 개)로, <b>radio 예산에 따라 달라진다</b>. radio가 클수록 TV의 효과가 크다.</p>
<p>(c) 가법 모델 후 설명되지 않고 남은 변동 10.3% 중 약 69%를 상호작용항이 추가로 설명했다는 뜻. "7%p 증가"가 아니라 남은 부분 대비 매우 큰 개선.</p>
<p>(d) 빼면 안 된다. 계층 원칙: 상호작용항을 넣으면 주효과는 p-값과 상관없이 포함해야 한다. 주효과가 없으면 상호작용항의 의미가 바뀌어 해석이 불가능/왜곡되고, 상호작용항이 주효과를 떠안게 된다.</p>`,
        rubric: [['상호작용 유의(t = 20.73, p 작음) → 시너지 있음', 2], ['TV 효과 = β₁ + β₃·radio, radio에 따라 다름', 2], ['69% = 남은 변동 10.3% 중 상호작용이 설명한 비율', 2], ['radio를 빼면 안 된다(계층 원칙)', 2], ['이유: 주효과 없으면 상호작용 해석 불가/왜곡', 2]]
      }
    ]
  };

  /* 강의에서 나온 플래시카드 */
  H.cards = (H.cards || []).concat([
    { f: 1, tag: 'Lecture', q: 'ε는 학습 대상인가?', a: '아니다. 관측도 안 되고 학습 대상도 아닌, 학습을 방해하는 노이즈. 학습 대상은 f, 관측 가능한 건 X와 Y.' },
    { f: 1, tag: 'Lecture', q: '과적합의 정의 (교수님 버전)', a: '훈련 데이터의 노이즈(ε)까지 학습해 새 데이터에 일반화하지 못하는 것. "훈련 오차가 0"은 정의가 아니다.' },
    { f: 1, tag: 'Lecture', q: R`$\hat f(x_0)$가 확률변수인 이유`, a: R`훈련 데이터가 분포에서 뽑힌 확률 표본이라, 훈련셋이 바뀌면 $\hat f$가 바뀐다. 그 흔들림이 $\mathrm{Var}(\hat f(x_0))$.` },
    { f: 1, tag: 'Lecture', q: '모수적 모델의 가장 큰 위험', a: '가정한 형태(예: 선형)가 진짜 f와 다르면, 아무리 학습을 잘해도 f에 가까워질 수 없다.' },
    { f: 1, tag: 'Lecture', q: '차이 대신 차이의 제곱을 최소화하는 이유', a: '음·양 모두 벌점, 큰 오차에 더 큰 벌점, 2차식이라 미분이 쉽고 해가 조건부 평균.' },
    { f: 2, tag: 'Lecture', q: R`잔차 $e_i$ vs 오차 $\varepsilon_i$`, a: R`$\varepsilon_i$ = 진짜 모델의 노이즈(관측 불가). $e_i = y_i - \hat y_i$ = 내 예측과 데이터의 차이.` },
    { f: 2, tag: 'Lecture', q: R`$\hat\beta$는 확률변수인가? (시험 언급)`, a: '예. 데이터가 모집단에서 뽑은 표본이라 표본마다 추정값이 달라진다 → 그래서 표준오차가 있다.' },
    { f: 2, tag: 'Lecture', q: R`$\mathrm{SE}(\hat\beta_1)$가 커지는 두 경우`, a: R`노이즈 $\sigma^2$가 클 때, $x_i$들이 $\bar x$ 근처에 몰려 분모 $\sum(x_i-\bar x)^2$가 작을 때.` },
    { f: 2, tag: 'Lecture', q: '"계수가 0.0475로 작으니 선형 관계가 약하다"?', a: '틀림. 계수 크기는 단위에 좌우된다(단위만 바꾸면 47.5). 강도는 t = 계수/SE 또는 p-값으로 판단.' },
    { f: 2, tag: 'Lecture', q: 'R²가 음수가 될 수 있나?', a: '일반적으로는 가능(모델이 ȳ 예측보다 못할 때). 단, 절편 있는 최소제곱 선형회귀는 (x̄, ȳ)를 지나서 훈련 R²가 음수가 안 된다.' },
    { f: 3, tag: 'Lecture', q: R`$(X^\top X)^{-1}$가 없을 때 / 거의 없을 때`, a: '열이 선형종속(완벽한 상관) → 유일한 해가 없음. 강한 상관 → 해는 있지만 불안정(분산·SE 큼, 모빌 비유).' },
    { f: 3, tag: 'Lecture', q: 'hp²을 넣은 다항회귀는 선형 모델인가?', a: '예. 선형 여부는 입력이 아니라 파라미터 기준. hp²은 새 특징 하나일 뿐.' },
    { f: 3, tag: 'Lecture', q: '테스트 데이터는 어떤 분포에서 오나?', a: '훈련 데이터와 같은 분포. 아직 보지 못한 새 점일 뿐. 다른 분포에서 잘하길 바라는 건 "마법".' },
    { f: 3, tag: 'Lecture', q: 'LOOCV를 실무에서 잘 안 쓰는 이유', a: 'n번 적합해야 해서 계산이 비싸고, 5·10-fold와 결과가 거의 같다. 셔플이 필요 없는 유일한 CV.' },
    { f: 3, tag: 'Lecture', q: '교차항이 유의한데 주효과 p = 0.5라면?', a: '주효과를 빼면 안 된다(계층 원칙). 빼면 상호작용 해석이 불가능/왜곡된다.' }
  ]);
})();
