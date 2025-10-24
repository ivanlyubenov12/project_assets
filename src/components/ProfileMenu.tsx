import logo from './logo.svg';
import { MdPerson } from 'react-icons/md';
import { MdEdit } from 'react-icons/md';
import { MdInbox } from 'react-icons/md';
import { MdSettings } from 'react-icons/md';
import { MdHelp } from 'react-icons/md';
import { MdLogout } from 'react-icons/md';


import React, {useState, useEffect, useRef} from 'react';

function App() {

    const [open, setOpen] = useState(false);

    let menuRef = useRef();

    useEffect(() => {
        let handler = (e)=>{
            if(!menuRef.current.contains(e.target)){
                setOpen(false);
                console.log(menuRef.current);
            }
        };

        document.addEventListener("mousedown", handler);


        return() =>{
            document.removeEventListener("mousedown", handler);
        }

    });

    return (
        <div className="App">
            <div className='menu-container' ref={menuRef}>
                <div className='menu-trigger' onClick={()=>{setOpen(!open)}}>
                    <img src={MdPerson}></img>
                </div>

                <div className={`dropdown-menu ${open? 'active' : 'inactive'}`} >
                    <h3>The Kiet<br/><span>Website Designer</span></h3>
                    <ul>
                        <DropdownItem img = {MdPerson} text = {"My Profile"}/>
                        <DropdownItem img = {MdEdit} text = {"Edit Profile"}/>
                        <DropdownItem img = {MdInbox} text = {"Inbox"}/>
                        <DropdownItem img = {MdSettings} text = {"Settings"}/>
                        <DropdownItem img = {MdHelp} text = {"Helps"}/>
                        <DropdownItem img = {MdLogout} text = {"Logout"}/>
                    </ul>
                </div>
            </div>
        </div>
    );
}

function DropdownItem(props){
    return(
        <li className = 'dropdownItem'>
            <img src={props.img}></img>
            <a> {props.text} </a>
        </li>
    );
}

export default App;