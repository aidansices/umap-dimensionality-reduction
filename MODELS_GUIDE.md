# Models Guide - Adding New 3D Models

This guide explains how to add new 3D models with UMAP projections to the visualization system.

## Quick Start

### 1. Add Your Model Data

Place your model file in `raw_data/models/` directory with this JSON structure:

```json
{
  "projections": {
    "default": [[x1, y1], [x2, y2], ...]
  },
  "labels": [0, 1, 0, 2, ...],
  "3d": [[x, y, z], [x, y, z], ...]
}
```

**Example**: If you have a dragon model, save it as `raw_data/models/dragon.json`

### 2. Update Models Configuration

Edit `src/shared/js/models-config.js`:

```javascript
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
  }
  // Add more models here...
];
```

### 3. Process and Build

```bash
# Process your new models
npm run preprocess:models

# Build the website
npm run build

# Or develop locally
npm run dev:mammoth-umap
```

### 4. Deploy to GitHub Pages

```bash
npm run pub
```

## File Structure

```
understanding-umap-1/
├── raw_data/
│   └── models/
│       ├── mammoth.json    # Original mammoth data
│       ├── dragon.json     # Your new model
│       └── ...             # More models
├── public/
│   ├── mammoth_10k_encoded.json    # Generated
│   ├── mammoth_3d.json            # Generated  
│   ├── dragon_10k_encoded.json    # Generated
│   └── dragon_3d.json             # Generated
└── src/shared/js/
    └── models-config.js           # Model configuration
```

## Data Requirements

- **3D Points**: Array of [x, y, z] coordinates
- **UMAP Projections**: Object with projection keys and 2D points
- **Labels**: Array of integer labels (for coloring)
- **Size**: ~10,000 points recommended (similar to mammoth)

## Model Configuration Options

Each model in `MODELS` array supports:

- `id`: Unique identifier (used in filenames)
- `name`: Display name in dropdown
- `description`: Optional description
- `filename`: JSON file name in `raw_data/models/`

## Features

✅ **Mobile-friendly dropdown selector**  
✅ **Instant model switching**  
✅ **View reset on model change**  
✅ **Consistent color scheme**  
✅ **Easy to add/remove models**  
✅ **Automatic compression**  

## Troubleshooting

**Model not appearing in dropdown?**
- Check that the file exists in `raw_data/models/`
- Verify the model is added to `MODELS` array in `models-config.js`
- Run `npm run preprocess:models` to generate compressed files

**Data not loading?**
- Ensure JSON structure matches the required format
- Check browser console for loading errors
- Verify file sizes aren't too large

## Example Model Data

Here's a minimal example structure:

```json
{
  "projections": {
    "default": [
      [0.1, 0.2],
      [0.3, 0.4],
      [0.5, 0.6]
    ]
  },
  "labels": [0, 1, 0],
  "3d": [
    [1.0, 2.0, 3.0],
    [4.0, 5.0, 6.0], 
    [7.0, 8.0, 9.0]
  ]
}
```

## Next Steps

1. Add your model files to `raw_data/models/`
2. Update `models-config.js` 
3. Run `npm run preprocess:models`
4. Test with `npm run dev:mammoth-umap`
5. Deploy with `npm run pub`

The system will automatically:
- Compress your data for web delivery
- Generate the dropdown options
- Handle model switching
- Provide mobile-responsive interface
