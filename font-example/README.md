# Infineon Icons - Test Example

## Setup

This folder is configured as a **pnpm workspace**, which means:

- `@infineon/infineon-icons` resolves to the local package (not npm registry)
- When you rebuild the main package, test.html instantly sees the new icons
- No manual copying of assets needed

## How It Works

1. **Root `pnpm-workspace.yaml`** defines both packages:
   ```yaml
   packages:
     - '.'
     - 'font-example'
   ```

2. **font-example/package.json** uses workspace protocol:
   ```json
   "dependencies": {
     "@infineon/infineon-icons": "workspace:*"
   }
   ```

3. **node_modules/@infineon/infineon-icons** is a symlink to `../..` (the root)

## Keep Test Updated Automatically

### Option 1: Rebuild Main Package (Recommended)
```bash
# From root directory
pnpm build
```

The test will automatically use the freshly generated fonts.

### Option 2: Watch for Changes
```bash
# From root, watch SVG files and rebuild on change
pnpm build:icons -- --watch
```