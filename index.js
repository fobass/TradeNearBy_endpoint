const express = require("express")
const bodyParser = require('body-parser');
const selling = require('./routes/selling.routes.js')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());


app.use('/api/selling', selling)
// app.get('/', (req, res) => res.send('sssxczcasdasdzxc !'))

// app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
app.listen(port, function () {
    console.log("Connected!");
    console.log('listening on 3000')
})