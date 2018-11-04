import React from "react";

const pad = ((a,b) => (1e15+a+"").slice(-b));


function shortDisplayName(displayName){
   if (displayName.length > 10){
       return `${displayName.substring(0,12)}...`;
   }
   return displayName
}
export function EventButtonView({events, onEventTrigger = ()=>{}}) {
    return events.map(event=>{
        const {from, to} = event.timePeriod;

        return(
            <div className={`btn ${event.edited ? 'unsavedEvent' : ''}`} onClick={()=>onEventTrigger({type:'clicked',
                                                                                                      eventId: event.id})} key={event.id}>
                <div>{from.getHours()}<sup>{pad(from.getMinutes(),2)}</sup> - {to.getHours()}
                    <sup>{pad(to.getMinutes(),2)}</sup></div>
                <div>{shortDisplayName(event.displayName)}</div>
            </div>)});
}