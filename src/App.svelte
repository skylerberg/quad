<script lang="ts">
  import Board from './lib/Board.svelte';
  import TileBag from './lib/TileBag.svelte';
  import DragHandler from './lib/DragHandler.svelte';
  import StorageHandler from './lib/StorageHandler.svelte';
  import { levels } from './lib/level.ts';
  import { onMount } from 'svelte';

  let level: number = $state(0);

  const savedCurrentLevelId = localStorage.getItem('currentLevel');
  if (savedCurrentLevelId) {
    const levelIndex = levels.findIndex(level => level.id === savedCurrentLevelId);
    if (levelIndex !== -1) {
      level = levelIndex;
    }
  }

  $effect(() => {
    window.dispatchEvent(
      new CustomEvent('level-changed', {detail: {level: levels[level]}})
    );
  })
</script>

<h1>Tile Game</h1>
<h2>Level {level + 1}</h2>
<main>
  {#key level}
    <Board level={levels[level]} />
    <TileBag />
    <DragHandler />
    <StorageHandler />
  {/key}
  <button onclick={() => level += 1}>Next Level</button>
</main>
