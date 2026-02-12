# Step 7: Branch Continuation

**Learn:** Async workflows, loading states, error handling

## Concepts
- **Async workflows**: Chain multiple async operations
- **Loading states**: Show progress during long operations
- **Error handling**: Gracefully handle failed operations

## Actions
- [ ] Extend LLMBackend interface with continueGeneration() method
- [ ] Implement continueGeneration() in WebLLMBackend
- [ ] Create `src/lib/game/branch-manager.ts` with BranchManager class
- [ ] Implement createBranch() for starting new branches
- [ ] Implement continueBranch() for extending branches with LLM
- [ ] Add loading states and error handling for async operations
- [ ] Test branch creation and continuation

## Verify
- [ ] Clicking alternative tokens creates and continues branches

## Resources
- Async/await: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function