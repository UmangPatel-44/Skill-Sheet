export interface ProfileProps {
    user: { name: string; email: string };
    usersDetail: {
      birthDate: string;
      gender: string;
      joiningDate: string;
      qualifications: string;
      workedInJapan: boolean;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleSubmit: () => void;
  }
  