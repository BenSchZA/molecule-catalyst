/**
 *
 * EditorField
 *
 */

import React from 'react';
import SimpleMDEEditor from 'react-simplemde-editor';
import "easymde/dist/easymde.min.css";
import {apiClient} from '../../api';
import apiUrlBuilder from 'api/apiUrlBuilder';



interface OwnProps {
  value?: string,
  placeholder?: string,
  onChange(string): void,
}

const MDEditor: React.SFC<OwnProps> = ({value, placeholder, onChange}: OwnProps) => (
  <SimpleMDEEditor
    options={
      {
        initialValue: value,
        spellChecker: true,
        placeholder: placeholder,
        uploadImage: true,
        imageUploadFunction: async (file, onSuccess, onError) => {
          try {
            const api = new apiClient()
            const apiResponse = await api.uploadSupportingDocument(file) 
            if (apiResponse.success) {
              onSuccess(apiUrlBuilder.attachmentStream(apiResponse.data))
            } else {
              onError('Something went wrong uploading this file. Please try again');
            }
          } catch (error) {
            onError('Something went wrong uploading this file. Please try again');
          }
        },
        hideIcons: ['side-by-side','fullscreen']
      }
    }
    onChange={(value) => onChange(value)} />
)

export default MDEditor;
