import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import User from './models/user';
import Customer from './models/customer';
import SouthFlight from './models/southflight';
import DeltaFlight from './models/deltaflight';
import Transaction from './models/transaction';

//blockchain declarations
const fs = require("fs"),
//	abiDecoder = require('abi-decoder'),
	Web3 = require('web3'),
	solc = require('solc');

const bytecode = fs.readFileSync('blockchain_AskConsortium_sol_AirlineConsortium.bin').toString();
//console.log(bytecode);
const abi = JSON.parse(fs.readFileSync('blockchain_AskConsortium_sol_AirlineConsortium.abi').toString());

const web3 = new Web3('ws://localhost:7545', null, {});
let AskContract = new web3.eth.Contract(abi);
global.lol_var = "LOL";
global.flag='0';


const app = express();
//app.get('/', (req, res) => res.send("Hello from server.js !"));
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/ask_consortium');

const connection = mongoose.connection;

connection.once('open', () => {
	console.log('MongoDB database connection established sucessfully !');
});

// this is one endpoint

//deploying pre-compiled smart contract
var allAccounts;
var contractAddress;
var result;
web3.eth.getAccounts().then(accounts => {
	console.log("deploying SC\n");
	allAccounts = accounts;
	//console.log(accounts);
	//console.log(allAccounts);
	AskContract.deploy({data: bytecode}).send({
		from: accounts[0],
		gas: 6000000,
		gasPrice: '400000000000'
	}).then((instance) => {
		console.log(accounts);
		result = instance;
		console.log(result.options.address);
		console.log("IT ENTERED !");
		AskContract.options.address = instance.options.address;
		lol_var = instance.options.address;
		console.log(instance.options.address);
		console.log(AskContract.options.address);
	})
	console.log("AYU");
});

router.route('/accounts').get((req, res) => {
	console.log("Blockchain /accounts called");
	web3.eth.getAccounts().then(accounts =>{
		accounts.forEach(account =>{
			console.log(account)
		})
		res.json(accounts);
	});
});




router.route('/transactions').get( (req, res) => {
	console.log("/transactions called");
	Transaction.find((err, transaction) => {
		if (err)
			console.log(err);
		else
			res.json(transaction);
	});
});

router.route('/transactions/:id').get((req, res) => {
	console.log("/transactions/id called");
	Transaction.findById(req.params.id, (err, transaction) => {
		if (err)
			console.log(err);
		else
			res.json(transaction);
	});
});

router.route('/transactions/add/request').post( (req, res) => {
	console.log("/transactions/add/request called");
	let transaction = new Transaction(req.body);
	var result;
	AskContract.options.address = lol_var;
	console.log(AskContract.options.address);
	//blockchain save transaction
	var sender;
	if(transaction.requester == 'b_south'){
		sender = allAccounts[1];
	}else if(transaction.requester == 'a_delta'){
		sender = allAccounts[2];
	}else{
		console.log("Airlines not identified");
	}
	console.log("Selecting sender as "+sender);
	AskContract.methods.request(transaction.departure, transaction.arrival, transaction.seats, transaction.flight_date, transaction.date).send({from: sender, gas: 1000000}).then(transaction => {
		console.log("Request lodged. Transaction ID: " + transaction.transactionHash);
		let blockHash = transaction.blockHash
		return web3.eth.getBlock(blockHash, true);
	}).then(block => {
		//flag='1';
		block.transactions.forEach(transaction => {
			//console.log(abiDecoder.decodeMethod(transaction.input));
		});
		
		web3.eth.getAccounts().then(accounts => {
			web3.eth.getBalance(accounts[0]).then((bal)=>{
				console.log("BALANCE = "+bal);
			});
		});
		web3.eth.getAccounts().then(accounts => {
			web3.eth.getBalance(accounts[1]).then((bal)=>{
				console.log("BALANCE = "+bal);
			});
		});
		web3.eth.getAccounts().then(accounts => {
			web3.eth.getBalance(accounts[2]).then((bal)=>{
				console.log("BALANCE = "+bal);
			});
		});
	});
	//blockchain tx end
	/*if(flag == '0'){
		res.status(400).send('Failed to add request transaction DUE TO FLAG to consortium database');
	}else{ */
		transaction.save()
			.then(transaction => {
				res.status(200).json({'Request Transaction' : 'Added sucessfully to consortium database'});
			})
			.catch(err => {
				res.status(400).send('Failed to add request transaction to consortium database');
			});
	//}

	
});

