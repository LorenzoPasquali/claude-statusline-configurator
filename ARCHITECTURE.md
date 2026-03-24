# Claude Statusline Configurator — Arquitetura

## Visão Geral

Aplicação web open source que permite aos usuários do Claude Code configurar visualmente a status line do terminal. O usuário monta sua statusline arrastando e personalizando componentes, vê um preview em tempo real de como ficará no terminal, e ao final baixa um instalador multiplataforma que configura tudo automaticamente.

**Stack**: React + Tailwind CSS + TypeScript
**Hospedagem**: Vercel
**Idiomas**: Português / Inglês (i18n)
**Licença**: MIT (open source)

---

## Fluxo do Usuário

```
┌─────────────────────────────────────────────────────┐
│  1. Acessa o site                                   │
│  2. Escolhe idioma (PT/EN)                          │
│  3. Seleciona quais módulos quer na statusline      │
│  4. Personaliza cada módulo (estilo, formato, cor)   │
│  5. Reordena via drag-and-drop                      │
│  6. Vê preview em tempo real (simulação do terminal)│
│  7. Clica "Download Installer"                      │
│  8. Recebe executável multiplataforma               │
│  9. Roda o executável → configuração automática     │
└─────────────────────────────────────────────────────┘
```

---

## Módulos Configuráveis

Cada módulo é uma peça independente que o usuário pode ativar/desativar e personalizar.

| Módulo | Dados (do JSON stdin) | Exemplo de output |
|---|---|---|
| **Context Window** | `context_window.used_percentage`, `context_window.context_window_size` | `Context [###-------] 30%` |
| **Session (Rate Limit)** | `rate_limits.five_hour.used_percentage`, `rate_limits.five_hour.resets_at` | `Session [##--------] 20% resets 2h57m` |
| **Model** | `model.display_name` | `Opus 4.6` |
| **Cost** | `cost.total_cost_usd` | `$1.23` |
| **Tokens** | `context_window.current_usage.input_tokens`, `.output_tokens` | `in:12,345 out:567` |
| **Git Branch** | `workspace.current_dir` (executa `git branch`) | `main` |
| **Lines Changed** | `cost.total_lines_added`, `cost.total_lines_removed` | `+156 -23` |
| **Working Directory** | `workspace.current_dir` | `~/projects/my-app` |
| **Session Duration** | `cost.total_duration_ms` | `45m12s` |
| **7-Day Usage** | `rate_limits.seven_day.used_percentage`, `.resets_at` | `7d [####------] 41%` |

---

## Opções de Personalização por Módulo

```typescript
interface ModuleConfig {
  id: string;                    // identificador único
  enabled: boolean;              // ativo/inativo
  order: number;                 // posição na statusline
  label: string;                 // texto antes do valor (ex: "Context", "Ctx", "")
  barStyle: 'ascii' | 'unicode' | 'minimal' | 'none';
  // ascii:    [###-------]
  // unicode:  [▓▓▓░░░░░░░]
  // minimal:  ███░░░
  // none:     só o número
  barLength: number;             // tamanho da barra (5, 10, 15, 20)
  showPercentage: boolean;       // mostrar "30%"
  showAbsolute: boolean;         // mostrar valor absoluto (ex: "300k/1M")
  separator: string;             // separador depois deste módulo (" | ", " · ", " ", etc.)
  customFormat: string | null;   // template avançado (ex: "{label} {bar} {pct}%")
}
```

### Opções Globais

```typescript
interface GlobalConfig {
  locale: 'pt' | 'en';
  encoding: 'utf-8' | 'ascii';  // fallback pra terminais limitados
  defaultSeparator: string;      // separador padrão entre módulos
  defaultBarStyle: 'ascii' | 'unicode' | 'minimal';
  defaultBarLength: number;
}
```

---

## Arquitetura do Frontend (React)

