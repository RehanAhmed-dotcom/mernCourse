const express = require("express");
const { Product } = require("../models/product");
const { Category } = require("../models/category");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const fileName = file.originalname.split(" ").join("-");
    cb(null, fileName + "-" + Date.now());
  },
});

const uploadOptions = multer({ storage: storage });

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

router.put("/:id", async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
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
    },
    { new: true }
  );
  if (!product) return res.status(500).send("The product cannot be updated");

  res.send(product);
});

router.post(`/`, uploadOptions.single("image"), async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");
  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
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
router.delete("/:id", async (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "Product deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, message: err });
    });
});
module.exports = router;
