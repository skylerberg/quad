<script lang="ts">
  import { onMount } from 'svelte';

  onMount(() => {
    const storeBoard = (event) => {
      const { board, level } = event.detail;
      const levelKey = `level-${level.id}`;
      localStorage.setItem(levelKey, JSON.stringify(board));
    };

    const storeCurrentLevel = (event) => {
      const { level } = event.detail;
      localStorage.setItem('currentLevel', level.id);
    }

    window.addEventListener('board-changed', storeBoard);
    window.addEventListener('level-changed', storeCurrentLevel);

    return () => {
      window.removeEventListener('board-changed', storeBoard);
      window.removeEventListener('level-changed', storeCurrentLevel);
    };
  })
</script>
