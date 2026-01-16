import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    imports: [RouterLink],
})
export class HeaderComponent {
    appcomponent : AppComponent;
    constructor(appcomponent : AppComponent) {
        this.appcomponent = appcomponent;
    }
    
}
