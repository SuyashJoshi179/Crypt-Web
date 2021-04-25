import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Fade, Zoom } from "react-awesome-reveal";
import { BrowserView, isMobile, MobileView } from "react-device-detect";
import Chart from 'react-google-charts';
import { Jumbotron, Media, Modal, ModalBody, ModalHeader, Spinner, Table } from 'reactstrap';
import { firestorage, firestore } from '../firebase/firebase';
import { GetHistory } from './GetHistory';

function CryptoDetail({ curr, setIsInfo }) {

    if (curr) {
        return (
            <div className='container'>
                <div className="row">
                    <ModalGraph curr={curr} setIsInfo={setIsInfo} />
                    <div className="col-12 mb-3">
                        To see specific time range, drag the thumbs.
                    </div>
                    <div className="col-12">
                        <BrowserView>
                            <Table striped >
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Property</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row" >1</th>
                                        <td>Current Price</td>
                                        <td>$ {curr.info.current_price}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" >2</th>
                                        <td>Low(24h)</td>
                                        <td>$ {curr.info.low_24h}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" >3</th>
                                        <td>High(24h)</td>
                                        <td>$ {curr.info.high_24h}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" >4</th>
                                        <td>Price Change (24h)</td>
                                        <td>$ {curr.info.price_change_24h}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" >5</th>
                                        <td>Price change Percentage (24h)</td>
                                        <td>{curr.info.price_change_percentage_24h} %</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" >6</th>
                                        <td>Market Cap</td>
                                        <td>$ {curr.info.market_cap}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" >7</th>
                                        <td>Market Cap Change (24h)</td>
                                        <td>$ {curr.info.market_cap_change_24h}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" >8</th>
                                        <td>Market Cap Change Percentage (24h)</td>
                                        <td>{curr.info.market_cap_change_percentage_24h} %</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" >9</th>
                                        <td>Total Supply</td>
                                        <td>{curr.info.total_supply ? curr.info.total_supply + ' ' + curr.info.symbol : 'null'} { }</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" >10</th>
                                        <td>Total Volume</td>
                                        <td>$ {curr.info.total_volume}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" >11</th>
                                        <td>Circulating Supply</td>
                                        <td>{curr.info.circulating_supply} {curr.info.symbol}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" >12</th>
                                        <td>Max Supply</td>
                                        <td>{curr.info.max_supply ? curr.info.max_supply + ' ' + curr.info.symbol : 'null'}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" >13</th>
                                        <td>Fully diluted valuation</td>
                                        <td>{curr.info.fully_diluted_valuation ? '$ ' + curr.info.fully_diluted_valuation : 'null'}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" >14</th>
                                        <td>All Time Low</td>
                                        <td>$ {curr.info.atl} ({new Date(curr.info.atl_date).toLocaleString()})</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" >15</th>
                                        <td>All Time High</td>
                                        <td>$ {curr.info.ath} ({new Date(curr.info.ath_date).toLocaleString()})</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </BrowserView>
                        <MobileView>
                            <Table striped >
                                <thead>
                                    <tr>
                                        <th>Property</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">Current Price</th>
                                        <td>$ {curr.info.current_price.toFixed(0)}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Low(24h)</th>
                                        <td>$ {curr.info.low_24h.toFixed(0)}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">High(24h)</th>
                                        <td>$ {curr.info.high_24h.toFixed(0)}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Price Change (24h)</th>
                                        <td>$ {curr.info.price_change_24h.toFixed(6)}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Price change Percentage (24h)</th>
                                        <td>{curr.info.price_change_percentage_24h} %</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Market Cap</th>
                                        <td>$ {curr.info.market_cap.toFixed(0)}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Market Cap Change (24h)</th>
                                        <td>$ {curr.info.market_cap_change_24h.toFixed(0)}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Market Cap Change Percentage (24h)</th>
                                        <td>{curr.info.market_cap_change_percentage_24h} %</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Total Supply</th>
                                        <td>{curr.info.total_supply ? curr.info.total_supply.toFixed(0) + ' ' + curr.info.symbol : 'null'} { }</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Total Volume</th>
                                        <td>$ {curr.info.total_volume.toFixed(0)}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Circulating Supply</th>
                                        <td>{curr.info.circulating_supply.toFixed(0)} {curr.info.symbol}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" >Max Supply</th>
                                        <td>{curr.info.max_supply ? curr.info.max_supply.toFixed(0) + ' ' + curr.info.symbol : 'null'}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" >Fully diluted valuation</th>
                                        <td>{curr.info.fully_diluted_valuation ? '$ ' + curr.info.fully_diluted_valuation.toFixed(0) : 'null'}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" >All Time Low</th>
                                        <td>$ {curr.info.atl} ({new Date(curr.info.atl_date).toLocaleString()})</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" >All Time High</th>
                                        <td>$ {curr.info.ath} ({new Date(curr.info.ath_date).toLocaleString()})</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </MobileView>
                        <p align='justify'>Data updated on {new Date(curr.info.last_updated).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        )
    }
}

function ModalGraph({ curr, setIsInfo }) {
    const [data, setdata] = useState(null);
    const [show, setShow] = useState(null);

    useEffect(() => {
        GetHistory(curr, setdata, setShow, true, !isMobile);
    }, [curr.info.symbol]);

    if (data) {
        var d = new Date();
        d.setMonth(d.getMonth() - 2);
        return (
            <div className="col-12 modalchart">
                <BrowserView>
                    <Chart
                        chartType="CandlestickChart"
                        loader={<div>Loading Chart</div>}
                        data={data}
                        options={{
                            legend: { position: 'none' },
                            colors: ['#2196F3'],
                            bar: {},
                            candlestick: {
                                fallingColor: { strokeWidth: 0, fill: '#a52714' },
                                risingColor: { strokeWidth: 0, fill: '#0f9d58' }, // green
                            },
                            hAxis: { gridlines: { color: '#fff' }, format: 'dd MMM yyyy' },
                            chartArea: { left: '50', width: '90%' },
                            fontName: 'Poppins'
                        }}
                        chartPackages={['corechart', 'controls']}
                        controls={[
                            {
                                controlType: 'ChartRangeFilter',
                                options: {
                                    filterColumnLabel: 'Date',
                                    ui: {
                                        chartType: 'AreaChart',
                                        chartOptions: {
                                            chartArea: { width: '90%', height: '30%' },
                                            hAxis: { baselineColor: 'none' },
                                            colors: ['#2196F3'],
                                        },
                                    },
                                },
                                controlPosition: 'bottom',
                                controlWrapperParams: {
                                    state: {
                                        range: { start: d },
                                    }
                                }
                            }
                        ]} />
                </BrowserView>
                <MobileView>
                    <Chart
                        chartType="AreaChart"
                        loader={<div>Loading Chart</div>}
                        data={data}
                        options={{
                            legend: { position: 'none' },
                            colors: ['#2196F3'],
                            hAxis: { gridlines: { color: '#fff' }, format: 'dd MMM yyyy' },
                            chartArea: { left: '50', width: '100%' },
                            fontName: 'Poppins'
                        }}
                        chartPackages={['corechart', 'controls']}
                        controls={[
                            {
                                controlType: 'DateRangeFilter',
                                options: {
                                    filterColumnLabel: 'Date',
                                    ui: { format: { pattern: 'dd MMM yyyy' }, orientation: 'horizontal', label: false },
                                },
                                controlPosition: 'bottom',
                            },
                        ]} />
                </MobileView>
            </div>
        )
    } else return (
        <div className="row">
            <div className="col-sm-12">
                <div className='modalspinner'>
                    <Spinner onClick={() => setIsInfo(false)} />
                </div>
            </div>
        </div>

    );

}


function Graph({ curr, setShow }) {
    const [data, setdata] = useState(null);

    useEffect(() => {
        GetHistory(curr, setdata, setShow);
    }, [])
    if (data) {
        return (<Chart
            chartType="AreaChart"
            loader={<div>Loading Chart</div>}
            data={data}
            options={{
                legend: { position: 'none' },
                colors: ['#2196F3'],
                hAxis: { gridlines: { color: '#fff' }, format: 'dd MMM yyyy' },
                chartArea: { left: '50', width: '100%' },
                fontName: 'Poppins'
            }}
        />)
    } else {
        return (<Spinner />);
    }
}

function Photo({ curr }) {
    const [photoUrl, setphotoUrl] = useState(null);
    const [Err, setErr] = useState(null);

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
                            .then(() => { }) //console.log("Icon name '" + curr.info.symbol + "' added in missing icons."))
                            .catch((err) => { console.log(JSON.stringify(err)) });
                        setphotoUrl(url);
                    })
                    .catch((err) => {
                        setErr(err);
                    })
            })
    }, []);

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

