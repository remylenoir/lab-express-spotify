const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const clientId = "4e84e8e1c5824a6d9e07a2c530a8e6a5",
  clientSecret = "c57b04cfd99b4ab58d1bc2b9eaefb730";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artists", (req, res, next) => {
  const { query } = req;

  spotifyApi
    .searchArtists(query.artist)
    .then(data => {
      const artists = data.body.artists.items;
      // res.send(artists);
      res.render("artists", { artists });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  const { artistId } = req.params;

  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      const albums = data.body.items;
      // res.send(albums);
      res.render("albums", { albums });
    })
    .catch(err => {
      console.error("The error while searching albums occurred: ", err);
    });
});

app.get("/tracks/:albumId", (req, res, next) => {
  const { albumId } = req.params;

  spotifyApi
    .getAlbumTracks(albumId, { limit: 5, offset: 1 })
    .then(data => {
      const tracks = data.body.items;
      // res.send(tracks);
      res.render("tracks", { tracks });
    })
    .catch(err => {
      console.error("Something went wrong!", err);
    });
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
