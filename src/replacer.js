/*
created by huda0209
Cyclic Request

replacer.js
 
ran by node.js
2021-7-27
*/

module.exports = function(content,beforeIP,afterIP){
        
        content = content.replace(/{beforeIP}/g, beforeIP);
        content = content.replace(/{afterIP}/g, afterIP);

        return content;
}