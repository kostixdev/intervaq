import {promises as fs} from 'fs';
import {modifyReadmeqSingle} from 'readmeq';

// get from build:typedocmd outputs
const postbuildTypedocmd = async () => {
  try {
    // get useful docs
    const fileData = await fs.readFile('./docs/API.md', 'utf8');

    // split its unnecessary contents
    const splitRegexp = /## Index\n\n|\n\n\*\*\*\nGenerated using/gs;
    const matches: string[] = fileData.split(splitRegexp);

    if (matches && matches[1]) {
      // fix some links
      const docData = matches[1].replaceAll('](API.md#', '](README.md#');
      // add to main README.md
      modifyReadmeqSingle('docsSection', docData, {
        n: true,
        backup: true,
      });
    }
  } catch (error) {
    throw error;
  }
};

// do it
postbuildTypedocmd();
