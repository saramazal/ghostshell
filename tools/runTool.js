const { runWhois } = require("./whois");
const { runDig } = require("./dig");
const { runCurlHeaders } = require("./curl_headers");
const { runWhatWeb } = require("./whatweb");
const { runFfuf } = require("./ffuf");

async function runTool(tool, target) {
  try {
    switch (tool) {
      case "whois":
        return await runWhois(target);

      case "dig":
        return await runDig(target);

      case "headers":
        return await runCurlHeaders(target);

      case "whatweb":
        return await runWhatWeb(target);

      case "ffuf":
        return await runFfuf(target);

      default:
        return `[!] Unknown tool: ${tool}`;
    }
  } catch (err) {
    return `[!] Error running ${tool}: ${err.message}`;
  }
}

module.exports = { runTool };