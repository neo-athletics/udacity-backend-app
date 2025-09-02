import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util.js";

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}");
});

app.get("/filteredimage", async (req, res) => {
  const { image_url } = req.query;
  if (!image_url) {
    return res.status(400).send({ message: "image_url is required" });
  }

  try {
    const filteredImagePath = await filterImageFromURL(image_url);
    res.sendFile(filteredImagePath, {}, (err) => {
      if (err) {
        res.status(500).send({ message: "Error sending the file" });
      } else {
        deleteLocalFiles([filteredImagePath]);
      }
    });
  } catch (error) {
    res
      .status(422)
      .send({ message: "Unable to process the image at the provided URL" });
  }
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});
