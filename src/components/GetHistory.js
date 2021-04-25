import { firebasestore, firestore } from "../firebase/firebase";

export function GetHistory(curr, setdata, setShow, full = false, olhc = false) {
    Promise.all([
        firestore.collection('PastData').doc(curr.info.symbol).get(),
        firestore.collection('PastData').doc(curr.info.symbol).collection('Timestamps').where('isOn', '==', true).orderBy('counter', "desc").limit(1).get()
    ])
        .then(([sym, docs]) => {
            if (!docs.empty) {
                //console.log("Document Symbol:", curr.market+':'+curr.pair, "Document data:", doc.data());
                docs.forEach((doc) => {
                    if ((firebasestore.Timestamp.now().seconds - doc.data().endt.seconds) <= 86400) {
                        firestore.collection('PastData').doc(curr.info.symbol).collection(doc.id).where(firebasestore.FieldPath.documentId(), ">=", (full ? 0 : (doc.data().endt.seconds - 7776000)).toString()).get()
                            .then((querySnapshot) => {
                                let d = [];
                                querySnapshot.forEach((dataPoint) => {
                                    // dataPoint.data() is never undefined for query doc snapshots
                                    //console.log(dataPoint.id, " => ", dataPoint.data();
                                    dataPoint.data().content.forEach((val) => {
                                        let dt = new Date(val.CloseTime * 1000);
                                        d.push(olhc ? [dt, val.LowPrice, val.OpenPrice, val.ClosePrice, val.HighPrice] : [dt, val.ClosePrice]);
                                    });
                                });
                                // console.log('d from firestore', curr.info.symbol, doc.id, d);
                                let D = full ? d : d.slice((d.length > 31 ? d.length - 31 : 0));
                                D.unshift(olhc ? ['Date', 'L-H, O-C', 'Open', 'Close', 'High'] : ['Date', 'Price']);
                                setdata(D);
                            });
                    } else {
                        Promise.all([firestore.collection('PastData').doc(curr.info.symbol).collection(doc.id).where(firebasestore.FieldPath.documentId(), ">=", (full ? 0 : (doc.data().endt.seconds - 7776000)).toString()).get(), fetch('https://your-cors-anywhere-server-link.com/https://api.cryptowat.ch/markets/' + doc.id + '/' + curr.pair + '/ohlc?periods=86400&after=' + (doc.data().endt.seconds + 1000))])
                            .then(([dFromStore, dFromApi]) => Promise.all([dFromStore, dFromApi.json()]))
                            .then(([dFromStore, dFromApi]) => {
                                if (dFromApi.result) {
                                    let bucket; // last bucket
                                    let d = [];
                                    dFromStore.forEach((dataPoint) => {
                                        // dataPoint.data() is never undefined for query doc snapshots
                                        //console.log(dataPoint.id, " => ", dataPoint.data();
                                        bucket = dataPoint;
                                        dataPoint.data().content.forEach((val) => {
                                            let dt = new Date(val.CloseTime * 1000);
                                            d.push(olhc ? [dt, val.LowPrice, val.OpenPrice, val.ClosePrice, val.HighPrice] : [dt, val.ClosePrice]);
                                        });
                                    });

                                    if ((firebasestore.Timestamp.now().seconds - dFromApi.result[86400][dFromApi.result[86400].length - 1][0]) <= 10000) {
                                        dFromApi.result[86400].filter(x => x[0] >= (firebasestore.Timestamp.now().seconds - 2592000)).forEach((arr) => {
                                            let dt = new Date(arr[0] * 1000);
                                            //console.log('date:', Math.floor(dt.getTime() / 1000), arr[0]);
                                            d.push(olhc ? [dt, arr[3], arr[1], arr[4], arr[2]] : [dt, arr[4]]);
                                        });
                                        d = d.slice(0, d.length - 1);
                                        // console.log('d from firestore and API', curr.info.symbol, doc.id, d);
                                        // console.log('dataFrom Store: ', dFromStore.docs.map(dat => dat.data().content), 'dataFrom API: ', dFromApi);
                                        d = full ? d : d.slice((d.length > 31 ? d.length - 31 : 0));
                                        d.unshift(olhc ? ['Date', 'L-H, O-C', 'Open', 'Close', 'High'] : ['Date', 'Price']);
                                        setdata(d);
                                    } else {
                                        setShow(false);
                                    }

                                    // Start Uploading to firestore.
                                    let batch = firestore.batch();
                                    let count = bucket.data().content.length; // days count in last bucket.
                                    let v = bucket.data().content; // vector with content of 60 days
                                    let flag = false;
                                    let first = bucket.id;
                                    if (bucket.data().content.length == 60) {
                                        count = 0; // days count
                                        v = []; // vector with content of 60 days
                                        flag = false;
                                        first = dFromApi.result[86400][0][0];
                                    }
                                    let it = 0;
                                    while (it !== dFromApi.result[86400].length - 1) {
                                        let arr = dFromApi.result[86400][it];
                                        if (flag) {
                                            first = arr[0];
                                            flag = false;
                                        }
                                        v.push({
                                            CloseTime: arr[0],
                                            OpenPrice: arr[1],
                                            HighPrice: arr[2],
                                            LowPrice: arr[3],
                                            ClosePrice: arr[4],
                                            Volume: arr[5],
                                            QuoteVolume: arr[6]
                                        });
                                        if (++count == 60) {
                                            batch.set(firestore.collection('PastData').doc(curr.info.symbol).collection(doc.id).doc(first.toString()), {
                                                content: v,
                                            }, { merge: true });
                                            flag = true;
                                            count = 0;
                                            v = [];
                                        }
                                        it++;
                                    }

                                    if (it !== 0) {
                                        if (v.length !== 0) {
                                            batch.set(firestore.collection('PastData').doc(curr.info.symbol).collection(doc.id).doc(first.toString()), {
                                                content: v,
                                            }, { merge: true });
                                        }

                                        let isUpdated = (firebasestore.Timestamp.now().seconds - dFromApi.result[86400][dFromApi.result[86400].length - 1][0]) <= 1296000; // wait for 15 days.


                                        //if(!dFromApi.result[86400][it - 1]) console.log("Wanted dt", dFromApi.result[86400], it, dFromApi.result[86400][it - 1]);
                                        batch.set(firestore.collection('PastData').doc(curr.info.symbol).collection('Timestamps').doc(doc.id), {
                                            endt: firebasestore.Timestamp.fromMillis(dFromApi.result[86400][it - 1][0] * 1000),
                                            isOn: isUpdated,
                                            counter: firebasestore.FieldValue.increment(dFromApi.result[86400].length),
                                        }, { merge: true });

                                        if (!isUpdated) {
                                            batch.set(firestore.collection('ClosedEndpoint').doc(curr.info.symbol + ':' + doc.id), {
                                                On: firebasestore.Timestamp.now(),
                                            }, { merge: true });
                                        }

                                        batch.commit()
                                            .then(() => {
                                                console.log("Data updated for " + doc.id + ":" + curr.info.symbol);
                                            }).catch((err) => console.log("Error while data updating for " + doc.id + ":" + curr.info.symbol, err));

                                        // console.log('Hey', curr.info.symbol, doc.id);
                                    }
                                } else {
                                    setShow(false);
                                    // console.log("Cryptowatch Error : ", dFromApi);
                                }
                            });
                    }
                });
            } else if (!sym.exists) {
                // doc.data() will be undefined in this case
                // console.log("No", curr.market + ':' + curr.pair, "document!");

                let endt = firebasestore.Timestamp.now().seconds + 172800;
                let isDataPresent = false;
                async function getHistory(market) {
                    let res = fetch('https://your-cors-anywhere-server-link.com/https://api.cryptowat.ch/markets/' + market + '/' + curr.pair + '/ohlc?periods=86400').then((result) => result.json());
                    res = await res;
                    // console.log("Yeiks...", market, curr.pair, res.result);
                    if (res.result) {
                        // console.log('Yey..', (firebasestore.Timestamp.now().seconds - res.result[86400][res.result[86400].length - 1][0]) <= 86400, res.result[86400][0][0], endt, res.result[86400][0][0] < endt);
                        if ((firebasestore.Timestamp.now().seconds - res.result[86400][res.result[86400].length - 1][0]) <= 86400 && res.result[86400][0][0] < endt) {

                            let d = [];
                            endt = res.result[86400][0][0];
                            res.result[86400].filter(x => x[0] >= (firebasestore.Timestamp.now().seconds - 2592000)).map((arr) => {
                                let dt = new Date(arr[0] * 1000);
                                //console.log('date:', Math.floor(dt.getTime() / 1000), arr[0]);
                                d.push(olhc ? [dt, arr[3], arr[1], arr[4], arr[2]] : [dt, arr[4]]);
                            });
                            d = d.slice(0, d.length - 1);
                            // console.log('d from API', market, curr.pair, d);
                            d = full ? d : d.slice((d.length > 31 ? d.length - 31 : 0));
                            d.unshift(olhc ? ['Date', 'L-H, O-C', 'Open', 'Close', 'High'] : ['Date', 'Price']);
                            setdata(d);
                            isDataPresent = true;
                        }
                        //testBatchedWrites(res.result[86400], curr.info.symbol, market).then(() => console.log("Completed!!"), (err) => console.log(err));
                        // Start Uploading to firestore.
                        let batch = firestore.batch();
                        let count = 0; // days count
                        let v = []; // vector with content of 60 days
                        let flag = false;
                        let first = res.result[86400][0][0];
                        let it = 0;
                        while (it !== res.result[86400].length - 1) {
                            let arr = res.result[86400][it];
                            if (flag) {
                                first = arr[0];
                                flag = false;
                            }
                            v.push({
                                CloseTime: arr[0],
                                OpenPrice: arr[1],
                                HighPrice: arr[2],
                                LowPrice: arr[3],
                                ClosePrice: arr[4],
                                Volume: arr[5],
                                QuoteVolume: arr[6]
                            });
                            if (++count == 60) {
                                batch.set(firestore.collection('PastData').doc(curr.info.symbol).collection(market).doc(first.toString()), {
                                    content: v,
                                });
                                flag = true;
                                count = 0;
                                v = [];
                            }
                            it++;
                        }

                        if (v.length !== 0) {
                            batch.set(firestore.collection('PastData').doc(curr.info.symbol).collection(market).doc(first.toString()), {
                                content: v,
                            });
                        }

                        let isUpdated = (firebasestore.Timestamp.now().seconds - res.result[86400][res.result[86400].length - 1][0]) <= 1296000; // wait for 15 days.

                        batch.set(firestore.collection('PastData').doc(curr.info.symbol).collection('Timestamps').doc(market), {
                            start: firebasestore.Timestamp.fromMillis(res.result[86400][0][0] * 1000),
                            endt: firebasestore.Timestamp.fromMillis(res.result[86400][it - 1][0] * 1000),
                            counter: res.result[86400].length,
                            isOn: isUpdated,
                        });

                        if (!isUpdated) {
                            batch.set(firestore.collection('ClosedEndpoint').doc(curr.info.symbol + ':' + market), {
                                On: firebasestore.Timestamp.now(),
                            });
                        }

                        return await batch.commit();
                    }
                }

                Promise.allSettled(curr.market.map((market) => getHistory(market)))
                    .then(() => {
                        if (isDataPresent) {
                            console.log('Data Uploaded for ', curr.info.symbol);
                        } else {
                            setShow(false);
                            console.log(curr.info.symbol + " will not be shown..");
                        }
                    });
            } else {
                setShow(false);
                console.log(curr.info.symbol + " will not be shown..");
            }
        }).catch((err) => console.log(err));
}
