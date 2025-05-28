<script lang="ts">
  import Draggable from '@shopify/draggable/build/esm/Draggable/Draggable';
  import { onMount } from 'svelte';
  import type { Tile } from './tile';
  import type { Level } from './level';

  let { level, board }: {
    level: Level,
    board: Array<Array<Tile | null>>
  } = $props();

  let draggable = $state(undefined);
  let draggedOverSpace = undefined;
  let tileInDraggedOverSpace = undefined;

  const removeFromBoard = (row: number, col: number) => {
    if (!level.hints[row][col]) {
      board[row][col] = null;
    }
  }

  const placeOnBoard = (row: number, col: number, tile: Tile) => {
    if (!level.hints[row][col]) {
      board[row][col] = tile;
    }
  }

  const swapBoardSpaces = (first: {row: number, col: number}, second: {row: number, col: number}) => {
    if (!level.hints[second.row][second.col]) {
      const fromTile = board[first.row][first.col];
      board[first.row][first.col] = board[second.row][second.col];
      board[second.row][second.col] = fromTile;
    }
  }

  onMount(() => {
    const containers = document.querySelectorAll('.board, .tile-bag');
    draggable = new Draggable(containers, {
      draggable: '.unlocked',
      delay: {
        touch: 0,
      },
      ghostClass: '.being-dragged',
    });

    draggable.on('drag:move', (event) => {
      if (event.sensorEvent.target) {
        draggedOverSpace = event.sensorEvent.target.closest('.space');
        tileInDraggedOverSpace = event.sensorEvent.target.closest('.tile-token');
      }
    });

    draggable.on('drag:stop', (event) => {
      const tileToken = event.source;
      const tile = JSON.parse(tileToken.dataset.tile);
      const draggingFrom = event.sourceContainer.classList.contains('board') ? 'board' : 'bag';
      const droppedOnSpace = draggedOverSpace;

      if (droppedOnSpace && draggingFrom === 'bag') {
        const row = droppedOnSpace.dataset.row;
        const col = droppedOnSpace.dataset.col;
        placeOnBoard(row, col, tile);
      }

      else if (draggingFrom === 'board' && droppedOnSpace) {
        const from = { row: tileToken.parentNode.dataset.row, col: tileToken.parentNode.dataset.col };
        const to = { row: droppedOnSpace.dataset.row, col: droppedOnSpace.dataset.col };
        swapBoardSpaces(from, to);
      }

      else if (draggingFrom === 'board' && !droppedOnSpace) {
        const row = tileToken.parentNode.dataset.row;
        const col = tileToken.parentNode.dataset.col;
        removeFromBoard(row, col);
      }

      draggedOverSpace = undefined;
      tileInDraggedOverSpace = undefined;
    });

    return () => {
      draggable.destroy();
    };
  })
</script>
