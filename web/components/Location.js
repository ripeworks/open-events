import AsyncSelect from "react-select/lib/Async";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import NoSsr from "@material-ui/core/NoSsr";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { emphasize } from "@material-ui/core/styles/colorManipulator";

export const geocodeByAddress = address => {
  const geocoder = new window.google.maps.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status !== window.google.maps.GeocoderStatus.OK) {
        reject(
          new Error(
            `Geocoding query for a place with an ID of '${placeId}' failed - response status: ${status}`
          )
        );

        return;
      }

      resolve(results);
    });
  });
};

export const getLatLng = ([result]) => {
  const { geometry } = result;
  return {
    lat: geometry.location.lat(),
    lng: geometry.location.lng()
  };
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 250
  },
  input: {
    display: "flex",
    padding: 0,
    height: "auto"
  },
  valueContainer: {
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    alignItems: "center",
    overflow: "hidden"
  },
  chip: {
    margin: theme.spacing(0.5, 0.25)
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === "light"
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2)
  },
  singleValue: {
    fontSize: 16
  },
  placeholder: {
    position: "absolute",
    left: 2,
    bottom: 6,
    fontSize: 16
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  divider: {
    height: theme.spacing(2)
  }
}));

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
      {...props.selectProps.TextFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      ref={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Menu(props) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

const MuiSelect = props => {
  const classes = useStyles();
  const theme = useTheme();
  const selectStyles = {
    input: base => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit"
      }
    })
  };

  return (
    <AsyncSelect
      classes={classes}
      styles={selectStyles}
      components={{
        Control,
        Menu,
        NoOptionsMessage,
        Option,
        Placeholder,
        SingleValue,
        ValueContainer
      }}
      {...props}
    />
  );
};

export default class extends React.Component {
  componentDidMount() {
    this.autocompleteService = new window.google.maps.places.AutocompleteService();
  }

  onChange = async option => {
    const { name, onChange } = this.props;

    onChange({ target: { name, value: option.value } });

    const geocodeRes = await geocodeByAddress(option.value);
    const latLng = getLatLng(geocodeRes);
    onChange({ target: { name: "locationPosition", value: latLng } });
  };

  loadOptions = inputValue => {
    return new Promise((resolve, reject) => {
      this.autocompleteService.getPlacePredictions(
        { input: inputValue },
        (predictions, serviceStatus) => {
          if (
            serviceStatus !== window.google.maps.places.PlacesServiceStatus.OK
          ) {
            reject();
            return;
          }
          resolve(
            predictions.map(place => ({
              value: place.description,
              label: place.description
            }))
          );
        }
      );
    });
  };

  render() {
    const { value } = this.props;

    return (
      <NoSsr>
        <MuiSelect
          placeholder="Location"
          noOptionsMessage={() => "Type in an address"}
          cacheOptions
          loadOptions={this.loadOptions}
          value={{ value, label: value }}
          onChange={this.onChange}
        />
      </NoSsr>
    );
  }
}
