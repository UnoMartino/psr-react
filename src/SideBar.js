import { BsPlus, BsGearFill } from 'react-icons/bs';
import { MdRadio } from "react-icons/md";
const Menu = require("./App")

const SideBar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-16 flex flex-col bg-zinc-800 dark:bg-zinc-800 shadow-lg z-top">
      <SideBarIcon changeMenu={Menu} icon={<MdRadio size="28" />} text="Strona główna" />
      <SideBarIcon changeMenu={Menu} icon={<BsPlus size="32" />} text="Requesty"/>
      <Divider />
      <SideBarIcon icon={<BsGearFill size="24" />} text="Administracja"/>
      
    </div>
  );
};



const SideBarIcon = (props) => (
  <div className="sidebar-icon group">
    <button onClick={props.changeMenu}>{props.icon}</button>
    

    <span className="sidebar-tooltip group-hover:scale-100 font-baloo text-sm antialiased">{props.text}</span>
  </div>
);

const Divider = () => <hr className="sidebar-hr" />;

export default SideBar;