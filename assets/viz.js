/* Grand Data Hotel — 시각 자료 (SVG/Canvas, 데이터로부터 계산해서 그림) */
(function () {
  'use strict';
  const V = window.VIZ = window.VIZ || {};
  const C = { plum: '#47203A', plum2: '#6E4460', muted: '#9A7A90', fuchsia: '#D6487D', rose: '#F1A6C0', rose2: '#F6BFD2', mint: '#8FCDB8', mint3: '#3E8F73', gold: '#D9A64B', seal: '#C43A45', lilac: '#B79ADF', sky: '#6FA4D8', cream: '#FFF9F4', line: 'rgba(71,32,58,.16)', grid: 'rgba(71,32,58,.08)' };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const f1 = n => (Math.round(n * 10) / 10).toFixed(1), f2 = n => (Math.round(n * 100) / 100).toFixed(2), f3 = n => (Math.round(n * 1000) / 1000).toFixed(3), f4 = n => (Math.round(n * 10000) / 10000).toFixed(4);

  /* ---- 난수 · 수치 ---- */
  function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function gauss(r) { let u = 0, v = 0; while (u === 0) u = r(); while (v === 0) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function solve(A, b) { // 가우스 소거 (부분 피벗)
    const n = b.length, M = A.map((row, i) => row.concat([b[i]]));
    for (let c = 0; c < n; c++) {
      let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      [M[c], M[p]] = [M[p], M[c]];
      if (Math.abs(M[c][c]) < 1e-14) continue;
      for (let r = 0; r < n; r++) { if (r === c) continue; const k = M[r][c] / M[c][c]; for (let j = c; j <= n; j++) M[r][j] -= k * M[c][j]; }
    }
    return M.map((row, i) => Math.abs(row[i]) < 1e-14 ? 0 : row[n] / row[i]);
  }
  function polyfit(xs, ys, deg) { // x를 [-1,1]로 옮겨 정규방정식 풀기
    const lo = Math.min(...xs), hi = Math.max(...xs), mid = (lo + hi) / 2, half = (hi - lo) / 2 || 1;
    const t = xs.map(x => (x - mid) / half), m = deg + 1;
    const A = Array.from({ length: m }, () => new Array(m).fill(0)), b = new Array(m).fill(0);
    for (let i = 0; i < t.length; i++) { const pw = [1]; for (let k = 1; k < m; k++) pw.push(pw[k - 1] * t[i]); for (let r = 0; r < m; r++) { b[r] += pw[r] * ys[i]; for (let c = 0; c < m; c++) A[r][c] += pw[r] * pw[c]; } }
    const co = solve(A, b);
    return x => { const tt = (x - mid) / half; let s = 0, p = 1; for (let k = 0; k < m; k++) { s += co[k] * p; p *= tt; } return s; };
  }
  const mse = (xs, ys, f) => xs.reduce((s, x, i) => s + (ys[i] - f(x)) ** 2, 0) / xs.length;
  function lgamma(z) { const g = 7, p = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7]; if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z); z -= 1; let x = p[0]; for (let i = 1; i < g + 2; i++) x += p[i] / (z + i); const t = z + g + 0.5; return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x); }
  function tpdf(t, nu) { return Math.exp(lgamma((nu + 1) / 2) - lgamma(nu / 2)) / Math.sqrt(nu * Math.PI) * Math.pow(1 + t * t / nu, -(nu + 1) / 2); }
  function ttail(t, nu) { // P(T > t) 수치 적분
    const a = Math.abs(t), b = a + 40, n = 800, h = (b - a) / n; let s = tpdf(a, nu) + tpdf(b, nu);
    for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * tpdf(a + i * h, nu); return s * h / 3;
  }
  const sig = z => 1 / (1 + Math.exp(-z));

  /* ---- SVG 도우미 ---- */
  function scale(d0, d1, r0, r1) { return v => r0 + (v - d0) / (d1 - d0) * (r1 - r0); }
  function chart(o) { // 축 틀
    const W = o.w || 640, Hh = o.h || 360, pad = Object.assign({ l: 52, r: 20, t: 20, b: 44 }, o.pad || {});
    if (o.xl && pad.b < 42) pad.b = 42; // x축 눈금 글자와 축 제목이 겹치지 않도록
    const x = scale(o.xd[0], o.xd[1], pad.l, W - pad.r), y = scale(o.yd[0], o.yd[1], Hh - pad.b, pad.t);
    const xt = o.xt || ticks(o.xd[0], o.xd[1], 5), yt = o.yt || ticks(o.yd[0], o.yd[1], 5);
    let g = '';
    yt.forEach(v => { g += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${y(v)}" y2="${y(v)}" stroke="${C.grid}"/><text x="${pad.l - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="${C.muted}" class="mono">${o.yf ? o.yf(v) : v}</text>`; });
    xt.forEach(v => { g += `<text x="${x(v)}" y="${Hh - pad.b + 18}" text-anchor="middle" font-size="11" fill="${C.muted}" class="mono">${o.xf ? o.xf(v) : v}</text>`; });
    g += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${Hh - pad.b}" y2="${Hh - pad.b}" stroke="${C.line}"/><line x1="${pad.l}" x2="${pad.l}" y1="${pad.t}" y2="${Hh - pad.b}" stroke="${C.line}"/>`;
    if (o.xl) g += `<text x="${(pad.l + W - pad.r) / 2}" y="${Hh - 6}" text-anchor="middle" font-size="12" fill="${C.plum2}">${o.xl}</text>`;
    if (o.yl) g += `<text transform="translate(14 ${(pad.t + Hh - pad.b) / 2}) rotate(-90)" text-anchor="middle" font-size="12" fill="${C.plum2}">${o.yl}</text>`;
    return { W, H: Hh, pad, x, y, axes: g };
  }
  function ticks(a, b, n) { const step = nice((b - a) / n); const out = []; for (let v = Math.ceil(a / step) * step; v <= b + 1e-9; v += step) out.push(Math.round(v * 1e6) / 1e6); return out; }
  function nice(x) { const e = Math.pow(10, Math.floor(Math.log10(x))); const m = x / e; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * e; }
  function path(pts) { return pts.map((p, i) => (i ? 'L' : 'M') + f1(p[0]) + ' ' + f1(p[1])).join(' '); }
  function curve(ch, fn, a, b, n, extra) { const pts = []; for (let i = 0; i <= n; i++) { const xv = a + (b - a) * i / n; const yv = fn(xv); if (isFinite(yv)) pts.push([ch.x(xv), ch.y(Math.max(Math.min(yv, ch.yd ? ch.yd[1] : 1e9), ch.yd ? ch.yd[0] : -1e9))]); } return `<path d="${path(pts)}" fill="none" ${extra || ''}/>`; }
  function svgWrap(inner, W, H, label) { return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label || '')}" preserveAspectRatio="xMidYMid meet">${inner}</svg>`; }
  function fig(el, inner, cap, extraHtml) { el.innerHTML = `<figure>${inner}${extraHtml || ''}${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`; }
  function clampY(ch, v) { return Math.max(ch.pad.t - 2, Math.min(ch.H - ch.pad.b + 2, v)); }

  /* ================= 1F ================= */
  V.nested = el => {
    const s = `<svg viewBox="0 0 520 300" role="img" aria-label="AI 안에 ML, ML 안에 DL이 포함되는 동심원">
      <circle cx="300" cy="150" r="140" fill="${C.rose2}"/><text x="300" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="${C.plum}">Artificial Intelligence (AI)</text>
      <circle cx="330" cy="168" r="92" fill="${C.rose}"/><text x="330" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="${C.plum}">Machine Learning (ML)</text>
      <circle cx="352" cy="186" r="48" fill="${C.fuchsia}"/><text x="352" y="182" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">Deep</text><text x="352" y="198" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">Learning</text>
      <text x="16" y="120" font-size="12.5" fill="${C.plum2}">AI: 학습·추론·문제해결·지각·</text><text x="16" y="138" font-size="12.5" fill="${C.plum2}">의사결정을 수행하는 능력</text>
      <text x="16" y="176" font-size="12.5" fill="${C.plum2}">ML: 데이터로부터 학습해 보지 못한</text><text x="16" y="194" font-size="12.5" fill="${C.plum2}">데이터로 일반화하는 통계 알고리즘</text>
      <text x="16" y="232" font-size="12.5" fill="${C.plum2}">DL: 신경망을 이용하는 ML의 부분집합</text>
    </svg>`;
    fig(el, s, '포함 관계: DL ⊂ ML ⊂ AI. 바깥으로 갈수록 넓은 개념이고, 안쪽으로 갈수록 방법이 구체적입니다.');
  };

  V.timeline = el => {
    const rows = [
      ['음성 인식 (WSJ)', 1984, 1991, 1994, 'HMM'], ['Deep Blue vs 카스파로프', 1983, 1991, 1997, 'Negascout'], ['구글 번역 (아랍어·중국어)', 1988, 2005, 2005, 'SMT'],
      ['IBM Watson Jeopardy!', 1991, 2010, 2011, 'Mixture-of-Experts'], ['GoogleNet 물체 인식', 1989, 2010, 2014, 'CNN'], ['DeepMind Atari', 1992, 2013, 2015, 'Q-learning'],
      ['AlphaFold', 2017, 2000, 2020, 'Transformer'], ['ChatGPT', 2017, 2019, 2022, 'Transformer']
    ];
    const W = 680, rowH = 30, top = 34, Hh = top + rows.length * rowH + 40, x = scale(1982, 2024, 200, W - 20);
    let g = '';
    [1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020].forEach(yr => { g += `<line x1="${x(yr)}" x2="${x(yr)}" y1="${top - 10}" y2="${Hh - 30}" stroke="${C.grid}"/><text x="${x(yr)}" y="${Hh - 14}" text-anchor="middle" font-size="10.5" fill="${C.muted}" class="mono">${yr}</text>`; });
    rows.forEach((r, i) => {
      const yy = top + i * rowH + 12; const lo = Math.min(r[1], r[2]);
      g += `<text x="192" y="${yy + 4}" text-anchor="end" font-size="11.5" fill="${C.plum}">${r[0]}</text>`;
      g += `<line x1="${x(lo)}" x2="${x(r[3])}" y1="${yy}" y2="${yy}" stroke="${C.line}" stroke-width="2"/>`;
      g += `<circle cx="${x(r[1])}" cy="${yy}" r="5" fill="${C.lilac}"/><circle cx="${x(r[2])}" cy="${yy}" r="5" fill="${C.fuchsia}"/><circle cx="${x(r[3])}" cy="${yy}" r="6" fill="${C.gold}" stroke="#fff" stroke-width="1.5"/>`;
    });
    g += `<circle cx="210" cy="14" r="5" fill="${C.lilac}"/><text x="220" y="18" font-size="11" fill="${C.plum2}">알고리즘 제안</text><circle cx="320" cy="14" r="5" fill="${C.fuchsia}"/><text x="330" y="18" font-size="11" fill="${C.plum2}">데이터셋 공개</text><circle cx="430" cy="14" r="6" fill="${C.gold}"/><text x="441" y="18" font-size="11" fill="${C.plum2}">돌파구</text>`;
    fig(el, svgWrap(g, W, Hh, 'AI 돌파구마다 알고리즘·데이터셋·돌파 연도를 표시한 타임라인'), '보라(알고리즘)는 대개 훨씬 먼저 있었고, 분홍(데이터셋)이 공개된 뒤 곧 금색(돌파구)이 옵니다. 돌파구의 방아쇠는 데이터였다는 것이 이 표의 메시지입니다. (AlphaFold의 PDB는 1971년부터 축적된 데이터라 2000년 위치에 표시)');
  };

  V.codevsdata = el => {
    const box = (x, y, w, h, t, fill, tc) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}"/><text x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle" font-size="12.5" font-weight="700" fill="${tc || C.plum}">${t}</text>`;
    const arr = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C.plum2}" stroke-width="1.6" marker-end="url(#ar)"/>`;
    const s = `<svg viewBox="0 0 640 250" role="img" aria-label="전통 프로그래밍과 머신러닝의 입력·출력 비교"><defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${C.plum2}"/></marker></defs>
      <text x="160" y="24" text-anchor="middle" font-size="12" fill="${C.muted}" class="mono">TRADITIONAL PROGRAMMING</text>
      ${box(20, 50, 110, 40, '규칙 (코드)', C.rose2)}${box(20, 110, 110, 40, '데이터', C.rose2)}${box(180, 70, 110, 60, '컴퓨터', C.cream)}${box(180, 70, 110, 60, '', 'none')}${box(340 - 40, 80, 0, 0, '', 'none')}
      ${arr(130, 70, 178, 92)}${arr(130, 130, 178, 108)}${arr(290, 100, 330, 100)}${box(332, 80, 90, 40, '답', C.mint)}
      <text x="160" y="190" text-anchor="middle" font-size="12" fill="${C.muted}" class="mono">MACHINE LEARNING</text>
      ${box(20, 200, 110, 40, '데이터', C.rose2)}<text x="75" y="228" font-size="0" fill="none"></text>
      ${box(180, 200, 110, 40, '학습 알고리즘', C.cream)}${arr(130, 220, 178, 220)}${arr(290, 220, 330, 220)}${box(332, 200, 120, 40, '모델 (규칙)', C.fuchsia, '#fff')}
      <text x="470" y="105" font-size="12" fill="${C.plum2}">규칙을 사람이 씀</text><text x="470" y="225" font-size="12" fill="${C.plum2}">규칙을 데이터에서 찾음</text>
      <text x="470" y="245" font-size="11" fill="${C.muted}">복잡함이 코드 → 데이터로 이동</text>
    </svg>`;
    fig(el, s, '전통 프로그래밍은 사람이 규칙을 쓰고 컴퓨터가 답을 냅니다. 머신러닝은 데이터에서 규칙(모델)을 찾아냅니다. 복잡함이 코드에서 데이터로 옮겨 갑니다.');
  };

  V.adscatter = el => {
    const r = rng(11);
    const panels = [['TV', 300, 7.03, 0.0475, 3.3], ['Radio', 50, 9.31, 0.2025, 4.3], ['Newspaper', 115, 12.35, 0.0547, 5.1]];
    let out = '';
    panels.forEach(p => {
      const ch = chart({ w: 230, h: 210, pad: { l: 36, r: 10, t: 12, b: 36 }, xd: [0, p[1]], yd: [0, 28], xl: p[0], yl: 'Sales', xt: ticks(0, p[1], 3) });
      let g = ch.axes;
      for (let i = 0; i < 60; i++) { const xv = r() * p[1]; const yv = Math.max(1, p[2] + p[3] * xv + gauss(r) * p[4]); g += `<circle cx="${f1(ch.x(xv))}" cy="${f1(ch.y(yv))}" r="2.6" fill="${C.seal}" opacity=".55"/>`; }
      g += `<line x1="${ch.x(0)}" y1="${ch.y(p[2])}" x2="${ch.x(p[1])}" y2="${ch.y(p[2] + p[3] * p[1])}" stroke="${C.sky}" stroke-width="2.5"/>`;
      out += `<svg viewBox="0 0 230 210" style="width:32%;min-width:180px;display:inline-block" role="img" aria-label="${p[0]} 광고비와 판매량 산점도">${g}</svg>`;
    });
    fig(el, `<div style="display:flex;flex-wrap:wrap;gap:2%;justify-content:center">${out}</div>`, 'Advertising 데이터의 모습을 흉내 낸 그림(모사 데이터). 세 매체 각각에 단순선형회귀선(파랑)을 따로 맞췄습니다. 세 변수를 함께 쓰는 하나의 모델 f(TV, Radio, Newspaper)를 만들 수 있을까요?');
  };

  V.condmean = el => {
    const f = x => 6 + 1.6 * Math.sin(x / 1.6) + 0.35 * x; const r = rng(7); const pts = [];
    for (let i = 0; i < 130; i++) { const xv = 0.3 + r() * 9.4; pts.push([xv, f(xv) + gauss(r) * 1.1]); }
    el.innerHTML = `<figure><div class="svg"></div><div class="ctrl"><label>X = x 위치 <input type="range" id="cm-x" min="1" max="9" step="0.1" value="4"></label><span class="ro" id="cm-ro"></span></div><figcaption>회색 점 = 관측치 (Y는 같은 X에서도 흩어져 있음). 분홍 띠는 X = x 근처의 Y들, 금색 점은 그 평균 E(Y|X = x). 이 평균을 x마다 이어 그린 곡선이 회귀함수 f(x)입니다. 슬라이더를 움직여 보세요.</figcaption></figure>`;
    const draw = x0 => {
      const ch = chart({ w: 640, h: 330, xd: [0, 10], yd: [2, 12], xl: 'X', yl: 'Y' });
      let g = ch.axes;
      pts.forEach(p => { const near = Math.abs(p[0] - x0) < 0.35; g += `<circle cx="${f1(ch.x(p[0]))}" cy="${f1(ch.y(p[1]))}" r="${near ? 4 : 3}" fill="${near ? C.fuchsia : C.muted}" opacity="${near ? .95 : .45}"/>`; });
      g += `<rect x="${ch.x(x0 - 0.35)}" y="${ch.pad.t}" width="${ch.x(x0 + 0.35) - ch.x(x0 - 0.35)}" height="${ch.H - ch.pad.b - ch.pad.t}" fill="${C.rose}" opacity=".18"/>`;
      g += curve(ch, f, 0.2, 9.9, 80, `stroke="${C.plum}" stroke-width="2.4" stroke-dasharray="6 4"`);
      const near = pts.filter(p => Math.abs(p[0] - x0) < 0.35); const m = near.length ? near.reduce((s, p) => s + p[1], 0) / near.length : f(x0);
      g += `<circle cx="${ch.x(x0)}" cy="${ch.y(m)}" r="7" fill="${C.gold}" stroke="#fff" stroke-width="2"/><text x="${ch.x(x0) + 12}" y="${ch.y(m) - 10}" font-size="12" font-weight="700" fill="${C.plum}">E(Y | X = ${f1(x0)}) ≈ ${f2(m)}</text>`;
      el.querySelector('.svg').innerHTML = svgWrap(g, ch.W, ch.H, '조건부 평균으로서의 회귀함수');
      el.querySelector('#cm-ro').textContent = `x = ${f1(x0)} 근처 관측 ${near.length}개, 평균 ${f2(m)}, 진짜 f(x) = ${f2(f(x0))}`;
    };
    el.querySelector('#cm-x').addEventListener('input', e => draw(Number(e.target.value))); draw(4);
  };

  V.errsplit = el => {
    const bars = [['나쁜 모델 f̂', 3.2, 1], ['좋은 모델 f̂', 0.9, 1], ['진짜 f를 안다면', 0, 1]];
    const W = 640, Hh = 260, x0 = 150, bw = 120, gap = 50, y = scale(0, 4.5, Hh - 50, 20);
    let g = `<line x1="${x0 - 20}" x2="${W - 20}" y1="${y(0)}" y2="${y(0)}" stroke="${C.line}"/>`;
    bars.forEach((b, i) => {
      const bx = x0 + i * (bw + gap);
      g += `<rect x="${bx}" y="${y(b[2])}" width="${bw}" height="${y(0) - y(b[2])}" fill="${C.muted}" opacity=".5"/>`;
      if (b[1] > 0) g += `<rect x="${bx}" y="${y(b[1] + b[2])}" width="${bw}" height="${y(b[2]) - y(b[1] + b[2])}" fill="${C.fuchsia}"/><text x="${bx + bw / 2}" y="${(y(b[1] + b[2]) + y(b[2])) / 2 + 4}" text-anchor="middle" font-size="11.5" fill="#fff" font-weight="700">[f − f̂]²</text>`;
      g += `<text x="${bx + bw / 2}" y="${y(0.5) + 4}" text-anchor="middle" font-size="11.5" fill="#fff" font-weight="700">Var(ε)</text>`;
      g += `<text x="${bx + bw / 2}" y="${Hh - 28}" text-anchor="middle" font-size="12.5" fill="${C.plum}">${b[0]}</text>`;
    });
    g += `<text x="20" y="${y(1) + 4}" font-size="11" fill="${C.muted}">줄일 수 없는 오차</text><text x="20" y="${y(3.2)}" font-size="11" fill="${C.fuchsia}">줄일 수 있는 오차</text><text x="20" y="${y(3.2) + 14}" font-size="11" fill="${C.fuchsia}">(모델을 고치면 줄어듦)</text>`;
    fig(el, svgWrap(g, W, Hh, '기대 예측오차를 줄일 수 있는 부분과 없는 부분으로 나눈 막대'), '기대 제곱오차 = [f(x) − f̂(x)]² (줄일 수 있음) + Var(ε) (줄일 수 없음). 아무리 좋은 모델도 회색 막대 아래로는 내려갈 수 없습니다. 이 수업의 목표는 분홍 부분을 줄이는 것입니다.');
  };

  V.paramnonparam = el => {
    const r = rng(3); const truth = x => 4 + 2.2 * Math.sin(x * 0.9) + 0.3 * x; const xs = [], ys = [];
    for (let i = 0; i < 40; i++) { const xv = 0.3 + r() * 9.4; xs.push(xv); ys.push(truth(xv) + gauss(r) * 0.8); }
    const lin = polyfit(xs, ys, 1), smooth = polyfit(xs, ys, 5);
    let out = '';
    [['모수적: 선형 모델 (β₀ + β₁x)', lin, C.sky], ['비모수적: 유연한 곡선', smooth, C.mint3]].forEach(p => {
      const ch = chart({ w: 320, h: 250, pad: { l: 36, r: 10, t: 24, b: 36 }, xd: [0, 10], yd: [0, 10], xl: 'X', yl: 'Y' });
      let g = ch.axes + `<text x="${ch.pad.l}" y="14" font-size="12" font-weight="700" fill="${C.plum}">${p[0]}</text>`;
      xs.forEach((xv, i) => g += `<circle cx="${f1(ch.x(xv))}" cy="${f1(ch.y(ys[i]))}" r="3" fill="${C.muted}" opacity=".6"/>`);
      g += curve(ch, p[1], 0.2, 9.9, 60, `stroke="${p[2]}" stroke-width="2.6"`);
      out += `<svg viewBox="0 0 320 250" style="width:48%;min-width:250px;display:inline-block" role="img" aria-label="${p[0]}">${g}</svg>`;
    });
    fig(el, `<div style="display:flex;flex-wrap:wrap;gap:2%;justify-content:center">${out}</div>`, '같은 데이터에 두 가지 방식으로 f를 추정한 모습. 왼쪽은 "직선"이라는 형태를 먼저 가정하고 모수 2개만 맞춥니다. 오른쪽은 형태를 가정하지 않고 데이터에 가깝게 따라갑니다(대신 데이터가 많이 필요).');
  };

  V.flex = el => {
    const r = rng(21), truth = x => 3 + 2.4 * Math.sin(1.1 * x) + 0.25 * x, sd = 0.9;
    const mk = n => { const xs = [], ys = []; for (let i = 0; i < n; i++) { const xv = 0.2 + r() * 9.6; xs.push(xv); ys.push(truth(xv) + gauss(r) * sd); } return { xs, ys }; };
    const tr = mk(34), te = mk(200);
    const degs = Array.from({ length: 14 }, (_, i) => i + 1);
    const fits = degs.map(d => polyfit(tr.xs, tr.ys, d));
    const trM = fits.map(f => mse(tr.xs, tr.ys, f)), teM = fits.map(f => mse(te.xs, te.ys, f));
    el.innerHTML = `<figure><div style="display:flex;flex-wrap:wrap;gap:2%"><div class="svg" style="flex:1 1 320px"></div><div class="svg2" style="flex:1 1 220px"></div></div>
      <div class="ctrl"><label>유연성(다항식 차수) <input type="range" id="fx-d" min="1" max="14" step="1" value="3"></label><span class="ro" id="fx-ro"></span></div>
      <div class="kpi"><span>훈련 MSE <b id="fx-tr"></b></span><span>테스트 MSE <b id="fx-te"></b></span><span>줄일 수 없는 오차 σ² = ${f2(sd * sd)}</span></div>
      <figcaption>왼쪽: 훈련 데이터(점 34개)와 차수 d의 다항식 적합(분홍). 점선은 진짜 f. 오른쪽: 차수를 바꿔 가며 잰 훈련 MSE(회색)와 테스트 MSE(빨강). 차수를 올리면 훈련 MSE는 계속 내려가지만 테스트 MSE는 U자를 그립니다. 차수 12 이상에서 선이 훈련 점들을 억지로 지나가며 요동치는 것이 과적합입니다.</figcaption></figure>`;
    const draw = d => {
      const f = fits[d - 1];
      const ch = chart({ w: 400, h: 300, pad: { l: 40, r: 12, t: 16, b: 40 }, xd: [0, 10], yd: [-2, 10], xl: 'X', yl: 'Y' });
      let g = ch.axes;
      tr.xs.forEach((xv, i) => g += `<circle cx="${f1(ch.x(xv))}" cy="${f1(ch.y(tr.ys[i]))}" r="3.4" fill="${C.plum}" opacity=".55"/>`);
      g += curve(ch, truth, 0.1, 9.9, 80, `stroke="${C.plum}" stroke-width="1.6" stroke-dasharray="5 4" opacity=".6"`);
      const pts = []; for (let i = 0; i <= 240; i++) { const xv = 0.1 + 9.8 * i / 240; pts.push([ch.x(xv), clampY(ch, ch.y(f(xv)))]); }
      g += `<path d="${path(pts)}" fill="none" stroke="${C.fuchsia}" stroke-width="2.8"/>`;
      el.querySelector('.svg').innerHTML = svgWrap(g, ch.W, ch.H, '차수 ' + d + ' 다항식 적합');
      const ymax = Math.min(12, Math.max(...teM.slice(0, 12)) * 1.1);
      const c2 = chart({ w: 300, h: 300, pad: { l: 40, r: 12, t: 16, b: 40 }, xd: [1, 14], yd: [0, ymax], xl: '유연성 (차수)', yl: 'MSE', xt: [1, 4, 7, 10, 14] });
      let h = c2.axes + `<line x1="${c2.pad.l}" x2="${c2.W - c2.pad.r}" y1="${c2.y(sd * sd)}" y2="${c2.y(sd * sd)}" stroke="${C.muted}" stroke-dasharray="4 4"/>`;
      h += `<path d="${path(degs.map((dd, i) => [c2.x(dd), clampY(c2, c2.y(trM[i]))]))}" fill="none" stroke="${C.muted}" stroke-width="2.4"/>`;
      h += `<path d="${path(degs.map((dd, i) => [c2.x(dd), clampY(c2, c2.y(teM[i]))]))}" fill="none" stroke="${C.seal}" stroke-width="2.4"/>`;
      h += `<circle cx="${c2.x(d)}" cy="${clampY(c2, c2.y(teM[d - 1]))}" r="6" fill="${C.seal}" stroke="#fff" stroke-width="2"/><circle cx="${c2.x(d)}" cy="${clampY(c2, c2.y(trM[d - 1]))}" r="6" fill="${C.muted}" stroke="#fff" stroke-width="2"/>`;
      h += `<text x="${c2.W - 14}" y="${c2.pad.t + 12}" text-anchor="end" font-size="11" fill="${C.seal}">테스트</text><text x="${c2.W - 14}" y="${c2.pad.t + 26}" text-anchor="end" font-size="11" fill="${C.muted}">훈련</text>`;
      el.querySelector('.svg2').innerHTML = svgWrap(h, c2.W, c2.H, '차수에 따른 훈련·테스트 MSE');
      el.querySelector('#fx-ro').textContent = 'd = ' + d + (d <= 2 ? ' · 과소적합 쪽' : d >= 9 ? ' · 과적합 쪽' : ' · 적당');
      el.querySelector('#fx-tr').textContent = f2(trM[d - 1]); el.querySelector('#fx-te').textContent = f2(teM[d - 1]);
    };
    el.querySelector('#fx-d').addEventListener('input', e => draw(Number(e.target.value))); draw(3);
  };

  V.interpmap = el => {
    const ch = chart({ w: 640, h: 360, pad: { l: 60, r: 24, t: 20, b: 46 }, xd: [0, 10], yd: [0, 10], xl: 'Flexibility (유연성) →', yl: 'Interpretability (해석력) →', xt: [], yt: [] });
    const items = [['Subset Selection', 1.2, 9.3], ['Lasso', 1.6, 8.5], ['Least Squares', 3.0, 7.2], ['Generalized Additive Models', 5.0, 5.6], ['Trees', 6.2, 4.6], ['Bagging, Boosting', 7.4, 3.0], ['Support Vector Machines', 7.8, 2.0], ['Deep Learning', 9.0, 0.9]];
    let g = ch.axes + `<text x="${ch.pad.l - 8}" y="${ch.y(9.6)}" text-anchor="end" font-size="11" fill="${C.muted}">High</text><text x="${ch.pad.l - 8}" y="${ch.y(0.4)}" text-anchor="end" font-size="11" fill="${C.muted}">Low</text><text x="${ch.x(0.3)}" y="${ch.H - ch.pad.b + 18}" font-size="11" fill="${C.muted}">Low</text><text x="${ch.x(9.7)}" y="${ch.H - ch.pad.b + 18}" text-anchor="end" font-size="11" fill="${C.muted}">High</text>`;
    g += `<line x1="${ch.x(0.8)}" y1="${ch.y(9.6)}" x2="${ch.x(9.4)}" y2="${ch.y(0.6)}" stroke="${C.rose}" stroke-width="10" opacity=".35" stroke-linecap="round"/>`;
    items.forEach((it, i) => { const cx = ch.x(it[1]), cy = ch.y(it[2]); g += `<circle cx="${cx}" cy="${cy}" r="6" fill="${i < 3 ? C.sky : i > 5 ? C.fuchsia : C.gold}"/><text x="${cx + 10}" y="${cy + 4}" font-size="12" fill="${C.plum}">${it[0]}</text>`; });
    fig(el, svgWrap(g, ch.W, ch.H, '해석력과 유연성의 트레이드오프 지도'), '해석하기 쉬운 방법(부분집합 선택, Lasso, 최소제곱)은 유연성이 낮고, 유연한 방법(부스팅, SVM, 딥러닝)은 블랙박스에 가깝습니다. 둘 다 높은 방법은 없습니다.');
  };

  V.ucurve = el => {
    const cases = {
      a: { name: '적당히 비선형인 진짜 f', irr: 1.0, tr: x => 0.35 + 1.9 * Math.exp(-0.28 * x), te: x => 1.0 + 1.6 * Math.exp(-0.5 * x) + 0.035 * (x - 2) ** 1.5, ymax: 2.6 },
      b: { name: '거의 선형인 진짜 f', irr: 1.0, tr: x => 0.4 + 0.9 * Math.exp(-0.45 * x), te: x => 1.0 + 0.25 * Math.exp(-0.9 * x) + 0.05 * (x - 2) ** 1.4, ymax: 2.6 },
      c: { name: '구불구불하고 잡음 작은 진짜 f', irr: 1.0, tr: x => 0.4 + 17 * Math.exp(-0.32 * x), te: x => 1.0 + 19 * Math.exp(-0.34 * x) + 0.06 * (x - 2) ** 1.5, ymax: 20 }
    };
    el.innerHTML = `<figure><div class="tabs"><button data-c="a" class="on">예 1</button><button data-c="b">예 2</button><button data-c="c">예 3</button></div><div class="svg"></div><div class="legend"><span><i style="background:${C.muted}"></i>훈련 MSE</span><span><i style="background:${C.seal}"></i>테스트 MSE</span><span><i class="dash" style="color:${C.plum2}"></i>Var(ε) 줄일 수 없는 오차</span><span><span style="display:inline-block;width:10px;height:10px;background:${C.gold};vertical-align:middle;margin-right:.35em"></span>선형 모델</span><span><span style="display:inline-block;width:10px;height:10px;background:${C.sky};vertical-align:middle;margin-right:.35em"></span><span style="display:inline-block;width:10px;height:10px;background:${C.mint3};vertical-align:middle;margin-right:.35em"></span>스무딩 스플라인 둘</span></div><figcaption id="uc-cap"></figcaption></figure>`;
    const draw = k => {
      const c = cases[k];
      const ch = chart({ w: 640, h: 330, xd: [2, 20], yd: [0, c.ymax], xl: 'Flexibility (유연성)', yl: 'Mean Squared Error', xt: [2, 5, 10, 20] });
      let g = ch.axes + `<line x1="${ch.pad.l}" x2="${ch.W - ch.pad.r}" y1="${ch.y(c.irr)}" y2="${ch.y(c.irr)}" stroke="${C.plum2}" stroke-dasharray="5 5"/>`;
      g += curve(ch, c.tr, 2, 20, 80, `stroke="${C.muted}" stroke-width="2.6"`) + curve(ch, c.te, 2, 20, 80, `stroke="${C.seal}" stroke-width="2.6"`);
      [[2, C.gold], [k === 'b' ? 3.5 : 6, C.sky], [k === 'c' ? 12 : 12, C.mint3]].forEach(m => { g += `<rect x="${ch.x(m[0]) - 5}" y="${ch.y(c.te(m[0])) - 5}" width="10" height="10" fill="${m[1]}"/><rect x="${ch.x(m[0]) - 5}" y="${ch.y(c.tr(m[0])) - 5}" width="10" height="10" fill="${m[1]}"/>`; });
      el.querySelector('.svg').innerHTML = svgWrap(g, ch.W, ch.H, c.name + '의 훈련·테스트 MSE');
      el.querySelector('#uc-cap').textContent = { a: '예 1. 진짜 f가 적당히 비선형: 훈련 MSE(회색)는 계속 내려가지만 테스트 MSE(빨강)는 중간 유연성에서 최소가 되는 U자. 최소값은 Var(ε)(점선) 근처.', b: '예 2. 진짜 f가 거의 직선: 선형 모델(금색)과 매끈한 스플라인(파랑)이 이미 잘 하고, 유연할수록 테스트 MSE가 오히려 나빠집니다.', c: '예 3. 진짜 f가 구불구불하고 잡음이 작음: 유연한 적합(초록)이 훨씬 낫습니다. 선형 모델은 편향이 커서 실패.' }[k];
    };
    el.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => { el.querySelectorAll('.tabs button').forEach(x => x.classList.remove('on')); b.classList.add('on'); draw(b.dataset.c); }));
    draw('a');
  };

  V.biasvar = el => {
    const cases = {
      a: { bias: x => 1.4 * Math.exp(-0.45 * x), v: x => 0.03 + 0.06 * (x - 2) ** 1.3, irr: 1.0, ymax: 2.5 },
      b: { bias: x => 0.25 * Math.exp(-0.9 * x), v: x => 0.03 + 0.06 * (x - 2) ** 1.3, irr: 1.0, ymax: 2.5 },
      c: { bias: x => 18 * Math.exp(-0.35 * x), v: x => 0.2 + 0.25 * (x - 2) ** 1.3, irr: 1.0, ymax: 20 }
    };
    el.innerHTML = `<figure><div class="tabs"><button data-c="a" class="on">예 1</button><button data-c="b">예 2</button><button data-c="c">예 3</button></div><div class="svg"></div><div class="legend"><span><i style="background:${C.seal}"></i>테스트 MSE</span><span><i style="background:${C.sky}"></i>Bias² (편향²)</span><span><i style="background:${C.gold}"></i>Var (분산)</span><span><i class="dash" style="color:${C.plum2}"></i>Var(ε)</span></div><figcaption>유연성이 커질수록 편향²(파랑)은 줄고 분산(금색)은 늘어납니다. 둘의 합에 Var(ε)를 더한 것이 테스트 MSE(빨강)이고, 그 최소점이 "딱 좋은" 유연성입니다. 예 2(거의 선형)는 편향이 이미 작아서 최소가 왼쪽에, 예 3(구불구불)은 편향이 커서 최소가 오른쪽에 있습니다.</figcaption></figure>`;
    const draw = k => {
      const c = cases[k];
      const ch = chart({ w: 640, h: 320, xd: [2, 20], yd: [0, c.ymax], xl: 'Flexibility (유연성)', xt: [2, 5, 10, 20] });
      let g = ch.axes + `<line x1="${ch.pad.l}" x2="${ch.W - ch.pad.r}" y1="${ch.y(c.irr)}" y2="${ch.y(c.irr)}" stroke="${C.plum2}" stroke-dasharray="5 5"/>`;
      g += curve(ch, x => c.bias(x) ** 2 / (k === 'c' ? 18 : 1), 2, 20, 80, `stroke="${C.sky}" stroke-width="2.4"`);
      g += curve(ch, c.v, 2, 20, 80, `stroke="${C.gold}" stroke-width="2.4"`);
      g += curve(ch, x => c.bias(x) ** 2 / (k === 'c' ? 18 : 1) + c.v(x) + c.irr, 2, 20, 80, `stroke="${C.seal}" stroke-width="2.8"`);
      el.querySelector('.svg').innerHTML = svgWrap(g, ch.W, ch.H, '편향·분산·MSE 곡선');
    };
    el.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => { el.querySelectorAll('.tabs button').forEach(x => x.classList.remove('on')); b.classList.add('on'); draw(b.dataset.c); }));
    draw('a');
  };

  V.resample = el => {
    const truth = x => 3 + 2.4 * Math.sin(1.1 * x) + 0.25 * x; let seed = 100;
    el.innerHTML = `<figure><div style="display:flex;flex-wrap:wrap;gap:2%"><div class="svg" style="flex:1 1 280px"></div><div class="svg2" style="flex:1 1 280px"></div></div><div class="ctrl"><button class="vizbtn" id="rs-btn" type="button">훈련 데이터를 다시 뽑아 12번 적합하기</button></div><figcaption>같은 진짜 f(점선)에서 훈련 데이터를 12번 새로 뽑아 각각 적합한 선들. 왼쪽 직선(차수 1)은 데이터가 바뀌어도 거의 같은 자리(분산 작음)지만 진짜 f와 체계적으로 어긋납니다(편향 큼). 오른쪽 차수 10 곡선은 진짜 f 주변을 지나지만(편향 작음) 데이터가 바뀔 때마다 크게 요동칩니다(분산 큼).</figcaption></figure>`;
    const draw = () => {
      const r = rng(seed++);
      [['차수 1: 편향 큼 · 분산 작음', 1, C.sky, '.svg'], ['차수 10: 편향 작음 · 분산 큼', 10, C.fuchsia, '.svg2']].forEach(p => {
        const ch = chart({ w: 320, h: 260, pad: { l: 36, r: 10, t: 26, b: 34 }, xd: [0, 10], yd: [-2, 10], xl: 'X', yl: 'Y' });
        let g = ch.axes + `<text x="${ch.pad.l}" y="15" font-size="12" font-weight="700" fill="${C.plum}">${p[0]}</text>`;
        for (let k = 0; k < 12; k++) {
          const xs = [], ys = []; for (let i = 0; i < 30; i++) { const xv = 0.2 + r() * 9.6; xs.push(xv); ys.push(truth(xv) + gauss(r) * 0.9); }
          const f = polyfit(xs, ys, p[1]); const pts = []; for (let i = 0; i <= 120; i++) { const xv = 0.2 + 9.6 * i / 120; pts.push([ch.x(xv), clampY(ch, ch.y(f(xv)))]); }
          g += `<path d="${path(pts)}" fill="none" stroke="${p[2]}" stroke-width="1.6" opacity=".55"/>`;
        }
        g += curve(ch, truth, 0.1, 9.9, 80, `stroke="${C.plum}" stroke-width="2" stroke-dasharray="5 4"`);
        el.querySelector(p[3]).innerHTML = svgWrap(g, ch.W, ch.H, p[0]);
      });
    };
    el.querySelector('#rs-btn').addEventListener('click', draw); draw();
  };

  /* ================= 2F ================= */
  V.linemodel = el => {
    const ch = chart({ w: 640, h: 320, xd: [0, 10], yd: [0, 10], xl: 'X', yl: 'Y', xt: [0, 2, 4, 6, 8, 10] });
    const b0 = 2, b1 = 0.6; const r = rng(5); let g = ch.axes;
    for (let i = 0; i < 25; i++) { const xv = r() * 9.5 + 0.3; g += `<circle cx="${f1(ch.x(xv))}" cy="${f1(ch.y(b0 + b1 * xv + gauss(r) * 0.9))}" r="3.2" fill="${C.muted}" opacity=".55"/>`; }
    g += `<line x1="${ch.x(0)}" y1="${ch.y(b0)}" x2="${ch.x(10)}" y2="${ch.y(b0 + b1 * 10)}" stroke="${C.fuchsia}" stroke-width="3"/>`;
    g += `<circle cx="${ch.x(0)}" cy="${ch.y(b0)}" r="6" fill="${C.gold}" stroke="#fff" stroke-width="2"/><text x="${ch.x(0) + 12}" y="${ch.y(b0) + 22}" font-size="12.5" font-weight="700" fill="${C.plum}">β₀ = 절편 (X = 0일 때 Y)</text>`;
    g += `<path d="M${ch.x(5)} ${ch.y(b0 + b1 * 5)} L${ch.x(7)} ${ch.y(b0 + b1 * 5)} L${ch.x(7)} ${ch.y(b0 + b1 * 7)}" fill="none" stroke="${C.gold}" stroke-width="2" stroke-dasharray="4 3"/><text x="${ch.x(7) + 8}" y="${ch.y(b0 + b1 * 6) + 4}" font-size="12.5" font-weight="700" fill="${C.plum}">β₁ = 기울기 (X 1 증가 → Y β₁ 증가)</text>`;
    const px = 3.2, py = b0 + b1 * px + 2.1; g += `<circle cx="${ch.x(px)}" cy="${ch.y(py)}" r="5" fill="${C.seal}"/><line x1="${ch.x(px)}" y1="${ch.y(py)}" x2="${ch.x(px)}" y2="${ch.y(b0 + b1 * px)}" stroke="${C.seal}" stroke-width="2"/><text x="${ch.x(px) + 8}" y="${ch.y(py) - 8}" font-size="12.5" fill="${C.seal}" font-weight="700">ε (오차항)</text>`;
    fig(el, svgWrap(g, ch.W, ch.H, '단순선형회귀 모델의 절편, 기울기, 오차항'), 'Y = β₀ + β₁X + ε. β₀는 직선이 세로축과 만나는 높이, β₁은 X가 1 커질 때 Y가 얼마나 커지는지. 점이 직선에서 벗어난 만큼이 ε입니다.');
  };

  V.lsq = el => {
    const r = rng(8); const xs = [], ys = []; for (let i = 0; i < 12; i++) { const xv = 1 + i * 0.75 + r() * 0.3; xs.push(xv); ys.push(1.5 + 0.7 * xv + gauss(r) * 1.1); }
    const xm = xs.reduce((a, b) => a + b) / xs.length, ym = ys.reduce((a, b) => a + b) / ys.length;
    const b1 = xs.reduce((s, x, i) => s + (x - xm) * (ys[i] - ym), 0) / xs.reduce((s, x) => s + (x - xm) ** 2, 0), b0 = ym - b1 * xm;
    el.innerHTML = `<figure><div class="svg"></div><div class="ctrl"><label>β̂₀ <input type="range" id="ls-b0" min="-3" max="6" step="0.05" value="4"></label><label>β̂₁ <input type="range" id="ls-b1" min="-0.5" max="1.8" step="0.01" value="0.2"></label><button class="vizbtn" id="ls-opt" type="button">최소제곱해로!</button></div><div class="kpi"><span>RSS = <b id="ls-rss"></b></span><span>최소 RSS = <b>${f2(xs.reduce((s, x, i) => s + (ys[i] - b0 - b1 * x) ** 2, 0))}</b> (β̂₀ = ${f2(b0)}, β̂₁ = ${f2(b1)})</span></div><figcaption>각 점에서 직선까지의 세로 거리가 잔차 eᵢ이고, 그 제곱을 정사각형 넓이로 그렸습니다. 넓이의 합이 RSS. 슬라이더로 직선을 움직여 정사각형들을 가장 작게 만들어 보세요. 그 직선이 최소제곱 직선입니다.</figcaption></figure>`;
    const draw = (c0, c1) => {
      const ch = chart({ w: 640, h: 340, xd: [0, 11], yd: [-1, 12], xl: 'X', yl: 'Y' });
      let g = ch.axes, rss = 0; const k = (ch.x(1) - ch.x(0));
      xs.forEach((x, i) => { const yh = c0 + c1 * x, e = ys[i] - yh; rss += e * e; const side = Math.abs(ch.y(ys[i]) - ch.y(yh)); const sx = ch.x(x), top = Math.min(ch.y(ys[i]), ch.y(yh)); g += `<rect x="${sx}" y="${top}" width="${Math.min(side, 200)}" height="${side}" fill="${C.fuchsia}" opacity=".18" stroke="${C.fuchsia}" stroke-width="1"/><line x1="${sx}" y1="${ch.y(ys[i])}" x2="${sx}" y2="${ch.y(yh)}" stroke="${C.seal}" stroke-width="1.6"/>`; });
      g += `<line x1="${ch.x(0)}" y1="${clampY(ch, ch.y(c0))}" x2="${ch.x(11)}" y2="${clampY(ch, ch.y(c0 + c1 * 11))}" stroke="${C.plum}" stroke-width="2.6"/>`;
      xs.forEach((x, i) => g += `<circle cx="${ch.x(x)}" cy="${ch.y(ys[i])}" r="4.5" fill="${C.plum}"/>`);
      el.querySelector('.svg').innerHTML = svgWrap(g, ch.W, ch.H, '잔차 제곱을 정사각형으로 그린 최소제곱 그림');
      el.querySelector('#ls-rss').textContent = f2(rss); void k;
    };
    const i0 = el.querySelector('#ls-b0'), i1 = el.querySelector('#ls-b1');
    const upd = () => draw(Number(i0.value), Number(i1.value));
    i0.addEventListener('input', upd); i1.addEventListener('input', upd);
    el.querySelector('#ls-opt').addEventListener('click', () => { const s0 = Number(i0.value), s1 = Number(i1.value); const t0 = performance.now(); (function step(t) { const u = Math.min(1, (t - t0) / 700), e = 1 - Math.pow(1 - u, 3); i0.value = s0 + (b0 - s0) * e; i1.value = s1 + (b1 - s1) * e; upd(); if (u < 1) requestAnimationFrame(step); })(t0); });
    upd();
  };

  V.sampling = el => {
    const b0 = 2, b1 = 0.5, sd = 1.4, n = 30; let seed = 300; const cis = []; let hits = 0;
    el.innerHTML = `<figure><div style="display:flex;flex-wrap:wrap;gap:2%"><div class="svg" style="flex:1 1 300px"></div><div class="svg2" style="flex:1 1 260px"></div></div><div class="ctrl"><button class="vizbtn" id="sp-1" type="button">표본 하나 뽑기</button><button class="vizbtn lo" id="sp-50" type="button">50개 뽑기</button><span class="ro" id="sp-ro">아직 표본이 없어요</span></div><figcaption>진짜 β₁ = 0.5인 모집단에서 n = 30 표본을 뽑아 최소제곱 직선을 맞추고(왼쪽), 그때의 β̂₁ ± 2·SE 신뢰구간을 오른쪽에 한 줄씩 쌓습니다. 초록 구간은 진짜 값(점선)을 포함, 빨강은 놓친 구간. 많이 뽑으면 약 95%가 초록이 됩니다.</figcaption></figure>`;
    const one = () => {
      const r = rng(seed++); const xs = [], ys = []; for (let i = 0; i < n; i++) { const xv = r() * 10; xs.push(xv); ys.push(b0 + b1 * xv + gauss(r) * sd); }
      const xm = xs.reduce((a, b) => a + b) / n, ym = ys.reduce((a, b) => a + b) / n, sxx = xs.reduce((s, x) => s + (x - xm) ** 2, 0);
      const h1 = xs.reduce((s, x, i) => s + (x - xm) * (ys[i] - ym), 0) / sxx, h0 = ym - h1 * xm;
      const rss = xs.reduce((s, x, i) => s + (ys[i] - h0 - h1 * x) ** 2, 0), se = Math.sqrt(rss / (n - 2) / sxx);
      const ci = [h1 - 2 * se, h1 + 2 * se]; const hit = ci[0] <= b1 && b1 <= ci[1]; if (hit) hits++; cis.push({ ci, hit, h1 });
      return { xs, ys, h0, h1, se };
    };
    const draw = s => {
      const ch = chart({ w: 340, h: 260, pad: { l: 36, r: 10, t: 14, b: 34 }, xd: [0, 10], yd: [-2, 10], xl: 'X', yl: 'Y' });
      let g = ch.axes + `<line x1="${ch.x(0)}" y1="${ch.y(b0)}" x2="${ch.x(10)}" y2="${ch.y(b0 + b1 * 10)}" stroke="${C.plum}" stroke-width="1.6" stroke-dasharray="5 4"/>`;
      if (s) { s.xs.forEach((x, i) => g += `<circle cx="${f1(ch.x(x))}" cy="${f1(ch.y(s.ys[i]))}" r="3" fill="${C.muted}" opacity=".6"/>`); g += `<line x1="${ch.x(0)}" y1="${clampY(ch, ch.y(s.h0))}" x2="${ch.x(10)}" y2="${clampY(ch, ch.y(s.h0 + s.h1 * 10))}" stroke="${C.fuchsia}" stroke-width="2.6"/>`; }
      el.querySelector('.svg').innerHTML = svgWrap(g, ch.W, ch.H, '표본과 적합 직선');
      const last = cis.slice(-40); const c2 = chart({ w: 300, h: 260, pad: { l: 30, r: 10, t: 14, b: 34 }, xd: [-0.2, 1.2], yd: [0, 40], xl: 'β̂₁ ± 2·SE', xt: [0, 0.5, 1], yt: [] });
      let h = c2.axes + `<line x1="${c2.x(b1)}" x2="${c2.x(b1)}" y1="${c2.pad.t}" y2="${c2.H - c2.pad.b}" stroke="${C.plum}" stroke-dasharray="4 4"/>`;
      last.forEach((c, i) => { const yy = c2.y(i + 1); h += `<line x1="${c2.x(Math.max(-0.2, c.ci[0]))}" x2="${c2.x(Math.min(1.2, c.ci[1]))}" y1="${yy}" y2="${yy}" stroke="${c.hit ? C.mint3 : C.seal}" stroke-width="3"/><circle cx="${c2.x(c.h1)}" cy="${yy}" r="2.2" fill="${C.plum}"/>`; });
      el.querySelector('.svg2').innerHTML = svgWrap(h, c2.W, c2.H, '반복 표본의 신뢰구간들');
      el.querySelector('#sp-ro').textContent = cis.length ? `표본 ${cis.length}개 · 진짜 β₁을 포함한 구간 ${hits}개 (${Math.round(hits / cis.length * 100)}%)` + (s ? ` · 이번 β̂₁ = ${f3(s.h1)}, SE = ${f3(s.se)}` : '') : '아직 표본이 없어요';
    };
    el.querySelector('#sp-1').addEventListener('click', () => draw(one()));
    el.querySelector('#sp-50').addEventListener('click', () => { let s; for (let i = 0; i < 50; i++) s = one(); draw(s); });
    draw(null);
  };

  V.tdist = el => {
    const nu = 198;
    el.innerHTML = `<figure><div class="svg"></div><div class="ctrl"><label>관측된 |t| <input type="range" id="td-t" min="0" max="4" step="0.05" value="2"></label><span class="ro" id="td-ro"></span></div><figcaption>H₀: β₁ = 0이 참일 때 t = β̂₁/SE(β̂₁)는 자유도 n − 2의 t분포를 따릅니다. 색칠한 양쪽 꼬리 넓이가 p-값 = "H₀가 참인데도 이만큼 극단적인 t가 나올 확률". |t|가 2를 넘으면 p ≈ 0.05 아래로 내려가 H₀를 기각합니다.</figcaption></figure>`;
    const draw = t => {
      const ch = chart({ w: 640, h: 280, pad: { l: 40, r: 20, t: 16, b: 40 }, xd: [-4.5, 4.5], yd: [0, 0.42], xl: 't-statistic', yt: [] , xt: [-4, -2, 0, 2, 4] });
      let g = ch.axes;
      const area = (a, b) => { const pts = [[ch.x(a), ch.y(0)]]; for (let i = 0; i <= 60; i++) { const xv = a + (b - a) * i / 60; pts.push([ch.x(xv), ch.y(tpdf(xv, nu))]); } pts.push([ch.x(b), ch.y(0)]); return `<path d="${path(pts)} Z" fill="${C.fuchsia}" opacity=".35"/>`; };
      g += area(-4.5, -t) + area(t, 4.5) + curve(ch, x => tpdf(x, nu), -4.5, 4.5, 120, `stroke="${C.plum}" stroke-width="2.4"`);
      g += `<line x1="${ch.x(t)}" x2="${ch.x(t)}" y1="${ch.y(0)}" y2="${ch.y(tpdf(t, nu)) - 8}" stroke="${C.seal}" stroke-width="2"/><line x1="${ch.x(-t)}" x2="${ch.x(-t)}" y1="${ch.y(0)}" y2="${ch.y(tpdf(t, nu)) - 8}" stroke="${C.seal}" stroke-width="2"/>`;
      el.querySelector('.svg').innerHTML = svgWrap(g, ch.W, ch.H, 't분포와 양쪽 꼬리 p-값');
      const p = 2 * ttail(t, nu);
      el.querySelector('#td-ro').textContent = `|t| = ${f2(t)} → p-값 ≈ ${p < 0.0001 ? '< 0.0001' : f4(p)} ${p < 0.05 ? '(H₀ 기각)' : '(기각 못 함)'}`;
    };
    el.querySelector('#td-t').addEventListener('input', e => draw(Number(e.target.value))); draw(2);
  };

  V.tssrss = el => {
    const r = rng(12); const xs = [], ys = []; for (let i = 0; i < 14; i++) { const xv = 0.5 + i * 0.7 + r() * 0.3; xs.push(xv); ys.push(2 + 0.75 * xv + gauss(r) * 1.0); }
    const xm = xs.reduce((a, b) => a + b) / xs.length, ym = ys.reduce((a, b) => a + b) / ys.length;
    const b1 = xs.reduce((s, x, i) => s + (x - xm) * (ys[i] - ym), 0) / xs.reduce((s, x) => s + (x - xm) ** 2, 0), b0 = ym - b1 * xm;
    const tss = ys.reduce((s, y) => s + (y - ym) ** 2, 0), rss = xs.reduce((s, x, i) => s + (ys[i] - b0 - b1 * x) ** 2, 0);
    let out = '';
    [['TSS: 평균 ȳ에서의 편차', y => ym, C.muted], ['RSS: 회귀직선에서의 잔차', (y, x) => b0 + b1 * x, C.fuchsia]].forEach(p => {
      const ch = chart({ w: 320, h: 250, pad: { l: 36, r: 10, t: 26, b: 34 }, xd: [0, 11], yd: [0, 12], xl: 'X', yl: 'Y' });
      let g = ch.axes + `<text x="${ch.pad.l}" y="15" font-size="12" font-weight="700" fill="${C.plum}">${p[0]}</text>`;
      xs.forEach((x, i) => { const ref = p[1](ys[i], x); g += `<line x1="${ch.x(x)}" x2="${ch.x(x)}" y1="${ch.y(ys[i])}" y2="${ch.y(ref)}" stroke="${p[2]}" stroke-width="2"/>`; });
      if (p[2] === C.muted) g += `<line x1="${ch.x(0)}" x2="${ch.x(11)}" y1="${ch.y(ym)}" y2="${ch.y(ym)}" stroke="${C.plum}" stroke-width="2" stroke-dasharray="5 4"/>`; else g += `<line x1="${ch.x(0)}" x2="${ch.x(11)}" y1="${ch.y(b0)}" y2="${ch.y(b0 + b1 * 11)}" stroke="${C.plum}" stroke-width="2"/>`;
      xs.forEach((x, i) => g += `<circle cx="${ch.x(x)}" cy="${ch.y(ys[i])}" r="3.6" fill="${C.plum}"/>`);
      out += `<svg viewBox="0 0 320 250" style="width:48%;min-width:250px;display:inline-block" role="img" aria-label="${p[0]}">${g}</svg>`;
    });
    fig(el, `<div style="display:flex;flex-wrap:wrap;gap:2%;justify-content:center">${out}</div>`, `왼쪽 세로선들의 제곱합이 TSS = ${f1(tss)} (X를 모를 때 Y의 총 변동), 오른쪽이 RSS = ${f1(rss)} (직선을 쓰고도 남은 변동). R² = 1 − RSS/TSS = ${f3(1 - rss / tss)}: 직선이 Y 변동의 ${Math.round((1 - rss / tss) * 100)}%를 설명합니다.`);
  };

  /* ================= 3F ================= */
  V.matrix = el => {
    const cell = (x, y, w, h, t, fill, small) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${C.line}"/><text x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle" font-size="${small ? 11 : 12.5}" fill="${C.plum}" class="mono">${t}</text>`;
    let g = ''; const rows = ['1', '2', '⋮', 'n'], ch = 34;
    // y
    rows.forEach((r, i) => g += cell(20, 40 + i * ch, 44, ch, 'y' + (r === '⋮' ? '' : r).replace('y', 'y'), C.rose2));
    g += `<text x="42" y="30" text-anchor="middle" font-size="12" fill="${C.plum2}">y (n×1)</text><text x="80" y="115" font-size="20" fill="${C.plum}">=</text>`;
    // X
    const cols = ['1', 'x₁', 'x₂', '⋯', 'xₚ'];
    rows.forEach((r, i) => cols.forEach((c, j) => { const t = c === '1' ? '1' : (c === '⋯' || r === '⋮') ? (c === '⋯' && r === '⋮' ? '⋱' : c === '⋯' ? '⋯' : '⋮') : c.replace('x', 'x' + r); g += cell(104 + j * 50, 40 + i * ch, 50, ch, t, j === 0 ? C.gold + '55' : C.cream, true); }));
    g += `<text x="229" y="30" text-anchor="middle" font-size="12" fill="${C.plum2}">X (n × (p+1)) · 첫 열은 절편용 1</text>`;
    // beta
    ['β₀', 'β₁', '⋮', 'βₚ'].forEach((b, i) => g += cell(380, 40 + i * ch, 44, ch, b, C.lilac + '99'));
    g += `<text x="402" y="30" text-anchor="middle" font-size="12" fill="${C.plum2}">β ((p+1)×1)</text><text x="440" y="115" font-size="20" fill="${C.plum}">+</text>`;
    rows.forEach((r, i) => g += cell(470, 40 + i * ch, 44, ch, r === '⋮' ? '⋮' : 'ε' + r, C.mint + '99'));
    g += `<text x="492" y="30" text-anchor="middle" font-size="12" fill="${C.plum2}">ε (n×1)</text>`;
    fig(el, svgWrap(g, 540, 190, 'y = Xβ + ε 행렬 표기'), 'n개의 회귀식을 한 번에 쓰면 y = Xβ + ε. X의 첫 열을 1로 채워 절편 β₀도 같은 행렬 곱 안에 넣습니다. 행 i를 꺼내 읽으면 yᵢ = β₀ + β₁xᵢ₁ + ⋯ + βₚxᵢₚ + εᵢ가 됩니다.');
  };

  V.collinear = el => {
    el.innerHTML = `<figure><div class="svg"></div><div class="ctrl"><label>두 열 x₁, x₂ 사이 각도 <input type="range" id="cl-a" min="1" max="90" step="1" value="60"></label><span class="ro" id="cl-ro"></span></div><figcaption>X의 두 열을 벡터로 보면, 서로 다른 방향을 가리킬수록(각도 큼) 각 계수를 또렷하게 나눌 수 있습니다. 각도가 0에 가까우면(거의 같은 방향 = 강한 상관) XᵀX의 행렬식이 0에 가까워져 역행렬이 폭발하고 계수 분산이 커집니다. 각도 0이면 아예 역행렬이 없습니다.</figcaption></figure>`;
    const draw = a => {
      const th = a * Math.PI / 180, W = 640, Hh = 280, ox = 200, oy = 220, L = 170;
      let g = `<line x1="${ox - 40}" x2="${W - 250}" y1="${oy}" y2="${oy}" stroke="${C.grid}"/>`;
      g += `<line x1="${ox}" y1="${oy}" x2="${ox + L}" y2="${oy}" stroke="${C.sky}" stroke-width="4" stroke-linecap="round"/><text x="${ox + L + 8}" y="${oy + 4}" font-size="13" font-weight="700" fill="${C.sky}">x₁</text>`;
      g += `<line x1="${ox}" y1="${oy}" x2="${ox + L * Math.cos(th)}" y2="${oy - L * Math.sin(th)}" stroke="${C.fuchsia}" stroke-width="4" stroke-linecap="round"/><text x="${ox + L * Math.cos(th) + 8}" y="${oy - L * Math.sin(th)}" font-size="13" font-weight="700" fill="${C.fuchsia}">x₂</text>`;
      g += `<path d="M${ox + 40} ${oy} A40 40 0 0 0 ${ox + 40 * Math.cos(th)} ${oy - 40 * Math.sin(th)}" fill="none" stroke="${C.gold}" stroke-width="2"/>`;
      const r = Math.cos(th), det = 1 - r * r, vif = 1 / det;
      g += `<text x="420" y="70" font-size="13" fill="${C.plum}" class="mono">상관 r = cos θ = ${f2(r)}</text><text x="420" y="98" font-size="13" fill="${C.plum}" class="mono">det(XᵀX) ∝ 1 − r² = ${f3(det)}</text><text x="420" y="126" font-size="13" fill="${C.seal}" class="mono">Var(β̂ⱼ) 증폭 ≈ 1/(1 − r²) = ${vif > 999 ? '∞에 가까움' : f1(vif) + '배'}</text>`;
      const bw = Math.min(200, 12 * Math.log2(vif + 1) + 6); g += `<rect x="420" y="150" width="${bw}" height="16" fill="${C.seal}" opacity=".7"/><text x="420" y="185" font-size="11" fill="${C.muted}">계수 분산 (로그 눈금)</text>`;
      el.querySelector('.svg').innerHTML = svgWrap(g, W, Hh, '두 열 벡터의 각도와 다중공선성');
      el.querySelector('#cl-ro').textContent = `θ = ${a}° · ` + (a < 10 ? '거의 완전 공선성: 계수를 믿을 수 없음' : a < 35 ? '강한 상관: 계수 분산이 크게 커짐' : '괜찮은 설계');
    };
    el.querySelector('#cl-a').addEventListener('input', e => draw(Number(e.target.value))); draw(60);
  };

  V.corrgrid = el => {
    const names = ['TV', 'radio', 'newspaper', 'sales'];
    const M = [[1, 0.0548, 0.0567, 0.7822], [0.0548, 1, 0.3541, 0.5762], [0.0567, 0.3541, 1, 0.2283], [0.7822, 0.5762, 0.2283, 1]];
    const cs = 82, ox = 110, oy = 34; let g = '';
    names.forEach((n, i) => { g += `<text x="${ox + i * cs + cs / 2}" y="${oy - 10}" text-anchor="middle" font-size="12.5" fill="${C.plum}">${n}</text><text x="${ox - 10}" y="${oy + i * cs + cs / 2 + 4}" text-anchor="end" font-size="12.5" fill="${C.plum}">${n}</text>`; });
    M.forEach((row, i) => row.forEach((v, j) => { const a = i === j ? 0.1 : 0.12 + Math.abs(v) * 0.85; g += `<rect class="cell" x="${ox + j * cs}" y="${oy + i * cs}" width="${cs - 3}" height="${cs - 3}" rx="8" fill="${C.fuchsia}" opacity="${a}"/><text x="${ox + j * cs + cs / 2 - 1}" y="${oy + i * cs + cs / 2 + 4}" text-anchor="middle" font-size="13" fill="${Math.abs(v) > 0.5 && i !== j ? '#fff' : C.plum}" class="mono">${i === j ? '1' : f4(v)}</text>`; }));
    fig(el, svgWrap(g, 460, 370, '광고 데이터 상관계수 행렬'), '진할수록 상관이 큼. sales와 가장 상관이 큰 것은 TV(0.78), 그다음 radio(0.58). newspaper는 sales와 0.23이지만 radio와 0.35의 상관이 있어, radio를 빼고 보면 newspaper가 radio 효과를 대신 짊어져 유의해 보입니다.');
  };

  V.interaction = el => {
    el.innerHTML = `<figure><div class="tabs"><button data-m="add" class="on">가법 모델</button><button data-m="int">상호작용 모델</button></div><div class="svg"></div><figcaption id="ia-cap"></figcaption></figure>`;
    const draw = m => {
      const ch = chart({ w: 640, h: 320, xd: [0, 300], yd: [0, 30], xl: 'TV 광고비 (천 달러)', yl: 'sales (천 개)', xt: [0, 100, 200, 300] });
      let g = ch.axes;
      [[0, C.muted], [20, C.gold], [40, C.fuchsia]].forEach(p => {
        const f = m === 'add' ? tv => 2.939 + 0.0458 * tv + 0.1885 * p[0] : tv => 6.7502 + 0.0191 * tv + 0.0289 * p[0] + 0.0011 * tv * p[0];
        g += `<line x1="${ch.x(0)}" y1="${ch.y(f(0))}" x2="${ch.x(300)}" y2="${ch.y(f(300))}" stroke="${p[1]}" stroke-width="3"/><text x="${ch.x(300) - 4}" y="${ch.y(f(300)) - 8}" text-anchor="end" font-size="12" font-weight="700" fill="${p[1]}">radio = ${p[0]}</text>`;
      });
      el.querySelector('.svg').innerHTML = svgWrap(g, ch.W, ch.H, m === 'add' ? '가법 모델의 평행한 직선들' : '상호작용 모델의 부채꼴 직선들');
      el.querySelector('#ia-cap').textContent = m === 'add' ? '가법 모델: radio가 얼마든 TV의 기울기(0.046)는 같아서 세 직선이 평행합니다. TV의 효과가 radio와 무관하다는 가정.' : '상호작용 모델: TV의 기울기가 β₁ + β₃·radio = 0.0191 + 0.0011·radio로 radio가 클수록 가팔라집니다. 부채꼴로 벌어지는 것이 시너지(상호작용)입니다.';
    };
    el.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => { el.querySelectorAll('.tabs button').forEach(x => x.classList.remove('on')); b.classList.add('on'); draw(b.dataset.m); }));
    draw('add');
  };

  V.poly = el => {
    const r = rng(33); const xs = [], ys = []; for (let i = 0; i < 120; i++) { const hp = 46 + r() * 184; xs.push(hp); ys.push(Math.max(8, 56.9 - 0.4662 * hp + 0.0012 * hp * hp + gauss(r) * 4.3)); }
    el.innerHTML = `<figure><div class="tabs"><button data-d="1" class="on">Linear</button><button data-d="2">Degree 2</button><button data-d="5">Degree 5</button><button data-d="12">Degree 12</button></div><div class="svg"></div><div class="kpi"><span>훈련 MSE <b id="po-mse"></b></span></div><figcaption>Auto 데이터를 흉내 낸 모사 데이터(mpg vs horsepower). 직선(1차)은 휘어진 관계를 놓치고, 2차항을 넣으면 크게 좋아집니다. 5차, 12차로 올리면 훈련 MSE는 조금 더 내려가지만 양 끝이 요동칩니다. "왜 더 높은 차수를 쓰지 않는가?"의 답이 바로 이 요동(과적합)입니다.</figcaption></figure>`;
    const draw = d => {
      const f = polyfit(xs, ys, d);
      const ch = chart({ w: 640, h: 330, xd: [40, 235], yd: [5, 50], xl: 'Horsepower', yl: 'Miles per gallon', xt: [50, 100, 150, 200] });
      let g = ch.axes; xs.forEach((x, i) => g += `<circle cx="${f1(ch.x(x))}" cy="${f1(ch.y(ys[i]))}" r="3" fill="${C.muted}" opacity=".5"/>`);
      const pts = []; for (let i = 0; i <= 200; i++) { const xv = 46 + 184 * i / 200; pts.push([ch.x(xv), clampY(ch, ch.y(f(xv)))]); }
      g += `<path d="${path(pts)}" fill="none" stroke="${d === 1 ? C.gold : d === 2 ? C.sky : d === 5 ? C.mint3 : C.seal}" stroke-width="3"/>`;
      el.querySelector('.svg').innerHTML = svgWrap(g, ch.W, ch.H, '차수 ' + d + ' 다항회귀');
      el.querySelector('#po-mse').textContent = f2(mse(xs, ys, f));
    };
    el.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => { el.querySelectorAll('.tabs button').forEach(x => x.classList.remove('on')); b.classList.add('on'); draw(Number(b.dataset.d)); }));
    draw(1);
  };

  V.traintest = el => {
    const ch = chart({ w: 640, h: 330, pad: { l: 52, r: 20, t: 30, b: 60 }, xd: [0, 10], yd: [0, 10], xl: '', yl: 'Prediction Error', xt: [], yt: [] });
    let g = ch.axes + curve(ch, x => 0.8 + 6 * Math.exp(-0.45 * x), 0.3, 9.7, 60, `stroke="${C.muted}" stroke-width="2.6"`) + curve(ch, x => 2.6 + 6 * Math.exp(-0.5 * x) + 0.09 * x * x, 0.3, 9.7, 60, `stroke="${C.seal}" stroke-width="2.8"`);
    g += `<line x1="${ch.x(4.2)}" x2="${ch.x(4.2)}" y1="${ch.pad.t}" y2="${ch.H - ch.pad.b}" stroke="${C.gold}" stroke-dasharray="5 4"/>`;
    g += `<rect x="${ch.x(0)}" y="${ch.pad.t}" width="${ch.x(4.2) - ch.x(0)}" height="${ch.H - ch.pad.b - ch.pad.t}" fill="${C.sky}" opacity=".08"/><rect x="${ch.x(4.2)}" y="${ch.pad.t}" width="${ch.x(10) - ch.x(4.2)}" height="${ch.H - ch.pad.b - ch.pad.t}" fill="${C.fuchsia}" opacity=".08"/>`;
    g += `<text x="${ch.x(2.1)}" y="${ch.pad.t + 16}" text-anchor="middle" font-size="12" font-weight="700" fill="${C.plum}">과소적합 (underfitting)</text><text x="${ch.x(2.1)}" y="${ch.pad.t + 32}" text-anchor="middle" font-size="11" fill="${C.plum2}">편향 큼 · 분산 작음</text>`;
    g += `<text x="${ch.x(7.1)}" y="${ch.pad.t + 16}" text-anchor="middle" font-size="12" font-weight="700" fill="${C.plum}">과적합 (overfitting)</text><text x="${ch.x(7.1)}" y="${ch.pad.t + 32}" text-anchor="middle" font-size="11" fill="${C.plum2}">편향 작음 · 분산 큼</text>`;
    g += `<text x="${ch.x(9.6)}" y="${ch.y(0.8 + 6 * Math.exp(-0.45 * 9.6)) - 8}" text-anchor="end" font-size="12" fill="${C.muted}">Training Sample</text><text x="${ch.x(9.6)}" y="${ch.y(2.6 + 6 * Math.exp(-0.5 * 9.6) + 0.09 * 9.6 * 9.6) - 8}" text-anchor="end" font-size="12" fill="${C.seal}">Test Sample</text>`;
    g += `<text x="${ch.x(0)}" y="${ch.H - 26}" font-size="11" fill="${C.muted}">Low ← Model Complexity (유연성) → High</text><text x="${ch.x(0)}" y="${ch.H - 10}" font-size="11" fill="${C.muted}">High Bias · Low Variance  ←→  Low Bias · High Variance</text>`;
    fig(el, svgWrap(g, ch.W, ch.H, '모델 복잡도에 따른 훈련·테스트 오차'), '훈련 오차(회색)는 복잡할수록 계속 내려가지만 테스트 오차(빨강)는 어느 지점부터 다시 올라갑니다. 금색 점선 근처가 우리가 찾는 복잡도. 훈련 오차만 보면 오른쪽 끝(과적합)을 고르게 됩니다.');
  };

  V.splitviz = el => {
    let seed = 500;
    el.innerHTML = `<figure><div class="svg"></div><div class="ctrl"><button class="vizbtn" id="sv-btn" type="button">다시 무작위로 나누기</button><span class="ro">n = 392 → 196 / 196</span></div><figcaption>관측치 n개를 무작위로 반씩 나눠 파란 쪽(훈련)으로 모델을 맞추고 크림색 쪽(검증)으로 오차를 잽니다. 버튼을 누를 때마다 다른 관측치가 검증셋에 들어갑니다. 이 "어느 관측치가 어디에 들어가느냐"가 검증 오차 추정값을 흔듭니다.</figcaption></figure>`;
    const draw = () => {
      const r = rng(seed++), n = 60, cols = 20, cw = 28, ch = 26; const idx = Array.from({ length: n }, (_, i) => i); for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; } const val = new Set(idx.slice(0, n / 2));
      let g = `<text x="10" y="18" font-size="12" fill="${C.plum2}">원래 순서의 관측치 (파랑 = 훈련, 크림 = 검증)</text>`;
      for (let i = 0; i < n; i++) { const x = 10 + (i % cols) * cw, y = 30 + Math.floor(i / cols) * ch; g += `<rect class="cell" x="${x}" y="${y}" width="${cw - 3}" height="${ch - 3}" rx="4" fill="${val.has(i) ? C.cream : C.sky}" stroke="${C.line}"/>`; }
      g += `<text x="10" y="${30 + 3 * ch + 22}" font-size="12" fill="${C.plum2}">→ 훈련 ${n / 2}개로 적합, 검증 ${n / 2}개로 MSE 계산</text>`;
      el.querySelector('.svg').innerHTML = svgWrap(g, 580, 30 + 3 * ch + 36, '검증셋 무작위 분할');
    };
    el.querySelector('#sv-btn').addEventListener('click', draw); draw();
  };

  V.cvvar = el => {
    let seed = 700;
    el.innerHTML = `<figure><div style="display:flex;flex-wrap:wrap;gap:2%"><div class="svg" style="flex:1 1 280px"></div><div class="svg2" style="flex:1 1 280px"></div></div><div class="ctrl"><button class="vizbtn" id="cv-btn" type="button">10번 다시 나눠 보기</button></div><figcaption>왼쪽: 한 번 나눈 검증셋 MSE(다항식 차수별). 오른쪽: 10번 다르게 나눈 결과를 겹쳐 그린 것. 곡선마다 높이가 꽤 다르고, 최소가 되는 차수도 흔들립니다. 그래도 "2차부터 확 좋아지고 그 뒤로는 큰 이득이 없다"는 모양은 공통입니다.</figcaption></figure>`;
    const base = d => 24.5 - 6.2 * Math.min(1, (d - 1)) + 0.05 * (d - 2) ** 2 + (d >= 2 ? 0 : 0);
    const draw = () => {
      const r = rng(seed++);
      const one = () => { const off = gauss(r) * 1.0, tilt = gauss(r) * 0.15; return Array.from({ length: 10 }, (_, i) => { const d = i + 1; return base(d) + off + tilt * (d - 3) + gauss(r) * 0.35; }); };
      const mk = (curves, label, target) => { const ch = chart({ w: 320, h: 250, pad: { l: 36, r: 10, t: 24, b: 34 }, xd: [1, 10], yd: [14, 28], xl: 'Degree of Polynomial', yl: 'MSE', xt: [2, 4, 6, 8, 10] }); let g = ch.axes + `<text x="${ch.pad.l}" y="15" font-size="12" font-weight="700" fill="${C.plum}">${label}</text>`; curves.forEach((c, k) => g += `<path d="${path(c.map((v, i) => [ch.x(i + 1), clampY(ch, ch.y(v))]))}" fill="none" stroke="${curves.length === 1 ? C.seal : ['#D6487D', '#B79ADF', '#6FA4D8', '#8FCDB8', '#D9A64B', '#C43A45', '#47203A', '#F1A6C0', '#3E8F73', '#6E4460'][k]}" stroke-width="2"/>`); el.querySelector(target).innerHTML = svgWrap(g, ch.W, ch.H, label); };
      mk([one()], '한 번 나눔', '.svg'); mk(Array.from({ length: 10 }, one), '10번 나눔', '.svg2');
    };
    el.querySelector('#cv-btn').addEventListener('click', draw); draw();
  };

  V.kfold = el => {
    el.innerHTML = `<figure><div class="tabs"><button data-k="5" class="on">K = 5</button><button data-k="10">K = 10</button><button data-k="20">LOOCV (K = n = 20)</button></div><div class="svg"></div><div class="ctrl"><button class="vizbtn" id="kf-play" type="button">▶ 한 번에 하나씩</button><span class="ro" id="kf-ro"></span></div><figcaption>n개의 관측치를 K개의 조각으로 나눕니다. k번째 줄에서는 k번째 조각(크림)을 빼 두고 나머지(파랑)로 적합한 뒤, 빼 둔 조각으로 MSEₖ를 잽니다. K개의 MSEₖ를 평균한 것이 CV 추정값. K = n이면 매번 한 점만 빼는 LOOCV입니다.</figcaption></figure>`;
    let timer = null;
    const draw = (K, upto) => {
      const n = 20, W = 640, cw = (W - 130) / n, rh = K > 10 ? 13 : 26, Hh = 30 + K * rh + 20;
      let g = `<text x="10" y="16" font-size="11.5" fill="${C.plum2}">fold →</text>`;
      for (let k = 0; k < K; k++) {
        const y = 26 + k * rh; const act = upto == null || k <= upto;
        g += `<g class="fold-row"><text x="10" y="${y + rh / 2 + 4}" font-size="${K > 10 ? 9.5 : 11.5}" fill="${C.muted}" class="mono">${k + 1}</text>`;
        for (let i = 0; i < n; i++) { const isVal = Math.floor(i * K / n) === k; g += `<rect x="${40 + i * cw}" y="${y + 1}" width="${cw - 2}" height="${rh - 3}" rx="3" fill="${!act ? C.grid : isVal ? C.cream : C.sky}" stroke="${act ? C.line : 'none'}"/>`; }
        if (act) g += `<text x="${W - 80}" y="${y + rh / 2 + 4}" font-size="${K > 10 ? 9.5 : 11.5}" fill="${C.plum}" class="mono">MSE${k + 1}</text>`;
        g += '</g>';
      }
      g += `<text x="40" y="${Hh - 6}" font-size="11.5" fill="${C.plum2}">CV(K) = (1/K) Σ MSEₖ  (조각 크기가 같을 때)</text>`;
      el.querySelector('.svg').innerHTML = svgWrap(g, W, Hh, K + '-겹 교차검증 도식');
      el.querySelector('#kf-ro').textContent = upto == null ? `K = ${K}: 검증 조각 크기 ${20 / K}개, 적합 ${K}번` : `fold ${upto + 1}/${K} 적합 중… 검증 조각 = ${20 / K}개`;
    };
    let K = 5;
    el.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => { el.querySelectorAll('.tabs button').forEach(x => x.classList.remove('on')); b.classList.add('on'); K = Number(b.dataset.k); clearInterval(timer); draw(K); }));
    el.querySelector('#kf-play').addEventListener('click', () => { clearInterval(timer); let k = 0; draw(K, 0); timer = setInterval(() => { k++; if (k >= K) { clearInterval(timer); draw(K); } else draw(K, k); }, K > 10 ? 160 : 420); });
    draw(K);
  };

  V.cvcompare = el => {
    const cases = [{ true: x => 1 + 1.6 * Math.exp(-0.5 * x) + 0.035 * (x - 2) ** 1.5, ymax: 3 }, { true: x => 1 + 0.25 * Math.exp(-0.9 * x) + 0.05 * (x - 2) ** 1.4, ymax: 3 }, { true: x => 1 + 19 * Math.exp(-0.34 * x) + 0.06 * (x - 2) ** 1.5, ymax: 20 }];
    let out = ''; const r = rng(9);
    cases.forEach((c, k) => {
      const ch = chart({ w: 213, h: 230, pad: { l: 34, r: 8, t: 12, b: 36 }, xd: [2, 20], yd: [0, c.ymax], xl: 'Flexibility', xt: [2, 5, 10, 20], yl: k === 0 ? 'MSE' : '' });
      let g = ch.axes + curve(ch, c.true, 2, 20, 60, `stroke="${C.sky}" stroke-width="2.4"`);
      const wob = a => x => c.true(x) * (1 + a * Math.sin(x * 1.3 + k)) + a * 0.5 * (k === 2 ? 4 : 0.6);
      g += curve(ch, wob(0.06), 2, 20, 60, `stroke="${C.plum}" stroke-width="1.8" stroke-dasharray="5 3"`) + curve(ch, wob(-0.05), 2, 20, 60, `stroke="${C.gold}" stroke-width="2"`);
      out += `<svg viewBox="0 0 213 230" style="width:32%;min-width:190px;display:inline-block" role="img" aria-label="예 ${k + 1}의 진짜 테스트 MSE와 CV 추정">${g}</svg>`;
    });
    void r;
    fig(el, `<div style="display:flex;flex-wrap:wrap;gap:2%;justify-content:center">${out}</div><div class="legend"><span><i style="background:${C.sky}"></i>진짜 테스트 MSE</span><span><i class="dash" style="color:${C.plum}"></i>LOOCV 추정</span><span><i style="background:${C.gold}"></i>10-fold CV 추정</span></div>`, '세 가지 모사 데이터(1F의 예 1·2·3)에 대해 진짜 테스트 MSE(파랑)와 LOOCV(검정 점선), 10-겹 CV(금색) 추정. 값이 조금씩 어긋나도 곡선의 모양과 최소가 되는 유연성은 잘 맞춥니다. CV의 목적은 "정확한 오차값"보다 "최고의 유연성을 고르는 것"입니다.');
  };

  /* ================= 4F ================= */
  V.linvslog = el => {
    const r = rng(41), b0 = -10.6513, b1 = 0.0055; const pts = []; for (let i = 0; i < 160; i++) { const b = r() * 2600; const p = sig(b0 + b1 * b); pts.push([b, r() < p ? 1 : 0]); }
    const xm = pts.reduce((s, p) => s + p[0], 0) / pts.length, ym = pts.reduce((s, p) => s + p[1], 0) / pts.length; const l1 = pts.reduce((s, p) => s + (p[0] - xm) * (p[1] - ym), 0) / pts.reduce((s, p) => s + (p[0] - xm) ** 2, 0), l0 = ym - l1 * xm;
    let out = '';
    [['선형회귀', x => l0 + l1 * x, C.sky], ['로지스틱 회귀', x => sig(b0 + b1 * x), C.fuchsia]].forEach(p => {
      const ch = chart({ w: 320, h: 260, pad: { l: 40, r: 10, t: 26, b: 36 }, xd: [0, 2600], yd: [-0.15, 1.15], xl: 'Balance', yl: 'P(default)', xt: [0, 1000, 2000], yt: [0, 0.5, 1] });
      let g = ch.axes + `<text x="${ch.pad.l}" y="15" font-size="12" font-weight="700" fill="${C.plum}">${p[0]}</text>`;
      g += `<line x1="${ch.pad.l}" x2="${ch.W - ch.pad.r}" y1="${ch.y(0)}" y2="${ch.y(0)}" stroke="${C.line}" stroke-dasharray="3 3"/><line x1="${ch.pad.l}" x2="${ch.W - ch.pad.r}" y1="${ch.y(1)}" y2="${ch.y(1)}" stroke="${C.line}" stroke-dasharray="3 3"/>`;
      pts.forEach(q => g += `<line x1="${f1(ch.x(q[0]))}" x2="${f1(ch.x(q[0]))}" y1="${ch.y(q[1]) - 5}" y2="${ch.y(q[1]) + 5}" stroke="${C.gold}" stroke-width="1.2" opacity=".8"/>`);
      g += curve(ch, p[1], 0, 2600, 80, `stroke="${p[2]}" stroke-width="2.8"`);
      out += `<svg viewBox="0 0 320 260" style="width:48%;min-width:250px;display:inline-block" role="img" aria-label="${p[0]}">${g}</svg>`;
    });
    fig(el, `<div style="display:flex;flex-wrap:wrap;gap:2%;justify-content:center">${out}</div>`, '금색 눈금이 관측된 Y (0 또는 1). 선형회귀(왼쪽)는 balance가 작을 때 확률이 0 아래로 내려가고 크면 1을 넘깁니다. 로지스틱 회귀(오른쪽)는 S자 곡선이라 항상 0과 1 사이에 머뭅니다.');
  };

  V.sigmoid = el => {
    el.innerHTML = `<figure><div style="display:flex;flex-wrap:wrap;gap:2%"><div class="svg" style="flex:1 1 300px"></div><div class="svg2" style="flex:1 1 260px"></div></div><div class="ctrl"><label>β₀ <input type="range" id="sg-b0" min="-16" max="-4" step="0.1" value="-10.65"></label><label>β₁ <input type="range" id="sg-b1" min="0.001" max="0.012" step="0.0001" value="0.0055"></label></div><div class="kpi"><span>p(1000) = <b id="sg-p1"></b></span><span>p(2000) = <b id="sg-p2"></b></span><span>p = 0.5가 되는 balance = <b id="sg-mid"></b></span></div><figcaption>왼쪽: 로지스틱 함수 p(X) = e^(β₀+β₁X)/(1+e^(β₀+β₁X)). 오른쪽: 같은 모델을 로그 오즈 log(p/(1−p)) = β₀ + β₁X로 보면 직선. β₁은 이 직선의 기울기(X가 1 커질 때 로그 오즈가 β₁만큼 증가), β₀는 절편. β₁을 키우면 S자가 가팔라지고, β₀를 바꾸면 좌우로 이동합니다.</figcaption></figure>`;
    const draw = (b0, b1) => {
      const ch = chart({ w: 360, h: 270, pad: { l: 40, r: 10, t: 16, b: 38 }, xd: [0, 2600], yd: [0, 1], xl: 'Balance (X)', yl: 'p(X)', xt: [0, 1000, 2000], yt: [0, 0.5, 1] });
      let g = ch.axes + `<line x1="${ch.pad.l}" x2="${ch.W - ch.pad.r}" y1="${ch.y(0.5)}" y2="${ch.y(0.5)}" stroke="${C.line}" stroke-dasharray="3 3"/>` + curve(ch, x => sig(b0 + b1 * x), 0, 2600, 100, `stroke="${C.fuchsia}" stroke-width="3"`);
      [1000, 2000].forEach(b => g += `<circle cx="${ch.x(b)}" cy="${ch.y(sig(b0 + b1 * b))}" r="5" fill="${C.gold}" stroke="#fff" stroke-width="1.5"/>`);
      el.querySelector('.svg').innerHTML = svgWrap(g, ch.W, ch.H, '로지스틱 함수');
      const c2 = chart({ w: 300, h: 270, pad: { l: 40, r: 10, t: 16, b: 38 }, xd: [0, 2600], yd: [-12, 8], xl: 'Balance (X)', yl: 'log odds', xt: [0, 1000, 2000], yt: [-10, -5, 0, 5] });
      let h = c2.axes + `<line x1="${c2.pad.l}" x2="${c2.W - c2.pad.r}" y1="${c2.y(0)}" y2="${c2.y(0)}" stroke="${C.line}" stroke-dasharray="3 3"/><line x1="${c2.x(0)}" y1="${clampY(c2, c2.y(b0))}" x2="${c2.x(2600)}" y2="${clampY(c2, c2.y(b0 + b1 * 2600))}" stroke="${C.plum}" stroke-width="3"/>`;
      el.querySelector('.svg2').innerHTML = svgWrap(h, c2.W, c2.H, '로짓 직선');
      el.querySelector('#sg-p1').textContent = f3(sig(b0 + b1 * 1000)); el.querySelector('#sg-p2').textContent = f3(sig(b0 + b1 * 2000)); el.querySelector('#sg-mid').textContent = Math.round(-b0 / b1);
    };
    const a = el.querySelector('#sg-b0'), b = el.querySelector('#sg-b1'); const upd = () => draw(Number(a.value), Number(b.value)); a.addEventListener('input', upd); b.addEventListener('input', upd); upd();
  };

  V.likelihood = el => {
    const xs = [0.5, 1.2, 1.6, 2.3, 2.9, 3.4, 4.1, 4.8], ys = [0, 0, 1, 0, 1, 1, 0, 1]; const b0 = -3;
    el.innerHTML = `<figure><div class="svg"></div><div class="ctrl"><label>β₁ <input type="range" id="lk-b1" min="0" max="3" step="0.05" value="0.6"></label></div><div class="kpi"><span>L(β) = <b id="lk-L"></b></span><span>log L(β) = <b id="lk-lL"></b></span></div><figcaption>점 8개(y = 1은 위, y = 0은 아래). 각 관측이 모델에 "얼마나 그럴듯한지"를 막대로 그렸습니다: y = 1인 점은 p(xᵢ), y = 0인 점은 1 − p(xᵢ). 우도 L(β)는 이 막대 높이들의 곱. β₁을 움직여 곱이 최대가 되는 곳을 찾아보세요(β₀ = −3 고정). 그 β가 최대우도추정값입니다.</figcaption></figure>`;
    const draw = b1 => {
      const ch = chart({ w: 640, h: 300, xd: [0, 5.3], yd: [0, 1], xl: 'x', yl: 'p(x)', yt: [0, 0.5, 1] });
      let g = ch.axes + curve(ch, x => sig(b0 + b1 * x), 0, 5.3, 80, `stroke="${C.fuchsia}" stroke-width="2.6"`); let L = 1, lL = 0;
      xs.forEach((x, i) => { const p = sig(b0 + b1 * x), c = ys[i] ? p : 1 - p; L *= c; lL += Math.log(c); const top = ys[i] ? ch.y(p) : ch.y(1 - p); g += `<rect x="${ch.x(x) - 9}" y="${Math.min(top, ch.y(0))}" width="18" height="${Math.abs(ch.y(0) - top)}" fill="${ys[i] ? C.mint3 : C.gold}" opacity=".45"/><circle cx="${ch.x(x)}" cy="${ch.y(ys[i])}" r="6" fill="${ys[i] ? C.mint3 : C.gold}" stroke="#fff" stroke-width="1.5"/><text x="${ch.x(x)}" y="${ch.y(0) + 30}" text-anchor="middle" font-size="10.5" fill="${C.plum2}" class="mono">${f2(c)}</text>`; });
      el.querySelector('.svg').innerHTML = svgWrap(g, ch.W, ch.H, '각 관측의 우도 기여');
      el.querySelector('#lk-L').textContent = L.toExponential(3); el.querySelector('#lk-lL').textContent = f3(lL);
    };
    el.querySelector('#lk-b1').addEventListener('input', e => draw(Number(e.target.value))); draw(0.6);
  };

  V.defaultcalc = el => {
    el.innerHTML = `<figure><div class="cols" style="gap:.8rem"><div class="mini"><b class="t">단순 모델 (balance만)</b><div class="ctrl" style="margin:0"><label>balance <input type="range" id="dc-b" min="0" max="2600" step="10" value="1000"></label><span class="ro" id="dc-bv">1000</span></div><p style="margin-top:.5rem">log odds = −10.6513 + 0.0055·balance = <b id="dc-lo"></b><br>p̂ = <b id="dc-p" style="color:var(--fuchsia)"></b></p></div>
      <div class="mini"><b class="t">다변량 모델 (balance, income, student)</b><div class="ctrl" style="margin:0"><label>income(천$) <input type="range" id="dc-i" min="0" max="75" step="1" value="40"></label><span class="ro" id="dc-iv">40</span></div><div class="ctrl" style="margin-top:.3rem"><label><input type="checkbox" id="dc-s"> 학생</label></div><p style="margin-top:.5rem">log odds = −10.869 + 0.00574·bal + 0.003·inc − 0.6468·stu = <b id="dc-lo2"></b><br>p̂ = <b id="dc-p2" style="color:var(--fuchsia)"></b></p></div></div>
      <figcaption>슬라이드의 예: balance 1000 → 0.006, 2000 → 0.586. 다변량 모델에서는 같은 balance라도 학생이면 로그 오즈가 0.6468 줄어듭니다(오즈가 e^−0.6468 ≈ 0.52배).</figcaption></figure>`;
    const upd = () => {
      const b = Number(el.querySelector('#dc-b').value), inc = Number(el.querySelector('#dc-i').value), s = el.querySelector('#dc-s').checked ? 1 : 0;
      const lo = -10.6513 + 0.0055 * b, lo2 = -10.869 + 0.00574 * b + 0.003 * inc - 0.6468 * s;
      el.querySelector('#dc-bv').textContent = b; el.querySelector('#dc-iv').textContent = inc;
      el.querySelector('#dc-lo').textContent = f3(lo); el.querySelector('#dc-p').textContent = f4(sig(lo));
      el.querySelector('#dc-lo2').textContent = f3(lo2); el.querySelector('#dc-p2').textContent = f4(sig(lo2));
    };
    ['#dc-b', '#dc-i', '#dc-s'].forEach(s => el.querySelector(s).addEventListener('input', upd)); upd();
  };

  V.confound = el => {
    const ch = chart({ w: 400, h: 280, pad: { l: 44, r: 10, t: 20, b: 40 }, xd: [500, 2200], yd: [0, 0.85], xl: 'Credit Card Balance', yl: 'Default Rate', xt: [500, 1000, 1500, 2000], yt: [0, 0.2, 0.4, 0.6, 0.8] });
    const st = x => sig(-10.869 + 0.00574 * x + 0.003 * 20 - 0.6468), ns = x => sig(-10.869 + 0.00574 * x + 0.003 * 40);
    let g = ch.axes + curve(ch, ns, 500, 2200, 80, `stroke="${C.sky}" stroke-width="2.8"`) + curve(ch, st, 500, 2200, 80, `stroke="${C.gold}" stroke-width="2.8"`);
    g += `<line x1="${ch.pad.l}" x2="${ch.W - ch.pad.r}" y1="${ch.y(0.0431)}" y2="${ch.y(0.0431)}" stroke="${C.gold}" stroke-dasharray="5 4"/><line x1="${ch.pad.l}" x2="${ch.W - ch.pad.r}" y1="${ch.y(0.0292)}" y2="${ch.y(0.0292)}" stroke="${C.sky}" stroke-dasharray="5 4"/>`;
    g += `<text x="${ch.x(560)}" y="${ch.y(0.0431) - 22}" font-size="11" fill="${C.gold}">점선: 학생 전체 연체율 4.3%</text><text x="${ch.x(560)}" y="${ch.y(0.0431) - 8}" font-size="11" fill="${C.sky}">점선: 비학생 전체 연체율 2.9%</text>`;
    g += `<text x="${ch.x(2180)}" y="${ch.y(ns(2180)) - 10}" text-anchor="end" font-size="12" font-weight="700" fill="${C.sky}">비학생</text><text x="${ch.x(2180)}" y="${ch.y(st(2180)) + 18}" text-anchor="end" font-size="12" font-weight="700" fill="${C.gold}">학생</text>`;
    // 오른쪽: balance 분포 (박스)
    const c2 = chart({ w: 230, h: 280, pad: { l: 44, r: 10, t: 20, b: 40 }, xd: [0, 2], yd: [0, 2600], xl: 'Student Status', yl: 'Credit Card Balance', xt: [], yt: [0, 500, 1000, 1500, 2000, 2500] });
    let h = c2.axes;
    [[0.5, 'No', 700, 380, 1050, 0, 2050, C.sky], [1.5, 'Yes', 900, 600, 1300, 100, 2300, C.gold]].forEach(b => { const x = c2.x(b[0]); h += `<line x1="${x}" x2="${x}" y1="${c2.y(b[5])}" y2="${c2.y(b[6])}" stroke="${C.plum2}"/><rect x="${x - 30}" y="${c2.y(b[4])}" width="60" height="${c2.y(b[3]) - c2.y(b[4])}" fill="${b[7]}" opacity=".6" stroke="${C.plum2}"/><line x1="${x - 30}" x2="${x + 30}" y1="${c2.y(b[2])}" y2="${c2.y(b[2])}" stroke="${C.plum}" stroke-width="2"/><text x="${x}" y="${c2.H - c2.pad.b + 18}" text-anchor="middle" font-size="11.5" fill="${C.plum}">${b[1]}</text>`; });
    fig(el, `<div style="display:flex;flex-wrap:wrap;gap:2%;justify-content:center"><svg viewBox="0 0 400 280" style="width:60%;min-width:260px" role="img" aria-label="학생·비학생의 balance별 연체율">${g}</svg><svg viewBox="0 0 230 280" style="width:36%;min-width:180px" role="img" aria-label="학생·비학생의 balance 분포">${h}</svg></div>`, '왼쪽: balance가 같으면 학생(금색)이 비학생(파랑)보다 연체율이 낮습니다. 그런데 오른쪽처럼 학생은 balance 자체가 높은 편이라, balance를 무시하고 전체 평균만 보면 학생 연체율(4.3%)이 비학생(2.9%)보다 높게 나옵니다. 이것이 교란(confounding)입니다.');
  };

  V.softmax = el => {
    el.innerHTML = `<figure><div class="svg"></div><div class="ctrl"><label>η₁ (뇌졸중) <input type="range" id="sm-1" min="-3" max="3" step="0.1" value="1"></label><label>η₂ (약물 과다) <input type="range" id="sm-2" min="-3" max="3" step="0.1" value="0"></label><label>η₃ (발작) <input type="range" id="sm-3" min="-3" max="3" step="0.1" value="-1"></label></div><figcaption>클래스마다 선형함수 ηₖ = β₀ₖ + β₁ₖX₁ + ⋯ 를 하나씩 두고, e^ηₖ를 전체 합으로 나눠 확률로 만듭니다(소프트맥스). 세 막대의 합은 항상 1. 한 η를 키우면 그 클래스의 확률만 커지는 게 아니라 나머지가 같이 줄어듭니다.</figcaption></figure>`;
    const draw = () => {
      const et = [1, 2, 3].map(k => Number(el.querySelector('#sm-' + k).value)); const ex = et.map(Math.exp), S = ex.reduce((a, b) => a + b), ps = ex.map(e => e / S);
      const W = 640, Hh = 220, y = scale(0, 1, 180, 20), names = ['stroke', 'drug overdose', 'epileptic seizure'], cols = [C.fuchsia, C.gold, C.mint3];
      let g = `<line x1="60" x2="${W - 20}" y1="${y(0)}" y2="${y(0)}" stroke="${C.line}"/>`;
      ps.forEach((p, i) => { const x = 90 + i * 180; g += `<rect x="${x}" y="${y(p)}" width="110" height="${y(0) - y(p)}" rx="8" fill="${cols[i]}" opacity=".8"/><text x="${x + 55}" y="${y(p) - 8}" text-anchor="middle" font-size="13" font-weight="700" fill="${C.plum}" class="mono">${f3(p)}</text><text x="${x + 55}" y="${y(0) + 18}" text-anchor="middle" font-size="12" fill="${C.plum}">${names[i]}</text><text x="${x + 55}" y="${y(0) + 34}" text-anchor="middle" font-size="11" fill="${C.muted}" class="mono">e^${f1(et[i])} / ${f2(S)}</text>`; });
      el.querySelector('.svg').innerHTML = svgWrap(g, W, Hh, '소프트맥스 확률 막대');
    };
    [1, 2, 3].forEach(k => el.querySelector('#sm-' + k).addEventListener('input', draw)); draw();
  };
})();
