import express from 'express'

const app = express();
const port: number = 8080;

app.get('/', (req, res) => {
    console.log('inside /');
    res.status(200).send('<h1>hello</h1>')  
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})
