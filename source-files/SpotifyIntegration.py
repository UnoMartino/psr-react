import variables
import tekore as tk

def AddToPlaylist(songId):
    file = 'tekore.cfg'
    conf = tk.config_from_file(file, return_refresh=True)
    token = tk.refresh_user_token(*conf[:2], conf[3])
    tk.config_to_file(file, conf + (token.refresh_token,))
    spotify = tk.Spotify(token)

    uri = [tk.to_uri("track", songId)]
    snapshot = spotify.playlist_add(variables.playlistId, uri)

def ConfigureSpotifyAuth():
    file = 'tekore.cfg'
    conf = (variables.client_id, variables.client_secret, variables.redirect_uri)
    token = tk.prompt_for_user_token(*conf, scope=tk.scope.playlist_modify_private + tk.scope.playlist_modify_public + tk.scope.user_read_playback_state)
    tk.config_to_file(file, conf + (token.refresh_token,))
