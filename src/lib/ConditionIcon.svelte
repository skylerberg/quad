<script lang="ts">
  import checkIcon from '../assets/check.svg';
  import { onMount } from 'svelte';
  import type { Condition } from './condition.ts';
  import { evaluate, getTitle } from './condition';
  import { getSuitIcon, suitSymbolToName } from './suit';
  import type { Tile } from './tile.ts';
  import type { Level } from './level.ts';
  import { computePosition, flip, shift, offset, arrow } from '@floating-ui/dom';

  let conditionDiv;
  let tooltipDiv;
  let arrowElement;

  let { tiles, condition, type, position, level }: {
    tiles: Array<Tile | undefined>,
    condition: Condition,
    type: 'row' | 'column',
    position: number,
    level: Level,
  } = $props();

  let status = $derived(evaluate(condition, tiles));

  const title = getTitle(level, condition, type);

  let classes = ['tile', 'condition'];
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


  function updateToolTip() {
    const placement = type === 'row' ? 'right' : 'bottom';
    computePosition(conditionDiv, tooltipDiv, {
      placement,
      middleware: [
        offset(6),
        flip(),
        shift({padding: 5}),
        arrow({element: arrowElement}),
      ],
    }).then(({x, y, placement, middlewareData}) => {
      Object.assign(tooltipDiv.style, {
        left: `${x}px`,
        top: `${y}px`,
      });

      // Accessing the data
      const {x: arrowX, y: arrowY} = middlewareData.arrow;
     
      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[placement.split('-')[0]];
     
      Object.assign(arrowElement.style, {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        right: '',
        bottom: '',
        [staticSide]: '-9px',
      });
    });
  }

  onMount(() => {
    function showTooltip() {
      tooltipDiv.style.display = 'block';
      updateToolTip();
    }
     
    function hideTooltip() {
      tooltipDiv.style.display = '';
    }
     
    [
      ['mouseenter', showTooltip],
      ['mouseleave', hideTooltip],
      ['focus', showTooltip],
      ['blur', hideTooltip],
    ].forEach(([event, listener]) => {
      conditionDiv.addEventListener(event, listener);
    });

    updateToolTip();
  });
</script>


<div bind:this={conditionDiv} class={classes.join(' ')}>
  {#if condition.type === 'SumGreaterThan'}
    Σ &gt; {condition.amount}
  {:else if condition.type === 'Contain'}
    <div class='two-by-two'>
      {#each condition.numbers as number}
        <div class='number-requirement'>{number}</div>
      {/each}
      {#each condition.suits as suit}
        <img class='suit-requirement' src={getSuitIcon(suit)} alt='Requires {suitSymbolToName(suit)}' />
      {/each}
    </div>
  {:else if condition.type === 'OddOrSuit'}
    Odd OR {condition.suit}
  {:else if condition.type === 'EvenOrSuit'}
    Even OR {condition.suit}
  {/if}

  {#if status}
    <img class="status succeeded" src={checkIcon} />
  {/if}
</div>
<div class="tooltip" bind:this={tooltipDiv} role="tooltip">
  <div class="arrow" bind:this={arrowElement}></div>
  <span style="position: relative">{title}</span>
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
    filter: drop-shadow(0px 0px 7px white);
  }

  .number-requirement {
    margin: auto;
    font-size: round(calc(var(--tile-width) / 2.4), 1px);
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

  .failed {
    filter: invert(37%) sepia(100%) saturate(7450%) hue-rotate(358deg) brightness(103%) contrast(127%); /* red */
    width: 70%;
    opacity: 0.6;
  }

  .succeeded {
    filter: invert(53%) sepia(79%) saturate(2879%) hue-rotate(85deg) brightness(121%) contrast(122%);
    width: 90%;
    opacity: 0.8;
  }

  .tooltip {
    display: none;
    width: max-content;
    max-width: calc(100vw - var(--tile-width) * 1.8);
    position: absolute;
    top: 0;
    left: 0;
    background: #444;
    color: white;
    font-weight: bold;
    padding: 5px;
    border-radius: 4px;
    font-size: 12pt;
  }
  
  :global(body.draggable--is-dragging) .tooltip {
    display: none !important;
  }

  .arrow {
    position: absolute;
    background: #444;
    width: 18px;
    height: 18px;
    transform: rotate(45deg);
  }

  .status {
    position: absolute;
  }

  .condition {
    position: relative;
  }
</style>
