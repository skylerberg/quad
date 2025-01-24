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
  {value}
</div>

<style>
  .tile {
    display: flex;
    height: 50px;
    width: 50px;
    border-color: white;
    border-width: 1px;
    border-style: solid;
    justify-content: center;
    align-items: center;
    font-size: 36px;
  }

  .red {
    background: red;
  }

  .blue {
    background: blue;
  }

  .white {
    background: gray;
  }

  .green {
    background: brown;
  }
</style>
