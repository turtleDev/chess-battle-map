import {
    createBrowserRouter
} from 'react-router-dom';

import Game from './Game';
import Home from './Home';

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
    basename: "/chess-battle-map"
});