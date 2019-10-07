import { Button, Modal, Upload, Icon } from "antd";
import Cropper from "react-easy-crop";
import fetch from "unfetch";
import { getPhotoUrl } from "../utils";

const readFile = file => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
};

const createImage = url =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", error => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param {File} image - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {number} rotation - optional rotation parameter
 */
async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // set width to double image size to allow for a safe area for the
  // image to rotate in without being clipped by canvas context
  canvas.width = image.width * 2;
  canvas.height = image.height * 2;

  // translate canvas context to a central location to allow rotating around the center.
  ctx.translate(image.width, image.height);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-image.width, -image.height);

  // draw rotated image and store data.
  ctx.drawImage(image, image.width / 2, image.height / 2);
  const data = ctx.getImageData(0, 0, image.width * 2, image.height * 2);

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image with correct offsets for x,y crop values.
  ctx.putImageData(
    data,
    0 - image.width / 2 - pixelCrop.x,
    0 - image.height / 2 - pixelCrop.y
  );

  // As Base64 string
  // return canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise(resolve => {
    canvas.toBlob(file => {
      resolve(file);
    }, "image/jpeg");
  });
}

export default class extends React.Component {
  state = {
    crop: { x: 0, y: 0 },
    zoom: 1,
    croppedAreaPixels: null,
    loading: false,
    imageBase64: null,
    fileList: this.props.fileList || []
  };

  componentDidUpdate(prevProps, prevState) {
    const { props, state } = this;

    if (props.fileList !== prevProps.fileList) {
      this.setState({ imageUrl: null });
    }
  }

  beforeUpload = async file => {
    const imageBase64 = await readFile(file);

    this.setState(state => ({
      imageBase64,
      fileList: [...state.fileList, file]
    }));

    // prevent Upload from uploading
    return false;
  };

  onCancel = () => {
    const { onChange } = this.props;

    this.setState({ imageBase64: null, fileList: [] });
    onChange([]);
  };

  onSave = async () => {
    this.setState({ loading: true });
    const { onChange } = this.props;
    const { croppedAreaPixels, imageBase64 } = this.state;
    const croppedImage = await getCroppedImg(imageBase64, croppedAreaPixels);

    const body = new FormData();
    body.append("file", croppedImage);

    const res = await fetch("/api/photo", {
      body,
      method: "POST"
    });
    const json = await res.json();
    const fileList = [{ ...this.state.fileList[0], response: json }];

    onChange(fileList);

    this.setState({
      loading: false,
      imageBase64: null,
      imageUrl: getPhotoUrl(json.webViewLink),
      fileList
    });
  };

  render() {
    const { onChange, ...props } = this.props;
    const { crop, zoom, loading, fileList, imageBase64, imageUrl } = this.state;

    return (
      <>
        <Upload
          listType="picture-card"
          fileList={fileList}
          showUploadList={false}
          beforeUpload={this.beforeUpload}
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
        <Modal
          confirmLoading={loading}
          closable={false}
          visible={!!imageBase64}
          width="90%"
          onCancel={this.onCancel}
          onOk={this.onSave}
        >
          <div className="crop-container">
            <Cropper
              image={imageBase64}
              aspect={2}
              crop={crop}
              zoom={zoom}
              onCropChange={crop => this.setState({ crop })}
              onCropComplete={(croppedArea, croppedAreaPixels) =>
                this.setState({ croppedAreaPixels })
              }
              onZoomChange={zoom => this.setState({ zoom })}
            />
          </div>
        </Modal>
      </>
    );
  }
}
