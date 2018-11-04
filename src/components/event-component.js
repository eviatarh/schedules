import React from "react";
import {withHandlers} from "recompose";
import DatePicker from "react-datepicker/es";
import moment from "moment";
import 'react-datepicker/dist/react-datepicker.css';
import {TimePicker} from "./time-picker-component";
import {EditRoles} from "./edit-roles-component";
let _ = require('lodash');
const pad = ((a,b) => (1e15+a+"").slice(-b));


const defaultEvent = {
    id:-1,
    displayName: 'אירוע חדש',
    date: new Date(),
    timePeriod: {
        from: new Date(),
        to: new Date()
    },
    rolesNeeded: [],
    rollbackEvent: null,
    newEvent:false
};

export const EditEventComponent = withHandlers({
    updateEditedEvent: ({onUpdateEvent, event}) => (update) => {
        let updatedEvent = {..._.cloneDeep(defaultEvent),...event||{}};
        const newEvent = updatedEvent.newEvent || updatedEvent.id === -1;
        updatedEvent = updatedEvent.edited ?
            {...updatedEvent, ...update} : {...updatedEvent, ...{rollbackEvent: updatedEvent, edited: true, newEvent}, ...update};
        onUpdateEvent(updatedEvent);
    }
})
(({event, roles, updateEditedEvent, onCancel=()=>{}, onSave=()=>{}, onBack=()=>{}})=>{
    const uiEvent = {..._.cloneDeep(defaultEvent),...event||{}};
    return (
        <div className="card flx col">
            <div className="card flx col ctr">
                <input type="text" value={uiEvent.displayName} onChange={event=>{
                    updateEditedEvent({displayName: event.target.value});
                }} className="title big"/>
                <div className="field">
                    <span className="fieldTitle">תאריך: </span>
                        <div className='forceIt'>
                            <DatePicker className='forceIt'
                                        selected={moment(uiEvent.date)}
                                        dateFormat='DD/MM/YYYY'
                                        onChange={momentUpdate=>{
                                                    updateEditedEvent({date: momentUpdate.toDate()});
                                                  }}/>
                        </div>
                </div>
                <div className="field">
                    <span className="fieldTitle">שעת התחלה: </span>
                        <TimePicker value={uiEvent.timePeriod.from}
                                    onChange={newTime=>{
                                                updateEditedEvent({timePeriod: {from: newTime, to:uiEvent.timePeriod.to}});
                                              }}/>
                </div>
                <div className="field">
                    <span className="fieldTitle">שעת סיום: </span>
                        <TimePicker value={uiEvent.timePeriod.to}
                                    onChange={newTime=>{
                                               updateEditedEvent({timePeriod: {to: newTime, from:uiEvent.timePeriod.from}})
                                              }}/>
                </div>
                <div className="fill">
                    <EditRoles event={uiEvent} roles={roles} updateEditedEvent={updateEditedEvent}/>
                </div>
            </div>
            <div className='flx row spc'>
                <div className='flx row'>
                    <input type='button' className="btn" value='חזור' onClick={onBack}/>
                    <input type='button' className="btn" disabled={!event || !event.rollbackEvent} value='בטל' onClick={onCancel}/>
                </div>
                <input type='button' className="btn" value='שמור' onClick={onSave}/>
            </div>
        </div>)
});

export function EventComponent({events, match, roles}){
    const {eventId} = match.params;
    const allEvents = Array.from(events).reduce((prev, [currKey,currValue]) => [...prev, ...currValue],[]);
    const event = allEvents.find(value => value.id.toString() === eventId.toString());
    if (!event){
        return null;
    } else {
        const {from, to} = event.timePeriod;
        return (
            <div className="card flx col ctr">
                <div className="title big">{event.displayName}</div>
                <div>{event.date.toLocaleDateString()}</div>
                <div>{from.getHours()}<sup>{pad(from.getMinutes(),2)}</sup> עד {to.getHours()}
                    <sup>{pad(to.getMinutes(),2)}</sup></div>
                <div className="fill">
                    <div className="title">תפקידים נדרשים:</div>
                    {
                        event.rolesNeeded.map(({roleId, quantityRequired})=> {
                            const role = roles.find(currRole => currRole.id === roleId);
                            const roleDisplay = role ? role.displayName : `{${roleId}}`;
                            return (<div key={roleId}>{roleDisplay}: {quantityRequired} נדרש</div>)}
                            )
                    }
                </div>
            </div>
        )
    }
}