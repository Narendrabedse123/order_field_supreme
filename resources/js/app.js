import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch,Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Routes from './routes';
import store from './store';
import * as action from './store/actions';

const Dashboard = lazy(() => import("./pages/Dashboard"));
const FieldSetup = lazy(() => import("./pages/Fieldsetup"));
const PageSetup = lazy(() => import("./pages/Pagesetup"));
const Plan = lazy(() => import("./pages/Plan"));
const CartLayout = lazy(() => import("./pages/Cartlayout"));
const ShowTranslationLang = lazy(() => import("./pages/showtranslationLang"));
const Translation = lazy(() => import("./pages/Translation"));
const Addfields = lazy(() => import("./pages/Addfields"));
const Help = lazy(() => import("./pages/help"));
const statics = lazy(() => import("./pages/Statics"));

store.dispatch(action.authCheck());

ReactDOM.render(
  <Provider store={store}>
    <Router >
    <Suspense fallback={null}>
    <Switch>
    <Route exact path='/' component={Dashboard}/>
    <Route exact path='/statistic' component={statics}/>
    <Route exact path='/help/:shop' component={Help}/>
    <Route exact path='/dashboard/:shop' component={Dashboard}/>
    <Route exact path='/cartlayout/:shop' component={CartLayout}/>
    <Route exact path='/addnewfield/:shop' component={Addfields}/>
    <Route exact path='/translation/:shop/:id/:name/:lang' component={Translation}/>
    <Route exact path='/showtranslation/:shop' component={ShowTranslationLang}/>
    <Route exact path='/fieldsetup/:shop' component={FieldSetup}/>
    <Route exact path='/pagesetup/:shop' component={PageSetup}/>
    <Route exact path='/plan/:shop' component={Plan}/>
    </Switch>
 </Suspense>
      {/* <Switch>
        <Routes />
      </Switch> */}
    </Router>
  </Provider>,
  document.getElementById('app'),
);
