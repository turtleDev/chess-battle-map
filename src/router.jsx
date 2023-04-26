import {
    createBrowserRouter,
    redirect
} from 'react-router-dom';

import Game from './Game';
import Home from './Home';
import Base from './Layout';
import Engine from './engine';

function basenameFromPackage() {
    const url = new URL(require("../package.json").homepage)
    return url.pathname;
}

function isURL(u) {
    try {
        new URL(u);
    } catch (e) {
        return false;
    }
    return true;
}

function isPGN(raw) {
    try {
        new Engine(raw)
    } catch (e) {
        return false;
    }
    return true
}

function formatPGN(raw) {
    raw = raw.replaceAll('] ', ']\n');
    let headerBreakPoint = raw.lastIndexOf(']\n') +1;
    return raw.slice(0, headerBreakPoint) + '\n\n' + raw.slice(headerBreakPoint)
}

export default createBrowserRouter([
    {
        path: '/',
        element: <Base />,
        action: async ({ request }) => {
            const rawText = (await request.formData()).get('input');
            if (isURL(rawText)) {
                return redirect(`/game?link=${encodeURIComponent(rawText)}`)
            }

            // try treating it as PGN
            let pgn = formatPGN(rawText);
            if (isPGN(pgn)) {
                return redirect (`/game?data=${btoa(pgn)}`)
            }
            throw Error(`unsupported input: ${rawText}`)
        },
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "/game",
                element: <Game />,
                loader: async ({ request }) => {
                    const url = new URL(request.url);

                    const data = atob(url.searchParams.get('data')?.trim() ?? '');
                    if (isPGN(data)) {
                        return { pgn: data }
                    }

                    const link = url.searchParams.get('link')?.trim() ?? '';
                    if (isURL(link)) {
                        const host = new URL(link);
                        let res = null;
                        switch (host.host) {
                            case 'lichess.org':
                                console.info('detected lichess link. calling lichess apis to fetch PGN')
                                let gameId = host.pathname.replace('/', '');
                                res = await fetch(`https://lichess.org/game/export/${gameId}`);
                                return { pgn: await res.text() }
                            case 'www.chess.com':
                                console.info('detected chess.com link. calling chess.com apis to fetch game PGN')
                                res = await fetch(`https://workers.turtledev.in/api/chess-battle-map/pgn?link=${encodeURIComponent(link)}`);
                                return { pgn: await res.text() }
                            default:
                                return {}
                        }
                    }
                    return null;
                }
            },
        ]
    },
], {
    basename: basenameFromPackage(),
});