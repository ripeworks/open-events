import React from "react";
import { AutoComplete } from "antd";
import { geocodeByAddress, getLatLng } from "../utils";

const { Option } = AutoComplete;

export default class Location extends React.Component {
  state = {
    places: [],
  };

  componentDidMount() {
    this.autocompleteService = new window.google.maps.places.AutocompleteService();
  }

  // user selected an option
  onChange = async (value) => {
    const { onChange } = this.props;

    // support custom values
    if (value.text && value.text.match(/custom/i)) {
      onChange({ address: value, latlng: null });
      return;
    }

    const geocodeRes = await geocodeByAddress(value);
    const latLng = getLatLng(geocodeRes);
    onChange({
      address: value,
      latlng: latLng,
    });
  };

  loadOptions = async (inputValue) => {
    if (!inputValue) return;

    const places = await new Promise((resolve, reject) => {
      this.autocompleteService.getPlacePredictions(
        { input: inputValue },
        (predictions, serviceStatus) => {
          if (
            serviceStatus !== window.google.maps.places.PlacesServiceStatus.OK
          ) {
            reject();
            return;
          }
          resolve(predictions.map((place) => place.description));
        }
      );
    });

    // allow entering custom location
    places.push({ value: inputValue, text: `Custom: ${inputValue}` });

    this.setState({ places });
  };

  render() {
    const {
      value,
      onChange,
      initialValue: defaultValue,
      ...props
    } = this.props;

    return (
      <AutoComplete
        {...props}
        defaultValue={defaultValue}
        dataSource={this.state.places}
        onSearch={this.loadOptions}
        onSelect={this.onChange}
        optionLabelProp="value"
      />
    );
  }
}
