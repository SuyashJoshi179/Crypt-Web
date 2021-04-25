import React, { Component } from 'react';
import { NavLink, Navbar, NavbarBrand, Nav, NavbarToggler, NavItem, Jumbotron, Collapse, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap';
import { Fade } from "react-awesome-reveal";
import classnames from 'classnames';
class Header extends Component {
	constructor(props) {
		super(props);
		this.toggleNav = this.toggleNav.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.state = {
			isNavOpen: false,
			isModalOpen: false,
		};
	};

	toggleNav() {
		this.setState({
			isNavOpen: !this.state.isNavOpen
		});
	}

	toggleModal() {
		this.setState({
			isModalOpen: !this.state.isModalOpen
		});
	}

	handleLogin(event) {
		this.toggleModal();
		alert("Username: " + this.username.value + " Password: " + this.password.value + " Remember: " + this.remember.checked);
		event.preventDefault();
	}

	render() {
		return (
			<React.Fragment>
				<Navbar dark expand='md' className='shadow' fixed='top' >
					<div className="container">
						<NavbarToggler onClick={this.toggleNav}></NavbarToggler>
						<NavbarBrand href="/">
							<h1><b>Crypt</b></h1>
						</NavbarBrand>
						<Collapse isOpen={this.state.isNavOpen} navbar>
							<Nav navbar>
								<NavItem>
									<NavLink className={classnames({ active: this.props.activeTab === '1' })} onClick={() => { this.props.toggle('1'); }} >
										<span className="fa fa-th-list fa-lg"></span> Crypto's
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink className={classnames({ active: this.props.activeTab === '2' })} onClick={() => { this.props.toggle('2'); }} >
										<span className="fa fa-arrows-h fa-lg"></span> Compare
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink className={classnames({ active: this.props.activeTab === '3' })} onClick={() => { this.props.toggle('3'); }} >
										<span className="fa fa-exchange fa-lg"></span> Exchange
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink className={classnames({ active: this.props.activeTab === '4' })} onClick={() => { this.props.toggle('4'); }} >
										<span className="fa fa-info fa-lg"></span> About
									</NavLink>
								</NavItem>
							</Nav>
						</Collapse>
					</div>
				</Navbar>
				<Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
					<ModalHeader toggle={this.toggleModal}>Login</ModalHeader>
					<ModalBody>
						<Form onSubmit={this.handleLogin}>
							<FormGroup>
								<Label htmlFor='username'>Username</Label>
								<Input type='text' id='username' name='username' innerRef={(input) => this.username = input}></Input>
							</FormGroup>
							<FormGroup>
								<Label htmlFor='password'>Password</Label>
								<Input type='password' id='password' name='password' innerRef={(input) => this.password = input}></Input>
							</FormGroup>
							<FormGroup check>
								<Label check>
									<Input type='checkbox' name='remember' innerRef={(input) => this.remember = input} />
									Remember Me
								</Label>
							</FormGroup>
							<FormGroup>
								<Button type='submit' value='submit' color='primary'>Login</Button>
							</FormGroup>
						</Form>
					</ModalBody>
				</Modal>
			</React.Fragment>
		);
	}
}

export default Header;