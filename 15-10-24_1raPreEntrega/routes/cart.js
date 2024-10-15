const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const cartsFilePath = path.join(__dirname, "../data/carts.json");
const productsFilePath = path.join(__dirname, "../data/products.json");

// Leer carritos del archivo JSON
const readCarts = () => {
  const data = fs.readFileSync(cartsFilePath, "utf8");
  return JSON.parse(data);
};

// Guardar carritos en el archivo JSON
const writeCarts = (carts) => {
  fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
};

// Leer productos del archivo JSON
const readProducts = () => {
  const data = fs.readFileSync(productsFilePath, "utf8");
  return JSON.parse(data);
};

// Ruta POST / (crear nuevo carrito)
router.post("/", (req, res) => {
  const carts = readCarts();
  const newCart = {
    id: (carts.length + 1).toString(), // Generación de ID único
    products: [],
  };

  carts.push(newCart);
  writeCarts(carts);

  res.status(201).json(newCart);
});

// Ruta GET /:cid (obtener productos de un carrito)
router.get("/:cid", (req, res) => {
  const carts = readCarts();
  const cart = carts.find((c) => c.id === req.params.cid);

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(cart.products);
});

// Ruta POST /:cid/product/:pid (agregar producto a un carrito)
router.post("/:cid/product/:pid", (req, res) => {
  const carts = readCarts();
  const products = readProducts();
  const cart = carts.find((c) => c.id === req.params.cid);
  const product = products.find((p) => p.id === req.params.pid);

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const cartProduct = cart.products.find((p) => p.product === product.id);

  if (cartProduct) {
    cartProduct.quantity += 1;
  } else {
    cart.products.push({ product: product.id, quantity: 1 });
  }

  writeCarts(carts);

  res.status(201).json(cart);
});

module.exports = router;
