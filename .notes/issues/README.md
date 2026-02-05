# Token Tree Game - Issues

This directory contains GitHub issues for the Token Tree Game project. Each issue is a separate markdown file that can be exported to GitHub for tracking progress.

## Issue List

| # | Issue | Status | Priority |
|---|-------|--------|----------|
| 1 | [Set up Godot project structure and main scene](001-project-structure.md) | Not Started | High |
| 2 | [Implement LLM abstraction layer and Ollama integration](002-llm-abstraction.md) | Not Started | High |
| 3 | [Implement token data structures and state management](003-token-data-structures.md) | Not Started | High |
| 4 | [Create TokenNode scene with interactivity](004-token-node-scene.md) | Not Started | High |
| 5 | [Implement pluggable layout algorithm system](005-layout-algorithms.md) | Not Started | Medium |
| 6 | [Implement tree rendering system](006-tree-rendering.md) | Not Started | High |
| 7 | [Implement branch continuation logic](007-branch-continuation.md) | Not Started | Medium |
| 8 | [Implement UI controls and gameplay mechanics](008-ui-controls-gameplay.md) | Not Started | Medium |
| 9 | [Visual polish and juice](009-visual-polish.md) | Not Started | Low |
| 10 | [Export configuration, documentation, and alpha deployment](010-export-documentation.md) | Not Started | Medium |

## Dependencies

```
Issue 1 (Project Structure)
    ├─> Issue 2 (LLM Abstraction)
    │       └─> Issue 3 (Token Data Structures)
    │               └─> Issue 4 (Token Node Scene)
    │                       └─> Issue 5 (Layout Algorithms)
    │                               └─> Issue 6 (Tree Rendering)
    │                                       └─> Issue 7 (Branch Continuation)
    │                                               └─> Issue 8 (UI Controls)
    │                                                       └─> Issue 9 (Visual Polish)
    │                                                               └─> Issue 10 (Export & Docs)
```

## Usage

To export these issues to GitHub:

1. Create a new GitHub repository
2. For each issue file:
   - Copy the title and description
   - Create a new issue on GitHub
   - Paste the content
   - Add appropriate labels (enhancement, bug, documentation, etc.)
3. Update the status in this index as issues are completed

## Issue Template

Each issue follows this structure:

- **Description**: What needs to be done
- **Tasks**: Checklist of specific work items
- **Acceptance Criteria**: Definition of done
- **Notes**: Additional context or considerations
- **Related Issues**: Dependencies and follow-up work
- **Future Work**: Ideas for later enhancements

## Progress Tracking

- **Total Issues**: 10
- **Completed**: 0
- **In Progress**: 0
- **Not Started**: 10

## Alpha Milestone

Issues 1-8 form the core alpha milestone. Issues 9-10 are polish and deployment tasks that can be done in parallel or after the core features are implemented.

**Alpha Goal**: A playable game where users can:
- Generate tokens from Ollama
- Visualize the token tree
- Explore alternative branches
- Search for target substrings
- Earn points based on probability

## Next Steps

1. Start with Issue 1 (Project Structure)
2. Work through issues in dependency order
3. Update status in this index as you progress
4. Use GitHub issues to track detailed progress
5. Collect feedback after alpha deployment
