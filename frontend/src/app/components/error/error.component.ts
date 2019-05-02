import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
	uname: String;
  flag: String = "";

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  	this.route.params.subscribe( params => {
      if(params.uname == "register"){
        this.flag = "Set";
      }else{
        this.uname = params.uname;
      }
      });
  }

  backToList(){
    console.log("Going back to list from create");
    console.log(this.uname);
    if(this.flag != "Set"){
      this.router.navigate([`/list/${this.uname}`]);
    }
    else{
      this.router.navigate([`/list/superuser`]);
    }
  }

}
