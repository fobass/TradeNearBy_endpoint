const express = require("express")
const bodyParser = require('body-parser');
const selling = require('./routes/selling.routes.js')
const profile = require("./routes/profile.routes.js")
const location = require("./routes/location.routes.js");
const item = require("./routes/item.routes.js");

const { con } = require("./models/conn.db.js");
const multer = require('multer');
const fs = require('fs')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(express.static('public'));
//Serves all the request which includes /images in the url from Images folder
app.use('/api/media', express.static(__dirname + '/media'));


app.use('/api/selling', selling)
app.use('/api/profile', profile)
app.use('/api/location', location)
// app.use('/api/selling/detail', sellingdetail)
app.use('/api/items', item)

app.get('/', (req, res) => res.send(''))





app.post('/api/uploadfile',  (req, res) => {
    const path = `media/${req.headers.uuid}/${req.headers.id}`
    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            fs.mkdirSync(path, { recursive: true })
            callback(null,  path)//(config.const.path.base + config.const.path.productReviewMedia));
        },
        filename: (req, file, callback) => {
            callback(null, Date.now() + '-' + file.originalname);
        }
    });

    const upload = multer({storage: storage}).any('file');

    upload(req, res, (err) => {
        if (err) {
            return res.status(400).send({
                message: err
            });
        }
        let results = req.files.map((file) => {
            return {
                mediaName: file.filename,
                origMediaName: file.originalname,
                mediaSource: 'http://' + req.headers.host + '/' + path + '/' + file.filename
            }
        });
        res.status(200).json(results);
    });

    // var storage = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, req.body.id + 'uploads')
    //     },
    //     filename: function (req, file, cb) {
    //         cb(null, file.originalname)
    //     }
    // })
    
    // var upload = multer({ storage: storage })

    // upload.single('file')

    // const file = req.file
    // if (!file) {
    //     const error = new Error('Please upload a file')
    //     error.httpStatusCode = 400
    //     return next(error)
    // }
    // res.send(file)

})


// app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
app.listen(port, function () {
    console.log("Connected!");
    console.log('listening on 3000')
})