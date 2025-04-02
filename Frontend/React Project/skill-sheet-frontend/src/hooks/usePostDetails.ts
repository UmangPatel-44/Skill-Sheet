import { useState, useEffect } from "react";
import { fetchUser } from "../services/userService";
import { addUserDetails } from "../services/userService";
import { UserApiResponse } from "../data/types/UserTypes";

export const usePostDetails = (navigate: any) => {
    const [user, setUser] = useState<UserApiResponse>({ userId: 0, name: "", email: "" });
    const userId = parseInt(localStorage.getItem("userId") || "0", 10);
    const [formData, setFormData] = useState({
        userId,
        gender: "",
        birthDate: "",
        joiningDate: "",
        qualifications: "",
        workedInJapan: "true",
        photoPath: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await fetchUser();
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };
        fetchData();
    }, []);

    const validateForm = (formData: any) => {
        const errors: Record<string, string> = {};
        if (!formData.gender.trim()) errors.gender = "Gender is required.";
        if (!formData.birthDate) errors.birthDate = "Birthdate is required.";
        if(new Date(formData.birthDate)>new Date(formData.joiningDate))
        {
            errors.joiningDate="Joining Date cannot be more than Birthdate"
        }
        if(!isValidBirthdate(formData.birthDate))
        {
            errors.birthDate="User must be at least of 18 years old."
        }
        if (!JoinDateDiffrence(new Date(formData.birthDate), new Date(formData.joiningDate))) {
            errors.joiningDate = "Joining Date must be at least 20 years after Birthdate.";
        }
        if (!formData.joiningDate) errors.joiningDate = "Joining Date is required.";
        if (!formData.qualifications.trim()) errors.qualifications = "Qualification is required.";
        if(!isValidGender(formData.gender))
        {
            errors.gender="Please Enter either Male or Female"
        }
        return errors;
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
            formData.gender="Male";
        }
        else if(gender==="female")
        {
            formData.gender="Female";
        }
            return true;
        
    }
    const getTodayDate = () => 
        {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months start at 0!
            const dd = String(today.getDate()).padStart(2, "0");
            return `${yyyy}-${mm}-${dd}`;
          };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: id === "workedInJapan" ? value === "true" : value }));
    };

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Authentication failed. Please log in again.");
                return;
            }

            await addUserDetails(formData, token);
            alert("User Details added successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return { user, formData, handleChange, handlePost, errors,getTodayDate };
};
