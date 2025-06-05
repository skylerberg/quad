<script lang="ts">
  import { getContext } from 'svelte';
  import type { Tile } from './tile';
  import { getSuitIcon, suitSymbolToName, tilesAreEqual } from './tile';
  import type { Puzzle } from './puzzle.svelte';

  let tutorialSettings: { hideNumbers: boolean } = getContext('tutorialSettings');

  let { tile, puzzle }: {
    tile: Tile,
    puzzle: Puzzle | undefined,
  } = $props();

  const tileClasses = $derived(
    [
      'tile-token',
      suitSymbolToName(tile.suit),
      tile.locked ? 'locked' : 'unlocked',
      (puzzle && tilesAreEqual(tile, puzzle.selectedTile)) ? 'selected' : '',
    ].join(' ')
  );
</script>

<!--
The draggable library blocks click events on the button but the click will still propagate.
We catch it and stop it in this outer span so that dragging doesn't also count as clicking
the space or the tile bag that the token is in.
-->
<span
  onclick={(event) => event.stopPropagation()}
>
  <button
    class={tileClasses}
    data-tile={JSON.stringify(tile)}
    style="background-image: url({getSuitIcon(tile.suit)});"
  >
    <span>
      {#if !tutorialSettings.hideNumbers}
        {tile.rank}
      {/if}
    </span>
  </button>
</span>

<style>
  .tile-token {
    box-sizing: border-box;
    display: flex;
    width: var(--tile-width);
    aspect-ratio: 1 / 1;
    border: 1px solid var(--tile-border-color);
    border-radius: var(--tile-border-radius);
    justify-content: center;
    align-items: center;
    line-height: 1;
    font-size: round(calc(var(--tile-width) / 2.8), 1px);
    cursor: grab;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none; /* needed for safari as of writing this app */
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    filter: drop-shadow(5px 5px 2px black);
  }

  .tile-token.locked {
    background-color: unset;
    cursor: unset;
  }

  .tile-token.selected:not(.draggable-mirror) {
    border-color: white;
    box-shadow:
      inset 0 0 1px 1px #666,
      inset 0 0 5px 3px white
    ;
  }

  .red {
    color: black;
    background-color: rgb(155, 95, 53);
  }

  .blue {
    color: white;
    background-color: rgb(135, 195, 255);
  }

  .white {
    background-color: rgb(255, 230, 128);
    color: black;
  }

  .green {
    color: white;
    background-color: rgb(184, 255, 137);
  }
</style>