```
src/
├── app/
│   ├── layout.tsx                  # Layout raiz com providers
│   ├── page.tsx                    # Página principal
│   └── globals.css                 # Estilos globais + Tailwind
│
├── components/
│   ├── Header/
│   │   └── Header.tsx              # Logo, seletor de idioma, GitHub link
│   │
│   ├── ModuleSelector/
│   │   ├── ModuleSelector.tsx      # Painel de seleção de módulos
│   │   ├── ModuleCard.tsx          # Card de cada módulo (toggle + config)
│   │   └── ModuleSettings.tsx      # Popup/drawer de configuração do módulo
│   │
│   ├── Preview/
│   │   ├── TerminalPreview.tsx     # Container do terminal simulado
│   │   ├── StatuslineRenderer.tsx  # Renderiza a statusline com dados fake
│   │   └── FakeTerminal.tsx        # UI do terminal (prompt, texto, etc.)
│   │
│   ├── DragDrop/
│   │   └── SortableModuleList.tsx  # Reordenação via drag-and-drop
│   │
│   ├── GlobalSettings/
│   │   └── GlobalSettings.tsx      # Configurações globais (encoding, separador)
│   │
│   ├── Install/
│   │   ├── InstallPanel.tsx        # Painel com 3 métodos de instalação
│   │   ├── CurlCommand.tsx         # Comando curl com botão copiar
│   │   └── DownloadButton.tsx      # Fallback: download do install.py
│   │
│   └── ui/                         # Componentes base (shadcn/ui)
│       ├── Button.tsx
│       ├── Switch.tsx
│       ├── Select.tsx
│       ├── Slider.tsx
│       └── ...
│
├── hooks/
│   ├── useConfig.ts                # Estado global da configuração
│   ├── usePreview.ts               # Gera output da statusline em tempo real
│   └── useI18n.ts                  # Internacionalização
│
├── lib/
│   ├── modules.ts                  # Definição dos módulos disponíveis
│   ├── generator.ts                # Gera o código Python da statusline
│   ├── installer-generator.ts      # Gera o script instalador (para curl e download)
│   ├── i18n/
│   │   ├── pt.ts                   # Traduções português
│   │   └── en.ts                   # Traduções inglês
│   └── constants.ts                # Dados fake para preview, defaults
│
└── types/
    └── config.ts                   # Tipos TypeScript compartilhados
```

### Bibliotecas Principais

| Lib | Uso |
|---|---|
| `next` | Framework React (App Router) |
| `tailwindcss` | Estilização |
| `shadcn/ui` | Componentes base |
| `@dnd-kit/core` | Drag-and-drop para reordenar módulos |
| `zustand` | Estado global da configuração |
| `next-intl` ou custom | i18n (PT/EN) |

---

## Preview do Terminal

O componente `TerminalPreview` simula um terminal real com:

- Fundo escuro com bordas arredondadas
- Botões de fechar/minimizar/maximizar (estilo macOS)
- Prompt simulado: `~/my-project $ ▊`
- **Statusline** abaixo do prompt, renderizada em tempo real com dados fake
- Dados fake variam suavemente (animação) para dar sensação de uso real

### Dados Fake para Preview

```typescript
const FAKE_DATA = {
  model: { display_name: "Opus 4.6" },
  context_window: {
    used_percentage: 32,
    context_window_size: 1_000_000,
    current_usage: {
      input_tokens: 45_230,
      output_tokens: 12_456,
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
    total_duration_ms: 2_712_000,
    total_lines_added: 156,
    total_lines_removed: 23
  },
  workspace: {
    current_dir: "~/projects/my-app"
  }
};
```

---

## Instalação — Um Único Comando

O objetivo é que o usuário execute **uma única linha no terminal** e tudo seja configurado automaticamente, sem baixar arquivos manualmente.

### Fluxo

