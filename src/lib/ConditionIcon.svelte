<script lang="ts">
  import type { Condition } from './condition.ts';
  import { evaluate, getTitle } from './condition';
  import { getSuitIcon, suitSymbolToName } from './suit';
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
  {:else if condition.type === 'ContainSuits'}
    <div class='two-by-two'>
      {#each condition.suits as suit}
        <img class='suit-requirement' src={getSuitIcon(suit)} alt='Requires {suitSymbolToName(suit)}' />
      {/each}
    </div>
  {:else if condition.type === 'ContainNumbers'}
    <div class='two-by-two'>
      {#each condition.numbers as number}
        <div class='number-requirement'>{number}</div>
      {/each}
    </div>
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
  .two-by-two {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    margin: auto;
    aspect-ratio: 1 / 1;
    width: 90%;
    height: 90%;
  }

  .suit-requirement {
    margin: auto;
    max-height: 90%;
    max-width: 90%;
  }

  .number-requirement {
    margin: auto;
    font-size: min(7vmin, 42px);
    line-height: 0.8;
  }

  .row-condition {
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
  }

  .row-condition.first {
    border-top: none;
  }

  .row-condition.last {
    border-bottom: none;
  }

  .column-condition {
    border-right: 1px solid var(--border-color);
    border-left: 1px solid var(--border-color);
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
    width: 100%;
    aspect-ratio: 1 / 1;
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
    z-index: -1;
    opacity: 0.75;
    font-size: min(15vmin, 58pt);
  }
</style>
