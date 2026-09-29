# tools/ · 自检与回归测试

针对单文件游戏 `绍宋决.html` 的零依赖 Node 测试台。**不需要浏览器、不需要 npm install**，只用 Node 内置模块。

```bash
node tools/check.js          # 一键跑完全部三项检查（推荐）
```

全部通过退出码 `0`，任一失败退出码 `1`，可直接用于提交前检查或 CI。

## 三个检查项

| 脚本 | 作用 |
|---|---|
| `harness.js` | 30 项断言：崩溃复现、结算正确性、加成分层、战斗规则、计时器隔离、预组合法性、重复键检测 |
| `allcards.js` | 逐张试跑全部可抽卡（361 张），确认都能打出、结算不抛异常、牌进入正确区域 |
| `cssvars.js` | 静态检查所有 `var(--x)` 引用是否都在 `:root` 定义过（未定义会让费用球/边框颜色静默失效） |

也可以单独运行，并可指定其它 HTML 文件：

```bash
node tools/harness.js
node tools/allcards.js path/to/绍宋决.html
node tools/cssvars.js
```

## 它是怎么跑起来的

`domstub.js` 用 `vm` 把页面里的 `<script>` 加载到 Node 中，并塞进一个极简 DOM stub：

- `document.getElementById / querySelector(All) / createElement / body`
- `localStorage`（内存 Map）、`navigator.vibrate`、`alert`、`confirm`
- `setTimeout / setInterval` **不真的等待**，而是收集到队列里，由 `drain()` 手动推进
  （这样 AI 回合、战斗结算、`rollDice` 动画都能瞬时跑完）

因为脚本里的函数与 `let` 变量都在同一个全局词法环境里，测试可以直接调用游戏内部函数：

```js
const { load } = require('./domstub');
const env = load();                       // 默认 ../绍宋决.html
env.run("initGame('ai','song','jin');beginGame(true);keepHand();");
env.run("G.my.hand=[{id:'lianhuanma'}];G.my.mana=10;G.phase='precombat_main';");
env.run('onHandCardClick(0)');            // 出牌
env.drain();                              // 推进 setTimeout 链
console.log(env.run("getAtk(G.my.board[0])"));
```

## 页面自带的自检

游戏本身在启动时会跑 `validateGameData()`，结果输出到浏览器控制台：

```
[绍宋决·自检] 通过：371 张卡牌，无空效果/预组违规。
```

若某张牌的关键词没有任何实现分支（"空牌"），会以 `console.warn` 列出卡牌名与关键词。
测试台会把这段输出转成 `页面自检>` 前缀显示，避免刷屏。

## 已知取舍

- DOM stub 不解析 `innerHTML`，所以**不能模拟点击**（`bindClicks` 绑定的 handler 跑不到）。
  测试改为直接调用 `onHandCardClick / toggleLand / toggleAttacker / confirmAttack` 等函数——
  这正是排查结算层问题时想要的粒度；纯 UI 交互仍需人工在浏览器里点。
- `setInterval` 不会真的循环（只保留首个回调），因此 `rollDice` 的骰子动画需要直接调 `beginGame()`。
- 断言里的中文用例名是给读日志的人看的；`A29/A30` 是随机压力测试，理论上偶发失败需复跑确认。
