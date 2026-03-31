import './HomePage.css'
import { Button, ThemeProvider, Typography } from '@mui/material';
import NavigationBar from '../NavigationBar/NavigationBar'
import ListCard, { ListCardItem } from '../ListCard/ListCard';
import { AccountCircleOutlined } from '@mui/icons-material';
import { APP_THEME } from '../Theme/Theme';
import { useNavigate } from 'react-router';
import StorageUtil from '../Utility/StorageUtil';
import { gpxData } from '../GPXroute/sampleGPX2';

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
 */
function AccountHomePage({username}) {
    let navigator = useNavigate();

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
                            []
                        }
                        childTemplate={HistoryCard} />
                    <section className='bottomContainer'>
                        <Button variant='contained' onClick={() => {
                            StorageUtil.writeOnce("GPX_DATA", gpxData);
                            navigator("/details");
                        }}>Upload GPX</Button>
                    </section>
                </div>
            </main>
    );
}

/**
 * Home page for users without an account
 */
function GuestHomePage() {
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

function HistoryCard(gpx) {
    return <article>
        <Typography variant='h4'>{gpx.metadata.name}</Typography>
    </article>
}