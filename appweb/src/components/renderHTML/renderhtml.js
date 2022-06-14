import React, { useEffect, useState } from "react";
import "./renderHTML.css"

const RenderHTML = (props) => {

    const [content,setContent] = useState(props.txt)

    useEffect(()=>{
        setContent(props.txt)
    },[props.txt])

    function createMarkup() {
        return {__html: content};
      }
      
      function MyComponent() {
        return <div dangerouslySetInnerHTML={createMarkup()} />;
      }
      

    return (
        <div>
            {
                MyComponent()
            }
        </div>       
    )


}

export default RenderHTML