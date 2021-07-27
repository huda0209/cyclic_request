/*
created by huda0209
Cyclic Request

main.js
 
ran by node.js
2021-7-27
*/

const cron = require('node-cron');
const request = require("request");
const fs = require("fs");
const dateUtils = require("date-utils");

const log = require("./src/util/logFile");
log.info(`This service is standing now...`);

const config = require("./src/config");
const replacer = require("./src/replacer");
const package = require("./package.json");

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

process.on("exit", ()=>{
    log.info(`service end.`);
    log.hasLastLog();
    console.log("Exitting...");
})
process.on("SIGINT", ()=>{
    process.exit(0);
});


if(!config.exist(true)) process.exit();
const messageData = config.loadConfig("message.json");
const systemData = config.loadConfig("system.json");


cron.schedule('0 */3 * * * *', ()=>{
    
    const ipData = config.loadConfig("ip.json");
    const options = {
        url : systemData.address,
        method : "GET",
        headers: {
            'sessionid': systemData.sessionid
        }
    };
    
    request(options, (error, response, body)=>{
        let resultData;
        if(error){
            log.error(`Failed to run http(s) request.`);
            log.error(`${error}`);
            return
        };
        
        log.info(`succeed to http(s) requset. \nresponce code : ${response.statusCode} \nbody: ${body}`);

        try{
            resultData = JSON.parse(body);
        }catch(error){
            log.error(`Failed to parse text to json.`);
            log.error(`${error}`);
            return
        };

        if(resultData.ip != ipData.ip){
            const webhookOption = {
                url : systemData.webhookURL,
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    username: "Cyclic Request",
                    content: replacer(messageData.message, ipData.ip, resultData.ip),
                })
            };
            
            request(webhookOption, (error, response, body)=>{
                if(error){
                    log.error(`Failed to sebd webhook. (https request).`);
                    log.error(`${error}`);
                }else log.info(`succeed to http(s) requset. \nresponce code : ${response.statusCode} \nbody: ${body}`);
            });
            
            log.info(`{cyan}IP Address updated{reset}. BEFORE : {red}${ipData.ip}{reset} => AFTER : {green}${resultData.ip}`);
            ipData.ip=resultData.ip;
            fs.writeFileSync("./config/ip.json", JSON.stringify(ipData, null, '\t'), "utf8");
        }else{
            log.info(`IP Address is NOT update. now: {green}${ipData.ip}`);
        }
    });
});

log.info(`Cyclic Request is ready.\n        ver. {green}${package.version}{reset}\n        start up : {green}${(new Date()).toFormat('DDD MMM DD YYYY HH24:MI:SS')}{reset}\n        repository : {green}${package.repository}{reset}\n        created by {green}${package.author}{reset}\n`);