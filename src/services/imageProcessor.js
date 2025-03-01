const express = require("express");
const Request = require("../models/Request");
const ImageKit = require("imagekit");
require("dotenv").config();

const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 600 });

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
          product.inputImageUrls.map(async (inputUrl, index) => {
            const cacheKey = `${inputUrl}:${index + 1}`;
            const result = await uploadProcessedImage(
              inputUrl,
              parseInt(index + 1)
            );
            cache.set(cacheKey, result);
            const cached = cache.get(cacheKey);
            return cached;
          })
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
    const arrBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrBuffer, "binary");
    cache.set("buffer", buffer);
    const uploadResponse = await imagekit.upload({
      file: cache.get("buffer"),
      fileName: `output-url-${index}.jpg`,
      folder: "/output-image",
    });

    return imagekit.url({ path: uploadResponse.filePath });
  } catch (err) {
    console.error("Error processing image:", err);
  }
};

module.exports = {
  router,
  processImages,
  uploadProcessedImage,
};
