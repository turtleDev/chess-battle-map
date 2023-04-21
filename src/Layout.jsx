import { faChessBoard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Outlet, Link } from "react-router-dom";

export default function Base() {
    return (
        <div className="container px-4 md:mx-auto">
            <div className="flex items-center">
                <Link to="/">
                    <FontAwesomeIcon className="mx-2 md:mx-8" icon={faChessBoard} size="4x"/>
                </Link>
                <form className="flex grow justify-center items-center rounded my-8 border-4 border-[var(--primary)]">
                    <input className="grow h-full w-10 p-4 focus-visible:outline-0 text-[#303240]" type="text" placeholder="paste game link or PGN to start ..." />
                    <input className="btn mt-0 text-3xl rounded-none hover:cursor-pointer" type="submit" value="start"></input>
                </form>
            </div>
            <Outlet/>
        </div>
    );
}