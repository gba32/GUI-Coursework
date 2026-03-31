import { useNavigate } from 'react-router';
import './ErrorPage.css';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';


export default function ErrorPage({message, timeoutSeconds, redirectTo}) {
    let navigator = useNavigate();
    let [timeLeft, setTimeLeft] = useState(timeoutSeconds);

    useEffect(() => {
        if(timeLeft < 0) {
            navigator(redirectTo, { replace: true});
        } else {
            setTimeout(() => {setTimeLeft(timeLeft - 1)}, 1000);
        }
    }, [timeLeft, navigator, redirectTo, timeoutSeconds]);

    return <div className='error'>
        <Typography variant='h3' >{message}</Typography>
        <Typography variant='h5'>Redirecting in {timeLeft} seconds...</Typography>
    </div>
}