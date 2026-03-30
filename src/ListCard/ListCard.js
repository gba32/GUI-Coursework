import { Button, Typography } from '@mui/material'
import './ListCard.css'
import { ArrowDropDown } from '@mui/icons-material'
import { useState } from 'react'

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
export default function ListCard({ 
    title,
    showTitle,
    childPropsList,
    childTemplate: childTemplateFunc,
    scrollerClassName = 'scroller',
    expanded = false,
    onExpand, 
    showExpand
}) {
    var titleElement = (<div></div>);

    // Populate scrollable dropdown children
    var children = childPropsList.map((element) =>
        (<li className='item'> {childTemplateFunc(element)} </li>)
    )
    var childContainer = <article className={scrollerClassName + (expanded ? ' expanded' : '')}>{children}</article>;

    if (showTitle) {
        titleElement = <Typography variant='h5'> <b>{title}</b> </Typography>;
    }


    return (
        <section className={'card'}>
            <div className='title'> {titleElement} </div>
            {childContainer}
            {showExpand === true && <ExpandButton onClick={onExpand} />}
        </section>
    )
}