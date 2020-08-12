# node-red-contrib-windy
Node red node to upload weather data to windy.com

**this node is currently in development. It works but do not expect thorough testing or stability. All testing is currently done on a Raspberry Pi with information from an Acurite 5in1.**

This node is designed to take raw weather station data and upload that to windy. It was made for use with the [rtl_443 node](https://github.com/dayne/node-red-contrib-rtl_433) but should work with other weather stations as well.

# How to use
to install the node run:
```
npm install git+https://github.com/Id405/node-red-contrib-windy.git
```
in ~/.node-red/

or in ~/.node-red/node_modules/
```
git clone https://github.com/Id405/node-red-contrib-windy.git
```
if you want to tinker with it

then go to the [windy stations page](https://stations.windy.com/stations) and create an account, copy your api key into the node and add new weather station in the windy dashboard. Finally set the station id value in the node to the weather stations station id.

# Node Details

## Node properties
- station id:
  
  The id of the station that the node will upload data to.
- Api key:

  Your windy.com api key.
- Upload interval:

  How often the node will upload to windy.com, keep in mind that windy only updates in 5 minute increments so theres no need to upload any faster than that.

## Accepted payload inputs
msg.payload.
 - temperature_C
 - temperature_F
 - humidity (relative humidity)
 - wind_speed_kph
 - wind_speed_mph
 - wind_avg_km_h
 - wind_dir_deg
 - pressure_pa
 - pressure_mbar
 - pressure_baromin
 - rain_cm
 - rain_in

Wind information should be as raw as you can provide as it is used to calculate average wind and gust speed. If rtl_433 or whatever node you are using for data outputs data with different names make an issue so I can add it, I want this node to be something thats plug and play.

# To do list
 - Proper error handling on html request
 - Make a config file that can add aliases for names in the payload
 - Detailed description of node inside of node-red
 - Get having the api key be a credential instead of a config value work
