import { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import Chart from "react-google-charts";
import { Col, Container, Form, Input, Jumbotron, Media, Row, Spinner } from "reactstrap";
import { firestorage, firestore } from "../firebase/firebase";
import { GetHistory } from "./GetHistory";

function RenderCurr({ curr, show }) {
    const [photoUrl, setphotoUrl] = useState(null);
    const [Err, setErr] = useState(null);
    // console.log("Rendered..");

    useEffect(() => {
        // console.log('useEffect called..')
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
    const Photo = (props) => {
        if (Err) {
            return (
                <p className='photo'>{Err}</p>
            )
        } else {
            if (photoUrl) {
                return (
                    <Media object src={photoUrl} className='photo' alt={curr.info.name} />
                )
            } else {
                return (<Spinner />)
            }
        }
    };

    const TotalSupply = (props) => {
        if (curr.info.total_supply) {
            return (
                <div><b>T. Supply :</b> {curr.info.total_supply.toPrecision(7)}</div>
            )

        } else {
            return (
                <div><b>T. Supply :</b> No limit.</div>
            )
        }
    }

    if (show) {
        return (
            <>
                <Media tag="li" className='row' >
                    <Media left middle>
                        <Photo />
                    </Media>
                    <Media body className="ml-2">
                        <Media heading className='mt-3 currname'>{curr.info.name}</Media>

                    </Media>
                </Media >
                <div className='container p-0'>
                    <div className='row no-gutters'>
                        <div className='col-lg-5'>
                            <div><b style={{ color: '#666', fontSize: '1.3rem' }}>$ {curr.info.current_price}</b></div>
                            <div><i style={{ color: '#55ee55' }} className="fa fa-caret-up fa-lg" /> {curr.info.low_24h}</div>
                            <div><i style={{ color: '#ee5555' }} className="fa fa-caret-down fa-lg" /> {curr.info.high_24h}</div>
                            <div><i style={{ color: 'orange' }} className="fa fa-arrows-v fa-lg" /> {curr.info.price_change_24h.toPrecision(6)}</div>
                            <div><i style={{ color: '#eeee55' }} className="fa fa-percent" /> {curr.info.price_change_percentage_24h.toFixed(4)}%</div>
                        </div>
                        <div className='col-lg-7 values'>
                            <div><b>M. Cap : </b> {curr.info.market_cap}</div>
                            <div><b>Change :</b> {curr.info.market_cap_change_percentage_24h}%</div>
                            <div><b>Total Vol :</b> {curr.info.total_volume}</div>
                            <div><b>C. Supply:</b> {curr.info.circulating_supply.toPrecision(7)}</div>
                            <TotalSupply />
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return (<div></div>)
    }


}

function Compare({ CRYPTO }) {
    const [choice1, setChoice1] = useState(null);
    const [choice2, setChoice2] = useState(null);
    const [show1, setshow1] = useState(true);
    const [show2, setshow2] = useState(true);
    //let choice1 = 'Hi';
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

    const MyCont = ({ name, show }) => {
        if (name) {
            let curr = CRYPTO.find((c) => c.info.name === name);
            // console.log("Trigger!");
            return (<RenderCurr curr={curr} show={show} />);
        } else return <div></div>

    }

    const DualGraph = ({ choice1, choice2, setshow1, setshow2 }) => {
        const [data1, setdata1] = useState(null);
        const [data2, setdata2] = useState(null);

        useEffect(() => {
            if (choice1 && choice2) {
                let curr1 = CRYPTO.find((c) => c.info.name === choice1);
                let curr2 = CRYPTO.find((c) => c.info.name === choice2);
                GetHistory(curr1, setdata1, setshow1);
                GetHistory(curr2, setdata2, setshow2);
            }
        }, [choice1, choice2, setshow1, setshow2]);

        if (data1 && data2) {
            // console.log("Dual Graph", data1[1][0].getTime() === data2[1][0].getTime(), data1[data1.length - 1][0].getTime() === data2[data2.length - 1][0].getTime());
            let data = [["Date", choice1, choice2]];
            let i = 1, j = 1, i1 = data1.length - 1, j1 = data2.length - 1;
            while (i !== i1 && j !== j1) {
                if (data1[i][0].getTime() === data2[j][0].getTime()) {
                    data.push([data1[i][0], data1[i][1], data2[i][1]]);
                    i++;
                    j++;
                }
                else if (data1[i][0].getTime() < data2[j][0].getTime()) i++;
                else j++;
            }
            // console.log("Dual Graph Data: ", data);
            return (
                <div className='shadow bor mt-5 mb-5'>
                    <Container>
                        <Row>
                            <Col >
                                <Chart
                                    chartType="AreaChart"
                                    loader={<div>Loading Chart</div>}
                                    data={data}
                                    options={{
                                        legend: { position: 'bottom' },
                                        colors: ['#2196F3', '#f32121'],
                                        hAxis: { gridlines: { color: '#fff' }, format: 'dd MMM yyyy' },
                                        vAxes: {
                                            0: { title: choice1  },
                                            1: { title: choice2 }
                                        },
                                        series: {
                                            0: { targetAxisIndex: 0 },
                                            1: { targetAxisIndex: 1 },
                                            2: { targetAxisIndex: 1 }
                                        },
                                        crosshair: { trigger: 'both', orientation: 'vertical' },
                                        fontName: 'Poppins',
                                    }}
                                />
                            </Col>
                        </Row>
                    </Container>

                </div>
            );
        } else return (<div className='shadow bor mt-5 mb-5 spinner'><Spinner /></div>);

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
                            <div className="shadow bor comparer">
                                <Container>
                                    <Row>
                                        <Col>
                                            <Form onChange={(event) => { setChoice1(event.target.value); }} >
                                                <Input type="select" name="select" id="exampleSelect" >
                                                    {CoinList(0)}
                                                </Input>
                                            </Form>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <MyCont name={choice1} show={show1} />
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                        </Col>
                        <Col className='comparator' sm="2">
                            <span className="fa fa-arrows-h fa-lg" />
                        </Col>
                        <Col sm="5">
                            <div className="shadow bor comparer">
                                <Container>
                                    <Row>
                                        <Col>
                                            <Form onChange={(event) => { setChoice2(event.target.value); }} >
                                                <Input type="select" name="select" id="exampleSelect">
                                                    {CoinList(1)}
                                                </Input>
                                            </Form>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <MyCont name={choice2} show={show2} />
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <DualGraph choice1={choice1} choice2={choice2} setshow1={setshow1} setshow2={setshow2} />
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}

export default Compare;