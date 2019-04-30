import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { DatePicker, DateTimePicker } from "material-ui-pickers";

import TimePicker from "../components/TimePicker";
import Editor from "../components/Editor";
import Location from "../components/Location";

export default class Page extends React.Component {
  state = {
    value: {
      title: "",
      startDate: new Date(),
      startTime: "10:00 am",
      endDate: new Date(),
      endTime: "10:30 am",
      allDay: false,
      organizerName: "",
      organizerEmail: "",
      location: "",
      locationPosition: {},
      cost: "",
      url: "",
      volunteerContact: "",
      description: ""
    }
  };

  onChange = e => {
    const { name, value = "" } = e.target;

    this.setState(prevState => ({
      value: {
        ...prevState.value,
        [name]: value
      }
    }));
  };

  onStartChange = value => {
    this.onChange({ target: { name: "startDate", value } });
  };

  onEndChange = value => {
    this.onChange({ target: { name: "endDate", value } });
  };

  onLocationChange = location => {
    console.log(location);
  };

  onSubmit = e => {
    e.preventDefault();
    // submit to API
  };

  controlProps = name => {
    const { value } = this.state;

    return {
      name,
      value: value[name],
      onChange: this.onChange
    };
  };

  controlCheckboxProps = name => {
    const { value } = this.state;

    return {
      name,
      value: name,
      checked: value[name],
      onChange: e =>
        this.onChange({ target: { name, value: e.target.checked } })
    };
  };

  render() {
    const { value } = this.state;

    return (
      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h1">Northport Omena Calendar</Typography>
          <form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  {...this.controlProps("title")}
                  fullWidth
                  placeholder="Title"
                />
              </Grid>
              <Grid item xs={12}>
                <DatePicker
                  autoOk
                  disablePast
                  value={value.startDate}
                  onChange={this.onStartChange}
                />
                {!value.allDay && (
                  <FormControl>
                    <TimePicker {...this.controlProps("startTime")} />
                  </FormControl>
                )}
                to
                <DatePicker
                  autoOk
                  disablePast
                  value={value.endDate}
                  onChange={this.onEndChange}
                />
                {!value.allDay && (
                  <FormControl>
                    <TimePicker {...this.controlProps("endTime")} />
                  </FormControl>
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox {...this.controlCheckboxProps("allDay")} />
                  }
                  label="All day"
                />
              </Grid>
              <Grid item xs={12}>
                <Location {...this.controlProps("location")} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...this.controlProps("organizerName")}
                  fullWidth
                  placeholder="Organizer Name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...this.controlProps("organizerEmail")}
                  fullWidth
                  placeholder="Organizer Email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...this.controlProps("url")}
                  InputProps={{
                    type: "url"
                  }}
                  fullWidth
                  placeholder="Website"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField {...this.controlProps("cost")} placeholder="Cost" />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...this.controlCheckboxProps("needVolunteers")}
                    />
                  }
                  label="Volunteers"
                />
                {value.needVolunteers && (
                  <TextField placeholder="Volunteer Contact" />
                )}
              </Grid>
              <Grid item xs={12}>
                <Editor {...this.controlProps("description")} />
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    );
  }
}
