# Issue 1: sources and changes

"AI From the Ground Up" (`src/content/posts/ai-from-the-ground-up/index.mdx`). Facts checked
**2026-10-15**. Each source below is cited as a footnote in the post.

## Sources
| Claim | Source |
|---|---|
| RLHF shaped the first assistants | Ouyang et al. 2022, https://arxiv.org/abs/2203.02155 |
| AI feedback against written principles | Bai et al. 2022, https://arxiv.org/abs/2212.08073 |
| RL on checkable tasks → reasoning models | DeepSeek-AI 2025, https://arxiv.org/abs/2501.12948 |
| 1 token ≈ 4 characters ≈ ¾ word (English) | OpenAI help centre, https://help.openai.com/en/articles/4936856 |
| Token splits and IDs in the figure | computed at build with `gpt-tokenizer` (o200k_base), `src/components/figures/TokenStrip.astro` |
| Byte-pair encoding | Sennrich, Haddow, Birch 2016, https://arxiv.org/abs/1508.07909 |
| RAG | Lewis et al. 2020, https://arxiv.org/abs/2005.11401 |
| BM25 | Robertson & Zaragoza 2009, https://doi.org/10.1561/1500000019 |
| Transformer, 2017 | Vaswani et al., https://arxiv.org/abs/1706.03762 |
| FlashAttention; PagedAttention/vLLM | Dao et al. 2022, https://arxiv.org/abs/2205.14135; Kwon et al. 2023, https://arxiv.org/abs/2309.06180 |
| Lost in the middle | Liu et al. 2023, https://arxiv.org/abs/2307.03172 |
| Accuracy drops as context grows | Hong, Troynikov, Huber (Chroma) 2025, https://research.trychroma.com/context-rot |
| Temperature 0 is not fully deterministic | He / Thinking Machines Lab 2025, https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/ |
| Chain-of-thought prompting | Wei et al. 2022, https://arxiv.org/abs/2201.11903 |
| Prompt injection is LLM01 | OWASP 2025, https://genai.owasp.org/llmrisk/llm01-prompt-injection/ |
| Indirect prompt injection | Greshake et al. 2023, https://arxiv.org/abs/2302.12173 |
| Top-p (nucleus) sampling | Holtzman et al. 2019, https://arxiv.org/abs/1904.09751 |
| LLM-as-a-judge | Zheng et al. 2023, https://arxiv.org/abs/2306.05685 |
| ReAct | Yao et al. 2022, https://arxiv.org/abs/2210.03629 |
| Start simple with agents | Anthropic 2024, https://www.anthropic.com/engineering/building-effective-agents |
| Windsurf → Devin Desktop; Devin Local shares the Devin CLI harness; Cascade is legacy | Cognition docs, https://docs.devin.ai/desktop/devin-local (checked 2026-10-15) |
| AGENTS.md, stewarded by the Agentic AI Foundation | https://agents.md |
| Agent Skills (SKILL.md) open standard | https://agentskills.io |
| MCP: tools, resources, consent; spec 2026-07-28 | https://modelcontextprotocol.io/specification/latest |
| Spec Kit and its commands | https://github.com/github/spec-kit |

## What changed from the first version, and why
- **Opening.** The one-line argument now comes first, followed by a short glossary of terms that appear
  before their own section. A cold reader needed both.
- **Structure.** Each section ends with "**In one line:** …". Optional material moved into deep-dive asides
  (margin notes on wide screens). The two overlapping lists in part 1 ("what an LLM is NOT" and
  "misconceptions") were merged. Cross-references now link to sections by name, not by number.
- **Part 1.** The training stages are explained in plain words (base model, instruction tuning, rewards).
  RLHF is updated with AI feedback and reinforcement learning on checkable answers, which produced
  reasoning models.
- **Part 2.** Corrected "unconstitutionally becomes 4–5 pieces" (it is 3 in a current tokenizer). Real
  token IDs replace the illustration. The strawberry example is now accurate: with its leading space it is
  one token, and reasoning models solve it by spelling the word out. Prompt caching and output pricing
  are explained. The language-gap claim is softened: newer tokenizers narrowed it.
- **Part 3.** Embedding models are separate from LLMs. "Close" means direction (cosine), and chunk size is
  explained.
- **Part 4.** Attention now says what the scores *do*: they blend earlier tokens' vectors. Parallel reading
  versus sequential writing, and why tokens only look backwards, are explained. The context-window deep
  dive moved to part 5 and was updated: windows of hundreds of thousands to a million or more tokens.
- **Part 5.** Added "context rot", why temperature 0 can still vary, why low temperature is consistent
  rather than correct, and that models can invent citations. Prompt injection: the model can't reliably tell
  instructions from data.
- **Part 6.** Shows what a tool call looks like (definition, structured request, harness). States that an
  agent is a harness running a model in a loop.
- **Part 7.** The harness table now lists widely used harnesses (Claude Code, Codex, Cursor, Devin) and
  notes that chat apps are harnesses too. The "three names, two harnesses" story was updated: Windsurf
  became Devin Desktop in June 2026 and Cascade is legacy. Product details moved to a footnote.
- **Part 8.** AGENTS.md and Agent Skills are now open standards. MCP servers can be local or remote.
  Spec Kit's commands are now `/speckit-*`. Commands are distinguished from skills by who starts them.
- **Figures and widgets.** All 11 diagrams were redrawn as accessible SVG. The tokenizer is now a real (toy)
  BPE trained on the blog. The temperature widget uses a real softmax and shares its numbers with the
  forward-pass figure. The agent stepper includes an approval step. All three work without JavaScript.
- **Cold-reader tests.** Five rounds, each with a fresh reader who knew nothing about LLMs: 31 findings, then 25, 29,
  one blocker (agent vs harness) and finally **no blockers**, with all six core concepts explained back correctly.
  Every finding of every round was fixed or answered in the text.
