/**
 *
 * EditorField
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, FormControl, FormHelperText } from '@material-ui/core';
import "easymde/dist/easymde.min.css";
import { FieldProps, getIn } from 'formik';
import MDEditor from 'components/MDEditor';

const styles = (theme: Theme) =>
  createStyles({

  });

interface OwnProps extends FieldProps, WithStyles<typeof styles> {
  placeholder?: string
}

const MDEditorMUIFormik: React.SFC<OwnProps> = ({
  classes,
  field: {
    name,
    value
  },
  placeholder,
  form: {
    touched,
    errors,
    setFieldValue,
    setTouched
  } }: OwnProps) => {

  const fieldError = getIn(errors, name);
  const showError = getIn(touched, name) && !!fieldError;

  return (
    <FormControl fullWidth>
      <MDEditor
        placeholder={placeholder}
        onChange={(value) => {
          setFieldValue(name, value);
          setTouched({ [name]: true });
        }}
        value={value} />
      {showError &&
        <FormHelperText error>
          {fieldError}
        </FormHelperText>}
    </FormControl>
  )
}

export default withStyles(styles, { withTheme: true })(MDEditorMUIFormik);
