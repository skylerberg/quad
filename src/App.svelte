<script lang="ts">
  import Board from './lib/Board.svelte';
  import TileBag from './lib/TileBag.svelte';
  import DragHandler from './lib/DragHandler.svelte';
  import Header from './lib/Header.svelte';
  import StorageHandler from './lib/StorageHandler.svelte';
  import { levels } from './lib/level.ts';
  import type { Tile } from './tile';
  import { writable, derived } from 'svelte/store';

  let board: Array<Array<Tile | undefined>> = $state([
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ]);

  let levelIndex: number = writable(0);
  let level = derived(levelIndex, ($levelIndex) => levels[$levelIndex]);
  let levelNumber: number = derived(levelIndex, ($levelIndex) => $levelIndex + 1);

  const goToNextLevel = () => {
    $levelIndex += 1;
  }
</script>


<Header levelNumber={levelNumber} />

<main>
  <StorageHandler bind:levelIndex bind:board />
  <!-- TODO figure out how to get the board to clear without needing this key -->
  {#key $levelIndex}
    <Board board={board} level={levels[$levelIndex]} />
    <TileBag board={board} />
    <DragHandler bind:board />
  {/key}
  <button onclick={() => goToNextLevel()}>Next Level</button>
</main>

<style>
  .navbar {
    height: 50px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    background: #131313;
    margin-bottom: 1em;
  }

  .title {
    margin-left: 0.25em;
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
    font-size: 28px;
    align-self: center;
    text-align: center;
  }

  .level {
    font-size: 20px;
    align-self: center;
  }

  .nav-buttons {
    display: flex
  }

  .icon {
    width: 2em;
    filter: invert();
    margin-left: 0.25em;
    margin-right: 0.25em;
    align-self: center;
  }

  #how-to-play-dialog {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    text-align: center;
    max-width: min(400px, 80vw);
  }

  main {
    max-width: 1280px;
    margin: 0 auto;
    text-align: center;
  }
</style>
