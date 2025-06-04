<script lang="ts">
  import Draggable from '@shopify/draggable/build/esm/Draggable/Draggable';
  import { onMount } from 'svelte';
  import type { Puzzle } from './puzzle.svelte';

  let { puzzle }: {
    puzzle: Puzzle,
  } = $props();

  let draggable = $state(undefined);
  let draggedOverSpace = undefined;
  let tileInDraggedOverSpace = undefined;

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
        puzzle.do({
          type: 'place',
          space: { row, col },
          tile,
        });
      }

      else if (draggingFrom === 'board' && droppedOnSpace) {
        const from = { row: tileToken.parentNode.dataset.row, col: tileToken.parentNode.dataset.col };
        const to = { row: droppedOnSpace.dataset.row, col: droppedOnSpace.dataset.col };
        puzzle.do({
          type: 'swap',
          first: from,
          second: to,
        });
      }

      else if (draggingFrom === 'board' && !droppedOnSpace) {
        const row: number = tileToken.parentNode.dataset.row;
        const col: number = tileToken.parentNode.dataset.col;
        puzzle.do({
          type: 'remove',
          space: { row, col },
        });
      }

      draggedOverSpace = undefined;
      tileInDraggedOverSpace = undefined;
    });

    return () => {
      draggable.destroy();
    };
  })
</script>
