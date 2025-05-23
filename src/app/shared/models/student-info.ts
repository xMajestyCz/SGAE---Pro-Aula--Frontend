export interface StudentInfo {
      id: number;
  id_card: string;
  first_name: string;
  second_name: string | null;
  first_lastname: string;
  second_lastname: string | null;
  birthdate: string;
  place_of_birth: string;
  address: string;
  phone: string;
  email: string;
  image: string | null;
  user: number;
  guardian: number | null; // <--- ¡Este es el tipo clave!
  enrollment: number | null;
}
