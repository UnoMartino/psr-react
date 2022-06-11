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


app = Flask(__name__)

app.secret_key = secrets.token_urlsafe(32)  # generate session token


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
    # data = {
    #         "Title": fileContents["Title"],
    #         "Artist": fileContents["Artist"],
    #         "Image": fileContents["Image"],

    # }
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
    idFromJson = request.get_json()['id']
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



@app.route('/api/blacklists', methods=['GET', 'POST'])
def Blacklists():
    try:
        if "butS" in str(request.form['delete']):
            idOfSongMeantToDeletion = str(request.form['delete'])[4:]
            spotifyIdOfSongMeantToDeletion = str(session['blacklistSongsList'][int(idOfSongMeantToDeletion)-1][1])

            database = mysql.connector.connect(
            host=variables.databaseHost,
            user=variables.databaseUser,
            password=variables.databasePassword,
            database=variables.databaseDatabase
            )
            sqlQueryDelSong = 'DELETE FROM `blacklist-songs` WHERE spotifyID = "' + spotifyIdOfSongMeantToDeletion + '"'
            deleteSong = database.cursor()
            deleteSong.execute(sqlQueryDelSong)
            database.commit()

            return redirect("/api/admin")

        if "butA" in str(request.form['delete']):
            idOfArtistMeantToDeletion = str(request.form['delete'])[4:]
            spotifyIdOfArtistMeantToDeletion = str(session['blacklistArtistsList'][int(idOfArtistMeantToDeletion)-1][1])

            database = mysql.connector.connect(
            host=variables.databaseHost,
            user=variables.databaseUser,
            password=variables.databasePassword,
            database=variables.databaseDatabase
            )
            sqlQueryDelArtist = 'DELETE FROM `blacklist-artists` WHERE spotifyID = "' + spotifyIdOfArtistMeantToDeletion + '"'
            deleteArtist = database.cursor()
            deleteArtist.execute(sqlQueryDelArtist)
            database.commit()

            return redirect("/api/admin")
    
    except:
        return redirect("/api/admin")

@app.route('/api/whitelists', methods=['GET', 'POST'])
def Whitelists():
    try:
        if "butS" in str(request.form['delete']):
            idOfSongMeantToDeletion = str(request.form['delete'])[4:]
            spotifyIdOfSongMeantToDeletion = str(session['whitelistSongsList'][int(idOfSongMeantToDeletion)-1][1])

            database = mysql.connector.connect(
            host=variables.databaseHost,
            user=variables.databaseUser,
            password=variables.databasePassword,
            database=variables.databaseDatabase
            )
            sqlQueryDelSong = 'DELETE FROM `whitelist-songs` WHERE spotifyID = "' + spotifyIdOfSongMeantToDeletion + '"'
            deleteSong = database.cursor()
            deleteSong.execute(sqlQueryDelSong)
            database.commit()

            return redirect("/api/admin")

        if "butA" in str(request.form['delete']):
            idOfArtistMeantToDeletion = str(request.form['delete'])[4:]
            spotifyIdOfArtistMeantToDeletion = str(session['whitelistArtistsList'][int(idOfArtistMeantToDeletion)-1][1])

            database = mysql.connector.connect(
            host=variables.databaseHost,
            user=variables.databaseUser,
            password=variables.databasePassword,
            database=variables.databaseDatabase
            )
            sqlQueryDelArtist = 'DELETE FROM `whitelist-artists` WHERE spotifyID = "' + spotifyIdOfArtistMeantToDeletion + '"'
            deleteArtist = database.cursor()
            deleteArtist.execute(sqlQueryDelArtist)
            database.commit()

            return redirect("/api/admin")
    
    except:
        return redirect("/api/admin")
    

