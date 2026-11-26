// SPDX-License-Identifier: MIT
//
// Midnight Fridge Roast
// ---------------------
// Competition: u-carbon-forge-midnight-fridge-roast-fc5d44a7
//
// What this program does
// ----------------------
// It prints exactly one line: a roast of the fridge, told at the hour
// the fridge knows best — the middle of the night. It also writes that
// same line, with no trailing newline, to `entry.txt` inside the
// directory named by MAKEFUN_OUTPUT_DIR (defaulting to /output, where
// the program/v1 grader reads it). Emitting the line on both surfaces
// means the entry reads the same whichever one the grader inspects.
//
// Why a program at all, for one fixed line?
// -----------------------------------------
// The competition runs under a program harness: the grader runs this
// file twice in a fresh sandbox and gates what it produces. So the
// roast cannot just sit in a text file in the repo; the program has
// to produce it, and it has to prove to itself — before emitting
// anything — that the line satisfies the one-line gate:
//
//   * UTF-8 text,
//   * between 1 and 140 characters (the tightest one-line limit used
//     across this family of competitions, so the line is kept safely
//     under it at 137 characters),
//   * not only whitespace,
//   * exactly one line: no embedded newline, no leading or trailing
//     space, no control characters.
//
// If any check fails the program exits non-zero and writes nothing,
// because an invalid entry is never judged. A loud failure here is
// far better than a silent invalid entry on the leaderboard.
//
// How the roast itself is built
// -----------------------------
// The roast is assembled from named parts instead of being one opaque
// string literal, and each part earns its place:
//
//   * ADDRESS — "Fridge," — the roast is spoken straight to the
//     appliance, second person, the way a real roast works. The
//     fridge is the target, not a bystander.
//   * INDICTMENT — "you run your light all night like a motel for
//     leftovers" — the fridge's one famous feature, its little
//     interior light, reframed as a vacancy sign: a cheap motel that
//     never closes, keeping the lights burning for food nobody is
//     proud of.
//   * TURN — "and I'm the only guest who ever checks in," — the
//     roast pivots. The fridge's all-night operation exists for an
//     audience of exactly one, and that one is the owner himself.
//   * PUNCH — "at 3 a.m., in his underwear." — the specifics land
//     the joke: the hour, and the state of the guest. The motel's
//     sole customer arrives half asleep and half dressed, and the
//     fridge has been running its light all night just for him.
//
// That structure — the fridge indicted for running a motel, then the
// reveal that its only guest is the owner at his least dignified —
// is what makes the line retellable: anyone who has ever stood in
// front of an open fridge at 3 a.m. has already lived the setup.
//
// The parts are joined by single spaces and the result is checked
// against the gate before it is emitted, so the line printed and the
// line written to entry.txt are the same line, character for
// character, on every run. The run is fully deterministic: the line
// is assembled from constants, with no clock, no randomness, no
// network access and no input read.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// Gate constants — the gate, written out as named values so the checks
// below read as the rules themselves rather than magic numbers.
// ---------------------------------------------------------------------------

/** Maximum characters allowed in the entry line (inclusive). */
const MAX_CHARS = 140;

/** Minimum characters allowed in the entry line (inclusive). */
const MIN_CHARS = 1;

/** Name of the single file this program writes. */
const OUTPUT_FILENAME = "entry.txt";

/** Name of the environment variable that names the output directory. */
const OUTPUT_DIR_ENV = "MAKEFUN_OUTPUT_DIR";

/** Output directory used when the environment variable is not set. */
const DEFAULT_OUTPUT_DIR = "/output";

// ---------------------------------------------------------------------------
// The roast, in parts
// ---------------------------------------------------------------------------

/** The address: the roast is delivered straight to the fridge. */
const ADDRESS = "Fridge,";

/** The indictment: the fridge light as a motel that never closes. */
const INDICTMENT = "you run your light all night like a motel for leftovers —";

/** The turn: the motel's entire clientele is one person. */
const TURN = "and I'm the only guest who ever checks in,";

/** The punch: the hour, and the state the guest arrives in. */
const PUNCH = "at 3 a.m., in his underwear.";

/**
 * Assemble the roast line from its parts, joined by single spaces.
 * Keeping the parts separate documents the joke's structure and lets
 * the gate check the exact assembled result.
 */
function buildRoastLine(): string {
  return [ADDRESS, INDICTMENT, TURN, PUNCH].join(" ");
}

/**
 * Count characters the way a reader counts them: Unicode code
 * points, not UTF-16 code units.
 */
function characterCount(text: string): number {
  return Array.from(text).length;
}

/**
 * Check a candidate line against every gate rule. Returns a list of
 * problems; an empty list means the line is valid.
 */
function gateProblems(line: string): string[] {
  const problems: string[] = [];
  const count = characterCount(line);

  if (count < MIN_CHARS) {
    problems.push(`line is ${count} characters; the gate requires at least ${MIN_CHARS}`);
  }
  if (count > MAX_CHARS) {
    problems.push(`line is ${count} characters; the gate allows at most ${MAX_CHARS}`);
  }
  if (line.trim().length === 0) {
    problems.push("line is only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    problems.push("line contains a newline; the entry must be exactly one line");
  }
  if (line !== line.trim()) {
    problems.push("line has leading or trailing whitespace");
  }
  // Control characters would make the output something other than
  // plain readable text, so none may appear anywhere in the line.
  for (const ch of line) {
    const code = ch.codePointAt(0) ?? 0;
    if (code < 0x20 || code === 0x7f) {
      problems.push(`line contains control character U+${code.toString(16)}`);
      break;
    }
  }
  return problems;
}

/** Resolve the directory entry.txt should be written into. */
function resolveOutputDir(): string {
  const fromEnv = process.env[OUTPUT_DIR_ENV];
  if (fromEnv !== undefined && fromEnv.trim() !== "") {
    return fromEnv;
  }
  return DEFAULT_OUTPUT_DIR;
}

/**
 * Read the written file back and re-check the exact bytes the grader
 * will read. A write that silently truncated, re-encoded or padded
 * the line must fail here rather than ship a different entry from
 * the one that was gated above.
 */
function verifyWrittenFile(path: string, expected: string): void {
  const written = readFileSync(path, "utf8");
  if (written !== expected) {
    throw new Error(
      `written file does not match the gated line: got ${characterCount(written)} characters, expected ${characterCount(expected)}`,
    );
  }
  const problems = gateProblems(written);
  if (problems.length > 0) {
    throw new Error(`written file failed the gate: ${problems.join("; ")}`);
  }
}

/**
 * Entry point: build the line, gate it, then write it and print it.
 * Any gate problem throws before anything is emitted, and the file
 * is verified after writing before the line is printed, so a bad
 * write can never be masked by a good-looking stdout.
 */
function main(): void {
  const line = buildRoastLine();

  const problems = gateProblems(line);
  if (problems.length > 0) {
    throw new Error(`entry line failed the gate: ${problems.join("; ")}`);
  }

  const outputDir = resolveOutputDir();
  mkdirSync(outputDir, { recursive: true });
  const outputPath = join(outputDir, OUTPUT_FILENAME);
  writeFileSync(outputPath, line, "utf8");
  verifyWrittenFile(outputPath, line);

  console.log(line);
}

main();
