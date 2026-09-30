/* Grand Data Hotel — 컨시어지 냥: 고양이 아트 · 꾸미기 아이템 · 도장
   render(look) 는 viewBox 0 0 120 138 의 SVG 문자열을, stamp(id) 는 0 0 100 100 의 도장 SVG 를 돌려준다.
   아이템 draw 는 레이어별 함수 { back, main, front, top } (함수 하나면 main). */
(function () {
  'use strict';
  let uid = 0;
  const r2 = v => Math.round(v * 100) / 100;
  const DISP = "Fraunces,Georgia,'Times New Roman',serif";
  const TORSO = 'M36 129 C33 108 41 91 60 89 C79 91 87 108 84 129 Z';

  const SLOTS = [
    { id: 'hat', name: '모자', en: 'Hats', crop: '12 -3 96 66' },
    { id: 'face', name: '얼굴', en: 'Face', crop: '12 28 96 52' },
    { id: 'neck', name: '목', en: 'Neck', crop: '20 72 80 52' },
    { id: 'outfit', name: '옷', en: 'Outfits', crop: '14 80 92 58' },
    { id: 'held', name: '소품', en: 'Props', crop: '0 0 120 138' },
    { id: 'seat', name: '자리', en: 'Seats', crop: '0 62 120 76' },
    { id: 'fur', name: '털색', en: 'Fur', crop: '6 2 108 96' },
    { id: 'stamp', name: '도장', en: 'Stamps', crop: null }
  ];
  const DEFAULT = { hat: 'h-lobby', face: 'f-none', neck: 'n-none', outfit: 'o-lobby', held: 'p-none', seat: 's-none', fur: 'fur-cream', stamp: 'st-neko' };

  /* 업적으로 여는 아이템 (진행도 계산은 app.js) */
  const ACH = {
    keys: { name: '크로스드 키 협회', how: '45개 객실에 모두 도장 찍기' },
    crown: { name: '모의고사 만점', how: '빠른 모의고사 20/20 받기' },
    pass: { name: '합격선 돌파', how: '빠른 모의고사 16점 이상 받기' },
    points: { name: '족보 마스터', how: '족보의 시험 포인트 전부 체크하기' },
    streak: { name: '단골손님', how: '7일 연속 체크인하기' },
    quizall: { name: '퀵 체크 올백', how: '45개 객실 퀵 체크를 모두 만점 받기' },
    mock90: { name: '실전 A+', how: '실전형 모의고사 90점 이상 받기' }
  };

  /* ---------- 작은 도형 ---------- */
  function flower(x, y, r, fill, mid) {
    let s = '';
    for (let k = 0; k < 5; k++) {
      const a = (-90 + k * 72) * Math.PI / 180;
      s += `<circle cx="${r2(x + Math.cos(a) * r * .55)}" cy="${r2(y + Math.sin(a) * r * .55)}" r="${r2(r * .5)}" fill="${fill}"/>`;
    }
    return s + `<circle cx="${x}" cy="${y}" r="${r2(r * .26)}" fill="${mid || '#D9A64B'}"/>`;
  }
  function star(x, y, R, r) {
    const p = [];
    for (let k = 0; k < 10; k++) { const a = (-90 + k * 36) * Math.PI / 180, q = k % 2 ? r : R; p.push(r2(x + Math.cos(a) * q) + ' ' + r2(y + Math.sin(a) * q)); }
    return 'M' + p.join(' L') + ' Z';
  }
  const heart = (x, y, s) => `M${r2(x)} ${r2(y + s * .85)} C${r2(x - s * 1.25)} ${r2(y + s * .05)} ${r2(x - s * .85)} ${r2(y - s * .95)} ${r2(x)} ${r2(y - s * .3)} C${r2(x + s * .85)} ${r2(y - s * .95)} ${r2(x + s * 1.25)} ${r2(y + s * .05)} ${r2(x)} ${r2(y + s * .85)} Z`;
  // 네 갈래 반짝이
  const sparkle = (x, y, s) => `M${x} ${r2(y - s)} Q${x} ${y} ${r2(x + s)} ${y} Q${x} ${y} ${x} ${r2(y + s)} Q${x} ${y} ${r2(x - s)} ${y} Q${x} ${y} ${x} ${r2(y - s)} Z`;
  // 목선(39,87)–(60,101)–(81,87) 위의 점
  const collar = t => [r2((1 - t) * (1 - t) * 39 + 2 * (1 - t) * t * 60 + t * t * 81), r2((1 - t) * (1 - t) * 87 + 2 * (1 - t) * t * 101 + t * t * 87)];

  /* ---------- 털색 ---------- */
  const FUR = {
    'fur-cream': { head: '#FFF3EC', ear: '#F6BFD2', earIn: '#F1A6C0', tail: '#F6BFD2', paw: '#FFF3EC', line: '#9A7A90' },
    'fur-cheese': {
      head: '#FAD3A0', ear: '#F2B475', earIn: '#F8C6CF', tail: '#F2B475', tailStripe: '#E0935A', paw: '#FFF3EC', line: '#B0826A',
      pattern: () => `<path d="M60 26 v9.5 M51.5 28 l1.8 7.6 M68.5 28 l-1.8 7.6" stroke="#E59A5C" stroke-width="2.6" stroke-linecap="round"/><path d="M22 54 h8.5 M22.5 60.5 h7 M98 54 h-8.5 M97.5 60.5 h-7" stroke="#E59A5C" stroke-width="2.2" stroke-linecap="round"/><ellipse cx="60" cy="72" rx="15" ry="10" fill="#FFF3EC"/>`
    },
    'fur-gray': {
      head: '#C5CEDF', ear: '#AFB9CD', earIn: '#F1C3D2', tail: '#AFB9CD', paw: '#DCE2EC', line: '#7D869B', eye: '#9CCB8E',
      pattern: () => `<ellipse cx="60" cy="71" rx="14" ry="9.5" fill="#DCE2EC"/>`
    },
    'fur-calico': {
      head: '#FFF7F0', ear: '#F2A65A', ear2: '#5A4048', earIn: '#F6BFD2', tail: '#F2A65A', tailTip: '#5A4048', paw: '#FFF7F0', line: '#9A7A90',
      pattern: () => `<path d="M20 28 C34 24 44 32 42 44 C40 53 30 55 20 52 Z" fill="#F2A65A"/><path d="M100 30 C90 26 78 31 79 40 C80 47 90 49 100 46 Z" fill="#5A4048"/><path d="M52 27 C57 25 63 26 66 30 C63 34 56 34 52 31 Z" fill="#F2A65A"/>`
    },
    'fur-tuxedo': {
      head: '#3D3340', ear: '#3D3340', earIn: '#E39AB4', tail: '#3D3340', paw: '#FFF7F0', line: '#E9DDE5', eye: '#EBC45E', mouth: '#47203A', dark: true,
      pattern: () => `<path d="M60 41 C57 49 53 57 50.5 65 C42 69 40 80 46 86 C52 92 68 92 74 86 C80 80 78 69 69.5 65 C67 57 63 49 60 41 Z" fill="#FFF7F0"/>`,
      chest: () => `<ellipse cx="60" cy="108" rx="11" ry="16" fill="#FFF7F0"/>`
    },
    'fur-black': {
      head: '#2F2631', ear: '#2F2631', earIn: '#B97890', tail: '#2F2631', paw: '#2F2631', pawLine: 'rgba(255,255,255,.14)', pawToe: 'rgba(255,255,255,.4)',
      line: '#BFAABA', eye: '#EBC45E', mouth: '#E4D6E0', blush: 'rgba(226,122,155,.6)', dark: true
    },
    'fur-siamese': {
      head: '#F7EEDF', ear: '#6E5046', earIn: '#B98C7C', tail: '#E9DAC4', tailTip: '#6E5046', paw: '#6E5046', pawToe: 'rgba(255,255,255,.4)', line: '#9A7A90', eye: '#7DB4E4', mouth: '#2E1E24',
      defs: c => `<radialGradient id="${c.u}sm"><stop offset="0" stop-color="#7A5A4E" stop-opacity=".95"/><stop offset=".55" stop-color="#7A5A4E" stop-opacity=".7"/><stop offset="1" stop-color="#7A5A4E" stop-opacity="0"/></radialGradient>`,
      pattern: c => `<ellipse cx="60" cy="66" rx="25" ry="20" fill="url(#${c.u}sm)"/>`
    }
  };

  /* ---------- 아이템 ---------- */
  const WAGASA_RIBS = (() => { let s = ''; for (let k = 0; k < 16; k++) { const a = k * Math.PI / 8; s += `M92 34 L${r2(92 + Math.cos(a) * 25.5)} ${r2(34 + Math.sin(a) * 25.5)} `; } return s.trim(); })();
  const ITEMS = [
    /* 모자 */
    { id: 'h-none', slot: 'hat', name: '모자 없음', price: 0 },
    { id: 'h-lobby', slot: 'hat', name: '로비보이 캡', en: 'Lobby boy cap', price: 0, desc: '호텔 로비보이의 분홍 필박스 모자. 냥의 기본 차림이에요.',
      draw: () => `<g transform="rotate(-6 60 30)"><rect x="42" y="11" width="36" height="21" rx="4" fill="#D6487D"/><rect x="42" y="25.5" width="36" height="5" fill="#D9A64B"/><rect x="40" y="30" width="40" height="4.6" rx="2.3" fill="#B93A68"/><path d="M47 15.5 h9" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/></g>` },
    { id: 'h-chef', slot: 'hat', name: '멘들스 제빵사 모자', en: 'Pâtissier hat', price: 60, desc: '멘들스 제과점의 하얀 조리모. 분홍 띠가 포인트예요.',
      draw: () => `<g stroke="#EADCD6" stroke-width=".8"><circle cx="47.5" cy="17" r="9" fill="#FFFDF9"/><circle cx="72.5" cy="17" r="9" fill="#FFFDF9"/><circle cx="60" cy="11.5" r="10.5" fill="#FFFDF9"/><rect x="43" y="18.5" width="34" height="14" rx="2.5" fill="#FFFDF9"/></g><rect x="43.4" y="25" width="33.2" height="3.2" fill="#F1A6C0"/>` },
    { id: 'h-beret', slot: 'hat', name: '라일락 베레모', en: 'Beret', price: 80, desc: '살짝 기울여 쓴 화가의 베레모. 그래프 그리는 날에 딱.',
      draw: () => `<g transform="rotate(-10 60 28)"><ellipse cx="60" cy="26.5" rx="25" ry="9.5" fill="#B79ADF"/><ellipse cx="60" cy="30.4" rx="21" ry="3.4" fill="#9D7FCB"/><path d="M60 17.4 q.8 -3.8 3.6 -4.4" stroke="#9D7FCB" stroke-width="2.4" stroke-linecap="round" fill="none"/><path d="M45 23 q7 -5 16 -5.5" stroke="#fff" stroke-opacity=".3" stroke-width="2" stroke-linecap="round" fill="none"/></g>` },
    { id: 'h-straw', slot: 'hat', name: '밀짚모자', en: 'Straw hat', price: 100, desc: '여름 방학 느낌의 밀짚모자. 분홍 리본을 둘렀어요.',
      draw: () => `<ellipse cx="60" cy="30" rx="40" ry="8.5" fill="#F3D79B" stroke="#DDB86C" stroke-width=".8"/><path d="M41 30 C41 11 79 11 79 30 Z" fill="#F3D79B" stroke="#DDB86C" stroke-width=".8"/><path d="M45 20 Q60 15 75 20 M42.5 25 Q60 20 77.5 25" stroke="#E3C07A" stroke-width=".7" fill="none" stroke-dasharray="2 1.6"/><path d="M41.2 26.4 Q60 30 78.8 26.4 L79 30.6 Q60 34 41 30.6 Z" fill="#D6487D"/><path d="M76 29 l7 -4 l.6 4.4 z M76 29.6 l6 4.6 l-2.8 2 z" fill="#D6487D"/>` },
    { id: 'h-hachimaki', slot: 'hat', name: 'A+ 머리띠', en: 'A+ headband', price: 120, desc: '시험 전날 밤의 필승 머리띠. 이마에 크게 A+!',
      draw: c => `<g clip-path="url(#${c.u}h)"><path d="M16 34 Q60 25 104 34 L104 43.5 Q60 34.5 16 43.5 Z" fill="#FFFDF9"/><path d="M16 34 Q60 25 104 34 M16 43.5 Q60 34.5 104 43.5" stroke="#EADCD6" stroke-width=".8" fill="none"/></g><text x="60" y="40.4" text-anchor="middle" font-size="9" font-weight="800" fill="#D6487D" font-family="${DISP}">A+</text><path d="M91 35.5 l10 -8 l2.4 3.6 z M91 37 l11.5 1.5 l-1.2 4 z" fill="#FFFDF9" stroke="#EADCD6" stroke-width=".6"/><circle cx="91" cy="36.4" r="2.6" fill="#FFFDF9" stroke="#EADCD6" stroke-width=".6"/>` },
    { id: 'h-grad', slot: 'hat', name: '학사모', en: 'Graduation cap', price: 150, desc: '합격 다음은 졸업! 금색 술이 달린 학사모.',
      draw: () => `<path d="M44 31 V22 Q60 26 76 22 V31 Q60 35 44 31 Z" fill="#47203A"/><path d="M60 8 L91 17 L60 26 L29 17 Z" fill="#5A2E4B"/><path d="M60 8 L91 17 L60 19 L29 17 Z" fill="#6E3C5E"/><circle cx="60" cy="17" r="1.7" fill="#D9A64B"/><path d="M60 17 L85 19.5 L86.5 31" stroke="#D9A64B" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M84.6 30.5 h3.8 l1 7 h-5.8 z" fill="#D9A64B"/>` },
    { id: 'h-courtesan', slot: 'hat', name: '쿠르티잔 오 쇼콜라', en: 'Courtesan au chocolat', price: 200, desc: '멘들스의 명물, 3단 슈 과자. 라일락·분홍·민트 글레이즈에 카카오 한 알.',
      draw: () => `<ellipse cx="60" cy="28" rx="15.5" ry="8" fill="#EBC99E"/><ellipse cx="60" cy="25.5" rx="14.5" ry="6.4" fill="#CDB6EC"/><ellipse cx="60" cy="20.3" rx="9.5" ry="2.4" fill="#FFFDF9"/><ellipse cx="60" cy="16.8" rx="10" ry="5.6" fill="#EBC99E"/><ellipse cx="60" cy="15" rx="9.4" ry="4.6" fill="#F6BFD2"/><ellipse cx="60" cy="11" rx="6" ry="1.8" fill="#FFFDF9"/><circle cx="60" cy="8.2" r="5.2" fill="#EBC99E"/><ellipse cx="60" cy="7.2" rx="5" ry="3.9" fill="#BFE6D6"/><ellipse cx="60" cy="2.6" rx="1.6" ry="2.3" fill="#6B4331"/><path d="M50 23.5 q4 -2.4 8 -2.6 M53.5 13.6 q3 -1.6 5.5 -1.8" stroke="#fff" stroke-opacity=".55" stroke-width="1.3" stroke-linecap="round" fill="none"/>` },
    { id: 'h-tiara', slot: 'hat', name: '핑크 하트 티아라', en: 'Pink heart tiara', price: 400, desc: '부티크에서 가장 비싼 보물. 하트 보석이 박힌 공주님 티아라예요. 꾸준히 모아야 살 수 있어요.',
      draw: () => `<g transform="rotate(-4 60 26)"><path d="M43 30.5 Q60 24.5 77 30.5 L75.8 33.6 Q60 28 44.2 33.6 Z" fill="#E6E0EE" stroke="#B9AFC8" stroke-width=".7"/><path d="M44 30.6 Q45.5 22.5 50 27.2 Q52.5 16.5 57 23.6 Q60 9.5 63 23.6 Q67.5 16.5 70 27.2 Q74.5 22.5 76 30.6 Q60 25.2 44 30.6 Z" fill="#F7F4FA" stroke="#B9AFC8" stroke-width=".8" stroke-linejoin="round"/><path d="${heart(60, 21.4, 3.8)}" fill="#E0457F" stroke="#B93A68" stroke-width=".6"/><circle cx="58.8" cy="20" r=".9" fill="#fff" opacity=".8"/><circle cx="50.2" cy="26.4" r="1.5" fill="#F6BFD2"/><circle cx="69.8" cy="26.4" r="1.5" fill="#F6BFD2"/><circle cx="60" cy="11.4" r="1.6" fill="#FFFFFF" stroke="#D9CFE4" stroke-width=".5"/><circle cx="52.3" cy="17.6" r="1.1" fill="#FFFFFF" stroke="#D9CFE4" stroke-width=".4"/><circle cx="67.7" cy="17.6" r="1.1" fill="#FFFFFF" stroke="#D9CFE4" stroke-width=".4"/><path d="M82 15 l1 2.4 l2.4 1 l-2.4 1 l-1 2.4 l-1 -2.4 l-2.4 -1 l2.4 -1 z" fill="#F6DF95"/><path d="M37 19 l.7 1.6 l1.6 .7 l-1.6 .7 l-.7 1.6 l-.7 -1.6 l-1.6 -.7 l1.6 -.7 z" fill="#F6BFD2"/></g>` },
    { id: 'h-crown', slot: 'hat', name: '핑크 다이아 왕관', en: 'Pink diamond crown', ach: 'crown', desc: '빠른 모의고사 만점자에게만 주어지는 왕관. 로즈골드 틀에 하트 다이아와 진주를 두르고, 머리 위로 분홍빛 후광이 반짝여요.',
      draw: {
        back: c => `<defs><radialGradient id="${c.u}cgl"><stop offset="0" stop-color="#FFD0E3" stop-opacity=".95"/><stop offset=".6" stop-color="#FFC2DA" stop-opacity=".45"/><stop offset="1" stop-color="#FFC2DA" stop-opacity="0"/></radialGradient></defs><ellipse cx="60" cy="20" rx="42" ry="24" fill="url(#${c.u}cgl)"/>`,
        main: c => `<defs><linearGradient id="${c.u}cm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE6F0"/><stop offset=".55" stop-color="#F7A6C7"/><stop offset="1" stop-color="#E06A9C"/></linearGradient><linearGradient id="${c.u}cv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E4579A"/><stop offset="1" stop-color="#A5245D"/></linearGradient><radialGradient id="${c.u}cj" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#FFE9F3"/><stop offset=".35" stop-color="#FF6FAA"/><stop offset="1" stop-color="#B0175B"/></radialGradient></defs>`
          + `<g transform="rotate(-6 60 24)"><path d="M44 28 C43 5 77 5 76 28 Z" fill="url(#${c.u}cv)"/>`
          + `<path d="M41 32 L38.5 14.5 L47.5 22 L51 9.5 L55.8 20.5 L60 4.2 L64.2 20.5 L69 9.5 L72.5 22 L81.5 14.5 L79 32 Z" fill="url(#${c.u}cm)" stroke="#C94A82" stroke-width=".8" stroke-linejoin="round"/>`
          + `<path d="M40.4 17.5 L41.6 27 M51.6 13 L53.4 20.4 M60 8.6 V17.8 M68.4 13 L66.6 20.4" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".6"/>`
          + `<path d="M40.6 27 Q60 23.4 79.4 27 L79 33.2 Q60 29.6 41 33.2 Z" fill="#DE5F95" stroke="#B93A68" stroke-width=".6"/>`
          + [43.8, 47.8, 51.8, 68.2, 72.2, 76.2].map(x => { const u = (x - 60) / 19.4; return `<circle cx="${x}" cy="${r2(30.1 - 1.8 * (1 - u * u))}" r="1.25" fill="#FFF8FB" stroke="#F0C3D6" stroke-width=".35"/>`; }).join('')
          + `<path d="${heart(60, 29.4, 2.7)}" fill="#FF8DB8" stroke="#B93A68" stroke-width=".45"/>`
          + `<path d="${heart(60, 16.6, 4.9)}" fill="url(#${c.u}cj)" stroke="#9E1650" stroke-width=".6"/><path d="M57.4 14.8 q1 -1.6 2.4 -1.2" stroke="#fff" stroke-width="1" fill="none" stroke-linecap="round" opacity=".9"/>`
          + [50, 70].map(x => `<path d="M${x} 20 L${x + 2.3} 23 L${x} 26 L${x - 2.3} 23 Z" fill="url(#${c.u}cj)" stroke="#B93A68" stroke-width=".45"/><path d="M${x - 2.3} 23 H${x + 2.3} M${x} 20 V26" stroke="#FFE3EF" stroke-width=".35" opacity=".8"/>`).join('')
          + [[38.5, 14.5], [51, 9.5], [69, 9.5], [81.5, 14.5]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="2" fill="#FFF8FB" stroke="#EDB8CF" stroke-width=".5"/><circle cx="${p[0] - .6}" cy="${p[1] - .6}" r=".6" fill="#fff"/>`).join('')
          + `<circle cx="60" cy="4.2" r="2.3" fill="url(#${c.u}cj)" stroke="#9E1650" stroke-width=".45"/></g>`
          + `<path d="${sparkle(31, 10, 3.6)} ${sparkle(90, 5.5, 2.8)}" fill="#FFF3C4"/><path d="${sparkle(92, 25, 2.2)} ${sparkle(27, 26, 2)} ${sparkle(76, 2.8, 1.5)}" fill="#FFFFFF"/><circle cx="36" cy="4.6" r=".9" fill="#FFB3D0"/><circle cx="96" cy="15" r=".8" fill="#FFB3D0"/>`
      } },

    /* 얼굴 */
    { id: 'f-none', slot: 'face', name: '맨얼굴', price: 0 },
    { id: 'f-zero', slot: 'face', name: '제로의 연필 콧수염', en: 'Pencil moustache', price: 40, desc: '영화 속 로비보이 제로처럼, 연필로 그린 가느다란 콧수염.',
      draw: c => `<path d="M49 69.8 Q54.5 67.2 59.4 68.8 M60.6 68.8 Q65.5 67.2 71 69.8" stroke="${c.f.mouth || '#47203A'}" stroke-width="1.05" fill="none" stroke-linecap="round"/>` },
    { id: 'f-round', slot: 'face', name: '동그란 공부 안경', en: 'Round glasses', price: 50, desc: '수식이 또렷하게 보이는 금테 동그란 안경.',
      draw: () => `<g fill="rgba(255,255,255,.22)" stroke="#B8862E" stroke-width="1.8"><circle cx="46" cy="60" r="8.2"/><circle cx="74" cy="60" r="8.2"/></g><path d="M54.2 59 Q60 56 65.8 59" stroke="#B8862E" stroke-width="1.6" fill="none"/><path d="M37.8 58 L25 55 M82.2 58 L95 55" stroke="#B8862E" stroke-width="1.4" stroke-linecap="round"/><path d="M41 56 q2 -2 4.5 -2.4 M69 56 q2 -2 4.5 -2.4" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".7" fill="none"/>` },
    { id: 'f-monocle', slot: 'face', name: '신사의 외알 안경', en: 'Monocle', price: 90, desc: '컨시어지 구스타브 씨가 좋아할 만한 금테 외알 안경.',
      draw: () => `<circle cx="74" cy="60" r="8.6" fill="rgba(255,255,255,.2)" stroke="#D9A64B" stroke-width="2"/><path d="M69.5 56 q2 -2 4.5 -2.4" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".7" fill="none"/><path d="M81.5 64.5 Q92 80 79 95" stroke="#D9A64B" stroke-width=".95" fill="none" stroke-dasharray="1.6 1.1" stroke-linecap="round"/>` },
    { id: 'f-heart', slot: 'face', name: '하트 선글라스', en: 'Heart sunglasses', price: 120, desc: '만점 받은 날 쓰는 하트 선글라스.',
      draw: () => `<g fill="#D6487D" fill-opacity=".92" stroke="#B93A68" stroke-width="1"><path d="${heart(45.5, 60, 10.5)}"/><path d="${heart(74.5, 60, 10.5)}"/></g><path d="M54.5 56.4 Q60 54 65.5 56.4" stroke="#B93A68" stroke-width="1.6" fill="none"/><path d="M36.4 56 L24 53 M83.6 56 L96 53" stroke="#B93A68" stroke-width="1.4" stroke-linecap="round"/><ellipse cx="41.4" cy="57" rx="2.2" ry="1.4" fill="#fff" opacity=".6"/><ellipse cx="70.4" cy="57" rx="2.2" ry="1.4" fill="#fff" opacity=".6"/>` },
    { id: 'f-kitsune', slot: 'face', name: '여우 가면', en: 'Fox mask', price: 160, desc: '여름 축제 노점에서 산 여우 가면. 머리 옆에 비스듬히 썼어요.',
      draw: { top: () => `<g transform="translate(30 38) rotate(-22) scale(1.3)"><path d="M-12 -3 L-10.5 -16 L-4 -8.5 H4 L10.5 -16 L12 -3 Q11.5 9 0 14.5 Q-11.5 9 -12 -3 Z" fill="#FFFDF9" stroke="#E4D3CC" stroke-width=".8" stroke-linejoin="round"/><path d="M-9.4 -12.6 L-6.4 -9.2 M9.4 -12.6 L6.4 -9.2" stroke="#D6487D" stroke-width="1.8" stroke-linecap="round"/><path d="M-8.2 -1.2 Q-5.2 -3.8 -2.2 -1.2 M2.2 -1.2 Q5.2 -3.8 8.2 -1.2" stroke="#C43A45" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M0 -8.6 q-2.2 3 0 5.4 q2.2 -2.4 0 -5.4 z" fill="#C43A45"/><path d="M-5.5 4.4 l-3.8 1.2 M5.5 4.4 l3.8 1.2 M-5 6.6 l-3 2 M5 6.6 l3 2" stroke="#C43A45" stroke-width=".9" stroke-linecap="round"/><ellipse cx="0" cy="11" rx="1.7" ry="1.2" fill="#47203A"/></g>` } },

    /* 목 */
    { id: 'n-none', slot: 'neck', name: '목 장식 없음', price: 0 },
    { id: 'n-bell', slot: 'neck', name: '방울 목걸이', en: 'Bell collar', price: 40, desc: '딸랑딸랑. 고양이라면 하나쯤 있는 빨간 방울 목걸이.',
      draw: () => `<path d="M39 87 Q60 101 81 87" stroke="#C43A45" stroke-width="4.2" fill="none" stroke-linecap="round"/><circle cx="60" cy="99" r="5.2" fill="#E8C15A" stroke="#B8862E" stroke-width=".8"/><path d="M55.4 99.4 h9.2" stroke="#B8862E" stroke-width=".8"/><circle cx="60" cy="102" r="1.05" fill="#8A6424"/><path d="M60 102 v2.4" stroke="#8A6424" stroke-width=".8"/><circle cx="58.2" cy="97.2" r="1.3" fill="#fff" opacity=".7"/>` },
    { id: 'n-bowtie', slot: 'neck', name: '분홍 나비넥타이', en: 'Bow tie', price: 60, desc: '호텔 직원의 기본, 반듯한 분홍 나비넥타이.',
      draw: () => `<path d="M60 96 L49.5 90.5 Q47.5 96 49.5 101.5 Z M60 96 L70.5 90.5 Q72.5 96 70.5 101.5 Z" fill="#D6487D"/><path d="M52 93.4 L56 95 M52 98.6 L56 97" stroke="#B93A68" stroke-width=".8" stroke-linecap="round"/><path d="M68 93.4 L64 95 M68 98.6 L64 97" stroke="#B93A68" stroke-width=".8" stroke-linecap="round"/><rect x="57.4" y="93.2" width="5.2" height="5.6" rx="1.6" fill="#B93A68"/>` },
    { id: 'n-bib', slot: 'neck', name: '빨간 턱받이', en: 'Red bib', price: 70, desc: '길가의 지장보살님처럼 두른 빨간 턱받이. 벚꽃 자수가 있어요.',
      draw: () => `<path d="M41 88 Q60 97 79 88 Q81 110 60 116.5 Q39 110 41 88 Z" fill="#D9434E"/><path d="M43.5 91 Q60 99 76.5 91 Q77.5 108 60 113.5 Q42.5 108 43.5 91 Z" fill="none" stroke="#F4B8C0" stroke-width=".8" stroke-dasharray="1.6 1.4"/>${flower(60, 105.5, 4, '#FDEBF0', '#D9A64B')}` },
    { id: 'n-scarf', slot: 'neck', name: '민트 목도리', en: 'Knit scarf', price: 90, desc: '도서관이 추울 때 두르는 폭신한 줄무늬 목도리.',
      draw: () => `<path d="M69 97 L75.5 123 L84 121 L78.5 94.5 Z" fill="#8FCDB8"/><path d="M71.6 106.6 L80.4 104.4 M73.4 114 L82 112" stroke="#FFF9F4" stroke-width="2.2"/><path d="M76 123 l-.4 3.2 M79 122.4 l0 3.2 M82 121.6 l.4 3.2" stroke="#8FCDB8" stroke-width="1.3" stroke-linecap="round"/><path d="M37 85 Q60 102 83 85 L85 93 Q60 111 35 93 Z" fill="#8FCDB8"/><path d="M36.6 89.2 Q60 106 83.8 89.2" stroke="#FFF9F4" stroke-width="2.2" fill="none"/><path d="M42 91 l1 3 M48 94.6 l.8 3 M54 96.6 l.5 3 M66 96.6 l-.5 3 M72 94.6 l-.8 3 M78 91 l-1 3" stroke="#6FB39C" stroke-width=".8" stroke-linecap="round"/>` },
    { id: 'n-keys', slot: 'neck', name: '핑크 하트 보석 목걸이', en: 'Pink heart jewel necklace', ach: 'keys', desc: '45개 객실에 모두 도장을 찍은 사람의 증표. 진주 목걸이 끝에 커다란 핑크 하트 보석이 반짝여요.',
      draw: c => `<defs><radialGradient id="${c.u}nj" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="#FFE9F3"/><stop offset=".4" stop-color="#F7559A"/><stop offset="1" stop-color="#AE1A5C"/></radialGradient></defs>`
        + [0, .08, .16, .24, .32, .4, .6, .68, .76, .84, .92, 1].map((t, k) => { const p = collar(t); return k === 3 || k === 8 ? `<circle cx="${p[0]}" cy="${p[1]}" r="1.7" fill="#F7559A" stroke="#B93A68" stroke-width=".4"/>` : `<circle cx="${p[0]}" cy="${p[1]}" r="1.9" fill="#FFF8FB" stroke="#EBC3D4" stroke-width=".45"/><circle cx="${r2(p[0] - .6)}" cy="${r2(p[1] - .6)}" r=".55" fill="#fff"/>`; }).join('')
        + `<circle cx="60" cy="95.6" r="1.7" fill="none" stroke="#E9A3B8" stroke-width="1"/><path d="${heart(60, 104.4, 8.8)}" fill="#F9D5E3" stroke="#E08FB0" stroke-width=".7"/><path d="${heart(60, 104.4, 7.4)}" fill="url(#${c.u}nj)" stroke="#9E1650" stroke-width=".6"/><path d="${heart(60, 104, 4.2)}" fill="none" stroke="#fff" stroke-width=".6" opacity=".45"/><ellipse cx="55.8" cy="100.6" rx="2" ry="1.1" transform="rotate(-35 55.8 100.6)" fill="#fff" opacity=".85"/>`
        + `<path d="${sparkle(71.5, 99, 2.8)}" fill="#FFF3C4"/><path d="${sparkle(48, 110, 2)}" fill="#FFFFFF"/>` },
    { id: 'n-goldbell', slot: 'neck', name: 'A+ 펜던트', en: 'A+ pendant', ach: 'streak', desc: '7일 연속으로 들른 단골손님에게 드리는 A+ 펜던트. 분홍 에나멜 위에 금빛 A+가 새겨져 있어요.',
      draw: c => `<defs><radialGradient id="${c.u}na" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#FF9CC4"/><stop offset="1" stop-color="#D23A73"/></radialGradient></defs>`
        + `<path d="M39 87 Q60 101 81 87" stroke="#D9A64B" stroke-width="1.7" fill="none" stroke-linecap="round"/><path d="M39 87 Q60 101 81 87" stroke="#FFF1BF" stroke-width=".7" fill="none" stroke-dasharray="1.2 1.3"/>`
        + `<rect x="58.4" y="93" width="3.2" height="4.2" rx="1.2" fill="#E8C15A" stroke="#B8862E" stroke-width=".5"/>`
        + `<circle cx="60" cy="105" r="9" fill="#E8C15A" stroke="#B8862E" stroke-width=".9"/><circle cx="60" cy="105" r="8" fill="none" stroke="#F6DF95" stroke-width=".7" stroke-dasharray=".1 1.6" stroke-linecap="round"/><circle cx="60" cy="105" r="6.6" fill="url(#${c.u}na)" stroke="#B8862E" stroke-width=".5"/>`
        + `<text x="60" y="108.6" text-anchor="middle" font-size="9.4" font-weight="800" fill="#FFF3C4" stroke="#B8862E" stroke-width=".35" paint-order="stroke" font-family="${DISP}">A+</text><path d="M55.4 101.4 q1.8 -2 4.4 -2.2" stroke="#fff" stroke-width=".9" fill="none" stroke-linecap="round" opacity=".7"/>`
        + `<path d="${sparkle(71, 98.5, 2.6)}" fill="#FFF3C4"/><path d="${sparkle(49, 111, 1.8)}" fill="#FFFFFF"/>` },

    /* 옷 */
    { id: 'o-none', slot: 'outfit', name: '맨몸', price: 0 },
    { id: 'o-lobby', slot: 'outfit', name: '로비보이 유니폼', en: 'Lobby boy uniform', price: 0, desc: '보라색 재킷에 금단추. 냥의 기본 근무복이에요.',
      draw: () => `<path d="${TORSO}" fill="#B79ADF"/><rect x="52.5" y="86" width="15" height="46" fill="#8E6BC9"/><path d="M40 96 Q60 106 80 96" stroke="#D9A64B" stroke-width="2.2" fill="none"/><circle cx="60" cy="102" r="2.2" fill="#D9A64B"/><circle cx="60" cy="111" r="2.2" fill="#D9A64B"/><circle cx="60" cy="120" r="2.2" fill="#D9A64B"/><path d="M39.5 108 q-2 10 0 21 M80.5 108 q2 10 0 21" stroke="#9F82D3" stroke-width="1.2" fill="none"/>` },
    { id: 'o-apron', slot: 'outfit', name: '멘들스 앞치마', en: 'Mendl\x27s apron', price: 80, desc: '멘들스 제과점 직원의 분홍 앞치마. 파란 로고가 박혀 있어요.',
      draw: () => `<path d="${TORSO}" fill="#FFFDF9"/><path d="M34 111 H86" stroke="#8FB3DE" stroke-width="3"/><path d="M46 88 L46 98 M74 88 L74 98" stroke="#F6BFD2" stroke-width="2.6"/><path d="M45 98 Q60 95 75 98 L78 131 H42 Z" fill="#F6BFD2"/><path d="M45.5 98 Q60 95 74.5 98" stroke="#fff" stroke-width="2.4" stroke-dasharray=".1 3" stroke-linecap="round" fill="none"/><text x="60" y="108.6" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic" font-weight="600" font-size="6.4" fill="#5B7DB8">Mendl's</text><rect x="53" y="115" width="14" height="9" rx="2" fill="#F1A6C0"/>` },
    { id: 'o-hoodie', slot: 'outfit', name: '밤샘 후드티', en: 'Hoodie', price: 120, desc: '벼락치기 밤에 입는 폭신한 분홍 후드티. 주머니에 하트.',
      draw: () => `<path d="${TORSO}" fill="#F1A6C0"/><path d="M38 92 Q60 110 82 92 L84 99 Q60 117 36 99 Z" fill="#E48DAE"/><path d="M55.5 101 v11 M64.5 101 v11" stroke="#FFF9F4" stroke-width="1.5" stroke-linecap="round"/><circle cx="55.5" cy="112.6" r="1.3" fill="#FFF9F4"/><circle cx="64.5" cy="112.6" r="1.3" fill="#FFF9F4"/><path d="M44 131 L47.5 117.5 H72.5 L76 131 Z" fill="#E48DAE"/><path d="${heart(60, 123.4, 3.4)}" fill="#FFF9F4"/>` },
    { id: 'o-sailor', slot: 'outfit', name: '세일러복', en: 'Sailor uniform', price: 150, desc: '남색 깃에 분홍 스카프. 일본 교복의 정석.',
      draw: () => `<path d="${TORSO}" fill="#FFFDF9"/><path d="M32 91 H88 V104 L60 125.5 L32 104 Z" fill="#3B4A7A"/><path d="M44 91 L60 113 L76 91 Z" fill="#FFFDF9"/><path d="M36.5 101.5 L60 120.6 L83.5 101.5" stroke="#FFFDF9" stroke-width="1.2" fill="none"/><path d="M60 112.4 L51 107.8 V117 Z M60 112.4 L69 107.8 V117 Z" fill="#D6487D"/><path d="M58.4 113.4 L55 124.6 L58.2 123.4 L60 115.6 L61.8 123.4 L65 124.6 L61.6 113.4 Z" fill="#D6487D"/><circle cx="60" cy="112.4" r="2.4" fill="#B93A68"/>` },
    { id: 'o-yukata', slot: 'outfit', name: '유카타', en: 'Yukata', price: 180, desc: '불꽃놀이 가는 날의 남색 유카타와 분홍 오비.',
      draw: () => `<path d="${TORSO}" fill="#3F4E8F"/>${flower(42.5, 101, 3.2, '#E3E8F8', '#F1A6C0')}${flower(78, 104, 2.8, '#E3E8F8', '#F1A6C0')}${flower(46, 125.5, 3, '#E3E8F8', '#F1A6C0')}${flower(75, 126, 3.4, '#E3E8F8', '#F1A6C0')}<path d="M47 89 L60 112" stroke="#F7F3EE" stroke-width="3.2"/><path d="M74.4 90.6 L57.6 116.6" stroke="#2F3C72" stroke-width="1.2"/><path d="M73 89 L56 116" stroke="#F7F3EE" stroke-width="3.2"/><rect x="30" y="111" width="60" height="9" fill="#F1A6C0"/><path d="M30 115.5 H90" stroke="#D9A64B" stroke-width="1.3"/><circle cx="60" cy="115.5" r="2" fill="#D9A64B"/>` },
    { id: 'o-furisode', slot: 'outfit', name: '벚꽃 후리소데', en: 'Cherry blossom kimono', ach: 'points', desc: '족보를 전부 외운 날을 기념하는 벚꽃 기모노와 금색 오비.',
      draw: () => `<path d="${TORSO}" fill="#F8C2D4"/>${flower(41.5, 100, 4, '#FFFDF9', '#D6487D')}${flower(78.5, 103, 3.4, '#FFFDF9', '#D6487D')}${flower(45, 126, 3.6, '#FDEBF0', '#D9A64B')}${flower(75, 126, 4.2, '#FFFDF9', '#D6487D')}<path d="M47 89 L60 112" stroke="#C43A45" stroke-width="3.6"/><path d="M45.7 89.8 L58.7 112.8" stroke="#FFFDF9" stroke-width="1.3"/><path d="M73 89 L56 116" stroke="#C43A45" stroke-width="3.6"/><path d="M74.4 89.8 L57.4 116.8" stroke="#FFFDF9" stroke-width="1.3"/><rect x="30" y="110" width="60" height="10.5" fill="#D9A64B"/><path d="M30 112.4 H90 M30 118 H90" stroke="#F3D58F" stroke-width=".8"/><path d="M30 115.2 H90" stroke="#D6487D" stroke-width="1.7"/><circle cx="60" cy="115.2" r="2.3" fill="#D6487D"/>` },
    { id: 'o-princess', slot: 'outfit', name: '핑크 공주 드레스', en: 'Pink princess gown', ach: 'quizall', desc: '45개 객실 퀵 체크를 전부 만점 받은 사람만 입을 수 있는 퍼프 소매 볼가운. 치맛자락이 두 겹이에요.',
      draw: {
        main: () => `<path d="M33 104 Q40 95.5 49 98.5 Q56 100.5 60 104 Q64 100.5 71 98.5 Q80 95.5 87 104 L92 134 H28 Z" fill="#F4A9C4"/><path d="M53 104 Q56 118 55 132 M67 104 Q64 118 65 132" stroke="#F9C6D8" stroke-width="2.4" fill="none"/><path d="M33.5 103.6 Q40 96 49 99 Q56 101 60 104.4 Q64 101 71 99 Q80 96 86.5 103.6" stroke="#FFFFFF" stroke-width="2.2" stroke-dasharray=".1 2.6" stroke-linecap="round" fill="none"/><path d="M44 92.5 Q60 101 76 92.5" stroke="#FFFFFF" stroke-width="2.3" stroke-dasharray=".1 3.1" stroke-linecap="round" fill="none"/><circle cx="60" cy="97.6" r="1.9" fill="#FFFFFF" stroke="#E7C9D6" stroke-width=".5"/>`,
        over: () => `<ellipse cx="38.5" cy="101" rx="7.2" ry="6.2" fill="#F9C6D8" stroke="#EFA0BD" stroke-width=".8"/><ellipse cx="81.5" cy="101" rx="7.2" ry="6.2" fill="#F9C6D8" stroke="#EFA0BD" stroke-width=".8"/><path d="M34.5 99 q3 -3 6.5 -2.6 M77.5 99 q3 -3 6.5 -2.6" stroke="#fff" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".8"/><path d="M37 112 Q29 122 18 130.5 q7 5.5 14 0 q7 5.5 14 0 q7 5.5 14 0 q7 5.5 14 0 q7 5.5 14 0 q7 5.5 14 0 Q91 122 83 112 Z" fill="#F4A9C4" stroke="#E68AAE" stroke-width=".8"/><path d="M40 112 Q35 118.5 27.5 124 q5.5 4.6 11 0 q5.5 4.6 11 0 q5.5 4.6 11 0 q5.5 4.6 11 0 q5.5 4.6 11 0 q5.5 4.6 11 0 Q85 118.5 80 112 Z" fill="#FBD3E2" stroke="#F1AFC8" stroke-width=".7"/><path d="M21 131.4 q5.5 4.2 11 0 q5.5 4.2 11 0 q5.5 4.2 11 0 q5.5 4.2 11 0 q5.5 4.2 11 0 q5.5 4.2 11 0 q3.5 2.6 7 0" stroke="#FFFFFF" stroke-width="1.6" stroke-dasharray=".1 2.4" stroke-linecap="round" fill="none"/><path d="${heart(29, 128, 1.6)} ${heart(90, 128, 1.6)} ${heart(44, 120, 1.3)} ${heart(76, 120, 1.3)}" fill="#E0457F" opacity=".85"/><path d="M60 113 L50.5 108.5 Q48.8 113 50.5 117.5 Z M60 113 L69.5 108.5 Q71.2 113 69.5 117.5 Z" fill="#D6487D"/><path d="M58.6 114 L55.8 122.6 L58.4 121.6 L60 115.6 L61.6 121.6 L64.2 122.6 L61.4 114 Z" fill="#D6487D"/><circle cx="60" cy="113" r="2.3" fill="#B93A68"/><path d="M96 111 l.8 2 l2 .8 l-2 .8 l-.8 2 l-.8 -2 l-2 -.8 l2 -.8 z M22 115 l.7 1.6 l1.6 .7 l-1.6 .7 l-.7 1.6 l-.7 -1.6 l-1.6 -.7 l1.6 -.7 z" fill="#F6DF95"/>`
      } },

    /* 소품 */
    { id: 'p-none', slot: 'held', name: '빈손', price: 0 },
    { id: 'p-report', slot: 'held', name: 'A+ 성적표', en: 'A+ report card', price: 80, desc: '빨간 동그라미 안에 A+가 적힌 성적표. 이번 학기 목표를 미리 들고 다녀요.',
      draw: () => `<g transform="rotate(-6 60 113)"><rect x="41" y="99" width="38" height="28" rx="2" fill="#FFFDF9" stroke="#E7D9D2" stroke-width=".8"/><rect x="41" y="99" width="38" height="4.2" rx="2" fill="#F6BFD2"/><path d="M45.5 108.5 h14 M45.5 112.5 h11 M45.5 116.5 h14 M45.5 120.5 h9" stroke="#D9CFD6" stroke-width="1.2" stroke-linecap="round"/><circle cx="68.5" cy="114.5" r="8.4" fill="none" stroke="#D6487D" stroke-width="1.4"/><text x="68.5" y="118.6" text-anchor="middle" font-family="${DISP}" font-weight="800" font-size="11.4" fill="#D6487D">A+</text></g>` },
    { id: 'p-wand', slot: 'held', name: '별 요술봉', en: 'Star wand', price: 250, desc: '공주님 세트의 마무리. 끝에 달린 별이 반짝반짝, 틀린 문제도 다시 풀게 해 주는(것 같은) 요술봉.',
      draw: () => `<g transform="translate(69 129) rotate(28)"><rect x="-1.3" y="-40" width="2.6" height="40" rx="1.3" fill="#F7F4FA" stroke="#D9CFE4" stroke-width=".6"/><path d="M0 -36 l-5 -2.6 v5.2 z M0 -36 l5 -2.6 v5.2 z" fill="#F1A6C0"/><path d="${star(0, -47, 9, 4)}" fill="#F6DF95" stroke="#D9A64B" stroke-width=".9" stroke-linejoin="round"/><path d="${heart(0, -47.4, 2.2)}" fill="#F1A6C0"/><circle cx="-9" cy="-56" r="1.1" fill="#F6DF95"/><circle cx="10" cy="-53" r=".9" fill="#F6BFD2"/><circle cx="8" cy="-60" r=".7" fill="#F6DF95"/></g>` },
    { id: 'p-trophy', slot: 'held', name: '황금 트로피', en: 'Golden trophy', ach: 'mock90', desc: '실전형 모의고사에서 A+(90점 이상)를 받은 사람만 드는 트로피.',
      draw: () => `<path d="M48.5 102 Q41 101.5 42 108 Q43 113 49.5 111.5 M71.5 102 Q79 101.5 78 108 Q77 113 70.5 111.5" stroke="#D9A64B" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M47.5 98 H72.5 V102.5 Q72.5 115.5 60 117.5 Q47.5 115.5 47.5 102.5 Z" fill="#E8C15A" stroke="#B8862E" stroke-width="1"/><path d="M51 101 q.5 8 5 12" stroke="#FFF3C4" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/><path d="${star(60, 106.5, 4.4, 1.9)}" fill="#FFF3C4"/><rect x="57.5" y="117" width="5" height="4.5" fill="#D9A64B"/><rect x="49" y="121" width="22" height="6.5" rx="1.5" fill="#B98A3A"/><rect x="53" y="122.6" width="14" height="3.2" rx=".8" fill="#F3D58F"/>` },
    { id: 'p-pencil', slot: 'held', name: '노란 연필', en: 'Pencil', price: 30, desc: '필기의 기본. 분홍 지우개가 달린 노란 연필.',
      draw: () => `<g transform="translate(66 133) rotate(26)"><path d="M-3.6 -7 L0 0 L3.6 -7 Z" fill="#F3DDBF"/><path d="M-1.1 -2.2 L0 0 L1.1 -2.2 Z" fill="#47203A"/><rect x="-3.6" y="-41" width="7.2" height="34" fill="#F5C85C"/><path d="M-1.2 -41 V-7 M1.2 -41 V-7" stroke="#E3AE3E" stroke-width=".6"/><rect x="-3.6" y="-43.6" width="7.2" height="2.8" fill="#C9CDD6"/><rect x="-3.6" y="-48" width="7.2" height="4.6" rx="1.6" fill="#F1A6C0"/></g>` },
    { id: 'p-matcha', slot: 'held', name: '말차 한 잔', en: 'Matcha', price: 50, desc: '집중력 충전용 따뜻한 말차. 김이 모락모락.',
      draw: () => `<path d="M55 106 q-2 -3 0 -6 q2 -3 0 -6 M65 106 q-2 -3 0 -6 q2 -3 0 -6" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".85"/><path d="M47 111 H73 Q72 124 60 125.6 Q48 124 47 111 Z" fill="#6F8F6A"/><path d="M50 115 Q52.5 119.5 50.8 124" stroke="#8FAE87" stroke-width="1.4" fill="none" stroke-linecap="round"/><ellipse cx="60" cy="111" rx="13" ry="3.2" fill="#9CC77A" stroke="#5E7F5B" stroke-width=".8"/>` },
    { id: 'p-dango', slot: 'held', name: '하나미 경단', en: 'Hanami dango', price: 60, desc: '벚꽃 구경의 짝꿍, 분홍·하양·초록 삼색 경단.',
      draw: () => `<g transform="translate(48 134) rotate(-20)"><path d="M0 0 V-48" stroke="#C9A57A" stroke-width="1.6" stroke-linecap="round"/><circle cx="0" cy="-19" r="5" fill="#A8D5A2"/><circle cx="0" cy="-28.5" r="5" fill="#FFFDF9" stroke="#EADFD8" stroke-width=".7"/><circle cx="0" cy="-38" r="5" fill="#F6BFD2"/><circle cx="-1.6" cy="-39.6" r="1.3" fill="#fff" opacity=".7"/><circle cx="-1.6" cy="-30.1" r="1.3" fill="#fff" opacity=".8"/><circle cx="-1.6" cy="-20.6" r="1.3" fill="#fff" opacity=".7"/></g>` },
    { id: 'p-islr', slot: 'held', name: 'ISLR 교과서', en: 'ISLR textbook', price: 70, desc: '이 강의의 교재. 품에 꼭 안고 다녀요.',
      draw: () => `<g transform="rotate(-5 60 114)"><rect x="42" y="101" width="36" height="25" rx="2" fill="#D6487D"/><rect x="42" y="101" width="4.6" height="25" rx="1" fill="#B93A68"/><rect x="46.6" y="123.6" width="31.4" height="2.4" fill="#FFF9F4"/><text x="62.5" y="115.4" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="700" font-size="8.6" fill="#FFF9F4">ISLR</text><path d="M51 119 H74" stroke="#F6BFD2" stroke-width="1"/></g>` },
    { id: 'p-omamori', slot: 'held', name: 'A+ 부적', en: 'A+ charm', price: 90, desc: '시험 날 꼭 챙기는 A+ 행운 부적. 금색 매듭이 포인트예요.',
      draw: () => `<g transform="translate(71 103) rotate(8)"><path d="M-3 -5.4 q3 -5 6 0" stroke="#D9A64B" stroke-width="1.3" fill="none"/><path d="M-7 -2 L0 -5 L7 -2 V19 Q7 22 4 22 H-4 Q-7 22 -7 19 Z" fill="#D6487D"/><path d="M-7 1 H7" stroke="#D9A64B" stroke-width="1.6"/><text x="0" y="14" text-anchor="middle" font-size="7.6" fill="#FFF9F4" font-family="${DISP}" font-weight="800">A+</text><path d="M-3 17.5 l1 1 l2 -2.4" stroke="#FFF9F4" stroke-width=".8" fill="none" stroke-linecap="round" opacity=".8"/></g>` },
    { id: 'p-koban', slot: 'held', name: '금화 고반', en: 'Gold coin', price: 100, desc: '마네키네코처럼 금화를 꼭 쥐었어요. 가운데에 냥 발바닥이 찍혀 있어요.',
      draw: () => `<g transform="rotate(-6 60 111)"><ellipse cx="60" cy="111" rx="12.5" ry="16.5" fill="#E8C15A" stroke="#B8862E" stroke-width="1.1"/><path d="M50.5 101.5 H69.5 M48.6 106 H71.4 M48.6 116 H71.4 M50.5 120.5 H69.5" stroke="#CF9E3E" stroke-width=".7"/><ellipse cx="60" cy="111" rx="5.2" ry="6.6" fill="#F3D27A" stroke="#B8862E" stroke-width=".7"/><g fill="#8A6424"><ellipse cx="60" cy="112.8" rx="2.6" ry="2.1"/><circle cx="57.4" cy="109.6" r="1"/><circle cx="59.1" cy="108.3" r="1"/><circle cx="60.9" cy="108.3" r="1"/><circle cx="62.6" cy="109.6" r="1"/></g><path d="M51.5 99 q-2 3 -1.6 6" stroke="#fff" stroke-width="1.2" opacity=".6" fill="none" stroke-linecap="round"/></g>` },
    { id: 'p-wagasa', slot: 'held', name: '뱀눈 종이우산', en: 'Paper umbrella', price: 160, desc: '분홍 뱀눈 무늬 화지 우산. 어깨에 걸치고 산책해요.',
      draw: {
        back: () => `<path d="M92 34 L76 99" stroke="#B98A5A" stroke-width="2.2" stroke-linecap="round"/><circle cx="92" cy="34" r="26" fill="#F1A6C0"/><path d="${WAGASA_RIBS}" stroke="#E48DAE" stroke-width=".7"/><circle cx="92" cy="34" r="16.5" fill="none" stroke="#FFF9F4" stroke-width="5"/><circle cx="92" cy="34" r="26" fill="none" stroke="#D6487D" stroke-width="1.4"/><circle cx="92" cy="34" r="3" fill="#D6487D"/>`,
        main: () => `<path d="M77.5 93 L69.5 128" stroke="#B98A5A" stroke-width="2.4" stroke-linecap="round"/>`
      } },

    /* 자리 */
    { id: 's-none', slot: 'seat', name: '그냥 바닥', price: 0 },
    { id: 's-zabuton', slot: 'seat', name: '보라 방석', en: 'Floor cushion', price: 50, desc: '네 귀퉁이에 금색 술이 달린 푹신한 방석.',
      draw: { back: () => `<ellipse cx="60" cy="136" rx="46" ry="2.4" fill="rgba(71,32,58,.12)"/><rect x="13" y="121" width="94" height="14.5" rx="6.5" fill="#9D7FCB"/><rect x="15" y="118.5" width="90" height="12" rx="6" fill="#B79ADF"/><path d="M22 124.5 H98" stroke="#CDB6EC" stroke-width="1" stroke-dasharray="2 2"/><path d="M15.5 121 l-5 -3 M104.5 121 l5 -3 M15.5 132 l-5 3 M104.5 132 l5 3" stroke="#D9A64B" stroke-width="2" stroke-linecap="round"/>` } },
    { id: 's-cloud', slot: 'seat', name: '구름 쿠션', en: 'Cloud cushion', price: 90, desc: '하늘에 둥실 떠 있는 기분. 폭신폭신 구름 쿠션.',
      draw: { back: () => `<ellipse cx="60" cy="136.4" rx="40" ry="1.8" fill="rgba(71,32,58,.08)"/><g fill="#FFFFFF"><ellipse cx="60" cy="130" rx="47" ry="6.6"/><circle cx="24" cy="126.5" r="7.5"/><circle cx="39" cy="123" r="10"/><circle cx="81" cy="123" r="10.5"/><circle cx="96" cy="126.5" r="7"/></g><path d="M18 132 Q60 138 102 132" stroke="#EADCE6" stroke-width="1.4" fill="none"/>` } },
    { id: 's-box', slot: 'seat', name: '멘들스 상자', en: 'Mendl\x27s box', price: 140, desc: '고양이는 상자를 좋아해요. 파란 리본의 분홍 멘들스 과자 상자.', pawY: 109,
      draw: {
        back: () => `<ellipse cx="60" cy="135.4" rx="44" ry="2.8" fill="rgba(71,32,58,.12)"/><path d="M20 108 L28 99 H92 L100 108 Z" fill="#E48DAE"/>`,
        front: () => `<rect x="20" y="108" width="80" height="27" rx="2" fill="#F6BFD2"/><rect x="20" y="108" width="80" height="3" fill="#F1A6C0"/><rect x="72" y="108" width="7" height="27" fill="#8FB3DE"/><text x="45" y="126.6" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic" font-weight="600" font-size="9" fill="#5B7DB8">Mendl's</text>`
      } },

    /* 털색 */
    { id: 'fur-cream', slot: 'fur', name: '크림 분홍귀', en: 'Cream', price: 0, desc: '분홍 귀와 꼬리의 크림색. 냥의 원래 모습이에요.' },
    { id: 'fur-cheese', slot: 'fur', name: '치즈 태비', en: 'Orange tabby', price: 80, desc: '이마에 줄무늬가 있는 치즈 고양이.' },
    { id: 'fur-gray', slot: 'fur', name: '러시안 블루', en: 'Russian blue', price: 100, desc: '은회색 털에 초록 눈.' },
    { id: 'fur-calico', slot: 'fur', name: '삼색이', en: 'Calico', price: 120, desc: '주황·검정·하양 세 가지 색 얼룩 고양이.' },
    { id: 'fur-tuxedo', slot: 'fur', name: '턱시도', en: 'Tuxedo', price: 120, desc: '검은 연미복을 입은 듯한 하치와레. 가슴이 하얘요.' },
    { id: 'fur-black', slot: 'fur', name: '흑묘', en: 'Black cat', price: 150, desc: '금빛 눈의 까만 고양이. 행운의 상징이에요.' },
    { id: 'fur-siamese', slot: 'fur', name: '샴', en: 'Siamese', price: 150, desc: '파란 눈에 얼굴·귀·발끝이 갈색인 샴 고양이.' },

    /* 도장 */
    { id: 'st-neko', slot: 'stamp', name: '냥 체크 도장', en: 'Cat check stamp', price: 0, desc: '고양이 얼굴 모양 인주 도장. 가운데에 큼직한 체크 표시, 수염까지 찍혀요.' },
    { id: 'st-paw', slot: 'stamp', name: '발바닥 하트 도장', en: 'Paw heart stamp', price: 60, desc: '말랑한 젤리 발바닥으로 꾹. 가운데가 하트 모양으로 비어 있어요.' },
    { id: 'st-pass', slot: 'stamp', name: '벚꽃 PASS 도장', en: 'Sakura PASS stamp', price: 80, desc: '벚꽃 테두리 안에 PASS. 객실 하나를 통과할 때마다 합격 도장을 쾅.' },
    { id: 'st-aplus', slot: 'stamp', name: 'A+ 냥 도장', en: 'A+ cat stamp', price: 100, desc: '고양이 얼굴 안에 A+. 객실마다 A+를 미리 찍어 두면 성적도 따라와요.' },
    { id: 'st-hanamaru', slot: 'stamp', name: '100점 꽃동그라미', en: 'Perfect-score flower stamp', price: 150, desc: '선생님이 만점 시험지에 그려 주던 꽃동그라미 안에 100과 두 줄 밑줄.' },
    { id: 'st-gold', slot: 'stamp', name: 'A+ 금도장', en: 'Golden A+ seal', ach: 'pass', desc: '빠른 모의고사 16점(합격선)을 넘긴 사람만 쓰는, 고양이 귀 달린 금색 A+ 도장.' }
  ];
  const BY = {};
  ITEMS.forEach(it => { BY[it.id] = it; });

  /* ---------- 몸 ---------- */
  function tail(f) {
    let s = `<path d="M80 122 C100 124 108 108 102 94" stroke="${f.tail}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
    if (f.tailStripe) s += `<path d="M92 116.6 L93.4 124.4 M97.6 111.6 L104.2 116.2 M100.4 102.8 L107.4 106.4" stroke="${f.tailStripe}" stroke-width="2.4" stroke-linecap="round"/>`;
    if (f.tailTip) s += `<path d="M104.6 101 C104.4 98.4 103.6 96 102 94" stroke="${f.tailTip}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
    return s;
  }
  function paws(f, y) {
    return [50, 70].map(x => `<ellipse cx="${x}" cy="${y}" rx="7.5" ry="5" fill="${f.paw}" stroke="${f.pawLine || 'rgba(71,32,58,.14)'}" stroke-width=".8"/><path d="M${x - 2.5} ${y - 1.6} v2.6 M${x + 2.5} ${y - 1.6} v2.6" stroke="${f.pawToe || 'rgba(71,32,58,.3)'}" stroke-width=".9" stroke-linecap="round"/>`).join('');
  }
  function head(f, c) {
    let s = `<path d="M27 47 L28.5 15.5 Q29.5 10.5 34 13 L53 29 Z" fill="${f.ear}"/><path d="M93 47 L91.5 15.5 Q90.5 10.5 86 13 L67 29 Z" fill="${f.ear2 || f.ear}"/>`
      + `<path d="M32 40 L33 20 L46 30.5 Z" fill="${f.earIn}"/><path d="M88 40 L87 20 L74 30.5 Z" fill="${f.earIn}"/>`
      + `<ellipse cx="60" cy="58" rx="37" ry="32" fill="${f.head}"/>`;
    if (f.pattern) s += `<g clip-path="url(#${c.u}h)">${f.pattern(c)}</g>`;
    s += [46, 74].map(x => f.eye
      ? `<circle cx="${x}" cy="60" r="4.9" fill="${f.eye}"/><ellipse cx="${x}" cy="60.4" rx="1.9" ry="3.8" fill="#2A1C26"/><circle cx="${x + 1.7}" cy="58.1" r="1.4" fill="#fff"/>`
      : `<ellipse cx="${x}" cy="60" rx="4.2" ry="4.6" fill="#47203A"/><circle cx="${x + 1.6}" cy="58.2" r="1.5" fill="#fff"/>`).join('');
    const bl = f.blush || '#F6BFD2';
    s += `<ellipse cx="36.5" cy="69" rx="6" ry="3.4" fill="${bl}"/><ellipse cx="83.5" cy="69" rx="6" ry="3.4" fill="${bl}"/>`
      + `<path d="M57.4 65.4 h5.2 l-2.6 2.8z" fill="#E07C9C"/>`
      + `<path d="M60 68.2 v1.4 M55 69.6 q2.5 3 5 0 q2.5 3 5 0" stroke="${f.mouth || '#47203A'}" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
      + `<path d="M13 61 L29 64 M13 68.5 L29 68 M107 61 L91 64 M107 68.5 L91 68" stroke="${f.line}" stroke-width="1.2" stroke-linecap="round"/>`;
    return s;
  }

  function norm(look) {
    const L = Object.assign({}, DEFAULT);
    if (look) Object.keys(look).forEach(k => { const it = BY[look[k]]; if (it && it.slot === k) L[k] = look[k]; });
    return L;
  }
  function layer(item, name, c) {
    if (!item || !item.draw) return '';
    const d = typeof item.draw === 'function' ? (name === 'main' ? item.draw : null) : item.draw[name];
    return d ? d(c) : '';
  }

  /* 전체 고양이 SVG */
  function render(look, o) {
    o = o || {};
    const L = norm(look);
    const f = FUR[L.fur] || FUR['fur-cream'];
    const c = { f, u: 'ny' + (++uid) };
    const hat = BY[L.hat], face = BY[L.face], neck = BY[L.neck], outfit = BY[L.outfit], held = BY[L.held], seat = BY[L.seat];
    const hasSeat = seat && seat.draw;
    const s = [
      `<defs><clipPath id="${c.u}h"><ellipse cx="60" cy="58" rx="37" ry="32"/></clipPath><clipPath id="${c.u}b"><path d="${TORSO}"/></clipPath>${f.defs ? f.defs(c) : ''}</defs>`,
      hasSeat ? layer(seat, 'back', c) : `<ellipse cx="60" cy="132" rx="34" ry="5" fill="rgba(71,32,58,.10)"/>`,
      layer(held, 'back', c),
      layer(hat, 'back', c),
      tail(f),
      `<path d="${TORSO}" fill="${f.body || f.head}"/>`,
      f.chest ? f.chest(c) : '',
      outfit && outfit.draw ? `<g clip-path="url(#${c.u}b)">${layer(outfit, 'main', c)}</g>` + layer(outfit, 'over', c) : '',
      layer(neck, 'main', c),
      layer(held, 'main', c),
      layer(seat, 'front', c),
      paws(f, (seat && seat.pawY) || 127),
      head(f, c),
      layer(face, 'main', c),
      layer(hat, 'main', c),
      layer(face, 'top', c)
    ].join('');
    const label = o.label ? `role="img" aria-label="${o.label}"` : 'aria-hidden="true"';
    return `<svg class="nyan" viewBox="${o.crop || '0 0 120 138'}" ${label}>${s}</svg>`;
  }

  /* ---------- 도장 ---------- */
  const INK = { seal: '#C4303F', pink: '#D23A73', gold: '#BF8A26' };
  const CATHEAD = 'M43 25 A33 33 0 0 1 57 25 L76.5 12.5 L79 42 A33 33 0 1 1 21 42 L23.5 12.5 Z';
  const lobed = (n, R, base, pow, notch) => {
    const pts = [], cx = 50, cy = 52, seg = Math.PI * 2 / n;
    for (let i = 0; i < 240; i++) {
      const t = i / 240 * Math.PI * 2;
      const rel = (((t + Math.PI / 2) % seg) + seg) % seg, phi = Math.min(rel, seg - rel);
      const r = R * (base + (1 - base) * Math.pow(Math.abs(Math.cos(n * (t + Math.PI / 2) / 2)), pow)) - R * notch * Math.exp(-Math.pow(phi / .06, 2));
      pts.push(r2(cx + Math.cos(t) * r) + ' ' + r2(cy + Math.sin(t) * r));
    }
    return 'M' + pts.join(' L') + ' Z';
  };
  const SHAPE = {};
  const shape = k => SHAPE[k] || (SHAPE[k] = k === 'sakura' ? lobed(5, 45, .64, .55, .11) : lobed(12, 45, .86, .7, 0));
  function catFrame(C, eyes) {
    return `<path d="${CATHEAD}" fill="none" stroke="${C}" stroke-width="5.2" stroke-linejoin="round"/>`
      + `<path d="${CATHEAD}" fill="none" stroke="${C}" stroke-width="1.7" stroke-linejoin="round" transform="translate(50 58.5) scale(.82) translate(-50 -57)"/>`
      + `<path d="M3.5 57 L15 60 M3.5 66 L15 65.5 M96.5 57 L85 60 M96.5 66 L85 65.5" stroke="${C}" stroke-width="2.4" stroke-linecap="round"/>`
      + (eyes ? `<path d="M37.5 42 q3.5 -4 7 0 M55.5 42 q3.5 -4 7 0" stroke="${C}" stroke-width="2.3" fill="none" stroke-linecap="round"/>` : '');
  }
  function stamp(id) {
    const u = 'st' + (++uid);
    let b;
    if (id === 'st-paw') {
      const C = INK.seal;
      b = `<defs><mask id="${u}m" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#fff"/><path d="${heart(50, 70, 11)}" fill="#000"/></mask></defs>`
        + `<path d="M50 49 C63 49 77 60 77 73 C77 84 67 88.5 50 86.5 C33 88.5 23 84 23 73 C23 60 37 49 50 49 Z" fill="${C}" mask="url(#${u}m)"/>`
        + `<ellipse cx="22.5" cy="44" rx="8" ry="10.5" transform="rotate(-24 22.5 44)" fill="${C}"/><ellipse cx="39" cy="27" rx="8.5" ry="11.5" transform="rotate(-8 39 27)" fill="${C}"/>`
        + `<ellipse cx="61" cy="27" rx="8.5" ry="11.5" transform="rotate(8 61 27)" fill="${C}"/><ellipse cx="77.5" cy="44" rx="8" ry="10.5" transform="rotate(24 77.5 44)" fill="${C}"/>`;
    } else if (id === 'st-pass') {
      const C = INK.pink, p = shape('sakura');
      b = `<path d="${p}" fill="none" stroke="${C}" stroke-width="4.6" stroke-linejoin="round"/>`
        + `<path d="${p}" fill="none" stroke="${C}" stroke-width="1.5" stroke-linejoin="round" transform="translate(50 52) scale(.8) translate(-50 -52)"/>`
        + `<text x="50" y="58.6" text-anchor="middle" font-size="17" font-weight="800" letter-spacing=".5" fill="${C}" font-family="${DISP}">PASS</text>`;
    } else if (id === 'st-aplus') {
      const C = INK.seal;
      b = catFrame(C, true) + `<text x="50" y="77" text-anchor="middle" font-size="30" font-weight="800" fill="${C}" font-family="${DISP}">A+</text>`;
    } else if (id === 'st-hanamaru') {
      const C = INK.seal, p = shape('maru');
      b = `<path d="${p}" fill="none" stroke="${C}" stroke-width="4.2" stroke-linejoin="round"/>`
        + `<circle cx="50" cy="52" r="29" fill="none" stroke="${C}" stroke-width="1.6"/>`
        + `<text x="50" y="59" text-anchor="middle" font-size="25" font-weight="800" fill="${C}" font-family="${DISP}">100</text>`
        + `<path d="M31 65.5 Q50 69 69 65 M33 71 Q50 74.5 67 70.5" stroke="${C}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    } else if (id === 'st-gold') {
      const C = INK.gold;
      b = `<defs><mask id="${u}m" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#fff"/><text x="50" y="72" text-anchor="middle" font-size="34" font-weight="800" fill="#000" font-family="${DISP}">A+</text><rect x="24.5" y="26" width="51" height="60" rx="3" fill="none" stroke="#000" stroke-width="1.6"/><path d="${star(50, 36, 5, 2.2)}" fill="#000"/></mask></defs>`
        + `<path d="M18 28 L20 8 L37 21 H63 L80 8 L82 28 V85 Q82 91 76 91 H24 Q18 91 18 85 Z" fill="${C}" mask="url(#${u}m)"/>`;
    } else {
      const C = INK.seal;
      b = catFrame(C, true) + `<path d="M35 63 L45.5 73.5 L66 51" stroke="${C}" stroke-width="6.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    return `<svg class="stamp-svg" viewBox="0 0 100 100" aria-hidden="true"><g filter="url(#gdh-ink)">${b}</g></svg>`;
  }

  /* 문서에 한 번 넣는 공용 정의 (도장 잉크 번짐) */
  function defs() {
    return `<svg width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false"><defs>`
      + `<filter id="gdh-ink" x="-6%" y="-6%" width="112%" height="112%" color-interpolation-filters="sRGB">`
      + `<feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="7" result="n"/>`
      + `<feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="d"/>`
      + `<feTurbulence type="fractalNoise" baseFrequency=".32" numOctaves="3" seed="3" result="g"/>`
      + `<feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.6 0 0 0 2.25" result="ga"/>`
      + `<feComposite in="d" in2="ga" operator="in"/>`
      + `</filter></defs></svg>`;
  }

  window.NYAN = { SLOTS, DEFAULT, ACH, ITEMS, BY, FUR, render, stamp, defs, norm };
})();
