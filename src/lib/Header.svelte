<script lang="ts">
  import menuImageUri from '../assets/menu-burger-horizontal.svg';
  import goalArrowUri from '../assets/goal-arrow.svg';
  import undoIcon from '../assets/undo.svg';
  import { computePosition, autoUpdate, offset, shift } from '@floating-ui/dom';
  import { onMount } from 'svelte';
  import GoalIcon from './GoalIcon.svelte';
  import { red, green, white } from './tile';
  import ExampleTile from './ExampleTile.svelte';
  import TileToken from './TileToken.svelte';
  import Title from './Title.svelte';
  import type { Puzzle, Difficulty } from './puzzle.svelte';

  let {
    returnToMainMenu,
    resetPuzzle,
    difficulty,
    puzzle,
  }: {
    returnToMainMenu: () => void,
    resetPuzzle: () => void,
    difficulty: Difficulty,
    puzzle: Puzzle,
  } = $props();

  let menuButton: HTMLElement;
  let menu: HTMLElement;
  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    menu.style.display = isMenuOpen ? 'block' : 'none';
  }
  
  function closeMenu() {
    isMenuOpen = false;
    menu.style.display = 'none';
  }
  
  function handleClickOutside(event: MouseEvent) {
    if (isMenuOpen && !menuButton.contains(event.target as Node) && !menu.contains(event.target as Node)) {
      closeMenu();
    }
  }

  let exampleRowSequenceIndex = $state(0);
  const exampleRowSequence = [
    [null, null, null, null],
    [{suit: white, rank: 1}, null, null, null],
    [{suit: white, rank: 1}, {suit: green, rank: 1}, null, null],
    [{suit: white, rank: 1}, {suit: green, rank: 1}, {suit: red, rank: 4}, null],
    [{suit: white, rank: 1}, {suit: green, rank: 1}, {suit: red, rank: 4}, {suit: red, rank: 3}],
    [{suit: white, rank: 1}, {suit: green, rank: 1}, {suit: red, rank: 4}, {suit: red, rank: 3}],
    [{suit: white, rank: 1}, {suit: green, rank: 1}, {suit: red, rank: 4}, {suit: red, rank: 3}],
  ];
  const exampleGoal = {suits: [green, red, red, white], ranks: [ ]};
  const exampleGoalNumbers = {suits: [], ranks: [1, 1, 3, 4]};

  function runResetPuzzle() {
    resetPuzzle();
    const dialog = document.getElementById('reset-puzzle-dialog') as HTMLDialogElement;
    dialog.close();
  }

  let howToPlayExampleSequenceIntervalId = null;

  function showTutorial1() {
    exampleRowSequenceIndex = 0;
    if (!howToPlayExampleSequenceIntervalId) {
      howToPlayExampleSequenceIntervalId = setInterval(() => {
        exampleRowSequenceIndex += 1;
        exampleRowSequenceIndex %= exampleRowSequence.length;
      }, 1500)
    }

    const dialog = document.getElementById('tutorial-1-dialog') as HTMLDialogElement;
    dialog.showModal();
  }

  function showTutorial2() {
    exampleRowSequenceIndex = 0;
    if (!howToPlayExampleSequenceIntervalId) {
      howToPlayExampleSequenceIntervalId = setInterval(() => {
        exampleRowSequenceIndex += 1;
        exampleRowSequenceIndex %= exampleRowSequence.length;
      }, 1500)
    }

    const dialog = document.getElementById('tutorial-2-dialog') as HTMLDialogElement;
    dialog.showModal();
  }

  function showTutorial3() {
    const dialog = document.getElementById('tutorial-3-dialog') as HTMLDialogElement;
    dialog.showModal();
  }

  $effect(() => {
    if (difficulty === 'Tutorial1') {
      showTutorial1();
    }
    if (difficulty === 'Tutorial2') {
      showTutorial2();
    }
    if (difficulty === 'Tutorial3') {
      showTutorial3();
    }
  });

  function clearExampleSequence() {
    exampleRowSequenceIndex = 0;
    clearInterval(howToPlayExampleSequenceIntervalId);
    howToPlayExampleSequenceIntervalId = null;
  }

  function showDialog(dialogId: string) {
    const dialog = document.getElementById(dialogId) as HTMLDialogElement;
    dialog.showModal();
    closeMenu();
  }

  function handleDialogClick(event: MouseEvent) {
    const dialog = event.currentTarget as HTMLDialogElement;
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= event.clientY
      && event.clientY <= rect.top + rect.height
      && rect.left <= event.clientX
      && event.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      dialog.close();
    }
  }

  onMount(() => {
    menu.style.display = 'none';

    const removeMenuEvents = autoUpdate(menuButton, menu, () => {
      computePosition(menuButton, menu, {
        placement: 'bottom-end',
        middleware: [offset(6), shift()]
      }).then(({ x, y }) => {
        Object.assign(menu.style, {
          left: `${x}px`,
          top: `${y}px`
        });
      });
    });

    document.addEventListener('click', handleClickOutside);

    return () => {
      removeMenuEvents();
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>


<nav class='navbar'>
  <a class="unstyled" href="/" onclick={(event) => {event.preventDefault(); returnToMainMenu()}}>
    <Title />
  </a>
  <div class="nav-buttons">
    <button
      class="menu-button undo"
      aria-label="Undo"
      disabled={!puzzle.undoAvailable}
      onclick={() => puzzle.undo()}
      title="Undo"
    >
      <img src={undoIcon} class='icon' alt="undo icon" />
    </button>
    <button
      class="menu-button redo"
      aria-label="Redo"
      disabled={!puzzle.redoAvailable}
      onclick={() => puzzle.redo()}
      title="Redo"
    >
      <img src={undoIcon} class='icon' alt="Help icon" />
    </button>
    <div class="menu-container">
      <button bind:this={menuButton} onclick={toggleMenu} class="menu-button" aria-label="Menu">
        <img src={menuImageUri} class='icon' alt="redo icon" />
      </button>
      <div bind:this={menu} class="menu">
        <button class="menu-item" onclick={() => returnToMainMenu()}>Switch Difficulty</button>
        <button class="menu-item" onclick={() => showDialog('reset-puzzle-dialog')}>Reset Puzzle</button>
      </div>
    </div>
  </div>
</nav>

<dialog class="help-dialog" id="tutorial-1-dialog" onclick={handleDialogClick}>
  <h2>How To Play</h2>
  <p>Drag tiles onto the board to match the flowers for each row's and column's goal.</p>
  <h3>Example</h3>
  <div class="example-row">
    <img src={goalArrowUri} class='goal-arrow' alt="arrow labeled 'goal' pointing down"/>
  </div>
  <div class="example-row">
    <div class="goal">
      <GoalIcon
        tiles={exampleRowSequence[exampleRowSequenceIndex]}
        goal={exampleGoal}
        type='row'
        position={1}
      />
    </div>
    {#each exampleRowSequence[exampleRowSequenceIndex] as tile}
    <div class="space {tile ? "" : "empty"}">
      {#if tile}
        <ExampleTile {tile} showNumber={false} />
      {/if}
    </div>
    {/each}
  </div>
  <br />
  <hr />
  <form method="dialog">
    <button>Got It</button>
  </form>
</dialog>

<dialog class="help-dialog" id="tutorial-2-dialog" onclick={handleDialogClick}>
  <p>We put numbers on the tiles! <br /> Goals can require you to match numbers.</p>
  <h3>Example</h3>
  <div class="example-row">
    <img src={goalArrowUri} class='goal-arrow' alt="arrow labeled 'goal' pointing down"/>
  </div>
  <div class="example-row">
    <div class="goal">
      <GoalIcon
        tiles={exampleRowSequence[exampleRowSequenceIndex]}
        goal={exampleGoalNumbers}
        type='row'
        position={1}
      />
    </div>
    {#each exampleRowSequence[exampleRowSequenceIndex] as tile}
    <div class="space {tile ? "" : "empty"}">
            
      {#if tile}
        <ExampleTile {tile} />
      {/if}
    </div>
    {/each}
  </div>
  <br />
  <hr />
  <form method="dialog">
    <button>Got It</button>
  </form>
</dialog>

<dialog class="help-dialog" id="tutorial-3-dialog" onclick={handleDialogClick}>
  <div class="locked-example">
    <span>
      <TileToken tile={{suit: red, rank: 4}} locked={true} />
    </span>
    <span>
      Some puzzles have tiles already on the board to help you out!
      <br />
      These tiles cannot be moved.
    </span>
  </div>
  <hr />
  <form method="dialog">
    <button>Got It</button>
  </form>
</dialog>

<dialog id="reset-puzzle-dialog" onclick={handleDialogClick}>
  <h2>Reset Puzzle</h2>
  <p>Are you sure you want to reset this puzzle?</p>
  <div class="dialog-buttons">
    <form method="dialog">
      <button>Cancel</button>
    </form>
    <button onclick={runResetPuzzle} class="destructive">Reset Puzzle</button>
  </div>
</dialog>

<style>
  .navbar {
    height: var(--header-height);
    display: grid;
    width: 100%;
    background: #131313;
    margin-bottom: var(--header-margin);
    padding-left: 10px;
    padding-right: 10px;
    box-sizing: border-box;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
  }

  .locked-example {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }

  .puzzle {
    margin-left: auto;
    margin-right: auto;
    font-size: 16pt;
  }

  .nav-buttons {
    margin-left: auto;
    display: flex;
  }

  .icon {
    width: 2em;
    filter: invert();
    margin-left: 0.25em;
    margin-right: 0.25em;
  }

  .menu-container {
    position: relative;
  }

  .menu-button {
    background: none;
    border: none;
    padding: 0;
    display: flex;
    align-items: center;
  }

  .menu-button:disabled {
    filter: brightness(50%);
  }

  .menu {
    position: fixed;
    background: #1f1f1f;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    z-index: 2;
  }

  .menu-item {
    display: block;
    width: 100%;
    padding: 0.5em 1em;
    text-align: left;
    background: none;
    border: none;
    color: white;
    font-size: 12pt;
    white-space: nowrap;
  }

  .menu-item:hover {
    background: #2f2f2f;
  }

  .help-dialog {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    text-align: center;
    text-wrap: balance;
  }
  
  h2 {
    margin-top: 0;
  }

  dialog {
    width: min(400px, 80vw);
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.7);
  }

  .dialog-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1em;
    margin-top: 1em;
  }

  .destructive {
    background: #cc0000;
    color: white;
    border: none;
    padding: 0.5em 1em;
    border-radius: 4px;
  }

  .destructive:hover {
    background: #ff2222;
  }

  .goal {
    box-sizing: border-box;
    width: calc(var(--tile-width) / 1.3);
    aspect-ratio: 1 / 1;
    touch-action: none;
  }

  .space {
    box-sizing: border-box;
    width: calc(var(--tile-width) / 1.3);
    aspect-ratio: 1 / 1;
    border-radius: var(--tile-border-radius);
    touch-action: none;
    background-color: #242424;
  }
  
  .empty {
    border: 1px solid var(--border-color);
  }

  .example-row {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .goal-arrow {
    width: calc(var(--tile-width) / 1.3 * 5);
    filter: invert();
  }

  h3 {
    margin-bottom: 0px;
  }

  .unstyled {
    width: fit-content;
    color: inherit;
    text-decoration: inherit;
  }

  .undo {
    margin-left: 5px;
    margin-right: 5px;
  }

  .redo {
    transform: scaleX(-1);
    margin-left: 5px;
    margin-right: 5px;
  }
</style>
