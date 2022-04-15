import React, {} from "react"
import {SpaceVertical, Heading, UnorderedList, Code, Card, CardContent} from "@looker/components"

export const DrawerContent = () => {
    return (
    <>
        <SpaceVertical gap="u12" style={{margin:"2rem 2rem 2rem 2rem", maxWidth: "90%"}}>
            <Card raised>
                <CardContent>
                    <Heading as="h1" fontWeight="bold" textTransform="capitalize">Merge Explore Query Pre-Requisites</Heading>
                    <UnorderedList type="bullet">
                        <li style={{marginBottom:"1rem"}}>The url's inputted must be explore urls.</li>
                        <li style={{marginBottom:"1rem"}}>The explore url's must contain a <Code>qid=</Code> or query id in the url itself.</li>
                        <li style={{marginBottom:"1rem"}}>Merge Monster expects a normal explore url and not an expanded explore url (which is the url received when clicking "Share" in the Explore and grabbing
                            expanded url.)</li>
                        <li style={{marginBottom:"1rem"}}>All explore queries inputted must have a common dimension key (or shared table calc column) to be joined on otherwise you will get an error/warning in the resulting merge that no common key is 
                            shared and that the merge failed.
                        </li>
                        <li style={{marginBottom:"1rem"}}>Your explore queries must not contain any pivots.</li>
                        <li style={{marginBottom:"1rem"}}>Merge queries don't support specifying a join condition, as such all queries will be left joined to the first merge input (so make sure the base query/base merge 
                            is at the most granular level you are trying to show.
                        </li>
                        <li style={{marginBottom:"1rem"}}>Merge Queries can be expensive computations, as such we limit the amount of queries that can be merged to 5-6.</li>
                    </UnorderedList>
                </CardContent>
            </Card>
        </SpaceVertical>
    </>
    )
}