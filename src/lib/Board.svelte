<script lang="ts">
  import GoalIcon from './GoalIcon.svelte';
  import TileToken from './TileToken.svelte';
  import type { Puzzle } from './puzzle.svelte';

  let { puzzle }: {
    puzzle: Puzzle,
  } = $props();

  const spaceClick = (event: Event, row: number, col: number) => {
    event.stopPropagation();
    puzzle.selectSpace({row, col});
  }

  const col0 = $derived([puzzle.board[0][0], puzzle.board[1][0], puzzle.board[2][0], puzzle.board[3][0]])
  const col1 = $derived([puzzle.board[0][1], puzzle.board[1][1], puzzle.board[2][1], puzzle.board[3][1]])
  const col2 = $derived([puzzle.board[0][2], puzzle.board[1][2], puzzle.board[2][2], puzzle.board[3][2]])
  const col3 = $derived([puzzle.board[0][3], puzzle.board[1][3], puzzle.board[2][3], puzzle.board[3][3]])

  const cols = $derived([col0, col1, col2, col3]);
</script>

<div class='board'>
  <div></div>
  {#each puzzle.colGoals as goal, index}
    <GoalIcon tiles={cols[index]} {goal} type='column' position={index} />
  {/each}

  {#each puzzle.board as row, rowIndex}
    <GoalIcon tiles={row} goal={puzzle.rowGoals[rowIndex]} type='row' position={rowIndex} />
    {#each row as tile, colIndex}
      {#key tile}
        <div
          class="space {tile ? "" : "empty"}"
          data-row={rowIndex}
          data-col={colIndex}
          data-occupied={!!tile}
          role="button"
          onclick={() => !tile && spaceClick(event, rowIndex, colIndex)}
        >
          {#if tile}
            <TileToken {tile} {puzzle}/>
          {/if}
        </div>
      {/key}
    {/each}
  {/each}
</div>

<style>
  .board {
    margin-left: auto;
    margin-right: auto;
    display: grid;
    font-size: 36px;
    width: var(--board-width);
    max-width: var(--board-max-width);
    aspect-ratio: 1 / 1;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
    user-select: none;
    -webkit-user-select: none; /* Required for safari at time of writing */
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
