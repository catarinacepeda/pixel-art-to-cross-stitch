const imgLocation = 'img/mountain.png'
const chartFile = 'out_mountain.png'
// how many pixels per grid square
const res = 25
// how many pixels per square in original image
const imgRes = 7
const gridColor = 0

let img
let canvas
const margin = res * 1.5
let legendItemWidth = res * 10
let legendItemHeight = res * 2
let legendHeight
let gridWidth
let gridHeight
let legend = {}
let legendColors

function preload () {
  img = loadImage(imgLocation)
}

function setup () {
  gridWidth = img.width / imgRes
  gridHeight = img.height / imgRes
  console.log(gridWidth, gridHeight)

  populateLegend()
  canvas = createCanvas(2 * margin + gridWidth * res, 2 * margin + gridHeight * res + legendHeight)
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
      push()
      translate(x * res, y * res)
      noStroke()
      const c = color(img.get(x * imgRes, y * imgRes)).toString('#rrggbb')
      drawSquare(c)
      pop()
    }
  }
  drawGrid()
  pop()

  // save(canvas, chartFile)
  noLoop()
}

function drawSquare (hexColor) {
  fill(hexColor)
  rect(0, 0, res, res)
  const colorIndex = legendColors.indexOf(hexColor) + 1
  push()
  translate(res / 2, res / 2)
  textAlign(CENTER, CENTER)
  textSize(res / 2)
  rectMode(CENTER)
  const { levels: c } = color(hexColor)
  // http://www.w3.org/TR/AERT#color-contrast
  const brightness = Math.round(
    ((parseInt(c[0]) * 299) +
    (parseInt(c[1]) * 587) +
    (parseInt(c[2]) * 114)) / 1000
  )
  fill(brightness > 125 ? 0 : 255)
  noStroke()
  text(String(colorIndex), 0, 0)
  pop()
}

function drawGrid () {
  stroke(gridColor)
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
  legendColors = Object.keys(legend)
  const numColors = Object.keys(legend).length
  const numLegendRows = ceil(numColors * legendItemWidth / (gridWidth * res))
  legendHeight = numLegendRows * (legendItemHeight + res)
}

function drawLegend (legend) {
  let rowIndex = 0
  let xoff = 0
  let yoff = 0
  for (const hexColor in legend) {
    const rectWidth = legendItemHeight * 3 / 2
    push()
    // draw color swatch
    translate(xoff, yoff)
    fill(hexColor)
    noStroke()
    rect(0, 0, rectWidth, legendItemHeight)
    stroke(0)
    noFill()
    rect(0, 0, legendItemWidth, legendItemHeight)

    // draw legend text
    push()
    translate(rectWidth + ceil(res / 5), legendItemHeight / 2)
    fill(0)
    noStroke()
    textSize(res / 2)
    textAlign(LEFT, BOTTOM)
    text(hexColor, 0, 0)
    textAlign(LEFT, TOP)
    text(`${legend[hexColor]} squares`, 0, 0)
    pop()

    // draw grid square
    push()
    translate(legendItemWidth - res - (legendItemHeight - res) / 2, (legendItemHeight - res) / 2)
    stroke(0)
    strokeWeight(ceil(res / 10))
    drawSquare(hexColor)
    pop()
    pop()
    rowIndex++
    xoff += legendItemWidth
    if ((rowIndex + 1) * legendItemWidth > gridWidth * res) {
      rowIndex = 0
      xoff = 0
      yoff += legendItemHeight + res
    }
  }
}
