import { SmileySad, House } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import './NotFound.scss';

function NotFound() {
    return (
        <div className='not-found'>
            <div className="not-found__content">
                <SmileySad size={64} weight="fill" className="not-found__icon" />
                <h1 className='not-found__title'>404</h1>
                <p className='not-found__message'>Oops! Page not found</p>
                <Link to="/" className="not-found__link">
                    <House weight="fill" />
                    Return Home
                </Link>
            </div>
        </div>
    );
}

export default NotFound;