export function createStateMap(state) {
    let stateMap = new Map();
    for (let event of state){
        if (!event.repeatedEvent){
            const eventDate = event.date;
            const key = `${eventDate.getFullYear()}${eventDate.getMonth()}${eventDate.getDate()}`;
            let currentKeyState = stateMap.get(key);
            if (!currentKeyState){
                stateMap.set(key,[]);
                currentKeyState = stateMap.get(key);
            }
            currentKeyState.push(event);
        }
    }

    return stateMap;
}