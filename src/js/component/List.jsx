import React from "react";


const List = ({values = [], children}) => {
    return (
        <ul>
          {values.map(children)}
        </ul>
    )
}

export default List;