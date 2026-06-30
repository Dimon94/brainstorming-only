# Choice Output Adapter renders decided choice packets

The brainstorming skill will keep recommendation reliability, blocking-vs-terminal intent, and session flow decisions upstream of the Choice Output Adapter. The adapter receives a Choice Packet Input, validates it fail-closed, selects the available host renderer, and renders the packet for Codex, Claude, gstack-style hosts, or fallback text without changing the decision. This keeps the choice interface deep: one host-rendering module, with flow control and recommendation judgment kept out of the adapter.

Considered alternatives: keeping blocking/terminal and reliability decisions inside `user-choice-output-protocol.md`, or splitting Codex, Claude, gstack, and fallback into separate adapters. Both alternatives widen the interface and make the skill easier to drift back into multiple competing execution paths.
