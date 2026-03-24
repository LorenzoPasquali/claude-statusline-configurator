import { GlobalConfig, ModuleConfig } from '@/types/config';
import { generateStatuslinePy } from './generator';

export function generateInstallerScript(globalConfig: GlobalConfig, modules: ModuleConfig[]): string {
  const statuslineCode = generateStatuslinePy(globalConfig, modules);

  // We escape the triple quotes just in case, though the generated code shouldn't have them
  const safeCode = statuslineCode.replace(/"""/g, '\\"\\"\\"');

  return `#!/usr/bin/env python3
"""
Claude Statusline Configurator — Installer
Generated: ${new Date().toISOString()}
Site: https://csc.vercel.app
"""
import os, sys, json, platform, textwrap

STATUSLINE_CODE = textwrap.dedent("""\\
${safeCode.split('\\n').map(line => '    ' + line).join('\\n')}
""")

def main():
    print()
    print("  Claude Statusline Configurator")
    print("  " + "─" * 34)
    print()

    system = platform.system()
    home = os.path.expanduser("~")

    # Windows: expanduser may return incorrect path on some setups
    if system == "Windows":
        home = os.environ.get("USERPROFILE", home)

    claude_dir = os.path.join(home, ".claude")
    os_name = {"Windows": "Windows", "Darwin": "macOS", "Linux": "Linux"}.get(system, system)
    print(f"  [OK] Detected: {os_name}")

    if not os.path.isdir(claude_dir):
        print(f"  [!!] .claude folder not found in {home}")
        print(f"       Please install Claude Code first: npm install -g @anthropic-ai/claude-code")
        sys.exit(1)
    
    print(f"  [OK] .claude folder found")

    statusline_path = os.path.join(claude_dir, "statusline.py")
    with open(statusline_path, "w", encoding="utf-8") as f:
        f.write(STATUSLINE_CODE)
    
    print(f"  [OK] statusline.py installed")

    settings_path = os.path.join(claude_dir, "settings.json")
    settings = {}
    if os.path.isfile(settings_path):
        with open(settings_path, "r", encoding="utf-8") as f:
            try:
                settings = json.load(f)
            except json.JSONDecodeError:
                settings = {}

    if system == "Windows":
        cmd = 'python "$USERPROFILE/.claude/statusline.py"'
    else:
        cmd = 'python3 ~/.claude/statusline.py'

    settings["statusLine"] = {"type": "command", "command": cmd}

    with open(settings_path, "w", encoding="utf-8") as f:
        json.dump(settings, f, indent=2, ensure_ascii=False)
        
    print(f"  [OK] settings.json updated")

    print()
    print("  Done! Restart Claude Code to see your new status line.")
    print()

if __name__ == "__main__":
    main()
`;
}
