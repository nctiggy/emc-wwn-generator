// models/xtremio_model.js

module.exports = {

  calculateWnnAndWwpn: function(xtremIOPsnt) {
    var wwnn=calculateWwnn(xtremIOPsnt);
    $("#xtremIOWWNN").val(wwnn);//set wwnn value to be displayed in ui
    var brickNum = xtremIOVars.xtremIONumofBricks.val();
    var displayList =  calculateXtremIOWwpns(xtremIOPsnt ,brickNum );//call function to calculate wwpns
    displayXtremIOWwpns(displayList);//call function to display wwpns
  },

  calculateXtremIOWwpns: function(xtremIOPsnt , numOfBricks) {
    var xtremIODisplayListAll = new Array();
    var model = 'XtremIO';
    var serialNum=xtremIOPsnt;
    var num_Bricks=16;
    var wwpn=serialNumber_Bin+'111';//covers sub section 1and 2
    var lsb_week=week_Bin.substr(3,3);//sub section 3 - 3 lsb of week 
    wwpn=wwpn+lsb_week+'0';// appending reseved 0- 1 bit - subsection 4 - completed till sub section 4
    var lsb_year=offset_Bin.substr(3,2);//sub section 5 - 2 lsb of year 
    var lsb_manufacturer=manufacturer_bin.substr(1,2);//sub section 6- 2 lasb of manufacturr
    wwpn=wwpn+lsb_year+lsb_manufacturer;//adding 2 lsb of manufacturer - completed till sub section 6
    if(numOfBricks != ""){
      num_Bricks=numOfBricks;
    }
    var d=0;
    for(var brick=0; brick < num_Bricks ;brick++){
      for(var sc=0; sc < 2 ; sc ++){
        for(var port=0; port < 2 ; port++){
          var wwpn_bit=wwpn+loopZero(parseInt(brick).toString(2),4)+loopZero(parseInt(sc).toString(2),2)+loopZero(parseInt(port).toString(2),2);
          var wwpn_hex=section1+section2+loopZero(parseInt(wwpn_bit,2).toString(16),9);
          var iqn='iqn.2008-05.com.xtremio:'+serialNum+'-'+wwpn_hex;
          var wwpn_colon=wwpn_hex.toUpperCase().chunk(2).join(":");
          xtremIODisplayListAll[d++] = new Array(model, serialNum, brick+1, sc+1,port+1 ,wwpn_colon, wwpn_hex, iqn);
        }
      }
    }
    return xtremIODisplayListAll;
  },

  displayXtremIOWwpns: function(displayList) {
    try {
      resultTable.fnClearTable();
      resultTable.fnAddData(displayList);
      var resultDiv = $('#xtremIO-result');
      if (!resultDiv.is(':visible')) {
        resultDiv.show();
        resultDiv.addClass('showing');
        $('#xtremIOTable').wrap('<div id="xtremIO-scroll" class="scroll-wrap"></div>');
        $('#xtremIO-scroll').before('<div class="clearfix"></div>');
      }
      exporter.setContext('#xtremIo');
      $('#export-results-button').removeClass('disabled');
    } catch (e) {
      console.error(e);
    }
  },

  //function which calculates wwnn 
  calculateWwnn: function(xtremIoPsnt) {
    var psnt = xtremIoPsnt;
    var serialNumber = psnt.slice(9);//get the serial number from psnt
    serialNumber_Bin = parseInt(serialNumber).toString(2);//Changes to binary number string
    var section3_Bin = serialNumber_Bin;
    section3_Bin = loopZero(section3_Bin, 17);
    var week = psnt.substr(7,2);//get the week of manufactured
    week_Bin = parseInt(week).toString(2);//Changes to binary number string from psnt
    week_Bin=loopZero(week_Bin, 6);
    section3_Bin=section3_Bin+week_Bin;
    var year=psnt.substr(5,2);//get year of manufactured from psnt
    var offset=year-12;//calculate offset of year 
    offset_Bin=parseInt(offset).toString(2);
    offset_Bin=loopZero(offset_Bin, 5);
    section3_Bin=section3_Bin+offset_Bin;
    var manufacturer=psnt.substr(0,3);//get the manufacturer
    if(manufacturer.toLowerCase()=='ckm'){
      manufacturer_bin='010';
    } else if(manufacturer.toLowerCase()=='xio'){
      manufacturer_bin='000';
    } else if(manufacturer.toLowerCase()=='apm'){
      manufacturer_bin='001';
    } else if(manufacturer.toLowerCase()=='fnm'){
      manufacturer_bin='011';
    } else if(manufacturer.toLowerCase()=='br5'){
      manufacturer_bin='100';
    } else {
      manufacturer_bin='111';
    }
    section3_Bin=section3_Bin+manufacturer_bin+'00000';//for sub section 5 reserved - default 00000
    var section3_hex=parseInt(section3_Bin,2).toString(16);
    if(section3_hex.length < 9){
      section3_hex=loopZero(section3_hex, 9);
    }
    var xtremIO_WWNN=section1+section2+section3_hex;//combine all the three sections and get final wwnn 
    xtremIO_WWNN=xtremIO_WWNN.toUpperCase().chunk(2).join(":");
    return xtremIO_WWNN;
  },

  validateBrickNumber: function(brickNumber) {
    if(brickNumber != brickNumber.match(/^[0-9]{1,2}$/)){
      notifier.showErrorMessage("Number of bricks field value should be an integer");
      xtremIOVars.xtremIONumofBricks.focus();
      return false;
    }
    if(brickNumber < 1 || brickNumber > 16){
      notifier.showErrorMessage("Number of bricks should not be more than between 1-16  ");
      xtremIOVars.xtremIONumofBricks.focus();
      return false;
    }
    //Error message may or may not be visible, but hide it as a matter of course.
    notifier.hideMessage();
    return true;
  },

  validateSerialNumber: function(psnt) {
    var sy = psnt.substr(0, 3);
    var num = psnt.substr(3,11);
    var year=psnt.substr(5,2);
    var week=psnt.substr(7,2);
    if (sy != sy.match(/ckm|xio|apm|fnm|br5|XIO|CKM|APM|FNM|BR5/) || num != num.match(/[0-9]{11}/)) {
      notifier.showErrorMessage("Invalid XtremIO PSNT number:  " + psnt);
      xtremIOVars.xtremIOSerialNumber.focus();
      return false;
    }
    if(year<12){
      notifier.showErrorMessage("Invalid XtremIO PSNT number: "+psnt+" - Year of manufacture offset is considered from 2012 ");
      xtremIOVars.xtremIOSerialNumber.focus();
      return false;
    }
    if(week < 00 || week > 56){
      notifier.showErrorMessage("Invalid XtremIO PSNT number: "+psnt+" - Invalid week of year ");
      xtremIOVars.xtremIOSerialNumber.focus();
      return false;
    }
    //Error message may or may not be visible, but hide it as a matter of course.
    notifier.hideMessage();
    return true;
  },

  function test(psnt) {
    if (psnt.length == 14) {
      return validateSerialNumber(psnt);
    }
  },

  function testBrickNumber(brickNumber) {
    if (brickNumber !='' &&  brickNumber.length <= 2) {
      return validateBrickNumber(brickNumber);
    }else {
      return true;
    }
  }
};
//
//  encodeXtremIO: function () {
//    var xtremIOResultTable;
//    var serialNumber_Bin;
//    var section1 = "5";//IEEE Registered Name Format (NAA Code =5h)
//    var section2 = "14F0C5";//XtremIO IEEE OUI
//    var week_Bin ;
//    var offset_Bin;
//    var manufacturer_bin;
//    
//
//
//
//    
//
//    
//    //TODO Write unit test for this.
//        
//        
//    function init() {
//        // Setup event handlers and whatever other intialization is required
//        
//        resultTable = $('#xtremIOTable').dataTable({
//            bDeferRender: true,
//            "iDisplayLength": -1,
//            "bPaginate": false
//        });       
//
//        var xtremFilterInput = $("#xtremIOTable .filter input");
//
//        xtremFilterInput.keyup(function () {
//            /* Filter on the column (the index) of this element */
//            oTable.fnFilter(this.value, xtremFilterInput.index(this));
//        });
//        var asInitVals = new Array();
//
//        xtremFilterInput.each(function (i) {
//            asInitVals[i] = this.value;
//        });
//
//        xtremFilterInput.focus(function () {
//            if (this.className == "search_init") {
//                this.className = "";
//                this.value = "";
//            }
//        });
//
//        xtremFilterInput.blur(function (i) {
//            if (this.value == "") {
//                this.className = "search_init";
//                this.value = asInitVals[xtremFilterInput.index(this)];
//            }
//        });
//
//      xtremIOVars.xtremIOEncodeButton.click(function () {
//        var psnt = xtremIOVars.xtremIOSerialNumber.val();
//        var brickNum=xtremIOVars.xtremIONumofBricks.val();
//        if(psnt == '' || psnt == null){
//          notifier.showErrorMessage("Please enter PSNT value  ");
//                xtremIOVars.xtremIOSerialNumber.focus();
//        }
//        else if(psnt.length < 14){
//            notifier.showErrorMessage("Please enter 14 character PSNT value  ");
//                xtremIOVars.xtremIOSerialNumber.focus();
//          }
//        else if(testBrickNumber(brickNum) && test(psnt)){
//          calculateWnnAndWwpn(psnt);
//        }
//        });
//
//      xtremIOVars.xtremIONumofBricks.keyup(function () {
//            testBrickNumber(xtremIOVars.xtremIONumofBricks.val());
//        });
//      
//      xtremIOVars.xtremIOSerialNumber.keyup(function () {
//            test(xtremIOVars.xtremIOSerialNumber.val());
//        });
//      
//    }
//    
//    /* Public */
//    return {
//      validateSerialNumberTest : validateSerialNumber, //For testing
//      calculateWwnnTest : calculateWwnn,//For testing
//        calculateXtremIOWwpnsTest : calculateXtremIOWwpns,
//        displayXtremIOWwpnsTest : displayXtremIOWwpns,//For testing
//        initialize: init
//    };
//}();
