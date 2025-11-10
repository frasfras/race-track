# Project Structure

## Root Directory

```
driver-insights/
├── public/           # Static assets and HTML template
├── src/             # React application source code
├── node_modules/    # Dependencies (auto-generated)
├── .git/           # Git repository
├── .kiro/          # Kiro configuration and steering
├── package.json    # Project configuration and dependencies
├── package-lock.json # Dependency lock file
├── README.md       # Standard Create React App documentation
└── RACE.md         # Project requirements and specifications
```

## Source Code Organization (`src/`)

```
src/
├── App.js          # Main application component
├── App.css         # Application-specific styles
├── App.test.js     # Application component tests
├── index.js        # React application entry point
├── index.css       # Global styles
├── logo.svg        # React logo asset
├── reportWebVitals.js # Performance monitoring
└── setupTests.js   # Test configuration
```

## Public Assets (`public/`)

```
public/
├── index.html      # HTML template with "Driver Insights" title
├── favicon.ico     # Browser tab icon
├── logo192.png     # PWA icon (192x192)
├── logo512.png     # PWA icon (512x512)
├── manifest.json   # PWA configuration
└── robots.txt      # Search engine directives
```

## Conventions

- **Component Files**: Use `.js` extension for React components
- **Styling**: CSS files co-located with components (e.g., `App.js` + `App.css`)
- **Testing**: Test files follow `.test.js` naming convention
- **Assets**: Static assets in `public/` folder, imported assets in `src/`
- **Entry Point**: `src/index.js` renders `App` component into `#root` div
- **Strict Mode**: All components wrapped in `React.StrictMode`

## File Naming

- Components: PascalCase (e.g., `App.js`, `DriverDashboard.js`)
- Utilities: camelCase (e.g., `reportWebVitals.js`)
- Styles: Match component name (e.g., `App.css`)
- Tests: Component name + `.test.js` suffix