router.route('/transactions/add/offer').post( (req, res) => {
	console.log("/transactions/add/offer called");
	let transaction = new Transaction(req.body);
	console.log(transaction);
	var amount = 1; //price of every seat is 1 ether
	AskContract.options.address = lol_var;
	console.log(AskContract.options.address);
	//blockchain save transaction
	var sender;
	var buyer;
	if(transaction.seller == 'b_south'){
		sender = allAccounts[1];
		buyer = allAccounts[2];
	}else if(transaction.seller == 'a_delta'){
		sender = allAccounts[2];
		buyer = allAccounts[1];
	}else{
		console.log("Airlines not identified");
	}
	console.log("Selecting offer sender as "+sender);
	AskContract.methods.offer(buyer, transaction.departure, transaction.arrival, transaction.seats, transaction.flight_date, transaction.date).send({from: sender, gas: 1000000}).then(transaction => {
		console.log("Offer lodged. Transaction ID: " + transaction.transactionHash);
		let blockHash = transaction.blockHash
		return web3.eth.getBlock(blockHash, true);
	}).then(block => {
		//flag='1';
		block.transactions.forEach(transaction => {
			//console.log(abiDecoder.decodeMethod(transaction.input));
		});
		web3.eth.getAccounts().then(accounts => {
			web3.eth.getBalance(accounts[0]).then((bal)=>{
				console.log("BALANCE = "+bal);
			});
		});
		web3.eth.getAccounts().then(accounts => {
			web3.eth.getBalance(accounts[1]).then((bal)=>{
				console.log("BALANCE = "+bal);
			});
		});
		web3.eth.getAccounts().then(accounts => {
			web3.eth.getBalance(accounts[2]).then((bal)=>{
				console.log("BALANCE = "+bal);
			});
		});
	});
	/*if(flag == '0'){
				res.status(400).send('Offer Blockchain Transaction Failed DUE TO FLAG');
	}else{*/
		transaction.save()
			.then(transaction => {
				res.status(200).json({'Offer Transaction' : 'Added sucessfully to consortium database'});				
			})
			.catch(err => {
				console.log(err);
				res.status(400).send('Failed to add offer transaction to consortium database');
			});
	//}
	
});

router.route('/transactions/add/buy').post( (req, res) => {
	console.log("/transactions/add/buy called");
	let transaction = new Transaction(req.body);
	var result;
	AskContract.options.address = lol_var;
	console.log(AskContract.options.address);
	//blockchain save transaction
	var sender;
	var seller;
	if(transaction.buyer == 'b_south'){
		sender = allAccounts[1];
		seller = allAccounts[2];
	}else if(transaction.buyer == 'a_delta'){
		sender = allAccounts[2];
		seller = allAccounts[1];
	}else{
		console.log("Airlines not identified for buy transaction");
	}
	console.log("Selecting BUYING sender as "+sender);
	var seats=transaction.seats;
	console.log("CALCULATED SEAT PRICE = " + seats);
	AskContract.methods.buy(seller, transaction.departure, transaction.arrival, transaction.seats, transaction.flight_date, transaction.date).send({from: sender, gas: 1000000, value: web3.utils.toWei(seats.toString(),'ether') }).then(transaction => {
		console.log("BUY TRANSACTION lodged. Transaction ID: " + transaction.transactionHash);
		let blockHash = transaction.blockHash
		return web3.eth.getBlock(blockHash, true);
	}).then(block => {
		//flag = '1';
		block.transactions.forEach(transaction => {
			//console.log(abiDecoder.decodeMethod(transaction.input));
		});
		web3.eth.getAccounts().then(accounts => {
			web3.eth.getBalance(accounts[0]).then((bal)=>{
				console.log("BALANCE = "+bal);
			});
		});
		web3.eth.getAccounts().then(accounts => {
			web3.eth.getBalance(accounts[1]).then((bal)=>{
				console.log("BALANCE = "+bal);
			});
		});
		web3.eth.getAccounts().then(accounts => {
			web3.eth.getBalance(accounts[2]).then((bal)=>{
				console.log("BALANCE = "+bal);
			});
		});
	});

	console.log(transaction);
	/*if(flag == '0'){
		res.status(400).send('Failed to add BUY transaction DUE TO FLAG to consortium database');
	}else{ */
		transaction.save()
			.then(transaction => {
				res.status(200).json({'Buy Transaction' : 'Added sucessfully to consortium database'});
			})
			.catch(err => {
				console.log(err);
				res.status(400).send('Failed to add BUY transaction to consortium database');
			});
	//}
	
});

