# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start development mode for all packages with hot reload
- `pnpm bootstrap` - Install dependencies and build all packages  
- `pnpm build` - Build all packages (includes TypeScript declarations and bundling)
- `pnpm build:dts` - Build TypeScript declarations only
- `pnpm build:playground` - Build the playground demo application

### Code Quality
- `pnpm lint` - Run ESLint across all packages
- `turbo lint` - Run linter with Turbo's parallel execution

### Building Individual Packages
- `node scripts/build.mjs --package <package-name>` - Build a specific package (ES and UMD formats)
- Custom build script handles both packages/ and runtime/ directories with Vite

### Package Management
- Uses pnpm workspaces with Turbo for monorepo management
- Node.js version: 20.19.3 (managed by Volta)
- Package manager: pnpm@10.13.1

## Architecture

This is a low-code platform for medical device interface customization, built as a monorepo with the following core layers:

### 1. Designer Layer (`packages/designer`)
- Visual template designer with drag-and-drop interface
- Components: toolbar, component library, canvas, property panel
- Built with Vue 3 and integrates with the stage control system

### 2. Stage Control (`packages/stage`) 
- Canvas interaction management (drag, select, resize, rotate)
- Uses Moveable.js for transformation controls
- Communicates between designer and runtime layers
- Handles element selection via `selectFromPoint` method

### 3. Runtime Layer
- `packages/core`: Device adaptation, style parsing, event system
- `packages/runtime-ui`: UI component library (button, text, image, etc.)
- `runtime/`: Framework-specific renderers (Vue3 implementation included)

### 4. Data Model (`packages/schema`)
- DSL (Domain Specific Language) definitions
- Template structure, component properties, events

### 5. Support Tools
- `packages/cli`: Scaffolding and development tools
- `packages/utils`: Common utilities including Figma JSON parser
- `packages/form`: Form rendering system
- `packages/llm`: LLM integration for AI-assisted design

## Key Technical Details

### Multi-Framework Support
- Runtime supports Vue 2.7/Vue 3/React through separate DSL parsers
- Currently implemented: Vue 3 runtime in `runtime/vue3/`
- DSL describes page structure, styles, and events - runtime renders to framework-specific components

### Device Adaptation
- Uses pixel-based scaling instead of REM for precise multi-resolution rendering
- Core calculates scale ratio based on design template size vs device resolution
- Template designed at fixed size (e.g., 1024x600), runtime scales proportionally

### Figma Integration
- Parser in `packages/utils/src/parser/lanhu/` converts Figma JSON to DSL
- Handles complex nested structures and style transformations
- Performance optimizations include async processing and caching

### Event System
- Implemented in `packages/core` for component communication
- DSL defines event triggers and target component interactions
- Runtime registers DOM events and executes component methods on trigger

## Workspace Structure

```
packages/          # Core platform packages
├── cli/          # Development CLI tools
├── core/         # Runtime core (device adaptation, events)
├── designer/     # Visual designer interface
├── form/         # Form system
├── llm/          # AI/LLM integration
├── runtime-ui/   # UI component library
├── schema/       # DSL definitions
├── stage/        # Canvas interaction layer
└── utils/        # Utilities and parsers

runtime/          # Framework-specific runtime implementations
└── vue3/         # Vue 3 runtime

playground/       # Demo application
```

## Development Notes

- TypeScript configuration includes separate configs for browser and Vue builds
- ESLint configuration uses Antfu's config with UnoCSS plugin
- Pre-commit hooks run linting via lint-staged
- Turbo handles parallel builds and caching across packages
- Package interdependencies managed via pnpm workspace protocol