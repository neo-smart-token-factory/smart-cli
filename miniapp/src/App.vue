<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { Info } from 'lucide-vue-next'
import { useTelegram } from './composables/useTelegram'
import { useWeb3 } from './composables/useWeb3'
import { useTon } from './composables/useTon'
import { useJettonFactory } from './composables/useJettonFactory'
import { useDraft } from './composables/useDraft'
import StepLanding from './components/StepLanding.vue'
import StepForm from './components/StepForm.vue'
import StepResult from './components/StepResult.vue'

const { showAlert, initData, impactOccurred } = useTelegram()
const { isConnected, address, connect, disconnect, initWeb3, isBaseNetwork } = useWeb3()
const { isTonConnected, tonAddress, connectTon, disconnectTon, initTon } = useTon()
const { isDeploying, deployJetton } = useJettonFactory()
const { load, clear, watchAndPersist, defaultForm } = useDraft()

const isInitializing = ref(true)
const initializationError = ref(null)
const currentStep = ref(1)
const form = reactive(load())

const performAuth = async () => {
  if (!initData.value) return
  impactOccurred('light')
  
  // CRITICAL: Implementar timeout para prevenir hang infinito
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
  
  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData: initData.value }),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (res.ok) {
      const data = await res.json()
      console.log('NΞØ Node: Session Secure', data.user?.id)
    } else if (res.status === 401) {
      console.warn('NΞØ Node: Auth Challenge Failed - Unauthorized')
      showAlert('Authentication failed. Please restart the app.')
    } else if (res.status === 429) {
      console.warn('NΞØ Node: Rate limited')
      showAlert('Too many requests. Please wait.')
    } else {
      console.warn('NΞØ Node: Auth Challenge Failed', res.status)
    }
  } catch (e) {
    clearTimeout(timeoutId)
    if (e.name === 'AbortError') {
      console.error('NΞØ Node: Auth timeout')
      showAlert('Authentication timeout. Check your connection.')
    } else {
      console.error('NΞØ Node: Hive Connection Error', e)
    }
  }
}

const resultNetwork = computed(() =>
  isTonConnected.value ? 'TON Mainnet' : (isConnected.value ? 'Base Mainnet' : 'Decentralized')
)
const resultTokenName = computed(() => form.name || 'NΞØ Asset')

function openSmartMint() {
  impactOccurred('medium')
  currentStep.value = 2
}

function backToLanding() {
  impactOccurred('light')
  currentStep.value = 1
}

async function handleDeploy() {
  if (!isTonConnected.value) {
    showAlert('Connect TON wallet first')
    return
  }
  
  // CRITICAL: Validação client-side antes de enviar transação
  if (!form.name || form.name.trim().length === 0) {
    showAlert('Token name is required')
    return
  }
  if (!form.symbol || form.symbol.trim().length === 0) {
    showAlert('Token symbol is required')
    return
  }
  if (form.name.length > 100) {
    showAlert('Token name too long (max 100 characters)')
    return
  }
  if (form.symbol.length > 20) {
    showAlert('Token symbol too long (max 20 characters)')
    return
  }
  if (form.description && form.description.length > 500) {
    showAlert('Description too long (max 500 characters)')
    return
  }
  
  const decimals = parseInt(form.decimals)
  if (isNaN(decimals) || decimals < 0 || decimals > 18) {
    showAlert('Decimals must be between 0 and 18')
    return
  }
  
  impactOccurred('heavy')
  try {
    await deployJetton(form)
    showAlert('Deployment Initiated! Check your wallet.')
    currentStep.value = 3
  } catch (e) {
    console.error('Deployment error:', e)
    showAlert('Deployment failed: ' + e.message)
  }
}

function handleShare() {
  impactOccurred('medium')
  const text = encodeURIComponent('Ativando meu Node NΞØ. Venha forjar sua soberania na Base e TON. 🚀')
  const url = `https://t.me/share/url?url=https://miniapp-smartfactory.vercel.app&text=${text}`
  window.open(url, '_blank')
}

function startNewSequence() {
  impactOccurred('medium')
  Object.assign(form, defaultForm())
  clear()
  currentStep.value = 1
}

watchAndPersist(() => form)

onMounted(() => {
  const init = async () => {
    try {
      await Promise.allSettled([
        initWeb3().catch((err) => {
          console.error('Web3 init failed:', err)
          return null
        }),
      ])
      try {
        initTon()
      } catch (err) {
        console.error('TON init failed:', err)
      }
      await performAuth()
      isInitializing.value = false
    } catch (err) {
      console.error('NΞØ: Critical initialization error', err)
      initializationError.value = err.message || 'Failed to initialize app'
      isInitializing.value = false
    }
  }
  init()
})
</script>

<template>
  <div v-if="isInitializing" class="twa-viewport bg-gradient-cyber flex items-center justify-center">
    <div class="text-center space-y-4">
      <div class="w-12 h-12 border-4 border-neon-acid/20 border-t-neon-acid rounded-full animate-spin mx-auto" />
      <p class="text-sm font-space font-bold uppercase text-neon-acid">NΞØ Protocol</p>
      <p class="text-xs text-white/40 font-mono">Initializing secure node...</p>
    </div>
  </div>

  <div v-else-if="initializationError" class="twa-viewport bg-gradient-cyber flex items-center justify-center">
    <div class="glass-card rounded-2xl p-6 max-w-md space-y-4 w-full mx-4">
      <div class="flex items-center gap-3 text-orange-400">
        <Info class="w-6 h-6" />
        <h2 class="text-sm font-space font-bold uppercase">Initialization Error</h2>
      </div>
      <p class="text-xs text-white/60">{{ initializationError }}</p>
      <button
        type="button"
        @click="() => window.location.reload()"
        class="w-full bg-neon-acid hover:bg-[#A3FF00] text-black font-space font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
      >
        Retry
      </button>
    </div>
  </div>

  <div v-else class="twa-viewport bg-gradient-cyber flex flex-col">
    <StepLanding
      v-if="currentStep === 1"
      :address="address ?? ''"
      :ton-address="tonAddress ?? ''"
      @open="openSmartMint"
    />
    <StepForm
      v-else-if="currentStep === 2"
      :form="form"
      :is-connected="isConnected"
      :address="address ?? ''"
      :is-ton-connected="isTonConnected"
      :ton-address="tonAddress ?? ''"
      :is-base-network="isBaseNetwork"
      :is-deploying="isDeploying"
      @back="backToLanding"
      @deploy="handleDeploy"
      @connect-base="isConnected ? disconnect() : connect()"
      @connect-ton="isTonConnected ? disconnectTon() : connectTon()"
    />
    <StepResult
      v-else-if="currentStep === 3"
      :token-name="resultTokenName"
      :network="resultNetwork"
      @share="handleShare"
      @start-new="startNewSequence"
    />
  </div>
</template>

<style scoped>
.glass-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