router.route('/transactions/update/specific/:requ/:de/:arr/:fd/:seats/:status').get( (req, res) =>{
	console.log("/transactions/specific/ called");
	Transaction.findOne({requester: req.params.requ, departure: req.params.de, arrival: req.params.arr, flight_date: req.params.fd, seats: req.params.seats, status: 'Open'}, (err, transaction) => {

		if(!transaction){
			console.log("Entered TRANSACTION update error");
			res.status(400).send(err);
			console.log("Exiting TRANSACTION update error");
		}
		else
		{
			transaction.requester = req.params.requ;
			transaction.departure = req.params.de;
			transaction.arrival = req.params.arr;
			transaction.flight_date = req.params.fd;
			transaction.available_seats = req.params.seats;
			transaction.status = 'Closed';

			transaction.save().then(transaction => {
				res.json('Updated the TRANSACTION information ');
			}).catch(err => {
				res.status(400).send(err);
			});
		}
	});
});

router.route('/transactions/update/offer/:id').get( (req,res) => {
	console.log("/transactions/update/offer/id called");
	Transaction.findOne({_id: req.params.id}, (err, transaction) =>{
		transaction.status='Accepted';
		transaction.save().then(transaction => {
			res.json('Updated the OFFER TRANSACTION status');
		}).catch(err => {
			res.status(400).send(err);
		});
	});
});

router.route('/transactions/delete/:id').get( (req, res) => {
	console.log("/transactions/delete/id called");
	Transaction.findByIdAndRemove({_id: req.params.id}, (err, transaction) => {
		if(err)
			res.json(err);
		else
			res.json('Deletion successful');
	});
});


router.route('/flights/south').get( (req, res) => {
	console.log("/flights/south called");
	SouthFlight.find((err, flights) => {
		if (err)
			console.log(err);
		else
			res.json(flights);
	});
});

router.route('/flights/south/add').post( (req, res) => {
	console.log("/flights/add called");
	let southflight = new SouthFlight(req.body);
	southflight.save()
		.then(flight => {
			res.status(200).json({'flight' : 'Added sucessfully to Southwest database'});
		})
		.catch(err => {
			res.status(400).send('Failed to add flight to Southwest database')
		});
});

router.route('/flights/south/delete/:id').get( (req, res) => {
	console.log("/flights/delete/id called");
	SouthFlight.findByIdAndRemove({_id: req.params.id}, (err, flight) => {
		if(err)
			res.json(err);
		else
			res.json('Deletion successful');
	});
});

router.route('/flights/south/specific/:de/:arr/:fd').get( (req, res) =>{
	console.log("/flights/south/specific called");
	SouthFlight.findOne({departure: req.params.de, arrival: req.params.arr, flight_date: req.params.fd}, (err, flight) => {
		if(err)
			res.json(err);
		else
			res.json(flight);
	});
});

