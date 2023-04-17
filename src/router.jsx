import {
    createBrowserRouter
} from 'react-router-dom';

import Game from './Game';
import Home from './Home';
import Base from './Layout';

function basenameFromPackage() {
    const url = new URL(require("../package.json").homepage)
    return url.pathname;
}

export default createBrowserRouter([
    {
        path: '/',
        element: <Base/>,
        children: [
            {
                path: '/',
                element: <Home/>
            },
            {
                path: "/game",
                element: <Game/>
            },
        ]
    },
], {
    basename: basenameFromPackage(),
});