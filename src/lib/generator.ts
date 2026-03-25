import { GlobalConfig, ModuleConfig } from '@/types/config';

type ModuleGenerator = (mod: ModuleConfig, config: GlobalConfig) => { imports: string[], code: string };

const generateBarCode = (mod: ModuleConfig, pctVar: string) => {
  if (mod.barStyle === 'none') return 'bar_str = ""';
  
  const width = mod.barLength || 10;
  
  if (mod.barStyle === 'ascii') {
    return `filled = int(${pctVar} * ${width} / 100) if ${pctVar} else 0\nempty = ${width} - filled\nbar_str = f"[{'#' * filled}{'-' * empty}]"`;
  }
  
  if (mod.barStyle === 'unicode') {
    return `filled = int(${pctVar} * ${width} / 100) if ${pctVar} else 0\nempty = ${width} - filled\nbar_str = f"[{'▓' * filled}{'░' * empty}]"`;
  }

  if (mod.barStyle === 'minimal') {
    return `filled = int(${pctVar} * ${width} / 100) if ${pctVar} else 0\nempty = ${width} - filled\nbar_str = f"{'█' * filled}{'░' * empty}"`;
  }

  return 'bar_str = ""';
};

const indent = (str: string, spaces: number) => 
  str.split('\n').map(line => ' '.repeat(spaces) + line).join('\n');

const MODULE_GENERATORS: Record<string, ModuleGenerator> = {
  context: (mod) => ({
    imports: [],
    code: `
# Context Window
cw = data.get("context_window", {})
ctx_pct = cw.get("used_percentage")
if ctx_pct is None:
    ctx_pct = 0
${generateBarCode(mod, 'ctx_pct')}
pct_text = f" {int(ctx_pct)}%" if ${mod.showPercentage ? 'True' : 'False'} else ""
abs_text = f" ({cw.get('current_usage', {}).get('input_tokens', 0)} tk)" if ${mod.showAbsolute ? 'True' : 'False'} else ""
parts.append(f"${mod.label} {bar_str}{pct_text}{abs_text}".strip())
`.trim()
  }),
  session: (mod) => ({
    imports: [],
    code: `
# Session / Rate Limit
rl = data.get("rate_limits", {})
fh = rl.get("five_hour", {})
fh_pct = fh.get("used_percentage")
if fh_pct is not None:
${indent(generateBarCode(mod, 'fh_pct'), 4)}
    pct_text = f" {int(fh_pct)}%" if ${mod.showPercentage ? 'True' : 'False'} else ""
    parts.append(f"${mod.label} {bar_str}{pct_text}".strip())
`.trim()
  }),
  model: (mod) => ({
    imports: [],
    code: `
model_data = data.get("model", {})
model_name = model_data.get("display_name", model_data.get("id", "Unknown"))
parts.append(f"${mod.label} {model_name}".strip())
`.trim()
  }),
  cost: (mod) => ({
    imports: [],
    code: `
cost_data = data.get("cost", {})
cost_usd = cost_data.get("total_cost_usd", 0)
parts.append((f"${mod.label} $" + f"{cost_usd:.2f}").strip())
`.trim()
  }),
  tokens: (mod) => ({
    imports: [],
    code: `
cw = data.get("context_window", {})
ui = cw.get("current_usage", {})
if ui is None:
    ui = {}
in_tk = ui.get("input_tokens", 0)
out_tk = ui.get("output_tokens", 0)
parts.append(f"${mod.label} in:{in_tk} out:{out_tk}".strip())
`.trim()
  }),
  duration: (mod) => ({
    imports: [],
    code: `
cost_data = data.get("cost", {})
duration_ms = cost_data.get("total_duration_ms", 0)
duration_sec = duration_ms // 1000
mins = duration_sec // 60
secs = duration_sec % 60
parts.append(f"${mod.label} {mins}m {secs}s".strip())
`.trim()
  }),
  git: (mod) => ({
    imports: ['os', 'subprocess', 'time'],
    code: `
# Git status (cached)
CACHE_FILE = "/tmp/claude_statusline_git_cache"
CACHE_MAX_AGE = 5

def is_stale():
    if not os.path.exists(CACHE_FILE):
        return True
    return (time.time() - os.path.getmtime(CACHE_FILE)) > CACHE_MAX_AGE

cwd = data.get("workspace", {}).get("current_dir")
if cwd and os.path.exists(cwd):
    try:
        os.chdir(cwd)
    except Exception:
        pass

if is_stale():
    try:
        dist = subprocess.run(["git", "rev-parse", "--git-dir"], capture_output=True, text=True)
        if dist.returncode == 0:
            branch = subprocess.run(["git", "branch", "--show-current"], capture_output=True, text=True).stdout.strip()
            staged = len([x for x in subprocess.run(["git", "diff", "--cached", "--numstat"], capture_output=True, text=True).stdout.strip().split("\\n") if x])
            modified = len([x for x in subprocess.run(["git", "diff", "--numstat"], capture_output=True, text=True).stdout.strip().split("\\n") if x])
            with open(CACHE_FILE, "w") as f:
                f.write(f"{branch}|{staged}|{modified}")
        else:
            with open(CACHE_FILE, "w") as f:
                f.write("||")
    except Exception:
        pass

branch = ""
staged = 0
modified = 0
try:
    with open(CACHE_FILE, "r") as f:
        v = f.read().split("|")
        if len(v) == 3:
            branch = v[0]
            staged = int(v[1]) if v[1] else 0
            modified = int(v[2]) if v[2] else 0
except Exception:
    pass

if branch:
    GREEN = "\\033[32m"
    YELLOW = "\\033[33m"
    RESET = "\\033[0m"
    staged_str = f"{GREEN}+{staged}{RESET}" if staged > 0 else ""
    mod_str = f"{YELLOW}~{modified}{RESET}" if modified > 0 else ""
    repo_status = f" {staged_str} {mod_str}".strip()
    parts.append(f"${mod.label} 🌿 {branch} {repo_status}".strip())
`.trim()
  })
};

export function generateStatuslinePy(config: GlobalConfig, modules: ModuleConfig[]): string {
  const enabledModules = modules
    .filter(m => m.enabled)
    .sort((a, b) => a.order - b.order);

  const imports = new Set(["sys", "json", "time"]);
  const blocks: string[] = [];

  for (const mod of enabledModules) {
    const generator = MODULE_GENERATORS[mod.id];
    if (generator) {
      const result = generator(mod, config);
      result.imports.forEach(i => imports.add(i));
      blocks.push(result.code);
    }
  }

  return `import ${Array.from(imports).join(", ")}

sys.stdout.reconfigure(encoding="${config.encoding || 'utf-8'}")

data = {}
try:
    data = json.load(sys.stdin)
except Exception:
    pass

parts = []

${blocks.join("\n\n")}

# Output parts
print("${config.defaultSeparator}".join([p for p in parts if p]))
`.trim();
}
