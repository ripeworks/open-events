import { Upload, Icon } from "antd";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

export default class extends React.Component {
  state = {
    loading: false
  };

  componentDidUpdate(prevProps) {
    const { props } = this;

    if (props.fileList !== prevProps.fileList) {
      this.setState({ imageUrl: null });
    }
  }

  onChange = e => {
    const { onChange } = this.props;

    if (e.file.status === "uploading") {
      this.setState({ loading: true });
    }

    if (e.file.status === "done") {
      getBase64(e.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false
        })
      );
    }

    onChange(e.fileList);
  };

  render() {
    const { onChange, ...props } = this.props;
    const { loading, imageUrl } = this.state;

    return (
      <Upload
        listType="picture-card"
        showUploadList={false}
        onChange={this.onChange}
        {...props}
      >
        {imageUrl ? (
          <img src={imageUrl} />
        ) : (
          <div>
            <Icon type={loading ? "loading" : "plus"} />
            <div className="ant-upload-text">Upload</div>
          </div>
        )}
      </Upload>
    );
  }
}
