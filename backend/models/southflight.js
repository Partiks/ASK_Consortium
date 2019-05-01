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
		type: Number,
		default: 2
	}

},{ collection : 'South_Flights_DB' }
);

export default mongoose.model('SouthFlight', SouthFlight);