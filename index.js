const Service, Characteristic;
const request = require('request');
const url = require('url');


module.exports = function (homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory("air-quality", "DomoAirQuality", domoAirQuality);
};

function domoAirQuality(log, config) {
	this.log = log;
	this.getUrl = url.parse(config['getUrl']);
}

domoAirQuality.prototype = {


	getAirQualityCharacteristic: function (next) {
		const me = this;
		request({
			url: me.getUrl,
			method: 'GET',
		},
		function (error, response, body) {
			if (error) {
				me.log('STATUS : ' + response.statusCode);
				me.log(error.message);
				return next(error);
			}
			return next(null, body.airQuality);
		})
	}

	getServices: function () {
		let informationService = new Service.AccessoryInformation();
		informationService
			.setCharacteristic(Characteristic.Manufacturer, "Domo Ari Gato")
			.setCharacteristic(Characteristic.Model, "Domo Air Quality")
			.setCharacteristic(Characteristic.SerialNumber, "2018-02-27-0001");

		let airQualitySensorService = new Service.AirQualitySensor("My Air Sensor");
		airQualitySensorService
			.getCharacteristic(Characteristic.AirQuality)
				.on('get', this.getAirQualityCharacteristic.bind(this));

		this.informationService = informationService;
		this.airQualitySensorService = airQualitySensorService;
		return [informationService, airQualitySensorService];
	}
};

