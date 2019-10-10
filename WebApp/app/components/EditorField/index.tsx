/**
 *
 * EditorField
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles } from '@material-ui/core';
import SimpleMDEEditor from 'react-simplemde-editor';
import "easymde/dist/easymde.min.css";
import { FieldProps } from 'formik';
import * as api from '../../api';
import apiUrlBuilder from 'api/apiUrlBuilder';

const styles = (theme: Theme) =>
  createStyles({

  });

interface OwnProps extends FieldProps, WithStyles<typeof styles> { }

const EditorField: React.SFC<OwnProps> = ({ classes, field, form: { touched, errors, isSubmitting, setFieldValue, setTouched } }: OwnProps) => (
  <SimpleMDEEditor
    options={
      {
        initialValue: field.value,
        spellChecker: false,
        placeholder: "",
        uploadImage: true,
        imageUploadFunction: async (file, onSuccess, onError) => {
          console.log(file.size)
          try {
            const apiResponse = await api.uploadSupportingDocument(file, '') //TODO: Get token from localStorage
            console.log(apiResponse);
            onSuccess(apiUrlBuilder.attachmentStream(apiResponse.data))
          } catch (error) {
            onError('Something went wrong uploading this file. Please try again');
          }
        },
      }
    }
    onChange={(value) => {
      setFieldValue(field.name, value);
      setTouched({ [field.name]: true });
    }} />
)

export default withStyles(styles, { withTheme: true })(EditorField);
