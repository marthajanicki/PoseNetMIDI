#include "MIDIUSB.h"

int AnalogValue = 0;

//Switches
int switchRead1;
int switchRead2;
int switchRead3;
int switchRead4;
int switchRead5;
int switchRead6;
int switchRead7;
int switchRead8;
int switchRead9;
int switchRead10;
int switchRead11;
int switchRead12;
int switchRead13;
int switchRead14;
int switchRead15;

int lastSwitch1 = -1;
int lastSwitch2 = -1;
int lastSwitch3 = -1;
int lastSwitch4 = 0;
int lastSwitch5 = 0;
int lastSwitch6 = 0;
int lastSwitch7 = 0;
int lastSwitch8 = -1;
int lastSwitch9 = -1;
int lastSwitch10 = -1;
int lastSwitch11 = -1;
int lastSwitch12 = -1;
int lastSwitch13 = -1;
int lastSwitch14 = -1;
int lastSwitch15 = -1;

int buttonPushCounter4 = 0;
int buttonPushCounter5 = 0;
int buttonPushCounter6 = 0;
int buttonPushCounter7 = 0;

//Pots
int potRead1;
int potRead2;
int potRead3;
int potRead4;
int potAvg1;
int potAvg2;
int potAvg3;
int potAvg4;

int threshold = 2;

int lastPotSent1 = 0;
int lastPotSent2 = 0;
int lastPotSent3 = 0;
int lastPotSent4 = 0;

int midiState1;
int midiState2;
int midiState3;
int midiState4;
bool midiState5;
bool midiState6;
bool midiState7;
//bool isMoving1;

int counter = 0;

void noteOn(byte channel, byte pitch, byte velocity) {
  midiEventPacket_t noteOn = {0x09, 0x90 | channel, pitch, velocity};
  MidiUSB.sendMIDI(noteOn);
}

