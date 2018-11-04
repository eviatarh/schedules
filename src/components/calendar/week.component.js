import React from "react";
import {DayComponent} from "./day.component";

export function WeekComponent({week, events, showEvent, onEventTrigger = ()=>{}, onAddEvent = ()=>{}}){
    const {firstDay, lastDay} = week;
    const daysInRange = (currDay, lastDay) => {
        let days = [currDay];
        while (currDay.toDateString() !== lastDay.toDateString()) {
            let nextDay = new Date(currDay.valueOf());
            nextDay.setDate(nextDay.getDate() + 1);
            days.push(nextDay);
            currDay = nextDay;
        }
        return days;
    };
    const days = daysInRange(firstDay,lastDay);
    let startFill = [];
    let endFill = [];
    if (days.length < 7){
        if (firstDay.getDay() !== 0){
            let runningDate = new Date(firstDay.valueOf());
            for (let i = firstDay.getDay()-1; i >=0 ; i--){
                runningDate.setDate(runningDate.getDate()-1);
                startFill.unshift(new Date(runningDate.valueOf()));
            }
        } else {
            let runningDate = new Date(lastDay.valueOf());
            for (let i = lastDay.getDay()+1; i <=6 ; i++){
                runningDate.setDate(runningDate.getDate()+1);
                endFill.push(new Date(runningDate.valueOf()));
            }
        }
    }

    return (
        <div className="flx row">
            {
                startFill.map(day => {
                    return (
                        <DayComponent date={day} greyed="true" key={day.toDateString()}/>
                    )
                })
            }
            {
                days.map((day)=>{
                    const relatedEvents = events.get(`${day.getFullYear()}${day.getMonth()}${day.getDate()}`);
                    const EventComponent = relatedEvents ? showEvent : null;
                    return (
                        <DayComponent date={day} key={day.toDateString()} onAddEvent={onAddEvent}>
                            {EventComponent && <EventComponent events={relatedEvents} onEventTrigger={onEventTrigger}/>}
                        </DayComponent>
                    );

                })}
            {
                endFill.map(day => {
                    return (
                        <DayComponent date={day} greyed="true" key={day.toDateString()}/>
                    )
                })
            }
        </div>);
}