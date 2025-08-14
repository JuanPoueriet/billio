export interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    organizationName: string;
    rnc?: string;
    recaptchaToken?: string;
    plan?: string;
    
}