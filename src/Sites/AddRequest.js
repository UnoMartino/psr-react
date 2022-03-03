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
            showText: false,

            showDiv: false,
            reset: false,
            done: false,
            length: 1,

            author2: '',
            curses2: false,
            id2: '',
            image2: '',
            text2: '',
            title2: '',
            showText2: false,

            author3: '',
            curses3: false,
            id3: '',
            image3: '',
            text3: '',
            title3: '',
            showText3: false,

            author4: '',
            curses4: false,
            id4: '',
            image4: '',
            text4: '',
            title4: '',
            showText4: false,

            author5: '',
            curses5: false,
            id5: '',
            image5: '',
            text5: '',
            title5: '',
            showText5: false,

        };
        this.done = this.done.bind(this);
        this.error = this.error.bind(this);
        this.reset = this.reset.bind(this);
        this.addToPlaylist = this.addToPlaylist.bind(this);
        this.addToPlaylist2 = this.addToPlaylist2.bind(this);
        this.addToPlaylist3 = this.addToPlaylist3.bind(this);
        this.addToPlaylist4 = this.addToPlaylist4.bind(this);
        this.addToPlaylist5 = this.addToPlaylist5.bind(this);
        this.request = this.request.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.buttonClick = this.buttonClick.bind(this);
        this.showText = this.showText.bind(this);
        this.showText2 = this.showText2.bind(this);
        this.showText3 = this.showText3.bind(this);
        this.showText4 = this.showText4.bind(this);
        this.showText5 = this.showText5.bind(this);

    }
    open() {
        this.setState({showDiv: true});
    }
    close() {
        this.setState({showDiv: false});
    }
    showText() {
        const showText = this.state.showText;
        this.setState({
        showText: !showText,
        });
    }
    showText2() {
        const showText2 = this.state.showText2;
        this.setState({
        showText2: !showText2,
        });
    }
    showText3() {
        const showText3 = this.state.showText3;
        this.setState({
        showText3: !showText3,
        });
    }
    showText4() {
        const showText4 = this.state.showText4;
        this.setState({
        showText4: !showText4,
        });
    }
    showText5() {
        const showText5 = this.state.showText5;
        this.setState({
        showText5: !showText5,
        });
    }
    buttonClick() {
        this.open()
        this.request()
    }
    request() {
        fetch(
            "/api/url", {
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

            if (response[0].Mode === "single")
            {
                this.setState({response: true});
                this.setState({error: response[0].Error});
                this.setState({description: response[0].Description});
                this.setState({mode: response[0].Mode});
                this.setState({reset: false});
                
                this.setState({author: response[1].Author});
                this.setState({curses: response[1].Curses});
                this.setState({id: response[1].Id});
                this.setState({image: response[1].Image});
                this.setState({text: response[1].Text});
                this.setState({title: response[1].Title});
                
            }

            if (response[0].Mode === "multi") 
            {
                this.setState({response: true});
                this.setState({error: response[0].Error});
                this.setState({description: response[0].Description});
                this.setState({mode: response[0].Mode});
                this.setState({reset: false});

                this.setState({length: response[0].Length});

                if (this.state.length >= 2)
                {
                    this.setState({author: response[1].Author});
                    this.setState({curses: response[1].Curses});
                    this.setState({id: response[1].Id});
                    this.setState({image: response[1].Image});
                    this.setState({text: response[1].Text});
                    this.setState({title: response[1].Title});

                    this.setState({author2: response[2].Author});
                    this.setState({curses2: response[2].Curses});
                    this.setState({id2: response[2].Id});
                    this.setState({image2: response[2].Image});
                    this.setState({text2: response[2].Text});
                    this.setState({title2: response[2].Title});

                    if (this.state.length >= 3)
                    {
                        this.setState({author3: response[3].Author});
                        this.setState({curses3: response[3].Curses});
                        this.setState({id3: response[3].Id});
                        this.setState({image3: response[3].Image});
                        this.setState({text3: response[3].Text});
                        this.setState({title3: response[3].Title});

                        if (this.state.length >= 4)
                        {
                            this.setState({author4: response[4].Author});
                            this.setState({curses4: response[4].Curses});
                            this.setState({id4: response[4].Id});
                            this.setState({image4: response[4].Image});
                            this.setState({text4: response[4].Text});
                            this.setState({title4: response[4].Title});

                            if (this.state.length === 5)
                            {
                                this.setState({author5: response[5].Author});
                                this.setState({curses5: response[5].Curses});
                                this.setState({id5: response[5].Id});
                                this.setState({image5: response[5].Image});
                                this.setState({text5: response[5].Text});
                                this.setState({title5: response[5].Title});
                            }
                        }
                    }
                }
            }
        })
        .catch(err => {
            console.log(err);
        });
    }
    addToPlaylist() {
        fetch(
            "/api/add-song", {
                "method": "POST",
                "headers": {
                  "content-type": "application/json",
                  "accept": "application/json"
            },
            "body": JSON.stringify({
                id: this.state.id
            })
        })
        .then(response => console.log(response))
        .catch(err => {
            console.log(err);
        });
        this.done();
    }
    addToPlaylist2() {
        fetch(
            "/api/add-song", {
                "method": "POST",
                "headers": {
                  "content-type": "application/json",
                  "accept": "application/json"
            },
            "body": JSON.stringify({
                id: this.state.id2
            })
        })
        .then(response => console.log(response))
        .catch(err => {
            console.log(err);
        });
        this.done();
    }
    addToPlaylist3() {
        fetch(
            "/api/add-song", {
                "method": "POST",
                "headers": {
                  "content-type": "application/json",
                  "accept": "application/json"
            },
            "body": JSON.stringify({
                id: this.state.id3
            })
        })
        .then(response => console.log(response))
        .catch(err => {
            console.log(err);
        });
        this.done();
    }
    addToPlaylist4() {
        fetch(
            "/api/add-song", {
                "method": "POST",
                "headers": {
                  "content-type": "application/json",
                  "accept": "application/json"
            },
            "body": JSON.stringify({
                id: this.state.id4
            })
        })
        .then(response => console.log(response))
        .catch(err => {
            console.log(err);
        });
        this.done();
    }
    addToPlaylist5() {
        fetch(
            "/api/add-song", {
                "method": "POST",
                "headers": {
                  "content-type": "application/json",
                  "accept": "application/json"
            },
            "body": JSON.stringify({
                id: this.state.id5
            })
        })
        .then(response => console.log(response))
        .catch(err => {
            console.log(err);
        });
        this.done();
    }
    reset() {
        this.setState({response: false});
        this.setState({author: ''});
        this.setState({curses: ''});
        this.setState({id: ''});
        this.setState({image: ''});
        this.setState({text: ''});
        this.setState({title: ''});
        this.setState({error: ''});
        this.setState({description: ''});
        this.setState({mode: ''});
        this.setState({reset: true});
        this.setState({url: ''});

        this.setState({author2: ''});
        this.setState({curses2: ''});
        this.setState({id2: ''});
        this.setState({image2: ''});
        this.setState({text2: ''});
        this.setState({title2: ''});

        this.setState({author3: ''});
        this.setState({curses3: ''});
        this.setState({id3: ''});
        this.setState({image3: ''});
        this.setState({text3: ''});
        this.setState({title3: ''});

        this.setState({author4: ''});
        this.setState({curses4: ''});
        this.setState({id4: ''});
        this.setState({image4: ''});
        this.setState({text4: ''});
        this.setState({title4: ''});
        
        this.setState({author5: ''});
        this.setState({curses5: ''});
        this.setState({id5: ''});
        this.setState({image5: ''});
        this.setState({text5: ''});
        this.setState({title5: ''});

        this.sleep(3000).then(r => {
            this.setState({reset: false});
      	});

    }
    done() {
        this.setState({response: false});
        this.setState({author: ''});
        this.setState({curses: ''});
        this.setState({id: ''});
        this.setState({image: ''});
        this.setState({text: ''});
        this.setState({title: ''});
        this.setState({error: ''});
        this.setState({description: ''});
        this.setState({mode: ''});
        this.setState({url: ''});
        this.setState({done: true});

        this.setState({author2: ''});
        this.setState({curses2: ''});
        this.setState({id2: ''});
        this.setState({image2: ''});
        this.setState({text2: ''});
        this.setState({title2: ''});

        this.setState({author3: ''});
        this.setState({curses3: ''});
        this.setState({id3: ''});
        this.setState({image3: ''});
        this.setState({text3: ''});
        this.setState({title3: ''});

        this.setState({author4: ''});
        this.setState({curses4: ''});
        this.setState({id4: ''});
        this.setState({image4: ''});
        this.setState({text4: ''});
        this.setState({title4: ''});
        
        this.setState({author5: ''});
        this.setState({curses5: ''});
        this.setState({id5: ''});
        this.setState({image5: ''});
        this.setState({text5: ''});
        this.setState({title5: ''});

        this.sleep(3000).then(r => {
            this.setState({done: false});
      	});
    }
    error() {
        this.sleep(3000).then(r => {
            this.close()
            this.reset()
      	});
    }
    sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    handleChange(changeObject) {
        this.setState(changeObject)
    }
    submitHandler(e) {
        e.preventDefault();
    }
    render() {
        return(
            <div className="flex flex-col items-center mb-10">
                <div className="font-baloo text-2xl lg:text-5xl text-zinc-200 font-medium text-center">
                    Zgłoś swoją piosenkę do radiowęzła
                </div>
                <div className="mt-10">
                    <form id='urlForm' className="flex flex-col" onSubmit={this.submitHandler}>
                        <div className="font-baloo text-xl text-zinc-200 font-medium">
                            Podaj link (Spotify lub YouTube):
                        </div>
                        <input className="mt-2 form-input px-4 py-3 rounded-full w-full lg:w-96" type="url" id="urlField" name="urlField" required value={this.state.url} onChange={(e) => this.handleChange({ url: e.target.value })}/>
                        <div className='flex flex-row mt-4 items-center'>
                            <button className=" h-12 w-24 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold" type="button" onClick={this.buttonClick}>Zgłoś</button>
                            {this.state.showDiv === true && (
                                <div className='spin ml-3'></div>
                            )}
                            {this.state.reset === true && (
                                <div className='ml-4 font-baloo text-xl text-zinc-200 font-normal'>Spróbuj ponownie</div>
                            )}
                            {this.state.done === true && (
                                <div className='ml-4 font-baloo text-xl text-zinc-200 font-normal'>Zgłoszenie zostało przyjęte</div>
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
                                            <button className='h-12 w-24 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.addToPlaylist}>Tak</button>
                                            <button className='ml-2 h-12 w-24 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.reset}>Nie</button>
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
                                    <div className='font-baloo text-2xl text-red-500 font-medium'>
                                        Wybrana piosenka zawiera niedozwolone treści i nie może zostać zaakceptowana.{this.error()}
                                    </div>
                                )    
                    }
                    {this.state.response === true &&
                        this.state.error === true && (
                            <div className='font-baloo text-2xl text-red-500 font-medium'>
                                {this.state.description}{this.error()}
                            </div>
                        )
                    }

                    {this.state.response === true &&
                        this.state.error === false &&
                            this.state.mode === 'multi' &&
                                this.state.length === 2 && 
                                    (
                                        <>
                                            <div className='mt-4 font-baloo text-xl text-zinc-200 font-medium'>
                                                Wybierz poprawną piosenkę
                                            </div>

                                            <div className='mt-10 flex flex-col items-center'>
                                                {this.state.curses === false &&
                                                <>
                                                    <div>
                                                        <img src={this.state.image} className="w-36 rounded-2xl" alt='' onLoad={this.close}></img>
                                                    </div>
                                                    <div className='mt-4 font-baloo text-3xl text-zinc-200 font-medium'>
                                                        {this.state.title}
                                                    </div>
                                                    <div className='font-baloo text-2xl text-zinc-200 font-medium'>
                                                        {this.state.author}
                                                    </div>
                                                    <button className='h-12 w-24 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.addToPlaylist}>Wybierz</button>
                                                    <button className='mt-2 h-12 w-32 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.showText}>Pokaż tekst</button>
                                                    {this.state.showText === true && (
                                                        <div className='font-baloo text-zinc-200 font-normal text-center mb-10 mt-4' dangerouslySetInnerHTML={{__html: this.state.text}}></div>
                                                    )
                                                    }
                                                </>  
                                                }

                                                {this.state.curses2 === false &&
                                                <>
                                                    <div className='mt-10'>
                                                        <img src={this.state.image2} className="w-36 rounded-2xl" alt='' onLoad={this.close}></img>
                                                    </div>
                                                    <div className='mt-4 font-baloo text-3xl text-zinc-200 font-medium'>
                                                        {this.state.title2}
                                                    </div>
                                                    <div className='font-baloo text-2xl text-zinc-200 font-medium'>
                                                        {this.state.author2}
                                                    </div>
                                                    <button className='h-12 w-24 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.addToPlaylist2}>Wybierz</button>
                                                    <button className='mt-2 h-12 w-32 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.showText2}>Pokaż tekst</button>
                                                    {this.state.showText2 === true && (
                                                        <div className='font-baloo text-zinc-200 font-normal text-center mb-10 mt-4' dangerouslySetInnerHTML={{__html: this.state.text2}}></div>
                                                    )
                                                    }
                                                </>  
                                                }
                                            </div>
                                        </>
                                    )
                    }

                    {this.state.response === true &&
                        this.state.error === false &&
                            this.state.mode === 'multi' &&
                                this.state.length === 3 && 
                                    (
                                        <>
                                            <div className='mt-4 font-baloo text-xl text-zinc-200 font-medium'>
                                                Wybierz poprawną piosenkę
                                            </div>

                                            <div className='mt-10 flex flex-col items-center'>
                                                {this.state.curses === false &&
                                                <>
                                                    <div>
                                                        <img src={this.state.image} className="w-36 rounded-2xl" alt='' onLoad={this.close}></img>
                                                    </div>
                                                    <div className='mt-4 font-baloo text-3xl text-zinc-200 font-medium'>
                                                        {this.state.title}
                                                    </div>
                                                    <div className='font-baloo text-2xl text-zinc-200 font-medium'>
                                                        {this.state.author}
                                                    </div>
                                                    <button className='h-12 w-24 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.addToPlaylist}>Wybierz</button>
                                                    <button className='mt-2 h-12 w-32 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.showText}>Pokaż tekst</button>
                                                    {this.state.showText === true && (
                                                        <div className='font-baloo text-zinc-200 font-normal text-center mb-10 mt-4' dangerouslySetInnerHTML={{__html: this.state.text}}></div>
                                                    )
                                                    }
                                                </>  
                                                }

                                                {this.state.curses2 === false &&
                                                <>
                                                    <div className='mt-10'>
                                                        <img src={this.state.image2} className="w-36 rounded-2xl" alt='' onLoad={this.close}></img>
                                                    </div>
                                                    <div className='mt-4 font-baloo text-3xl text-zinc-200 font-medium'>
                                                        {this.state.title2}
                                                    </div>
                                                    <div className='font-baloo text-2xl text-zinc-200 font-medium'>
                                                        {this.state.author2}
                                                    </div>
                                                    <button className='h-12 w-24 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.addToPlaylist2}>Wybierz</button>
                                                    <button className='mt-2 h-12 w-32 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.showText2}>Pokaż tekst</button>
                                                    {this.state.showText2 === true && (
                                                        <div className='font-baloo text-zinc-200 font-normal text-center mb-10 mt-4' dangerouslySetInnerHTML={{__html: this.state.text2}}></div>
                                                    )
                                                    }
                                                </>  
                                                }

                                                {this.state.curses3 === false &&
                                                <>
                                                    <div className='mt-10'>
                                                        <img src={this.state.image3} className="w-36 rounded-2xl" alt='' onLoad={this.close}></img>
                                                    </div>
                                                    <div className='mt-4 font-baloo text-3xl text-zinc-200 font-medium'>
                                                        {this.state.title3}
                                                    </div>
                                                    <div className='font-baloo text-2xl text-zinc-200 font-medium'>
                                                        {this.state.author3}
                                                    </div>
                                                    <button className='h-12 w-24 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.addToPlaylist3}>Wybierz</button>
                                                    <button className='mt-2 h-12 w-32 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.showText3}>Pokaż tekst</button>
                                                    {this.state.showText3 === true && (
                                                        <div className='font-baloo text-zinc-200 font-normal text-center mb-10 mt-4' dangerouslySetInnerHTML={{__html: this.state.text3}}></div>
                                                    )
                                                    }
                                                </>  
                                                }
                                            </div>
                                        </>
                                    )
                    }

                    {this.state.response === true &&
                        this.state.error === false &&
                            this.state.mode === 'multi' &&
                                this.state.length === 4 && 
                                    (
                                        <>
                                            <div className='mt-4 font-baloo text-xl text-zinc-200 font-medium'>
                                                Wybierz poprawną piosenkę
                                            </div>

                                            <div className='mt-10 flex flex-col items-center'>
                                                {this.state.curses === false &&
                                                <>
                                                    <div>
                                                        <img src={this.state.image} className="w-36 rounded-2xl" alt='' onLoad={this.close}></img>
                                                    </div>
                                                    <div className='mt-4 font-baloo text-3xl text-zinc-200 font-medium'>
                                                        {this.state.title}
                                                    </div>
                                                    <div className='font-baloo text-2xl text-zinc-200 font-medium'>
                                                        {this.state.author}
                                                    </div>
                                                    <button className='h-12 w-24 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.addToPlaylist}>Wybierz</button>
                                                    <button className='mt-2 h-12 w-32 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.showText}>Pokaż tekst</button>
                                                    {this.state.showText === true && (
                                                        <div className='font-baloo text-zinc-200 font-normal text-center mb-10 mt-4' dangerouslySetInnerHTML={{__html: this.state.text}}></div>
                                                    )
                                                    }
                                                </>  
                                                }

                                                {this.state.curses2 === false &&
                                                <>
                                                    <div className='mt-10'>
                                                        <img src={this.state.image2} className="w-36 rounded-2xl" alt='' onLoad={this.close}></img>
                                                    </div>
                                                    <div className='mt-4 font-baloo text-3xl text-zinc-200 font-medium'>
                                                        {this.state.title2}
                                                    </div>
                                                    <div className='font-baloo text-2xl text-zinc-200 font-medium'>
                                                        {this.state.author2}
                                                    </div>
                                                    <button className='h-12 w-24 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.addToPlaylist2}>Wybierz</button>
                                                    <button className='mt-2 h-12 w-32 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.showText2}>Pokaż tekst</button>
                                                    {this.state.showText2 === true && (
                                                        <div className='font-baloo text-zinc-200 font-normal text-center mb-10 mt-4' dangerouslySetInnerHTML={{__html: this.state.text2}}></div>
                                                    )
                                                    }
                                                </>  
                                                }

                                                {this.state.curses3 === false &&
                                                <>
                                                    <div className='mt-10'>
                                                        <img src={this.state.image3} className="w-36 rounded-2xl" alt='' onLoad={this.close}></img>
                                                    </div>
                                                    <div className='mt-4 font-baloo text-3xl text-zinc-200 font-medium'>
                                                        {this.state.title3}
                                                    </div>
                                                    <div className='font-baloo text-2xl text-zinc-200 font-medium'>
                                                        {this.state.author3}
                                                    </div>
                                                    <button className='h-12 w-24 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.addToPlaylist3}>Wybierz</button>
                                                    <button className='mt-2 h-12 w-32 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.showText3}>Pokaż tekst</button>
                                                    {this.state.showText3 === true && (
                                                        <div className='font-baloo text-zinc-200 font-normal text-center mb-10 mt-4' dangerouslySetInnerHTML={{__html: this.state.text3}}></div>
                                                    )
                                                    }
                                                </>  
                                                }

                                                {this.state.curses4 === false &&
                                                <>
                                                    <div className='mt-10'>
                                                        <img src={this.state.image4} className="w-36 rounded-2xl" alt='' onLoad={this.close}></img>
                                                    </div>
                                                    <div className='mt-4 font-baloo text-3xl text-zinc-200 font-medium'>
                                                        {this.state.title4}
                                                    </div>
                                                    <div className='font-baloo text-2xl text-zinc-200 font-medium'>
                                                        {this.state.author4}
                                                    </div>
                                                    <button className='h-12 w-24 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.addToPlaylist4}>Wybierz</button>
                                                    <button className='mt-2 h-12 w-32 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.showText4}>Pokaż tekst</button>
                                                    {this.state.showText4 === true && (
                                                        <div className='font-baloo text-zinc-200 font-normal text-center mb-10 mt-4' dangerouslySetInnerHTML={{__html: this.state.text4}}></div>
                                                    )
                                                    }
                                                </>  
                                                }
                                            </div>
                                        </>
                                    )
                    }

                    {this.state.response === true &&
                        this.state.error === false &&
                            this.state.mode === 'multi' &&
                                this.state.length === 5 && 
                                    (
                                        <>
                                            <div className='mt-4 font-baloo text-xl text-zinc-200 font-medium'>
                                                Wybierz poprawną piosenkę
                                            </div>

                                            <div className='mt-10 flex flex-col items-center'>
                                                {this.state.curses === false &&
                                                <>
                                                    <div>
                                                        <img src={this.state.image} className="w-36 rounded-2xl" alt='' onLoad={this.close}></img>
                                                    </div>
                                                    <div className='mt-4 font-baloo text-3xl text-zinc-200 font-medium'>
                                                        {this.state.title}
                                                    </div>
                                                    <div className='font-baloo text-2xl text-zinc-200 font-medium'>
                                                        {this.state.author}
                                                    </div>
                                                    <button className='h-12 w-24 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.addToPlaylist}>Wybierz</button>
                                                    <button className='mt-2 h-12 w-32 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.showText}>Pokaż tekst</button>
                                                    {this.state.showText === true && (
                                                        <div className='font-baloo text-zinc-200 font-normal text-center mb-10 mt-4' dangerouslySetInnerHTML={{__html: this.state.text}}></div>
                                                    )
                                                    }
                                                    
                                                </>  
                                                }

                                                {this.state.curses2 === false &&
                                                <>
                                                    <div> 
                                                        <img src={this.state.image2} className="w-36 rounded-2xl" alt='' onLoad={this.close}></img>
                                                    </div>
                                                    <div className='mt-4 font-baloo text-3xl text-zinc-200 font-medium'>
                                                        {this.state.title2}
                                                    </div>
                                                    <div className='font-baloo text-2xl text-zinc-200 font-medium'>
                                                        {this.state.author2}
                                                    </div>
                                                    <button className='h-12 w-24 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.addToPlaylist2}>Wybierz</button>
                                                    <button className='mt-2 h-12 w-32 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.showText2}>Pokaż tekst</button>
                                                    {this.state.showText2 === true && (
                                                        <div className='font-baloo text-zinc-200 font-normal text-center mb-10 mt-4' dangerouslySetInnerHTML={{__html: this.state.text2}}></div>
                                                    )
                                                    }
                                                </>  
                                                }

                                                {this.state.curses3 === false &&
                                                <>
                                                    <div>
                                                        <img src={this.state.image3} className="w-36 rounded-2xl" alt='' onLoad={this.close}></img>
                                                    </div>
                                                    <div className='mt-4 font-baloo text-3xl text-zinc-200 font-medium'>
                                                        {this.state.title3}
                                                    </div>
                                                    <div className='font-baloo text-2xl text-zinc-200 font-medium'>
                                                        {this.state.author3}
                                                    </div>
                                                    <button className='h-12 w-24 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.addToPlaylist3}>Wybierz</button>
                                                    <button className='mt-2 h-12 w-32 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.showText3}>Pokaż tekst</button>
                                                    {this.state.showText3 === true && (
                                                        <div className='font-baloo text-zinc-200 font-normal text-center mb-10 mt-4' dangerouslySetInnerHTML={{__html: this.state.text3}}></div>
                                                    )
                                                    }
                                                </>  
                                                }

                                                {this.state.curses4 === false &&
                                                <>
                                                    <div>
                                                        <img src={this.state.image4} className="w-36 rounded-2xl" alt='' onLoad={this.close}></img>
                                                    </div>
                                                    <div className='mt-4 font-baloo text-3xl text-zinc-200 font-medium'>
                                                        {this.state.title4}
                                                    </div>
                                                    <div className='font-baloo text-2xl text-zinc-200 font-medium'>
                                                        {this.state.author4}
                                                    </div>
                                                    <button className='h-12 w-24 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.addToPlaylist4}>Wybierz</button>
                                                    <button className='mt-2 h-12 w-32 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.showText4}>Pokaż tekst</button>
                                                    {this.state.showText4 === true && (
                                                        <div className='font-baloo text-zinc-200 font-normal text-center mb-10 mt-4' dangerouslySetInnerHTML={{__html: this.state.text4}}></div>
                                                    )
                                                    }
                                                </>  
                                                }

                                                {this.state.curses5 === false &&
                                                <>
                                                    <div>
                                                        <img src={this.state.image5} className="w-36 rounded-2xl" alt='' onLoad={this.close}></img>
                                                    </div>
                                                    <div className='mt-4 font-baloo text-3xl text-zinc-200 font-medium'>
                                                        {this.state.title5}
                                                    </div>
                                                    <div className='font-baloo text-2xl text-zinc-200 font-medium'>
                                                        {this.state.author5}
                                                    </div>
                                                    <button className='h-12 w-24 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.addToPlaylist5}>Wybierz</button>
                                                    <button className='mt-2 h-12 w-32 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' onClick={this.showText5}>Pokaż tekst</button>
                                                    {this.state.showText5 === true && (
                                                        <div className='font-baloo text-zinc-200 font-normal text-center mb-10 mt-4' dangerouslySetInnerHTML={{__html: this.state.text5}}></div>
                                                    )
                                                    }
                                                </>  
                                                }
                                            </div>
                                        </>
                                    )
                    }





            </div>
        );
    }
} 

export default AddRequest;