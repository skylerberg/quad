<script lang="ts">
  import helpCircleOutlineUri from '../assets/help-circle-outline.svg';
  import lockUri from '../assets/lock.svg';
  import menuImageUri from '../assets/menu-burger-horizontal.svg';
  import goalArrowUri from '../assets/goal-arrow.svg';
  import { computePosition, autoUpdate, offset, shift } from '@floating-ui/dom';
  import { onMount } from 'svelte';
  import { getSuitIcon, allSuits } from './suit';
  import { levels } from './level';
  import ConditionIcon from './ConditionIcon.svelte';
  import { red, blue, green, white } from './suit';
  import ExampleTile from './ExampleTile.svelte';

  let {
    levelNumber,
    levelCount,
    completedLevels,
    runTacticalSolver,
    runBacktrackingSolver,
    countSolutions,
    resetLevel,
    goToLevel,
    generateRandomLevel,
    unlockAllLevels,
    lockAllLevels,
  }: {
    completedLevels: Array<string>
    levelNumber: number,
    levelCount: number,
    runBacktrackingSolver: () => undefined,
    countSolutions: () => undefined,
    runTacticalSolver: () => undefined,
    goToLevel: (level: number) => undefined,
    resetLevel: () => undefined,
    generateRandomLevel: () => undefined,
    unlockAllLevels: () => undefined,
    lockAllLevels: () => undefined,
  } = $props();

  let menuButton: HTMLElement;
  let menu: HTMLElement;
  let isMenuOpen = false;

  let highestUnlockedLevel = $state(0);

  $effect(() => {
    highestUnlockedLevel = Math.max(-1, ...completedLevels.map(
      id => levels.findIndex(level => level.id === id)
    )) + 1;
  });

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    menu.style.display = isMenuOpen ? 'block' : 'none';
  }
  
  function closeMenu() {
    isMenuOpen = false;
    menu.style.display = 'none';
  }
  
  function openMenu() {
    isMenuOpen = true;
    menu.style.display = 'block';
  }

  function handleClickOutside(event: MouseEvent) {
    if (isMenuOpen && !menuButton.contains(event.target as Node) && !menu.contains(event.target as Node)) {
      closeMenu();
    }
  }

  let exampleRowSequenceIndex = $state(0);
  const exampleRowSequence = [
    [null, null, null, null],
    [{suit: white, value: 1}, null, null, null],
    [{suit: white, value: 1}, {suit: green, value: 1}, null, null],
    [{suit: white, value: 1}, {suit: green, value: 1}, {suit: red, value: 4}, null],
    [{suit: white, value: 1}, {suit: green, value: 1}, {suit: red, value: 4}, {suit: red, value: 3}],
    [{suit: white, value: 1}, {suit: green, value: 1}, {suit: red, value: 4}, {suit: red, value: 3}],
    [{suit: white, value: 1}, {suit: green, value: 1}, {suit: red, value: 4}, {suit: red, value: 3}],
  ];
  const exampleCondition = {type: 'Contain', suits: [green, red, red, white], numbers: [ ]};

  function runResetLevel() {
    resetLevel();
    const dialog = document.getElementById('reset-level-dialog') as HTMLDialogElement;
    dialog.close();
  }

  function clearGameState() {
    resetLevel();
    lockAllLevels();
    localStorage.clear();
    goToLevel(1);
    const dialog = document.getElementById('reset-game-dialog') as HTMLDialogElement;
    dialog.close();
  }

  let howToPlayExampleSequenceIntervalId = null;

  function showHowToPlay() {
    localStorage.setItem('seenHowToPlay', 'true');

    exampleRowSequenceIndex = 0;
    if (!howToPlayExampleSequenceIntervalId) {
      howToPlayExampleSequenceIntervalId = setInterval(() => {
        exampleRowSequenceIndex += 1;
        exampleRowSequenceIndex %= exampleRowSequence.length;
      }, 1500)
    }

    const dialog = document.getElementById('how-to-play-dialog') as HTMLDialogElement;
    dialog.showModal();
  }

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

  function handleLevelSelect(level: number) {
    goToLevel(level);
    const dialog = document.getElementById('level-select-dialog') as HTMLDialogElement;
    dialog.close();
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

    if (!localStorage.getItem('seenHowToPlay')) {
      showHowToPlay();
    }

    return () => {
      removeMenuEvents();
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>


<nav class='navbar'>
  <span class='title'>
    <nobr>
      <span class='title-letter'>Q</span><span class='title-letter'>U</span><span class='title-letter'>A</span><span class='title-letter'>D</span>
    </nobr>
  </span>
  <span class='level'>Level {levelNumber}</span>
  <div class="nav-buttons">
    <button
      class="menu-button"
      aria-label="Help"
      onclick={() => showHowToPlay()}
      onclose={() => clearExampleSequence()}
    >
      <img src={helpCircleOutlineUri} class='icon' alt="Help icon" />
    </button>
    <div class="menu-container">
      <button bind:this={menuButton} onclick={toggleMenu} class="menu-button" aria-label="Menu">
        <img src={menuImageUri} class='icon' alt="Menu icon" />
      </button>
      <div bind:this={menu} class="menu">
        <button class="menu-item" onclick={() => showDialog('level-select-dialog')}>Go To Level</button>
        <button class="menu-item" onclick={() => showDialog('reset-level-dialog')}>Reset Level</button>
        <button class="menu-item" onclick={() => showDialog('reset-game-dialog')}>Reset Game</button>
        <button class="menu-item">💝 Donate</button>
        <hr />
        <span>Developer Options</span>
        <button class="menu-item" onclick={unlockAllLevels}>Unlock All Levels</button>
        <button class="menu-item" onclick={runTacticalSolver}>Tactical Solver</button>
        <button class="menu-item" onclick={runBacktrackingSolver}>Backtracking Solver</button>
        <button class="menu-item" onclick={countSolutions}>Count Solutions</button>
        <button class="menu-item" onclick={generateRandomLevel}>Generate Random Level</button>
      </div>
    </div>
  </div>
</nav>

<dialog id="how-to-play-dialog" onclick={handleDialogClick}>
  <h2>How To Play</h2>
  <p>Drag tiles onto the board<br /> to fulfill all row and column goals</p>
  <h3>Example</h3>
  <div class="example-row">
    <img src={goalArrowUri} class='goal-arrow' alt="arrow labeled 'goal' pointing down"/>
  </div>
  <div class="example-row">
    <div class="condition">
      <ConditionIcon
        level={{type: 'Tutorial'}}
        tiles={exampleRowSequence[exampleRowSequenceIndex]}
        condition={exampleCondition}
        type='row'
        position={1}
      />
    </div>
    {#each exampleRowSequence[exampleRowSequenceIndex] as tile}
    <div class="space {tile ? "" : "empty"}">
            
      {#if tile}
        <ExampleTile tile={tile} />
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

<dialog id="level-select-dialog" onclick={handleDialogClick}>
  <div class="level-section">
    <h2>Tutorial</h2>
  </div>
  <div class="level-grid">
    {#each levels as level, i}
      {#if level.section === 'Tutorial'}
        <button class="level-button" disabled='{i > highestUnlockedLevel}' onclick={() => handleLevelSelect(i + 1)}>
          {#if i > highestUnlockedLevel}
            <img class='level-lock-icon' src={lockUri} />
          {:else}
            Level {i + 1}
          {/if}
        </button>
      {/if}
    {/each}
  </div>

  <div class="level-section">
    <h2>Floral</h2>&nbsp;&nbsp;
    {#each allSuits as suit}
      <img class='suit-icon' src={getSuitIcon(suit)} />
    {/each}
  </div>
  <div class="level-grid">
    {#each levels as level, i}
      {#if level.section === 'Floral'}
        <button class="level-button" disabled='{i > highestUnlockedLevel}' onclick={() => handleLevelSelect(i + 1)}>
          {#if i > highestUnlockedLevel}
            <img class='level-lock-icon' src={lockUri} />
          {:else}
            Level {i + 1}
          {/if}
        </button>
      {/if}
    {/each}
  </div>
  <div class="level-section">
    <img class='section-icon' src={lockUri} />&nbsp;&nbsp;<h2>Locked</h2>
  </div>
  <div class="level-grid">
    {#each levels as level, i}
      {#if level.section === 'Elemental'}
        <button class="level-button" disabled='{i > highestUnlockedLevel}' onclick={() => handleLevelSelect(i + 1)}>
          {#if i > highestUnlockedLevel}
            <img class='section-icon' src={lockUri} />
          {:else}
            Level {i + 1}
          {/if}
        </button>
      {/if}
    {/each}
  </div>
  <div class="level-section">
    <img class='section-icon' src={lockUri} />&nbsp;&nbsp;<h2>Locked</h2>
  </div>
  <div class="level-grid">
    {#each levels as level, i}
      {#if level.section === 'Celestial'}
        <button class="level-button" disabled='{i > highestUnlockedLevel}' onclick={() => handleLevelSelect(i + 1)}>
          {#if i > highestUnlockedLevel}
            <img class='level-lock-icon' src={lockUri} />
          {:else}
            Level {i + 1}
          {/if}
        </button>
      {/if}
    {/each}
  </div>

  <div style="float: right">
  <form method="dialog">
    <button>Cancel</button>
  </form>
  </div>
</dialog>

<dialog id="reset-level-dialog" onclick={handleDialogClick}>
  <h2>Reset Level</h2>
  <p>Are you sure you want to reset this level?</p>
  <div class="dialog-buttons">
    <form method="dialog">
      <button>Cancel</button>
    </form>
    <button onclick={runResetLevel} class="destructive">Reset Level</button>
  </div>
</dialog>

<dialog id="reset-game-dialog" onclick={handleDialogClick}>
  <h2>Reset Game</h2>
  <p>Are you sure you want to clear all game data?</p>
  <p>This will reset all progress and return you to level 1.</p>
  <div class="dialog-buttons">
    <form method="dialog">
      <button>Cancel</button>
    </form>
    <button onclick={clearGameState} class="destructive">Clear All Data</button>
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
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
  }

  .title {
    font-size: 24px;
    align-self: center;
  }

  .title-letter {
    display: inline-flex;
    box-sizing: border-box;
    width: 35px;
    aspect-ratio: 1 / 1;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    justify-content: center;
    align-items: center;
    line-height: 1;
    font-size: 20pt;
    align-self: center;
    text-align: center;
  }

  .level {
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

  #how-to-play-dialog {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    text-align: center;
  }
  
  h2 {
    margin-top: 0;
  }

  .level-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 20px;
    max-height: 60vh;
    overflow-y: auto;
  }

  .level-button {
    padding: 10px;
    color: white;
    display: flex;
    align-items: center;
    white-space: nowrap;
    justify-content: center;
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

  .level-section {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .level-section > h2 {
    margin-bottom: 0;
  }

  .suit-icon {
    height: 2em;
  }

  .section-icon {
    height: 1.5em;
    filter: invert(100%);
    margin-top: -2px;
  }

  .level-lock-icon {
    height: 1.1em;
    filter: invert(95%);
    margin-right: 0.25em;
    margin-top: -2px;
  }

  .condition {
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

  .condition-example {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    width: var(--tile-width);
  }

  .goal-arrow {
    width: calc(var(--tile-width) / 1.3 * 5);
    filter: invert();
  }

  h3 {
    margin-bottom: 0px;
  }
</style>
