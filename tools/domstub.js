/* 极简 DOM stub + 载入器
 *
 * 目的：让「绍宋决.html」这个单文件游戏能在 Node 里被加载，并直接调用其内部函数
 * （G / initGame / beginGame / playCard / confirmAttack / render ...）做自动化验证，
 * 不需要浏览器、也不引入任何依赖。
 *
 * 覆盖了游戏脚本实际用到的东西：
 *   document.getElementById / querySelector / querySelectorAll / createElement / body
 *   localStorage、navigator.vibrate、alert、confirm
 *   setTimeout / setInterval（收集到队列里，由 drain() 手动推进，避免测试卡在真实等待上）
 *
 * 用法：
 *   const { load } = require('./domstub');
 *   const env = load();              // 默认加载 ../绍宋决.html
 *   env.run("initGame('ai','song','jin')");
 *   env.drain();                     // 推进游戏里的 setTimeout 链（AI 回合、战斗结算等）
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DEFAULT_HTML = path.join(__dirname, '..', '绍宋决.html');

function mkEl(id) {
  const el = {
    id, _text: '', _html: '', _value: '', style: {}, dataset: {}, children: [],
    classList: { add() { }, remove() { }, contains() { return false; }, toggle() { } },
    appendChild(c) { this.children.push(c); return c; },
    removeChild() { }, remove() { }, insertAdjacentHTML() { },
    addEventListener() { }, removeEventListener() { }, focus() { },
    getBoundingClientRect() { return { left: 0, top: 0, width: 92, height: 128 }; },
    querySelector() { return null; }, querySelectorAll() { return []; },
    get offsetHeight() { return 60; }, set offsetHeight(v) { },
    click() { if (typeof this.onclick === 'function') this.onclick({ preventDefault() { } }); }
  };
  Object.defineProperty(el, 'textContent', { get() { return this._text; }, set(v) { this._text = String(v); } });
  Object.defineProperty(el, 'innerHTML', { get() { return this._html; }, set(v) { this._html = String(v); } });
  Object.defineProperty(el, 'value', { get() { return this._value; }, set(v) { this._value = String(v); } });
  return el;
}

function load(htmlPath) {
  const file = htmlPath || DEFAULT_HTML;
  const html = fs.readFileSync(file, 'utf8');
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('未在文件中找到 <script> 块: ' + file);
  const code = m[1];

  const reg = {};
  const getEl = (id) => (reg[id] || (reg[id] = mkEl(id)));
  const timers = [];
  let timerId = 1;
  const store = new Map();
  /* 页面脚本自己的 console 输出（例如启动自检结果）收集起来，避免刷屏 */
  const logs = [];
  const capture = (level) => (...args) => logs.push({ level, text: args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ') });
  const quietConsole = { log: capture('log'), warn: capture('warn'), error: capture('error'), info: capture('info') };

  const sandbox = {
    console: quietConsole,
    document: {
      getElementById: getEl,
      querySelector: (s) => getEl('sel:' + s),
      querySelectorAll: () => [],
      createElement: (t) => mkEl('new:' + t),
      body: { appendChild() { }, insertAdjacentHTML() { } },
      addEventListener() { }
    },
    window: { innerWidth: 1400, innerHeight: 900, addEventListener() { } },
    navigator: { vibrate() { } },
    localStorage: {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k)
    },
    alert: () => { }, confirm: () => true,
    setTimeout: (fn) => { timers.push({ fn, id: timerId }); return timerId++; },
    clearTimeout: () => { },
    setInterval: (fn) => { timers.push({ fn, id: timerId, interval: true }); return timerId++; },
    clearInterval: (id) => { const i = timers.findIndex(t => t.id === id); if (i >= 0) timers.splice(i, 1); },
    requestAnimationFrame: (fn) => { timers.push({ fn }); return timerId++; }
  };
  sandbox.globalThis = sandbox;

  function drain(limit = 500) {
    let n = 0;
    while (timers.length && n++ < limit) {
      const t = timers.shift();
      if (t.interval) continue;            /* 不真的跑 interval，避免死循环 */
      t.fn();
    }
  }
  sandbox.drainNow = () => drain();

  const ctx = vm.createContext(sandbox);
  const run = (js) => vm.runInContext(js, ctx);

  let loadError = null;
  try { run(code); } catch (e) { loadError = e; }

  return { file, html, code, ctx, run, drain, store, getEl, logs, loadError };
}

module.exports = { load, DEFAULT_HTML };
