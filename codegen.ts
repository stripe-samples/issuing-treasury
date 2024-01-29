import * as fs from "fs";
import * as path from "path";

import generate from "@babel/generator";
import { parse } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

const SOURCE_DIR = "./src"; // Directory of your source files
const OUTPUT_DIR = "./subapps"; // Base directory for generated sub-apps
const FinancialProduct = {
  ExpenseManagement: "expense_management",
  EmbeddedFinance: "embedded_finance",
};

function generateSubApp(financialProduct: string) {
  const outputSubDir = path.join(OUTPUT_DIR, financialProduct);
  fs.mkdirSync(outputSubDir, { recursive: true });

  const files = readFilesRecursively(SOURCE_DIR);

  files.forEach((filePath) => {
    const code = fs.readFileSync(filePath, "utf8");

    try {
      const ast = parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
      });

      traverse(ast, {
        enter(path) {
          // Handling conditional expressions in object spread
          if (
            path.isObjectProperty() &&
            path.node.value.type === "LogicalExpression"
          ) {
            const conditional = path.get(
              "value",
            ) as NodePath<t.LogicalExpression>;
            handleConditionalExpression(conditional, financialProduct);
          }

          // Handling if statements
          if (path.isIfStatement()) {
            handleIfStatement(path, financialProduct);
          }
        },
      });

      const output = generate(ast, {}, code);

      // Calculate the relative path from SOURCE_DIR and create the corresponding path in OUTPUT_DIR
      const relativePath = path.relative(SOURCE_DIR, filePath);
      const outputPath = path.join(outputSubDir, relativePath);

      // Ensure the directory exists
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });

      fs.writeFileSync(outputPath, output.code);
    } catch (e) {
      console.error(`Error processing file ${filePath}: ${e.message}`);
      throw e;
    }
  });
}

function readFilesRecursively(dir: string, fileList: string[] = []): string[] {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);

    if (fs.statSync(filePath).isDirectory()) {
      fileList = readFilesRecursively(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function handleConditionalExpression(
  path: NodePath<t.LogicalExpression>,
  financialProduct: string,
) {
  // Check if the condition is based on the financial product enum
  if (
    path.node.operator === "&&" &&
    path.node.left.type === "BinaryExpression"
  ) {
    const left = path.node.left;
    if (
      left.operator === "===" &&
      t.isIdentifier(left.left) &&
      t.isStringLiteral(left.right)
    ) {
      // Check if the right-hand side of the condition matches the current financial product
      if (left.right.value !== financialProduct) {
        // Remove this property from the object
        path.remove();
      }
    }
  }
}

function handleIfStatement(
  path: NodePath<t.IfStatement>,
  financialProduct: string,
) {
  const test = path.node.test;

  // Check if the test is a binary expression (e.g., financialProduct == FinancialProduct.EmbeddedFinance)
  if (
    t.isBinaryExpression(test) &&
    (test.operator === "==" || test.operator === "===")
  ) {
    const left = test.left;
    const right = test.right;

    // Ensure the condition is checking 'financialProduct' against a member of 'FinancialProduct'
    if (
      t.isIdentifier(left, { name: "financialProduct" }) &&
      t.isMemberExpression(right) &&
      t.isIdentifier(right.object, { name: "FinancialProduct" }) &&
      t.isIdentifier(right.property) // Check if right.property is an Identifier
    ) {
      const productType = right.property.name;

      // Check if the property name of the member expression matches the financialProduct
      if (productType === financialProduct) {
        // Replace the if statement with its 'then' part
        path.replaceWith(path.node.consequent);
      } else {
        // Remove the entire if statement as it's not relevant for this financial product
        path.remove();
      }
    }
  }
}

// Generate sub-apps
generateSubApp(FinancialProduct.EmbeddedFinance);
generateSubApp(FinancialProduct.ExpenseManagement);
