import lazyLoad from './router/lazyLoad'
const Home = lazyLoad(() => import(/* webpackChunkName: "Home" */'pages/home/index.js'));
///------------------增加不同页面处-------------------////

const config = [{
  url: '/',
  component: Home
}]
const router = config.map(item => ({
  url: item.url,
  component: item.component
}))
export {
  router
}
