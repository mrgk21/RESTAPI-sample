import React, { useState } from "react";

import Input from "./form_elements/input";
import SubmitButton from "./form_elements/submitButton";

const Tile = ({ itemText, method, fields, callback }) => {
	const [dropdownToggle, setDropdownToggle] = useState(false);
	return (
		<React.Fragment>
			<button
				className="list-group-item list-group-item-action"
				onClick={() => setDropdownToggle(!dropdownToggle)}
			>
				{itemText}
			</button>
			{dropdownToggle && (
				<form className="list-group-item" onSubmit={(event) => callback(event, method)}>
					{fields.map((field) => (
						<Input name={field} placeholder={`Enter ${field}`} />
					))}
					<SubmitButton text={`Submit ${method} request`} />
				</form>
			)}
		</React.Fragment>
	);
};

export default Tile;
