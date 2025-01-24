<script lang="ts">
  const rows = [
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ];

  const rowConditions = [];
  const colConditions = [];

  import { dragState } from './dragState.svelte.ts';
  import ConditionIcon from './ConditionIcon.svelte';
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
        <div
            on:dragover|preventDefault={undefined}
            class='space'
        >
          {space.value}
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
    <div class='row-condition'></div>
  {/each}

  <ConditionIcon condition={{type: 'SumGreaterThan', amount: 11}} />
  <ConditionIcon condition={{type: 'EvenOrSuit', suit: red}} />
  <ConditionIcon condition={{type: 'EachSuit' }} />
  <ConditionIcon condition={{type: 'EachNumber' }} />
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
