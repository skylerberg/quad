<script lang="ts">
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
    width: calc((var(--tile-width) / 4) - 0.50px);
    aspect-ratio: 1 / 1;
    border: 1px solid var(--border-color);
    border-radius: 3px;
    justify-content: center;
    align-items: center;
    line-height: .1;
    font-size: min(2.5vmin, 68px);
    background-size: min(2vmin, 80px);
    background-position: center;
    background-repeat: no-repeat;
    box-sizing: border-box;
    opacity: 0.4;
  }

  .tile-number {
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
