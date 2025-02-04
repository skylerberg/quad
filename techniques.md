# Techniques

## Basics

You have a set of unplaced tiles and you have empty spaces. Consider that for
each empty space there is a subset of the unplaced tiles that could go on that
space. Our techniques are based on this notion.

If the set of valid tiles remaining for a space ever reaches 1, we can place
that tile in that space with complete confidence that it is part of a solution.

We can also narrow down the set of valid tiles for a space by checking if
placing a specific tile there violates the row or column condition for that
space's row and column. If it does violate the condition, we can remove that
tile from the list of possible tiles that could go in that space.

Finally, if we have done all we can to shrink the sets of valid tiles for each
space, we can place an arbitrary remaining valid tile in a space.

These three techniques (Eliminating possibilities that violate conditions,
placing tiles we are sure about, and arbitrarily guessing when we are out of
other ideas), are the foundation of our technique catalog.

Let's name these techniques Condition Based Elimination, Naked Single, and
Arbitrary Guess. The term Naked Single is taken from Sudoku terminology and it
means that there is just one possibility left for a given space, so we can fill
it.

## Applying Techniques

This section will explain my approach to solving levels via techniques and how
this can be used to design the game with a smooth progression in difficulty.

### The Algorithm

We will create a list of techniques ordered from most simple to most advanced.
Our list starts with like so:
* Condition Based Elimination
* Naked Single

And here is our algorithm applying techniques to solve a puzzle:

1. Start with the easiest technique.
2. Apply that technique in all conceivable ways.
3. If at any point we make progress (i.e., place a tile or reduce the list of possible
tiles for a space), go back to the start of the algorithm.
4. Otherwise, move on to the next technique and go to step 2.
5. If we make no progress using all of our techniques, make an Arbitrary Guess
   and go back to the start of the algorithm.

Eventually, we will either complete the puzzle successfully or we will reach a
point where an empty space has zero valid tiles. If a space has no valid tiles,
we have failed to solve the puzzle due to a poor Arbitrary Guess (or the puzzle
is unsolvable).

### Puzzle difficulty

The easiest puzzle can require nothing but Condition Based Elimination, and the
fallback of Arbitrary Guess. We can roughly rank the difficulty of a puzzle by
what the most advanced technique required to solve it is.

I believe a satisfying progression for the game will be one that requires the
player to discover increasingly advanced techniques as they play. We can use the
algorithm above to evaluate the difficulty of levels that we design.

### Level progression cadence

First, a level requiring a new technique is presented to the user. This level
should make the technique as easy as possible to spot and require generally
simple use of earlier learned techniques.

The next few levels require the technique in slightly less obvious ways and
the puzzle requires more complicated use of previously learned techniques.

Additionally, we will occasionally introduce new conditions to the game.

## Techniques

### Hidden Single

This technique states that if a tile is only valid for one space, we must place
that tile on that space.

In sudoku terminology, this is a hidden single.

### (Suit / Number) Segregation (full row / full column)

If a row requires as many tiles of a given suit as there are remaining tiles of
that suit, then no space in another row may have a tile of that suit.

The same statement can be made for numbers instead of suits and for columns
instead of rows.

### (Suit / Number) Segregation (multiple rows / multiple columns)

If a set of rows requires as many tiles of a given suit as there are remaining
tiles of that suit, then no space in a row outside that set may have a tile of
that suit.


The same statement can be made for numbers instead of suits and for columns
instead of rows.

### (Suit / Number) Segregation (row and column)

For a given suit, add the count of required tiles of that suit for a particular
row and a particular column. If the required count of tiles of that suit is
equal to the count of remaining tiles of that suit + 1, then no other row or
column may contain that suit.

Also, if the count of required tiles of the suit is equal to the count of
remaining tiles of that suit and the space at the intersection of the row and
column is occupied, then no other row or column may contain that suit.

In both cases, the same statements can be made for numbers

### (Suit / Number) Segregation (multiple rows and columns)

This generalizes the previous technique to handle multiples rows and columns.
Suppose we have a set of rows and columns and we take the count of required
tiles of a given suit. If that count is equal to the count of unplaced tiles of
that suit + the count of empty spaces at the intersection of rows and columns in
the set, then no tiles of that suit may appear outside that set of rows and
columns.

The same technique can be used for numbers.

### Naked Pair

If two spaces have exactly the same two valid tiles possible for placement, and
no other other tiles valid for placement, then those two tiles must appear in
those two spaces. Those tiles can be marked invalid for all other spaces.

### Naked Triple, quadruple, etc.

The logic above can be extended to groups of three, four or more tiles.

### Hidden Pair

If two tiles are only valid for two spaces, then those spaces must contain those
two tiles. All other possibilities for those spaces can be removed.

### Hidden Triple, quadruple, etc.

The logic above can be extended to groups of three, four or more tiles.
