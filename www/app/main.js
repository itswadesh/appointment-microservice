'use strict';

(function() {

class MainController {

 constructor($http,$mdMedia,$mdDialog) {
    this.message = 'Hello';
    this.$http=$http;
    this.appointment = [];
    this.slots = [];
    this.$mdMedia = $mdMedia;
    this.$mdDialog = $mdDialog;
    
    // Configure dates
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 
    // Create date and slots array
    this.days = [{dd:dd,mm:mm,yyyy:yyyy},{dd:dd+1,mm:mm,yyyy:yyyy},{dd:dd+2,mm:mm,yyyy:yyyy},{dd:dd+3,mm:mm,yyyy:yyyy}];
    this.slots= [{h:'10',m:'00'},{h:'10',m:'15'},{h:'10',m:'30'},{h:'10',m:'45'},{h:'11',m:'00'},{h:'11',m:'15'},{h:'11',m:'30'}];
  }
  
  save(appointment){
    appointment.active=true;
    this.$http.post('/api/appointments',appointment).then(res=>{
        this.dates = this.allot(this.slots,this.days,this.appointments);
        this.$http.get('/api/appointments').then(response=>{
            this.appointments=response.data;
            this.dates = this.allot(this.slots,this.days,this.appointments);
        });
    });
        
  }
  
  $onInit(){
    var vm = this;
    this.$http.get('/api/appointments').then(response=>{
        this.appointments=response.data;
        this.dates = this.allot(this.slots,this.days,this.appointments);
    });
  }
  delete(d){
      this.$http.delete('/api/appointments/'+d._id);
  }
  

allot(slots, days, appointments){
 var a = [];
    _.each(days, function(d) { 
        var k=new Date(d.yyyy,d.mm,d.dd);
        
        var v = [];
        _.each(slots, function(s) { 
            var x = new Date(d.yyyy,d.mm,d.dd,s.h,s.m);
            var mx = moment(x);
            var active = true;
            _.each(appointments, function(g) { 
                var sdt = moment(new Date(g.date));
                if(moment.duration(sdt.diff(mx))._milliseconds===0){
                    active = false;
                }
            })
            v.push({date:x,active:active});
        })
        a.push({k:k,v:v});
    })
return a;
}


  showAdvanced(slot) {
      var vm = this;
    var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'))  && this.customFullscreen;
    this.$mdDialog.show({
      controller: function($scope,$mdDialog,slot){
          $scope.customer = {};
          $scope.customer.slot = slot;
        $scope.answer = function(answer){
            $mdDialog.hide(answer);
        };
      },
      templateUrl: 'app/customer.html',
      locals : {
          slot : slot
      },
      clickOutsideToClose:true,
      fullscreen: useFullScreen
    })
    .then(function(answer) {
        answer.date = answer.slot.date;
        vm.save(answer);
    });
    
  }
  
  getColor($index) {
    var _d = ($index + 1) % 11;
    var bg = '';

    switch(_d) {
      case 1:       bg = 'green';       break;
      case 2:       bg = 'darkBlue';    break;
      case 3:       bg = 'blue';        break;
      case 4:       bg = 'yellow';      break;
      case 5:       bg = 'pink';        break;
      case 6:       bg = 'darkBlue';    break;
      case 7:       bg = 'purple';      break;
      case 8:       bg = 'deepBlue';    break;
      case 9:       bg = 'lightPurple'; break;
      case 10:      bg = 'red';         break;
      default:      bg = 'yellow';      break;
    }

    return bg;
  }
 

}

angular.module('appointmentApp')
  .component('main', {
    templateUrl: 'app/main.html',
    controller: MainController
  });

})();