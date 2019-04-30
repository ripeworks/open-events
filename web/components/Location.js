import { AutoComplete } from "antd";

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

export default class extends React.Component {
  state = {
    places: []
  }

  componentDidMount() {
    this.autocompleteService = new window.google.maps.places.AutocompleteService();
  }

  onChange = async value => {
    const { onChange } = this.props;

    const geocodeRes = await geocodeByAddress(value);
    const latLng = getLatLng(geocodeRes);
    onChange({
      address: value,
      latlng: latLng
    })
  };

  loadOptions = async inputValue => {
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
          resolve(
            predictions.map(place => place.description)
          );
        }
      );
    });
    this.setState({ places });
  };

  render() {
    const { value, onChange, ...props } = this.props;

    return (
      <AutoComplete
        {...props}
        dataSource={this.state.places}
        onSearch={this.loadOptions}
        onSelect={this.onChange}
      />
    );
  }
}
