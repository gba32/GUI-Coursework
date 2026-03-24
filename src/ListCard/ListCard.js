import { Button, Typography } from '@mui/material'
import './ListCard.css'
import { ArrowDropDown } from '@mui/icons-material'
import { useState } from 'react'

/**
 * 
 * @param {*} props 
 * @returns 
 */
function ExpandButton(props) {
    return (<Button variant="contained" className='expandButton' {...props}>
        <ArrowDropDown />
    </Button>);
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
export default function ListCard({ title, showTitle, childPropsList, childTemplate: childTemplateFunc }) {
    var titleElement = (<div></div>);

    // Dropdown list state
    var [expanded, setExpanded] = useState(false);
    const onclick = () => { setExpanded(!expanded) };

    // Populate scrollable dropdown children
    var children = childPropsList.map((element) =>
        (<li className='item'> {childTemplateFunc(element)} </li>)
    )
    var childContainer = <article className={'scroller ' + (expanded ? 'expanded' : '')}>{children}</article>;

    if (showTitle) {
        titleElement = <Typography variant='h5'> <b>{title}</b> </Typography>;
    }


    return (
        <section className='card'>
            <div className='title'> {titleElement} </div>
            {childContainer}
            <ExpandButton onClick={onclick} />
        </section>
    )
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
export function ListCardItem({ title, routeDetails }) {
    return (
        <div className='listItem'>
            <h6>{title}</h6>
            <p>Description</p>
        </div>
    );
}