<script lang="ts">
  import { setContext } from 'svelte';
  import Board from './lib/NoteBoard.svelte';
  import TileBag from './lib/TileBag.svelte';
  import DragHandler from './lib/DragHandler.svelte';
  import Header from './lib/Header.svelte';
  import StorageHandler from './lib/StorageHandler.svelte';
  import { levels } from './lib/level.ts';
  import type { Tile } from './tile';
  import { checkPuzzle, solve, tacticalSolver } from './lib/solver';
  import { randomLevel } from './lib/generator';

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

  let solved: boolean = $derived.by(() => checkPuzzle(level, board));

  let shouldHideNumbers = $derived(level && level.rowConditions.concat(level.colConditions).every(
    condition => condition.type === 'Contain' && condition.numbers.length === 0
  ));

  let numberVisibility = $state({ hidden: shouldHideNumbers });
  $effect(() => {
    numberVisibility.hidden = shouldHideNumbers;
  });

  setContext('numberVisibility', numberVisibility);

  let completedLevels = $state([]);

  const setCompletedLevels = (levelIds: Array<string>) => {
    completedLevels = levelIds;
  }

  $effect(() => {
    if (solved && !completedLevels.some(id => id === level.id)) {
      completedLevels.push(level.id);
    }
  })

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

  const unlockAllLevels = () => {
    completedLevels = levels.map(level => level.id)
  }
</script>

<Header
    completedLevels={completedLevels}
    resetLevel={resetLevel}
    levelNumber={levelNumber}
    runBacktrackingSolver={runBacktrackingSolver}
    runTacticalSolver={runTacticalSolver}
    goToLevel={goToLevel}
    levelCount={levels.length}
    generateRandomLevel={generateRandomLevel}
    unlockAllLevels={unlockAllLevels}
/>

<main>
  <StorageHandler
      level={level}
      board={board}
      completedLevels={completedLevels}
      goToLevel={goToLevel}
      setBoard={setBoard}
      setCompletedLevels={setCompletedLevels}
  />
  <!-- TODO figure out how to get the board to clear without needing this key -->
  {#if level}
    {#key levelIndex}
      <Board options={options} board={board} level={level} />
      <TileBag board={board} />
      <DragHandler bind:board />
    {/key}
  {/if}
  {#if solved}
    <button class="next-level" onclick={() => goToNextLevel()}>Next Level</button>
  {/if}
</main>

<style>
  main {
    max-width: 1280px;
    margin: 0 auto;
    text-align: center;
  }

  .next-level {
    background-color: var(--success);
    box-shadow: 0 0 5px 2px white;
    animation: pulse 1.0s infinite alternate ease-in-out;
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
