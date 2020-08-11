// how many pixels per grid square
const res = 50
// how many pixels per square in original image
const imgRes = 7

let img
const margin = 30
let legendItemWidth = 300
let legendItemHeight = 50
let legendHeight
let gridWidth
let gridHeight
let legend = {}

function preload () {
  img = loadImage('img/mountain.png')
}

function setup () {
  gridWidth = img.width / imgRes
  gridHeight = img.height / imgRes

  populateLegend()
  createCanvas(2 * margin + gridWidth * res, 2 * margin + gridHeight * res + legendHeight)
  img.loadPixels()
}


function draw () {
  background(255)

  push()
  translate(margin, margin)
  drawLegend(legend)
  pop()

  push()
  translate(margin, margin + legendHeight)
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      drawSquare(x, y)
    }
  }
  drawGrid()
  pop()

  noLoop()
}

function drawSquare (x, y) {
  const c = img.get(x * imgRes, y * imgRes)
  noStroke()
  fill(c)
  const canvasX = x * res
  const canvasY = y * res

  rect(canvasX, canvasY, res - 1, res - 1)
}

function drawGrid () {
  stroke(0)
  noFill()
  // horizontal lines
  for (let y = 0; y <= gridHeight; y++) {
    strokeWeight(ceil(res / 10))
    if (y == 0 || y === gridHeight || y % 10 === 0) {
      strokeWeight(ceil(res / 5))
    }
    line(0, y * res, gridWidth * res, y * res)
  }
  // vertical lines
  for (let x = 0; x <= gridWidth; x++) {
    strokeWeight(ceil(res / 10))
    if (x === 0 || x === gridWidth || x % 10 === 0) {
      strokeWeight(ceil(res / 5))
    }
    line(x * res, 0, x * res, gridHeight * res)
  }
}

function populateLegend () {
  for (let y = 0; y < img.height; y += imgRes) {
    for (let x = 0; x < img.width; x += imgRes) {
      const c = color(...img.get(x, y))
      const hexColor = c.toString('#rrggbb')
      if (legend[hexColor] === undefined) {
        legend[hexColor] = 0
      }
      legend[hexColor]++
    }
  }
  const numColors = Object.keys(legend).length
  const numLegendRows = ceil(numColors * legendItemWidth / (gridWidth * res))
  legendHeight = numLegendRows * (legendItemHeight + margin)
}

function drawLegend (legend) {
  let count = 0
  let xoff = 0
  let yoff = 0
  for (const hexColor in legend) {
    const rectWidth = legendItemWidth / 5
    push()
    translate(xoff, yoff)
    fill(hexColor)
    noStroke()
    rect(0, 0, rectWidth, legendItemHeight)
    stroke(0)
    noFill()
    rect(0, 0, legendItemWidth, legendItemHeight)
      push()
      translate(rectWidth + 5, legendItemHeight / 2)
      fill(0)
      noStroke()
      textSize(legendItemHeight / 3)
      textAlign(LEFT, BOTTOM)
      text(hexColor, 0, 0)
      textAlign(LEFT, TOP)
      text(`${legend[hexColor]} squares`, 0, 0)
      pop()
    pop()
    count++
    xoff += legendItemWidth
    if ((count + 1) * legendItemWidth > gridWidth * res) {
      count = 0
      xoff = 0
      yoff += legendItemHeight + margin
    }
  }
}
