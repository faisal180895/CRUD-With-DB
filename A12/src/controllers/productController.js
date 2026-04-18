const Product = require("./src/models/Product");

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
    try {
        const { title, price, description, category } = req.body;

        if (!title || !price) {
            return res.status(400).json({
                success: false,
                message: "Title and Price are required"
            });
        }

        const product = await Product.create({
            title,
            price,
            description,
            category
        });

        res.status(201).json({
            success: true,
            data: product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET ALL PRODUCTS (Pagination + Search + Filter)
exports.getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const search = req.query.search || "";
        const category = req.query.category;

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

        res.status(200).json({
            success: true,
            data: products,
            total
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};