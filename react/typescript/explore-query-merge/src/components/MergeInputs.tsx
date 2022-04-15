// Copyright 2021 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { useEffect, useState} from 'react'
import { FieldText, Grid} from '@looker/components'
import { Range } from '../utils/helpers'

interface InputProps {
    inputs: number
}
export const MergeInputs = ({inputs}: InputProps) => {
    const [range, setRange] = useState([0,1])

    useEffect(() => {
        console.log(Array.from(Array(inputs).keys()))
        console.log('the inputs: ' + inputs)
        setRange((Range(inputs)))
    },[inputs])

    return (
    // creating array range to loop over
        <>
        <Grid columns={2}>
            {range.map((input, key) => (
                <FieldText id={key} label={`Merge ${input + 1}`} name={`merge${input + 1}`} style={{maxWidth:'95%'}}/>
                )
            )}
        </Grid>
        </>
    )
}