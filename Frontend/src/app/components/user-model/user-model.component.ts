import { Component, OnInit ,Input} from '@angular/core';
declare var $ : any;

@Component({
  selector: 'app-user-model',
  templateUrl: './user-model.component.html',
  styleUrls: ['./user-model.component.css']
})
export class UserModelComponent implements OnInit {

  @Input() title = `Information`;
  @Input() userId;

  constructor() { 
    
  }

  ngOnInit() {
  }

}
