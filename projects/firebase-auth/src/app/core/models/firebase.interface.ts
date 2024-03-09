import { UserCredential } from "@angular/fire/auth";

export interface IAuthWithProviderResponse {
    userCredential: UserCredential;
    isNewUser: boolean;
}