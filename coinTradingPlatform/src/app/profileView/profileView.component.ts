import { Component, OnInit } from '@angular/core';

import { environment } from '@env/environment';

@Component({
  selector: 'app-profileView',
  templateUrl: './profileView.component.html',
  styleUrls: ['./profileView.component.scss']
})
export class ProfileViewComponent implements OnInit {

  version: string = environment.version;

  constructor() { }

  ngOnInit() { }

}
