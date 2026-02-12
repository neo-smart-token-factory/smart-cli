/**
 * ╔═══════════════════════════════════════════════════════════╗
 * ║  SMART MINT - NEØ SMART FACTORY                          ║
 * ║  Token deployment interface (Refactored)                  ║
 * ║                                                            ║
 * ║  Architecture:                                             ║
 * ║  • Presentation Layer (this file)                         ║
 * ║  • Business Logic (hooks)                                 ║
 * ║  • Data Layer (services)                                  ║
 * ╚═══════════════════════════════════════════════════════════╝
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Rocket,
  Hexagon,
  LayoutDashboard,
  Wallet,
  AlertTriangle,
  Info
} from 'lucide-react';

// Components
import NetworkSelector from './components/NetworkSelector';
import AssetPack from './components/AssetPack';
import LandingSection from './components/LandingSection';
import CustomService from './components/CustomService';
import OpsDashboard from './components/OpsDashboard';
import WalletConnect from './components/WalletConnect';
import TransactionStatus from './components/TransactionStatus';
import LogicVaultBadge from './components/ui/LogicVaultBadge';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingButton from './components/ui/LoadingButton';
import SkeletonLoader from './components/ui/SkeletonLoader';
import ProgressBar from './components/ui/ProgressBar';

// Hooks
import { useDynamicWallet } from './hooks/useDynamicWallet';
import useFeatures from './hooks/useFeatures';
import { useSchemaValidation } from './hooks/useSchemaValidation';
import { useMarketingTracking } from './hooks/useMarketingTracking';
import { useCloudSync } from './hooks/useCloudSync';
import { useDeployment } from './hooks/useDeployment';
import { useDeploymentHistory } from './hooks/useDeploymentHistory';

// Utils
import { sanitizeInput } from './utils/sanitization';
import { validateAddress, formatAddress } from './utils/addressValidation';

export default function SmartMint() {
  // ═══════════════════════════════════════════════════════════
  // FEATURES & CAPABILITIES
  // ═══════════════════════════════════════════════════════════
  const { isEnabled, phaseInfo } = useFeatures();
  const isWeb3Enabled = isEnabled('phase2', 'web3');
  const isRealTransactionsEnabled = isEnabled('phase2', 'realTransactions');
  
  // ═══════════════════════════════════════════════════════════
  // WALLET CONNECTION
  // ═══════════════════════════════════════════════════════════
  const dynamicWallet = useDynamicWallet();
  const [userAddress, setUserAddress] = useState(null);
  
  const effectiveUserAddress = isWeb3Enabled && dynamicWallet.isConnected
    ? dynamicWallet.address
    : userAddress;
  
  // ═══════════════════════════════════════════════════════════
  // UI STATE
  // ═══════════════════════════════════════════════════════════
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    tokenName: '',
    tokenSymbol: '',
    tokenSupply: '',
    network: 'base',
    description: ''
  });
  
  // ═══════════════════════════════════════════════════════════
  // BUSINESS LOGIC HOOKS
  // ═══════════════════════════════════════════════════════════
  const { validate: schemaValidate } = useSchemaValidation();
  
  const marketing = useMarketingTracking();
  
  const deployment = useDeployment(formData, effectiveUserAddress, {
    isRealTransactionsEnabled,
    signer: dynamicWallet.signer,
    onSuccess: (result) => {
      marketing.trackConversion(result);
      history.refresh();
    }
  });
  
  const history = useDeploymentHistory();
  
  // Cloud Sync (auto-save drafts)
  useCloudSync(formData, effectiveUserAddress, step === 2, {
    leadId: marketing.leadId,
    sessionId: marketing.sessionId
  });
  
  // ═══════════════════════════════════════════════════════════
  // EFFECTS: MARKETING TRACKING
  // ═══════════════════════════════════════════════════════════
  
  // Track form start (step 2)
  useEffect(() => {
    if (step === 2) {
      marketing.trackFormStart();
    }
  }, [step, marketing]);
  
  // Track form progress (debounced via service)
  useEffect(() => {
    if (step === 2 && marketing.leadId) {
      const timeoutId = setTimeout(() => {
        marketing.trackFormProgress(formData);
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [formData, step, marketing]);
  
  // Track form abandonment (beforeunload)
  useEffect(() => {
    if (step !== 2 || !marketing.sessionId || !marketing.leadId) return;
    
    const handleBeforeUnload = () => {
      marketing.trackAbandonment(formData);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [step, formData, marketing]);
  
  // ═══════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════
  
  const handleWalletConnect = async (address) => {
    if (address) {
      setUserAddress(address);
      await marketing.trackWalletConnect(address);
    }
  };
  
  const handleWalletDisconnect = () => {
    setUserAddress(null);
  };
  
  const connectWalletFallback = async () => {
    if (!isWeb3Enabled) {
      console.info('[FEATURES] Web3 not enabled in Phase 1. Using simulation mode.');
      const demoAddress = '0x' + Math.random().toString(16).slice(2, 42).padEnd(40, '0');
      setUserAddress(demoAddress);
      handleWalletConnect(demoAddress);
    }
  };
  
  const validateDeploy = () => {
    // Schema validation
    const schemaError = schemaValidate(formData);
    if (schemaError) return schemaError;
    
    // Wallet validation
    if (!effectiveUserAddress) {
      return 'Wallet connection required for protocol deployment.';
    }
    
    const addrValidation = validateAddress(effectiveUserAddress);
    if (!addrValidation.valid) {
      return `Invalid wallet: ${addrValidation.error}`;
    }
    
    return null;
  };
  
  const handleDeploy = async (e) => {
    e.preventDefault();
    
    const validationError = validateDeploy();
    if (validationError) {
      deployment.error = validationError;
      return;
    }
    
    await deployment.deploy({
      leadId: marketing.leadId,
      sessionId: marketing.sessionId
    });
  };
  
  const handleReset = () => {
    deployment.reset();
    setStep(1);
  };
  
  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  
  return (
    <ErrorBoundary
      componentName="SmartMint"
      level="critical"
      title="Erro na Aplicação"
      message="Ocorreu um erro inesperado. Por favor, recarregue a página."
      showDetails={import.meta.env.DEV}
      showReload={true}
    >
      <div className="min-h-screen selection:bg-neon-acid selection:text-obsidian">
        
        {/* Background Effects */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-acid/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-signal-cyan/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <img src="/brand/logo-main.png" alt="NEØ Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(216,242,68,0.4)]" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tighter uppercase">
              NΞØ <span className="text-neon-acid">SMART FACTORY</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden md:inline">
              Protocol Status: <span className="text-green-400">Online</span>
            </span>
            
            {isWeb3Enabled ? (
              <WalletConnect
                userAddress={effectiveUserAddress}
                setUserAddress={setUserAddress}
                onConnect={handleWalletConnect}
                onDisconnect={handleWalletDisconnect}
              />
            ) : (
              <button
                onClick={connectWalletFallback}
                disabled={deployment.loading}
                className={`btn-secondary !py-2 !px-4 !text-xs flex items-center gap-2 ${
                  effectiveUserAddress ? 'border-neon-acid/50 text-neon-acid' : ''
                }`}
              >
                <Wallet className="w-3 h-3" />
                {effectiveUserAddress
                  ? `${effectiveUserAddress.slice(0, 6)}...${effectiveUserAddress.slice(-4)}`
                  : 'Connect Wallet'}
              </button>
            )}
          </div>
        </header>
        
        {/* Main Content */}
        <main className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
          <AnimatePresence mode="wait">
            
            {/* Phase Status Badges */}
            <PhaseStatusBadges phaseInfo={phaseInfo} />
            
            {/* Transaction Status */}
            {deployment.transaction && isRealTransactionsEnabled && (
              <TransactionStatus
                {...deployment.transaction}
                onDismiss={deployment.clearTransaction}
                className="mb-6"
              />
            )}
            
            {/* Error Alert */}
            {deployment.error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm font-bold"
              >
                <AlertTriangle className="w-4 h-4" /> {deployment.error}
              </motion.div>
            )}
            
            {/* Step 1: Landing */}
            {!deployment.result && step === 1 && (
              <LandingView
                onStart={() => {
                  setStep(2);
                  marketing.trackCtaClick('Open Smart Mint');
                }}
              />
            )}
            
            {/* Step 2: Constructor */}
            {!deployment.result && step === 2 && (
              <ConstructorView
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleDeploy}
                loading={deployment.loading}
                progress={deployment.progress}
                status={deployment.status}
                sanitizeInput={sanitizeInput}
              />
            )}
            
            {/* Step 3: Result */}
            {deployment.result && (
              <ResultView
                result={deployment.result}
                formData={formData}
                onReset={handleReset}
                history={history}
              />
            )}
            
          </AnimatePresence>
        </main>
        
        {/* Footer */}
        <Footer />
        
      </div>
    </ErrorBoundary>
  );
}

