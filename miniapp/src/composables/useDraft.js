import { watch } from 'vue'

const STORAGE_KEY = 'neo-smart-mint-draft'
const MAX_STORAGE_SIZE = 50000 // 50KB max

const defaultForm = () => ({
  name: '',
  symbol: '',
  description: '',
  image: '',
  decimals: 9,
})

// CRITICAL: Sanitizar strings para prevenir XSS via localStorage
function sanitizeString(str, maxLength = 1000) {
  if (typeof str !== 'string') return '';
  
  // Remover caracteres potencialmente perigosos
  const cleaned = str
    .replace(/[<>]/g, '') // Remove < e > para prevenir tags HTML
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers como onclick=
    .trim();
  
  return cleaned.slice(0, maxLength);
}

function validateNumber(value, min, max, defaultValue) {
  const num = parseInt(value);
  if (isNaN(num) || num < min || num > max) return defaultValue;
  return num;
}

export function useDraft() {
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return defaultForm()
      
      // CRITICAL: Validar tamanho antes de parse
      if (raw.length > MAX_STORAGE_SIZE) {
        console.warn('Draft data too large, clearing');
        localStorage.removeItem(STORAGE_KEY);
        return defaultForm();
      }
      
      const parsed = JSON.parse(raw)
      
      // CRITICAL: Sanitizar e validar todos os campos
      return {
        name: sanitizeString(parsed.name, 100),
        symbol: sanitizeString(parsed.symbol, 20),
        description: sanitizeString(parsed.description, 500),
        image: sanitizeString(parsed.image, 2000),
        decimals: validateNumber(parsed.decimals, 0, 18, 9),
      }
    } catch (err) {
      console.warn('Failed to load draft:', err);
      return defaultForm()
    }
  }

  function save(form) {
    try {
      const data = JSON.stringify({
        name: sanitizeString(form.name, 100),
        symbol: sanitizeString(form.symbol, 20),
        description: sanitizeString(form.description, 500),
        image: sanitizeString(form.image, 2000),
        decimals: validateNumber(form.decimals, 0, 18, 9),
      });
      
      // CRITICAL: Validar tamanho antes de salvar
      if (data.length > MAX_STORAGE_SIZE) {
        console.warn('Draft data too large to save');
        return;
      }
      
      localStorage.setItem(STORAGE_KEY, data);
    } catch (err) {
      console.error('Failed to save draft:', err);
    }
  }

  function clear() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (_) {}
  }

  function watchAndPersist(getter) {
    let tid = null
    watch(
      getter,
      (val) => {
        if (tid) clearTimeout(tid)
        tid = setTimeout(() => {
          if (val) save(val)
          tid = null
        }, 500)
      },
      { deep: true }
    )
  }

  return { load, save, clear, watchAndPersist, defaultForm }
}
