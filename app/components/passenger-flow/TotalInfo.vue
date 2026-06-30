<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
    <PassengerFlowTotalCard
      v-for="(card, index) in cards"
      :key="card.id"
      :data="card"
      :class="{ fourth: index === 3 }"
      :style="index === 3 ? { 
        borderColor: `color-mix(in srgb, ${card.color} 20%, transparent)`,
        background: `color-mix(in srgb, ${card.color} 10%, transparent)`
      } : null"
    />
  </div>
</template>

<script setup lang="ts">
import type { PassengerFlowTotal } from '~/components/passenger-flow/PassengerFlowTotalCard.vue';

defineProps<{
  cards: PassengerFlowTotal[];
}>();
</script>
