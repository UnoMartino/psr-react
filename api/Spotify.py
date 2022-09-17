from email import header
from secrets import choice
from httpx import head
import requests, json
import tekore as tk
from bs4 import BeautifulSoup
from SpotifyIntegration import AddToLogPlaylist
import variables
import mysql.connector
import helper


def tekstowoSearch(author, title):
    searched = author + " - " + title

    artist = author.replace(" ", "+")
    song_name = title.replace(" ", "+")
    tekstowo_url = "https://www.tekstowo.pl/szukaj,wykonawca," + artist + ",tytul," + song_name + ".html"

    try:
        r = requests.get(tekstowo_url)

        soup = BeautifulSoup(r.text, 'html.parser')

        tekst = soup.findAll('div', { 'class': "card-body p-0"})[0]

        quantity = soup.findAll('div', { 'class': "card-body p-0"})[0]
        quantity = quantity.findAll('div', { 'class': "box-przeboje"})

        quantity = len(quantity)

        tekstarray = []
        tekstarrayLink = []

        if quantity > 1:
            j = 0
            while j < quantity:
                tekstarray.append(tekst.findAll('div', { 'class': "box-przeboje"})[j].findAll('a', { 'class': "title"})[0].string[:-1])
                tekstarrayLink.append(tekst.findAll('div', { 'class': "box-przeboje"})[j].findAll('a', { 'class': "title"})[0]['href'])
                j += 1
        else:
            tekstarray.append(tekst.findAll('div', { 'class': "box-przeboje"})[0].findAll('a', { 'class': "title"})[0].string[:-1])
            tekstarrayLink.append(tekst.findAll('div', { 'class': "box-przeboje"})[0].findAll('a', { 'class': "title"})[0]['href'])

        authorTitleQuery = author + " - " + title

        j = -1
        for i in tekstarray:
            j += 1
            if i.lower() == authorTitleQuery.lower():
                tekst = i
                tekstLink = tekstarrayLink[j]
                break
            tekst = tekstarray[0]
            tekstLink = tekstarrayLink[0]

        title_tekstowo = tekst

        tekstowo_url = "https://www.tekstowo.pl" + tekstLink

        r = requests.get(tekstowo_url)

    except:
        title_tekstowo = ""

    try:
        soup = BeautifulSoup(r.text, 'html.parser')
        tekst = soup.findAll('div', { 'class': "inner-text"})[0]
        tekst = str(tekst)
        tekst = tekst.replace('<div class="inner-text">', "")
        tekst = tekst.replace('</div>', "")

        for i in variables.polish_curse_words:
            if i in tekst:
                print(i)
                check1 = True
                break
            else:
                check1 = False

        for i in variables.english_curse_words:
            if i in tekst:
                print(i)
                check2 = True
                break
            else:
                check2 = False

        if check1 or check2:
            curses = True
        elif not check1 and not check2:
            curses = False

        error = False

    except:
        tekst = ""
        curses = False
        error = True

    return [tekst, curses, error, searched, title_tekstowo, author, title]

def spotifyNameCheck(trackURL):
    app_token = tk.request_client_token(variables.client_id, variables.client_secret)

    spotify = tk.Spotify(app_token)

    song_name = spotify.track(tk.from_url(trackURL)[1]).name
    artist = spotify.track(tk.from_url(trackURL)[1]).artists[0].name

    return [artist, song_name]

def youtubeNameCheck(song_url):
    r = requests.get(song_url)
    soup = BeautifulSoup(r.text, 'html.parser')
    title = soup.findAll('title')[0]
    title = str(title)
    title = title.replace("<title>", "")
    title = title.replace(" - YouTube</title>", "")

    def remove_paren(title):
            curved = "("
            bracket = "["
            opening = None
            closing = None

            if curved not in title and bracket not in title:
                return title
            elif curved in title:
                opening = "("
                closing = ")"
            elif bracket in title:
                opening = "["
                closing = "]"

            opening_ind = title.find(opening)
            closing_ind = title.find(closing)
            new_title = title[:opening_ind] + title[closing_ind + 1:]
            return remove_paren(new_title.strip())

    title = remove_paren(title)

    if "-" in title:
        dash_location = title.find("-")
        song_author = title[:dash_location - 1]
        song_title = title[dash_location + 2:]
    elif "—" in title:
        dash_location = title.find("—")
        song_author = title[:dash_location - 1]
        song_title = title[dash_location + 2:]

    return [song_author, song_title]

