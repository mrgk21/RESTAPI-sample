//@logic package
import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import axios from "axios";

//@styling package
import "bootstrap/dist/js/bootstrap";

//@jsx common elements
import Tile from "../common/tile.dropdown";

const Posts = () => {
	const [data, setData] = useState([]);

	const authHeader = () => {
		return {
			headers: {
				authorization: `bearer ${sessionStorage.getItem("accessToken")}`,
			},
		};
	};

	const handleRequests = async (event, method) => {
		const { target } = event;
		event.preventDefault();
		try {
			switch (method) {
				case "GET": {
					let response = {};
					if (typeof target["userId"] === "undefined")
						response = await axios.get(
							`${import.meta.env.VITE_BACKEND_URI}/posts`,
							authHeader()
						);
					else if (typeof target["id"] === "undefined")
						response = await axios.get(
							`${import.meta.env.VITE_BACKEND_URI}/posts/${target["userId"].value}`,
							authHeader()
						);
					else
						response = await axios.get(
							`${import.meta.env.VITE_BACKEND_URI}/posts/${target["userId"].value}/${
								target["id"].value
							}`,
							authHeader()
						);

					console.log(response.data);
					setData([...response.data]);
					return;
				}
				case "POST": {
					const response = await axios.post(
						`${import.meta.env.VITE_BACKEND_URI}/posts`,
						{
							userId: target["userId"].value,
							title: target["title"].value,
							body: target["body"].value,
						},
						authHeader()
					);
					console.log(response);
					return;
				}
				case "PUT": {
					const response = await axios.put(
						`${import.meta.env.VITE_BACKEND_URI}/posts/${target["userId"].value}/${
							target["id"].value
						}`,
						{
							title: target["title"].value,
							body: target["body"].value,
						},
						authHeader()
					);
					console.log(response);
					return;
				}
				case "DELETE": {
					const response = await axios.delete(
						`${import.meta.env.VITE_BACKEND_URI}/posts/${target["userId"].value}/${
							target["id"].value
						}`,
						authHeader()
					);
					console.log(response);
					return;
				}
			}
		} catch (error) {
			console.log(error.message);
			if (error.response.status === 403) {
				try {
					const { data } = await axios.get(
						`${
							import.meta.env.VITE_BACKEND_URI
						}/auth/refresh?token=${sessionStorage.getItem("refreshToken")}`
					);
					console.log("new token: ", data.token);
					sessionStorage.setItem("accessToken", data.token);
				} catch (error) {
					if (error.response.status === 403) {
						console.log("Refresh token request failed");
					}
				}
			}
		}
	};

	if (data.length !== 0)
		return (
			<React.Fragment>
				<ul>
					<button className="btn btn-primary" onClick={() => setData([])}>
						Go Back
					</button>
					{data.map((item, index) => (
						<ul>
							{`[${index}]`}
							{Object.keys(item).map((entry) => (
								<li style={{ marginLeft: "40px" }}>{`${entry}: ${item[entry]}`}</li>
							))}
						</ul>
					))}
				</ul>
			</React.Fragment>
		);

	return (
		<React.Fragment>
			<div className="d-flex flex-column container-md">
				<p className="display-4">Welcome to /posts</p>
				<ul className="list-group">
					<button
						className="list-group-item list-group-item-action"
						onClick={(event) => handleRequests(event, "GET")}
					>
						GET all posts
					</button>
					<Tile
						method="GET"
						itemText="GET posts"
						fields={["userId", "id"]}
						callback={handleRequests}
					/>
					<Tile
						method="POST"
						itemText="POST a post"
						fields={["userId", "title", "body"]}
						callback={handleRequests}
					/>
					<Tile
						method="PUT"
						itemText="PUT an existing post"
						fields={["userId", "id", "title", "body"]}
						callback={handleRequests}
					/>
					<Tile
						method="DELETE"
						itemText="DELETE a post"
						fields={["userId", "id"]}
						callback={handleRequests}
					/>
				</ul>
			</div>
		</React.Fragment>
	);
};

export default Posts;
