import React, { useState } from 'react';
import onClickOutside from 'react-onclickoutside';
import './Dropdown.scss';

function DropdownMenu(props) {
	
	console.log(props.onClick);

	const [open, setOpen] = useState(false);
	const toggle = () => setOpen(!open);
	const [selected, setSelected] = useState({});
	const [title, setTitle] = useState(props.itemTitle);

	DropdownMenu.handleClickOutside = () => setOpen(false);

	
	function handleOnClick(item) {
		
		setOpen(false);
	
		if(selected.id === item.id)
		{
			setTitle(props.itemTitle);
			setSelected({});
		} else {
			setSelected(item);
			setTitle(item.timeZoneName);
		}

		return item;
	}

	function isItemSelected(item) {
		if(selected.id === item.id)
		{
			return true;
		}
		return false;
	}

	return (
		<div className="dd-wrapper">
		  <div
			tabIndex={0}
			className="dd-header"
			role="button"
			onKeyPress={() => toggle(!open)}
			onClick={() => toggle(!open)}
		  >
			<div className="dd-header__title">
			  <p className="dd-header__title--bold">{title}</p>
			</div>
			<div className="dd-header__action">
			  <p className="dd-header__title--bold">{open ? 'Close' : 'Open'}</p>
			</div>
		  </div>
		  {open && (
			<ul className="dd-list">
			  {props.items.map(item => (
				<li className="dd-list-item" key={item.id}>
				  <button type="button" onClick={ tz => props.onClick(handleOnClick(item)) }>
					<span>{item.timeZoneName}</span>
			  		<span>{isItemSelected(item) && 'Selected'}</span>
				  </button>
				</li>
			  ))}
			</ul>
		  )}
		</div>
	  );
	}

const clickOutsideConfig = {
	handleClickOutside: () => DropdownMenu.handleClickOutside,
};

export default onClickOutside(DropdownMenu, clickOutsideConfig);