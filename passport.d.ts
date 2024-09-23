// declare module 'passport' {
//     export const authenticate: (authenticateWith: string, options: any) => any
// }
import { User as MyUser } from "./user";
import * as passport from "passport";

declare global {
  namespace Express {
    export interface User extends MyUser {}
  }
}
