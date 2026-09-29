/* 绍宋决.html 无头断言套件（30 项）
 * 用法：node tools/harness.js [path-to-html]
 * 也可被 tools/check.js 作为模块调用：runSuite() 返回 {loadOk, data, results}
 */
const { load } = require('./domstub');

let run, drain, store, code, loadErr;

function staticChecks() {
  const out = [];
  const dbStart = code.indexOf('const CARD_DB');
  const dbEnd = code.indexOf('/* 连携关系');
  const block = code.slice(dbStart, dbEnd);
  const re = /^\s{2}([A-Za-z_$][\w$]*)\s*:\s*\{name:/gm;
  const ids = [];
  let mm;
  while ((mm = re.exec(block))) ids.push({ id: mm[1], line: block.slice(0, mm.index).split('\n').length });
  const seen = new Map(), dups = [];
  ids.forEach(({ id, line }) => {
    if (seen.has(id)) dups.push(id + ' (lines ' + seen.get(id) + ' & ' + line + ')');
    else seen.set(id, line);
  });
  out.push(['card_defs', ids.length]);
  out.push(['duplicate_keys', dups.length ? dups.join(', ') : 'none']);
  const dupNames = [];
  const names = {};
  const nameRe = /^\s{2}([A-Za-z_$][\w$]*)\s*:\s*\{name:"([^"]+)"/gm;
  let nm;
  while ((nm = nameRe.exec(block))) {
    (names[nm[2]] = names[nm[2]] || []).push(nm[1]);
  }
  Object.entries(names).forEach(([n, a]) => { if (a.length > 1) dupNames.push(n + ' -> ' + a.join(',')); });
  out.push(['duplicate_names', dupNames.length ? dupNames.join(' | ') : 'none']);
  return out;
}

