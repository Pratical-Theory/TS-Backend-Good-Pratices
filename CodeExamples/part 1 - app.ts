import createApplication, {
  type Application,
  type Request,
  type Response,
} from "express";

const app: Application = createApplication();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

app.listen(3000, () => {
  console.log("server started in port 3000");
});
