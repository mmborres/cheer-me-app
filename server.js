const express = require('express');
const path = require('path');
const { get } = require('request');
const ejs = require('ejs');
const axios = require('axios');
const http = require('http');

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const viewsDir = path.join(__dirname, 'views');
app.use(express.static(viewsDir));

app.use(express.static(path.join(__dirname, './public')));
app.use(express.static(path.join(__dirname, './weights')));
app.use(express.static(path.join(__dirname, './dist')));

app.get('/', (req, res) => res.redirect('webcam_face_expression_recognition'));

app.get('/webcam_face_expression_recognition', (req, res) => res.render( 'webcamFaceExpressionRecognition.ejs' ));
//res.sendFile(path.join(viewsDir, 'webcamFaceExpressionRecognition.ejs')))

app.get('/cheerme', (req, res) => {

    axios.get('http://numbersapi.com/5/math').then( (result) => {
      console.log(JSON.stringify(result.data));
      //res.render('trivia.ejs', { trivia: JSON.stringify(result.data) });
      }).catch(error => {
          console.log(error);
      });
    
    res.render( 'cheerme.ejs' );

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