import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GlobalConfig, ModuleConfig } from '@/types/config';

export const DEFAULT_MODULES: ModuleConfig[] = [
  { id: 'context', enabled: true, order: 0, label: 'Context', barStyle: 'ascii', barLength: 10, showPercentage: true, showAbsolute: false, separator: ' | ', customFormat: null },
  { id: 'session', enabled: true, order: 1, label: 'Session', barStyle: 'ascii', barLength: 10, showPercentage: true, showAbsolute: false, separator: ' | ', customFormat: null },
  { id: 'model', enabled: false, order: 2, label: 'Model:', barStyle: 'none', barLength: 10, showPercentage: false, showAbsolute: false, separator: ' | ', customFormat: null },
  { id: 'cost', enabled: false, order: 3, label: 'Cost:', barStyle: 'none', barLength: 10, showPercentage: false, showAbsolute: false, separator: ' | ', customFormat: null },
  { id: 'git', enabled: true, order: 4, label: 'Git:', barStyle: 'none', barLength: 10, showPercentage: false, showAbsolute: false, separator: ' | ', customFormat: null },
  { id: 'tokens', enabled: false, order: 5, label: 'Tokens:', barStyle: 'none', barLength: 10, showPercentage: false, showAbsolute: false, separator: ' | ', customFormat: null },
  { id: 'duration', enabled: false, order: 6, label: 'Time:', barStyle: 'none', barLength: 10, showPercentage: false, showAbsolute: false, separator: ' | ', customFormat: null },
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
    }
  )
);
