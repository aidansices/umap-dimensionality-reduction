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

import { decode, fromString } from "../../../shared/js/parse-binary";
import { N_BITS_MAMMOTH } from "../../../shared/js/parameters";
import { MODELS } from "../../../shared/js/models-config";

function parseProjections(encodedProjections) {
  const parsedProjections = {};
  Object.keys(encodedProjections).forEach(key => {
    const encoded = encodedProjections[key];
    const byteArray = fromString(atob(encoded));
    const decoded = decode(byteArray, 20000, N_BITS_MAMMOTH);
    const unzipped = [];
    for (let i = 0; i < decoded.length; i += 2) {
      unzipped.push([decoded[i], decoded[i + 1]]);
    }
    parsedProjections[key] = unzipped;
  });
  return parsedProjections;
}

// Cache for loaded model data
const modelCache = new Map();
const loadingPromises = new Map();

async function _loadUmapForModel(modelId) {
  console.log(`_loadUmapForModel: Loading UMAP data for ${modelId}`);
  const filename = `${modelId}_10k_encoded.json`;
  console.log(`Fetching: ${filename}`);
  
  const res = await fetch(filename);
  if (!res.ok) {
    throw new Error(`Failed to load ${filename}: ${res.status} ${res.statusText}`);
  }
  
  const modelData = await res.json();
  console.log(`Successfully loaded UMAP data for ${modelId}, projections keys:`, Object.keys(modelData.projections || {}));

  const parsedProjections = parseProjections(modelData.projections);
  modelData.projections = parsedProjections;
  
  // Cache the result
  modelCache.set(`umap_${modelId}`, modelData);
  return modelData;
}

async function _load3DForModel(modelId) {
  console.log(`_load3DForModel: Loading 3D data for ${modelId}`);
  const filename = `${modelId}_3d.json`;
  console.log(`Fetching: ${filename}`);
  
  const res = await fetch(filename);
  if (!res.ok) {
    throw new Error(`Failed to load ${filename}: ${res.status} ${res.statusText}`);
  }
  
  const model3d = await res.json();
  console.log(`Successfully loaded 3D data for ${modelId}, points count:`, model3d ? model3d.length : 0);
  
  // Cache the result
  modelCache.set(`3d_${modelId}`, model3d);
  return model3d;
}

async function _loadColorIndicesForModel(modelId) {
  console.log(`_loadColorIndicesForModel: Loading color indices for ${modelId}`);
  const umap = await loadUmapForModel(modelId);
  const colorOffsets = umap.labelOffsets;
  console.log(`Color offsets for ${modelId}:`, colorOffsets ? colorOffsets.length : 0, "groups");

  const colorIndices = new Uint8Array(10000);
  let colorIndex = -1;
  let nColorPoints = 0;
  for (let i = 0; i < colorIndices.length; i++) {
    if (i >= nColorPoints) {
      colorIndex += 1;
      nColorPoints += colorOffsets[colorIndex];
    }
    colorIndices[i] = colorIndex;
  }
  
  console.log(`Generated color indices for ${modelId}, length:`, colorIndices.length);

  // Cache the result
  modelCache.set(`colorIndices_${modelId}`, colorIndices);
  return colorIndices;
}

export async function loadUmapForModel(modelId) {
  const cacheKey = `umap_${modelId}`;
  if (modelCache.has(cacheKey)) {
    return modelCache.get(cacheKey);
  }
  
  const promiseKey = `umap_${modelId}`;
  if (!loadingPromises.has(promiseKey)) {
    loadingPromises.set(promiseKey, _loadUmapForModel(modelId));
  }
  return loadingPromises.get(promiseKey);
}

export async function load3DForModel(modelId) {
  const cacheKey = `3d_${modelId}`;
  if (modelCache.has(cacheKey)) {
    return modelCache.get(cacheKey);
  }
  
  const promiseKey = `3d_${modelId}`;
  if (!loadingPromises.has(promiseKey)) {
    loadingPromises.set(promiseKey, _load3DForModel(modelId));
  }
  return loadingPromises.get(promiseKey);
}

export async function loadColorIndicesForModel(modelId) {
  const cacheKey = `colorIndices_${modelId}`;
  if (modelCache.has(cacheKey)) {
    return modelCache.get(cacheKey);
  }
  
  const promiseKey = `colorIndices_${modelId}`;
  if (!loadingPromises.has(promiseKey)) {
    loadingPromises.set(promiseKey, _loadColorIndicesForModel(modelId));
  }
  return loadingPromises.get(promiseKey);
}

export async function loadDataForModel(modelId) {
  const output = {};
  await Promise.all([
    loadUmapForModel(modelId).then(res => (output.projections = res.projections)),
    loadColorIndicesForModel(modelId).then(res => (output.colorIndices = res)),
    load3DForModel(modelId).then(res => (output.model3d = res))
  ]);

  return output;
}

export function getAvailableModels() {
  return MODELS;
}

export function getModelById(modelId) {
  return MODELS.find(model => model.id === modelId);
}
