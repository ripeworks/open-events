import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";

export default class Page extends React.Component {
  onSubmit = (e) => {
      e.preventDefault();
      // submit to API
  }

  render() {
    return (
      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h1">Northport Omena Calendar</Typography>
          <form>
            <TextField
              defaultValue="Bare"
              margin="normal"
              variant="filled"
            />
          </form>
        </Box>
      </Container>
    );
  }
}
