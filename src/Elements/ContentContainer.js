import TopPanel from "./TopPanel";
import React from 'react'
import Home from "../Sites/Home";
import AddRequest from "../Sites/AddRequest";
import Admin from "../Sites/Admin"

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
            </div>

        </div>
    );
};




export default ContentContainer;