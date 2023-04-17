import { Outlet, Link } from "react-router-dom";

export default function Base() {
    return (
        <div className="container mx-4">
            <Link to="/">
                <h1 className="text-4xl py-4">Chess Battle Map</h1>
            </Link>
            <Outlet/>
        </div>
    );
}