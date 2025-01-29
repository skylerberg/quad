<script lang="ts">
  import Board from './lib/Board.svelte';
  import TileBag from './lib/TileBag.svelte';
  import DragHandler from './lib/DragHandler.svelte';
  import { levels } from './lib/level.ts';
  import { onMount } from 'svelte';

  let level = $state(0);
</script>

<h1>Tile Game</h1>
<h2>Level {level + 1}</h2>
<main>
  {#key level}
    <Board level={levels[level]} />
    <TileBag />
    <DragHandler />
  {/key}
  <button onclick={() => level += 1}>Next Level</button>
</main>
