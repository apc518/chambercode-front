import { Hidden } from '@material-ui/core';
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { miniAppStyles } from '../objects/styles';
import { apps } from '../objects/apps';

export default function MiniApp({ category, name }){
    const {appid} = useParams();
    const classes = miniAppStyles();

    // focus the iframe on page load
    const miniApp = useRef(null);
    useEffect(() => {
        miniApp?.current?.focus();
    }, []);

    const app = apps[category].filter(a => a.name === appid ? appid : name)[0];

    return (
        <div style={{
            height: "100%",
            display: "flex",
            flexDirection: "column"
        }}>
            <Hidden mdUp implementation="css">
                {app.needsForeheadMdDown ? <><div style={{ minHeight: "50px" }}></div></> : <></>}
            </Hidden>
            <iframe
                ref={miniApp}
                className={classes.miniAppFrame}
                title={appid}
                sandbox="allow-modals allow-forms allow-top-navigation allow-same-origin allow-scripts allow-pointer-lock allow-orientation-lock allow-popups allow-presentation"
                src={app.url}
            />
        </div>
    )
}