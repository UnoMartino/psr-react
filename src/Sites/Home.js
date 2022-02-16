import image from "../album-image-placeholder.jpg";

const Home = () => {
    return(
        <div className="flex flex-col lg:flex-row items-center lg:items-start">
            <div className="flex-1">
                <div className="flex flex-col items-center">
                    <div className="font-baloo text-5xl text-zinc-200 font-medium">
                        Teraz gramy
                    </div>
                    <div className="mt-4">
                        <img className="w-36 rounded-2xl" src={image} ></img>
                    </div>
                    <div className="mt-4 font-baloo text-4xl text-zinc-200 font-normal text-center">
                        etc. (na disco) 
                    </div>
                    <div className="mt-2 font-baloo text-2xl text-zinc-200 font-normal text-center">
                        sanah 
                    </div>
                </div>
            </div>
            
            <div className="flex-auto">
                <div className="mt-10 lg:mt-0 font-baloo text-4xl text-zinc-200 font-normal">
                Tekst
                </div>
                <div className="mt-4 mb-10 font-baloo text-zinc-200 font-normal">
                Skąd te rumieńce mam<br />
One będą rozkwitały całe dnie<br />
Jeśli mi słówko dasz<br />
Że zostanę w twej pamięci<br />
<br />
Oczy me jak diamenty<br />
One do pana niepytane mienią się<br />
Wpadnie pan jak w odmęty w nie<br />
<br />
Twe dłonie jak konwalie<br />
Na mej skroni tańcują już<br />
Chwytasz moja talię<br />
A na buzi szminka i róż<br />
Zanim popłynie łza<br />
Czule włosy me przeplataj<br />
No i et cetera, et cetera, et cetera<br />
<br />
Niechże już byle kto<br />
Mojej rączki nie całuje byle jak<br />
Przecież wiadome to<br />
Że mam słabość do bruneta<br />
<br />
Oczy me jak diamenty<br />
One do pana niepytane mienią się<br />
Wpadnie pan jak w odmęty w nie<br />
<br />
Twe dłonie jak konwalie<br />
Na mej skroni tańcują już<br />
Chwytasz moja talię<br />
A na buzi szminka i róż<br />
Zanim popłynie łza<br />
Czule włosy me przeplataj<br />
No i et cetera, et cetera, et cetera<br />
<br />
A tyś mówił mi dziś<br />
Że ja jestem twa<br />
A tyś mówił mi dziś<br />
To ty miła ma<br />
<br />
Twe dłonie jak konwalie<br />
Na mej skroni tańcują już<br />
Chwytasz moja talię<br />
A na buzi szminka i róż<br />
Zanim popłynie łza<br />
Czule włosy me przeplataj<br />
No i et cetera, et cetera, et cetera
                </div>
            
            </div>
        </div>
        
        
    );
};

export default Home;