```
┌─ SITE ──────────────────────────────────────────────────┐
│  Usuário configura a statusline visualmente             │
│  Clica "Gerar Comando"                                  │
│  Site codifica a config em base64 na URL                │
│  Exibe o comando pronto para copiar:                    │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ curl -sL https://csc.vercel.app/i/eyJtIjpbImN... | python3 -│ │
│  │                                        [Copiar]    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Windows? Use:                                           │
│  curl -sL https://csc.vercel.app/i/eyJtIjpbImN... | python -    │
└──────────────────────────────────────────────────────────┘

         │
         ▼

┌─ TERMINAL DO USUÁRIO ───────────────────────────────────┐
│  $ curl -sL https://csc.vercel.app/i/eyJtIjpbImN... | python3 - │
│                                                          │
│  Claude Statusline Configurator                          │
│  ──────────────────────────────                          │
│  [OK] Detectado: macOS                                   │
│  [OK] Pasta .claude encontrada                           │
│  [OK] statusline.py instalado                            │
│  [OK] settings.json atualizado                           │
│                                                          │
│  Pronto! Reinicie o Claude Code para ver sua statusline. │
│                                                          │
│  Sua config: Context [###-------] 30% | Session 18%      │
└──────────────────────────────────────────────────────────┘
```

### Backend — API Route (`/api/install/[config]`)

A configuração é codificada em **base64 na própria URL**. Sem banco de dados, sem infraestrutura extra.

#### Como funciona

1. O site serializa a config em JSON compacto
2. Codifica em base64 URL-safe
3. Monta a URL: `csc.vercel.app/i/<base64>`
4. A API decodifica e gera o script Python na hora

#### Exemplo

Config JSON (~200 bytes):
```json
{"m":["context","session"],"g":{"sep":" | ","bar":"ascii","len":10},"c":{"context":{"label":"Context"},"session":{"label":"Session"}}}
```

Base64 URL-safe (~270 chars):
```
csc.vercel.app/i/eyJtIjpbImNvbnRleHQiLCJzZXNzaW9uIl0sImciOnsic2VwIjoiIHwgIi...
```

Tamanho final do comando curl: **~310 caracteres** — bem dentro do limite de qualquer terminal.

#### Estrutura da API

```
src/app/api/
└── install/
    └── [config]/
        └── route.ts      # GET: decodifica base64, gera script Python
```

**GET `/api/install/[config]`** — Retorna o script instalador

```typescript
import { NextRequest } from "next/server";
import { generateInstallerScript } from "@/lib/installer-generator";

export async function GET(
  req: NextRequest,
  { params }: { params: { config: string } }
) {
  try {
    // Decodifica base64 URL-safe → JSON → objeto
    const json = Buffer.from(params.config, "base64url").toString("utf-8");
    const config = JSON.parse(json);

    const script = generateInstallerScript(config);

    return new Response(script, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Invalid config", { status: 400 });
  }
}
```

#### Vantagens

- **Zero infraestrutura** — Sem banco de dados, sem Redis, sem storage
- **Zero custo** — Só o plano gratuito da Vercel
- **Links eternos** — A config está na URL, nunca expira
- **Cache agressivo** — Mesma URL = mesmo script, cache immutable
- **Auditável** — Usuário pode decodificar o base64 e ver a config

### Script Instalador Gerado (Python)

O endpoint retorna um script Python auto-contido que:

1. Detecta o OS (Windows/macOS/Linux)
2. Encontra a pasta `~/.claude/`
3. Escreve o `statusline.py` (código embutido no script)
4. Lê o `settings.json` existente (preserva outras configs)
5. Adiciona/atualiza a chave `statusLine` com o comando correto por OS
6. Mostra preview do resultado

