const fs = require("fs");
const path = require("path");
const { runAgent } = require("./agent");

// 📁 Path to memory file
const historyFile = path.join(__dirname, "memory", "history.json");

// 🧠 Save memory function
function saveHistory(entry) {
  let history = [];

  if (fs.existsSync(historyFile)) {
    const raw = fs.readFileSync(historyFile, "utf-8");
    history = raw ? JSON.parse(raw) : [];
  }

  history.push(entry);

  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
}

// 🚀 Main runner
async function run() {
  const inputArg = process.argv[2];
  const taskType = process.argv[3] || "analysis";

  if (!inputArg) {
    console.log("Usage:");
    console.log("node index.js scan.txt analysis");
    console.log("node index.js 10.10.10.10 analysis");
    return;
  }

  let data;
  let target = "TARGET";

  // 📂 If input is file
  if (fs.existsSync(inputArg)) {
    data = fs.readFileSync(inputArg, "utf-8");

    // 🔍 Extract IP from scan file
    const ipMatch = data.match(/\b\d{1,3}(\.\d{1,3}){3}(:\d+)?\b/);
    if (ipMatch) {
      target = ipMatch[0];
    }

  } else {
    // 🌐 Direct input = target
    data = inputArg;
    target = inputArg;
  }

  const result = await runAgent(taskType, data, target);

  // 🧠 Save to history
  const entry = {
    timestamp: new Date().toISOString(),
    task: taskType,
    input: inputArg,
    target: target,
    model: result.modelUsed,
    output: result.output
  };

  saveHistory(entry);

  // 🖥️ Output
  console.log("\n=== GhostShell ===");
  console.log("Model:", result.modelUsed);
  console.log("Task:", taskType);
  console.log("Target:", target);
  console.log("------------------\n");
  console.log(result.output);
}

run();