import { GoogleMap, Marker, withGoogleMap } from "react-google-maps";
import { geocodeByAddress, getLatLng } from "../utils";

class Map extends React.Component {
  state = {
    latLng: null
  };

  componentDidMount() {
    this.loadLocation();
  }

  loadLocation = async () => {
    const { location } = this.props;
    const geocodeRes = await geocodeByAddress(location);
    const latLng = getLatLng(geocodeRes);

    this.setState({ latLng });
  };

  render() {
    const { latLng } = this.state;
    if (!latLng) return null;

    return (
      <GoogleMap defaultCenter={latLng} defaultZoom={17}>
        <Marker position={latLng} />
      </GoogleMap>
    );
  }
}

export default withGoogleMap(Map);
