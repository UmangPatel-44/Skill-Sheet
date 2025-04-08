import { UserDetailApiResponse } from "./UserTypes";
export interface ProfileProps {
  user: { name: string; email: string };
  usersDetail: {
    birthDate: string;
    gender: string;
    joiningDate: string;
    qualifications: string;
    workedInJapan: boolean;
  };
  setUsersDetail: React.Dispatch<React.SetStateAction<{
    birthDate: string;
    gender: string;
    joiningDate: string;
    qualifications: string;
    workedInJapan: boolean;
  }>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (updatedDetails: UserDetailApiResponse) => Promise<void>;
}

export interface UserDetail {
    birthDate: string;
    gender: string;
    joiningDate: string;
    qualifications: string;
    workedInJapan: boolean;

};