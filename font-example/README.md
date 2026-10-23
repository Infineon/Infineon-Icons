# Infineon Icons - Test Example

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm --dir font-example dev
```

This private example uses `@infineon/design-system-icons` through `workspace:*`.
Its dependency is a symlink to the repository root, so rebuilding updates the font
assets used by `test.html` without copying files. Font filenames and CSS classes
retain their existing `infineon-icons` identifiers.
