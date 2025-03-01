const express = require("express");
const Request = require("../models/Request");
const ImageKit = require("imagekit");
require("dotenv").config();

var imagekit = new ImageKit({
  publicKey: process.env.publicKey,
  privateKey: process.env.privateKey,
  urlEndpoint: process.env.urlEndpoint,
});
const router = express.Router();

const processImages = async (req, res, requestId) => {
  try {
    const request = await Request.findOne({ requestId });
    request.status = "processing";
    await request.save();

    const processedProducts = await Promise.all(
      request.products.map(async (product) => {
        const outputUrls = await Promise.all(
          product.inputImageUrls.map((inputUrl, index) =>
            uploadProcessedImage(inputUrl, index + 1)
          )
        );
        return {
          ...product._doc,
          outputImageUrls: outputUrls.filter((url) => url !== null),
        };
      })
    );
    request.status = "completed";
    request.products = processedProducts;

    await request.save();

    res.json({
      requestId,
      status: request.status,
      products: processedProducts,
    });
  } catch (error) {
    await Request.findOneAndUpdate({ requestId }, { status: "failed" });

    console.error("Processing error:", error);
    res.status(500).json({
      error: "Image processing failed",
      details: error.message,
    });
  }
};

const uploadProcessedImage = async (url, index) => {
  try {
    const res = await fetch(url);

    if (!res.body) throw new Error("Failed to fetch image");

    const uploadResponse = await imagekit.upload({
      file: res.body, // Stream directly instead of buffering
      fileName: `output-url-${index}.jpg`,
      folder: "/output-image",
    });

    return imagekit.url({ path: uploadResponse.filePath });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  router,
  processImages,
  uploadProcessedImage,
};
