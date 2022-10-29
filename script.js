
let currentCanvas = null;
let targetCanvas = null;
let originalCanvas = null;
let startStopButton = null;
let downloadGifButton = null;

// const upSamplingFactor = 4;
//
// const imageW = 80, imageH = 80,
//   samplesPerFrame = 1000, samplesPerPeriod = 150000,
//   beta = 0.5, exteralFieldStrength = 7,
//   preprocessZoom = 2.0, preprocessThreshold = 0.53;

const upSamplingFactor = 3;

const imageW = 120, imageH = 120,
  samplesPerFrame = 1000, samplesPerPeriod = 200000,
  beta = 2, exteralFieldStrength = 10, externalFieldOffset = -0.2;
  preprocessZoom = 2.0, preprocessThreshold = 0.53,
  neighborWindowSize = 7;

const isingModel = new IsingModelWithImageTargets(
  imageW, imageH,
  samplesPerFrame, samplesPerPeriod,
  beta, exteralFieldStrength, externalFieldOffset,
  preprocessZoom, preprocessThreshold,
  neighborWindowSize
);

console.log("imageW", imageW);
console.log("imageH", imageH);
console.log("samplesPerFrame", samplesPerFrame);
console.log("samplesPerPeriod", samplesPerPeriod);

// let targetImageUrls = [
//   "https://images.pexels.com/photos/2709388/pexels-photo-2709388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/775358/pexels-photo-775358.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/3310695/pexels-photo-3310695.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/3220360/pexels-photo-3220360.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/1840608/pexels-photo-1840608.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/3671083/pexels-photo-3671083.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/4890733/pexels-photo-4890733.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/3186558/pexels-photo-3186558.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/3981337/pexels-photo-3981337.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/1982852/pexels-photo-1982852.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/3283568/pexels-photo-3283568.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/3533228/pexels-photo-3533228.png?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2741701/pexels-photo-2741701.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2846602/pexels-photo-2846602.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2755165/pexels-photo-2755165.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/3438086/pexels-photo-3438086.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/3748221/pexels-photo-3748221.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2530775/pexels-photo-2530775.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2853198/pexels-photo-2853198.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/5397723/pexels-photo-5397723.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/4229083/pexels-photo-4229083.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/5046546/pexels-photo-5046546.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/4556737/pexels-photo-4556737.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/6652928/pexels-photo-6652928.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/6015909/pexels-photo-6015909.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/4355346/pexels-photo-4355346.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/5034475/pexels-photo-5034475.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/4993292/pexels-photo-4993292.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/4662950/pexels-photo-4662950.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2703181/pexels-photo-2703181.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/5704849/pexels-photo-5704849.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/5704720/pexels-photo-5704720.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/4571943/pexels-photo-4571943.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/4612113/pexels-photo-4612113.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/4640886/pexels-photo-4640886.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2728264/pexels-photo-2728264.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/4754648/pexels-photo-4754648.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/4197932/pexels-photo-4197932.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/4750165/pexels-photo-4750165.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/609549/pexels-photo-609549.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2120114/pexels-photo-2120114.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2218786/pexels-photo-2218786.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2092474/pexels-photo-2092474.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2128807/pexels-photo-2128807.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2169434/pexels-photo-2169434.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2598024/pexels-photo-2598024.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2787341/pexels-photo-2787341.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2232981/pexels-photo-2232981.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/1458332/pexels-photo-1458332.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2744193/pexels-photo-2744193.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2625122/pexels-photo-2625122.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2104252/pexels-photo-2104252.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/3155588/pexels-photo-3155588.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/906052/pexels-photo-906052.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/839633/pexels-photo-839633.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2167673/pexels-photo-2167673.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/1081685/pexels-photo-1081685.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2123778/pexels-photo-2123778.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/732425/pexels-photo-732425.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/1844547/pexels-photo-1844547.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2122276/pexels-photo-2122276.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2804282/pexels-photo-2804282.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2097475/pexels-photo-2097475.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/2071881/pexels-photo-2071881.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","https://images.pexels.com/photos/1988681/pexels-photo-1988681.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
// ]
let targetImageUrls = [
  "https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/4640886/pexels-photo-4640886.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/2128807/pexels-photo-2128807.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/2787341/pexels-photo-2787341.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/2123778/pexels-photo-2123778.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/3981337/pexels-photo-3981337.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/2709388/pexels-photo-2709388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/6652928/pexels-photo-6652928.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/906052/pexels-photo-906052.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
]
const gifEncoder = new GIFEncoder();
gifEncoder.setRepeat(0); //0  -> loop forever
                         //1+ -> loop n times then stop
