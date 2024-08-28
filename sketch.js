// Coding Train / Daniel Shiffman
// Weighted Voronoi Stippling
// https://thecodingtrain.com/challenges/181-image-stippling

let points = [];

let delaunay, voronoi;

let gloria = [];

let imagePosition = 0;
let imageCount = 2;

let initialPointsNumber = 10;

function preload() {
    gloria.push(loadImage("01.JPG"));
    gloria.push(loadImage("01.png"));
}

function reRoadImage() {
    points.length = 0;
    for (let i = 0; i < initialPointsNumber; i++) {
        let x = random(width);
        let y = random(height);

        let col = gloria[imagePosition].get(x, y);

        if (random(100) > brightness(col)) {
          points.push(createVector(x, y));
        } else {
          i--;
        }
      }
      delaunay = calculateDelaunay(points);
      voronoi = delaunay.voronoi([0, 0, width, height]);     
}

function setup() {

    fullscreen( true );
    createCanvas(windowWidth, windowHeight); // Set the canvas to window size
    reRoadImage();
    // Access the native canvas element
  let canvasElement = document.querySelector('canvas');

  // Set the context with willReadFrequently option
  let ctx = canvasElement.getContext('2d', { willReadFrequently: true });    

    for(let i = 0; i < points.length; i++) {
        gloria[imagePosition].resize(windowWidth, windowHeight );
    }

    socket = new WebSocket('ws://localhost:8081');

    socket.onmessage = function(event) {
      let oscMessage = JSON.parse(event.data);
      console.log("Received OSC message:", oscMessage);
    };    
  //noLoop();

}

function draw() {
    background(255);

  let polygons = voronoi.cellPolygons();
  let cells = Array.from(polygons);

  let centroids = new Array(cells.length);
  let weights = new Array(cells.length).fill(0);
  let counts = new Array(cells.length).fill(0);
  let avgWeights = new Array(cells.length).fill(0);
  for (let i = 0; i < centroids.length; i++) {
    centroids[i] = createVector(0, 0);
  }

  gloria[imagePosition].loadPixels();
  let delaunayIndex = 0;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let index = (i + j * width) * 4;
      let r = gloria[imagePosition].pixels[index + 0];
      let g = gloria[imagePosition].pixels[index + 1];
      let b = gloria[imagePosition].pixels[index + 2];
      let bright = (r + g + b) / 3;
      let weight = 1 - bright / 255;
      delaunayIndex = delaunay.find(i, j, delaunayIndex);
      centroids[delaunayIndex].x += i * weight;
      centroids[delaunayIndex].y += j * weight;
      weights[delaunayIndex] += weight;
      counts[delaunayIndex]++;
    }
  }

  let maxWeight = 0;
  for (let i = 0; i < centroids.length; i++) {
    if (weights[i] > 0) {
      centroids[i].div(weights[i]);
      avgWeights[i] = weights[i] / (counts[i] || 1);
      if (avgWeights[i] > maxWeight) {
        maxWeight = avgWeights[i];
      }
    } else {
      centroids[i] = points[i].copy();
    }
  }

  for (let i = 0; i < points.length; i++) {
    points[i].lerp(centroids[i], 0.5);
  }

 for (let i = 0; i < points.length; i++) {
    let v = points[i];
    let col = gloria[imagePosition].get(v.x, v.y);
    stroke(col);
    //stroke(0);
    let sw = map(avgWeights[i], 0, maxWeight, 1, 14, true);
    //sw = 4;
    strokeWeight(sw);
    point(v.x, v.y);
  }

  delaunay = calculateDelaunay(points);
  voronoi = delaunay.voronoi([0, 0, width, height]);
}

function calculateDelaunay(points) {
  let pointsArray = [];
  for (let v of points) {
    pointsArray.push(v.x, v.y);
  }
  return new d3.Delaunay(pointsArray);
}


function keyPressed() {
//    let fs = fullscreen();
//    fullscreen(!fs);
    if (key === 'f' || key === 'F') {
        let fs = fullscreen();
        fullscreen(!fs); // Toggle fullscreen mode
        }
    else if (key === 'c' || key === 'C') {
        if( ++imagePosition >= imageCount ) imagePosition = 0;
        noLoop();
        setup();
        loop();
    }
    else {
        let x = random(width);
        let y = random(height);
        let col = gloria[imagePosition].get(x, y);
        if (random(100) > brightness(col)) 
        points.push(createVector(x, y));  
     }
}
