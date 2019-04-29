import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const times = [];
let ap = 'am';

for (let i = 0; i < 12; i++) {
  const time = i === 0 ? 12 : i;
  times.push(`${time}:00 ${ap}`)
  times.push(`${time}:30 ${ap}`)
}

ap = 'pm'
for (let i = 0; i < 12; i++) {
  const time = i === 0 ? 12 : i;
  times.push(`${time}:00 ${ap}`)
  times.push(`${time}:30 ${ap}`)
}

export default (props) => {
    return <Select {...props}>
      {times.map(time =>
        <MenuItem key={time} value={time}>{time}</MenuItem>
      )}
    </Select>
}
