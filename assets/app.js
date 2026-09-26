/* Grand Data Hotel — 앱 (라우터 · 전환 · 진행도 · 퀴즈 · 플래시카드 · 모의고사) */
(function () {
  'use strict';
  const H = window.HOTEL = window.HOTEL || {};
  H.floors = H.floors || [];
  H.examExtra = H.examExtra || [];
  H.cards = H.cards || [];

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad2 = n => String(n).padStart(2, '0');

  /* ---------- 진행도 저장 ---------- */
  const STORE = 'gdh-progress-v1';
  let P = load();
  function load() {
    try { const j = localStorage.getItem(STORE); if (j) { const o = JSON.parse(j); if (o && typeof o === 'object') return Object.assign(blank(), o); } } catch (e) { /* 저장소 없음 */ }
    return blank();
  }
  function blank() { return { done: {}, quiz: {}, exams: [], checks: {}, cards: {}, last: null }; }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(P)); } catch (e) { /* 무시 */ } }

  /* ---------- 색인 ---------- */
  const IDX = { rooms: {}, order: [] };
  function buildIndex() {
    H.floors.sort((a, b) => a.n - b.n);
    H.floors.forEach(f => {
      f.rooms.forEach((r, i) => {
        r.floor = f; r.i = i; r.code = f.n + '-' + pad2(i + 1);
        if (!r.easy && H.easy && H.easy[r.id]) r.easy = H.easy[r.id];
        IDX.rooms[r.id] = r; IDX.order.push(r.id);
      });
    });
    IDX.order.forEach((id, k) => {
      const r = IDX.rooms[id];
      r.prev = k > 0 ? IDX.rooms[IDX.order[k - 1]] : null;
      r.next = k < IDX.order.length - 1 ? IDX.rooms[IDX.order[k + 1]] : null;
    });
  }
  const floorOf = n => H.floors.find(f => f.n === Number(n));
  const totalRooms = () => IDX.order.length;
  const doneCount = () => IDX.order.filter(id => P.done[id]).length;
  const floorDone = f => f.rooms.filter(r => P.done[r.id]).length;
  const floorComplete = f => floorDone(f) === f.rooms.length;
  function nextRoom() { const id = IDX.order.find(id => !P.done[id]); return id ? IDX.rooms[id] : IDX.rooms[IDX.order[0]]; }

  /* ---------- 공용 아트 ---------- */
  const ART = {
    key: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="11" cy="11" r="8" fill="none" stroke="#D9A64B" stroke-width="3"/><circle cx="11" cy="11" r="2.6" fill="#D9A64B"/><path d="M16.5 16.5 L28 28 M23 23 L26 20 M20 20 L23 17" stroke="#D9A64B" stroke-width="3" stroke-linecap="round" fill="none"/></svg>`,
    cat: `<svg viewBox="0 0 120 138" aria-label="컨시어지 고양이 냥" role="img">
      <ellipse cx="60" cy="130" rx="34" ry="6" fill="rgba(71,32,58,.10)"/>
      <path d="M32 92 q28 -22 56 0 v22 q-28 14 -56 0z" fill="#B79ADF"/>
      <rect x="52" y="90" width="16" height="30" rx="3" fill="#8E6BC9"/>
      <circle cx="60" cy="98" r="2.3" fill="#D9A64B"/><circle cx="60" cy="108" r="2.3" fill="#D9A64B"/>
      <path d="M26 40 l4 -28 l22 18z" fill="#F6BFD2"/><path d="M94 40 l-4 -28 l-22 18z" fill="#F6BFD2"/>
      <path d="M31 38 l2 -18 l14 12z" fill="#F1A6C0"/><path d="M89 38 l-2 -18 l-14 12z" fill="#F1A6C0"/>
      <ellipse cx="60" cy="60" rx="38" ry="34" fill="#FFF3EC"/>
      <rect x="40" y="10" width="40" height="22" rx="4" fill="#D6487D"/>
      <rect x="40" y="26" width="40" height="6" fill="#D9A64B"/>
      <rect x="38" y="30" width="44" height="4" rx="2" fill="#B93A68"/>
      <circle cx="47" cy="60" r="4.2" fill="#47203A"/><circle cx="73" cy="60" r="4.2" fill="#47203A"/>
      <circle cx="48.5" cy="58.5" r="1.4" fill="#fff"/><circle cx="74.5" cy="58.5" r="1.4" fill="#fff"/>
      <ellipse cx="38" cy="70" rx="6" ry="3.5" fill="#F6BFD2"/><ellipse cx="82" cy="70" rx="6" ry="3.5" fill="#F6BFD2"/>
      <path d="M57 68 q3 3 6 0" stroke="#47203A" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="M60 68 v3 q-4 4 -8 0 M60 71 q4 4 8 0" stroke="#47203A" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <path d="M20 64 h14 M20 70 h14 M86 64 h14 M86 70 h14" stroke="#9A7A90" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M96 104 q16 -4 12 -20" stroke="#F6BFD2" stroke-width="7" fill="none" stroke-linecap="round"/>
    </svg>`,
    bow: `<svg viewBox="0 0 58 34" aria-hidden="true"><path d="M29 17 C16 2 2 6 6 16 C9 24 22 20 29 17 Z" fill="#F1A6C0"/><path d="M29 17 C42 2 56 6 52 16 C49 24 36 20 29 17 Z" fill="#F1A6C0"/><path d="M29 17 c-8 6 -12 12 -8 16 c4 -4 6 -10 8 -16 z" fill="#F1A6C0"/><path d="M29 17 c8 6 12 12 8 16 c-4 -4 -6 -10 -8 -16 z" fill="#F1A6C0"/><circle cx="29" cy="17" r="4.5" fill="#D6487D"/></svg>`,
    icoPoints: `<svg viewBox="0 0 44 44" aria-hidden="true"><rect x="6" y="8" width="32" height="30" rx="4" fill="#F6BFD2"/><rect x="6" y="8" width="32" height="8" fill="#F1A6C0"/><path d="M12 22h20M12 28h20M12 34h12" stroke="#47203A" stroke-width="2" stroke-linecap="round"/><circle cx="34" cy="10" r="6" fill="#C43A45"/></svg>`,
    icoCards: `<svg viewBox="0 0 44 44" aria-hidden="true"><rect x="12" y="6" width="26" height="30" rx="4" fill="#DCCBF2" transform="rotate(8 25 21)"/><rect x="6" y="10" width="26" height="30" rx="4" fill="#FFF9F4" stroke="#47203A" stroke-width="1.5"/><path d="M12 20h14M12 26h10" stroke="#D6487D" stroke-width="2" stroke-linecap="round"/></svg>`,
    icoExam: `<svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="17" fill="#BFE6D6"/><path d="M22 10v12l8 5" stroke="#47203A" stroke-width="2.5" stroke-linecap="round" fill="none"/><circle cx="22" cy="22" r="2" fill="#D6487D"/></svg>`,
    sakura: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c2 3 2 6 0 8c-2-2-2-5 0-8zm7 5c-1 3-4 5-7 4c1-3 4-5 7-4zm-2 9c-3 0-6-2-6-5c3 0 6 2 6 5zm-10 0c0-3 3-5 6-5c0 3-3 5-6 5zM5 8c3-1 6 1 7 4c-3 1-6-1-7-4z" fill="#F1A6C0"/><circle cx="12" cy="12" r="1.6" fill="#D9A64B"/></svg>`
  };

  /* ---------- 내비게이션 ---------- */
  function renderNav() {
    const nav = $('#nav');
    const d = doneCount(), t = totalRooms();
    const pct = t ? Math.round(d / t * 100) : 0;
    nav.innerHTML = `
      <div class="nav-head">
        <a class="nav-logo" href="#/" aria-label="프런트로">${ART.key}<span><b>Grand Data Hotel</b><small>Data-Centric AI</small></span></a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-panel"><span class="lbl">Menu</span><span class="ico"><i></i><i></i></span></button>
      </div>
      <div class="nav-panel" id="nav-panel"><div><div class="nav-panel-in">
        <div class="nav-prog"><div class="omamori" aria-hidden="true"><span class="str"></span><span class="body"></span></div>
          <div style="flex:1;display:grid;gap:.35rem"><div class="lbl">열쇠 <b>${d}</b> / ${t}개 수집 · <b>${pct}%</b></div><div class="bar"><i style="width:${pct}%"></i></div></div></div>
        <div><div class="nav-sec-t">Floors · 층 안내</div>
          ${H.floors.map(f => `<a class="nav-floor" href="#/floor/${f.n}"><span class="fn">${f.n}F</span><span class="ft">${esc(f.title)}<small>${esc(f.lecture)}</small></span><span class="fp">${floorDone(f)}/${f.rooms.length}</span></a>`).join('')}
        </div>
        <div><div class="nav-sec-t">Exam desk · 시험 대비</div>
          <div class="nav-links">${H.floors.map(f => `<a href="#/points/${f.n}">${f.n}F 족보</a>`).join('')}<a href="#/cards">플래시카드</a><a href="#/exam">모의고사</a><a href="#/" data-goto="guide">이용 안내</a></div>
        </div>
      </div></div></div>`;
    const tg = $('.nav-toggle', nav);
    tg.addEventListener('click', () => { const open = nav.classList.toggle('open'); tg.setAttribute('aria-expanded', String(open)); });
    $$('a', nav).forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); tg.setAttribute('aria-expanded', 'false'); }));
    document.addEventListener('click', e => { if (!nav.contains(e.target)) { nav.classList.remove('open'); tg.setAttribute('aria-expanded', 'false'); } });
  }
  function refreshNavProgress() {
    const d = doneCount(), t = totalRooms(), pct = t ? Math.round(d / t * 100) : 0;
    const lbl = $('.nav-prog .lbl'); const bar = $('.nav-prog .bar i');
    if (lbl) lbl.innerHTML = `열쇠 <b>${d}</b> / ${t}개 수집 · <b>${pct}%</b>`;
    if (bar) bar.style.width = pct + '%';
    $$('.nav-floor').forEach((a, i) => { const f = H.floors[i]; if (f) $('.fp', a).textContent = floorDone(f) + '/' + f.rooms.length; });
  }

  /* ---------- 토스트 · 꽃잎 ---------- */
  function toast(msg) {
    const el = document.createElement('div'); el.className = 'toast'; el.innerHTML = msg; $('#toast').appendChild(el);
    setTimeout(() => el.remove(), 3400);
  }
  function petals(n) {
    if (reduced) return;
    const cv = $('#petals'); const ctx = cv.getContext('2d');
    const W = cv.width = innerWidth, Hh = cv.height = innerHeight;
    cv.classList.add('on');
    const ps = Array.from({ length: n || 46 }, () => ({ x: Math.random() * W, y: -20 - Math.random() * Hh * .5, r: 5 + Math.random() * 6, vy: 1.2 + Math.random() * 1.6, vx: -.6 + Math.random() * 1.2, a: Math.random() * 6.28, va: (-.5 + Math.random()) * .08, c: Math.random() < .5 ? '#F1A6C0' : '#F6BFD2' }));
    const t0 = performance.now();
    (function frame(t) {
      const el = (t - t0) / 1000;
      ctx.clearRect(0, 0, W, Hh);
      ps.forEach(p => {
        p.x += p.vx + Math.sin(el * 2 + p.a) * .6; p.y += p.vy; p.a += p.va;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0, Math.min(1, 3.2 - el));
        ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .62, 0, 0, 6.28); ctx.fill();
        ctx.fillStyle = 'rgba(214,72,125,.35)'; ctx.beginPath(); ctx.ellipse(p.r * .45, 0, p.r * .25, p.r * .2, 0, 0, 6.28); ctx.fill();
        ctx.restore();
      });
      if (el < 3.3) requestAnimationFrame(frame); else { ctx.clearRect(0, 0, W, Hh); cv.classList.remove('on'); }
    })(t0);
  }

  /* ---------- 수식 · 시각 자료 · 등장 애니메이션 ---------- */
  function renderMath(el) {
    if (!window.renderMathInElement) return;
    try {
      renderMathInElement(el, {
        delimiters: [{ left: '$$', right: '$$', display: true }, { left: '\\[', right: '\\]', display: true }, { left: '$', right: '$', display: false }, { left: '\\(', right: '\\)', display: false }],
        ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option'], throwOnError: false, strict: false, trust: true
      });
    } catch (e) { /* 렌더 실패는 원문 유지 */ }
  }
  function mountViz(el) {
    $$('[data-viz]', el).forEach(v => {
      const fn = window.VIZ && window.VIZ[v.dataset.viz];
      if (!fn) { v.innerHTML = '<p class="muted small">시각 자료를 불러오지 못했습니다.</p>'; return; }
      let opts = {}; try { opts = v.dataset.opts ? JSON.parse(v.dataset.opts) : {}; } catch (e) { opts = {}; }
      try { fn(v, opts); } catch (e) { v.innerHTML = '<p class="muted small">시각 자료 오류: ' + esc(e.message) + '</p>'; }
      renderMath(v);
    });
  }
  function stagger(el) { $$('.rv', el).forEach((n, i) => n.style.setProperty('--i', String(Math.min(i, 14)))); }
  function wordReveal(el) {
    $$('.words', el).forEach(p => {
      if (reduced) return;
      const words = p.textContent.split(/(\s+)/);
      p.innerHTML = words.map((w, i) => /^\s+$/.test(w) ? ' ' : `<span class="w" style="--w:${Math.floor(i / 2)}">${esc(w)}</span>`).join('');
    });
  }

  /* ---------- 라우팅 · 전환 ---------- */
  const stage = $('#stage');
  let cur = { kind: 'none', floor: null, i: -1 };
  function parse() {
    const h = (location.hash || '#/').replace(/^#\/?/, '');
    const p = h.split('/').filter(Boolean);
    if (!p.length) return { kind: 'home' };
    if (p[0] === 'floor' && floorOf(p[1])) return { kind: 'floor', floor: Number(p[1]) };
    if (p[0] === 'room' && IDX.rooms[p[1]]) { const r = IDX.rooms[p[1]]; return { kind: 'room', floor: r.floor.n, i: IDX.order.indexOf(r.id), room: r }; }
    if (p[0] === 'points' && floorOf(p[1])) return { kind: 'points', floor: Number(p[1]) };
    if (p[0] === 'cards') return { kind: 'cards', floor: p[1] ? Number(p[1]) : null };
    if (p[0] === 'exam') return { kind: 'exam' };
    return { kind: 'home' };
  }
  function transitionFor(prev, next) {
    if (prev.kind === 'none') return { type: 'lift' };
    const floorish = k => k === 'floor' || k === 'room' || k === 'points';
    if (prev.kind === 'room' && next.kind === 'room' && prev.floor === next.floor) return { type: next.i > prev.i ? 'next' : 'prev' };
    if (floorish(next.kind) && next.floor !== prev.floor) return { type: 'elevator', label: next.floor + 'F' };
    if (next.kind === 'home' && floorish(prev.kind)) return { type: 'elevator', label: 'L' };
    return { type: 'fade' };
  }
  let navSeq = 0;
  function go() {
    const next = parse();
    const tr = transitionFor(cur, next);
    const seq = ++navSeq;
    const old = $('.page', stage);
    const mount = () => {
      if (seq !== navSeq) return;
      stage.innerHTML = '';
      const html = PAGES[next.kind](next);
      const sec = document.createElement('section');
      sec.className = 'page ' + (tr.type === 'next' ? 'in-next' : tr.type === 'prev' ? 'in-prev' : tr.type === 'lift' ? 'in-lift' : '');
      sec.innerHTML = html;
      stage.appendChild(sec);
      stagger(sec); wordReveal(sec); renderMath(sec); mountViz(sec); bind(sec, next);
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
      cur = next;
      document.title = pageTitle(next) + ' · Grand Data Hotel';
    };
    if (tr.type === 'elevator' && !reduced) {
      const ev = $('#elevator'); $('.floor-ind-n', ev).textContent = tr.label; $('.floor-ind-t', ev).textContent = tr.label === 'L' ? 'Lobby' : 'Floor';
      if (old) old.classList.add('out-fade');
      ev.classList.add('closed');
      setTimeout(() => { mount(); setTimeout(() => ev.classList.remove('closed'), 260); }, 470);
    } else if (old && (tr.type === 'next' || tr.type === 'prev') && !reduced) {
      old.classList.add(tr.type === 'next' ? 'out-next' : 'out-prev');
      setTimeout(mount, 300);
    } else if (old && !reduced) {
      old.classList.add('out-fade'); setTimeout(mount, 240);
    } else mount();
  }
  function pageTitle(s) {
    if (s.kind === 'room') return s.room.code + ' ' + s.room.title;
    if (s.kind === 'floor') return floorOf(s.floor).n + 'F ' + floorOf(s.floor).title;
    if (s.kind === 'points') return floorOf(s.floor).n + 'F 시험 포인트';
    if (s.kind === 'cards') return '플래시카드';
    if (s.kind === 'exam') return '모의고사';
    return '프런트';
  }

  /* ---------- 페이지 ---------- */
  const PAGES = {};

  PAGES.home = () => {
    const d = doneCount(), t = totalRooms(), nr = nextRoom();
    let hello;
    if (d === 0) hello = '어서 오세요! 저는 이 호텔의 컨시어지 <b>냥</b>이에요. 1층부터 한 객실씩 천천히 둘러보시면 돼요. 한 객실엔 개념 하나만 있으니 부담 갖지 마세요.';
    else if (d < t) hello = `다시 오셨네요! 지금까지 열쇠를 <b>${d}개</b>모으셨어요. 다음 객실은 <b>${esc(nr.code)} ${esc(nr.title)}</b>이에요. 오늘도 한 객실만 보고 가셔도 충분해요.`;
    else hello = '와, 모든 객실을 다 도셨어요! 이제 족보와 플래시카드로 복습하고, 모의고사로 마무리해 볼까요? 合格祈願!';
    return `
      <section class="hero"><div class="sprinkles" aria-hidden="true"><span class="cloud c1"></span><span class="cloud c2"></span><span class="cloud c3"></span><span class="star s1"></span><span class="star s2"></span><span class="star s3"></span><span class="star s4"></span></div><div class="wrap hero-in">
        <div class="hero-txt">
          <p class="eyebrow rv"><span class="dot"></span>Data-Centric AI · Lecture 1–4 · 시험 대비 스터디</p>
          <h1 class="display rv">Grand <em>Data</em><br>Hotel</h1>
          <p class="lede words">데이터가 모델을 만듭니다. 서론부터 로지스틱 회귀까지, 4개 층 ${t}개 객실. 한 객실에는 개념 하나만 두었어요.</p>
          <div class="cta rv"><a class="btn hi" href="#/room/${nr.id}">${d ? '이어서 공부하기' : '체크인 하기'} <span class="k">${esc(nr.code)}</span></a><a class="btn" href="#/floor/1">층 안내 보기</a></div>
          <div class="scroll-hint rv"><i></i>Scroll to discover</div>
        </div>
        <div class="hero-art rv"><div class="concierge big"><div class="cat">${ART.cat}</div><div class="bubble"><span class="who">Concierge · 냥</span>${hello}</div></div></div>
      </div></section>

      <section class="sec"><div class="wrap">
        <div class="sec-head rv"><div><p class="eyebrow">Floors · 층 안내</p><h2 class="h-sec">강의 하나가 한 층입니다</h2></div><p class="lede small">객실 문을 열면 개념 하나, 그림 하나, 시험 포인트, 퀵 체크가 기다려요. 다 보면 도장을 찍고 열쇠를 모아요.</p></div>
        <div class="floors">${H.floors.map((f, i) => {
          const fd = floorDone(f), pct = Math.round(fd / f.rooms.length * 100), tapes = ['', 'gold', 'lilac', 'rose'];
          return `<a class="floor-card rv" href="#/floor/${f.n}"><span class="ftab"></span>
            <div><div class="fnum">${f.n}<small>Floor</small></div></div>
            <div><h3>${esc(f.title)}</h3><span class="en fen">${esc(f.en)}</span><p class="fmeta" style="margin-top:.6rem">${esc(f.lecture)} · ${f.rooms.length} rooms</p></div>
            <div><div class="fmeta" style="margin-bottom:.35rem">${fd}/${f.rooms.length} 완료</div><div class="fbar"><i style="width:${pct}%"></i></div></div>
            ${floorComplete(f) ? '<span class="stamp fdone" style="width:52px;height:52px;font-size:20px">完</span>' : ''}</a>`;
        }).join('')}</div>
      </div></section>

      <section class="sec"><div class="wrap">
        <div class="sec-head rv"><div><p class="eyebrow">Exam desk · 시험 대비 데스크</p><h2 class="h-sec">시험 직전엔 이곳으로</h2></div></div>
        <div class="desk">
          <a class="desk-card rv" href="#/points/1"><span class="tape rose"></span><span class="ico">${ART.icoPoints}</span><h3>족보 · 시험 포인트 정리</h3><p>층마다 객실별 핵심 포인트와 공식만 모았어요. 체크박스로 외운 것을 지워 가세요.</p><span class="go">1F → 4F</span></a>
          <a class="desk-card rv" href="#/cards"><span class="tape lilac"></span><span class="ico">${ART.icoCards}</span><h3>플래시카드</h3><p>용어·정의·공식을 카드로 뒤집어 보며 확인해요. "다시"를 누른 카드만 다시 나와요.</p><span class="go">${H.cards.length} cards</span></a>
          <a class="desk-card rv" href="#/exam"><span class="tape"></span><span class="ico">${ART.icoExam}</span><h3>모의고사</h3><p>모든 층에서 골고루 20문제. 틀린 문제는 해당 객실로 바로 연결돼요.</p><span class="go">${P.exams.length ? '최근 ' + P.exams[P.exams.length - 1].score + '/20' : '20 questions'}</span></a>
        </div>
      </div></section>

      <section class="sec" id="guide"><div class="wrap">
        <div class="sec-head rv"><div><p class="eyebrow">How to stay · 이용 안내</p><h2 class="h-sec">부담 없이 머무는 법</h2></div></div>
        <div class="steps">
          <div class="step rv"><b>객실 하나 = 개념 하나</b><p>한 페이지가 짧아요. 3–6분이면 한 객실을 다 봅니다. 긴 유도 과정은 접어 두었으니 필요할 때만 펼치세요.</p></div>
          <div class="step rv"><b>그림으로 먼저 이해</b><p>슬라이더를 움직이거나 버튼을 눌러 보세요. 공식이 왜 그런 모양인지 손으로 느끼도록 만들었어요.</p></div>
          <div class="step rv"><b>멘들스 상자 = 시험 포인트</b><p>분홍 리본 상자에 그 객실에서 시험에 나올 만한 것만 담았어요. 퀵 체크 2문제로 바로 확인.</p></div>
          <div class="step rv"><b>도장 찍고 열쇠 모으기</b><p>객실을 다 보면 도장을 찍어요. 층을 다 돌면 벚꽃이 떨어지고, 진행도는 이 브라우저에 저장돼요.</p></div>
        </div>
        <p class="kbd-hint" style="margin-top:1.4rem">객실에서는 <kbd>←</kbd> <kbd>→</kbd> 키로 옆 객실로 이동할 수 있어요</p>
      </div></section>
      <p class="foot">Grand Data Hotel · Data-Centric AI (Seoul National University, Min-hwan Oh) 강의 슬라이드 기반 정리 · 표의 수치는 ISLR 교재 값</p>`;
  };

  PAGES.floor = s => {
    const f = floorOf(s.floor);
    const fd = floorDone(f);
    return `<div class="wrap">
      <header class="lobby-head">
        <p class="eyebrow rv"><a href="#/" style="color:inherit;text-decoration:none">Front</a><span>›</span><span class="dot"></span>${f.n}F · ${esc(f.lecture)} · ${esc(f.sub)} · ${f.pages} slides</p>
        <h1 class="display rv">${f.n}F <em>${esc(f.title)}</em></h1>
        <p class="motto rv">${esc(f.en)}</p>
        <div class="lobby-meta rv"><span>${f.rooms.length} rooms</span><span>${fd} done</span><a href="#/points/${f.n}" style="color:var(--fuchsia)">→ ${f.n}F 족보 보기</a></div>
        <div class="concierge rv" style="margin-top:.6rem;max-width:720px"><div class="cat">${ART.cat}</div><div class="bubble"><span class="who">Concierge · 냥</span>${f.welcome}</div></div>
      </header>
      <div class="rooms">${f.rooms.map(r => {
        const done = !!P.done[r.id], q = P.quiz[r.id];
        return `<a class="key-tag rv ${done ? 'done' : ''}" href="#/room/${r.id}"><span class="perf"></span>
          <div class="kn"><span>Room ${r.code}</span><span class="hole"></span></div>
          <div><h3>${esc(r.title)}</h3><span class="en ken">${esc(r.en)}</span></div>
          <div class="km"><span>slides ${esc(r.slides)} · ${r.mins || 4} min</span>${q ? `<span class="${q.ok === q.n ? 'quizok' : ''}">quiz ${q.ok}/${q.n}</span>` : ''}</div>
          ${done ? '<span class="stamp">完</span>' : ''}</a>`;
      }).join('')}</div>
      <div class="room-pager" style="margin-top:2rem">
        ${f.n > 1 ? `<a class="btn" href="#/floor/${f.n - 1}">← ${f.n - 1}F</a>` : '<a class="btn" href="#/">← 프런트</a>'}
        ${f.n < H.floors.length ? `<a class="btn next" href="#/floor/${f.n + 1}">${f.n + 1}F →</a>` : '<a class="btn next" href="#/exam">모의고사 →</a>'}
      </div>
    </div>`;
  };

  PAGES.room = s => {
    const r = s.room, f = r.floor;
    const done = !!P.done[r.id];
    const quiz = (r.quiz || []).map((q, k) => quizHTML(q, k, r.id + ':' + k)).join('');
    const prev = r.prev, next = r.next;
    return `<div class="wrap"><article class="room">
      <header class="room-head">
        <div class="room-nav-top rv">
          <div class="crumbs"><a href="#/">Front</a><span>›</span><a href="#/floor/${f.n}">${f.n}F ${esc(f.title)}</a><span>›</span><span>Room ${r.code}</span></div>
          <div class="pager">${prev ? `<a class="btn ghost sm" href="#/room/${prev.id}" aria-label="이전 객실">←</a>` : ''}${next ? `<a class="btn ghost sm" href="#/room/${next.id}" aria-label="다음 객실">→</a>` : ''}</div>
        </div>
        <p class="eyebrow rv"><span class="dot"></span>Room ${r.code}<span>·</span>${esc(f.lecture)} slides ${esc(r.slides)}<span>·</span>약 ${r.mins || 4}분</p>
        <h1 class="h-room rv">${esc(r.title)}</h1>
        <p class="en rv">${esc(r.en)}</p>
      </header>
      <div class="concierge rv"><div class="cat">${ART.cat}</div><div class="bubble"><span class="who">Concierge · 냥</span>${r.guide}</div></div>
      ${r.easy ? `<div class="easy rv"><span class="lbl">쉽게 말하면 · Plain words</span>${r.easy}</div>` : ''}
      <div class="room-body rv">${r.body}</div>
      <aside class="mendl-box rv" aria-label="시험 포인트">${ART.bow.replace('<svg', '<svg class="bow"')}
        <h2>시험 포인트 <span class="chip">Mendl's box</span></h2>
        <ol>${(r.points || []).map(p => `<li>${p}</li>`).join('')}</ol>
        ${r.terms && r.terms.length ? `<div class="terms">${r.terms.map(t => `<span><b>${esc(t[0])}</b>${esc(t[1])}</span>`).join('')}</div>` : ''}
      </aside>
      ${quiz ? `<section class="quiz rv" data-room="${r.id}"><div class="quiz-head"><h2>퀵 체크 <span class="chip mint">${(r.quiz || []).length}문제</span></h2><span class="score" id="qscore">${P.quiz[r.id] ? `지난 기록 ${P.quiz[r.id].ok}/${P.quiz[r.id].n}` : '아직 풀지 않았어요'}</span></div>${quiz}</section>` : ''}
      <footer class="room-foot rv">
        <div class="done-row">
          <div class="stamp-slot">${done ? '<span class="stamp">完</span>' : 'stamp'}</div>
          <div class="txt"><b>${done ? '이 객실은 다 보셨어요' : '다 보셨나요? 도장을 찍어 열쇠를 받으세요'}</b><small>${done ? '도장을 다시 누르면 취소할 수 있어요.' : '한 번 더 보고 싶으면 언제든 돌아와도 괜찮아요.'}</small></div>
          <button class="btn ${done ? 'ghost' : 'pink'}" id="btn-done" type="button">${done ? '도장 취소' : '도장 찍기 完'}</button>
        </div>
        <div class="room-pager">
          ${prev ? `<a class="btn" href="#/room/${prev.id}"><span>← <small>Room ${prev.code}</small>${esc(prev.title)}</span></a>` : `<a class="btn" href="#/floor/${f.n}">← ${f.n}F 로비</a>`}
          ${next ? `<a class="btn hi next" href="#/room/${next.id}"><span><small>Room ${next.code}${next.floor !== f ? ' · ' + next.floor.n + 'F로 이동' : ''}</small>${esc(next.title)} →</span></a>` : `<a class="btn hi next" href="#/exam">모의고사 보러 가기 →</a>`}
        </div>
        <p class="kbd-hint"><kbd>←</kbd> <kbd>→</kbd> 옆 객실 · <a href="#/points/${f.n}">${f.n}F 족보</a></p>
      </footer>
    </article></div>`;
  };

  function quizHTML(q, k, key) {
    const opts = q.ox ? ['O (맞다)', 'X (틀리다)'] : q.c;
    const letters = q.ox ? ['O', 'X'] : ['A', 'B', 'C', 'D', 'E'];
    return `<div class="q" data-key="${esc(key)}" data-a="${q.ox ? (q.a ? 0 : 1) : q.a}">
      <div class="qn">Quick check ${k + 1}</div><div class="qt">${q.q}</div>
      <div class="opts">${opts.map((o, i) => `<button class="q-opt" type="button" data-i="${i}" data-k="${letters[i]}">${o}</button>`).join('')}</div>
      <div class="why"><b>해설.</b> ${q.why || ''}</div></div>`;
  }

  PAGES.points = s => {
    const f = floorOf(s.floor);
    return `<div class="wrap"><div class="points-page">
      <header class="lobby-head" style="padding-bottom:0">
        <p class="eyebrow rv"><a href="#/" style="color:inherit;text-decoration:none">Front</a><span>›</span><a href="#/floor/${f.n}" style="color:inherit;text-decoration:none">${f.n}F</a><span>›</span><span class="dot"></span>Exam points</p>
        <h1 class="display rv" style="font-size:clamp(2rem,5vw,3.4rem)">${f.n}F 족보 <em>${esc(f.title)}</em></h1>
        <p class="lede rv">객실마다 시험에 나올 만한 것만 모았어요. 외운 항목은 체크해서 지워 나가세요. 체크는 이 브라우저에 저장됩니다.</p>
        <div class="lobby-meta rv">${H.floors.map(x => `<a href="#/points/${x.n}" style="color:${x.n === f.n ? 'var(--fuchsia)' : 'inherit'};text-decoration:none">${x.n}F</a>`).join('')}<a href="#/cards/${f.n}" style="color:var(--fuchsia)">→ ${f.n}F 플래시카드</a></div>
      </header>
      ${f.rooms.map(r => `<section class="pt-room rv">
        <div class="pt-h"><a href="#/room/${r.id}">${r.code} · ${esc(r.title)}</a><span class="chip">slides ${esc(r.slides)}</span>${P.done[r.id] ? '<span class="chip mint">完</span>' : ''}</div>
        <div class="checks">${(r.points || []).map((p, k) => { const key = r.id + ':' + k; return `<label class="check"><input type="checkbox" data-check="${esc(key)}" ${P.checks[key] ? 'checked' : ''}><span>${p}</span></label>`; }).join('')}</div>
        ${r.formulas && r.formulas.length ? `<div class="pt-formulas">${r.formulas.map(x => `<div>$$${x}$$</div>`).join('')}</div>` : ''}
      </section>`).join('')}
      ${(() => { const terms = f.rooms.flatMap(r => r.terms || []); return terms.length ? `<section class="pt-room rv"><div class="pt-h"><span style="font-family:var(--f-head);font-weight:700;font-size:1.12rem">${f.n}F 용어 사전 <span class="chip">English ↔ 한국어</span></span></div><div class="tbl-wrap"><table class="tbl terms-tbl">${terms.map(t => `<tr><td>${esc(t[0])}</td><td>${esc(t[1])}</td></tr>`).join('')}</table></div></section>` : ''; })()}
      <div class="room-pager rv">${f.n > 1 ? `<a class="btn" href="#/points/${f.n - 1}">← ${f.n - 1}F 족보</a>` : '<a class="btn" href="#/">← 프런트</a>'}${f.n < H.floors.length ? `<a class="btn hi next" href="#/points/${f.n + 1}">${f.n + 1}F 족보 →</a>` : '<a class="btn hi next" href="#/exam">모의고사 →</a>'}</div>
    </div></div>`;
  };

  PAGES.cards = s => `<div class="wrap"><div class="cards-page">
      <header class="lobby-head" style="padding-bottom:0">
        <p class="eyebrow rv"><a href="#/" style="color:inherit;text-decoration:none">Front</a><span>›</span><span class="dot"></span>Flashcards</p>
        <h1 class="display rv" style="font-size:clamp(2rem,5vw,3.4rem)">플래시 <em>카드</em></h1>
        <p class="lede rv">카드를 눌러 뒤집어요. "알아요"는 치우고 "다시"는 뒤로 보내요. 남은 카드가 0이 되면 끝!</p>
      </header>
      <div class="viz rv" style="padding:.8rem 1rem"><div class="tabs" id="card-tabs"><button data-f="all" class="${s.floor ? '' : 'on'}">전체</button>${H.floors.map(f => `<button data-f="${f.n}" class="${s.floor === f.n ? 'on' : ''}">${f.n}F</button>`).join('')}</div>
        <div class="card-meta"><span id="card-count"></span><button class="vizbtn lo" id="card-shuffle" type="button">섞기</button></div></div>
      <div class="card-stage rv" id="card-stage"></div>
      <div class="card-ctrl rv"><button class="btn" id="card-again" type="button">다시 볼래요</button><button class="btn mint" id="card-know" type="button">알아요 ✓</button></div>
      <p class="kbd-hint rv"><kbd>Space</kbd> 뒤집기 · <kbd>1</kbd> 다시 · <kbd>2</kbd> 알아요</p>
    </div></div>`;

  PAGES.exam = () => `<div class="wrap"><div class="exam-page" id="exam">
      <header class="lobby-head" style="padding-bottom:0">
        <p class="eyebrow rv"><a href="#/" style="color:inherit;text-decoration:none">Front</a><span>›</span><span class="dot"></span>Mock exam</p>
        <h1 class="display rv" style="font-size:clamp(2rem,5vw,3.4rem)">모의 <em>고사</em></h1>
        <p class="lede rv">네 층에서 5문제씩, 총 20문제. 한 문제씩 넘기며 풀고, 끝나면 층별 점수와 틀린 객실을 알려 드려요.</p>
      </header>
      <div id="exam-body" class="rv"></div>
    </div></div>`;

  /* ---------- 바인딩 ---------- */
  function bind(sec, s) {
    if (s.kind === 'room') bindRoom(sec, s.room);
    if (s.kind === 'points') $$('input[data-check]', sec).forEach(c => c.addEventListener('change', () => { if (c.checked) P.checks[c.dataset.check] = 1; else delete P.checks[c.dataset.check]; save(); }));
    if (s.kind === 'cards') bindCards(sec, s);
    if (s.kind === 'exam') bindExam(sec);
    if (s.kind === 'home') { $$('a[data-goto]', document).forEach(a => a.addEventListener('click', e => { if (location.hash === '#/' || location.hash === '') { e.preventDefault(); const t = $('#' + a.dataset.goto); if (t) t.scrollIntoView({ behavior: 'smooth' }); } })); }
  }

  function bindRoom(sec, r) {
    P.last = r.id; save();
    // 퀴즈
    const qs = $$('.q', sec);
    qs.forEach(q => {
      $$('.q-opt', q).forEach(b => b.addEventListener('click', () => {
        if (q.classList.contains('done')) return;
        const a = Number(q.dataset.a), i = Number(b.dataset.i);
        q.classList.add('done');
        $$('.q-opt', q).forEach(o => { if (Number(o.dataset.i) === a) o.classList.add('ok'); else if (o === b && i !== a) o.classList.add('bad'); });
        q.dataset.ok = i === a ? '1' : '0';
        const v = document.createElement('span'); v.className = 'verdict ' + (i === a ? 'ok' : 'bad'); v.textContent = i === a ? '정답!' : '아쉬워요'; q.appendChild(v);
        const doneQ = qs.filter(x => x.classList.contains('done'));
        if (doneQ.length === qs.length) {
          const ok = qs.filter(x => x.dataset.ok === '1').length;
          P.quiz[r.id] = { n: qs.length, ok }; save();
          const sc = $('#qscore', sec); if (sc) sc.textContent = `이번 결과 ${ok}/${qs.length}`;
          if (ok === qs.length) toast('퀵 체크 만점! ' + ART.sakura.replace('<svg', '<svg style="width:16px;height:16px;vertical-align:-3px"'));
        }
      }));
    });
    // 도장
    const btn = $('#btn-done', sec);
    btn.addEventListener('click', () => {
      const slot = $('.stamp-slot', sec), txt = $('.txt', sec);
      if (P.done[r.id]) {
        delete P.done[r.id]; save(); slot.innerHTML = 'stamp'; btn.textContent = '도장 찍기 完'; btn.className = 'btn pink';
        txt.innerHTML = '<b>다 보셨나요? 도장을 찍어 열쇠를 받으세요</b><small>한 번 더 보고 싶으면 언제든 돌아와도 괜찮아요.</small>';
      } else {
        P.done[r.id] = Date.now(); save();
        slot.innerHTML = '<span class="stamp pop">完</span>'; btn.textContent = '도장 취소'; btn.className = 'btn ghost';
        txt.innerHTML = '<b>열쇠 하나 획득!</b><small>' + (r.next ? '다음 객실 ' + esc(r.next.code) + '로 가 볼까요?' : '마지막 객실이었어요. 모의고사로!') + '</small>';
        const f = r.floor;
        if (floorComplete(f)) { petals(70); toast(`${f.n}F 전 객실 완료! 벚꽃이 떨어집니다 🌸`); }
        else { petals(22); toast(`Room ${r.code} 완료 · 열쇠 ${doneCount()}/${totalRooms()}`); }
      }
      refreshNavProgress();
    });
    // 키보드
    const onKey = e => {
      if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (e.key === 'ArrowRight' && r.next) location.hash = '#/room/' + r.next.id;
      if (e.key === 'ArrowLeft' && r.prev) location.hash = '#/room/' + r.prev.id;
    };
    document.addEventListener('keydown', onKey);
    keyHandlers.push(onKey);
  }
  const keyHandlers = [];
  function clearKeys() { while (keyHandlers.length) document.removeEventListener('keydown', keyHandlers.pop()); }

  /* ---------- 플래시카드 ---------- */
  function bindCards(sec, s) {
    let filter = s.floor ? String(s.floor) : 'all';
    let deck = [], pos = 0, flipped = false, again = 0, known = 0;
    const stage = $('#card-stage', sec), count = $('#card-count', sec);
    function build() {
      const all = H.cards.filter(c => filter === 'all' || String(c.f) === filter);
      deck = all.slice(); shuffle(deck); pos = 0; again = 0; known = 0; flipped = false; render();
    }
    function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } }
    function render() {
      if (!deck.length) { stage.innerHTML = `<div class="fcard"><div class="face front"><span class="lbl">Done</span><div class="body">이 묶음의 카드를 모두 "알아요"로 치웠어요 🌸<br><span class="small muted" style="font-family:var(--f-body)">섞기를 누르면 처음부터 다시 시작해요.</span></div><span class="hint"></span></div></div>`; count.textContent = `남은 카드 0 · 알아요 ${known}`; return; }
      const c = deck[pos % deck.length];
      stage.innerHTML = `<div class="fcard card-page-ani ${flipped ? 'flip' : ''}" id="fcard" tabindex="0" role="button" aria-label="카드 뒤집기">
        <div class="face front"><span class="lbl">${c.f}F · ${esc(c.tag || 'Term')}</span><div class="body">${c.q}</div><span class="hint">누르면 뒤집혀요</span></div>
        <div class="face back"><span class="lbl">Answer</span><div class="body">${c.a}</div><span class="hint">알아요 / 다시 볼래요</span></div></div>`;
      renderMath(stage);
      const el = $('#fcard', stage);
      el.addEventListener('click', () => { flipped = !flipped; el.classList.toggle('flip', flipped); });
      count.textContent = `남은 카드 ${deck.length} · 알아요 ${known} · 다시 ${again}`;
    }
    function know() { if (!deck.length) return; deck.splice(pos % deck.length, 1); known++; flipped = false; if (deck.length) pos = pos % deck.length; render(); }
    function later() { if (!deck.length) return; const c = deck.splice(pos % deck.length, 1)[0]; deck.push(c); again++; flipped = false; pos = pos % deck.length; render(); }
    $('#card-know', sec).addEventListener('click', know);
    $('#card-again', sec).addEventListener('click', later);
    $('#card-shuffle', sec).addEventListener('click', build);
    $$('#card-tabs button', sec).forEach(b => b.addEventListener('click', () => { $$('#card-tabs button', sec).forEach(x => x.classList.remove('on')); b.classList.add('on'); filter = b.dataset.f; build(); }));
    const onKey = e => {
      if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (e.key === ' ') { e.preventDefault(); const el = $('#fcard', stage); if (el) { flipped = !flipped; el.classList.toggle('flip', flipped); } }
      if (e.key === '1') later(); if (e.key === '2') know();
    };
    document.addEventListener('keydown', onKey); keyHandlers.push(onKey);
    build();
  }

  /* ---------- 모의고사 ---------- */
  function examPool() {
    const pool = [];
    H.floors.forEach(f => f.rooms.forEach(r => (r.quiz || []).forEach(q => pool.push(Object.assign({ f: f.n, room: r }, q)))));
    H.examExtra.forEach(q => { const r = IDX.rooms[q.room]; if (r) pool.push(Object.assign({ f: r.floor.n, room: r }, q)); });
    return pool;
  }
  function pick(pool, perFloor) {
    const out = [];
    H.floors.forEach(f => {
      const c = pool.filter(q => q.f === f.n); for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; }
      // 객실이 겹치지 않게 우선 뽑기
      const seen = new Set(); const first = [], rest = [];
      c.forEach(q => { if (!seen.has(q.room.id)) { seen.add(q.room.id); first.push(q); } else rest.push(q); });
      out.push(...first.concat(rest).slice(0, perFloor));
    });
    return out;
  }
  function bindExam(sec) {
    const body = $('#exam-body', sec);
    const pool = examPool();
    let qs = [], k = 0, answers = [];
    function start() {
      qs = pick(pool, 5); k = 0; answers = [];
      showQ();
    }
    function intro() {
      const last = P.exams[P.exams.length - 1];
      body.innerHTML = `<div class="big-score"><span class="eyebrow" style="justify-content:center">Ready?</span><div class="v">20<small>questions</small></div>
        <p class="muted">문제 은행 ${pool.length}문제 중에서 층별로 5문제씩 무작위로 뽑아요.${last ? ` 최근 기록 ${last.score}/20 (${new Date(last.at).toLocaleDateString('ko-KR')})` : ''}</p>
        <div class="card-ctrl" style="margin-top:.8rem"><button class="btn pink" id="exam-start" type="button">시작하기</button></div></div>
        ${P.exams.length ? `<div class="pt-room" style="margin-top:1rem"><div class="pt-h"><span style="font-family:var(--f-head);font-weight:700">지난 기록</span></div><div class="tbl-wrap"><table class="tbl"><tr><th>날짜</th><th class="num">점수</th>${H.floors.map(f => `<th class="num">${f.n}F</th>`).join('')}</tr>${P.exams.slice(-6).reverse().map(e => `<tr><td>${new Date(e.at).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' })}</td><td class="num">${e.score}/20</td>${H.floors.map(f => `<td class="num">${(e.by && e.by[f.n]) || 0}/5</td>`).join('')}</tr>`).join('')}</table></div></div>` : ''}`;
      $('#exam-start', body).addEventListener('click', start);
    }
    function showQ() {
      const q = qs[k]; const letters = q.ox ? ['O', 'X'] : ['A', 'B', 'C', 'D', 'E']; const opts = q.ox ? ['O (맞다)', 'X (틀리다)'] : q.c;
      body.innerHTML = `<div class="exam-bar"><span>Q ${k + 1} / ${qs.length}</span><div class="bar"><i style="width:${(k / qs.length) * 100}%"></i></div><span>${q.f}F</span></div>
        <div class="q exam-q" style="margin-top:1rem"><div class="qn">Question ${k + 1} · ${esc(q.room.code)} 관련</div><div class="qt">${q.q}</div>
        <div class="opts">${opts.map((o, i) => `<button class="q-opt" type="button" data-i="${i}" data-k="${letters[i]}">${o}</button>`).join('')}</div>
        <div class="why"><b>해설.</b> ${q.why || ''}</div></div>
        <div class="card-ctrl" style="justify-content:flex-end;margin-top:1rem"><button class="btn hi" id="exam-next" type="button" disabled>${k + 1 < qs.length ? '다음 문제 →' : '결과 보기'}</button></div>`;
      renderMath(body);
      const qel = $('.q', body); const a = q.ox ? (q.a ? 0 : 1) : q.a;
      $$('.q-opt', qel).forEach(b => b.addEventListener('click', () => {
        if (qel.classList.contains('done')) return;
        const i = Number(b.dataset.i); qel.classList.add('done');
        $$('.q-opt', qel).forEach(o => { if (Number(o.dataset.i) === a) o.classList.add('ok'); else if (o === b && i !== a) o.classList.add('bad'); });
        const v = document.createElement('span'); v.className = 'verdict ' + (i === a ? 'ok' : 'bad'); v.textContent = i === a ? '정답!' : '아쉬워요'; qel.appendChild(v);
        answers.push({ q, ok: i === a }); $('#exam-next', body).disabled = false; $('#exam-next', body).focus();
      }));
      $('#exam-next', body).addEventListener('click', () => { k++; if (k < qs.length) showQ(); else finish(); });
    }
    function finish() {
      const score = answers.filter(a => a.ok).length; const by = {};
      H.floors.forEach(f => by[f.n] = answers.filter(a => a.ok && a.q.f === f.n).length);
      P.exams.push({ at: Date.now(), score, by }); save();
      if (score >= 16) petals(60);
      const wrong = answers.filter(a => !a.ok);
      body.innerHTML = `<div class="big-score"><span class="eyebrow" style="justify-content:center">Result</span><div class="v">${score}<small>/ 20</small></div><p class="muted">${score === 20 ? '만점! 合格祈願이 통했네요 🌸' : score >= 16 ? '아주 좋아요. 틀린 객실만 다시 들르면 완벽해요.' : score >= 10 ? '절반은 넘겼어요. 아래 객실들을 다시 한 번 돌아보세요.' : '괜찮아요. 족보부터 차근차근 다시 봐요. 냥이 같이 갈게요.'}</p></div>
        <div class="result-grid">${H.floors.map(f => `<div class="result-tile"><span class="t">${f.n}F ${esc(f.title)}</span><span class="v">${by[f.n]}<small>/5</small></span></div>`).join('')}</div>
        ${wrong.length ? `<h2 class="h-sec" style="font-size:1.25rem;margin-top:.5rem">다시 볼 객실</h2><div class="review-list">${wrong.map(a => `<div class="review-item"><div>${a.q.q}</div><a href="#/room/${a.q.room.id}">→ Room ${a.q.room.code} ${esc(a.q.room.title)}</a></div>`).join('')}</div>` : ''}
        <div class="card-ctrl" style="margin-top:.6rem"><button class="btn pink" id="exam-again" type="button">한 번 더</button><a class="btn" href="#/">프런트로</a></div>`;
      renderMath(body);
      $('#exam-again', body).addEventListener('click', start);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    intro();
  }

  /* ---------- 시작 ---------- */
  function boot() {
    buildIndex();
    renderNav();
    window.addEventListener('hashchange', () => { clearKeys(); go(); });
    go();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
