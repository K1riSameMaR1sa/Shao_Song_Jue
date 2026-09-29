#!/usr/bin/env node
/* 一把梭自检入口：依次跑断言套件 / 逐张试跑 / CSS 变量检查
 *
 *   node tools/check.js                  # 检查仓库里的 绍宋决.html
 *   node tools/check.js path/to/other.html
 *
 * 全部通过退出码 0，任一项失败退出码 1（可直接用于 CI 或提交前检查）。
 */
const { runSuite } = require('./harness');
const { playAllCards } = require('./allcards');
const { checkCssVars } = require('./cssvars');

const target = process.argv[2];
const line = (t) => console.log('\n===== ' + t + ' =====');

line('1/3 断言套件 harness.js');
const h = runSuite(target);
console.log(h.loadOk ? 'LOAD_OK' : 'LOAD_FAIL: ' + h.loadError);
if (h.logs && h.logs.length) [...new Set(h.logs.map(l => l.text))].forEach(t => console.log('页面自检> ' + t));
h.data.forEach(([k, v]) => console.log(k + ': ' + v));
const fails = h.results.filter(x => x[1] === 'FAIL');
if (fails.length) fails.forEach(x => console.log(`FAIL  ${x[0]}  [${x[2]}]`));
console.log(`SUMMARY: ${h.results.length - fails.length}/${h.results.length} passed`);

line('2/3 逐张试跑 allcards.js');
const a = playAllCards(target);
if (a.error) console.log(a.error);
else {
  console.log(`将领 ${a.played.unit} / 地 ${a.played.land} / 法术 ${a.played.spell}，共 ${a.total} 张`);
  a.problems.forEach(p => console.log(' - ' + p));
  if (!a.problems.length) console.log('全部卡牌均可正常打出与结算，无异常。');
}

line('3/3 CSS 变量 cssvars.js');
const c = checkCssVars(target);
console.log(c.ok ? 'OK: 所有 var() 引用均有定义' : 'UNDEFINED: ' + c.missing.join(', '));

const ok = h.loadOk && fails.length === 0 && a.ok && c.ok;
line(ok ? '全部检查通过 ✅' : '存在失败项 ❌');
process.exitCode = ok ? 0 : 1;
