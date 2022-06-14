import React, { useState, useRef } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';
import './editor.css';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';

import {
  BoldButton,
  ItalicButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
  HeadlineOneButton
} from '@draft-js-plugins/buttons';


import { Button } from 'react-bootstrap';

import convertToHTML_ from '../../helper/outil';

const staticToolbarPlugin = createToolbarPlugin();
const { Toolbar } = staticToolbarPlugin;
const plugins = [staticToolbarPlugin];



const EditorRender = (props) => {
  const editor = useRef(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onChange = (editorState) => {
    setEditorState(editorState);
  };

  const validate = () => {

    var rawData = convertToRaw(editorState.getCurrentContent())
    var data = convertToHTML_(rawData)
    props.addContent(data.toString());
    props.toParent("default")
  }


  return (
    <div>
      <div className='editor'>
        <Editor
          editorState={editorState}
          onChange={onChange}
          plugins={plugins}
          ref={editor}
        />
        <Toolbar>
          {
            (externalProps) => (
              <div className='icons-toolbar'>
                <HeadlineOneButton {...externalProps} />
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                <UnorderedListButton {...externalProps} />
                <OrderedListButton {...externalProps} />
                <BlockquoteButton {...externalProps} />
                <CodeBlockButton {...externalProps} />
              </div>
            )
          }
        </Toolbar>
      </div>
      <div className="d-flex justify-content-end" style={{ margin: "6em" }}>
        <Button className="mx-3" variant='danger' onClick={() => props.toParent("default")}>Annuler</Button>
        <Button variant='success' onClick={() => validate()} >Valider</Button>
      </div>
    </div>
  );
};


export default EditorRender;