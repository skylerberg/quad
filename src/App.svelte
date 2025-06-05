<script lang="ts">

  import Board from './lib/Board.svelte';
  import TileBag from './lib/TileBag.svelte';
  import DragHandler from './lib/DragHandler.svelte';
  import Header from './lib/Header.svelte';
  import StorageHandler from './lib/StorageHandler.svelte';
  import ShareButton from './lib/ShareButton.svelte';
  import type { Tile } from './lib/tile';
  import tutorialPuzzles from './lib/puzzles/tutorial';
  import casualPuzzles from './lib/puzzles/casual';
  import challengePuzzles from './lib/puzzles/challenge';
  import extremePuzzles from './lib/puzzles/extreme';
  import { currentDayIndex } from './lib/date';
  import Title from './lib/Title.svelte';
  import confetti from 'canvas-confetti';
  import { setContext } from 'svelte';
  import type { Difficulty } from './lib/puzzle.svelte';
  import { Puzzle } from './lib/puzzle.svelte';

  let difficulty: Difficulty | null = $state(null);

  let tutorialSettings: {hideNumbers: boolean} = $state({hideNumbers: false});
  $effect(() => {
    if (difficulty === 'Tutorial1') {
      tutorialSettings.hideNumbers = true;
    }
    else {
      tutorialSettings.hideNumbers = false;
    }
  })
  setContext('tutorialSettings', tutorialSettings);

  const setDifficulty = (newDifficulty: Difficulty | null) => {
    difficulty = newDifficulty;
    history.pushState({difficulty}, '');
  }

  const tutorials = $state([
    new Puzzle(tutorialPuzzles[0]),
    new Puzzle(tutorialPuzzles[1]),
    new Puzzle(tutorialPuzzles[2]),
  ]);

  const casualPuzzle = $state(new Puzzle(casualPuzzles[currentDayIndex()]));
  const challengePuzzle = $state(new Puzzle(challengePuzzles[currentDayIndex()]));
  const extremePuzzle = $state(new Puzzle(extremePuzzles[currentDayIndex()]));

  let puzzle: Puzzle | null = $derived.by(() => {
    if (difficulty === 'Tutorial1') {
      return tutorials[0];
    }
    if (difficulty === 'Tutorial2') {
      return tutorials[1];
    }
    if (difficulty === 'Tutorial3') {
      return tutorials[2];
    }
    if (difficulty === 'Casual') {
      return casualPuzzle;
    }
    if (difficulty === 'Challenge') {
      return challengePuzzle;
    }
    if (difficulty === 'Extreme') {
      return extremePuzzle;
    }
    return null;
  });

  let solved: boolean | null = $derived.by(() => {
    if (puzzle) {
      return puzzle.check();
    }
    return null;
  });

  let completedPuzzles: Array<string> = $state([]);

  const setCompletedPuzzles = (puzzleIds: Array<string>) => {
    completedPuzzles = puzzleIds;
  }

  let casualPuzzleSolved = $derived(completedPuzzles.some(id => id == casualPuzzle.id));
  let challengePuzzleSolved = $derived(completedPuzzles.some(id => id == challengePuzzle.id));
  let extremePuzzleSolved = $derived(completedPuzzles.some(id => id == extremePuzzle.id));

  $effect(() => {
    if (puzzle && solved && !completedPuzzles.some(id => id === puzzle.id)) {
      completedPuzzles.push(puzzle.id);

      confetti({
        particleCount: 100,
        disableForReducedMotion: true,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  })

  const resetPuzzle = () => {
    if (puzzle) {
      puzzle.reset();
    }
  }

  addEventListener('popstate', (event) => {
    difficulty = event.state && event.state.difficulty;
  });

  window.addEventListener('click', () => {
    if (puzzle) {
      puzzle.selectedTile = undefined;
    }
  });

  window.addEventListener('keydown', (event: KeyboardEvent) => {
    if (puzzle) {
      if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.key === 'z') {
        if (puzzle.undoAvailable) {
          puzzle.undo();
        }
      }
      if (
        ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'Z')
        || ((event.ctrlKey || event.metaKey) && event.key === 'r')
        || ((event.ctrlKey || event.metaKey) && event.key === 'y')
      ) {
        if (puzzle.redoAvailable) {
          puzzle.redo();
        }
      }
    }
  });
</script>

{#if puzzle && difficulty}
  <Header
    {puzzle}
    {difficulty}
    returnToMainMenu={() => setDifficulty(null)}
    {resetPuzzle}
  />
{/if}

<main>
  <StorageHandler
    {puzzle}
    {completedPuzzles}
    {setCompletedPuzzles}
  />
  {#if puzzle}
    <Board {puzzle} />
    <TileBag {puzzle} />
    <DragHandler {puzzle} />

    {#if solved}
      {#if difficulty === 'Tutorial1'}
        <button class="success-button" onclick={() => setDifficulty('Tutorial2')}>Continue</button>
      {/if}
      {#if difficulty === 'Tutorial2'}
        <button class="success-button" onclick={() => setDifficulty('Tutorial3')}>Continue</button>
      {/if}
      {#if difficulty === 'Tutorial3'}
        <button class="success-button" onclick={() => setDifficulty(null)}>All Done!</button>
      {/if}
      {#if difficulty === 'Casual'}
        {#if !challengePuzzleSolved}
          <button class="success-button" onclick={() => setDifficulty('Challenge')}>Try Challenge</button>
        {:else if !extremePuzzleSolved}
          <button class="success-button" onclick={() => setDifficulty('Extreme')}>Try Extreme</button>
        {:else}
          <ShareButton casualPuzzleSolved={casualPuzzleSolved} {challengePuzzleSolved} {extremePuzzleSolved} />
        {/if}
      {/if}
      {#if difficulty === 'Challenge'}
        {#if !extremePuzzleSolved}
          <button class="success-button" onclick={() => setDifficulty('Extreme')}>Try Extreme</button>
        {:else}
          <ShareButton casualPuzzleSolved={casualPuzzleSolved} {challengePuzzleSolved} {extremePuzzleSolved} />
        {/if}
      {/if}
      {#if difficulty === 'Extreme'}
        <ShareButton casualPuzzleSolved={casualPuzzleSolved} {challengePuzzleSolved} {extremePuzzleSolved} />
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
        <button class="difficulty-button" onclick={() => setDifficulty('Tutorial1')}>Tutorial</button>
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
