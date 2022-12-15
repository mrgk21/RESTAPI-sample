import React, { Component } from "react";

const SubmitButton = ({ text, options }) => {
	return (
		<button type="submit" className="btn btn-primary mb-2" {...options}>
			{text}
		</button>
	);
};

export default SubmitButton;
