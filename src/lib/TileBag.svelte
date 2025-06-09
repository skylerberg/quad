<script lang="ts">
  import TileToken from './TileToken.svelte';
  import type { Difficulty, Puzzle } from './puzzle.svelte';
  import type { Tile } from './tile';
  import { tilesAreEqual, allRanks, allSuits } from './tile';

  let { puzzle, difficulty }: {
    puzzle: Puzzle,
    difficulty: Difficulty,
  } = $props();

  const tilesNotOnBoard = () => {
    const tiles = [];
    for (const suit of allSuits) {
      for (const rank of allRanks) {
        const tile = {suit, rank, locked: false};
        if (!puzzle.board.some(row => row.some(tileOnBoard => tileOnBoard && tilesAreEqual(tileOnBoard, tile)))) {
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

  const handleClick = (event: Event) => {
    event.stopPropagation();
    puzzle.selectTileBag();
  }
</script>

<div
  class="tile-bag"
  onclick={handleClick}
  role="region"
  aria-label="unplaced tiles"
>
  {#each Object.entries(tilesBySuit) as [suit, tilesOfSuit]}
    <div class="suit-group" class:empty={tilesOfSuit.length === 0}>
      {#each allRanks as rank}
        {#if tilesOfSuit.some(tile => tile.rank === rank)}
          <TileToken tile={tilesOfSuit.find(t => t.rank === rank)} {puzzle} {difficulty} />
        {:else}
          <div class="blank-tile"></div>
        {/if}
      {/each}
    </div>
  {/each}
</div>

<style>
  .tile-bag {
    display: flex;
    flex-wrap: wrap;
    max-width: min(92vw, 900px);
    margin-left: auto;
    margin-right: auto;
    min-height: 50px;
    padding-top: 20px;
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
