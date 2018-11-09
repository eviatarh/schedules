import React from "react";
import {NumberScroller} from "./number-scroller-component";
import {pad} from "../utils/pad";

export function TimePicker({value, onChange}){
    const isHours = (hours) =>{
        return !(hours < 0 || hours > 23);

    };

    const isMinutes = (minutes) =>{
        return !(minutes < 0 || minutes > 59);

    };
    return (
        <span className='flx row' style={({direction: 'ltr'})}>
            <NumberScroller value={pad(value.getHours(), 2)} onChange={newValue=>{
                    const updatedDate = new Date(value.valueOf());
                    updatedDate.setHours(newValue);
                    onChange(updatedDate);
            }} validCondition={isHours}/>
            <NumberScroller value={pad(value.getMinutes(), 2)} onChange={newValue=> {
                    const updatedDate = new Date(value.valueOf());
                    updatedDate.setMinutes(newValue);
                    onChange(updatedDate);
            }} validCondition={isMinutes}/>
        </span>
    );
}

