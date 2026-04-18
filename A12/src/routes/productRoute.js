const express = require("express");
const router = express.Router();
const Product = require("../models/Product");


// GET all products (pagination + search + filter)
router.get("/", async (req, res) => {
    try {
        const search = req.query.search || "";
        const category = req.query.category;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        let query = {
            title: { $regex: search, $options: "i" }
        };

        if (category) {
            query.category = category;
        }

        const products = await Product.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments(query);

        res.json({
            page,
            totalPages: Math.ceil(total / limit),
            total,
            data: products
        });

    } catch (err) {
        res.status(500).json(err);
    }
});


// GET single product
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);

    } catch (err) {
        res.status(500).json(err);
    }
});


// ADD product
router.post("/", async (req, res) => {
    try {

        if (!req.body.title || !req.body.price) {
            return res.status(400).json({
                message: "title and price required"
            });
        }

        const product = new Product(req.body);
        await product.save();

        res.status(201).json(product);

    } catch (err) {
        res.status(500).json(err);
    }
});


// UPDATE product
router.put("/:id", async (req, res) => {
    try {

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);

    } catch (err) {
        res.status(500).json(err);
    }
});


// DELETE product
router.delete("/:id", async (req, res) => {
    try {

        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({ message: "Deleted successfully" });

    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;