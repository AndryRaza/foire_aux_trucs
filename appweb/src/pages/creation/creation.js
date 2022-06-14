import React, { useState } from 'react'
import { Container, Button } from 'react-bootstrap';


import EditorRender from '../../components/editor/editor';
import RenderHTML from '../../components/renderHTML/renderhtml';
import ImgComponent from '../../components/img/img';
import FooterComponent from '../../components/footer/footer';

import './creation.css'

const Render = () => {

    const [display, setDisplay] = useState("default")

    const [htmlBefore, setHtmlBefore] = useState("");

    const addContent = (content) => {
        setHtmlBefore(htmlBefore + content)
    }

    const display_ = () => {

        if (display === "default") {
            return (
                <div className="box">
                    <Button variant='dark' onClick={() => setDisplay("choices")}>+</Button>
                </div>
            )
        }

        if (display === "choices") {
            return (
                <div className="box">
                    <Button variant="dark" className="mx-1" onClick={() => setDisplay("paragraphe")} > Paragraphe</Button>
                    <Button variant="dark" onClick={() => setDisplay("image")}  > Img</Button>
                </div>
            )
        }

        if (display === "paragraphe") {
            return (
                <EditorRender toParent={setDisplay} addContent={addContent} />
            )
        }

        if (display === "image") {
            return (
                <div className="box">
                    <ImgComponent  toParent={setDisplay}  addContent={addContent} />
                </div>
            )
        }

    }

    document.title = "Mode création"

    return (
        <Container className="py-3">
            <h1 className="text-center">Mode Création</h1>

            <RenderHTML txt={htmlBefore} />

            {display_()}

            <FooterComponent />

        </Container>
    );
}

export default Render