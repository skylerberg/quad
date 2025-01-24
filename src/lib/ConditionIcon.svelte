<script lang="ts">
  import type { Condition } from './condition.ts';
  import { evaluate, getTitle } from './condition';
  import type { Tile } from './tile.ts';

  let { tiles, condition, type, position }: {
    tiles: Array<Tile | undefined>,
    condition: Condition,
    type: 'row' | 'column',
    position: number,
  } = $props();

  let status = $derived(evaluate(condition, tiles));

  const title = getTitle(condition, type);

  let classes = ['tile'];
  if (type === 'row') {
    classes.push('row-condition')
  }
  else {
    classes.push('column-condition')
  }
  if (position === 0) {
    classes.push('first');
  }
  else if (position === 3) {
    classes.push('last');
  }
</script>


<div title={title} class={classes.join(' ')}>
  {#if condition.type === 'SumGreaterThan'}
    Σ &gt; {condition.amount}
  {:else if condition.type === 'EachSuit'}
    🔥&nbsp;🌊
    <br />
    🌪️&nbsp;🌱
  {:else if condition.type === 'EachNumber'}
    1&nbsp;&nbsp;2
    <br />
    3&nbsp;&nbsp;4
  {:else if condition.type === 'OddOrSuit'}
    Odd OR {condition.suit}
  {:else if condition.type === 'EvenOrSuit'}
    Even OR {condition.suit}
  {/if}

  {#if status}
    <span class="status">✅</span>
  {:else if status === false}
    <span class="status">❌</span>
  {/if}

</div>

<style>
  .row-condition {
    border-top: 1px solid white;
    border-bottom: 1px solid white;
  }

  .row-condition.first {
    border-top: none;
  }

  .row-condition.last {
    border-bottom: none;
  }

  .column-condition {
    border-right: 1px solid white;
    border-left: 1px solid white;
  }

  .column-condition.first {
    border-left: none;
  }

  .column-condition.last {
    border-right: none;
  }

  .tile {
    box-sizing: border-box;
    display: flex;
    height: 50px;
    width: 50px;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    line-height: 1.1;
  }

  div.tile:last-child {
    border-right-width: 0px;
    border-right-style: none;
  }

  .status {
    position: absolute;
    font-size: 24pt;
    z-index: -1;
    opacity: 0.75;
  }
</style>
