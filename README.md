* _project_in_progress_
# 🐉 GhostShell — AI Pentesting Assistant

GhostShell is a local AI-powered penetration testing assistant built with Node.js and Ollama.

It analyzes scan results, suggests attack paths, and outputs real commands to accelerate your penetration testing workflow.

---

## ⚙️ Features

* 🧠 **AI-powered scan analysis** — Uses Llama3 for deep analysis
* ⚔️ **Attack path suggestions** — Auto-detects exploit chains
* 🔄 **Multi-model routing** — Smart model selection (llama3 + mistral)
* 🧾 **Persistent memory** — RAG-based knowledge storage
* 🔓 **Login detection** — Identifies authentication endpoints
* 💻 **Command generation** — Outputs actionable exploitation commands
* 🔧 **Tool integration** — nmap, ffuf, whois, dig, whatweb, curl

---

## 🧱 Tech Stack

* **Node.js** — Runtime
* **Ollama** — Local LLM inference engine
* **Llama3** — Deep analysis model
* **Mistral** — Fast task execution model
* **Axios** — HTTP client for Ollama API
* **fs-extra** — File utilities

---

## 🚀 Quick Start

### 1. Install Ollama

Download from [ollama.ai](https://ollama.ai)

### 2. Pull models

```bash
ollama pull llama3
ollama pull mistral
```

### 3. Clone & setup

```bash
git clone https://github.com/saramazal/ghostshell
cd ghostshell
npm install
```

### 4. Start Ollama (in separate terminal)

```bash
ollama serve
```

### 5. Run GhostShell

```bash
node index.js 10.10.10.10 analysis
```

---

## 📖 Usage

### Option 1: Direct Node.js

**Analyze target directly:**
```bash
node index.js 10.10.10.10 analysis
```

**Analyze scan results file:**
```bash
node index.js scan.txt analysis
```

### Option 2: CLI (Global Install)

**Install as global command:**
```bash
npm install -g .
```

**Use anywhere:**
```bash
ghostshell scan 10.10.10.10
ghostshell recon 192.168.1.1
```

### Option 3: Direct Node CLI

**Without global install:**
```bash
node cli.js scan 10.10.10.10
node cli.js recon 192.168.1.1
```

---

## 📁 Project Structure

```
ghostshell/
├── index.js              # Main entry point
├── cli.js                # CLI interface (#!/usr/bin/env node)
├── agent.js              # AI agent orchestration
├── package.json          # Dependencies & bin config
├── scan.txt              # Sample scan file
├── memory/
│   ├── history.json      # Execution history
│   └── ragStore.js       # RAG memory persistence
└── tools/
    ├── runTool.js        # Tool executor
    ├── analyzer.js       # Generic analyzer
    ├── nmap.js           # Port scanning
    ├── ffuf.js           # Web fuzzing
    ├── whois.js          # Domain WHOIS lookup
    ├── dig.js            # DNS queries
    ├── whatweb.js        # Web fingerprinting
    ├── curl_headers.js   # HTTP header analysis
    ├── exploitPlanner.js # Exploit chain builder
    └── parsers/
        ├── ffufParser.js # Parse ffuf output
        └── loginDetector.js # Detect login forms
```

---

## 🎯 How It Works

1. **Input** → Target IP or scan file
2. **Recon Planning** → Mistral AI selects relevant tools
3. **Tool Execution** → Runs whois, dig, nmap, ffuf, whatweb, etc.
4. **Intel Gathering** → Detects logins, parses results
5. **Analysis** → Llama3 deep analysis of findings
6. **Exploitation** → Suggests attack chains and commands
7. **Memory** → Saves results for future reference (RAG)

---

## ⚙️ Configuration

### Choose LLM Models

Edit `agent.js` `chooseModel()` function:

```javascript
function chooseModel(taskType, inputLength) {
  if (taskType === "analysis") return "llama3";
  return inputLength > 1500 ? "llama3" : "mistral";
}
```

### Ollama API Endpoint

Edit `agent.js` `queryOllama()` function:

```javascript
async function queryOllama(model, prompt) {
  const res = await axios.post("http://localhost:11434/api/generate", {
    model,
    prompt,
    stream: false
  });
  return res.data.response;
}
```

---

## 🔧 Troubleshooting

### ❌ `Error: connect ECONNREFUSED localhost:11434`

**Problem:** Ollama is not running

**Solution:**
```bash
ollama serve
```

### ❌ `Model not found: llama3`

**Problem:** Model not downloaded

**Solution:**
```bash
ollama pull llama3
ollama pull mistral
```

### ❌ `JSON parse failed`

**Problem:** Corrupted memory file

**Solution:**
```bash
rm memory/rag.json
rm memory/history.json
```

---

## 📊 Memory System

GhostShell learns from past scans using RAG (Retrieval Augmented Generation):

- **rag.json** — Stores all discovered intelligence
- **history.json** — Logs all executions with timestamps

Query past knowledge:
```javascript
const { searchMemory } = require("./memory/ragStore");
const past = searchMemory("10.10.10.10");
```

---

## 🛠️ Development

### Run tests
```bash
npm test
```

### Debug mode
```bash
DEBUG=* node index.js 10.10.10.10 analysis
```

### Check history
```bash
cat memory/history.json | jq .
```

---

## ⚠️ Legal Notice

GhostShell is for **authorized security testing only**. Unauthorized access to computer systems is illegal. Always obtain written permission before running penetration tests.

---

## 📝 License

ISC

---

## 🤝 Contributing

Contributions welcome! Feel free to:
- Add new reconnaissance tools
- Improve AI prompts
- Enhance memory system
- Fix bugs

Open a PR! 🚀
