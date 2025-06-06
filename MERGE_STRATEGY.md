# Merge Conflict Resolution Strategy for PR #13

## Overview
This document outlines the strategy to resolve merge conflicts when merging enhanced features into the main repository.

## Key Conflicts Expected

### 1. Function Signature Changes
**Problem**: Added optional `targetPath` parameter to functions
**Solution**: Use default parameters to maintain backward compatibility

```javascript
// Before (main repository)
function copyGeneratedUrl(hubUrl, app, open) { ... }
function generateRegularUrl(hubUrl, repoUrl, branch, app, filepath) { ... }

// After (merge-ready)
function copyGeneratedUrl(hubUrl, app, open, targetPath = null) { ... }
function generateRegularUrl(hubUrl, repoUrl, branch, app, filepath, targetPath = null) { ... }
```

### 2. AVAILABLE_APPS Changes
**Problem**: Added VSCode, removed RetroLab, enhanced Shiny
**Solution**: Additive changes only, ensure no breaking changes

```javascript
// Safe additions:
vscode: {
    title: 'VSCode',
    generateUrlPath: function (path) { return 'vscode/'; }
}

// Enhanced Shiny with backward compatibility:
shiny: {
    title: 'Shiny',
    generateUrlPath: function (path) {
        // Enhanced logic that handles both files and directories
        // but maintains compatibility with existing usage
    }
}
```

### 3. UI Enhancements
**Problem**: Added Shiny-specific UI elements and state management
**Solution**: Conditional rendering based on app selection

```javascript
// Only show Shiny-specific UI when Shiny is selected
{app === 'shiny' && (
    // Shiny-specific UI elements
)}
```

## Merge Resolution Steps

1. **Backup current enhanced version**
2. **Create merge-ready files with backward compatibility**
3. **Test all existing functionality**
4. **Verify new features work correctly**
5. **Build and test extension**

## Backward Compatibility Checklist

- [ ] All existing function calls work without modification
- [ ] New parameters are optional with sensible defaults
- [ ] Existing app options (classic, jupyterlab, rstudio) unchanged
- [ ] UI remains functional for existing workflows
- [ ] Extension builds successfully
- [ ] All features work in both Chrome and Firefox
