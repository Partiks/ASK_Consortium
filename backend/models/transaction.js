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
	req_date:{
		type: Date
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
	seat_price:{
		type: String
	},
	date:{
		type: Date
	}
},{ collection : 'transactions' }
);


export default mongoose.model('Transaction', Transaction);