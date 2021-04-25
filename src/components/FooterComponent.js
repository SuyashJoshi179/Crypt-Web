import React from 'react';

function Footer(props) {
    return(
        <div className="footer">
            <div className="container">
                <div className="row justify-content-center">             
                    <div className="col-4 offset-1 col-sm-2">
                        <h5>Links</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" onClick={() => props.toggle('1')} >Home</a></li>
                            <li><a href="#" onClick={() => props.toggle('2')} >Compare</a></li>
                            <li><a href="#" onClick={() => props.toggle('3')} >Exchange</a></li>
                            <li><a href="#" onClick={() => props.toggle('4')} >About</a></li>
                        </ul>
                    </div>
                    <div className="col-7 col-sm-5">
                        <h5>Info</h5>
                        <p align='justify'>
                            Market rankings and prices by <a href="https://www.coingecko.com/en/api" >Coingecko</a>.
                        </p>
                        <p align='justify'>
                            History by <a href='https://cryptowat.ch/products/cryptocurrency-market-data-api' >Cryptowatch</a>.
                        </p>
                    </div>
                    <div className="col-12 col-sm-4 align-self-center">
                        <div className="text-center">
                        <a target='_blank' rel="noreferrer" className="btn btn-social-icon colour" href="https://www.linkedin.com/in/suyash-joshi-7b68951a3/"><i className="fa fa-linkedin"></i></a>
                        <a target='_blank' rel="noreferrer" className="btn btn-social-icon" href="https://github.com/SuyashJoshi179/"><i className="fa fa-github"></i></a>
                        <a target='_blank' rel="noreferrer" className="btn btn-social-icon" href="mailto:suyash.joshi179@gmail.com"><i className="fa fa-envelope-o"></i></a>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">             
                    <div className="col-auto">
                        <p align='justify'>© Copyright 2021 Suyash Joshi xD</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;