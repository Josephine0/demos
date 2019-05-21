import React from 'react';
import Bundle from './Bundle';
const Loading = () => <div style={{textAlign:'center',fontSize: 25}}>加载中，请稍后...</div>;

/*
   包装方法，第一次调用后会返回一个组件
   由于要将其作为路由下的组件，所以需要将 props 传入
*/
const lazyLoad = loadComponent => props => (
   <Bundle load={loadComponent}>
      {Comp => (Comp ? <Comp {...props} /> : <Loading />)}
   </Bundle>
);

export default lazyLoad;
