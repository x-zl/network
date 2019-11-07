import React, { Component } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap';

const BaseProfile = (props) => {
  const { formInfo, handleChange, readOnly } = props;
  return (
    <>
      <FormGroup>
        <Label for="name">name</Label>
        <Input
          type="text"
          name="name"
          value={formInfo.name||''}
          onChange={readOnly ? undefined : handleChange}
          readOnly={readOnly}
          placeholder="Enter Your Name"
        />
      </FormGroup>
      <FormGroup>
        <Label for="major">major</Label>
        <Input
          type="text"
          name="major"
          value={formInfo.major||''}
          onChange={readOnly ? undefined : handleChange}
          readOnly={readOnly}
          placeholder="Enter major"
        />
      </FormGroup>
      <FormGroup>
        <Label for="IDCard">IDCard</Label>
        <Input
          type="text"
          name="IDCard"
          value={formInfo.IDCard||''}
          onChange={readOnly ? undefined : handleChange}
          readOnly={readOnly}
          placeholder="Enter IDCard"
        />
      </FormGroup>
      <FormGroup>
        <Label for="phone_number" require={true}>phone_number</Label>
        <Input
          type="text"
          name="phone_number"
          value={formInfo.phone_number||''}
          onChange={readOnly ? undefined : handleChange}
          readOnly={readOnly}
          placeholder="Enter phone_number"
        />
      </FormGroup>
    </>
  )
};

export default BaseProfile;
