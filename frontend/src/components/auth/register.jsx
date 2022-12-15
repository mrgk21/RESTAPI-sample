import React, { useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

//@jsx common elements
import Label from "../common/form_elements/label";
import Input from "../common/form_elements/input";
import SubmitButton from "../common/form_elements/submitButton";

const Register = ({}) => {
	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();
		const { target } = e;
		try {
			const { data } = await axios.post("http://localhost:3000/auth/register", {
				user: target["user"].value,
				pass: target["pass"].value,
			});
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
				<small className="me-auto">Fun fact: You can also login via github!</small>
			</div>
		</React.Fragment>
	);
};

export default Register;
