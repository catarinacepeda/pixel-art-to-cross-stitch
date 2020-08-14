class Grid {

  int width, height;
  int res;
  PImage img;

  Grid (PImage img, int res) {
    this.res = res;
    this.img = img;
    this.width = img.width * res;
    this.height = img.height * res;
  }

  void draw (PGraphics pg) {
    // draw squares
    for (int y = 0; y < img.height; y++) {
      for (int x = 0; x < img.width; x++) {
        pg.push();
        pg.translate(x * res, y * res);
        pg.noStroke();
        color c = img.get(x, y);
        new Square(res, c).draw(pg);
        pg.pop();
      }
    }

    // draw grid
    pg.push();
    pg.strokeCap(PROJECT);
    pg.stroke(gridColor);
    pg.noFill();
    // draw horizontal lines
    for (int y = 0; y <= img.height; y++) {
      pg.strokeWeight(ceil(res / 10.0));
      if (y == 0 || y == img.height || y % 10 == 0) {
        pg.strokeWeight(ceil(res / 5.0));
      }
      pg.line(0, y * res, img.width * res, y * res);
    }

    // draw horizontal lines
    for (int x = 0; x <= img.width; x++) {
      pg.strokeWeight(ceil(res / 10.0));
      if (x == 0 || x == img.width || x % 10 == 0) {
        pg.strokeWeight(ceil(res / 5.0));
      }
      pg.line(x * res, 0, x * res, img.height * res);
    }
    pg.pop();
  }
}

class Square {
  int res;
  color c;

  Square (int res, color c) {
    this.res = res;
    this.c = c;
  }

  void draw (PGraphics pg) {
    pg.fill(c);
    pg.rect(0, 0, res, res);

    int colorIndex = legend.colors.indexOf(c);
    pg.push();
    pg.translate(res / 2, res / 2);
    pg.textAlign(CENTER, CENTER);
    pg.textSize(res / 2);
    pg.rectMode(CENTER);

    // http://www.w3.org/TR/AERT#color-contrast
    int brightness = round(
      (red(c) * 299 +
      green(c) * 587 +
      blue(c) * 114) / 1000
    );
    pg.fill(brightness > 125 ? 0 : 255);
    pg.noStroke();
    pg.text(colorIndex, 0, 0);
    pg.pop();
  }
}
