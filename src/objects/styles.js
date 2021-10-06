import { makeStyles } from "@material-ui/core";

import { drawerWidth } from "../components/SideDrawer";

export const miniAppStyles = makeStyles({
    miniAppFrame: {
        width: `calc(100% - ${drawerWidth}px)`,
        // flexGrow: 1,
        // height: "100%",
        // width: "100%",
        // maxWidth: "100%",
        // minWidth: "100%",
        // overflow: 'hidden',
        // left: `${drawerWidth / 2}px`,
        // left: `${drawerWidth}px`
    }
});