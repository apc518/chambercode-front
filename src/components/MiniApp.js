import { Hidden } from '@material-ui/core';
import React, { useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { miniAppStyles } from '../objects/styles';

const appsThatNeedSpace = {
    "matheroids": 0,
    "latex-matrix": 1
}

export default function MiniApp({url}){
    const {appid} = useParams();
    const location = useLocation();
    const classes = miniAppStyles();

    // focus the iframe on page load
    const miniApp = useRef(null);
    useEffect(() => {
        miniApp?.current?.focus();
    }, []);
    

    return (
        <>
        <Hidden smUp implementation="css">
            {appid in appsThatNeedSpace ? <><br/><br/></> : <></>}
        </Hidden>
        <iframe
            ref={miniApp}
            className={classes.miniAppFrame}
            title={appid}
            sandbox="allow-modals allow-forms allow-top-navigation allow-same-origin allow-scripts allow-pointer-lock allow-orientation-lock allow-popups allow-presentation"
            src={appid ? `/static${location.pathname}` : url}
        />    
        </>
    )
}