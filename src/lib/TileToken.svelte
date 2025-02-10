<script lang="ts">
  import type { Suit } from './suit';
  import type { Tile } from './tile';
  import { getSuitIcon, suitSymbolToName } from './suit';

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
  <span class="tile-number">{tile.value}</span>
</div>

<style>
  .tile-token {
    box-sizing: border-box;
    display: flex;
    width: min(18vmin, calc(500px / 5));
    aspect-ratio: 1 / 1;
    border: 2px solid var(--border-color);
    border-radius: var(--tile-border-radius);
    justify-content: center;
    align-items: center;
    line-height: 1;
    font-size: min(14vmin, 68px);
    cursor: grab;
    touch-action: none;
    user-select: none;
    background-size: min(15vmin, 80px);
    background-position: center;
    background-repeat: no-repeat;
  }

  .tile-number {
    z-index: 1;
    color: white;
    text-shadow: 2px 2px 4px black;
  }

  .background {
    position: absolute;
  }

  .background {
    position: absolute;
  }
  
  .red {
    background-color: darkred;
  }

  .blue {
    background-color: darkblue;
  }

  .white {
    background-color: black;
  }

  .green {
    background-color: darkgreen;
  }
</style>
