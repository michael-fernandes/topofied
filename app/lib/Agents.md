# design criteria for contours

Design intent for the contour map. Describes how the terrain should read and
behave — not how it's built. Keep implementation details out of this file.

## Header / navigation

- The currently selected page (Home, Work, Collaborate, About) should read as
  the clear high point of the header terrain — the definite local summit.
- Unselected tabs should sit lower and quiet, near-flat, so nothing competes
  with the active page for visual prominence.
- Selecting a different page moves the summit to that tab: the high point
  always tracks where the visitor currently is.
- The landscape is continuous across pages — navigating should feel like the
  summit gliding to the new tab over stable terrain, not the map being
  redrawn from scratch on each route.


## Below the fold shifts focus to the content
- Below the fold we should still see contour lines but at a slightly opaque layer on top of it so the user can focus on the content.
- Above the fold the content (headlines, subtext, etc) the text should seem somewhat intergrated with teh contour lines being able to almost be parsed at once