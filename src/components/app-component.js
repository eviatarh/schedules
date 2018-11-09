import React from 'react';
import '../main.css'
import {Router, Route} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import createHistory from "history/createBrowserHistory"
import {compose, lifecycle, withHandlers, withState} from "recompose";
import {CalendarViewer} from "./calendar/calendar-viewer.component";
import {createStateMap} from "../utils/create-state-map";
import {actionCreators} from "../constants/action-creators";
import {EventTriggerTypes} from "../constants/event-trigger-type";
import {makeUiEvent} from "../utils/make-ui-event";
import {Links} from "./links-component";
import {EventButtonListView} from "./event-button-view-component";
import {EditEventComponent} from "./event-component";

const _ = require('lodash');
const history = createHistory();


const mapStateToProps = ({scheduleEvent, roles, activeEvent}) => {
    const mergeWithFather = event => {
        if (event.childOf){
            return {...event, ...{childOf:scheduleEvent.find(currEvent => currEvent.id === event.childOf)}}
        }
        return event;
    };
    const eventsToUI = scheduleEvent.map(mergeWithFather);
    let active;
    if (activeEvent && activeEvent.id !== null){
        active = {...eventsToUI.find(currEvent=>currEvent.id===activeEvent.id)};
    } else {
        active = activeEvent ? activeEvent.partialEvent : null;
    }
    return {
        eventsMap: createStateMap(eventsToUI),
        roles,
        activeEvent: active
    }
};

const mapDispatchToProp = dispatch => {
    const makeEventForStore = event => {
        return event.childOf && typeof event.childOf === 'object' ? {...event, ...{childOf:event.childOf.id}} : event;
    };

    const myFunc = (updatedEvent)=>{
        dispatch(actionCreators.schedules.update(makeEventForStore(updatedEvent)))
    };
    return {
        initEvents: events => dispatch(actionCreators.schedules.init(events)),
        updateEventInStore: updatedEvent => myFunc(updatedEvent),
        updateEventsInStore: events => dispatch(actionCreators.schedules.multiUpdate(events.map(makeEventForStore))),
        removeEventInStore: eventId => dispatch(actionCreators.schedules.remove(eventId)),
        setActiveEvent: eventId => dispatch(actionCreators.activeEvent.set(eventId)),
        setPartialActiveEvent: partialEvent => dispatch(actionCreators.activeEvent.partial(partialEvent))
    }
};

const cacheHandlers = {
    addEventToCache: () => event =>{
        const unsavedEvents = localStorage.getItem('unSavedEvents');
        let newUnsavedEvents = [];
        if (unsavedEvents){
            newUnsavedEvents = JSON.parse(unsavedEvents)
        }
        const updateEventIndex = newUnsavedEvents.findIndex(currEvent=>currEvent.id===event.id);
        if (updateEventIndex === -1){
            newUnsavedEvents.push(event);
        } else {
            newUnsavedEvents[updateEventIndex] = event;
        }
        localStorage.setItem('unSavedEvents', JSON.stringify(newUnsavedEvents))
    },
    removeEventFromCache: () => eventId =>{
        const unSavedEvents = JSON.parse(localStorage.getItem('unSavedEvents'));
        if (unSavedEvents) {
            localStorage.setItem('unSavedEvents',
                JSON.stringify(unSavedEvents.filter(currEvent => currEvent.id !== eventId)));
        }
    },
    saveDateInCache: ({calendarDate}) => ()=>{
        localStorage.setItem('currentDate', calendarDate.valueOf());
    }
};

const fetchHandlers = {
    fetchEventId: () => async () => {
        const {eventId} = await fetch('http://localhost:8080/event/fetchId', {
            method:'post',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({})
        }).then((result) => result.json());
        return eventId;
    },
    postEvent: () => upsertEvent => {
        return fetch('http://localhost:8080/event', {
            method:'post',
            headers: {'content-type': 'application/json'},
            body:JSON.stringify({event:_.omit(upsertEvent,['edited','rollbackEvent','newEvent'])})
        }).then(result=>result.json());
    },
    delEvent: () => deleteEvent => {
        return fetch('http://localhost:8080/event', {
            method:'delete',
            headers: {'content-type': 'application/json'},
            body:JSON.stringify({event:_.omit(deleteEvent,['edited','rollbackEvent','newEvent'])})
        }).then(result=>result.json());
    }};

const eventsHandlers = {
    updateEvent: ({updateEventInStore, updateEventsInStore, addEventToCache, setCalendarDate}) => (updatedEvent, upgradedEvent) => {
        if (updatedEvent && updatedEvent.edited) {
            addEventToCache(updatedEvent);
        }
        if (upgradedEvent && upgradedEvent.edited){
            addEventToCache(upgradedEvent);
        }
        const eventsToUpdate = [updatedEvent, upgradedEvent].filter(event=>event);
        if (eventsToUpdate.length > 1){
            updateEventsInStore(eventsToUpdate);
        } else {
            updateEventInStore(eventsToUpdate[0]);
        }
        if (updatedEvent){
            setCalendarDate(updatedEvent.date);
        }
    },
    resetEvent:({updateEventInStore, removeEventFromCache})=> savedEvent => {
        removeEventFromCache(savedEvent.id);
        updateEventInStore(savedEvent);
    },
    removeEvent: ({removeEventInStore, removeEventFromCache}) => event => {
        if (event.edited){
            removeEventFromCache(event.id);
        }
        removeEventInStore(event.id);
    }
};

