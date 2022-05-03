//set up PoseNet
let video;
let poseNet;

// set up serial comms
let serial;

//Serial shit
serial = new p5.SerialPort(); // make a new instance of  serialport library
serial.on("list"); // callback function for serialport list event
serial.on("data", serialEvent); // callback for new data coming in
serial.list(); // list the serial ports
serial.open("/dev/tty.usbmodem14103"); // open a port

//create variables for the wrists
let LeftWristX = 0;
let LeftWristY = 0;
let RightWristX = 0;
let RightWristY = 0;

let numReadings = 7;

//LeftWristX variables for smoothing
let readingsLWX = []; // make one of these for each x & y point of each wrist
let readIndexLWX = 0; // the index of the current reading
let totalLWX = 0; // the running total
let averageLWX = 0; // the average that I will want to send to circle readings

//LeftWristY variables for smoothing
let readingsLWY = []; // make one of these for each x & y point of each wrist
let readIndexLWY = 0; // the index of the current reading
let totalLWY = 0; // the running total
let averageLWY = 0; // the average that I will want to send to circle readings

//RightWristX variables for smoothing
let readingsRWX = []; // make one of these for each x & y point of each wrist
let readIndexRWX = 0; // the index of the current reading
let totalRWX = 0; // the running total
let averageRWX = 0; // the average that I will want to send to circle readings

//RightWristY variables for smoothing
let readingsRWY = []; // make one of these for each x & y point of each wrist
let readIndexRWY = 0; // the index of the current reading
let totalRWY = 0; // the running total
let averageRWY = 0; // the average that I will want to send to circle readings

let buttonTimeout = 20000;

//Effect 1 toggle button
let buttonE1;
let buttonToggleE1;

//Effect 2 toggle button
let buttonE2;
let buttonToggleE2;

//Effect 3 toggle button
let buttonE3;
let buttonToggleE3;

//Effect 4 toggle button
let buttonE4;
let buttonToggleE4;

//x: bins, y:time, z: amplitude value for each bin
let bins = 512;
let depth =32;
let scl = 20;
let strip;
let strips = [];

let song;
let fft;
let waveforms =[]; //an array of waveform arrays

let timer = 20;
let timerInterval;

let cool;


function preload(){
  // song = loadSound("Jellyfish_short.mp3")
  // song = loadSound("EnergyWorm.mp3");
  cool = loadFont('cool.ttf');
  
}

function modelReady() {
  console.log("model ready");
}


function setup() {

  createCanvas(windowWidth, windowHeight, WEBGL);
  // video = createCapture(VIDEO);
  let constraints = {
    video: {
      mandatory: {
        minWidth: 640,
        minHeight: 480
      },
    },
    audio: false
  };
  video = createCapture(constraints);
  
  textFont(cool);
  
  
  poseNet = ml5.poseNet(video, modelReady);
  video.hide();
  poseNet.on("pose", gotPoses);
  
  //Effect 1 button
  buttonE1 = createButton("Effect 1");
  buttonE1.position(0, 0);
  buttonE1.mousePressed(toggleTrueE1);
  
  //Effect 2 button
  buttonE2 = createButton("Effect 2");
  buttonE2.position(100, 0);
  buttonE2.mousePressed(toggleTrueE2);
  
  //Effect 3 button
  buttonE3 = createButton("Effect 3");
  buttonE3.position(200, 0);
  buttonE3.mousePressed(toggleTrueE3);
  
  //Effect 4 button
  buttonE4 = createButton("Effect 4");
  buttonE4.position(300, 0);
  buttonE4.mousePressed(toggleTrueE4);
  
    for (let thisReading = 0; thisReading < numReadings; thisReading++) {
    readingsLWX[thisReading] = 0;
    readingsLWY[thisReading] = 0;
    readingsRWX[thisReading] = 0;
    readingsRWY[thisReading] = 0;
    } 
  
  
  //blackhole audio
  source = new p5.AudioIn();
  source.start();
  source.connect();
  source.amp(1);

  //32 bins
  fft = new p5.FFT(0.8, bins);
  // song.loop();
  
  
}


