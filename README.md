# emc-wwn-generator

####Setup:
```shell
npm install
```

####Run:
```shell
node app.js
```

####Use:

http://localhost:3000/symmetrix/{serialnumber without leading letters}

####Example Output:
```json
{
    "wwns": [{
                "model": "Symmetrix VMAX40K",
                "serialnum": "xxxxxx",
                "director": "01E",
                "port": "0",
                "wwpnColon": "50:00:09:73:00:09:C9:00",
                "wwpn": "500009730009C900",
                "iqn": "iqn.1992-04.com.emc.500009730009C900"
            }, {
                "model": "Symmetrix VMAX40K",
                "serialnum": "xxxxxxxxx",
                "director": "01E",
                "port": "1",
                "wwpnColon": "50:00:09:73:00:09:C9:01",
                "wwpn": "500009730009C901",
                "iqn": "iqn.1992-04.com.emc.500009730009C901"
            }]
}
```

Not a ton of error checking sorry.

####TODO:
* XtremIO
* VPLEX
* VNX
* Data Domain
