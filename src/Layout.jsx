import { faChessBoard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Outlet, Link, Form, useNavigation } from "react-router-dom";
import { useState } from "react";

export default function Base() {
    let [value, setValue] = useState('');
    let nav = useNavigation();
    if (nav.state === "submitting" && value.length > 0) {
        setValue('');
    }
    return (
        <div className="container px-4 md:mx-auto">
            <div className="flex items-center">
                <Link to="/">
                    <FontAwesomeIcon className="mr-2 md:mx-8" icon={faChessBoard} size="4x"/>
                </Link>
                <Form method="post" className="flex grow justify-center items-center rounded my-4 md:my-8 border-4 border-[var(--primary)]">
                    <input className="grow h-full w-10 p-4 focus-visible:outline-0 text-[#303240]" value={value} onChange={e => setValue(e.target.value)} name="input" type="text" placeholder="paste game link or PGN to start ..." />
                    <input className="btn mt-0 text-3xl rounded-none hover:cursor-pointer" type="submit" value="start"></input>
                </Form>
            </div>
            <Outlet/>
        </div>
    );
}