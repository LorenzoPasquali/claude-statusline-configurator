import { Translations } from './en';

export const pt: Translations = {
  title: "Claude Statusline Configurator",
  subtitle: "Configure visualmente a barra de status do seu Claude Code.",
  modules: {
    context: { name: "Janela de Contexto", description: "Uso atual da janela de contexto" },
    session: { name: "Sessão (Rate Limit)", description: "Uso do limite e tempo para recarga" },
    model: { name: "Modelo", description: "Nome do modelo em uso" },
    cost: { name: "Custo", description: "Custo acumulado da sessão em USD" },
    tokens: { name: "Tokens", description: "Tokens de input e output" },
    git: { name: "Git Branch", description: "Branch atual do repositório e mudanças coloridas" },
    duration: { name: "Duração", description: "Tempo desde o início da sessão" },
  },
  settings: {
    globalSettings: "Configurações Globais",
    barStyle: "Estilo da Barra",
    barLength: "Tamanho da Barra",
    separator: "Separador",
    encoding: "Encoding",
    label: "Rótulo",
    showPercentage: "Mostrar Porcentagem",
    showAbsolute: "Mostrar Valor Absoluto",
    configure: "Configurar",
    enabled: "Ativado",
    styleOptions: {
      ascii: "ASCII [###---]",
      unicode: "Unicode [▓▓▓░░░]",
      minimal: "Minimal ███░░░",
      none: "Nenhum (Apenas valor)",
    }
  },
  install: {
    title: "Instalar",
    tabAuto: "Automático",
    tabManual: "Manual",
    requirements: "Requisitos: Python 3.7+ e curl",
    curlLabel: "Cole no terminal:",
    inspectHint: "ⓘ Quer ver o que será executado? Abra a URL no navegador para inspecionar o script.",
    manualStep1: "Passo 1 — Salve o arquivo statusline.py",
    manualStep1Path: "Salve em: ~/.claude/statusline.py",
    manualStep2: "Passo 2 — Adicione ao settings.json",
    manualStep2Path: "Adicione ao arquivo: ~/.claude/settings.json",
    manualWindowsNote: "Windows: troque python3 por python e ~ por %USERPROFILE%",
    copied: "Copiado!",
    copy: "Copiar",
  },
  preview: {
    title: "Preview",
    terminalTitle: "Terminal"
  }
};
