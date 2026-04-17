const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "rag.json");

// 🧠 Load memory
function loadMemory() {
  if (!fs.existsSync(DB_PATH)) return [];
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  if (!raw || raw.trim() === "") return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("[!] Error parsing rag.json:", e.message);
    return [];
  }
}

// 🧠 Save memory
function saveMemory(entry) {
  const data = loadMemory();
  data.push(entry);

  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// 🧠 Simple search (keyword-based RAG v1)
function searchMemory(query) {
  try {
    const data = loadMemory();
    return data.filter(item =>
      JSON.stringify(item).toLowerCase().includes(query.toLowerCase())
    );
  } catch (e) {
    console.error("[!] Error searching memory:", e.message);
    return [];
  }
}

module.exports = { saveMemory, searchMemory };