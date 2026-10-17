const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');
fs.mkdirSync(path.resolve(__dirname, '../.local'), {recursive:true});
function browserOptions() {
  const executablePath = process.env.BROWSER_EXECUTABLE_PATH;
  return {headless:true, ...(executablePath ? {executablePath} : {})};
}
module.exports = {chromium, browserOptions};
