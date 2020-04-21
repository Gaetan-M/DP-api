const express = require('express');
const router = express.Router({mergeParams: true});
const bodyParser = require('body-parser');
const Transaction = require("mongoose-transactions");
const transaction = new Transaction();

const auth = require('../middlewares/auth');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())

const Faculty = require('../models/faculty.model');
const Classe = require('../models/classe.model');

// const filiere = require('../controllers/filiere.controller');

// router.use('/:idFaculty/filiere', filiere )

router.get('/', function (req, res) {
  Faculty.find()
    .then(facultx => {
      res.status(200).json({ message: facultx });
    })
    .catch(err => res.status(500).json({ error: err.message }))
});

router.post('/new', function (req, res) {
  const { nomFaculty, filieres, startDate } = req.body;
  let facID = 0;
  console.log(req.body)
  const Fac = new Faculty({
    nomFaculty,
    filieres,
    startDate
  })
  Fac.save()
    .then(async faculty=>{
      const savedFilieres = faculty.filieres;
      facID = faculty._id;
      for (let j = 0; j < savedFilieres.length; j++) {
        let { _id, nomFiliere, maxNiveau } = savedFilieres[j];
        if(maxNiveau<1)throw Error("maxNiveau not valid")
        for (let i = 1; i <= maxNiveau; i++) {
          let classe = new Classe({
            idFiliere: _id,
            nomClasse: nomFiliere,
            niveau: i
          })
          await classe.save().catch(err => {throw Error("could not create classes")})
        }
      }
      res.status(200).json({ message: faculty._id })
    })
    .catch(err=>{
      Faculty.findByIdAndRemove(facID).then(fac=>res.status(500).json({ error: err.message + " + deleted" })).catch(error => res.status(500).json({ error: error.message }))
    })
});


// router.get('/:idFaculty', function (req, res) {
//   Faculty.findById(req.params.idFaculty)
//     .then(faculty => {
//       res.status(200).json({ message: faculty });
//     })
//     .catch(err => res.status(500).json({ error: err.message }))
// });

router.delete('/:idFaculty/delete', async function (req, res) {
  const Fac = await Faculty.findById(req.params.idFaculty).then(faculty=>faculty).catch(err=>console.log(err.message))
  
  const start = async () => {
    try {
      transaction.remove("Faculty",req.params.idFaculty)
      if(!Fac) throw Error('Failed fetching Faculty')
      const Filiers = Fac.filieres
      for (let j = 0; j < Filiers.length; j++) {
        const classes = await Classe.find({ idFiliere: Filiers[j]._id }).then(classes=>classes);
        for (let i = 0; i < classes.length; i++) {
          await transaction.remove('Classe',classes[i]._id)
        }
      }
      const final = await transaction.run();
      res.status(200).json({ message: `Faculty was deleted` })
    } catch (error) {
      console.error(error);
      await transaction.rollback().catch(console.error);
      transaction.clean();
      res.status(500).json({ error: error })
    }
  }
  
  start();

});

// router.put('/:idFaculty/update', async (req, res) => {
//   const { idFaculty } = req.params;
//   const oldFaculty = await Faculty.findById(id);
//   const { nomFaculty, filieres, startDate } = oldFaculty;

//   oldFaculty.history.push({ nomFaculty, filieres, startDate, changeDate: Date.now() })

//   Faculty.findOneAndUpdate({ idFaculty }, { ...req.body, history: oldFaculty.history }, { new: true })
//     .then(faculty => {
//       res.status(200).json({ message: `faculty ${faculty.nomFaculty} was updated` });
//     })
//     .catch(err => res.status(500).json({ error: err.message }))
// });

module.exports = router;