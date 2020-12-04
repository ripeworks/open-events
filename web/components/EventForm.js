import React from "react";
import { Input, DatePicker, Form, Row, Col, Switch, Button } from "antd";
import moment from "moment";

import TimePicker from "./TimePicker";
import Location from "./Location";
import Upload from "./Upload";
import RecurrenceForm from "./RecurrenceForm";
import { getPhotoUrl, getVolunteerText } from "../utils";

const dateFormat = "MMM D, YYYY";

class EventForm extends React.Component {
  state = {
    submitting: false,
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { event, form, onSubmit } = this.props;

    form.validateFields(async (err, values) => {
      if (err) return;
      try {
        this.setState({ submitting: true });
        await onSubmit(values);
        if (!event) {
          form.resetFields();
        }
      } catch (err) {
        console.log(err);
      }
      this.setState({ submitting: false });
    });
  };

  disabledStartDate = (date) => {
    const now = moment();
    if (!date) return false;
    return date.startOf("date").valueOf() < now.startOf("date").valueOf();
  };

  disabledEndDate = (date) => {
    const start = this.props.form.getFieldValue("startDate");
    if (!start || !date) return false;
    return date.startOf("date").valueOf() < start.startOf("date").valueOf();
  };

  onStartDateChange = (date) => {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    const end = getFieldValue("endDate");
    if (end && date.startOf("date").valueOf() > end.startOf("date").valueOf()) {
      setFieldsValue({ endDate: date });
    }
  };

  onStartTimeChange = (time) => {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    const end = getFieldValue("endTime");
    if (!end || end < time) {
      setFieldsValue({ endTime: time + 0.5 });
    }
  };

