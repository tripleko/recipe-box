import React from 'react';
import {ListGroupItem} from 'reactstrap';

function IngredientList(props) {
    let listIng;

    if (Array.isArray(props.ingredients) && props.ingredients.length > 0) {
        listIng = props.ingredients.map((item) =>
            <ListGroupItem>{item}</ListGroupItem>
        );
    }

    else {
        listIng = <ListGroupItem>Ingredients undefined.</ListGroupItem>;
    }

    return (
        <div>{listIng}</div>
    );
}

export default IngredientList;