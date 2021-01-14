const chalk = require('chalk');

const startScript = 'parcel src/index.html';
const PACKAGE_NAME = 'bigtest-sample';
const TARGET_DIR = `${process.cwd()}/${PACKAGE_NAME}`;
const SOURCE_DIR = `${TARGET_DIR}/node_modules/${PACKAGE_NAME}`;

const yarn = process.argv.includes('-Y') || process.argv.includes('-yarn') ? true : false;
const command = yarn ? 'yarn': 'npm run';

const messages = {
  creating_dir: chalk`\n{blueBright ✓} {green Directory created}`,
  downloading_repo: [
    chalk`{grey Downloading project...}`,
    chalk`{green Download complete\n}`
  ],
  organizing_files: [
    chalk`{grey Organizing files...}`,
    chalk`{green Files organized}`
  ],
  installing_dep: [
    chalk`{white.dim Installing dependencies... (this will take a few minutes)}`, 
    chalk`{green Installation complete\n}`
  ],
  deleting: [
    chalk`{grey Deleting generated files...}`,
    chalk`{grey Cleanup complete}`
  ],
  success: chalk`{white Setup is complete!}\n\nNow you can start exploring:\n\n  {magentaBright cd} {white bigtest-sample}\n\n  {magentaBright ${command}} test:{blueBright bigtest}\n  {magentaBright ${command}} test:{redBright jest}\n  {magentaBright ${command}} test:{green cypress}\n\n{yellow Have any questions?}\nReach us at: {cyan https://discord.gg/RKss6jw2}\n`,
  abort: `Please rename the existing 'bigtest-sample' directory and rerun the command\n`
};

module.exports = {
  startScript,
  messages,
  yarn,
  TARGET_DIR,
  SOURCE_DIR
};
