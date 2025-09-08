const fs = require("fs");
const path = require("path");

// Path to your Backgrounds folder
const ASSETS_DIR = path.join(__dirname, "src/assets/Backgrounds");

// Path to output file
const OUTPUT_FILE = path.join(__dirname, "src/Backgrounds.ts");

// Supported image/video extensions
const EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".mp4"];

// Read all files in the folder
const files = fs.readdirSync(ASSETS_DIR).filter(file => {
  return EXTENSIONS.includes(path.extname(file).toLowerCase());
});

// Generate import statements
let imports = "";
let exportsObj = "const backgrounds = {\n";

files.forEach((file, index) => {
  // Create a safe variable name
  let varName = file
    .replace(/\.[^/.]+$/, "") // remove extension
    .replace(/[^a-zA-Z0-9_]/g, "_"); // replace invalid chars

  imports += `import ${varName} from "./assets/Backgrounds/${file}";\n`;
  exportsObj += `  ${varName},\n`;
});

exportsObj += "};\n\nexport default backgrounds;\n";

// Combine imports + export object
const fileContent = imports + "\n" + exportsObj;

// Write to Backgrounds.ts
fs.writeFileSync(OUTPUT_FILE, fileContent);

console.log(`Backgrounds.ts generated with ${files.length} files!`);
