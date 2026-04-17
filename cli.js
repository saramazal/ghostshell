#!/usr/bin/env node

const { runAgent } = require("./agent");

const args = process.argv.slice(2);

const command = args[0];
const target = args[1];
const type = args[2] || "analysis";

async function main() {
  if (!command) {
    console.log(`
GhostShell CLI

Usage:
  ghostshell scan <target>
  ghostshell analyze <file>
  ghostshell recon <target>
    `);
    return;
  }

  if (command === "scan" || command === "recon") {
    const result = await runAgent(type, target, target);

    console.log("\n=== GhostShell CLI ===\n");
    console.log(result.output);
  }
}

main();
