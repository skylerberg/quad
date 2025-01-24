<script lang="ts">
  import Tile from './lib/Tile.svelte';
  import Board from './lib/Board.svelte';
  import type { Suit } from './lib/suit.ts';
  import { red, blue, white, green } from './lib/suit.ts';

  const values = [1, 2, 3, 4];
  const suits: Array<Suit> = [red, blue, white, green];
</script>

<main>
  <div class="tiles">
    {#each suits as suit}
      {#each values as value}
        <Tile value={value} suit={suit} />
      {/each}
    {/each}
  </div>

  <Board />
</main>

<style>
  .tiles {
    display: flex
  }
</style>
