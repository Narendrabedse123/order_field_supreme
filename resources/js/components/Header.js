import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import * as actions from '../store/actions';

class Header extends Component {
  
  
  
 
  render() {
    
    return (
      <div className="align-items-center justify-content-between text-center container" style={{marginTop:"5px"}}>
       
        <div className="logo my-0 font-weight-normal h3 " >
        <img  style={{float:"left",height:"40px",paddingTop:"6px"}} src="/uploads/arcafy.png" ></img>
         <span className="text-center" style={{fontWeight:"bolder",marginRight:"12%",paddingTop:"10px",display:'inline-block'}}>Order Fields Supreme</span>
         <a className="text-center btn" target="_blank" href={`/docs`} style={{float:"right",fontWeight:"bold",marginTop:10,fontSize:"16px",display:'inline-block',background:"#FFE941",color:"#022866"}}>Support</a>

        </div>
        <hr style={{marginTop:"1em",marginBottom:"0.5em"}}/>
      </div>
     
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
});


export default connect(mapStateToProps)(Header);

