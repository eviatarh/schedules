import {ActionTypes} from "../constants/action-types";

const initialState = [{
    id:1,
    displayName:'משמרת בוקר',
    date:  new Date(2018,10,25,9,10),
    timePeriod: {
        from: new Date(2018,10,25,9,0),
        to: new Date(2018,10,25,17,0)
    },
    rolesNeeded: [
            {roleId: 0, quantityRequired: 1},
        {roleId: 1, quantityRequired: 1}
    ],
    manning: null,
    edited:false,
    rollbackEvent:null
},
    {
        id:2,
        displayName:'משמרת ערב',
        date:  new Date(2018,10,25,9,10),
        timePeriod: {
            from: new Date(2018,10,25,17,0),
            to: new Date(2018,10,25,24,0)
        },
        rolesNeeded: [
            {roleId: 0, quantityRequired: 1},
            {roleId: 1, quantityRequired: 1}
        ],
        manning: null,
        edited:false,
        rollbackEvent:null
    },
    {
        id:3,
        displayName:'משמרת בוקר מיוחדת',
        date:  new Date(2018,9,25,9,10),
        timePeriod: {
            from: new Date(2018,9,25,8,0),
            to: new Date(2018,9,25,18,0)
        },
        rolesNeeded: [       {roleId: 0, quantityRequired: 1},
            {roleId: 1, quantityRequired: 2}],
        manning: null,
        edited:false,
        rollbackEvent: null
    }];

export function scheduleEvent(state = initialState, action) {
    switch (action.type){
        case ActionTypes.INIT_SCHEDULE:
            return [...action.events];
        case ActionTypes.ADD_SCHEDULE:
            return [...state, action.event];
        case ActionTypes.REMOVE_SCHEDULE:
            const {eventId} = action;
            return state.filter(currEvent => currEvent.id !== eventId);
        case ActionTypes.UPDATE_SCHEDULE:
            const updatedEventIndex = state.findIndex(event => event.id === action.event.id);
            if (updatedEventIndex === -1){
                return [...state, action.event];
            }
            return state.map((currEvent, index) =>{
                if (index === updatedEventIndex){
                        return {...currEvent, ...action.event};
                }
                return currEvent;
            });
        default:
            return state;
    }
}