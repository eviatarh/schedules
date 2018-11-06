import React from 'react';
import withRouter from "react-router/es/withRouter";
import {compose} from "recompose";
import {actionCreators} from "../constants/action-creators";
import connect from "react-redux/es/connect/connect";

export const Links = compose(connect(null, dispatch => ({
    resetActiveEvent: () => dispatch(actionCreators.activeEvent.reset())
})), withRouter)(({resetActiveEvent, history}) => {
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