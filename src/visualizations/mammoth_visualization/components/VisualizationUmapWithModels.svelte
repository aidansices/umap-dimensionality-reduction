<script>
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

  import { onMount } from "svelte";
  import { loadDataForModel, getAvailableModels } from "../js/load-models-data";
  import { DEFAULT_MODEL } from "../../../shared/js/models-config";
  import Umap2d from "./Umap2d.svelte";
  import Projection3d from "./Projection3d.svelte";

  let isLoaded = false;
  let isLoading = false;
  let colorIndices;
  let projections;
  let model3d;
  let hoveredPointIndex = -1;
  let selectedModelId = DEFAULT_MODEL;
  let availableModels = [];
  let currentModelName = "";

  onMount(async () => {
    console.log("VisualizationUmapWithModels: onMount starting");
    availableModels = getAvailableModels();
    console.log("Available models:", availableModels);
    console.log("Default model selected:", selectedModelId);
    await loadModel(selectedModelId);
    console.log("Initial model loaded");
  });

  async function loadModel(modelId) {
    console.log(`Loading model: ${modelId}`);
    if (isLoading) {
      console.log("Already loading, skipping...");
      return;
    }
    
    isLoading = true;
    isLoaded = false;
    
    try {
      console.log(`Fetching data for model: ${modelId}`);
      const data = await loadDataForModel(modelId);
      console.log("Data loaded:", data);
      
      colorIndices = data.colorIndices;
      projections = data.projections;
      model3d = data.model3d;
      
      console.log("ColorIndices:", colorIndices ? colorIndices.length : "null");
      console.log("Projections:", projections ? Object.keys(projections) : "null");
      console.log("Model3d:", model3d ? model3d.length : "null");
      
      const model = availableModels.find(m => m.id === modelId);
      currentModelName = model ? model.name : modelId;
      
      isLoaded = true;
      hoveredPointIndex = -1; // Reset hover state when switching models
      console.log(`Model ${modelId} loaded successfully`);
    } catch (error) {
      console.error(`Failed to load model ${modelId}:`, error);
    } finally {
      isLoading = false;
    }
  }

  async function handleModelChange(event) {
    const newModelId = event.target.value;
    console.log(`handleModelChange: ${selectedModelId} -> ${newModelId}`);
    
    // Update selected model and always load new data
    selectedModelId = newModelId;
    console.log(`Switching to model: ${selectedModelId}`);
    await loadModel(selectedModelId);
  }
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .model-selector {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
  }

  .model-selector label {
    font-weight: 600;
    margin-right: 10px;
    color: #495057;
  }

  .model-selector select {
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    background-color: white;
    font-size: 14px;
    cursor: pointer;
    min-width: 150px;
  }

  .model-selector select:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  .visualization-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    flex: 1;
  }

  .loading-message {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 40px;
    font-size: 16px;
    color: #6c757d;
  }

  @media only screen and (max-width: 800px) {
    .visualization-container {
      flex-direction: column;
    }
    
    .model-selector {
      padding: 15px;
    }
    
    .model-selector label {
      margin-bottom: 5px;
      margin-right: 0;
    }
    
    .model-selector {
      flex-direction: column;
      align-items: stretch;
    }
    
    .model-selector select {
      min-width: unset;
      width: 100%;
    }
  }
</style>

<div class="container">
  <div class="model-selector">
    <label for="model-select">Select Model:</label>
    <select 
      id="model-select"
      value={selectedModelId} 
      on:change={handleModelChange}
      disabled={isLoading}
    >
      {#each availableModels as model}
        <option value={model.id}>{model.name}</option>
      {/each}
    </select>
  </div>

  <div class="visualization-container">
    {#if isLoading}
      <div class="loading-message">
        Loading {currentModelName || selectedModelId}...
      </div>
    {:else if isLoaded}
      <Projection3d
        {colorIndices}
        model3d={model3d}
        on:hover={e => (hoveredPointIndex = e.detail)}
        {hoveredPointIndex}
        title={`Original 3D Data - ${currentModelName}`} />
      <Umap2d
        {colorIndices}
        {projections}
        on:hover={e => (hoveredPointIndex = e.detail)}
        {hoveredPointIndex}
        title={`2D UMAP Projection - ${currentModelName}`} />
    {:else}
      <div class="loading-message">
        Loading...
      </div>
    {/if}
  </div>
</div>
