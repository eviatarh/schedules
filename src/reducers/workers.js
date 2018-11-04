import {ActionTypes} from "../constants/action-types";

const initialState = [
    {
        id:123456789,
        firstName:'Jhon',
        lastName:'Smith',
        roles: ['0'],
        restrictions: []
    },
    {
        id:987654321,
        firstName:'Amit',
        lastName:'Jhonson',
        roles: ['0','1'],
        restrictions: []
    },
];
export function workers(state = initialState, action){
    switch (action.type){
        case ActionTypes.ADD_WORKER:
            return [...state, action.worker];
        case ActionTypes.REMOVE_WORKER:
            const {workerId} = action;
            return state.filter(currWorker => currWorker.id !== workerId);
        case ActionTypes.UPDATE_WORKERs:
            const updatedEventIndex = state.findIndex(worker => worker.id === action.worker.id);
            return state.map((currWorker, index) =>{
                if (index === updatedEventIndex){
                    return {...currWorker, ...action.worker};
                }
                return currWorker;
            });
        default:
            return state;
    }
}