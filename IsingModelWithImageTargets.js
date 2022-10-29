
class IsingModelWithImageTargets {

  constructor(
    imageW, imageH,
    samplesPerFrame, samplesPerPeriod,
    beta, exteralFieldStrength, externalFieldOffset,
    preprocessZoom, preprocessThreshold,
    neighborWindowSize
  ) {
    this.imageW = imageW;
    this.imageH = imageH;
    this.beta = beta;
    this.exteralFieldStrength = exteralFieldStrength;
    this.externalFieldOffset = externalFieldOffset;
    this.samplesPerFrame = samplesPerFrame;
    this.samplesPerPeriod = samplesPerPeriod;
    this.targetImageId = -1;
    this.sampleCount = Math.floor(0.75 * samplesPerPeriod);
    this.targetImageAmplitude = 0;
    this.preprocessZoom = preprocessZoom;
    this.preprocessThreshold = preprocessThreshold;
    this.neighborWindowSize = neighborWindowSize;
    this.alreadyShowedUrls = [];

    // Initialize currentImage, targetImageData, originalImageData:
    this.currentImageData = new ImageData(
      Uint8ClampedArray.from(
        {length: 4*imageW*imageH},
        () => 255*Math.round(Math.min(1, Math.max(0, Math.random() + 0.5*(1.5+preprocessThreshold) - 1)))
      ),
      imageW, imageH
    );
    this.targetImageData = new ImageData(imageW, imageH);
    this.originalImageData = new ImageData(imageW, imageH);
    for (var i = 0; i < this.currentImageData.data.length; i+=4) {
      //this.currentImageData.data[i] = 0;
      this.currentImageData.data[i+1] = this.currentImageData.data[i];
      this.currentImageData.data[i+2] = this.currentImageData.data[i];
      this.currentImageData.data[i+3] = 255;
      this.targetImageData.data[i] = this.currentImageData.data[i];
      this.targetImageData.data[i+1] = this.currentImageData.data[i];
      this.targetImageData.data[i+2] = this.currentImageData.data[i];
      this.targetImageData.data[i+3] = 255;
      this.originalImageData.data[i] = this.currentImageData.data[i];
      this.originalImageData.data[i+1] = this.currentImageData.data[i];
      this.originalImageData.data[i+2] = this.currentImageData.data[i];
      this.originalImageData.data[i+3] = 255;
    }

    for (var i = 0; i < 500; i++) {
      this.sampleNextFrame();
    }
  }

  async loadImageData(url, imageW, imageH, zoom, threshold) {
    const img = await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
    // console.log(img.width);
    // console.log(img.height);
    // canvas.getContext("2d").drawImage(img, 0, 0, 80, 80);

    // Reshape image:
    const canv = document.createElement('canvas');
    canv.width = imageW;
    canv.height = imageH;
    //minWH = Math.min(img.width, img.height);
    const imgW = img.width * Math.min(1, imageH / imageW) / zoom;
    const imgH = img.height * Math.min(1, imageW / imageH) / zoom;
    canv.getContext("2d").drawImage(img,
      0.5*(img.width - imgW),0.5*(img.height - imgH),imgW,imgH,
      0,0,imageW, imageH);
    const imageData = canv.getContext('2d').getImageData(0, 0, imageW, imageH);

    // Convert to grayscale:
    const imgGray = new Uint8ClampedArray(imageData.data.length / 4);
    for(var y = 0; y < imageH; y++){
      for(var x = 0; x < imageW; x++){
        var i = 4*(x + y*imageW);
        imgGray[i/4] = 0.299*imageData.data[i] + 0.587*imageData.data[i + 1] + 0.114*imageData.data[i + 2];
      }
    }

    // Histogram equalization:
    // Compute histogram and histogram sum:
    var hist = new Float32Array(256);
    var sum = 0;
    for (var i = 0; i < imgGray.length; ++i) {
        ++hist[~~imgGray[i]];
        ++sum;
    }
    // Compute integral histogram:
    var prev = hist[0];
    for (var i = 1; i < 256; ++i) {
        prev = hist[i] += prev;
    }
    // Equalize image:
    var norm = 255 / sum;
    for (var i = 0; i < imgGray.length; ++i) {
        imgGray[i] = hist[~~imgGray[i]] * norm;
    }

    // black-white-thresholding:
    imgGray.set(imgGray.map(
      x => 255*Math.round(Math.min(1, Math.max(0, x/255 + 2*threshold - 1)))
    ));
    //console.log(imgGray);

    // Set imageData:
    const originalImageData = new ImageData(imageW, imageH);
    for (var i = 0; i < imageData.data.length; i+=4) {
      originalImageData.data[i] = imageData.data[i];
      originalImageData.data[i+1] = imageData.data[i];
      originalImageData.data[i+2] = imageData.data[i];
      originalImageData.data[i+3] = 255;
    }
    for(var y = 0; y < imageH; y++){
      for(var x = 0; x < imageW; x++){
        var i = 4*(x + y*imageW);
        imageData.data[i] = imgGray[i/4];
        imageData.data[i + 1] = imgGray[i/4];
        imageData.data[i + 2] = imgGray[i/4];
        imageData.data[i + 3] = 255;
      }
    }

    return [imageData, originalImageData];
  }

