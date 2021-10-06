import React, { useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { miniAppStyles } from '../objects/styles';

export default function MiniApp({url}){
    const {appid} = useParams();
    const location = useLocation();
    const classes = miniAppStyles();

    const miniApp = useRef(null);

    useEffect(() => {
        miniApp?.current?.focus();
    }, []);
    

    return (
        <iframe
            ref={miniApp}
            className={classes.miniAppFrame}
            // width="100%"
            title={appid}
            sandbox="allow-modals allow-forms allow-top-navigation allow-same-origin allow-scripts allow-pointer-lock allow-orientation-lock allow-popups allow-presentation"
            src={appid ? `/static${location.pathname}` : url}
        />    
    )
}