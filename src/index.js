import React from 'react';
import ReactDOM from 'react-dom';
import './main.css'
import {reducer} from "./reducers/reducer";
import {createStore} from "redux";
import Provider from "react-redux/es/components/Provider";
import {AppComponent} from "./components/app-component";

const store = createStore(reducer);
ReactDOM.render(
    <Provider store={store}>
        <AppComponent/>
    </Provider>,
    document.getElementById('root')
);
