// how many pixels per grid square
const res = 5
// how many pixels per art square
const imgRes = 7
let img

function preload () {
  img = loadImage('img/mountain.png')
}

function setup () {
  createCanvas(img.width / imgRes * res, img.height / imgRes * res)
  img.loadPixels()
}


function draw() {
  background(0)
  const xoff = (width / res) / 2
  const yoff = (height / res) / 2

  for (let y = 0; y < height / res; y++) {
    for (let x = 0; x < width / res; x++) {
      const c = img.get(x * imgRes, y * imgRes)
      noStroke()
      fill(c)
      const canvasX = x * res
      const canvasY = y * res

      rect(canvasX, canvasY, res, res)
    }
  }
  noLoop()
}