function runSuite(htmlPath) {
  const env = load(htmlPath);
  run = env.run; drain = env.drain; store = env.store; code = env.code; loadErr = env.loadError;

/* ---------- behaviour tests ---------- */
const results = [];
function test(name, fn) {
  try {
    const info = fn();
    results.push([name, 'PASS', info === undefined ? '' : String(info)]);
  } catch (e) {
    results.push([name, 'FAIL', e.message]);
  }
}
function fresh(f1, f2) {
  run('G=null;pendingAttackers=[];attackTarget=null;');
  run(`initGame('ai','${f1}','${f2}')`);
  run('beginGame(true)');
  run('keepHand()');
  run("G.phase='precombat_main';render();");
  return run('G');
}
function put(id, side) {
  const t = side === 'enemy' ? 'G.enemy' : 'G.my';
  return run(`${t}.board.push({id:'${id}',tapped:false,sick:false});${t}.board.length-1`);
}
function hand(ids, mana) {
  run(`G.my.hand=${JSON.stringify(ids.map(i => ({ id: i })))};G.my.mana=${mana};G.phase='precombat_main';`);
}

/* ---------- 断言开始（每条断言描述的是"修复后应有"的行为） ---------- */

test('A1 play 项充 keeps hand objects', () => {
  fresh('neutral', 'jin');
  hand(['xiangchong'], 10);
  run('onHandCardClick(0)');
  const h = run('JSON.stringify(G.my.hand)');
  const obj = run('G.my.hand.every(c=>c&&typeof c==="object"&&c.id)');
  if (!obj) throw new Error('hand has non-object entry: ' + h);
  if (!run('G.my.hand.some(c=>c.id==="ligun")')) throw new Error('ligun not fetched');
  run('render()');
  return 'hand=' + h;
});

test('A2 bond recompute does not throw', () => {
  fresh('song', 'jin');
  put('yuefei'); put('zhangxian');
  run('recomputeBoard()');
  const atk = run("getAtk(G.my.board.find(c=>c.id==='yuefei'))");
  return 'yuefei atk=' + atk;
});

test('A3 连环马 resolves', () => {
  fresh('neutral', 'jin');
  put('linchong');
  hand(['lianhuanma'], 10);
  run('onHandCardClick(0)');
  return 'atk=' + run("getAtk(G.my.board[0])");
});

test('A4 equipment buff survives recompute', () => {
  fresh('jin', 'song');
  put('wanyan_wuzhu');
  const before = run('getAtk(G.my.board[0])');
  hand(['tiefutu'], 10);
  run('onHandCardClick(0)');
  const after = run('getAtk(G.my.board[0])');
  if (after - before !== 2) throw new Error(`expected +2, before=${before} after=${after}`);
  return `${before} -> ${after}`;
});

test('A5 段和誉 ETB + lifelink', () => {
  fresh('dali', 'song');
  const life0 = run('G.my.life');
  hand(['duanheyu'], 10);
  run('onHandCardClick(0)');
  const life1 = run('G.my.life');
  if (life1 - life0 !== 1) throw new Error('no ETB heal: ' + life0 + '->' + life1);
  if (!run("hasPower(G.my.board[0],'lifelink')")) throw new Error('lifelink not detected');
  return life0 + '->' + life1;
});

test('A6 宗泽 ETB makes 2 民夫', () => {
  fresh('song', 'jin');
  hand(['zongze'], 10);
  run('onHandCardClick(0)');
  const n = run("G.my.board.filter(c=>c.id==='token_minfu').length");
  if (n !== 2) throw new Error('minfu tokens=' + n);
  return 'tokens=' + n;
});

test('A7 targeted spell charges mana once', () => {
  fresh('song', 'jin');
  put('weiming', 'enemy');
  hand(['moyouxu'], 2);
  run('onHandCardClick(0)');
  const mid = run('G.my.mana');
  if (mid !== 2) throw new Error('mana deducted before target chosen: ' + mid);
  run('resolveTarget(0)');
  const end = run('G.my.mana');
  if (end !== 0) throw new Error('expected 0 mana after resolve, got ' + end);
  return 'mana 2 -> ' + mid + ' -> ' + end;
});

test('A8 sick unit cannot be declared as attacker', () => {
  fresh('song', 'jin');
  run("G.my.board.push({id:'zongze',tapped:false,sick:true});G.phase='declare_attack';");
  run('toggleAttacker(0)');
  const n = run('pendingAttackers.length');
  if (n !== 0) throw new Error('sick unit selected');
  return 'attackers=' + n;
});

test('A9 ward absorbs first lethal damage', () => {
  fresh('song', 'jin');
  run("G.my.board=[{id:'yuefei',tapped:false,sick:false}];G.enemy.board=[{id:'guansheng',tapped:false,sick:false}];G.phase='declare_attack';pendingAttackers=[0];attackTarget=0;");
  run('confirmAttack()');
  run('drainNow()');
  const alive = run("G.enemy.board.some(c=>c.id==='guansheng')");
  if (!alive) throw new Error('ward unit died to first lethal damage');
  return 'ward unit survived round 1';
});

test('A10 AI turn runs without throwing', () => {
  fresh('song', 'jin');
  run('G.turn=2;G.active=1;G.enemy.hand=[{id:"yuefei"},{id:"linan"}];if(!G.enemy.deck.length)G.enemy.deck.push("linan","linan");');
  run('runOpponentTurn()');
  drain(400);
  return 'turn=' + run('G.turn');
});

test('A11 deck legality (all precons)', () => {
  const fr = ['song', 'jin', 'xixia', 'dali', 'neutral', 'pink', 'song_pink'];
  const bad = [];
  fr.forEach(f => {
    for (let i = 0; i < 30; i++) {
      const d = run(`buildDeck('${f}')`);
      if (d.length !== 60) { bad.push(f + ':size' + d.length); break; }
      const lands = d.filter(id => run(`CARD_DB['${id}'].type`) === 'land').length;
      if (lands < 22 || lands > 24) { bad.push(f + ':lands' + lands); break; }
      const cnt = {};
      d.forEach(id => cnt[id] = (cnt[id] || 0) + 1);
      const over = Object.entries(cnt).find(([, n]) => n > 4);
      if (over) { bad.push(f + ':x' + over[1] + ' ' + over[0]); break; }
    }
  });
  if (bad.length) throw new Error(bad.join(' | '));
  return '7 precons x30 samples legal';
});

test('A12 hand over 7 is kept until end of turn', () => {
  fresh('song', 'jin');
  run('G.my.hand=[];drawTo(G.my,9);');
  const n = run('G.my.hand.length');
  if (n !== 9) throw new Error('drawTo trimmed hand to ' + n);
  run("runPhase('end_turn')");
  const n2 = run('G.my.hand.length');
  if (n2 !== 7) throw new Error('end turn did not trim to 7: ' + n2);
  return 'drawn 9, after end_turn ' + n2;
});

test('A13 以逸待劳 does not double mana', () => {
  fresh('song', 'jin');
  run("G.my.lands=[{id:'linan',tapped:true},{id:'linan',tapped:true}];G.my.manaMax=2;G.my.mana=0;");
  hand(['yiyi'], 1);
  run('onHandCardClick(0)');
  const mana = run('G.my.mana');
  if (mana !== 0) throw new Error('mana refilled for free: ' + mana);
  return 'mana=' + mana;
});

test('A14 attacker with 畏战 cannot attack', () => {
  fresh('song', 'jin');
  run("G.my.board=[{id:'liuguangshi',tapped:false,sick:false}];G.phase='declare_attack';");
  run('toggleAttacker(0)');
  if (run('pendingAttackers.length') !== 0) throw new Error('cant_attack unit selected');
  return 'ok';
});

test('A15 崇学 button gating', () => {
  fresh('song', 'jin');
  const before = run("document.getElementById('chongxue-btn').style.display");
  if (before === 'inline-block') throw new Error('chongxue button visible without 崇学');
  hand(['chongxue'], 10);
  run('onHandCardClick(0)');
  const after = run("document.getElementById('chongxue-btn').style.display");
  if (after !== 'inline-block') throw new Error('chongxue button hidden after casting 崇学');
  run('G.my.mana=1;chongxueJudge()');
  if (!run('Array.isArray(G.my.chongxue)&&G.my.chongxue.length===1')) throw new Error('judge did not set exactly one school: ' + run('JSON.stringify(G.my.chongxue)'));
  return 'gated ok, school=' + run('JSON.stringify(G.my.chongxue)');
});

test('A16 static data self-check wires up', () => {
  if (typeof run('typeof validateGameData') !== 'function' && run('typeof validateGameData') !== 'function') throw new Error('no validateGameData');
  const r = run('JSON.stringify(validateGameData())');
  return r.slice(0, 400);
});

test('A17 非主阶段不能出将', () => {
  fresh('song', 'jin');
  hand(['yuefei'], 10);
  run("G.phase='declare_attack'");
  run('onHandCardClick(0)');
  if (run('G.my.board.length') !== 0) throw new Error('unit played outside main phase');
  return 'blocked';
});

test('A18 铁壁只挡第一次致命伤', () => {
  fresh('song', 'jin');
  run("G.enemy.board=[{id:'guansheng',tapped:false,sick:false}];");
  run("damageUnit(G.enemy.board[0],99,{deathtouch:true});");
  if (run('G.enemy.board.length') !== 1) throw new Error('ward unit died on first lethal');
  run("damageUnit(G.enemy.board[0],99,{deathtouch:true});cleanupDead();");
  if (run('G.enemy.board.length') !== 0) throw new Error('ward unit survived second lethal');
  return 'first absorbed, second kills';
});

test('A19 指定目标期间手牌下标变化不出错', () => {
  fresh('song', 'jin');
  put('weiming', 'enemy');
  hand(['moyouxu', 'guozhai'], 4);
  run('onHandCardClick(0)');            // 莫须有 -> 进入选目标
  if (run('G.my.mana') !== 4) throw new Error('mana charged before resolve');
  run('onHandCardClick(1)');            // 打国债，手牌下标整体移位
  const mid = run('G.my.mana');
  run('cancelTarget()');
  if (run('G.my.mana') !== mid) throw new Error('cancel changed mana: ' + mid + ' -> ' + run('G.my.mana'));
  run('onHandCardClick(0)');            // 莫须有现在是 0 号位
  run('resolveTarget(0)');
  if (run('G.enemy.board.length') !== 0) throw new Error('wrong card resolved / target survived');
  if (run('G.my.mana') !== mid - 2) throw new Error('mana not charged exactly once: ' + mid + ' -> ' + run('G.my.mana'));
  return 'mid=' + mid + ' end=' + run('G.my.mana');
});

test('A20 AI 的法术加成生效', () => {
  fresh('song', 'jin');
  run("G.active=1;G.turn=2;G.enemy.hand=[{id:'sunzi'}];G.enemy.lands=[{id:'taiyuan',tapped:false},{id:'taiyuan',tapped:false},{id:'taiyuan',tapped:false}];G.enemy.board=[{id:'guansheng',tapped:false,sick:false}];G.enemy.deck=['linan','linan'];");
  const before = run("getAtk(G.enemy.board[0])");
  run('aiTakeTurn()');
  const after = run("getAtk(G.enemy.board[0])");
  const buff = run("G.enemy.board[0].buffAtk");
  if (buff !== 2) throw new Error('buff not applied (buffAtk=' + buff + ')');
  if (after - before < 2) throw new Error(`buff lost: ${before} -> ${after}`);
  return `${before} -> ${after} (buffAtk=${buff})`;
});

test('A21 空城计挡住 AI 进攻', () => {
  fresh('song', 'jin');
  run("G.my.noAttackTurn=true;G.active=1;G.enemy.board=[{id:'guansheng',tapped:false,sick:false}];G.enemy.hand=[];G.enemy.lands=[{id:'taiyuan',tapped:false}];G.enemy.deck=['linan'];");
  const life0 = run('G.my.life');
  run('aiTakeTurn()');
  drain(400);
  if (run('G.my.life') !== life0) throw new Error('AI attacked through 空城计');
  return 'life kept at ' + run('G.my.life');
});

test('A22 美人计锁定目标', () => {
  fresh('song', 'jin');
  run("G.enemy.board=[{id:'guansheng',tapped:false,sick:false}];");
  hand(['meiren'], 3);
  run('onHandCardClick(0)');
  run('resolveTarget(0)');
  if (run("G.enemy.board[0].cantAttackNext") !== true) throw new Error('target not locked');
  run("G.active=1;G.enemy.hand=[];G.enemy.deck=['linan'];G.enemy.lands=[{id:'taiyuan',tapped:false}];");
  const life0 = run('G.my.life');
  run('aiTakeTurn()');
  drain(400);
  if (run('G.my.life') !== life0) throw new Error('locked unit still attacked');
  return 'locked and idle';
});

test('A23 结算只写一份录像', () => {
  store.clear();
  fresh('song', 'jin');
  run('endGame(true);endGame(true);');
  const n = run("JSON.parse(localStorage.getItem('shaosong_replays')||'[]').length");
  if (n !== 1) throw new Error('replays written ' + n + ' times');
  return 'replays=' + n;
});

test('A24 崇学/崇教区间不重叠', () => {
  for (let i = 0; i < 300; i++) {
    const n = run('rollChongxue().schools.length');
    if (n !== 1) throw new Error('崇学 produced ' + n + ' schools');
  }
  return '300 rolls clean';
});

test('A25 名品(item)可结算', () => {
  fresh('pink', 'song');
  put('zhangguifei');
  const def0 = run('getDef(G.my.board[0])');
  hand(['fengguan'], 3);
  run('onHandCardClick(0)');
  const def1 = run('getDef(G.my.board[0])');
  if (def1 - def0 !== 3) throw new Error(`item did nothing: ${def0} -> ${def1}`);
  if (!run('hasWard(G.my.board[0])')) throw new Error('ward not granted');
  if (run("G.my.grave[G.my.grave.length-1]") !== 'fengguan') throw new Error('item not sent to grave');
  return `${def0} -> ${def1}`;
});

test('A26 铁壁不能挡"消灭"效果', () => {
  fresh('song', 'jin');
  run("G.enemy.board=[{id:'zhangjun',tapped:false,sick:false}];");
  hand(['moyouxu'], 3);
  run('onHandCardClick(0)');
  run('resolveTarget(0)');
  if (run('G.enemy.board.length') !== 0) throw new Error('destroy effect blocked by ward');
  return 'destroyed';
});

test('A27 换局后残留定时器不再操作新对局', () => {
  fresh('song', 'jin');
  run("G.active=1;G.enemy.hand=[];G.enemy.deck=['linan'];runOpponentTurn();");
  run('backToMenu()');
  drain(400);
  if (run('G') !== null) throw new Error('stale timer mutated state');
  return 'no leak';
});

test('A28 钩镰枪阻止 AI 当回合攻击', () => {
  fresh('neutral', 'jin');
  run("G.enemy.cantAttack=true;G.active=0;");
  run("G.active=1;G.enemy.board=[{id:'guansheng',tapped:false,sick:false}];G.enemy.hand=[];G.enemy.lands=[{id:'taiyuan',tapped:false}];G.enemy.deck=['linan'];");
  const life0 = run('G.my.life');
  run('aiTakeTurn()');
  drain(400);
  if (run('G.my.life') !== life0) throw new Error('钩镰枪 had no effect');
  return 'blocked, life=' + run('G.my.life');
});

test('A29 随机出牌压力测试', () => {
  const ids = Object.keys(run('CARD_DB')).filter(id => !run(`CARD_DB['${id}'].isToken`));
  let plays = 0;
  for (let g = 0; g < 6; g++) {
    fresh('song', 'jin');
    for (let step = 0; step < 45; step++) {
      const id = ids[Math.floor(Math.random() * ids.length)];
      run(`G.over=false;G.my.hand=[{id:'${id}'}];G.my.mana=12;G.my.life=25;G.phase='precombat_main';G.my.landsPlayedThisTurn=0;`);
      run("G.enemy.board=[{id:'weiming',tapped:false,sick:false},{id:'zhangjun',tapped:false,sick:false}];G.enemy.life=25;");
      try {
        run('onHandCardClick(0)');
        if (run('!!G.needChooseTarget')) run('resolveTarget(0)');
      } catch (e) { throw new Error(`card ${id} threw: ${e.message}`); }
      drain(60);
      if (run('!G')) break;
      plays++;
    }
  }
  return plays + ' card plays without exception';
});

test('A30 随机战斗压力测试', () => {
  const units = ['yuefei', 'linchong', 'wusong', 'gongsunsheng', 'lujunyi', 'guansheng', 'wanyan_loushi',
    'zhangjun', 'xiangchong', 'ligun', 'yangxiong_shixiu', 'liyuanhao', 'duanheyu', 'token_guard', 'token_cav'];
  let fights = 0;
  for (let g = 0; g < 8; g++) {
    fresh('song', 'jin');
    for (let step = 0; step < 12; step++) {
      const mine = [], theirs = [];
      for (let i = 0; i < 3; i++) mine.push(units[Math.floor(Math.random() * units.length)]);
      for (let i = 0; i < 3; i++) theirs.push(units[Math.floor(Math.random() * units.length)]);
      run(`G.over=false;G.my.life=30;G.enemy.life=30;G.my.board=${JSON.stringify(mine.map(id => ({ id, tapped: false, sick: false })))};G.enemy.board=${JSON.stringify(theirs.map(id => ({ id, tapped: false, sick: false })))};G.phase='declare_attack';pendingAttackers=[0,1,2];attackTarget=${Math.random() < 0.5 ? 'null' : '0'};`);
      try { run('confirmAttack()'); drain(60); } catch (e) { throw new Error('combat threw: ' + e.message); }
      if (run('!G')) break;
      fights++;
    }
  }
  return fights + ' combats without exception';
});

  return { loadOk: !loadErr, loadError: loadErr && loadErr.message, data: staticChecks(), results, logs: env.logs };
}

if (require.main === module) {
  const r = runSuite(process.argv[2]);
  console.log('== LOAD ==');
  console.log(r.loadOk ? 'LOAD_OK' : 'LOAD_FAIL: ' + r.loadError);
  if (r.logs && r.logs.length) r.logs.forEach(l => console.log('[' + l.level + '] ' + l.text));
  console.log('\n== DATA ==');
  r.data.forEach(([k, v]) => console.log(k + ': ' + v));
  console.log('\n== BEHAVIOUR（断言描述的是修复后应有的行为） ==');
  console.log(r.results.map(x => `${x[1]}  ${x[0]}${x[2] ? '  [' + x[2] + ']' : ''}`).join('\n'));
  const fails = r.results.filter(x => x[1] === 'FAIL').length;
  console.log(`\nSUMMARY: ${r.results.length - fails}/${r.results.length} passed`);
  if (fails || !r.loadOk) process.exitCode = 1;
}
module.exports = { runSuite };
