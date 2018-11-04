import React from 'react';
import ReactDOM from 'react-dom';
import './main.css'
import {reducer} from "./reducers/reducer";
import {CalendarViewer} from "./components/calendar/calendar-viewer.component";
import {Router, Route} from "react-router-dom";
import {createStore} from "redux";
import Provider from "react-redux/es/components/Provider";
import connect from "react-redux/es/connect/connect";
import createHistory from "history/createBrowserHistory"
import {EditEventComponent} from "./components/event-component";
import {EventButtonView} from "./components/event-button-view-component";
import {createStateMap} from "./utils/createStateMap";
import {compose, lifecycle, withHandlers, withState} from "recompose";
import {actionCreators} from "./constants/action-creators";
import {formatter} from "./utils/formatter";
let _ = require('lodash');

const history = createHistory();

const mapStateToProps = ({scheduleEvent, roles, activeEvent}) => {
    return {
        schedules: scheduleEvent,
        roles,
        //TODO: continue this
        activeEventFromStore: activeEvent === null ? null :
            (activeEvent.id === null ? activeEvent.partialEvent : scheduleEvent.find(currEvent=>currEvent.id===activeEvent.id))
    }
};



const mapDispatchToProp = dispatch => {
    return {
        initEvents: events => dispatch(actionCreators.schedules.init(events)),
        updateEventInStore: updatedEvent => dispatch(actionCreators.schedules.update(updatedEvent)),
        removeEventInStore: eventId => dispatch(actionCreators.schedules.remove(eventId)),
        setActiveEvent: eventId => dispatch(actionCreators.activeEvent.set(eventId)),
        resetActiveEvent: () => dispatch(actionCreators.activeEvent.reset()),
        setPartialActiveEvent: partialEvent => dispatch(actionCreators.activeEvent.partial(partialEvent))
    }
};

const makeUiEvent = event=>{
    const uiEvent = formatter(event, {
        date:['date', val=>new Date(val)],
        timePeriod:['timePeriod', val=>{ return {from: new Date(val.from), to: new Date(val.to)}}],
        edited:['edited', val=>val||false],
        rollbackEvent:['rollbackEvent', val=>val?makeUiEvent(val):null],
        newEvent:['newEvent',val=>val||false]
    });

    return uiEvent;
};


