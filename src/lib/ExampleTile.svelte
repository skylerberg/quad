<script lang="ts">
  import type { Tile } from './tile';
  import { getSuitIcon, suitSymbolToName } from './tile';

  let { tile, showNumber = true }: {
    tile: Tile,
    showNumber: boolean,
  } = $props();

  const tileClasses = `tile-token ${suitSymbolToName(tile.suit, 'Casual')}`;
</script>

<div
    class={tileClasses}
    role="button"
    style="background-image: url({getSuitIcon(tile.suit, 'Casual')});"
>
  <span>
    {#if showNumber}
      {tile.rank}
    {/if}
  </span>
</div>

<style>
  .tile-token {
    box-sizing: border-box;
    display: flex;
    aspect-ratio: 1 / 1;
    border: 1px solid var(--tile-border-color);
    border-radius: var(--tile-border-radius);
    justify-content: center;
    align-items: center;
    line-height: 1;
    font-size: round(calc(var(--tile-width) / 3.8), 1px);
    cursor: grab;
    touch-action: none;
    user-select: none;
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    filter: drop-shadow(5px 5px 2px black);
  }

  .rose {
    color: black;
    background-color: rgb(155, 95, 53);
  }

  .lotus {
    color: white;
    background-color: rgb(135, 195, 255);
  }

  .daisy {
    background-color: rgb(255, 230, 128);
    color: black;
  }

  .tulip {
    color: white;
    background-color: rgb(184, 255, 137);
  }
</style>
