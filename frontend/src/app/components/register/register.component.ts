import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import { User } from '../../user.model';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

	registerForm: FormGroup;
	user: any = {};
	uname: String;

	constructor(private userService: UserService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
		this.registerForm = this.fb.group({
			username: ['', Validators.required],
			password: ['', Validators.required],
			employer:  ['', Validators.required]
		});
	}

	

	backToLogin(){
		console.log("Going back to login from register");
		this.router.navigate([`/login`]);
	}

	registerUser(uname, password, employer){
		if(uname == "" || password == "" || employer==""){
			this.router.navigate([`/error/${this.uname}`]);
			return ;
		}
		this.userService.getUserBalance(uname).subscribe( (bal) => {
			this.userService.addUser(uname, password, employer, bal). subscribe( () => {
				this.router.navigate([`/login`]);
			});
		});
	}

	ngOnInit() {
		this.uname = "register";
	}


}