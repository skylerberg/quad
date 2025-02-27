<script lang="ts">
  import helpCircleOutlineUri from '../assets/help-circle-outline.svg';
  import menuImageUri from '../assets/menu-burger-horizontal.svg';

  let { levelNumber }: {
    levelNumber: number,
  } = $props();
</script>


<nav class='navbar'>
  <span class='title'>
    <span class='title-letter'>Q</span><span class='title-letter'>U</span><span class='title-letter'>A</span><span class='title-letter'>D</span>
  </span>
  <span class='level'>Level {$levelNumber}</span>
  <div class="nav-buttons">
    <img src={helpCircleOutlineUri} class='icon' />
    <img src={menuImageUri} class='icon' />
  </div>
</nav>

<dialog id="how-to-play-dialog">
  <h2>How To Play</h2>
  <p>Place all 16 tiles and meet the goal for each row and column</p>
  <hr />
  <p></p>
  <form method="dialog">
    <button>Got It</button>
  </form>
</dialog>

<style>
  .navbar {
    height: 50px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    background: #131313;
    margin-bottom: 1em;
  }

  .title {
    margin-left: 0.25em;
    font-size: 24px;
    align-self: center;
  }

  .title-letter {
    display: inline-flex;
    box-sizing: border-box;
    width: 35px;
    aspect-ratio: 1 / 1;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    justify-content: center;
    align-items: center;
    line-height: 1;
    font-size: 28px;
    align-self: center;
    text-align: center;
  }

  .level {
    font-size: 20px;
    align-self: center;
  }

  .nav-buttons {
    display: flex
  }

  .icon {
    width: 2em;
    filter: invert();
    margin-left: 0.25em;
    margin-right: 0.25em;
    align-self: center;
  }

  #how-to-play-dialog {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    text-align: center;
    max-width: min(400px, 80vw);
  }
</style>
