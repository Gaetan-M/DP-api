const express = require('express');
const router = express.Router({ mergeParams: true });
const bodyParser = require('body-parser');

const auth = require('../middlewares/auth');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())

const Module = require('../models/module.model');
const Cour = require('../models/cours.model');
const Personnel = require('../models/personnel.model');

const cour = require('../controllers/cour.controller');

router.use('/cour', cour)

router.get('/', auth ,function (req, res) {
  if (req.role !== "secretaire") res.status(502).json({ error: "auth failed" })
  Module.find()
    .then(modules => {
      res.status(200).json({ message: modules });
    })
    .catch(err => res.status(500).json({ error: err.message }))
});

router.get('/users-courses-modules', auth, async function (req, res) {
  if (req.role !== "secretaire") res.status(502).json({ error: "auth failed" })
  const users = await Personnel.find()
  const courses = await Cour.find()
  const modules = await Module.find()
  if (users & courses & modules) res.status(500).json({ error: "couldn't fetch personnel | cours | modules " })
  res.status(200).json({message: {users,courses,modules}})
});

router.post('/new', auth ,function (req, res) {
  if (req.role !== "secretaire") res.status(502).json({ error: "auth failed" })
  console.log('passing here new module', req.body.newModule.cours)
  const { newModule, coursArray } = req.body;
  let modID = 0;
  let data = [];
  const { idClasse, codeModule, nomModule, credit, startDate, cours } = newModule;
  const Modul = new Module({
    idClasse,
    credit,
    startDate,
    codeModule,
    nomModule,
    cours
  })
  Modul.save()
    .then(async module => {
      data.push({module})
      console.log(module)
      modID = module._id;
      for (let i = 0; i < coursArray.length; i++) {
        let { startDate,
          codeCour,
          nomCour,
          poids,
          classes,
          idEnseignant } = coursArray[i];
        let courx = new Cour({
         startDate,
         codeCour,
         nomCour,
         poids,
         classes,
         idEnseignant
        })
        console.log(1,courx);
        await courx.save().then(cour =>{ console.log(2,cour);data.push(cour)}).catch(err => { throw Error(err.message) })
      }
      res.status(200).json({ message: data })
    })
    .catch(err => Module.findByIdAndRemove(modID).then(mod => res.status(500).json({ error: err.message + " + deleted" })).catch(error => res.status(500).json({ error: error.message }))
  );
})

router.get('/:idModule', auth ,function (req, res) {
  if (req.role !== "secretaire") res.status(502).json({ error: "auth failed" })
  Module.findById(req.params.idModule)
    .then(module => {
      res.status(200).json({ message: module });
    })
    .catch(err => res.status(500).json({ error: err.message }))
  });

router.get('/from-class/:idClasse', auth ,function (req, res) {
  if (req.role !== "secretaire") res.status(502).json({ error: "auth failed" })
  Module.find({idClasse: req.params.idClasse})
    .then(modules => {
      res.status(200).json({ message: modules });
    })
    .catch(err => res.status(500).json({ error: err.message }))
});

router.delete('/:idModule/delete', auth ,function (req, res) {
  if (req.role !== "secretaire") res.status(502).json({ error: "auth failed" })
  Module.findByIdAndRemove(req.params.idModule)
    .then(module => {
      res.status(200).json({ message: `Module ${module.nomModule} was deleted` });
    })
    .catch(err => res.status(500).json({ error: err.message }))
});

router.put('/:idModule/updateauth ,', auth, async (req, res) => {
  if (req.role !== "secretaire") res.status(502).json({ error: "auth failed" })
  const { idModule } = req.params;
  const oldModule = await Module.findById(idModule);
  const { codeModule, nomModule, poids, idClasse, startDate, cours} = oldClasse;

  oldModule.history.push({ codeModule, nomModule, poids, idClasse, cours, startDate, changeDate: Date.now() })

  Module.findOneAndUpdate({ idModule }, { ...req.body, history: oldModule.history }, { new: true })
    .then(module => {
      res.status(200).json({ message: `module ${module.nomModule} was updated` });
    })
    .catch(err => res.status(500).json({ error: err.message }))
});


module.exports = router;