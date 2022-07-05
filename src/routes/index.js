const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const { Country, Activity } = require("../db");
const axios = require("axios");

const router = Router();
const URL_API_COUNTRIES = "https://restcountries.com/v3/all";
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get("/countries", async (req, res) => {
  /*  try {
    const encontrados = await axios.get(URL_API_COUNTRIES);
  
    res.json(respuestaFinal);
  } catch (err) {
    console.log(err);
  } */
  const { name } = req.query;
  if (name) {
    try {
      //const encontrados = await Country.findAll({ where: { name: name } });
      const encontrados = await axios.get(
        `https://restcountries.com/v3/name/${name}`
      );
      return res.json(encontrados.data);
    } catch (error) {
      console.log(error);
      return res.json({ err: error });
    }
  }

  const respuesta = await Country.findAll();
  if (respuesta.length === 0) {
    const api = await axios.get(URL_API_COUNTRIES);
    for (let i = 0; i < api.data.length; i++) {
      // console.log(api.data[i].capital[0]);
      if (!api.data[i].capital) {
        await Country.create({
          id: api.data[i].cca3,
          name: api.data[i].name.common,
          imagenBandera: api.data[i].flags[2],
          continente: api.data[i].continents[0],
          subregion: api.data[i].subregion,
          area: api.data[i].area,
          poblacion: api.data[i].population,
        });
      } else {
        /* const cap = api.data[i].capital; */
        await Country.create({
          id: api.data[i].cca3,
          name: api.data[i].name.common,
          imagenBandera: api.data[i].flags[1],
          continente: api.data[i].continents[0],
          capital: api.data[i].capital[0],
          subregion: api.data[i].subregion,
          area: api.data[i].area,
          poblacion: api.data[i].population,
        });
      }
    }
  }
  let respuestaFinal = await Country.findAll();
  return res.json(respuestaFinal);
});

/* router.get("/countries/{idPais}", async (req, res) => {
  const { id } = req.params;
  try {
    const idPais = await Country.findAll({ where: { id: id } });
    console.log(idPais);
    return res.json(idPais);
  } catch (error) {
    return res.json({ err: error });
  }
}); */

router.get("/countries/:id", async (req, res) => {
  const { id } = req.params;
  const encontrar = await Country.findByPk(id, {
    include: Activity,
  });
  console.log("SOY ENCONTRAR", encontrar);
  if (encontrar) {
    return res.json(encontrar);
  } else res.status(404).send("No country with that id was found");
});

//----------------------/POST--------------------------------

router.post("/activities", async (req, res) => {
  try {
    let { Nombre, Dificultad, Duración, Temporada, paises } = req.body;

    let activityCreated = await Activity.create({
      Nombre,
      Dificultad,
      Duración,
      Temporada,
    });

    let find = await Country.findAll({
      where: { id: paises },
    });

    activityCreated.addCountry(find);
    console.log("SOY ACTIVITY CREATED", activityCreated);

    res.status(200).json(activityCreated);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
