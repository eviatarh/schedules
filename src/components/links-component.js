import React from 'react';
import withRouter from "react-router/es/withRouter";

export const Links = withRouter(({resetActiveEvent, history}) => {
    return (
        <ul className="links">
            <li><input className="link" type="button" onClick={() => {
                history.push('/')
            }} value="לוח שנה"/></li>
            <li><input className="link" type="button" value="אירוע חדש" onClick={() => {
                resetActiveEvent();
                history.push('/showEvent')
            }}/></li>
        </ul>);
});