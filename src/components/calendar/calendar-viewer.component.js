import React from "react";
import {MonthComponent} from "./month.component";

export const CalendarViewer = ({time, events, showEvent,
                                onMonthChange = ()=>{}, onEventTrigger = ()=>{}, onAddEvent = ()=>{}}) =>{
    return (<MonthComponent className="flx row"
                           showEvent={showEvent}
                           date={time}
                           events={events}
                           onMonthChange={onMonthChange}
                            onEventTrigger={onEventTrigger}
                            onAddEvent={(d)=>{
                                onAddEvent(d)
                            }}/>);
};

