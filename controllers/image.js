const Clarifai = require('clarifai');
const app = new Clarifai.App({
    apiKey: '4a2261430bdb4608bf8b8fa69b7b053d'
   });

const handleApiCall = (req, res)  => {
    console.log('dbg predict!', req.body.input)
    app.models
        .predict(
            Clarifai.FACE_DETECT_MODEL, 
            req.body.input
        )
        .then(response => {
            console.log('dbg predict respinse', response, req.body.input)
            res.json(response);
        })
        .catch(err => res.status(400).json('unable to work with API', err));


} 
const handleImage = (db) => (req, res) => {
    const { id } = req.body;    
    db('users')
    .where({id})
    .increment('entries', 1)
    .returning('entries')
    .then(entries =>{
        console.log(entries)
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('error setting entries'))
}
module.exports = {
    handleImage,
    handleApiCall
}

