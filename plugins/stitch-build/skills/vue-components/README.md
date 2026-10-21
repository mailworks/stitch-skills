# vue:components

Converts Stitch designs into modular **Vue 3** Single File Components using the Composition API (`<script setup lang="ts">`).

## Prerequisites

- Node.js >= 18
- A Vite + Vue 3 project (target output directory)
- Stitch MCP server connected (or existing `.stitch/designs/` files)

## Setup

```bash
npm install
```

## Usage

```bash
# Validate a single component
npm run validate src/components/MyCard.vue

# Download a Stitch design asset
npm run fetch "<url>" ".stitch/designs/home.html"
```

## Skill conventions

| Pattern | Vue 3 implementation |
|---|---|
| Component props | `defineProps<Props>()` with typed generics in `<script setup>` |
| Props with defaults | `withDefaults(defineProps<Props>(), { ... })` |
| Reusable logic | Composables in `src/composables/` with `use` prefix |
| Content slot | `<slot />` in template |
| Dynamic classes | `:class="['base', condition ? 'a' : 'b']"` |
| Reactive variables | `ref()` for primitives, `reactive()` for objects |
| Derived state | `computed(() => ...)` — do not duplicate props in `ref` |
| Side effects | `watch()` / `watchEffect()` |
| Events | `defineEmits<{ eventName: [payload: Type] }>()` |

## Validator checks

1. **Typed `defineProps`** — must use `defineProps<YourProps>()` (not runtime object syntax)
2. **No hardcoded hex colors** — use theme-mapped Tailwind classes from `resources/style-guide.json`