const AppComponent = compose(withState('activeEvent', 'updateActiveEvent', null),
                             withState('calendarDate', 'setCalendarDate', new Date()),
                             connect(mapStateToProps, mapDispatchToProp),
                             lifecycle({
                                 componentDidMount() {
                                     fetch('http://localhost:8080/events')
                                         .then(res=>{
                                             return res.json()
                                         })
                                         .then(events=>{
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
                                         })
                                 }
                             }),
                            withHandlers({
                                addEventToCache: () => event =>{
                                    const unsavedEvents = localStorage.getItem('unSavedEvents');
                                    let newUnsavedEvents = [];
                                    if (unsavedEvents){
                                        newUnsavedEvents = JSON.parse(unsavedEvents)
                                    }
                                    newUnsavedEvents.push(event);
                                    localStorage.setItem('unSavedEvents', JSON.stringify(newUnsavedEvents))
                                },
                                removeEventFromCache: () => eventId =>{
                                    const unSavedEvents = JSON.parse(localStorage.getItem('unSavedEvents'));
                                    localStorage.setItem('unSavedEvents',
                                        JSON.stringify(unSavedEvents.filter(currEvent=>currEvent.id !== eventId)));
                                }
                            }),
                            withHandlers({
                                fetchEventId: () => () => {
                                    return fetch('http://localhost:8080/event/fetchId', {
                                        method:'post',
                                        headers: {'content-type': 'application/json'},
                                        body: JSON.stringify({})
                                    }).then((result) => result.json())
                                      .then(({eventId}) => {
                                          return eventId
                                      });
                                },
                                upsertEvent: () => upsertEvent => {
                                    return fetch('http://localhost:8080/event', {
                                        method:'post',
                                        headers: {'content-type': 'application/json'},
                                        body:JSON.stringify({event:_.omit(upsertEvent,['edited','rollbackEvent','newEvent'])})
                                    }).then(result=>result.json());
                                },
                                updateEvent: ({updateEventInStore, addEventToCache}) => updatedEvent => {
                                    if (updatedEvent.edited) {
                                        addEventToCache(updatedEvent);
                                    }
                                    updateEventInStore(updatedEvent);
                                },
                                rollbackEvent:({updateEventInStore})=> rollbackEvent => {
                                    const unSavedEvents = JSON.parse(localStorage.getItem('unSavedEvents'));
                                    localStorage.setItem('unSavedEvents',
                                                         JSON.stringify(unSavedEvents.filter(currEvent=>currEvent.id !== rollbackEvent.id)));
                                    updateEventInStore(rollbackEvent);
                                },
                                saveEvent:({updateEventInStore})=> rollbackEvent => {
                                    const unSavedEvents = JSON.parse(localStorage.getItem('unSavedEvents'));
                                    localStorage.setItem('unSavedEvents',
                                        JSON.stringify(unSavedEvents.filter(currEvent=>currEvent.id !== rollbackEvent.id)));
                                    updateEventInStore(rollbackEvent);
                                },
                                removeEvent: ({removeEventInStore}) => event => {
                                    if (event.edited){
                                        const unSavedEvents = JSON.parse(localStorage.getItem('unSavedEvents'));
                                        localStorage.setItem('unSavedEvents',
                                                             JSON.stringify(unSavedEvents.filter(currEvent=>currEvent.id !== event.id)))
                                    }
                                    removeEventInStore(event.id);
                                }
                            }))
    (({calendarDate, schedules, roles, activeEvent, setCalendarDate,
          updateEvent, rollbackEvent, removeEvent, saveEvent, updateActiveEvent, fetchEventId, upsertEvent}) =>{
        const eventsMap = createStateMap(schedules);
        return (
            <Router history={history}>
            <div className="flx col ctr">
                <ul className="links">
                    <li><input className="link" type="button" value="דף הבית"/></li>
                    <li><input className="link" type="button" onClick={()=>{
                        history.push('/')
                    }} value="לוח שנה"/></li>
                    <li><input className="link" type="button" value="אירוע חדש" onClick={()=>{
                        updateActiveEvent(null);
                        history.push('/showEvent')
                     }}/></li>
                </ul>
                -------------------------------------------------

                    <div>
                    <Route path="/" exact render={routeProps=>{
                        return (<CalendarViewer {...routeProps}
                                                time={calendarDate}
                                                events={eventsMap}
                                                showEvent={EventButtonView}
                                                onEventTrigger={({type, eventId}) => {
                                                    const event = schedules.find(value => value.id.toString() === eventId.toString());
                                                    updateActiveEvent(event);
                                                    history.push(`/showEvent`);
                                                }}
                                                onMonthChange={(newDate)=>{
                                                    setCalendarDate(newDate);
                                                }}
                                                onAddEvent={(dateClicked)=>{
                                                    updateActiveEvent({date:dateClicked});
                                                    history.push(`/showEvent`);
                                                }}
                                                />)
                    }} />
                    <Route path="/showEvent" exact render={routeProps=>{
                        return (<EditEventComponent {...routeProps} event={activeEvent} roles={roles}
                                                    onUpdateEvent={async (updatedEvent)=>{
                                                        let eventId = updatedEvent.id;
                                                        if (updatedEvent.id === -1){
                                                            eventId = await fetchEventId();
                                                        }
                                                        updateEvent({...updatedEvent, ...{id:eventId}});
                                                        updateActiveEvent({...updatedEvent, ...{id:eventId}});
                                                    }}
                                                    onCancel={()=>{
                                                         if (activeEvent.newEvent) {
                                                             removeEvent(activeEvent);
                                                         } else {
                                                             rollbackEvent(activeEvent.rollbackEvent);
                                                         }
                                                        updateActiveEvent(activeEvent.rollbackEvent);
                                                    }}
                                                    onBack={()=>{
                                                        history.push('/');
                                                    }}
                                                    onSave={async ()=>{
                                                        const event = makeUiEvent(await upsertEvent(activeEvent));
                                                        saveEvent(event);
                                                        updateActiveEvent(event);
                                                    }}
                                />);
                    }} />
                    </div>

            </div>
    </Router>
        )
});
const store = createStore(reducer);
ReactDOM.render(
    <Provider store={store}>
        <AppComponent/>
    </Provider>,
    document.getElementById('root')
);
