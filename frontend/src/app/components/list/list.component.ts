import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatTableDataSource} from '@angular/material';

import { User } from '../../user.model';
import { Transaction } from '../../transaction.model';
import {UserService} from '../../user.service';
import {FlightService} from '../../flight.service';
import {TransactionService} from '../../transaction.service'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
	transactions: Transaction[];
	transaction: any={};
	user: any = {};
	seller: any = {};
	flight: any = {};
	uname: String;
	super: boolean = false;
	displayedColumns = ['Departure', 'Arrival', 'Requester', 'Seller', 'Seats','Seat Price', 'Flight Date','Posted Date', 'Status', 'Actions'];

	constructor(private flightService: FlightService, private userService: UserService, private transactionService: TransactionService, private router: Router, private route: ActivatedRoute) { }

	ngOnInit() {
		this.transactionService.getAllTransactions().subscribe( (transactions) => {
			console.log(transactions);
		});
		this.fetchTransactions();
		this.route.params.subscribe( params => {
			this.uname = params.uname;
			 if(this.uname == "superuser"){
			 	this.super = true;
			 }
			 console.log("UNAME POSSIBLE ???");
			 console.log(this.uname);
			 this.userService.getUserByUname(this.uname).subscribe( res => {
			 	this.user = res;
			 })
		});
	}


	fetchTransactions(){
		this.transactionService
			.getAllTransactions()
			.subscribe( (data: Transaction[]) => {
				this.transactions = data;
				console.log('Data requested and received probably');
				console.log(this.transactions);
			});
	}

	confirmTransaction(id){
		console.log("REACHED CONFIRM_TRANSACTION");
		this.transactionService.getTransactionById(id).subscribe(res => {
			this.transaction = res;
			console.log(this.transaction);
			console.log(this.user);
			if(this.transaction.status == "Sold" || this.transaction.requester == this.uname){
				this.router.navigate([`/error/${this.uname}`]);
				return ;
			}
			// search flight available in seller's flight DB
			if(this.uname == "a_delta"){
				//TODO: implement this function in flight service, then in server.js
				console.log("IDENTIFIED SELLER AS DELTA");
				console.log(this.transaction.departure, this.transaction.arrival, this.transaction.flight_date);
				this.flight = this.flightService.getSpecificDeltaFlight(this.transaction.departure, this.transaction.arrival, this.transaction.flight_date);
				console.log(this.flight);
			}
			if(this.uname == "b_south"){
				//TODO: implement this function in flight service, then in server.js
				this.flight = this.flightService.getSpecificSouthFlight(this.transaction.departure, this.transaction.arrival, this.transaction.flight_date);
				console.log(this.flight);
			}

			console.log(this.user.balance);
			/*this.transactionService.updateTransaction(id, this.transaction.name, this.uname, this.transaction.description, this.transaction.price, "Sold Out").subscribe(() => {
			    	this.fetchTransactions();
			});
		    console.log("STEP 4");
		    console.log("STEP 5"); */
		});
	}


	buyTransaction(id){
	/*
		console.log("REACHED BUY_TRANSACTION");
		this.transactionService.getTransactionById(id).subscribe(res => {
			this.transaction = res;
			if(this.transaction.status == "Sold" || this.transaction.requester == this.uname){
				this.router.navigate([`/error/${this.uname}`]);
				return ;
			}
			console.log(this.transaction);
			console.log(this.user);
			console.log(this.transaction.seat_price);
			console.log(this.user.balance);
				if(this.transaction.seat_price < this.user.balance){
					console.log("STEP 2");
					this.userService.getUserByUname(this.transaction.owner).subscribe( (res)=>{
						console.log("STEP 3");
						this.seller = res;
						this.user.balance = parseInt(this.user.balance) - parseInt(this.transaction.price);
						console.log(this.user.balance);
						this.seller.balance = parseInt(this.seller.balance) + parseInt(this.transaction.price);
						console.log(this.seller.balance);
						console.log(this.user.username);
						console.log(this.seller.username);
						this.userService.updateUser(this.uname, this.user.password, this.user.balance).subscribe(() => { });
						this.userService.updateUser(this.seller.username, this.seller.password, this.seller.balance).subscribe(() => {	});
						this.transactionService.addTransaction(this.seller.username, this.user.username, this.transaction._id, this.transaction.name, this.transaction.price).subscribe(() => {});
						this.transactionService.updateTransaction(id, this.transaction.name, this.uname, this.transaction.description, this.transaction.price, "Sold Out").subscribe(() => { this.fetchTransactions(); });
					});
					console.log("STEP 4");
				}
				else{
					this.router.navigate([`/error/${this.uname}`]);
					console.log("INSUFFICIENT FUNDS");
					//throw insufficient funds error here
				}
		});
	*/
	}

	editTransaction(id) {
		this.router.navigate([`/edit/${this.uname}/${id}`]);
	}

	sellTransaction(){
	this.router.navigate([`/create/${this.uname}`]);
	}

	deposit(){
	this.router.navigate([`/deposit/${this.uname}`]);
	}

	/*deleteTransaction(id) {
		this.transactionService.getTransactionById(id).subscribe(res => {
		    this.transaction = res;
		    if(this.transaction.seller == this.uname && this.transaction.buyer != '-'){
		      this.transactionService.deleteTransaction(id).subscribe( () =>{
		        this.fetchTransactions();
		      });
		    }
		    else{
		      this.router.navigate([`/error/${this.uname}`]);
		    }
		});
	} */

	registerUser(){
		this.router.navigate([`/register/superuser`]);
	}

	showTransactions(){
		this.router.navigate([`/transaction/${this.uname}`]);
	}

	requestTransaction(){
		this.router.navigate([`/request/${this.uname}`]);
	}

	logOut(){
		console.log("LOGOUT");
		this.router.navigate([`/login`]);
	}
}