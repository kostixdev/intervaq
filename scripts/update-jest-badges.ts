/**
 * Smtn tkn from https://github.com/pamepeixinho/jest-coverage-badges
 */
import {promises as fs} from 'fs';
import * as path from 'path';
import {modifyReadmeqSingle} from 'readmeq';

const basePath: string = process.cwd();
const readmePath: string = path.join(basePath, 'README.md');
const coverageSummaryPath: string = path.join(
  basePath,
  'coverage/coverage-summary.json'
);
const reportKeys: string[] = ['lines', 'functions', 'branches', 'statements'];

interface Report {
  [key: string]: ReportSection;
}
type ReportSection = {
  [key: string]: Branches;
};
interface Branches {
  total: number;
  covered: number;
  skipped: number;
  pct: number;
}

const getColor = (coverage: number) => {
  if (coverage < 80) {
    return 'red';
  }
  if (coverage < 90) {
    return 'yellow';
  }
  return 'brightgreen';
};

const getBadgeUrl = (report: Report, key: string): string => {
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

const getNewBadges = (report: Report): string[] => {
  const badges: string[] = [];
  reportKeys.forEach(key => {
    badges.push('![Coverage ' + key + '](' + getBadgeUrl(report, key) + ')');
  });
  return badges;
};

const updateJestBadges = async (): Promise<void> => {
  try {
    const fileData = await fs.readFile(coverageSummaryPath, 'utf8');
    const report: Report = JSON.parse(fileData);
    const newBadges: string = getNewBadges(report).join('\n');
    await modifyReadmeqSingle('jestBadges', newBadges, {
      n: true,
      filePath: readmePath,
    });
  } catch (error) {
    throw error;
  }
};

//do it
updateJestBadges();
