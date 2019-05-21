import React from 'react'
import { BrowserRouter, Switch, Route, IndexRoute, Redirect } from 'react-router-dom'

import Index from './app'
// import Manage from 'pages/manage/index/index.js'
import { router as routerConfig } from './pages'
import lazyLoad from './router/lazyLoad'
import { hot } from 'react-hot-loader'
// import {browserHistory} from 'react-router'

import { Provider } from 'react-redux';
import store from './redux/store';

// const store = configureStore();

// import Home from 'pages/home/'

const Home = lazyLoad(() => import(/* webpackChunkName: "Home" */'pages/home/index.js'));

function onChangeRoute(prevState, nextState, replace){
      // console.log("@@@@@@@", nextState)
}


export function getRouters(history) {
  // const getComponent = (content) => {
  //   return (props) => <App content={content} role={role} location={props.location} />
  // }

  let routeList = routerConfig
    .map((item, index) =>
      <Route path={ item.url } key={index} component={ item.component }/>
    )

  // routeList = [<IndexRoute key={-1} component={Home}/>].concat(routeList)

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch history={history}>
            <Route exact path="/" component={Index} onChange={onChangeRoute.bind(this)}>
                { routeList }
            </Route>
        </Switch>
      </BrowserRouter>
    </Provider>
  )
}
