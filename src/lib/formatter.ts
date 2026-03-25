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

// Color map for each module in the terminal preview
export const MODULE_COLORS: Record<string, string> = {
  context: '#f59e0b',   // amber
  session: '#3b82f6',   // blue
  model: '#a78bfa',     // violet
  cost: '#34d399',      // emerald
  git: '#f472b6',       // pink
  tokens: '#38bdf8',    // sky
  duration: '#fb923c',  // orange
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

export interface StatusSegment {
  moduleId: string;
  text: string;
}

/** Returns structured segments for rendering colored previews */
export function formatSegments(config: GlobalConfig, modules: ModuleConfig[]): StatusSegment[] {
  const enabled = modules.filter(m => m.enabled).sort((a, b) => a.order - b.order);
  const segments: StatusSegment[] = [];

  for (const m of enabled) {
    const str = m.label ? m.label + ' ' : '';

    let text = '';
    if (m.id === 'context') {
      const pct = FAKE_DATA.context_window.used_percentage;
      const bar = renderBar(m, pct);
      const pctText = m.showPercentage ? ` ${pct}%` : '';
      const absText = m.showAbsolute ? ` (${FAKE_DATA.context_window.current_usage.input_tokens} tk)` : '';
      text = (str + bar + pctText + absText).trim();
    } else if (m.id === 'session') {
      const pct = FAKE_DATA.rate_limits.five_hour.used_percentage;
      const bar = renderBar(m, pct);
      const pctText = m.showPercentage ? ` ${pct}%` : '';
      text = (str + bar + pctText).trim();
    } else if (m.id === 'model') {
      text = (str + FAKE_DATA.model.display_name).trim();
    } else if (m.id === 'cost') {
      text = (str + `$${FAKE_DATA.cost.total_cost_usd.toFixed(2)}`).trim();
    } else if (m.id === 'tokens') {
      text = (str + `in:${FAKE_DATA.context_window.current_usage.input_tokens} out:${FAKE_DATA.context_window.current_usage.output_tokens}`).trim();
    } else if (m.id === 'git') {
      text = (str + `🌿 main +2 ~1`).trim();
    } else if (m.id === 'duration') {
      const durationSec = Math.floor(FAKE_DATA.cost.total_duration_ms / 1000);
      const mins = Math.floor(durationSec / 60);
      const secs = durationSec % 60;
      text = (str + `${mins}m ${secs}s`).trim();
    }

    if (text) segments.push({ moduleId: m.id, text });
  }

  return segments;
}

/** Returns the preview text for a single module (for inline preview chips) */
export function getModulePreviewText(m: ModuleConfig): string {
  const segs = formatSegments({ locale: 'en', encoding: 'utf-8', defaultSeparator: ' | ', defaultBarStyle: 'ascii', defaultBarLength: 10 }, [{ ...m, enabled: true, order: 0 }]);
  return segs[0]?.text || '';
}

/** Legacy flat string formatter (used by generator) */
export function formatStatusline(config: GlobalConfig, modules: ModuleConfig[]): string {
  return formatSegments(config, modules).map(s => s.text).join(config.defaultSeparator);
}
