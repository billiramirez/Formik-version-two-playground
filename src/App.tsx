import React from "react";
import {Formik, Field, Form, useField, FieldAttributes, FieldArray} from "formik";
import {TextField, Button, Checkbox, Radio, FormControlLabel, Select, MenuItem} from '@material-ui/core';
import * as yup from 'yup';


type MyRadioProps = { label: string } & FieldAttributes<{}>

const MyRadio: React.FC<MyRadioProps> = ({label, ...props}) => {
  const [field] = useField<{}>(props);
  return (
    <FormControlLabel
      {...field}
      control={<Radio/>}
      label={label}
    />
  )
}

const MyTextField: React.FC<FieldAttributes<{}>> = ({placeholder, ...props}) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (<TextField {...field} helperText={errorText} placeholder={placeholder} error={!!errorText}/>)
}

const validationSchema = yup.object({
  firstName: yup.string().required(). max(10),
  pets: yup.array().of(yup.object({
    name: yup.string().required()
  }))
})

const App: React.FC = () => {
  return <div className="App">
      <Formik
        initialValues={{
          firstName: 'bob',
          lastName: "hey",
          isTall: false,
          cookies: [],
          yogurt: '',
          pets: [
            { type: "cat", name: "jarvis", id: "" + Math.random()}]
          }}
        onSubmit={(data, {setSubmitting})=> {
          setSubmitting(true);
          console.log(data);
          setSubmitting(false);
        }}
        validationSchema={validationSchema}
        // validate={(values) => {
        //   const errors: Record<string, string> = {};
        //   if(values.firstName.includes('bob')){
        //     errors.firstName =  "no bob";
        //   }
        //   return errors;
        // }}
      >
        {
          ({values, errors, isSubmitting}) => (
            <Form>
              <div>
                <MyTextField
                  placeholder="first name"
                  name="firstName"
                  type="input"
                />
              </div>
              <div>
                <MyTextField
                  placeholder="last name"
                  name="lastName"
                  type="input"
                />
              </div>
              <div>
                <Field
                  name="isTall"
                  type="checkbox"
                  as={Checkbox}
                />
              </div>
              <div>Cookies:</div>
              <Field name="cookies" type="checkbox" value="chocolate chip" as={Checkbox}/>
              <Field name="cookies" type="checkbox" value="snicker doodle" as={Checkbox}/>
              <Field name="cookies" type="checkbox" value="sugar chip" as={Checkbox}/>
              <div>Yogurt</div>
              <MyRadio name="yogurt" type="radio" value="peach" label="peach"/>
              <MyRadio name="yogurt" type="radio" value="strawberry" label="strawberry"/>
              <MyRadio name="yogurt" type="radio" value="orange" label="orange"/>
              <FieldArray name="pets">
                {
                  (arraysHelpers) => (
                    <div>
                      <Button onClick={() => arraysHelpers.push({
                        type: "frog",
                        name: '',
                        id: "" + Math.random()
                      })}
                      >
                        Add Pet
                      </Button>
                      {values.pets.map((pet, index) => {
                        return (
                        <div key={pet.id}>
                          <MyTextField
                            name={`pets.${index}.name`}
                            placeholder="pet name"
                          />
                          <Field name={`pets.${index}.type`} type="select" as={Select}>
                            <MenuItem value="cat">cat</MenuItem>
                            <MenuItem value="frog">frog</MenuItem>
                            <MenuItem value="lemur">lemur</MenuItem>

                          </Field>
                          <Button onClick={() => arraysHelpers.remove(index)}>X </Button>
                        </div>
                      )})}
                    </div>
                  )
                }
              </FieldArray>

              <div>
                <Button disabled={isSubmitting} type="submit">Submit</Button>
              </div>
              <pre>
                {JSON.stringify(values, null, 2)}
              </pre>
              <pre>
                {JSON.stringify(errors, null, 2)}
              </pre>
            </Form>
          )
        }
      </Formik>

     </div>
}
export default App;