router.route('/flights/south/specific/:de/:arr/:fd/:seats').get( (req, res) =>{
	console.log("/flights/south/specific/SEATS called");
	SouthFlight.findOne({departure: req.params.de, arrival: req.params.arr, flight_date: req.params.fd}, (err, flight) => {

		if(!flight){
			console.log("Entered SOUTHWEST update flight error");
			res.status(400).send(err);
			console.log("Exiting SOUTHWEST update flight error");
		}
		else
		{
			flight.departure = req.params.de;
			flight.arrival = req.params.arr;
			flight.flight_date = req.params.fd;
			if(flight.available_seats > 0){
				flight.available_seats = flight.available_seats - req.params.seats;
			}

			flight.save().then(flight => {
				res.json('Updated the SOUTHWEST flight information with ' + flight.available_seats + ' seats remaining');
			}).catch(err => {
				res.status(400).send(err);
			});
		}
	});
});

router.route('/flights/delta/specific/:de/:arr/:fd/:seats').get( (req, res) =>{
	console.log("/flights/delta/specific/SEATS called");
	DeltaFlight.findOne({departure: req.params.de, arrival: req.params.arr, flight_date: req.params.fd}, (err, flight) => {

		if(!flight){
			console.log("Entered DELTA update flight error");
			console.log(req.params);
			res.send(err);
			console.log("Exiting DELTA update flight error");
		}
		else
		{
			console.log(flight);
			flight.departure = req.params.de;
			flight.arrival = req.params.arr;
			flight.flight_date = req.params.fd;
			flight.available_seats = flight.available_seats - req.params.seats;

			flight.save().then(flight => {
				res.json('Updated the DELTA flight information with ' + flight.available_seats + ' seats remaining');
			}).catch(err => {
				res.status(400).send(err);
			});
		}
	});
});

router.route('/flights/delta/specific/:de/:arr/:fd').get( (req, res) =>{
	console.log("/flights/delta/specific called");
	DeltaFlight.findOne({departure: req.params.de, arrival: req.params.arr, flight_date: req.params.fd}, (err, flight) => {
		if(err)
			res.json(err);
		else{
			res.json(flight);
		}
	});
});

/*router.route('/flights/delta/specific/:de/:arr/:fd').get( (req, res) =>{
	console.log("/flights/delta/specific called");
	DeltaFlight.findOne({departure: req.params.de, arrival: req.params.arr, date: req.params.fd}, (err, flight) => {
		if(err)
			res.json(err);
		else
			res.json(flight);
	});
}); */

router.route('/flights/delta').get( (req, res) => {
	console.log("/flights/delta called");
	DeltaFlight.find((err, flights ) => {
		if (err)
			console.log(err);
		else
			res.json(flights);
	});
});

router.route('/flights/delta/add').post( (req, res) => {
	console.log("/flights/add called");
	let deltaflight = new DeltaFlight(req.body);
	flight.save()
		.then(flight => {
			res.status(200).json({'flight' : 'Added sucessfully to Delta database'});
		})
		.catch(err => {
			res.status(400).send('Failed to add flight to Delta database')
		});
});

router.route('/flights/delta/delete/:id').get( (req, res) => {
	console.log("/flights/delete/id called");
	DeltaFlight.findByIdAndRemove({_id: req.params.id}, (err, flight) => {
		if(err)
			res.json(err);
		else
			res.json('Deletion successful');
	});
});

router.route('/users').get((req, res) => {
	console.log("/users called");
	User.find((err, users) => {
		if (err)
			console.log(err);
		else
			res.json(users);
	});
});

router.route('/users/:username').get((req, res) => {
	console.log("/users/username called");
	console.log("NODEJS SERVERSIDE FINDING USERNAME");
	User.findOne({username: req.params.username}, (err, user) => {
		if (err)
			console.log(err);
		else
			res.json(user);
	});
});