// ═══════════════════════════════════════════════════════════
// SUB-COMPONENTS (Presentation Only)
// ═══════════════════════════════════════════════════════════

function PhaseStatusBadges({ phaseInfo }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 flex flex-wrap items-center gap-3"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="glass px-4 py-2 rounded-full flex items-center gap-2 border-[#D8F244]/30"
      >
        <div className="w-2 h-2 rounded-full bg-[#D8F244] animate-pulse"></div>
        <span className="text-xs font-bold text-[#D8F244] uppercase tracking-wider">
          {phaseInfo?.name}
        </span>
        <span className="text-xs text-gray-400 font-mono">
          {phaseInfo?.status}
        </span>
      </motion.div>
      
      {phaseInfo?.availableFeatures && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass px-3 py-1.5 rounded-full flex items-center gap-2 border-white/10"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
          <span className="text-xs text-gray-300 font-medium">
            {phaseInfo.availableFeatures.length} Features Ativas
          </span>
        </motion.div>
      )}
      
      {phaseInfo?.lockedFeatures?.length > 0 && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass px-3 py-1.5 rounded-full flex items-center gap-2 border-orange-500/20"
        >
          <Rocket className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-xs text-orange-300 font-medium">
            Phase 2: {phaseInfo?.estimatedRelease || 'Q1 2026'}
          </span>
        </motion.div>
      )}
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="glass p-1.5 rounded-full border-white/10 hover:border-[#D8F244]/30 transition-colors"
        title="Ver detalhes da fase atual"
      >
        <Info className="w-4 h-4 text-gray-400 hover:text-[#D8F244] transition-colors" />
      </motion.button>
    </motion.div>
  );
}

