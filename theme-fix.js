const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Backgrounds
    content = content.replace(/bg-\[#050505\]\/80/g, 'bg-white/90');
    content = content.replace(/bg-\[#050505\]\/90/g, 'bg-white/95');
    content = content.replace(/bg-\[#050505\]/g, 'bg-slate-50');
    content = content.replace(/bg-dark-elevated/g, 'bg-white');
    content = content.replace(/bg-white\/5/g, 'bg-slate-100');
    content = content.replace(/bg-white\/10/g, 'bg-slate-200');
    content = content.replace(/bg-white\/\[0\.02\]/g, 'bg-slate-100');
    content = content.replace(/bg-white\/\[0\.05\]/g, 'bg-slate-200');
    content = content.replace(/bg-zinc-900/g, 'bg-slate-100');

    // Text colors
    content = content.replace(/text-white/g, 'text-slate-900');
    content = content.replace(/text-zinc-400/g, 'text-slate-600');
    content = content.replace(/text-zinc-500/g, 'text-slate-500');
    content = content.replace(/text-zinc-300/g, 'text-slate-700');
    
    // Gradients & Borders
    content = content.replace(/border-white\/10/g, 'border-slate-200');
    content = content.replace(/border-white\/5/g, 'border-slate-200');
    content = content.replace(/text-gradient-aurora/g, 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600');
    content = content.replace(/from-neon-cyan/g, 'from-blue-600');
    content = content.replace(/to-neon-purple/g, 'to-indigo-600');
    content = content.replace(/text-neon-cyan/g, 'text-blue-600');
    content = content.replace(/text-neon-purple/g, 'text-indigo-600');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated: ' + filePath);
    }
  }
});
