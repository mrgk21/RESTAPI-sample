import React, { useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

//@jsx common elements
import Label from "../common/form_elements/label";
import Input from "../common/form_elements/input";
import SubmitButton from "../common/form_elements/submitButton";

const Register = ({}) => {
	const navigate = useNavigate();

	const authHeader = () => {
		return {
			headers: {
				"Access-Control-Allow-Origin": `${import.meta.env.VITE_BACKEND_IP}`,
				"Access-Control-Allow-Methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			},
		};
	};

	const handleRegister = async (e) => {
		e.preventDefault();
		const { target } = e;
		try {
			const { data } = await axios.post(
				`${import.meta.env.VITE_BACKEND_URI}/auth/register`,
				{
					user: target["user"].value,
					pass: target["pass"].value,
				},
				authHeader()
			);
			sessionStorage.setItem("accessToken", data.accessToken);
			sessionStorage.setItem("refreshToken", data.refreshToken);
			navigate("/");
		} catch (error) {
			console.log(error.response.data);
		}
	};

	return (
		<React.Fragment>
			<div className="d-flex flex-column container-sm">
				<p className="display-4">Register page</p>
				<form className="list-group-item" onSubmit={(e) => handleRegister(e)}>
					<Label htmlFor="userField" text="Enter userId:" />
					<Input id="userField" name="user" placeholder="Enter userId..." />
					<Label htmlFor="passField" text="Enter password:" />
					<Input type="password" id="passField" name="pass" placeholder="Enter pass..." />
					<SubmitButton text="Register" />
				</form>
				<Link to="../login" relative="path" className="me-auto">
					<small>Already have an account? Click here to login!</small>
				</Link>
				<p className="mt-2">
					<mark>!!Disclaimer!!</mark> If you are using the site for the first time, all
					the requests to the server will be blocked due to its SSL certificate being
					self-signed. To remedy this, please login via github first, where you will be
					redirected to a "Website is not secure" page. After clicking "I Accept the
					Risk", you will be logged into github and the site will function as intended.
					Please refer the README on my github to know more.
				</p>
			</div>
		</React.Fragment>
	);
};

export default Register;
