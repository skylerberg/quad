<script lang="ts">
  import { levels } from './level';
  import type { Level } from './level';
  import type { Tile } from './tile';

  let { level, board, completedLevels, setBoard, goToLevel, setCompletedLevels}: {
    level: Level | null,
    board: Array<Array<Tile | null>>,
    setBoard: (newBoard: Array<Array<Tile | null>>) => void,
    goToLevel: (level: number) => void,
    setCompletedLevels: (levelIds: Array<string>) => void,
    completedLevels: Array<string>,
  } = $props();

  // Load your current level at startup
  //const savedCurrentLevelId = localStorage.getItem('currentLevel');
  //if (savedCurrentLevelId) {
  //  const foundIndex = levels.findIndex(level => level.id === savedCurrentLevelId);
  //  if (foundIndex !== -1) {
  //    goToLevel(foundIndex + 1);
  //  }
  //}

  const savedCompletedLevels = JSON.parse(localStorage.getItem('completedLevels'));
  if (savedCompletedLevels && Array.isArray(savedCompletedLevels)) {
    setCompletedLevels(savedCompletedLevels);
  }

  $effect(() => {
    localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
  });

  // Load you board if one exists when you go to a level
  $effect(() => {
    if (level) {
      const levelKey = `level-${level.id}`;
      const boardJson = localStorage.getItem(levelKey);
      if (boardJson) {
        setBoard(JSON.parse(boardJson));
      }
      else {
        setBoard([
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
        ]);
      }

      localStorage.setItem('currentLevel', level.id);
    }
  })

  // Save your board whenever it changes
  $effect(() => {
    if (level) {
      const levelKey = `level-${level.id}`;
      localStorage.setItem(levelKey, JSON.stringify(board));
    }
  });
</script>
