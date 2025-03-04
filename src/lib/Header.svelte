<script lang="ts">
  import helpCircleOutlineUri from '../assets/help-circle-outline.svg';
  import menuImageUri from '../assets/menu-burger-horizontal.svg';
  import { computePosition, autoUpdate, offset, shift } from '@floating-ui/dom';
  import { onMount } from 'svelte';

  let { levelNumber, levelCount, runTacticalSolver, runBacktrackingSolver, resetLevel, goToLevel, generateRandomLevel }: {
    levelNumber: number,
    levelCount: number,
    runBacktrackingSolver: () => undefined,
    runTacticalSolver: () => undefined,
    goToLevel: (level: number) => undefined,
    resetLevel: () => undefined,
    generateRandomLevel: () => undefined,
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
  
  function openMenu() {
    isMenuOpen = true;
    menu.style.display = 'block';
  }

  function handleClickOutside(event: MouseEvent) {
    if (isMenuOpen && !menuButton.contains(event.target as Node) && !menu.contains(event.target as Node)) {
      closeMenu();
    }
  }

  onMount(() => {
    menu.style.display = 'none';

    const cleanup = autoUpdate(menuButton, menu, () => {
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
      cleanup();
      document.removeEventListener('click', handleClickOutside);
    };
  });

  function showResetLevelDialog() {
    const dialog = document.getElementById('reset-level-dialog') as HTMLDialogElement;
    dialog.showModal();
    closeMenu();
  }

  function showResetGameDialog() {
    const dialog = document.getElementById('reset-game-dialog') as HTMLDialogElement;
    dialog.showModal();
    closeMenu();
  }

  function runResetLevel() {
    resetLevel();
    const dialog = document.getElementById('reset-level-dialog') as HTMLDialogElement;
    dialog.close();
  }

  function clearGameState() {
    localStorage.clear();
    goToLevel(1);
    const dialog = document.getElementById('reset-game-dialog') as HTMLDialogElement;
    dialog.close();
  }

  function showLevelDialog(dialogId: string) {
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
</script>


<nav class='navbar'>
  <span class='title'>
    <nobr>
      <span class='title-letter'>Q</span><span class='title-letter'>U</span><span class='title-letter'>A</span><span class='title-letter'>D</span>
    </nobr>
  </span>
  <span class='level'>Level {$levelNumber}</span>
  <div class="nav-buttons">
    <button class="menu-button" aria-label="Help" onclick={() => showLevelDialog('how-to-play-dialog')}>
      <img src={helpCircleOutlineUri} class='icon' alt="Help icon" />
    </button>
    <div class="menu-container">
      <button bind:this={menuButton} onclick={toggleMenu} class="menu-button" aria-label="Menu">
        <img src={menuImageUri} class='icon' alt="Menu icon" />
      </button>
      <div bind:this={menu} class="menu">
        <button class="menu-item" onclick={() => showLevelDialog('level-select-dialog')}>Go To Level</button>
        <button class="menu-item" onclick={showResetLevelDialog}>Reset Level</button>
        <button class="menu-item" onclick={showResetGameDialog}>Reset Game</button>
        <button class="menu-item">💝 Donate</button>
        <hr />
        <span>Developer Options</span>
        <button class="menu-item" onclick={runTacticalSolver}>Tactical Solver</button>
        <button class="menu-item" onclick={runBacktrackingSolver}>Backtracking Solver</button>
        <button class="menu-item" onclick={generateRandomLevel}>Generate Random Level</button>
      </div>
    </div>
  </div>
</nav>

<dialog id="how-to-play-dialog" onclick={handleDialogClick}>
  <h2>How To Play</h2>
  <p>Place all 16 tiles and meet the goal for each row and column</p>
  <hr />
  <p></p>
  <form method="dialog">
    <button>Got It</button>
  </form>
</dialog>

<dialog id="level-select-dialog" onclick={handleDialogClick}>
  <h2>Select Level</h2>
  <div class="level-grid">
    {#each Array(levelCount) as _, i}
      <button class="level-button" onclick={() => handleLevelSelect(i + 1)}>Level {i + 1}</button>
    {/each}
  </div>
  <form method="dialog">
    <button>Cancel</button>
  </form>
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
    height: 50px;
    display: grid;
    width: 100%;
    background: #131313;
    margin-bottom: 1em;
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
    cursor: pointer;
  }

  .menu {
    position: fixed;
    background: #1f1f1f;
    border: 1px solid var(--border-color);
    border-radius: 4px;
  }

  .menu-item {
    display: block;
    width: 100%;
    padding: 0.5em 1em;
    text-align: left;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
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
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
    margin-bottom: 20px;
    max-height: 60vh;
    overflow-y: auto;
  }

  .level-button {
    padding: 10px;
    background: #2f2f2f;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: white;
    cursor: pointer;
  }

  .level-button:hover {
    background: #3f3f3f;
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
    cursor: pointer;
  }

  .destructive:hover {
    background: #ff2222;
  }
</style>
