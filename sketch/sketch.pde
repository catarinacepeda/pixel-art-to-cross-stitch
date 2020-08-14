import java.util.Map;
import java.util.LinkedHashMap;
import processing.pdf.*;

boolean debug = true;

String imgLocation = "img/mountain.png";
String outputFile = "mountain.pdf";
int res = 50; // how many pixels per square in the grid
int imgRes = 7; // how many pixels per square in the original image
color gridColor = 0;

// ---

PGraphics pg;
int margin = ceil(res * 1.5);
PImage img;
PImage scaledImg;
int headerHeight;

Legend legend;
Grid grid;
Minimap minimap;

void settings () {
  if (debug) {
    fullScreen();
  }
}
void setup () {
  img = loadImage(imgLocation);
  img.loadPixels();

  scaledImg = createImage(img.width / imgRes, img.height / imgRes, RGB);
  scaledImg.loadPixels();
  for (int y = 0; y < scaledImg.height; y++) {
    for (int x = 0; x < scaledImg.width; x++) {
      scaledImg.set(x, y, img.get(x * imgRes, y * imgRes));
    }
  }
  scaledImg.updatePixels();

  grid = new Grid(scaledImg, res);
  minimap = new Minimap(scaledImg);
  minimap.setDimensions(20 * res - margin);
  legend = new Legend(scaledImg, res);
  legend.setDimensions(grid.width - minimap.width);

  headerHeight = max(minimap.height, legend.height);

  int w = 2 * margin + grid.width;
  int h = 2 * margin + grid.height + headerHeight;
  if (debug) {
    pg = createGraphics(w, h);
  } else {
    pg = (PGraphicsPDF) createGraphics(w, h, PDF, outputFile);
  }

  pg.noSmooth();
}

void draw () {
  if (!debug) {
    beginRecord(pg);
  }
  pg.beginDraw();
  pg.background(255);

  pg.push();
  pg.translate(margin, margin);
  minimap.draw(pg);
  pg.translate(minimap.width + margin, 0);
  legend.draw(pg);
  pg.pop();

  pg.push();
  pg.translate(margin, 2 * margin + headerHeight);
  grid.draw(pg);
  pg.pop();

  pg.endDraw();
  if (!debug) {
    endRecord();
    exit();
  } else {
    image(pg, 0, 0);
    noLoop();
  }
}