@app.route('/api/def-blacklist', methods=['GET', 'POST'])
def DefineBlacklist():
    try:
        if request.form['AorS'] == "song":
            print(len(str(request.form['spotifyId'])))
            print(request.form['spotifyId'])
            if len(str(request.form['spotifyId'])) > 22:
                id = tk.from_url(str(request.form['spotifyId']))[1]
                url = str(request.form['spotifyId'])
                print(id)
            if len(str(request.form['spotifyId'])) == 22:
                url = tk.to_url('track', str(request.form['spotifyId']))
                id = str(request.form['spotifyId'])

            print(id)
            database = mysql.connector.connect(
            host=variables.databaseHost,
            user=variables.databaseUser,
            password=variables.databasePassword,
            database=variables.databaseDatabase
            )
            sqlQueryAddSong = 'INSERT INTO `blacklist-songs` (spotifyId, name) VALUES (%s, %s)'
            addSong = database.cursor()
            artistAndSongName = spotifyNameCheck(url)
            addSong.execute(sqlQueryAddSong, (id, artistAndSongName[0] + " - " + artistAndSongName[1]))
            database.commit()

            return redirect("/api/admin")

        if request.form['AorS'] == "artist":
            if len(str(request.form['spotifyId'])) > 22:
                id = tk.from_url(str(request.form['spotifyId']))[1]
                print(id)
            if len(str(request.form['spotifyId'])) == 22:
                id = str(request.form['spotifyId'])

            database = mysql.connector.connect(
            host=variables.databaseHost,
            user=variables.databaseUser,
            password=variables.databasePassword,
            database=variables.databaseDatabase
            )
            sqlQueryAddArtist = 'INSERT INTO `blacklist-artists` (spotifyId, name) VALUES (%s, %s)'
            addArtist = database.cursor()
            app_token = tk.request_client_token(variables.client_id, variables.client_secret)
            spotify = tk.Spotify(app_token)
            artistName = spotify.artist(id).name
            addArtist.execute(sqlQueryAddArtist, (id, artistName))
            database.commit()

            return redirect("/api/admin")
    
    except:
        return redirect("/api/admin")


@app.route('/api/def-whitelist', methods=['GET', 'POST'])
def DefineWhitelist():
    try:
        if request.form['AorS'] == "song":
            print(len(str(request.form['spotifyId'])))
            print(request.form['spotifyId'])
            if len(str(request.form['spotifyId'])) > 22:
                id = tk.from_url(str(request.form['spotifyId']))[1]
                url = str(request.form['spotifyId'])
                print(id)
            if len(str(request.form['spotifyId'])) == 22:
                url = tk.to_url('track', str(request.form['spotifyId']))
                id = str(request.form['spotifyId'])

            print(id)
            database = mysql.connector.connect(
            host=variables.databaseHost,
            user=variables.databaseUser,
            password=variables.databasePassword,
            database=variables.databaseDatabase
            )
            sqlQueryAddSong = 'INSERT INTO `whitelist-songs` (spotifyId, name) VALUES (%s, %s)'
            addSong = database.cursor()
            artistAndSongName = spotifyNameCheck(url)
            addSong.execute(sqlQueryAddSong, (id, artistAndSongName[0] + " - " + artistAndSongName[1]))
            database.commit()

            return redirect("/api/admin")

        if request.form['AorS'] == "artist":
            if len(str(request.form['spotifyId'])) > 22:
                id = tk.from_url(str(request.form['spotifyId']))[1]
                print(id)
            if len(str(request.form['spotifyId'])) == 22:
                id = str(request.form['spotifyId'])

            database = mysql.connector.connect(
            host=variables.databaseHost,
            user=variables.databaseUser,
            password=variables.databasePassword,
            database=variables.databaseDatabase
            )
            sqlQueryAddArtist = 'INSERT INTO `whitelist-artists` (spotifyId, name) VALUES (%s, %s)'
            addArtist = database.cursor()
            app_token = tk.request_client_token(variables.client_id, variables.client_secret)
            spotify = tk.Spotify(app_token)
            artistName = spotify.artist(id).name
            addArtist.execute(sqlQueryAddArtist, (id, artistName))
            database.commit()

            return redirect("/api/admin")
    
    except:
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
    app.run(host="0.0.0.0", port=8080)

##########################################
# Python app start handler segment above #
########################################## 