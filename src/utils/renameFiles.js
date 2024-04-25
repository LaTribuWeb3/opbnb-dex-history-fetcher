const fs = require('fs').promises;
const path = require('path');
const { DATA_DIR } = require('../utils/constants');

transmuteNames(DATA_DIR, 'HAY', 'lisUSD');

async function transmuteNames(directory, targetString, replacementString) {
  const dirents = await fs.readdir(directory, { withFileTypes: true });
  for (const dirent of dirents) {
    const resPath = path.resolve(directory, dirent.name);
    if (dirent.isDirectory()) {
      await transmuteNames(resPath, targetString, replacementString); // Recurse into subdirectories
    } else {
      if (dirent.name.includes(targetString)) {
        const newName = dirent.name.replace(targetString, replacementString);
        const newPath = path.resolve(directory, newName);
        await fs.rename(resPath, newPath);
        console.log(`Renamed ${dirent.name} to ${newName}`);
      }
    }
  }

  // Transmute folder names after files to avoid path errors
  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      if (dirent.name.includes(targetString)) {
        const newName = dirent.name.replace(targetString, replacementString);
        const newPath = path.resolve(directory, newName);
        await fs.rename(path.resolve(directory, dirent.name), newPath);
        console.log(`Renamed directory from ${dirent.name} to ${newName}`);
        await transmuteNames(newPath, targetString, replacementString); // Recurse into renamed directories
      }
    }
  }
}

// Invoke the ritual with the path to your directory, the target string to find, and the replacement string.
// Example: transmuteNames('./path/to/directory', 'oldString', 'newString');
