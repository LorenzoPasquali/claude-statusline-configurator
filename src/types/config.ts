export type BarStyle = 'ascii' | 'unicode' | 'minimal' | 'none';

export interface ModuleConfig {
  id: string;                    // unique identifier (e.g., 'context', 'git')
  enabled: boolean;              // active/inactive
  order: number;                 // position in statusline
  label: string;                 // text before the value (e.g., "Context", "Ctx", "")
  barStyle: BarStyle;
  barLength: number;             // size of the bar (e.g., 5, 10, 15, 20)
  showPercentage: boolean;       // show "30%"
  showAbsolute: boolean;         // show absolute value (e.g., "300k/1M" or input tokens)
  separator: string;             // separator after this module (" | ", " · ", "\n", etc.)
  customFormat: string | null;   // advanced template (null if not used)
}

export interface GlobalConfig {
  locale: 'pt' | 'en';
  encoding: 'utf-8' | 'ascii';  // fallback for limited terminals
  defaultSeparator: string;     // default separator between modules
  defaultBarStyle: BarStyle;
  defaultBarLength: number;
}
