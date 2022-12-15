import React from "react";

const Label = ({ text, htmlFor }) => {
	return (
		<React.Fragment>
			<label className="form-label fs-6" htmlFor={htmlFor}>
				{text}
			</label>
		</React.Fragment>
	);
};

export default Label;
