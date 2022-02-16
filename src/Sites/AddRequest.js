import React from 'react'

class AddRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            url: '',
            error: false,
            description: '',
            mode: '',
            response: false,
            author: '',
            curses: false,
            id: '',
            image: '',
            text: '',
            title: '',
            showDiv: false
        };
        this.request = this.request.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.buttonClick = this.buttonClick.bind(this);
    }
    open() {
        this.setState({showDiv: true});
    }
    close() {
        this.setState({showDiv: false});
    }
    buttonClick() {
        this.open()
        this.request()
    }
    request() {
        fetch(
            "http://10.0.128.165:8080/api/url", {
                "method": "POST",
                "headers": {
                  "content-type": "application/json",
                  "accept": "application/json"
            },
            "body": JSON.stringify({
                url: this.state.url
            })
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            // response = JSON.parse(response)
            this.setState({response: true});
            this.setState({author: response.Author});
            this.setState({curses: response.Curses});
            this.setState({id: response.Id});
            this.setState({image: response.Image});
            this.setState({text: response.Text});
            this.setState({title: response.Title});
            this.setState({error: response.Error});
            this.setState({description: response.Description});
            this.setState({mode: response.Mode});

        })
        .catch(err => {
            console.log(err);
        });
    }
    handleChange(changeObject) {
        this.setState(changeObject)
    }
    submitHandler(e) {
        e.preventDefault();
    }
    render() {
        return(
            <div className="flex flex-col items-center">
                <div className="font-baloo text-2xl lg:text-5xl text-zinc-200 font-medium text-center">
                    Zgłoś swoją piosenkę do radiowęzła
                </div>
                <div className="mt-10">
                    <form id='urlForm' className="flex flex-col" onSubmit={this.submitHandler}>
                        <div className="font-baloo text-xl text-zinc-200 font-medium">
                            Podaj link:
                        </div>
                        <input id="urlField" className="mt-2 form-input px-4 py-3 rounded-full w-full lg:w-96" type="url" id="urlField" name="urlField" required value={this.state.url} onChange={(e) => this.handleChange({ url: e.target.value })}/>
                        <div className='flex flex-row mt-4 items-center'>
                            <button className=" h-12 w-24 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold" type="button" onClick={this.buttonClick}>Zgłoś</button>
                            {this.state.showDiv === true && (
                                <div className='spin ml-3'></div>
                            )}
                        </div>
                        
                    </form>
                </div>
                     
                    {this.state.response === true && 
                        this.state.error === false && 
                            this.state.mode === 'single' && 
                                this.state.curses === false && (
                                    <div className='mt-10 flex flex-col items-center'>
                                        <div>
                                            <img src={this.state.image} className="w-36 rounded-2xl" alt='' onLoad={this.close}></img>
                                        </div>
                                        <div className='mt-4 font-baloo text-3xl text-zinc-200 font-medium'>
                                            {this.state.title}
                                        </div>
                                        <div className='font-baloo text-2xl text-zinc-200 font-medium'>
                                            {this.state.author}
                                        </div>
                                        <div className='mt-4 font-baloo text-xl text-zinc-200 font-medium'>
                                            Znaleziono poprawną piosenkę?
                                        </div>
                                        <div className='flex flex-row mt-4 items-center'>
                                            <button className='h-12 w-24 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold'>Tak</button>
                                            <button className='ml-2 h-12 w-24 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold'>Nie</button>
                                        </div>
                                        <div className='font-baloo text-zinc-200 font-normal text-center mb-10 mt-4' dangerouslySetInnerHTML={{__html: this.state.text}}>
                                        </div>
                                    </div>
                                )
                    }
                    {this.state.response === true &&
                        this.state.error === false &&
                            this.state.mode === 'single' && 
                                this.state.curses === true && (
                                    <div className='font-baloo text-2xl text-zinc-200 font-medium'>
                                        Curses
                                    </div>
                                )    
                    }
                    {this.state.response === true &&
                        this.state.error === true && (
                            <div className='font-baloo text-2xl text-red-500 font-medium'>
                                {this.state.description}
                            </div>

                        )


                    }


                    
                


                
                
            </div>
        );
    }
} 




// const AddRequest = () => {
//     return(
//         <div className="flex flex-col items-center">
//             <div className="font-baloo text-2xl lg:text-5xl text-zinc-200 font-medium text-center">
//                 Zgłoś swoją piosenkę do radiowęzła
//             </div>
//             <div className="mt-10">
//                 <form className="flex flex-col">
//                     <div className="font-baloo text-xl text-zinc-200 font-medium">
//                         Podaj link:
//                     </div>
//                     <input className="mt-2 form-input px-4 py-3 rounded-full w-full lg:w-96" type="url" id="urlField" name="urlField" required />
//                     <input className="mt-4 h-12 w-24 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold" type="submit" value="Zgłoś"></input>
//                 </form>
//             </div>
            
//         </div>
//     );
// };

export default AddRequest;