<script lang="ts">
  import { onMount } from 'svelte';
  import { dragState } from './dragState.svelte.ts';
  import ConditionIcon from './ConditionIcon.svelte';
  import TileToken from './TileToken.svelte';
  import { red, blue } from './suit.ts';

  const rows: Array<Array<Tile | undefined>> = $state([
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

  const rowConditions = [
    {type: 'SumGreaterThan', amount: 11},
    {type: 'OddOrSuit', suit: blue},
    {type: 'EachSuit' },
    {type: 'EachNumber' },
  ];

  const colConditions = [
    {type: 'SumGreaterThan', amount: 11},
    {type: 'EvenOrSuit', suit: red},
    {type: 'EachSuit' },
    {type: 'EachNumber' },
  ];

  const dropOnEmptySpace = (event, row, col) => {
    if (dragState.tile) {
      rows[row][col] = dragState.tile;
      dragState.droppedOnBoard = true;
    }
  }

  onMount(() => {
    const tileDroppedHandler = () => {
      if (dragState.draggingFrom !== 'bag') {
        const {row, col} = dragState.draggingFrom;
        rows[row][col] = undefined;
      }
    };

    window.addEventListener('tile-dropped', tileDroppedHandler);

    return () => {
      window.removeEventListener('tile-dropped', tileDroppedHandler);
    };
  });
</script>


<div class='board'>
  {#each rows as row, rowIndex}
    {#each row as tile, colIndex}
      {#if tile}
        <div class='space'>
          <TileToken tile={tile} location={{row: rowIndex, col: colIndex}}/>
        </div>
      {:else}
        <div
            on:dragover|preventDefault={undefined}
            on:drop={(event) => dropOnEmptySpace(event, rowIndex, colIndex)}
            class='space'
        >
        </div>
      {/if}
    {/each}
    <ConditionIcon tiles={row} condition={rowConditions[rowIndex]} type='row' position={rowIndex} />
  {/each}

  {#each colConditions as condition, index}
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
  }
</style>
