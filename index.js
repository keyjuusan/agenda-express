require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

// let personas = [
//   {
//     name: "Arto Hellas",
//     number: "040-123456",
//     id: 1,
//   },
//   {
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//     id: 2,
//   },
//   {
//     name: "Dan Abramov",
//     number: "12-43-234345",
//     id: 3,
//   },
//   {
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//     id: 4,
//   },
// ];
const Contacto = require("./models/contacto");

morgan.token("body", (req, res) => {
  // console.log(req.body)
  return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status :req[body] - :response-time ms :body"));

app.get("/api/personas", (req, res) => {
  Contacto.find({}).then((contactos) => {
    res.json(contactos);
  });
});

app.get("/api/personas/:id", (req, res, next) => {
  Contacto.findById(req.params.id)
    .then((contacto) => {
      res.json(contacto);
    })
    .catch((err) => {
      next(err);
    });
});

app.get("/info", (req, res) => {
  const date = new Date();
  Contacto.find({})
    .then((contactos) => {
      res.send(`
      <h2>Actualmente en tu agenda tienes ${contactos.length} contactos</h2>
      <h3>${date.toUTCString()} ${date.getTimezoneOffset()}</h3>
      `);
    })
    .catch((err) => {
      next(err);
    });
});

app.post("/api/personas", (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(404).json({ error: "Alguno de los campos esta vacio." });
  }
  if (body.name.length < 3) {
    return res
      .status(404)
      .json({ error: "El nombre debe tener al menos 3 caracteres." });
  }
  if (body.number.length < 8) {
    return res
      .status(404)
      .json({ error: "El numero debe ser al menos de 8 digitos." });
  }

  console.log(typeof body.name, typeof body.number);

  const contacto = new Contacto({
    number: body.number,
    name: body.name,
  });

  contacto
    .save()
    .then((contactoGuardado) => {
      res.json(contactoGuardado);
    })
    .catch((err) => {
      next(err);
    });
});

app.put("/api/personas/:id", (req, res, next) => {
  const body = req.body;

  const contacto = {
    number: body.number,
    name: body.name,
  };

  Contacto.findByIdAndUpdate(req.params.id, contacto, { new: true })
    .then(() => {})
    .catch((err) => {
      next(err);
    });
});

app.delete("/api/personas/:id", (req, res, next) => {
  Contacto.findByIdAndDelete(req.params.id)
    .then((r) => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

const rutaDesconocida = (req, res) => {
  res.status(404).send({ error: "ruta desconocida" });
};
app.use(rutaDesconocida);

const controladorErrores = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "El ID del elemento es invalido." });
  } else if (error.name === "ValidationError") {
    return res
      .status(400)
      .send({ error: "Alguno de los datos ya se encuentra registrado." });
  }
  next(error);
};
app.use(controladorErrores);

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
