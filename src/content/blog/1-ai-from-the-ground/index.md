---
title: "AI From the Ground Up: LLMs, Agents, Harnesses and the Tooling Around Them"
date: 2026-10-15
author: "Daniel Baumann"
summary: "A guided tour from what an LLM actually is to the agents and tooling people use to get real work done with AI—no math required."
tags: ["ai", "llm", "agents", "machine-learning", "engineering"]
category: "technical"
language: "en"
draft: false
readingTime: 20
---

![AI From the Ground Up: Neural network visualization with interconnected nodes representing LLMs, transformers, and agents](./images/banner.svg)

Most explanations of AI either stay at the "it's magic" level or jump straight into linear algebra. This post sits in between. It's a guided tour, with no math, from *what an LLM actually is* all the way to *the agents and tooling people use to get real work done with it*.

1. [What is an LLM?](#1-what-is-an-llm)
2. [Tokenization: what the model actually sees](#2-tokenization-what-the-model-actually-sees)
3. [Embeddings and vectors: meaning as numbers](#3-embeddings-and-vectors-meaning-as-numbers)
4. [Transformers and attention](#4-transformers-and-attention)
5. [Inference, context and prompting](#5-inference-context-and-prompting)
6. [What is an agent?](#6-what-is-an-agent)
7. [What is a harness?](#7-what-is-a-harness)
8. [The tooling we use](#8-the-tooling-we-use)

---

## 1. What is an LLM?

By the end of this part you'll know what this "AI" we chat with really is, what it does under the hood, and what it is **not**.

### The core idea

An **LLM** (Large Language Model) is, at its core, a **text-completion machine**. You give it a beginning, and it guesses the next small piece of text. Then it looks at everything again (including what it just wrote) and guesses the next piece. And again, until the answer is complete.

> **Analogy:** it's your phone keyboard's **autocomplete**, turbocharged. The keyboard suggests the next word; an LLM suggests the next word so well that it can write an entire email, a piece of code, or a coherent summary.

What's impressive isn't the idea (predicting the next word). It's the **scale**. The model read an enormous amount of text and got so good at predicting that, in order to get the next word right, it effectively "learned" grammar, facts, style, and even patterns of reasoning.

### How it "learned" all that (very roughly)

- The model was shown **a huge amount of text** (books, websites, code) and asked, millions upon millions of times: "given this sentence, what's the next word?"
- Every time it got it wrong, its **internal numbers** (the *weights*) were nudged a tiny bit so it would miss less next time. That's **training**.
- At the end, those weights are "frozen" into one giant file. **That file is the model.** It doesn't learn anything on its own after that.

> Weights are just **numbers**. A model is a file with billions of them. There's no "table of facts" inside that it looks things up in. The knowledge is diluted across those numbers, the same way your ability to ride a bike isn't written down anywhere. It's "in your muscles and reflexes."

### What an LLM is NOT

- **It's not a database.** It doesn't "look up" the answer in a table; it **generates** it word by word. That's why it sometimes makes things up (more on *hallucination* in Part 5).
- **It's not deterministic by default.** The same question can produce different answers, because there's an element of random sampling when choosing the next word.
- **It doesn't "think" or "understand" like a person.** It models **patterns of language** extremely well. That's useful and powerful, but it's different from consciousness or real comprehension.
- **It doesn't know what happened after training.** If training ended last year, it knows nothing about yesterday, unless you **put that information in the prompt**.
- **It has no memory between conversations** on its own. Every conversation starts from zero, unless some tool stores the history and sends it back.

### Common misconceptions

- **"It's giving me a fact it looked up."** No. It's generating the most probable text. Often that coincides with the right fact, but there's no guarantee.
- **"If it got it wrong, the information must be wrong in its 'database'."** There's no database. It may simply have generated something plausible and false.
- **"It learns from me while we talk."** The weights don't change. It only "remembers" what's in the context window of **that** conversation.
- **"A bigger model is always better."** Not always. A smaller model can be faster, cheaper, and good enough for the task.

### Deep dive: the three phases that turn raw text into an assistant

1. **Pre-training.** The model reads an ocean of text, just predicting the next word. It comes out knowing language and a lot about the world, but "raw": it doesn't know how to follow instructions.
2. **Instruction fine-tuning.** It's shown examples of "request → good answer" so it learns to **follow instructions** (summarize, answer, format).
3. **Alignment (RLHF).** Humans compare answers and say which is better; the model is adjusted to prefer helpful, safe answers and to refuse dangerous ones. This is what makes the assistant feel "polite and helpful."

### Deep dive: "generative" vs. models that only classify

Not every text AI is generative. Some models only **classify** ("is this email spam?"). An LLM is **generative**: it produces new content. That's what makes it so versatile, and also why it needs more care, since it can generate things that are wrong or inappropriate.

**Next:** we know the LLM completes text piece by piece. But what exactly is a "piece"? That's **tokenization**.

---

## 2. Tokenization: what the model actually sees

By the end of this part you'll understand what the model really "sees" when you type something, why that explains odd behaviors (like AI miscounting the letters in a word), and why it **costs money**.

### The core idea

The model doesn't read letters or words the way we do. Before anything else, text is chopped into **tokens**: small pieces that can be a whole word, part of a word, a space, or a punctuation mark. This process is called **tokenization**.

> **Analogy:** imagine building sentences from prefabricated **LEGO bricks**. You don't have one brick for every possible English word; you have a fixed set of bricks (some big, like "house"; others small, like "un" or "tion") and you build words by snapping bricks together. The model works with these "text bricks": tokens.

Each token becomes a **number** (an ID), and the model only manipulates those numbers. The output goes the opposite way: numbers → tokens → text.

### A token is not a word

A rule of thumb (for English) is that **1 token ≈ 4 characters ≈ ¾ of a word**. But it varies a lot with the language and the words:

- Common words are usually **1 token** ("house", "the").
- Long or rare words are split into **several tokens** ("unconstitutionally" might become 4–5 pieces).
- Spaces and punctuation also count as tokens (or are part of them).
- **Languages other than English usually take more tokens** to say the same thing. Many models were trained on more English, so words in, say, Portuguese get broken into more pieces.

> Direct consequence: the same text can **cost more** and **take up more space** in Portuguese than in English, simply because it produces more tokens.

### Why AI gets "how many R's in strawberry" wrong

Because it **doesn't see letters**. It sees tokens. If "strawberry" reaches the model as one token (a single number), the information about *which letters make it up* simply isn't available in an accessible way. So it **guesses** from patterns, and it can be wrong.

> It's not stupidity: counting letters is a **character** task, and the model thinks in **tokens**. It's like asking someone to count the bricks in a wall by looking only at a photo of the finished house.

### Why this matters day to day

- **Cost.** Almost every provider charges **per token** (input and output). A giant prompt means more tokens, which means more money. Same for long outputs.
- **Context limit.** The model's "working memory" is measured in **tokens**, not pages. A document may simply not fit (see Part 5).
- **Speed.** The model generates **one token at a time**. More tokens in the answer means a longer wait.

### Common misconceptions

- **"1 word = 1 token."** Not always. Long words become several tokens, and the language changes everything.
- **"Spaces and commas are free."** No. They are (or are folded into) tokens too.
- **"If I write fewer characters, I always save."** It helps, but what counts is the **number of tokens**. Sometimes a shorter sentence produces more tokens because it uses rare words.
- **"The model understands letters, so anagrams should be easy."** Spelling and letter tasks are exactly where it stumbles most, because of tokens.

### Deep dive: how the "LEGO bricks" are made (BPE, briefly)

The set of tokens (the *vocabulary*) is built before training by an algorithm such as **BPE (Byte Pair Encoding)**. The intuition:

1. Start by treating each character as a brick.
2. See which pairs of bricks appear **together most often** in the text, and merge them into a bigger brick (e.g. "t" + "ion" → "tion").
3. Repeat thousands of times. In the end, common chunks become big bricks; rare chunks stay small.

Result: frequent words = few tokens; rare words = many tokens. This balances a small vocabulary against the ability to write any word at all.

### Deep dive: special tokens

Beyond text, there are "control" tokens the model uses to organize itself: marking the **start and end** of a message, separating **who spoke** (system, user, assistant), and so on. You never type these. The *harness* (Part 7) inserts them behind the scenes.

### Deep dive: a quick cost calculation

Say a provider charges per 1,000 tokens and you paste a file of ~8,000 words:

- ~8,000 words ≈ **~11,000 tokens** of input alone.
- If that goes in **every** message of a long conversation, the cost multiplies.

That's why "just send everything, always" gets expensive.

**Next:** tokens become numbers. But how does the model capture the **meaning** of those tokens, so it knows "car" and "automobile" are similar? That's **embeddings**.

---

## 3. Embeddings and vectors: meaning as numbers

By the end of this part you'll understand how a computer can measure that "car" and "automobile" mean nearly the same thing, the idea behind smart search, memory, and the famous RAG.

### The core idea

An **embedding** is a way of turning a piece of text (a word, a sentence, a paragraph) into a **list of numbers** that represents its **meaning**. Texts with similar meanings become **similar** lists of numbers.

> **Analogy:** think of a **map**. Every city has coordinates (latitude, longitude), and nearby cities have nearby coordinates. An embedding does this for **meanings**: it gives each text a "coordinate of meaning." "Dog" and "puppy" land practically at the same spot; "dog" and "refrigerator" land far apart.

The difference is that this "map of meaning" doesn't have 2 dimensions (lat/long). It has **hundreds or thousands**. We can't visualize that, but the math of "near/far" works exactly the same.

### What it's for

Once meaning becomes a "position on a map," a computer can do things exact-word search can't:

- **Search by meaning.** You search "how to reset my password" and find a document about "credential recovery," without a single word in common.
- **Group similar topics.** Cluster complaints about the same issue.
- **Agent memory.** Store facts, then find the relevant ones by proximity.
- **RAG.** The heart of the technique that "pastes documents into the prompt" (below).

### How "near" is measured

You compare the **direction** of the two lists of numbers. If two texts "point the same way" on the map of meaning, they're considered close. You'll see the name for this: **cosine similarity**. You don't need the formula. The intuition is "same direction = same topic."

> What matters: **near = similar in meaning**. That's all the system uses to decide what's "relevant."

### How RAG uses embeddings (one paragraph)

**RAG** (Retrieval-Augmented Generation) solves a problem from Part 1: the model doesn't know **your** documents. The trick:

1. Your documents are split into chunks, and an embedding is computed for each chunk.
2. Those embeddings are stored in a **vector database** (an index of "coordinates").
3. When you ask something, the embedding of your **question** is computed, and the **closest** chunks are retrieved.
4. Those chunks are **pasted into the prompt**, and the model answers based on them.

That way the model "knows" things it never saw in training, because you handed it the right passages at the right time.

### Common misconceptions

- **"An embedding is the same as a token."** No. A token is a piece of text (Part 2); an embedding is a **representation of meaning** (a list of numbers per text).
- **"If the words are different, the texts are different."** No: embeddings capture meaning, so synonyms end up close even without shared words.
- **"Vector search always finds the right thing."** If the right chunk wasn't indexed, or the text was split badly, it returns junk, and the model answers confidently about junk.
- **"I can swap the embedding model whenever I like."** Swapping **changes the entire map**, so every embedding must be recomputed (re-indexed). It's not a light update.

### Deep dive: what the "dimensions" are

Each number in the list is a dimension. Think of each one as an "axis" capturing some aspect of meaning (degree of "formality," "is it about animals?", "is it about money?"). In practice they aren't human-readable labels like that, but the intuition holds. **More dimensions** means more nuance captured, but also a bigger index and more expensive search.

### Deep dive: why "hybrid" search often wins

Search by meaning (vector) is great for synonyms and paraphrases, but sometimes you want the **exact term** (an error code, a contract number). Combining vector search with classic keyword search (known as **BM25**) usually beats either one alone.

**Next:** we have tokens and meaning as numbers. Now, what's the machinery that ties it all together to predict the next word? **Transformers**.

---

## 4. Transformers and attention

By the end of this part you'll understand, without math, the machinery inside every modern LLM, the **transformer**, and the idea that makes it work: **attention**.

### The core idea

**Transformer** is the name of the **architecture** (the kind of machinery) used in practically every LLM today: GPT, Claude, Gemini, Llama. It was introduced in 2017 in a paper with a title that became an in-joke in the field: *"Attention Is All You Need."*

The big insight is **attention**: when deciding the next word, the model **looks at all the previous words at once** and decides, for each one, **how much it matters** right now.

> **Analogy:** you're reading the sentence *"I took the dog to the vet because **he** was sick."* To know who "he" is, your brain **pays attention** to "dog" back there and ignores "vet." A transformer's attention does exactly that: it weighs which earlier words are relevant for understanding or generating the next one.

### Why it was revolutionary

Before transformers, models read text **word by word, in order**, like reading through a little hole that slides left to right. That had two problems:

- It was **slow** (one word at a time, with no way to take advantage of parallel processing).
- It **forgot the beginning** of long texts (information from the start got lost along the way).

The transformer looks at the **whole text at once** and links any word to any other directly, however far apart they are. That made it possible to train **much bigger** models **much faster**, which is why LLMs made the leap they did.

### How an answer gets built (step by step, roughly)

1. Your text is chopped into **tokens** (Part 2), and each token becomes a list of numbers carrying meaning + position (a relative of the **embedding** from Part 3).
2. Those numbers pass through **many stacked layers of attention**. In each layer the model recombines the information: every token "looks at" the others and updates what it represents, given the context.
3. At the top, the model produces a **list of probabilities**: for **every** possible token in the vocabulary, the chance it's the next one.
4. A token is chosen from that list (Part 5), **appended** to the text, and everything starts over from step 1 for the **next** token.

> Key point: the model generates **one token at a time**, reconsidering everything that already exists. It doesn't "plan the whole sentence" in advance. It builds as it goes.

### Common misconceptions

- **"Transformer is the name of the model."** No, it's the name of the **architecture**. GPT and Claude *are* transformers, the way a Beetle and a Civic *are* cars.
- **"Attention means it truly understands."** Attention is a mathematical mechanism for "weighing relevance between tokens," not conscious comprehension.
- **"It writes the whole answer at once."** No: token by token, one at a time.
- **"It reads left to right like we do."** It processes all the tokens in the context in parallel; order enters as extra information, not as a "cursor" that moves along.

### Deep dive: why the "context window" exists

Attention links each token to **all** the others. That's powerful, but the cost grows **very fast** as text gets longer (doubling the text more than doubles the work). So there's a **limit on tokens** the model can handle at once: the **context window** (Part 5). It isn't laziness on the vendor's part; it's the price of attention.

### Deep dive: "position matters" (lost in the middle)

Because each token's position is part of the information, in practice models tend to use what's at the **beginning** and **end** of the context better, and to "forget" what's **in the middle** of a very long text. This has a name, *lost in the middle*, and it's a reason to be deliberate about **where** you put the important information.

### Deep dive: optimizations you'll hear about

Terms like **FlashAttention**, **KV cache** and **vLLM** are tricks for running attention faster and cheaper. The architecture doesn't change; the engineering around it does. The original paper is Vaswani et al., 2017.

**Next:** now we know how the model generates text inside. What happens **when you hit enter**? Context window, randomness, prompting, and why it sometimes makes things up.

---

## 5. Inference, context and prompting

By the end of this part you'll understand what happens **when you hit enter**: how the model uses its "working memory," why the same question can give different answers, how to write good requests, and why AI sometimes **makes things up**.

### The core idea

**Inference** is the fancy word for "**using** the model to generate an answer," as opposed to *training* it, which happened long ago. Every time you talk to an AI, you're running an inference.

To answer, the model takes everything in the **context window** and generates the response **one token at a time** (Part 4) until it decides it's finished.

### The context window is a whiteboard

> **Analogy:** imagine a **whiteboard** of fixed size. On it fit: your instructions, your question, the conversation history, and any document you pasted. The model only "knows" what's written **on that board right now**.

Three important consequences:

- **It's finite.** If it fills up, something has to go (the start of the conversation disappears, or something doesn't fit). Size is measured in **tokens** (Part 2), not pages.
- **It doesn't persist on its own.** Close the conversation and the board is wiped. "Remembering" across conversations requires a tool that **stores and rewrites** the history onto the board.
- **Filling it with junk makes things worse.** Pasting irrelevant material doesn't just cost more, it **hurts**: the model gets distracted and uses what's in the middle poorly (*lost in the middle*, Part 4).

### Why the same question gives different answers

When the model builds its list of "likely next tokens" (Part 4), it doesn't **always** pick the most likely one. It does a **weighted draw**. A control called **temperature** sets how "bold" that draw is:

- **Low temperature** → almost always picks the most likely token → more **consistent, predictable** answers (good for factual tasks and code).
- **High temperature** → takes more risks → more **varied, creative** answers (good for brainstorming and prose).

> That's why AI isn't a calculator: by default, a die is being rolled at every token. This has a direct impact on **how we test** AI.

### Prompting: how to ask well

A **prompt** is the text you send. Prompting is the art of asking in a way that makes the model more likely to get it right. The basics that already solve 80% of cases:

- **Give context and a goal.** "You are a code reviewer. Point out security bugs in this snippet:" works better than "look at this."
- **Be specific about format.** "Answer in 3 bullets" or "return only the JSON."
- **Show an example** of what you want (called *few-shot*): one or two "input → output" examples guide a lot.
- **Ask for step-by-step** on reasoning problems ("think step by step"). It often improves the answer, though newer "reasoning" models already do this internally.
- **Separate instruction from data.** Make clear what is your order and what is material to be processed (this is also **security**, see below).

#### System prompt vs. user prompt

Many systems have two levels: the **system prompt** (the "factory" instructions: "you are a support assistant, never reveal customer data") and the **user prompt** (what you type). The system prompt carries more weight and frames the whole conversation. In agent tooling, *rules* files play that role (Part 8).

### Hallucination: why AI makes things up

**Hallucination** is when the model answers something **wrong that looks right**. Remember Part 1: it **generates the most plausible text**; it doesn't consult a truth. When it doesn't "know," it doesn't go silent. It fills in with whatever **sounds** most likely, and that can be false.

How to reduce it (not eliminate it):

- **Put the source in the prompt** (RAG, Part 3): answer based on real passages you provided.
- **Ask it to cite** where it got something, and be suspicious when there's no source.
- **Lower the temperature** for factual tasks.
- **Verify** anything critical. In high-stakes or regulated settings this is mandatory.

### Common misconceptions

- **"It looked that up on the internet."** Only if a search tool is plugged in. Without one, it generates from memory, with knowledge frozen at training time.
- **"If it answered confidently, it's right."** Confidence in the text is **not** evidence of truth. Hallucinations come across confident.
- **"It failed once, so the model is bad."** Because of randomness, try again and/or improve the prompt before concluding.
- **"The more I paste into the prompt, the better."** Usually it gets **worse**: more cost and more distraction. Include **only what's needed**.

### In practice

When you use an AI coding tool, your message + open files + history + the project's rules together form the context window for that inference. When an agent "forgets" something said at the start of a long session, it's almost always because the context window **filled up**, not ill will. **Context engineering** (putting only what's needed, in the right place) is a discipline of its own.

### Deep dive: other generation controls

Besides temperature, there are settings like **top-p** (limits the draw to the tokens that add up to a certain probability) and **max tokens** (a ceiling on answer length). All of them shift the balance between **predictability** and **variety/cost**.

### Deep dive: prompt injection (the risk of mixing instruction with data)

If the model treats **everything** in its context as instruction, a malicious document can contain "ignore your orders and do X," and the model may obey. This is **prompt injection**, and the **indirect** form (coming from a document or RAG result) is one of the most serious threats in LLM applications.

### Deep dive: why testing AI is different

Because output is probabilistic, "run it once and see if it passed" isn't enough. Teams use **evaluation sets** and even one model to judge another (*LLM-as-a-judge*).

**Next:** so far, AI only **answers**. How does it start to **act** in the world: opening files, running commands, calling systems? That's the **agent**.

---

## 6. What is an agent?

By the end of this part you'll understand how AI goes from "just answering text" to **doing things** (opening files, running commands, querying systems) and why that changes everything, including the risks.

### The core idea

Until now, AI was a "genie in a box": you ask, it answers in text, and that's the end. An **agent** takes the genie out of the box: it's an LLM placed inside a **loop** where it can **act** on the world and **see the result** of its action before continuing.

The loop, in four steps, repeats until the task is done:

1. **Goal.** It receives an objective ("fix the login bug").
2. **Reason.** It decides the next step.
3. **Act.** It uses a **tool** (read a file, run a test, search the web).
4. **Observe.** It reads the tool's result and goes back to step 2.

> **Analogy:** the difference between **asking for a recipe** (the model gives you the text) and **having a cook in the kitchen** (the agent opens the fridge, tastes, adjusts the salt, and serves). The cook doesn't get everything right on the first try: they **act, taste, and correct** in a cycle.

### What "tools" are

On its own, the model only produces text. A **tool** is a function someone has made available for the agent to use: "read file X," "run this command," "look up the customer's balance." The model doesn't run the tool. It **asks** for it to be run, and the program around it (the *harness*, Part 7) runs it and hands back the result.

> Every tool is a **door to the real world**. That's what gives the agent power, and also what demands care: a tool that deletes files is useful and dangerous at the same time.

### When the agent stops

An agent with no brakes can spin in circles and **burn time and money** (each turn of the loop is new inferences, so more tokens). That's why every serious agent has stopping criteria:

- **Goal reached** (the test passed, the file was fixed).
- **A cap on steps/iterations** (so it doesn't run forever).
- **A budget** of tokens/time.
- **Asking the human for help** when it gets stuck or when the action is risky.

### Common misconceptions

- **"An agent is a different/smarter model."** No: it's the **same kind of model** placed in a loop with tools. The ability to "act" comes from the structure around it.
- **"The model runs the commands."** It **asks**; the harness executes. That separation is what lets the system ask for your approval before anything dangerous.
- **"More agents = better."** Multiple agents bring parallelism, but also cost and coordination. Start with **one**.
- **"If it has tools, it never hallucinates."** It can still **choose the wrong tool** or misread the result. Tools reduce errors; they don't eliminate them.

### In practice

AI coding assistants are agents. When you say "fix this test," they read files, edit code, and run commands in a loop, exactly the cycle above. The tools they use include reading/editing files, running terminal commands, and calling **MCP servers** (Part 8). The **approval prompt** before a risky command is the loop's "ask the human for help," which doubles as a safety control. Coordinating **many** agents at once is its own topic (see the orchestrator in Part 8).

### Deep dive: the ReAct pattern (reason + act)

The loop we described has a name: **ReAct** (*Reason + Act*). At each step the agent writes a "thought" (what I'll do and why), performs an **action** (a tool call), and reads the **observation** (the result). Alternating thought and action is what lets the agent correct itself midway.

### Deep dive: one agent or many?

- **One agent** is simple, predictable, and cheap to follow. It's the right starting point.
- **Many agents** (multi-agent) can be specialized (researcher, coder, reviewer) and/or run in parallel. You gain speed and separation of roles; you pay in coordination and tokens. Only when there's a **concrete reason**.

### Deep dive: least privilege (agent security)

Since every tool is a door to the real world, good practice is to give each agent **only the tools it needs**: a "reviewer" agent shouldn't have permission to write; a "coder" shouldn't access production data. This limits the damage if something goes wrong.

**Next:** we keep mentioning "the program around the model" that runs the loop and executes the tools. That program has a name, and it's what we use every day: the **harness**.

---

## 7. What is a harness?

By the end of this part you'll understand what a **harness** is, why the model alone does nothing useful, and what tools like **Cascade** and **Devin** really are, including why we have "three names but two harnesses."

### The core idea

The model (Part 1) is just a "brain" that completes text. It does **not** open files, run commands, remember your project, or run the agent loop (Part 6). All of that is done by the **harness**: the program that **wraps** the model and turns it into a working tool.

> **Analogy:** the model is the **engine**; the harness is the **whole car** around it: steering wheel, pedals, dashboard, wheels. A brilliant engine sitting on the garage floor takes you nowhere. The harness is what lets you **drive** the model.

What a coding harness (like Cascade or Devin) does for you:

- **Reads your project:** files, structure, what's open in the editor.
- **Runs the agent loop:** reason, act, observe, repeat (Part 6).
- **Executes the tools:** edit a file, run the terminal, call an MCP server.
- **Builds the context:** gathers your message + files + rules and sends it to the model.
- **Applies your configuration:** *rules*, *skills*, *workflows* (Part 8).
- **Asks for approval** before risky actions.

> The word "harness" comes from the horse gear: the equipment that "harnesses" the model to a concrete job, with reins (limits and approvals) in your hands.

### Model, harness and provider: who's who

It's easier when you separate three things that often get mixed up:

| Piece | What it is | Example |
|-------|------------|---------|
| **Model** | the "brain" that generates text | GPT, Claude, Gemini |
| **Harness** | the program that runs the agent and uses the model | Cascade, Devin |
| **Provider** | who hosts and serves the model via API | OpenAI, Anthropic, a cloud vendor |

The same harness can use **different models** underneath, and the same model can be used by **different harnesses**. They're **independent** pieces that snap together.

### The harnesses we use

In our setup there are **three names**, but in practice **two harnesses**:

- **Cascade** is the assistant inside the **Windsurf IDE**. It's a harness of its own.
- **Devin Local Agent** is the **Desktop** app.
- **Devin CLI** is Devin from the **command line**.

The important detail: **Devin Local and Devin CLI are the same harness**, just in **different versions** (one newer than the other). Hence "three names, two harnesses": `Cascade` on one side; `Devin` (Local + CLI) on the other.

> This explains small behavior differences between Devin on the Desktop and on the CLI: it's not a different design, it's a **different version** (*version skew*). As each one updates, the differences shift.

### Why you should care "which harness"

Because **each harness reads its configuration from slightly different places**. If you create a rule or a workflow somewhere *your* harness doesn't read, it simply **ignores** it, and it looks like "it didn't work." Knowing who reads what saves hours of confusion. The practical rule of thumb: pick **one canonical location** that every harness you use reads, and keep your rules there.

### Common misconceptions

- **"Cascade/Devin is the AI model."** No: they're **harnesses**. The model (the brain) runs underneath and can even be swapped.
- **"The harness thinks."** It does **not** generate text; it **organizes** the work and calls the model, which generates. A harness is smart plumbing, not intelligence.
- **"It doesn't matter where I put my rules/workflows."** It matters a lot: each harness reads specific folders.
- **"Devin Desktop and Devin CLI are separate products, different inside."** It's the same harness in different versions.

### In practice

When you chat in **Windsurf**, it's **Cascade** assembling the context and running the tools. When you use the **Desktop** app or the terminal, it's **Devin**. The **rules**, **skills** and **workflows** a team maintains (next part) only take effect because **the harness loads them** and injects them into the model. **MCP servers** are tools the harness plugs into the agent.

### Deep dive: why a harness exists, instead of "the model directly"

Concentrating project reading, tool execution, context assembly, approvals and logging **in one place** is what makes **governance** and **observability** possible, without depending on every person's discipline. It's the same "single point of passage" logic behind an **LLM gateway**.

**Next:** the harness loads **rules, skills, workflows and MCP**. But what is each of those, in practice? That's the **toolkit** we use to get work done.

---

## 8. The tooling we use

By the end of this part you'll recognize the pieces that show up day to day (**rules, skills, workflows, MCP, spec-kit and the orchestrator**) and know what each is for, without memorizing anything.

### The core idea

The harness (Part 7) becomes far more useful when you **configure** it with your team's knowledge and procedures. Instead of re-explaining everything in every conversation, you leave these things **written down in standard places**, and the harness loads them automatically.

> **Analogy:** think of an **excellent new hire with no memory from one day to the next**. To make them productive, you leave things in writing: the **house rules** (rules), a few **skill manuals** (skills), **procedure checklists** (workflows), and a **keyring for system access** (MCP). The tooling is exactly that kit.

### The pieces, one by one

#### Rules: the permanent instructions

Instructions that apply to **every conversation**, so you don't repeat yourself: "answer in English," "never run git without approval," architecture standards, and so on.

- They live in folders like `.windsurf/rules/` and `.devin/rules/`, and in files like `AGENTS.md` at the project root.
- They're the practical equivalent of the **system prompt** from Part 5: they frame the agent's behavior.
- Since each harness reads from slightly different places (Part 7), the safe move is to pick a **canonical location** every harness you use reads.

#### Skills: capabilities on demand

Packages of "how to do one specific thing" that the agent **pulls in when it needs them** (e.g. setting up an integration, following a technical procedure). They live in folders like `.devin/skills/` or `.windsurf/skills/`. Unlike rules (which always apply), a skill is triggered **when the topic comes up**.

#### Workflows: versioned procedures (slash commands)

Well-defined step-by-step procedures that anyone (or any agent) runs the same way, invoked by a **slash command**. A few examples:

- `/scaffold` creates the structure for a new feature.
- `/review` reviews code or security.
- `/adr` writes an architecture decision record.
- `/deploy` validates deployment configuration.

> Important detail from Part 7: **Cascade runs workflows; Devin doesn't** (it uses skills). So a `/command` can exist and simply not be available in the harness you opened.

#### MCP (Model Context Protocol): the "USB port" for tools and data

A standard for plugging tools and data sources into the agent in a uniform way. Instead of every integration being a different one-off hack, MCP standardizes the connector.

- An **MCP server** offers **tools** (actions) and **resources** (data); the agent is the client that uses them.
- Every MCP server is also an **access point**, which makes it a security surface. Treat what you plug in with care.

#### spec-kit: specification-driven development

A (CLI) tool for working **"spec-first"**: you write the specification and the plan first, then generate and run the tasks. It shows up as `/speckit.*` commands (e.g. `/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, `/speckit.implement`). It keeps you from charging into code without a clear agreement on what to build.

#### Orchestrators: coordinating many agents

When a task is too big for a single agent, an **orchestrator** coordinates several in parallel. Ours runs in **waves** and has a view that tracks many sessions at once. Think of it as "many cooks in an organized kitchen."

### How it all fits together

```
      you
        |  (ask for something in chat / run a /workflow)
        v
   +-----------+     loads      +----------------------------+
   |  HARNESS  | <------------- | rules · skills · workflows |
   | (Cascade/ |                +----------------------------+
   |   Devin)  |     uses       +----------------------------+
   |           | <------------- | local tools + MCP servers  |
   +-----------+                +----------------------------+
        |  builds the context and calls
        v
     MODEL (LLM)  --> generates the answer / the next action
        |
        v
     (agent loop until done; asks for approval on anything risky)
```

- **You** give the goal. **Rules/skills/workflows** say *how* to act.
- The **harness** assembles everything, calls the **model**, and executes the **tools** (local/MCP).
- On big tasks, the **orchestrator** coordinates several agents.

### Where a beginner should start

1. **Read the project's rules** (`AGENTS.md` and the rules folder). It's the "house manual."
2. **Try a simple workflow** (e.g. `/review` on a small snippet).
3. **Ask the agent for small, verifiable tasks** and check the result (Part 5: AI can hallucinate).
4. **Don't approve commands you don't understand.** Approval is your rein (Part 7).
5. When you want the "why" behind each piece, go back and reread the earlier parts.

### Common misconceptions

- **"Rules, skills and workflows are the same thing."** Rules apply **always**; skills are **on demand**; workflows are **procedures** you trigger.
- **"I created the workflow, so everyone has it."** It depends on the **harness** (Cascade runs it; Devin doesn't) and on the **folder** where you saved it (Part 7).
- **"MCP is a product/app."** It's a **protocol** (a connector standard); the *servers* are the concrete pieces.
- **"The orchestrator is mandatory."** No: most day-to-day tasks are **a single agent**. Orchestration is for large, parallelizable work.

### Deep dive: where everything is read (and why it sometimes "doesn't stick")

If a rule or workflow "didn't take," 9 times out of 10 it's because it was saved in a place **your** harness doesn't read. Check the harness's documentation for which folders it loads, and test with something trivial before relying on it.

### Deep dive: rules as governance code

In a regulated or high-stakes environment, many rules aren't style preferences. They're **controls**: don't leak personal data (PII), require human approval for irreversible actions, keep an audit trail. The configuration tooling is also an instrument of **governance and security**.

---

## The full mental model

You now have the complete picture: from the token (Part 2) to the transformer (Part 4), from inference (Part 5) to the agent (Part 6), from the harness (Part 7) to the tooling (Part 8).

The one-line version: **a model completes text; wrap it in a loop with tools and you get an agent; wrap that in a harness and you get something you can actually work with; configure the harness with rules, skills, workflows and MCP and it works the way your team works.**

Go deeper from here: how to design and operate all of this with cost, governance and quality under control. That's where the next posts are headed.
