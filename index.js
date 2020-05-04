require('dotenv').config();
const express = require('express')
const app=express()
const cors = require('cors');
const bodyParser = require('body-parser');
const server=require('http').createServer(app)
/**********socket****************************/
const io=require('socket.io').listen(server)
/*********************************************/
const logger=require('morgan');
const path=require('path');

const dbConnect = require('./db.connect');
const socket=require('./sockets/student.js')
const file=require('./test/index.js')
const handle = require('./handlers')
const personnelRoutes = require('./routes/personnel.routes')
const faculty = require('./routes/faculty.routes')
const coordonnateur = require('./routes/coordonnateur.routes')
const classe = require('./routes/classe.routes')
const enseignant = require('./routes/enseignant.route')
const timeTable = require('./routes/timeTable.routes')
const supportForum = require('./routes/supportForum.route')
const forum = require('./routes/forum.route')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', personnelRoutes)
app.use('/faculty', faculty)
app.use('/coordo', coordonnateur)
app.use('/classe', classe)
app.use('/enseignant', enseignant)
app.use('/timeTable', timeTable)
app.use('/forum', forum)
app.use('/files',supportForum)
const index=require('./test/index.js')
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.get('/', (req, res) =>{console.log("someone is here"); res.json({ hello: 'world' })});
  
const port = process.env.PORT;

  /*************************SOCKET************************************************/

const Forum=require('./models/forum.models.js')

let ID='';
let message={messages:[]};

io.on('connection',(socket)=>{
	console.log('un client socket vient de se connecter')

   socket.on('idCour',(data)=>{ ID=data
   	console.log(data)
   	Forum.find({idCour:data})
   	.then(mess=>
   		{
   			console.log(mess)
   	    socket.emit('initilisation',{message:mess})
         })
   	.catch(error=>console.log("error _id"))
   })

   socket.on('newMessage', (data)=>
   	{
   	socket.broadcast.emit('newMessage', data);
   		message.messages.push(data)
   		console.log(message)
	Forum.updateOne({idCour:ID},{...message})
		.then(()=>console.log('message save'))
		.catch(error=>console.log(error))

   	})


	socket.on('disconnect',(data)=>{
		console.log('un client deconnecté')
	})
})
/*************************ROUTE POST FILE qui dérange******************************/
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoURI = ' mongodb+srv://User:user@cluster0-mdzzl.mongodb.net/Dp-project?retryWrites=true&w=majority';
const mongoose=require('mongoose')
// Create mongo connection
const conn = mongoose.createConnection(mongoURI,{ useUnifiedTopology: true ,useNewUrlParser: true});

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);  
  gfs.collection('uploads');
});
useNewUrlParser: true
// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
         resolve(fileInfo);
    });
  }
});

const upload = multer({ storage });

/********ROUTES*****************************/
app.post('/files/upload', upload.single('file'), (req, res) => {
  console.log('une requete')
    res.redirect('/files');
});

server.listen(port, console.log(`Server started on port [${port}]`));


