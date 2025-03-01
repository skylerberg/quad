<script lang="ts">
  import { onMount } from 'svelte';
  import ConditionIcon from './ConditionIcon.svelte';
  import TileToken from './TileToken.svelte';
  import type { Tile } from './tile';
  import type { Condition } from './condition';
  import { red, blue } from './suit';
  import type { Level } from './level';
  import { solve, tacticalSolver, checkPuzzle } from './solver';

  let { level, board }: {
    level: Level,
    board: Array<Array<Tile | undefined>>
  } = $props();

  let rows = board;

  const col0 = $derived([rows[0][0], rows[1][0], rows[2][0], rows[3][0]])
  const col1 = $derived([rows[0][1], rows[1][1], rows[2][1], rows[3][1]])
  const col2 = $derived([rows[0][2], rows[1][2], rows[2][2], rows[3][2]])
  const col3 = $derived([rows[0][3], rows[1][3], rows[2][3], rows[3][3]])

  const cols = $derived([col0, col1, col2, col3]);


  //let solution = tacticalSolver(level); 
  ////let solution = solve(level); 
  //if (solution) {
  //  //rows = solution;
  //}

  //const iterations = 1000;
  //let wins = 0;

  //for (let i = 0; i < iterations; i++) {
  //  const attempt = tacticalSolver(level);
  //  if (checkPuzzle(level, attempt)) {
  //    wins += 1;
  //  }
  //}

  //console.log(wins / iterations, wins, iterations);
</script>

<div class='board'>
  {#each rows as row, rowIndex}
    {#each row as tile, colIndex}
      {#key tile}
        <div
            class="space {tile ? "" : "empty"}"
            data-row={rowIndex}
            data-col={colIndex}
        >
          {#if tile}
            <TileToken tile={tile} location={{row: rowIndex, col: colIndex}}/>
          {/if}
        </div>
      {/key}
    {/each}
    <ConditionIcon tiles={row} condition={level.rowConditions[rowIndex]} type='row' position={rowIndex} />
  {/each}

  {#each level.colConditions as condition, index}
    <ConditionIcon tiles={cols[index]} condition={condition} type='column' position={index} />
  {/each}
</div>

<style>
  .board {
    margin-left: auto;
    margin-right: auto;
    display: grid;
    font-size: 36px;
    width: 90vmin;
    max-width: var(--board-max-width);
    aspect-ratio: 1 / 1;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
  }

  .space {
    box-sizing: border-box;
    aspect-ratio: 1 / 1;
    border-radius: var(--tile-border-radius);
    touch-action: none;
    background-color: #242424;
  }
  
  .empty {
    border: 1px solid var(--border-color);
  }
</style>
