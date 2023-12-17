const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Por favor indique su contraseña como argumento: node mongo.js <pass>"
  );
  process.exit(1);
}

const contraseña = process.argv[2];
const url = `mongodb+srv://heyker:${contraseña}@cluster0.rhz19yo.mongodb.net/agenda-app?retryWrites=true&w=majority`;

mongoose.connect(url);

const esquemaContacto = new mongoose.Schema({
  name: String,
  number: Number,
});

const Contacto = mongoose.model("Contacto", esquemaContacto);

const nombreContacto = process.argv[3];
const numeroContacto = process.argv[4];

const contacto = new Contacto({
  name: nombreContacto,
  number: numeroContacto,
});

switch (process.argv.length) {
    case 3:
        Contacto.find({}).then(res=>{
            res.forEach(contacto=>{
                console.log(contacto)
            })
            mongoose.connection.close()
        })
        break;
  case 5:
    contacto.save().then((res) => {
      console.log(`Se añadio el contacto de ${nombreContacto} a la agenda.`);
      mongoose.connection.close();
    });
    break;
  default:
    break;
}
