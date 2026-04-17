const { exec } = require("child_process");

function runWhois(target) {
  return new Promise((resolve, reject) => {
    exec(`whois ${target}`, (err, stdout) => {
      if (err) return reject(err);
      resolve(stdout);
    });
  });
}

module.exports = { runWhois };