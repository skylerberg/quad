<script lang="ts">
  import type { Suit } from './suit.ts';
  import { suitSymbolToName } from './suit.ts';

  export let value: 1 | 2 | 3 | 4;
  export let suit: Suit
  export let element;

  import { dragState } from './dragState.svelte.ts';

  const tileClasses = `tile ${suitSymbolToName(suit)}`;

  const setDragging = () => {
    dragState.tile = {
      value,
      suit,
      element,
    }
  }

  const clearDragging = () => {
    dragState.tile = undefined;
  }
</script>


<div
    bind:this={element}
    ondragstart={setDragging}
    ondragend={clearDragging}
    draggable="true"
    class={tileClasses}
>
  <div class="background">{suit}</div>
  <span class="tile-number">
  {value}
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
