import { MDBContainer, MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";
import loginImage from "../assets/Tablet login-amico.png";
import { useLogin } from "../hooks/useAuth";

const Login = () => {
  const { email, setEmail, password, setPassword, role, setRole, users, handleSubmit,errors } = useLogin();

  return (
    <MDBContainer fluid className="p-3 my-5 h-custom">
      <MDBRow>
        <MDBCol col="8" md="5">
          <img src={loginImage} className="img-fluid" alt="Login Illustration" />
        </MDBCol>

        <MDBCol col="4" md="5" className="m-auto">
          <div className="d-flex flex-row align-items-center justify-content-center">
            <p className="lead fw-normal mb-0 me-3">Sign in</p>
          </div>
          <hr />

          {/* Role */}
          <div className="mb-4">
            <label className="form-label"htmlFor="role">Role</label>
            <select
              className={`form-select ${errors.role ? "is-invalid" : ""}`}
              value={role}
              id="role"
              onChange={(e) => setRole(e.target.value as "User" | "Admin")}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
            {errors.role && <div className="invalid-feedback">{errors.role}</div>}
          </div>

          {/* Email */}
          <div className="mb-4" 
          >
            <label className="form-label"htmlFor="email">Email</label>
            <select
              className={`form-select ${errors.email ? "is-invalid" : ""}`}
              value={email} 
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            >
              <option value="">Select Email</option>
              {users.map((userEmail) => (
                <option key={userEmail} value={userEmail}>
                  {userEmail}
                </option>
              ))}
            </select>
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          {/* Password */}
          <label className="form-label"htmlFor="password">Password</label>
          <MDBInput
            wrapperClass={`mb-1 ${errors.password ? "is-invalid" : ""}`}
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <div className="text-danger mb-2">{errors.password}</div>}


          {/* Submit Button */}
          <div className="text-center text-md-start mt-4 pt-2">
            <button
              type="submit"
              className="btn btn-primary"
              style={{ backgroundColor: "#63A18F", fontSize: "1.25rem", padding: "0.5rem 2rem" }}
              onClick={handleSubmit}
            >
              Login
            </button>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Login;
