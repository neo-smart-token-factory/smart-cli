<script setup>
import { ref, onUnmounted, watch } from 'vue'
import { UploadCloud, FileCheck, Loader2, X, Image as ImageIcon } from 'lucide-vue-next'
import { useCloudStorage } from '../composables/useCloudStorage'

const props = defineProps({
  modelValue: String,
  label: String
})

const emit = defineEmits(['update:modelValue'])

const { isUploading, uploadProgress, uploadFile } = useCloudStorage()
const fileInput = ref(null)
const previewUrl = ref(props.modelValue || null)
const uploadError = ref(null)
let objectUrl = null // CRITICAL: Track object URL for cleanup

const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // CRITICAL: Cleanup previous object URL to prevent memory leak
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl)
    objectUrl = null
  }

  uploadError.value = null

  // Preview local imediato
  objectUrl = URL.createObjectURL(file)
  previewUrl.value = objectUrl

  try {
    const remoteUrl = await uploadFile(file)
    emit('update:modelValue', remoteUrl)
    
    // CRITICAL: After successful upload, revoke local object URL
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl)
      objectUrl = null
    }
  } catch (e) {
    console.error('Upload failed:', e)
    uploadError.value = e.message || 'Upload failed'
    
    // CRITICAL: Cleanup on error
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl)
      objectUrl = null
    }
    previewUrl.value = null
  }
}

const triggerSelect = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const clear = () => {
  // CRITICAL: Cleanup object URL when clearing
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl)
    objectUrl = null
  }
  
  previewUrl.value = null
  uploadError.value = null
  emit('update:modelValue', '')
  
  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// CRITICAL: Cleanup on component unmount
onUnmounted(() => {
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl)
    objectUrl = null
  }
})
</script>

<template>
  <div class="space-y-2">
    <label v-if="label" class="text-[9px] uppercase font-bold text-white/40 ml-1">{{ label }}</label>
    
    <div 
      class="relative group cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-black/40 transition-all hover:border-neon-acid/30"
      @click="!previewUrl && triggerSelect()"
    >
      <!-- Hidden Input -->
      <input 
        type="file" 
        ref="fileInput" 
        class="hidden" 
        accept="image/*" 
        @change="handleFileSelect" 
      />

      <!-- Empty State -->
      <div v-if="!previewUrl && !isUploading" class="flex flex-col items-center justify-center p-6 space-y-2">
        <UploadCloud class="w-6 h-6 text-white/20 group-hover:text-neon-acid transition-colors" />
        <span class="text-[9px] uppercase font-bold text-white/40 tracking-widest">Transmit to NΞØ Cloud</span>
        <span v-if="uploadError" class="text-[8px] text-orange-400 text-center max-w-[200px]">{{ uploadError }}</span>
      </div>

      <!-- Uploading State -->
      <div v-if="isUploading" class="flex flex-col items-center justify-center p-6 space-y-3">
        <Loader2 class="w-6 h-6 text-neon-acid animate-spin" />
        <div class="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
            class="h-full bg-neon-acid transition-all duration-300"
            :style="{ width: `${uploadProgress}%` }"
          ></div>
        </div>
        <span class="text-[8px] uppercase font-mono text-neon-acid animate-pulse">Encoding Bag...</span>
      </div>

      <!-- Preview State -->
      <div v-if="previewUrl && !isUploading" class="relative aspect-video w-full">
        <img :src="previewUrl" class="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-500" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
          <div class="flex items-center gap-2">
            <FileCheck class="w-4 h-4 text-neon-acid" />
            <span class="text-[9px] font-mono text-white/80 truncate max-w-[150px]">Persisted on TON Storage</span>
          </div>
        </div>
        <button 
          @click.stop="clear"
          class="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 border border-white/10 text-white/60 hover:text-white hover:bg-red-500/20 hover:border-red-500/40 transition-all"
        >
          <X class="w-3 h-3" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.neon-text-glow {
  text-shadow: 0 0 10px rgba(214, 255, 0, 0.3);
}
</style>
