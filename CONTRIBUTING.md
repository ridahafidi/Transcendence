# Team Git Workflow & Coding Standards

To ensure smooth collaboration, avoid merge conflicts, and guarantee we pass our evaluation, all team members must adhere to the following workflow.

## 1. Branching Strategy
We use a feature-branch workflow based directly on our Jira board. 
- **`main`**: The stable, production-ready branch. Only the Tech Lead / Project Owner merges into here.
- **Feature Branches**: Every Jira task gets its own branch created from `main`.

**Branch Naming Convention:**
Format: `<type>/<jira-key>-<short-description>`
- `feat/FE-01.1-react-setup` (For new features)
- `fix/BE-02.3-jwt-bug` (For bug fixes)
- `docs/INF-05.1-readme` (For documentation)

## 2. Development Workflow (Step-by-Step)
1. **Pick a Task:** Assign the ticket to yourself on Jira and move it to "In Progress".
2. **Pull Latest:** `git checkout main` -> `git pull origin main`.
3. **Create Branch:** `git checkout -b feat/FE-01.2-button-component`.
4. **Develop:** Write your code. Keep it scoped *only* to what the Jira ticket asks for. Do not over-engineer.
5. **Commit:** Make logical, granular commits.

**Commit Message Convention:**
Format: `[JIRA-KEY] Short descriptive message`
*Example: `[FE-01.2] Add reusable Button and Input Tailwind components`*

## 3. Pull Requests & Code Review
You cannot push directly to `main`. All code must go through a Pull Request (PR) on GitHub.

**PR Rules:**
- The PR title must include the Jira Key (e.g., `[BE-02.1] Configure Spring Security routes`).
- You must link the PR to the Jira ticket.
- **Mandatory Review:** At least **ONE** other team member must review and approve your code before it can be merged.
- **Defense Prep:** If you review a PR, you must understand the code. Ask questions in the comments if you don't understand how a function works.

## 4. Evaluation Preparedness (Golden Rule)
**Do not push code you cannot explain.** During the evaluation, you may be asked to modify any file you worked on. If you use a tutorial or snippet to solve a problem, you must be able to explain the underlying logic to the reviewer.
