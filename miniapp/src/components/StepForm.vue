<script setup>
import { computed } from 'vue'
import { Wallet, Hexagon, ArrowLeft, Package, Globe } from 'lucide-vue-next'
import CloudUpload from './CloudUpload.vue'

const props = defineProps({
  form: { type: Object, required: true },
  isConnected: Boolean,
  address: { type: String, default: '' },
  isTonConnected: Boolean,
  tonAddress: { type: String, default: '' },
  isBaseNetwork: { type: Boolean, default: true },
  isDeploying: Boolean,
})

const emit = defineEmits(['back', 'deploy', 'connect-base', 'connect-ton'])

// CRITICAL: Validação em tempo real
const isFormValid = computed(() => {
  const { name, symbol, decimals } = props.form
  
  if (!name || name.trim().length === 0 || name.length > 100) return false
  if (!symbol || symbol.trim().length === 0 || symbol.length > 20) return false
  
  const dec = parseInt(decimals)
  if (isNaN(dec) || dec < 0 || dec > 18) return false
  
  return true
})

const canDeploy = computed(() => {
  return props.isTonConnected && isFormValid.value && !props.isDeploying
})
</script>

<template>
  <div class="flex flex-col flex-1 min-h-0">
    <header class="flex justify-between items-center pb-4">
      <button
        type="button"
        @click="emit('back')"
        class="flex items-center gap-2 text-[10px] text-white/50 hover:text-neon-acid uppercase font-mono transition-colors"
      >
        <ArrowLeft class="w-4 h-4" /> Back
      </button>
      <h2 class="text-sm font-space font-bold uppercase tracking-tight text-neon-acid">Smart Mint</h2>
      <div class="w-16" />
    </header>

    <div class="twa-scroll space-y-4 pb-4">
      <section v-if="isConnected && !isBaseNetwork" class="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 flex items-center gap-3">
        <Globe class="w-5 h-5 text-orange-400 shrink-0" />
        <div class="flex flex-col min-w-0">
          <span class="text-[10px] font-bold uppercase text-orange-400">Base: Wrong Network</span>
          <span class="text-[9px] text-white/60">Switch to Base Mainnet.</span>
        </div>
      </section>

      <section class="glass-card rounded-2xl p-5 space-y-4">
        <CloudUpload v-model="form.image" label="Token Icon (NΞØ Cloud)" />

        <div class="space-y-1.5">
          <label class="text-[9px] uppercase font-bold text-white/40 ml-1">Token Name</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="e.g. NeoFlow"
            class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-neon-acid/50 outline-none transition-colors"
          />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <label class="text-[9px] uppercase font-bold text-white/40 ml-1">Symbol</label>
            <input
              v-model="form.symbol"
              type="text"
              placeholder="NEO"
              class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-neon-acid/50 outline-none transition-colors uppercase"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-[9px] uppercase font-bold text-white/40 ml-1">Decimals</label>
            <input
              v-model.number="form.decimals"
              type="number"
              min="0"
              max="18"
              class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-neon-acid/50 outline-none transition-colors"
            />
          </div>
        </div>
        <div class="space-y-1.5">
          <label class="text-[9px] uppercase font-bold text-white/40 ml-1">Description</label>
          <textarea
            v-model="form.description"
            rows="2"
            placeholder="Describe your asset..."
            class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-neon-acid/50 outline-none transition-colors resize-none"
          />
        </div>
      </section>

      <section class="grid grid-cols-2 gap-3">
        <button
          type="button"
          @click="emit('connect-base')"
          class="flex items-center justify-center gap-2 py-3 rounded-xl border transition-all active:scale-95"
          :class="isConnected ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/10 text-white/60'"
        >
          <Wallet class="w-4 h-4" />
          <span class="text-[10px] font-bold uppercase tracking-tighter font-mono">
            {{ isConnected ? `Base · ${address.slice(-4)}` : 'Base Connect' }}
          </span>
        </button>
        <button
          type="button"
          @click="emit('connect-ton')"
          class="flex items-center justify-center gap-2 py-3 rounded-xl border transition-all active:scale-95"
          :class="isTonConnected ? 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400' : 'bg-white/5 border-white/10 text-white/60'"
        >
          <Hexagon class="w-4 h-4" />
          <span class="text-[10px] font-bold uppercase tracking-tighter font-mono">
            {{ isTonConnected ? `TON · ${tonAddress.slice(-4)}` : 'TON Connect' }}
          </span>
        </button>
      </section>

      <div class="bg-neon-acid/5 border border-neon-acid/10 rounded-xl p-3">
        <p class="text-[9px] text-white/60 leading-relaxed">
          <strong class="text-neon-acid">Note:</strong> Deploy runs on TON. Connect TON wallet and sign. Storage and gas paid on-chain.
        </p>
      </div>
    </div>

    <footer class="pt-4">
      <button
        type="button"
        @click="emit('deploy')"
        :disabled="!canDeploy"
        class="w-full bg-neon-acid hover:bg-[#A3FF00] text-black font-space font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(214,255,0,0.2)] flex items-center justify-center gap-3 active:scale-95 transition-all uppercase tracking-tighter disabled:opacity-50 disabled:cursor-not-allowed"
        :title="!canDeploy ? 'Fill all required fields and connect TON wallet' : ''"
      >
        <Package class="w-5 h-5" />
        {{ isDeploying ? 'Deploying…' : 'Sign & Deploy' }}
      </button>
      <p v-if="!isFormValid && (form.name || form.symbol)" class="text-[9px] text-orange-400 text-center mt-2">
        ⚠️ Check form fields (name max 100 chars, symbol max 20 chars, decimals 0-18)
      </p>
    </footer>
  </div>
</template>
