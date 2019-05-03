import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let DeltaFlight = new Schema({
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

},{ collection : 'Delta_Flights_DB' }
);

export default mongoose.model('DeltaFlight', DeltaFlight);