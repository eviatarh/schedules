import {NumberScroller} from "./number-scroller-component";
import React from "react";

export function EditRoles({event, roles, updateEditedEvent}){
    const unusedRoles = roles.filter(role=> event.rolesNeeded.findIndex(currRole=>role.id===currRole.roleId) === -1);
    const plusButton = unusedRoles.length ? (<button className='btn' onClick={()=>{
            updateEditedEvent({rolesNeeded: [...event.rolesNeeded, {roleId: unusedRoles[0].id, quantityRequired:1}]});
        }}><i className="fa fa-plus fa-xs"/></button>) : '';
    return (<div>
        {event && event.rolesNeeded.length ?
            <div className="title">תפקידים: </div> :
            <div className='flx row title'>לא נוספו תפקידים{plusButton}</div>}
        {
            event.rolesNeeded.map(({roleId, quantityRequired}, index)=> {
                    const role = roles.find(currRole => currRole.id===roleId);
                    const roleToDisplay = (<select value={role.id}
                                                   style={({height:'28px'})}
                                                   onChange={changeEvent=>{
                                                       const newRoleId = +changeEvent.target.value;
                                                       updateEditedEvent({rolesNeeded: event.rolesNeeded.map(currRole=>{
                                                               if (currRole.roleId === roleId){
                                                                   return {...currRole, ...{roleId: newRoleId}};
                                                               }
                                                               return currRole;
                                                           })
                                                       });
                                                   }}>
                        {[role, ...unusedRoles].map(role=><option key={role.id}
                                                                  value={role.id}>{role.displayName}</option>)}
                    </select>);
                    return <div className='roleLine' key={roleId}> נדרש {roleToDisplay} בכמות
                        <NumberScroller value={quantityRequired}
                                        onChange={newVal=>{
                                            updateEditedEvent({rolesNeeded: event.rolesNeeded.map(currRole=>{
                                                if (currRole.roleId === roleId){
                                                    return {...currRole, ...{quantityRequired:newVal}};
                                                }
                                                return currRole;
                                            })});
                                        }}
                                        validCondition={value => value>0 }
                                        /><button className='btn' onClick={()=>{
                                            updateEditedEvent({rolesNeeded: event.rolesNeeded.filter(currRole=>currRole.roleId!==roleId)});
                                        }}><i className='fa fa-trash fa-xs'/></button>
                                            {(index === event.rolesNeeded.length-1) ? plusButton:''}</div>;

                })
        }
    </div>);
};