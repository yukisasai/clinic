/**
 * 01-clinic 用プレースホルダー生成
 *
 * 実写に差し替える前提。比率とファイル名を固定しておき、
 * 同名の .webp を置いて <img src> の拡張子を変えるだけで入れ替わるようにする。
 *
 *   node images.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), 'images');
mkdirSync(OUT, { recursive: true });

const P = {
  ink: '#232A33',
  paper: '#F7F5F1',
  paperDeep: '#EBE6DE',
  sumi: '#1C222B',
  coral: '#C25B4E',
  gold: '#B08D57',
  mist: '#C9C2B6',
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * 陶器のような層のあるプレースホルダー。
 * ベタ塗りのグレー矩形にしないのは、レイアウト確認時に
 * 「実写が入ったときの明度分布」を近似させるため。
 */
function plate({ w, h, label, tone = 'light', seed = 0 }) {
  const s = Math.min(w, h);
  const warm = tone === 'dark';
  const c1 = warm ? P.sumi : P.paperDeep;
  const c2 = warm ? '#2E3742' : P.paper;
  const fg = warm ? P.paper : P.ink;
  const drift = ((seed * 37) % 24) - 12;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}">
  <defs>
    <linearGradient id="b${seed}" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="l${seed}" cx="${0.42 + drift / 200}" cy="0.34" r="0.62">
      <stop offset="0" stop-color="#ffffff" stop-opacity="${warm ? 0.16 : 0.72}"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="n${seed}"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3"/>
      <feColorMatrix type="saturate" values="0"/></filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#b${seed})"/>
  <ellipse cx="${w * 0.44}" cy="${h * 0.36}" rx="${w * 0.5}" ry="${h * 0.42}" fill="url(#l${seed})"/>
  <rect width="${w}" height="${h}" filter="url(#n${seed})" opacity="${warm ? 0.06 : 0.045}"/>
  <line x1="${w * 0.5 - s * 0.05}" y1="${h * 0.5}" x2="${w * 0.5 + s * 0.05}" y2="${h * 0.5}"
        stroke="${fg}" stroke-opacity="0.28" stroke-width="1"/>
  <text x="${w * 0.5}" y="${h * 0.5 + s * 0.085}" text-anchor="middle"
        font-family="'Hiragino Mincho ProN',serif" font-size="${s * 0.05}"
        fill="${fg}" fill-opacity="0.5" letter-spacing="${s * 0.012}">${esc(label)}</text>
  <text x="${w * 0.5}" y="${h * 0.5 + s * 0.145}" text-anchor="middle"
        font-family="'Jost',sans-serif" font-size="${s * 0.032}"
        fill="${fg}" fill-opacity="0.3" letter-spacing="${s * 0.02}">${w}×${h}</text>
</svg>
`;
}

const SPECS = [
  ['hero', 1400, 1750, 'メインビジュアル', 'light'],
  ['og', 1200, 630, 'OGP', 'light'],
  ['ba-01-before', 900, 900, '施術前', 'light'],
  ['ba-01-after', 900, 900, '施術後', 'light'],
  ['ba-02-before', 900, 900, '施術前', 'light'],
  ['ba-02-after', 900, 900, '施術後', 'light'],
  ['doctor', 900, 1200, '院長', 'light'],
  ['clinic-01', 1000, 750, '診察室', 'light'],
  ['clinic-02', 1000, 750, '待合', 'light'],
  ['device', 1000, 1000, '機器', 'dark'],
  ['flow-01', 700, 500, 'カウンセリング', 'light'],
  ['flow-02', 700, 500, '診察', 'light'],
  ['flow-03', 700, 500, '施術', 'light'],
  ['flow-04', 700, 500, 'アフターケア', 'light'],
];

SPECS.forEach(([name, w, h, label, tone], i) => {
  writeFileSync(resolve(OUT, `${name}.svg`), plate({ w, h, label, tone, seed: i + 1 }), 'utf8');
});

console.log(`✓ ${SPECS.length} 枚生成`);
