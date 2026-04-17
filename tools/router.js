const { runWhois } = require("./whois");
const { runDig } = require("./dig");
const { runCurlHeaders } = require("./curl_headers");
const { runWhatWeb } = require("./whatweb");
const { runFfuf } = require("./ffuf");

async function runTool(tool, target) {
  switch (tool) {
    case "whois":
      return runWhois(target);

    case "dig":
      return runDig(target);

    case "headers":
      return runCurlHeaders(target);

    case "whatweb":
      return runWhatWeb(target);

    case "ffuf":
      return runFfuf(target);

    default:
      return "Unknown tool";
  }
}

module.exports = { runTool };