# 绍宋决 · Shao Song Jue

基于穿越小说《绍宋》（榴弹怕水 著）的网页卡牌对战游戏，规则类似万智牌（MTG），单 HTML 文件自包含。

## 当前版本 v1.0.3-beta

### 已实现功能
- **AI 对战**：贪心出牌 + 自动选阻挡
- **自定义牌组**：60 张（22-24 地），同名最多 4 张
- **完整 MTG 阶段流**：重置→维持→抽牌→战前主→战斗→战后主→结束→清除，手动点"下一阶段"推进
- **d20 掷骰猜先**：开局选大小决定先手
- **调度（mulligan）**：可重抽
- **悬停 tooltip**：任意卡牌显示详情
- **可折叠可拖动战报面板**
- **录像回放**：localStorage 保存最近 20 局
- **卡牌图鉴**：按阵营/类型/衍生物筛选（名品/计策分开）
- **手机适配**：响应式布局，卡片缩放，手牌横向滑动

### 阵营颜色轮
| 阵营 | 色 | 特性 |
|---|---|---|
| 宋 | 红 | 将攻击+1（士气），死守北伐 |
| 金 | 金黄 | 破甲（超额伤害打玩家） |
| 夏 | 绿 | 将敏捷（召唤当回合可攻） |
| 理 | 紫 | 将攻击后挂-1/-1（蛊毒） |
| 中立 | 蓝 | 灵活应变，庙算纵横 |
| 后宫 | 粉 | 居中牵制，返照北狩 |
| 伪齐 | 灰 | 见风使舵 |

**相克环**：宋→金→夏→理→宋（攻击被克方+1攻）
**相生环**：同场盟友+0/+1
**后宫居中**：辐射所有阵营

### 卡牌类型
- **将领**：攻防单位（120+ 张）
- **州府/地**：单色地、双色地（6张）、异国无色地（罗马/君士坦丁/大食/天竺）
- **名品（sorcery）**：只能主阶段用（含史书类：孙子兵法/春秋/左传/史记/资治通鉴/论语/孟子/礼记）
- **计策（instant）**：任意阶段可用（莫须有/清君侧/突袭水寨/巫蛊/孔雀胆/浣洗院等）
- **衍生物**：骑兵2/2敏捷、刀斧手2/3、弓箭手1/2穿喉、亲兵0/3铁壁

### 关键词
穿喉、敏捷、死守/铁壁、列阵、陷阵、强弩、抚绥、先发、破阵、庙算、营田、血战、反问、纵横、勤王、坚壁、殉国

## 本地运行
直接用浏览器打开 `绍宋决.html` 即可，无需服务器。

## 技术栈
- 单文件 HTML（内联 CSS + 原生 JS）
- 无框架、无构建工具
- localStorage 保存录像与牌组

## 致谢
原著：榴弹怕水《绍宋》
灵感：Magic: The Gathering、三国杀

---

# Shao Song Jue (English)

A browser-based trading card game (TCG) set during the Southern Song dynasty, based on the time-travel novel *Shao Song* by Liu Dan Pa Shui. Rules inspired by Magic: The Gathering. Single self-contained HTML file.

## Version v1.0.3-beta

### Features
- **AI Battles**: Greedy play + auto-blocking
- **Custom Deck**: 60 cards (22-24 lands), max 4 copies per card
- **Full MTG Phase Flow**: Untap → Upkeep → Draw → Precombat Main → Combat → Postcombat Main → End → Cleanup. Manually advance with "Next Phase" button
- **d20 Dice Roll**: Choose high/low to decide first player
- **Mulligan**: Free redraw
- **Hover Tooltip**: Full card details on hover
- **Collapsible Draggable Battle Log**
- **Replay System**: Last 20 matches saved in localStorage
- **Card Codex**: Filter by faction / type / token
- **Mobile Responsive**: Scaled cards, horizontal hand scroll

### Faction Color Wheel
| Faction | Color | Trait |
|---|---|---|
| Song | Red | +1/+0 to your attackers (morale) |
| Jin | Gold | Trample (excess damage hits player) |
| Xixia | Green | Haste (summoning sickness bypass) |
| Dali | Purple | -1/-1 counter after attacking (gu poison) |
| Neutral | Blue | Flexible, versatile |
| Harem | Pink | Center, supports all factions |
| Qi | Gray | Opportunistic |

**Counter cycle**: Song → Jin → Xixia → Dali → Song (+1 attack vs countered faction)
**Ally cycle**: Adjacent allies get +0/+1
**Harem**: Supports all factions from center

### Card Types
- **Units**: Attack/defense creatures (120+)
- **Lands**: Mono-color, dual-color (6), exotic colorless (Rome/Constantinople/Dashi/Tianzhu)
- **Sorceries**: Main phase only (includes history books: Sun Zi Bing Fa / Chun Qiu / Zuo Zhuan / Shi Ji / Zi Zhi Tong Jian / Lun Yu / Meng Zi / Li Ji)
- **Instants**: Any phase (Mo Xu You / Qing Jun Ce / Xi Shui Zhai / Wu Gu / Kong Que Dan etc.)
- **Tokens**: Cavalry 2/2 Haste, Axemen 2/3, Archer 1/2 Deathtouch, Guard 0/3 Ward

### Keywords
Deathtouch, Haste, Ward/Indestructible, Vigilance, Trample, Reach, Lifelink, First Strike, Rampage, Divination, Cultivation, Bloodbath, Reverse, Diplomacy, Relief, Fortify, Martyrdom

## Run Locally
Open `绍宋决.html` in any browser. No server needed.

## Tech Stack
- Single-file HTML (inline CSS + vanilla JS)
- No frameworks, no build tools
- localStorage for replays and decks

## Credits
Original novel: *Shao Song* by Liu Dan Pa Shui
Rules inspiration: Magic: The Gathering, Legends of the Three Kingdoms
