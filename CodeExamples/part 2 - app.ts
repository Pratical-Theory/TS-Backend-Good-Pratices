import createApplication, {
  json,
  urlencoded,
  type Application,
  type Request,
  type Response,
} from "express";
import cookieParser from "cookie-parser";

const app: Application = createApplication();

app.use(cookieParser());

// Content-Type: application/json
app.use(json());

// (non-alphanumeric) Content-Type: multipart/form-data
// (Otherwise) Content-Type: application/x-www-form-urlencoded
app.use(urlencoded());

app.get("/", (req: Request, res: Response) => {
  req.cookies;
  req.body;

  res.send("Hello world");
});

app.listen(3000, () => {
  console.log("server started in port 3000");
});
