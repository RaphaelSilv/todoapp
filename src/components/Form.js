import React, {useState} from 'react';
import DropdownMenu from './DropdownMenu'
import './Dropdown.scss';
import {timezones} from './Timezones'
export default function Form(props) {
  
  const [description,  setDescription] = useState('');
  const [title,  setTitle] = useState('');
  const [timezoneId,  setTimezone] = useState('');
  
  function handleTitleChange(e) {
    setTitle(e.target.value);
  }
  function handleDescriptionChange(e) {
	console.log(e.target.value);
	setDescription(e.target.value);
  }
  function handleTimezoneChange(e) {
	  console.log(e.target.value);
	setTimezone(e.target.value);
  }
  
  function handleSubmit(e) {
    e.preventDefault();
    props.addTask(description, title, timezoneId);
    setDescription('');
	setTitle('');
	setTimezone('');
  }

  return (
      <form onSubmit={handleSubmit}>
        <h2 className="label-wrapper">
          <label htmlFor="new-todo-input" className="label__lg">
            What needs to be done?
          </label>
        </h2>
        <input
			type="text"
			id="new-todo-input"
			className="input input__lg"
			name="text"
			autoComplete="off"
			value={title}
			placeholder="Task title"
			onChange={handleTitleChange}
        />
        <input
			type="text"
			id="new-todo-input"
			className="input input__lg"
			name="text"
			autoComplete="off"
			value={description}
			placeholder="task description"
			onChange={handleDescriptionChange}
        />
		
		<DropdownMenu
			itemTitle="Select your timezone"
			items={timezones}		
			onClick={(tz) => setTimezone(tz.id)}
		/>
        
		<button type="submit" className="btn btn__primary btn__lg">
          Add
        </button>
      </form>
    );
}