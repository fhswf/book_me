import React,{useState} from 'react';
import Switch from '@material-ui/core/Switch';

const Switches = () => {

  const [state, setState] = useState({
    isActive: true
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <div>
      <Switch
        checked={state.isActive}
        onChange={handleChange}
        name="checkedA"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
      </div>
  )
  }
  export default Switches;