<script lang="ts">
  import ConditionIcon from './ConditionIcon.svelte';
  import TileToken from './TileToken.svelte';
  import type { Tile } from './tile';
  import type { Level } from './level';

  let { level, board }: {
    level: Level,
    board: Array<Array<Tile | null>>
  } = $props();

  const col0 = $derived([board[0][0], board[1][0], board[2][0], board[3][0]])
  const col1 = $derived([board[0][1], board[1][1], board[2][1], board[3][1]])
  const col2 = $derived([board[0][2], board[1][2], board[2][2], board[3][2]])
  const col3 = $derived([board[0][3], board[1][3], board[2][3], board[3][3]])

  const cols = $derived([col0, col1, col2, col3]);
</script>

<div class='board'>
  {#each board as row, rowIndex}
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
    width: min(90vw, 40vh);
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
