import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Customer = new Schema({
	name:{
		type: String
	},
	departure:{
		type: String
	},
	arrival:{
		type: String
	},
	seats:{
		type: Number,
		default: 0
	},
	flight_date:{
		type: String
	},
	airlines:{
		type: String
	}

},{ collection : 'customers' }
);


export default mongoose.model('Customer', Customer);