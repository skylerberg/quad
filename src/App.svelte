<script lang="ts">
  import Board from './lib/Board.svelte';
  import TileBag from './lib/TileBag.svelte';
</script>

<main>
  <TileBag />
  <br />

  <Board />
</main>

<style>
  .tiles {
    display: flex
  }
</style>
