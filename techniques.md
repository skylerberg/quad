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

## Terms

**Group:** A row or column.

**Attribute:** A suit or number.

**Lockout:** A technique showing that every space in some set of spaces cannot
have a particular attribute.

**Lock-in:** A technique showing that every space in a set of spaces must have a
particular attribute. Once shown, we can remove any options for those spaces
that does not have that attribute.

**Outer Lockout:** A lockout where by showing that all tiles with a
particular attribute must be within a set of spaces, all spaces outside that
group are locked out of that attribute.

**Inner Lockout:** A lockout where in a set of spaces, a limited number of tiles
must have a particular attribute. By showing that limited number is entirely
confined to a subset of the spaces, we can lock out the spaces not in that
subset from having that attribute.

**Inner Lock-In:** A lock-in where in a set of spaces at least some number of
tiles must have a particular attribute. If the largest subset of spaces that
could hold a tile with that attribute is equal to the required number of tiles
with that attribute, then we can lock-in that attribute for that subset.


## Techniques

### Hidden Single

This technique states that if a tile is only valid for one space, we must place
that tile on that space.

In sudoku terminology, this is a hidden single.

### Single Group Outer Lockout

If a group requires as many tiles with a particular attribute as there are
remaining tiles with that attribute, then no space outside that group may have a
tile with that attribute.

Example: If a row requires all four 4's, no other row can have a 4.

Example: If a row requires three 4's, currently has no 4's, and one 4 has
already been placed elsewhere, then no empty space outside of the row can have a
4.

### Single Group Inner Lockin

### Single Group Inner Lockout

### Multi-Row Outer Lockout

If a set of rows requires as many tiles of a given suit as there are remaining
tiles of that suit, then no space in a row outside that set may have a tile of
that suit.


The same statement can be made for numbers instead of suits and for columns
instead of rows.

### Row and Column Outer Lockout

For a given suit, add the count of required tiles of that suit for a particular
row and a particular column. If the required count of tiles of that suit is
equal to the count of remaining tiles of that suit + 1, then no other row or
column may contain that suit.

Also, if the count of required tiles of the suit is equal to the count of
remaining tiles of that suit and the space at the intersection of the row and
column is occupied, then no other row or column may contain that suit.

In both cases, the same statements can be made for numbers

### Row and Column Combination Outer Lockout

This generalizes the previous technique to handle multiples rows and columns.
Suppose we have a set of rows and columns and we take the count of required
tiles of a given suit. If that count is equal to the count of unplaced tiles of
that suit + the count of empty spaces at the intersection of rows and columns in
the set, then no tiles of that suit may appear outside that set of rows and
columns.

The same technique can be used for numbers.

### Intersectional Lock-In

In the technique above, a row and column together may require more tiles with an
attribute than remaining tiles with that attribute exists. This is possible
because they can share a tile at their intersection. In this case, we can
lock-in that attribute for the space at the intersection.

### Inferred Containment Conditions

If there are X tiles remaining with an attribute, when we consider a group, if
there are Y empty spaces outside that group that may contain that attribute,
then the group must contain at least X - Y tiles with that attribute.

For example, if we have placed two plant tiles, and the top three rows have no
spaces that can hold plant tiles, then we know that the bottom row must have two
plant tiles. Thus we create a new containment condition for that row.

### Pigeonhole Principle After Inferred Containment

By inferring containment conditions, we can have rows with more than 4 items
they must contain. We may be able to deduce that specific tiles must be in that
group.

For instance if we have a row that must contain 3, 4, 4, 4, Plant, and Plant,
then we know that the 4-Plant and 3-Plant must both appear in this row. We can
lock those tiles out of all other rows.

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
