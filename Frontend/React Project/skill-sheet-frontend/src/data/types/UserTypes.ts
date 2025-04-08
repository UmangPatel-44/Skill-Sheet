export interface UserDetailApiResponse {
    userId: number;
    gender: "Male" | "Female" | "Other";
    birthDate: string;
    joiningDate: string;
    qualifications: string;
    workedInJapan: boolean;
    photoPath: string;
  }
  
  export interface UserApiResponse {
    userId: number;
    name: string;
    email: string;
  }
  export interface TestUserApiResponse {
    userId: number;
    name: string;
    email: string;
    role: string;
  }