<script lang="ts">
  import Board from './lib/Board.svelte';
  import TileBag from './lib/TileBag.svelte';
  import DragHandler from './lib/DragHandler.svelte';
  import StorageHandler from './lib/StorageHandler.svelte';
  import { levels } from './lib/level.ts';
  import { onMount } from 'svelte';
  import type { Tile } from './tile';
  import { writable, derived } from 'svelte/store';
  import helpCircleOutlineUri from './assets/help-circle-outline.svg';

  let board: Array<Array<Tile | undefined>> = $state([
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ]);

  let levelIndex: number = writable(0);
  let level = derived(levelIndex, ($levelIndex) => levels[$levelIndex]);

  const goToNextLevel = () => {
    $levelIndex += 1;
  }
</script>


<h2>Level {$levelIndex + 1}</h2>
<img src={helpCircleOutlineUri} class='help-icon' />

<dialog id="how-to-play-dialog" open>
  <h2>How To Play</h2>
  <p>Place all 16 tiles and meet the goal for each row and column</p>
  <hr />
  <p></p>
  <form method="dialog">
    <button>Got It</button>
  </form>
</dialog>

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
  .help-icon {
    width: 2em;
    filter: invert();
  }

  #how-to-play-dialog {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    text-align: center;
    max-width: min(400px, 80vw);
  }
</style>
