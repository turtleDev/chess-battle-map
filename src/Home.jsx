import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Board from './Board';
import Engine from './engine';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faChessKnight } from '@fortawesome/free-solid-svg-icons';

const ANIMATION_INTERVAL = 900;

export default function Home() {
    const src = "1. e4 c5";
    const engine = useMemo(() => new Engine(src), []);
    const [boardState, setBoardState] = useState(engine.state());
    useEffect(() => {
        const moves = src.split(" ").length;
        for (let i = 0; i < moves; i++) {
            setTimeout(() => {
                setBoardState(engine.next());
            }, ANIMATION_INTERVAL * (i+1));
        }
    }, [engine])

    return (
        <div className="home">
            <div className="flex flex-col md:flex-row justify-around max-w-6xl mx-auto mt-8 md:mt-20 ">
                <Board state={boardState}/>
                <div className="flex flex-col justify-center mt-4 md:mt-0 md:mx-12">
                    <p className="text-4xl font-bold md:text-8xl">!!</p>
                    <p className="text-xl md:text-4xl mt-2 md:mt-8">
                        Visualise square control from any online chess game.
                    </p>
                    <p className="text-xl md:text-4xl mt-2 md:mt-10">
                        You can also just paste in your PGN.
                    </p>
                    <div className="flex text-xl md:text-3xl mt-4 md:mt-10 md:my-0 gap-4">
                        <Link to="game?data=W0V2ZW50ICJDYXN1YWwgUmFwaWQgZ2FtZSJdCltTaXRlICJodHRwczovL2xpY2hlc3Mub3JnL1JXeUFRNVFXIl0KW0RhdGUgIjIwMjIuMDQuMDIiXQpbV2hpdGUgImJpdGJhbmdlciJdCltCbGFjayAiQW5vbnltb3VzIl0KW1Jlc3VsdCAiMC0xIl0KW1VUQ0RhdGUgIjIwMjIuMDQuMDIiXQpbVVRDVGltZSAiMTI6Mjg6NTEiXQpbV2hpdGVFbG8gIjk4NyJdCltCbGFja0VsbyAiPyJdCltWYXJpYW50ICJTdGFuZGFyZCJdCltUaW1lQ29udHJvbCAiNjAwKzUiXQpbRUNPICJEMjAiXQpbT3BlbmluZyAiUXVlZW4ncyBHYW1iaXQgQWNjZXB0ZWQiXQpbVGVybWluYXRpb24gIlRpbWUgZm9yZmVpdCJdCltBbm5vdGF0b3IgImxpY2hlc3Mub3JnIl0KCjEuIGQ0IGQ1IDIuIGM0IGR4YzQgeyBEMjAgUXVlZW4ncyBHYW1iaXQgQWNjZXB0ZWQgfSAzLiBOYzMgZjUgNC4gZTMgZzUgNS4gUWg1KyBLZDcgNi4gUXhnNSBOZjYgNy4gUXhmNSsgS2U4IDguIFFiNSsgYzYgOS4gUXhjNCBRYTUgMTAuIE5mMyBCZzQgMTEuIEJkMyBCeGYzIDEyLiBneGYzIE5hNiAxMy4gQmQyIE5iNCAxNC4gUmcxIE5oNSAxNS4gUmc4IFJ4ZzggMTYuIFF4ZzggTnhkMysgMTcuIEtlMiBOeGIyIDE4LiBReGg3IFJkOCAxOS4gUWc2KyBLZDcgMjAuIE5kNSBlNiAyMS4gQnhhNSBleGQ1IDIyLiBReGg1IEJhMyAyMy4gQnhkOCBLeGQ4IDI0LiBRZjUgS2M3IDI1LiBoNCBCZTcgMjYuIGg1IEJoNCAyNy4gUWY0KyBLYjYgMjguIFF4aDQgYzUgeyBCbGFjayB3aW5zIG9uIHRpbWUuIH0gMC0x">
                            {/* maybe get extract this to a separate btn-lg class? */}
                            <button className='btn md:px-8 md:py-5 my-6'>
                                <FontAwesomeIcon className="mr-2 md:mr-4" icon={faChessKnight} />
                                demo
                            </button>
                        </Link>
                        <button className='btn-inverted md:px-8 md:py-5 my-6'>
                            <a href="https://github.com/turtleDev/chess-battle-map" target="_blank" rel="noreferrer">
                                <FontAwesomeIcon className="mr-2 md:mr-4" icon={faGithub}/>
                                source
                            </a>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}