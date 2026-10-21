/**
 * Vue 3 SFC Validator
 * Checks that a .vue component follows the skill's architectural rules:
 *  - Uses <script setup lang="ts">
 *  - Declares a TypeScript interface/type ending in 'Props' (e.g. ComponentProps)
 *  - Calls typed defineProps<Props>() (with or without withDefaults)
 *  - Contains no hardcoded hex color values across template and script
 */

import { parse as parseSFC } from '@vue/compiler-sfc'
import { parse as parseBabel } from '@babel/parser'
import fs from 'node:fs'
import path from 'node:path'

const HEX_COLOR_REGEX = /#[0-9A-Fa-f]{3,8}\b/g

async function validateComponent(filePath) {
  if (!filePath) {
    console.error('Usage: node scripts/validate.js <file_path>')
    process.exit(1)
  }

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`)
    process.exit(1)
  }

  const source = fs.readFileSync(filePath, 'utf-8')
  const filename = path.basename(filePath)

  const { descriptor, errors } = parseSFC(source, { filename })

  if (errors.length > 0) {
    console.error('❌ SFC PARSE ERROR:', errors[0].message)
    process.exit(1)
  }

  console.log('🔍 Scanning Vue SFC AST...')
  console.log(`--- Validation for: ${filename} ---`)

  const isScriptSetup = Boolean(descriptor.scriptSetup)
  const scriptContent =
    descriptor.scriptSetup?.content ?? descriptor.script?.content ?? ''
  const templateContent = descriptor.template?.content ?? ''

  let hasPropsInterface = false
  let hasTypedDefineProps = false
  const hexIssues = []

  // 1. Check for script setup
  if (!isScriptSetup) {
    console.error('❌ SCRIPT: Missing <script setup lang="ts"> block.')
  }

  // 2. Parse script AST
  if (scriptContent) {
    try {
      const ast = parseBabel(scriptContent, {
        sourceType: 'module',
        plugins: ['typescript'],
      })

      const walk = (node) => {
        if (!node || typeof node !== 'object') return
        if (Array.isArray(node)) {
          for (const item of node) walk(item)
          return
        }

        // Check for Interface or Type ending with Props
        if (
          (node.type === 'TSInterfaceDeclaration' &&
            node.id?.name?.endsWith('Props')) ||
          (node.type === 'TSTypeAliasDeclaration' &&
            node.id?.name?.endsWith('Props'))
        ) {
          hasPropsInterface = true
        }

        // Check for defineProps<Props>() or withDefaults(defineProps<Props>(), ...)
        if (node.type === 'CallExpression') {
          if (
            node.callee?.type === 'Identifier' &&
            node.callee.name === 'defineProps'
          ) {
            if (node.typeParameters && node.typeParameters.params?.length > 0) {
              hasTypedDefineProps = true
            }
          }
        }

        for (const key of Object.keys(node)) {
          if (
            key === 'loc' ||
            key === 'start' ||
            key === 'end' ||
            key === 'range'
          )
            continue
          walk(node[key])
        }
      }

      walk(ast)
    } catch (err) {
      console.error('❌ SCRIPT PARSE ERROR:', err.message)
      process.exit(1)
    }
  }

  // 3. Scan for hardcoded hex colors
  const templateHex = [...templateContent.matchAll(HEX_COLOR_REGEX)].map(
    (m) => m[0],
  )
  templateHex.forEach((hex) => hexIssues.push(`[template] ${hex}`))

  const scriptHex = [...scriptContent.matchAll(HEX_COLOR_REGEX)].map(
    (m) => m[0],
  )
  scriptHex.forEach((hex) => hexIssues.push(`[script] ${hex}`))

  // Report results
  if (hasPropsInterface) {
    console.log("✅ Props interface declaration found (ends with 'Props').")
  } else {
    console.error(
      "❌ MISSING: Props interface (must be a TypeScript interface ending in 'Props').",
    )
  }

  if (hasTypedDefineProps) {
    console.log('✅ Typed defineProps<Props>() call found.')
  } else {
    console.error(
      '❌ MISSING: Typed defineProps (use defineProps<YourProps>() pattern).',
    )
  }

  if (hexIssues.length === 0) {
    console.log('✅ No hardcoded hex values found.')
  } else {
    console.error(`❌ STYLE: Found ${hexIssues.length} hardcoded hex codes.`)
    hexIssues.forEach((issue) => console.error(`   - ${issue}`))
  }

  const isValid =
    isScriptSetup &&
    hasPropsInterface &&
    hasTypedDefineProps &&
    hexIssues.length === 0

  if (isValid) {
    console.log('\n✨ COMPONENT VALID.')
    process.exit(0)
  } else {
    console.error('\n🚫 VALIDATION FAILED.')
    process.exit(1)
  }
}

validateComponent(process.argv[2])
