import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatTableDataSource} from '@angular/material';

import { User } from '../../user.model';
import { Transaction } from '../../transaction.model';
import { Flight } from '../../flight.model';
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
	buyer: any = {};
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

	offerSeats(id){
	/*
		Stage 1: Find the transaction of interest [transactionService.getTransactionById()]
		Stage 2: See if the requester is not the same as the proposed seller (responder) [Status == 'Closed' or requester == this.uname]
		Stage 3: Identify the airlines and get the flight of interest, this code can be changed to dynamically handle any airlines in future [this.uname == 'a_delta' && getSpecificFlight]
		Stage 4: See if the airlines that is offering seats, actually has the seats to sell it to requester airlines. [flightService.getSpecificFlight(departure, arrival, flight_date)]
		Stage 5: Update the flight's available_seats (freeze those seats)
		Stage 6: Add Offer transaction in Blockchain
	*/
		console.log("REACHED CONFIRM_TRANSACTION");
		//Stage 1
		this.transactionService.getTransactionById(id).subscribe(res => {
			this.transaction = res;
			console.log(this.transaction);
			console.log(this.user);
			//Stage 2
			if(this.transaction.status == "Closed" || this.transaction.requester == this.uname){
				this.router.navigate([`/error/${this.uname}`]);
				return ;
			}
			//Stage 3
			if(this.uname == "a_delta"){
				console.log("IDENTIFIED SELLER AS DELTA");
				console.log(this.transaction.departure, this.transaction.arrival, this.transaction.flight_date);
				this.flightService.getSpecificDeltaFlight(this.transaction.departure, this.transaction.arrival, this.transaction.flight_date).subscribe( res => {
					// search flight available in seller's flight DB
					console.log("YAYYY, FLIGHT RES FOUND !");
					console.log(this.flight);
					this.flight = res;
					var fs = this.flight.available_seats;
					var ts = this.transaction.seats;
					//STAGE 4
					if(fs >= ts){
						//STAGE 5
						this.flightService.updateSpecificDeltaFlight(this.transaction.departure, this.transaction.arrival, this.transaction.flight_date, this.transaction.seats).subscribe(()=>{
							//STAGE 6 updated flight seats, now add transaction
							this.transaction.buyer = this.transaction.requester; //setting this now to avoid race conditions on offers
							this.transaction.seller = this.uname;
							this.transaction.status = "Available Offer"; //
							this.transactionService.addOfferTransaction(this.transaction).subscribe( () =>{
								this.fetchTransactions();
							});
						});
					}else{
						//this.router.navigate([`/error/${this.uname}`]);
					}
				});
			}
			if(this.uname == "b_south"){
				//TODO: implement this function in flight service, then in server.js
				//searching if flight is available in seller airline's DB
				console.log("IDENTIFIED SELLER AS SOUTHWEST");
				console.log(this.transaction.departure, this.transaction.arrival, this.transaction.flight_date);
				this.flightService.getSpecificSouthFlight(this.transaction.departure, this.transaction.arrival, this.transaction.flight_date).subscribe( res => {
					// search flight available in seller's flight DB
					console.log("YAYYY, FLIGHT RES FOUND !");
					console.log(this.flight);
					this.flight = res;
					var fs = this.flight.available_seats;
					var ts = this.transaction.seats;
					//STAGE 4
					if(fs >= ts){
						//STAGE 5
						this.flightService.updateSpecificSouthFlight(this.transaction.departure, this.transaction.arrival, this.transaction.flight_date, this.transaction.seats).subscribe(()=>{
							//STAGE 6 updated flight seats, now add transaction
							this.transaction.buyer = this.transaction.requester; //setting this now to avoid race conditions on offers
							this.transaction.seller = this.uname;
							this.transaction.status = "Available Offer"; //
							this.transactionService.addOfferTransaction(this.transaction).subscribe( () =>{
								this.fetchTransactions();
							});
						});
					}else{
						//this.router.navigate([`/error/${this.uname}`]);
					}
				});
			}

			console.log(this.user.balance);
			/*this.transactionService.updateTransaction(id, this.transaction.name, this.uname, this.transaction.description, this.transaction.price, "Closed Out").subscribe(() => {
			    	this.fetchTransactions();
			});
		    console.log("STEP 4");
		    console.log("STEP 5"); */
		});
	}


	buyTransaction(id){
	/*
		Stage 1: get transaction
		Stage 2: check if seats are already bought or the seller is trying to buy the seats from himself
		Stage : get buyer (requester) and seller usernames, deduct $1 from buyer's account and add $1 to seller's account
		Stage : add buyTransaction() to transaction database
		Stage : modify flight database to reflect the transaction
	*/

		console.log("REACHED BUY_TRANSACTION");
		this.transactionService.getTransactionById(id).subscribe(res => {
			this.transaction = res;
			if(this.transaction.status != "Available Offer" || this.transaction.requester != this.uname){
				this.router.navigate([`/error/${this.uname}`]);
				return ;
			}
			var seat_count = this.transaction.seats;
			var cost = seat_count*1; //base price of each seat is 1 ether
			console.log("COST OF SEATS = " + cost);

			this.userService.getUserByUname(this.uname).subscribe ( (buyer) => {
				this.buyer = buyer;
				console.log("BUYER FOUND = " + this.buyer.username + " balance = " + this.buyer.balance);
				this.userService.getUserByUname(this.transaction.seller).subscribe( (seller) =>{
					this.seller = seller;
					console.log(" SELLER FOUND = " + this.seller.username + " balance = " + this.seller.balance);
					this.buyer.balance = this.buyer.balance - cost;
					this.seller.balance = this.seller.balance + cost;
					//update buyer and seller database records
					this.userService.updateUser(this.buyer.username, this.buyer.password, this.buyer.employer, this.buyer.balance);
					this.userService.updateUser(this.seller.username, this.seller.password, this.seller.employer, this.seller.balance);

					//(not ?) adding transaction to database
					this.transaction.seller = this.seller.username;
					this.transaction.buyer = this.buyer.username;
					console.log(this.transaction);

					//marking the original transaction as "Closed"
					this.transactionService.updateSpecificTransaction(this.transaction.requester, this.transaction.departure, this.transaction.arrival, this.transaction.flight_date, this.transaction.seats, 'Closed').subscribe( ()=>{});

					//updating seller flight records
					if(this.seller.username == "a_delta"){
						this.flightService.updateSpecificDeltaFlight(this.transaction.departure, this.transaction.arrival, this.transaction.flight_date, this.transaction.seats).subscribe(()=>{
							
							//STAGE 6 updated flight seats, now add transaction
							this.transaction.status = "Bought"; 
							this.transactionService.addBuyTransaction(this.transaction).subscribe( () =>{
								this.fetchTransactions();
							});
						});
					}
					
					if(this.seller.username == "b_south"){
						this.flightService.updateSpecificSouthFlight(this.transaction.departure, this.transaction.arrival, this.transaction.flight_date, this.transaction.seats).subscribe(()=>{
							//STAGE 6 updated flight seats, now add transaction
							this.transaction.buyer = this.transaction.requester; //setting this now to avoid race conditions on offers
							this.transaction.seller = this.uname;
							this.transaction.status = "Available Offer"; //
							this.transactionService.addOfferTransaction(this.transaction).subscribe( () =>{
								this.fetchTransactions();
							});
						});
					}
					
				});
			});
		});
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

	deleteTransaction(id) {
		this.transactionService.deleteTransactionById(id).subscribe( () =>{
			this.fetchTransactions();
		});
	}

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