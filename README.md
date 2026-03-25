# Claude Statusline Configurator

A visual tool to customize the statusline of [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code). 

Try it now: [https://claude-statusline-configurator.vercel.app](https://claude-statusline-configurator.vercel.app)

## How it Works

Claude Code uses a custom `statusline.py` script to define the information at the bottom of the terminal. This project provides a web interface to visually configure that script.

1. **Select Modules**: Choose from Context Window, Session Cost, Git Branch, Current Directory, and more.
2. **Customize Appearance**: Adjust colors, bar styles (ASCII, Unicode, Minimal), and custom labels.
3. **Live Preview**: See how your statusline looks in a simulated terminal environment.
4. **Install**: Copy the generated one-liner for automatic installation or follow manual steps for full control.

## Key Features

- **Module Customization**: Enable/disable and reorder modules with drag-and-drop.
- **Dynamic Colors**: Support for ANSI TrueColor for vibrant terminal segments.
- **Git Integration**: Displays current branch status (staged/modified counts).
- **Responsive UI**: A Bento-style dashboard designed for efficiency and aesthetics.

## Local Development

```bash
npm install
npm run dev
```

## Credits

Created by [Lorenzo Pasquali](https://github.com/LorenzoPasquali).
