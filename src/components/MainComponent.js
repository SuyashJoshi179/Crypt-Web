import React, { useEffect, useState } from 'react';
import { TabContent, TabPane } from 'reactstrap';
import About from './AboutComponent';
import Compare from './CompareComponent';
import Exchange from './ExchangeComponent';
import Footer from './FooterComponent';
import Header from './HeaderComponent';
import Menu from './MenuComponent';

function Main(props) {
    const [activeTab, setActiveTab] = useState('1');
    const [CRYPTO, setCRYPTO] = useState(null);
    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    useEffect(() => {
        Promise.all([fetch("https://your-cors-anywhere-server-link.com/https://api.cryptowat.ch/pairs"), fetch("https://your-cors-anywhere-server-link.com/https://api.cryptowat.ch/markets"), fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1')])
            .then(res => Promise.all(res.map(r => r.json())))
            .then(([pairs, markets, prices]) => {
                // console.log("cryptowatch pairs response : ", pairs);
                // console.log("cryptowatch markets response : ", markets);
                // console.log("coingecko prices response : ", prices);
                let v = [];
                prices.forEach((val) => {
                    let obj = pairs.result.filter((x) => x.base.symbol === val.symbol && x.quote.symbol === 'usd')[0];
                    //let regx = new RegExp(".*:" + val.symbol);
                    if (obj) {
                        let market = markets.result.filter((x) => x.pair == obj.symbol && x.isOn).map((x) => x.exchange);
                        if (market.length != 0) {
                            v.push({
                                id: obj.id,
                                pair: obj.symbol,
                                market: market,
                                info: val
                            })
                        }
                    }
                })
                // console.log('Content : ', v);
                setCRYPTO(v);

            }, (err) => console.log(err))
    }, []);

    return (
        <div>
            <Header activeTab={activeTab} toggle={toggle} />
            <TabContent activeTab={activeTab} >
                <TabPane tabId="1"><Menu CRYPTO={CRYPTO} /></TabPane>
                <TabPane tabId="2"><Compare CRYPTO={CRYPTO} /></TabPane>
                <TabPane tabId="3"><Exchange CRYPTO={CRYPTO} /></TabPane>
                <TabPane tabId="4"><About /></TabPane>
            </TabContent>
            <Footer toggle={toggle}/>
        </div>
    );
}

export default Main;
