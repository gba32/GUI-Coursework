import { AppBar, Button, ButtonGroup, Drawer, ThemeProvider, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import './NavigationBar.css'
import { ArrowBack } from "@mui/icons-material";
import React, { useState } from "react";
import { PATHS } from "./NavLinks";
import { useNavigate } from "react-router";

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
                    <div className="title">
                        <Typography variant="h4">
                            <b>{title}</b>
                        </Typography>
                    </div>

                </Toolbar>
            </AppBar>
            <Drawer variant="temporary" onClose={toggleDrawer} open={drawerOpen}>
                <div className="navDrawer">
                    <Typography variant="h5"><b>GPX Weather app</b></Typography>
                </div>
            </Drawer>
        </nav>
    );
}

/**
 * Strips a path of trailing '/' characters for comparison
 * @param {string} path 
 */
function formatPath(path) {
    let endIndex = 0;

    if(path.length === 0) { 
        return "";
    }

    for(let i = 0; i < path.length; i++) {
        if(path[i] !== '/') {
            endIndex = i;
        }
    }

    return path.substring(0, endIndex);
}

/**
 * Compares two relative url paths for equality
 * 
 * @param {string} path1 
 * @param {string} path2 
 * @returns 
 */
function comparePaths(path1, path2) {
    return formatPath(path1) === formatPath(path2);
}

/**
 * @param {string} currentPath the relative path to the current page on the website
 * @returns a button group containing links to all the pages of the website
 */
export function DrawerLinks({currentPath}) {
    const navigateTo = (path) => { window.location.assign(path) };
    let buttons = [];

    PATHS.forEach(
        (path) => {
            if (path.navBarButton) {
                let className = "nav-btn " + (comparePaths(path.relativePath, currentPath) ? "nav-btn--active" : "");
                buttons.push(<button className={className} key={path.relativePath} onClick={() => { navigateTo(path.relativePath) }}>{path.title}</button>);
            }
        }
    );
    return <React.Fragment>{buttons}</React.Fragment>;
}