const express = require("express");
const app = express();
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");
const PORT = 8080;

app.use(express.json());

// Rutas principales
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
