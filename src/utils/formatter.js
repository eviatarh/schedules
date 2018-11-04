let _ = require('lodash');

function updateResultForKey(key, value, formatMap, result){
    const changedKey=formatMap[key];
    let newKey = changedKey;
    let converterFunc = _.identity;
    if (Array.isArray(changedKey) && changedKey.length ===2){
        newKey = changedKey[0];
        converterFunc = changedKey[1];
    }
    const newValue = converterFunc(value);
    _.set(result, newKey, newValue);
}

export function formatter(json, formatMap = {}){
    if (!json || Array.isArray(json) || typeof json !== 'object'){
        return null;
    } else {
        let result = {};
        const keys = Object.keys(json);
        for (let key of keys){
            const changedKey=formatMap[key];
            if (changedKey) {
                updateResultForKey(key, json[key], formatMap, result);
            } else {
                result[key] = json[key];
            }
        }

        const additionalKeys = Object.keys(formatMap).filter(formatKey => keys.indexOf(formatKey) === -1);
        for (let key of additionalKeys){
            updateResultForKey(key, null, formatMap, result);
        }
        return result;
    }
}