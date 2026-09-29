/* 静态检查：所有 var(--x) 引用是否都在 :root 里定义过
 * （未定义的变量会让费用球背景、阵营卡上边框、录像胜负色等静默失效）
 * 用法：node tools/cssvars.js [path-to-html]
 */
const fs = require('fs');
const path = require('path');
const { DEFAULT_HTML } = require('./domstub');

function checkCssVars(htmlPath) {
  const file = htmlPath || DEFAULT_HTML;
  const s = fs.readFileSync(file, 'utf8');
  const clean = s.replace(/\/\*[\s\S]*?\*\//g, '');      /* 先去注释，避免注释把下一条声明粘住 */
  const rootMatch = clean.match(/:root\{([\s\S]*?)\}/);
  const rootBlock = rootMatch ? rootMatch[1] : '';
  const defined = new Set();
  let dm; const dre = /(--[\w-]+)\s*:/g;
  while ((dm = dre.exec(rootBlock))) defined.add(dm[1]);

  const used = new Map();
  let m; const re = /var\((--[\w-]+)/g;
  while ((m = re.exec(s))) used.set(m[1], (used.get(m[1]) || 0) + 1);

  const missing = [...used.keys()].filter(k => !defined.has(k));
  return { ok: missing.length === 0, file, defined: [...defined], used: [...used.entries()], missing };
}

if (require.main === module) {
  const r = checkCssVars(process.argv[2]);
  console.log('defined:', r.defined.join(' '));
  console.log('used:', r.used.map(([k, v]) => k + '×' + v).join(' '));
  console.log(r.ok ? 'OK: 所有 var() 引用均有定义' : 'UNDEFINED: ' + r.missing.join(', '));
  if (!r.ok) process.exitCode = 1;
}
module.exports = { checkCssVars };
