import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const StudentForm = () => {
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const initialValues = {
    name: '',
    email: '',
    dateOfBirth: '',
    math: '',
    physics: '',
    chemistry: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    dateOfBirth: Yup.date().required('Date of Birth is required'),
    math: Yup.number().required('Marks in Mathematics are required').min(0, 'Marks cannot be negative'),
    physics: Yup.number().required('Marks in Physics are required').min(0, 'Marks cannot be negative'),
    chemistry: Yup.number().required('Marks in Chemistry are required').min(0, 'Marks cannot be negative'),
  });
  const handleSubmit = (values, { resetForm }) => {
    fetch('http://localhost:5002/api/students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    })
    .then(response => {
        if (response.ok) {
            resetForm();
            setSubmissionSuccess(true);
        } else {
            // Handle the error case
            return response.json().then(err => {
                throw new Error(err.message || 'Error submitting form');
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Submission failed: ' + error.message);
    });
};
  return (
    <div>
      <h1>Student Information Form</h1>
      {submissionSuccess && <p style={{ color: 'green' }}>Submission successful!</p>}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isValid, dirty }) => (
          <Form>
            <div>
              <label>Name:</label>
              <Field name="name" type="text" />
              <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
            </div>
            <div>
              <label>Email:</label>
              <Field name="email" type="email" />
              <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
            </div>
            <div>
              <label>Date of Birth:</label>
              <Field name="dateOfBirth" type="date" />
              <ErrorMessage name="dateOfBirth" component="div" style={{ color: 'red' }} />
            </div>
            <div>
              <label>Mathematics Marks:</label>
              <Field name="math" type="number" />
              <ErrorMessage name="math" component="div" style={{ color: 'red' }} />
            </div>
            <div>
              <label>Physics Marks:</label>
              <Field name="physics" type="number" />
              <ErrorMessage name="physics" component="div" style={{ color: 'red' }} />
            </div>
            <div>
              <label>Chemistry Marks:</label>
              <Field name="chemistry" type="number" />
              <ErrorMessage name="chemistry" component="div" style={{ color: 'red' }} />
            </div>
            <button type="submit" disabled={!isValid || !dirty}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StudentForm;