```python
#!/usr/bin/env python3
"""
Claude Statusline Configurator — Installer
Config: base64url-encoded
Generated: 2026-03-24T14:30:00Z
Site: https://csc.vercel.app
"""
import os, sys, json, platform, textwrap

STATUSLINE_CODE = textwrap.dedent("""\
    import sys, json, time
    sys.stdout.reconfigure(encoding="utf-8")
    data = json.load(sys.stdin)
    parts = []

    # --- módulos gerados dinamicamente ---

    print(" | ".join(parts))
""")

def main():
    print()
    print("  Claude Statusline Configurator")
    print("  " + "─" * 34)
    print()

    # 1. Detectar OS e home
    system = platform.system()
    home = os.path.expanduser("~")

    # Windows: expanduser pode retornar caminho errado em alguns setups
    if system == "Windows":
        home = os.environ.get("USERPROFILE", home)

    claude_dir = os.path.join(home, ".claude")
    os_name = {"Windows": "Windows", "Darwin": "macOS", "Linux": "Linux"}.get(system, system)
    print(f"  [OK] Detectado: {os_name}")

    # 2. Verificar pasta .claude
    if not os.path.isdir(claude_dir):
        print(f"  [!!] Pasta .claude nao encontrada em {home}")
        print(f"       Instale o Claude Code primeiro: npm install -g @anthropic-ai/claude-code")
        sys.exit(1)
    print(f"  [OK] Pasta .claude encontrada")

    # 3. Escrever statusline.py
    statusline_path = os.path.join(claude_dir, "statusline.py")
    with open(statusline_path, "w", encoding="utf-8") as f:
        f.write(STATUSLINE_CODE)
    print(f"  [OK] statusline.py instalado")

    # 4. Atualizar settings.json (preservando configs existentes)
    settings_path = os.path.join(claude_dir, "settings.json")
    settings = {}
    if os.path.isfile(settings_path):
        with open(settings_path, "r", encoding="utf-8") as f:
            try:
                settings = json.load(f)
            except json.JSONDecodeError:
                settings = {}

    # Comando adaptado por OS
    if system == "Windows":
        cmd = 'python "$USERPROFILE/.claude/statusline.py"'
    else:
        cmd = 'python3 ~/.claude/statusline.py'

    settings["statusLine"] = {"type": "command", "command": cmd}

    with open(settings_path, "w", encoding="utf-8") as f:
        json.dump(settings, f, indent=2, ensure_ascii=False)
    print(f"  [OK] settings.json atualizado")

    # 5. Preview
    print()
    print("  Pronto! Reinicie o Claude Code para ver sua statusline.")
    print()
    print("  Preview:")
    print("  Context [###-------] 30% | Session [##--------] 18% resets 2h57m")
    print()

if __name__ == "__main__":
    main()
```

### Por que curl + Python?

| | curl + Python | .exe nativo | Shell script |
|---|---|---|---|
| **Multiplataforma** | Win/Mac/Linux | Precisa 3 builds | Mac/Linux only |
| **Dependências** | Python (já necessário para statusline) | Nenhuma | bash |
| **Transparência** | Código legível | Binário opaco | Código legível |
| **Antivírus** | Sem problemas | Frequentes alertas | Sem problemas |
| **Tamanho** | ~3KB | ~10MB+ | ~3KB |
| **curl disponível** | Win10+, Mac, Linux | N/A | N/A |

### Métodos de Instalação

O site oferece 2 opções via tabs:

