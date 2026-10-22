import { Link } from "react-router";
import './index.css';

/* import BigEyesBoy from 'https://framer.com/m/bigeyesboy-dmg7AQ.js@oExbahf49SXtqbWwdsWx'; */

function NotFound()
{
    return(
        <div className="not-found-page">
            <div className="not-found-visual">
                {/* <BigEyesBoy /> */}
            </div>

            <h1>Oops! Page not found</h1>

            <p>
                Looks like this page doesn't exist or the Pokemon you're looking for is missing.
            </p>

            <Link to="/" className="not-found-link">Back to Home</Link>
        </div>
    );
}

export default NotFound;