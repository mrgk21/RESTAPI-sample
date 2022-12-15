import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

function App() {
	const [loginStatus, setLoginStatus] = useState(false);
	// const location = useLocation();

	useEffect(() => {
		if (sessionStorage.getItem("accessToken")) setLoginStatus(true);
		else setLoginStatus(false);
	}, []);

	const handleLogout = async () => {
		const { data } = await axios.get(
			`${import.meta.env.VITE_BACKEND_URI}/auth/logout?token=${sessionStorage.getItem(
				"accessToken"
			)}`
		);
		sessionStorage.removeItem("accessToken");
		sessionStorage.removeItem("refreshToken");
		setLoginStatus(false);
		console.log(data);
	};

	return (
		<React.Fragment>
			<Outlet />
			<div className="d-flex flex-column container-md">
				<div className="d-flex align-items-center">
					<h1 className="display-4">Welcome to REST API</h1>
					{!loginStatus ? (
						<div className="ms-auto">
							<Link to="/auth/login" role="button" className="btn btn-primary ms-2">
								Login
							</Link>
							<Link
								to="/auth/register"
								role="button"
								className="btn btn-primary ms-2"
							>
								Register
							</Link>
						</div>
					) : (
						<button onClick={handleLogout} className="btn btn-primary ms-2 ms-auto">
							Logout
						</button>
					)}
				</div>
				<ul className="list-group">
					<Link to="/api/posts" className="list-group-item list-group-item-action">
						Go to /posts
					</Link>
					<Link to="/api/albums" className="list-group-item list-group-item-action">
						Go to /albums
					</Link>
					<Link to="/api/todo" className="list-group-item list-group-item-action">
						Go to /todo
					</Link>
					<Link to="/api/comments" className="list-group-item list-group-item-action">
						Go to /comments
					</Link>
				</ul>
			</div>
		</React.Fragment>
	);
}

export default App;