def nameToSpotifyConv(song_author, song_title):
    app_token = tk.request_client_token(variables.client_id, variables.client_secret)
    spotify = tk.Spotify(app_token)
    query = song_author + " " + song_title
    tracks = spotify.search(query, types=('track',), market='PL', include_external='audio', limit=5)
    tracks_found = len(tracks[0].items)
    product = []
    if tracks_found >= 1:
        for i in tracks[0].items:
            product.append({"url":"https://open.spotify.com/track/" + i.id, "name":i.name, "artist":i.artists[0].name, "image":json.loads(requests.get("https://api.spotify.com/v1/tracks/" + i.id + "?market=PL", headers={"Accept":"application/json", "Content-Type":"application/json", "Authorization":"Bearer " + str(app_token)}).text)['album']['images'][1]['url'], 'id':i.id})
    else:
        print("ERROR: nameToSpotifyConv() no tracks found")
        return [], {'error':True, 'description':f'Błąd konwersji z YouTube na Spotify - brak utworu {song_author} - {song_title} na Spotify.'}

    return [product, {'error':False}]




def SpotifyAPI(url):

    if "youtu" in url:
        spoti = False
        search_result = youtubeNameCheck(url) # [artist, title]
        url = nameToSpotifyConv(search_result[0], search_result[1]) 
        spotifyFiveTracks = []

        if len(url[0]) > 1:  # if found more than one
            j = 1
            for i in url[0]:
                searchResult = tekstowoSearch(i['artist'], i['name'])
                spotifyFiveTracks.append({'text':searchResult[0], 'curses':searchResult[1], 'author':searchResult[5], 'found':searchResult[4], 'url':i['url'], 'image':i['image'], 'title':searchResult[6], 'id':i['id']})
                j += 1
            return spotifyFiveTracks, {'error':False}
        else:
            choice = 0
        if url[1]['error']:
            return [], url[1]
        else:
            search_result = spotifyNameCheck(url[0][choice]['url'])

    elif "spotify" in url:
        search_result = spotifyNameCheck(url)
        spoti = True

    searchResult = tekstowoSearch(search_result[0], search_result[1])


    # Add not accepted positions to another playlist
    if ("spotify" in url) and (searchResult[1] or searchResult[2]):

        AddToLogPlaylist(tk.from_url(url)[1])


    for i in variables.czech_symbols:
        if i in searchResult[0]:
            czechCheck = True
            break
        else:
            czechCheck = False

    app_token = tk.request_client_token(variables.client_id, variables.client_secret)
    spotify = tk.Spotify(app_token)
    id = tk.from_url(url)[1]
    artistId = json.loads(requests.get("https://api.spotify.com/v1/tracks/" + id + "?market=PL", headers={"Accept":"application/json", "Content-Type":"application/json", "Authorization":"Bearer " + str(app_token)}).text)['artists'][0]['id']


    queuePlaylist = spotify.playlist(playlist_id=variables.queuePlaylistId)
    
    for i in queuePlaylist.tracks.items:
        if id in i.track.id:
            return [], {'error':True, 'description':f'{searchResult[3]} jest już w kolejce.'}
    

    app_token = tk.request_client_token(variables.client_id, variables.client_secret) 
    if spoti:
        # whitelist check
        app_token = tk.request_client_token(variables.client_id, variables.client_secret)
        spotify = tk.Spotify(app_token)
        id = tk.from_url(url)[1]
        artistId = json.loads(requests.get("https://api.spotify.com/v1/tracks/" + id + "?market=PL", headers={"Accept":"application/json", "Content-Type":"application/json", "Authorization":"Bearer " + str(app_token)}).text)['artists'][0]['id']


        whitelistSongsPlaylist = spotify.playlist(playlist_id=variables.whitelistSongsPlaylistId)
        whitelistArtistsPlaylist = spotify.playlist(playlist_id=variables.whitelistArtistsPlaylistId)
        
        for i in whitelistSongsPlaylist.tracks.items:
            if id in i.track.id:
                image = json.loads(requests.get("https://api.spotify.com/v1/tracks/" + id + "?market=PL", headers={"Accept":"application/json", "Content-Type":"application/json", "Authorization":"Bearer " + str(app_token)}).text)['album']['images'][1]['url']
                finalResult = [{'text':searchResult[0], 'curses':False, 'author':searchResult[5], 'found':searchResult[4], 'url':url, 'image':image, 'title':searchResult[6], 'id':id}]
                return finalResult, {'error':False}
        for i in whitelistArtistsPlaylist.tracks.items:
            if artistId in i.track.artists[0].id:
                image = json.loads(requests.get("https://api.spotify.com/v1/tracks/" + id + "?market=PL", headers={"Accept":"application/json", "Content-Type":"application/json", "Authorization":"Bearer " + str(app_token)}).text)['album']['images'][1]['url']
                finalResult = [{'text':searchResult[0], 'curses':False, 'author':searchResult[5], 'found':searchResult[4], 'url':url, 'image':image, 'title':searchResult[6], 'id':id}]
                return finalResult, {'error':False}

    if not spoti:
        # whitelist check

        id = tk.from_url(url[0][choice]['url'])[1]
        artistId = json.loads(requests.get("https://api.spotify.com/v1/tracks/" + id + "?market=PL", headers={"Accept":"application/json", "Content-Type":"application/json", "Authorization":"Bearer " + str(app_token)}).text)['artists'][0]['id']

        for i in whitelistSongsPlaylist.tracks.items:
            if id in i.track.id:
                image = json.loads(requests.get("https://api.spotify.com/v1/tracks/" + id + "?market=PL", headers={"Accept":"application/json", "Content-Type":"application/json", "Authorization":"Bearer " + str(app_token)}).text)['album']['images'][1]['url']
                finalResult = [{'text':searchResult[0], 'curses':False, 'author':searchResult[5], 'found':searchResult[4], 'url':url[0][choice]['url'], 'image':image, 'title':searchResult[6], 'id':id}]
                return finalResult, {'error':False}
        for i in whitelistArtistsPlaylist.tracks.items:
            if artistId in i.track.artists[0].id:
                image = json.loads(requests.get("https://api.spotify.com/v1/tracks/" + id + "?market=PL", headers={"Accept":"application/json", "Content-Type":"application/json", "Authorization":"Bearer " + str(app_token)}).text)['album']['images'][1]['url']
                finalResult = [{'text':searchResult[0], 'curses':False, 'author':searchResult[5], 'found':searchResult[4], 'url':url[0][choice]['url'], 'image':image, 'title':searchResult[6], 'id':id}]
                return finalResult, {'error':False}



    if searchResult[2]:
        return [], {'error':True, 'description':f'Nie znaleziono tekstu na tekstowo.pl dla {searchResult[3]}'}
    elif czechCheck:
        return [], {'error':True, 'description':f'Znaleziono nieprawidłowy tekst dla {searchResult[3]}'}
    elif (not searchResult[2]) and (not czechCheck):
        tekst = searchResult[0]
        curses = searchResult[1]
        if spoti:
            app_token = tk.request_client_token(variables.client_id, variables.client_secret)
            spotify = tk.Spotify(app_token)
            id = spotify.track(tk.from_url(url)[1]).id
            artistId = json.loads(requests.get("https://api.spotify.com/v1/tracks/" + id + "?market=PL", headers={"Accept":"application/json", "Content-Type":"application/json", "Authorization":"Bearer " + str(app_token)}).text)['artists'][0]['id']

            blacklistSongsPlaylist = spotify.playlist(playlist_id=variables.blacklistSongsPlaylistId)
            blacklistArtistsPlaylist = spotify.playlist(playlist_id=variables.blacklistArtistsPlaylistId)
            
            for i in blacklistSongsPlaylist.tracks.items:
                if id in i.track.id:
                    return [], {'error':True, 'description':f'Znaleziono zablokowaną piosenkę na Spotify dla {searchResult[3]}'}
            for i in blacklistArtistsPlaylist.tracks.items:
                if artistId in i.track.artists[0].id:
                    return [], {'error':True, 'description':f'Znaleziono zablokowanego artystę na Spotify dla {searchResult[3]}'}

            image = json.loads(requests.get("https://api.spotify.com/v1/tracks/" + id + "?market=PL", headers={"Accept":"application/json", "Content-Type":"application/json", "Authorization":"Bearer " + str(app_token)}).text)['album']['images'][1]['url']
            finalResult = [{'text':tekst, 'curses':curses, 'author':searchResult[5], 'found':searchResult[4], 'url':url, 'image':image, 'title':searchResult[6], 'id':id}]
            return finalResult, {'error':False}

        else:
            app_token = tk.request_client_token(variables.client_id, variables.client_secret)
            spotify = tk.Spotify(app_token)
            id = spotify.track(tk.from_url(url[0][choice]['url'])[1]).id
            artistId = json.loads(requests.get("https://api.spotify.com/v1/tracks/" + id + "?market=PL", headers={"Accept":"application/json", "Content-Type":"application/json", "Authorization":"Bearer " + str(app_token)}).text)['artists'][0]['id']

            # blacklists check

            blacklistSongsPlaylist = spotify.playlist(playlist_id=variables.blacklistSongsPlaylistId)
            blacklistArtistsPlaylist = spotify.playlist(playlist_id=variables.blacklistArtistsPlaylistId)
            
            for i in blacklistSongsPlaylist.tracks.items:
                if id in i.track.id:
                    return [], {'error':True, 'description':f'Znaleziono zablokowaną piosenkę na Spotify dla {searchResult[3]}'}
            for i in blacklistArtistsPlaylist.tracks.items:
                if artistId in i.track.artists[0].id:
                    return [], {'error':True, 'description':f'Znaleziono zablokowanego artystę na Spotify dla {searchResult[3]}'}

            image = json.loads(requests.get("https://api.spotify.com/v1/tracks/" + id + "?market=PL", headers={"Accept":"application/json", "Content-Type":"application/json", "Authorization":"Bearer " + str(app_token)}).text)['album']['images'][1]['url']
            finalResult = [{'text':tekst, 'curses':curses, 'searched':searchResult[3], 'author':searchResult[5], 'url':url[0][choice]['url'], 'image':image, 'title':searchResult[6], 'id':id}]
            return finalResult, {'error':False}
    else:
        return [], {'error':True, 'description':'Wystąpił nieznany błąd. Skontaktuj się z administratorem.'}


