<script lang="ts">
  import { onMount } from 'svelte';
  import TileToken from './TileToken.svelte';
  import type { Suit } from './suit.ts';
  import type { Tile, TileValue } from './tile.ts';
  import { red, blue, white, green } from './suit';
  import { dragState } from './dragState.svelte';

  const values: Array<TileValue> = [1, 2, 3, 4];
  const suits: Array<Suit> = [red, blue, white, green];
  const tiles: Array<Tile> = $state([])
  for (const suit of suits) {
    for (const value of values) {
      tiles.push({suit, value});
    }
  }

  onMount(() => {
    const tileDroppedHandler = () => {
      if (dragState.droppedOnBoard && dragState.draggingFrom === 'bag') {
        const tileIndex = tiles.findIndex((tile) => tile === dragState.tile);
        if (tileIndex !== -1) {
          tiles.splice(tileIndex, 1);
        }
      }
      else if (dragState.tile && !dragState.droppedOnBoard && dragState.draggingFrom !== 'bag') {
        tiles.push(dragState.tile);
      }
    };

    window.addEventListener('tile-dropped', tileDroppedHandler);

    return () => {
      window.removeEventListener('tile-dropped', tileDroppedHandler);
    };
  });
</script>

<main>
  <div class="tiles">
    {#each tiles as tile (tile.suit + tile.value)}
      <TileToken tile={tile} location="bag" />
    {/each}
  </div>
</main>

<style>
  .tiles {
    display: flex;
    flex-wrap: wrap;
    max-width: 90vw;
    margin-left: auto;
    margin-right:auto;
    min-height: 50px;
    margin-top: 25px;
  }
</style>
