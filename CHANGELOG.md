# @napolab/eslint-plugin

## 0.1.1

### Patch Changes

- 3fc8cc9: Improve build configuration and package dependencies

  This patch includes several build and configuration improvements:
  - **Fixed ESM import issues**: Externalized TypeScript dependency in tsup build config to resolve dynamic require errors and reduce bundle size from 9.46MB to 31.90KB
  - **Added TypeScript peer dependency**: Added `typescript>=4.0.0` as a peer dependency since TypeScript is now externalized
  - **Updated installation docs**: README now includes TypeScript in installation commands and specifies minimum version requirements
  - **Fixed linting warnings**: Suppressed cspell warning for "useeffect" in rule name

  These changes ensure the plugin works correctly in ESM environments while maintaining proper dependency management and clear installation instructions for users.

## 0.1.0

### Minor Changes

- 29c9adf: Improve package.json configuration and build setup

## 0.0.4

### Patch Changes

- f1b3406: chore: remove private field

## 0.0.3

### Patch Changes

- d6a4005: Add comprehensive ESLint plugin with styling rules and utilities

## 0.0.2

### Patch Changes

- Add comprehensive ESLint plugin with styling rules and utilities
