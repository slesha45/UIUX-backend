const path = require("path");
const packageModel = require("../models/packageModel");
const fs = require("fs");

const createPackage = async (req,res) => {
    const {packageTitle,packageDescription,packagePrice} = req.body;

    if (!packageTitle || !packageDescription || !packagePrice) {
        return res.status(400).json({
            "success": false,
            "message": "Please enter all fields"
        })
    }

    if (!req.files || !req.files.packageImage) {
        return res.status(400).json({
            "success": false,
            "message": "Image not found"
        })
    }

    const {packageImage}= req.files;

    const imageName = `${Date.now()}-${packageImage.name}`
    const imageUploadPath = path.join(__dirname, `../public/packageMain/${imageName}`)

    try {
        await packageImage.mv(imageUploadPath)

        const newPackage = new packageModel({
            packageTitle: packageTitle,
            packageDescription: packageDescription,
            packagePrice: packagePrice,
            packageImage:imageName
        });
        const package = await newPackage.save();
        res.status(201).json({
            "success": true,
            "message": "Package created successfully",
            data: package
        })    
    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": "Internal server error",
            "error": error
        })
    }
}

const getAllPackages = async (req,res) => {
    try {
        const allPackage = await packageModel.find({});
        res.status(201).json({
            "success": true,
            "message": "Package fetched successfully",
            "Package": allPackage
        })
    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": "Internal server error",
            "error": error
        })
    }
}

const getSinglePackage = async (req,res) => {
    const packageId = req.params.id;

    try {
        const package = await packageModel.findById(packageId);
        if (!package) {
            return res.status(400).json({
                "success": false,
                "message": "Package not found"
            })
        }

        package.views++;
        await package.save();

        res.status(201).json({
            "success": true,
            "message": "Package fetched successfully",
            "Package": package
        })
    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": "Internal server error",
            "error": error
        })
    }
}

const deletePackage = async (req,res) => {
    try {
        await packageModel.findByIdAndDelete(req.params.id);
        res.status(201).json({
            "success": true,
            "message": "Package deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": "Internal server error",
            "error": error
        })
    }
}

module.exports = {
    createPackage,
    getAllPackages,
    getSinglePackage,
    deletePackage
};