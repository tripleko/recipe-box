import React, {Component} from 'react';
import update from 'react/lib/update';
import RecipeItem from './RecipeItem';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {Button, Card, CardBlock, Modal, ModalHeader, ModalBody,FormGroup, Label, Input} from 'reactstrap';

//TODO: If I revisit this project, look over some of the inconsistent naming conventions I used like moveItem vs addRecipe
class Container extends Component {
    constructor(props) {
        super(props);
        this.moveItem = this.moveItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.toggleAdd = this.toggleAdd.bind(this);
        this.addRecipe = this.addRecipe.bind(this);
        this.handleIngChange = this.handleIngChange.bind(this);
        this.handleRecChange = this.handleRecChange.bind(this);

        this.state = {
            recipeItems: [{
                id: 0,
                recipeName: 'Apple Pie',
                ingredients: ['Apples', 'Pie Crust', 'Sugar', 'Flour', 'Cinnamon', 'Nutmeg']
            }, {
                id: 1,
                recipeName: 'Salmon',
                ingredients: ['Salmon']
            }, {
                id: 2,
                recipeName: 'Salsa',
                ingredients: ['Tomatos', 'Onion', 'Jalapeno Pepper', 'Cilantro', 'Salt', 'Garlic', 'Lemon', 'Pepper']
            }],
            maxId: 2,
            tempRecName: '',
            tempIngred: '',
            modal: false
        };
    }

    moveItem(dragIndex, hoverIndex) {
        const {recipeItems} = this.state;
        const dragCard = recipeItems[dragIndex];

        this.setState(update(this.state, {
            recipeItems: {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragCard]
                ]
            }
        }));
    }

    removeItem(id) {
        const {recipeItems}  = this.state;

        //If I was dealing with larger size lists, a binary search could make sense.
        for(let i = 0; i < recipeItems.length; i++) {
            if(recipeItems[i].id === id) {
                this.setState({recipeItems: recipeItems.slice(0, i)
                    .concat(recipeItems.slice(i + 1))
                });

                break;
            }
        }
        recipeItems.slice(1, recipeItems.length);
    }

    //Toggles the add modal.
    toggleAdd() {
        this.setState({
            modal: !this.state.modal
        });
    }

    handleRecChange(event) {
        this.setState({tempRecName: event.target.value});
    }

    handleIngChange(event) {
        this.setState({tempIngred: event.target.value});
    }

    addRecipe() {
        const {maxId, tempRecName, tempIngred} = this.state;

        if(this.state.tempRecName.length > 0) {
            this.setState({
                recipeItems: this.state.recipeItems.concat([
                    {
                        id: maxId + 1,
                        recipeName: tempRecName,
                        ingredients: tempIngred.split(",")
                    }
                ]),
                maxId: maxId + 1,
                tempRecName: '',
                tempIngred: '',
                modal: !this.state.modal
            });
        }
        else {
            this.setState({
                tempRecName: '',
                tempIngred: '',
                modal: !this.state.modal
            });
        }
    }

    render() {
        const {recipeItems} = this.state;

        return (
            <div>
                <Card>
                    {recipeItems.map((card, i) => {
                        return (
                            <RecipeItem key={card.id}
                                 index={i}
                                 id={card.id}
                                 recipeName={card.recipeName}
                                 ingredients={card.ingredients}
                                 moveItem={this.moveItem}
                                 removeItem={this.removeItem}/>
                        );
                    })}

                    <CardBlock>
                        <Button onClick={this.toggleAdd}>Add Recipe</Button>
                    </CardBlock>
                </Card>
                <Modal isOpen={this.state.modal} toggle={this.toggleAdd}>
                    <ModalHeader>Modal title</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="recInput">Recipe Name</Label>
                            <Input type="text" id="recInput" onChange={this.handleRecChange}/>
                            <Label for="ingInput">Ingredients</Label>
                            <Input type="text" id="ingInput" onChange={this.handleIngChange}/>
                        </FormGroup>

                        <Button onClick={this.addRecipe}>Add Recipe</Button>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default DragDropContext(HTML5Backend)(Container);