import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let SouthFlight = new Schema({
	departure:{
		type: String
	},
	arrival:{
		type: String
	},
	flight_date:{
		type: String
	},
	available_seats:{
		type: Number,
		default: 2
	}

},{ collection : 'South_Flights_DB' }
);

export default mongoose.model('SouthFlight', SouthFlight);