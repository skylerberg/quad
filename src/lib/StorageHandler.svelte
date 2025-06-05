<script lang="ts">
  import type { Puzzle } from './puzzle.svelte';

  let { puzzle, completedPuzzles, userId, setCompletedPuzzles, setUserId }: {
    puzzle: Puzzle | null,
    setCompletedPuzzles: (puzzleIds: Array<string>) => void,
    setUserId: (userId: string) => void,
    completedPuzzles: Array<string>,
    userId: string,
  } = $props();

  const savedUserId = localStorage.getItem('userId');
  if (savedUserId) {
    setUserId(savedUserId);
  }

  $effect(() => {
    localStorage.setItem('userId', userId);
  });

  const savedCompletedPuzzlesJson = localStorage.getItem('completedPuzzles');
  if (savedCompletedPuzzlesJson) {
    const savedCompletedPuzzles = JSON.parse(savedCompletedPuzzlesJson);
    if (Array.isArray(savedCompletedPuzzles)) {
      setCompletedPuzzles(savedCompletedPuzzles);
    }
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
