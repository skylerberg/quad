<script lang="ts">
  import type { Suit } from './suit';
  import { getSuitIcon, suitSymbolToName } from './suit';

  let { suit }: {
    suit: Suit,
  } = $props();

  const tileClasses = `tile-token ${suitSymbolToName(suit)}`;
</script>

<div
    class={tileClasses}
    role="button"
    style="background-image: url({getSuitIcon(suit)});"
>
</div>

<style>
  .tile-token {
    box-sizing: border-box;
    aspect-ratio: 1 / 1;
    border: 2px solid var(--border-color);
    border-radius: var(--tile-border-radius);
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
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
