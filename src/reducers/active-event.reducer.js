import {ActionTypes} from "../constants/action-types";

export function activeEvent(state = null, action){
    switch (action.type){
        case (ActionTypes.SET_ACTIVE_EVENT):
            return {id: action.eventId, partialEvent: null};
        case (ActionTypes.RESET_ACTIVE_EVENT):
            return null;
        case (ActionTypes.SET_PARTIAL_ACTIVE_EVENT):
            return {id: null, partialEvent: action.partialEvent};
        default:
            return state;
    }
}