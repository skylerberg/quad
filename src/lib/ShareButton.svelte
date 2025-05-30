<script lang="ts">
  import { onMount } from 'svelte';
  import checkIcon from '../assets/check.svg';
  import { computePosition, flip, shift, offset, arrow } from '@floating-ui/dom';

  let { casualLevelSolved, challengeLevelSolved, extremeLevelSolved }: {
    casualLevelSolved: boolean,
    challengeLevelSolved: boolean,
    extremeLevelSolved: boolean,
  } = $props()

  let shareTooltip: HTMLElement;
  let arrowElement: HTMLElement;
  let shareButton: HTMLElement;

  let shared = $state(false);  // The user has clicked share at some point
  let sharing = $state(false);  // The user just clicked and hasn't clicked away

  const share = () => {
    let shareText = "Check out today's Quad\n\nquad.skylerberg.com";
    if (casualLevelSolved && challengeLevelSolved && extremeLevelSolved) {
      shareText = "I solved every Quad today!\n\nquad.skylerberg.com";
    }
    else if (casualLevelSolved && extremeLevelSolved) {
      shareText = "I solved today's casual and extreme Quad!\n\nquad.skylerberg.com";
    }
    else if (challengeLevelSolved && extremeLevelSolved) {
      shareText = "I solved today's challenge and extreme Quad!\n\nquad.skylerberg.com";
    }
    else if (extremeLevelSolved) {
      shareText = "I solved today's extreme Quad!\n\nquad.skylerberg.com";
    }
    navigator.clipboard.writeText(shareText);
    shared = true;
    sharing = true;
  }

  function updateToolTip() {
    const placement = 'top';

    computePosition(shareButton, shareTooltip, {
      placement,
      middleware: [
        offset(6),
        flip(),
        shift({padding: 5}),
        arrow({element: arrowElement}),
      ],
    }).then(({x, y, placement, middlewareData}) => {
      Object.assign(shareTooltip.style, {
        left: `${x}px`,
        top: `${y}px`,
      });

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
      shareTooltip.style.display = 'block';
      updateToolTip();
    }

    function hideTooltip() {
      shareTooltip.style.display = '';
    }

    [
      ['mouseenter', showTooltip],
      ['mouseleave', hideTooltip],
      ['focus', showTooltip],
      ['blur', hideTooltip],
    ].forEach(([event, listener]) => {
      shareButton.addEventListener(event, listener);
    });

    updateToolTip();
  });
</script>

<button class="success-button share-button {shared ? 'shared' : ''} {sharing ? 'sharing' : ''}" bind:this={shareButton} onclick={share} onblur={() => sharing = false}>
  {#if sharing}
    <img class="succeeded" src={checkIcon} />
  {:else}
    Share
  {/if}
</button>

<div class="tooltip" bind:this={shareTooltip} role="tooltip">
  <div class="arrow" bind:this={arrowElement}></div>
  <span style="position: relative">Copied to clipboard</span>
</div>


<style>
  :global(body.draggable--is-dragging) .tooltip {
    display: none !important;
  }

  .share-button {
    width: 150px;
    height: 50px;
    padding: 0px;
  }

  :global(.success-button).shared {
    animation: none;
  }

  :global(.success-button).sharing {
    background-color: unset;
    box-shadow: none;
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
    padding: 10px;
    border-radius: 4px;
    font-size: 12pt;
  }

  .arrow {
    position: absolute;
    background: #444;
    width: 18px;
    height: 18px;
    transform: rotate(45deg);
  }

  .succeeded {
    filter: invert(53%) sepia(79%) saturate(2879%) hue-rotate(85deg) brightness(121%) contrast(122%);
    object-fit: contain;
    width: 100%;
    height: 100%;
    opacity: 0.6;
  }
</style>
