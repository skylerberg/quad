<script lang="ts">
  import Draggable from '@shopify/draggable/build/esm/Draggable/Draggable';
  import Announcement from '@shopify/draggable/build/esm/Draggable/Plugins/Announcement';
  import { onMount } from 'svelte';
  import type { Puzzle } from './puzzle.svelte';

  let { puzzle }: {
    puzzle: Puzzle,
  } = $props();

  let draggable = $state(undefined);
  let draggedOverSpace = undefined;
  let mirrorPosition = undefined;
  let notDraggedFar = true;

  const getSpaceIndex = ({row, col}: {row: number, col: number}) => row * 4 + col;

  const getTargetSpace = () => {
    const spaces = document.querySelectorAll('.board .space');
    const ghostRect = mirrorPosition;
    const ghostArea = ghostRect.width * ghostRect.height;
    const spaceScores = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]
    for (let space of spaces) {
      const spaceRect = space.getBoundingClientRect();
      const row = JSON.parse(space.dataset.row);
      const col = JSON.parse(space.dataset.col);
      const occupied = JSON.parse(space.dataset.occupied);
      if (spaceRect.left > ghostRect.right
        || spaceRect.right < ghostRect.left
        || spaceRect.top > ghostRect.bottom
        || spaceRect.bottom < ghostRect.top
      ) {
        spaceScores[row][col] = 0;
      }
      else {
        const overlapLeft = Math.max(spaceRect.left, ghostRect.left);
        const overlapRight = Math.min(spaceRect.right, ghostRect.right);
        const overlapTop = Math.max(spaceRect.top, ghostRect.top);
        const overlapBottom = Math.min(spaceRect.bottom, ghostRect.bottom);
        const overlapWidth = overlapRight - overlapLeft;
        const overlapHeight = overlapBottom - overlapTop;
        const area = overlapWidth * overlapHeight;
        const overlapPercent = area / ghostArea * 100;
        spaceScores[row][col] = overlapPercent;

        if (!occupied) {
          // Boost empty spaces
          spaceScores[row][col] += 10;
        }
      }
    }

    // Boost the space you released your finger over
    if (draggedOverSpace) {
      const row = JSON.parse(draggedOverSpace.dataset.row);
      const col = JSON.parse(draggedOverSpace.dataset.col);
      spaceScores[row][col] += 10;
    }

    console.log(spaceScores);
    let selectedSpace = undefined;
    let bestSpaceScore = 0;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (spaceScores[row][col] > bestSpaceScore && spaceScores[row][col] >= 35) {
          bestSpaceScore = spaceScores[row][col];
          selectedSpace = spaces[getSpaceIndex({row, col})];
        }
      }
    }

    return selectedSpace;
  }

  onMount(() => {
    const containers = document.querySelectorAll('.board, .tile-bag');
    draggable = new Draggable(containers, {
      draggable: '.unlocked',
      delay: {
        touch: 0,
      },
      //exclude: {
      //  plugins: [Draggable.Plugins.Announcement,],
      //},
      announcements: {
        'drag:start': '',
        'drag:stop': '',
      },
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

    draggable.on('mirror:move', (event) => {
      mirrorPosition = event.mirror.getBoundingClientRect();
    });

    draggable.on('drag:stop', (event) => {
      const tileToken = event.source;
      const tile = JSON.parse(tileToken.dataset.tile);
      const draggingFrom = event.sourceContainer.classList.contains('board') ? 'board' : 'bag';
      const droppedOnSpace = getTargetSpace();

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
      mirrorPosition = undefined;
    });

    return () => {
      draggable.destroy();
    };
  })
</script>
