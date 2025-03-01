<script lang="ts">
  import { onMount } from 'svelte';
  import { levels } from './level.ts';
  import type { Tile } from './tile';

  let { board = $bindable(), levelIndex = $bindable() }: {
    board: Array<Array<Tile | undefined>>,
    levelIndex, // writable(number)
  } = $props();

  // Load your current level at startup
  const savedCurrentLevelId = localStorage.getItem('currentLevel');
  if (savedCurrentLevelId) {
    const foundIndex = levels.findIndex(level => level.id === savedCurrentLevelId);
    if (foundIndex !== -1) {
      $levelIndex = foundIndex;
    }
  }

  // Load you board if one exists when you go to a level
  levelIndex.subscribe((index) => {
    const levelKey = `level-${levels[index].id}`;
    const boardJson = localStorage.getItem(levelKey);
    if (boardJson) {
      board = JSON.parse(boardJson);
    }
    else {
      board = [
        [undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined],
      ];
    }
  })


  // Save your current level whenever levelIndex changes
  levelIndex.subscribe((index) => {
    localStorage.setItem('currentLevel', levels[index].id);
  })

  // Save your board whenever it changes
  $effect(() => {
    const levelKey = `level-${levels[$levelIndex].id}`;
    localStorage.setItem(levelKey, JSON.stringify(board));
  });


  //onMount(() => {

  //  const storeCurrentLevel = (event) => {
  //    const { level } = event.detail;
  //    localStorage.setItem('currentLevel', level.id);
  //  }

  //  window.addEventListener('board-changed', storeBoard);
  //  window.addEventListener('level-changed', storeCurrentLevel);

  //  return () => {
  //    window.removeEventListener('board-changed', storeBoard);
  //    window.removeEventListener('level-changed', storeCurrentLevel);
  //  };
  //})
</script>