function RenderCurr({ curr, setInfo, setIsInfo }) {
    const [show, setShow] = useState(true);
    // console.log("Rendered..");

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
            <Zoom>
                <Media tag="li" className='row  shadow bor' >
                    <Media left middle>
                        <Photo curr={curr} />
                    </Media>
                    <Media body className="ml-2">
                        <Media heading className='mt-3 currname hoverable' onClick={() => { setInfo(curr); setIsInfo(true); }}>{curr.info.name}</Media>
                        <div className='container p-0 details'>
                            <div className='row no-gutters'>
                                <div className='col-sm-5'>
                                    <div><b style={{ color: '#666', fontSize: '1.3rem' }}>$ {curr.info.current_price}</b></div>
                                    <div><i style={{ color: '#55ee55' }} className="fa fa-caret-up fa-lg" /> {curr.info.low_24h}</div>
                                    <div><i style={{ color: '#ee5555' }} className="fa fa-caret-down fa-lg" /> {curr.info.high_24h}</div>
                                    <div><i style={{ color: 'orange' }} className="fa fa-arrows-v fa-lg" /> {curr.info.price_change_24h.toPrecision(6)}</div>
                                    <div><i style={{ color: '#eeee55' }} className="fa fa-percent" /> {curr.info.price_change_percentage_24h.toFixed(4)} %</div>
                                </div>
                                <div className='col-sm-7 values'>
                                    <div><b>M. Cap : </b> {curr.info.market_cap}</div>
                                    <div><b>Change :</b> {curr.info.market_cap_change_percentage_24h} %</div>
                                    <div><b>Total Vol :</b> {curr.info.total_volume}</div>
                                    <div><b>C. Supply:</b> {curr.info.circulating_supply.toPrecision(7)}</div>
                                    <TotalSupply />
                                </div>
                            </div>
                        </div>
                    </Media>
                    <div className='col-md-5'><Graph curr={curr} setShow={setShow} /></div>
                </Media >
            </Zoom >
        );
    } else {
        return (<div></div>)
    }


}

