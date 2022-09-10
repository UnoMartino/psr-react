from crypt import methods
import sys
from flask import *
from werkzeug.exceptions import BadRequestKeyError
from Spotify import *
import secrets
from SpotifyIntegration import *
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired
import mysql.connector
import tekore as tk
import variables
import configparser
import helper


app = Flask(__name__)

app.secret_key = secrets.token_urlsafe(32)  # generate session token


@app.route('/api/config', methods=['POST'])
def ApiConfig():
    mode = request.get_json()['Mode']
    if mode == "SpotifyOrRadioDJ":
        config = helper.read_config()
        getNowRunningMode = config['NowPlaying']['Mode']
        data = {
            "Mode":getNowRunningMode
        }
        return jsonify(data)

    return None


@app.route('/api/now-radiodj')
def NowRadioDJ():
    requestData = request.args
    data = {
                "Title": requestData.getlist("title")[0],
                "Artist": requestData.getlist("artist")[0],
                "Image": requestData.getlist("image")[0],
                "Text": tekstowoSearch(requestData.getlist("artist")[0], requestData.getlist("title")[0])[0],
                "IsPlaying": True,
    }
    file = open("radiodj-now-playing.json", "w")
    file.write(json.dumps(data))
    file.close()

    return "Done"

@app.route('/api/get-now-radiodj', methods=['GET'])
def GetNowRadiodj():
    file = open("radiodj-now-playing.json", "r")
    fileContents = json.load(file)
    file.close()
    return jsonify(fileContents)


@app.route('/api/now-playing', methods=['GET'])
def NowPlaying():
    getNowPlayingVar = getNowPlaying()
    data = {
                "Title": getNowPlayingVar[0],
                "Artist": getNowPlayingVar[1],
                "Link": getNowPlayingVar[2],
                "Text": getNowPlayingVar[3],
                "IsPlaying": getNowPlayingVar[4],
                "Image": getNowPlayingVar[5]
            }
    return jsonify(data)


@app.route('/api/url', methods=['GET', 'POST'])
def Spotify():
    urlFromJson = request.get_json()['url']
    spotifyResult = SpotifyAPI(urlFromJson)

    # Check if Spotify.py returned error and if yes show it to the user
    if spotifyResult[1]['error']:
        data = {
            "Mode": 'error',
            "Error": spotifyResult[1]['error'],
            "Description": spotifyResult[1]['description']
        }
        return jsonify(data, [])

    if len(spotifyResult[0]) == 1:
        # session['singleSongMode'] = True
        session['title'] = spotifyResult[0][0]['title']
        session['author'] = spotifyResult[0][0]['author']
        session['id'] = spotifyResult[0][0]['id']
        session['curses'] = spotifyResult[0][0]['curses']
        session['text'] = spotifyResult[0][0]['text']
        session['url'] = spotifyResult[0][0]['url']
        session['image'] = spotifyResult[0][0]['image']

        if 'description' in spotifyResult[1]:
            desc = spotifyResult[1]['description']
        else:
            desc = ''

        dataHeader = {
            "Mode": 'single',
            "Error": spotifyResult[1]['error'],
            "Description": desc,
        }

        dataBody = {                    
            "Title": session['title'],
            "Author": session['author'],
            "Id": session['id'],
            "Curses": session['curses'],
            "Text": session['text'],
            "Url": session['url'],
            "Image": session['image']
        }

        return jsonify(dataHeader, dataBody)

    elif len(spotifyResult[0]) > 1:
        jsonList = []
        
        for i in spotifyResult[0]:
            jsonList.append({
            "Title": i['title'],
            "Author": i['author'],
            "Id": i['id'],
            "Curses": i['curses'],
            "Text": i['text'],
            "Url": i['url'],
            "Image": i['image']
            })

        if 'description' in spotifyResult[1]:
            desc = spotifyResult[1]['description']
        else:
            desc = ''


        dataHeader = {
            "Mode": 'multi',
            "Error": spotifyResult[1]['error'],
            "Description": desc,
            "Length": len(spotifyResult[0]),
        }

        if len(spotifyResult[0]) == 2:
            return jsonify(dataHeader, jsonList[0], jsonList[1])
        elif len(spotifyResult[0]) == 3:
            return jsonify(dataHeader, jsonList[0], jsonList[1], jsonList[2])
        elif len(spotifyResult[0]) == 4:
            return jsonify(dataHeader, jsonList[0], jsonList[1], jsonList[2], jsonList[3])
        elif len(spotifyResult[0]) == 5:
            return jsonify(dataHeader, jsonList[0], jsonList[1], jsonList[2], jsonList[3], jsonList[4])


@app.route('/api/add-song', methods=['GET', 'POST'])
def AddSong():
    requestJson = request.get_json()
    if 'id' in requestJson:
        idFromJson = requestJson['id']
    elif 'url' in requestJson:
        urlFromJson = requestJson['url']
        idFromJson = tk.from_url(urlFromJson)[1]
    AddToPlaylist(idFromJson)
    return None





##############################
# Admin portal segment below #
############################## 

