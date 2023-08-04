import './ProgressBar.css';

const ProgressBar = ({percentage}) => {

    const componentStyle = {
        width: `${percentage}%`,
      };

    return ( 
        <div className="progress">
            <div className="bar">
                <span className="fill" style={componentStyle}></span>
            </div>
        </div>
     );
}
 
export default ProgressBar;