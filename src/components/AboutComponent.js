import { useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Button, Form, FormFeedback, FormGroup, Input, Jumbotron, Label, Spinner } from "reactstrap";
import { firestore } from "../firebase/firebase";
function About(props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [invalid, setInvalid] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const onFormSubmit = (e) => {
        e.preventDefault();
        if(!message) {
            setInvalid(true);
            return;
        } else if(invalid) {
            setInvalid(false);
        }
        setSubmitting(true);
        firestore.collection('Feedbacks').add({
            name: name,
            email: email,
            message: message
        }).then(() => {
            setName(''); setEmail(''); setMessage('');
            setSubmitting(false);
            alert('Your Suggession/Feedback has been submitted..');
        }).catch((e) => {
            setSubmitting(false);
            alert('Your Suggession/Feedback has NOT been submitted ('+e+').');
        })
        
    }
    return (
        <>
            <Fade >
                <Jumbotron className='mt-5 aboutjumbo'>
                    <div className="container">
                        <div className="row row-header">
                            <div className="col-12">
                                <h1>About Crypt</h1>
                                <p align='justify' >Crypt is a cryptocutrrency website, where you can check out latest cryptocurrencies, their current rates, historical rates and their trend. Which helps you to predict their future, so you can invest your money wisely.</p>
                                <p align='justify' >Crypt is free, hosted on firebase. Data for current rates is provided by coingecko and history by cryptowatch.</p>
                                <h2>Any feedback or suggession?</h2>
                                <Form onSubmit={onFormSubmit}>
                                    <FormGroup>
                                        <Label>Name:</Label>
                                        <Input
                                            type="text"
                                            placeholder="Your name (Optional)"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Email:</Label>
                                        <Input
                                            type="email"
                                            placeholder="Your email address (Optional)"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Suggession/Feedback:</Label>
                                        <Input
                                            invalid={invalid}
                                            type="textarea"
                                            placeholder="Message"
                                            value={message}
                                            onChange={e => setMessage(e.target.value)}
                                        />
                                        <FormFeedback>Feedback cannot be empty!</FormFeedback>
                                    </FormGroup>
                                    <Button className='float-right' type="submit" color="primary">{submitting ? <Spinner /> : 'SUBMIT'}</Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </Jumbotron>
            </Fade>
            <div className="container">
                <div className="row">
                    <div className="col-sm-5 col-md-4 image-wrapper">
                        <img width='200' height='200' className='img-thumbnail bor suyash-image' src="https://firebasestorage.googleapis.com/v0/b/crypt-web.appspot.com/o/maker.jpg?alt=media&token=61fbb051-6521-40b9-8791-9c95f67b64d4" alt="Suyash Joshi" />
                        <br />
                        <a target='_blank' rel="noreferrer" className="btn btn-social-icon colour" href="https://www.linkedin.com/in/suyash-joshi-7b68951a3/"><i className="fa fa-linkedin"></i></a>
                        <a target='_blank' rel="noreferrer" className="btn btn-social-icon" href="https://github.com/SuyashJoshi179/"><i className="fa fa-github"></i></a>
                        <a target='_blank' rel="noreferrer" className="btn btn-social-icon" href="https://www.instagram.com/suyash_a_joshi/"><i className="fa fa-instagram"></i></a>
                        <a target='_blank' rel="noreferrer" className="btn btn-social-icon" href="https://www.facebook.com/suyash.joshi179/"><i className="fa fa-facebook"></i></a>
                        <a target='_blank' rel="noreferrer" className="btn btn-social-icon" href="mailto:suyash.joshi179@gmail.com"><i className="fa fa-envelope-o"></i></a>
                    </div>
                    <div className="col-sm-7 col-md-8 devel">Developed by<br /><h1>Suyash&nbsp;Joshi</h1><br />&emsp; A Computer Science enthusiast and undergraduate. Exploring different things in the field.</div>
                </div>
                <div className="row mt-4">
                    <div className="col-12"><p align='justify' ><i>&emsp; Surfing through the internet, trying to predict cryptocurrency trends, I thought of making a better and free alternative for allready present sites. This project was made by me to learn and upgrade my knowledge of ReactJS, Google Charts, CORS proxy, Firebase, REST Api's and cryptocurrency trends. </i></p></div>
                </div>
                <div className="row row-header"><div className="col-12"><h2>Making & Working</h2></div></div>
                <div className="row">
                    <div className="col-12">
                        <p align='justify' >&emsp; Crypt gets the cryptocurrency data from API's and displays it in a manner that is easily undastandable and visually appealing. For this, it uses various frameworks and libraries.</p><p align='justify' >&emsp; The website is made using  <a target='_blank' rel="noreferrer" href='https://reactjs.org/' >ReactJS</a>. It gives crypt it's dynamic behaviour. Crypt gets the required data by sending http requests to the REST Api endpoints provided by <a target='_blank' rel="noreferrer" href='https://cryptowat.ch/products/cryptocurrency-market-data-api' >Cryptowatch</a> and <a target='_blank' rel="noreferrer" href='https://www.coingecko.com/en/api' >Coingecko</a>. Almost all REST Api's for cryptocurrency data out there have some sort of limit for free use. For Crypt to be free, all requests combined should be within the given limit.</p><p align='justify' >&emsp; <a target='_blank' rel="noreferrer" href='https://www.coinapi.io/' >CoinApi</a> is good but has very small limit(only 100 requests a day). So, the Cryptowatch having 10 sec of computer time a day(666 requests a day on avg.) was a obvious choice.</p><p align='justify' >&emsp; The thing is, every visitor makes more than one requests to the api in one visit(22 requests are made just on loading). Thats why even a handful people can saturate the api limit. For this reason, crypt is optimised to use minimum number of requests by storing the data which is repetadely accessed and which does not change frequently, such as historical data.</p><p align='justify' >&emsp; Historical data is accessed by every user and as history data doesn't change in the course of a day, that can be stored and retrived only once a day. For storing purpose, crypt uses <a target='_blank' rel="noreferrer" href='https://firebase.google.com/products/firestore/' >Cloud Firestore</a>, provided by <a target='_blank' rel="noreferrer" href='https://firebase.google.com/' >Firebase</a>. For every cryptocurrency, a server timestamp of 'updatedOn' is stored, only if the difference between this timestamp and current timestamp exceeds one day, the request is sent to the API. That means, only the first user who opens the website, actually sends the request and updates the backend. If a new cryptocurrency is found, it makes a new document for it and uploads the data in it. All other users access the history data from database itself.</p><p align='justify' >&emsp; There is a slight problem with Cryptowatch Api, it doesn't provides the market cap data, which is useful for ranking the cryptocurrencies. For this purpose, crypt uses a second cryptocurrency api named CoinGecko. CoinGecko provides market cap data along with all the data for current rate's. CoinGecko also has a larger limit with 100 requests a minute. CoinGecko has a nasty api endpoint for history and only provides small amount of information in a single request. Thats why its better to stick with two API approach, one for rankings and prices and one for history.</p><p align='justify' >&emsp; Crypt uses firebase for hosting and database with free <a target='_blank' rel="noreferrer" href='https://firebase.google.com/pricing/' >spark plan</a> in mind. Spark plan allows 20k reads and 50k writes a day which are more than enough and will not be a bottleneck.</p><p align='justify' >&emsp; Cryptowatch dosn't send Allow-Origin header in the http response, that meanse sending requests from frontend will be bloked by <a target='_blank' rel="noreferrer" href='https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS' >CORS policy</a>. To tackle this, a proxy server is used which acts like a middleman in frontend and API server. Proxy server adds the Allow-Origin header in te response so that the browser doesn't block the response. Crypt uses a seperate proxy server using <a target='_blank' rel="noreferrer" href='https://github.com/Rob--W/cors-anywhere' >CORS-Anywhere</a>, deployed on <a target='_blank' rel="noreferrer" href='https://www.heroku.com/' >Heroku</a>. The source code for crypt can be found on github repository <a target='_blank' rel="noreferrer" href='https://github.com/SuyashJoshi179/Crypt-Web/' >here</a>. </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default About;