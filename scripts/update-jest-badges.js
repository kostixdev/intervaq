/**
 * Smtn tkn from https://github.com/pamepeixinho/jest-coverage-badges
 */
import {promises as fs} from 'fs';
import {modifyReadmeqSingle} from 'readmeq';


const readmePath = './README.md';
const coverageSummaryPath = './coverage/coverage-summary.json';


const reportKeys = ['lines', 'functions', 'branches', 'statements'];


const getColor = coverage => {
  if (coverage < 80) {
    return 'red';
  }
  if (coverage < 90) {
    return 'yellow';
  }
  return 'brightgreen';
};

const getBadgeUrl = (report, key) => {
  if (!(report && report.total && report.total[key])) {
    throw new Error('malformed coverage report');
  }

  const label = key.charAt(0).toUpperCase() + key.slice(1);
  const coverage = report.total[key].pct;
  const color = getColor(coverage);

  return `https://img.shields.io/badge/${label}-${coverage}${encodeURI(
    '%'
  )}-${color}?logo=jest`;
};

const getNewBadges = report => {
  const badges = [];
  reportKeys.forEach((key, index) => {
    badges.push('![Coverage ' + key + '](' + getBadgeUrl(report, key) + ')');
  });
  return badges;
};


// execute
(async () => {
  try{
    const fileData = await fs.readFile(coverageSummaryPath, 'utf8');
    const report = JSON.parse(fileData);
    const newBadges = getNewBadges(report).join('\n');
    await modifyReadmeqSingle('jestBadges', newBadges, {
      n: true,
      filePath: readmePath
    });
  } catch (error) {
    throw error;
  }
})();