void noteOff(byte channel, byte pitch, byte velocity) {
  midiEventPacket_t noteOff = {0x08, 0x80 | channel, pitch, velocity};
  MidiUSB.sendMIDI(noteOff);
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void controlChange(byte channel, byte control, byte value) {
  midiEventPacket_t event = {0x0B, 0xB0 | channel, control, value};
  MidiUSB.sendMIDI(event);
  //  Serial.print(control);
  //  Serial.println(control);
  //  Serial.println(value);
}

void loop() {

  //SERIAL COMS

  // put your main code here, to run repeatedly:
  if (Serial.available()) {
    String fromSerial = Serial.readStringUntil('\n');               // read until you see a \n

// First value is Effect
    int firstValueEnd = fromSerial.indexOf(',');                    // find the first comma and tell me how deep into the string it is
    String effect = fromSerial.substring(0, firstValueEnd); // give me a new string that includes everything till the first comma
//    int firstValue = firstValueString.toInt();                      // give me the int interpretation of that string
    //    Serial.println(firstValue);

    if(effect == "Effect 1"){
       int secondValueEnd = fromSerial.indexOf(',', firstValueEnd + 1);                  // search for the second comma, start searching after the first one
      String mappedLeftWristX = fromSerial.substring(firstValueEnd + 1, secondValueEnd); //give me a new string with everything beween first and second comma
      int mappedLeftWristXInt = mappedLeftWristX.toInt();
      controlChange(1, 1, mappedLeftWristXInt);

     int thirdValueEnd = fromSerial.indexOf(',', secondValueEnd + 1);                  // search for the second comma, start searching after the first one
      String mappedRightWristX = fromSerial.substring(secondValueEnd + 1, thirdValueEnd); //give me a new string with everything beween first and second comma
      int mappedRightWristXInt = mappedRightWristX.toInt();
      controlChange(1, 2, mappedRightWristXInt);
    }

    if(effect == "Effect 2"){
       int secondValueEnd = fromSerial.indexOf(',', firstValueEnd + 1);                  // search for the second comma, start searching after the first one
      String mappedcenterPoint = fromSerial.substring(firstValueEnd + 1, secondValueEnd); //give me a new string with everything beween first and second comma
      int mappedcenterPointInt = mappedcenterPoint.toInt();
      controlChange(1, 1, mappedcenterPointInt);
    }

    if(effect == "Effect 3"){
       int secondValueEnd = fromSerial.indexOf(',', firstValueEnd + 1);                  // search for the second comma, start searching after the first one
      String mappedLeftWristY = fromSerial.substring(firstValueEnd + 1, secondValueEnd); //give me a new string with everything beween first and second comma
      int mappedLeftWristYInt = mappedLeftWristY.toInt();
      controlChange(1, 3, mappedLeftWristYInt);
    }

    if(effect == "Effect 4"){
       int secondValueEnd = fromSerial.indexOf(',', firstValueEnd + 1);                  // search for the second comma, start searching after the first one
      String mappedDistBetween = fromSerial.substring(firstValueEnd + 1, secondValueEnd); //give me a new string with everything beween first and second comma
      int mappedDistBetweenInt = mappedDistBetween.toInt();
      controlChange(1, 4, mappedDistBetweenInt);
    }
    

//ABLETON CONTROLS

//TOP SECTION OF CONTROLLER

//Switch 1 - PLAY
switchRead1 = digitalRead(2);
if (switchRead1 != lastSwitch1) {
  controlChange(1, 5, switchRead1 * 127);
  Serial.println(switchRead1);
  lastSwitch1 = switchRead1;
}

//Switch 2 - STOP
switchRead2 = digitalRead(3);
if (switchRead2 != lastSwitch2) {
  controlChange(1, 6, switchRead2 * 127);
  lastSwitch2 = switchRead2;
}

//Switch 3 - RESET
switchRead3 = digitalRead(4);
if (switchRead3 != lastSwitch3) {
  controlChange(1, 7, switchRead3 * 127);
  lastSwitch3 = switchRead3;
}

//Switch 4 - EQ ON OFF
switchRead4 = digitalRead(5);
//Serial.print(switchRead4);
if (switchRead4 != lastSwitch4) {
  if (switchRead4 == 1) {
    buttonPushCounter4++;
    //    Serial.println(button);
    controlChange(1, 8, switchRead4 * 127);
    Serial.println(1);
  } else {
    //    Serial.println("off");
  }
  delay(50);
}
lastSwitch4 = switchRead4;
if (buttonPushCounter4 % 2) {
  switchRead4 = 1;
} else {
  switchRead4 = 0;
}
controlChange(1, 8, switchRead4 * 127);
//  Serial.println(switchRead4);
//}

//Switch 5 - RING MOD ON OFF
switchRead5 = digitalRead(6);
if (switchRead5 != lastSwitch5) {
  if (switchRead5 == 1) {
    buttonPushCounter5++;
    //    Serial.println(button);
    controlChange(1, 9, switchRead5 * 127);
    Serial.println(2);
  } else {
    //    Serial.println("off");
  }
  delay(50);
}
lastSwitch5 = switchRead5;
if (buttonPushCounter5 % 2) {
  switchRead5 = 1;
} else {
  switchRead5 = 0;
}
controlChange(1, 9, switchRead5 * 127);

//Switch 6 - TRANSPOSE ON OFF
switchRead6 = digitalRead(7);
if (switchRead6 != lastSwitch6) {
  if (switchRead6 == 1) {
    buttonPushCounter6++;
    //    Serial.println(button);
    controlChange(1, 10, switchRead6 * 127);
    Serial.println(3);
  } else {
    //    Serial.println("off");
  }
  delay(50);
}
lastSwitch6 = switchRead6;
if (buttonPushCounter6 % 2) {
  switchRead6 = 1;
} else {
  switchRead6 = 0;
}
controlChange(1, 10, switchRead6 * 127);


//Switch 7 - STUTTER ON OFF
switchRead7 = digitalRead(8);
if (switchRead7 != lastSwitch7) {
  if (switchRead7 == 1) {
    buttonPushCounter7++;
    //    Serial.println(button);
    controlChange(1, 11, switchRead7 * 127);
    Serial.println(4);
  } else {
    //    Serial.println("off");
  }
  delay(50);
}
lastSwitch7 = switchRead7;
if (buttonPushCounter7 % 2) {
  switchRead7 = 1;
} else {
  switchRead7 = 0;
}
controlChange(1, 11, switchRead7 * 127);


//BOTTOM SECTION OF CONTROLLER

//MELODY

//MELODY 1
switchRead8 = digitalRead(9);
if (switchRead8 != lastSwitch8) {
  controlChange(1, 12, switchRead1 * 127);
  Serial.println(switchRead8);
  lastSwitch8 = switchRead8;
}

//MELODY 2
switchRead9 = digitalRead(10);
if (switchRead9 != lastSwitch9) {
  controlChange(1, 13, switchRead1 * 127);
  Serial.println(switchRead9);
  lastSwitch9 = switchRead9;
}

//MELODY 3
switchRead10 = digitalRead(11);
if (switchRead10 != lastSwitch10) {
  controlChange(1, 14, switchRead1 * 127);
  Serial.println(switchRead10);
  lastSwitch10 = switchRead10;
}

//MELODY 4
switchRead11 = digitalRead(12);
if (switchRead11 != lastSwitch11) {
  controlChange(1, 15, switchRead1 * 127);
  Serial.println(switchRead11);
  lastSwitch11 = switchRead11;
}

//DRUMS 

//DRUMS 1
switchRead12 = digitalRead(14);
if (switchRead12 != lastSwitch12) {
  controlChange(1, 16, switchRead1 * 127);
  Serial.println(switchRead12);
  lastSwitch12 = switchRead12;
}

//DRUMS 2
switchRead13 = digitalRead(15);
if (switchRead13 != lastSwitch13) {
  controlChange(1, 17, switchRead1 * 127);
  Serial.println(switchRead13);
  lastSwitch13 = switchRead13;
}

//DRUMS 3
switchRead14 = digitalRead(16);
if (switchRead14 != lastSwitch14) {
  controlChange(1, 18, switchRead1 * 127);
  Serial.println(switchRead14);
  lastSwitch14 = switchRead14;
}

//DRUMS 4
switchRead15 = digitalRead(17);
if (switchRead15 != lastSwitch15) {
  controlChange(1, 19, switchRead1 * 127);
  Serial.println(switchRead15);
  lastSwitch15 = switchRead15;
}

}