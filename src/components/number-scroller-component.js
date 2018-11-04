import React from "react";
import {withHandlers} from "recompose";

export const NumberScroller = withHandlers({
    handleUpdate: ({onChange = ()=>{}, validCondition=()=>true}) => (value) => {
        if (!isNaN(+value) && validCondition(value)){
            onChange(+value);
        }
    }
})(({value, handleUpdate}) => {
    return (
        <div className='flx row'>
            <div className='flx col' style={({height: '28px'})}>
                <input type='button' value="⇧" onClick={() => handleUpdate(+value+1)}/>
                <input type='button' value="⇩" onClick={() => handleUpdate(+value-1)}/>
            </div>
            <input className='picker' value={value} onChange={event=>{handleUpdate(+event.target.value)}}/>
        </div>);
});