import { Component, OnInit } from '@angular/core';
import { UserService } from '../../Services/user.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

import { iterateListLike } from '@angular/core/src/change_detection/change_detection_util';
import { isNgTemplate } from '@angular/compiler';
import { textSpanEnd } from 'typescript';
import { send } from 'q';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class VotingComponent implements OnInit {

  public delegateList:any;

  public concatenatedList=[];
  public totalDelegate=[];
  public nonVotedUsers=[];
  public votedUsers=[];
  public practiceArray=[];
  public checkVariable = true;
  public filteredUser=[];
  public sendString='';
  public arrToSend = [];
  public downVoteString = '';
  public downvoteToSend = [];
  public userList = [];
  public initialDelegate = [];
  item:any;
  flag=0;
  p: number = 1;
  unauth=false;
  value:any;
  count = 0;
  countDownvote = 0;
  pageDown = 1;
  userPage = 1;
  perPageUpvote = 20;
  perPageDownvote = 20;
  perPageCreate = 20;
  isUpvotedLoading = true;
  isDelegateLoading = true;
  isUserLoading = true;
  delegates=[];
  listOfUsers = [];

  constructor( private userService : UserService, public router:Router ) { }

  ngOnInit() {
    this.divideList();   
  }

  divideList(){
    this.initialDelegate=[];
    this.isUpvotedLoading = true;
    this.isDelegateLoading = true;
    this.isUserLoading = true;
    this.getAdminUpvoted();
    this.getDelegateList();
    setTimeout(() => {
      this.separateOnlyDelegate();
    },10000);
    // console.log(this.initialDelegate);
    this.getUserList();
    setTimeout(() =>{
      this.onlyUser();
    },15000);
    }
      

  getAdminUpvoted(){
    this.userService.getAdminUpvoted().subscribe(
      (data:any) => {
        // // console.log(data);
      
        this.votedUsers=data.delegates
        this.isUpvotedLoading = false;
      },
      error => {
        // console.log(error);
      }
    )
  }


  getDelegateList(){
    this.userService.getDelegateList().subscribe(
      (res:any) => {
        console.log('In get delegate',res.delegates);
        this.delegates = res.delegates
        // res.delegates.forEach()
      },
      error => {
        // console.log(error);
      }
    )
  }


  separateOnlyDelegate(){
    // console.log('Already Voted users',this.votedUsers);
    let index=0;
    let somevalue =0;
    this.delegates.forEach( delegateValue => {
      somevalue = 0;
      this.votedUsers.forEach( arrValue => {
        if(delegateValue.address == arrValue.address){
          somevalue=1;
        }
      }
      )
      if(somevalue == 0){
        this.initialDelegate.push(delegateValue)
      }
      index++
    }
    )
    this.isDelegateLoading = false;

  }


  getUserList(){
    this.userService.getuserVoterDetails().subscribe(
      (data1:any) => {       
        this.listOfUsers = data1.transformedUsers;
        },
        error => {
          // console.log(error);
        }
      )
  }

  
  onlyUser(){
    let somevalue =0;
    this.listOfUsers.forEach( userValue => {
      somevalue = 0;
      this.delegates.forEach( delegateValue => {
        if(userValue.role == 'user'){
          somevalue=1;
          // console.log('Same address');
          
        }
      }
    )
      if(somevalue == 1){
        this.concatenatedList.push(userValue)
        // console.log(somevalue);
        
      }
    }
  )
  // console.log('In make concat' ,this.concatenatedList);
    this.isUserLoading = false;
  }


  createDelegate(num){
    let item = this.concatenatedList[num].userId
    this.userService.creteDelegate({userId : item}).subscribe(
      data => {
        // console.log(data);
        this.showSuccess('User Added to Delegates');
        this.divideList();
        this.router.navigate(['/admin/dashboard']);
      },
      error => {
        this.showError(error.error.error);
        // console.log(error);
      }
    )
  }

  toggleEditable(event, i){
    // console.log('index no',i);
    let t = i +(this.perPageUpvote*(this.p-1))
    // console.log('t value',t);
    
    let checkItem =this.initialDelegate[t];
    if(event.target.checked && this.count<=101)
    {
      this.count++;
      if(!this.sendString){
        this.sendString = checkItem.name
      }
      else{
        this.sendString = this.sendString+','+checkItem.name;
      }
      // console.log(this.sendString);
    }
    else{
      if(event.target.checked && this.count>101){
        
        event.target.checked=false;
        this.showError('Limit reached')
      }
      else{
        this.count--;
        var index = 0;
        var ar = this.sendString.split(',');
        // console.log(ar);
        ar.forEach( removeEle => {
          if(checkItem.name == removeEle){
            ar.splice(index , 1);
            // console.log(ar);
          }
          index++;
        }
        )
        this.sendString = ar.toString();
        // console.log('Send String',this.sendString);
        
      }
    }
  }
  
  toUpvote(){
    if(this.sendString){
      
      if(!this.arrToSend)
      {
        this.arrToSend.push(this.sendString);
      }
      else{
          this.arrToSend.splice(0,1,this.sendString)
      }
      // console.log(this.arrToSend);
      this.userService.sendForUpvote({'args':this.arrToSend}).subscribe(
        (data:any) => {
          // console.log(data);
          this.showSuccess('Successfully UpVoted');
          this.arrToSend = [];
          this.sendString = '';
          this.count = 0;
          this.divideList();
          this.router.navigate(['/admin/dashboard']);        
        },
        error => {
          // console.log(error);
          this.showError('Some Error occured');
        }
      )
    }
    else{
      // console.log('sendString is empty');
      
    }
  }

  downvoteSubmit(){
    if(this.downVoteString){

      if(!this.downvoteToSend)
      {
        this.downvoteToSend.push(this.downVoteString);
      }
      else{
          this.downvoteToSend.splice(0,1,this.downVoteString)
      }
      // console.log(this.downvoteToSend);
      this.userService.sendForDownvote({'args':this.downvoteToSend}).subscribe(
        (data:any) => {
          // console.log(data);
          this.showSuccess('Successfully DownVoted');
          this.downvoteToSend = [];
          this.downVoteString = '';
          this.countDownvote = 0;
          this.divideList();
          this.router.navigate(['/admin/dashboard']);          
        },
        error => {
          // console.log(error);
          this.showError('Some Error occured');
        }
      )
    }
    else{
      // console.log('downVoteString is empty');
      
    }
  }


  toggleDownvote(event , i){
    let t = i +(this.perPageDownvote*(this.pageDown-1))
    let checkItem =this.votedUsers[t];
    // console.log((checkItem));
    
    if(event.target.checked && this.countDownvote <= 101){
      this.countDownvote++;
      if(!this.downVoteString){
        this.downVoteString = checkItem.name
      }
      else{
        this.downVoteString = this.downVoteString+','+checkItem.name;
      }
      // console.log(this.downVoteString);
    }
    else {
      if(event.target.checked && this.countDownvote > 101){
        event.target.checked=false;
        this.showError('Limit reached');
      }
      else {
        this.countDownvote--;
        var index = 0;
        var ar = this.downVoteString.split(',');
        // console.log(ar);
        ar.forEach( removeEle => {
          if(checkItem.name == removeEle){
            ar.splice(index , 1);
            // console.log(ar);
          }
          index++;
        }
        )
        this.downVoteString = ar.toString();
      }
      // console.log('DownVote String',this.downVoteString);
    }
  }



  showSuccess(data:string){
    swal({
      type: 'success',
      text: data,
      timer:2000
    })
  }

  showError(data:string){
    swal({
      type: 'error',
      text: data,
      timer:2000
    })
  }



  
  

}
