<script lang="ts">
  import Board from './lib/Board.svelte';
  import TileBag from './lib/TileBag.svelte';
  import DragHandler from './lib/DragHandler.svelte';
  import Header from './lib/Header.svelte';
  import StorageHandler from './lib/StorageHandler.svelte';
  import type { Level, Difficulty } from './lib/level';
  import type { Tile } from './lib/tile';
  import { checkPuzzle } from './lib/checker';
  import casualLevels from './lib/levels/casual';
  import challengeLevels from './lib/levels/challenge';
  import extremeLevels from './lib/levels/extreme';
  import { currentDayIndex } from './lib/date';
  import Title from './lib/Title.svelte';

  let board: Array<Array<Tile | null>> = $state([
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ]);

  let difficulty: Difficulty | null = $state(null);

  const setDifficulty = (newDifficulty: Difficulty | null) => {
    difficulty = newDifficulty;
  }

  let level: Level | null = $derived.by(() => {
    if (difficulty === 'Casual') {
      return casualLevels[currentDayIndex()];
    }
    if (difficulty === 'Challenge') {
      return challengeLevels[currentDayIndex()];
    }
    if (difficulty === 'Extreme') {
      return extremeLevels[currentDayIndex()];
    }
    return null;
  });

  let solved: boolean | null = $derived.by(() => {
    if (level) {
      checkPuzzle(level, board)
    }
    return null;
  });

  let completedLevels = $state([]);

  const setCompletedLevels = (levelIds: Array<string>) => {
    completedLevels = levelIds;
  }

  $effect(() => {
    if (level && solved && !completedLevels.some(id => id === level.id)) {
      completedLevels.push(level.id);
    }
  })

  $effect(() => {
    if (level) {
      for (let [rowIndex, row] of level.hints.entries()) {
        for (let [colIndex, space] of row.entries()) {
          if (space) {
            board[rowIndex][colIndex] = space;
          }
        }
      }
    }
  })

  const resetLevel = () => {
    board = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
  }

  const setBoard = (newBoard: Array<Array<Tile | null>>) => {
    board = newBoard;
  }
</script>

{#if level}
<Header
    returnToMainMenu={() => setDifficulty(null)}
    {resetLevel}
/>
{/if}

<main>
  <StorageHandler
      {level}
      {board}
      {completedLevels}
      {setBoard}
      {setCompletedLevels}
  />
  {#if level}
    <Board {board} {level} />
    <TileBag {board} />
    <DragHandler bind:board {level} />
  {:else}
    <div class="welcome-screen">
      <h2>Welcome to </h2>
      <Title />
      <br>
      <h3>Pick your puzzle</h3>
      <button class="difficulty-button" onclick={() => setDifficulty('Casual')}>Casual</button>
      <button class="difficulty-button" onclick={() => setDifficulty('Challenge')}>Challenge</button>
      <button class="difficulty-button" onclick={() => setDifficulty('Extreme')}>Extreme</button>
      </div>
      <p>New puzzles daily</p>
  {/if}
  {#if solved}
    <button class="next-level" onclick={() => goToNextLevel()}>Next Level</button>
  {/if}
</main>

<style>
  h1, h2 {
    margin: 0;
  }

  .welcome-screen {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: calc(min(100vh, 800px));
  }

  .difficulty-button {
    font-size: 16pt;
    width: 200px;
    padding: 10px;
    margin: auto;
    margin-top: 10px;
    margin-bottom: 10px;
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
