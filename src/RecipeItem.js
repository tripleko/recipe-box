import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import {DragSource, DropTarget} from 'react-dnd';
import {Button, ButtonGroup, ListGroup, Collapse, CardHeader, Card, CardBlock} from 'reactstrap';
import IngredientList from './IngredientList';

const itemSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index
        };
    }
};

//This and some of the other code here was adapted from the react-dnd sortable example with very few changes.
//I'm still getting a handle on how react-dnd works as of this writing so I left in the original comments.
const itemTarget = {
    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }

        // Time to actually perform the action
        props.moveItem(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    }
};

class RecipeItem extends Component {
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        index: PropTypes.number.isRequired,
        isDragging: PropTypes.bool.isRequired,
        id: PropTypes.any.isRequired,
        recipeName: PropTypes.string.isRequired,
        moveItem: PropTypes.func.isRequired,
        removeItem: PropTypes.func.isRequired,
        ingredients: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {collapse: false};
    }

    toggle() {
        this.setState({collapse: !this.state.collapse});
    }

    render() {
        const {recipeName, connectDragSource, connectDropTarget, ingredients} = this.props;

        return connectDragSource(connectDropTarget(
            <div>
                <CardBlock>
                    <Card>
                        <CardHeader onClick={this.toggle}>
                            {recipeName}
                        </CardHeader>
                        <Collapse isOpen={this.state.collapse}>
                            <CardBlock>
                                Ingredients!
                                <ListGroup className="sortable">
                                    <IngredientList ingredients={ingredients}/>
                                </ListGroup>
                            </CardBlock>
                            <CardBlock>
                                <ButtonGroup vertical>
                                    <Button color="danger" onClick={() => this.props.removeItem(this.props.id)}>Delete Recipe</Button>
                                </ButtonGroup>
                            </CardBlock>
                        </Collapse>
                    </Card>
                </CardBlock>
            </div>
        ));
    }
}

export default DropTarget("recipeItem", itemTarget, connect => ({
    connectDropTarget: connect.dropTarget()
}))(DragSource("recipeItem", itemSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))(RecipeItem)
);