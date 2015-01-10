#include <Wire.h>
#include <Adafruit_MotorShield.h>

#define MAX_MILLIS_TO_WAIT 1000

Adafruit_MotorShield MS = Adafruit_MotorShield();
Adafruit_DCMotor *motors[2] = {MS.getMotor(1), MS.getMotor(2)};

int firstByte = 0;
int secondByte = 0;

unsigned long starttime;

void setup(){
  Serial.begin(115200);
  MS.begin();
  Seial.println("Setup complete");
}

void loop(){
  starttime = millis();
  while((Serial.available()<2) && ((millis() - starttime) < MAX_MILLIS_TO_WAIT)){
    //loop here until we get two bytes of data or timout waiting
  }
  if(Serial.available() == 2){
    firstByte = Serial.read();
    secondByte = Serial.read();
    Serial.print("first: ");
    Serial.println(firstByte, BIN);
    Serial.print("second: ");
    Serial.println(secondByte,BIN);
    //first byte read should be the motor and the direction
    int motor = ((byte) firstByte & B11110000) >> 4;
    Serial.print("Motor: ");
    Serial.println(motor, DEC);
    int motorCommand = ((byte) firstByte & B00001111);
    Serial.print("Command: ");
    Serial.println(motorCommand,DEC);
    motors[motor]->run(motorCommand);
    Serial.print("Speed: ");
    Serial.println(secondByte,DEC);
    motors[motor]->setSpeed((int) secondByte);
  }
}
