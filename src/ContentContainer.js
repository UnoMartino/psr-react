import TopPanel from "./TopPanel";
import React from 'react'
import Home from "./Home";
import AddRequest from "./AddRequest";

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
            </div>

        </div>
    );
};




export default ContentContainer;