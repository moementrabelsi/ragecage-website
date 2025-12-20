# Logo Folder

Place your logo files here.

## Supported Formats
- PNG (recommended for logos with transparency)
- SVG (scalable vector graphics - best quality)
- JPG/JPEG (for photos)

## Usage

### Option 1: Using from public folder
If you place your logo in this folder (e.g., `public/logo/logo.png`), you can reference it in your HTML or components as:
```jsx
<img src="/logo/logo.png" alt="RageCage Logo" />
```

### Option 2: Using from src/assets folder
If you place your logo in `src/assets/logo/`, you can import it in your components:
```jsx
import logo from '../assets/logo/logo.png'

<img src={logo} alt="RageCage Logo" />
```

## Recommended File Names
- `logo.png` - Main logo
- `logo-white.png` - White version for dark backgrounds
- `logo-icon.png` - Icon/favicon version
- `logo.svg` - Vector version (best quality)





