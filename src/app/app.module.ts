import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HttpClientModule } from '@angular/common/http';

import { StoreModule  } from '@ngrx/store';
import { EffectsModule, Effect } from '@ngrx/effects';

import { StoreRouterConnectingModule } from '@ngrx/router-store';


import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers, metaReducers, CustomSerializer } from './reducer';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app.routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './core/login/login.component';
import { Login2Component } from './core/login2/login2.component';
import { HomeComponent } from './core/home/home.component';
import { HeaderComponent } from './core/header/header.component';

import { InterceptorServiceProvider } from './core/services/interceptor.service.provider';
import { LoadingScreenComponent } from './core/loading-screen/loading-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    LoadingScreenComponent,
    LoginComponent,
    Login2Component,
    HomeComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    NgbModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({serializer: CustomSerializer}),    
    environment.production ? [] : StoreDevtoolsModule.instrument(),            
  ],
  providers: [
    InterceptorServiceProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
