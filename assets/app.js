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
  function blank() { return { done: {}, quiz: {}, exams: [], checks: {}, cards: {}, last: null, coins: 0, earned: {}, owned: {}, look: {}, visit: null }; }
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

  /* ---------- 냥(兩) 지갑 · 보상 · 업적 ---------- */
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
    streak: () => [Math.min((P.visit && P.visit.best) || 0, 7), 7]
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
  const CAT_LINES = ['냥!', '오늘도 한 객실만 해 봐요.', '도장 하나에 20냥이에요.', '퀵 체크 정답은 5냥!', '부티크 구경 갈래요?', '편향-분산, 기억나죠?', '쉬엄쉬엄 해도 괜찮아요.', '合格祈願!'];
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
          <div class="nav-links">${H.floors.map(f => `<a href="#/points/${f.n}">${f.n}F 족보</a>`).join('')}<a href="#/cards">플래시카드</a><a href="#/exam">모의고사</a><a href="#/boutique">냥의 옷장</a><a href="#/" data-goto="guide">이용 안내</a></div>
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
    if (s.kind === 'exam') return '모의고사';
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
    else hello = '와, 모든 객실을 다 도셨어요! 이제 족보와 플래시카드로 복습하고, 모의고사로 마무리해 볼까요? 合格祈願!';
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
          <a class="desk-card rv" href="#/exam"><span class="tape"></span><span class="ico">${ART.icoExam}</span><h3>모의고사</h3><p>모든 층에서 골고루 20문제. 틀린 문제는 해당 객실로 바로 연결돼요.</p><span class="go">${P.exams.length ? '최근 ' + P.exams[P.exams.length - 1].score + '/20' : '20 questions'}</span></a>
        </div>
      </div></section>

      <section class="sec"><div class="wrap">
        <div class="promo rv">
          <a class="promo-cat" href="#/boutique" aria-label="냥의 옷장으로">${catArt()}</a>
          <div class="promo-txt">
            <p class="eyebrow">Boutique · 냥의 옷장</p>
            <h2 class="h-sec">공부한 만큼 냥(兩)이 쌓여요</h2>
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
          <div class="step rv"><b>도장 찍고 냥 모으기</b><p>객실을 다 보면 도장을 찍어요. 도장·퀵 체크·족보 체크마다 냥(兩)이 쌓이고, 부티크에서 냥에게 옷을 사 줄 수 있어요. 진행도는 이 브라우저에 저장돼요.</p></div>
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
      <aside class="mendl-box rv" aria-label="시험 포인트">${ART.bow.replace('<svg', '<svg class="bow"')}
        <h2>시험 포인트 <span class="chip">Mendl's box</span></h2>
        <ol>${(r.points || []).map(p => `<li>${p}</li>`).join('')}</ol>
        ${r.terms && r.terms.length ? `<div class="terms">${r.terms.map(t => `<span><b>${esc(t[0])}</b>${esc(t[1])}</span>`).join('')}</div>` : ''}
      </aside>
      ${quiz ? `<section class="quiz rv" data-room="${r.id}"><div class="quiz-head"><h2>퀵 체크 <span class="chip mint">${(r.quiz || []).length}문제</span></h2><span class="score" id="qscore">${P.quiz[r.id] ? `지난 기록 ${P.quiz[r.id].ok}/${P.quiz[r.id].n}` : '아직 풀지 않았어요'}</span></div>${quiz}</section>` : ''}
      <footer class="room-foot rv">
        <div class="done-row">
          <div class="stamp-slot">${done ? stampHTML() : ghostStamp()}</div>
          <div class="txt"><b>${done ? '이 객실은 다 보셨어요' : P.earned['room:' + r.id] == null ? '다 보셨나요? 도장을 찍고 열쇠와 ' + REWARD.room + '냥을 받으세요' : '다 보셨나요? 도장을 찍어 열쇠를 받으세요'}</b><small>${done ? '도장을 다시 누르면 취소할 수 있어요.' : '한 번 더 보고 싶으면 언제든 돌아와도 괜찮아요.'}</small></div>
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
        <p class="lede rv">객실마다 시험에 나올 만한 것만 모았어요. 외운 항목은 체크해서 지워 나가세요. 항목을 처음 체크할 때마다 ${REWARD.check}냥이 쌓이고, 체크는 이 브라우저에 저장됩니다.</p>
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
        <p class="lede rv">공부하면 냥(兩)이 쌓여요. 아이템을 누르면 먼저 입혀 볼 수 있고, 마음에 들면 모은 냥으로 사 주세요. 고른 차림은 사이트 곳곳의 냥이 그대로 입고 나와요.</p>
      </header>
      <div class="bq rv">
        <section class="fit" aria-label="피팅룸">
          <div class="fit-stage"><span class="fit-tag">Fitting room · 試着室</span><div class="fit-cat" id="fit-cat"></div><div class="fit-stamp" id="fit-stamp" title="지금 쓰는 도장"></div></div>
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
          <p class="small muted">냥(兩)은 옛날 돈의 단위예요. 컨시어지 이름과 같은 건 우연이 아니랍니다.</p></div>
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
        delete P.done[r.id]; save(); slot.innerHTML = ghostStamp(); btn.textContent = '도장 찍기 完'; btn.className = 'btn pink';
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
      info.innerHTML = `<div class="fi-head"><b>${esc(it.name)}</b>${it.jp ? `<span class="jp">${esc(it.jp)}</span>` : ''}</div>${it.desc ? `<p>${esc(it.desc)}</p>` : ''}<div class="fi-act">${act}${st !== 'on' ? '<button class="btn ghost sm fit-back" type="button" id="fit-back" title="입어 본 것 되돌리기"><span aria-hidden="true">↺</span><span class="t">원래대로</span></button>' : ''}</div>`;
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
      body.innerHTML = `<div class="big-score"><span class="eyebrow" style="justify-content:center">Result</span><div class="v">${score}<small>/ 20</small></div><p class="muted">${score === 20 ? '만점! 合格祈願이 통했네요 🌸' : score >= 16 ? '아주 좋아요. 틀린 객실만 다시 들르면 완벽해요.' : score >= 10 ? '절반은 넘겼어요. 아래 객실들을 다시 한 번 돌아보세요.' : '괜찮아요. 족보부터 차근차근 다시 봐요. 냥이 같이 갈게요.'}</p>${coinLine}</div>
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
    const back = syncPast(), ci = checkIn();
    save();
    renderNav();
    window.addEventListener('hashchange', () => { clearKeys(); go(); });
    // 냥을 누르면 폴짝
    stage.addEventListener('click', e => { const c = e.target.closest('.concierge .cat'); if (c) catHop(c); });
    stage.addEventListener('keydown', e => { const c = e.target.closest && e.target.closest('.concierge .cat'); if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); catHop(c); } });
    go();
    setTimeout(() => {
      if (back) toast('지금까지 공부한 만큼 <b>' + back + '냥</b>을 적립해 드렸어요');
      if (ci && ci.amt) toast('오늘의 체크인 +' + ci.amt + '냥' + (ci.streak > 1 ? ' · 연속 ' + ci.streak + '일째' : ''));
      if (back || (ci && ci.amt)) coinFx(back + ((ci && ci.amt) || 0));
      checkAch();
    }, reduced ? 0 : 900);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
