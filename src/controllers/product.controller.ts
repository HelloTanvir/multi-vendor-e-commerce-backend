import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import Product, { IProduct } from '../models/product.model';
import s3 from '../utils/s3';

export const createProduct = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            throw new createHttpError.BadRequest('Product image is required');
        }

        const product = new Product({
            vendorId: req.user._id,
            image: (req.file as any).location,
            s3Key: (req.file as any).key,
            ...req.body,
        });

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
            page,
            size,
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

        const { name, regularPrice, salesPrice, inventory, description } = req.body as IProduct;

        const product = await Product.findOne({
            $and: [{ vendorId: req.user._id }, { _id: productId }],
        });

        if (!product) {
            if (req.file && (req.file as any).key) {
                await s3
                    .deleteObject({
                        Bucket: 'sellbeez-products',
                        Key: (req.file as any).key,
                    })
                    .promise();
            }

            throw new createHttpError.BadRequest('Invalid product id');
        }

        // delete previous image and edit new image link in database
        if (req.file && (req.file as any).key) {
            await s3
                .deleteObject({
                    Bucket: 'sellbeez-products',
                    Key: product.s3Key,
                })
                .promise();

            product.image = (req.file as any).location;
        }
        if (name) product.name = name;
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
        const { productId } = req.params as { productId: string };

        const deletedProduct = await Product.findOneAndDelete({
            $and: [{ vendorId: req.user._id }, { _id: productId }],
        });

        if (!deletedProduct) {
            throw new createHttpError.BadRequest('Invalid product id');
        }

        await s3
            .deleteObject({
                Bucket: 'sellbeez-products',
                Key: deletedProduct.s3Key,
            })
            .promise();

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
