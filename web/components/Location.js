import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import Select from "react-select";

export default class extends React.Component {
  onError = () => {
    console.log("ERROR");
  }

  render() {
    const {value, onChange, onSelect} = this.props;

    return <PlacesAutocomplete
      value={value}
      onChange={onChange}
      onSelect={onSelect}
      onError={this.onError}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <Select
            isLoading={loading}
            isSearchable
            options={suggestions}
            {...getInputProps()}
          />
        </div>
      )}
    </PlacesAutocomplete>
  }
}
