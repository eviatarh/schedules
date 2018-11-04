import {scheduleEvent} from "./schedule-event.reducer";
import {workers} from "./workers";
import {roles} from "./roles";
import {activeEvent} from "./active-event.reducer"
let { combineReducers } = require('redux');

export const reducer = combineReducers({
    scheduleEvent, workers, roles, activeEvent
});



