import React from "react";

export class FloatingWindow extends React.Component{


    constructor(props){
        super(props);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.state = {
            xLoc:100,
            yLoc:100
        };
        this.ref = React.createRef();
    }

    onMouseDown(event){
        console.log('mouse is down');
        const onMouseMove = event=>{
            console.log('mouse is moving');
            this.setState({
                xLoc:event.clientX  - event.currentTarget.clientWidth/2,
                yLoc:event.clientY - 420
            });

            if (!this.ref.current.onmouseup){
                this.ref.current.onmouseup = ()=>{
                    console.log('mouse is up');
                    this.ref.current.onmousemove = null;
                }
            }

        };
        this.ref.current.onmousemove = onMouseMove;
    }

    render(){
        return (
            <div style={{height:'100px',width:"100px",display:'flex',flexDirection:'column', position:'absolute',
                left:this.state.xLoc, bottom:this.state.yLoc}}>
                <div ref={this.ref} style={({backgroundColor:"#395bff",height:'30px'})} onMouseDown={this.onMouseDown}/>
                <div style={({backgroundColor:"#3beeff",flex:1})}/>
            </div>
        );
    }


}
