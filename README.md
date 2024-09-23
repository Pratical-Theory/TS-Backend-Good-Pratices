# Express and Typescript declaration files to extend Request object
## Index 

1. **Creating an Express Project with TypeScript**

2. **Extending the `Express.Request` Object**

   2.1 **Locale Middleware (creating our own middleware)**

3. **Working with Declaration Files**

4. **Using Declaration Files to Extend `Express.Request`**

5. **Using JavaScript libraries in TypeScript**

6. **Using DefinitelyType for TypeScript**

   6.1 **Implement declaration file**

7. **How do we feed Typescript with a declaration file**

## 1 - Creating an Express Project with TypeScript
You know the use the package manger of your choice in my case `pnpm`.

So start the project with your favorite package manger `pnpm init` or `npm init --yes` or `yarn init`. Proceed to install express and typescript with our package manager using the flag `-D` or `--save-dev`, because we won't be using TS in production; this behavior also applies to any kind of library that will only be used in the phase of development such as `prettier`, `eslint` and `@types` files; and create your `tsconfig.json` file: 
 ```bash
 pnpm i -D typescript
 npx tsc --init # create tsconfig.json file
 ```
Inside `tsconfig.json` set `sourceMap: true`, to allow us to debug TS in vscode: 
```json
{
    "compilerOptions": {
         "sourceMap": true,   /* Create source map files for emitted JavaScript files. */
    }
}
```

 Now we proceed to install the packages that we'll be using in production:
 ```bash
 pnpm i express
 ```
 And dev dependencies:
 ```bash
 pnpm i -D @types/express
 ```

 Proceed to run the server with `npx tsc -w`; `npx` help us to run commands from an `npm` package (either one installed locally or fetched remotely). 
 `tsc` it's the typescript compiler and with the flag `-w` we tell the TS compiler to watch any change, so it recompile our files.
```bash
npx tsc -w
```

Create a simple server that return an hello world message to the user. Add a breakpoint in some important part of the code like I did it in `res.send("Hello world");` and run the debugger, you'll be able to see the return inside `localhost:3000`.

After that, add types by checking what types our editor recommends based on the inference for the application. Just remember, you can see the types by ctrl+clicking on them and selecting "Reveal in Explorer" to see their location on the tab of your file. You can also see how Express is using these types in our app. And we'll be done with this section.

Types may look like this:
```ts
import createApplication, {type Application, type Request, type Response} from "express";

const app: Application = createApplication();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

app.listen(3000, () => {
  console.log("server started in port 3000");
});
```

