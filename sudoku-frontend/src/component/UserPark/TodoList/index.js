import React, { Component } from "react";
import { Accordion, AccordionTitle, Menu, Input } from "semantic-ui-react";


class TodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <Accordion as={Menu} vertical>
                <Menu.Item>
                    <AccordionTitle content='To Do' />
                </Menu.Item>
                <Menu.Item>
                    <Input className='icon' icon='search' placeholder='Search...' />
                </Menu.Item>
            </Accordion>
        )
    }
}

export default TodoList