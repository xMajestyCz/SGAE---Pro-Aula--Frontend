export interface UserData {
    id?: number;
    first_name: string;
    second_name?: string;
    first_lastname: string;
    second_lastname: string;
    id_card: string;
    birthdate: string;
    place_of_birth: string;
    address: string;
    phone: string;
    email: string;
    image: string | null;
}