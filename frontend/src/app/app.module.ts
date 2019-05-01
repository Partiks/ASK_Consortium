import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {RouterModule, Routes} from '@angular/router';
import { MatToolbarModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListComponent } from './components/list/list.component';
import { RequestComponent } from './components/request/request.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { TransactionComponent } from './components/transaction/transaction.component';

const routes: Routes = [
  { path: 'request/:uname', component: RequestComponent },
  { path: 'login', component: LoginComponent },
  { path: 'list/:uname/seats', component: ListComponent },
  { path: 'list/:uname', component: ListComponent },
  { path: 'error/:uname', component: ErrorComponent },
  { path: 'transaction/:uname', component: TransactionComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full'}

];

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    RequestComponent,
    LoginComponent,
    ErrorComponent,
    TransactionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
