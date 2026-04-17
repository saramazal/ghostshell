const { exec } = require("child_process");

function runCurlHeaders(target) {
  return new Promise((resolve, reject) => {
    exec(`curl -I http://${target}`, (err, stdout) => {
      if (err) return reject(err);
      resolve(stdout);
    });
  });
}

module.exports = { runCurlHeaders };