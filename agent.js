const axios = require("axios");
const { runTool } = require("./tools/runTool");
const { parseFfufOutput } = require("./tools/parsers/ffufParser");
const { detectLogin } = require("./tools/parsers/loginDetector");
const { buildExploitChain } = require("./tools/exploitPlanner");
const { saveMemory, searchMemory } = require("./memory/ragStore");

// ========================
// 🧠 OLLAMA CALL
// ========================
async function queryOllama(model, prompt) {
  const res = await axios.post("http://localhost:11434/api/generate", {
    model,
    prompt,
    stream: false
  });

  return res.data.response;
}

// ========================
// 🧠 MODEL ROUTER
// ========================
function chooseModel(taskType, inputLength) {
  if (taskType === "analysis") return "llama3";
  return inputLength > 1500 ? "llama3" : "mistral";
}


// ========================
// 🧠 RECON PLANNER (AI + RAG)
// ========================
async function planRecon(target) {
  const past = searchMemory(target) || [];

  const prompt = `
You are GhostShell Recon AI.

Return ONLY a valid JSON array.

Allowed tools:
whois, dig, headers, whatweb, ffuf

IMPORTANT RULES:
- Output ONLY JSON
- No markdown
- No explanation

Target: ${target}

PAST KNOWLEDGE:
${JSON.stringify(past.slice(-3), null, 2)}
`;

  const res = await queryOllama("mistral", prompt);

  try {
    // 🧠 STEP 1: clean response
    let cleaned = res
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // 🧠 STEP 2: extract JSON array safely
    const match = cleaned.match(/\[[\s\S]*\]/);

    if (!match) throw new Error("No JSON array found");

    const parsed = JSON.parse(match[0]);

    return Array.isArray(parsed)
      ? parsed
      : ["whois", "dig", "headers", "whatweb"];

  } catch (e) {
    console.log("[!] JSON parse failed, using fallback tools");
    return ["whois", "dig", "headers", "whatweb"];
  }
}

// ========================
// ⚔️ TOOL EXECUTOR
// ========================

async function executeTools(tools, target) {
  let results = {};
  let intel = {
    login: [],
    ffuf: []
  };

  for (const tool of tools) {
    console.log(`[+] Running ${tool}...`);

    const output = await runTool(tool, target);
    results[tool] = output;

    // 🧠 LOGIN DETECTION (FIXED → append instead of overwrite)
    if (tool === "whatweb" || tool === "headers") {
      const loginSignals = detectLogin(output);
      intel.login.push(...loginSignals);
    }

    // 🧠 FFUF INTELLIGENCE
    if (tool === "ffuf") {
      intel.ffuf = parseFfufOutput(output);
    }
  }

  // 🧠 Deduplicate login signals
  intel.login = [...new Set(intel.login)];

  return { results, intel };
}

// ========================
// 🧠 FINAL ANALYSIS (AI)
// ========================
async function analyzeResults(resultsObj, target) {
  const model = "llama3";

  const { results, intel } = resultsObj;

  const exploitChain = await buildExploitChain(intel, results);

  const prompt = `
You are GhostShell, elite penetration tester.

Analyze recon data.

TARGET:
${target}

RECON:
${JSON.stringify(results, null, 2)}

INTEL:
${JSON.stringify(intel, null, 2)}

EXPLOIT CHAIN:
${JSON.stringify(exploitChain, null, 2)}

Output:
1. Key findings
2. Attack priority
3. Step-by-step exploitation plan
`;

  const response = await queryOllama(model, prompt);

  return response;
}


// ========================
// 🚀 MAIN AGENT
// ========================
async function runAgent(taskType, input, target) {
  const model = chooseModel(taskType, input.length);

  console.log("\n[+] Planning recon...");
  const tools = await planRecon(target);

  console.log("[+] Tools selected:", tools);

  console.log("\n[+] Executing tools...");
  const resultsObj = await executeTools(tools, target);

  console.log("\n[+] Analyzing results...");
  const final = await analyzeResults(resultsObj, target);

  // 🧠 MEMORY SAVE (FIXED POSITION)
  saveMemory({
    timestamp: new Date().toISOString(),
    target,
    toolsUsed: tools,
    intel: resultsObj.intel,
    output: final
  });

  return {
    modelUsed: model,
    toolsUsed: tools,
    output: final
  };
}

module.exports = { runAgent };