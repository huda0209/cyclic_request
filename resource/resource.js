/*
created by huda0209
Cyclic Request

resource.js
 
ran by node.js
2021-7-27
*/

/*
DON'T TOUCH!!
*/

module.exports =  {
    "message.json" : {
        pass : "./config/message.json",
        canEmpty : true,
        keys : {
            message : {
                replace : true,
                default : "@here IPアドレスの更新を検出しました。\n更新前{ipData.ip} => 更新後{resultData.ip}"
            }
        }
    },

    "system.json" : {
        pass : "./config/system.json",
        canEmpty : false,
        keys : {
            address : {
                replace : false,
                default : ""
            },
            sessionid : {
                replace : false,
                default : ""
            },
            webhookURL : {
                replace : false,
                dafault : ""
            }
        }
    },

    "ip.json" : {
        pass : "./config/ip.json",
        canEmpty : true,
        keys : {
            ip : {
                replace : false,
                default : ""
            }
        }
    }
}