function draw() {
  // noFill();
  // background(0);
  push();
  
  rotateX((-2 * PI) / 3);
  rotateY(2 * PI);
  
  // rotateX(-2*PI / 3);
  // rotateY(-PI);
  translate(0,200,200);
  translate((-1920/6) ,-1080/2);
  
  
  
  let waveform = fft.analyze();
  waveforms.push(waveform);
  if(waveforms.length>depth){
    waveforms.splice(0,1);
  }

  //make a new strip every frame(every second)
  strip = new Strip();
  strips.push(strip);
  
//pass on the y pos to the class, y pos = index number in the array -> as we keep splicing, the y pos keeps going up
  for (let s = 0; s < strips.length-2; s++) {
    strips[s].display(s,waveforms[s],waveforms[s+1]);
    //console.log(waveforms[s]);
  }
  
  if (strips.length > depth) {
    strips.splice(0, 1);
  }
  
  pop();

  
  translate((-windowWidth/2) ,(-windowHeight/2));
  imageMode(CENTER);
  rectMode(CENTER)
  for(let i=0; i<=50; i++){
    strokeWeight(40+i);
    stroke(i*10, i*12, i*12, i);
    rect((windowWidth/2), windowHeight/3, 640+30*i, 480+30*i);
  }
  image(video,windowWidth/2, windowHeight/3);
  
  fill(255, 255, 255, 0);
  noStroke();
  rect(windowWidth/2, windowHeight/2, windowWidth, windowHeight);
  fill(255, 0, 0, 200);

  translate((windowWidth/2)-640/2 ,(windowHeight/3)-480/2);
  if (buttonToggleE1) {
    // ellipse(averageLWX, averageLWY, 100);
    // ellipse(averageRWX, averageRWY, 100);
    push();
    translate(averageLWX,averageLWY );
      ambientLight(180);
      pointLight(255, 255, 255, 0, windowWidth/5, 50);
      specularMaterial('#168aad');
      shininess(50);
    sphere(40);
    pop();
    
    
        push();
    translate(averageRWX,averageRWY );
      ambientLight(180);
      pointLight(255, 255, 255, 0, windowWidth/5, 50);
      specularMaterial('#168aad');
      shininess(50);
    sphere(40);
    pop();
    
    // Send values to Arduino
    let mappedLeftWristX = map(averageLWX, 0, 640, 0, 127);
    let mappedRightWristX = map(averageRWX, 0, 640, 0, 127);
  
    
    serial.write("Effect 1" + ","); 
    serial.write(mappedLeftWristX + ","); // this makes it a string and adds a comma
    serial.write(mappedRightWristX + ","); // this makes it a string and adds a comma
    serial.write("\n"); // this adds a linefeed in end (ascii 10)
    // console.log("Effect 1" + " " + mappedLeftWristX + " " + mappedRightWristX);
  }
  
  if (buttonToggleE2) {
    // ellipse(averageLWX, averageLWY, 100);
    // ellipse(averageRWX, averageRWY, 100);
    
        push();
    translate(averageLWX,averageLWY );
      ambientLight(180);
      pointLight(255, 255, 255, 0, windowWidth/5, 50);
      specularMaterial('#168aad');
      shininess(50);
    sphere(40);
    pop();
    
        push();
    translate(averageRWX,averageRWY );
      ambientLight(180);
      pointLight(255, 255, 255, 0, windowWidth/5, 50);
      specularMaterial('#168aad');
      shininess(50);
    sphere(40);
    pop();
    
    // Send values to Arduino
    let centerPoint = ((averageLWX + averageRWX) / 2);
    let mappedCenterPoint = map(centerPoint, 0, 640, 0, 127)
    
    serial.write("Effect 2" + ","); 
    serial.write(mappedCenterPoint + ","); // this makes it a string and adds a comma
    serial.write("\n"); // this adds a linefeed in end (ascii 10)
    // console.log("Effect 2" + " " + centerPoint);
    
  }
  
  if (buttonToggleE3) {
    // ellipse(averageLWX, averageLWY, 100);
    // ellipse(averageRWX, averageRWY, 100);
    
        push();
    translate(averageLWX,averageLWY );
      ambientLight(180);
      pointLight(255, 255, 255, 0, windowWidth/5, 50);
      specularMaterial('#168aad');
      shininess(50);
    sphere(40);
    pop();
    
        push();
    translate(averageRWX,averageRWY );
      ambientLight(180);
      pointLight(255, 255, 255, 0, windowWidth/5, 50);
      specularMaterial('#168aad');
      shininess(50);
    sphere(40);
    pop();
    
        let centerPoint = ((averageLWY + averageRWY) / 2);
    let mappedCenterPoint = map(centerPoint, 0, 480, 127, 0);
    
    serial.write("Effect 3" + ","); 
    serial.write(mappedCenterPoint + ","); // this makes it a string and adds a comma
    serial.write("\n"); // this adds a linefeed in end (ascii 10)
    // console.log("Effect 3" + " " + mappedCenterPoint);
  }
  
  if (buttonToggleE4) {
    // ellipse(averageLWX, averageLWY, 100);
    // ellipse(averageRWX, averageRWY, 100);
    
        push();
    translate(averageLWX,averageLWY );
      ambientLight(180);
      pointLight(255, 255, 255, 0, windowWidth/5, 50);
      specularMaterial('#168aad');
      shininess(50);
    sphere(40);
    pop();
    
        push();
    translate(averageRWX,averageRWY );
      ambientLight(180);
      pointLight(255, 255, 255, 0, windowWidth/5, 50);
      specularMaterial('#168aad');
      shininess(50);
    sphere(40);
    pop();
    
    let distBetween = dist(averageLWX, averageLWY, averageRWX, averageRWY);
    let newDistBetween = (averageLWX, averageLWY, averageRWX, averageRWY);
    
    let mappedDistBetween = map(distBetween, 0,640,0,127)
    
      serial.write("Effect 4" + ","); 
      serial.write(mappedDistBetween + ","); // this makes it a string and adds a comma
      serial.write("\n"); // this adds a linefeed in end (ascii 10)
      // console.log("Effect 4" + " " + mappedDistBetween);
    
    distBetween = newDistBetween;
  }
  
  if( (buttonToggleE1 || 
      buttonToggleE2 ||
      buttonToggleE3 ||
      buttonToggleE4 ) && timer) {
    
      
    push();
    strokeWeight(12)
    fill(30, 56, 106);
    stroke(255);
    textSize(72);
    text(`${timer}`, 40, 100);
    pop();
  }
}

