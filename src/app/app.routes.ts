import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { redirectUnauthorizedTo, redirectLoggedInTo, AuthGuard, canActivate } from '@angular/fire/auth-guard';
import { ProfileComponent } from './profile/profile/profile.component';
const redirectToLogin = ()=>redirectUnauthorizedTo(['/login']);
const redirectToHome = () =>redirectLoggedInTo(['/home'])

export const routes: Routes = [
    {
        path:"",
        redirectTo:'landing',
        pathMatch:'full'
    },
    {
        path:'landing',
        component:LandingComponent
    },
    {
        path:'login',
        component:LoginComponent,
        ...canActivate(redirectToHome)
    },
    {
        path:'signup',
        component:SignUpComponent, 
        ...canActivate(redirectToHome)
    },
    {
        path:'home',
        component:HomeComponent,
     ...canActivate(redirectToLogin)
    },
    {
        path:'profile',
        component: ProfileComponent,
        ...canActivate(redirectToLogin)

    }
    


];
