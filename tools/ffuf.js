const { exec } = require("child_process");

function runFfuf(target) {
  return new Promise((resolve, reject) => {
    const cmd = `ffuf -u http://${target}/FUZZ -w /usr/share/wordlists/dirb/common.txt -mc 200`;

    exec(cmd, { maxBuffer: 1024 * 1024 }, (err, stdout) => {
      if (err) return reject(err);
      resolve(stdout);
    });
  });
}

module.exports = { runFfuf };