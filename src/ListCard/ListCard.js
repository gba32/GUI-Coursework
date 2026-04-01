import { ArrowDropDown } from '@mui/icons-material';
import { Button, ButtonProps, Typography } from '@mui/material';
import './ListCard.css';
import { RenderOptional } from '../Utility/ReactUtil';


/**
 * 
 * @param {ButtonProps} props props to pass to the button element.
 * @returns 
 */
function ExpandButton(props) {
    return (<Button variant="contained" className='expandButton' {...props}>
        <ArrowDropDown />
    </Button>);
}

/**
 * A generic element for displaying a list of item
 * 
 * @param {*} props
 * @param {string} props.title the title of the card
 * @param {boolean} showTitle a flag deciding whether the title is shown
 * @param {*} childPropsList a list of items to pass to the given template function
 * @param {*} childTemplate  a template for the list items to be displayed
 * @param {string} scrollerClassName the className to pass to the list scroller
 * @param {boolean} expanded a flag deciding whether the scroller's dimensions are limited
 * @param {*} onExpand a callback function to be called when the card expands
 * @param {*} showExpand a flag deciding whether the expand button is shown
 * @returns 
 */
export default function ListCard({
    title,
    showTitle,
    childPropsList,
    childTemplate,
    scrollerClassName = 'scroller',
    expanded = false,
    onExpand,
    showExpand
}) {
    // Populate scrollable dropdown children
    let children = [];
    if (childPropsList) {
        children = childPropsList.map((element) =>
            (<li className='item'> {childTemplate(element)} </li>)
        )
    }
    let childContainer = <article className={scrollerClassName + (expanded ? ' expanded' : '')}>{children}</article>;

    return (
        <section className={'card'}>
            <RenderOptional enabled={showTitle}>
                <div className='title'> <Typography letiant='h5'> <b>{title}</b> </Typography> </div>

            </RenderOptional>
            {childContainer}
            <RenderOptional enabled={showExpand}>
                <ExpandButton onClick={onExpand} />
            </RenderOptional>
        </section>
    )
}