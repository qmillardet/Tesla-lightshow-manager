import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  icon: string = "assets/4D6056EF-D9E6-457B-A042-390691927EF8_1_105_c.jpeg"

}
