export interface SingUpData {
    fullName: string,
    email: string,
    phoneNumber: string,
    password: string,
    confirmPassword: string
}

export interface Verify{
    email:string;
    code:string;
}