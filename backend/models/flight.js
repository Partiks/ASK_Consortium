import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let SouthFlight = new Schema({
	departure:{
		type: String
	},
	arrival:{
		type: String
	},
	price:{
		type: String
	},
	seats_available:{
		type: String,
		default: '2'
	},

},{ collection : 'Delta_Flights_DB' }
);

export mongoose.model('SouthFlight', SouthFlight);

let DeltaFlight = new Schema({
	departure:{
		type: String
	},
	arrival:{
		type: String
	},
	price:{
		type: String
	},
	seats_available:{
		type: String,
		default: '2'
	},

},{ collection : 'Delta_Flights_DB' }
);

export mongoose.model('DeltaFlight', DeltaFlight);