# emc-wwn-generator

####Setup:
```shell
npm install
```

####Run:
```shell
node app.js

--or--

cf push #If you are using CF
```

####Use:

http://localhost:3000/symmetrix/{serialnumber without leading letters}

http://localhost:3000/xtremio/{serialnumber without leading letters}/{number of xbricks}

####Example VMAX Output:
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

####Example XtremIO Output:
```json
{
    "wwnn": "51:4F:0C:50:8E:4E:61:20",
    "wwns": [{
        "model": "XtremIO",
        "serialNum": "xxxxxxx",
        "brick": 1,
        "controller": 1,
        "port": 1,
        "wwpn_colon": "51:4F:0C:50:8E:4F:65:00",
        "wwpn": "514F0C508e4f6500",
        "iqn": "iqn.2008-05.com.xtremio:xxxxxxxxxxx-514F0C508e4f6500"
    }, {
        "model": "XtremIO",
        "serialNum": "xxxxxxx",
        "brick": 1,
        "controller": 1,
        "port": 2,
        "wwpn_colon": "51:4F:0C:50:8E:4F:65:01",
        "wwpn": "514F0C508e4f6501",
        "iqn": "iqn.2008-05.com.xtremio:xxxxxxxxxxxx-514F0C508e4f6501"
    }]
}
```

Not a ton of error checking sorry.

####TODO:
* XtremIO
* VPLEX
* VNX
* Data Domain
