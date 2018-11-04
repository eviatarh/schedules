import React from "react";

const engLang = {
    '0': 'Sunday',
    '1': 'Monday',
    '2': 'Tuesday',
    '3':'Wednesday',
    '4':'Thursday',
    '5':'Friday',
    '6':'Saturday'
};

const hebLang = {
    '0': 'ראשון',
    '1': 'שני',
    '2': 'שלישי',
    '3':'רביעי',
    '4':'חמישי',
    '5': 'שישי',
    '6': 'שבת'
};

export function DayComponent({date, greyed, event, children, onAddEvent = ()=>{}}){
    const toDayString = date=>{
        return hebLang[date.getDay()];
    };
    return (
        <div className='flx col day m-r m-d'>
            <div className={`title ${greyed ? 'grey' : 'blue'}`}>{toDayString(date)}</div>
            <div className={`flx col main fill ${greyed ? 'grey' : 'blue'}`}>
                <div className={'flx row rvs spc'}>
                    <div>{date.getDate()}</div>
                    <div>{!greyed ? <button className='btn blue' onClick={()=>{
                        onAddEvent(date)
                    }}><i className="fa fa-plus fa-xs"/></button> : ''}</div>
                </div>
                <div className='fill'>
                    {children}
                </div>
            </div>
        </div>
    )
}
