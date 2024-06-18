// Paso 1
const fs = require("fs");

const express = require("express");
const app = express();
const PORT = 3000;

app.listen(3000, () => console.log("Servidor escuchando Puerto: " + PORT));
app.use(express.json());
app.use(express.static("index.html"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Paso 2
app.get("/agregar", (req, res) => {
  // Paso 3y
  const query = req.query;
  console.log(req.query);
  const { nombre, precio } = req.query;
  if (!nombre || !precio) {
    return res.send("Ingrese nombre y precio del deporte.");
  }
  if (isNaN(parseFloat(precio))) {
    return res.send("El precio debe ser numerico.");
  }
  let deporte;
  //console.log("req.query: ", query);
  console.log("llaves del objeto: ", Object.keys(query));
  console.log("valores del objeto: ", Object.values(query));
  if (Object.keys(query).length == 2) {
    const { nombre, precio } = query;
    deporte = { nombre, precio };
    console.log("Valor del objeto: ", deporte);
  } else {
    console.log("datos vacios o incompletos", query);
    return res.send("El objeto con los parametros esta vacio o incompleto");
  }

  // Paso 4
  // Paso 4.1
  const data = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
  // Paso 4.2
  console.log("valor de data: ", data);
  const deportes = data.deportes;
  console.log("valor de deporte: ", deportes);

  if (deportes.some((deporte) => deporte.nombre === nombre)) {
    return res.send("El deporte " + nombre + " ya existe.");
  }
  //Paso 4.3
  deportes.push({ nombre, precio });

  //Paso 4
  fs.writeFileSync("deportes.json", JSON.stringify(data));

  res.send("Deporte " + nombre + " agregado");
});

//ruta para visualizar a todos los usuarios
app.get("/deportes", (req, res) => {
  const data = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
  const deportes = data;
  console.log(deportes);
  res.json(deportes);
});

//ruta para modificar a un deporte
app.get("/editar", (req, res) => {
  const { nombre, precio } = req.query;

  if (!nombre || !precio) {
    return res.send("Ingrese nombre y precio del deporte.");
  }
  if (isNaN(parseFloat(precio))) {
    return res.send("El precio debe ser numerico.");
  }

  const data = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
  console.log("valor de data: ", data);
  const deportes = data.deportes;
  let busqueda = deportes.findIndex((elem) => elem.nombre == nombre);

  if (busqueda == -1) {
    console.log("El deporte: " + nombre + " no existe");
    return res.send("El deporte: " + nombre + " no existe");
  } else {
    deportes[busqueda].precio = precio;
    fs.writeFileSync("deportes.json", JSON.stringify(data));
  }

  res.send("Modificacion realizada con exito");
});

//ruta para eliminar a un deporte
app.get("/eliminar/:nombre", (req, res) => {
  const nombre = req.params.nombre;
  console.log(nombre);
  const data = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
  console.log("valor de data: ", data);
  const deportes = data.deportes;
  let busqueda = deportes.findIndex((elem) => elem.nombre == nombre);

  if (busqueda == -1) {
    console.log("El deporte: " + nombre + " no existe");
    return res.send("El deporte buscado no existe");
  } else {
    console.log("El deporte es: ", deportes[busqueda]);
    deportes.splice(busqueda, 1);
    fs.writeFileSync("deportes.json", JSON.stringify(data));
  }

  res.send("Eliminacion realizada con exito");
});

app.get("*", (req, res) => {
  res.status(400).send("Pagina no existente");
});
