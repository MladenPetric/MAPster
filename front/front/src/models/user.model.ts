export interface User {
    sub: string;
    username: string;
    attributes: {
        email: string,
        given_name: string,
        family_name: string,
        birthdate: string,
    }
}