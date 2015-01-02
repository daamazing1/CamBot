#include <SoftwareSerial.h>
#include <Wire.h>
#include <Adafruit_MotorShield.h>

#define M1_STOP  B00000000
#define M1_CW    B00000001
#define M1_CCW   B00000010
#define M2_STOP  B00000100
#define M2_CW    B00000101
#define M2_CCW   B00000111

Adafruit_MotorShield MS = Adafruit_MotorShield();
Adafruit_DCMotor *m1 = MS.getMotor(1);
Adafruit_DCMotor *m2 = MS.getMotor(2);

int serialCommand = 0;
boolean speedCommand = false;
Adafruit_DCMotor *currentMotor;
// XBee's DOUT (TX) is connected to pin 6 (Arduino's Software RX)
// XBee's DIN (RX) is connected to pin 7 (Arduino's Software TX)
SoftwareSerial XBee(6, 7); // RX, TX

void setup(){
  MS.begin();
  XBee.begin(115200);
  Serial.begin(115200);
}

void loop(){
  if(XBee.available()>0){
    serialCommand = XBee.read();
    Serial.print("Received: ");
    Serial.println(serialCommand, DEC); 
    if(speedCommand){
      //Serial.println("In speed");
      speedCommand = false;
      currentMotor->setSpeed(serialCommand);
    }
    else{
      Serial.println("In motor and direction");
      //first byte read should be the motor and the direction
      if(((byte) serialCommand & B100) == B0){ //Motor1
        Serial.println("Motor1 if block");
        m1->run(decodeDirection((byte) serialCommand));
        currentMotor = m1;
      }        
      else{// Motor2
        Serial.println("Motor2 if block");
        m2->run(decodeDirection((byte) serialCommand));
        currentMotor = m2;
      }
      speedCommand = true;
    }    
  }
}

int decodeDirection(byte sc){
  byte d = sc & B11;
  switch (d){
    case B0:
      Serial.println("RELEASE");
      return RELEASE;
      break;
    case B1:
      Serial.println("FORWARD");
      return FORWARD;
      break;
    default:
      Serial.println("BACKWARD");
      return BACKWARD;
      break;
  }
}        
  
