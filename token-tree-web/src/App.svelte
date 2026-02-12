<script>
</script>

<div class="container">
  <aside class="controls">
    <!-- Left side: controls go here -->
  </aside>
  <main class="visualization">
    <!-- Right side: canvas goes here -->
  </main>
</div>

<style>
  .container {
    display: flex;
    height: 100vh;
    width: 100%;
  }

  .controls {
    width: var(--controls-width);
    background-color: var(--color-background-light);
    border-right: 1px solid var(--color-border);
    padding: var(--spacing-lg);
    overflow-y: auto;
  }

  .visualization {
    flex: 1;
    padding: var(--spacing-lg);
    overflow: hidden;
  }
</style>