```
┌─ INSTALL ──────────────────────────────────────────────────────┐
│                                                                 │
│  [ Automático ]  [ Manual ]                                    │
│                                                                 │
│ ─── Tab: Automático ─────────────────────────────────────────  │
│                                                                 │
│  Requisitos: Python 3.7+ e curl                                │
│                                                                 │
│  Cole no terminal:                                             │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  Mac/Linux:                                                │ │
│  │  curl -sL csc.vercel.app/i/eyJtIjpbImN... | python3 -             │ │
│  │                                                            │ │
│  │  Windows:                                                  │ │
│  │  curl -sL csc.vercel.app/i/eyJtIjpbImN... | python -              │ │
│  │                                                 [Copiar]  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ⓘ Quer ver o que será executado? Abra a URL no navegador     │
│    para inspecionar o script antes de rodar.                   │
│                                                                 │
│ ─── Tab: Manual ─────────────────────────────────────────────  │
│                                                                 │
│  Requisitos: Python 3.7+                                       │
│                                                                 │
│  Passo 1 — Salve o arquivo statusline.py                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  import sys, json, time                                    │ │
│  │  sys.stdout.reconfigure(encoding="utf-8")                  │ │
│  │  data = json.load(sys.stdin)                               │ │
│  │  ...                                              [Copiar] │ │
│  └───────────────────────────────────────────────────────────┘ │
│  Salve em: ~/.claude/statusline.py                             │
│                                                                 │
│  Passo 2 — Adicione ao settings.json                          │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  "statusLine": {                                           │ │
│  │    "type": "command",                                      │ │
│  │    "command": "python3 ~/.claude/statusline.py"            │ │
│  │  }                                                [Copiar] │ │
│  └───────────────────────────────────────────────────────────┘ │
│  Adicione ao arquivo: ~/.claude/settings.json                  │
│  Windows: troque python3 por python e ~ por %USERPROFILE%     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Segurança do curl | python

O padrão `curl | python` executa código remoto. Para mitigar riscos:

1. **Transparência** — O link da URL pode ser aberto no navegador para inspecionar o script antes de rodar. O site exibe uma nota incentivando o usuário a fazer isso.
2. **HTTPS** — Toda comunicação é criptografada.
3. **Código aberto** — O repositório é público; o endpoint da API e o gerador de scripts podem ser auditados por qualquer pessoa.
4. **Escopo limitado** — O script só escreve em `~/.claude/statusline.py` e `~/.claude/settings.json`. Não executa nada além disso.
5. **Tab Manual** — Oferecida como alternativa para quem prefere não executar código remoto.

---

## Internacionalização (i18n)

### Estrutura

```typescript
// lib/i18n/pt.ts
export const pt = {
  title: "Claude Statusline Configurator",
  subtitle: "Configure visualmente a barra de status do seu Claude Code",
  modules: {
    context: { name: "Janela de Contexto", description: "Uso atual da janela de contexto" },
    session: { name: "Sessão", description: "Uso do rate limit e tempo para reset" },
    model: { name: "Modelo", description: "Nome do modelo em uso" },
    cost: { name: "Custo", description: "Custo acumulado da sessão em USD" },
    tokens: { name: "Tokens", description: "Tokens de input e output" },
    git: { name: "Git Branch", description: "Branch atual do repositório" },
    lines: { name: "Linhas Alteradas", description: "Linhas adicionadas e removidas" },
    workdir: { name: "Diretório", description: "Diretório de trabalho atual" },
    duration: { name: "Duração", description: "Tempo desde o início da sessão" },
    sevenDay: { name: "Uso 7 Dias", description: "Rate limit da janela de 7 dias" },
  },
  settings: {
    barStyle: "Estilo da Barra",
    barLength: "Tamanho da Barra",
    separator: "Separador",
    encoding: "Encoding",
    // ...
  },
  install: {
    title: "Instalar",
    tabAuto: "Automatico",
    tabManual: "Manual",
    requirements: "Requisitos",
    curlLabel: "Cole no terminal:",
    inspectHint: "Abra a URL no navegador para ver o script antes de rodar",
    manualStep1: "Passo 1 — Salve o arquivo statusline.py",
    manualStep1Path: "Salve em: ~/.claude/statusline.py",
    manualStep2: "Passo 2 — Adicione ao settings.json",
    manualStep2Path: "Adicione ao arquivo: ~/.claude/settings.json",
    manualWindowsNote: "Windows: troque python3 por python e ~ por %USERPROFILE%",
    copied: "Copiado!",
  },
  // ...
};
```

### Detecção de Idioma

1. Parâmetro na URL: `?lang=pt`
2. `navigator.language`
3. Fallback: `en`

---

## Layout da Página

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER: Logo | "Claude Statusline Configurator" | PT/EN | ★ GitHub  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─ TERMINAL PREVIEW ─────────────────────────────────────┐ │
│  │  ● ○ ○  Terminal                                       │ │
│  │                                                         │ │
│  │  ~/my-project $                                         │ │
│  │                                                         │ │
│  │  Context [###-------] 30% | Session [##--------] 18%   │ │
│  │                                          resets 2h57m   │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─ MODULES ──────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │  ☰ ☑ Context Window        [Configurar]                │ │
│  │  ☰ ☑ Session (Rate Limit)  [Configurar]                │ │
│  │  ☰ ☐ Model                 [Configurar]                │ │
│  │  ☰ ☐ Cost                  [Configurar]                │ │
│  │  ☰ ☐ Tokens                [Configurar]                │ │
│  │  ☰ ☑ Git Branch            [Configurar]                │ │
│  │  ☰ ☐ Lines Changed         [Configurar]                │ │
│  │  ☰ ☐ Working Directory     [Configurar]                │ │
│  │  ☰ ☐ Session Duration      [Configurar]                │ │
│  │  ☰ ☐ 7-Day Usage           [Configurar]                │ │
│  │                                                         │ │
│  │  ☰ = drag handle  ☑/☐ = toggle                        │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─ GLOBAL SETTINGS ─────────────────────────────────────┐  │
│  │  Encoding: [UTF-8 ▼]    Separador: [ | ]              │  │
│  │  Estilo padrão: [ASCII ▼]  Tamanho barra: [10]        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ INSTALL ─────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │  [ Automático ]  [ Manual ]                           │  │
│  │                                                        │  │
│  │  Cole no terminal:                                    │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │ curl -sL csc.vercel.app/i/eyJtIjpbImN... | python3 -    │ │  │
│  │  │                                      [Copiar]   │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  │  ⓘ Abra a URL no navegador para ver o script antes   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  FOOTER: MIT License | GitHub | Made for Claude Code         │
└──────────────────────────────────────────────────────────────┘
```

