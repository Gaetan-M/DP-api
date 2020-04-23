require('dotenv').config();
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const dbConnect = require('./db.connect');

const handle = require('./handlers')
const personnelRoutes = require('./routes/personnel.routes')
const faculty = require('./routes/faculty.routes')
const coordonnateur = require('./routes/coordonnateur.routes')
const classe = require('./routes/classe.routes')
const enseignant = require('./routes/enseignant.route')
const timeTable = require('./routes/timeTable.routes')


app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', personnelRoutes)
app.use('/faculty', faculty)
app.use('/coordo', coordonnateur)
app.use('/classe', classe)
app.use('/enseignant', enseignant)
app.use('/timeTable', timeTable)

app.get('/', (req, res) =>{console.log("someone is here"); res.json({ hello: 'world' })});
  
// const port = process.env.PORT;
const port=3001;
  
app.listen(port, console.log(`Server started on port [${port}]`));