const fs = require('fs');
const path = require('path');

const { settings } = require('./settings');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const formatTime = function (timeMs) {
  const seconds = Math.ceil(timeMs / 1000);
  const sec = seconds % 60;
  const min = Math.floor(seconds / 60);
  let res = '';

  if (min) res += `${min}m `;
  res += `${sec}s`;
  return res;
};

function generateWeightsFile(specWeights, totalDuration, totalWeight) {
  Object.keys(specWeights).forEach((spec) => {
    specWeights[spec].weight = Math.floor(
      (specWeights[spec].time / totalDuration) * totalWeight
    );
  });
  const weightsJson = JSON.stringify(specWeights);
  fs.writeFile(`${settings.weightsJSON}`, weightsJson, 'utf8', (err) => {
    if (err) throw err;
    console.log('Generated file parallel-weights.json.');
  });
}

function collectResults(resultsPath) {
  const results = new Map();

  try {
    const resultFiles = fs.readdirSync(resultsPath);

    resultFiles.forEach((fileName) => {
      const filePath = path.join(resultsPath, fileName);
      const content = fs.readFileSync(filePath);
      const result = JSON.parse(content);
      results.set(result.file, result);
    });
  } catch (err) {
    console.log(`Directory ${resultsPath} doesn't exist.`);
  }

  return results;
}

module.exports = {
  collectResults,
  sleep,
  formatTime,
  generateWeightsFile
};
