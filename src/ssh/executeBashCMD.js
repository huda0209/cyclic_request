/*
created by huda0209
Cyclic Request

executeBashCMD.js
 
ran by node.js
2021-8-27
*/
`use strict`

const {NodeSSH} = require('node-ssh');
const fs = require("fs");
const log = require("../util/logFile");


async function run(cmd, connData){

    const conn = new NodeSSH();
    if(!connData.hostIP) log.error(`{red}hostIP{reset} is not difined. Please set {green}hostIP.`);
    if(!connData.port) log.error(`{red}port{reset} is not difined. Please set {green}port.`);
    if(!connData.username) log.error(`{red}username{reset} is not difined. Please set {green}username.`);
    if(!connData.hostIP||!connData.username||!connData.port) return [403,"connection data is not defined."];

    const ConnectionData = {
        host: connData.hostIP,
        port: connData.port,
        username: connData.username,
    }
    if(!cmd){
      log.error(`BashCommand is not defined. Please set BashCommand.`);
      return [400,"bash command is not defined."];
    }
    if(!connData.password && !connData.privateKeyPass){
      log.error(`Both {red}password{reset} {red}privateKeyPass{reset} are not difined. Please set {green}password{reset} or {green}privateKeyPass{reset}.`);
      return [403,"connection data is not defined."];
    }

    if(connData.password && !connData.privateKeyPass){
        ConnectionData["password"] = conn.password;
        log.info(`ssh connection use password.`);
    }else if(connData.privateKeyPass){
        if(!fs.existsSync(connData.privateKeyPass)){
            log.error(`You set to {green}use PrivateKey{reset}, but I couldn't it in ${connData.privateKeyPass}.`);
            return [403,"connection data is not defined."];
        }
        ConnectionData.privateKey = connData.privateKeyPass
        log.info(`ssh connection use private key.`);
    }
    let state=0;
    let result;

    result = await conn.connect(ConnectionData)
        .then(()=>{
            log.info(`Succeed to connect ssh session.\nHOST : ${ConnectionData.host}\nUSER : ${ConnectionData.username}`);
        })
        .catch(error=>{
            log.error(`Failed to cinnect ssh session.\nHOST : ${ConnectionData.host}\nPORT : ${ConnectionData.port}\nUSER : ${ConnectionData.username}\nreason : ${error}`);
            state = 1
            return [504,error];
        });

    if(state) return result;

    result = await conn.execCommand(cmd, {options: {pty: true}})
        .then(result=>{
            log.info(`Succeed to execute bash command.\nresult : ${JSON.stringify(result, null, 2)}`);
            
            conn.dispose();
            log.info(`ssh session disconnected.`);

            return [200,result]
        })
        .catch(error=>{
            log.error(`Failed to execute bash command in ssh session.\nreason : ${error}`);
            return [500,error]
        });
    return result;
}

exports.run = run;