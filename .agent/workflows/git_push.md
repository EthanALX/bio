---
description: Stage changes, generate a conventional commit message following standards, and push to origin.
---

# Git Push Workflow

This workflow automates the process of staging changes, generating a high-quality commit message based on the changes, and pushing them to the remote repository.

**Steps**:

1. **Stage Changes**
// turbo
Run `git add .` to stage all changes. If you only want to stage specific files, do so manually before running this workflow or modify this step.

2. **Analyze and Generate Commit Message**
Run `git diff --cached` to see what has been staged. Generate a commit message that follows the **Conventional Commits** specification:
- Format: `<type>(<scope>): <description>`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`.
- Scope is optional but recommended if the change is localized to a specific module or feature.
- Use the imperative, present tense: "change", not "changed" nor "changes".

3. **Commit Changes**
// turbo
Run `git commit -m "[Your Generated Message]"` using the message from the previous step.

4. **Push to Remote**
// turbo
Run `git push` to upload the changes.

5. **Summary**
Confirm to the user that the changes have been pushed with the generated message.
