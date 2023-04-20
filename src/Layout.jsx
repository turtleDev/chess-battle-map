import { Outlet} from "react-router-dom";

export default function Base() {
    return (
        <div className="container px-4 md:mx-auto">
            <div className="flex items-center justify-center">
                {/* <Link to="/">
                    <h1 className="text-4xl py-4">Chess Battle Map</h1>
                </Link> */}
                <form className="min-w-[75%] flex justify-center items-center rounded my-8 border-4 border-[var(--primary)]">
                    <input className="grow h-full p-4 focus-visible:outline-0 text-[#303240]" type="text" placeholder="paste game link or PGN to start ..." />
                    <input className="btn mt-0 text-3xl rounded-none hover:cursor-pointer" type="submit" value="start"></input>
                </form>
            </div>
            <Outlet/>
        </div>
    );
}