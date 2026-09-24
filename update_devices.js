const fs = require('fs');
const path = 'src/data/devices.ts';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('DeviceCategory')) {
  code = code.replace('export interface Brand {', 'export type DeviceCategory = \'phone\' | \'tablet\' | \'computer\' | \'watch\';\n\nexport interface Brand {\n  supportedCategories: DeviceCategory[];');

  function getCategories(id) {
    if (['apple', 'samsung', 'huawei'].includes(id)) return ['phone', 'tablet', 'computer', 'watch'];
    if (['xiaomi', 'honor'].includes(id)) return ['phone', 'tablet', 'watch'];
    if (['casper', 'reeder', 'tcl'].includes(id)) return ['phone', 'tablet'];
    return ['phone'];
  }

  const regex = /id:\s*"(.*?)",\s*\n\s*name:\s*"(.*?)",/g;
  code = code.replace(regex, (match, id, name) => {
    const cats = getCategories(id).map(c => `"${c}"`).join(', ');
    return `id: "${id}",\n    name: "${name}",\n    supportedCategories: [${cats}],`;
  });

  fs.writeFileSync(path, code);
  console.log("Updated devices.ts");
} else {
  console.log("Already updated");
}
