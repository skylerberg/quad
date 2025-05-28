<script lang="ts">
  import Board from './lib/Board.svelte';
  import TileBag from './lib/TileBag.svelte';
  import DragHandler from './lib/DragHandler.svelte';
  import Header from './lib/Header.svelte';
  import StorageHandler from './lib/StorageHandler.svelte';
  import type { Level } from './lib/level';
  import { levels } from './lib/level';
  import type { Tile } from './lib/tile';
  import { checkPuzzle } from './lib/checker';

  let board: Array<Array<Tile | null>> = $state([
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ]);

  let options = $state(undefined);

  let levelIndex: number = $state(0);
  let level: Level = $derived(levels[levelIndex] || levels[0]);
  let levelNumber: number = $derived(levelIndex + 1);

  let solved: boolean | null = $derived.by(() => checkPuzzle(level, board));

  let completedLevels = $state([]);

  const setCompletedLevels = (levelIds: Array<string>) => {
    completedLevels = levelIds;
  }

  $effect(() => {
    if (solved && !completedLevels.some(id => id === level.id)) {
      completedLevels.push(level.id);
    }
  })

  $effect(() => {
    for (let [rowIndex, row] of level.hints.entries()) {
      for (let [colIndex, space] of row.entries()) {
        if (space) {
          board[rowIndex][colIndex] = space;
        }
      }
    }
  })

  // Prevent multi-touch
  document.addEventListener('touchstart', function (e) {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });


  const goToNextLevel = () => {
    levelIndex += 1;
  }

  const resetLevel = () => {
    board = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
  }

  const goToLevel = (level: number) => {
    levelIndex = level - 1;
  }

  const setBoard = (newBoard: Array<Array<Tile | null>>) => {
    board = newBoard;
  }
</script>

<Header
    {resetLevel}
    {levelNumber}
    {goToLevel}
/>

<main>
  <StorageHandler
      {level}
      {board}
      {completedLevels}
      {goToLevel}
      {setBoard}
      {setCompletedLevels}
  />
  <!-- TODO figure out how to get the board to clear without needing this key -->
  {#if level}
    {#key levelIndex}
      <Board {options} {board} {level} />
      <TileBag {board} />
      <DragHandler bind:board {level} />
    {/key}
  {/if}
  {#if solved}
    {#if levelIndex + 1=== levels.length}
      <h1>Thank you for playing!</h1>
    {:else}
      <button class="next-level" onclick={() => goToNextLevel()}>Next Level</button>
    {/if}
  {/if}
</main>

<style>
  h1 {
    margin: 0;
  }

  main {
    max-width: 1280px;
    margin: 0 auto;
    text-align: center;
  }

  .next-level {
    font-size: 14pt;
    font-weight: bold;
    background-color: var(--success);
    box-shadow: 0 0 5px 2px white;
    animation: pulse 1.0s infinite alternate ease-in-out;
  }

  .next-level:hover {
    background-color: var(--success-hover);
  }

  @keyframes pulse {
      0% {
          box-shadow: 0 0 5px 2px white;
      }
      100% {
        box-shadow: 0 0 10px 7px rgba(255, 255, 255, 0.8);
      }
  }
</style>