def getNowPlaying():
    file = 'tekore.cfg'   
    conf = tk.config_from_file(file, return_refresh=True)   
    token = tk.refresh_user_token(*conf[:2], conf[3]) 
    print(token)
    spotifyAnswer = requests.get("https://api.spotify.com/v1/me/player?market=PL", headers={"Accept":"application/json", "Content-Type":"application/json", "Authorization":"Bearer " + str(token)}).text
    print(spotifyAnswer)
    spotifyAnswerJsonFormatted = json.loads(spotifyAnswer)

    isPlaying = True

    if not isPlaying:
        return ["","","","", isPlaying, ""]



    nowPlayingTitle = spotifyAnswerJsonFormatted['item']['name']
    nowPlayingArtist = spotifyAnswerJsonFormatted['item']['artists'][0]['name']
    nowPlayingLink = spotifyAnswerJsonFormatted['item']['external_urls']['spotify']
    nowPlayingId = spotifyAnswerJsonFormatted['item']['id']
    nowPlayingImage = json.loads(requests.get("https://api.spotify.com/v1/tracks/" + nowPlayingId + "?market=PL", headers={"Accept":"application/json", "Content-Type":"application/json", "Authorization":"Bearer " + str(token)}).text)['album']['images'][1]['url']


    database = mysql.connector.connect(
            host=variables.databaseHost,
            user=variables.databaseUser,
            password=variables.databasePassword,
            database=variables.databaseDatabase
        )

    id = nowPlayingId

    lyricsSearch = database.cursor()
    lyricsSearch.execute("SELECT lyrics FROM `lyrics-cache` WHERE spotifyId = %s", (id,))
    lyricsSearchResult = lyricsSearch.fetchone()
    # for x in lyricsSearchResult:
    #     if id in x:
    #         return finalResult, {'error':False}
    
    if lyricsSearchResult != None:
        nowPlayingLyrics = lyricsSearchResult[0]
        print("DEBUG MSG (LYRICS FROM CACHE): ", nowPlayingTitle, nowPlayingArtist, nowPlayingLink, nowPlayingLyrics)
        return [nowPlayingTitle, nowPlayingArtist, nowPlayingLink, nowPlayingLyrics, isPlaying, nowPlayingImage]
        

    tekstowoQueryResult = tekstowoSearch(nowPlayingArtist, nowPlayingTitle)

    if tekstowoQueryResult[2]:
        return [nowPlayingTitle, nowPlayingArtist, nowPlayingLink, "Błąd: nie znaleziono tekstu", isPlaying, nowPlayingImage]
    else:
        nowPlayingLyrics = tekstowoQueryResult[0]
        
        config = helper.read_config()
        cacheMode = config['Cache']['Enabled']
        print("CACHE MODE: ", cacheMode)

        if cacheMode == "true":
            print("SQL ADD TO CACHE: ", id, "\n", nowPlayingLyrics)
            lyricsAdd = database.cursor()
            lyricsAdd.execute("INSERT INTO `lyrics-cache` (spotifyId, lyrics) VALUES (%s, %s)", (id, nowPlayingLyrics))
            database.commit()
            return [nowPlayingTitle, nowPlayingArtist, nowPlayingLink, nowPlayingLyrics, isPlaying, nowPlayingImage]
        elif cacheMode == "false":
            print("DEBUG MSG (DIDN'T ADD TO CACHE): ", "\n", nowPlayingTitle, nowPlayingArtist, nowPlayingLink, nowPlayingLyrics)
            return [nowPlayingTitle, nowPlayingArtist, nowPlayingLink, nowPlayingLyrics, isPlaying, nowPlayingImage]
        

    

    


