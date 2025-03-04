<script lang="ts">
  import Board from './lib/NoteBoard.svelte';
  import TileBag from './lib/TileBag.svelte';
  import DragHandler from './lib/DragHandler.svelte';
  import Header from './lib/Header.svelte';
  import StorageHandler from './lib/StorageHandler.svelte';
  import { levels } from './lib/level.ts';
  import type { Tile } from './tile';
  import { writable, derived } from 'svelte/store';
  import { solve, tacticalSolver } from './lib/solver';
  import { randomLevel } from './lib/generator';

  let board: Array<Array<Tile | null>> = $state([
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ]);

  let options = $state(undefined);

  let levelIndex: number = writable(0);
  let level = derived(levelIndex, ($levelIndex) => levels[$levelIndex]);
  let levelNumber: number = derived(levelIndex, ($levelIndex) => $levelIndex + 1);

  const goToNextLevel = () => {
    $levelIndex += 1;
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
    [board, options] = tacticalSolver($level, board);
  }

  const runBacktrackingSolver = () => {
    let solution = solve($level)
    if (solution) {
      board = solution;
    }
  }

  const generateRandomLevel = () => {
    const level = randomLevel();
    console.log(JSON.stringify(level));
    levels.unshift(level);
    $levelIndex = 1;
    $levelIndex = 0;
  }

  const goToLevel = (level: number) => {
    $levelIndex = level - 1;
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
  <StorageHandler bind:levelIndex bind:board />
  <!-- TODO figure out how to get the board to clear without needing this key -->
  {#key $levelIndex}
    <Board options={options} board={board} level={levels[$levelIndex]} />
    <TileBag board={board} />
    <DragHandler bind:board />
  {/key}
  <button onclick={() => goToNextLevel()}>Next Level</button>
</main>

<style>
  main {
    max-width: 1280px;
    margin: 0 auto;
    text-align: center;
  }
</style>