  async updateTargetImage(targetImageUrls) {
    // remove alreadyShowedUrls:
    targetImageUrls = targetImageUrls.filter(item => {
      return this.alreadyShowedUrls.indexOf(item) === -1;
    });
    // console.log("targetImageUrls.length", targetImageUrls.length);

    //console.log(this.sampleCount);
    if (this.sampleCount < this.samplesPerPeriod) {
      this.sampleCount += this.samplesPerFrame;
      this.targetImageAmplitude = Math.max(0.0,
        this.externalFieldOffset + 0.5 + 0.5*Math.sin(
        2*Math.PI*(this.sampleCount/this.samplesPerPeriod - 0.25)
      ));

      if (this.sampleCount % (0.1*this.samplesPerPeriod) < 1) {
        // console.log(`sampleCount: ${this.sampleCount}, amplitude: ${this.targetImageAmplitude}`);
      }
    }
    else {
      // Download 7 random images from targetImageUrls
      //   and replace targetImage with possibleImage
      //   with smallest deviation to currentImage:
      const ids = [];
      const possibleImages = [];
      const originalImages = [];
      let i_min = 0;
      let minAbsDeviation = 4 * this.imageW * this.imageH;
      for (var i = 0; i < 7; i++) {
        var id = -1;
        while (id === this.targetImageId || id === -1) {
          id = Math.floor(Math.random() * targetImageUrls.length);
        }
        const [bwImage, colorImage] = await this.loadImageData(
          targetImageUrls[id], this.imageW, this.imageH,
          this.preprocessZoom, this.preprocessThreshold
        );
        ids.push(id);
        possibleImages.push(bwImage);
        originalImages.push(colorImage);

        const absDeviation = this.currentImageData.data.map((x, idx) => {
          return Math.abs(x - possibleImages[i].data[idx]) / 255;
        }).reduce((tot, num) => {
          return tot + num
        })
        if (absDeviation < minAbsDeviation) {
          i_min = i;
          minAbsDeviation = absDeviation;
        }
        // console.log(`i: ${i}, absDeviation: ${absDeviation}, i_min: ${i_min}, minAbsDeviation: ${minAbsDeviation}`);
      }

      console.log("targetImageUrl", targetImageUrls[ids[i_min]]);
      this.alreadyShowedUrls.push(targetImageUrls[ids[i_min]]);
      this.targetImageData = possibleImages[i_min];
      this.originalImageData = originalImages[i_min];
      this.targetImageId = ids[i_min];
      this.sampleCount = 0;
      this.targetImageAmplitude = Math.max(0.0, this.externalFieldOffset);
    }

  }

  sampleNextFrame() {
    // Perform samplesPerFrame steps of Gibbs sampling:
    for (let t = 0; t < this.samplesPerFrame; t++) {
      const x = Math.floor((Math.random() * this.imageW));
      const y = Math.floor((Math.random() * this.imageH));
      const index_xy = (x + y * this.imageW) * 4;
      const pixel_xy = 2/255*this.currentImageData.data[index_xy] - 1;
      //console.log(`pixel_xy: ${pixel_xy}`);

      // Calculate energy difference of image with pixel x,y flipped and image
      let dE_interaction = -1;
      for (
        var yy = Math.max(y - Math.floor(this.neighborWindowSize/2), 0);
        yy <= Math.min(y + Math.floor(this.neighborWindowSize/2), this.imageH-1);
        yy++
      ) {
        for (
          var xx = Math.max(x - Math.floor(this.neighborWindowSize/2), 0);
          xx <= Math.min(x + Math.floor(this.neighborWindowSize/2), this.imageW-1);
          xx++
        ) {
          const index_xxyy = (xx + yy * this.imageW) * 4;
          dE_interaction += 2 *
            (2/255 * this.currentImageData.data[index_xxyy] - 1) *
            9/Math.pow(this.neighborWindowSize, 2) * pixel_xy;
        }
      }
      //console.log(`dE_interaction: ${dE_interaction}`);

      const dE_external = this.targetImageAmplitude *
        2 * this.exteralFieldStrength *
        pixel_xy * (2/255 * this.targetImageData.data[index_xy] - 1);
      //console.log(`dE_external: ${dE_external}`)

      const pAccept = Math.exp(-this.beta * Math.max(0, dE_interaction + dE_external));
      //console.log(`pAccept: ${pAccept}`);

      // Flip pixel_xy with probability pAccept
      if (Math.random() < pAccept) {
        const newVal = this.currentImageData.data[index_xy] === 0 ? 255 : 0;
        this.currentImageData.data[index_xy] = newVal;
        this.currentImageData.data[index_xy + 1] = newVal;
        this.currentImageData.data[index_xy + 2] = newVal;
      }
    }
  }

}