function Pagination({ currlen, start, setStart }) {
    let pagelist = [];
    let i = 0;
    while (i < currlen) {
        pagelist.push(i);
        i += 20;
    }
    // console.log('pagelist:', pagelist);
    i = 0;
    let arry = pagelist.map((arr) => {
        i++;
        return (
            <li key={i} className={classnames({ 'page-item': true, active: arr === start })} >
                <button className='page-link' onClick={() => setStart(arr)} >{i}</button>
            </li>
        );
    });

    return (
        <nav aria-label="Page navigation example">
            <ul className={classnames({ 'pagination': true, 'pagination-sm': isMobile, 'justify-content-center': true })} >
                <li className={classnames({ 'page-item': true, disabled: start == 0 })}>
                    <button className="page-link" onClick={() => { if (start !== 0) setStart(start - 20); }} >Previous</button>
                </li>
                {arry}
                <li className={classnames({ 'page-item': true, disabled: start == (pagelist[pagelist.length - 1]) })}>
                    <button className="page-link" onClick={() => { if (start !== (pagelist[pagelist.length - 1])) setStart(start + 20); }} >Next</button>
                </li>
            </ul>
        </nav>
    )
}

function Menu({ CRYPTO }) {
    const [start, setStart] = useState(0);
    const [info, setInfo] = useState(null);
    const [isInfo, setIsInfo] = useState(false);

    if (CRYPTO) {
        const currencies = CRYPTO.slice(start, start + 20).map((curr) => {
            return (
                <div className="col-12 mt-4" key={curr.info.name} >
                    <RenderCurr curr={curr} setInfo={setInfo} setIsInfo={setIsInfo} />
                </div>
            );
        });

        return (
            <>
                <Fade >
                    <Jumbotron className='mt-5'>
                        <div className="container">
                            <div className="row row-header">
                                <div className="col-12">
                                    <h1>Welcome to Crypt</h1>
                                    <p align='justify'>All the latest data you need about cryptocurrancy prices in one place.<br />For more details about any cryptocurrancy, Click on its name.</p>
                                </div>
                            </div>
                        </div>
                    </Jumbotron>
                </Fade>
                <div className='mylist'>
                    <Media list className='container'>
                        {currencies}
                    </Media>
                    <Pagination currlen={CRYPTO.length} start={start} setStart={setStart} />
                </div>
                <Modal isOpen={isInfo} size='lg' toggle={() => setIsInfo(false)}>
                    <ModalHeader toggle={() => setIsInfo(false)}>{info ? info.info.name : 'Error'}</ModalHeader>
                    <ModalBody>
                        <CryptoDetail curr={info} setIsInfo={setIsInfo} />
                    </ModalBody>
                </Modal>

            </>
        )
    } else {

        return (
            <>
                <Fade >
                    <Jumbotron className='mt-5'>
                        <div className="container">
                            <div className="row row-header">
                                <div className="col-12">
                                    <h1>Welcome to Crypt</h1>
                                    <p align='justify'>All the latest data you need about cryptocurrancy prices in one place</p>
                                </div>
                            </div>
                        </div>
                    </Jumbotron>
                </Fade>
                <div className='spinner'>
                    <Spinner />
                </div>
            </>
        )
    }
}
export default Menu;