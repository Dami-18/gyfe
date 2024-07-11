import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "./url";
import { UserContext } from "../app-context/user-context";
import { toast, Toaster } from "react-hot-toast";

const schema = yup.object().shape({
  securityAnswer: yup.string().required("Security answer is required!"),
  otp: yup
    .string()
    .required("OTP is required")
    .matches(/^\d{6}$/, "Please enter valid 6-digit OTP!"),
});

interface IFormInput {
  securityAnswer: string;
  otp: string;
}

const SecurityQueForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<IFormInput>({ resolver: yupResolver(schema) });
  const { user, updateState } = useContext(UserContext);
  const [isAnswered, setIsAnswered] = useState(false);

  const getOTP = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault(); // To Prevent reload

    const isValid = await trigger("securityAnswer");

    if (!isValid) {
      return; // If validation fails, do not proceed
    }

    const securityAns = getValues("securityAnswer");
    // const passwd = sessionStorage.getItem("passwd"); // hadnle the hashed password
    updateState({ user: { ...user, securityAns } });

    // Test if global state works
    console.log(user?.roll);
    console.log(user?.password);
    console.log(user?.securityQue);
    console.log(user?.securityAns);

    const formData = new URLSearchParams();
    formData.append("roll_number", user?.roll || "");
    formData.append("password", user?.password || "");
    formData.append("secret_answer", securityAns);

    try {
      const response = await fetch(`${BACKEND_URL}/request-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Session-Token": sessionStorage.getItem("SESSION_TOKEN") || "",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log(responseData.message);
      setIsAnswered(true);
      toast.success("OTP sent successfully to ERP registered email id!");
    } catch (error) {
      console.error("Error fetching OTP:", error);
      toast.error("Error fetching OTP!");
    }
  };

  const navigate = useNavigate();

  const onSubmit = async () => {
    const otp1 = getValues("otp");
    const login_data = new URLSearchParams();
    login_data.append("roll_number", user?.roll || "");
    login_data.append("password", user?.password || "");
    login_data.append("secret_answer", user?.securityAns || "");
    login_data.append("otp", otp1);

    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Session-Token": sessionStorage.getItem("SESSION_TOKEN") || "",
        },
        body: login_data.toString(),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log(responseData.message);

      updateState({ user: { ...user, isLoggedIn: true } }); // set global state isLoggedIn to true
      sessionStorage.setItem("ssoToken", responseData.ssoToken);
      toast.success("Successfully logged in to ERP!");

      // updateStatus();
      navigate("/");
    } catch (error) {
      console.error("User not logged in", error);
      toast.error(
        "Error logging to ERP! Please try again and ensure to enter correct credentials",
      );
      navigate("/login"); // redirecting back to /login
    }
  };

  return (
    <div className="security-form">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <Toaster position="bottom-center" />
        <div className="question">
          <label>{user?.securityQue}: </label>
          <input
            type="text"
            placeholder="Enter your answer"
            className="input-box box"
            {...register("securityAnswer")}
          ></input>
          {errors.securityAnswer && (
            <p style={{ color: "red" }}>{errors.securityAnswer.message}</p>
          )}
        </div>
        <div className="otp-box">
          <label>Enter OTP</label>
          <input
            type="text"
            placeholder="Enter OTP sent to email"
            className="input-box box"
            {...register("otp")}
            disabled={!isAnswered}
            style={isAnswered ? { cursor: "text" } : { cursor: "not-allowed" }}
          ></input>
          {errors.otp && <p style={{ color: "red" }}>{errors.otp.message}</p>}
        </div>
        {isAnswered ? (
          <div>
            <button className="login-btn" type="submit">
              Login
            </button>
          </div>
        ) : (
          <div>
            <button className="otp" onClick={getOTP}>
              Send OTP
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SecurityQueForm;
