import {formatter} from "./formatter";

export const makeUiEvent = event => {
    return formatter(event, {
        date:['date', val=>new Date(val)],
        timePeriod:['timePeriod', val=>{ return {from: new Date(val.from), to: new Date(val.to)}}],
        edited:['edited', val=>val||false],
        rollbackEvent:['rollbackEvent', val=>val?makeUiEvent(val):null],
        newEvent:['newEvent',val=>val||false]
    });
};