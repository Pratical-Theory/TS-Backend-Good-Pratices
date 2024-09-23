import createApplication, {
  type Application,
  type Request,
  type Response,
} from "express";

const app: Application = createApplication();

app.use((req: Request, res: Response, next) => {
  // Bad pattern ❌
  (req as any).locale = 'en'
})

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

app.listen(3000, () => {
  console.log("server started in port 3000");
});
