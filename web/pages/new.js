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
      startTime: "10:00am",
      endDate: new Date(),
      endTime: "10:30am",
      allDay: false,
      organizer: "",
      location: {
        address: "",
        latlng: ""
      },
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
    this.onChange({target: {name: "startDate", value}})
  }

  onEndChange = value => {
    this.onChange({target: {name: "endDate", value}})
  }

  onSubmit = e => {
    e.preventDefault();
    // submit to API
  };

  controlProps = (name) => {
    const { value } = this.state;

    return {
      name,
      value: value[name],
      onChange: this.onChange
    }
  }

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
                  placeholder="Title"
                />
              </Grid>
              <Grid item xs={12}>
                <DatePicker disablePast value={value.startDate} onChange={this.onStartChange} />
                <FormControl>
                  <TimePicker {...this.controlProps("startTime")} />
                </FormControl>
                to
                <DatePicker disablePast value={value.endDate} onChange={this.onEndChange} />
                <FormControl>
                  <TimePicker {...this.controlProps("endTime")} />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allDay" />}
                  label="All day"
                />
              </Grid>
              <Grid item xs={12}>
                <Location {...this.controlProps("location")} />
              </Grid>
              <Grid item xs={12}>
                <TextField {...this.controlProps("organizer")} placeholder="Organizer" />
              </Grid>
              <Grid item xs={12}>
                <TextField {...this.controlProps("url")} placeholder="Website" />
              </Grid>
              <Grid item xs={12}>
                <TextField {...this.controlProps("cost")} placeholder="Cost" />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="needVolunteers" />}
                  label="Volunteers"
                />
                <TextField placeholder="Volunteer" />
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
