import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
//Add Product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const image2 = req.files.image1 && req.files.image1[0];
    const image1 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];
    const image5 = req.files.image5 && req.files.image5[0];

    const images = [image1, image2, image3, image4, image5].filter(
      (item) => item !== undefined
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true" ? true : false,
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error adding product", error });
  }
};

//List Products
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).send({ message: "Error listing products", error });
  }
};

//Remove Products
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    res.json({ success: false, message: "Error removing product", error });
  }
};

//Remove Single Products
const singleProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.body.id);
    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: "No product found" });
  }
};

export { addProduct, listProducts, removeProduct, singleProduct };
