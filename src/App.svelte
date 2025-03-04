<script lang="ts">
  import { setContext } from 'svelte';
  import Board from './lib/NoteBoard.svelte';
  import TileBag from './lib/TileBag.svelte';
  import DragHandler from './lib/DragHandler.svelte';
  import Header from './lib/Header.svelte';
  import StorageHandler from './lib/StorageHandler.svelte';
  import { levels } from './lib/level.ts';
  import type { Tile } from './tile';
  import { solve, tacticalSolver } from './lib/solver';
  import { randomLevel } from './lib/generator';

  let board: Array<Array<Tile | null>> = $state([
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ]);

  let options = $state(undefined);

  let levelIndex: number = $state(0);
  let level = $derived(levels[levelIndex] || levels[0]);
  let levelNumber: number = $derived(levelIndex + 1);

  let shouldHideNumbers = $derived(level && level.rowConditions.concat(level.colConditions).every(
    condition => condition.type === 'Contain' && condition.numbers.length === 0
  ));

  let numberVisibility = $state({ hidden: shouldHideNumbers });
  $effect(() => {
    numberVisibility.hidden = shouldHideNumbers;
  });

  setContext('numberVisibility', numberVisibility);

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

  const runTacticalSolver = () => {
    [board, options] = tacticalSolver(level, board);
  }

  const runBacktrackingSolver = () => {
    let solution = solve(level)
    if (solution) {
      board = solution;
    }
  }

  const generateRandomLevel = () => {
    const level = randomLevel();
    console.log(JSON.stringify(level));
    levels.unshift(level);
    levelIndex = 1;
    levelIndex = 0;
  }

  const goToLevel = (level: number) => {
    levelIndex = level - 1;
  }

  const setBoard = (newBoard: Array<Array<Tile | null>>) => {
    board = newBoard;
  }
</script>

<Header
    resetLevel={resetLevel}
    levelNumber={levelNumber}
    runBacktrackingSolver={runBacktrackingSolver}
    runTacticalSolver={runTacticalSolver}
    goToLevel={goToLevel}
    levelCount={levels.length}
    generateRandomLevel={generateRandomLevel}
/>

<main>
  <StorageHandler
      level={level}
      board={board}
      goToLevel={goToLevel}
      setBoard={setBoard}
  />
  <!-- TODO figure out how to get the board to clear without needing this key -->
  {#if level}
    {#key levelIndex}
      <Board options={options} board={board} level={level} />
      <TileBag board={board} />
      <DragHandler bind:board />
    {/key}
  {/if}
  <button onclick={() => goToNextLevel()}>Next Level</button>
</main>

<style>
  main {
    max-width: 1280px;
    margin: 0 auto;
    text-align: center;
  }
</style>
