

import Dashboard from '../pages/Dashboard';
import FieldSetup from '../pages/Fieldsetup'
import PageSetup from '../pages/Pagesetup'
import Plan from '../pages/Plan'
import CartLayout from '../pages/Cartlayout'
import ShowTranslationLang from '../pages/showtranslationLang';
import Translation from '../pages/Translation';
import Addfields from '../pages/Addfields';
import Help from '../pages/help'
import statics from '../pages/Statics'



const routes = [

  {
    path: '/statistic',
    exact: true,
    auth: false,
    component: statics
  },
  {
    path: '/',
    exact: true,
    auth: false,
    component: Dashboard
  },
  
  {
    path: '/help/:shop',
    exact: true,
    auth: false,
    component: Help
  },
  
    
  {
    path: '/dashboard/:shop',
    exact: true,
    auth: false,
    component: Dashboard
  },
  {
    path: '/cartlayout/:shop',
    exact: true,
    auth: false,
    component: CartLayout
  },
  {
    path: '/addnewfield/:shop',
    exact: true,
    auth: false,
    component: Addfields
  },
  
  {
    path: '/translation/:shop/:id/:name/:lang',
    exact: true,
    auth: false,
    component: Translation
  },
  {
    path: '/showtranslation/:shop',
    exact: true,
    auth: false,
    component: ShowTranslationLang
  },
  {
    path: '/fieldsetup/:shop',
    exact: true,
    auth: false,
    component: FieldSetup
  },
  {
    path: '/pagesetup/:shop',
    exact: true,
    auth: false,
    component: PageSetup
  },
  {
    path: '/plan/:shop',
    exact: true,
    auth: false,
    component: Plan
  },
 
  
];

export default routes;