const appComponentHandlers = {
    onAddPartialEvent: ({setPartialActiveEvent})=> date=> {
        setPartialActiveEvent({date});
        history.push(`/showEvent`);
    },
    onUpdateEvent: ({activeEvent, fetchEventId, updateEvent, setActiveEvent, removeEvent}) => async ({updatedEvent, upgradedEvent})=>{
        if (!updatedEvent) {
            updateEvent(null, upgradedEvent);
        } else {
            let eventId = updatedEvent.id;
            if (updatedEvent.id === -1) {
                eventId = await fetchEventId();
                updatedEvent = {...updatedEvent, ...{id:eventId}};
            }
            if (upgradedEvent){
                upgradedEvent = {...upgradedEvent, ...{
                        id: upgradedEvent.id || `ext${eventId}`,
                        children : upgradedEvent.children || [eventId],
                    }};
                updatedEvent = {...updatedEvent, ...{childOf: updatedEvent.childOf || upgradedEvent.id}};
                updateEvent(updatedEvent, upgradedEvent);
            } else {
                if (activeEvent && activeEvent.childOf && !updatedEvent.childOf){
                    removeEvent(activeEvent.childOf);
                }
                updateEvent(updatedEvent);
            }
            setActiveEvent(eventId);
        }
    },
    onBack: ()=> () =>{
        history.push('/');
    },
    onEventTrigger: ({setActiveEvent, postEvent, delEvent, removeEvent, resetEvent, setCalendarDate}) =>
        async ({type, event})=>{
            switch (type){
                case (EventTriggerTypes.eventClicked): {
                    setActiveEvent(event.id);
                    history.push(`/showEvent`);
                    break;
                }
                case (EventTriggerTypes.eventDeleted): {
                    await delEvent(event);
                    removeEvent(event);
                    history.push(`/`);
                    break;
                }
                case (EventTriggerTypes.eventSaved): {
                    if (!event.rollbackEvent.childOf && event.childOf){

                    }
                    const savedEvent = makeUiEvent(await postEvent(event));
                    resetEvent(savedEvent);
                    setCalendarDate(savedEvent.date);
                    break;
                }
                case (EventTriggerTypes.eventCanceled): {
                    debugger;
                    if (event.newEvent) {
                        if (event.childOf){
                            removeEvent(event.childOf);
                        }
                        removeEvent(event);
                    } else {
                        const childOfChanged = !(!event.childOf === !event.rollbackEvent.childOf);
                        if (childOfChanged && !event.rollbackEvent.childOf) {
                            removeEvent(event.childOf);
                        }
                        resetEvent(event.rollbackEvent);
                        setCalendarDate(event.rollbackEvent.date);
                    }
                }
            }
        }
};

export const AppComponent = compose(withState('calendarDate', 'setCalendarDate',
    localStorage.getItem('currentDate') ? new Date(+localStorage.getItem('currentDate')) : new Date()),
    connect(mapStateToProps, mapDispatchToProp),
    lifecycle({
        async componentDidMount() {
            const events = await fetch('http://localhost:8080/events').then(res=>{{return res.json()}});
            let eventsToInit = events.map(makeUiEvent);
            const unSavedEvents = localStorage.getItem('unSavedEvents') ? JSON.parse(localStorage.getItem('unSavedEvents')) : null;
            if (unSavedEvents) {
                for (let cachedEvent of unSavedEvents){
                    const uiCacheEvent = makeUiEvent(cachedEvent);
                    let foundEventIndex = eventsToInit.findIndex(currEvent=>currEvent.id===cachedEvent.id);
                    if (foundEventIndex!==-1){
                        eventsToInit[foundEventIndex] = uiCacheEvent;
                    } else {
                        eventsToInit.push(uiCacheEvent);
                    }

                }
            }
            this.props.initEvents(eventsToInit);
        }
    }),
    withHandlers(cacheHandlers),
    withHandlers({
        setCurrentDate: ({saveDateInCache, setCalendarDate}) => date =>{
            setCalendarDate(date);
            saveDateInCache(date);
        }
    }),
    withHandlers(fetchHandlers),
    withHandlers(eventsHandlers),
    withHandlers(appComponentHandlers))(({calendarDate, eventsMap, roles, activeEvent, setCurrentDate,
      onBack, onUpdateEvent, onEventTrigger, onAddPartialEvent}) =>{
    return (
        <Router history={history}>
            <div className="flx col ctr">
                <Links/>
                -------------------------------------------------
                <div>
                    <Route path="/" exact render={routeProps=>{
                        return (<CalendarViewer {...routeProps}
                                                time={calendarDate}
                                                events={eventsMap}
                                                showEvent={EventButtonListView}
                                                onEventTrigger={onEventTrigger}
                                                onMonthChange={setCurrentDate}
                                                onAddEvent={onAddPartialEvent}
                        />)
                    }} />
                    <Route path="/showEvent" exact render={routeProps=>{
                        return (<EditEventComponent {...routeProps} event={activeEvent} roles={roles}
                                                    onUpdateEvent={onUpdateEvent}
                                                    onBack={onBack}
                                                    onEventTrigger={onEventTrigger}
                        />);
                    }} />
                </div>
            </div>
        </Router>
    )
});