//make each strip into an object, so that the whole shape could be put into an array
class Strip {
  constructor() {
    this.scl = 10;
    this.bins = 64;
    this.depth = 50;
    this.alpha = 255;
  }

  //waveform should be a nested array: 32 arrays with 32 values inside, 32 arrays to be the depth(y), 32 values to be the bins(x); the values should be the amplitude value from waveform().
  
  display(y,waveform1, waveform2) {
    //this waveform here is one of the arrays of waveforms
    //console.log(waveform);
    noFill();
    fill(255,this.alpha);
  stroke(0,this.alpha);
  strokeWeight(1);
    this.alpha-=8;
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < this.bins; x++) {
      // let z = map(waveform1[x],-1,1,-50,130);
      // let z2 = map(waveform2[x],-1,1,-100,100);
      let z = map(waveform1[x],0,-255,-50,130);
      let z2 = map(waveform2[x],0,-255,-100,100);
      //but i'll also need the same waveform[x] on the next y as z2: waveforms[i][x] & waveforms[i+1][x];
      
      if (z > 100) {
        fill(251, 217, 217, this.alpha);
        stroke(251, 217, 217,this.alpha);
      }
      if (z <= 99 && z >= 60) {
        fill(217, 251, 225, this.alpha);
        stroke(217, 251, 225,this.alpha);
      }
      if (z <= 59 && z >= 1) {
        fill(217, 241, 251, this.alpha);
        // stroke(217, 241, 251,this.alpha);
      }
      
      vertex(x * this.scl, y * this.scl, z);
      vertex(x * this.scl, (y + 1) * this.scl,z2);
      //console.log(z);
    }
    endShape();
    
}
}

