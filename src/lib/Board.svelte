<script lang="ts">
  const rows = $state([
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


  import { dragState } from './dragState.svelte.ts';
  import ConditionIcon from './ConditionIcon.svelte';
  import Tile from './Tile.svelte';
  import { red, blue } from './suit.ts';

  const dropOnEmptySpace = (event, row, col) => {
    if (dragState.tile) {
      dragState.tile.element.remove();
      rows[row][col] = {
        value: dragState.tile.value,
        suit: dragState.tile.suit,
        tile: dragState.tile,
      }
    }
  }
</script>


<div class='board'>
  {#each rows as row, rowIndex}
    {#each row as space, colIndex}
      {#if space}
        <Tile value={space.value} suit={space.suit} />
      {:else}
        <div
            on:dragover|preventDefault={undefined}
            on:drop={(event) => dropOnEmptySpace(event, rowIndex, colIndex)}
            class='space'
        >
        </div>
      {/if}
    {/each}
    <ConditionIcon tiles={row} condition={rowConditions[rowIndex]} />
  {/each}

  {#each colConditions as condition, index}
    <ConditionIcon tiles={cols[index]} condition={condition} />
  {/each}
</div>

<style>
  .board {
    display: grid;
    height: 250px;
    width: 250px;
    font-size: 36px;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
  }

  .space {
    border-color: white;
    border-width: 1px;
    border-style: solid;
  }

  .row-condition {
    border-color: white;
    border-width: 1px;
    border-style: solid;
    border-right: none;
  }

  .column-condition {
    border-color: white;
    border-width: 1px;
    border-style: solid;
    border-bottom: none;
  }
</style>
