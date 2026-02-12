<script setup>
import { ref } from 'vue'
import { toPng } from 'html-to-image'
import { Shield, Share2, Download, CheckCircle2, User, Zap } from 'lucide-vue-next'
import { useTelegram } from '../composables/useTelegram'

const props = defineProps({
  tokenName: { type: String, default: 'NΞØ Asset' },
  network: { type: String, default: 'Base Mainnet' },
  reputation: { type: String, default: '0.0.12' }
})

const { user, impactOccurred, showAlert } = useTelegram()
const cardRef = ref(null)
const isCapturing = ref(false)

const captureAndShare = async () => {
  if (!cardRef.value) return
  
  isCapturing.value = true
  impactOccurred('medium')
  
  try {
    const dataUrl = await toPng(cardRef.value, {
      cacheBust: true,
      backgroundColor: '#050505',
      style: {
        borderRadius: '0' // Clear rounded corners for the clean export
      }
    })
    
    // In TWA, we can't easily "share" a file blob to other apps directly 
    // without a backend or specific Bot interaction.
    // So we provide a download or tell them to screenshot/save.
    
    const link = document.createElement('a')
    link.download = `neo-node-activation-${Date.now()}.png`
    link.href = dataUrl
    link.click()
    
    showAlert('Node activation captured! Send this to your groups to increase reputation.')
  } catch (err) {
    console.error('Capture failed', err)
    showAlert('Sector disturbance: Capture failed.')
  } finally {
    isCapturing.value = false
  }
}
</script>

<template>
  <div class="space-y-4 w-full">
    <!-- Visual Card for Generation (Scaled for high-quality export) -->
    <div 
      ref="cardRef" 
      class="relative aspect-[4/5] w-full bg-[#050505] p-8 border border-white/10 overflow-hidden flex flex-col justify-between group"
    >
      <!-- Background Effects -->
      <div class="absolute -top-24 -right-24 w-64 h-64 bg-neon-acid opacity-10 blur-[100px] rounded-full"></div>
      <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500 opacity-10 blur-[100px] rounded-full"></div>
      
      <!-- Top Section -->
      <div class="relative z-10 flex justify-between items-start">
        <div class="flex items-center gap-3">
          <img src="/brand/logo.png" class="w-10 h-10 object-contain" alt="NEO" />
          <div class="flex flex-col">
            <span class="text-[10px] font-mono text-neon-acid uppercase tracking-[0.3em] font-bold">Node Operator</span>
            <span class="text-xs text-white/40 font-mono tracking-tighter uppercase">ID: {{ user?.id || '99999999' }}</span>
          </div>
        </div>
        <div class="p-2 border border-neon-acid/20 rounded-lg">
          <Shield class="w-6 h-6 text-neon-acid shadow-[0_0_15px_#D6FF00]" />
        </div>
      </div>

      <!-- Mid Section: Status -->
      <div class="relative z-10 space-y-4 my-8">
        <div class="space-y-1">
          <span class="text-[9px] font-mono text-white/30 uppercase tracking-widest">Protocol Status</span>
          <h2 class="text-3xl font-space font-bold uppercase leading-tight text-white tracking-tighter">
            Sovereignty established
          </h2>
        </div>
        
        <div class="p-4 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-md">
          <div class="flex justify-between items-center">
            <div class="space-y-1">
              <span class="text-[8px] font-mono text-white/40 uppercase">Deployed Asset</span>
              <p class="text-sm font-space font-bold text-neon-acid uppercase">{{ tokenName }}</p>
            </div>
            <div class="text-right space-y-1">
              <span class="text-[8px] font-mono text-white/40 uppercase">Network</span>
              <p class="text-[10px] font-mono font-bold text-white/80 uppercase tracking-tighter">{{ network }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="relative z-10 flex border-t border-white/5 pt-6 justify-between items-end">
        <div class="space-y-1">
          <span class="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em]">Reputation Score</span>
          <div class="flex items-center gap-2">
            <span class="text-xl font-space font-bold text-white/90">#{{ reputation }}</span>
            <div class="flex gap-0.5">
               <Zap v-for="i in 3" :key="i" class="w-2 h-2 text-neon-acid fill-neon-acid" />
            </div>
          </div>
        </div>
        <div class="text-right">
          <p class="text-[8px] font-mono text-white/20 uppercase leading-relaxed tracking-tighter">
             NΞØ SMART FACTORY<br>
             v0.6.1 OPERATIONAL HUB
          </p>
        </div>
      </div>

      <!-- Marquee line at very bottom -->
      <div class="absolute bottom-0 left-0 right-0 py-1 bg-neon-acid/5 border-t border-neon-acid/10 overflow-hidden">
        <div class="whitespace-nowrap text-[6px] font-mono text-neon-acid/40 uppercase tracking-[0.5em] animate-marquee">
          EXPAND UNTIL SILENCE BECOMES STRUCTURE • SOBERANIA ATRAVÉS DA TECNOLOGIA • JOIN THE HIVE
        </div>
      </div>
    </div>

    <!-- UI Buttons -->
    <div class="grid grid-cols-2 gap-3">
      <button 
        @click="captureAndShare" 
        :disabled="isCapturing"
        class="flex items-center justify-center gap-2 py-3 rounded-xl bg-neon-acid text-black font-space font-bold uppercase text-[10px] tracking-tighter transition-all active:scale-95 disabled:opacity-50"
      >
        <Download v-if="!isCapturing" class="w-4 h-4" />
        <span v-else class="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin"></span>
        {{ isCapturing ? 'Generating...' : 'Save Card' }}
      </button>

      <button 
        @click="$emit('share')"
        class="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white/5 text-white/80 font-space font-bold uppercase text-[10px] tracking-tighter transition-all active:scale-95"
      >
        <Share2 class="w-4 h-4" /> Share Link
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  display: inline-block;
  animation: marquee 10s linear infinite;
}
</style>
