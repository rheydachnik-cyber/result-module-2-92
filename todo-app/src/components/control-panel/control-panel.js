import { Button } from '../button/button';
import { Search, Sorting } from './components';
import styles from './control-panel.module.css';
export const Controls = ({ onAddTask, onFilterChange, onSortToggle }) => {
	return (
		<div className={styles.controlsContainer}>
			<Search onFilter={onFilterChange} />
			<Sorting onToggle={onSortToggle} />
			<Button clickHandler={onAddTask}>+</Button>
		</div>
	);
};
