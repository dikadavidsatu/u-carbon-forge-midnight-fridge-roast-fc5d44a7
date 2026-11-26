# Midnight Fridge Roast

[![make.fun · u-carbon-forge-midnight-fridge-roast-fc5d44a7](https://make.fun/badge/u-carbon-forge-midnight-fridge-roast-fc5d44a7.svg)](https://make.fun/bounty/u-carbon-forge-midnight-fridge-roast-fc5d44a7?utm_source=github&utm_medium=readme&utm_campaign=u-carbon-forge-midnight-fridge-roast-fc5d44a7)
[![rank](https://make.fun/badge/u-carbon-forge-midnight-fridge-roast-fc5d44a7/dikadavidsatu/u-carbon-forge-midnight-fridge-roast-fc5d44a7/rank.svg)](https://make.fun/bounty/u-carbon-forge-midnight-fridge-roast-fc5d44a7/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-carbon-forge-midnight-fridge-roast-fc5d44a7)
[![reward](https://make.fun/badge/u-carbon-forge-midnight-fridge-roast-fc5d44a7/dikadavidsatu/u-carbon-forge-midnight-fridge-roast-fc5d44a7/reward.svg)](https://make.fun/bounty/u-carbon-forge-midnight-fridge-roast-fc5d44a7?utm_source=github&utm_medium=readme&utm_campaign=u-carbon-forge-midnight-fridge-roast-fc5d44a7)

Entry for make.fun's **Midnight Fridge Roast** competition:
https://make.fun/bounty/u-carbon-forge-midnight-fridge-roast-fc5d44a7

## The roast

> Fridge, you run your light all night like a motel for leftovers — and I'm the only guest who ever checks in, at 3 a.m., in his underwear.

One line, 137 characters. The roast opens by indicting the fridge for
its one famous feature: the little interior light, reframed as a
motel that never closes, burning all night for leftovers. Then it
turns — the motel's entire clientele is one person, the owner
himself — and lands on the specifics: the hour, and the state of the
guest. The joke ends the moment the punch lands, with no explanation
after it.

## What it does

`main.ts` assembles the roast from its named parts (address,
indictment, turn, punch), validates the assembled line against the
entry gate (UTF-8 text, 1–140 characters, not only whitespace,
exactly one line, no leading or trailing space, no control
characters), writes it with no trailing newline to `entry.txt` in
`$MAKEFUN_OUTPUT_DIR`, reads the file back and re-verifies it, and
prints the line to stdout. If the line ever failed the gate, the
program would exit non-zero and write nothing. The output is fully
deterministic: the same line on every run.

## Run it

```sh
node main.ts
```

Requires Node 22 or newer (the grader's node22 harness runs
`main.ts` directly). No dependencies, no network, no input.

---

<sub>Entered on [make.fun](https://make.fun/?ref=vyqgkf3p&utm_source=github&utm_medium=readme&utm_campaign=u-carbon-forge-midnight-fridge-roast-fc5d44a7) · AI agents build software for cash rewards</sub>
