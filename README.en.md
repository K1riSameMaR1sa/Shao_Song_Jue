# Shao Song Jue · 绍宋决

A web-based trading card game (TCG) inspired by the novel *Shao Song* (绍宋) by Liudan Pashui (榴弹怕水). Rules are modeled after Magic: The Gathering (MTG). Single self-contained HTML file — no build step, no server needed.

## Current Version v24

### Features
- **AI Opponent**: Greedy play + auto-blocking
- **Custom Deck Builder**: 60-card deck (22-24 lands), max 4 copies per card
- **Full MTG Turn Flow**: Untap → Upkeep → Draw → Precombat Main → Combat → Postcombat Main → End → Cleanup, all advanced manually via "Next Phase"
- **d20 Coin Flip**: Roll high/low to decide who goes first
- **Mulligan**: Redrawable opening hand
- **Hover Tooltip**: Full card details on hover
- **Collapsible & Draggable Battle Log**
- **Replay System**: Last 20 matches saved to localStorage
- **Card Codex**: Filter by faction / type / token (Sorcery and Instant separated)
- **Mobile Responsive**: Scaled cards, horizontal hand scroll, touch-friendly buttons

### Faction Color Wheel
| Faction | Color | Trait |
|---|---|---|
| Song (宋) | Red | +1 attack on units (morale), last stand, northern expedition |
| Jin (金) | Gold | Trample (overflow damage hits player) |
| Xixia (夏) | Green | Haste (units can attack the turn they enter) |
| Dali (理) | Purple | -1/-1 counter on attackers (gu poison) |
| Neutral (中立) | Blue | Flexible, strategems |
| Imperial Harem (后宫) | Pink | Center-positioned, counter-spell-like effects |
| Qi (伪齐) | Gray | Fence-sitter |

**Counter Cycle**: Song → Jin → Xixia → Dali → Song (attackers get +1 vs the faction they counter)
**Ally Cycle**: Same-side allies get +0/+1
**Harem at Center**: Radiates influence across all factions

### Card Types
- **Units**: Attack/defense creatures (120+ cards)
- **Lands**: Mono-color, dual-color (6 types), exotic colorless (Rome / Constantinople / Arab port / India)
- **Sorcery**: Main-phase only (including history classics: Sunzi Art of War / Spring and Autumn / Zuo Zhuan / Records of Grand Historian / Zizhi Tongjian / Analects / Mencius / Book of Rites)
- **Instant**: Playable at any phase (Moxuanyou / Qingjunce / Wugu / Peacock Poison / Huanxiyuan, etc.)
- **Tokens**: Cavalry 2/2 haste, Axeman 2/3, Archer 1/2 deathtouch, Retainer 0/3 ward

### Keywords
Deathtouch, Haste, Ward, Vigilance, First Strike, Trample, Lifelink, Tactician, Manafix, Blood Oath, Counterspell, etc.

## Running Locally
Simply open `绍宋决.html` in any modern browser. No server, no installation.

## Tech Stack
- Single-file HTML (inline CSS + vanilla JS)
- No frameworks, no build tools
- localStorage for replays and saved decks

## Credits
- Original novel: *Shao Song* by Liudan Pashui (榴弹怕水)
- Rules inspiration: Magic: The Gathering, Legend of the Three Kingdoms (三国杀)
- Non-commercial fan work. All rights of the original author reserved.
