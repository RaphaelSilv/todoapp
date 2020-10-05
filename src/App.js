import React, { useState, useRef, useEffect } from 'react';
import Todo from './components/Todo';
import Form from './components/Form';
import Header from './components/Header';
import FilterButton from './components/FilterButton';
import './App.css';

const URI = `http://20.62.137.22:80/api/todoitems/`;

const FILTER_MAP = {
  All: () => true,
  Completed: task => task.isComplete,
  Todo: task => !task.isComplete
}

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App() {

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');

  const prevTaskLength = usePrevious(tasks.length);
     
  const filterList = FILTER_NAMES.map(name => (
    <FilterButton 
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map(task => (
      <Todo 
		  content={task.content}
		  lastUpdated={task.lastUpdate}
		  timezoneId={task.timezoneId}
          title={task.title}
          completed={task.isComplete}
          id={task.id}
          key={task.id}
          toggleTaskCompleted={toggleTaskCompleted}
          deleteTask={deleteTask}
          editTask={editTask}
      />
    )
  );
 
  	const taskNoun = taskList.length > 1 ? 'tasks' : 'task'; 
  	const remainingTasks = `${taskList.length}  ${taskNoun} remaining`;
	 
	async function fetchTodos() {
		const apiUrl = URI;
		const response = await fetch(apiUrl)
		const json = await response.json()
		setTasks(json);
	}

	async function addTask(content, title, timezone) {

		const newTask =  { content: content, title: title, timezoneId: timezone }
		const response = await fetch(URI, {
			method: 'POST',
			mode: 'cors', 
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
			'Content-Type': 'application/json'
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer', 
			body: JSON.stringify(newTask)
		});
		const newTaskResponse = await response.json();
		setTasks([...tasks, newTaskResponse]);
	}  
      
  	async function toggleTaskCompleted(id) {
		
		const index = tasks.findIndex(task => task.id === id);
		const toggledTask = {...tasks[index], isComplete: !tasks[index].isComplete}; 
		tasks[index] = toggledTask;

		await fetch(URI + id, {
			method: 'PUT', 
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
			 'Content-type': 'application/json; charset=UTF-8' 
			},
			body: JSON.stringify(toggledTask) 
	});
	setTasks([...tasks]);
}

  async function deleteTask(id) {

	const updatedTasks = tasks.filter(task => task.id !== id);
	
	await fetch(URI + id, {
		method: 'DELETE',
	});

	setTasks(updatedTasks);	
  }

  async function editTask(id, newTodo) {

	const updatedTask =  { id: id, title: newTodo.title, content: newTodo.content, timezoneId: newTodo.timezoneId }

	await fetch(URI + id, {
			method: 'PUT', 
			mode: 'cors', 
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
			 'Content-type': 'application/json; charset=UTF-8' 
			},
			body: JSON.stringify(updatedTask) 
	});

	const index = tasks.findIndex(task => task.id === updatedTask.id);
	tasks[index] = updatedTask; 
	await fetchTodos();
}

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const listHeadingRef = useRef(null);

  useEffect(() => {
	if (tasks.length - prevTaskLength === -1) {
	  listHeadingRef.current.focus();
	}
  }, [tasks.length, prevTaskLength]);

  useEffect(() => {
	fetchTodos();
  }, []);

  return (	
    <div className="todoapp stack-large">
        <Header/>
        <Form addTask={addTask}/>
        {filterList}
        <ul role="list" className="todo-list stack-large stack-exception" aria-labelledby="list-heading">
        <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
          {remainingTasks}
        </h2>
        {taskList}
        </ul>
      </div>
    );
  }

export default App;
