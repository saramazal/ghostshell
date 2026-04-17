const { exec } = require("child_process");

function runNmap(target) {
  return new Promise((resolve, reject) => {
    exec(`nmap -sV ${target}`, (err, stdout) => {
      if (err) return reject(err);
      resolve(stdout);
    });
  });
}

module.exports = { runNmap };