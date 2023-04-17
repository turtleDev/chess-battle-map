import {
    createBrowserRouter
} from 'react-router-dom';

import Game from './Game';
import Home from './Home';

function basenameFromPackage() {
    const url = new URL(require("../package.json").homepage)
    return url.pathname;
}

export default createBrowserRouter([
    {
        path: "/",
        element: <Home/>
    },
    {
        path: "/game",
        element: <Game/>
    },
], {
    basename: basenameFromPackage(),
});