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

  let tilesBySuit = $derived.by(() => {
    const result: Record<string, Tile[]> = {};
    for (const suit of allSuits) {
      result[suit] = tiles.filter(tile => tile.suit === suit);
    }
    return result;
  });
</script>

<main>
  <div class="tile-bag">
    {#each Object.entries(tilesBySuit) as [suit, tilesOfSuit]}
      <div class="suit-group" class:empty={tilesOfSuit.length === 0}>
        {#each allNumbers as number}
          {#if tilesOfSuit.some(tile => tile.value === number)}
            <TileToken tile={tilesOfSuit.find(t => t.value === number)} location="bag" />
          {:else}
            <div class="blank-tile"></div>
          {/if}
        {/each}
      </div>
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
    margin-top: 20px;
    justify-content: center;
  }

  .suit-group {
    display: flex;
    margin: 5px;
    gap: 10px;
    justify-content: center;
  }
  
  .suit-group.empty {
    margin-top: 0px;
    margin-bottom: 0px;
  }

  .blank-tile {
    width: var(--tile-width, 40px);
    height: 0;
  }
</style>
