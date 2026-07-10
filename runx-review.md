# Why runx is the governance layer AI agents have been missing

After spending time with [runx](https://runx.ai), I finally understand what's been missing from the AI agent ecosystem: **governed execution with verifiable receipts**.

## What runx does differently

Most agent frameworks focus on making it easy to *do* things. runx focuses on making it *safe and verifiable* to do things.

### Skills as URLs

Instead of installing skills through package managers, runx treats each skill as a URL. You import expertise as a link — the contract, package, inputs, and execution profile are all at a single address. No rebuilding by hand, no dependency hell.

### Fan-out under authority

You can fan out work across multiple agents while keeping everything under a single governance model. Every action is on the record, not just a black box that "did something."

### Receipts, not logs

Traditional agent frameworks give you logs. runx gives you **receipts** — cryptographic proof that a skill executed with specific inputs and produced specific outputs. This is the difference between "trust me" and "verify me."

## Who should care

- **Platform builders** who need to audit agent actions
- **Enterprise teams** deploying AI agents in regulated environments
- **Agent developers** who want their skills to be portable across runtimes

The project is at [github.com/runxhq/runx](https://github.com/runxhq/runx) and runs inside Claude Code, Cursor, Codex, GPT, Gemini, and Aider.

## Why this matters

As AI agents move from demo to production, the question isn't "can your agent do X?" — it's "can you prove your agent did X correctly?" runx answers that question with architecture, not promises.

---

*This is an independent take based on exploring the runx project. I'm not affiliated with the team — just impressed by the approach.*

---

*Originally posted on [lanju.bzcrl.dpdns.org](https://lanju.bzcrl.dpdns.org)*