import React from "react";
import {withEventActions} from "./high-order-components/withEventActions";
import {pad} from "../utils/pad";

function shortDisplayName(displayName){
   if (displayName.length > 7){
       return `${displayName.substring(0,8)}...`;
   }
   return displayName
}

const EventButtonView = withEventActions(({event, onEventClick, onEventCancel, onEventDelete, onEventSave}) =>{
         const uiEvent = event.childOf || event;
         const {from, to} = uiEvent.timePeriod;
         const showCancelButton = uiEvent.edited;
         const showSaveButton = showCancelButton;
         const showDeleteButton = !uiEvent.newEvent;
         return(
             <div className={`event ${uiEvent.edited ? 'unsavedEvent' : ''}`}>
                     <div onClick={onEventClick}>
                         {from.getHours()}<sup>{pad(from.getMinutes(),2)}</sup> - {to.getHours()}
                         <sup>{pad(to.getMinutes(),2)}</sup>
                     </div>
                     <div className='flx row rvs spc'>
                             <div className='flx row end aiend spec'>
                                 { showCancelButton &&
                                 <span className='sml-btn tooltip' onClick={onEventCancel}>
                                     <span className='tooltiptext tiny-button'>בטל</span>
                                     <i className='fa fa-undo fa-xs'/>
                                 </span>
                                 }
                                 { showSaveButton &&
                                 <span className='sml-btn tooltip' onClick={onEventSave}>
                                     <span className='tooltiptext tiny-button'>שמור</span>
                                     <i className='fa fa-save fa-xs'/>
                                 </span>
                                 }
                                 {
                                     showDeleteButton &&
                                     <span className='sml-btn tooltip' onClick={onEventDelete}>
                                         <span className='tooltiptext tiny-button'>מחק</span>
                                         <i className='fa fa-trash fa-xs'/>
                                     </span>
                                 }
                         </div>
                         <div className='flx row fill' onClick={onEventClick}>
                             <span className='tooltip'>
                                 <span className='tooltiptext event-title'>{uiEvent.displayName}</span>
                                {shortDisplayName(uiEvent.displayName)}
                             </span>
                             <span className='fill'/>
                         </div>
                     </div>
                 </div>)
});

export function EventButtonListView({events, onEventTrigger = ()=>{}}) {
    return events
        .sort((eventA, eventB) => {
        return (eventB.timePeriod.from < eventA.timePeriod.from) ? 1 : (eventB.timePeriod.from > eventA.timePeriod.from ? -1 : 0);
    })
        .map(event=><EventButtonView key={event.id} event={event} onEventTrigger={onEventTrigger}/>);

}
