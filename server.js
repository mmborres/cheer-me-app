const express = require('express');
const path = require('path');
const { get } = require('request');
const ejs = require('ejs');
const axios = require('axios');
const http = require('http');
const viewertype = "0a8ee76b339d0551cc633a54259cd2bb";
const tmdb = require('tmdbv3').init(viewertype);
const favicon = require('serve-favicon');

const port = process.env.PORT || 3000; //for deployment

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view-engine', 'ejs');

const viewsDir = path.join(__dirname, 'views');
app.use(express.static(viewsDir));

app.use(express.static(path.join(__dirname, './public')));
app.use(express.static(path.join(__dirname, './weights')));
app.use(express.static(path.join(__dirname, './dist')));

app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.get('/', (req, res) => res.redirect('webcam_face_expression_recognition'));

app.get('/webcam_face_expression_recognition', (req, res) => res.render( 'webcamFaceExpressionRecognition.ejs' ));

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; 
}

app.get('/cheerme/:expression', (req, resorig) => {

  const mood = req.params.expression;

    const randnum = getRandomInt(100);
    let numTrivia = "";

    axios.get(`http://numbersapi.com/${ randnum }/math`).then( (result) => {

        numTrivia = JSON.stringify(result.data);

        const billmurraysite = `http://www.fillmurray.com/${ getRandomIntInclusive(200,250) }/${ getRandomIntInclusive(200,250) }`;
        const billmurraysite2 = `http://www.fillmurray.com/${ getRandomIntInclusive(200,250) }/${ getRandomIntInclusive(200,250) }`;

        let moodmovieimg1 = "";
        let moodmovielink1 = "";
        let moodmovietitle1 = "";
        let moodmovieoverview1 = "";
        let cheerupmovieimg1 = "";
        let cheerupmovielink1 = "";
        let cheerupmovietitle1 = "";
        let cheerupmovieoverview1 = "";

        movie_lookup = {
          'happy': [28, 80, 99, 18, 10751, 36, 27, 9648, 878, 53, 10770, 10752, 37] ,
          'sad': [35, 12, 16] ,
          'angry': [10751] ,
          'disgusted': [35, 10402] ,
          'surprised': [28, 12, 16, 35, 99, 10770] ,
          'fearful': [12, 16, 35, 18, 14, 36] ,
          'neutral': [28, 12, 16, 10752] 
       };

       const arrGenres = movie_lookup[mood];

      const total = arrGenres.length;
      const gint = getRandomInt(total);
      const genreid = arrGenres[gint];


      tmdb.genre.movies(genreid, 1, (err ,res) => {

        const gtotal = res.results.length;
        const gmovieint = getRandomInt(gtotal);
        const gmovie = res.results[gmovieint];
        cheerupmovietitle1 = gmovie.title;

        cheerupmovieimg1 = `https://image.tmdb.org/t/p/w300_and_h450_bestv2${gmovie.poster_path}`;

        cheerupmovieoverview1 = gmovie.overview;

        cheerupmovielink1 = `https://www.themoviedb.org/movie/${gmovie.id}`;

        tmdb.search.movie(mood, 1, (err ,res1) => {

          const total2 = res1.results.length;
          const movieint = getRandomInt(total2);
          const movie = res1.results[movieint];

          moodmovietitle1 = movie.title;

          moodmovieoverview1 = movie.overview;
          moodmovieimg1 = `https://image.tmdb.org/t/p/w300_and_h450_bestv2${movie.poster_path}`;

          moodmovielink1 = `https://www.themoviedb.org/movie/${movie.id}`;

          axios.get("https://guarded-depths-85916.herokuapp.com/poem/random").then( (garesult) => {

            const gatitle1 = garesult.data.title;
            const gaauthor1 = garesult.data.author;
            const gapoem1 = garesult.data.poem.split("\n");

            axios.get("https://sv443.net/jokeapi/category/Any").then( (jresult) => {

            const jjoke = [];
            if (jresult.data.type==="single") {
              jjoke.push(jresult.data.joke);
            } else {
              //twopart
              jjoke.push(jresult.data.setup);
              jjoke.push(jresult.data.delivery);
            }

            resorig.render( 'cheerme.ejs', { randombillmurray: billmurraysite, randomnumber: randnum, 
              trivia: numTrivia, feeling: mood.toUpperCase(), 
              moodmovieimg: moodmovieimg1, moodmovietitle: moodmovietitle1, moodmovieoverview: moodmovieoverview1, 
              cheerupmovieimg: cheerupmovieimg1, cheerupmovietitle: cheerupmovietitle1, cheerupmovieoverview: cheerupmovieoverview1,
              moodmovielink: moodmovielink1, cheerupmovielink: cheerupmovielink1,
              gatitle: gatitle1, gaauthor: gaauthor1, gapoem: gapoem1, randombillmurray2: billmurraysite2, joke: jjoke
            } );

            });
          });

        });

      });

      }).catch(error => {
          console.log(error);
      });

});


function request(url, returnBuffer = true, timeout = 10000) {
  return new Promise(function(resolve, reject) {
    const options = Object.assign(
      {},
      {
        url,
        isBuffer: true,
        timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
        }
      },
      returnBuffer ? { encoding: null } : {}
    )

    get(options, function(err, res) {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}

app.listen(port, () => console.log(`Listening on port ${ port }!`));
