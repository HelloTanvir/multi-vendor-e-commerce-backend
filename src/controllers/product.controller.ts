import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import Product, { IProduct } from '../models/product.model';

export const createProduct = async (req: Request, res: Response) => {
    try {
        const product = new Product({ vendorId: req.user._id, ...req.body });

        await product.save();

        res.status(200).json({
            data: product,
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            errors: {
                common: {
                    msg: error.message || 'Server error occured',
                },
            },
        });
    }
};

export const getSingleProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params as { productId: string };

        const product = await Product.findById(productId);

        res.status(200).json({
            data: product,
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            errors: {
                common: {
                    msg: error.message || 'Server error occured',
                },
            },
        });
    }
};

export const getProducts = async (req: Request, res: Response) => {
    try {
        let { page, size } = req.query as { page: string | number; size: string | number };

        if (!page) page = 1;
        if (!size) size = 10;

        const limit = +size;
        const skip = (+page - 1) * +size;

        const products = await Product.find().limit(limit).skip(skip);

        res.status(200).json({
            data: products,
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            errors: {
                common: {
                    msg: error.message || 'Server error occured',
                },
            },
        });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params as { productId: string };

        const { image, name, weight, regularPrice, salesPrice, inventory, description } =
            req.body as IProduct;

        const product = await Product.findOne({
            $and: [{ vendorId: req.user._id }, { _id: productId }],
        });

        if (!product) {
            throw new createHttpError.BadRequest('Invalid product id');
        }

        if (image) product.image = image;
        if (name) product.name = name;
        if (weight) product.weight = weight;
        if (regularPrice) product.regularPrice = regularPrice;
        if (salesPrice) product.salesPrice = salesPrice;
        if (inventory) product.inventory = inventory;
        if (description) product.description = description;

        await product.save();

        res.status(200).json({
            data: product,
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            errors: {
                common: {
                    msg: error.message || 'Server error occured',
                },
            },
        });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.body as { productId: string };

        const deletedProduct = await Product.findOneAndDelete({
            $and: [{ vendorId: req.user._id }, { _id: productId }],
        });

        if (!deletedProduct) {
            throw new createHttpError.BadRequest('Invalid product id');
        }

        res.status(200).json({
            message: 'product deleted successfully',
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            errors: {
                common: {
                    msg: error.message || 'Server error occured',
                },
            },
        });
    }
};
