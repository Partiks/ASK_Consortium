import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {TransactionService} from '../../transaction.service';
import { User } from '../../user.model';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
	requestForm: FormGroup;
	uname: String;
	user: any = {};

	constructor(private transactionService: TransactionService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
		this.requestForm = this.fb.group({
			departure: ['', Validators.required],
			arrival: ['', Validators.required],
			flight_date: ['', Validators.required],
			seats: ['', Validators.required],
		});
	}

	backToList(){
	console.log("Going back to list from request");
	console.log(this.uname);
	this.router.navigate([`/list/${this.uname}`]);
	}

	addRequestTransaction(depart, arr, seats, flight_date){
		this.transactionService.addRequestTransaction(this.uname, depart, arr, seats, flight_date). subscribe( () => {
			this.router.navigate([`/list/${this.uname}`]);
		});
	}

	ngOnInit() {
	this.route.params.subscribe( params => {
	  this.uname = params.uname;
	  console.log("YASS REQUEST COMPONENT LOLPODO");
	  console.log(this.uname);
	});
	}

}
