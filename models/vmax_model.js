// vmax_model.js

module.exports = {

  symmetrix: function() {
    var symmnumb = {
      "814" : "35/5500",
      "815" : "32/5200",
      "816" : "31/5100",
      "817" : "5500",
      "824" : "37/5700",
      "825" : "34/5400",
      "826" : "33/5300",
      "834" : "39/5900",
      "835" : "38/5800",
      "836" : "36/5600",
      "837" : "39/5900",
      "838" : "38/5800",
      "839" : "37/5700",
      "847" : "8700",
      "845" : "8400",
      "846" : "8100",
      "857" : "8830",
      "855" : "8530",
      "854" : "8230",
      "877" : "DMX-1/2 2000",
      "878" : "DMX-1/2 3000",
      "874" : "DMX-1/2 1000",
      "879" : "DMX-1/2 800",
      "901" : "DMX-3/4",
      "903" : "DMX-3/4",
      "925" : "VMAX20k",
      "926" : "VMAX20K",
      "949" : "VMAX SE",
      "956" : "VMAX30K",
      "959" : "VMAX10K",
      "957" : "VMAX40K",
      "987": "VMAX10K",
      "967": "VMAX200K",
      "968": "VMAX100K",
      "972": "VMAX400K",
      "970": "VMAX450F",
      "975": "VMAX850F",
      "978": "VMAX250F"
    };
    return symmnumb;
  },

  loopZero: function(obj, limit) {
    var c = '0';
    while (obj.length < limit){
        obj = c + obj;
    }

    return obj;
  },

  validateSerialNumber: function(serialNumber) {
    var sy = serialNumber.substr(1, 3);
    if (sy != sy.match(/815|825|835|838|816|826|836|814|817|824|834|837|839|845|855|874|877|878|901|903|925|926|949|959|879|847|857|846|854|957|987|968|967|972|970|975|978/)) {
      console.log("Invalid Symmetrix Serial number:  " + serialNumber);
      symmVars.serialNumberText.focus();
      return false;
    }
    //Error message may or may not be visible, but hide it as a matter of course.
    return true;
  },

  portOut: function(fanumber) {
    var faletter = new Array("A0", "A1", "B0", "B1", "C0", "C1", "D0", "D1");
    var ports = [];
    var d = 0;
    for (var j = 0; j < fanumber.length; j++) {
      for (var i = 0; i < faletter.length; i++) {
        ports[d++] = fanumber[j] + faletter[i];
      }
    }
    return ports;
  },

  portOutTigon: function(fanumber, sy) {
    var tigonfaletter = new Array("E0", "E1", "F0", "F1", "G0", "G1", "H0", "H1");
    var d = 0;
    var ports = [];
    if(sy == sy.match(/968|972|967|970|975|978/g)){
      //VMAX3 Dir/Port naming convention - Emulation-Director:port
      //ex.  FA-1F:10 where 1 is the fanumber, F is the letter, and 10 is a port.
      //All we can determine is the director number (fanumber in the variable) and the port.
      //The letter is an emulation instance and cannot be determined from the WWN.
      //Best we can do is director number and port (director:port)
      var vmax3ports = new Array(
        "4", "5", "6", "7", "8", "9", "10", "11",
        "24", "25", "26", "27", "28", "29", "30", "31");//vmax3 ports

      for (var j = 0; j < fanumber.length; j++){
        for (var k = 0; k < vmax3ports.length; k++){
          ports[d] = fanumber[j] + ":" + vmax3ports[k];
          d++;
        }
      }
    } else {
      //VMAX models
      for (var j = 0; j < fanumber.length; j++) {
        for (var i = 0; i < tigonfaletter.length; i++) {
          ports[d++] = fanumber[j] + tigonfaletter[i];
        }
      }
    }
    return ports;
  },


    //TODO Write unit test for this
  createPortsList: function(serialNumber) {
    //These are the Director and Port pairings
    var isTigon = false;
    var fanumber = new Array();
    var sy = serialNumber.substr(1, 3);
        //There's 968, 972, 967 for vmax3
        if (sy == sy.match(/925|926|949|959|957|987/g)) {
            fanumber = new Array("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16");
            isTigon = true;
        } else if (sy == sy.match(/972|970|975/g)) {
            //VMAX3400K - up to 8 engines -> 16 directors
            isTigon = true; //VMAX3 is also tigon
            //The fanumber represents the director numbers in vmax3.
            fanumber = new Array("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16");
        } else if (sy == sy.match(/967/g)) {
            //VMAX3200K - up to 4 engines -> 8 directors
            isTigon = true; //VMAX3 is also tigon
            //The fanumber represents the director numbers in vmax3.
            fanumber = new Array("01", "02", "03", "04", "05", "06", "07", "08");
        } else if (sy == sy.match(/968|972|967|970|975|978/g)) {
            //VMAX3100K - up to 2 engines -> 4 directors
            isTigon = true; //VMAX3 is also tigon
            //The fanumber represents the director numbers in vmax3.
            fanumber = new Array("01", "02", "03", "04");
        } else if (sy == sy.match(/815|825|835|838/g)) {
            fanumber = new Array("01", "04", "05", "12", "13", "16");
        } else if (sy == sy.match(/816|826|836/g)) {
            fanumber = new Array("03", "14", "15", "16");
        } else if (sy == sy.match(/814|817|824|834|837|839/g)) {
            fanumber = new Array("03", "04", "05", "06", "11", "12", "13", "14");
        } else if (sy == sy.match(/845|855/g)) {
            fanumber = new Array("01", "04", "05", "12", "13", "14");
        } else if (sy == sy.match(/874/g)) {
            fanumber = new Array("01", "02", "03", "04", "13", "14", "15", "16");
        } else if (sy == sy.match(/877|878|901|903/g)) {
            fanumber = new Array("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16");
        } else if (sy == sy.match(/879/g)) {
            fanumber = new Array("01", "02", "15", "16");
        } else if (sy == sy.match(/847|857/g)) {
            fanumber = new Array("03", "04", "05", "06", "11", "12", "13", "14");
        } else if (sy == sy.match(/846/g)) {
            fanumber = new Array("03", "14", "15", "16");
        } else if (sy == sy.match(/854/g)) {
            fanumber = new Array("15", "16");
        }

        if(isTigon){
          var ports = this.portOutTigon(fanumber, sy);//TODO Need to adjust here for vmax3, not sure exactly how yet.
        }else{
          var ports = this.portOut(fanumber);
        }

        return ports;
    },

    //TODO Write unit test for this.
  getDisplayWWNs: function(serialnum, selectedPortList) {
      var symmnumb = this.symmetrix();//This comes from array-arrays.js
      var wwns = new Array();
      var prefix = "5006048";
      var prefixTigon = "5000097";
      var tigonFaletterCode = {
          "E" : "4",
          "F" : "5",
          "G" : "6",
          "H" : "7"
      };

      var sy = serialnum.substr(1, 3);

      var isVmax3 = false;

      if (selectedPortList.length == 0) {
          notifier.showErrorMessage("No ports available!");
      } else {
        if (sy == sy.match(/925|926|949|959|957|987/g)) {
          for (var i = 0; i < selectedPortList.length; i++) {
            var selectedPortListN = +selectedPortList[i].substr(0, 2);//This is the number preceding the board letter, i.e. from the fanumber array above
            var selectedPortListL = selectedPortList[i].substr(2, 1);//This is the letter
            //Subtract 1 because of the number of bits used to represent it.  Numbers go up to 16, but we only have 4 bits to use which would be a max of 15.
            //So 0 to 15 instead of 1 to 16.
            selectedPortListN = (Number(selectedPortListN) - (Number(1)));
            var selectedPortListP = selectedPortList[i].substr(3, 1);//Port - 0 or 1.
            var tigonFaLetterNum = tigonFaletterCode[selectedPortListL];//This is how we get the number that will be represented in the wwn.
            var letterValue = parseInt(tigonFaLetterNum).toString(16);//Changes to hex number string
            selectedPortListN = parseInt(selectedPortListN);
            selectedPortListN = selectedPortListN.toString(16);

            var directorCode = (letterValue + selectedPortListN);

            var buildLocation = serialnum.substr(0, 1);
            var model = serialnum.substr(1, 3);
            model = model - Number(925);
            var sequence = serialnum.substr(4, 5);

            var bin_Vendor = parseInt(prefixTigon, 16);
            //hex2bin
            bin_Vendor = bin_Vendor.toString(2);
            //hex2bin
            bin_Vendor = this.loopZero(bin_Vendor, 28);

            var bin_Loc = parseInt(buildLocation, 16);
            bin_Loc = bin_Loc.toString(2);
            bin_Loc = this.loopZero(bin_Loc, 3);
            //3

            var bin_model = parseInt(model, 10);
            bin_model = bin_model.toString(2);
            bin_model = this.loopZero(bin_model, 6);
            //6

            var bin_Serial = parseInt(sequence, 10);
            bin_Serial = bin_Serial.toString(2);
            bin_Serial = this.loopZero(bin_Serial, 17);

            var directorBin = parseInt(directorCode, 16);
            var bin_Director = directorBin.toString(2);
            bin_Director = this.loopZero(bin_Director, 8);

            var bin_Port = selectedPortListP.toString(2);
            bin_Port = this.loopZero(bin_Port, 2);

            var binWWN_l = (bin_Vendor);

            var end;
            var begin;
            var binWWN_2 = (bin_Loc + bin_model + bin_Serial + bin_Director + bin_Port);
            binWWN_2 = parseInt(binWWN_2, 2);
            end = (binWWN_2.toString(16));

            binWWN_l = parseInt(binWWN_l, 2);
            begin = (binWWN_l.toString(16));

            wwns.push(begin + end);
          }
        } else if (sy == sy.match(/967|968|972|970|975|978/g)) {
            isVmax3 = true;
            //VMAX3 encoding notes:
            //Pieces of the WWPN binary
            //500097 - covers the 4 bits of NAA name (63-60) and 59 - 36 for 000097 (Tigon and VMAX3)
            //This is the same for every wwpn, no need to recalc.
            //IEEE organization unique identifier + the IEE name format which is always 0x5 for 64-bit registered name format
            var ouiBinary = parseInt(prefixTigon, 16); //5000097 for tigon
                ouiBinary = ouiBinary.toString(2);//Convert to binary
                ouiBinary = this.loopZero(ouiBinary, 28);//Pad zeros to insure a length of 28 bits

            //Location of manufacture 3 bits (35-33) 0x1 Franklin, 0x2 Cork, 0x3 Apex - where do we get this from serial number?
            //According to above code, build location is the first number in the serial number (always 1 it seems?)
            //Location is the same across the whole set
                var location = serialnum.substr(0, 1);//Just the first number in the serial number.
                var locationBinary = parseInt(location, 16);
                locationBinary = locationBinary.toString(2)
                locationBinary = this.loopZero(locationBinary, 3);//3 bit binary

            //Model 6 bits 32-27 Model type 0-63 encoded as follows - 0x0 Mod. 925 Tigon base config; 0x1 Model 92X Tigon next config (what?)
            //Model is calculated by 968 - 925 (base number) = 43, where 43 ends up being encoded in the wwpn.  Same as above tigon calculations
            //Model number is also the same across the whole set
            //Important info
                //968 is 100K, 64 ports (I think this is per engine where each engine has 32 ports, 1 - 2 engines for 100K)
                //967 is 200K, 128 ports (1 - 4 engines) WWPNs are same within each engine?
                //972 is 400K, 256 ports (1 - 8 engines)
                var model = serialnum.substr(1, 3);
                model = parseInt(model);
                model = model - 925;//Need the model number later for engine and port calculations.
                var modelBinary = model.toString(2);
                modelBinary = this.loopZero(modelBinary, 6);

            //Sequence 17 bits (26-10) Sequential number of units built relative to location (0 - 131071) (what?)  How do we get this from serial number?
                //Is it the last piece after the 1967xxxxx?
                //It is - see above calc.  Takes the serialNum substring starting at idx 4 for a length of 5 chars then mutates to the binary and ultimately hex value.
                //So is the sequence.
                var sequence = serialnum.substr(4, 5);
                //Got to convert the sequence int into a hex value or do I?
                var sequenceBinary = parseInt(sequence);
                sequenceBinary = sequenceBinary.toString(2);
                sequenceBinary = this.loopZero(sequenceBinary, 17);

                //TODO here is where we are running into issues.
            //Dir Board 4 bits (9 - 6) in WWN position from right to left.
            //First two bits will be the fanumber (defined earlier), the second two bits will be the board letter, skipping A, B and C.
            //This should simply be a mapping of an array index position to the board letter.  In decode, we'll have a number that will simply correspond
                //to the index of the letter in a simple array of letters A thru H (i.e. 0 to 7)
                //Port number 6 bits (5 - 0) Port num 0 - 31, but should be 4-19, 24-31 only so we only encode wwpns for those ports.
            var vmax3BoardLetterCodeArray = {
                    "D": "3",
                    "E": "4",
                    "F": "5",
                    "G": "6",
                    "H": "7"
                };

            //The next question is how this is encoded into the wwpn.  There are 4 bits for the Fa Num and letter in the WWN for vmax3
                //Maybe that's where the +1 comes from when VMAX is decoded?  For instance, here we'd have 2 bits for the fa number and 2 for the board (d-h)
                //If only two bits, 7 is the max we'd get, and 0 the min., but we are numbered 1 through 8.
                //What about the board letter, how does that match up?  Maybe as an index into an array?  d, e, f, g, h (0 - 4 in an array index)
            var wwnBeginning = ouiBinary;//54 bits, this piece is constant across all boards and ports.
                //Convery to hex representation
                wwnBeginning = parseInt(wwnBeginning, 2);
                wwnBeginning = wwnBeginning.toString(16);

                var wwnMiddleInBin = locationBinary + modelBinary + sequenceBinary;

                for (var i = 0; i < selectedPortList.length; i++){
                    //Break up the board and port variable into the fa number, board letter, and port (xyL:ij; xy is the fanumber, L is the director letter, ij is the port)
                    var directorNumber = selectedPortList[i].split(":")[0];// 1 - 16
                    var portNum = selectedPortList[i].split(":")[1];

                    //Turn director number into binary representation.
                    directorNumber = parseInt(directorNumber) - 1;
                    directorNumber = directorNumber.toString(2);//now 0 - 15 so we can fit it into 4 bits.
                    directorNumber = this.loopZero(directorNumber, 4);

                    portNum = parseInt(portNum);
                    portNum = portNum.toString(2);
                    portNum = this.loopZero(portNum, 6);

                    //Now combine all the pieces to make the WWPN
                    var wwnEnd = wwnMiddleInBin + directorNumber + portNum;
                    wwnEnd = parseInt(wwnEnd, 2);
                    wwnEnd = wwnEnd.toString(16);

                    wwns.push(wwnBeginning + wwnEnd);
                }
        } else {
          serialnum = parseInt(serialnum);
          var symmOctal = serialnum.toString(8);
          // octal number
          serialNumBinary = serialnum.toString(2);
          //binary number
          portpartb = serialNumBinary.slice(serialNumBinary.length - 2, serialNumBinary.length);

          for (var i = 0; i < selectedPortList.length; i++) {
            selectedPortListN = +selectedPortList[i].substr(0, 2);
            selectedPortListL = selectedPortList[i].substr(2, 2);
            if (selectedPortListL == selectedPortListL.match(/A0|C0/g)) {
              selectedPortListN = (selectedPortListN - 1);
            } else if (selectedPortListL == selectedPortListL.match(/B0|D0/g)) {
              selectedPortListN = (selectedPortListN + 15);
            } else if (selectedPortListL == selectedPortListL.match(/A1|C1/g)) {
              selectedPortListN = (selectedPortListN + 31);
            } else if (selectedPortListL == selectedPortListL.match(/B1|D1/g)) {
              selectedPortListN = (selectedPortListN + 47);
            }

            var selectedPortListNOct = selectedPortListN.toString(8);

            var midNumber = (symmOctal + selectedPortListNOct + "0");//For when selectedPortListN >= 8
            if (selectedPortListN < 8) {
              midNumber = (symmOctal + "0" + selectedPortListNOct);
            }

            var beginningNum = midNumber.substr(0, 4);
          var midNum = midNumber.substr(4, 4);
          var endNum = midNumber.substr(8, 4);

            if (selectedPortListL == selectedPortListL.match(/C0|D0|C1|D1/g)) {
              beginningNum = midNumber.substr(0, 4);
              beginningNum = (Number(beginningNum) + Number(4000));
              midNum = midNumber.substr(4, 4);
              endNum = midNumber.substr(8, 4);
            }

            var five = parseInt(endNum, 8);
            var six = five.toString(16);
            var seven = parseInt(midNum, 8);
            var eight = seven.toString(16);
            var nine = parseInt(beginningNum, 8);
            var ten = nine.toString(16);

            //Pad the six and eight with 0's until string length is 3
            var len = six.length;
            while (len < 3){
              six = '0' + six;
              len = six.length;
            }

            len = eight.length;
            while(len < 3){
              eight = '0' + eight;
              len = eight.length;
            }

            var eleven = (ten + eight + six);
            wwns.push(prefix + eleven);
          }
        }

        var model = ("Symmetrix " + symmnumb[sy]);
        var newDisplayListAll = new Array();

        for (var i = 0; i < wwns.length; i++) {
            var director = selectedPortList[i].substr(0, 3);
                var port = selectedPortList[i].substr(3, 1);

                if (isVmax3) {
                    director = selectedPortList[i].split(":")[0];
                port = selectedPortList[i].split(":")[1];
            }

          var wwpn = wwns[i].toString().toUpperCase();
          wwpnColon = wwpn.chunk(2).join(":");
          var iqn = "iqn.1992-04.com.emc." + wwpn;
          //newDisplayListAll[i] = new Array(model, serialnum, director, port, wwpnColon, wwpn, iqn);
          newDisplayListAll[i] = {"model": model, "serialnum": serialnum, "director": director, "port": port, "wwpnColon": wwpnColon, "wwpn": wwpn, "iqn": iqn};
        }

        var payload = {"wwns": newDisplayListAll};

        return payload;
      }
    }
};
