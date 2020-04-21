const express = require('express');
const router = express.Router({ mergeParams: true });
const bodyParser = require('body-parser');

const auth = require('../middlewares/auth');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())

const Classe = require('../models/classe.model');


router.get('/', function (req, res) {
  Classe.find()
    .then(classes => {
      res.status(200).json({ message: classes });
    })
    .catch(err => res.status(500).json({ error: err.message }))
});

router.post('/new', function (req, res) {
  const { idFiliere, nomClasse, niveau } = req.body;
  const Class = new Classe({
    idFiliere,
    nomClasse,
    niveau
  })
  Class.save()
    .then(classe => {
      res.status(200).json({ message: `Classe ${classe.nomClasse} was created` })
    })
    .catch(err => res.status(500).json({ error: err.message }))
});


router.get('/:id', function (req, res) {
  Classe.findById(req.params.id)
    .then(classe => {
      res.status(200).json({ message: classe });
    })
    .catch(err => res.status(500).json({ error: err.message }))
});

router.delete('/:id/delete', auth, function (req, res) {
  Classe.findByIdAndRemove(req.params.id)
    .then(classe => {
      res.status(200).json({ message: `Classe ${classe.nomClasse} was deleted` });
    })
    .catch(err => res.status(500).json({ error: err.message }))
});

router.put('/:id/update', async (req, res) => {
  const { id } = req.params;
  const oldClasse = await Classe.findById(id);
  const { nomClasse, filieres, startDate } = oldClasse;

  oldClasse.history.push({ nomClasse, filieres, startDate, changeDate: Date.now() })

  Classe.findOneAndUpdate({ id }, { ...req.body, history: oldClasse.history }, { new: true })
    .then(classe => {
      res.status(200).json({ message: `classe ${classe.nomClasse} was updated` });
    })
    .catch(err => res.status(500).json({ error: err.message }))
});

module.exports = router;