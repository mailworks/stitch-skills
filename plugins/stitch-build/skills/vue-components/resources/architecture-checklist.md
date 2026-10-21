# Architecture Quality Gate

### Structural integrity
- [ ] Logic extracted to composables in `src/composables/` (prefixed with `use`).
- [ ] No monolithic files; strictly Atomic/Composite modularity.
- [ ] All static text/URLs moved to `src/data/mockData.ts`.
- [ ] Navigation links converted from placeholder `href="#"` to Vue Router `<RouterLink to="...">`.
- [ ] TopAppBar logo/title configured with `<RouterLink to="/">` for desktop accessibility.

### Type safety and syntax
- [ ] Component file defines a TypeScript interface ending in `Props` (e.g., `[ComponentName]Props`).
- [ ] Props declared with typed generic `defineProps<[ComponentName]Props>()` (not runtime object).
- [ ] `withDefaults` used when any prop has a default value.
- [ ] Emits declared with typed `defineEmits<{ ... }>()` if the component emits events.
- [ ] File is syntactically valid Vue SFC and compiles cleanly (`vue-tsc --noEmit` or `tsc --noEmit`).
- [ ] Placeholders from templates (e.g., `StitchComponent`) have been replaced with actual names.

### Reactivity
- [ ] Props accessed via `props.x` or `toRefs(props)`, not destructured directly.
- [ ] Derived state uses `computed()`, not local `ref` copies of props.

### Styling and theming
- [ ] Dark mode (`dark:`) applied to all color classes.
- [ ] No hardcoded hex values in template or script — use theme-mapped Tailwind classes.
