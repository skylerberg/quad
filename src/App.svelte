<script lang="ts">
  import Board from './lib/Board.svelte';
  import TileBag from './lib/TileBag.svelte';
  import DragHandler from './lib/DragHandler.svelte';
  import Header from './lib/Header.svelte';
  import StorageHandler from './lib/StorageHandler.svelte';
  import ShareButton from './lib/ShareButton.svelte';
  import type { Level, Difficulty } from './lib/level';
  import type { Tile } from './lib/tile';
  import { checkPuzzle } from './lib/checker';
  import casualLevels from './lib/levels/casual';
  import challengeLevels from './lib/levels/challenge';
  import extremeLevels from './lib/levels/extreme';
  import { currentDayIndex } from './lib/date';
  import Title from './lib/Title.svelte';
  import confetti from 'canvas-confetti';

  let board: Array<Array<Tile | null>> = $state([
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ]);

  let difficulty: Difficulty | null = $state(null);

  const setDifficulty = (newDifficulty: Difficulty | null) => {
    difficulty = newDifficulty;
    history.pushState({difficulty}, '');
  }

  const casualLevel = casualLevels[currentDayIndex()];
  const challengeLevel = challengeLevels[currentDayIndex()];
  const extremeLevel = extremeLevels[currentDayIndex()];

  let level: Level | null = $derived.by(() => {
    if (difficulty === 'Casual') {
      return casualLevel;
    }
    if (difficulty === 'Challenge') {
      return challengeLevel;
    }
    if (difficulty === 'Extreme') {
      return extremeLevel;
    }
    return null;
  });

  let solved: boolean | null = $derived.by(() => {
    if (level) {
      return checkPuzzle(level, board)
    }
    return null;
  });

  let completedLevels: Array<string> = $state([]);

  const setCompletedLevels = (levelIds: Array<string>) => {
    completedLevels = levelIds;
  }

  let casualLevelSolved = $derived(completedLevels.some(id => id == casualLevel.id));
  let challengeLevelSolved = $derived(completedLevels.some(id => id == challengeLevel.id));
  let extremeLevelSolved = $derived(completedLevels.some(id => id == extremeLevel.id));

  $effect(() => {
    if (level && solved && !completedLevels.some(id => id === level.id)) {
      completedLevels.push(level.id);

      confetti({
        particleCount: 100,
        disableForReducedMotion: true,
        spread: 70,
        origin: { y: 0.6 }
      });
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

  const share = () => {
    let shareText = "Check out today's Quad\n\nquad.skylerberg.com";
    if (casualLevelSolved && challengeLevelSolved && extremeLevelSolved) {
      shareText = "I solved every Quad today!\n\nquad.skylerberg.com";
    }
    else if (casualLevelSolved && extremeLevelSolved) {
      shareText = "I solved today's casual and extreme Quad!\n\nquad.skylerberg.com";
    }
    else if (challengeLevelSolved && extremeLevelSolved) {
      shareText = "I solved today's challenge and extreme Quad!\n\nquad.skylerberg.com";
    }
    else if (extremeLevelSolved) {
      shareText = "I solved today's extreme Quad!\n\nquad.skylerberg.com";
    }
    navigator.clipboard.writeText(shareText);
  }

  addEventListener("popstate", (event) => {
    difficulty = event.state && event.state.difficulty;
  })
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

    {#if solved}
      {#if difficulty === 'Casual'}
        {#if !challengeLevelSolved}
          <button class="success-button" onclick={() => setDifficulty('Challenge')}>Try Challenge</button>
        {:else if !extremeLevelSolved}
          <button class="success-button" onclick={() => setDifficulty('Extreme')}>Try Extreme</button>
        {:else}
          <ShareButton {casualLevelSolved} {challengeLevelSolved} {extremeLevelSolved}/>
        {/if}
      {/if}
      {#if difficulty === 'Challenge'}
        {#if !extremeLevelSolved}
          <button class="success-button" onclick={() => setDifficulty('Extreme')}>Try Extreme</button>
        {:else}
          <ShareButton {casualLevelSolved} {challengeLevelSolved} {extremeLevelSolved}/>
        {/if}
      {/if}
      {#if difficulty === 'Extreme'}
        <ShareButton {casualLevelSolved} {challengeLevelSolved} {extremeLevelSolved}/>
      {/if}

    {/if}
  {:else}
    <div class="welcome-screen">
      <span></span>
      <div class="welcome-main">
        <h2>Welcome to </h2>
        <Title />
        <br>
        <h3>Pick your puzzle</h3>
        <!-- <button class="difficulty-button" onclick={() => setDifficulty('Tutorial')}>Tutorial</button> -->
        <button class="difficulty-button" onclick={() => setDifficulty('Casual')}>Casual</button>
        <button class="difficulty-button" onclick={() => setDifficulty('Challenge')}>Challenge</button>
        <button class="difficulty-button" onclick={() => setDifficulty('Extreme')}>Extreme</button>
      </div>

      <p>New puzzles daily</p>
    </div>
  {/if}
</main>

<style>
  h1, h2 {
    margin: 0;
  }

  .welcome-screen {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100dvh;
  }

  .welcome-main {
    display: flex;
    flex-direction: column;
  }

  .difficulty-button {
    font-size: 16pt;
    width: 200px;
    padding: 15px;
    margin: auto;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  main {
    max-width: 1280px;
    margin: 0 auto;
    text-align: center;
  }
</style>
