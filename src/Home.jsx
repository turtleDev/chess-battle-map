import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Board from './Board';
import Engine from './engine';

export default function Home() {

    const engine = useMemo(() => new Engine('1. e4 c5'), []);
    const [boardState, setBoardState] = useState(engine.state());
    useEffect(() => {
        for (let i = 0; i < 2; i++) {
            setTimeout(() => {
                engine.next();
                setBoardState(engine.state());
            }, 900 * (i+1));
        }
    }, [engine])

    return (
        <div className="home">
            <div className="flex justify-around max-w-[75%] mx-auto mt-20">
                <div className=" flex flex-col justify-center">
                    <p className="text-9xl">!!</p>
                    <p className="text-4xl mt-8">
                        Visualise square control from any online chess game.
                    </p>
                    <p className="text-4xl mt-10">
                        You can also just paste in your PGN.
                    </p>
                    <Link to="game?data=W0V2ZW50ICJDYXN1YWwgUmFwaWQgZ2FtZSJdCltTaXRlICJodHRwczovL2xpY2hlc3Mub3JnL1JXeUFRNVFXIl0KW0RhdGUgIjIwMjIuMDQuMDIiXQpbV2hpdGUgImJpdGJhbmdlciJdCltCbGFjayAiQW5vbnltb3VzIl0KW1Jlc3VsdCAiMC0xIl0KW1VUQ0RhdGUgIjIwMjIuMDQuMDIiXQpbVVRDVGltZSAiMTI6Mjg6NTEiXQpbV2hpdGVFbG8gIjk4NyJdCltCbGFja0VsbyAiPyJdCltWYXJpYW50ICJTdGFuZGFyZCJdCltUaW1lQ29udHJvbCAiNjAwKzUiXQpbRUNPICJEMjAiXQpbT3BlbmluZyAiUXVlZW4ncyBHYW1iaXQgQWNjZXB0ZWQiXQpbVGVybWluYXRpb24gIlRpbWUgZm9yZmVpdCJdCltBbm5vdGF0b3IgImxpY2hlc3Mub3JnIl0KCjEuIGQ0IGQ1IDIuIGM0IGR4YzQgeyBEMjAgUXVlZW4ncyBHYW1iaXQgQWNjZXB0ZWQgfSAzLiBOYzMgZjUgNC4gZTMgZzUgNS4gUWg1KyBLZDcgNi4gUXhnNSBOZjYgNy4gUXhmNSsgS2U4IDguIFFiNSsgYzYgOS4gUXhjNCBRYTUgMTAuIE5mMyBCZzQgMTEuIEJkMyBCeGYzIDEyLiBneGYzIE5hNiAxMy4gQmQyIE5iNCAxNC4gUmcxIE5oNSAxNS4gUmc4IFJ4ZzggMTYuIFF4ZzggTnhkMysgMTcuIEtlMiBOeGIyIDE4LiBReGg3IFJkOCAxOS4gUWc2KyBLZDcgMjAuIE5kNSBlNiAyMS4gQnhhNSBleGQ1IDIyLiBReGg1IEJhMyAyMy4gQnhkOCBLeGQ4IDI0LiBRZjUgS2M3IDI1LiBoNCBCZTcgMjYuIGg1IEJoNCAyNy4gUWY0KyBLYjYgMjguIFF4aDQgYzUgeyBCbGFjayB3aW5zIG9uIHRpbWUuIH0gMC0x">
                        <button className='btn text-3xl mt-10 px-8 py-5 mx-auto mx-auto rounded-2xl'>
                            demo
                        </button>
                    </Link>
                </div>
                <Board state={boardState}/>
            </div>
        </div>
    )
}