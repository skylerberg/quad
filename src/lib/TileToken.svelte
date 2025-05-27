<script lang="ts">
  import type { Tile } from './tile';
  import { getSuitIcon, suitSymbolToName } from './tile';

  let { tile }: {
    tile: Tile,
  } = $props();

  let element: HTMLElement;

  const tileClasses = `tile-token ${suitSymbolToName(tile.suit)}`;
</script>

<div
    bind:this={element}
    class={tileClasses}
    role="button"
    data-tile={JSON.stringify(tile)}
    style="background-image: url({getSuitIcon(tile.suit)});"
>
  <span>{tile.rank}</span>
</div>

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
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    filter: drop-shadow(5px 5px 2px black);
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
