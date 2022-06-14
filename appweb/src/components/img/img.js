import React from "react";
import ImageUploading from 'react-images-uploading';
import './img.css'

const ImgComponent = (props) => {
    const [images, setImages] = React.useState([]);
    const maxNumber = 1;

    const onChange = (imageList, addUpdateIndex) => {
        props.addContent(`
        <div class="img-box">
            <img src=${imageList[0]['data_url']} />
        </div>
        `)
        props.toParent("default")
        setImages(imageList);
    };

    return (
        <div className="App">
            <ImageUploading
                value={images}
                onChange={onChange}
                maxNumber={maxNumber}
                dataURLKey="data_url"
            >
                {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                }) => (
                    // write your building UI
                    <div className="upload__image-wrapper">
                        {
                            images.length === 0 ?   <button
                                style={isDragging ? { color: 'red' } : undefined}
                                onClick={onImageUpload}
                                {...dragProps}
                            >
                            Click or Drop here
                            </button> : null
                        }

                        {/* &nbsp;
                        <button onClick={onImageRemoveAll}>Remove all images</button>
                        {imageList.map((image, index) => (
                            <div key={index} className="image-item">
                                <img src={image['data_url']}/>
                                <div className="image-item__btn-wrapper">
                                    <button onClick={() => onImageUpdate(index)}>Update</button>
                                    <button onClick={() => onImageRemove(index)}>Remove</button>
                                </div>
                            </div>
                        ))} */}
                    </div>
                )}
            </ImageUploading>
        </div>
    );

}

export default ImgComponent