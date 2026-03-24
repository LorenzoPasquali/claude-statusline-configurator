import { GlobalConfig, ModuleConfig } from '@/types/config';

export const FAKE_DATA = {
  model: { display_name: "Opus 4.6" },
  context_window: {
    used_percentage: 32,
    context_window_size: 1_000_000,
    current_usage: {
      input_tokens: 45230,
      output_tokens: 12456,
    }
  },
  rate_limits: {
    five_hour: {
      used_percentage: 18,
      resets_at: Math.floor(Date.now() / 1000) + 10620
    }
  },
  cost: {
    total_cost_usd: 0.87,
    total_duration_ms: 2712000,
    total_lines_added: 156,
    total_lines_removed: 23
  },
  workspace: {
    current_dir: "~/projects/my-app"
  }
};

const renderBar = (mod: ModuleConfig, pct: number) => {
  if (mod.barStyle === 'none') return '';
  const w = mod.barLength || 10;
  const filled = Math.floor(pct * w / 100);
  const empty = w - filled;
  if (mod.barStyle === 'ascii') return `[${'#'.repeat(filled)}${'-'.repeat(empty)}]`;
  if (mod.barStyle === 'unicode') return `[${'▓'.repeat(filled)}${'░'.repeat(empty)}]`;
  if (mod.barStyle === 'minimal') return `${'█'.repeat(filled)}${'░'.repeat(empty)}`;
  return '';
};

export function formatStatusline(config: GlobalConfig, modules: ModuleConfig[]): string {
  const enabled = modules.filter(m => m.enabled).sort((a,b) => a.order - b.order);
  const parts: string[] = [];

  for (const m of enabled) {
    const str = m.label ? m.label + ' ' : '';
    
    if (m.id === 'context') {
      const pct = FAKE_DATA.context_window.used_percentage;
      const bar = renderBar(m, pct);
      const pctText = m.showPercentage ? ` ${pct}%` : '';
      const absText = m.showAbsolute ? ` (${FAKE_DATA.context_window.current_usage.input_tokens} tk)` : '';
      parts.push((str + bar + pctText + absText).trim());
    } else if (m.id === 'session') {
      const pct = FAKE_DATA.rate_limits.five_hour.used_percentage;
      const bar = renderBar(m, pct);
      const pctText = m.showPercentage ? ` ${pct}%` : '';
      parts.push((str + bar + pctText).trim());
    } else if (m.id === 'model') {
      parts.push((str + FAKE_DATA.model.display_name).trim());
    } else if (m.id === 'cost') {
      parts.push((str + `$${FAKE_DATA.cost.total_cost_usd.toFixed(2)}`).trim());
    } else if (m.id === 'tokens') {
      parts.push((str + `in:${FAKE_DATA.context_window.current_usage.input_tokens} out:${FAKE_DATA.context_window.current_usage.output_tokens}`).trim());
    } else if (m.id === 'git') {
      const branch = "main";
      const staged = "+2";
      const mod = "~1";
      // We use html element or styled text for colors, but for raw string we just output Unicode
      parts.push((str + `🌿 ${branch} ${staged} ${mod}`).trim());
    } else if (m.id === 'duration') {
      const durationSec = Math.floor(FAKE_DATA.cost.total_duration_ms / 1000);
      const mins = Math.floor(durationSec / 60);
      const secs = durationSec % 60;
      parts.push((str + `${mins}m ${secs}s`).trim());
    }
  }
  
  return parts.filter(Boolean).join(config.defaultSeparator);
}
