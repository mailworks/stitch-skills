<script setup lang="ts">
import { computed } from 'vue'

/**
 * Gold Standard: ActivityCard
 * This file serves as the definitive reference for the agent.
 */
interface ActivityCardProps {
  id: string
  username: string
  action: 'MERGED' | 'COMMIT'
  timestamp: string
  avatarUrl: string
  repoName: string
  userProfileUrl?: string
  repoUrl?: string
}

const props = withDefaults(defineProps<ActivityCardProps>(), {
  userProfileUrl: '/',
  repoUrl: '/',
})

const isMerged = computed(() => props.action === 'MERGED')
</script>

<template>
  <div class="flex items-center justify-between gap-4 rounded-lg bg-surface-dark dark:bg-surface-dark p-4 min-h-14 shadow-sm ring-1 ring-white/10 dark:ring-white/10">
    <div class="flex items-center gap-4 overflow-hidden">
      <div
        class="aspect-square h-10 w-10 flex-shrink-0 rounded-full bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url(${avatarUrl})` }"
        :aria-label="`Avatar for ${username}`"
      />

      <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm sm:text-base">
        <!-- Always wire navigation links using RouterLink instead of dead href="#" -->
        <RouterLink :to="userProfileUrl" class="font-semibold text-primary dark:text-primary hover:underline truncate">
          {{ username }}
        </RouterLink>

        <span
          :class="[
            'inline-block px-2 py-0.5 text-xs font-semibold rounded-full',
            isMerged ? 'bg-purple-500/30 text-purple-300 dark:text-purple-300' : 'bg-primary/30 text-primary dark:text-primary',
          ]"
        >
          {{ action }}
        </span>

        <span class="text-white/60 dark:text-white/60">in</span>

        <RouterLink :to="repoUrl" class="text-primary dark:text-primary hover:underline truncate">
          {{ repoName }}
        </RouterLink>
      </div>
    </div>

    <div class="shrink-0">
      <p class="text-sm font-normal leading-normal text-white/50 dark:text-white/50">
        {{ timestamp }}
      </p>
    </div>
  </div>
</template>
