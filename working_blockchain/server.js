import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import User from './models/user';
import SouthFlight from './models/southflight';
import DeltaFlight from './models/deltaflight';
import Transaction from './models/transaction';

const fs = require("fs"),
//	abiDecoder = require('abi-decoder'),
	Web3 = require('web3'),
	solc = require('solc');

//const output = solc.compile(input.toString());
//console.log(output)
//const bytecode = output.contracts[':Token'].bytecode;
//const abi = JSON.parse(output.contracts[':Token'].interface);
const bytecode = fs.readFileSync('contracts_Payment_sol_Payment.bin').toString();
//console.log(bytecode);
const abi = JSON.parse(fs.readFileSync('contracts_Payment_sol_Payment.abi').toString());

const web3 = new Web3('ws://localhost:7545', null, {});
let Payment = new web3.eth.Contract(abi);
global.lol_var = "LOL";
//abiDecoder.addABI(abi);

let SampleContract = web3.eth.Contract(abi);

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
//deploying smart contract
var allAccounts;
var contractAddress;
var result;
web3.eth.getAccounts().then(accounts => {
	console.log("deploying SC\n");
	allAccounts = accounts;
	//console.log(accounts);
	//console.log(allAccounts);
	Payment.deploy({data: bytecode}).send({
		from: accounts[0],
		gas: 600000,
    	gasPrice: '4000000000000'
	}).then((instance) => {
		console.log(accounts);
		result = instance;
		console.log(result.options.address);
		console.log("IT ENTERED !");
		Payment.options.address = instance.options.address;
		lol_var = instance.options.address;
		console.log(instance.options.address);
		console.log(Payment.options.address);
		//console.log(receipt.options.address); // contains the new contract address
		//console.log(Payment.address);
	})
	console.log("AYU");
	/*.on('receipt', receipt =>{
		console.log(receipt);
		contractAddress = receipt.contractAddress;
		Payment.options.address = receipt.contractAddress;
		console.log("Smart Contract Deployed !");
	}) */
});

/*web3.eth.getAccounts().then(acc => {
	allAccounts = acc;
	console.log(allAccounts);
	console.log("Deploying the contract");
	let code = '0x' + bytecode;
	let contract = SampleContract.new({from: allAccounts[1], gas: 1000000, data: code});
});

// Transaction has entered to geth memory pool
//console.log("Your contract is being deployed in transaction at http://127.0.0.1:7545" + contract.transactionHash);

// http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// We need to wait until any miner has included the transaction
// in a block to get the address of the contract
/*async function waitBlock() {
  while (true) {
    let receipt = web3.eth.getTransactionReceipt(contract.transactionHash);
    if (receipt && receipt.contractAddress) {
      console.log("Your contract has been deployed at http://testnet.etherscan.io/address/" + receipt.contractAddress);
      console.log("Note that it might take 30 - 90 sceonds for the block to propagate befor it's visible in etherscan.io");
      break;
    }
    console.log("Waiting a mined block to include your contract... currently in block " + web3.eth.blockNumber);
    await sleep(4000);
  }
}

waitBlock();
*/

router.route('/accounts').get((req, res) => {
	console.log("Blockchain /accounts called");
	web3.eth.getAccounts().then(accounts =>{
		accounts.forEach(account =>{
			console.log(account)
		})
		res.json(accounts);
	});
});

router.route('/transfer').get((req, res) => {
	/*web3.eth.getAccounts().then(accounts => {
		allAccounts = accounts;
		Voting.deploy({data: bytecode}).send({
			from: accounts[0],
			gas: 1500000,
			gasPrice: '30000000000000'
		}).on('receipt', receipt => { */
			//Voting.options.address = receipt.contractAddress;
			var result;
			var amt = 20;
			Payment.options.address = contractAddress;
			console.log("------------------");
			console.log(contractAddress);
			console.log(lol_var);
			Payment.options.address = lol_var;
			console.log(Payment.options.address);
			console.log("------------------");
			Payment.methods.transferFund(allAccounts[1]).send({from: allAccounts[0], value:web3.utils.toWei(amt.toString(),'ether')}).then(transaction => {
			console.log("Transfer lodged. Transaction ID: " + transaction.transactionHash);
			let blockHash = transaction.blockHash
			return web3.eth.getBlock(blockHash, true);
			}).then(block => {
				block.transactions.forEach(transaction => {
					//console.log(abiDecoder.decodeMethod(transaction.input));
				});
				allAccounts.forEach(account => {
					Payment.methods.getBalanceOfCurrentAccount(account).then(amount => {
						result = result + account + ": " + amount;
						console.log(account + ": " + amount);
					});
				});
			});
		//});
	//});
	res.json(result);
});

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

router.route('/transactions').get( (req, res) => {
	console.log("/transactions called");
	Transaction.find((err, transaction) => {
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



app.use('/', router);


app.listen(4000, () => console.log('Express server running on port 4000'));