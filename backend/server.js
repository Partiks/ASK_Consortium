import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import User from './models/user';
import SouthFlight from './models/southflight';
import DeltaFlight from './models/deltaflight';
import Transaction from './models/transaction';

const app = express();
//app.get('/', (req, res) => res.send("Hello from server.js !"));
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/ask_consortium');

const connection = mongoose.connection;

connection.once('open', () => {
	console.log('MongoDB database connection established sucessfully !');
})

// this is one endpoint


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


router.route('/users/add').post( (req, res) => {
	console.log("/users/add called");
	let user = new User(req.body);
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
	transaction.save()
		.then(transaction => {
			res.status(200).json({'Request Transaction' : 'Added sucessfully to consortium database'});
		})
		.catch(err => {
			res.status(400).send('Failed to add request transaction to consortium database');
		});
});

router.route('/transactions/add/offer').post( (req, res) => {
	console.log("/transactions/add/offer called");
	let transaction = new Transaction(req.body);
	console.log(transaction);
	transaction.save()
		.then(transaction => {
			res.status(200).json({'Offer Transaction' : 'Added sucessfully to consortium database'});
		})
		.catch(err => {
			console.log(err);
			res.status(400).send('Failed to add offer transaction to consortium database');
		});
});

router.route('/transactions/add/buy').post( (req, res) => {
	console.log("/transactions/add/buy called");
	let transaction = new Transaction(req.body);
	console.log(transaction);
	transaction.save()
		.then(transaction => {
			res.status(200).json({'Buy Transaction' : 'Added sucessfully to consortium database'});
		})
		.catch(err => {
			console.log(err);
			res.status(400).send('Failed to add BUY transaction to consortium database');
		});
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


app.use('/', router);


app.listen(4000, () => console.log('Express server running on port 4000'));