@app.route('/api/admin', methods=['GET', 'POST'])
def Admin():

        # Declare login form
        class LoginForm(FlaskForm):
            user_name  = StringField('Użytkownik', validators=[DataRequired()])
            password = PasswordField('Hasło', validators=[DataRequired()])
            submit = SubmitField('Zaloguj się')

        # Check if user is logged in, if yes, let in
        try: 
            if session['loggedIn'] == True:

                database = mysql.connector.connect(
                host=variables.databaseHost,
                user=variables.databaseUser,
                password=variables.databasePassword,
                database=variables.databaseDatabase
                )
                sqlQueryBS = 'SELECT * FROM `blacklist-songs`'
                blacklistSongs = database.cursor()
                blacklistSongs.execute(sqlQueryBS)
                blacklistSongsList = blacklistSongs.fetchall()

                session['blacklistSongsList'] = blacklistSongsList

                database = mysql.connector.connect(
                host=variables.databaseHost,
                user=variables.databaseUser,
                password=variables.databasePassword,
                database=variables.databaseDatabase
                )
                sqlQueryBA = 'SELECT * FROM `blacklist-artists`'
                blacklistArtists = database.cursor()
                blacklistArtists.execute(sqlQueryBA)
                blacklistArtistsList = blacklistArtists.fetchall()

                session['blacklistArtistsList'] = blacklistArtistsList

                database = mysql.connector.connect(
                host=variables.databaseHost,
                user=variables.databaseUser,
                password=variables.databasePassword,
                database=variables.databaseDatabase
                )
                sqlQueryWS = 'SELECT * FROM `whitelist-songs`'
                whitelistSongs = database.cursor()
                whitelistSongs.execute(sqlQueryWS)
                whitelistSongsList = whitelistSongs.fetchall()

                session['whitelistSongsList'] = whitelistSongsList

                database = mysql.connector.connect(
                host=variables.databaseHost,
                user=variables.databaseUser,
                password=variables.databasePassword,
                database=variables.databaseDatabase
                )
                sqlQueryWA = 'SELECT * FROM `whitelist-artists`'
                whitelistArtists = database.cursor()
                whitelistArtists.execute(sqlQueryWA)
                whitelistArtistsList = whitelistArtists.fetchall()

                session['whitelistArtistsList'] = whitelistArtistsList

                config = helper.read_config()
                session['getNowRunningMode'] = config['NowPlaying']['Mode']
                session['getCacheMode'] = config['Cache']['enabled']

                return render_template('admin-loggedin.html')



        # If not, display login form
        except:
            form = LoginForm()
            if form.validate_on_submit():

                database = mysql.connector.connect(
                    host=variables.databaseHost,
                    user=variables.databaseUser,
                    password=variables.databasePassword,
                    database=variables.databaseDatabase
                )

                givenUsername = form.user_name.data
                givenPassword = form.password.data
                sqlQuery = 'SELECT isAdmin FROM `admins` WHERE login = %s AND password = %s'
                userCredentials = database.cursor()
                userCredentials.execute(sqlQuery, (givenUsername, givenPassword))
                usersList = userCredentials.fetchall()
                try:
                    if str(usersList[0]) == "(1,)":
                        session['loggedIn'] = True
                        return redirect("/api/admin")
                except:
                    return render_template('admin-e-index-universal.html', form=form, e="Zła nazwa użytkownika lub hasło")


            return render_template('admin-e-index-universal.html', form=form, e="")


@app.route('/api/set-mode', methods=['GET', 'POST'])
def SetNowPlayingMode():
    try:
        config = helper.read_config()
        config['NowPlaying']['Mode'] = request.form['mode']
        with open('configurations.ini', 'w') as file_object:
            config.write(file_object)
    except:
        return redirect("/api/admin")

    return redirect("/api/admin")

@app.route('/api/set-cache', methods=['GET', 'POST'])
def SetCacheMode():
    try:
        config = helper.read_config()
        config['Cache']['Enabled'] = request.form['mode']
        with open('configurations.ini', 'w') as file_object:
            config.write(file_object)
    except:
        return redirect("/api/admin")

    return redirect("/api/admin")

@app.route('/api/logout', methods=['GET', 'POST'])
def Logout():
    app.secret_key = secrets.token_urlsafe(32)
    return redirect('/')

##############################
# Admin portal segment above #
############################## 



##########################################
# Python app start handler segment below #
########################################## 

if __name__ == "__main__":
    if str(sys.argv[1]) == "configure":
        variables.setConfigVariables()
        variables.client_id = str(sys.argv[2])
        variables.client_secret = str(sys.argv[3])
        ConfigureSpotifyAuth()    
        exit()

    variables.setVariables()
    # vars = setVariables()
    # variables.client_id = vars[0]
    # variables.client_secret = vars[1]
    # variables.playlistUserId = vars[2]
    # variables.playlistId = vars[3]
    # variables.daatbaseHost = vars[4]
    # variables.variables.databaseUser = vars[5]
    # variables.variables.databasePassword = vars[6]
    # variables.variables.databaseDatabase = vars[7]
    # print(vars)
    variables.client_id = str(sys.argv[1])
    variables.client_secret = str(sys.argv[2])
    variables.playlistUserId = str(sys.argv[3])
    variables.playlistId = str(sys.argv[4])
    variables.databaseHost = str(sys.argv[5])
    variables.databaseUser = str(sys.argv[6])
    variables.databasePassword = str(sys.argv[7])
    variables.databaseDatabase = str(sys.argv[8])
    variables.playlistNotAcceptedId = str(sys.argv[9])
    variables.blacklistSongsPlaylistId = str(sys.argv[10])
    variables.blacklistArtistsPlaylistId = str(sys.argv[11])
    variables.whitelistSongsPlaylistId = str(sys.argv[12])
    variables.whitelistArtistsPlaylistId = str(sys.argv[13])
    app.run(host="0.0.0.0", port=8080)

##########################################
# Python app start handler segment above #
########################################## 