import React from "react";
import {WeekComponent} from "./week.component";
import {withHandlers} from "recompose";


const enhance = withHandlers(
    {
        onPrevClick : ({date, onMonthChange}) => () =>{
            let prevDate = new Date(date.valueOf());
            prevDate.setMonth(prevDate.getMonth()-1);
            onMonthChange(prevDate);
        },
        onNextClick: ({date, onMonthChange}) => () => {
            let nextDate = new Date(date.valueOf());
            nextDate.setMonth(nextDate.getMonth()+1);
            onMonthChange(nextDate);
        }
    }
);

const engLang = {
    '0': 'January',
    '1': 'February',
    '2': 'March',
    '3': 'April',
    '4': 'May',
    '5': 'June',
    '6': 'July',
    '7': 'August',
    '8': 'September',
    '9': 'October',
    '10': 'November',
    '11': ' December'
};

const hebLang = {
    '0': 'ינואר',
    '1': 'פברואר',
    '2': 'מרץ',
    '3': 'אפריל',
    '4': 'מאי',
    '5': 'יוני',
    '6': 'יולי',
    '7': 'אוגוסט',
    '8': 'ספטמבר',
    '9': 'אוקטובר',
    '10': 'נובמבר',
    '11': 'דצמבר'
};

export const MonthComponent = enhance(({date, events, showEvent,
                                        onPrevClick = ()=>{}, onNextClick = ()=>{},
                                           onEventTrigger = ()=>{}, onAddEvent = ()=>{}})=>{
    const toMonthName = date => {
        return hebLang[date.getMonth().toString()];
    };
    const numberOfDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth(), numberOfDays);
    let weeks = [];
    let firstWeekDays = 7 - firstDay.getDay() - 1;
    let lastDayInWeek = new Date(firstDay.valueOf());
    lastDayInWeek.setDate(firstDay.getDate() + firstWeekDays);
    weeks.push({
        firstDay: firstDay,
        lastDay: lastDayInWeek
    });
    while (lastDayInWeek.getDate() < lastDay.getDate()) {
        let firstInWeek = new Date(lastDayInWeek);
        firstInWeek.setDate(lastDayInWeek.getDate() + 1);
        lastDayInWeek = new Date(firstInWeek);
        lastDayInWeek.setDate(firstInWeek.getDate() + 6);
        if (lastDayInWeek.getMonth()===0 && date.getMonth() === 11 || lastDayInWeek.getMonth() > date.getMonth()) {
            lastDayInWeek = new Date(lastDay);
        }
        weeks.push({
            firstDay: firstInWeek,
            lastDay: lastDayInWeek
        });
    }
    return (
        <div className="flx col ctr">
            <div className="flx row ctr">
                <input type='button' value="<<" onClick={() => {
                    onPrevClick();
                }}/>
                <h2 className="fixedTitle">{toMonthName(date)}, {date.getFullYear()}</h2>
                <input type='button' value=">>" onClick={() => {
                    onNextClick();
                }}/>
            </div>
            {
                weeks.map(week => {
                    return (
                        <WeekComponent className="flx col"
                                       events={events}
                                       key={`${week.firstDay.toDateString()}|${week.lastDay.toDateString()}`}
                                       week={week}
                                       showEvent={showEvent}
                                       onEventTrigger={onEventTrigger}
                                       onAddEvent={(d)=>{
                                           onAddEvent(d)
                                       }}/>
                    );
                })
            }
        </div>
    )
});