<script lang="ts">
  import type { Suit } from './suit';
  import type { Tile } from './tile';
  import type { Location } from './tile';
  import { suitSymbolToName } from './suit';
  import { dragState } from './dragState.svelte';

  let { tile, location  }: {
    tile: Tile,
    location: Location,
  } = $props();

  let element: HTMLElement;

  const tileClasses = `tile-token ${suitSymbolToName(tile.suit)}`;
</script>

<div
    bind:this={element}
    class={tileClasses}
    role="button"
    data-tile={JSON.stringify(tile)}
>
  <div class="background">{tile.suit}</div>
  <span class="tile-number">{tile.value}</span>
</div>

<style>
  .tile-token {
    box-sizing: border-box;
    display: flex;
    height: 50px;
    width: 50px;
    color: black;
    border: 1px solid white;
    justify-content: center;
    align-items: center;
    font-size: 36px;
    cursor: grab;
    touch-action: none;
    user-select: none;
  }

  .tile-number {
    z-index: 1;
    color: white;
    text-shadow: 1px 1px 2px black;
  }

  .background {
    position: absolute;
  }

  .red {
    background: darkred;
  }

  .blue {
    background: darkblue;
  }

  .white {
    background: black;
  }

  .green {
    background: lightgreen;
  }
</style>
