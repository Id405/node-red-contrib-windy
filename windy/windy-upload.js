var request = require('request');

module.exports = function(RED) {
    function isNumeric(num){
      return typeof num == "number";
    }

    function WindyNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.config = config;

        this.context().set("station", {})
        let windsum = 0;
        let windcount = 0;
        let credentials = this.credentials;
        this.context().set("lastUpload", Date.now() - config.interval * 60000 + 30000);

        node.log(credentials);

        node.on('input', function(msg) { //TODO make system that allows for adding aliases for sensor readings through config file
            let station = this.context().get("station")

            station.station = node.config.stationid;

//            if(typeof msg.payload.time === "string") {
//              station.dateutc = msg.payload.time;
//            }

            station.ts = Date.now();

            if(isNumeric(msg.payload.temperature_C)) {
              station.temp = msg.payload.temperature_C;
            }

            if(isNumeric(msg.payload.temperature_F)) {
              station.tempf = msg.payload.temperature_F;
            }

            if(isNumeric(msg.payload.humidity)) {
              station.rh = msg.payload.humidity;
            }

            if(isNumeric(msg.payload.wind_speed_kph) || isNumeric(msg.payload.wind_speed_mph) || isNumeric(msg.payload.wind_avg_km_h)) { //TODO use msg.payload.wind_speed_ms aswell
              if(isNumeric(msg.payload.wind_speed_mph)) {
                msg.payload.wind_speed_kph = msg.payload.wind_speed_mph * 1.609344;
              }

              if(isNumeric(msg.payload.wind_avg_km_h)) {
                msg.payload.wind_speed_kph = msg.payload.wind_avg_km_h;
              }

              let windspeed_ms = msg.payload.wind_speed_kph * 0.2777778;

              windsum += windspeed_ms;
              windcount += 1;

              if(windspeed_ms > station.gust || typeof station.gust === 'undefined') {
                station.gust = windspeed_ms;
              }
            }

            if(isNumeric(msg.payload.wind_dir_deg)) {
              station.winddir = msg.payload.wind_dir_deg;
            }

            if(isNumeric(msg.payload.pressure_pa)) {
              station.pressure = msg.payload.pressure_Pa;
            }

            if(isNumeric(msg.payload.pressure_mbar)) {
              station.mbar = msg.payload.pressure_mbar;
            }

            if(isNumeric(msg.payload.pressure_baromin)) {
              station.baromin = msg.payload.pressure_baromin;
            }

            if(isNumeric(msg.payload.rain_cm)) {
              station.precip = msg.payload.rain_cm;
            }

            // if(isNumeric(msg.payload.rain_in)) {
            //   station.precip = msg.payload.rain_in; // TODO figure out rain measurement
            // }

            if(Date.now() - this.context().get("lastUpload") >= config.interval * 60000) {
              this.context().set("lastUpload", Date.now());

              if(windcount > 0) {
                  station.wind = windsum/windcount;
              }

              requestData = {observations:[station]};

              node.log(JSON.stringify(requestData, null, 2));

              request({
                  url: `https://stations.windy.com/pws/update/${node.credentials.apikey}`,
                  method: "POST",
                  json: true,
                  body: requestData
              }, function (error, response, body){ //TODO proper error handling
              });

              station = {};
            }

            this.context().set("station", station)
        });
    }

    RED.nodes.registerType("windy-upload", WindyNode,
    {
      credentials: {
        apikey: {type:"text"},
      },
      encrypted: true
    }
    );
}