gifEncoder.setDelay(100); //go to next frame every n milliseconds
//gifEncoder.setSize(upSamplingFactor * imageW, upSamplingFactor * imageH);


const imageDataShowUp = new ImageData(imageW * upSamplingFactor, imageH * upSamplingFactor);
const imageDataShow = new ImageData(imageW, imageH);
async function showImageData(imageData, canvas, upSamplingFactor, contrast) {
  let imageDataShowLocal = imageDataShow;
  if (upSamplingFactor > 1) {
    imageDataShowLocal = imageDataShowUp;
  }

  // UpSample imageData:
  for (y = 0; y < imageDataShowLocal.width; y++){
    for (x = 0; x < imageDataShowLocal.height; x++){
      //find current pixel
      index = (Math.floor(y / upSamplingFactor) +
        (Math.floor(x / upSamplingFactor) * imageData.width)) * 4;
      indexUp = (y + x * imageDataShowLocal.width) * 4;

      // console.log(`index ${index}, imageData.data[index] ${imageData.data[index]}`);
      const pixelValue = 128 + contrast * (imageData.data[index] - 128);
      imageDataShowLocal.data[indexUp] = pixelValue;
      imageDataShowLocal.data[indexUp + 1] = pixelValue;
      imageDataShowLocal.data[indexUp + 2] = pixelValue;
      imageDataShowLocal.data[indexUp + 3] = 255;
    }
  }

  // Show imageDataUp:
  canvas.getContext("2d").putImageData(imageDataShowLocal, 0, 0);
}


async function nextFrame() {
  await isingModel.updateTargetImage(targetImageUrls);

  isingModel.sampleNextFrame();

  await showImageData(isingModel.currentImageData, currentCanvas, upSamplingFactor, 1.0);
  await showImageData(isingModel.targetImageData, targetCanvas, 1, 1.0);
  await showImageData(isingModel.originalImageData, originalCanvas, 1, 1.0);

  gifEncoder.addFrame(currentCanvas.getContext("2d"));

  if (isRunning) {
    setTimeout(nextFrame, 1);
  }
}

// (C) START!
// https://code-boxx.com/simple-javascript-stopwatch/
let isRunning = false;
function start() {
  isRunning = true;
  startStopButton.value = "Stop";
  startStopButton.removeEventListener("click", start);
  startStopButton.addEventListener("click", stop);
  downloadGifButton.disabled = true;
  nextFrame();
}

// (D) STOP
function stop() {
  isRunning = false;
  startStopButton.value = "Start";
  startStopButton.removeEventListener("click", stop);
  startStopButton.addEventListener("click", start);
  downloadGifButton.disabled = false;
}

function downloadGif() {
  console.log("Download GIF");
  gifEncoder.finish();
  gifEncoder.download("download.gif");
  gifEncoder.start();
}

async function run() {

  // // Get targetImageUrls from pexels query:
  // res = await axios.get("https://api.pexels.com/v1/search?query=structure&per_page=1000", {
  //   headers: {
  //     "Authorization": "xxxx"
  //   }
  // });
  // console.log(`request image urls, response: ${res.status}`);
  // targetImageUrls = res.data.photos.map(x => {return x.src.large;});
  // console.log(JSON.stringify(targetImageUrls));

  currentCanvas = document.getElementById("currentCanvas");
  currentCanvas.width = upSamplingFactor * imageW;
  currentCanvas.height = upSamplingFactor * imageH;

  targetCanvas = document.getElementById("targetCanvas");
  targetCanvas.width = imageW;
  targetCanvas.height = imageH;

  originalCanvas = document.getElementById("originalCanvas");
  originalCanvas.width = imageW;
  originalCanvas.height = imageH;

  startStopButton = document.getElementById("startStop");
  startStopButton.addEventListener("click", start);
  startStopButton.disabled = false;

  downloadGifButton = document.getElementById("downloadGif");
  downloadGifButton.addEventListener("click", downloadGif);
  downloadGifButton.disabled = true;
  gifEncoder.start();

  await showImageData(isingModel.currentImageData, currentCanvas, upSamplingFactor, 1.0);
  await showImageData(isingModel.targetImageData, targetCanvas, 1, 1.0);
  await showImageData(isingModel.originalImageData, originalCanvas, 1, 1.0);
}

document.addEventListener('DOMContentLoaded', run);
