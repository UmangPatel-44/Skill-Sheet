import { useState, useEffect } from "react";
import { UserDetail } from "../data/types/ProfileProps";

interface UseProfileFormProps {
  initialUserDetail: UserDetail;
  handleSubmit: () => void;
}

const useProfileForm = ({ initialUserDetail, handleSubmit }: UseProfileFormProps) => {
  const [usersDetail, setUsersDetail] = useState<UserDetail>(initialUserDetail);
  const [errors, setErrors] = useState({
    birthDate: "",
    joiningDate: "",
    gender: "",
    qualifications: "",
  })
  useEffect(() => {
    setUsersDetail(initialUserDetail);
  }, [initialUserDetail]);

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { birthDate: "", joiningDate: "", gender: "", qualifications: "" };

    if (!usersDetail.birthDate) {
      newErrors.birthDate = "Birthdate is required.";
      valid = false;
    } else if (new Date(usersDetail.birthDate) > new Date()) {
      newErrors.birthDate = "Birthdate cannot be in the future.";
      valid = false;
    }

    if (!usersDetail.joiningDate) {
      newErrors.joiningDate = "Joining date is required.";
      valid = false;
    } else if (new Date(usersDetail.joiningDate) > new Date()) {
      newErrors.joiningDate = "Joining date cannot be in the future.";
      valid = false;
    }

    if (!usersDetail.gender.trim()) {
      newErrors.gender = "Gender is required.";
      valid = false;
    }

    if (!usersDetail.qualifications.trim()) {
      newErrors.qualifications = "Qualification is required.";
      valid = false;
    }
    if(!isValidBirthdate(usersDetail.birthDate))
      {
          errors.birthDate="User must be at least of 18 years old."
      }
    if (!JoinDateDiffrence(new Date(usersDetail.birthDate), new Date(usersDetail.joiningDate))) {
          errors.joiningDate = "Joining Date must be at least 20 years after Birthdate.";
      }
    if(!isValidGender(usersDetail.gender))
        {
            errors.gender="Please Enter either Male or Female"
        }
    setErrors(newErrors);
    return valid;
  };
  const JoinDateDiffrence = (birthDate: Date, joiningDate: Date): boolean => {
    const yearDiff = joiningDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = joiningDate.getMonth() - birthDate.getMonth();
    const dayDiff = joiningDate.getDate() - birthDate.getDate();

    if (yearDiff > 20) return true;
    if (yearDiff === 20 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0))) return true;
    
    return false;
};
const isValidBirthdate = (birthDate: string): boolean => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    // Calculate age
    const age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    const dayDiff = today.getDate() - birthDateObj.getDate();

    // Adjust age if birthdate hasn't occurred this year yet
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        return age - 1 >= 18;
    }

    return age >= 18;
};
const isValidGender=(gender:string)=>
{
    if(gender!="Male"&&gender!="Female"&&gender!="male"&&gender!="female")
    {
        return false;
    }
    else if(gender==="male")
    {
        usersDetail.gender="Male";
    }
    else if(gender==="female")
    {
        usersDetail.gender="Female";
    }
        return true;
    
}
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUsersDetail((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = () => {
    if (validateForm()) {
      handleSubmit();
    }
  };

  return {
    usersDetail,
    errors,
    getTodayDate,
    handleChange,
    onSubmit,
  };
};

export default useProfileForm;
