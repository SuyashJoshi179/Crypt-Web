import { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Col, Container, Form, FormGroup, Input, Jumbotron, Media, Row, Spinner } from "reactstrap";
import { firestorage, firestore } from "../firebase/firebase";

function MyCont({ name, CRYPTO }) {
    if (name) {
        let curr = CRYPTO.find((c) => c.info.name === name);
        // console.log("Trigger!");

        return (
            <Media tag="li" className='row'>
                <Media left middle>
                    <Photo name={name} curr={curr} />
                </Media>
                <Media body className="ml-2">
                    <Media heading className='currname'>{curr.info.name}</Media>
                    <div><b style={{ color: '#666', fontSize: '1.3rem' }}>$ {curr.info.current_price}</b></div>
                </Media>
            </Media>
        );
    } else
        return <Spinner />;
}

function Photo({ curr }) {
    const [photoUrl, setphotoUrl] = useState(null);
    const [Err, setErr] = useState(null);

    useEffect(() => {
        // console.log('useEffect called..')
        setphotoUrl(null);
        firestorage.ref('images/' + curr.info.symbol + '.svg').getDownloadURL()
            .then(url => {
                // console.log(url);
                setphotoUrl(url);
            })
            .catch((e) => {
                firestorage.ref('images/generic.svg').getDownloadURL()
                    .then(url => {
                        firestore.collection('IconNotPresent').doc(curr.info.symbol).set({})
                            .then(() => {}) //console.log("Icon name '" + curr.info.symbol + "' added in missing icons."))
                            .catch((err) => { console.log(JSON.stringify(err)) });
                        setphotoUrl(url);
                    })
                    .catch((err) => {
                        setErr(err);
                    })
            })
    }, [curr.info.symbol]);

    if (Err) {
        return (
            <p className='photo'>{Err}</p>
        );
    } else {
        if (photoUrl) {
            return (
                <Media object src={photoUrl} className='photo' alt={curr.info.name} />
            );
        } else {
            return (<Spinner />);
        }
    }
}

function Exchange({ CRYPTO }) {
    const [choice1, setChoice1] = useState(null);
    const [choice2, setChoice2] = useState(null);
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');
    const [conversion, setConversion] = useState(null);
    //let choice1 = 'Hi';

    useEffect(() => {
        if (CRYPTO) {
            let a = CRYPTO.find(x => x.info.name === choice1);
            let b = CRYPTO.find(x => x.info.name === choice2);
            setConversion(a.info.current_price / b.info.current_price);
            setValue1(1);
            setValue2(a.info.current_price / b.info.current_price);
        }

    }, [CRYPTO, choice1, choice2])

    const CoinList = (defIndex) => {
        if (CRYPTO) {
            // console.log("list Rendered!!");
            if (!choice1 && defIndex === 0) setChoice1(CRYPTO[0].info.name)
            if (!choice2 && defIndex === 1) setChoice2(CRYPTO[1].info.name)
            let list = CRYPTO.map((v) => v.info.name);
            list.sort();
            return list.map((name) => {
                return (
                    <option key={name} selected={name === CRYPTO[defIndex].info.name} value={name} >{name}</option>
                );
            });
        } else {
            return (<option>-</option>);
        }

    }

    return (
        <>
            <Fade >
                <Jumbotron className='mt-5'>
                    <div className="container">
                        <div className="row row-header">
                            <div className="col-12">
                                <h1>Compare Crypto's</h1>
                                <p align='justify'>Important and handy data if you are considering to transfer between two cryptocurrencies.</p>
                            </div>
                        </div>
                    </div>
                </Jumbotron>
            </Fade>
            <div className='mylist '>
                <Container>
                    <Row>
                        <Col sm="5">
                            <div className="shadow bor exchanger">
                                <Container>
                                    <Row>
                                        <Col>
                                            <Form onChange={(event) => { setChoice1(event.target.value); }} >
                                                <Input type="select" name="select" id="exampleSelect0" >
                                                    {CoinList(0)}
                                                </Input>
                                            </Form>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form>
                                                <FormGroup>
                                                    <Input type="number" className='mt-3' name="number" id="exampleSelect1" value={value1} onChange={(event) => {
                                                        setValue1(event.target.value);
                                                        setValue2(event.target.value * conversion);
                                                    }} />
                                                </FormGroup>
                                            </Form>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <MyCont name={choice1} CRYPTO={CRYPTO} />
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                        </Col>
                        <Col className='comparator' sm="2">
                            <span className="fa fa-exchange fa-lg" />
                        </Col>
                        <Col sm="5">
                            <div className="shadow bor exchanger">
                                <Container>
                                    <Row>
                                        <Col>
                                            <Form onChange={(event) => { setChoice2(event.target.value); }} >
                                                <Input type="select" name="select" id="exampleSelect2">
                                                    {CoinList(1)}
                                                </Input>
                                            </Form>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form>
                                                <FormGroup>
                                                    <Input type="number" className='mt-3' name="number" id="exampleSelect3" value={value2} onChange={(event) => {
                                                        setValue2(event.target.value);
                                                        setValue1(event.target.value / conversion);
                                                    }} />
                                                </FormGroup>
                                            </Form>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <MyCont name={choice2} CRYPTO={CRYPTO} />
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm='12'>
                            <div className='mb-5'></div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}

export default Exchange;