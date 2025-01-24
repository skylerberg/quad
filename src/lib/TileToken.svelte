<script lang="ts">
  import type { Suit } from './suit.ts';
  import type { Tile } from './tile.ts';
  import type { Location } from './tile.ts';
  import { suitSymbolToName } from './suit.ts';

  export let tile: Tile;
  export let location: Location;
  export let element;

  import { dragState } from './dragState.svelte.ts';

  const tileClasses = `tile ${suitSymbolToName(tile.suit)}`;

  const dragStart = () => {
    // Hide original element while dragging
    element.style.opacity = 0;

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

    // Stop hiding the element
    element.style.opacity = 1;
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
  <span class="tile-number">
  {tile.value}
  </span>
</div>

<style>
  .tile {
    display: flex;
    height: 50px;
    width: 50px;
    color: black;
    border-color: white;
    border-width: 1px;
    border-style: solid;
    justify-content: center;
    align-items: center;
    font-size: 36px;
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
