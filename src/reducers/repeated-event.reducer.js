import {ActionTypes} from "../constants/action-types";

const initialState = [{
    id:1,
    displayName:'משמרת בוקר חוזרת',
    date:  new Date(2018,10,25,9,10),
    timePeriod: {
        from: new Date(2018,10,25,9,0),
        to: new Date(2018,10,25,17,0)
    },
    rolesNeeded: [
            {roleId: 0, quantityRequired: 1},
            {roleId: 1, quantityRequired: 1}
    ],
    edited: false,
    rollbackEvent:null,
    repeatParameters: {
        startDate: new Date(2018,10,25,9,10),
        endDate: new Date(2019,10,25,9,10),
        type: {
            unit: 'week',
            spaces : 1,
            specifications: [0,1,2,3,4]
        },
        children:[]
    }
}];

// export function repeatedEvent(state = initialState, action) {
//     switch (action.type){
//         case ActionTypes.INIT_REPEAT_EVENTS:
//             return [...action.events];
//         case ActionTypes.ADD_REPEAT_EVENT:
//             return [...state, action.event];
//         case ActionTypes.REMOVE_REPEAT_EVENT:
//             const {eventId} = action;
//             return state.filter(currEvent => currEvent.id !== eventId);
//         case ActionTypes.UPDATE_REPEAT_EVENT:
//             const updatedEventIndex = state.findIndex(event => event.id === action.event.id);
//             if (updatedEventIndex === -1){
//                 return [...state, action.event];
//             }
//             return state.map((currEvent, index) =>{
//                 if (index === updatedEventIndex){
//                         return {...currEvent, ...action.event};
//                 }
//                 return currEvent;
//             });
//         default:
//             return state;
//     }
// }