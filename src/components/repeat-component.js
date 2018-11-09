import {NumberScroller} from "./number-scroller-component";
import {withHandlers} from "recompose";
import React from "react";

export const RepeatComponent =
    withHandlers({
        update: ({unit,spaces,specifications, onChange=()=>{}}) => (update)=>{
            onChange({...{unit, spaces, specifications}, ...update});
        }})(({unit,spaces,specifications, update}) =>{
        const repeatKinds = {
            weekly: 'שבועות',
            monhtly: 'חודשים',
            yearly: 'שנים'
        };
        const daysInWeek = ['א','ב','ג','ד','ה','ו','ש'];
        return <React.Fragment>
            <div className='field'>
                <span className="fieldTitle">חזרה:</span>
                <div> כל ‎</div>
                <NumberScroller value={spaces} onChange={(newVal)=>{
                    update({spaces: newVal})
                }}/>
                <select value={unit} onChange={newVal=>{
                    update({unit: newVal.target.value})}
                }>
                    {
                        Object.keys(repeatKinds).map(kindKey=>
                            <option key={kindKey} value={kindKey}>
                                {repeatKinds[kindKey]}</option>)
                    }
                </select>
            </div>
            {
                unit === 'weekly' &&
                <div className='field'>
                    <span className="fieldTitle">בימים:</span>
                    <div className='flx row wrp days'>
                        {
                            daysInWeek.map((day, index)=>
                                <div key={index}><input type='checkbox' checked={specifications.indexOf(index)!==-1} onChange={()=>{
                                    const dayIndex = specifications.indexOf(index);
                                    if (dayIndex===-1){
                                        update({specifications: [...specifications, index]})
                                    } else {
                                        update({specifications: specifications.filter((_,currIndex)=>currIndex!==dayIndex)});
                                    }
                                }}/> {day}</div>)
                        }
                    </div>
                </div>
            }
        </React.Fragment>
    });