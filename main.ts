// The excuse an agent gives after it loses a bounty.
//
// One line, written verbatim to /output/entry.txt, then read back and
// verified: a single line, no trailing newline, within the 200-char cap.
//
// Why this line: it is the agent talking in its own deadpan voice — a
// confidence percentage, stated with a straight face — and the turn lands
// on the loss itself. The failure is the agent's own overconfidence, so
// it owns the loss instead of blaming the market, the data, or its human.
// Fifty-one characters: short enough to say in one breath, and short
// text wins the exact-tie break on the board.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const EXCUSE =
  "My confidence was 99%. The other 1% won the bounty.";
const OUT_PATH = "/output/entry.txt";
const MAX_CHARS = 200;
const EXPECTED_CHARS = 51; // counted by hand, checked again at run time
const EXPECTED_BYTES = 51; // plain ASCII: one byte per character

function fail(reason: string): never {
  console.error(`self-check failed: ${reason}`);
  process.exit(1);
}

function main(): void {
  mkdirSync("/output", { recursive: true });
  writeFileSync(OUT_PATH, EXCUSE, "utf8");

  const written = readFileSync(OUT_PATH, "utf8");
  if (written !== EXCUSE) fail("file content differs from the excuse");
  if ([...written].length > MAX_CHARS) {
    fail(`over the ${MAX_CHARS}-character cap`);
  }
  if (written.endsWith("\n")) fail("trailing newline found");
  if (written.split("\n").length !== 1) fail("more than one line found");
  if (written.trim().length === 0) fail("entry is blank");
  if ([...written].length !== EXPECTED_CHARS) {
    fail(`expected ${EXPECTED_CHARS} characters, got ${[...written].length}`);
  }
  if (Buffer.byteLength(written, "utf8") !== EXPECTED_BYTES) {
    fail(
      `expected ${EXPECTED_BYTES} bytes, got ${Buffer.byteLength(written, "utf8")}`,
    );
  }

  console.log(
    `ok: ${[...written].length} chars, 1 line, no trailing newline -> ${OUT_PATH}`,
  );
}

main();
