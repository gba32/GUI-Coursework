import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";
import './NavigationBar.css';
import { PATHS } from "./NavLinks";

/**
 * Common navbar component for all pages
 * @returns 
 */
export default function TitleBar({ title }) {
    return (
        <nav>
            <AppBar position="sticky">
                <Toolbar className="appBar">
                    <div className="title">
                        <Typography variant="h4">
                            <b>{title}</b>
                        </Typography>
                    </div>
                </Toolbar>
            </AppBar>
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
    const isLoggedIn = !!JSON.parse(localStorage.getItem("loggedInUser"));
    
    // paths only shown when logged out
    const guestOnly = ["/login", "/register"];
    // paths only shown when logged in
    const authOnly = ["/logout"];

    let buttons = [];

    PATHS.forEach((path) => {
        if (!path.navBarButton) return;

        if (isLoggedIn && guestOnly.includes(path.relativePath)) return;
        if (!isLoggedIn && authOnly.includes(path.relativePath)) return;

        let className = "nav-btn " + (comparePaths(path.relativePath, currentPath) ? "nav-btn--active" : "");
        buttons.push(
            <button
                className={className}
                key={path.relativePath}
                onClick={() => navigateTo(path.relativePath)}
            >
                {path.title}
            </button>
        );
    });

    return <React.Fragment>{buttons}</React.Fragment>;
}