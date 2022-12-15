import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";

//@assets
import githubIcon from "../../assets/github.svg";

//@jsx common elements
import Label from "../common/form_elements/label";
import Input from "../common/form_elements/input";
import SubmitButton from "../common/form_elements/submitButton";

const Login = ({}) => {
	const navigate = useNavigate();
	const [cookies, setCookie, removeCookie] = useCookies();

	// handleLoginRerouting
	useEffect(() => {
		if (sessionStorage.getItem("accessToken")) navigate("/");
	});

	const handleLogin = async (e) => {
		e.preventDefault();
		const { target } = e;
		try {
			const { data } = await axios.post("http://localhost:3000/auth/login", {
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

	if (typeof cookies.token !== "undefined") {
		console.log(cookies.token);
		sessionStorage.setItem("accessToken", cookies.token);
		removeCookie("token", { path: "/" });
	}

	return (
		<React.Fragment>
			<div className="d-flex flex-column container-sm">
				<p className="display-4">Login page</p>
				<form className="list-group-item" onSubmit={(e) => handleLogin(e)}>
					<Label htmlFor="userField" text="Enter userId:" />
					<Input id="userField" name="user" placeholder="Enter userId..." />
					<Label htmlFor="passField" text="Enter password:" />
					<Input type="pass" id="passField" name="pass" placeholder="Enter pass..." />
					<SubmitButton text="Login" />
				</form>
				<a
					className="me-auto"
					href={`https://github.com/login/oauth/authorize?client_id=${
						import.meta.env.VITE_OAUTH_GITHUB_CLIENT_ID
					}&redirect_uri=http://localhost:3000/auth/github/callback?path=${
						window.location.href
					}`}
				>
					<button className="btn btn-primary mb-2">
						<span>
							<img src={githubIcon} width="20px" />
							Login with github
						</span>
					</button>
				</a>
				<Link to="../register" relative="path" className="me-auto">
					<small>Dont have an account? Click here to register</small>
				</Link>
			</div>
		</React.Fragment>
	);
};

export default Login;
