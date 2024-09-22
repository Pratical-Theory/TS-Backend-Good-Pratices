## Index

1. **Creating an Express Project with TypeScript**

2. **Extending the `Express.Request` Object**

   2.1 **Locale Middleware**

3. **Working with Declaration Files**

4. **Using Declaration Files to Extend `Express.Request`**



## **1 - Creating an Express Project with TypeScript**
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


## Credits
[Express and Typescript declaration files to extend Request object by academeez](https://www.youtube.com/watch?v=W_tbNGERaKw&t=532s)