<script lang="ts">
  import { onMount } from 'svelte';
  import TileToken from './TileToken.svelte';
  import type { Suit } from './suit.ts';
  import type { Tile, TileValue } from './tile.ts';
  import { tilesAreEqual } from './tile.ts';
  import { red, blue, white, green } from './suit';
  import { dragState } from './dragState.svelte';

  const values: Array<TileValue> = [1, 2, 3, 4];
  const suits: Array<Suit> = [red, blue, white, green];
  let tiles: Array<Tile> = $state([])
  for (const suit of suits) {
    for (const value of values) {
      tiles.push({suit, value});
    }
  }

  function sortTiles() {
    tiles.sort((a, b) => {
      if (a.suit > b.suit) {
        return 1;
      }
      else if (a.suit < b.suit) {
        return -1;
      }
      else {
        if (a.value > b.value) {
          return 1;
        }
        else if (a.value < b.value) {
          return -1;
        }
        return 0;
      }
    })
  };

  sortTiles()

  onMount(() => {
    const removedFromBag = (event) => {
      const removedTile = event.detail.tile;
      tiles = tiles.filter((tile) => !tilesAreEqual(tile, removedTile));
    };

    const addedToBag = (event) => {
      tiles.push(event.detail.tile);
      sortTiles();
    };

    window.addEventListener('removed-from-bag', removedFromBag);
    window.addEventListener('added-to-bag', addedToBag);

    return () => {
      window.removeEventListener('removed-from-bag', removedFromBag);
      window.removeEventListener('added-to-bag', addedToBag);
    };
  });
</script>

<main>
  <div class="tile-bag">
    {#each tiles as tile (tile.suit + tile.value)}
      <TileToken tile={tile} location="bag" />
    {/each}
  </div>
</main>

<style>
  .tile-bag {
    display: flex;
    flex-wrap: wrap;
    max-width: min(92vw, 900px);
    margin-left: auto;
    margin-right:auto;
    min-height: 50px;
    margin-top: 25px;
    gap: 10px;
    justify-content: center;
  }
</style>
