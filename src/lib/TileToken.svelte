<script lang="ts">
  import type { Suit } from './suit.ts';
  import type { Tile } from './tile.ts';
  import type { Location } from './tile.ts';
  import { suitSymbolToName } from './suit.ts';
  import { dragState } from './dragState.svelte.ts';

  let { tile, location  }: {
    tile: Tile,
    location: Location,
  } = $props();

  let element: HTMLElement;

  const tileClasses = `tile ${suitSymbolToName(tile.suit)}`;

  const dragStart = (event) => {
    dragState.tile = tile;
    dragState.draggingFrom = location;


    window.dispatchEvent(
      new CustomEvent('tile-picked-up')
    );
  }

  const dragEnd = () => {
    // return to bag if it was not dropped on the board
    window.dispatchEvent(
      new CustomEvent('tile-dropped')
    );

    // Reset dragState
    dragState.tile = undefined;
    dragState.droppedOnBoard = false;
    dragState.draggingFrom = undefined;
  }
</script>


<div
    bind:this={element}
    ondragstart={dragStart}
    ondragend={dragEnd}
    draggable="true"
    class={tileClasses}
>
  <div class="background">{tile.suit}</div>
  <span class="tile-number">{tile.value}</span>
</div>

<style>
  .tile {
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
  }

  .tile-number {
    z-index: 1;
  }

  .background {
    position: absolute;
  }

  .red {
    background: darkred;
  }

  .blue {
    background: darkblue;
    color: white;
  }

  .white {
    color: white;
    background: black;
  }

  .green {
    background: lightgreen;
  }
</style>