  render() {
    const {
      event: editingEvent,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const { submitting } = this.state;
    const { attachments: [attachment] = [] } = editingEvent || {};

    const isAllDay = getFieldValue("allDay");
    const isFree = getFieldValue("isFree");
    const meetingUrl = getFieldValue("meetingUrl");
    const needsVolunteers = getFieldValue("needsVolunteers");
    const startTime = getFieldValue("startTime");

    return (
      <Form onSubmit={this.onSubmit}>
        <Row gutter={16}>
          <Col>
            <Form.Item
              label="Event Title"
              extra={
                <span>
                  e.g. <em>Music in the Park</em>
                </span>
              }
            >
              {getFieldDecorator("title", { rules: [{ required: true }] })(
                <Input size="large" />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} type="flex" align="bottom">
          <Col>
            <Form.Item label="Date">
              {getFieldDecorator("startDate", {
                initialValue: moment(),
                rules: [{ required: true }],
              })(
                <DatePicker
                  disabledDate={this.disabledStartDate}
                  onChange={this.onStartDateChange}
                  size="large"
                  format={dateFormat}
                />
              )}
            </Form.Item>
          </Col>
          <Col>
            {!isAllDay && (
              <Form.Item>
                {getFieldDecorator("startTime", {
                  initialValue: 10,
                  rules: [{ required: true }],
                })(
                  <TimePicker onChange={this.onStartTimeChange} size="large" />
                )}
              </Form.Item>
            )}
          </Col>
          <Col>
            <Form.Item>to</Form.Item>
          </Col>
          <Col>
            {!isAllDay && (
              <Form.Item>
                {getFieldDecorator("endTime", {
                  initialValue: 10.5,
                  rules: [{ required: true }],
                })(<TimePicker start={startTime || 10} size="large" />)}
              </Form.Item>
            )}
          </Col>
          <Col>
            <Form.Item>
              {getFieldDecorator("endDate", {
                initialValue: moment(),
                rules: [{ required: true }],
              })(
                <DatePicker
                  disabledDate={this.disabledEndDate}
                  size="large"
                  format={dateFormat}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} type="flex" align="bottom">
          <Col>
            <Form.Item label="All day">
              {getFieldDecorator("allDay", { valuePropName: "checked" })(
                <Switch />
              )}
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              {getFieldDecorator("repeats", {})(
                <RecurrenceForm date={getFieldValue("startDate")} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} type="flex">
          <Col>
            <Form.Item
              label="Organizer Name"
              extra="Individual or organization"
            >
              {getFieldDecorator("organizerName", {
                rules: [{ required: true }],
              })(<Input size="large" />)}
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="Organizer Email">
              {getFieldDecorator("organizerEmail", {
                rules: [{ required: true }],
              })(<Input size="large" type="email" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} type="flex">
          <Col span={12}>
            <Form.Item label="Description" extra="A brief summary of the event">
              {getFieldDecorator("description", {
                rules: [{ required: true }],
              })(<Input.TextArea autosize={{ minRows: 2 }} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col>
            <Form.Item label="Location">
              {getFieldDecorator("location", {})(
                <Location
                  defaultValue={editingEvent && editingEvent.location}
                  size="large"
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} type="flex">
          <Col span={18}>
            <Form.Item label="Virtual Meeting Link">
              {getFieldDecorator("meetingUrl", {})(
                <Input size="large" type="url" />
              )}
            </Form.Item>
          </Col>
          <Col>
            {!!meetingUrl && (
              <Form.Item label="Access Code">
                {getFieldDecorator("meetingPassword", {})(
                  <Input size="large" />
                )}
              </Form.Item>
            )}
          </Col>
        </Row>
        <Row gutter={16} type="flex">
          <Col>
            <Form.Item
              label="Photo"
              help="Photo upload recommended (.jpg or .png only)"
            >
              {editingEvent && attachment && (
                <img
                  className="existing-photo"
                  src={getPhotoUrl(attachment.fileUrl)}
                />
              )}
              {getFieldDecorator("photo", {
                valuePropName: "fileList",
              })(
                <Upload
                  action="/api/photo"
                  accept="image/jpeg,image/jpg,image/png"
                  name="photo"
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col>
            <Form.Item label="Website">
              {getFieldDecorator("url", {})(<Input size="large" type="url" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} type="flex">
          <Col>
            <Form.Item label="Free Event">
              {getFieldDecorator("isFree", {
                initialValue: true,
                valuePropName: "checked",
              })(<Switch />)}
            </Form.Item>
          </Col>
          <Col>
            {isFree === false && (
              <Form.Item label="Cost">
                {getFieldDecorator("cost", { rules: [{ required: true }] })(
                  <Input size="large" />
                )}
              </Form.Item>
            )}
          </Col>
        </Row>
        <Row gutter={16} type="flex">
          <Col>
            <Form.Item label="Needs Volunteers">
              {getFieldDecorator("needsVolunteers", {
                valuePropName: "checked",
              })(<Switch />)}
            </Form.Item>
          </Col>
          <Col>
            {needsVolunteers && (
              <Form.Item
                label="Volunteer Contact"
                extra="Name and contact method (phone number, email)"
              >
                {getFieldDecorator("volunteerContact", {
                  rules: [{ required: true }],
                })(<Input size="large" />)}
              </Form.Item>
            )}
          </Col>
        </Row>
        <Row gutter={16}>
          <Col>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

const mapPropsToFields = (props) => {
  const { event } = props;

  if (!event) return {};

  const {
    start: { dateTime: startDateTime, date: startDate },
    end: { dateTime: endDateTime, date: endDate },
    extendedProperties: {
      private: {
        OrganizerEmail: organizerEmail,
        VolunteerContact: volunteerContact,
      },
      shared: {
        Cost: cost,
        Organizer: organizerName,
        MeetingUrl: meetingUrl,
        MeetingPassword: meetingPassword,
      },
    },
    recurrence,
    source: { url: websiteUrl } = {},
  } = event;

  const start = moment(startDateTime || startDate);
  const end = moment(endDateTime || endDate);
  const allDay = !!startDate;
  const [rrule = ""] = recurrence || [];

  return {
    title: Form.createFormField({ value: event.summary }),
    startDate: Form.createFormField({
      value: moment(startDateTime || startDate),
    }),
    startTime: Form.createFormField({
      value: allDay ? "" : start.hours() + (start.minutes() === 30 ? 0.5 : 0),
    }),
    endDate: Form.createFormField({
      value: moment(endDateTime || endDate),
    }),
    endTime: Form.createFormField({
      value: allDay ? "" : end.hours() + (end.minutes() === 30 ? 0.5 : 0),
    }),
    allDay: Form.createFormField({ value: allDay }),
    location: Form.createFormField({ value: { address: event.location } }),
    organizerName: Form.createFormField({ value: organizerName }),
    organizerEmail: Form.createFormField({ value: organizerEmail }),
    description: Form.createFormField({
      value: event.description.replace(
        `\n\n${getVolunteerText(event.description, true)}`,
        ""
      ),
    }),
    meetingUrl: Form.createFormField({ value: meetingUrl }),
    meetingPassword: Form.createFormField({ value: meetingPassword }),
    repeats: Form.createFormField({ value: rrule }),
    url: Form.createFormField({ value: websiteUrl }),
    isFree: Form.createFormField({ value: cost === "Free" }),
    cost: Form.createFormField({ value: cost !== "Free" ? cost : "" }),
    needsVolunteers: Form.createFormField({ value: !!volunteerContact }),
    volunteerContact: Form.createFormField({ value: volunteerContact }),
  };
};

export default Form.create({
  mapPropsToFields,
})(EventForm);
