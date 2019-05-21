import React from 'react';

export default class Bundle extends React.Component {
   state = {
      mod: null
   };

   componentWillMount() {
      this.load(this.props);
   }
   componentWillReceiveProps(nextProps) {
      if (nextProps.load !== this.props.load) {
         this.load(nextProps);
      }
   }

   async load(props) {
      // 初始化
      this.setState({
         mod: null
      });

      // 异步获取组件
      let mod = await props.load();

      this.setState({
         mod: mod.default ? mod.default : mod
      });
   }

   render() {
      // 更新子组件，但只包含一个父节点
      return this.state.mod ? this.props.children(this.state.mod) : null;
   }
}
