import {withHandlers} from "recompose";
import {EventTriggerTypes} from "../../constants/event-trigger-type";

export const withEventActions = withHandlers({
    onEventClick: ({event, onEventTrigger = ()=>{}}) => () => {
        onEventTrigger({type:EventTriggerTypes.eventClicked, event})
    },
    onEventCancel: ({event, onEventTrigger = ()=>{}}) => () => {
        onEventTrigger({type:EventTriggerTypes.eventCanceled, event})
    },
    onEventDelete: ({event, onEventTrigger = ()=>{}}) => () => {
        onEventTrigger({type:EventTriggerTypes.eventDeleted, event})
    },
    onEventSave: ({event, onEventTrigger = ()=>{}}) => () => {
        debugger;
        onEventTrigger({type:EventTriggerTypes.eventSaved, event})
    }
});