router.route('/users/:username/balance').get((req, res) => {
	console.log("/users/username/balance called");
	var balance;
	if(req.params.username == 'b_south'){
		web3.eth.getBalance(allAccounts[1]).then((bal)=>{
			balance = web3.utils.fromWei(bal.toString(),'ether');
			console.log("BALANCE = "+balance);
			res.json(balance);
		});
	}else if(req.params.username == 'a_delta'){
		web3.eth.getBalance(allAccounts[2]).then((bal)=>{
			balance = web3.utils.fromWei(bal.toString(),'ether');
			console.log("BALANCE = "+balance);
			res.json(balance);
		});
	}else{
		web3.eth.getBalance(allAccounts[4]).then((bal)=>{
			balance = web3.utils.fromWei(bal.toString(),'ether');
			console.log("BALANCE = "+balance);
			res.json(balance);
		});
		console.log("Airlines not identified for balance query");
	}
});


router.route('/users/add').post( (req, res) => {
	console.log("/users/add called");
	let user = new User(req.body);
	//blockchain registering user
	var sender;
	if(user.username == 'b_south'){
		sender = allAccounts[1];
	}else if(user.username == 'a_delta'){
		sender = allAccounts[2];
	}else{
		sender = allAccounts[4];
		console.log("Airlines not identified for registering");
	}
	console.log("Selecting sender as "+sender);
	AskContract.methods.registerUser(user.username, user.password).send({from: sender}).then(transaction => {
		console.log("Registeration lodged. Transaction ID: " + transaction.transactionHash);
		let blockHash = transaction.blockHash
		return web3.eth.getBlock(blockHash, true);
	}).then(block => {
		block.transactions.forEach(transaction => {
			//console.log(abiDecoder.decodeMethod(transaction.input));
		});
		
		web3.eth.getAccounts().then(accounts => {
			web3.eth.getBalance(accounts[0]).then((bal)=>{
				console.log("BALANCE = "+bal);
			});
		});
		web3.eth.getAccounts().then(accounts => {
			web3.eth.getBalance(accounts[1]).then((bal)=>{
				console.log("BALANCE = "+bal);
			});
		});
		web3.eth.getAccounts().then(accounts => {
			web3.eth.getBalance(accounts[2]).then((bal)=>{
				console.log("BALANCE = "+bal);
			});
		});
	});		
	//blockchain registering end
	
	user.save()
		.then(user => {
			res.status(200).json({'user' : 'Added sucessfully to consortium'});
		})
		.catch(err => {
			res.status(400).send('Failed to add user to consortium database')
		});
});

router.route('/users/update/:username').post( (req, res) => {
	console.log("/users/update/username called");
	User.findOne({username: req.params.username}, (err, user) =>{
		if(!user){
			console.log("Entered update user error");
			res.status(400).send(err);
			console.log("Exiting update user error");
		}
		else
		{
			user.username = req.body.username;
			user.password = req.body.password;
			user.employer = req.body.employer;
			user.balance = req.body.balance;

			user.save().then(user => {
				res.json('Updated the user information');
			}).catch(err => {
				res.status(400).send(err);
			});
		}
	})
});

router.route('/users/delete/:username').get( (req, res) => {
	console.log("/users/delete/username called");
	User.findOneAndDelete({username: req.params.username}, (err, user) => {
		if(err)
			res.json(err);
		else
			res.json('User Deletion successful');
	})
});

router.route('/customer/flight/change').post( (req, res) => {
	console.log("/customer/flight/change called");
	Customer.findOne({name: req.params.name, departure: req.params.departure, arrival: req.params.arrival, flight_date: req.params.flight_date, airlines: req.params.airlines}, (err, customer) =>{
		if(!customer){
			console.log("Entered update customer error");
			res.status(400).send(err);
			console.log("Exiting update customer error");
		}
		else
		{
			customer.name = req.body.name;
			customer.departure = req.body.departure;
			customer.arrival = req.body.arrival;
			customer.seats = req.body.seats;
			customer.flight_date = req.body.flight_date;
			customer.airlines = req.body.airlines;

			customer.save().then(customer => {
				res.json('Updated the customer information');
			}).catch(err => {
				res.status(400).send(err);
			});
		}
	})
});


app.use('/', router);


app.listen(4000, () => console.log('Express server running on port 4000'));