function gotPoses(poses) {

  if (poses.length >= 1) {
    if (
      poses[0].pose.keypoints[9].position.x != undefined &&
      poses[0].pose.keypoints[9].position.y != undefined &&
      poses[0].pose.keypoints[10].position.x != undefined &&
      poses[0].pose.keypoints[10].position.y != undefined
    ) {
      if (poses[0].pose.leftWrist.confidence > 0.5 &&
          poses[0].pose.rightWrist.confidence > 0.5
         ) {
        
        // SMOOTHING FUNCTION -- LeftWristX
        // subtract from the last reading:
        totalLWX = totalLWX - readingsLWX[readIndexLWX];
        
        // get pose reading from posenet
        readingsLWX[readIndexLWX] = poses[0].pose.keypoints[9].position.x;
        
        //add this reading to the total:8
        totalLWX = totalLWX + readingsLWX[readIndexLWX];

        // go to the next position of the array:
        readIndexLWX = readIndexLWX + 1;
        
        // if we're at the end of the array...
        if (readIndexLWX >= numReadings) {
          // ...wrap around to the beginning:
          readIndexLWX = 0;
        }
        
        // calculate the average
        averageLWX = totalLWX / numReadings;

        // SMOOTHING FUNCTION -- LeftWristY
        // subtract from the last reading:
        totalLWY = totalLWY - readingsLWY[readIndexLWY];
        
        // get pose reading from posenet
        readingsLWY[readIndexLWY] = poses[0].pose.keypoints[9].position.y;
        
        //add this reading to the total:8
        totalLWY = totalLWY + readingsLWY[readIndexLWY];

        // go to the next position of the array:
        readIndexLWY = readIndexLWY + 1;
        
        // if we're at the end of the array...
        if (readIndexLWY >= numReadings) {
          // ...wrap around to the beginning:
          readIndexLWY = 0;
        }
        
        // calculate the average
        averageLWY = totalLWY / numReadings;
        
        
        // SMOOTHING FUNCTION -- RightWristX
        // subtract from the last reading:
        totalRWX = totalRWX - readingsRWX[readIndexRWX];
        
        // get pose reading from posenet
        readingsRWX[readIndexRWX] = poses[0].pose.keypoints[10].position.x;
        
        //add this reading to the total:8
        totalRWX = totalRWX + readingsRWX[readIndexRWX];

        // go to the next position of the array:
        readIndexRWX = readIndexRWX + 1;
        
        // if we're at the end of the array...
        if (readIndexRWX >= numReadings) {
          // ...wrap around to the beginning:
          readIndexRWX = 0;
        }
        
        // calculate the average
        averageRWX = totalRWX / numReadings;
        
        // SMOOTHING FUNCTION -- RightWristY
        // subtract from the last reading:
        totalRWY = totalRWY - readingsRWY[readIndexRWY];
        
        // get pose reading from posenet
        readingsRWY[readIndexRWY] = poses[0].pose.keypoints[10].position.y;
        
        //add this reading to the total:8
        totalRWY = totalRWY + readingsRWY[readIndexRWY];

        // go to the next position of the array:
        readIndexRWY = readIndexRWY + 1;
        
        // if we're at the end of the array...
        if (readIndexRWY >= numReadings) {
          // ...wrap around to the beginning:
          readIndexRWY = 0;
        }
        
        // calculate the average
        averageRWY = totalRWY / numReadings;
      }
    }
  }
}

function toggleTrueE1() {
  buttonToggleE1 = true;
  clearInterval(timerInterval)
  startTimer();
  setTimeout(function () {
    buttonToggleE1 = false;
  }, buttonTimeout);
}


function toggleTrueE2() {
  buttonToggleE2 = true;
  clearInterval(timerInterval)
  startTimer();
  setTimeout(function () {
    buttonToggleE2 = false;
  }, buttonTimeout);
}

function toggleTrueE3() {
  buttonToggleE3 = true;
  clearInterval(timerInterval)
  startTimer();
  setTimeout(function () {
    buttonToggleE3 = false;
  }, buttonTimeout);
}

function toggleTrueE4() {
  buttonToggleE4 = true;
  clearInterval(timerInterval)
  startTimer();
  setTimeout(function () {
    buttonToggleE4 = false;
  }, buttonTimeout);
}

function startTimer() {
  timer = 20;
  timerInterval = setInterval(function() {
    timer--;
  },1000);
}

let effect = 0;

function serialEvent() {
  // this is called when data is recieved
  
  let stringFromSerial = serial.readLine();
  
  if(stringFromSerial.length > 0 ) {
    var myArray = split(stringFromSerial, ",")
    effect = myArray[0];
  }
  // console.log(effect)
  if(effect == 1 && !buttonToggleE1){
    console.log("triggering effect 1");
    toggleTrueE1()
  } else if(effect == 2 && !buttonToggleE2){
    console.log("triggering effect 2");
    toggleTrueE2();
  } else if(effect == 3 && !buttonToggleE3){
    console.log("triggering effect 3");
    toggleTrueE3();
  } else if(effect == 4 && !buttonToggleE4){
    console.log("triggering effect 4");
    toggleTrueE4();
  }
}