<script setup>
import { ArrowRight, Wallet, Hexagon } from 'lucide-vue-next'

defineProps({
  address: { type: String, default: '' },
  tonAddress: { type: String, default: '' },
})

defineEmits(['open'])
</script>

<template>
  <div class="flex flex-col flex-1 min-h-0">
    <header class="flex justify-between items-center pb-6">
      <div class="flex items-center gap-3">
        <img src="/brand/logo.png" alt="NΞØ Logo" class="w-10 h-10 object-contain neon-text-glow" />
        <div class="flex flex-col">
          <span class="text-[10px] uppercase tracking-[0.2em] text-neon-acid/60 font-mono leading-none">NΞØ SMART FACTORY</span>
          <h1 class="text-xl font-space font-bold uppercase tracking-tight neon-text-glow leading-tight">SMART MINT</h1>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div v-if="address" class="glass-card px-2 py-1 rounded-full flex items-center gap-2 border-neon-acid/20">
          <div class="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span class="text-[9px] font-mono text-white/90">BASE: {{ address.slice(-4) }}</span>
        </div>
        <div v-if="tonAddress" class="glass-card px-2 py-1 rounded-full flex items-center gap-2 border-neon-acid/20">
          <div class="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span class="text-[9px] font-mono text-white/90">TON: {{ tonAddress.slice(-4) }}</span>
        </div>
        <template v-if="!address && !tonAddress">
          <div class="glass-card px-2 py-1 rounded-full flex items-center gap-1.5 border-white/10">
            <Wallet class="w-3 h-3 text-white/40" />
            <span class="text-[9px] font-mono text-white/50">Base —</span>
          </div>
          <div class="glass-card px-2 py-1 rounded-full flex items-center gap-1.5 border-white/10">
            <Hexagon class="w-3 h-3 text-white/40" />
            <span class="text-[9px] font-mono text-white/50">TON —</span>
          </div>
        </template>
      </div>
    </header>

    <section class="flex-1 flex flex-col items-center justify-center text-center px-4">
      <div class="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-neon-acid uppercase tracking-widest mb-6">
        Decentralized Token Factory
      </div>
      <h2 class="text-3xl md:text-4xl font-space font-bold tracking-tight mb-3">
        Deploy your <span class="text-neon-acid">Token</span> now.
      </h2>
      <p class="text-white/50 text-sm max-w-[280px] mx-auto mb-10">
        Create and deploy Jettons on TON. Connect your wallet, configure your asset, and launch.
      </p>
      <button
        @click="$emit('open')"
        class="bg-neon-acid hover:bg-[#A3FF00] text-black font-space font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(214,255,0,0.2)] flex items-center justify-center gap-3 active:scale-95 transition-all uppercase tracking-tighter"
      >
        Open Smart Mint <ArrowRight class="w-5 h-5" />
      </button>
    </section>
  </div>
</template>
