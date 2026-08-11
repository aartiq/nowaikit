# Skills & Branded Reports

NowAIKit can run a capability end to end from the command line, no MCP client needed. It fetches the ServiceNow data for you, hands it to an AI model, and writes the result to the terminal, a Markdown file, or a branded PDF/PPTX. This is "direct mode" (also called Apex skills): you bring your own model, NowAIKit does the ServiceNow work around it.

## Run a skill

```bash
# See the available skills
nowaikit capabilities

# Run one against a configured instance
nowaikit run scan-health -i demo2

# Write the output to a file
nowaikit run scan-health -i demo2 -o health.md
```

Common flags: `-i <instance>`, `-p <provider>`, `-m <model>`, `-t <table>`, `-s <scope>`, `-f <focus>`, `--format <md|pdf|pptx>`, `-o <file>`.

## Choose a model

You can point NowAIKit at a hosted API, a local model, or your own AI subscription.

| Provider | Flag | Key needed? |
|----------|------|-------------|
| Anthropic | `-p anthropic` | `ANTHROPIC_API_KEY` |
| OpenAI | `-p openai` | `OPENAI_API_KEY` |
| Gemini | `-p gemini` | `GEMINI_API_KEY` |
| Ollama (local) | `-p ollama` | no |
| LM Studio (local) | `-p lmstudio` | no |
| **Claude Code subscription** | `-p claude-cli` | **no** |
| **Codex subscription** | `-p codex-cli` | **no** |

### Using your own Claude Code or Codex subscription

If you already pay for Claude Code or Codex, you don't need an API key. NowAIKit shells out to the CLI you already have signed in:

```bash
nowaikit run scan-health -i demo2 -p claude-cli
nowaikit run scan-health -i demo2 -p codex-cli
```

If the binary isn't on your `PATH`, point to it with `NOWAIKIT_CLAUDE_BIN` or `NOWAIKIT_CODEX_BIN`.

For a fully on-device run (nothing leaves the machine), use `-p ollama` with a local model. That is the recommended setup for sensitive or regulated instances: ServiceNow, your laptop, and the model all stay local.

## Branded PDF and PPTX reports

Add `--format pdf` (or `pptx`) to turn a skill's output into a client-ready report. By default it carries NowAIKit branding. To white-label it, set a company name, accent colour, and logo:

```bash
nowaikit run scan-health -i demo2 -p claude-cli \
  --format pdf \
  --brand-company "Acme" \
  --brand-color "#2563EB" \
  --brand-logo ./logo.png \
  -o ./acme-scan-health.pdf
```

- `--brand-company` — name on the cover and footer.
- `--brand-color` — accent colour, any hex (with or without `#`).
- `--brand-logo` — PNG shown on the cover. Optional.

`report` is a shortcut for `run --format pdf`, so this also works:

```bash
nowaikit report scan-health -i demo2 -p claude-cli --brand-company "Acme"
```

### Branding via environment variables

Handy when the same branding applies to every run (CI, a client engagement):

```bash
export NOWAIKIT_REPORT_COMPANY="Acme"
export NOWAIKIT_REPORT_ACCENT="#2563EB"
export NOWAIKIT_REPORT_LOGO="/path/to/logo.png"
export NOWAIKIT_REPORT_FOOTER="Confidential — Acme"

nowaikit run scan-health -i demo2 -p claude-cli --format pdf -o report.pdf
```

Precedence is CLI flag, then environment variable, then the NowAIKit default. Leave everything unset and reports look exactly as before. White-labelled reports keep a small "Powered by NowAIKit" line.

## Notes

- Direct mode is a single text-in, text-out call around data NowAIKit already fetched. It is not agentic tool-calling, which is why a CLI subscription (`claude-cli` / `codex-cli`) fits cleanly here but not in the agentic chat clients.
- The instance type you pick during `nowaikit setup` (Production, Development, Demo, Test/QA) is a label for your own record keeping; it doesn't change tool behaviour.
