import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let User = new Schema({
	username:{
		type: String
	},
	password:{
		type: String
	},
	employer:{
		type: String
	},
	balance:{
		type: Number,
		default: 101
	}
},{ collection : 'users' }
);


export default mongoose.model('User', User);