import {ActionTypes} from "./action-types";

export const actionCreators = {
    schedules:{
        init: events => ({
            type:ActionTypes.INIT_SCHEDULE,
            events
        }),
        add: newEvent => ({
            type:ActionTypes.ADD_SCHEDULE,
            event:newEvent
        }),
        remove: eventId => ({
            type:ActionTypes.REMOVE_SCHEDULE,
            eventId
        }),
        update: updatedEvent => ({
            type:ActionTypes.UPDATE_SCHEDULE,
            event:updatedEvent
        }),
        multiUpdate: events => ({
                type:ActionTypes.MULTI_UPDATE_SCHEDULE,
                events
            }
        )
    },
    repeatedEvent:{
        init: events => ({
            type:ActionTypes.INIT_REPEAT_EVENTS,
            events
        }),
        add: newEvent => ({
            type:ActionTypes.ADD_REPEAT_EVENT,
            event:newEvent
        }),
        remove: eventId => ({
            type:ActionTypes.REMOVE_REPEAT_EVENT,
            eventId
        }),
        update: updatedEvent => ({
            type:ActionTypes.UPDATE_REPEAT_EVENT,
            event:updatedEvent
        })
    },
    workers:{
        add: newWorker => ({
            type:ActionTypes.ADD_WORKER,
            worker:newWorker
        }),
        remove: workerId => ({
            type:ActionTypes.REMOVE_WORKER,
            workerId
        }),
        update: updatedWorker => ({
            type:ActionTypes.UPDATE_WORKER,
            worker:updatedWorker
        })
    },
    activeEvent:{
        set:eventId => ({
           type:ActionTypes.SET_ACTIVE_EVENT,
           eventId
        }),
        reset:() => ({
            type:ActionTypes.RESET_ACTIVE_EVENT
        }),
        partial:partialEvent =>({
            type:ActionTypes.SET_PARTIAL_ACTIVE_EVENT,
            partialEvent
        })
    }
};