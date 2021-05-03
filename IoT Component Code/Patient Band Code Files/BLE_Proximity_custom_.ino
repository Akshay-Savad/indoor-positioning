#include <BLEAdvertisedDevice.h>
#include <BLEDevice.h>
#include <BLEScan.h>
#include <FirebaseESP32.h>
#include "time.h"

const int PIN = 2;
const int CUTOFF = -60;
BLEAdvertising *pAdvertising;

const char* ssid = "SO]-[AM";
const char* password =  "Mnis081!";

#define FIREBASE_HOST "https://deepblue-ab539-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "8QR15otxy6bZG0qn1KdXbh5W4RqM0BYaI1tmtM0Y"

FirebaseData firebaseData;
FirebaseJson json;

const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 19800;
const int   daylightOffset_sec = 0;
int detect_flag = 0;

void printLocalTime()
{
  Serial.println("Current time: ");
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
    return;
  }
  Serial.println(&timeinfo, "%A, %B %d %Y %H:%M:%S");
}

void setup() {
  pinMode(PIN, OUTPUT);
  BLEDevice::init("Band 2");
  Serial.begin(115200);
  pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->start();

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

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  printLocalTime();
}

void loop() {
  printLocalTime();
  BLEScan *scan = BLEDevice::getScan();
  scan->setActiveScan(true);
  BLEScanResults results = scan->start(1);
  int target_rssi = CUTOFF-10;
  Serial.println("-----------------------------");
  for (int i = 0; i < results.getCount(); i++) {
    BLEAdvertisedDevice device = results.getDevice(i);
    int rssi = device.getRSSI();
    BLEAddress addd = device.getAddress();
    Serial.printf("%s : ",addd.toString().c_str());
    Serial.printf("%s : ",device.getName().c_str());
//    Serial.printf("Advertised Device: %s :", device.toString().c_str());
    Serial.println(rssi);
    if (device.getName() == "Band 1" || device.getName() == "Band 2" || addd.toString() == "84:cc:a8:5e:a5:aa" || addd.toString() == "84:cc:a8:5f:87:5a") {
      target_rssi = rssi;
    }
  }
  Serial.println(target_rssi);
  Serial.println("-----------------------------");
//  digitalWrite(PIN, target_rssi < CUTOFF ? LOW : HIGH);
  if(target_rssi > CUTOFF && detect_flag == 0){
    detect_flag = 1;
    digitalWrite(PIN, HIGH);
    Serial.println("Band 2 detected!");
    struct tm timeinfo;
    if(getLocalTime(&timeinfo)){
      Serial.println("Writing Alert to firebase!");
      char timeStringBuff[50]; 
      strftime(timeStringBuff, sizeof(timeStringBuff), "%A, %B %d %Y %H:%M:%S", &timeinfo);
      String asString(timeStringBuff);
      json.set("/bandid", "84:cc:a8:5e:a5:aa");  //For Band 2
//      json.set("/bandid", "84:cc:a8:5f:87:5a"); //For Band 1
      Firebase.updateNode(firebaseData,"/Alert/socialDistancing/"+asString,json);
      }   
    }
    else{
      if(target_rssi < CUTOFF){
        detect_flag = 0;
        digitalWrite(PIN, LOW);
        }
      }
}
