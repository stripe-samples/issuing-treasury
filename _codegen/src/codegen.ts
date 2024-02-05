import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// Convert the URL object to a pathname compatible with the OS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, "../../_base/src"); // Adjust as needed
const OUTPUT_DIRS = {
  EmbeddedFinance: path.join(__dirname, "../../embedded-finance/src"),
  ExpenseManagement: path.join(__dirname, "../../expense-management/src"),
};

const FinancialProduct = {
  EmbeddedFinance: "embedded-finance",
  ExpenseManagement: "expense-management",
};

// Utility to read files recursively
function readFilesRecursively(dir: string): string[] {
  let files: string[] = [];
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(readFilesRecursively(fullPath));
    } else {
      files.push(fullPath);
    }
  });
  return files;
}

// Main processing function
function generateSubApp(financialProductKey: keyof typeof FinancialProduct) {
  const financialProduct = FinancialProduct[financialProductKey];
  const outputDir = OUTPUT_DIRS[financialProductKey];
  fs.mkdirSync(outputDir, { recursive: true });

  const files = readFilesRecursively(SOURCE_DIR);
  files.forEach((filePath) => {
    let fileContent = fs.readFileSync(filePath, { encoding: "utf8" });
    fileContent = processFileContent(fileContent, financialProduct);

    // Check if the processed content is empty or only contains whitespace
    if (!fileContent.trim()) {
      // If so, skip creating this file
      return;
    }

    const relativePath = path.relative(SOURCE_DIR, filePath);
    const outputPath = path.join(outputDir, relativePath);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, fileContent);
  });
}

function processFileContent(content: string, financialProduct: string): string {
  let includeBlock = true; // Default state is to include lines outside conditional blocks
  let excludeBlock = false; // State to track exclusion blocks

  const processedLines = content.split("\n").reduce((acc: string[], line) => {
    const trimmedLine = line.trim();

    // Handle the start and end of exclusion blocks
    if (
      trimmedLine === "// @begin-exclude-from-subapps" ||
      trimmedLine.includes("{/* @begin-exclude-from-subapps */}")
    ) {
      excludeBlock = true;
    } else if (
      trimmedLine === "// @end-exclude-from-subapps" ||
      trimmedLine.includes("{/* @end-exclude-from-subapps */}")
    ) {
      excludeBlock = false;
    } else if (!excludeBlock) {
      // Process line only if it's not within an exclude block
      // Detect inclusion and exclusion conditions
      const inclusionConditionMatch = trimmedLine.match(
        /\/\/ @if financialProduct==(.+)|\{\/\* @if financialProduct==(.+) \*\/\}/,
      );
      const exclusionConditionMatch = trimmedLine.match(
        /\/\/ @if financialProduct!=(.+)|\{\/\* @if financialProduct!=(.+) \*\/\}/,
      );

      if (inclusionConditionMatch) {
        includeBlock =
          inclusionConditionMatch[1]?.trim() === financialProduct ||
          inclusionConditionMatch[2]?.trim() === financialProduct;
      } else if (exclusionConditionMatch) {
        includeBlock =
          exclusionConditionMatch[1]?.trim() !== financialProduct &&
          exclusionConditionMatch[2]?.trim() !== financialProduct;
      } else if (
        trimmedLine === "// @endif" ||
        trimmedLine.includes("{/* @endif */}")
      ) {
        includeBlock = true; // Reset includeBlock at the end of conditional blocks
      } else if (includeBlock) {
        // Add the line if it's within an included block and not part of any magic comment
        acc.push(line);
      }
    }

    // Reset includeBlock for lines after conditional checks, avoiding carrying over the state
    if (trimmedLine.match(/\/\/ @endif|\{\/\* @endif \*\/\}/)) {
      includeBlock = true;
    }

    return acc;
  }, []);

  return processedLines.join("\n");
}

generateSubApp("EmbeddedFinance");
generateSubApp("ExpenseManagement");
