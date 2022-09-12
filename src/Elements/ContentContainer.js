import TopPanel from "./TopPanel";
import React from 'react'
import Home from "../Sites/Home";
import AddRequest from "../Sites/AddRequest";
import Admin from "../Sites/Admin"
import Info from "../Sites/Info";

const ContentContainer = ({menu}) => {
    return (
        <div className="content-container">
            <div className="drop-shadow-sm mb-4 z-middle">
                <TopPanel />
            </div>
            
            <div className="ml-2 bg-zinc-700">
                {menu === 'home' && (
                    <Home />
                )}

                {menu === 'add' && (
                    <AddRequest />
                )}

                {menu === 'admin' && (
                    <Admin />
                )}

                {menu === 'info' && (
                    <Info />
                )}
            </div>

        </div>
    );
};




export default ContentContainer;