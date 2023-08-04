import './ProgressBar.css';

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