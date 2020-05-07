var bg;
var piano;
function preload() {
  bg = loadImage('./assets/bg.jpeg');
}

function setup() {
  var cnv = createCanvas(windowWidth, windowHeight);
  cnv.mousePressed(playOscillator);
  textAlign(CENTER);
  textSize(40);
  ellipseMode(CENTER);
  strokeWeight(2);
  rectMode(CENTER);
  piano = new Piano('VIRTUAL PIANO');
  piano.setUp();
}

// enable audioContext
function playOscillator() {
  piano.triOsc.start();
}

function draw() {
  background(bg);
  piano.draw();
}

function keyPressed() {
  if (piano) {
    piano.keyPressed();
  }
}

function keyReleased() {
  if (piano) {
    piano.keyReleased();
  }
}

class Piano {
  constructor(_name) {
    this.name = _name;

    this.notePressed = [false, false, false, false, false, false, false, false, false, false, false, false];

    this.attackLevel = 2.0;
    this.releaseLevel = 0;

    this.attackTime = 0.001;
    this.decayTime = 0.2;
    this.susPercent = 0.2;
    this.releaseTime = 0.5;
  }

  setUp() {
    this.env = new p5.Envelope();
    this.env.setADSR(this.attackTime, this.decayTime, this.susPercent, this.releaseTime);
    this.env.setRange(this.attackLevel, this.releaseLevel);

    this.triOsc = new p5.Oscillator('sine');
    this.triOsc.amp(this.env);

    this.fft = new p5.FFT();
  }

  draw() {
    // title
    this.drawTitle();
    // spectrum
    this.drawSpecturm();
    // black note
    this.drawNote(windowWidth/2-150, windowHeight/2-60, 'E', 'b', this.notePressed[0]);
    this.drawNote(windowWidth/2-90, windowHeight/2-60, 'R', 'b', this.notePressed[1]);
    this.drawNote(windowWidth/2+30, windowHeight/2-60, 'Y', 'b', this.notePressed[2]);
    this.drawNote(windowWidth/2+90, windowHeight/2-60, 'U', 'b', this.notePressed[3]);
    this.drawNote(windowWidth/2+150, windowHeight/2-60, 'I', 'b', this.notePressed[4]);
    
    // white note
    this.drawNote(windowWidth/2-180, windowHeight/2, 'S', 'w', this.notePressed[5]);
    this.drawNote(windowWidth/2-120, windowHeight/2, 'D', 'w', this.notePressed[6]);
    this.drawNote(windowWidth/2-60, windowHeight/2, 'F', 'w', this.notePressed[7]);
    this.drawNote(windowWidth/2, windowHeight/2, 'G', 'w', this.notePressed[8]);
    this.drawNote(windowWidth/2+60, windowHeight/2, 'H', 'w', this.notePressed[9]);
    this.drawNote(windowWidth/2+120, windowHeight/2, 'J', 'w', this.notePressed[10]);
    this.drawNote(windowWidth/2+180, windowHeight/2, 'K', 'w', this.notePressed[11]);
  }

  // draw title
  drawTitle() {
    fill(255);  
    strokeWeight(5);
    textSize(120);
    textFont("Georgia");
    text(this.name, width/2, 150);
    textFont("Normal");
  }

  // draw spectrum
  drawSpecturm() {
    // spectrum 
    var spectrum = this.fft.analyze(); 
    noStroke();
    fill(0);
    for (var i = 0; i< spectrum.length; i++){
      var x = map(i, 0, spectrum.length, 0, width/2);
      var h = -height/2 + map(spectrum[i], 0, 255, height/2, 0);
      rect(x, height/2, width / spectrum.length, h);
      rect(width-x, height/2, width / spectrum.length, h);
    }
  }

  // draw notes
  drawNote(xpos, ypos, key, color, pressed) {
    // black note
    var big = 0;
    if (pressed) {
      big = 8;
    }
    // shadow
    fill(100);
    strokeWeight(0);
    ellipse(xpos+3, ypos+3, 50+big, 50+big);
    // note
    if (color == 'b') {
      fill(0);
      stroke(255);  
    } else {
      fill(255);
      stroke(0);  
    }
    strokeWeight(2);
    ellipse(xpos, ypos, 50+big, 50+big);
    // text
    if (color == 'b') {
      fill(255);  
    } else {
      fill(0);
    }
    textSize(40);
    if (pressed) {
      textSize(44);
    }
    text(key, xpos, ypos+17);
  }

  playEnv(f){
    this.triOsc.freq(f);
    this.env.play();
  }

  // keypress
  keyPressed() {
    switch (keyCode) {
    case 83: // S
    case 115: // s
      this.playEnv(261); // C note
      this.notePressed[5] = true;
      break;
    case 69: // E
    case 101: // e
      this.playEnv(277); // C# note
      this.notePressed[0] = true;
      break;
    case 68: // D
    case 110: // d
      this.playEnv(293); // D note
      this.notePressed[6] = true;
      break;
    case 82: // R
    case 114: // r
      this.playEnv(311); // D# note
      this.notePressed[1] = true;
      break;
    case 70: // F
    case 102: // f
      this.playEnv(329); // E note
      this.notePressed[7] = true;
      break;
    case 71: // G
    case 103: // g
      this.playEnv(349); // F note
      this.notePressed[8] = true;
      break;
    case 89: // Y
    case 121: // y
      this.playEnv(369); // F# note
      this.notePressed[2] = true;
      break;
    case 72: // H
    case 104: // h
      this.playEnv(392); // G note
      this.notePressed[9] = true;
      break;
    case 85: // U
    case 117: // u
      this.playEnv(415); // G# note
      this.notePressed[3] = true;
      break;
    case 74: // J
    case 106: // j
      this.playEnv(440); // A note
      this.notePressed[10] = true;
      break;
    case 73: // U
    case 105: // u
      this.playEnv(466); // A# note
      this.notePressed[4] = true;
      break;
    case 75: // K
    case 107: // k
      this.playEnv(493); // B note
      this.notePressed[11] = true;
      break;
    default:
      break;
    }
  }

  // keyReleased
  keyReleased() {
    switch (keyCode) {
    case 83: // S
    case 115: // s
      // C note
      this.notePressed[5] = false;
      break;
    case 69: // E
    case 101: // e
      // C# note
      this.notePressed[0] = false;
      break;
    case 68: // D
    case 110: // d
      // D note
      this.notePressed[6] = false;
      break;
    case 82: // R
    case 114: // r
      // D# note
      this.notePressed[1] = false;
      break;
    case 70: // F
    case 102: // f
      // E note
      this.notePressed[7] = false;
      break;
    case 71: // G
    case 103: // g
      // F note
      this.notePressed[8] = false;
      break;
    case 89: // Y
    case 121: // y
      // F# note
      this.notePressed[2] = false;
      break;
    case 72: // H
    case 104: // h
      // G note
      this.notePressed[9] = false;
      break;
    case 85: // U
    case 117: // u
      // G# note
      this.notePressed[3] = false;
      break;
    case 74: // J
    case 106: // j
      // A note
      this.notePressed[10] = false;
      break;
    case 73: // U
    case 105: // u
      // A# note
      this.notePressed[4] = false;
      break;
    case 75: // K
    case 107: // k
      // B note
      this.notePressed[11] = false;
      break;
    default:
      break;
    }
  }
}


