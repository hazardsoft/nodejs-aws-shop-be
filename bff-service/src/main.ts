import express, { Express, Request, Response } from "express";
import cors from "cors";
import axios from "axios";
import "dotenv/config";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors());

const port = process.env.PORT || 3000;
const envKeys = Object.keys(process.env);

app.all("/:service", (req: Request, res: Response) => {
  const serviceName = req.params.service;
  if (!envKeys.includes(serviceName)) {
    res.status(502).send({
      message: `Service "${serviceName}" not found`,
    });
    return;
  }

  axios({
    url: process.env[serviceName],
    method: req.method,
    headers: req.headers.authorization
      ? { Authorization: req.headers.authorization }
      : {},
    params: req.query,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    data: req.body ? req.body : null,
  })
    .then((response) => {
      res.status(response.status).send(response.data);
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send({
        message: `Could not complete request`,
      });
    });
});

app.listen(port, () => {
  console.log(`Bff app listening on port ${port}`);
});
