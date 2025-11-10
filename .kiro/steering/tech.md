# Technology Stack

## Framework & Libraries

- **React 19.2.0**: Main UI framework with modern hooks and concurrent features
- **Create React App**: Build toolchain and development environment
- **Recharts**: Primary charting library for radar, bar, and scatter plots
- **React Testing Library**: Component testing with DOM utilities
- **Jest**: Test runner and assertion library
- **Web Vitals**: Performance monitoring

## Build System

- **react-scripts 5.0.1**: Webpack-based build system with zero configuration
- **ESLint**: Code linting with react-app configuration
- **Babel**: JavaScript transpilation (configured via react-scripts)

## Common Commands

```bash
# Development
npm start                 # Start development server on localhost:3000
npm test                  # Run tests in watch mode
npm run test -- --run     # Run tests once without watch mode

# Production
npm run build            # Create optimized production build in /build folder
npm run eject            # Eject from Create React App (irreversible)

# Package Management
npm install              # Install dependencies
npm install <package>    # Add new dependency
```

## Browser Support

- **Production**: >0.2% usage, not dead browsers, excludes Opera Mini
- **Development**: Latest Chrome, Firefox, and Safari versions

## Development Notes

- Hot reloading enabled in development mode
- Source maps available for debugging
- Progressive Web App capabilities configured
- Strict mode enabled for React components