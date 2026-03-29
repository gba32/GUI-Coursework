import { AppBar, Button, ButtonGroup, Drawer, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import './NavigationBar.css'
import { ArrowBack } from "@mui/icons-material";
import { useState } from "react";
import { PATHS } from "./NavLinks";

/**
 * Common navbar component for all pages
 * @returns 
 */
export default function NavigationBar({ title, onBackPressed, showBackButton }) {
    var [drawerOpen, setDrawerOpen] = useState(false);
    var backButton = <Button disabled size="large"></Button>;

    var toggleDrawer = () => { setDrawerOpen(!drawerOpen) };

    if (showBackButton) {
        backButton = (
            <Button size="large" onClick={onBackPressed}>
                <ArrowBack />
            </Button>
        );
    }

    return (
        <nav>
            <AppBar position="sticky">
                <Toolbar className="navbar">
                    {backButton}
                    <div className="title">
                        <Typography variant="h4">
                            <b>{title}</b>
                        </Typography>
                    </div>
                    <Button size="large" onClick={toggleDrawer}>
                        <MenuIcon />
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer variant="temporary" onClose={toggleDrawer} open={drawerOpen}>
                <div className="navDrawer">
                    <Typography variant="h5"><b>GPX Weather app</b></Typography>
                    {getDrawerLinks()}
                </div>
            </Drawer>
        </nav>
    );
}

/**
 * 
 * @returns a button group containing links to all the pages of the website
 */
function getDrawerLinks() {
    const navigateTo = (path) => { window.location.assign(path) };
    let buttons = [];

    PATHS.forEach(
        (path) => {
            if (path.navBarButton) {
                buttons.push(<Button onClick={() => { navigateTo(path.relativePath) }}>{path.title}</Button>);
            }
        }
    );
    return <ButtonGroup orientation="vertical" variant="contained" disableElevation>{buttons}</ButtonGroup>;
}