import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="home">
            <div>
                <p className="text-xl">
                    Visualise square control from any online chess game.
                    <br/>
                    You can also just paste in your PGN.
                </p>
                <Link to="game?data=W0V2ZW50ICJDYXN1YWwgUmFwaWQgZ2FtZSJdCltTaXRlICJodHRwczovL2xpY2hlc3Mub3JnL1JXeUFRNVFXIl0KW0RhdGUgIjIwMjIuMDQuMDIiXQpbV2hpdGUgImJpdGJhbmdlciJdCltCbGFjayAiQW5vbnltb3VzIl0KW1Jlc3VsdCAiMC0xIl0KW1VUQ0RhdGUgIjIwMjIuMDQuMDIiXQpbVVRDVGltZSAiMTI6Mjg6NTEiXQpbV2hpdGVFbG8gIjk4NyJdCltCbGFja0VsbyAiPyJdCltWYXJpYW50ICJTdGFuZGFyZCJdCltUaW1lQ29udHJvbCAiNjAwKzUiXQpbRUNPICJEMjAiXQpbT3BlbmluZyAiUXVlZW4ncyBHYW1iaXQgQWNjZXB0ZWQiXQpbVGVybWluYXRpb24gIlRpbWUgZm9yZmVpdCJdCltBbm5vdGF0b3IgImxpY2hlc3Mub3JnIl0KCjEuIGQ0IGQ1IDIuIGM0IGR4YzQgeyBEMjAgUXVlZW4ncyBHYW1iaXQgQWNjZXB0ZWQgfSAzLiBOYzMgZjUgNC4gZTMgZzUgNS4gUWg1KyBLZDcgNi4gUXhnNSBOZjYgNy4gUXhmNSsgS2U4IDguIFFiNSsgYzYgOS4gUXhjNCBRYTUgMTAuIE5mMyBCZzQgMTEuIEJkMyBCeGYzIDEyLiBneGYzIE5hNiAxMy4gQmQyIE5iNCAxNC4gUmcxIE5oNSAxNS4gUmc4IFJ4ZzggMTYuIFF4ZzggTnhkMysgMTcuIEtlMiBOeGIyIDE4LiBReGg3IFJkOCAxOS4gUWc2KyBLZDcgMjAuIE5kNSBlNiAyMS4gQnhhNSBleGQ1IDIyLiBReGg1IEJhMyAyMy4gQnhkOCBLeGQ4IDI0LiBRZjUgS2M3IDI1LiBoNCBCZTcgMjYuIGg1IEJoNCAyNy4gUWY0KyBLYjYgMjguIFF4aDQgYzUgeyBCbGFjayB3aW5zIG9uIHRpbWUuIH0gMC0x">
                    <button className='btn'>
                        demo
                    </button>
                </Link>
            </div>
        </div>
    )
}