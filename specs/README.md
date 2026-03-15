# Project Specifications (Agent Guidelines)

This project uses a "Spec-First" protocol to maintain state across AI sessions:

1. **Read**: Before writing code, read the active spec in `pending/`.
2. **Update**: If the implementation strategy changes, update the spec file first.
3. **Trace**: Use the Task List in the spec to mark progress with `[x]`.
4. **Archive**: Move the spec to `completed/` once the feature is fully verified.
