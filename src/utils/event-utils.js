let _ = require('lodash');

const now = new Date();
const baseTime = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0);
const defaultEvent = {
    id:-1,
    displayName: 'אירוע חדש',
    date: now,
    timePeriod: {
        from: baseTime,
        to: baseTime
    },
    rolesNeeded: [],
    rollbackEvent: null,
    newEvent:true,
    edited:false,
    repeatParameters:null,
    childOf:null,
    repeatedEvent: false
};

export const getUpdatedEvent = (currEvent, update = {})=>{
    return currEvent.edited ? {...currEvent, ...update} :
        {...currEvent, ...{rollbackEvent: currEvent, edited: true}, ...update}
};
export const mergeEventWithDefault = currEvent => {
    return {..._.cloneDeep(defaultEvent),...currEvent||{}}
};
export const getDefaultUpgradeUpdate = upgradeEvent =>{
    const startDate = upgradeEvent.date;
    const endDate = new Date(startDate.valueOf());
    const dayInWeek = upgradeEvent.date.getDay();
    endDate.setFullYear(endDate.getFullYear()+1);
    return {
        id: null,
        repeatedEvent:true,
        repeatParameters: {
            startDate, endDate,
            type: {
                unit: 'weekly',
                spaces : 1,
                specifications: [dayInWeek]
            }
        }
    };
};
