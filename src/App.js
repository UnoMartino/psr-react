import './App.css';
import ContentContainer from './Elements/ContentContainer';
import React from 'react'
import { BsPlus, BsGearFill } from 'react-icons/bs';
import { MdRadio, MdInfo } from "react-icons/md";
import logo from './logo.png';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {menu: "home"};
  }
  menuHome = () => {
    this.setState({menu: "home"});
  }
  menuAdd = () => {
    this.setState({menu: "add"});
  }
  menuAdmin = () => {
    this.setState({menu: "admin"});
  }
  menuInfo = () => {
    this.setState({menu: "info"});
  }
  componentDidMount() {
    document.title = "Radiowęzeł ZST";  
  }
  render() {
    return (
      <div className="flex">
        <div className="fixed top-0 left-0 h-screen w-16 flex flex-col bg-zinc-800 dark:bg-zinc-800 shadow-lg z-top">
          <SideBarIcon changeMenu={this.menuHome} icon={<MdRadio size="28" />} text="Strona główna" />
          <SideBarIcon changeMenu={this.menuAdd} icon={<BsPlus size="32" />} text="Requesty"/>
          <Divider />
          <SideBarIcon changeMenu={this.menuAdmin} icon={<BsGearFill size="24" />} text="Administracja"/>
          <SideBarIcon changeMenu={this.menuInfo} icon={<MdInfo size="24" />} text="Informacje"/>
      
        </div>
        <ContentContainer menu={this.state.menu}/>
      </div>
    );
  }
}

const SideBarIcon = (props) => (
  <div className="sidebar-icon group">
    <button onClick={props.changeMenu}>{props.icon}</button>
    

    <span className="sidebar-tooltip group-hover:scale-100 font-baloo text-sm antialiased">{props.text}</span>
  </div>
);

const Divider = () => <hr className="sidebar-hr" />;

export default Menu;
