import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

const FormProviderContext = ({children, schema, defaultValues}) => {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues
  })
  return (
   <FormProvider {...methods}>
      {children}
   </FormProvider>
  )
}

export default FormProviderContext
