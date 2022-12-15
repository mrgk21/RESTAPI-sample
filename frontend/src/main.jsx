import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";

import App from "./App";
import Error from "./components/routes/error";
import Posts from "./components/routes/posts";
import Comments from "./components/routes/comments";
import Todo from "./components/routes/todo";
import Albums from "./components/routes/albums";

import Login from "./components/auth/login";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <Error />,
	},
	{
		path: "/auth/login",
		element: <Login />,
	},
	{
		path: "/api/posts",
		element: <Posts />,
	},
	{
		path: "/api/comments",
		element: <Comments />,
	},
	{
		path: "/api/todo",
		element: <Todo />,
	},
	{
		path: "/api/albums",
		element: <Albums />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<CookiesProvider>
			<RouterProvider router={router} />
		</CookiesProvider>
	</React.StrictMode>
);