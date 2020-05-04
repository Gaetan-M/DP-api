const express = require('express');
const router = express.Router({ mergeParams: true });
const bodyParser = require('body-parser');
const Transaction = require("mongoose-transactions");
const transaction = new Transaction();

const auth = require('../middlewares/auth');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())

const Cour = require('../models/cours.model');
const Module = require('../models/module.model');

router.get('/',auth, function (req, res) {
  if (req.role !== "secretaire") res.status(502).json({ error: "auth failed" })
  Cour.find()
    .then(cours => {
      res.status(200).json({ message: cours });
    })
    .catch(err => res.status(500).json({ error: err.message }))
});

router.post('/new', auth,async function (req, res) {
  if (req.role !== "secretaire") res.status(502).json({ error: "auth failed" })
  const { codeDuCour, nomCour, natureCour, startDate, poids, classe } = req.body;
  const exist = await Cour.findOne({codeDuCour}).then(cour=>cour).catch(err=>console.log(err.message))
  if (exist) {
    exist.history.push({
      _id: exist._id,
      startDate: exist.startDate,
      codeDuCour: exist.codeDuCour,
      natureCour: exist.natureCour,
      nomCour: exist.nomCour,
      poids: exist.poids,
      classes: exist.classes
    });
    exist.classes.push(classe)
    await exist.save()
      .then(cour => res.status(200).json(`Cours ${cour.nomCour} was created`))
      .catch(error => res.status(500).json({ error: error.message }))
  }
  async function start() {
    try {
      const idCour = await transaction.insert('Cour',{
        codeDuCour,
        nomCour,
        natureCour,
        startDate,
        classes: [classe]
      })
      const prevModule = await Module.findById(req.params.idModule).then(module => module);
      prevModule.history.push({
        _id: prevModule._id,
        codeModule:prevModule.codeModule,
        nomModule:prevModule.nomModule,
        idClasse:prevModule.idClasse,
        credit:prevModule.credit,
        startDate:prevModule.startDate,
        cours:prevModule.cours,
        changeDate: Date.now()
      });
      prevModule.cours.push({idCour: idCour, poids: poids})
      transaction.update("Module", req.params.idModule, prevModule);
      const final = await transaction.run();
      res.status(200).json({ message: `Cours ${nomCour} was created` })
    } catch (error) {
      console.error(error);
      await transaction.rollback().catch(console.error);
      transaction.clean();
      res.status(500).json({ error: error.message })
    }
  }
  
  start();
});


router.get('/:idCour',auth, function (req, res) {
  if (req.role !== "secretaire") res.status(502).json({ error: "auth failed" })
  Cour.findById(req.params.id)
    .then(Cour => {
      res.status(200).json({ message: Cour });
    })
    .catch(err => res.status(500).json({ error: err.message }))
});

router.delete('/:idCour/delete', auth,async function (req, res) {
  if (req.role !== "secretaire") res.status(502).json({ error: "auth failed" })
  const { codeDuCour, nomCour } = req.body;
  const exist = await Cour.findOne({ codeDuCour }).then(cour => cour).catch(err => console.log(err.message))
  if (!exist) {
    res.status(500).json(`Cours ${nomCour} not found`)
  }
 
  async function start() {
    try {
      await transaction.remove('Cour',{_id: req.params.idCour})
      const prevModule = await Module.findById(req.params.idModule).then(module => module);
      prevModule.history.push({
        id: prevModule._id,
        codeModule: prevModule.codeModule,
        nomModule: prevModule.nomModule,
        idClasse: prevModule.idClasse,
        credit: prevModule.credit,
        startDate: prevModule.startDate,
        cours: prevModule.cours,
        changeDate: Date.now()
      });
      prevModule.cours = prevModule.cours.filter(cour=> !cour.idCour == req.params.idCour)
      transaction.update("Module", req.params.idModule, prevModule);
      const final = await transaction.run();
      res.status(200).json({ message: `Cours ${nomCour} was deleted` })
    } catch (error) {
      console.error(error);
      await transaction.rollback().catch(console.error);
      transaction.clean();
      res.status(500).json({ error: error.message })
    }
  }

  start();
});

router.put('/:codeCour/update',auth, async (req, res) => {
  if(req.role !=="secretaire") res.status(502).json({error:"auth failed"})
  const { codeCour } = req.params;
  const oldCour = await Cour.findOne({codeCour:codeCour});
  const { codeDuCour, nomCour, natureCour, startDate, poids, classes  } = oldCour;

  oldCour.history.push({ codeDuCour, nomCour, startDate, poids, classes: classes, changeDate: Date.now() })

  Cour.findOneAndUpdate({ codeCour }, { ...req.body, history: oldCour.history }, { new: true })
    .then(cour => {
      res.status(200).json({ message: cour });
    })
    .catch(err => res.status(500).json({ error: err.message }))
});

module.exports = router;