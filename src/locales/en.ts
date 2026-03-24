export const en = {
  title: "Claude Statusline Configurator",
  subtitle: "Visually configure your Claude Code terminal status bar.",
  modules: {
    context: { name: "Context Window", description: "Current context window usage and progress bar" },
    session: { name: "Session (Rate Limit)", description: "5-hour rate limit usage and reset time" },
    model: { name: "Model", description: "Name of the model in use" },
    cost: { name: "Cost", description: "Accumulated session cost in USD" },
    tokens: { name: "Tokens", description: "Input and output tokens" },
    git: { name: "Git Branch", description: "Current git branch and modified files with color coding" },
    duration: { name: "Duration", description: "Time elapsed since session start in minutes/seconds" },
  },
  settings: {
    globalSettings: "Global Settings",
    barStyle: "Bar Style",
    barLength: "Bar Length",
    separator: "Separator",
    encoding: "Encoding",
    label: "Label",
    showPercentage: "Show Percentage",
    showAbsolute: "Show Absolute Value",
    configure: "Configure",
    enabled: "Enabled",
    styleOptions: {
      ascii: "ASCII [###---]",
      unicode: "Unicode [▓▓▓░░░]",
      minimal: "Minimal ███░░░",
      none: "None (Hide bar)",
    }
  },
  install: {
    title: "Install",
    tabAuto: "Automated Setup",
    tabManual: "Manual Setup",
    requirements: "Requirements: Python 3.7+ and curl",
    curlLabel: "Paste in your terminal:",
    inspectHint: "ⓘ Want to see what will be executed? Open the URL in your browser to inspect the script before running it.",
    manualStep1: "Step 1 — Save statusline.py",
    manualStep1Path: "Save as: ~/.claude/statusline.py",
    manualStep2: "Step 2 — Add to settings.json",
    manualStep2Path: "Add to file: ~/.claude/settings.json",
    manualWindowsNote: "Windows: Replace python3 with python and ~ with %USERPROFILE%",
    copied: "Copied!",
    copy: "Copy",
  },
  preview: {
    title: "Preview",
    terminalTitle: "Terminal"
  }
};

export type Translations = typeof en;
