/* Copyright 2019 Google LLC All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/

const fs = require("fs");
const path = require("path");
// Use Node.js built-in Buffer for base64 encoding
function btoa(str) {
  return Buffer.from(str, 'binary').toString('base64');
}

const PUBLIC_DIR = "../public/";
const MODELS_DIR = "../raw_data/models/";

// Import the actual encoding functions
const { encode, toString } = require("../src/shared/js/parse-binary");
const N_BITS_MAMMOTH = 10;

// Read models configuration
const modelsConfigPath = path.join(__dirname, "../src/shared/js/models-config.js");
const modelsConfigContent = fs.readFileSync(modelsConfigPath, 'utf8');

// Extract MODELS array from the config file (simple regex-based approach)
const modelsMatch = modelsConfigContent.match(/export const MODELS = (\[[\s\S]*?\]);/);
if (!modelsMatch) {
  console.error("Could not parse MODELS from models-config.js");
  process.exit(1);
}

let MODELS;
try {
  // Evaluate the MODELS array (safe since it's our own config file)
  MODELS = eval(modelsMatch[1]);
} catch (e) {
  console.error("Error parsing MODELS array:", e);
  process.exit(1);
}

console.log(`Found ${MODELS.length} models to process:`, MODELS.map(m => m.name).join(', '));

// Process each model
MODELS.forEach(model => {
  console.log(`Processing model: ${model.name}...`);
  
  const modelPath = path.join(__dirname, MODELS_DIR, model.filename);
  
  if (!fs.existsSync(modelPath)) {
    console.error(`Model file not found: ${modelPath}`);
    console.error(`Please add your ${model.filename} file to raw_data/models/`);
    return;
  }

  const modelData = require(modelPath);
  const labels = modelData.labels;
  const model3d = modelData["3d"];

  const labelIndices = labels
    .map((label, index) => {
      return { label, index };
    })
    .sort((a, b) => a.label - b.label);

  const labelCounts = {};
  labelIndices.forEach(({ label }) => {
    labelCounts[label] = labelCounts[label] || 0;
    labelCounts[label] += 1;
  });

  // Process and encode the UMAP projections
  const encodedUMAP = {};
  Object.keys(modelData.projections).forEach(key => {
    const projection = modelData.projections[key];

    const output = [];
    labelIndices.forEach(({ index }) => {
      const point = projection[index];
      output.push(point[0], point[1]);
    });

    const encoded = encode(output, N_BITS_MAMMOTH);
    encodedUMAP[key] = btoa(toString(encoded));
  });

  // Sort the 3D points as well
  const model3DSorted = [];
  labelIndices.forEach(({ index }) => {
    const point = model3d[index];
    model3DSorted.push([point[1], point[2], point[0]]);
  });

  const labelOffsets = Object.keys(labelCounts)
    .map(index => {
      return { index, count: labelCounts[index] };
    })
    .sort((a, b) => a.index - b.index)
    .map(item => item.count);

  const encodedUMAPOutput = {
    projections: encodedUMAP,
    labelOffsets
  };

  // Write output files with model-specific names
  const encodedFile = `${model.id}_10k_encoded.json`;
  const model3dFile = `${model.id}_3d.json`;
  
  fs.writeFileSync(
    path.join(__dirname, PUBLIC_DIR, encodedFile),
    JSON.stringify(encodedUMAPOutput)
  );
  fs.writeFileSync(
    path.join(__dirname, PUBLIC_DIR, model3dFile),
    JSON.stringify(model3DSorted)
  );

  console.log(`✓ Generated ${encodedFile} and ${model3dFile}`);
});

console.log("All models processed successfully!");
