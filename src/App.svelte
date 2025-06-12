<script lang="ts">
  import Board from './lib/Board.svelte';
  import TileBag from './lib/TileBag.svelte';
  import DragHandler from './lib/DragHandler.svelte';
  import Header from './lib/Header.svelte';
  import StorageHandler from './lib/StorageHandler.svelte';
  import ShareButton from './lib/ShareButton.svelte';
  import tutorialPuzzles from './lib/puzzles/tutorial';
  import casualPuzzles from './lib/puzzles/casual';
  import challengePuzzles from './lib/puzzles/challenge';
  import expertPuzzles from './lib/puzzles/expert';
  import { currentDayIndex } from './lib/date';
  import Title from './lib/Title.svelte';
  import confetti from 'canvas-confetti';
  import { setContext } from 'svelte';
  import type { Difficulty, Change } from './lib/puzzle.svelte';
  import { Puzzle } from './lib/puzzle.svelte';
  import { makeUserId, logSolve } from './lib/analytics';
  import { getTileName } from './lib/tile';
  import includeServiceWorker from './includeServiceWorker';

  includeServiceWorker();

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
  const expertPuzzle = $state(new Puzzle(expertPuzzles[currentDayIndex()]));

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
    if (difficulty === 'Expert') {
      return expertPuzzle;
    }
    return null;
  });

  let solved: boolean | null = $derived.by(() => {
    if (puzzle) {
      return puzzle.check();
    }
    return null;
  });

  let userId: string = $state(makeUserId());
  const setUserId = (newId: string) => {
    userId = newId;
  }

  let completedPuzzles: Array<string> = $state([]);

  const setCompletedPuzzles = (puzzleIds: Array<string>) => {
    completedPuzzles = puzzleIds;
  }

  let casualPuzzleSolved = $derived(completedPuzzles.some(id => id == casualPuzzle.id));
  let challengePuzzleSolved = $derived(completedPuzzles.some(id => id == challengePuzzle.id));
  let expertPuzzleSolved = $derived(completedPuzzles.some(id => id == expertPuzzle.id));

  $effect(() => {
    if (puzzle && solved && !completedPuzzles.some(id => id === puzzle.id)) {
      completedPuzzles.push(puzzle.id);
      logSolve({userId, puzzleId: puzzle.id, difficulty});
      screenReaderStatusDiv.innerText = 'Congratulations! Puzzle finished.';

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

  let screenReaderStatusDiv: HTMLDivElement;

  const getAnnouncementText = (change: Change): string => {
    if (puzzle) {
      if (change.type === 'select') {
        return `Selected ${getTileName(change.tile, difficulty)}`;
      }
      else if (change.type === 'deselect') {
        return `Deselected ${getTileName(change.tile, difficulty)}`;
      }
      else if (change.type === 'place') {
        return `Placed ${getTileName(change.tile, difficulty)}`;
      }
      else if (change.type === 'remove') {
        return `Removed ${getTileName(change.tile, difficulty)}`;
      }
      else if (change.type === 'swap') {
        const firstTile = puzzle.board[change.first.row][change.first.col];
        const secondTile = puzzle.board[change.second.row][change.second.col];
        if (firstTile && secondTile) {
          return `Swapped position of ${getTileName(firstTile, difficulty)} and ${getTileName(secondTile, difficulty)}`;
        }
        else if (firstTile) {
          return `Moved ${getTileName(firstTile, difficulty)}`;
        }
        else if (secondTile) {
          return `Moved ${getTileName(secondTile, difficulty)}`;
        }
        return '';
      }
      else if (change.type === 'swap-bag') {
        return `Replaced ${getTileName(change.boardTile, difficulty)} with ${getTileName(change.bagTile, difficulty)}`;
      }
      else if (change.type === 'undo') {
        if (change.action.type === 'place') {
          return `Removed ${getTileName(change.action.tile, difficulty)}`;
        }
        else if (change.action.type === 'remove') {
          return `Placed ${getTileName(change.action.tile, difficulty)}`;
        }
        else if (change.action.type === 'swap') {
          return getAnnouncementText(change.action);
        }
        else if (change.action.type === 'swap-bag') {
          return `Replaced ${getTileName(change.action.bagTile, difficulty)} with ${getTileName(change.action.boardTile, difficulty)}`;
        }
      }
      else if (change.type === 'redo') {
        return getAnnouncementText(change.action);
      }
      else if (change.type === 'reset') {
        return 'Puzzle reset';
      }
    }
    else {
      throw Error('Attempted to make announcement but puzzle is not set');
    }
  }

  const announceChanges = (change: Change) => {
    screenReaderStatusDiv.innerText = getAnnouncementText(change);
  };

  $effect(() => {
    if (puzzle && puzzle.changeListeners.length === 0) {
      puzzle.registerListener(announceChanges);
    }
  })

  let addToHomeScreen: null | (() => Promise<void>) = $state(null);
  window.addEventListener('beforeinstallprompt', (event: any) => {
    addToHomeScreen = async () => {
      const result = await event.prompt();
      if (result.outcome === 'accepted') {
        addToHomeScreen = null;
      }
    };
  })
</script>

{#if puzzle && difficulty}
  <Header
    {puzzle}
    {difficulty}
    returnToMainMenu={() => setDifficulty(null)}
    {resetPuzzle}
    {addToHomeScreen}
  />
{/if}

<main>
  <StorageHandler
    {puzzle}
    {completedPuzzles}
    {setCompletedPuzzles}
    {setUserId}
    {userId}
  />
  {#if puzzle && difficulty}
    <Board {puzzle} {difficulty} />
    <TileBag {puzzle} {difficulty} />
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
        {:else if !expertPuzzleSolved}
          <button class="success-button" onclick={() => setDifficulty('Expert')}>Try Expert</button>
        {:else}
          <ShareButton casualPuzzleSolved={casualPuzzleSolved} {challengePuzzleSolved} expertPuzzleSolved={expertPuzzleSolved} />
        {/if}
      {/if}
      {#if difficulty === 'Challenge'}
        {#if !expertPuzzleSolved}
          <button class="success-button" onclick={() => setDifficulty('Expert')}>Try Expert</button>
        {:else}
          <ShareButton casualPuzzleSolved={casualPuzzleSolved} {challengePuzzleSolved} expertPuzzleSolved={expertPuzzleSolved} />
        {/if}
      {/if}
      {#if difficulty === 'Expert'}
        <ShareButton casualPuzzleSolved={casualPuzzleSolved} {challengePuzzleSolved} expertPuzzleSolved={expertPuzzleSolved} />
      {/if}

    {/if}
  {:else}
    <div class="welcome-screen">
      <span></span>
      <div class="welcome-main">
        <div role="heading" aria-level="1">
          <h2 role="presentation">Welcome to </h2>
          <Title />
          <br>
          <h3 role="presentation">Pick your puzzle</h3>
        </div>
        <button class="difficulty-button" onclick={() => setDifficulty('Tutorial1')}>Tutorial</button>
        <button class="difficulty-button" onclick={() => setDifficulty('Casual')}>Casual</button>
        <button class="difficulty-button" onclick={() => setDifficulty('Challenge')}>Challenge</button>
        <button class="difficulty-button" onclick={() => setDifficulty('Expert')}>Expert</button>
      </div>

      <p>New puzzles daily</p>
    </div>
  {/if}
</main>

<div
  aria-live="polite"
  role="status"
  bind:this={screenReaderStatusDiv}
  id="announcement"
>
</div>

<style>
  h2 {
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

  #announcement {
    text-indent: -9999em;
    outline: 0;
  }
</style>
