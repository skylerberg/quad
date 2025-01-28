<script lang="ts">
  import { onMount } from 'svelte';
  import { dragState } from './dragState.svelte';
  import ConditionIcon from './ConditionIcon.svelte';
  import TileToken from './TileToken.svelte';
  import type { Tile } from './tile';
  import type { Condition } from './condition';
  import { red, blue } from './suit';
  import { levels } from './level';

  let rows: Array<Array<Tile | undefined>> = $state([
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ]);

  const col0 = $derived([rows[0][0], rows[1][0], rows[2][0], rows[3][0]])
  const col1 = $derived([rows[0][1], rows[1][1], rows[2][1], rows[3][1]])
  const col2 = $derived([rows[0][2], rows[1][2], rows[2][2], rows[3][2]])
  const col3 = $derived([rows[0][3], rows[1][3], rows[2][3], rows[3][3]])

  const cols = $derived([col0, col1, col2, col3]);

  const level = levels[2];

  const dropOnEmptySpace = (row: number, col: number) => {
    if (dragState.tile) {
      rows[row][col] = dragState.tile;
      dragState.droppedOnBoard = true;
    }
  }

  onMount(() => {

    const placedOnBoard = (event) => {
      const { row, col, tile } = event.detail;
      rows[row][col] = tile;
    };
    const removedFromBoard = (event) => {
      const { row, col } = event.detail;
      rows[row][col] = undefined;
    };
    const swappedBoardSpaces = (event) => {
      const { to, from } = event.detail;
      const fromTile = rows[from.row][from.col];
      rows[from.row][from.col] = rows[to.row][to.col];
      rows[to.row][to.col] = fromTile;
    };

    window.addEventListener('placed-on-board', placedOnBoard);
    window.addEventListener('removed-from-board', removedFromBoard);
    window.addEventListener('swapped-board-spaces', swappedBoardSpaces);

    return () => {
      window.removeEventListener('placed-on-board', placedOnBoard);
      window.removeEventListener('removed-from-board', removedFromBoard);
      window.removeEventListener('swapped-board-spaces', swappedBoardSpaces);
    };
  });
</script>

<div class='board'>
  {#each rows as row, rowIndex}
    {#each row as tile, colIndex}
      {#key tile}
      {#if tile}
        <div
            class='space'
            data-row={rowIndex}
            data-col={colIndex}
        >
          <TileToken tile={tile} location={{row: rowIndex, col: colIndex}}/>
        </div>
      {:else}
        <div
            class='space'
            data-row={rowIndex}
            data-col={colIndex}
        >
        </div>
      {/if}
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
    height: 250px;
    width: 250px;
    font-size: 36px;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
  }

  .space {
    box-sizing: border-box;
    border: 1px solid white;
    height: 50px;
    width: 50px;
    touch-action: none;
  }
</style>
