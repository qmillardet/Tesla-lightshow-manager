import { Component } from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSnackBar, MatSnackBarAction, MatSnackBarActions} from "@angular/material/snack-bar";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [
    MatInputModule, MatFormFieldModule, MatSnackBarActions, MatButtonModule, MatSnackBarAction
  ],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css'
})
export class SnackbarComponent {
  message: string = "";


}
