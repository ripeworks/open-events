import { useState } from "react";
import {
  Button,
  Dropdown,
  Menu,
  Checkbox,
  DatePicker,
  Icon,
  InputNumber,
  Modal,
  Radio,
  Select,
  Row,
  Col
} from "antd";
import moment from "moment";
import { RRule } from "rrule";

const { Option } = Select;

const plural = (word, value) => (value === 1 ? word : `${word}s`);

const getRRule = ({ frequency, repeats, date, end, until, count, byDay }) => {
  const rule = new RRule({
    freq: RRule[frequency],
    interval: repeats,
    dtstart: moment(date).toDate(),
    until: end === "on" ? until : null,
    byweekday: frequency === "WEEKLY" ? byDay.map(day => RRule[day]) : null,
    count: end === "after" ? count : null
  });

  const [dtStart, rrule] = rule.toString().split("\n");

  return rrule;
};

const getRuleText = rrule => {
  const rule = RRule.fromString(rrule);

  return rule.toText();
};

const radioStyles = {
  display: "block",
  height: "40px",
  lineHeight: "40px"
};

const RecurrenceForm = ({ date, onChange, value }) => {
  const [modal, setModal] = useState(false);
  const [repeats, setRepeats] = useState(1);
  const [frequency, setFrequency] = useState("DAILY");
  const [byDay, setByDay] = useState([]);
  const [end, setEnd] = useState("never");
  const [count, setCount] = useState(1);
  const [until, setUntil] = useState(moment(date).add(1, "y"));

  const weekOptions = [
    { label: "S", value: "SU" },
    { label: "M", value: "MO" },
    { label: "T", value: "TU" },
    { label: "W", value: "WE" },
    { label: "T", value: "TH" },
    { label: "F", value: "FR" },
    { label: "S", value: "SA" }
  ];

  const monthOptions = [
    { label: "Monthly on day 8" },
    { label: "Monthly on the second Tuesday" }
  ];

  return (
    <div>
      <Dropdown
        trigger={["click"]}
        overlay={
          <Menu
            onClick={({ key }) => {
              if (key === "never") {
                onChange(null);
              }

              if (key === "repeats") {
                setModal(true);
              }
            }}
          >
            <Menu.Item key="never">Does not repeat</Menu.Item>
            <Menu.Item key="repeats">Repeats...</Menu.Item>
          </Menu>
        }
      >
        <Button>
          {value ? getRuleText(value) : "Does not repeat"}
          <Icon type="down" />
        </Button>
      </Dropdown>
      <Modal
        visible={modal}
        onCancel={() => {
          setModal(false);
        }}
        onOk={() => {
          const rule = getRRule({
            frequency,
            repeats,
            date,
            end,
            until,
            count,
            byDay
          });
          onChange(rule);
          setModal(false);
        }}
      >
        <div className="ant-form-item">
          <Row gutter={16} type="flex" align="middle">
            <Col>Repeat every</Col>
            <Col>
              <InputNumber
                autoFocus
                min={1}
                size="large"
                value={repeats}
                onChange={val => setRepeats(val)}
              />
            </Col>
            <Col>
              <Select
                size="large"
                value={frequency}
                onChange={val => setFrequency(val)}
              >
                <Option value="DAILY">{plural("Day", repeats)}</Option>
                <Option value="WEEKLY">{plural("Week", repeats)}</Option>
                <Option value="MONTHLY">{plural("Month", repeats)}</Option>
                <Option value="YEARLY">{plural("Year", repeats)}</Option>
              </Select>
            </Col>
          </Row>
          {frequency === "WEEKLY" && (
            <div>
              <p>Repeat on</p>
              <Checkbox.Group
                options={weekOptions}
                value={byDay}
                onChange={val => setByDay(val)}
              />
            </div>
          )}
          {/* {frequency === "MONTHLY" && (
            <div>
              <p />
              <Select />
            </div>
          )} */}
        </div>

        <div className="ant-form-item">
          <label>Ends</label>
          <div>
            <Radio.Group
              size="large"
              value={end}
              onChange={e => setEnd(e.target.value)}
            >
              <Radio style={radioStyles} value="never">
                Never
              </Radio>
              <Radio style={radioStyles} value="on">
                On
                <DatePicker
                  disabled={end !== "on"}
                  dateFormat="MMM D, YYYY"
                  value={until}
                  onChange={val => setUntil(val)}
                  style={{ marginLeft: "10px" }}
                />
              </Radio>
              <Radio style={radioStyles} value="after">
                After{" "}
                <InputNumber
                  disabled={end !== "after"}
                  min={1}
                  value={count}
                  onChange={val => setCount(val)}
                />{" "}
                {plural("Occurrence", count)}
              </Radio>
            </Radio.Group>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RecurrenceForm;
