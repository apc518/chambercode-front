import { Hidden } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { CircularProgress } from '@material-ui/core';

import { miniAppStyles } from '../objects/styles';
import { apps } from '../objects/apps';
import NotFound from './NotFound';

export default function MiniApp({ category, name }){
    const {appid} = useParams();
    const classes = miniAppStyles();
    const [loading, setLoading] = useState(true);

    // focus the iframe on page load
    const miniApp = useRef(null);
    useEffect(() => {
        miniApp?.current?.focus();
    }, []);

    const app = apps[category].filter(a => a.name === appid ? appid : name)[0];

    if(!app) {
        return <NotFound/>
    }

    return (
        <div style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
        }}>
            <Hidden mdUp implementation="css">
                {app.needsForeheadMdDown ? <><div style={{ minHeight: "50px" }}></div></> : <></>}
            </Hidden>
            {loading ? <CircularProgress
                style={{
                    zIndex: -1,
                    position: 'absolute',
                    left: "50%",
                    top: "30%",
                    transform: "translate(200%, -50%)",
                    animation: "none"
                }}
            /> : <></> }
            <iframe
                ref={miniApp}
                className={classes.miniAppFrame}
                title={appid}
                sandbox="allow-modals allow-forms allow-top-navigation allow-same-origin allow-scripts allow-pointer-lock allow-orientation-lock allow-popups allow-presentation"
                src={app.url}
                onLoad={() => setLoading(false)}
            />
        </div>
    )
}