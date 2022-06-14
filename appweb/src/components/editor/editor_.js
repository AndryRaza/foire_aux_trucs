import React, { useState } from 'react'

import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw} from 'draft-js';
import 'draft-js/dist/Draft.css';

import { Button } from 'react-bootstrap';

import convertToHTML_ from '../../helper/outil';

const EditorRender = (props) => {

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );

    const editor = React.useRef(null);

    function focusEditor() {
        editor.current.focus();
    }

    const StyleButton = (props) => {
        let onClickButton = (e) => {
            e.preventDefault();
            props.onToggle(props.style);
        };
        return <Button className="m-1" variant='dark' onMouseDown={onClickButton}>{props.label}</Button>;
    };

    const BLOCK_TYPES = [
        { label: "H1", style: "header-one" },
        { label: "H2", style: "header-two" },
        { label: "H3", style: "header-three" },
        //{ label: "H4", style: "header-four" },
        //{ label: "H5", style: "header-five" },
        //{ label: "H6", style: "header-six" },
        { label: "Blockquote", style: "blockquote" },
        //{ label: "UL", style: "unordered-list-item" },
        //{ label: "OL", style: "ordered-list-item" },
        //{ label: "Code Block", style: "code-block" }
    ];

    const BlockStyleControls = (props) => {
        return (
            <div>
                {BLOCK_TYPES.map((type) => (
                    <StyleButton
                        key={type.label}
                        label={type.label}
                        onToggle={props.onToggle}
                        style={type.style}
                    />
                ))}
            </div>
        );
    };

    const INLINE_STYLES = [
        { label: "Bold", style: "BOLD" },
        { label: "Italic", style: "ITALIC" },
        { label: "Underline", style: "UNDERLINE" },
        { label: "Monospace", style: "CODE" },
        { label: "Center", style:"CENTER" }
    ];
    const InlineStyleControls = (props) => {
        return (
            <div>
                {INLINE_STYLES.map((type) => (
                    <StyleButton
                        key={type.label}
                        label={type.label}
                        onToggle={props.onToggle}
                        style={type.style}
                    />
                ))}
            </div>
        );
    };

    const onInlineClick = (e) => {
        let nextState = RichUtils.toggleInlineStyle(editorState, e);
        setEditorState(nextState);
    };

    const onBlockClick = (e) => {
        let nextState = RichUtils.toggleBlockType(editorState, e);
        setEditorState(nextState);
    };

    const validate = () => {

        var rawData = convertToRaw(editorState.getCurrentContent())
        var data = convertToHTML_(rawData)
        props.addContent(data.toString());
        props.toParent("default")
    }

    return (
        <div>
            <div
                style={{ border: "1px solid black", minHeight: "10em", cursor: "text", margin: "6em" }}
                onClick={focusEditor}
            >
                <div className="d-flex flex-column" style={{ border: "1px solid black" }}>
                    <BlockStyleControls onToggle={onBlockClick} />
                    <InlineStyleControls onToggle={onInlineClick} />
                </div>
                <div style={{ height: "1px", border: "1px solid black", width: "100%" }}></div>
                <div >
                    <Editor
                        ref={editor}
                        editorState={editorState}
                        onChange={(editorState) => setEditorState(editorState)}
                    />
                </div>
            </div>

            <div className="d-flex justify-content-end" style={{margin:"6em"}}>
                <Button className="mx-3" variant='danger' onClick={()=>props.toParent("default")}>Annuler</Button>
                <Button variant='success' onClick={()=>validate()} >Valider</Button>
            </div>
        </div>
    );
}

export default EditorRender