const fs = require("node:fs");
const path = require("node:path");
const Ajv = require("ajv");

const repositoryRoot = path.resolve(__dirname, "..");
const modelsDirectory = path.join(repositoryRoot, "models");
const schemaPath = path.join(
  repositoryRoot,
  "validation",
  "tm-json-schema-validation.json",
);

const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const ajv = new Ajv({
  strict: false,
  addUsedSchema: false,
  allErrors: true,
  formats: {
    "json-pointer": true,
    "uri-reference": true,
  },
});
const validate = ajv.compile(schema);

const modelFiles = fs
  .readdirSync(modelsDirectory)
  .filter((fileName) => fileName.endsWith(".json"))
  .sort();

let modelCount = 0;
let hasErrors = false;

for (const fileName of modelFiles) {
  const filePath = path.join(modelsDirectory, fileName);
  let model;

  try {
    model = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error(`${fileName}: invalid JSON: ${error.message}`);
    hasErrors = true;
    continue;
  }

  if (model === null || typeof model !== "object" || Array.isArray(model)) {
    console.error(`${fileName}: expected one top-level Thing Model object`);
    hasErrors = true;
    continue;
  }

  modelCount += 1;

  if (validate(model)) {
    continue;
  }

  hasErrors = true;
  const title = typeof model.title === "string" ? ` (${model.title})` : "";
  console.error(`${fileName}${title}: invalid Thing Model`);

  for (const error of validate.errors ?? []) {
    const location = error.instancePath || "/";
    console.error(`  ${location}: ${error.message}`);
  }
}

if (hasErrors) {
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${modelCount} Thing Models in ${modelFiles.length} files against W3C WoT TD 1.1.`,
  );
}