---

## Gerador de Código Python (`generator.ts`)

O gerador constrói o `statusline.py` modularmente:

```typescript
function generateStatuslinePy(config: GlobalConfig, modules: ModuleConfig[]): string {
  const enabledModules = modules
    .filter(m => m.enabled)
    .sort((a, b) => a.order - b.order);

  const imports = new Set(["sys", "json"]);
  const blocks: string[] = [];

  for (const mod of enabledModules) {
    const generator = MODULE_GENERATORS[mod.id];
    const result = generator(mod, config);
    result.imports.forEach(i => imports.add(i));
    blocks.push(result.code);
  }

  return `
import ${[...imports].join(", ")}

sys.stdout.reconfigure(encoding="${config.encoding}")

data = json.load(sys.stdin)
parts = []

${blocks.join("\n\n")}

print("${config.defaultSeparator}".join(parts))
`.trim();
}
```

Cada módulo tem seu gerador que retorna o bloco Python:

```typescript
const MODULE_GENERATORS: Record<string, ModuleGenerator> = {
  context: (mod, global) => ({
    imports: [],
    code: `
# Context Window
cw = data.get("context_window", {})
ctx_pct = int(cw.get("used_percentage") or 0)
${generateBarCode(mod)}
parts.append(f"${mod.label} {bar_str} {ctx_pct}%")
`.trim()
  }),
  // ... demais módulos
};
```

---

## Requisitos Técnicos

### Frontend
- Node.js 18+
- Next.js 14+ (App Router)
- React 18+
- TypeScript 5+
- Tailwind CSS 3+
- shadcn/ui

### Deploy
- Vercel (auto-deploy via GitHub)
- Domínio customizado (opcional)

### Compatibilidade do Instalador
- Python 3.7+ (mesmo requisito do Claude Code)
- Windows 10/11
- macOS 12+
- Linux (distros mainstream)

---

## Roadmap Futuro

### v1.0 — MVP
- [ ] Módulos básicos (Context, Session, Model, Cost, Tokens)
- [ ] Preview em tempo real
- [ ] Tab Automático: instalação via curl (config em base64 na URL)
- [ ] Tab Manual: copiar arquivos com instruções visuais
- [ ] i18n PT/EN
- [ ] Responsivo mobile

### v1.1
- [ ] Módulos avançados (Git, Lines, Duration, Workdir)
- [ ] Temas predefinidos ("Minimal", "Full", "Developer")
- [ ] Compartilhar config via URL (query params)

### v1.2
- [ ] Galeria de statuslines da comunidade
- [ ] Import/export de configurações
- [ ] Dark/light mode no site

### v2.0
- [ ] Editor de template avançado (syntax highlighting)
- [ ] Módulos customizados (o usuário escreve seu próprio bloco)
- [ ] Integração com GitHub Actions para auto-update
