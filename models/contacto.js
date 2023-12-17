const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator")

const contraseña = process.env.PASS;
const url = process.env.MONGO_URI;

mongoose
  .connect(url)
  .then(() => {
    console.log("Conectado a MongoDB");
  })
  .catch((err) => {
    console.log("Error al conectarse a MongoDB: ",err.message);
  });

const esquemaContacto = new mongoose.Schema({
  name: {
    type:String,
    unique:true
  },
  number: {
    type:Number,
    unique:true
  },
});

esquemaContacto.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
esquemaContacto.plugin(uniqueValidator) 

module.exports = mongoose.model("Contacto", esquemaContacto);
