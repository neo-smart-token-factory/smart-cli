// types/GameState.ts
// Type definitions for the game state management system

export interface Player {
  id: string;                    // Telegram user ID
  username: string;              // Telegram username
  joinedAt: number;              // Unix timestamp
  lastActive: number;            // Unix timestamp
}

export interface Resources {
  neoTokens: number;             // Primary currency (0-999999)
  energy: number;                // Current energy (0-maxEnergy)
  maxEnergy: number;             // Maximum energy capacity
  energyRegenRate: number;       // Energy per minute (base: 1)
  xp: number;                    // Experience points
  reputation: number;            // Reputation level (0-10)
}

export interface Progression {
  currentPhase: number;          // Active roadmap phase (1-4)
  unlockedModules: string[];     // Array of module IDs
  completedActions: string[];    // Action history
  achievementsGained: string[];  // Achievement IDs
}

export interface Wallets {
  baseAddress: string | null;
  baseConnected: boolean;
  tonAddress: string | null;
  tonConnected: boolean;
  lastConnectedAt: number;
}

export interface Deployment {
  id: string;
  tokenName: string;
  symbol: string;
  network: 'TON' | 'BASE';
  txHash: string;
  timestamp: number;
  sharedCount: number;
}

export interface Cooldowns {
  lastDeploy: number;            // Unix timestamp
  lastShare: number;             // Unix timestamp
  lastEnergyAction: number;      // Unix timestamp
}

export interface GameState {
  // Player Identity
  player: Player;

  // Core Resources
  resources: Resources;

  // Progression
  progression: Progression;

  // Wallets
  wallets: Wallets;

  // Deployments (Game History)
  deployments: Deployment[];

  // Cooldowns & Gates
  cooldowns: Cooldowns;

  // Meta
  version: string;               // Save file version
  lastSyncedAt: number;          // Last backend sync
}

// Default initial state
export const INITIAL_GAME_STATE: GameState = {
  player: {
    id: '',
    username: 'Pioneer',
    joinedAt: Date.now(),
    lastActive: Date.now(),
  },
  resources: {
    neoTokens: 0,
    energy: 100,
    maxEnergy: 100,
    energyRegenRate: 1,
    xp: 0,
    reputation: 1,
  },
  progression: {
    currentPhase: 1,
    unlockedModules: ['wallet'],
    completedActions: [],
    achievementsGained: [],
  },
  wallets: {
    baseAddress: null,
    baseConnected: false,
    tonAddress: null,
    tonConnected: false,
    lastConnectedAt: 0,
  },
  deployments: [],
  cooldowns: {
    lastDeploy: 0,
    lastShare: 0,
    lastEnergyAction: 0,
  },
  version: '1.0.0',
  lastSyncedAt: 0,
};

// Cooldown constants (in milliseconds)
export const COOLDOWNS = {
  DEPLOY: 5 * 60 * 1000,          // 5 minutes
  SHARE: 1 * 60 * 1000,           // 1 minute
  BRIDGE: 10 * 60 * 1000,         // 10 minutes
};

// Energy costs for actions
export const ENERGY_COSTS = {
  DEPLOY_TOKEN: 25,
  UPLOAD_IMAGE: 5,
  BRIDGE_TRANSFER: 50,
};

// XP rewards for actions
export const XP_REWARDS = {
  FIRST_WALLET_CONNECT: 100,
  DEPLOY_TOKEN: 500,
  SHARE_CERTIFICATE: 50,
  VIEW_ROADMAP: 25,
  DAILY_LOGIN: 25,
};

// NEO token rewards
export const NEO_REWARDS = {
  FIRST_WALLET_CONNECT: 50,
  DEPLOY_TOKEN: 200,
  DAILY_LOGIN: 50,
  IDLE_PER_HOUR: 10,
  MAX_IDLE_REWARD: 100,
};

// Level unlock requirements
export const LEVEL_UNLOCKS = {
  1: ['factory'],                 // Level 1 unlocks Factory
  3: ['bridge'],                  // Level 3 unlocks Bridge
  5: ['governance'],              // Level 5 unlocks Governance
};

// XP required per level (simple linear progression)
export const XP_PER_LEVEL = 1000;
