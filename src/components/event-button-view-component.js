import React from "react";
import {withEventActions} from "./high-order-components/withEventActions";

const pad = ((a,b) => (1e15+a+"").slice(-b));


function shortDisplayName(displayName){
   if (displayName.length > 7){
       return `${displayName.substring(0,8)}...`;
   }
   return displayName
}


 const EventButtonView =
     withEventActions(({event, onEventClick, onEventCancel, onEventDelete, onEventSave}) =>{
         const {from, to} = event.timePeriod;
         const showCancelButton = event && event.edited;
         const showSaveButton = showCancelButton;
         const showDeleteButton = event && !event.newEvent;
         return(
             <div className={`event ${event.edited ? 'unsavedEvent' : ''}`}>
                     <div onClick={onEventClick}>
                         {from.getHours()}<sup>{pad(from.getMinutes(),2)}</sup> - {to.getHours()}
                         <sup>{pad(to.getMinutes(),2)}</sup>
                     </div>
                     <div className='flx row rvs spc'>
                             <div className='flx row end aiend spec'>
                                 { showCancelButton &&
                                 <span className='sml-btn tooltip' onClick={onEventCancel}>
                                     <span className='tooltiptext'>בטל</span>
                                     <i className='fa fa-undo fa-xs'/>
                                 </span>
                                 }
                                 { showSaveButton &&
                                 <span className='sml-btn tooltip' onClick={onEventSave}>
                                     <span className='tooltiptext'>שמור</span>
                                     <i className='fa fa-save fa-xs'/>
                                 </span>
                                 }
                                 {
                                     showDeleteButton &&
                                     <span className='sml-btn tooltip' onClick={onEventDelete}>
                                         <span className='tooltiptext'>מחק</span>
                                         <i className='fa fa-trash fa-xs'/>
                                     </span>
                                 }
                         </div>
                         <div className='fill' onClick={onEventClick}>{shortDisplayName(event.displayName)}</div>
                     </div>
                 </div>)
});

export function EventButtonListView({events, onEventTrigger = ()=>{}}) {
    return events.map(event=><EventButtonView key={event.id} event={event} onEventTrigger={onEventTrigger}/>);
}
