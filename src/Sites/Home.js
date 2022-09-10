import React from 'react'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: false,
            response: false,
            url: '',
            author: '',
            title: '',
            text: '',
            image: '',
            showDiv: false,
            updating: false,
            homepageMessage: '',
        };
        this.buttonClick = this.buttonClick.bind(this);
        this.fetchNowPlaying = this.fetchNowPlaying.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.getHomepageMessage = this.getHomepageMessage.bind(this);
    }
    open() {
        this.setState({showDiv: true});
    }
    close() {
        this.setState({showDiv: false});
    }
    buttonClick() {
        this.open();
        this.getHomepageMessage();
        this.fetchNowPlaying();
    }
    getHomepageMessage() {
        fetch(
            "/api/get-message", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json",
                },
            }
        )
        .then(response => response.json())
        .then(response => {
            console.log(response);
            this.setState({homepageMessage: response.Message});
        })

    }
    fetchNowPlaying() {
        fetch(
            "/api/config", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json",
                },
                "body": JSON.stringify({
                    Mode: "SpotifyOrRadioDJ"
                })
            }
        )
        .then(response => response.json())
        .then(response => {
            console.log(response);
            if (response.Mode === "spotify") {
                fetch(
                    "/api/now-playing", {
                        "method": "GET",
                        "headers": {
                            "content-type": "application/json",
                            "accept": "application/json",
                        },
                    }
                )
                .then(response => response.json())
                .then(response => {
                    console.log(response);
                    this.setState({response: true});
                    this.setState({author: response.Artist});
                    this.setState({image: response.Image});
                    this.setState({text: response.Text});
                    this.setState({title: response.Title});
                    this.setState({playing: response.IsPlaying});
                    this.setState({url: response.Link});
                })
                .catch(err => {
                    console.log(err);
                });
                this.sleep(3000).then(r => {
                    this.close()
                  });
            }
            else if (response.Mode === "radiodj") {
                fetch(
                    "/api/get-now-radiodj", {
                        "method": "GET",
                        "headers": {
                            "content-type": "application/json",
                            "accept": "application/json",
                        },
                    }
                )
                .then(response => response.json())
                .then(response => {
                    console.log(response);
                    this.setState({response: true});
                    this.setState({author: response.Artist});
                    this.setState({image: response.Image});
                    this.setState({text: response.Text});
                    this.setState({title: response.Title});
                    this.setState({playing: response.IsPlaying});
                })
                .catch(err => {
                    console.log(err);
                });
                this.sleep(3000).then(r => {
                    this.close()
                  });
            }
        })
        .catch(err => {
            console.log(err);
        });
        this.sleep(3000).then(r => {
            this.close()
      	});





        
        
    }
    sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    componentDidMount() {
        this.buttonClick()
    } 
    render() {
        return(
            
            <div className="flex flex-col lg:flex-row items-center lg:items-start">
                {this.state.response === false && (
                    <div className="flex-1">
                        <div className="flex flex-col items-center">
                            <div className="font-baloo text-5xl text-zinc-200 font-medium">
                                Teraz gramy
                            </div>
                            <div className="mt-2 flex flex-row items-center" >
                            <button className='h-12 w-24 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' type='button' onClick={this.buttonClick}>Odśwież</button>
                            {this.state.showDiv === true && (
                                    <div className='spin ml-3'></div>
                            )}
                            </div>
                            {this.state.showDiv === false && (
                                    <div className='mt-2 font-baloo text-2xl text-zinc-200 font-normal text-center'>Błąd komunikacji z serwerem</div>
                            )}
                            <div className="mt-2 font-baloo text-2xl text-zinc-200 font-normal text-center" dangerouslySetInnerHTML={{__html: this.state.homepageMessage}}></div>

                        </div>
                    </div>
                )}

                {this.state.response === true && (
                    <>
                        <div className="flex-1">
                            <div className="flex flex-col items-center">
                                <div className="font-baloo text-5xl text-zinc-200 font-medium">
                                    Teraz gramy
                                </div>
                                <div className="mt-4">
                                    <img className="w-36 rounded-2xl" src={this.state.image} onLoad={this.close} alt=''></img>
                                </div>
                                <div className="mt-4 font-baloo text-4xl text-zinc-200 font-normal text-center">
                                    {this.state.title}
                                </div>
                                <div className="mt-2 font-baloo text-2xl text-zinc-200 font-normal text-center">
                                    {this.state.author}
                                </div>
                                <div className="mt-2 flex flex-row items-center" >
                                    <button className='h-12 w-24 bg-zinc-600 rounded-3xl hover:bg-sky-500 hover:text-zinc-600 border-0 transition-all duration-300 text-sky-500 font-baloo text-xl font-semibold' type='button' onClick={this.buttonClick}>Odśwież</button>
                                {this.state.showDiv === true && (
                                    <div className='spin ml-3'></div>
                                )}
                                <br/>
                                </div>
                                <div className="mt-2 font-baloo text-2xl text-zinc-200 font-normal text-center max-w-xl" dangerouslySetInnerHTML={{__html: this.state.homepageMessage}}></div>
                            </div>
                            
                        </div>
                        <div className="flex-auto">
                            <div className="mt-10 lg:mt-0 font-baloo text-4xl text-zinc-200 font-normal" >
                                Tekst
                            </div>
                            <div className="mt-4 mb-10 font-baloo text-zinc-200 font-normal max-w-lg" dangerouslySetInnerHTML={{__html: this.state.text}}>

                            </div>
                        </div>
                    </>

                )}
            </div>
        )
    }
}
export default Home;