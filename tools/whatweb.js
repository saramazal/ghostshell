const { exec } = require("child_process");

function runWhatWeb(target) {
  return new Promise((resolve, reject) => {
    exec(`whatweb http://${target}`, (err, stdout) => {
      if (err) return reject(err);
      resolve(stdout);
    });
  });
}

module.exports = { runWhatWeb };