Going to definitions to read better libraries looks like this:
![going to definitions - file tab](https://raw.githubusercontent.com/Pratical-Theory/TS-Backend-Good-Pratices/refs/heads/main/img/example-1.gif)

## 2. **Extending the `Express.Request` Object**
   - It's common pattern in __Express__ that a __Middleware__ will attach data to the __Request__ object.
   - That data can be accessed by __Middlewares__ that are invoked after the __Middleware__ that added that data, like:
   ```ts
   app.get("/", (req, res) => {
    req.cookies;
    req.body;
    req.session;
   })
   ```
Proceed to install and import `cookie-parser` and it's types so express can work with this packages because it's pure javascript:
```bash
pnpm i cookie-parser
```
```bash
pnpm i -D @types/cookie-parser
```

With this code now we call understand that __it's a common pattern in express__ that the __middleware__ will attach that data to the`request` object:
```ts
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
  req.cookies; // express attaching data to the object
  req.body;    // express attaching data to the object

  res.send("Hello world");
});

app.listen(3000, () => {
  console.log("server started in port 3000");
});
```

## 2.1 Locale Middleware (creating our own middleware)
Now we'll create a custom middleware for localizations.

It can be common to see this kind of code, but it's a bad practice, since it can provoke runtime errors only because we wanted to avoid a compilation error:
```ts
app.use((req: Request, res: Response, next) => {
  // Bad pattern ❌
  (req as any).locale = 'en';
  next();
})
```

## 3. Working with Declaration Files
 - Using declaration merging we can add properties to a custom type:
 ```ts
 export declare global{
  namespace FOO{
    const bar: string;
  }
 }
 ```
## 4. Using Declaration Files to Extend `Express.Request`

Now we've to use declaration merging to expand the default interface of `Express.Request`:
```ts
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      locale: "en" | "es" | "fr" | "ch";
    }
  }
}
```

## 5. **Using JavaScript libraries in TypeScript**

I'll be using `passport` library but without the it's types, this will behave as an JavaScript library; in case you compiled you'll get an error TS saying that doesn't understand passport:

```ts
import passport from "passport";

app.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req: Request, res: Response) => {
    res.send("Hello world");
  }
);
```
Compilation error:
```ts
app.ts:6:22 - error TS7016: Could not find a declaration file for module 'passport'. '/home/raulpenate/Documents/ts-backend-good-practices/node_modules/.pnpm/passport@0.7.0/node_modules/passport/lib/index.js' implicitly has an 'any' type.
  Try `npm i --save-dev @types/passport` if it exists or add a new declaration (.d.ts) file containing `declare module 'passport';`

6 import passport from "passport";
```

We can create their types like this, and now the code will run without issues.
```ts
declare module 'passport' {
    export const authenticate: (authenticateWith: string, options: any) => any
}
```

Now our previous, `(req as any).locale` will work as `req.local` as it should be, but it'll only accept for `locale: "en" | "es" | "fr" | "ch"` other types or string will throw a compilation error. For example if i assign `english`:
```bash
app.ts:10:3 - error TS2322: Type '"english"' is not assignable to type '"en" | "es" | "fr" | "ch"'.

10   req.locale = "english";
     ~~~~~~~~~~
     
Found 1 error. Watching for file changes.
```
A last detail it's that you don't need to add some option to allow this behavior, typescript does it automatically.

## 6. Using DefinitelyType for TypeScript
 - Most of thi time you won't be needing to write the declaration files yourself.
 - There is a popular open source project called **DefinitelyType** that the community can create declaration files for libraries.
 - Those declaration files are installed with `pnpm i -D @types/<package-manager>`.

Let's install `@types/passport` and examine the passport declaration files:
```bash
pnpm i -D @types/passport
```
And if you check `passport.d.ts` (passport declaration type), you'll see that they're actually rewriting the interface; Or as it should be called, they're doing declaration merging:
```ts
declare global {
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface AuthInfo {}
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface User {}

        interface Request {
            authInfo?: AuthInfo | undefined;
            user?: User | undefined;

            // These declarations are merged into express's Request type
            /**
             * Initiate a login session for `user`.
             *
             * Options:
             *   - `session`  Save login state in session, defaults to `true`.
             *
             * Examples:
             *
             *     req.logIn(user, { session: false });
             *
             *     req.logIn(user, function(err) {
             *       if (err) { throw err; }
             *       // session saved
             *     });
             */
            login(user: User, done: (err: any) => void): void;
            login(user: User, options: passport.LogInOptions, done: (err: any) => void): void;
            /**
             * Initiate a login session for `user`.
             *
             * Options:
             *   - `session`  Save login state in session, defaults to `true`.
             *
             * Examples:
             *
             *     req.logIn(user, { session: false });
             *
             *     req.logIn(user, function(err) {
             *       if (err) { throw err; }
             *       // session saved
             *     });
             */
            logIn(user: User, done: (err: any) => void): void;
            logIn(user: User, options: passport.LogInOptions, done: (err: any) => void): void;

            /**
             * Terminate an existing login session.
             */
            logout(options: passport.LogOutOptions, done: (err: any) => void): void;
            logout(done: (err: any) => void): void;
            /**
             * Terminate an existing login session.
             */
            logOut(options: passport.LogOutOptions, done: (err: any) => void): void;
            logOut(done: (err: any) => void): void;

            /**
             * Test if request is authenticated.
             */
            isAuthenticated(): this is AuthenticatedRequest;
            /**
             * Test if request is unauthenticated.
             */
            isUnauthenticated(): this is UnauthenticatedRequest;
        }

        interface AuthenticatedRequest extends Request {
            user: User;
        }

        interface UnauthenticatedRequest extends Request {
            user?: undefined;
        }
    }
}
// ... And more code
```

## 6.1 Implement declaration file
Proceed to add to `req.user.firstName`:

```ts
app.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req: Request, res: Response) => {
    req.user?.firstName
    res.send("Hello world");
  }
);
```

Create the class `User`:
```ts
export class User {
    firstName: string;
    lastName: string;
    age: number;
}
```

and `implement` it in your definition type `passport.d.ts` file:
```ts
import { User as MyUser } from "./user";
import * as passport from "passport";

declare global {
  namespace Express {
    export interface User extends MyUser {}
  }
}
```

## 7. How do we feed Typescript with a declaration file
In the `tsconfig.json` there are a few options that we can use to include declaration files:
 - `include`: pattern to include you can specify certain `*d.ts` files.
 - `files`: files to include you can specify certain `*d.ts` files.
 - `typRoots`: default to `@types` folder.

## Extra tips
### 1. `.gitginore`
As a good practice when you're using `npx tsc -w` or generally compiling your ts files to js, in your git repo add those files to `.gitignore` with a `*.js` and `*.js.map` so you don't save that unnecessary data. Your `.gitignore` should look like this:
```
node_modules
*.js
*.js.map
```

### 2. `createApplication`

```ts
import createApplication from "express";
const app: Application = createApplication();
```

```ts
import express from "express";
const app: Application = express();
```
In terms of performance and execution, both approaches are identical after transpilation. The choice comes down to readability and code style rather than any functional difference.

### 3. `strictPropertyInitialization`
You can turn off that property inside `tsconfig.json` to make let TypeScript know that you don't need to initialize attributes.
```ts
export class User {
    firstName: string;
    lastName: string;
    age: number;
}
```

## Conclusions
 - There is really no need to do something like `(req as any).myData`.
 - If you want to access some data on the Express Request object take the time to teach typescript about that additional data.
 - You can use declaration files to teach typescript about new stuff and to extend the express request object.

## Credits
[Express and Typescript declaration files to extend Request object by academeez](https://www.youtube.com/watch?v=W_tbNGERaK)

## How to run this project?
```bash
pnpm install
npx tsx -w
```