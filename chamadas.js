/* chamadas.js — as 5 escritas dos gargalos, com setas ORGÂNICAS.
   Nada de seta reta: cada uma sai de um lado, com curvatura própria e ponta
   desenhada a traço, como rabisco de quem está explicando no quadro.

   Ordem definida por ela:
     1 Planejamento · 2 Aquisição de clientes · 3 Processo de conversão
     4 Escalar resultados com a equipe · 5 Financeiro

   Na página do problema a escrita nasce quando AQUELE furo abre.
   Na página da solução a mesma escrita volta com um CHECK de resolvido.   */
(function (raiz) {
  const NS = 'http://www.w3.org/2000/svg';
  const LARANJA = '#FA6503', TINTA = '#000', T2 = '#7D8189';

  const GARGALOS = [
    { linhas: ['PLANEJAMENTO'] },
    { linhas: ['AQUISIÇÃO', 'DE CLIENTES'] },
    { linhas: ['PROCESSO DE', 'CONVERSÃO'] },
    { linhas: ['ESCALAR RESULTADOS', 'COM A EQUIPE'] },
    { linhas: ['FINANCEIRO'] }
  ];

  /* cada uma para um lado: deslocamento, altura e curvatura próprios.
     Alturas diferentes é o que impede duas vizinhas de se baterem. */
  /* Cada uma para um lado, e em PROFUNDIDADES diferentes — é a profundidade
     que impede a vizinha de bater. Vão abaixo do cano: lá tem ar, e a seta
     sobe pro furo, que fica na borda de baixo. */
  const JEITO = [
    { dx: -0.70, prof: 1.75, curva:  0.80, torce: -0.20 },
    { dx:  0.45, prof: 2.70, curva: -0.80, torce:  0.38 },
    { dx: -0.30, prof: 3.85, curva:  0.95, torce:  0.45 },
    { dx:  0.35, prof: 2.70, curva: -0.90, torce:  0.36 },
    { dx:  0.55, prof: 1.75, curva:  0.75, torce:  0.20 }
  ];

  const cel = (n, a, p) => {
    const e = document.createElementNS(NS, n);
    for (const k in a) e.setAttribute(k, a[k]);
    if (p) p.appendChild(e);
    return e;
  };

  /* bezier cúbica com um nó no meio — é o nó que tira a cara de seta de régua */
  function caminho(P0, P3, T, curva, torce) {
    const dx = P3.x - P0.x, dy = P3.y - P0.y, sub = Math.abs(dy);
    // o balanço é LATERAL. Se fosse vertical a curva mergulhava na própria
    // escrita antes de subir — foi o que aconteceu na primeira volta.
    const Mx = P0.x + dx * 0.50 + curva * T * 0.92;
    const My = P0.y + dy * 0.50;
    const c1 = { x: P0.x + torce * T * 0.95, y: P0.y - sub * 0.34 };
    const c2 = { x: Mx - dx * 0.18, y: My + sub * 0.17 };
    const c3 = { x: Mx + dx * 0.18, y: My - sub * 0.17 };
    const c4 = { x: P3.x - torce * T * 0.72, y: P3.y + Math.min(T, sub * 0.52) };
    return {
      d: `M${P0.x.toFixed(1)} ${P0.y.toFixed(1)}`
       + ` C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}`
       + ` ${Mx.toFixed(1)} ${My.toFixed(1)}`
       + ` C${c3.x.toFixed(1)} ${c3.y.toFixed(1)} ${c4.x.toFixed(1)} ${c4.y.toFixed(1)}`
       + ` ${P3.x.toFixed(1)} ${P3.y.toFixed(1)}`,
      tang: { x: P3.x - c4.x, y: P3.y - c4.y }
    };
  }

  function ponta(g, P3, tang, T, cor) {
    const a = Math.atan2(tang.y, tang.x), L = T * 0.26;
    [-1, 1].forEach(s => {
      const b = a + Math.PI + s * 0.52;
      cel('path', {
        d: `M${P3.x.toFixed(1)} ${P3.y.toFixed(1)} L`
         + `${(P3.x + Math.cos(b) * L).toFixed(1)} ${(P3.y + Math.sin(b) * L).toFixed(1)}`,
        stroke: cor, 'stroke-width': T * 0.055, 'stroke-linecap': 'round', fill: 'none'
      }, g);
    });
  }

  /* i = qual gargalo (0..4) · opc.check = versão resolvida · opc.anima = entra na hora */
  raiz.chamada = function (alvo, G, i, opc) {
    opc = opc || {};
    const T = G.T, cfg = JEITO[i], txt = GARGALOS[i];
    const g = cel('g', {}, alvo);
    const hx = G.furos[i];

    const corTraco = opc.check ? LARANJA : TINTA;
    const fs = T * 0.255, lh = T * 0.325;

    // a escrita fica centrada abaixo do cano, sem sair da tela
    const meia = Math.max.apply(null, txt.linhas.map(l => l.length)) * fs * 0.30;
    const margem = T * 0.45;
    const tx = Math.max(margem + meia, Math.min(G.W - margem - meia, hx + cfg.dx * T));
    const ty = G.base + cfg.prof * T;

    // selo: o número do gargalo, ou o check de resolvido
    const r = T * 0.185, sy = ty - fs * 0.74 - r - T * 0.13;
    cel('circle', { cx: tx, cy: sy, r: r,
                    fill: opc.check ? LARANJA : 'none',
                    stroke: LARANJA, 'stroke-width': T * 0.042 }, g);
    if (opc.check) {
      cel('path', { d: `M${(tx - r * 0.46).toFixed(1)} ${sy.toFixed(1)}`
                     + ` l${(r * 0.34).toFixed(1)} ${(r * 0.40).toFixed(1)}`
                     + ` l${(r * 0.64).toFixed(1)} ${(-r * 0.78).toFixed(1)}`,
                    stroke: '#FFF', 'stroke-width': T * 0.052, fill: 'none',
                    'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    } else {
      cel('text', { x: tx, y: sy + fs * 0.31, 'text-anchor': 'middle',
                    'font-family': "-apple-system,'SF Pro Text',sans-serif",
                    'font-size': fs * 0.80, 'font-weight': 700, fill: LARANJA
                  }, g).textContent = String(i + 1);
    }

    // a escrita: linhas com ar entre elas, nunca embolada
    txt.linhas.forEach((s2, k) => {
      cel('text', { x: tx, y: ty + k * lh, 'text-anchor': 'middle',
                    'font-family': "-apple-system,'SF Pro Text',sans-serif",
                    'font-size': fs, 'font-weight': 700, 'letter-spacing': fs * 0.05,
                    fill: opc.check ? T2 : TINTA }, g).textContent = s2;
    });
    if (opc.check) {
      const y2 = ty + (txt.linhas.length - 1) * lh + fs * 0.42;
      cel('line', { x1: tx - meia, y1: y2, x2: tx + meia, y2: y2,
                    stroke: LARANJA, 'stroke-width': T * 0.03,
                    'stroke-linecap': 'round', opacity: .5 }, g);
    }

    // a seta SOBE do texto até o furo, que mora na borda de baixo do cano
    const P0 = { x: tx, y: sy - r - T * 0.20 };
    const P3 = { x: hx, y: G.base + T * 0.34 };
    const c = caminho(P0, P3, T, cfg.curva, cfg.torce);
    const p = cel('path', { d: c.d, stroke: corTraco, 'stroke-width': T * 0.05,
                            fill: 'none', 'stroke-linecap': 'round' }, g);
    ponta(g, P3, c.tang, T, corTraco);

    if (opc.anima) {
      const L = p.getTotalLength();
      p.setAttribute('stroke-dasharray', L);
      p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }],
                { duration: 560, easing: 'cubic-bezier(.22,1,.3,1)', fill: 'forwards' });
      g.animate([{ opacity: 0 }, { opacity: 1 }],
                { duration: 380, easing: 'ease-out', fill: 'backwards' });
    }
    return g;
  };

  raiz.GARGALOS = GARGALOS;
})(window);
