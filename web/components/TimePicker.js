import { Select } from "antd";
import moment from "moment";
const { Option } = Select;

const times = [];

for (let i = 0; i < 24; i += 0.5) {
  times.push({
    label: moment()
      .hours(i)
      .minutes(i % 1 === 0 ? 0 : 30)
      .format("h:mm a"),
    value: i
  });
}

export default class extends React.Component {
  render() {
    const { start, ...props} = this.props;
    const options = start ? times.slice(times.findIndex(time => time.value === start) + 1) : times

    return (
      <Select showSearch {...this.props}>
        {options.map(time => (
          <Option key={time.value} value={time.value}>{time.label}</Option>
        ))}
      </Select>
    );
  }
};
