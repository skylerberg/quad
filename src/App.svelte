<script lang="ts">
  import {polyfill} from "mobile-drag-drop";

  import Board from './lib/Board.svelte';
  import TileBag from './lib/TileBag.svelte';

  polyfill({})
</script>

<h1>Tile Game</h1>
<main>
  <Board />
  <TileBag />
</main>
