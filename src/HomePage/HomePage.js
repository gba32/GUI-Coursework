import './HomePage.css'
import { Button, ThemeProvider, Typography } from '@mui/material';
import NavigationBar from '../NavigationBar/NavigationBar'
import ListCard, { ListCardItem } from '../ListCard/ListCard';
import { AccountCircleOutlined } from '@mui/icons-material';
import { APP_THEME } from '../Theme/Theme';

/**
 * 
 * @param {Boolean} loggedIn decides which page to show dependant on the users logged in status.
 * @returns 
 */
export default function HomePage({loggedIn, username}) {
    return <ThemeProvider theme={APP_THEME}> {loggedIn ? AccountHomePage({username}) : GuestHomePage()} </ThemeProvider>;
}

/**
 * Home page for a user with an account
 * @returns 
 */
export function AccountHomePage({username}) {
    return (
            <main className='MainContainer'>
                <nav>
                    <NavigationBar title="Home" />
                </nav>
                <div className='MainContent'>
                    <section className='headerBar'>
                        <AccountCircleOutlined fontSize='large' />
                        <Typography variant='h4'>
                            <b>{username}</b>
                        </Typography>
                    </section>
                    <ListCard
                        title="History"
                        showTitle
                        childPropsList={
                            Array(10).fill({ title: "value" })
                        }
                        childTemplate={ListCardItem} />
                    <section className='bottomContainer'>
                        <Button variant='contained'>Upload GPX</Button>
                    </section>
                </div>
            </main>
    );
}

/**
 * Home page for users without an account
 * @returns 
 */
export function GuestHomePage() {
    return (
        <main className='MainContainer'>
            <NavigationBar title="Home" />
            <section className='buttonContainer'>
                <Button variant='contained' size='large'>Log in</Button>
                <Button variant='contained' size='large'>Sign up</Button>
                <Button variant='contained' size='large'>Upload GPX</Button>
            </section>
        </main>
    );
}