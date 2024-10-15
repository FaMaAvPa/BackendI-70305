const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const productsFilePath = path.join(__dirname, "../data/products.json");

// Leer productos del archivo JSON
const readProducts = () => {
  const data = fs.readFileSync(productsFilePath, "utf8");
  return JSON.parse(data);
};

// Guardar productos en el archivo JSON
const writeProducts = (products) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

// Ruta raíz GET / (listado de productos, con limit opcional)
router.get("/", (req, res) => {
  const products = readProducts();
  const limit = parseInt(req.query.limit) || products.length;
  res.json(products.slice(0, limit));
});

// Ruta GET /:pid (producto por ID)
router.get("/:pid", (req, res) => {
  const products = readProducts();
  const product = products.find((p) => p.id === req.params.pid);
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  res.json(product);
});

// Ruta POST / (agregar nuevo producto)
router.post("/", (req, res) => {
  const products = readProducts();
  const { title, description, code, price, stock, category, thumbnails } =
    req.body;

  if (
    !title ||
    !description ||
    !code ||
    !price ||
    stock === undefined ||
    !category
  ) {
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios, excepto thumbnails" });
  }

  const newProduct = {
    id: (products.length + 1).toString(), // Generación de ID único
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails: thumbnails || [],
  };

  products.push(newProduct);
  writeProducts(products);

  res.status(201).json(newProduct);
});

// Ruta PUT /:pid (actualizar producto)
router.put("/:pid", (req, res) => {
  const products = readProducts();
  const productIndex = products.findIndex((p) => p.id === req.params.pid);

  if (productIndex === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const { id, ...updatedFields } = req.body; // No permitir actualizar el ID
  products[productIndex] = { ...products[productIndex], ...updatedFields };

  writeProducts(products);

  res.json(products[productIndex]);
});

// Ruta DELETE /:pid (eliminar producto)
router.delete("/:pid", (req, res) => {
  let products = readProducts();
  const productIndex = products.findIndex((p) => p.id === req.params.pid);

  if (productIndex === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  products.splice(productIndex, 1);
  writeProducts(products);

  res.json({ message: "Producto eliminado correctamente" });
});

module.exports = router;
