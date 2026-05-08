import { createContext, useEffect, useState } from 'react'

export const DataContext = createContext()



export const DataContextProvider = ({ children }) => {

    const [jsId, setJsID] = useState("")

    console.log(jsId)


    return (
        <DataContext.Provider value={{ setJsID, jsId }}>
            {children}
        </DataContext.Provider>
    )

}