/*

 MIT License

 Copyright (c) 2022 Looker Data Sciences, Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  Dialog,
  DialogLayout,
  Form,
  Button,
  FieldText,
  FieldSelect,
} from '@looker/components'
import US from 'countries-states-json/dist/states/US.json'

const stateOptions = US.map(({ name, code }) => ({ label: name, value: code }))

/**
 * Popup dialog form for adding or updating a row in the sheet.
 */
export const SheetsForm = ({
  showForm,
  setShowForm,
  row,
  index,
  isInsert,
  onRowSave,
  rows,
}) => {
  const [currentIndex, setCurrentIndex] = useState()
  const [name, setName] = useState('')
  const [gender, setGender] = useState('')
  const [year, setYear] = useState('')
  const [state, setState] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [major, setMajor] = useState('')
  const [activity, setActivity] = useState('')
  const [majors, setMajors] = useState([])
  const [activities, setActivities] = useState([])
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    if (showForm && currentIndex !== index) {
      setCurrentIndex(index)
      setName(row[0])
      setGender(row[1])
      setYear(row[2])
      setState(row[3])
      setMajor(row[4])
      setActivity(row[5])
    }
    const availableMajors = []
    const availableActivities = []
    rows.forEach((row) => {
      if (!availableMajors.includes(row[4])) {
        availableMajors.push(row[4])
      }
      if (!availableActivities.includes(row[5])) {
        availableActivities.push(row[5])
      }
    })
    const compare = (a, b) => {
      if (a < b) return -1
      if (a > b) return 1
      return 0
    }
    availableMajors.sort(compare)
    availableActivities.sort(compare)
    setMajors(
      availableMajors.map((value) => ({
        value,
      }))
    )
    setActivities(
      availableActivities.map((value) => ({
        value,
      }))
    )
    validate(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, showForm, row, rows])

  const validateRequired = (name, label, value, errors) => {
    if (!value || value.trim().length < 1) {
      errors[name] = {
        message: `${label} required`,
        type: 'error',
      }
    }
  }

  const validate = (showErrors) => {
    const errors = {}
    validateRequired('name', 'Name', name, errors)
    validateRequired('gender', 'Gender', gender, errors)
    validateRequired('year', 'Year', year, errors)
    validateRequired('state', 'State', state, errors)
    validateRequired('major', 'Major', major, errors)
    if (showErrors) {
      setValidationErrors(errors)
    }
    return Object.keys(errors).length === 0
  }

  const newStateOptions = useMemo(() => {
    if (stateFilter === '') return stateOptions
    return stateOptions.filter((option) =>
      option.label.toLowerCase().includes(stateFilter.toLowerCase())
    )
  }, [stateFilter])

  const onSubmit = (e) => {
    e.preventDefault()
    if (validate(true)) {
      onRowSave(index, [name, gender, year, state, major, activity])
      closeDialog()
    }
  }

  const closeDialog = () => {
    setValidationErrors({})
    setShowForm(false)
    setCurrentIndex(undefined)
    setName('')
    setGender('')
    setYear('')
    setState('')
    setMajor('')
    setActivity('')
  }

  return (
    <Dialog isOpen={showForm} onClose={() => closeDialog()}>
      <DialogLayout header="Row details">
        <Form onSubmit={onSubmit} validationMessages={validationErrors}>
          <FieldText
            label="Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
          <FieldSelect
            label="Gender"
            value={gender}
            name="gender"
            options={[
              { value: 'Male' },
              { value: 'Female' },
              { value: 'Other' },
            ]}
            onChange={(value) => setGender(value)}
          />
          <FieldSelect
            label="Year"
            value={year}
            name="year"
            options={[
              { value: '1. Freshman' },
              { value: '2. Sophomore' },
              { value: '3. Junior' },
              { value: '4. Senior' },
            ]}
            onChange={(value) => setYear(value)}
          />
          <FieldSelect
            label="State"
            value={state}
            name="state"
            isFilterable={true}
            onFilter={(value) => setStateFilter(value)}
            onChange={(value) => setState(value)}
            options={newStateOptions}
          />
          <FieldSelect
            label="Major"
            value={major}
            name="major"
            onChange={(value) => setMajor(value)}
            options={majors}
          />
          <FieldSelect
            label="Activity"
            value={activity}
            name="activity"
            onChange={(value) => setActivity(value)}
            options={activities}
            isClearable={true}
          />
          <Button type="submit">{isInsert ? 'Insert' : 'Update'}</Button>
        </Form>
      </DialogLayout>
    </Dialog>
  )
}

SheetsForm.propTypes = {
  index: PropTypes.number,
  isInsert: PropTypes.bool,
  onRowSave: PropTypes.func.isRequired,
  row: PropTypes.array,
  rows: PropTypes.array.isRequired,
  setShowForm: PropTypes.func.isRequired,
  showForm: PropTypes.bool,
}
