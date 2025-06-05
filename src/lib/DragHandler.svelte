<script lang="ts">
  import Draggable from '@shopify/draggable/build/esm/Draggable/Draggable';
  import { onMount } from 'svelte';
  import type { Puzzle } from './puzzle.svelte';

  let { puzzle }: {
    puzzle: Puzzle,
  } = $props();

  let draggable = $state(undefined);
  let draggedOverSpace = undefined;
  let notDraggedFar = true;

  onMount(() => {
    const containers = document.querySelectorAll('.board, .tile-bag');
    draggable = new Draggable(containers, {
      draggable: '.unlocked',
      delay: {
        touch: 0,
      },
      ghostClass: '.being-dragged',
    });

    draggable.on('drag:out', () => {
      notDraggedFar = false;
      puzzle.selectTile(undefined);
    });

    draggable.on('drag:move', (event) => {
      if (event.sensorEvent.target) {
        draggedOverSpace = event.sensorEvent.target.closest('.space');
      }
    });

    draggable.on('drag:stop', (event) => {
      const tileToken = event.source;
      const tile = JSON.parse(tileToken.dataset.tile);
      const draggingFrom = event.sourceContainer.classList.contains('board') ? 'board' : 'bag';
      const droppedOnSpace = draggedOverSpace;

      if (notDraggedFar) {
        puzzle.selectTile(tile);
        return;
      }

      if (droppedOnSpace && draggingFrom === 'bag') {
        const row = JSON.parse(droppedOnSpace.dataset.row);
        const col = JSON.parse(droppedOnSpace.dataset.col);
        const occupied = JSON.parse(droppedOnSpace.dataset.occupied);
        if (occupied) {
          puzzle.do({
            type: 'swap-bag',
            space: { row, col },
            bagTile: tile,
          });
        }
        else {
          puzzle.do({
            type: 'place',
            space: { row, col },
            tile,
          });
        }
      }

      else if (draggingFrom === 'board' && droppedOnSpace) {
        const space = tileToken.closest('.space');
        const from = { row: JSON.parse(space.dataset.row), col: JSON.parse(space.dataset.col) };
        const to = { row: JSON.parse(droppedOnSpace.dataset.row), col: JSON.parse(droppedOnSpace.dataset.col) };
        puzzle.do({
          type: 'swap',
          first: from,
          second: to,
        });
      }

      else if (draggingFrom === 'board' && !droppedOnSpace) {
        const space = tileToken.closest('.space');
        const row: number = JSON.parse(space.dataset.row);
        const col: number = JSON.parse(space.dataset.col);
        puzzle.do({
          type: 'remove',
          space: { row, col },
        });
      }

      notDraggedFar = true;
      draggedOverSpace = undefined;
    });

    return () => {
      draggable.destroy();
    };
  })
</script>
