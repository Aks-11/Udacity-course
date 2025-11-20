import express from "express";
import { filterImageFromURL, deleteLocalFiles, validURL } from "../util/util.js";
import { HttpStatusCode } from "axios";

const router = express.Router();
router.get("/filteredimage", async (req, res) => {
    const {image_url}  = req.query;
    console.log(image_url);
    if (!image_url) {
        return res.status(400).send({ HttpStatusCode:400,message: "image_url query parameter is required" });
    }
    if ( typeof image_url !== 'string' ) {
        return res.status(400).send({ message: "image_url must be a string" });
    }
    const image_buffer = await validURL(image_url);
    console.log(image_buffer);
    if ( image_buffer=== false) {
        return res.status(400).send({ message: "image_url must be a valid URL" });
    }
    try {
        const filteredImagePath = await filterImageFromURL(image_buffer);
        console.log(filteredImagePath);
        res.status(200).sendFile(filteredImagePath, {}, async (err) => {
            if (err) {
                console.error(err);
                res.status(500).send({ message: "Error sending the file" });
            } else {
                console.log("File sent successfully:", filteredImagePath);
                await deleteLocalFiles([filteredImagePath]);

            }
        });
    } catch (error) {
        console.error(error);
        res.status(422).send({ message: "Unable to process the image at the provided URL" });
    }       
});
export default router;

