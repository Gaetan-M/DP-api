const express = require('express');
const router = express.Router({ mergeParams: true });
const bodyParser = require('body-parser');
const Transaction = require("mongoose-transactions");
const transaction = new Transaction();

const auth = require('../middlewares/auth');
const Faculty = require('../models/faculty.model')

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())

router.get('/', function (req, res) {
  Faculty.findById(req.params.id)
    .then(faculty=> res.status(200).json({message: faculty}))
    .catch(err=> res.status(200).json({error: err}))
});
router.post('/new', function (req, res) {
  const  { nomFiliere, maxNiveau, startDate } = req.body
  async function start() {
    try {
      const prevFaculty = await Faculty.findById(req.params.id).then(faculty=>faculty);
      prevFaculty.filieres.push(req.body);

      transaction.update("Faculty",req.params.id,prevFaculty);
      for (let index = 1; index <= maxNiveau; index++) {
        await transaction.insert('Classe', {
          idFiliere: prevFaculty._id,
          nomClasse: nomFiliere,
          niveau: index
        })
      }
      const final = await transaction.run();
      res.status(200).json({message: `filiere ${nomFiliere} was created`})
    } catch (error) {
      console.error(error);
      await transaction.rollback().catch(console.error);
      transaction.clean();
      res.status(500).json({error: error.message})
    }
  }
  
  start();
});


router.get('/:idFiliere', function (req, res) {
  console.log(req.params)
  Faculty.findById(req.params.id)
    .then(faculty => {
      let Filiere = faculty.filieres.find((filiere)=>filiere._id == req.params.idFiliere)
      res.status(200).json({ message: Filiere });
    })
    .catch(err => res.status(500).json({ error: err.message }))
});

router.delete('/:idFiliere/delete', function (req, res) {
  Faculty.findById(req.params.id)
    .then(faculty => {
      let Filieres = faculty.filieres.filter((filiere)=>{
        if (filiere._id == req.params.idFiliere) {
          let currentFil = filiere;
          return false
        } else {
          return true
        }
      })
      faculty.filieres = Filieres
      faculty.save()
        .then(res.status(200).json({ message: `filiere ${currentFil.nomFiliere} was deleted` }))
        .catch(err=>res.status(500).json({ error: err.message }))
    })
    .catch(err => res.status(500).json({ error: err.message }))
});

// router.delete('/:id/delete', auth, function (req, res) {
//   Faculty.findByIdAndRemove(req.params.id)
//     .then(faculty => {
//       res.status(200).json({ message: `faculty ${faculty.nomFaculty} was deleted` });
//     })
//     .catch(err => res.status(500).json({ error: err.message }))
// });

router.put('/:idFiliere/update', async (req, res) => {
  const { idFiliere,id } = req.params;
  const oldFaculty = await Faculty.findById(id);
  const { filieres } = oldFaculty;
  const newFilieres = filieres.map(filiere=>{
    if (filiere._id == idFiliere) {
      var { nomFiliere, maxNiveau, startDate } = filiere;
      filiere.history.push({ nomFiliere, maxNiveau, startDate, changeDate: Date.now()})
      return { ...filiere,...req.body }
    }
    return filiere
  })

  oldFaculty.filieres = newFilieres;

  Faculty.findOneAndUpdate({ id }, { ...oldFaculty }, { new: true })
    .then(faculty => {
      res.status(200).json({ message: `filiere ${nomFiliere} was updated` });
    })
    .catch(err => res.status(500).json({ error: err.message }))
});

module.exports = router;