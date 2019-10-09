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
        uploadImage: false,
        placeholder: "",
      }
    }
    onChange={(value) => {
      setFieldValue(field.name, value);
      setTouched({ [field.name]: true });
    }} />
)

export default withStyles(styles, { withTheme: true })(EditorField);
