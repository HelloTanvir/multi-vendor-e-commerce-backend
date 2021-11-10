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
        const { productId } = req.body as { productId: string };

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

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find();

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
    interface UpdatedData extends IProduct {
        productId: string;
    }

    try {
        const { productId, image, name, weight, regularPrice, salesPrice, inventory, description } =
            req.body as UpdatedData;

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
