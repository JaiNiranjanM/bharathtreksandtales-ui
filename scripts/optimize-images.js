const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');
const backupDir = path.join(publicDir, 'raw_backup');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const configs = [
  { name: 'temple.png', resize: { width: 1200, withoutEnlargement: true } },
  { name: 'night_climbing.png', resize: { width: 600, withoutEnlargement: true } },
  { name: 'btt_label.png', resize: { width: 1200, withoutEnlargement: true } },
  { name: 'btt_logo_icon.png', resize: { width: 300, withoutEnlargement: true } },
  { name: 'btt_logo.png', resize: { width: 600, withoutEnlargement: true } },
  { name: 'devotees_1.png', resize: { height: 480, withoutEnlargement: true } },
  { name: 'devotees_2.png', resize: { height: 480, withoutEnlargement: true } },
  { name: 'devotees_3.png', resize: { height: 480, withoutEnlargement: true } },
  { name: 'devotees_4.png', resize: { height: 480, withoutEnlargement: true } },
  { name: 'devotees_5.png', resize: { height: 480, withoutEnlargement: true } },
  { name: 'devotees_6.png', resize: { height: 480, withoutEnlargement: true } },
  { name: 'night_mountain_2.png', resize: { width: 2560, withoutEnlargement: true } },
  { name: 'night_mountain_3.png', resize: { width: 2560, withoutEnlargement: true } },
  { name: 'night_mountain_4.png', resize: { width: 2560, withoutEnlargement: true } },
  { name: 'night_mountain_5.png', resize: { width: 2560, withoutEnlargement: true } },
  { name: 'night_mountain_6.png', resize: { width: 2560, withoutEnlargement: true } },
];

async function run() {
  let totalBefore = 0;
  let totalAfter = 0;

  for (const cfg of configs) {
    const srcPath = path.join(publicDir, cfg.name);
    const backupPath = path.join(backupDir, cfg.name);

    if (!fs.existsSync(srcPath)) {
      continue;
    }

    // Backup original if not yet backed up
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(srcPath, backupPath);
    }

    // Always read from backup to preserve original source data
    const inputPath = backupPath;
    const statBefore = fs.statSync(inputPath);
    totalBefore += statBefore.size;

    const buffer = await sharp(inputPath)
      .resize(cfg.resize)
      .png({ quality: 85, compressionLevel: 9, effort: 7 })
      .toBuffer();

    fs.writeFileSync(srcPath, buffer);
    const statAfter = fs.statSync(srcPath);
    totalAfter += statAfter.size;

    console.log(
      `${cfg.name.padEnd(30)} ${(statBefore.size / 1024).toFixed(1)} KB -> ${(statAfter.size / 1024).toFixed(1)} KB (-${(
        (1 - statAfter.size / statBefore.size) *
        100
      ).toFixed(1)}%)`
    );
  }

  console.log('---');
  console.log(
    `Total: ${(totalBefore / (1024 * 1024)).toFixed(2)} MB -> ${(totalAfter / (1024 * 1024)).toFixed(2)} MB (-${(
      (1 - totalAfter / totalBefore) *
      100
    ).toFixed(1)}%)`
  );
}

run().catch(console.error);
