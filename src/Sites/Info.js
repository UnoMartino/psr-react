import React from 'react'

class Info extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.buttonClick = this.buttonClick.bind(this);
    }
    buttonClick() {
        window.location.replace("/api/admin");
    }
    render() {
        return(
            <>
                <div className="flex flex-col items-center mb-10">
                    <div className="font-baloo text-2xl lg:text-5xl text-zinc-200 font-medium text-center mb-4">
                        Informacje
                    </div>
                    <div className='text-zinc-200 text-xl'>Autor:</div>
                    <div className='text-zinc-200 text-xl mb-2'> <a href='https://www.instagram.com/martino_del_uno/' target={"_blank"}>@martino_del_uno</a></div>
                    <div className='text-zinc-200 text-xl'>Szkoła:</div>
                    <div className='text-zinc-200 text-xl'> <a href='https://www.instagram.com/zst_tarnow/' target={"_blank"}>@zst_tarnow</a></div>
                    <div className='text-zinc-200 text-xl mb-2'> <a href='https://www.instagram.com/spotted_zst/' target={"_blank"}>@spotted_zst</a></div>
                    
                </div>
            
            </>

        )
    }


}

export default Info;