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
  function blank() { return { done: {}, quiz: {}, exams: [], checks: {}, cards: {}, last: null, coins: 0, earned: {}, owned: {}, look: {}, visit: null, drill: {}, real: [] }; }
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

  /* ---------- 냥 지갑 · 보상 · 업적 ---------- */
  const N = window.NYAN;
  const REWARD = { room: 20, quizQ: 5, floor: 50, check: 2, deck: 15, examQ: 2, examPass: 20, examPerDay: 3 };
  const dayKey = t => { const d = new Date(t || Date.now()); return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); };
  // once: 키마다 한 번만 지급(0이어도 기록) · max: 지금까지 받은 것보다 많을 때 차액만 지급
  function grant(key, amt, mode) {
    const prev = P.earned[key];
    if (mode === 'max') { const p = prev || 0; if (amt <= p) return 0; P.earned[key] = amt; P.coins += amt - p; return amt - p; }
    if (prev != null) return 0;
    P.earned[key] = amt; P.coins += amt; return amt;
  }
  const bestExam = () => P.exams.reduce((m, e) => Math.max(m, e.score || 0), 0);
  const pointKeys = () => H.floors.flatMap(f => f.rooms.flatMap(r => (r.points || []).map((p, k) => r.id + ':' + k)));
  const ACHP = {
    keys: () => [doneCount(), totalRooms()],
    crown: () => [bestExam(), 20],
    pass: () => [Math.min(bestExam(), 16), 16],
    points: () => { const ks = pointKeys(); return [ks.filter(k => P.checks[k]).length, ks.length]; },
    streak: () => [Math.min((P.visit && P.visit.best) || 0, 7), 7],
    quizall: () => { const ids = IDX.order.filter(id => (IDX.rooms[id].quiz || []).length); return [ids.filter(id => P.quiz[id] && P.quiz[id].ok === P.quiz[id].n).length, ids.length]; },
    mock90: () => [Math.min(P.real.reduce((m, e) => Math.max(m, e.total || 0), 0), 90), 90]
  };
  const achDone = a => { const p = ACHP[a](); return p[0] >= p[1]; };
  const owns = it => !!it && (it.ach ? achDone(it.ach) : (!it.price || !!P.owned[it.id]));
  function look() { const L = N.norm(P.look); Object.keys(L).forEach(s => { if (!owns(N.BY[L[s]])) L[s] = N.DEFAULT[s]; }); return L; }
  const catArt = () => N.render(look(), { label: '컨시어지 고양이 냥' });
  const ghostStamp = () => `<span class="ghost-stamp" aria-hidden="true">${N.stamp(look().stamp)}</span>`;
  function stampHTML(cls, pop) {
    const dots = pop && !reduced ? `<span class="ink-dots">${[0, 60, 120, 180, 240, 300].map(a => `<i style="--a:${a + 15}deg"></i>`).join('')}</span>` : '';
    return `<span class="stamp ${cls || ''} ${pop ? 'pop' : ''}">${N.stamp(look().stamp)}${dots}</span>`;
  }
  function checkAch() {
    Object.keys(N.ACH).forEach(a => {
      if (P.earned['ach:' + a] != null || !achDone(a)) return;
      P.earned['ach:' + a] = 0;
      const it = N.ITEMS.find(i => i.ach === a);
      toast(`업적 달성 · ${esc(N.ACH[a].name)}! <b>${esc(it.name)}</b> 해금 → 부티크`);
    });
    save();
  }
  function refreshWallet() { $$('[data-coins]').forEach(e => { e.textContent = P.coins; }); }
  function coinFx(n, anchor) {
    refreshWallet();
    if (!n) return;
    const pill = $('.nav-coin');
    if (pill) { pill.classList.remove('bump'); void pill.offsetWidth; pill.classList.add('bump'); }
    if (reduced) return;
    const r = (anchor || pill || document.body).getBoundingClientRect();
    const el = document.createElement('div'); el.className = 'coin-fx'; el.innerHTML = ART.coin + '<b>+' + n + '</b>냥';
    el.style.left = Math.max(40, Math.min(innerWidth - 40, r.left + r.width / 2)) + 'px';
    el.style.top = Math.max(30, r.top + Math.min(r.height / 2, 24)) + 'px';
    document.body.appendChild(el); setTimeout(() => el.remove(), 1400);
  }
  // 기능이 생기기 전의 공부 기록도 냥으로 쳐 준다
  function syncPast() {
    let got = 0;
    IDX.order.forEach(id => {
      if (P.done[id]) got += grant('room:' + id, REWARD.room);
      const q = P.quiz[id]; if (q) got += grant('quiz:' + id, q.ok * REWARD.quizQ, 'max');
    });
    H.floors.forEach(f => { if (floorComplete(f)) got += grant('floor:' + f.n, REWARD.floor); });
    Object.keys(P.checks).forEach(k => { got += grant('check:' + k, REWARD.check); });
    P.exams.forEach(e => { got += grant('exam:' + e.at, (e.score || 0) * REWARD.examQ + (e.score >= 16 ? REWARD.examPass : 0)); });
    return got;
  }
  function checkIn() {
    const today = dayKey(), v = P.visit;
    if (v && v.day === today) return null;
    const streak = v && v.day === dayKey(Date.now() - 864e5) ? v.streak + 1 : 1;
    P.visit = { day: today, streak, best: Math.max(streak, (v && v.best) || 0) };
    return { amt: grant('day:' + today, Math.min(5 + streak - 1, 12)), streak };
  }
  const CAT_LINES = ['냥!', '오늘도 한 객실만 해 봐요.', '도장 하나에 20냥이에요.', '퀵 체크 정답은 5냥!', '부티크 구경 갈래요?', '편향-분산, 기억나죠?', '쉬엄쉬엄 해도 괜찮아요.', 'A+ 가 보자!'];
  function catHop(el) {
    if (reduced || !el) return;
    el.classList.remove('hop'); void el.offsetWidth; el.classList.add('hop');
    el.addEventListener('animationend', () => el.classList.remove('hop'), { once: true });
    const r = el.getBoundingClientRect();
    const say = document.createElement('div'); say.className = 'cat-say'; say.textContent = CAT_LINES[Math.floor(Math.random() * CAT_LINES.length)];
    say.style.left = (r.left + r.width / 2) + 'px'; say.style.top = r.top + 'px';
    document.body.appendChild(say); setTimeout(() => say.remove(), 1700);
  }

  /* ---------- 공용 아트 ---------- */
  const ART = {
    key: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="11" cy="11" r="8" fill="none" stroke="#D9A64B" stroke-width="3"/><circle cx="11" cy="11" r="2.6" fill="#D9A64B"/><path d="M16.5 16.5 L28 28 M23 23 L26 20 M20 20 L23 17" stroke="#D9A64B" stroke-width="3" stroke-linecap="round" fill="none"/></svg>`,
    coin: `<svg class="coin-ico" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="12" rx="8.6" ry="10.6" fill="#E8C15A" stroke="#B8862E" stroke-width="1.3"/><ellipse cx="12" cy="12" rx="6" ry="8" fill="none" stroke="#F6DF95" stroke-width="1"/><g fill="#B8862E"><ellipse cx="12" cy="14.2" rx="2.7" ry="2.2"/><circle cx="9.3" cy="11" r="1.05"/><circle cx="11" cy="9.5" r="1.05"/><circle cx="13" cy="9.5" r="1.05"/><circle cx="14.7" cy="11" r="1.05"/></g></svg>`,
    mic: `<svg class="mic" viewBox="0 0 24 24" aria-hidden="true"><rect x="8.5" y="3" width="7" height="11" rx="3.5" fill="#D6487D"/><path d="M6 11a6 6 0 0 0 12 0" stroke="#47203A" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M12 17v3.5M9 20.5h6" stroke="#47203A" stroke-width="1.6" stroke-linecap="round"/><path d="M10.3 6.2h3.4M10.3 8.6h3.4" stroke="#FBDDE6" stroke-width="1" stroke-linecap="round"/></svg>`,
    lock: `<svg class="lock-ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor"/><path d="M8 10.5 V8 a4 4 0 0 1 8 0 v2.5" stroke="currentColor" stroke-width="2.2" fill="none"/></svg>`,
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
        <div class="nav-right"><a class="nav-coin" href="#/boutique" aria-label="보유한 냥, 냥의 옷장으로">${ART.coin}<b data-coins>${P.coins}</b></a><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-panel"><span class="lbl">Menu</span><span class="ico"><i></i><i></i></span></button></div>
      </div>
      <div class="nav-panel" id="nav-panel"><div><div class="nav-panel-in">
        <div class="nav-prog"><div class="omamori" aria-hidden="true"><span class="str"></span><span class="body"></span></div>
          <div style="flex:1;display:grid;gap:.35rem"><div class="lbl">열쇠 <b>${d}</b> / ${t}개 수집 · <b>${pct}%</b></div><div class="bar"><i style="width:${pct}%"></i></div></div></div>
        <div><div class="nav-sec-t">Floors · 층 안내</div>
          ${H.floors.map(f => `<a class="nav-floor" href="#/floor/${f.n}"><span class="fn">${f.n}F</span><span class="ft">${esc(f.title)}<small>${esc(f.lecture)}</small></span><span class="fp">${floorDone(f)}/${f.rooms.length}</span></a>`).join('')}
        </div>
        <div><div class="nav-sec-t">Exam desk · 시험 대비</div>
          <div class="nav-links">${H.floors.map(f => `<a href="#/points/${f.n}">${f.n}F 족보</a>`).join('')}<a href="#/cards">플래시카드</a><a href="#/exam">모의고사</a><a href="#/guide">시험 안내</a><a href="#/boutique">냥의 옷장</a><a href="#/" data-goto="guide">이용 안내</a></div>
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
    if (p[0] === 'exam') return { kind: 'exam', mode: p[1] === 'real' || p[1] === 'quick' ? p[1] : null };
    if (p[0] === 'guide') return { kind: 'guide' };
    if (p[0] === 'boutique') return { kind: 'boutique', tab: p[1] };
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
    if (s.kind === 'exam') return s.mode === 'real' ? '실전형 모의고사' : s.mode === 'quick' ? '빠른 모의고사' : '모의고사';
    if (s.kind === 'guide') return '시험 안내';
    if (s.kind === 'boutique') return '냥의 옷장';
    return '프런트';
  }

  /* ---------- 페이지 ---------- */
  const PAGES = {};

  PAGES.home = () => {
    const d = doneCount(), t = totalRooms(), nr = nextRoom();
    let hello;
    if (d === 0) hello = '어서 오세요! 저는 이 호텔의 컨시어지 <b>냥</b>이에요. 1층부터 한 객실씩 천천히 둘러보시면 돼요. 한 객실엔 개념 하나만 있으니 부담 갖지 마세요.';
    else if (d < t) hello = `다시 오셨네요! 지금까지 열쇠를 <b>${d}개</b>모으셨어요. 다음 객실은 <b>${esc(nr.code)} ${esc(nr.title)}</b>이에요. 오늘도 한 객실만 보고 가셔도 충분해요.`;
    else hello = '와, 모든 객실을 다 도셨어요! 이제 족보와 플래시카드로 복습하고, 모의고사로 마무리해 볼까요? A+ 가 보자!';
    const shop = N.ITEMS.filter(it => it.price && !owns(it)).sort((a, b) => a.price - b.price);
    const canBuy = shop.filter(it => it.price <= P.coins).length;
    if (canBuy && d) hello += ` <a class="bubble-link" href="#/boutique">지금 가진 ${P.coins}냥이면 부티크에서 새 아이템을 살 수 있어요 →</a>`;
    const goal = canBuy ? `지금 살 수 있는 아이템 <b>${canBuy}개</b>` : shop.length ? `다음 목표 · ${esc(shop[0].name)} <b>${shop[0].price - P.coins}냥</b> 남음` : '모든 아이템을 모았어요!';
    return `
      <section class="hero"><div class="sprinkles" aria-hidden="true"><span class="cloud c1"></span><span class="cloud c2"></span><span class="cloud c3"></span><span class="star s1"></span><span class="star s2"></span><span class="star s3"></span><span class="star s4"></span></div><div class="wrap hero-in">
        <div class="hero-txt">
          <p class="eyebrow rv"><span class="dot"></span>Data-Centric AI · Lecture 1–4 · 시험 대비 스터디</p>
          <h1 class="display rv">Grand <em>Data</em><br>Hotel</h1>
          <p class="lede words">데이터가 모델을 만듭니다. 서론부터 로지스틱 회귀까지, 4개 층 ${t}개 객실. 한 객실에는 개념 하나만 두었어요.</p>
          <div class="cta rv"><a class="btn hi" href="#/room/${nr.id}">${d ? '이어서 공부하기' : '체크인 하기'} <span class="k">${esc(nr.code)}</span></a><a class="btn" href="#/floor/1">층 안내 보기</a></div>
          <div class="scroll-hint rv"><i></i>Scroll to discover</div>
        </div>
        <div class="hero-art rv"><div class="concierge big"><div class="cat" role="button" tabindex="0" aria-label="냥 쓰다듬기">${catArt()}</div><div class="bubble"><span class="who">Concierge · 냥</span>${hello}</div></div></div>
      </div></section>

      <section class="sec"><div class="wrap">
        <div class="sec-head rv"><div><p class="eyebrow">Floors · 층 안내</p><h2 class="h-sec">강의 하나가 한 층입니다</h2></div><p class="lede small">객실 문을 열면 개념 하나, 그림 하나, 시험 포인트, 퀵 체크가 기다려요. 다 보면 도장을 찍고 열쇠를 모아요.</p></div>
        <div class="floors">${H.floors.map((f, i) => {
          const fd = floorDone(f), pct = Math.round(fd / f.rooms.length * 100), tapes = ['', 'gold', 'lilac', 'rose'];
          return `<a class="floor-card rv" href="#/floor/${f.n}"><span class="ftab"></span>
            <div><div class="fnum">${f.n}<small>Floor</small></div></div>
            <div><h3>${esc(f.title)}</h3><span class="en fen">${esc(f.en)}</span><p class="fmeta" style="margin-top:.6rem">${esc(f.lecture)} · ${f.rooms.length} rooms</p></div>
            <div><div class="fmeta" style="margin-bottom:.35rem">${fd}/${f.rooms.length} 완료</div><div class="fbar"><i style="width:${pct}%"></i></div></div>
            ${floorComplete(f) ? stampHTML('fdone') : ''}</a>`;
        }).join('')}</div>
      </div></section>

      <section class="sec"><div class="wrap">
        <div class="sec-head rv"><div><p class="eyebrow">Exam desk · 시험 대비 데스크</p><h2 class="h-sec">시험 직전엔 이곳으로</h2></div></div>
        <div class="desk">
          <a class="desk-card rv" href="#/points/1"><span class="tape rose"></span><span class="ico">${ART.icoPoints}</span><h3>족보 · 시험 포인트 정리</h3><p>층마다 객실별 핵심 포인트와 공식만 모았어요. 체크박스로 외운 것을 지워 가세요.</p><span class="go">1F → 4F</span></a>
          <a class="desk-card rv" href="#/cards"><span class="tape lilac"></span><span class="ico">${ART.icoCards}</span><h3>플래시카드</h3><p>용어·정의·공식을 카드로 뒤집어 보며 확인해요. "다시"를 누른 카드만 다시 나와요.</p><span class="go">${H.cards.length} cards</span></a>
          <a class="desk-card rv" href="#/exam"><span class="tape"></span><span class="ico">${ART.icoExam}</span><h3>모의고사</h3><p>작년 형식 그대로의 <b>실전형(100점, 영어)</b>과 객관식 20문 <b>빠른 모의고사</b>. 틀린 문제는 해당 객실로 바로 연결돼요.</p><span class="go">${P.real.length ? '실전형 최고 ' + fmt(P.real.reduce((m, e) => Math.max(m, e.total || 0), 0)) + '점' : 'Real · Quick'}</span></a>
          <a class="desk-card rv" href="#/guide"><span class="tape gold"></span><span class="ico">${ART.mic}</span><h3>시험 안내 · 교수님 강조</h3><p>형식·배점·점수 전략, 그리고 녹음에서 교수님이 "시험"을 언급한 대목만 모았어요.</p><span class="go">Exam guide</span></a>
        </div>
      </div></section>

      <section class="sec"><div class="wrap">
        <div class="promo rv">
          <a class="promo-cat" href="#/boutique" aria-label="냥의 옷장으로">${catArt()}</a>
          <div class="promo-txt">
            <p class="eyebrow">Boutique · 냥의 옷장</p>
            <h2 class="h-sec">공부한 만큼 냥이 쌓여요</h2>
            <p>도장 하나에 20냥, 퀵 체크 정답 하나에 5냥, 층을 다 돌면 50냥. 모은 냥으로 컨시어지 냥에게 모자·옷·소품을 사 주세요. 고른 차림은 사이트 곳곳의 냥이 그대로 입고 나와요.</p>
            <div class="promo-meta"><span class="wallet-chip">${ART.coin}<b data-coins>${P.coins}</b>냥</span><span>${goal}</span></div>
            <div><a class="btn pink" href="#/boutique">부티크 구경하기</a></div>
          </div>
        </div>
      </div></section>

      <section class="sec" id="guide"><div class="wrap">
        <div class="sec-head rv"><div><p class="eyebrow">How to stay · 이용 안내</p><h2 class="h-sec">부담 없이 머무는 법</h2></div></div>
        <div class="steps">
          <div class="step rv"><b>객실 하나 = 개념 하나</b><p>한 페이지가 짧아요. 3–6분이면 한 객실을 다 봅니다. 긴 유도 과정은 접어 두었으니 필요할 때만 펼치세요.</p></div>
          <div class="step rv"><b>그림으로 먼저 이해</b><p>슬라이더를 움직이거나 버튼을 눌러 보세요. 공식이 왜 그런 모양인지 손으로 느끼도록 만들었어요.</p></div>
          <div class="step rv"><b>멘들스 상자 = 시험 포인트</b><p>분홍 리본 상자에 그 객실에서 시험에 나올 만한 것만 담았어요. 퀵 체크 2문제로 바로 확인.</p></div>
          <div class="step rv"><b>도장 찍고 냥 모으기</b><p>객실을 다 보면 도장을 찍어요. 도장·퀵 체크·족보 체크마다 냥이 쌓이고, 부티크에서 냥에게 옷을 사 줄 수 있어요. 진행도는 이 브라우저에 저장돼요.</p></div>
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
        <div class="concierge rv" style="margin-top:.6rem;max-width:720px"><div class="cat" role="button" tabindex="0" aria-label="냥 쓰다듬기">${catArt()}</div><div class="bubble"><span class="who">Concierge · 냥</span>${f.welcome}</div></div>
      </header>
      <div class="rooms">${f.rooms.map(r => {
        const done = !!P.done[r.id], q = P.quiz[r.id];
        return `<a class="key-tag rv ${done ? 'done' : ''}" href="#/room/${r.id}"><span class="perf"></span>
          <div class="kn"><span>Room ${r.code}</span><span class="hole"></span></div>
          <div><h3>${esc(r.title)}</h3><span class="en ken">${esc(r.en)}</span></div>
          <div class="km"><span>slides ${esc(r.slides)} · ${r.mins || 4} min</span>${q ? `<span class="${q.ok === q.n ? 'quizok' : ''}">quiz ${q.ok}/${q.n}</span>` : ''}</div>
          ${done ? stampHTML() : ''}</a>`;
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
      <div class="concierge rv"><div class="cat" role="button" tabindex="0" aria-label="냥 쓰다듬기">${catArt()}</div><div class="bubble"><span class="who">Concierge · 냥</span>${r.guide}</div></div>
      ${r.easy ? `<div class="easy rv"><span class="lbl">쉽게 말하면 · Plain words</span>${r.easy}</div>` : ''}
      <div class="room-body rv">${r.body}</div>
      ${lectureHTML(r)}
      <aside class="mendl-box rv" aria-label="시험 포인트">${ART.bow.replace('<svg', '<svg class="bow"')}
        <h2>시험 포인트 <span class="chip">Mendl's box</span></h2>
        <ol>${(r.points || []).map(p => `<li>${p}</li>`).join('')}</ol>
        ${r.terms && r.terms.length ? `<div class="terms">${r.terms.map(t => `<span><b>${esc(t[0])}</b>${esc(t[1])}</span>`).join('')}</div>` : ''}
      </aside>
      ${quiz ? `<section class="quiz rv" data-room="${r.id}"><div class="quiz-head"><h2>퀵 체크 <span class="chip mint">${(r.quiz || []).length}문제</span></h2><span class="score" id="qscore">${P.quiz[r.id] ? `지난 기록 ${P.quiz[r.id].ok}/${P.quiz[r.id].n}` : '아직 풀지 않았어요'}</span></div>${quiz}</section>` : ''}
      ${drillHTML(r)}
      <footer class="room-foot rv">
        <div class="done-row">
          <div class="stamp-slot">${done ? stampHTML() : ghostStamp()}</div>
          <div class="txt"><b>${done ? '이 객실은 다 보셨어요' : P.earned['room:' + r.id] == null ? '다 보셨나요? 도장을 찍고 열쇠와 ' + REWARD.room + '냥을 받으세요' : '다 보셨나요? 도장을 찍어 열쇠를 받으세요'}</b><small>${done ? '도장을 다시 누르면 취소할 수 있어요.' : '한 번 더 보고 싶으면 언제든 돌아와도 괜찮아요.'}</small></div>
          <button class="btn ${done ? 'ghost' : 'pink'}" id="btn-done" type="button">${done ? '도장 취소' : '도장 찍기'}</button>
        </div>
        <div class="room-pager">
          ${prev ? `<a class="btn" href="#/room/${prev.id}"><span>← <small>Room ${prev.code}</small>${esc(prev.title)}</span></a>` : `<a class="btn" href="#/floor/${f.n}">← ${f.n}F 로비</a>`}
          ${next ? `<a class="btn hi next" href="#/room/${next.id}"><span><small>Room ${next.code}${next.floor !== f ? ' · ' + next.floor.n + 'F로 이동' : ''}</small>${esc(next.title)} →</span></a>` : `<a class="btn hi next" href="#/exam">모의고사 보러 가기 →</a>`}
        </div>
        <p class="kbd-hint"><kbd>←</kbd> <kbd>→</kbd> 옆 객실 · <a href="#/points/${f.n}">${f.n}F 족보</a></p>
      </footer>
    </article></div>`;
  };

  /* 교수님 강의 노트 · 실전 연습(영어) */
  const LN_TAG = { exam: '시험 언급', key: '강조', trap: '함정 주의', story: '예시' };
  function lectureHTML(r) {
    const L = (H.lecture || {})[r.id];
    if (!L || !L.length) return '';
    return `<aside class="lecnote rv" aria-label="교수님 강의 노트"><div class="ln-head">${ART.mic}<div><h2>교수님 강의 노트 <span class="chip">In lecture</span></h2><p>슬라이드에는 없지만 수업에서 말씀하신 것들이에요. 앞의 시각은 녹음 기준.</p></div></div>
      <ul class="ln-list">${L.map(n => `<li class="ln ${n.tag || ''}"><div class="ln-meta"><span class="ln-at">${esc(n.at)}</span>${LN_TAG[n.tag] ? `<span class="ln-tag ${n.tag}">${LN_TAG[n.tag]}</span>` : ''}</div><div class="ln-body">${n.html}</div></li>`).join('')}</ul></aside>`;
  }
  const koHTML = q => q.ko ? `<button class="ko-btn" type="button" aria-expanded="false">해석</button>` : '';
  function drillItem(q, k) {
    const top = tag => `<div class="dq-top"><span class="dq-tag">${tag}</span>${koHTML(q)}</div><div class="qt en-q">${q.q}</div>${q.ko ? `<div class="ko" hidden>${esc(q.ko)}</div>` : ''}`;
    if (q.t === 'tf') return `<div class="q dq" data-t="tf" data-a="${q.a ? 1 : 0}" data-k="${k}">${top('True / False')}
      <div class="opts two"><button class="q-opt" type="button" data-i="1" data-k="T">True</button><button class="q-opt" type="button" data-i="0" data-k="F">False</button></div>
      <div class="why"><b>해설.</b> ${q.why || ''}</div></div>`;
    if (q.t === 'multi') return `<div class="q dq" data-t="multi" data-a="${q.a.join(',')}" data-k="${k}">${top('Select all that apply')}
      <div class="mopts">${q.c.map((o, i) => `<label class="mopt"><input type="checkbox" value="${i}"><span class="mk">${'ABCDEF'[i]}</span><span class="mt">${o}</span><em class="mv"></em></label>`).join('')}</div>
      <div class="dq-act"><button class="btn sm pink dq-check" type="button">채점하기</button><span class="dq-res"></span></div>
      <div class="why"><b>해설.</b> ${q.why || ''}</div></div>`;
    return `<div class="q dq" data-t="short" data-k="${k}">${top('Short answer')}
      <textarea class="ans" rows="4" placeholder="답을 써 보세요. 한국어로 써도 돼요. (15자 이상 쓰고 모범답안을 보면 5냥)"></textarea>
      <div class="dq-act"><button class="btn sm dq-show" type="button">모범답안 보기</button></div>
      <div class="model" hidden><div class="model-body">${q.model}</div><div class="rubric"><b>채점 포인트 · 내 답에 있었던 것에 체크</b>${(q.rubric || []).map(x => `<label><input type="checkbox"><span>${esc(x)}</span></label>`).join('')}</div></div></div>`;
  }
  function drillHTML(r) {
    const D = (H.drill || {})[r.id];
    if (!D || !D.length) return '';
    const rec = P.drill[r.id];
    return `<section class="drill rv" data-room="${r.id}"><div class="drill-head"><div><h2>실전 연습 <span class="chip gold">Exam drill · English</span></h2>
      <p>실제 시험처럼 영어로 나와요. 답안은 한국어로 써도 괜찮아요. <b>해석</b>을 누르면 우리말 뜻이 보여요.</p></div><span class="score" id="dscore">${rec ? `지난 기록 ${rec.ok}/${rec.n}` : `${D.length}문제`}</span></div>
      ${D.map((q, k) => drillItem(q, k)).join('')}</section>`;
  }

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
        <p class="lede rv">객실마다 시험에 나올 만한 것만 모았어요. 외운 항목은 체크해서 지워 나가세요. 항목을 처음 체크할 때마다 ${REWARD.check}냥이 쌓이고, 체크는 이 브라우저에 저장됩니다.</p>
        <div class="lobby-meta rv">${H.floors.map(x => `<a href="#/points/${x.n}" style="color:${x.n === f.n ? 'var(--fuchsia)' : 'inherit'};text-decoration:none">${x.n}F</a>`).join('')}<a href="#/cards/${f.n}" style="color:var(--fuchsia)">→ ${f.n}F 플래시카드</a></div>
      </header>
      ${f.rooms.map(r => `<section class="pt-room rv">
        <div class="pt-h"><a href="#/room/${r.id}">${r.code} · ${esc(r.title)}</a><span class="chip">slides ${esc(r.slides)}</span>${P.done[r.id] ? '<span class="chip mint">✓</span>' : ''}</div>
        <div class="checks">${(r.points || []).map((p, k) => { const key = r.id + ':' + k; return `<label class="check"><input type="checkbox" data-check="${esc(key)}" ${P.checks[key] ? 'checked' : ''}><span>${p}</span></label>`; }).join('')}</div>
        ${(() => { const L = ((H.lecture || {})[r.id] || []).filter(n => n.tag === 'exam' || n.tag === 'trap'); return L.length ? `<div class="pt-lec"><b>${ART.mic}수업에서 강조 · 함정</b><ul>${L.map(n => `<li><span class="ln-at">${esc(n.at)}</span> ${n.html}</li>`).join('')}</ul></div>` : ''; })()}
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

  PAGES.exam = s => {
    const crumb = s.mode ? `<a href="#/exam" style="color:inherit;text-decoration:none">Mock exam</a><span>›</span><span class="dot"></span>${s.mode === 'real' ? 'Real format' : 'Quick 20'}` : '<span class="dot"></span>Mock exam';
    const title = s.mode === 'real' ? '실전형 <em>모의고사</em>' : s.mode === 'quick' ? '빠른 <em>모의고사</em>' : '모의 <em>고사</em>';
    const lede = s.mode === 'real' ? '작년 중간고사와 같은 형식과 배점으로 100점 만점. 문제는 영어, 답은 한국어로 써도 돼요. 한 장짜리 시험지처럼 다 풀고 한 번에 제출해요.'
      : s.mode === 'quick' ? '네 층에서 5문제씩, 총 20문제. 한 문제씩 넘기며 풀고, 끝나면 층별 점수와 틀린 객실을 알려 드려요.'
      : '두 가지 모의고사가 있어요. 시험 형식에 익숙해지려면 실전형, 개념을 빠르게 훑으려면 빠른 모의고사.';
    const head = `<header class="lobby-head" style="padding-bottom:0">
        <p class="eyebrow rv"><a href="#/" style="color:inherit;text-decoration:none">Front</a><span>›</span>${crumb}</p>
        <h1 class="display rv" style="font-size:clamp(2rem,5vw,3.4rem)">${title}</h1>
        <p class="lede rv">${lede}</p></header>`;
    if (s.mode) return `<div class="wrap"><div class="exam-page ${s.mode}" id="exam">${head}<div id="exam-body" class="rv"></div></div></div>`;
    const bestReal = P.real.reduce((m, e) => Math.max(m, e.total || 0), 0), lastQ = P.exams[P.exams.length - 1];
    return `<div class="wrap"><div class="exam-page" id="exam">${head}
      <div class="mode-grid">
        <a class="mode-card real rv" href="#/exam/real"><span class="tape gold"></span><span class="mc-k">Real format · 100점</span><h2>실전형 모의고사</h2>
          <ul><li><b>Part I</b> True/False 10문 · 30점 (정답 3, 비우면 1, 오답 0)</li><li><b>Part II</b> 모두 고르시오 4문 · 40점</li><li><b>Part III</b> Short answer · 유연한 vs 경직된 방법 8문항 · 20점</li><li><b>Part IV</b> Long answer · 선형회귀와 가설검정 · 10점</li></ul>
          <span class="go">${bestReal ? `최고 ${Math.round(bestReal * 10) / 10}점` : '영어 문제 · 약 40분'} →</span></a>
        <a class="mode-card rv" href="#/exam/quick"><span class="tape"></span><span class="mc-k">Quick · 20문</span><h2>빠른 모의고사</h2>
          <ul><li>층마다 5문제씩 객관식 20문</li><li>한 문제씩 바로 채점, 틀린 객실로 연결</li><li>쉬는 시간에 가볍게 개념 점검</li></ul>
          <span class="go">${lastQ ? `최근 ${lastQ.score}/20` : '약 10분'} →</span></a>
      </div>
      <p class="kbd-hint rv" style="margin-top:1.2rem">시험 형식과 전략은 <a href="#/guide">시험 안내</a>에 정리했어요.</p>
    </div></div>`;
  };

  PAGES.guide = () => {
    const hl = [];
    IDX.order.forEach(id => ((H.lecture || {})[id] || []).forEach(n => { if (n.tag === 'exam') hl.push({ r: IDX.rooms[id], n }); }));
    const words = [['Select all that apply', '해당하는 것을 모두 고르시오'], ['Justify your answer', '근거를 들어 답하시오'], ['Briefly explain', '간단히 설명하시오'], ['Is (or are)', '하나일 수도 여러 개일 수도 있음'], ['flexible / inflexible', '유연한 / 경직된(덜 유연한) 방법'], ['better / worse than', '~보다 낫다 / 나쁘다'], ['holding the other predictors fixed', '다른 예측변수를 고정했을 때'], ['irreducible / reducible error', '줄일 수 없는 / 줄일 수 있는 오차'], ['unbiased', '불편(편향이 0인)'], ['proportion of variability explained', '설명된 변동의 비율 (R²)'], ['reject the null hypothesis', '귀무가설을 기각하다'], ['statistically significant', '통계적으로 유의한'], ['confidence interval', '신뢰구간'], ['overestimate / underestimate', '과대추정 / 과소추정'], ['increases monotonically', '단조 증가한다'], ['linearly separable', '선형으로 분리 가능한'], ['training / test error', '훈련 / 테스트 오차'], ['confounding', '교란']];
    const past = [
      [R_('(t/f) R² shows the proportion of total variability that can be explained by the fitted model.'), '2-8'],
      [R_('Which of the following is (or are) what you aim to minimize when fitting a model on data?'), '1-11'],
      [R_('Briefly explain why we have randomness in f̂(x₀).'), '1-12'],
      [R_('A data scientist interpreted that radio has a stronger linear relationship with sales than TV. Correct? Justify.'), '3-5'],
      [R_('Which methods can achieve zero training error on any linearly separable dataset?'), '4-6'],
      [R_('Ridge vs least squares bias-variance · Lasso as λ increases · decision tree T/F'), null]
    ];
    return `<div class="wrap"><div class="guide-page">
      <header class="lobby-head" style="padding-bottom:0">
        <p class="eyebrow rv"><a href="#/" style="color:inherit;text-decoration:none">Front</a><span>›</span><span class="dot"></span>Exam guide</p>
        <h1 class="display rv" style="font-size:clamp(2rem,5vw,3.4rem)">시험 <em>안내</em></h1>
        <p class="lede rv">25년 1학기 수강생 후기를 바탕으로 정리한 형식과 전략, 그리고 교수님이 수업에서 "시험"을 언급하거나 특히 강조한 것들이에요. 형식은 올해 달라질 수 있어요.</p>
      </header>
      <section class="g-sec rv"><h2 class="h-sec">형식과 배점 <span class="chip">작년 기준</span></h2>
        <div class="tbl-wrap"><table class="tbl g-tbl"><tr><th>파트</th><th class="num">배점</th><th>내용</th></tr>
          <tr><td>True / False</td><td class="num">30</td><td>문항당 정답 3점, <b>비우면 1점</b>, 오답 0점</td></tr>
          <tr class="hl"><td>모두 고르시오</td><td class="num">40</td><td>맞는 것을 <b>모두</b> 고르는 객관식. "빡세고, 대부분 여기서 감점"</td></tr>
          <tr><td>Short answer</td><td class="num">20</td><td>특정 상황에서 <b>flexible vs inflexible</b> 모델의 성능 비교</td></tr>
          <tr><td>Long answer</td><td class="num">10</td><td><b>선형회귀와 가설검정</b> 관련 서술</td></tr></table></div>
        <ul class="g-list"><li>문제는 <b>영어</b>, 답안은 <b>한국어로 써도 됨</b>. 코딩 문제는 없음.</li><li>수식 계산보다 <b>개념을 제대로 이해했는지, 직관</b>을 봄.</li><li>시험 직전에 작년 기출을 주고, 형식·유형이 같았다고 함.</li><li>교재 <b>ISLP</b>의 문제가 그대로 나온 적도 있음. 교수님 설명도 ISLP에 그대로 있으니 독학 가능.</li></ul>
        <p class="rv" style="margin-top:.8rem"><a class="btn pink" href="#/exam/real">이 형식 그대로 실전형 모의고사 보기 →</a></p>
      </section>
      <section class="g-sec rv"><h2 class="h-sec">점수 전략</h2>
        <div class="g-tips">
          <div class="step"><b>T/F는 웬만하면 답하기</b><p>맞힐 확률이 $p$면 답했을 때 기대 점수는 $3p$, 비우면 1점. $p > 1/3$이면 답하는 게 이득이에요. 반반이라도 답하세요.</p></div>
          <div class="step"><b>모두 고르시오 = T/F 여러 개</b><p>선택지를 하나씩 따로 참/거짓으로 판정하세요. "하나만 고르는 문제"처럼 풀면 여기서 다 깎여요. "is (or are)"는 정답이 여러 개일 수 있다는 신호.</p></div>
          <div class="step"><b>애매하면 옆에 적기</b><p>애매한 문제 옆에 내가 어떻게 해석했는지 자세히 적어 두면 조교님이 채점에 많이 참고한다고 해요.</p></div>
          <div class="step"><b>수업 힌트를 챙기기</b><p>교수님이 수업 중에 시험 힌트를 많이 준다고 해요. 각 객실의 <b>교수님 강의 노트</b>와 족보의 "수업에서 강조"를 보세요.</p></div>
        </div>
      </section>
      <section class="g-sec rv"><h2 class="h-sec">교수님이 "시험"을 언급하거나 강조한 것 <span class="chip">녹음 기준</span></h2>
        <ol class="g-hl">${hl.map(x => `<li><a href="#/room/${x.r.id}" class="g-room">${x.r.code} ${esc(x.r.title)}</a><span class="ln-at">${esc(x.n.at)}</span><div>${x.n.html}</div></li>`).join('')}</ol>
      </section>
      <section class="g-sec rv"><h2 class="h-sec">작년 기출 예시는 어디서 연습하나</h2>
        <ul class="g-past">${past.map(p => `<li><span class="en-q">${p[0]}</span>${p[1] ? `<a href="#/room/${p[1]}">→ Room ${IDX.rooms[p[1]].code} 실전 연습</a>` : '<em>릿지·라쏘·트리는 Lecture 4 이후 범위라 아직 강의 자료가 없어요. 강의가 추가되면 함께 넣을게요.</em>'}</li>`).join('')}</ul>
        <p class="small muted">ISLP 교재에서 풀어 볼 만한 곳: 2장 Conceptual 1–4 (1번이 flexible vs inflexible), 3장 Conceptual 1·3·4, 5장 Conceptual 3 (K-fold 설명과 장단점).</p>
      </section>
      <section class="g-sec rv"><h2 class="h-sec">시험지 영어 표현</h2>
        <div class="tbl-wrap"><table class="tbl terms-tbl">${words.map(w => `<tr><td>${esc(w[0])}</td><td>${esc(w[1])}</td></tr>`).join('')}</table></div>
      </section>
    </div></div>`;
  };
  function R_(s) { return esc(s); }

  PAGES.boutique = s => {
    const v = P.visit || { streak: 0 };
    const earn = [
      ['객실 도장 찍기', `+${REWARD.room}냥`, '객실마다 한 번'],
      ['퀵 체크 정답', `+${REWARD.quizQ}냥`, '객실별 최고 기록 기준. 다시 풀어 기록을 올리면 차액을 드려요'],
      ['층 전체 완료', `+${REWARD.floor}냥`, '층마다 한 번'],
      ['족보 포인트 체크', `+${REWARD.check}냥`, '항목마다 한 번'],
      ['플래시카드 한 묶음 완주', `+${REWARD.deck}냥`, '묶음마다 하루 한 번'],
      ['모의고사', `정답당 +${REWARD.examQ}냥`, `16점 이상이면 +${REWARD.examPass}냥 보너스 · 하루 ${REWARD.examPerDay}회까지`],
      ['매일 체크인', '+5냥~', '연속으로 오면 하루에 1냥씩 늘어요 (최대 12냥)']
    ];
    return `<div class="wrap"><div class="boutique">
      <header class="lobby-head" style="padding-bottom:0">
        <p class="eyebrow rv"><a href="#/" style="color:inherit;text-decoration:none">Front</a><span>›</span><span class="dot"></span>Boutique</p>
        <h1 class="display rv" style="font-size:clamp(2rem,5vw,3.4rem)">냥의 <em>옷장</em></h1>
        <p class="lede rv">공부하면 냥이 쌓여요. 아이템을 누르면 먼저 입혀 볼 수 있고, 마음에 들면 모은 냥으로 사 주세요. 고른 차림은 사이트 곳곳의 냥이 그대로 입고 나와요.</p>
      </header>
      <div class="bq rv">
        <section class="fit" aria-label="피팅룸">
          <div class="fit-stage"><span class="fit-tag">Fitting room</span><div class="fit-cat" id="fit-cat"></div><div class="fit-stamp" id="fit-stamp" title="지금 쓰는 도장"></div></div>
          <div class="wallet"><span class="wl-coin">${ART.coin}</span><b data-coins>${P.coins}</b><span class="wl-u">냥</span><small>${v.streak > 1 ? `연속 체크인 ${v.streak}일째` : '오늘도 체크인 완료'}</small></div>
          <div class="fit-info" id="fit-info" aria-live="polite"></div>
        </section>
        <section class="racks" aria-label="아이템">
          <div class="rack-tabs" role="tablist">${N.SLOTS.map(sl => `<button type="button" role="tab" data-slot="${sl.id}">${sl.name}<small>${sl.en}</small></button>`).join('')}</div>
          <div class="rack" id="rack"></div>
        </section>
      </div>
      <section class="earn rv">
        <div class="earn-col"><p class="eyebrow">How to earn · 냥 버는 법</p>
          <ul class="earn-list">${earn.map(e => `<li><span class="et">${e[0]}<small>${e[2]}</small></span><b>${e[1]}</b></li>`).join('')}</ul>
          <p class="small muted">냥은 옛날 돈의 단위예요. 컨시어지 이름과 같은 건 우연이 아니랍니다.</p></div>
        <div class="earn-col"><p class="eyebrow">Special · 업적으로 여는 아이템</p>
          <ul class="ach-list">${Object.keys(N.ACH).map(a => { const it = N.ITEMS.find(i => i.ach === a), p = ACHP[a](), ok = p[0] >= p[1]; return `<li class="${ok ? 'ok' : ''}"><div class="at"><b>${esc(it.name)}</b><small>${esc(N.ACH[a].how)}</small></div><div class="ap"><div class="bar"><i style="width:${Math.round(Math.min(1, p[0] / p[1]) * 100)}%"></i></div><span>${ok ? '해금!' : p[0] + ' / ' + p[1]}</span></div></li>`; }).join('')}</ul></div>
      </section>
    </div></div>`;
  };

  /* ---------- 바인딩 ---------- */
  function bind(sec, s) {
    if (s.kind === 'room') bindRoom(sec, s.room);
    if (s.kind === 'points') $$('input[data-check]', sec).forEach(c => c.addEventListener('change', () => {
      if (c.checked) { P.checks[c.dataset.check] = 1; const got = grant('check:' + c.dataset.check, REWARD.check); save(); if (got) coinFx(got, c.closest('label')); checkAch(); }
      else { delete P.checks[c.dataset.check]; save(); }
    }));
    if (s.kind === 'boutique') bindBoutique(sec, s);
    if (s.kind === 'cards') bindCards(sec, s);
    if (s.kind === 'exam') bindExam(sec, s);
    if (s.kind === 'home') { $$('a[data-goto]', document).forEach(a => a.addEventListener('click', e => { if (location.hash === '#/' || location.hash === '') { e.preventDefault(); const t = $('#' + a.dataset.goto); if (t) t.scrollIntoView({ behavior: 'smooth' }); } })); }
  }

  function bindRoom(sec, r) {
    P.last = r.id; save();
    // 퀴즈
    const qs = $$('.quiz .q', sec);
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
          P.quiz[r.id] = { n: qs.length, ok };
          const got = grant('quiz:' + r.id, ok * REWARD.quizQ, 'max'); save();
          const sc = $('#qscore', sec); if (sc) sc.textContent = `이번 결과 ${ok}/${qs.length}` + (got ? ` · +${got}냥` : '');
          if (got) coinFx(got, sc);
          if (ok === qs.length) toast('퀵 체크 만점! ' + ART.sakura.replace('<svg', '<svg style="width:16px;height:16px;vertical-align:-3px"') + (got ? ` +${got}냥` : ''));
          else if (got) toast(`퀵 체크 ${ok}/${qs.length} · +${got}냥`);
        }
      }));
    });
    // 도장
    const btn = $('#btn-done', sec);
    btn.addEventListener('click', () => {
      const slot = $('.stamp-slot', sec), txt = $('.txt', sec);
      if (P.done[r.id]) {
        delete P.done[r.id]; save(); slot.innerHTML = ghostStamp(); btn.textContent = '도장 찍기'; btn.className = 'btn pink';
        txt.innerHTML = '<b>다 보셨나요? 도장을 찍어 열쇠를 받으세요</b><small>한 번 더 보고 싶으면 언제든 돌아와도 괜찮아요.</small>';
      } else {
        P.done[r.id] = Date.now();
        const f = r.floor;
        const got = grant('room:' + r.id, REWARD.room), bonus = floorComplete(f) ? grant('floor:' + f.n, REWARD.floor) : 0;
        save();
        slot.innerHTML = stampHTML('', true); btn.textContent = '도장 취소'; btn.className = 'btn ghost';
        txt.innerHTML = `<b>열쇠 하나 획득!${got ? ' +' + got + '냥' : ''}</b><small>` + (r.next ? '다음 객실 ' + esc(r.next.code) + '로 가 볼까요?' : '마지막 객실이었어요. 모의고사로!') + '</small>';
        if (got + bonus) setTimeout(() => coinFx(got + bonus, slot), reduced ? 0 : 380);
        if (floorComplete(f)) { petals(70); toast(`${f.n}F 전 객실 완료! 벚꽃이 떨어집니다 🌸${bonus ? ' 보너스 +' + bonus + '냥' : ''}`); }
        else { petals(22); toast(`Room ${r.code} 완료 · 열쇠 ${doneCount()}/${totalRooms()}${got ? ' · +' + got + '냥' : ''}`); }
        checkAch();
      }
      refreshNavProgress();
    });
    bindDrill(sec, r);
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

  /* 해석 토글 (실전 연습 · 실전형 모의고사 공용) */
  function bindKo(root) {
    $$('.ko-btn', root).forEach(b => b.addEventListener('click', () => {
      const ko = b.closest('.dq').querySelector('.ko'); if (!ko) return;
      ko.hidden = !ko.hidden; b.setAttribute('aria-expanded', String(!ko.hidden)); b.classList.toggle('on', !ko.hidden);
    }));
  }
  // 모두 고르시오 채점: 선택지마다 맞게 골랐는지(또는 안 골랐는지) 판정
  function judgeMulti(el, answer) {
    let wrong = 0;
    $$('.mopt', el).forEach(l => {
      const inp = $('input', l), i = Number(inp.value), should = answer.includes(i), right = inp.checked === should;
      if (!right) wrong++;
      l.classList.add(right ? 'ok' : 'bad', should ? 'yes' : 'no');
      $('.mv', l).textContent = should ? (inp.checked ? '정답 ✓' : '골랐어야 해요') : (inp.checked ? '고르면 안 돼요' : '안 고른 게 맞아요');
      inp.disabled = true;
    });
    return wrong;
  }
  function bindDrill(sec, r) {
    const box = $('.drill', sec); if (!box) return;
    bindKo(box);
    const items = $$('.dq', box), auto = items.filter(d => d.dataset.t !== 'short');
    const finish = () => {
      if (!auto.every(d => d.classList.contains('done'))) return;
      const ok = auto.filter(d => d.dataset.ok === '1').length;
      const prev = P.drill[r.id];
      if (!prev || ok >= prev.ok) P.drill[r.id] = { n: auto.length, ok };
      const got = grant('drill:' + r.id, ok * 5, 'max'); save();
      const sc = $('#dscore', box); if (sc) sc.textContent = `이번 결과 ${ok}/${auto.length}` + (got ? ` · +${got}냥` : '');
      if (got) coinFx(got, sc);
      toast(`실전 연습 ${ok}/${auto.length}` + (got ? ` · +${got}냥` : '') + (ok === auto.length ? ' · 영어 문제도 완벽!' : ''));
    };
    items.forEach(d => {
      if (d.dataset.t === 'tf') {
        const a = Number(d.dataset.a);
        $$('.q-opt', d).forEach(b => b.addEventListener('click', () => {
          if (d.classList.contains('done')) return;
          const i = Number(b.dataset.i); d.classList.add('done'); d.dataset.ok = i === a ? '1' : '0';
          $$('.q-opt', d).forEach(o => { if (Number(o.dataset.i) === a) o.classList.add('ok'); else if (o === b) o.classList.add('bad'); });
          const v = document.createElement('span'); v.className = 'verdict ' + (i === a ? 'ok' : 'bad'); v.textContent = i === a ? '정답!' : '아쉬워요'; d.appendChild(v);
          finish();
        }));
      } else if (d.dataset.t === 'multi') {
        const ans = d.dataset.a.split(',').map(Number);
        $('.dq-check', d).addEventListener('click', e => {
          if (d.classList.contains('done')) return;
          const wrong = judgeMulti(d, ans); d.classList.add('done'); d.dataset.ok = wrong ? '0' : '1'; e.currentTarget.disabled = true;
          $('.dq-res', d).textContent = wrong ? `선택지 ${wrong}개를 잘못 판단했어요` : '완벽해요!';
          $('.dq-res', d).className = 'dq-res ' + (wrong ? 'bad' : 'ok');
          finish();
        });
      } else {
        const btn = $('.dq-show', d), model = $('.model', d), ta = $('.ans', d);
        btn.addEventListener('click', () => {
          model.hidden = !model.hidden; btn.textContent = model.hidden ? '모범답안 보기' : '모범답안 접기';
          if (!model.hidden && ta.value.trim().length >= 15) { const got = grant('short:' + r.id + ':' + d.dataset.k, 5); save(); if (got) { coinFx(got, btn); toast(`서술 연습 완료 · +${got}냥`); } }
        });
      }
    });
  }
  function clearKeys() { while (keyHandlers.length) document.removeEventListener('keydown', keyHandlers.pop()); }

  /* ---------- 냥의 옷장 ---------- */
  function bindBoutique(sec, s) {
    let tab = N.SLOTS.some(x => x.id === s.tab) ? s.tab : 'hat', sel = null, trial = look();
    const catEl = $('#fit-cat', sec), stEl = $('#fit-stamp', sec), info = $('#fit-info', sec), rack = $('#rack', sec);
    const state = it => look()[it.slot] === it.id ? 'on' : owns(it) ? 'owned' : it.ach ? 'locked' : 'shop';
    function thumb(it) {
      if (it.slot === 'stamp') return N.stamp(it.id);
      const base = { fur: look().fur, hat: 'h-none' }; base[it.slot] = it.id;
      return N.render(base, { crop: N.SLOTS.find(x => x.id === it.slot).crop });
    }
    function tag(it, st) {
      if (st === 'on') return '<em class="t-on">착용 중</em>';
      if (st === 'owned') return '<em>보유</em>';
      if (st === 'locked') return `<em class="t-lock">${ART.lock}업적</em>`;
      return `<span class="t-price ${it.price > P.coins ? 'short' : ''}">${ART.coin}${it.price}</span>`;
    }
    function drawFit() { catEl.innerHTML = N.render(trial, { label: '피팅룸의 냥' }); stEl.innerHTML = N.stamp(trial.stamp); }
    function drawTabs() { $$('.rack-tabs button', sec).forEach(b => { const on = b.dataset.slot === tab; b.classList.toggle('on', on); b.setAttribute('aria-selected', String(on)); }); }
    function drawRack() {
      rack.innerHTML = N.ITEMS.filter(it => it.slot === tab).map(it => {
        const st = state(it);
        return `<button type="button" class="tile ${st}${sel === it.id ? ' sel' : ''}${it.slot === 'stamp' ? ' is-stamp' : ''}" data-id="${it.id}" aria-pressed="${sel === it.id}"><span class="th">${thumb(it)}</span><span class="nm">${esc(it.name)}</span><span class="pr">${tag(it, st)}</span></button>`;
      }).join('');
      $$('.tile', rack).forEach(b => b.addEventListener('click', () => pick(b.dataset.id)));
    }
    function drawInfo() {
      if (!sel) {
        const L = look();
        const worn = N.SLOTS.filter(x => x.id !== 'stamp' && !/-none$/.test(L[x.id])).map(x => esc(N.BY[L[x.id]].name));
        info.innerHTML = `<p class="fit-hint">아이템을 누르면 냥에게 먼저 입혀 봐요.<br><small>지금 차림 · ${worn.join(', ')}</small></p>`;
        return;
      }
      const it = N.BY[sel], st = state(it);
      let act;
      if (st === 'on') act = '<span class="chip mint">착용 중</span>';
      else if (st === 'owned') act = '<button class="btn pink" type="button" id="fit-wear">입히기</button>';
      else if (st === 'locked') { const p = ACHP[it.ach](); act = `<div class="ach-mini"><b>${ART.lock}${esc(N.ACH[it.ach].how)}</b><div class="bar"><i style="width:${Math.round(Math.min(1, p[0] / p[1]) * 100)}%"></i></div><small>${p[0]} / ${p[1]}</small></div>`; }
      else if (P.coins >= it.price) act = `<button class="btn pink" type="button" id="fit-buy">${ART.coin}${it.price}냥에 사 주기</button>`;
      else act = `<button class="btn" type="button" disabled>${ART.coin}${it.price}냥</button><small class="need">${it.price - P.coins}냥 더 모으면 살 수 있어요</small>`;
      info.innerHTML = `<div class="fi-head"><b>${esc(it.name)}</b>${it.en ? `<span class="jp">${esc(it.en)}</span>` : ''}</div>${it.desc ? `<p>${esc(it.desc)}</p>` : ''}<div class="fi-act">${act}${st !== 'on' ? '<button class="btn ghost sm fit-back" type="button" id="fit-back" title="입어 본 것 되돌리기"><span aria-hidden="true">↺</span><span class="t">원래대로</span></button>' : ''}</div>`;
      const w = $('#fit-wear', info), b = $('#fit-buy', info), bk = $('#fit-back', info);
      if (w) w.addEventListener('click', () => wear(it, false));
      if (b) b.addEventListener('click', () => { if (P.coins < it.price || owns(it)) return; P.coins -= it.price; P.owned[it.id] = Date.now(); wear(it, true); });
      if (bk) bk.addEventListener('click', () => { sel = null; trial = look(); drawAll(); });
    }
    function wear(it, bought) {
      P.look[it.slot] = it.id; save(); refreshWallet();
      trial = look(); drawAll();
      catHop($('.fit-cat', sec));
      if (bought) { petals(28); toast(`<b>${esc(it.name)}</b> 구매 완료! 바로 입혀 드렸어요`); }
      else toast(`${esc(it.name)} 착용!`);
    }
    function pick(id) {
      const it = N.BY[id]; if (!it) return;
      sel = id; trial = Object.assign({}, look(), { [it.slot]: id });
      drawFit(); drawInfo(); drawRack();
    }
    function drawAll() { drawFit(); drawInfo(); drawTabs(); drawRack(); }
    $$('.rack-tabs button', sec).forEach(b => b.addEventListener('click', () => { tab = b.dataset.slot; drawTabs(); drawRack(); }));
    drawAll();
  }

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
      if (!deck.length) { stage.innerHTML = `<div class="fcard"><div class="face front"><span class="lbl">Done</span><div class="body">이 묶음의 카드를 모두 "알아요"로 치웠어요 🌸<br><span class="small muted" style="font-family:var(--f-body)">묶음마다 하루 한 번 ${REWARD.deck}냥을 드려요. 섞기를 누르면 처음부터 다시 시작해요.</span></div><span class="hint"></span></div></div>`; count.textContent = `남은 카드 0 · 알아요 ${known}`; return; }
      const c = deck[pos % deck.length];
      stage.innerHTML = `<div class="fcard card-page-ani ${flipped ? 'flip' : ''}" id="fcard" tabindex="0" role="button" aria-label="카드 뒤집기">
        <div class="face front"><span class="lbl">${c.f}F · ${esc(c.tag || 'Term')}</span><div class="body">${c.q}</div><span class="hint">누르면 뒤집혀요</span></div>
        <div class="face back"><span class="lbl">Answer</span><div class="body">${c.a}</div><span class="hint">알아요 / 다시 볼래요</span></div></div>`;
      renderMath(stage);
      const el = $('#fcard', stage);
      el.addEventListener('click', () => { flipped = !flipped; el.classList.toggle('flip', flipped); });
      count.textContent = `남은 카드 ${deck.length} · 알아요 ${known} · 다시 ${again}`;
    }
    function know() {
      if (!deck.length) return;
      deck.splice(pos % deck.length, 1); known++; flipped = false; if (deck.length) pos = pos % deck.length; render();
      if (!deck.length) { const got = grant('deck:' + filter + ':' + dayKey(), REWARD.deck); save(); if (got) { coinFx(got, stage); toast(`카드 한 묶음 완주! +${got}냥`); } }
    }
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
  function bindExam(sec, s) {
    if (s.mode === 'quick') bindQuick(sec);
    else if (s.mode === 'real') bindReal(sec);
  }

  /* ---------- 실전형 모의고사 (작년 형식: T/F 30 · 모두 고르시오 40 · short 20 · long 10) ---------- */
  const shuffled = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function roundRobin(list, n) {
    const by = {};
    shuffled(list).forEach(q => { (by[q.room.floor.n] = by[q.room.floor.n] || []).push(q); });
    const keys = Object.keys(by).sort(), out = [];
    while (out.length < n && keys.some(k => by[k].length)) keys.forEach(k => { if (out.length < n && by[k].length) out.push(by[k].shift()); });
    return shuffled(out);
  }
  const realPool = () => Object.keys(H.drill || {}).flatMap(id => (H.drill[id] || []).map(q => Object.assign({ room: IDX.rooms[id] }, q))).filter(q => q.room);
  const fmt = v => String(Math.round(v * 10) / 10);
  function bindReal(sec) {
    const body = $('#exam-body', sec), pool = realPool(), W = H.written || { scenarios: [], long: [] };
    let T = null;
    const koDiv = q => q.ko ? `<div class="ko" hidden>${esc(q.ko)}</div>` : '';
    function records() {
      if (!P.real.length) return '';
      return `<div class="pt-room" style="margin-top:1rem"><div class="pt-h"><span style="font-family:var(--f-head);font-weight:700">지난 기록</span></div><div class="tbl-wrap"><table class="tbl"><tr><th>날짜</th><th class="num">총점</th><th class="num">T/F</th><th class="num">모두 고르시오</th><th class="num">Short</th><th class="num">Long</th></tr>${P.real.slice(-6).reverse().map(e => `<tr><td>${new Date(e.at).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' })}</td><td class="num"><b>${fmt(e.total)}</b></td><td class="num">${fmt(e.parts.tf)}/30</td><td class="num">${fmt(e.parts.multi)}/40</td><td class="num">${fmt(e.parts.short)}/20</td><td class="num">${fmt(e.parts.long)}/10</td></tr>`).join('')}</table></div></div>`;
    }
    function intro() {
      const nTf = pool.filter(q => q.t === 'tf').length, nM = pool.filter(q => q.t === 'multi').length;
      body.innerHTML = `<div class="real-intro"><div class="result-grid">${[['Part I · True/False', '10문', 30], ['Part II · 모두 고르시오', '4문', 40], ['Part III · Short answer', '8문항', 20], ['Part IV · Long answer', '1문', 10]].map(p => `<div class="result-tile"><span class="t">${p[0]}</span><span class="v">${p[2]}<small>점 · ${p[1]}</small></span></div>`).join('')}</div>
        <ul class="g-list"><li><b>T/F</b>: 정답 3점 · 비워 두면 1점 · 오답 0점. 반 이상 확신하면 답하는 게 이득이에요.</li><li><b>모두 고르시오</b>: 선택지를 하나씩 판단하세요. 완벽 10점, 선택지 하나만 잘못 판단하면 5점, 그 이상은 0점. (실제 채점은 더 박할 수 있어요)</li><li><b>Short answer</b>: 상황마다 유연한 방법이 더 나은지(Better) 나쁜지(Worse) 고르고 근거를 한 줄. 문항당 2.5점.</li><li><b>Long answer</b>: 답안을 쓴 뒤, 채점 화면에서 모범답안의 채점 포인트로 스스로 채점해요.</li></ul>
        <p class="muted small">문제 은행: T/F ${nTf} · 모두 고르시오 ${nM} · 상황 ${W.scenarios.length} · 서술 ${W.long.length}. 하루 두 번까지 점수 3점당 1냥, 90점을 넘기면 보너스 30냥과 트로피.</p>
        <div class="card-ctrl" style="margin-top:.6rem"><button class="btn pink" id="real-start" type="button">시험지 받기</button></div></div>${records()}`;
      $('#real-start', body).addEventListener('click', () => { build(); paper(); });
    }
    function build() {
      T = { at: Date.now(), tf: roundRobin(pool.filter(q => q.t === 'tf'), 10), multi: roundRobin(pool.filter(q => q.t === 'multi'), 4), sc: shuffled(W.scenarios).slice(0, 8), long: W.long[Math.floor(Math.random() * W.long.length)] };
    }
    function paper() {
      body.innerHTML = `<form class="paper" id="paper" novalidate>
        <section class="part"><div class="part-h"><h2>Part I. True / False</h2><span>30 points · correct 3 / blank 1 / wrong 0</span></div>
          ${T.tf.map((q, i) => `<div class="q dq pq"><div class="dq-top"><span class="dq-tag">${i + 1}</span>${koHTML(q)}</div><div class="qt en-q">${q.q}</div>${koDiv(q)}
            <div class="tfr" role="radiogroup"><label><input type="radio" name="tf${i}" value="1"><span>True</span></label><label><input type="radio" name="tf${i}" value="0"><span>False</span></label><label class="blank"><input type="radio" name="tf${i}" value="" checked><span>비워 두기</span></label></div></div>`).join('')}
        </section>
        <section class="part"><div class="part-h"><h2>Part II. Select all that apply</h2><span>40 points · 10 each</span></div>
          ${T.multi.map((q, i) => `<div class="q dq pq"><div class="dq-top"><span class="dq-tag">${i + 11}</span>${koHTML(q)}</div><div class="qt en-q">${q.q}</div>${koDiv(q)}
            <div class="mopts">${q.c.map((o, j) => `<label class="mopt"><input type="checkbox" name="m${i}" value="${j}"><span class="mk">${'ABCDEF'[j]}</span><span class="mt">${o}</span><em class="mv"></em></label>`).join('')}</div></div>`).join('')}
        </section>
        <section class="part"><div class="part-h"><h2>Part III. Short answer</h2><span>20 points · 2.5 each</span></div>
          <p class="en-q part-lead">For each of parts (a) through (h), indicate whether we would generally expect the performance of a <b>flexible</b> statistical learning method to be <b>better or worse</b> than an inflexible method. Justify your answer.</p>
          ${T.sc.map((q, i) => `<div class="q dq pq sc"><div class="qt en-q"><b>(${'abcdefgh'[i]})</b> ${q.q}</div>
            <div class="tfr"><label><input type="radio" name="s${i}" value="1"><span>Better</span></label><label><input type="radio" name="s${i}" value="0"><span>Worse</span></label></div><input class="why-in" type="text" placeholder="근거 한 줄 (선택)"></div>`).join('')}
        </section>
        <section class="part"><div class="part-h"><h2>Part IV. Long answer</h2><span>10 points · 제출 후 스스로 채점</span></div>
          <div class="q dq pq long"><div class="qt en-q">${T.long.q}</div><textarea class="ans" rows="9" placeholder="답안을 써 보세요. 한국어로 써도 돼요."></textarea></div>
        </section>
        <div class="card-ctrl"><button class="btn pink" type="submit">제출하고 채점하기</button></div></form>`;
      renderMath(body); bindKo(body);
      $('#paper', body).addEventListener('submit', e => { e.preventDefault(); grade(); });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function grade() {
      const form = $('#paper', body);
      const val = n => { const x = form.querySelector(`input[name="${n}"]:checked`); return x ? x.value : null; };
      const tf = T.tf.map((q, i) => { const v = val('tf' + i), ans = v === '' || v == null ? null : v === '1'; return { q, ans, pts: ans === null ? 1 : ans === q.a ? 3 : 0 }; });
      const mu = T.multi.map((q, i) => { const picked = $$(`input[name="m${i}"]`, form).filter(x => x.checked).map(x => Number(x.value)); const wrong = q.c.filter((_, j) => picked.includes(j) !== q.a.includes(j)).length; return { q, picked, wrong, pts: wrong === 0 ? 10 : wrong === 1 ? 5 : 0 }; });
      const notes = $$('.why-in', form).map(x => x.value.trim());
      const sc = T.sc.map((q, i) => { const v = val('s' + i), ans = v == null ? null : v === '1'; return { q, ans, note: notes[i], pts: ans === q.b ? 2.5 : 0 }; });
      const longText = $('.long .ans', form).value;
      const sum = a => a.reduce((s, x) => s + x.pts, 0);
      const rec = { at: T.at, parts: { tf: sum(tf), multi: sum(mu), short: sum(sc), long: 0 } };
      rec.total = rec.parts.tf + rec.parts.multi + rec.parts.short;
      P.real.push(rec); if (P.real.length > 30) P.real.splice(0, P.real.length - 30);
      const nToday = P.real.filter(e => dayKey(e.at) === dayKey()).length;
      const got = grant('real:' + rec.at, nToday <= 2 ? Math.round(rec.total / 3) : 0); save();
      results(tf, mu, sc, longText, rec, got, nToday);
    }
    function results(tf, mu, sc, longText, rec, got, nToday) {
      const L = T.long;
      const tfRow = x => `<div class="rv-item ${x.ans === null ? 'blank' : x.pts ? 'ok' : 'bad'}"><div class="en-q">${x.q.q}</div><div class="rv-meta"><span>내 답: <b>${x.ans === null ? '비움' : x.ans ? 'True' : 'False'}</b></span><span>정답: <b>${x.q.a ? 'True' : 'False'}</b></span><span class="pts">${x.pts}점</span></div><div class="why"><b>해설.</b> ${x.q.why}</div><a href="#/room/${x.q.room.id}">→ Room ${x.q.room.code} ${esc(x.q.room.title)}</a></div>`;
      const muRow = x => `<div class="rv-item ${x.wrong ? 'bad' : 'ok'}"><div class="en-q">${x.q.q}</div><div class="mopts">${x.q.c.map((o, j) => { const should = x.q.a.includes(j), picked = x.picked.includes(j), right = should === picked; return `<div class="mopt ${right ? 'ok' : 'bad'} ${should ? 'yes' : 'no'}"><span class="mk">${'ABCDEF'[j]}</span><span class="mt">${o}</span><em class="mv">${should ? (picked ? '정답 ✓' : '골랐어야 해요') : (picked ? '고르면 안 돼요' : '안 고른 게 맞아요')}</em></div>`; }).join('')}</div><div class="rv-meta"><span>잘못 판단한 선택지 ${x.wrong}개</span><span class="pts">${x.pts}점</span></div><div class="why"><b>해설.</b> ${x.q.why}</div><a href="#/room/${x.q.room.id}">→ Room ${x.q.room.code} ${esc(x.q.room.title)}</a></div>`;
      const scRow = (x, i) => `<div class="rv-item ${x.pts ? 'ok' : 'bad'}"><div class="en-q"><b>(${'abcdefgh'[i]})</b> ${x.q.q}</div><div class="rv-meta"><span>내 답: <b>${x.ans === null ? '비움' : x.ans ? 'Better' : 'Worse'}</b></span><span>정답: <b>${x.q.b ? 'Better' : 'Worse'}</b></span><span class="pts">${x.pts}점</span></div>${x.note ? `<div class="small muted">내 근거: ${esc(x.note)}</div>` : ''}<div class="why"><b>근거.</b> ${x.q.why}</div></div>`;
      body.innerHTML = `<div class="big-score"><span class="eyebrow" style="justify-content:center">Result · 실전형</span><div class="v"><span id="real-total">${fmt(rec.total)}</span><small>/ 100</small></div><p class="muted" id="real-msg"></p>
          ${got ? `<p class="exam-coins">${ART.coin}<b>+${got}냥</b> 점수 3점당 1냥</p>` : nToday > 2 ? '<p class="exam-coins muted small">오늘의 실전형 보상(하루 2회)은 다 받았어요.</p>' : ''}</div>
        <div class="result-grid">${[['Part I · T/F', fmt(rec.parts.tf), 30], ['Part II · 모두 고르시오', fmt(rec.parts.multi), 40], ['Part III · Short', fmt(rec.parts.short), 20], ['Part IV · Long', '<span id="long-pts">0</span>', 10]].map(p => `<div class="result-tile"><span class="t">${p[0]}</span><span class="v">${p[1]}<small>/${p[2]}</small></span></div>`).join('')}</div>
        <section class="part self"><div class="part-h"><h2>Part IV 스스로 채점</h2><span>모범답안을 보고 내 답에 있던 포인트를 체크하면 점수가 더해져요</span></div>
          <div class="q dq long-review"><div class="qt en-q">${L.q}</div><div class="my-ans"><b>내 답안</b><div>${esc(longText).replace(/\n/g, '<br>') || '<span class="muted">(비어 있음)</span>'}</div></div>
          <div class="model"><div class="model-body">${L.model}</div><div class="rubric"><b>채점 포인트</b>${L.rubric.map(x => `<label><input type="checkbox" data-p="${x[1]}"><span>${esc(x[0])} <em>${x[1]}점</em></span></label>`).join('')}</div></div></div></section>
        <section class="part"><div class="part-h"><h2>Part I 다시 보기</h2><span>${fmt(rec.parts.tf)} / 30</span></div>${tf.map(tfRow).join('')}</section>
        <section class="part"><div class="part-h"><h2>Part II 다시 보기</h2><span>${fmt(rec.parts.multi)} / 40</span></div>${mu.map(muRow).join('')}</section>
        <section class="part"><div class="part-h"><h2>Part III 다시 보기</h2><span>${fmt(rec.parts.short)} / 20</span></div>${sc.map(scRow).join('')}</section>
        <div class="card-ctrl" style="margin-top:.6rem"><button class="btn pink" id="real-again" type="button">새 시험지로 한 번 더</button><a class="btn" href="#/exam">모의고사 홈</a><a class="btn" href="#/guide">시험 안내</a></div>`;
      renderMath(body);
      const msg = () => { const t = rec.total; $('#real-msg', body).textContent = t >= 90 ? 'A+ 권이에요! 트로피가 기다려요.' : t >= 80 ? 'A 권. 틀린 선택지만 객실에서 다시 보면 충분해요.' : t >= 60 ? '절반은 넘었어요. 모두 고르시오에서 새는 점수가 없는지 확인해 봐요.' : '괜찮아요. 객실마다 있는 실전 연습부터 차근차근.'; };
      msg();
      $$('.rubric input', body).forEach(c => c.addEventListener('change', () => {
        rec.parts.long = $$('.rubric input', body).filter(x => x.checked).reduce((s, x) => s + Number(x.dataset.p), 0);
        rec.total = rec.parts.tf + rec.parts.multi + rec.parts.short + rec.parts.long;
        $('#long-pts', body).textContent = fmt(rec.parts.long); $('#real-total', body).textContent = fmt(rec.total); msg();
        if (rec.total >= 90) { const b = grant('real90:' + rec.at, 30); if (b) { coinFx(b, $('#real-total', body)); toast(`실전형 90점 돌파! 보너스 +${b}냥`); petals(60); } }
        save(); checkAch();
      }));
      $('#real-again', body).addEventListener('click', () => { build(); paper(); });
      if (got) setTimeout(() => coinFx(got, $('#real-total', body)), reduced ? 0 : 420);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      checkAch();
    }
    intro();
  }

  function bindQuick(sec) {
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
        <p class="muted">문제 은행 ${pool.length}문제 중에서 층별로 5문제씩 무작위로 뽑아요. 정답 하나에 ${REWARD.examQ}냥, 16점 이상이면 ${REWARD.examPass}냥 보너스(하루 ${REWARD.examPerDay}회까지).${last ? ` 최근 기록 ${last.score}/20 (${new Date(last.at).toLocaleDateString('ko-KR')})` : ''}</p>
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
      const at = Date.now(), today = dayKey(at);
      P.exams.push({ at, score, by });
      const nToday = P.exams.filter(e => dayKey(e.at) === today).length;
      const got = grant('exam:' + at, nToday <= REWARD.examPerDay ? score * REWARD.examQ + (score >= 16 ? REWARD.examPass : 0) : 0); save();
      const coinLine = got ? `<p class="exam-coins">${ART.coin}<b>+${got}냥</b> 정답 ${score}개 × ${REWARD.examQ}냥${score >= 16 ? ' + 합격선 보너스 ' + REWARD.examPass + '냥' : ''}</p>` : `<p class="exam-coins muted small">오늘의 모의고사 보상(하루 ${REWARD.examPerDay}회)은 다 받았어요. 내일 또 만나요!</p>`;
      if (score >= 16) petals(60);
      const wrong = answers.filter(a => !a.ok);
      body.innerHTML = `<div class="big-score"><span class="eyebrow" style="justify-content:center">Result</span><div class="v">${score}<small>/ 20</small></div><p class="muted">${score === 20 ? '만점! A+ 예약이에요 🌸' : score >= 16 ? '아주 좋아요. 틀린 객실만 다시 들르면 완벽해요.' : score >= 10 ? '절반은 넘겼어요. 아래 객실들을 다시 한 번 돌아보세요.' : '괜찮아요. 족보부터 차근차근 다시 봐요. 냥이 같이 갈게요.'}</p>${coinLine}</div>
        <div class="result-grid">${H.floors.map(f => `<div class="result-tile"><span class="t">${f.n}F ${esc(f.title)}</span><span class="v">${by[f.n]}<small>/5</small></span></div>`).join('')}</div>
        ${wrong.length ? `<h2 class="h-sec" style="font-size:1.25rem;margin-top:.5rem">다시 볼 객실</h2><div class="review-list">${wrong.map(a => `<div class="review-item"><div>${a.q.q}</div><a href="#/room/${a.q.room.id}">→ Room ${a.q.room.code} ${esc(a.q.room.title)}</a></div>`).join('')}</div>` : ''}
        <div class="card-ctrl" style="margin-top:.6rem"><button class="btn pink" id="exam-again" type="button">한 번 더</button><a class="btn" href="#/">프런트로</a></div>`;
      renderMath(body);
      $('#exam-again', body).addEventListener('click', start);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (got) setTimeout(() => coinFx(got, $('.big-score .v', body)), reduced ? 0 : 420);
      checkAch();
    }
    intro();
  }

  /* ---------- 시작 ---------- */
  function boot() {
    buildIndex();
    document.body.insertAdjacentHTML('beforeend', N.defs());
    // 없어진 아이템(한자 도장)을 샀다면 냥으로 돌려준다
    const GONE = { 'st-ai': 70, 'st-sakura': 90 };
    let refund = 0;
    Object.keys(GONE).forEach(id => { if (P.owned[id]) { refund += GONE[id]; delete P.owned[id]; } });
    P.coins += refund;
    const back = syncPast() + refund, ci = checkIn();
    save();
    renderNav();
    window.addEventListener('hashchange', () => { clearKeys(); go(); });
    // 냥을 누르면 폴짝
    stage.addEventListener('click', e => { const c = e.target.closest('.concierge .cat'); if (c) catHop(c); });
    stage.addEventListener('keydown', e => { const c = e.target.closest && e.target.closest('.concierge .cat'); if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); catHop(c); } });
    go();
    setTimeout(() => {
      if (back - refund) toast('지금까지 공부한 만큼 <b>' + (back - refund) + '냥</b>을 적립해 드렸어요');
      if (refund) toast('도장 디자인이 바뀌어서 예전 도장 값 <b>' + refund + '냥</b>을 돌려드렸어요');
      if (ci && ci.amt) toast('오늘의 체크인 +' + ci.amt + '냥' + (ci.streak > 1 ? ' · 연속 ' + ci.streak + '일째' : ''));
      if (back || (ci && ci.amt)) coinFx(back + ((ci && ci.amt) || 0));
      checkAch();
    }, reduced ? 0 : 900);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
