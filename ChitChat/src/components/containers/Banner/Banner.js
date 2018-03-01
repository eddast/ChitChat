import React from 'react';
import Logo from '../../../resources/Icon.svg';

class Banner extends React.Component {

    render() {
        return (
            <div className='bannerDiv'>
                <div className='centerHeading'>
                    <Logo id='bannerImg' width={120} height={80}/>
                    <span id='bannerTitle'>CHITCHAT</span>
                </div>
                <div className='row'>
                    <span className='col-md-12' id='bannerTagline'>Message a galaxy far, far away!</span>
                </div>
            </div>
        );
    };
};

export default Banner;