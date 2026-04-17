function parseFfufOutput(output) {
  const lines = output.split("\n");

  const results = [];

  for (const line of lines) {
    // ffuf success lines usually contain status codes
    if (line.includes("200") || line.includes("301") || line.includes("302")) {
      const cleaned = line.trim();

      results.push({
        raw: cleaned,
        type: classifyEndpoint(cleaned)
      });
    }
  }

  return results;
}

// 🧠 Simple intelligence layer
function classifyEndpoint(line) {
  const lower = line.toLowerCase();

  if (lower.includes("admin")) return "ADMIN PANEL";
  if (lower.includes("login")) return "AUTH PORTAL";
  if (lower.includes("backup")) return "SENSITIVE FILE";
  if (lower.includes("api")) return "API ENDPOINT";
  if (lower.includes("upload")) return "FILE UPLOAD";
  if (lower.includes("200")) return "LIVE RESOURCE";

  return "UNKNOWN";
}

module.exports = { parseFfufOutput };