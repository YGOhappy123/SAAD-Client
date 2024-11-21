import rootRouter from './RootRouter';
import authRouter from './AuthRouter';
import devRouter from './DevRouter';
import dashboardRouter from './DashboardRouter';
import salesRouter from './SalesRouter';
import profileRouter from './ProfileRouter';
import { createBrowserRouter } from 'react-router-dom';

const production = createBrowserRouter([...rootRouter, ...authRouter, ...dashboardRouter, ...salesRouter, ...profileRouter]);
const dev = createBrowserRouter([...rootRouter, ...authRouter, ...devRouter, ...dashboardRouter, ...salesRouter, ...profileRouter]);
const getRouter = (isDev: boolean) => (isDev ? dev : production);

export default getRouter;
