import React, { useState } from "react";
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
  Col,
} from "antd";
import moment from "moment";
import { RRule } from "rrule";

const { Option } = Select;

const plural = (word, value) => (value === 1 ? word : `${word}s`);

const wordNums = ["First", "Second", "Third", "Fourth", "Last"];
const frequencyStrings = [
  "YEARLY",
  "MONTHLY",
  "WEEKLY",
  "DAILY",
  "HOURLY",
  "MINUTELY",
  "SECONDLY",
];
const weekStrings = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

const getWeekOfMonth = (date) => {
  return Math.ceil(date.date() / 7);
};

const getRRule = ({
  frequency,
  repeats,
  date,
  end,
  until,
  count,
  byDay,
  byMonth,
}) => {
  const rule = new RRule({
    freq: RRule[frequency],
    interval: repeats,
    dtstart: moment(date).toDate(),
    until: end === "on" ? until : null,
    byweekday:
      frequency === "WEEKLY"
        ? (byDay || []).map((day) => RRule[day])
        : frequency === "MONTHLY" && byMonth === "BYMONTHWEEK"
        ? RRule[moment(date).format("dd").toUpperCase()]
        : null,
    bymonthday:
      frequency === "MONTHLY" && byMonth === "BYMONTHDAY"
        ? moment(date).date()
        : null,
    bysetpos:
      frequency === "MONTHLY" && byMonth === "BYMONTHWEEK"
        ? getWeekOfMonth(moment(date))
        : null,
    count: end === "after" ? count : null,
  });

  const [dtStart, rrule] = rule.toString().split("\n");

  return rrule;
};

const getRuleValues = (value) => {
  if (!value) return {};

  const rule = RRule.fromString(value);

  return {
    repeats: rule.options.interval,
    frequency: frequencyStrings[rule.options.freq],
    byDay: rule.options.byweekday?.map((v) => weekStrings[v]),
    byMonth: rule.options.bysetpos ? "BYMONTHWEEK" : "BYMONTHDAY",
    end: rule.options.count ? "after" : rule.options.until ? "on" : "never",
    count: rule.options.count || undefined,
    until: rule.options.until,
  };
};

const getRuleText = (rrule) => {
  const rule = RRule.fromString(rrule);

  return rule.toText();
};

const radioStyles = {
  display: "block",
  height: "40px",
  lineHeight: "40px",
};

const RecurrenceForm = ({ date, onChange, value }) => {
  const defaultValue = getRuleValues(value);

  const [modal, setModal] = useState(false);
  const [repeats, setRepeats] = useState(defaultValue?.repeats ?? 1);
  const [frequency, setFrequency] = useState(
    defaultValue?.frequency ?? "DAILY"
  );
  const [byDay, setByDay] = useState(defaultValue?.byDay ?? []);
  const [byMonth, setByMonth] = useState(defaultValue?.byMonth ?? "BYMONTHDAY");
  const [end, setEnd] = useState(defaultValue?.end ?? "never");
  const [count, setCount] = useState(defaultValue?.count ?? 1);
  const [until, setUntil] = useState(
    defaultValue?.until ? moment(defaultValue.until) : moment(date).add(1, "y")
  );

  const mDate = moment(date);

  const weekOptions = [
    { label: "S", value: "SU" },
    { label: "M", value: "MO" },
    { label: "T", value: "TU" },
    { label: "W", value: "WE" },
    { label: "T", value: "TH" },
    { label: "F", value: "FR" },
    { label: "S", value: "SA" },
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
            byDay,
            byMonth,
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
                onChange={(val) => setRepeats(val)}
              />
            </Col>
            <Col>
              <Select
                size="large"
                value={frequency}
                onChange={(val) => setFrequency(val)}
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
                onChange={(val) => setByDay(val)}
              />
            </div>
          )}
          {frequency === "MONTHLY" && (
            <div style={{ padding: "10px 0 0 0" }}>
              <Select
                size="large"
                value={byMonth}
                onChange={(val) => setByMonth(val)}
              >
                <Option value="BYMONTHDAY">
                  Monthly on day {mDate.format("D")}
                </Option>
                <Option value="BYMONTHWEEK">
                  Monthly on the {wordNums[getWeekOfMonth(mDate) - 1]}{" "}
                  {mDate.format("dddd")}
                </Option>
              </Select>
            </div>
          )}
        </div>

        <div className="ant-form-item">
          <label>Ends</label>
          <div>
            <Radio.Group
              size="large"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
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
                  onChange={(val) => setUntil(val)}
                  style={{ marginLeft: "10px" }}
                />
              </Radio>
              <Radio style={radioStyles} value="after">
                After{" "}
                <InputNumber
                  disabled={end !== "after"}
                  min={1}
                  value={count}
                  onChange={(val) => setCount(val)}
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
