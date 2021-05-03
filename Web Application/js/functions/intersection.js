function intersection(x0, y0, r0, x1, y1, r1) {
  console.log('intersection called');
  var a, dx, dy, d, h, rx, ry;
  var x2, y2;

  /* dx and dy are the vertical and horizontal distances between
   * the circle centers.
   */
  dx = x1 - x0;
  dy = y1 - y0;

  /* Determine the straight-line distance between the centers. */
  d = Math.sqrt(dy * dy + dx * dx);

  /* Check for solvability. */
  if (d > r0 + r1) {
    /* no solution. circles do not intersect. */
    console.log('Fixing intersection');
    // return false;
    return intersection(x0, y0, r0 + 0.1, x1, y1, r1 + 0.1);
  }
  if (d < Math.abs(r0 - r1)) {
    /* no solution. one circle is contained in the other */
    console.error('One Circle is contained in the other !!!');
    return false;
  }

  /* 'point 2' is the point where the line through the circle
   * intersection points crosses the line between the circle
   * centers.
   */

  /* Determine the distance from point 0 to point 2. */
  a = (r0 * r0 - r1 * r1 + d * d) / (2.0 * d);

  /* Determine the coordinates of point 2. */
  x2 = x0 + (dx * a) / d;
  y2 = y0 + (dy * a) / d;

  /* Determine the distance from point 2 to either of the
   * intersection points.
   */
  h = Math.sqrt(r0 * r0 - a * a);

  /* Now determine the offsets of the intersection points from
   * point 2.
   */
  rx = -dy * (h / d);
  ry = dx * (h / d);

  /* Determine the absolute intersection points. */
  var xi = x2 + rx;
  var xi_prime = x2 - rx;
  var yi = y2 + ry;
  var yi_prime = y2 - ry;

  var point1 = { x: xi, y: yi };
  var point2 = { x: xi_prime, y: yi_prime };
  console.log(point1, point2);
  return [point1, point2];
}

export { intersection }; // NOTE: Named Export => Have to call from same name from child file
