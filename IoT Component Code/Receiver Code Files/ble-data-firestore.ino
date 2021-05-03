//#include <BLEAdvertisedDevice.h>
#include <BLEDevice.h>
#include <BLEScan.h>
//#include "WiFi.h"
#include <FirebaseESP32.h>
#include "Queue.h"

const char* ssid = "SO]-[AM";
const char* password =  "Mnis081!";

#define FIREBASE_HOST "https://deepblue-ab539-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "8QR15otxy6bZG0qn1KdXbh5W4RqM0BYaI1tmtM0Y"

FirebaseData firebaseData;
FirebaseJson json;

const int PIN = 2;

void setup() {

  pinMode(PIN, OUTPUT);
  BLEDevice::init("Illuminati");
  Serial.begin(115200);
  digitalWrite(PIN, HIGH);
  WiFi.begin("SO]-[AM", "Mnis081!");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
 
  Serial.println("Connected to the WiFi network");
  digitalWrite(PIN, LOW);

  Serial.println("IP Address: ");
  Serial.println(WiFi.localIP());
  
//--------------Firebase-------------------------
 Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

  Firebase.setReadTimeout(firebaseData, 1000 * 60);
  Firebase.setwriteSizeLimit(firebaseData, "tiny");
}

int *band1 = myobj1();
int *band2 = myobj2();

void loop() {

  if(WiFi.status() != WL_CONNECTED){
    digitalWrite(PIN, HIGH);
    WiFi.begin("SO]-[AM", "Mnis081!");
  
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.println("Connecting to WiFi..");
    }
 
  Serial.println("Connected to the WiFi network");
  digitalWrite(PIN, LOW);
  }
  else{
    String info = "";
    
  BLEScan *scan = BLEDevice::getScan();
  scan->setActiveScan(true);
  BLEScanResults results = scan->start(1);

  Serial.println("-----------------------------");
  int isband1 = 0;
  int isband2 = 0;
  
  for (int i = 0; i < results.getCount(); i++) {
    BLEAdvertisedDevice device = results.getDevice(i);
    int rssi = device.getRSSI();
    BLEAddress addd = device.getAddress();
    String addString = addd.toString().c_str();
    if (addString == "84:cc:a8:5f:87:5a"){
      insert(band1,rssi);
      Serial.printf("Band 1 detected!");
      isband1 = 1;
      }
    if (addString == "84:cc:a8:5e:a5:aa"){
      insert(band2,rssi);
      Serial.printf("Band 2 detected!");
      isband2 = 1;
      }
    Serial.printf("%s: and manufacture data = %s :",addd.toString().c_str(), device.getManufacturerData());
    Serial.println(rssi);
  }
    if(isband1 == 0){
      band1 = myobj1();
      }
     if(isband2 == 0){
      band2 = myobj2();
      } 
     Serial.println("Band 1 average is = "+ (String)avg(band1));
     Serial.println("Band 2 average is = "+ (String)avg(band2));
    if(avg(band1) < 0 && avg(band2) == 0){
      info = "84:cc:a8:5f:87:5a:"+(String)avg(band1) + ",";
      }
     if(avg(band1) == 0 && avg(band2) < 0){
      info = "84:cc:a8:5e:a5:aa:"+(String)avg(band2)+",";
      }
    if(avg(band1) < 0 && avg(band2) < 0){
      info = "84:cc:a8:5f:87:5a:"+(String)avg(band1)+","+"84:cc:a8:5e:a5:aa:"+(String)avg(band2)+",";
      } 
      if(avg(band1) == 0 && avg(band2) == 0){
        showarr(band1);
        info = "";
      }
     
    Serial.println("Info = " + info);
    json.set("/Receiver 1", info);
    digitalWrite(PIN, HIGH);
    Firebase.updateNode(firebaseData,"/Nearby BLEs",json);
    digitalWrite(PIN, LOW);
    } 
}
