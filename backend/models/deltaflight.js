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
	seats_available:{
		type: Number,
		default: 2
	}

},{ collection : 'Delta_Flights_DB' }
);

export default mongoose.model('DeltaFlight', DeltaFlight);