import type { Tile } from './tile.ts';
import type { Location } from './location.ts';

export const dragState: {
  tile: Tile | undefined,
  droppedOnBoard: boolean,
  draggingFrom: Location | undefined,
} = $state({
  tile: undefined,
  droppedOnBoard: false,
  draggingFrom: undefined,
});
