<script lang="ts">
  import type { Puzzle } from './puzzle.svelte';

  let { puzzle, completedPuzzles, setCompletedPuzzles }: {
    puzzle: Puzzle | null,
    setCompletedPuzzles: (puzzleIds: Array<string>) => void,
    completedPuzzles: Array<string>,
  } = $props();

  const savedCompletedPuzzles = JSON.parse(localStorage.getItem('completedPuzzles'));
  if (savedCompletedPuzzles && Array.isArray(savedCompletedPuzzles)) {
    setCompletedPuzzles(savedCompletedPuzzles);
  }

  $effect(() => {
    localStorage.setItem('completedPuzzles', JSON.stringify(completedPuzzles));
  });

  // Load you board if one exists when you go to a puzzle
  $effect(() => {
    if (puzzle) {
      const puzzleKey = `puzzle-${puzzle.id}`;
      const boardJson = localStorage.getItem(puzzleKey);
      if (boardJson) {
        puzzle.board = JSON.parse(boardJson);
      }
    }
  })

  // Save your board whenever it changes
  $effect(() => {
    if (puzzle) {
      const puzzleKey = `puzzle-${puzzle.id}`;
      localStorage.setItem(puzzleKey, JSON.stringify(puzzle.board));
    }
  });
</script>
