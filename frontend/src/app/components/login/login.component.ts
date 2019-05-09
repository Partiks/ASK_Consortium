import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

import { UserService } from '../../user.service';
import { User } from '../../user.model';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	loginForm: FormGroup;
	user: any = {};
	constructor(private userService: UserService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder) { 
		this.createForm();
	}

	createForm() {
	this.loginForm = this.fb.group({
			username: ['', Validators.required],
			password: ['', Validators.required]
		});
	}

	ngOnInit() {
	}

	login(uname, passwd){
		console.log(uname);
		console.log(passwd);
		this.userService.getUserByUname(uname).subscribe( (res) => {
			this.user = res;
			if(uname == this.user.username && passwd == this.user.password){
				console.log(" ---- LOGIN SUCCESSFULL --- ");
				this.router.navigate([`/list/${uname}`]);
			}else{
				console.log(" >>>> LOGIN FAILED >>>>");
				console.log(this.user);
			}
		});
	}

	registerUser(){
		this.router.navigate([`/register`]);
	}

}
