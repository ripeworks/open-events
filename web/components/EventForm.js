import { Input, DatePicker, Form, Row, Col, Switch, Button } from "antd";
import moment from "moment";

import TimePicker from "./TimePicker";
import Location from "./Location";
import Upload from "./Upload";

const dateFormat = "MMM D, YYYY";

class EventForm extends React.Component {
  state = {
    submitting: false
  };

  onSubmit = e => {
    e.preventDefault();
    const { form, onSubmit } = this.props;

    form.validateFields(async (err, values) => {
      if (err) return;
      try {
        this.setState({ submitting: true });
        await onSubmit(values);
        form.resetFields();
      } catch (err) {
        console.log(err);
      }
      this.setState({ submitting: false });
    });
  };

  disabledStartDate = date => {
    const now = moment();
    if (!date) return false;
    return date.startOf("date").valueOf() < now.startOf("date").valueOf();
  };

  disabledEndDate = date => {
    const start = this.props.form.getFieldValue("startDate");
    if (!start || !date) return false;
    return date.startOf("date").valueOf() < start.startOf("date").valueOf();
  };

  onStartDateChange = date => {
    const {
      form: { getFieldValue, setFieldsValue }
    } = this.props;
    const end = getFieldValue("endDate");
    if (end && date.startOf("date").valueOf() > end.startOf("date").valueOf()) {
      setFieldsValue({ endDate: date });
    }
  };

  onStartTimeChange = time => {
    const {
      form: { getFieldValue, setFieldsValue }
    } = this.props;
    const end = getFieldValue("endTime");
    if (!end || end < time) {
      setFieldsValue({ endTime: time + 0.5 });
    }
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue }
    } = this.props;
    const { submitting } = this.state;

    const isAllDay = getFieldValue("allDay");
    const isFree = getFieldValue("isFree");
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
                rules: [{ required: true }]
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
                  rules: [{ required: true }]
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
                  rules: [{ required: true }]
                })(<TimePicker start={startTime || 10} size="large" />)}
              </Form.Item>
            )}
          </Col>
          <Col>
            <Form.Item>
              {getFieldDecorator("endDate", {
                initialValue: moment(),
                rules: [{ required: true }]
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
        <Row gutter={16}>
          <Col>
            <Form.Item label="All day">
              {getFieldDecorator("allDay", { valuePropName: "checked" })(
                <Switch />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col>
            <Form.Item label="Location">
              {getFieldDecorator("location", { rules: [{ required: true }] })(
                <Location size="large" />
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
                rules: [{ required: true }]
              })(<Input size="large" />)}
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="Organizer Email">
              {getFieldDecorator("organizerEmail", {
                rules: [{ required: true }]
              })(<Input size="large" type="email" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} type="flex">
          <Col span={12}>
            <Form.Item label="Description" extra="A brief summary of the event">
              {getFieldDecorator("description", {
                rules: [{ required: true }]
              })(<Input.TextArea autosize={{ minRows: 2 }} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} type="flex">
          <Col>
            <Form.Item
              label="Photo"
              help="Photo upload recommended (.jpg or .png only)"
            >
              {getFieldDecorator("photo", {
                valuePropName: "fileList"
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
                valuePropName: "checked"
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
                valuePropName: "checked"
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
                  rules: [{ required: true }]
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

export default Form.create()(EventForm);
