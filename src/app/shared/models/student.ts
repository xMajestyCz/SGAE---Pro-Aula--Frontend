import { UserData } from "./user.model";

export interface Student extends UserData{
    guardian: string;
}
