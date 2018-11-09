import React from 'react';
import {compose, withHandlers} from 'recompose';
import DatePicker from 'react-datepicker/es';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import {TimePicker} from './time-picker-component';
import {EditRoles} from './edit-roles-component';
import {withEventActions} from './high-order-components/withEventActions';
import {RepeatComponent} from './repeat-component';
import {pad} from '../utils/pad';
import {getDefaultUpgradeUpdate, getUpdatedEvent, mergeEventWithDefault} from '../utils/event-utils';

export const EditEventComponent = compose(withHandlers({
    updateEditedEvent: ({onUpdateEvent, event}) => (update) => {
        let updatedEvent = mergeEventWithDefault(event);
        updatedEvent = getUpdatedEvent(updatedEvent, update);
        onUpdateEvent({updatedEvent});
    },
    changeEventKind: ({onUpdateEvent, event}) => () => {
        let updatedEvent = mergeEventWithDefault(event);
        if (event && event.childOf){
            updatedEvent = getUpdatedEvent(updatedEvent, {childOf: null});
            onUpdateEvent({updatedEvent});
        } else {
            let upgradedEvent = mergeEventWithDefault(event);
            const upgradeUpdate = getDefaultUpgradeUpdate(upgradedEvent);
            upgradedEvent = getUpdatedEvent(upgradedEvent, upgradeUpdate);
            updatedEvent = getUpdatedEvent(updatedEvent);
            onUpdateEvent({updatedEvent, upgradedEvent});
        }
    },
    updateRepeatParameters: ({onUpdateEvent, event}) => update => {
        const repeatParameters = {...event.childOf.repeatParameters, ...update};
        let upgradedEvent = event.childOf.edited ?
            {...event.childOf, ...{repeatParameters}} : {...event.childOf, ...{rollbackEvent: event.childOf, edited: true}, ...{repeatParameters}};
        onUpdateEvent({upgradedEvent});
    },
    updateFather: ({onUpdateEvent, event}) => update => {
        let upgradedEvent = event.childOf.edited ?
            {...event.childOf, ...update} : {...event.childOf, ...{rollbackEvent: event.childOf, edited: true}, ...update};
        onUpdateEvent({upgradedEvent});
    }
    }), withEventActions)(({event, roles, fatherEvent, updateEditedEvent, updateFather, changeEventKind, updateRepeatParameters, onEventCancel, onEventDelete, onEventSave, onBack=()=>{}})=>{
    const uiEvent = mergeEventWithDefault(event);
    const updatedEvent = uiEvent.childOf ? event.childOf : uiEvent;
    const updateEvent = uiEvent.childOf ? updateFather : updateEditedEvent;
    return (
        <div className='card flx col'>
            <div className='card flx col ctr'>
                <input className='title big'
                       type='text'
                       value={updatedEvent.displayName}
                       onChange={event=>updateEvent({displayName: event.target.value})}/>
                <div className='field'>
                    <span className='fieldTitle'>{uiEvent.childOf ? 'תאריך התחלה:' : 'תאריך:'}</span>
                        <div className='forceIt'>
                            {
                                uiEvent.childOf ?
                                    <DatePicker className='forceIt'
                                                selected={moment(updatedEvent.repeatParameters.startDate)}
                                                dateFormat='DD/MM/YYYY'
                                                onChange={momentUpdate=>{
                                                 updateRepeatParameters({startDate: momentUpdate.toDate()});
                                                 }}
                                    />:
                                    <DatePicker className='forceIt'
                                                selected={moment(updatedEvent.date)}
                                                dateFormat='DD/MM/YYYY'
                                                onChange={momentUpdate=>{
                                                updateEvent({date: momentUpdate.toDate()});
                                              }}
                                    />
                            }
                        </div>
                </div>
                {
                    uiEvent.childOf ?
                    <div className='flx col ctr'>
                        <div className='field'>
                            <span className='fieldTitle'>תאריך סיום:</span>
                            <div className='forceIt'>
                                        <DatePicker className='forceIt'
                                                    selected={moment(uiEvent.childOf.repeatParameters.endDate)}
                                                    dateFormat='DD/MM/YYYY'
                                                    onChange={momentUpdate => {
                                                        updateRepeatParameters({endDate: momentUpdate.toDate()});
                                                    }}
                                        />
                            </div>
                        </div>
                        <RepeatComponent {...uiEvent.childOf.repeatParameters.type} onChange={type =>{
                            updateRepeatParameters({type})
                        }}/>
                    </div>: null
                }
                <div className='field'>
                    <span className='fieldTitle'>שעת התחלה: </span>
                        <TimePicker value={updatedEvent.timePeriod.from}
                                    onChange={newTime=>{
                                                updateEvent({timePeriod: {from: newTime, to:updatedEvent.timePeriod.to}});
                                              }}/>
                </div>
                <div className='field'>
                    <span className='fieldTitle'>שעת סיום: </span>
                        <TimePicker value={updatedEvent.timePeriod.to}
                                    onChange={newTime=>{
                                               updateEvent({timePeriod: {to: newTime, from:updatedEvent.timePeriod.from}})
                                              }}/>
                </div>
                <div className='fill'>
                    <EditRoles event={updatedEvent} roles={roles} updateEditedEvent={updateEvent}/>
                </div>
            </div>
            <div className='flx row'>
                <button className='btn tooltip' onClick={changeEventKind}>
                    <span className='tooltiptext big-button'>{event && event.childOf ? 'בטל אירוע מחזורי' : 'אירוע מחזורי'}</span>
                    <i className='fa fa-sitemap'/>
                </button>
            </div>
                <div className='flx row end eventPanel'>
                        <button className='btn tooltip' onClick={onEventCancel} disabled={!event || !event.edited}>
                            <span className='tooltiptext big-button'>בטל</span>
                            <i className='fa fa-undo'/>
                        </button>
                        <button className='btn tooltip' onClick={onEventSave} disabled={!event || !event.edited}>
                            <span className='tooltiptext big-button'>שמור אירוע</span>
                            <i className='fa fa-save'/>
                        </button>
                        <button className='btn tooltip' onClick={onEventDelete} disabled={!event || event.newEvent}>
                            <span className='tooltiptext big-button'>מחק אירוע</span>
                            <i className='fa fa-trash'/>
                        </button>
                        <button className='btn tooltip' onClick={onBack}>
                            <span className='tooltiptext big-button'>חזור</span>
                            <i className='fa fa-times'/>
                        </button>
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
            <div className='card flx col ctr'>
                <div className='title big'>{event.displayName}</div>
                <div>{event.date.toLocaleDateString()}</div>
                <div>{from.getHours()}<sup>{pad(from.getMinutes(),2)}</sup> עד {to.getHours()}
                    <sup>{pad(to.getMinutes(),2)}</sup></div>
                <div className='fill'>
                    <div className='title'>תפקידים נדרשים:</div>
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