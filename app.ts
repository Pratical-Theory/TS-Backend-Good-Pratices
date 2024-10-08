import createApplication, {
  type Application,
  type Request,
  type Response,
} from "express";
import passport from "passport";

const app: Application = createApplication();

app.use((req: Request, res: Response, next) => {
  req.locale = "en";
  next();
});

app.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req: Request, res: Response) => {
    req.user?.firstName
    res.send("Hello world");
  }
);

app.listen(3000, () => {
  console.log("server started in port 3000");
});
