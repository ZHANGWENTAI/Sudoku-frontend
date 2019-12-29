import React, { Component } from "react";
import {Card, Image} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

class UserCard extends Component {
    render() {        
        return (
            <Card>
                <Image src='photo.jpg' wrapped ui={false} />
                <Card.Content>
                    <Card.Header Content = {this.props.username} />
                    <Card.Meta>
                        <span className='date' Content={this.props.userInfo.createdtime}/>
                    </Card.Meta>
                </Card.Content>
                <Card.Content extra>
                    <Card.Description Content={"Username:\t"+this.props.userInfo.username}/>
                    <Card.Description Content={"Score:\t"+this.props.userInfo.score}/>
                    <Card.Description Content={"Submit:\t"+this.props.userInfo.submited}/>
                    <Card.Description Content={"Pass:\t"+this.props.userInfo.passed}/>
                </Card.Content>
            </Card>
        );
    }
}
export default UserCard
