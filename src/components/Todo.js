import React, { useState, useEffect, useRef } from 'react';
import DropdownMenu from './DropdownMenu'
import './Dropdown.scss';
import {timezones} from './Timezones'

function usePrevious(value) {
	const ref = useRef();
	useEffect(() => {
	  ref.current = value;
	});
	return ref.current;
}

export default function Todo(props) {
  
  const [isEditing, setEditing] = useState(false);
  const [newContent, setNewContent] = useState(props.content);
  const [newTitle, setNewTitle] = useState(props.title);
  const [timezoneId,  setTimezone] = useState(props.timezoneId);

  const editInputFieldRef = useRef(null);
  const editButtonRef = useRef(null);

  const wasEditing = usePrevious(isEditing);

  function handleContentUpdate(e) {
    setNewContent(e.target.value);
  }

  function handleTitleUpdate(e) {
    setNewTitle(e.target.value);
  }
  
  function handleSubmit(e) {
	e.preventDefault();
	var updatedTodo = {title: newTitle, content: newContent, timezoneId: timezoneId}
    props.editTask(props.id, updatedTodo);
    setNewContent('');
    setNewTitle('');
    setTimezone('');
    setEditing(false);
  }

  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="todo-label" htmlFor={props.id}>
          New title for: {props.title}
        </label>
        <input id={props.id}
			className="todo-text"
			type="text"
			value={newTitle}
			onChange={handleTitleUpdate}
          ref={editInputFieldRef}
        />
        <label className="todo-label" htmlFor={props.id}>
          New content for: {props.content}
        </label>
		<input id={props.id} 
			className="todo-text" 
			type="text" 
			value={newContent} 
			onChange={handleContentUpdate}
		/>
		<label className="todo-label" htmlFor={props.id}>
          New timezone for: {props.timezoneId}
        </label>
		<DropdownMenu
			itemTitle="Select your timezone"
			items={timezones}		
			onClick={(tz) => setTimezone(tz.id)}
		/>
      </div>
      <div className="btn-group">
        <button type="button" onClick={() => setEditing(false)} className="btn todo-cancel">
          Cancel
        <span className="visually-hidden">renaming {props.content}</span>
        </button>
        <button type="submit" className="btn btn__primary todo-edit">
          Save
        <span className="visually-hidden">new name for {props.name}</span>
      </button>
      </div>
    </form>
  );

  const viewTemplate = (
    <div className="stack-small">
      <div className="c-cb">
          <input
		  	className="input__checkbox"
            id={props.id}
            type="checkbox"
            defaultChecked={props.completed}
            onChange={() => props.toggleTaskCompleted(props.id)}
          />
          <label className="todo-label" htmlFor={props.id}>
            <b>{props.title}:</b>
          </label>
          <label className="todo-label" htmlFor={props.id}>
            {props.content}
          </label>
		  <div className="timezone-label">
			<label id="timezone" htmlFor={props.id}>
				{ 'Last updated: ' + props.lastUpdated + '  Timezone: ' + props.timezoneId}
			</label>
		  </div>
        </div>
        <div className="btn-group">
          <button 
            type="button"
            className="btn"
            onClick={() => setEditing(true)}
            ref={editButtonRef}
          >
            Edit <span className="visually-hidden">{props.content}</span>
          </button>
          <button
            type="button"
            className="btn btn__danger"
            onClick={() => props.deleteTask(props.id)}
          >
            Delete <span className="visually-hidden">{props.content}</span>
          </button>
        </div>
    </div>
  );
  
  useEffect(() => {
    if(!wasEditing && isEditing) {
      editInputFieldRef.current.focus();
    } 
    if(wasEditing && !isEditing) {
      editButtonRef.current.focus();
    }
  }, [isEditing, wasEditing]);
  
  return (
    <li className="todo">
      {isEditing ? editingTemplate : viewTemplate}
    </li>
  );
}