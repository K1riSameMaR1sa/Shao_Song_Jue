# 绍宋决 · Shao Song Jue

基于穿越小说《绍宋》（榴弹怕水 著）的网页卡牌对战游戏，规则类似万智牌（MTG），单 HTML 文件自包含。

## 当前版本 v4.0.0-beta

### 已实现功能
- **AI 对战**：贪心出牌 + 自动选阻挡
- **自定义牌组**：60 张标准赛制，22-24 地，同名最多 4 张，优化 mana 曲线
- **完整 MTG 阶段流**：重置→维持→抽牌→战前主→战斗→战后主→结束→清除，手动点"下一阶段"推进
- **d20 掷骰猜先**：开局选大小决定先手
- **调度（mulligan）**：可重抽
- **悬停 tooltip**：任意卡牌显示详情
- **可折叠可拖动战报面板**
- **录像回放**：localStorage 保存最近 20 局
- **卡牌图鉴**：按阵营/类型/衍生物筛选（名品/计策分开）
- **手机适配**：响应式布局，卡片缩放，手牌横向滑动，长摁看详情
- **预组套牌预览**：阵营选择页可查看六阵营全部卡牌，单击弹详情
- **6 阵营可选**：宋/金/夏/理/中立梁山/后宫

### 阵营颜色轮
| 阵营 | 色 | 特性 |
|---|---|---|
| 宋 | 红 | 将攻击+1（士气），死守北伐 |
| 金 | 金黄 | 破甲（超额伤害打玩家），装备加持 |
| 夏 | 绿 | 将敏捷（召唤当回合可攻），牧场经济 |
| 理 | 紫 | 将攻击后挂-1/-1（蛊毒），控制流 |
| 中立 | 蓝 | 梁山108将，搭档检索，连环爆发 |
| 后宫 | 粉 | 居中牵制，返照北狩，辅助全场 |

**相克环**：宋→金→夏→理→宋（攻击被克方+1攻）
**相生环**：同场盟友+0/+1
**后宫居中**：辐射所有阵营

### 卡牌类型（共240+张）
- **将领**：攻防单位（含梁山108将、宋金名臣、西夏大理名人、后宫嫔妃）
- **州府/地**：单色地、双色地、异国无色地（罗马/君士坦丁等）、梁山专属地（梁山泊/聚义堂）、后宫地（慈宁宫/浣衣院）
- **名品（sorcery）**：只能主阶段用（史书：孙子兵法/春秋/左传/史记/资治通鉴；崇学/崇教判定牌；装备牌）
- **计策（instant）**：任意阶段可用（沉默/封驳/断章等counter；连环马/钩镰枪；百华阵；巫蛊/孔雀胆/浣洗院）
- **衍生物**：骑兵2/2敏捷、刀斧手2/3、弓箭手1/2穿喉、亲兵0/3铁壁、民夫0/1产粮、俘虏0/1产粮、奴隶1/1、女奴0/1（在场金将+1攻，被消灭时宋主-2威望）、石秀8/8敏捷舍命

### 特色机制
- **同生共死**：项充李衮搭档，任意进场找对方入手牌，同场时伤害分摊
- **杨雄石秀变身**：4/3铁壁杨雄死后自动变8/8敏捷石秀，舍命每回合-1/-1
- **林冲回光**：阵亡时对所有敌将造6伤（同归于尽）
- **武松单臂擒贼**：首次受伤时，被武将攻击则斩杀攻击方，被法术伤害则斩杀任意1敌将
- **崇学判定**：3费名品，花1粮掷d20定经学/理学/道学，持续整局，可辩论重投
- **崇教判定**：3费名品，按宋朝史实分道教/佛教/民间教
- **百华阵**：3费瞬间，活捉对手1将归己用
- **连环马**：3费瞬间，中立将+2/+0并敏捷
- **钩镰枪**：4费瞬间，康对手攻击宣告，金将额外造3伤

### 关键词
穿喉（死触）、敏捷（突击）、死守/铁壁（警戒）、先发、破阵（践踏）、抚绥（死连）、庙算、营田、血战、纵横、勤王、坚壁、殉国、同生、共死、回光、单臂擒贼、舍命、变身体

### 更新归档
- **v4.0.0-beta**：后宫粉新增7张牌（吴皇后/刘贵妃/张婕妤/朱贵妃/凤冠霞帔/六宫粉黛/红颜祸水）；新增红粉双色预组（宋+后宫）；buildDeck支持双色组牌
- **v3.1.0-beta**：预组60张标准赛制+mana曲线优化；新增会宁府/黄龙府/大理城/天龙寺/慈宁宫/浣衣院；查看套牌界面展示六阵营预组；AI优化（低费优先、法术优先级、高攻打脸）；梁山108将全加入；项充李衮同生共死、杨雄石秀变身、林冲回光、武松单臂擒贼；连环马/钩镰枪瞬间牌；梁山泊/聚义堂专属地
- **v3.0.0-beta**：六阵营颜色轮系统；崇学/崇教d20判定牌；Counter牌（沉默/封驳/断章）；完整MTG 12阶段流；d20猜先/调度/录像回放；手机端适配
- **v2.0-beta**：宋金夏理四阵营基础卡牌；AI对战/自定义牌组；关键词系统（穿喉/敏捷/铁壁/先发等）

