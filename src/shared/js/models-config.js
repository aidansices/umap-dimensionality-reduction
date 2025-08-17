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

// Configuration for available models
// To add a new model:
// 1. Add your model file as raw_data/models/yourmodel.json
// 2. Add an entry to this MODELS array
// 3. Run yarn preprocess:models to generate compressed files
// 4. The new model will appear in the dropdown automatically

export const MODELS = [
  {
    id: "mammoth",
    name: "Mammoth",
    description: "3D mammoth model with UMAP projections",
    filename: "mammoth.json"
  },
  {
    id: "dragon",
    name: "Dragon",
    description: "3D dragon model with UMAP projections",
    filename: "dragon.json"
  },
  {
    id: "t-rex",
    name: "T-rex",
    description: "3D t-rex model with UMAP projections",
    filename: "t-rex.json"
  }
  // Add more models here following the same pattern:
  // {
  //   id: "dragon",
  //   name: "Dragon", 
  //   description: "3D dragon model with UMAP projections",
  //   filename: "dragon.json"
  // }
];

export const DEFAULT_MODEL = "mammoth";
