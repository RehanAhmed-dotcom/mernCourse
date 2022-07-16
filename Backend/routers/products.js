const express = require("express");
const { Product } = require("../models/product");
const { Category } = require("../models/category");
const router = express.Router();
//${api}/products
router.get(`/`, async (req, res) => {
  const productList = await Product.find();
  res.send(productList);
});
router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  if (!product) {
    res.status(500).send("Product not found");
  }
  res.send(product);
});
//${api}/products
// router.post("/", async (req, res) => {
//   let category = new Category({
//     name: req.body.name,
//     icon: req.body.icon,
//     color: req.body.color,
//   });
//   category = await category.save();
//   if (!category) {
//     res.status(404).send("The category cannot be created");
//   }
//   res.send(category);
//   // category
//   //   .save()
//   //   .then((CreatedCategory) => {
//   //     res.status(201).json(CreatedCategory);
//   //   })
//   //   .catch((err) => {
//   //     res.status(500).json({
//   //       error: err,
//   //       success: false,
//   //     });
//   //   });
// });
router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save();
  if (!product) {
    return res.status(500).send("The product cannot be created");
  }
  res.send(product);
  // res.send(newProduct);
});
module.exports = router;
