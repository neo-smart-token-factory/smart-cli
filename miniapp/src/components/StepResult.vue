<script setup>
import { ArrowRight } from 'lucide-vue-next'
import ShareCard from './ShareCard.vue'

defineProps({
  tokenName: { type: String, default: 'NΞØ Asset' },
  network: { type: String, default: 'Decentralized' },
})

defineEmits(['share', 'startNew'])
</script>

<template>
  <div class="flex flex-col flex-1 min-h-0">
    <header class="pb-4">
      <h2 class="text-sm font-space font-bold uppercase tracking-tight text-neon-acid">Deployment success</h2>
    </header>

    <div class="twa-scroll space-y-6 pb-6">
      <ShareCard
        :tokenName="tokenName"
        :network="network"
        @share="$emit('share')"
      />
    </div>

    <footer class="pt-4 space-y-4">
      <button
        type="button"
        @click="$emit('startNew')"
        class="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white font-space font-bold text-[10px] uppercase tracking-wider transition-all active:scale-95"
      >
        <ArrowRight class="w-4 h-4 rotate-180" /> Start New Sequence
      </button>
    </footer>
  </div>
</template>
