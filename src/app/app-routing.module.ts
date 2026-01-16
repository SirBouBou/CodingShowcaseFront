import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FallingSand1Component } from './falling-sand-1/falling-sand-1.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { GamesComponent } from './games/games.component';
import { ShowcasesComponent } from './showcases/showcases.component';

export const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'app1', component: FallingSand1Component, title: "Falling Sand"},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'games', component: GamesComponent},
  {path: 'showcases', component: ShowcasesComponent},
  {path: '', redirectTo: '/home', pathMatch:'full'}
];
