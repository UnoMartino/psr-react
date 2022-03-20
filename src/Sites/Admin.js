import React from 'react'

class Admin extends React.Component {
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
                        Administracja
                    </div>
                    <div className='text-zinc-200 text-xl mb-2'>Przejdź do panelu administacyjnego</div>
                    <button className=" h-12 w-64 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold" type="button" onClick={this.buttonClick}>Panel administracyjny</button>
                </div>
            
            </>

        )
    }


}

export default Admin;