## 本地运行
直接用浏览器打开 `绍宋决.html` 即可，无需服务器。

## 技术栈
- 单文件 HTML（内联 CSS + 原生 JS）
- 无框架、无构建工具
- localStorage 保存录像与牌组

## 致谢
原著：榴弹怕水《绍宋》
灵感：Magic: The Gathering、三国杀、绘卷水浒

---

# Shao Song Jue (English)

A browser-based trading card game (TCG) set during the Southern Song dynasty, based on the time-travel novel *Shao Song* by Liu Dan Pa Shui. Rules inspired by Magic: The Gathering. Single self-contained HTML file.

## Version v4.0.0-beta

### Features
- **AI Battles**: Greedy play + auto-blocking
- **Custom Deck**: 60-card standard, 22-24 lands, max 4 copies, optimized mana curve
- **Full MTG Phase Flow**: Untap → Upkeep → Draw → Precombat Main → Combat → Postcombat Main → End → Cleanup
- **d20 Dice Roll**: Choose high/low for first player
- **Mulligan**: Free redraw
- **Hover Tooltip**: Full card details
- **Collapsible Draggable Battle Log**
- **Replay System**: Last 20 matches in localStorage
- **Card Codex**: Filter by faction / type / token
- **Mobile Responsive**: Scaled cards, horizontal hand scroll, long-press for details
- **Preset Deck Preview**: Browse all 6 factions' cards, click for details
- **6 Factions**: Song / Jin / Xixia / Dali / Neutral Liangshan / Harem

### Faction Color Wheel
| Faction | Color | Trait |
|---|---|---|
| Song | Red | +1/+0 to attackers (morale) |
| Jin | Gold | Trample, equipment buffs |
| Xixia | Green | Haste, ramp economy |
| Dali | Purple | -1/-1 poison counters, control |
| Neutral | Blue | Liangshan 108 heroes, partner search, combo burst |
| Harem | Pink | Center, counters all factions |

**Counter cycle**: Song → Jin → Xixia → Dali → Song (+1 attack vs countered)
**Ally cycle**: Adjacent allies get +0/+1
**Harem**: Supports all factions from center

### Card Types (240+)
- **Units**: Attack/defense (Liangshan 108, Song/Jin officials, Xixia/Dali figures, harem concubines)
- **Lands**: Mono/dual/exotic colorless, Liangshan lands (Water Margin/Juyi Hall), harem lands (Cining Palace/Huanyi Yard)
- **Sorceries**: Main phase only (history books, learning/religion judgments, equipment)
- **Instants**: Any phase (counterspells, chain horse, hook spear, hundred flower formation)
- **Tokens**: Cavalry 2/2 Haste, Axemen 2/3, Archer 1/2 Deathtouch, Guard 0/3 Ward, Peasant 0/1 Ramp, Slave 1/1, Female Slave 0/1 (Jin lords +1 attack, dies = Song player -2 life), Shi Xiu 8/8 Haste Fading

### Signature Mechanics
- **Life/Death Partners**: Xiang Chong & Li Gun search each other, share damage
- **Yangxiong→Shixiu Transform**: 4/3 Ward dies → becomes 8/8 Haste Fading (-1/-1 each turn)
- **Lin Chong Flashback**: On death, 6 damage to all enemy units
- **Wu Song Single-Arm Capture**: First damage → kills attacker if combat, kills any enemy if spell
- **Learning Judgment**: 3-cost sorcery, d20 roll decides Classic/Li/Dao studies, persists all game
- **Religion Judgment**: 3-cost sorcery, Daoism/Buddhism/Folk per Song history
- **Hundred Flower Formation**: 3-cost instant, steal an enemy unit permanently
- **Chain Horse**: 3-cost instant, +2/+0 and Haste to all neutral units
- **Hook Spear**: 4-cost instant, counters attack declaration, +3 damage to Jin units

### Keywords
Deathtouch, Haste, Ward, First Strike, Trample, Lifelink, Ramp, Bloodbath, Diplomacy, Relief, Fortify, Martyrdom, Partner, Shared Death, Flashback, Single-Arm Capture, Fading, Transform

## Run Locally
Open `绍宋决.html` in any browser. No server needed.

## Tech Stack
- Single-file HTML (inline CSS + vanilla JS)
- No frameworks, no build tools
- localStorage for replays and decks

## Credits
Original novel: *Shao Song* by Liu Dan Pa Shui
Rules inspiration: Magic: The Gathering, Legends of the Three Kingdoms, *Water Margin*
