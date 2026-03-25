import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GlobalConfig, ModuleConfig } from '@/types/config';

export const DEFAULT_MODULES: ModuleConfig[] = [
  { id: 'context', enabled: true, order: 0, label: 'Context', barStyle: 'ascii', barLength: 10, showPercentage: true, showAbsolute: false, color: '#f59e0b', separator: ' | ', customFormat: null },
  { id: 'session', enabled: true, order: 1, label: 'Session', barStyle: 'ascii', barLength: 10, showPercentage: true, showAbsolute: false, showResetTime: false, color: '#3b82f6', separator: ' | ', customFormat: null },
  { id: 'model', enabled: false, order: 2, label: 'Model:', barStyle: 'none', barLength: 10, showPercentage: false, showAbsolute: false, color: '#a78bfa', separator: ' | ', customFormat: null },
  { id: 'cost', enabled: false, order: 3, label: 'Cost:', barStyle: 'none', barLength: 10, showPercentage: false, showAbsolute: false, color: '#34d399', separator: ' | ', customFormat: null },
  { id: 'git', enabled: true, order: 4, label: 'Git:', barStyle: 'none', barLength: 10, showPercentage: false, showAbsolute: false, color: '#f472b6', separator: ' | ', customFormat: null },
  { id: 'tokens', enabled: false, order: 5, label: 'Tokens:', barStyle: 'none', barLength: 10, showPercentage: false, showAbsolute: false, color: '#38bdf8', separator: ' | ', customFormat: null },
  { id: 'duration', enabled: false, order: 6, label: 'Time:', barStyle: 'none', barLength: 10, showPercentage: false, showAbsolute: false, color: '#fb923c', separator: ' | ', customFormat: null },
  { id: 'cwd', enabled: false, order: 7, label: '', barStyle: 'none', barLength: 10, showPercentage: false, showAbsolute: false, color: '#94a3b8', separator: ' | ', customFormat: null },
];

export const DEFAULT_GLOBAL: GlobalConfig = {
  locale: 'en',
  encoding: 'utf-8',
  defaultSeparator: ' | ',
  defaultBarStyle: 'ascii',
  defaultBarLength: 10,
};

interface ConfigState {
  global: GlobalConfig;
  modules: ModuleConfig[];
  setGlobal: (config: Partial<GlobalConfig>) => void;
  updateModule: (id: string, config: Partial<ModuleConfig>) => void;
  reorderModules: (newOrder: ModuleConfig[]) => void;
  reset: () => void;
}

export const useConfig = create<ConfigState>()(
  persist(
    (set) => ({
      global: DEFAULT_GLOBAL,
      modules: DEFAULT_MODULES,
      setGlobal: (newGlobal) =>
        set((state) => ({ global: { ...state.global, ...newGlobal } })),
      updateModule: (id, newConfig) =>
        set((state) => ({
          modules: state.modules.map((m) =>
            m.id === id ? { ...m, ...newConfig } : m
          ),
        })),
      reorderModules: (newModules) => set({ modules: newModules }),
      reset: () => set({ global: DEFAULT_GLOBAL, modules: DEFAULT_MODULES }),
    }),
    {
      name: 'claude-statusline-config',
      merge: (persistedState, currentState) => {
        const persisted = persistedState as ConfigState;
        if (!persisted || !persisted.modules) return currentState;

        // Merge in any new default modules that don't exist in persisted state
        const existingIds = new Set(persisted.modules.map(m => m.id));
        const newModules = DEFAULT_MODULES.filter(m => !existingIds.has(m.id));
        
        // Also ensure existing modules have the 'color' property (migration)
        const mergedModules = [...persisted.modules, ...newModules].map(m => {
          const defaults = DEFAULT_MODULES.find(d => d.id === m.id);
          return {
            ...defaults, // Start with defaults to ensure all fields exist
            ...m,        // Override with persisted values
          };
        });

        return {
          ...currentState,
          ...persisted,
          modules: mergedModules,
        };
      },
    }
  )
);
