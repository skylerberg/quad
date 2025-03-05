<script lang="ts">
  import { getContext } from 'svelte';
  import type { Tile } from './tile';
  import { getSuitIcon, suitSymbolToName } from './suit';

  let { tile }: {
    tile: Tile,
  } = $props();

  let numberVisibility: { hidden: boolean } = getContext('numberVisibility');

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
  <span class={{'hide-numbers': numberVisibility.hidden}}>{tile.value}</span>
</div>

<style>
  .tile-token {
    box-sizing: border-box;
    display: flex;
    width: var(--tile-width);
    aspect-ratio: 1 / 1;
    border: 2px solid var(--border-color);
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
  }

  .hide-numbers {
    display: none;
  }

  .background {
    position: absolute;
  }

  .background {
    position: absolute;
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
