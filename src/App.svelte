<script lang="ts">
  import Board from './lib/Board.svelte';
  import TileBag from './lib/TileBag.svelte';
  import DragHandler from './lib/DragHandler.svelte';
  import StorageHandler from './lib/StorageHandler.svelte';
  import { levels } from './lib/level.ts';
  import { onMount } from 'svelte';
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

  const goToNextLevel = () => {
    $levelIndex += 1;
  }
</script>

<h1>Tile Game</h1>
<h2>Level {$levelIndex + 1}</h2>
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
