<script lang="ts">
  import { getContext } from 'svelte';
  import type { Tile } from './tile';
  import { getSuitIcon, suitSymbolToName, tilesAreEqual, blue, green, red, white  } from './tile';
  import type { Puzzle, Difficulty } from './puzzle.svelte';

  let tutorialSettings: { hideNumbers: boolean } = getContext('tutorialSettings');

  let { tile, puzzle, difficulty }: {
    tile: Tile,
    puzzle: Puzzle | undefined,
    difficulty: Difficulty
  } = $props();


  let tileColor = $state('white');
  let textColor = $state('black');
  let symbolName = $state(suitSymbolToName(tile.suit, difficulty));

  const releaseElements = true;

  if (tile.suit === blue) {
    if (releaseElements && difficulty === 'Challenge') {
      //tileColor = 'rgb(177, 213, 255)';
      tileColor = '#9fcbff';
      textColor = 'white';
    }
    else {
      tileColor = 'rgb(135, 195, 255)';
      textColor = 'white';
    }
  }
  else if (tile.suit === green) {
    if (releaseElements && difficulty === 'Challenge') {
      //tileColor = '#a9ff91';
      tileColor = '#c7ffb8';
      textColor = 'black';
    }
    else {
      tileColor = 'rgb(184, 255, 137)';
      textColor = 'white';
    }
  }
  else if (tile.suit === red) {  // Fire
    if (releaseElements && difficulty === 'Challenge') {
      //tileColor = '#52260b';
      tileColor = '#ffcd75';
    }
    else {
      tileColor = 'rgb(155, 95, 53)';
      textColor = 'black';
    }
  }
  else if (tile.suit === white) {
    if (releaseElements && difficulty === 'Challenge') {
      //tileColor = '#353535';
      //tileColor = '#eee';
      tileColor = '#ebebeb';
      textColor = 'black';
    }
    else {
      tileColor = 'rgb(255, 230, 128)';
      textColor = 'black';
    }
  }
  if (tile.locked) {
    tileColor = "unset";
  }

  const handleEnter = (event: KeyboardEvent) => {
    if (puzzle && !tile.locked && (event.key === 'Enter' || event.key === ' ')) {
      puzzle.selectTile(tile);
    }
  }

  let selected = $derived((puzzle && tilesAreEqual(tile, puzzle.selectedTile)));

  const tileClasses = $derived(
    [
      'tile-token',
      tile.locked ? 'locked' : 'unlocked',
      selected ? 'selected' : '',
    ].join(' ')
  );
</script>

<!--
The draggable library blocks click events on the button but the click will still propagate.
We catch it and stop it in this outer span so that dragging doesn't also count as clicking
the space or the tile bag that the token is in.
-->
<span
  onclick={(event) => event.stopPropagation()}
  role="none"
>
  <button
    class={tileClasses}
    data-tile={JSON.stringify(tile)}
    style="background-image: url({getSuitIcon(tile.suit, difficulty)}); background-color: {tileColor}; color: {textColor}"
    onkeydown={handleEnter}
    aria-label="{symbolName} {tile.rank} {tile.locked ? 'immovable' : ''} {selected ? 'selected' : ''}"
  >
    <span aria-hidden="true">
      {#if !tutorialSettings.hideNumbers}
        {tile.rank}
      {/if}
    </span>
  </button>
</span>

<style>
  .tile-token {
    box-sizing: border-box;
    display: flex;
    width: var(--tile-width);
    aspect-ratio: 1 / 1;
    border: 1px solid var(--tile-border-color);
    border-radius: var(--tile-border-radius);
    justify-content: center;
    align-items: center;
    line-height: 1;
    font-size: round(calc(var(--tile-width) / 2.8), 1px);
    cursor: grab;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none; /* needed for safari as of writing this app */
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    filter: drop-shadow(5px 5px 2px black);
  }

  .tile-token.locked {
    background-color: unset;
    cursor: unset;
  }

  .tile-token.selected:not(.draggable-mirror) {
    border-color: white;
    box-shadow:
      inset 0 0 1px 1px #666,
      inset 0 0 5px 3px white
    ;
  }

  .tile-token.locked:active {
    border-color: red;
    box-shadow:
      inset 0 0 1px 1px #666,
      inset 0 0 5px 3px red
    ;
  }

</style>
