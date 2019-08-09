const express = require('express');
const app = express();
const port = 8081;
const randomWords = require('random-words');

const words = randomWords(10000);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/search', (req, res) => {
    const key = req.query.q;
    const result = words.filter(word => {
        return word.startsWith(key);
    });

    res.send({result});
});

app.listen(port, () => console.log(`Example app listening on port ${port}`));

