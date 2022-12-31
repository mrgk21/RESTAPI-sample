import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
// import { useCookies } from "react-cookie";

//@assets
import githubIcon from "../../assets/github.svg";

//@jsx common elements
import Label from "../common/form_elements/label";
import Input from "../common/form_elements/input";
import SubmitButton from "../common/form_elements/submitButton";

const Login = ({}) => {
	const navigate = useNavigate();

	const authHeader = () => {
		return {
			headers: {
				"Access-Control-Allow-Origin": `${import.meta.env.VITE_BACKEND_URI}`,
				"Access-Control-Allow-Methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			},
		};
	};

	const getToken = async () => {
		try {
			const { data: token } = await axios.get(
				`${import.meta.env.VITE_BACKEND_URI}/auth/github/token`
			);
			sessionStorage.setItem("accessToken", token);
			navigate("/", { replace: true });
		} catch (error) {
			if (error.code == 404) return;
		}
	};

	// handleLoginRerouting
	useEffect(() => {
		getToken();
	}, []);

	const handleLogin = async (e) => {
		e.preventDefault();
		const { target } = e;
		try {
			const { data } = await axios.post(
				`${import.meta.env.VITE_BACKEND_URI}/auth/login`,
				{
					user: target["user"].value,
					pass: target["pass"].value,
				},
				authHeader()
			);
			sessionStorage.setItem("accessToken", data.accessToken);
			sessionStorage.setItem("refreshToken", data.refreshToken);
			navigate("/", { replace: true });
		} catch (error) {
			console.log(error.response.data);
		}
	};

	console.log(
		`https://github.com/login/oauth/authorize?client_id=${
			import.meta.env.VITE_OAUTH_GITHUB_CLIENT_ID
		}&redirect_uri=${import.meta.env.VITE_BACKEND_URI}/auth/github/callback?path=${
			window.location
		}`
	);
	return (
		<React.Fragment>
			<div className="d-flex flex-column container-sm">
				<p className="display-4">Login page</p>
				<form className="list-group-item" onSubmit={(e) => handleLogin(e)}>
					<Label htmlFor="userField" text="Enter userId:" />
					<Input id="userField" name="user" placeholder="Enter userId..." />
					<Label htmlFor="passField" text="Enter password:" />
					<Input type="password" id="passField" name="pass" placeholder="Enter pass..." />
					<SubmitButton text="Login" />
				</form>
				<a
					className="me-auto"
					href={`https://github.com/login/oauth/authorize?client_id=${
						import.meta.env.VITE_OAUTH_GITHUB_CLIENT_ID
					}&redirect_uri=${import.meta.env.VITE_BACKEND_URI}/auth/github/callback?path=${
						window.location
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
				<p className="mt-2">
					<mark>!!Disclaimer!!</mark> If you are using the site for the first time, all
					the requests to the server will be blocked due to its SSL certificate being
					self-signed. To remedy this, please login via github first, where you will be
					redirected to a "Website is not secure" page. After clicking "I Accept the
					Risk", you will be logged into github and the site will function as intended.
					Please refer the README on my github to know more.
				</p>
				<p>
					<mark>PS:</mark>You can view the certificate in the browser under the name
					"Hobbyist" to verify the claim
				</p>
			</div>
		</React.Fragment>
	);
};

export default Login;
