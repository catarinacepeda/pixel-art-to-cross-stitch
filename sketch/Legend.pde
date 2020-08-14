class Legend {

  int res;
  int itemWidth;
  int itemHeight;
  private Map<Integer, Integer> legend;
  private ArrayList<Integer> colors;

  int width, height;

  Legend (PImage img, int res) {
    this.res = res;
    legend = new LinkedHashMap();

    for (int y = 0; y < img.height; y++) {
      for (int x = 0; x < img.width; x++) {
        int c = img.get(x, y);
        if (!legend.containsKey(c)) {
          legend.put(c, 0);
        }
        legend.put(c, legend.get(c) + 1);
      }
    }
    colors = new ArrayList(legend.keySet());
    itemWidth = 10 * res;
    itemHeight = 2 * res;
  }

  void setDimensions (int w, int h) {
    this.width = w;
    this.height = h;
  }

  void setDimensions (int w) {
    this.width = w;
    int numRows = ceil(legend.size() * itemWidth / (float)w);
    this.height = numRows * (itemHeight + res);
  }

  ArrayList listColors () {
    return colors;
  }

  void draw (PGraphics pg) {
    int rowIndex = 1;
    int xoff = 0;
    int yoff = 0;
    float swatchWidth = itemHeight * 1.5;

    for (color c : colors) {
      pg.push();

      // draw color swatch
      pg.translate(xoff, yoff);
      pg.noStroke();
      pg.fill(c);
      pg.rect(0, 0, swatchWidth, itemHeight);

      // draw border
      pg.stroke(0);
      pg.noFill();
      pg.rect(0, 0, itemWidth, itemHeight);

      // draw legend text
      pg.push();
      pg.translate(swatchWidth + ceil(res / 5.0), itemHeight / 2.0);
      pg.fill(0);
      pg.noStroke();
      pg.textSize(res / 2);
      pg.textAlign(LEFT, BOTTOM);
      pg.text(String.format("#%s", hex(c, 6)).toLowerCase(), 0, 0);
      pg.textAlign(LEFT, TOP);
      pg.text(String.format("%s squares", legend.get(c)), 0, 0);
      pg.pop();

      // draw grid square
      pg.push();
      pg.translate(itemWidth - res - (itemHeight - res) / 2.0, (itemHeight - res) / 2.0);
      pg.stroke(0);
      pg.strokeWeight(ceil(res/10.0));
      new Square(res, c).draw(pg);
      pg.pop();

      pg.pop();
      rowIndex++;
      xoff += itemWidth;
      if (rowIndex * itemWidth > this.width) {
        rowIndex = 1;
        xoff = 0;
        yoff += itemHeight + res;
      }
    }
  }
}
