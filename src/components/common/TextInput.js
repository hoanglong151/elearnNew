import React, {useState, useEffect, memo} from 'react';

const TextInput = (props) => {
    const {initialValue, handleTextChange, type, name, className = 'form-control', required = false} = props;
    const [state, setState] = useState(initialValue);
    const _onChange = (event) => {
        const value = event.target.value;
        setState(value);
    }

    useEffect(() => {
        handleTextChange(name, state);
    }, [state])

    return (
        <input 
            type={type}
            name={name}
            className={className}
            onChange={_onChange} 
            defaultValue={state}
            required={required}
        />
    )
}

export default memo(TextInput);