function LandingView({ onStart }) {
  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-12"
    >
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-neon-acid uppercase tracking-widest">
          <Zap className="w-3 h-3" /> Decentralized Intelligence Factory
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Deploy your <span className="text-neon-acid">Token</span> now.
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
          The most efficient Smart Contract Factory. Compile and deploy stable, liquid protocols in seconds with zero upfront fees.
        </p>
        <div className="pt-8">
          <button
            onClick={onStart}
            className="btn-primary flex items-center gap-3 mx-auto text-lg px-12 relative z-10 group"
          >
            Open Smart Mint <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      
      <LandingSection />
    </motion.div>
  );
}

function ConstructorView({
  formData,
  setFormData,
  onSubmit,
  loading,
  progress,
  status,
  sanitizeInput
}) {
  return (
    <motion.div
      key="constructor"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-12"
    >
      <form onSubmit={onSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Protocol Identification */}
          <div className="glass-card space-y-6">
            <div className="flex items-center gap-2 text-neon-acid mb-2">
              <Cpu className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Protocol Identification
              </span>
            </div>
            
            <div>
              <label htmlFor="token-name" className="neo-label">Token Identity</label>
              <input
                id="token-name"
                type="text"
                required
                autoComplete="off"
                className="neo-input w-full"
                placeholder="Ex: Neo Flow Token"
                value={formData.tokenName}
                onChange={e => setFormData({ ...formData, tokenName: sanitizeInput(e.target.value) })}
              />
            </div>
            
            <div>
              <label htmlFor="token-symbol" className="neo-label">Neural Symbol</label>
              <input
                id="token-symbol"
                type="text"
                required
                autoComplete="off"
                className="neo-input w-full uppercase"
                placeholder="Ex: FLOW"
                maxLength={6}
                value={formData.tokenSymbol}
                onChange={e => setFormData({ ...formData, tokenSymbol: sanitizeInput(e.target.value).toUpperCase() })}
              />
            </div>
            
            <div>
              <label htmlFor="token-supply" className="neo-label">Genesis Supply</label>
              <input
                id="token-supply"
                type="number"
                required
                min="1"
                className="neo-input w-full"
                placeholder="Ex: 1000000"
                value={formData.tokenSupply}
                onChange={e => setFormData({ ...formData, tokenSupply: e.target.value })}
              />
            </div>
          </div>
          
          {/* Smart Mint Config */}
          <div className="glass-card space-y-6">
            <div className="flex items-center gap-2 text-signal-cyan mb-2">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Smart Mint Config
              </span>
            </div>
            
            <div>
              <label htmlFor="mission-narrative" className="neo-label">Mission Narrative</label>
              <textarea
                id="mission-narrative"
                className="neo-input w-full min-h-[140px] resize-none"
                placeholder="Describe the neural impact and utility of this asset..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Integrated Logic</span>
                <ShieldCheck className="w-3 h-3 text-green-400" />
              </div>
              <div className="flex flex-wrap gap-2">
                {['Anti-Whale', 'Auto-Burn', 'Liquid-Lock', 'Vesting'].map(tag => (
                  <span key={tag} className="text-[9px] bg-white/5 px-2 py-1 rounded border border-white/5 text-slate-400 font-mono tracking-tighter uppercase">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Network Selector */}
        <div className="glass-card">
          <NetworkSelector
            selected={formData.network}
            onSelect={id => setFormData({ ...formData, network: id })}
          />
        </div>
        
        {/* Deploy Button */}
        <div className="flex flex-col items-center gap-4 w-full">
          {loading && (
            <div className="w-full md:w-[400px] mb-2 space-y-2">
              <div className="flex justify-between items-center text-[8px] uppercase font-bold tracking-[0.2em] text-neon-acid px-1">
                <span className="animate-pulse">{status}</span>
                <span className="font-mono">{progress}%</span>
              </div>
              <ProgressBar progress={progress} height="h-1" />
            </div>
          )}
          
          <LoadingButton
            type="submit"
            loading={loading}
            loadingText="Forging Sequence..."
            icon={ArrowRight}
            className="w-full md:w-[400px] text-lg"
          >
            Deploy Protocol
          </LoadingButton>
          
          <div className="mt-4 p-4 bg-neon-acid/5 border border-neon-acid/20 rounded-xl text-center">
            <p className="text-xs text-neon-acid font-bold uppercase tracking-wider">
              Zero Upfront Fee Policy
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              A 5% protocol fee is embedded. Only network GAS is required for genesis.
            </p>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

function ResultView({ result, formData, onReset, history }) {
  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      {/* Success Card */}
      <div className="glass-card p-10 text-center space-y-6 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-energy opacity-10 blur-3xl pointer-events-none group-hover:opacity-20 transition-opacity" />
        
        <div className="w-20 h-20 bg-neon-acid rounded-full mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(216,242,68,0.4)]">
          <ShieldCheck className="w-10 h-10 text-obsidian" />
        </div>
        
        <div className="space-y-2">
          <span className="text-neon-acid font-mono text-[10px] tracking-[0.3em] font-bold">
            GENESIS SUCCESSFUL
          </span>
          <h2 className="text-4xl font-bold">{formData.tokenName} is Deployed!</h2>
          <p className="text-slate-400 font-mono text-xs break-all border border-white/10 bg-black/40 p-2 rounded max-w-sm mx-auto">
            {result?.address}
          </p>
        </div>
        
        <div className="flex flex-col items-center gap-4 py-2">
          <LogicVaultBadge logicHash={result?.logicHash} />
          <a
            href={`/deployments/${formData.network}/${formData.tokenSymbol}-MANIFESTO.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-slate-500 hover:text-neon-acid flex items-center gap-2 uppercase font-bold tracking-widest transition-colors underline decoration-dotted"
          >
            View Sovereign Manifesto
          </a>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          <button className="bg-white/5 px-6 py-2 rounded-lg border border-white/10 flex items-center gap-2 hover:bg-white/10 transition-all text-xs font-bold uppercase">
            <LayoutDashboard className="w-4 h-4 text-slate-400" /> Explorer
          </button>
          <button className="bg-neon-acid/10 px-6 py-2 rounded-lg border border-neon-acid/20 flex items-center gap-2 hover:bg-neon-acid/20 transition-all text-xs font-bold uppercase text-neon-acid">
            <Rocket className="w-4 h-4" /> Activate Bridge
          </button>
        </div>
      </div>
      
      <AssetPack />
      <CustomService />
      
      <div className="flex justify-center border-t border-white/5 pt-10">
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-neon-acid transition-colors flex items-center gap-2 uppercase tracking-widest font-bold"
        >
          <ArrowRight className="w-3 h-3 rotate-180" /> Start New Sequence
        </button>
      </div>
      
      <div className="mt-20">
        <OpsDashboard />
      </div>
      
      {/* Deployment History */}
      <div className="mt-20 space-y-6">
        <div className="flex items-center gap-2 text-neon-acid">
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-[0.2em]">Live Protocol Feed</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={`skeleton-${i}`} className="glass-card !p-4 flex items-center justify-between border-white/5 h-[64px]">
                <div className="space-y-2">
                  <SkeletonLoader width="w-24" height="h-3" />
                  <SkeletonLoader width="w-32" height="h-2" className="opacity-50" />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <SkeletonLoader width="w-12" height="h-4" variant="circle" />
                  <SkeletonLoader width="w-16" height="h-2" />
                </div>
              </div>
            ))
          ) : history.deploys.length > 0 ? (
            history.deploys.map((deploy) => (
              <div key={deploy.id} className="glass-card !p-4 flex items-center justify-between border-white/5 hover:border-neon-acid/20 transition-all group">
                <div>
                  <p className="text-xs font-bold text-white uppercase">
                    {deploy.token_name || 'Protocol Unknown'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono tracking-tighter" title={deploy.contract_address}>
                    {formatAddress(deploy.contract_address)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] bg-neon-acid/10 text-neon-acid px-2 py-0.5 rounded-full border border-neon-acid/20 uppercase font-bold tracking-tighter">
                    {deploy.network}
                  </span>
                  <p className="text-[8px] text-slate-600 mt-1 uppercase font-bold group-hover:text-neon-acid/60 transition-colors">
                    Verified Node
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
              <p className="text-[10px] text-slate-600 uppercase font-bold tracking-[0.3em]">
                Awaiting Uplink Sequences...
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6 bg-black/20">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Hexagon className="w-4 h-4 text-neon-acid" />
            <span className="text-[10px] font-bold tracking-widest uppercase">
              NEØ PROTOCOL — EST. 2025
            </span>
          </div>
          
          <div className="flex gap-10">
            {[
              { label: 'Organization', href: 'https://github.com/neo-smart-token-factory' },
              { label: 'Governance', href: 'https://github.com/neo-smart-token-factory/smart-ui/blob/main/docs/ARCHITECTURAL_ADDENDUMS.md' },
              { label: 'Technical ADRs', href: 'https://github.com/neo-smart-token-factory/smart-ui/blob/main/docs/adr' },
              { label: 'Documentation', href: 'https://github.com/neo-smart-token-factory/smart-ui/blob/main/docs/PROJECT_OVERVIEW.md' }
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase font-bold text-slate-500 hover:text-neon-acid transition-colors tracking-widest"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-6 text-center">
          <p className="text-[9px] text-slate-600 uppercase tracking-wider font-mono">
            Open Source Infrastructure · Institutional Responsibility · Active Governance
          </p>
          <p className="text-[8px] text-slate-700 mt-2 max-w-2xl mx-auto">
            Built with deliberate security architecture. All decisions documented in ADRs.
            Governed by{' '}
            <a
              href="https://github.com/neo-smart-token-factory"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-acid/60 hover:text-neon-acid transition-colors"
            >
              neo-smart-token-factory
            </a>{' '}
            organization.
          </p>
        </div>
      </div>
    </footer>
  );
}
