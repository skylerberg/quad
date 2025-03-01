<script lang="ts">
  import TileToken from './TileToken.svelte';
  import type { Tile } from './tile.ts';
  import { tilesAreEqual, allNumbers } from './tile.ts';
  import { allSuits } from './suit';

  let { board }: {
    board: Array<Array<Tile | undefined>>
  } = $props();

  const tilesNotOnBoard = () => {
    const tiles = [];
    for (const suit of allSuits) {
      for (const value of allNumbers) {
        const tile = {suit, value};
        if (!board.some(row => row.some(tileOnBoard => tileOnBoard && tilesAreEqual(tileOnBoard, tile)))) {
          tiles.push(tile);
        }
      }
    }
    return tiles;
  }

  let tiles = $derived.by(tilesNotOnBoard);
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
