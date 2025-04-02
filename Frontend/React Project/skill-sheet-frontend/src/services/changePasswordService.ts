export const changeUserPassword = async (
    email: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> => {
    const token = localStorage.getItem("token");
  
    const response = await fetch(
      `https://localhost:7052/api/User/changePassword/${email}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, oldPassword, newPassword }),
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to change password. Please check your old password.");
    }
  };
  