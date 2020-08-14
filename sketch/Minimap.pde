class Minimap {

  PImage img;
  int width, height;

  Minimap (PImage img) {
    this.img = img;
  }

  void setDimensions (int w, int h) {
    this.width = w;
    this.height = h;
  }

  void setDimensions (int w) {
    this.width = w;
    this.height = ceil(w * img.height / (float) img.width);
  }

  void draw (PGraphics pg) {
    pg.image(img, 0, 0, this.width, this.height);
  }
}
