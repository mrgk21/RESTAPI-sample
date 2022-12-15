import React from "react";

const Input = ({ type = "text", name, id = null, placeholder }) => {
	return (
		<input
			type={type}
			name={name}
			id={id}
			placeholder={placeholder}
			className="form-control mb-2"
		/>
	);
};

export default Input;
