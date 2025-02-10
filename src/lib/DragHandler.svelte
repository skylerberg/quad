<script lang="ts">
  import Draggable from '@shopify/draggable/build/esm/Draggable/Draggable';
  import { onMount } from 'svelte';

  let draggable = $state(undefined);
  let draggedOverSpace = undefined;
  let tileInDraggedOverSpace = undefined;

  onMount(() => {
    const containers = document.querySelectorAll('.board, .tile-bag');
    draggable = new Draggable(containers, {
      draggable: '.tile-token',
      delay: {
        touch: 0,
      },
      ghostClass: '.being-dragged',
    });

    draggable.on('drag:move', (event) => {
      draggedOverSpace = event.sensorEvent.target.closest('.space');
      tileInDraggedOverSpace = event.sensorEvent.target.closest('.tile-token');
    });

    draggable.on('drag:stop', (event) => {
      const tileToken = event.source;
      const tile = JSON.parse(tileToken.dataset.tile);
      const draggingFrom = event.sourceContainer.classList.contains('board') ? 'board' : 'bag';
      const droppedOnSpace = draggedOverSpace;

      if (droppedOnSpace && draggingFrom === 'bag') {
        const row = droppedOnSpace.dataset.row;
        const col = droppedOnSpace.dataset.col;

        if (tileInDraggedOverSpace) {
          window.dispatchEvent(
            new CustomEvent('added-to-bag', {detail: {tile: JSON.parse(tileInDraggedOverSpace.dataset.tile)}})
          );
        }

        window.dispatchEvent(
          new CustomEvent('removed-from-bag', {detail: {tile}})
        );

        window.dispatchEvent(
          new CustomEvent('placed-on-board', {detail: {row, col, tile}})
        );
      }

      else if (draggingFrom === 'board' && droppedOnSpace) {
        const from = { row: tileToken.parentNode.dataset.row, col: tileToken.parentNode.dataset.col };
        const to = { row: droppedOnSpace.dataset.row, col: droppedOnSpace.dataset.col };
        window.dispatchEvent(
          new CustomEvent('swapped-board-spaces', {detail: {from, to}})
        );
      }

      else if (draggingFrom === 'board' && !droppedOnSpace) {
        const row = tileToken.parentNode.dataset.row;
        const col = tileToken.parentNode.dataset.col;
        window.dispatchEvent(
          new CustomEvent('removed-from-board', {detail: {row, col}})
        );

        window.dispatchEvent(
          new CustomEvent('added-to-bag', {detail: {tile}})
        );
      }

      draggedOverSpace = undefined;
      tileInDraggedOverSpace = undefined;
    });

    return () => {
      draggable.destroy();
    };
  })
</script>
