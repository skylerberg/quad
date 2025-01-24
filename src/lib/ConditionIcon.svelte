<script lang="ts">
  let { tiles, condition }: {
    tiles: Array<{suit: Suit, value: number}>,
    condition: Condition
  } = $props();

  import type { Condition } from './condition.ts';
  import { evaluate } from './condition.ts';
  import type { Suit } from './suit.ts';

  let status = $derived(evaluate(condition, tiles));
</script>


<div class='tile'>
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
    <span class="status">🎉</span>
  {:else if status === false}
    <span class="status">❌</span>
  {/if}

</div>

<style>
  .tile {
    display: flex;
    height: 50px;
    width: 50px;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    border-right-color: white;
    border-right-width: 1px;
    border-right-style: solid;
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
