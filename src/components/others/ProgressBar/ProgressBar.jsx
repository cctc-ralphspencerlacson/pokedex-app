import './ProgressBar.css';

/**
 * ProgressBar component for displaying a visual progress indicator.
 *
 * @param {Object} props - Component properties.
 * @param {number} props.percentage - The percentage of completion for the progress.
 * @param {string} props.color - The color of the progress bar.
 * @returns {JSX.Element} The ProgressBar component.
 */
const ProgressBar = ({percentage, color}) => {

    const componentStyle = {
        width: `${percentage}%`,
    };

    return ( 
        <div className="progress">
            <div className="bar">
                <span className={`fill ${color}`} style={componentStyle}></span>
            </div>
        </div>
     );
}
 
export default ProgressBar;