const { exec } = require("child_process");

function runDig(target) {
  return new Promise((resolve, reject) => {
    exec(`dig ${target} ANY +short`, (err, stdout) => {
      if (err) return reject(err);
      resolve(stdout);
    });
  });
}

module.exports = { runDig };