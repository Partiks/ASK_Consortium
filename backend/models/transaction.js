import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Transaction = new Schema({
	requester:{
		type: String
	},
	departure:{
		type: String
	},
	arrival:{
		type: String
	},
	flight_date:{
		type: String
	},
	seller:{
		type: String
	},
	buyer:{
		type: String
	},
	seats:{
		type: Number,
		default: 0
	},
	date:{
		type: String
	},
	status:{
		type: String
	}
},{ collection : 'transactions' }
);


export default mongoose.model('Transaction', Transaction);