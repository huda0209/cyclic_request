/*
created by huda0209
Cyclic Request

config.js
 
ran by node.js
2021-7-27
*/
const fs = require("fs");
const log = require("./util/logFile");
let resource = require("../resource/resource");

function loadConfig(configName){
    if(!resource[configName]){
        log.error(`can't find that file({red}${configName}{reset}).`);
        return;
    }
    let result = true;

    const data = JSON.parse(fs.readFileSync(resource[configName].pass,"utf-8"));

    if(!resource[configName].canEmpty){
        const NoKeyList = [];
        for(const key in resource[configName].keys){
            if(Object.hasOwnProperty.call(data, key)) continue;
            log.error(`Don't have a property "{red}${key}{reset}" in {green}${configName}{reset}.`);
            result = false;
        }
    }
    if(!result) process.exit();

    for(const key in resource[configName].keys) {
        if(Object.hasOwnProperty.call(data, key) && data[key]) continue;
        if(!resource[configName].keys[key].replace) continue;
        data[key] = resource[configName].keys[key].default;
    }
    log.info(`succeed to load "${configName}".`);
    return data;
}

function exist(createMode){
    try{
        resource = require("../resource/resource");
    }catch(e){
        log.error(e);
        return false;
    }
    let result = false;

    for(const key in resource){
        if(fs.existsSync(resource[key].pass)){
            result = true;
            continue;
        }
        log.warn(`there is not "{red}${key}{reset}".`);

        if(!createMode) continue;
        try {
            fs.copyFileSync(`./resource/${key}`, resource[key].pass, fs.constants.COPYFILE_EXCL);
            log.info(`Succeed to create "{red}${key}{reset}".`);
            result = true;
        }catch(e) {
            log.error(e);
        }
    }

    return result;
}

exports.exist = exist;
exports.loadConfig = loadConfig;