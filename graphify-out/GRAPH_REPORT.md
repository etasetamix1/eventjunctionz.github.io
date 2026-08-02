# Graph Report - eventJunction  (2026-08-02)

## Corpus Check
- 2 files · ~137,297 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 14 nodes · 19 edges · 3 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]

## God Nodes (most connected - your core abstractions)
1. `switchTheme()` - 5 edges
2. `applyTheme()` - 3 edges
3. `open()` - 3 edges
4. `reducedMotion()` - 2 edges
5. `setToggleState()` - 2 edges
6. `setThemeOrigin()` - 2 edges
7. `runFallbackRipple()` - 2 edges
8. `show()` - 2 edges
9. `activate()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `switchTheme()` --calls--> `applyTheme()`  [EXTRACTED]
  main.js → main.js  _Bridges community 2 → community 1_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.38
Nodes (3): activate(), open(), show()

### Community 1 - "Community 1"
Cohesion: 0.5
Nodes (4): reducedMotion(), runFallbackRipple(), setThemeOrigin(), switchTheme()

### Community 2 - "Community 2"
Cohesion: 1.0
Nodes (2): applyTheme(), setToggleState()

## Knowledge Gaps
- **Thin community `Community 2`** (2 nodes): `applyTheme()`, `setToggleState()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `switchTheme()` connect `Community 1` to `Community 0`, `Community 2`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `applyTheme()` connect `Community 2` to `Community 0`, `Community 1`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._