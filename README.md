# Multi-Model UMAP Visualization

An interactive web application for exploring multiple 3D models and their UMAP (Uniform Manifold Approximation and Projection) dimensionality reductions. Switch between different models with a dropdown selector and visualize both the original 3D data and 2D UMAP projections side by side.

🌐 **[Live Demo](https://aidansices.github.io/umap-models/)**

## 🎯 Features

- **Multi-Model Support**: Switch between different 3D models (Mammoth, Dragon, T-rex, Buddha) with a dropdown
- **Dual Visualization**: View original 3D data and 2D UMAP projections simultaneously
- **Interactive**: Hover over points to see corresponding highlights across both visualizations
- **Responsive Design**: Works on both desktop and mobile devices
- **Instant Switching**: Models load quickly with visual feedback
- **Consistent Coloring**: Same color scheme maintained across all models

## 🚀 Quick Start

### View Online
Visit the live demo: **https://aidansices.github.io/umap-models/**

### Run Locally
```bash
# Clone the repository
git clone https://github.com/aidansices/umap-models.git
cd umap-models

# Install dependencies
npm install

# Build the visualization
FIGURE=mammoth-umap npm run build:main

# Serve locally
npm start
# Or use Python's built-in server:
cd public && python3 -m http.server 8000
```

Visit `http://localhost:5000` (or `http://localhost:8000` if using Python)

## 📁 Adding Your Own Models

### 1. Prepare Your Data
Your model data should be in JSON format with this structure:
```json
{
  "projections": {
    "0": [x1, y1],
    "1": [x2, y2],
    ...
  },
  "labels": [label1, label2, ...],
  "3d": [
    [x1, y1, z1],
    [x2, y2, z2],
    ...
  ]
}
```

### 2. Add Model File
1. Save your JSON file in `raw_data/models/` (e.g., `raw_data/models/your-model.json`)

### 3. Register the Model
Add your model to `src/shared/js/models-config.js`:
```javascript
export const MODELS = [
  // ... existing models
  {
    id: "your-model",
    name: "Your Model Name",
    description: "Description of your 3D model",
    filename: "your-model.json"
  }
];
```

### 4. Build and Deploy
```bash
# Preprocess the new model data
npm run preprocess:models

# Build the visualization
FIGURE=mammoth-umap npm run build:main

# Deploy to GitHub Pages
npm run pub
```

## 🛠️ Development

### Project Structure