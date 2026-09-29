/* 逐张试跑全部卡牌（默认 361 张）：
 *   1) 能否打出（不被费用/时机/目标校验卡住）
 *   2) 结算过程是否抛异常
 *   3) 牌是否进入正确区域（将帐 / 州府 / 弃牌堆）
 * 用法：node tools/allcards.js [path-to-html]
 */
const { load } = require('./domstub');

function playAllCards(htmlPath) {
const { run, drain, loadError, file } = load(htmlPath);
if (loadError) return { ok: false, file, error: 'LOAD_FAIL: ' + loadError.message, problems: [], played: null, total: 0 };

const ids = run("Object.keys(CARD_DB).filter(id=>!CARD_DB[id].isToken)");
const problems = [];
const played = { unit: 0, land: 0, spell: 0 };
for (const id of ids) {
  const type = run(`CARD_DB['${id}'].type`);
  try {
    run("initGame('ai','song','jin');beginGame(true);keepHand();");
    run("G.my.hand=[{id:'" + id + "'}];G.my.mana=20;G.my.life=25;G.phase='precombat_main';G.my.landsPlayedThisTurn=0;G.my.chongxue=null;G.my.hasChongxue=false;");
    run("G.enemy.board=[{id:'liruoshui',tapped:false,sick:false},{id:'weiming',tapped:false,sick:false}];G.enemy.hand=[{id:'guozhai'}];G.enemy.life=25;");
    run('onHandCardClick(0)');
    if (run('!!G.needChooseTarget')) run('resolveTarget(0)');
    run('drainNow()');
    const inHand = run("G.my.hand.some(c=>cidOf(c)==='" + id + "')");
    if (type === 'unit') {
      if (!run("G.my.board.some(c=>c.id==='" + id + "')")) problems.push(`${id}(${run(`CARD_DB['${id}'].name`)}): 将领未进入将帐`);
      played.unit++;
    } else if (type === 'land') {
      if (!run("G.my.lands.some(l=>l.id==='" + id + "')")) problems.push(`${id}: 地牌未进入州府区`);
      played.land++;
    } else {
      if (!run("G.my.grave.includes('" + id + "')")) problems.push(`${id}(${run(`CARD_DB['${id}'].name`)}): 法术未结算（仍在手牌=${inHand}）`);
      played.spell++;
    }
  } catch (e) {
    problems.push(`${id}(${run(`CARD_DB['${id}'].name`)}): 抛异常 ${e.message}`);
  }
}
return { ok: problems.length === 0, file, error: null, problems, played, total: ids.length };
}

if (require.main === module) {
  const r = playAllCards(process.argv[2]);
  if (r.error) { console.log(r.error); process.exitCode = 1; }
  else {
    console.log(`试跑完成：将领 ${r.played.unit} / 地 ${r.played.land} / 法术 ${r.played.spell}，共 ${r.total} 张`);
    if (r.problems.length) { console.log('问题 ' + r.problems.length + ' 项：'); r.problems.forEach(p => console.log(' - ' + p)); process.exitCode = 1; }
    else console.log('全部卡牌均可正常打出与结算，无异常。');
  }
}
module.exports = { playAllCards };
