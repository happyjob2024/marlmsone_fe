import React from "react";

const SelectBox = ({ options, onChange}) => {
    return (
        <select
            id="searchKey"
            onChange={onChange}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.name}
                </option>
            ))}
        </select>
    )
}
export default SelectBox