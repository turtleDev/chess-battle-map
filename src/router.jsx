import {
    createBrowserRouter,
    redirect
} from 'react-router-dom';

import Game from './Game';
import Home from './Home';
import Base from './Layout';

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

export default createBrowserRouter([
    {
        path: '/',
        element: <Base />,
        action: async ({ request }) => {
            const rawText = (await request.formData()).get('input');
            if (isURL(rawText)) {
                return redirect(`/game?link=${encodeURIComponent(rawText)}`)
            }
            return redirect("/game");
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
                    const link = url.searchParams.get('link').trim();
                    if (isURL(link)) {
                        const host = new URL(link);
                        switch (host.host) {
                            case 'lichess.org':
                                let gameId = host.pathname.replace('/', '');
                                const res = await fetch(`https://lichess.org/game/export/${gameId}`);
                                return { pgn: await res.text() }
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